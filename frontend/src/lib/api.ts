// src/lib/api.ts
export interface Document {
  id: number;
  filename: string;
  file_path: string;
  upload_date: string;
  content_hash: string;
}

export interface QuestionRequest {
  document_id: number;
  question: string;
}

export interface AnswerResponse {
  answer: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ask-your-pdf-qejl.onrender.com/api";

export const api = {
  async uploadDocument(file: File): Promise<Document> {
      const formData = new FormData();
      formData.append('file', file);

      try {
          const response = await fetch(`${API_BASE_URL}/upload/`, {
              method: 'POST',
              body: formData,
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.detail || 'Failed to upload document');
          }

          return response.json();
      } catch (error) {
          console.error('Upload error:', error);
          throw error;
      }
  },

  async getDocuments(): Promise<Document[]> {
      // Note: You'll need to add this endpoint to your backend
      // For now, this will return an empty array since the backend doesn't have this endpoint
      return [];
  },

  async askQuestion(document_id: number, question: string): Promise<AnswerResponse> {
      try {
          const response = await fetch(`${API_BASE_URL}/question/`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  document_id,
                  question,
              }),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.detail || 'Failed to get answer');
          }

          return response.json();
      } catch (error) {
          console.error('Question error:', error);
          throw error;
      }
  },
};