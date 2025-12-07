from fastapi import FastAPI, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import schemas
import ai_service
from database import db, fix_id
from auth import get_password_hash, verify_password, create_access_token
from bson import ObjectId
from datetime import datetime

app = FastAPI(title="Nevo API - MongoDB + Gemini")

# CORS
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. AUTHENTICATION (Custom JWT) ---

@app.post("/auth/signup", response_model=schemas.AuthResponse)
async def signup(request: schemas.SignupRequest):
    # Check if user exists
    existing_user = await db.users.find_one({"email": request.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_pw = get_password_hash(request.password)

    user_doc = {
        "email": request.email,
        "hashed_password": hashed_pw,
        "role": request.role,
        "fullName": request.fullName,
        "assessmentCompleted": False,
        "xp": 0,
        "streak": 0,
        "studentProfile": request.studentProfile.dict() if request.studentProfile else None,
        "teacherProfile": request.teacherProfile,
        "created_at": datetime.utcnow()
    }

    new_user = await db.users.insert_one(user_doc)
    created_user = await db.users.find_one({"_id": new_user.inserted_id})
    
    if not created_user:
        raise HTTPException(status_code=500, detail="Failed to create user")
    
    # Generate Token
    token = create_access_token({"sub": str(created_user["_id"]), "role": created_user["role"]})

    return {
        "user": fix_id(created_user),
        "token": token
    }

@app.post("/auth/login", response_model=schemas.AuthResponse)
async def login(request: schemas.LoginRequest):
    user = await db.users.find_one({"email": request.email})
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user["_id"]), "role": user["role"]})
    
    # Add default route logic
    user["defaultRoute"] = "/teacher/dashboard" if user["role"] == "teacher" else "/student/dashboard"

    return {
        "user": fix_id(user),
        "token": token
    }

# --- 2. ASSESSMENT ---

@app.post("/assessments", response_model=schemas.AssessmentResponse)
async def submit_assessment(submission: schemas.AssessmentSubmission):
    # 1. Store Assessment
    assessment_doc = {
        "studentId": submission.studentId,
        "answers": submission.answers,
        "computedProfile": submission.computedProfile,
        "personalization": {
            "title": f"{submission.computedProfile} Learner",
            "description": "Customized by AI for your style.",
            "recommendedBreakIntervalMinutes": 15
        },
        "completedAt": datetime.utcnow()
    }
    
    new_asm = await db.assessments.insert_one(assessment_doc)
    
    # 2. Update User Profile
    await db.users.update_one(
        {"_id": ObjectId(submission.studentId)},
        {"$set": {"assessmentCompleted": True, "learningProfileCode": submission.computedProfile}}
    )

    return {
        "assessmentId": str(new_asm.inserted_id),
        "profile": submission.computedProfile,
        "personalization": assessment_doc["personalization"],
        "completedAt": str(assessment_doc["completedAt"])
    }

@app.get("/students/{student_id}/assessment")
async def get_assessment(student_id: str):
    # Find latest assessment
    asm = await db.assessments.find_one(
        {"studentId": student_id},
        sort=[("completedAt", -1)]
    )
    if not asm:
        raise HTTPException(status_code=404, detail="No assessment found")
    return fix_id(asm)

# --- 3. TEACHER (AI Lesson Gen) ---

@app.post("/teachers/{teacher_id}/lessons", response_model=schemas.CreateLessonResponse)
async def upload_lesson(teacher_id: str, lesson: schemas.CreateLessonRequest):
    # 1. Generate Content via Gemini
    # Note: In a real app, use BackgroundTasks for this to avoid blocking
    visual_slides = ai_service.generate_lesson_content(lesson.title, lesson.subject, lesson.content, "Visual")
    text_slides = ai_service.generate_lesson_content(lesson.title, lesson.subject, lesson.content, "Read/Write")

    # 2. Create Lesson Document (With embedded variants for MongoDB efficiency)
    lesson_doc = {
        "teacherId": teacher_id,
        "title": lesson.title,
        "subject": lesson.subject,
        "content": lesson.content,
        "status": "ready",
        "xpReward": 50,
        "durationMinutes": 15,
        "created_at": datetime.utcnow(),
        "variants": {
            "Visual": visual_slides,
            "Read/Write": text_slides
        }
    }

    new_lesson = await db.lessons.insert_one(lesson_doc)

    return {
        "lessonId": str(new_lesson.inserted_id),
        "personalizationJobId": "done",
        "status": "ready"
    }

