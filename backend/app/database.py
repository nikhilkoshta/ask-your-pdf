from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy import create_engine
from .config import settings

engine = create_engine(
    settings.DATABASE_URL,
    # Add these for PostgreSQL connection
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=10,
    max_overflow=20
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()