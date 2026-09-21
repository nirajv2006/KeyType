from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import session, engine
from sqlalchemy.orm import Session
import schemas
import json
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

#The two functions below is used for generating random words for target text
with open("words.json","r") as f:
    WORD_POOL = json.load(f)

@app.get('/api/words')
def get_words(count : int = 125):
    selected_words = random.choices(WORD_POOL, k = count)
    return {"text": " ".join(selected_words)}

#to check whether it was running or no
@app.get("/")
def home():
    return {"status": "FastAPI Server Running"}
