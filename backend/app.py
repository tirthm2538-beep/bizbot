import os
import re
import json
import logging
from datetime import datetime
from typing import Optional, List
from pathlib import Path

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import google.generativeai as genai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bizbot")

# Load environment variables
load_dotenv()

# Setup paths
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Candidate models in order of preference
MODELS_TO_TRY: List[str] = [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite-preview",
    "gemini-3.8-flash",
    "gemini-flash-latest",
]

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY and GEMINI_API_KEY != "your_key_here":
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(
    title="BizBot API",
    description="Embeddable AI customer-support chatbot engine for small businesses",
    version="1.1.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def slugify(text: str) -> str:
    """Convert text into a safe filename/ID slug."""
    text = text.lower().strip()
    slug = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return slug or "business"


# Request / Response Schemas
class TrainRequest(BaseModel):
    business_name: str = Field(..., min_length=1, description="Name of the business")
    info: str = Field(..., min_length=1, description="Business info: FAQs, hours, policies, products, etc.")
    business_id: Optional[str] = Field(None, description="Optional custom business ID slug")


class ChatRequest(BaseModel):
    business_id: str = Field(..., min_length=1, description="Unique ID of the trained business")
    question: str = Field(..., min_length=1, description="Customer question")


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/train", status_code=status.HTTP_200_OK)
def train_business(payload: TrainRequest):
    business_name = payload.business_name.strip()
    info = payload.info.strip()

    if not business_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Business name cannot be empty.")
    if not info:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Business info cannot be empty.")

    # Determine business_id
    if payload.business_id and payload.business_id.strip():
        biz_id = slugify(payload.business_id)
    else:
        biz_id = slugify(business_name)

    data_file = DATA_DIR / f"{biz_id}.json"

    record = {
        "business_id": biz_id,
        "business_name": business_name,
        "info": info,
        "updated_at": datetime.utcnow().isoformat(),
    }

    try:
        with open(data_file, "w", encoding="utf-8") as f:
            json.dump(record, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Failed to store business info: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to store business info: {str(e)}",
        )

    return {
        "status": "success",
        "message": f"Successfully trained knowledge base for '{business_name}'.",
        "business_id": biz_id,
        "business_name": business_name,
        "char_count": len(info),
    }


@app.post("/chat", status_code=status.HTTP_200_OK)
def chat_with_bot(payload: ChatRequest):
    business_id = slugify(payload.business_id)
    question = payload.question.strip()

    if not question:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Question cannot be empty.")

    data_file = DATA_DIR / f"{business_id}.json"
    if not data_file.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No business found for ID '{business_id}'. Please train this business first via POST /train.",
        )

    try:
        with open(data_file, "r", encoding="utf-8") as f:
            biz_data = json.load(f)
    except Exception as e:
        logger.error(f"Failed to read business info: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read business info: {str(e)}",
        )

    business_name = biz_data.get("business_name", "the business")
    stored_info = biz_data.get("info", "")

    # Check API key
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_key_here":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GEMINI_API_KEY is missing or invalid in server environment.",
        )

    # Prompt design
    prompt = (
        f"You are a helpful customer support assistant for {business_name}. "
        f"Only answer using the information provided below. If the answer isn't in the info, "
        f"say you don't have that information and suggest contacting the business directly.\n\n"
        f"Business info:\n{stored_info}\n\n"
        f"Customer question:\n{question}"
    )

    last_error = None
    genai.configure(api_key=api_key)

    for model_name in MODELS_TO_TRY:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            answer = response.text.strip() if response.text else "Sorry, I could not generate an answer at this time."
            return {
                "business_id": business_id,
                "business_name": business_name,
                "question": question,
                "answer": answer,
                "model_used": model_name,
            }
        except Exception as e:
            logger.warning(f"Model {model_name} failed: {e}. Trying next fallback...")
            last_error = e

    raise HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail=f"AI service error across available models: {str(last_error)}",
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
