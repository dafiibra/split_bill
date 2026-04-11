import logging

logging.basicConfig(level=logging.DEBUG)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.ocr_router import router as ocr_router

app = FastAPI(
    title="Split Bill OCR Service",
    description="Receipt OCR extraction service for Split Bill application",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr_router, prefix="/api/ocr", tags=["OCR"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ocr-service"}