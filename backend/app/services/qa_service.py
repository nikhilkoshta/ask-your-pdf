# app/services/qa_service.py
from langchain_community.llms.huggingface_hub import HuggingFaceHub
from langchain.memory import ConversationBufferMemory
from langchain.chains.conversational_retrieval.base import ConversationalRetrievalChain
from ..config import settings
from langchain.schema.vectorstore import VectorStore  # Add this
from langchain.schema.retriever import BaseRetriever  # Add this

class QAService:
    @staticmethod
    def create_qa_chain(vector_store: VectorStore) -> ConversationalRetrievalChain:
        llm: HuggingFaceHub = HuggingFaceHub(
            repo_id="google/flan-t5-large",
            huggingfacehub_api_token=settings.HUGGINGFACE_API_TOKEN,
            model_kwargs={
                "temperature": 0.5,
                "max_length": 512,
                "truncation": True
            }
        )
        
        memory: ConversationBufferMemory = ConversationBufferMemory(
            memory_key='chat_history',
            return_messages=True
        )
        
        retriever: BaseRetriever = vector_store.as_retriever()
        
        qa_chain: ConversationalRetrievalChain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=retriever,
            memory=memory
        )
        
        return qa_chain
