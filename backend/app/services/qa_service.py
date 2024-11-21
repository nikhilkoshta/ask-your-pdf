from langchain_community.llms.huggingface_hub import HuggingFaceHub
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate
from langchain.schema.vectorstore import VectorStore
from ..config import settings

class QAService:
    @staticmethod
    def create_qa_chain(vector_store: VectorStore) -> ConversationalRetrievalChain:
        """
        Creates a ConversationalRetrievalChain with Hugging Face model and buffer memory,
        ensuring the output key is explicitly set to handle multiple outputs.
        """
        llm = HuggingFaceHub(
            repo_id="google/flan-t5-large",
            huggingfacehub_api_token=settings.HUGGINGFACE_API_TOKEN,
            model_kwargs={
                "temperature": 0.7,  # Slightly higher to encourage more detailed responses
                "max_length": 1024,  # Increase max length for more comprehensive answers
                "truncation": False
            }
        )

        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"  # Specify the key to store in memory
        )

        prompt = PromptTemplate(
            template=(
                "You are a helpful assistant trained to answer questions based on the uploaded PDF.\n\n"
                "Context: {context}\n\n"
                "Question: {question}\n\n"
                "Provide a comprehensive and detailed answer. Explain the concept thoroughly, including key points, examples, and relevant details:"
            ),
            input_variables=["context", "question"]
        )

        retriever = vector_store.as_retriever()

        qa_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=retriever,
            memory=memory,
            return_source_documents=True,  # Include source docs in output if needed
            verbose=True
        )

        return qa_chain
