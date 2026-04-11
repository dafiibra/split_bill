import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    OCR_ENGINE: str = os.getenv("OCR_ENGINE", "easyocr")
    OCR_LANGUAGES: list[str] = os.getenv("OCR_LANGUAGES", "id,en").split(",")
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "10"))
    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS", "http://localhost:3000,http://localhost:8080"
    ).split(",")
    PORT: int = int(os.getenv("PORT", "8000"))


settings = Settings()
