# backend/schemas.py
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# --- Authentication ---
class StudentProfile(BaseModel):
    age: Optional[int] = None
    school: Optional[str] = None
    grade: Optional[str] = None

class SignupRequest(BaseModel):
    role: str  # student, teacher, or parent
    fullName: str
    email: str
    password: str
    studentProfile: Optional[StudentProfile] = None
    teacherProfile: Optional[Dict[str, Any]] = None
    parentProfile: Optional[Dict[str, Any]] = None

class UserBase(BaseModel):
    id: str
    role: str
    fullName: str
    email: Optional[str] = None
    assessmentCompleted: bool = False
    defaultRoute: Optional[str] = None

class AuthResponse(BaseModel):
    user: UserBase
    token: str
    refreshToken: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

# --- Assessment ---
class AssessmentSubmission(BaseModel):
    studentId: str
    answers: Dict[str, str]
    computedProfile: Optional[str] = None
    completedAt: str

class PersonalizationMeta(BaseModel):
    title: str
    description: str
    recommendedBreakIntervalMinutes: int

class AssessmentResponse(BaseModel):
    assessmentId: str
    profile: str
    personalization: PersonalizationMeta
    completedAt: Optional[str] = None

# --- Student Dashboard ---
class LearningProfile(BaseModel):
    code: str
    title: str
    description: str

class StudentSummary(BaseModel):
    fullName: str
    xp: int
    streakDays: int
    learningProfile: LearningProfile
    featuredLessonId: str

class LessonCard(BaseModel):
    id: str
    title: str
    subject: str
    status: str # in-progress, completed, new
    progressPercent: int
    xpReward: int
    durationMinutes: int

class Slide(BaseModel):
    type: str # intro, content, visual, interactive, quiz, summary
    title: str
    content: Optional[str] = None
    visual: Optional[str] = None
    question: Optional[Dict[str, Any]] = None

class LessonDetail(BaseModel):
    id: str
    title: str
    subject: str
    xpReward: int
    profile: str
    slides: List[Slide]

class ProgressUpdate(BaseModel):
    currentSlide: int
    progressPercent: int

class LessonCompletion(BaseModel):
    score: int
    maxScore: int
    xpEarned: int
    timeSpentMinutes: int

# --- Teacher ---
class TeacherSummaryStats(BaseModel):
    totalStudents: int
    avgProgressPercent: int
    activeLessons: int
    completionRatePercent: int

class StudentInClass(BaseModel):
    id: str
    name: str
    profile: str
    progressPercent: int
    lessonsCompleted: int
    totalLessons: int
    lastActive: str

class ClassOverview(BaseModel):
    summary: TeacherSummaryStats
    students: List[StudentInClass]

class CreateLessonRequest(BaseModel):
    title: str
    subject: str
    content: str

class CreateLessonResponse(BaseModel):
    lessonId: str
    personalizationJobId: str
    status: str

# --- Connections ---
class InviteRequest(BaseModel):
    inviterId: str
    inviterRole: str
    inviteeEmail: str
    inviteeRole: str

class InviteResponse(BaseModel):
    inviteId: str
    status: str