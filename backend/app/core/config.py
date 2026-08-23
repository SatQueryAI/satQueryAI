import os
from pathlib import Path
from pydantic_settings import BaseSettings

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
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()

# Ensure directories exist
settings.STORAGE_DIR.mkdir(parents=True, exist_ok=True)
settings.UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
settings.PREVIEWS_DIR.mkdir(parents=True, exist_ok=True)
