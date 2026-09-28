from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db
from models import TypingTest, User
from schemas import TestCreate, TestResponse
from sqlalchemy.orm import Session
from auth_utils import get_current_user_optional

router = APIRouter(
    prefix="/api/tests",
    tags=["Typing Tests"]
)

@router.post("", response_model=TestResponse, status_code=status.HTTP_201_CREATED)
def create_typing_test(
    test_data: TestCreate,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional)
):
    test_dict = test_data.model_dump()
    if current_user:
        test_dict["user_id"] = current_user.id
    new_test = TypingTest(**test_dict)
    db.add(new_test)
    db.commit()
    db.refresh(new_test)
    return new_test