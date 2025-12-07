import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Configure API Key
api_key = os.getenv("GEMINI_API_KEY")

model = None
if api_key and api_key.strip():
    genai.configure(api_key=api_key)  # type: ignore[attr-defined]
    try:
        model = genai.GenerativeModel('gemini-2.5-pro')  # type: ignore[attr-defined]
    except Exception as exc:
        raise RuntimeError("Failed to initialize Gemini model") from exc
else:
    print("WARNING: GEMINI_API_KEY not found; AI generation features are disabled.")


def _ensure_model():
    if model is None:
        raise RuntimeError("Gemini model is not configured. Set GEMINI_API_KEY before calling AI helpers.")
    return model

def generate_lesson_content(topic: str, subject: str, raw_content: str, profile_type: str):
    """
    Generates a list of slides customized for a specific learning profile.
    """
    prompt = f"""
    You are an expert educational content creator for the Nevo app.
    Create a 5-slide micro-lesson for a Student with a '{profile_type}' learning style.
    
    Topic: {topic}
    Subject: {subject}
    Source Material: {raw_content}
    
    The output must be strictly valid JSON. Do not use Markdown code blocks.
    Structure:
    [
      {{
        "type": "visual", (or 'intro', 'content', 'interactive', 'quiz')
        "title": "Slide Title",
        "content": "Explanation text",
        "visual": "Description of an image or emoji representation",
        "question": {{ "text": "...", "options": [], "correct": 0 }} (only for quiz/interactive)
      }}
    ]
    """
    
    model_ref = _ensure_model()
    try:
        response = model_ref.generate_content(prompt)
        # Clean response if Gemini adds markdown blocks
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"AI Generation Error: {e}")
        # Fallback simple slide if AI fails
        return [{
            "type": "intro", 
            "title": "Error Generating Content", 
            "content": "Please try again later."
        }]

def generate_parent_guidance(child_name: str, profile: str, recent_progress: dict):
    """
    Generates advice for parents based on child's activity.
    """
    prompt = f"""
    Generate parent guidance for a child named {child_name} who is a '{profile}' learner.
    Recent activity: {json.dumps(recent_progress)}
    
    Return strict JSON:
    {{
      "recommendations": ["tip 1", "tip 2"],
      "encouragementTips": ["phrase 1", "phrase 2"]
    }}
    """
    model_ref = _ensure_model()
    try:
        response = model_ref.generate_content(prompt)
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except Exception as e:
        return {"recommendations": ["Check back later"], "encouragementTips": ["Keep supporting them!"]}