import uuid
import logging
from fastapi import APIRouter, HTTPException, status

from app.schemas.query import QueryRequest, QueryResponse
from app.services.appwrite_image_service import appwrite_image_service
from app.services.task_classifier import task_classifier

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Query"])


@router.post(
    "/query",
    response_model=QueryResponse,
    summary="Submit Satellite VQA / Analysis Query",
    description="Validates image existence in Appwrite and classifies the natural language query into an analysis task using OpenRouter LLM."
)
async def process_query(request: QueryRequest):
    # 1. Verify image exists in Appwrite Database / Storage
    image = await appwrite_image_service.get_image(request.image_id)
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )

    # 2. Run OpenRouter Task Classifier on the user's natural language query
    classification = await task_classifier.classify_task(
        query=request.query,
        mode=request.mode,
        image_count=1
    )

    # 3. Generate analysis ID and return structured classification response
    analysis_id = f"analysis_{uuid.uuid4().hex[:8]}"

    logger.info(
        f"Query processed: analysis_id={analysis_id}, image_id={request.image_id}, "
        f"task={classification.task.value}, subtask={classification.subtask}"
    )

    return QueryResponse(
        analysis_id=analysis_id,
        image_id=request.image_id,
        query=request.query,
        mode=request.mode,
        status="classified",
        classification=classification,
        answer=None,
        confidence=classification.confidence
    )
