# app/services/pdf_service.py
from typing import Tuple, List
import hashlib
from InstructorEmbedding import INSTRUCTOR
import os
from fastapi import UploadFile
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.huggingface import HuggingFaceInstructEmbeddings
from langchain_community.vectorstores.faiss import FAISS
from langchain.schema.vectorstore import VectorStore
from sentence_transformers import SentenceTransformer
from ..config import settings

class PDFService:
    @staticmethod
    async def save_file(file: UploadFile) -> Tuple[str, str]:
        content = await file.read()
        content_hash = hashlib.md5(content).hexdigest()
        
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        file_path = os.path.join(settings.UPLOAD_DIR, f"{content_hash}.pdf")
        
        with open(file_path, "wb") as f:
            f.write(content)
        
        return file_path, content_hash

    @staticmethod
    def extract_text(file_path: str) -> str:
        text = ""
        pdf_reader = PdfReader(file_path)
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text

    @staticmethod
    def create_vector_store(text: str) -> VectorStore:
        text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks: List[str] = text_splitter.split_text(text)
        
        model_kwargs = {'device': 'cpu'}  
        encode_kwargs = {'normalize_embeddings': True}  
        embeddings = HuggingFaceInstructEmbeddings(  
        model_name="hkunlp/instructor-xl",  
        model_kwargs=model_kwargs,  
        encode_kwargs=encode_kwargs  
        )
        vector_store: VectorStore = FAISS.from_texts(texts=chunks, embedding=embeddings)
        
        return vector_store