# BizBot - Project State

## Project Goal
**BizBot** is an embeddable AI customer-support chatbot that small businesses can easily integrate into their websites. It is trained on business-specific context (FAQs, business hours, policies, products, and contact info) provided by the business owner to deliver accurate, real-time customer assistance.

---

## Tech Stack
- **Backend**:
  - Python 3.12
  - FastAPI
  - Uvicorn (ASGI server)
  - `google-generativeai` (Gemini API SDK with model fallback)
  - `python-dotenv`, `python-multipart`, `pydantic`
- **Frontend**:
  - Next.js (App Router)
  - TypeScript
  - Tailwind CSS
  - React
- **Version Control & DevOps**:
  - Git & GitHub CLI (`gh`)

---

## Progress Log

### Step 1: Project Skeleton (Completed: November 19, 2026)
- [x] Initialized project repository `bizbot`.
- [x] Set up `backend/` with Python virtual environment (`venv`).
- [x] Created `backend/requirements.txt` containing FastAPI, Uvicorn, python-dotenv, google-generativeai, and python-multipart.
- [x] Created `backend/app.py` with FastAPI, CORS enabled, and `GET /health` returning `{"status": "ok"}`.
- [x] Configured `backend/.env` with placeholder `GEMINI_API_KEY=your_key_here`.
- [x] Set up `.gitignore` rules for `venv/`, `.env`, `__pycache__/`, `node_modules/`, and `.next/`.
- [x] Created `frontend/` using Next.js + Tailwind CSS + TypeScript (`create-next-app`).
- [x] Verified local execution:
  - Backend health check: `http://127.0.0.1:8000/health` -> `{"status": "ok"}`
  - Frontend dev server: `http://localhost:3000` -> HTTP `200`
- [x] Created initial git commit and pushed to GitHub repository under `tirthm2538-beep/bizbot`.

### Step 2: Core Chatbot Engine (Completed: November 19, 2026)
- [x] Implemented `POST /train` endpoint:
  - Accepts business plain text info and business name (with optional custom `business_id`).
  - Automatically generates URL-safe slugs and saves metadata to `backend/data/<business_id>.json`.
- [x] Implemented `POST /chat` endpoint:
  - Accepts `business_id` and customer `question`.
  - Loads saved business knowledge context from `backend/data/<business_id>.json`.
  - Queries Google Gemini API with grounded system prompt directing the AI to answer exclusively using provided business information.
  - Implemented resilient model fallback cascade (`gemini-3.5-flash-lite`, `gemini-3.1-flash-lite-preview`, `gemini-3.8-flash`, `gemini-flash-latest`) to withstand free-tier RPM limits.
- [x] Robust error handling:
  - HTTP 404 for un-trained or missing `business_id`.
  - HTTP 400 for empty questions or invalid payloads.
  - HTTP 500 / 502 for missing API credentials or upstream model issues.
- [x] Live End-to-End Testing:
  - Trained fake business `SunnyBrew Cafe & Bakery` (`sunnybrew-cafe`).
  - Tested 3 distinct live queries:
    1. Answerable query: operating hours & oat milk availability.
    2. Out-of-bounds query: retail matcha tins and open mic nights (polite fallback to direct contact).
    3. Multi-policy reasoning query: returning unopened retail mugs vs. warm croissants.
