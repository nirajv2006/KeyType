from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.database import session, engine, Base
from sqlalchemy.orm import Session
from app.routers import tests, auth
from app import schemas
import json
import random
from pathlib import Path

from app.config import settings

app = FastAPI()
app.include_router(tests.router)
app.include_router(auth.router)

Base.metadata.create_all(bind=engine)

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load words pool for target text relative to this file
WORDS_FILE = Path(__file__).resolve().parent / "words.json"
with open(WORDS_FILE, "r", encoding="utf-8") as f:
    WORD_POOL = json.load(f)

@app.get('/api/words')
def get_words(count : int = 125):
    selected_words = random.choices(WORD_POOL, k = count)
    return {"text": " ".join(selected_words)}


#to check whether it was running or no
@app.get("/")
def home():
    return {"status": "FastAPI Server Running"}

