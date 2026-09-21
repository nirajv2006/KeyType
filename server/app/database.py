from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import create_engine 

db_url = "postgresql://postgres:varunniraj@localhost:5432/postgres"
engine = create_engine(db_url)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

Base = declarative_base()