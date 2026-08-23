import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SatQuery AI Backend"
    API_V1_PREFIX: str = "/api"
    
    # Base directory paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    STORAGE_DIR: Path = BASE_DIR / "storage"
    UPLOADS_DIR: Path = STORAGE_DIR / "originals"
    PREVIEWS_DIR: Path = STORAGE_DIR / "previews"
    
    # Allowed imagery formats
    ALLOWED_EXTENSIONS: set = {".tif", ".tiff", ".png", ".jpg", ".jpeg", ".zip"}
    
    # Appwrite Server Configuration
    APPWRITE_ENDPOINT: str = "https://sgp.cloud.appwrite.io/v1"
    APPWRITE_PROJECT_ID: str = "6a8ac3670019b6125595"
    APPWRITE_API_KEY: str = ""
    APPWRITE_DATABASE_ID: str = "6a8ac43a0027d3534c2c"
    APPWRITE_IMAGE_COLLECTION_ID: str = "images"
    APPWRITE_BUCKET_ID: str = "6a8ac4580027071eb467"

    # OpenRouter REST API Configuration
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "google/gemini-2.5-flash"
    OPENROUTER_API_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_TIMEOUT_SECONDS: float = 15.0
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent.parent.parent / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
