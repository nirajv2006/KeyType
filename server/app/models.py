from sqlalchemy import Column, Integer, Float, DateTime, String, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer,primary_key = True, index = True)
    username=Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String,nullable=True)
    tests=relationship("TypingTest",back_populates="owner")

class TypingTest(Base):
    __tablename__ = "typing_tests"

    id = Column(Integer, primary_key=True, index=True)
    wpm = Column(Float , nullable=False)
    rwpm = Column(Float, nullable=True)
    accuracy = Column(Float, nullable=False)
    duration = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    owner = relationship("User", back_populates="tests")
