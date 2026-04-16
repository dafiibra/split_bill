import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "10"))
    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:8080,https://the-socialtable.vercel.app"
    ).split(",")
    PORT: int = int(os.getenv("PORT", "8000"))


settings = Settings()