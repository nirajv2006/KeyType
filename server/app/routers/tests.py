from fastapi import FastAPI, Depends, APIRouter, HTTPException, status
from  database import session,engine,get_db
from models import TypingTest
from schemas import TestCreate, TestResponse
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/api/tests",
    tags=["Typing Tests"]
)

@router.post("",response_model=TestResponse, status_code=status.HTTP_201_CREATED)
def create_typing_test(test_data: TestCreate, db: Session = Depends(get_db)):
    new_test=TypingTest(**test_data.model_dump())
    db.add(new_test)
    db.commit()
    db.refresh(new_test)
    return new_test