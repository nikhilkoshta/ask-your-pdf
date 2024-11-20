# app/schemas/schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentBase(BaseModel):
    filename: str

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    file_path: str
    upload_date: datetime
    content_hash: str

    class Config:
        from_attributes = True

class QuestionRequest(BaseModel):
    document_id: int
    question: str
