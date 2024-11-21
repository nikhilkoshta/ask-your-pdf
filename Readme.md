# PDF Analyzer

## Project Overview

A full-stack web application that allows users to upload PDF documents and ask AI-powered questions about their content.

## Technologies Used

- **Backend**: FastAPI, Python

- **Frontend**: Next.js, React, TypeScript

- **AI/ML**: LangChain, HuggingFace Transformers

- **Database**: SQLAlchemy with SQLite

- **Styling**: Tailwind CSS

## Prerequisites

- Python 3.9+

- Node.js 18+

- pip

- npm or yarn

## Backend Setup

### 1. Clone the Repository

```bash

git clone <your-repo-url>

cd your-project-directory

```

### 2. Create Virtual Environment

```bash

python -m venv venv

source venv/bin/activate  # On Windows use `venv\Scripts\activate`

```

### 3. Install Backend Dependencies

```bash

pip install -r requirements.txt

```

### 4. Set Environment Variables

Create a `.env` file in the backend directory:

```

DATABASE_URL=sqlite:///./pdf_chat.db

HUGGINGFACE_API_TOKEN=your_huggingface_token

UPLOAD_DIR=./uploads

```

### 5. Run Database Migrations

```bash

# If using Alembic (recommended)

alembic upgrade head

```

### 6. Start Backend Server

```bash

uvicorn app.main:app --reload --port 8000

```

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash

cd frontend

```

### 2. Install Dependencies

```bash

npm install

# or

yarn install

```

### 3. Configure Environment

Create `.env.local`:

```

NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

```

### 4. Start Frontend Development Server

```bash

npm run dev

# or

yarn dev

```

## Application Features

- PDF Document Upload

- AI-Powered Question Answering

- Dark/Light Theme Support

- Responsive Design

## API Endpoints

- `POST /api/upload/`: Upload PDF documents

- `GET /api/documents/`: Retrieve uploaded documents

- `POST /api/question/`: Ask questions about a specific document

## Performance Optimizations

- Chunk-based PDF text processing

- Semantic embeddings

- Conversation memory management

## Deployment Considerations

- Use production-grade WSGI server (Gunicorn)

- Configure proper CORS settings

- Use environment-specific configurations

## Troubleshooting

- Ensure all dependencies are installed

- Check API token for HuggingFace

- Verify Python and Node.js versions

## Contributing

1\. Fork the repository

2\. Create feature branch

3\. Commit changes

4\. Push to branch

5\. Create pull request

## License

[Specify your license, e.g., MIT]