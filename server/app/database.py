from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import create_engine 
from app.config import settings

engine = create_engine(settings.DATABASE_URL)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

Base = declarative_base()