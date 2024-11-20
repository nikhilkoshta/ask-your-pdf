# app/models/models.py
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from ..database import Base

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_path = Column(String)
    upload_date = Column(DateTime, default=datetime.now)
    content_hash = Column(String, unique=True)
