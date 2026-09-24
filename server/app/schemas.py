from pydantic import BaseModel
from datetime import datetime
from typing import Optional

#this is what react sends to POST /api/tests
class TestCreate(BaseModel):
    wpm: float
    rwpm:Optional[float] = None
    accuracy: float
    duration: int

#this is what fast api returns back to the React
class TestResponse(TestCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username:str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None