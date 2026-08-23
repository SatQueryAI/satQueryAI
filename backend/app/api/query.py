import uuid
from fastapi import APIRouter, HTTPException, status
from app.schemas.query import QueryRequest, QueryResponse
from app.services.appwrite_image_service import appwrite_image_service

router = APIRouter(tags=["Query"])


@router.post(
    "/query",
    response_model=QueryResponse,
    summary="Submit Satellite VQA / Analysis Query",
    description="Validates image existence in Appwrite and processes natural language query on satellite imagery."
)
async def process_query(request: QueryRequest):
    # 1. Verify image exists in Appwrite Database / Storage
    image = await appwrite_image_service.get_image(request.image_id)
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )

    # 2. Generate analysis ID and return mock analysis response
    analysis_id = f"analysis_{uuid.uuid4().hex[:8]}"

    return QueryResponse(
        analysis_id=analysis_id,
        image_id=request.image_id,
        query=request.query,
        mode=request.mode,
        status="completed",
        answer="This is a temporary mock analysis response.",
        confidence=0.87
    )
