from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'ruraled_secret_key_2025')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION = 7  # days

# LLM Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer()

# =====================
# MODELS
# =====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    xp: int = 0
    level: int = 1
    badges: List[str] = []
    language: str = "English"

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    token: str
    user: Dict[str, Any]

class Progress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    subject: str
    topic: str
    score: int
    completed: bool = False
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProgressCreate(BaseModel):
    subject: str
    topic: str
    score: int
    completed: bool = False

class Quiz(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    topic: str
    questions: List[Dict[str, Any]]
    score: Optional[int] = None
    completed: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuizCreate(BaseModel):
    topic: str
    num_questions: int = 5

class QuizSubmit(BaseModel):
    quiz_id: str
    answers: List[int]

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    message: str
    response: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    message: str
    language: str = "English"

class TutorRequest(BaseModel):
    topic: str
    language: str = "English"

class LearningModule(BaseModel):
    id: str
    title: str
    subject: str
    description: str
    content: str
    difficulty: str
    estimatedTime: str

# =====================
# HELPER FUNCTIONS
# =====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    expiration = datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRATION)
    payload = {
        "user_id": user_id,
        "exp": expiration
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# =====================
# AUTH ROUTES
# =====================

@api_router.post("/auth/signup", response_model=LoginResponse)
async def signup(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password)
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    # Generate token
    token = create_token(user.id)
    
    return LoginResponse(
        token=token,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "xp": user.xp,
            "level": user.level,
            "badges": user.badges,
            "language": user.language
        }
    )

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"])
    
    return LoginResponse(
        token=token,
        user={
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "xp": user.get("xp", 0),
            "level": user.get("level", 1),
            "badges": user.get("badges", []),
            "language": user.get("language", "English")
        }
    )

@api_router.get("/auth/me")
async def get_me(user_id: str = Depends(get_current_user)):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "xp": user.get("xp", 0),
        "level": user.get("level", 1),
        "badges": user.get("badges", []),
        "language": user.get("language", "English")
    }

# =====================
# AI TUTOR ROUTES
# =====================

@api_router.post("/ai/tutor")
async def generate_lesson(request: TutorRequest, user_id: str = Depends(get_current_user)):
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"tutor_{user_id}_{request.topic}",
            system_message=f"You are an expert educational tutor. Explain topics clearly in {request.language} with examples and diagrams. Use simple language for rural students."
        ).with_model("openai", "gpt-4o-mini")
        
        message = UserMessage(
            text=f"Teach me about '{request.topic}' in {request.language}. Include: 1) Simple explanation 2) Real-world examples 3) Key points to remember. Make it engaging for rural students."
        )
        
        response = await chat.send_message(message)
        
        return {"lesson": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

@api_router.post("/ai/chat")
async def chat_with_ai(request: ChatRequest, user_id: str = Depends(get_current_user)):
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"chat_{user_id}",
            system_message=f"You are a friendly AI learning assistant speaking in {request.language}. Help students understand concepts, answer questions, and encourage learning. Be supportive and clear."
        ).with_model("openai", "gpt-4o-mini")
        
        message = UserMessage(text=request.message)
        response = await chat.send_message(message)
        
        # Save chat history
        chat_msg = ChatMessage(
            user_id=user_id,
            message=request.message,
            response=response
        )
        doc = chat_msg.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.chat_history.insert_one(doc)
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

# =====================
# QUIZ ROUTES
# =====================

@api_router.post("/quiz/generate")
async def generate_quiz(request: QuizCreate, user_id: str = Depends(get_current_user)):
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"quiz_{user_id}_{request.topic}",
            system_message="You are a quiz generator. Create educational MCQ questions in JSON format."
        ).with_model("openai", "gpt-4o-mini")
        
        message = UserMessage(
            text=f"Generate {request.num_questions} multiple-choice questions about '{request.topic}'. Return ONLY a JSON array with this exact format: [{{'question': 'text', 'options': ['A', 'B', 'C', 'D'], 'correct': 0}}]. No other text."
        )
        
        response = await chat.send_message(message)
        
        # Parse JSON from response
        import json
        import re
        json_match = re.search(r'\[.*\]', response, re.DOTALL)
        if json_match:
            questions = json.loads(json_match.group())
        else:
            questions = json.loads(response)
        
        # Save quiz
        quiz = Quiz(
            user_id=user_id,
            topic=request.topic,
            questions=questions
        )
        doc = quiz.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.quizzes.insert_one(doc)
        
        return {"quiz_id": quiz.id, "questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")

