# Operation Ditwah - Crisis Intelligence Pipeline

Operation Ditwah is a Crisis Intelligence Pipeline built to assist with message classification, logistics planning, budget keeping, and news feed extraction during critical operations.

## Architecture

This project is built using a modern full-stack architecture:
- **Frontend**: [Next.js](https://nextjs.org/) (React 19, TypeScript) with Tailwind CSS, providing a responsive and interactive user interface.
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python) providing robust API endpoints.
- **AI Integration**: Integrates with multiple LLMs (OpenAI, Google GenAI, Groq) via Python for intelligent data processing.

## Features

The pipeline consists of four main intelligent tools:
1. **Message Classifier**: Automatically categorizes incoming messages and intelligence reports.
2. **Logistics Commander**: Helps plan and manage logistics, resources, and supply chains. Supports markdown rendering for rich reports.
3. **Budget Keeper**: Monitors and tracks operational budgets and expenses.
4. **News Feed Extractor**: Extracts and summarizes relevant news and external data sources.

## Getting Started Locally

To run this project locally, you will need to start both the Next.js frontend and the FastAPI backend simultaneously.

### Prerequisites

- Node.js (v18+)
- Python (3.9+)
- Appropriate API keys for AI services (configured in a `.env` file)

### 1. Setup Environment Variables

Copy the example environment file and fill in your actual API keys:

```bash
cp .env.example .env
```

### 2. Run the Backend (FastAPI)

Open a terminal and navigate to the project root:

```bash
# Create a virtual environment (optional but recommended)
python -m venv .venv

# Activate the virtual environment
# On Windows:
.venv\Scripts\activate
# On Unix/macOS:
source .venv/bin/activate

# Install Python dependencies
pip install -r api/requirements.txt

# Start the FastAPI development server
uvicorn api.index:app --reload --port 8000
```
The backend will be accessible at `http://127.0.0.1:8000`.

### 3. Run the Frontend (Next.js)

Open a new terminal and navigate to the project root:

```bash
# Install Node.js dependencies
npm install

# Start the Next.js development server
npm run dev
```

The Next.js app will run on `http://localhost:3000`. API requests to `/api/*` are automatically proxied to the FastAPI backend during local development via Next.js rewrites.

## Deployment

The application is designed to be easily deployed on [Vercel](https://vercel.com). Vercel supports running both the Next.js frontend and the FastAPI backend (as Serverless Functions within the `api/` directory) in a single deployment.
