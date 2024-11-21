# app/config.py
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./pdf_chat.db"  # Fallback to SQLite if no PostgreSQL URL
    )
    HUGGINGFACE_API_TOKEN: str = os.getenv("HUGGINGFACE_API_TOKEN")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    
    class Config:
        env_file = ".env"

settings = Settings()