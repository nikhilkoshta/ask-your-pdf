from typing import List
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import models
from ..schemas import schemas
from ..services.pdf_service import PDFService
from ..services.qa_service import QAService

router = APIRouter()

@router.get("/documents/", response_model=List[schemas.Document])
async def get_documents(db: Session = Depends(get_db)):
    """
    Retrieve all uploaded documents.
    """
    documents = db.query(models.Document).all()
    return documents

@router.post("/upload/", response_model=schemas.Document)
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_path, content_hash = await PDFService.save_file(file)
    
    # Check if document already exists
    existing_doc = db.query(models.Document).filter(
        models.Document.content_hash == content_hash
    ).first()
    
    if existing_doc:
        return existing_doc
    
    # Create new document record
    db_document = models.Document(
        filename=file.filename,
        file_path=file_path,
        content_hash=content_hash
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document

@router.post("/question/")
async def ask_question(
    question_req: schemas.QuestionRequest,
    db: Session = Depends(get_db)
):
    document = db.query(models.Document).filter(
        models.Document.id == question_req.document_id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Extract text and create vector store
    text = PDFService.extract_text(document.file_path)
    vector_store = PDFService.create_vector_store(text)
    
    # Create QA chain and get response
    qa_chain = QAService.create_qa_chain(vector_store)
    response = qa_chain({"question": question_req.question})
    
    return {"answer": response["answer"]}