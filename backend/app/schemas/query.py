from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class AnalysisTask(str, Enum):
    VQA = "vqa"
    OBJECT_GROUNDING = "object_grounding"
    CHANGE_DETECTION = "change_detection"
    OPTICAL_SAR = "optical_sar"
    SEGMENTATION = "segmentation"
    UNKNOWN = "unknown"


class TaskClassification(BaseModel):
    task: AnalysisTask = Field(..., description="Classified remote sensing analysis task")
    subtask: str = Field(..., description="Short snake_case subtask identifier")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    reasoning: str = Field(..., description="Short concise explanation of the classification")


class QueryRequest(BaseModel):
    image_id: str = Field(..., min_length=1, description="Identifier of the target satellite image")
    query: str = Field(..., min_length=1, max_length=2000, description="Natural language question / query")
    mode: str = Field(default="single_image", description="Analysis mode (single_image, temporal_change, etc.)")


class QueryResponse(BaseModel):
    analysis_id: str
    image_id: str
    query: str
    mode: str
    status: str = "classified"
    classification: TaskClassification
    answer: Optional[str] = None
    confidence: Optional[float] = None