@api_router.post("/quiz/submit")
async def submit_quiz(request: QuizSubmit, user_id: str = Depends(get_current_user)):
    quiz = await db.quizzes.find_one({"id": request.quiz_id, "user_id": user_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    questions = quiz["questions"]
    score = sum(1 for i, ans in enumerate(request.answers) if ans == questions[i]["correct"])
    percentage = (score / len(questions)) * 100
    
    # Update quiz
    await db.quizzes.update_one(
        {"id": request.quiz_id},
        {"$set": {"score": score, "completed": True}}
    )
    
    # Add progress
    progress = Progress(
        user_id=user_id,
        subject=quiz["topic"],
        topic=quiz["topic"],
        score=int(percentage),
        completed=True
    )
    doc = progress.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.progress.insert_one(doc)
    
    # Update user XP
    xp_gained = score * 10
    await db.users.update_one(
        {"id": user_id},
        {"$inc": {"xp": xp_gained}}
    )
    
    return {"score": score, "total": len(questions), "percentage": percentage, "xp_gained": xp_gained}

@api_router.get("/quiz/list")
async def list_quizzes(user_id: str = Depends(get_current_user)):
    quizzes = await db.quizzes.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    return {"quizzes": quizzes}

# =====================
# PROGRESS ROUTES
# =====================

@api_router.get("/progress/stats")
async def get_progress_stats(user_id: str = Depends(get_current_user)):
    progress_list = await db.progress.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    
    if not progress_list:
        return {
            "total_completed": 0,
            "average_score": 0,
            "strengths": [],
            "weaknesses": [],
            "weekly_progress": [],
            "subject_scores": {}
        }
    
    # Calculate stats
    total_completed = len([p for p in progress_list if p.get("completed")])
    avg_score = sum(p.get("score", 0) for p in progress_list) / len(progress_list) if progress_list else 0
    
    # Group by subject
    subject_scores = {}
    for p in progress_list:
        subject = p.get("subject", "Unknown")
        if subject not in subject_scores:
            subject_scores[subject] = []
        subject_scores[subject].append(p.get("score", 0))
    
    # Calculate average per subject
    subject_avg = {s: sum(scores) / len(scores) for s, scores in subject_scores.items()}
    
    # Strengths and weaknesses
    strengths = [s for s, avg in subject_avg.items() if avg >= 70]
    weaknesses = [s for s, avg in subject_avg.items() if avg < 70]
    
    # Weekly progress (last 7 days)
    from datetime import timedelta
    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)
    
    weekly_progress = []
    for i in range(7):
        day = week_ago + timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        
        day_progress = [
            p for p in progress_list
            if day_start <= datetime.fromisoformat(p["timestamp"]) < day_end
        ]
        
        avg = sum(p.get("score", 0) for p in day_progress) / len(day_progress) if day_progress else 0
        weekly_progress.append({
            "date": day.strftime("%a"),
            "score": int(avg)
        })
    
    return {
        "total_completed": total_completed,
        "average_score": int(avg_score),
        "strengths": strengths,
        "weaknesses": weaknesses,
        "weekly_progress": weekly_progress,
        "subject_scores": {s: int(avg) for s, avg in subject_avg.items()}
    }

@api_router.post("/progress/add")
async def add_progress(progress_data: ProgressCreate, user_id: str = Depends(get_current_user)):
    progress = Progress(
        user_id=user_id,
        **progress_data.model_dump()
    )
    doc = progress.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.progress.insert_one(doc)
    
    # Add XP
    xp_gained = progress_data.score // 10
    await db.users.update_one(
        {"id": user_id},
        {"$inc": {"xp": xp_gained}}
    )
    
    return {"success": True, "xp_gained": xp_gained}

# =====================
# LEARNING MODULES
# =====================

@api_router.get("/modules/list")
async def list_modules(subject: Optional[str] = None):
    # Sample NCERT-style modules
    modules = [
        {
            "id": "sci-solar",
            "title": "Solar System",
            "subject": "Science",
            "description": "Explore planets, stars, and our solar system with 3D models",
            "difficulty": "Beginner",
            "estimatedTime": "30 mins",
            "content": "The Solar System consists of the Sun and everything that orbits it, including planets, moons, asteroids, and comets."
        },
        {
            "id": "math-fractions",
            "title": "Understanding Fractions",
            "subject": "Mathematics",
            "description": "Learn fractions with visual examples and practice",
            "difficulty": "Beginner",
            "estimatedTime": "25 mins",
            "content": "A fraction represents a part of a whole. It consists of a numerator (top number) and denominator (bottom number)."
        },
        {
            "id": "sci-circuits",
            "title": "Electric Circuits",
            "subject": "Science",
            "description": "Understand electricity and circuits with interactive diagrams",
            "difficulty": "Intermediate",
            "estimatedTime": "40 mins",
            "content": "An electric circuit is a closed path through which electric current flows. It includes a power source, wires, and load."
        },
        {
            "id": "math-algebra",
            "title": "Basic Algebra",
            "subject": "Mathematics",
            "description": "Introduction to variables and equations",
            "difficulty": "Intermediate",
            "estimatedTime": "35 mins",
            "content": "Algebra uses letters to represent numbers in equations. For example: x + 5 = 10, where x = 5."
        },
        {
            "id": "social-india",
            "title": "Geography of India",
            "subject": "Social Studies",
            "description": "Learn about Indian states, rivers, and geography",
            "difficulty": "Beginner",
            "estimatedTime": "30 mins",
            "content": "India is the 7th largest country by area. It has diverse geography including mountains, plains, deserts, and coastal regions."
        },
        {
            "id": "sci-plants",
            "title": "Plant Life Cycle",
            "subject": "Science",
            "description": "Discover how plants grow and reproduce",
            "difficulty": "Beginner",
            "estimatedTime": "20 mins",
            "content": "Plants go through stages: seed, germination, growth, reproduction, and seed dispersal."
        }
    ]
    
    if subject:
        modules = [m for m in modules if m["subject"].lower() == subject.lower()]
    
    return {"modules": modules}

@api_router.get("/modules/{module_id}")
async def get_module(module_id: str):
    # In a real app, fetch from database
    modules = await list_modules()
    module = next((m for m in modules["modules"] if m["id"] == module_id), None)
    
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    return module

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()