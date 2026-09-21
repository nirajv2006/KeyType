from sqlalchemy import Column, Integer, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class TypingTest(Base):
    __tablename__ = "typing_tests"

    id = Column(Integer, primary_key=True, index=True)
    wpm = Column(Float , nullable=False)
    rwpm = Column(Float, nullable=True)
    accuracy = Column(Float, nullable=False)
    duration = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())