@app.get("/teachers/{teacher_id}/class")
async def get_class_overview(teacher_id: str):
    # Simple aggregation example
    student_count = await db.users.count_documents({"role": "student"})
    
    return {
        "summary": {
            "totalStudents": student_count,
            "avgProgressPercent": 45,
            "activeLessons": await db.lessons.count_documents({"teacherId": teacher_id}),
            "completionRatePercent": 60
        },
        "students": [] # Populate with real query if needed
    }

# --- 4. STUDENT ---

@app.get("/lessons/{lesson_id}", response_model=schemas.LessonDetail)
async def get_lesson_detail(lesson_id: str, profile: str = "Visual"):
    try:
        lid = ObjectId(lesson_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    lesson = await db.lessons.find_one({"_id": lid})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Pick the variant based on profile, fallback to first available
    variants = lesson.get("variants", {})
    
    # Simple matching logic
    selected_slides = []
    if profile in variants:
        selected_slides = variants[profile]
    elif "Visual" in variants:
        selected_slides = variants["Visual"]
    else:
        # Fallback if structure is different
        selected_slides = list(variants.values())[0] if variants else []

    return {
        "id": str(lesson["_id"]),
        "title": lesson["title"],
        "subject": lesson["subject"],
        "xpReward": lesson.get("xpReward", 50),
        "profile": profile,
        "slides": selected_slides
    }

@app.get("/students/{student_id}/lessons", response_model=List[schemas.LessonCard])
async def get_student_lessons(student_id: str):
    # Get all ready lessons
    cursor = db.lessons.find({"status": "ready"})
    lessons = []
    async for l in cursor:
        lessons.append({
            "id": str(l["_id"]),
            "title": l["title"],
            "subject": l["subject"],
            "status": "new",
            "progressPercent": 0,
            "xpReward": l.get("xpReward", 50),
            "durationMinutes": l.get("durationMinutes", 15)
        })
    return lessons

@app.get("/students/{student_id}/summary")
async def get_student_summary(student_id: str):
    try:
        user = await db.users.find_one({"_id": ObjectId(student_id)})
    except:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "fullName": user["fullName"],
        "xp": user.get("xp", 0),
        "streakDays": user.get("streak", 0),
        "learningProfile": {
            "code": user.get("learningProfileCode", "Unknown"),
            "title": f"{user.get('learningProfileCode', 'Unknown')} Learner",
            "description": "Your AI adapted profile"
        },
        "featuredLessonId": "none" 
    }

# --- 5. PARENT (AI) ---

@app.get("/parents/{parent_id}/children/{child_id}/guidance")
async def get_parent_guidance(parent_id: str, child_id: str):
    child = await db.users.find_one({"_id": ObjectId(child_id)})
    if not child:
        raise HTTPException(404, "Child not found")

    # Generate real AI guidance
    ai_advice = ai_service.generate_parent_guidance(
        child["fullName"], child.get("learningProfileCode", "Visual"), {"recent_activity": "High engagement"}
    )
    
    return {
        "profile": child.get("learningProfileCode", "Visual") + " Learner",
        "recommendations": ai_advice.get("recommendations", []),
        "optimalLearningWindows": [{"start": "16:00", "end": "18:00"}],
        "encouragementTips": ai_advice.get("encouragementTips", [])
    }