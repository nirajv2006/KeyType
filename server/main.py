from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

# Allow your React frontend (Vite defaults to http://localhost:5173) to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample English word list for your typing test
WORD_POOL = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
    "react", "fastapi", "python", "code", "speed", "accuracy", "keyboard",
    "system", "logic", "focus", "state", "effect", "render", "build"
]

@app.get("/")
def home():
    return {"status": "FastAPI Server Running"}

@app.get("/api/words")
def get_words(count: int = 50):
    """Returns a randomized list of words for the typing test."""
    shuffled_words = random.choices(WORD_POOL, k=count)
    return {"words": " ".join(shuffled_words)}