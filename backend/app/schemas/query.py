from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    image_id: str = Field(..., min_length=1, description="Identifier of the target satellite image")
    query: str = Field(..., min_length=1, max_length=2000, description="Natural language question / query")
    mode: str = Field(default="single_image", description="Analysis mode (single_image, temporal_change, etc.)")


class QueryResponse(BaseModel):
    analysis_id: str
    image_id: str
    query: str
    mode: str
    status: str
    answer: str | None = None
    confidence: float | None = None
