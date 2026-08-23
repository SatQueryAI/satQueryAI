from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.images import router as images_router
from app.api.system import router as system_router
from app.api.query import router as query_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Earth Observation & Satellite Imagery Analysis API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for React / Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(images_router, prefix=settings.API_V1_PREFIX)
app.include_router(system_router, prefix=settings.API_V1_PREFIX)
app.include_router(query_router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "SatQuery AI API is running",
        "docs": "/docs",
        "endpoints": {
            "upload_image": "POST /api/images/upload",
            "image_metadata": "GET /api/images/{image_id}",
            "image_preview": "GET /api/images/{image_id}/preview",
            "query": "POST /api/query",
            "health": "GET /api/system/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
