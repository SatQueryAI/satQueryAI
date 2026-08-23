from fastapi import APIRouter
import time

router = APIRouter(prefix="/system", tags=["System"])

@router.get("/health", summary="System Health Check")
async def health_check():
    return {
        "status": "healthy",
        "service": "SatQuery AI Backend",
        "timestamp": time.time(),
        "version": "1.0.0"
    }
