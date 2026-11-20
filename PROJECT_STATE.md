# BizBot - Project State

## Status: COMPLETE & FULLY OPERATIONAL 🚀
**Last Updated:** November 19, 2026

---

## Live Production URLs

### 🌐 Frontend (Vercel)
- **Live URL:** `https://bizbot-mocha.vercel.app`
- **Home / Landing Page:** `https://bizbot-mocha.vercel.app/`
- **Business Owner Training Portal:** `https://bizbot-mocha.vercel.app/train` (also aliases `/dashboard`)
- **Customer Chat Widget (Demo Cafe):** `https://bizbot-mocha.vercel.app/chat/sunnybrew-cafe`
- **Environment Variable (`NEXT_PUBLIC_API_URL`):** Configured to `https://bizbot-1-aah6.onrender.com`

### ⚙️ Backend API (Render)
- **Live Base URL:** `https://bizbot-1-aah6.onrender.com`
- **Health Check:** `https://bizbot-1-aah6.onrender.com/health`
- **Interactive OpenAPI Docs:** `https://bizbot-1-aah6.onrender.com/docs`
- **Train Endpoint:** `POST https://bizbot-1-aah6.onrender.com/train`
- **Chat Endpoint:** `POST https://bizbot-1-aah6.onrender.com/chat`
- **Business Metadata Endpoint:** `GET https://bizbot-1-aah6.onrender.com/business/{business_id}`

### 📦 GitHub Repository
- **Remote:** `https://github.com/tirthm2538-beep/bizbot`
- **Branch:** `main`

---

## Project Goal
**BizBot** is an embeddable AI customer-support chatbot that small businesses can easily integrate into their websites. It is trained on business-specific context (FAQs, business hours, policies, products, and contact info) provided by the business owner to deliver accurate, real-time customer assistance.

---

## Tech Stack
- **Backend**:
  - Python 3.12
  - FastAPI
  - Uvicorn (ASGI server)
  - `google-generativeai` (Gemini API SDK with model fallback cascade)
  - `python-dotenv`, `python-multipart`, `pydantic`
  - Hosted on **Render**
- **Frontend**:
  - Next.js 16 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS v4
  - `lucide-react` (Modern icons)
  - Hosted on **Vercel**
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

### Step 3: Frontend Implementation (Completed: November 19, 2026)
- [x] Business Owner Portal (`/train` and `/dashboard`):
  - Form with business name, custom ID slug, and knowledge base textarea.
  - One-click "Load Sample Cafe Info" button to instantly populate realistic cafe context.
  - Connects to `POST /train` with loading states and error notifications.
  - Post-training success card displaying direct shareable customer URL, one-click copy button, direct test button, and ready-to-use HTML `<iframe>` embed snippet.
- [x] Customer Chat View (`/chat/[business_id]`):
  - Dedicated chat widget styled with Tailwind CSS.
  - Dynamic header with business name, active online status badge, and bot icon.
  - Rounded message bubbles, timestamps, typing indicators (`...`), and auto-scroll to latest message.
  - Pre-built quick suggestion chips for hours, menu, and return policies.
  - Graceful 404 state when visiting an unregistered business ID, linking back to the training portal.
- [x] SaaS Home & Landing Page (`/`):
  - Hero section highlighting BizBot's value proposition with CTA buttons to "Train My Business Bot" and "Try Demo: SunnyBrew Cafe".
  - 3-step breakdown explaining raw text ingestion, AI training, and embed code generation.

### Step 4: Live Deployment (Completed: November 19, 2026)
- [x] Backend deployed and live on Render: `https://bizbot-1-aah6.onrender.com`
- [x] Frontend deployed and live on Vercel: `https://bizbot-mocha.vercel.app`
- [x] Configured `NEXT_PUBLIC_API_URL` to point to the live Render backend.
- [x] Production status, live public endpoints, and codebase synced to GitHub repository.

### Step 5: Fix Double Slash API Routing Bug (Completed: November 20, 2026)
- [x] Diagnosed double-slash bug causing `404 Not Found` when requesting `https://bizbot-1-aah6.onrender.com//train`.
- [x] Updated frontend codebase (`train/page.tsx` and `chat/[business_id]/page.tsx`) to sanitize `NEXT_PUBLIC_API_URL` with `.replace(/\/+$/, "")` before constructing request URLs.
- [x] Pushed commit `123a73e` to GitHub `main`, triggering production redeployment on Vercel.
- [x] Verified live deployment on `https://bizbot-mocha.vercel.app`:
  - `POST /train` now executes at `https://bizbot-1-aah6.onrender.com/train` with HTTP `200 OK` (success card renders).
  - Chat queries execute at `https://bizbot-1-aah6.onrender.com/chat` with HTTP `200 OK`.

### Step 6: Fix Mid-Word Text Wrapping Bug in Chat Bubbles (Completed: November 20, 2026)
- [x] Resolved mid-character word breaking (e.g. "8:00 AM" splitting into "8:0" / "0 AM"):
  - Enforced `word-break: normal` and `overflow-wrap: break-word` alongside `white-space: pre-wrap` on the message bubble container in `chat/[business_id]/page.tsx`.
  - Added text normalization (`cleanMessageText`) to eliminate unexpected line breaks inside numbers, times, and line endings (`\r\n`).
  - Added markdown bold formatting support (`renderMessageContent`) to cleanly render `**...**` spans without raw asterisks.
- [x] Committed and pushed changes to GitHub `main` (`57645a8`), deployed live to Vercel.
