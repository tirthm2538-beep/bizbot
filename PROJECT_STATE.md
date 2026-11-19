# BizBot - Project State

## Project Goal
**BizBot** is an embeddable AI customer-support chatbot that small businesses can easily integrate into their websites. It is trained on business-specific context (FAQs, business hours, policies, products, and contact info) provided by the business owner to deliver accurate, real-time customer assistance.

---

## Tech Stack
- **Backend**:
  - Python 3.12
  - FastAPI
  - Uvicorn (ASGI server)
  - `google-generativeai` (Gemini API SDK)
  - `python-dotenv`, `python-multipart`
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
