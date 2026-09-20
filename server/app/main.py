from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from models import users
from database import session, engine
from sqlalchemy.orm import Session
import schemas
import random

app = FastAPI()

schemas.Base.metadata.create_all(bind=engine)

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
    "the", "be", "of", "and", "a", "to", "in", "he", "have", "it",
    "that", "for", "they", "with", "as", "not", "on", "she", "at", "by",
    "this", "we", "you", "do", "but", "from", "or", "which", "one", "would",
    "all", "will", "there", "say", "who", "make", "when", "can", "more", "if",
    "no", "man", "out", "other", "so", "what", "time", "up", "go", "about",
    "than", "into", "could", "state", "only", "new", "year", "some", "take", "come",
    "these", "know", "see", "use", "get", "like", "then", "first", "any", "work",
    "now", "may", "such", "give", "over", "think", "most", "even", "find", "day",
    "also", "after", "way", "many", "must", "look", "before", "great", "back", "through",
    "long", "where", "much", "should", "well", "people", "down", "own", "just", "because"
]


user_def = [
    users(id=1 , username="Test1", email="test1@gmail.com"),
    users(id=2 , username="Test2", email="test2@gmail.com"),
    users(id=3 , username="Test3", email="test3@gmail.com"),
    users(id=4 , username="Test4", email="test4@gmail.com"),
]

@app.get('/api/words')
def get_words(count : int = 125):
    selected_words = random.choices(WORD_POOL, k = count)
    return {"text": " ".join(selected_words)}

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

def init_db():
    db = session()
    count = db.query(schemas.users).count()
    if count == 0:
        for user in user_def:
            db.add(schemas.users(**user.model_dump()))
        db.commit()

init_db()

@app.get("/")
def home():
    return {"status": "FastAPI Server Running"}


@app.get('/user')
def get_all_user(db: Session = Depends(get_db)):
    db_users = db.query(schemas.users).all()
    return db_users

#Fetching a single user 
@app.get("/user/{id}")
def fetch_user(id: int):
    for u in user_def:
        if u.id == id:
            return u
    return "User Not Found"

@app.post('/user')
def insert_user(user : users , db: Session = Depends(get_db)):
    db.add(schemas.users(**user.model_dump()))
    db.commit()
    return user

@app.put('/user')
def update_user(id:int, user: users , db: Session = Depends(get_db)):
    db_user = db.query(schemas.users).filter(schemas.users.id == id).first()
    if db_user:
        db_user.name = user.name
        db_user.email = user.email
        db.commit()
    else:
        return "No product found"

@app.delete('/user')
def delete_user(id: int):
    for i in range(len(user_def)):
        if(user_def[i].id == id):
            del user_def[i]
            return "Product deleted"
    return "product not found"