import json
import logging
import re
import time
import asyncio
from typing import Dict, Any

import httpx
from fastapi import HTTPException, status

from app.core.config import settings
from app.schemas.query import AnalysisTask, TaskClassification

logger = logging.getLogger(__name__)

OPENROUTER_CLASSIFIER_SYSTEM_PROMPT = """You are the task classification component of SatQuery AI, a remote-sensing image analysis system.

Your ONLY job is to classify the user's requested analysis task.

You must NOT answer the user's question.

You must NOT perform image analysis.

You must NOT invent information about the satellite imagery.

Classify the request into exactly one of these tasks:

1. vqa
Use when the user asks a question that requires answering about the contents of a satellite image.

Examples:
- How many buildings are visible?
- Is there a road near the river?
- What type of land cover is present?

2. object_grounding
Use when the user wants to locate or identify the spatial position of objects in imagery.

Examples:
- Where are the buildings?
- Locate the roads.
- Show me all vehicles.

3. change_detection
Use when the user asks about differences, changes, construction, destruction, growth, or temporal changes between imagery.

Examples:
- What changed between these images?
- Find newly constructed buildings.
- Detect vegetation loss.

4. optical_sar
Use when the request specifically requires comparing, interpreting, or combining optical and SAR imagery.

Examples:
- Compare the optical and SAR images.
- What does SAR reveal that optical imagery does not?
- Analyze both modalities together.

5. segmentation
Use when the user explicitly requests segmentation or extraction of a spatial class/region.

Examples:
- Segment all water bodies.
- Extract the road network.
- Create a vegetation mask.

6. unknown
Use when the request is outside SatQuery's supported remote-sensing analysis capabilities or cannot be reliably classified.

Choose the most specific applicable task.

Return exactly:

{
  "task": "...",
  "subtask": "...",
  "confidence": 0.0,
  "reasoning": "..."
}

The task must be one of:

vqa
object_grounding
change_detection
optical_sar
segmentation
unknown

The subtask must be short snake_case text.

Confidence must be between 0 and 1.

Reasoning must be one short sentence.

Do not answer the user's question.

Do not include markdown.

Do not include code fences.

Do not include additional fields."""


class TaskClassifier:
    """Service that interacts with OpenRouter Chat Completions API to classify remote-sensing user queries."""

    def __init__(self):
        self.endpoint_url = f"{settings.OPENROUTER_API_BASE_URL}/chat/completions"
        self.timeout = settings.OPENROUTER_TIMEOUT_SECONDS

    async def classify_task(self, query: str, mode: str = "single_image", image_count: int = 1) -> TaskClassification:
        """
        Sends the user's natural language query to OpenRouter API and parses the structured classification.
        """
        if not settings.OPENROUTER_API_KEY or not settings.OPENROUTER_API_KEY.strip():
            logger.error("OPENROUTER_API_KEY is not configured in backend/.env")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenRouter API key is not configured on the server. Please add OPENROUTER_API_KEY to backend/.env."
            )

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY.strip()}",
            "HTTP-Referer": "http://localhost:5173",  # Recommended by OpenRouter
            "X-Title": "SatQuery AI"
        }

        # Build context object to help classification
        context_msg = {
            "query": query.strip(),
            "mode": mode,
            "image_count": image_count
        }

        payload = {
            "model": settings.OPENROUTER_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": OPENROUTER_CLASSIFIER_SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": json.dumps(context_msg)
                }
            ],
            "response_format": {"type": "json_object"},
            "stream": False,
            "temperature": 0.0
        }

        start_time = time.perf_counter()

        max_retries = 1
        response = None
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for attempt in range(max_retries + 1):
                try:
                    response = await client.post(
                        self.endpoint_url,
                        headers=headers,
                        json=payload
                    )
                    if response.status_code in (429, 503) and attempt < max_retries:
                        logger.warning(f"OpenRouter API returned status {response.status_code}. Retrying in 1.5s (attempt {attempt + 1}/{max_retries})...")
                        await asyncio.sleep(1.5)
                        continue
                    break
                except httpx.TimeoutException:
                    if attempt < max_retries:
                        await asyncio.sleep(1.0)
                        continue
                    logger.error(f"OpenRouter API request timed out after {self.timeout}s")
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="Task classification service timed out. Please try again."
                    )
                except httpx.RequestError as exc:
                    if attempt < max_retries:
                        await asyncio.sleep(1.0)
                        continue
                    logger.error(f"Network connection error calling OpenRouter API: {exc}")
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="Unable to reach task classification service."
                    )

        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

        if response.status_code != 200:
            logger.error(f"OpenRouter API returned status {response.status_code}: {response.text}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Upstream classification service returned an error."
            )

        try:
            resp_data = response.json()
            raw_text = resp_data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            logger.error(f"Invalid OpenRouter response structure: {e}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Malformed response received from task classification service."
            )

        # Parse JSON output
        parsed_json = self._extract_and_parse_json(raw_text)
        
        try:
            # Validate task and confidence limits
            task_str = str(parsed_json.get("task", "")).lower().strip()
            # Normalize enum match
            matched_task = AnalysisTask(task_str) if task_str in AnalysisTask._value2member_map_ else AnalysisTask.UNKNOWN
            
            subtask_str = str(parsed_json.get("subtask", "general_query")).strip()
            # Enforce snake_case
            subtask_str = re.sub(r"[^\w]+", "_", subtask_str).strip("_").lower()
            if not subtask_str:
                subtask_str = "general_query"
            
            raw_conf = parsed_json.get("confidence", 0.8)
            try:
                confidence_val = max(0.0, min(1.0, float(raw_conf)))
            except (ValueError, TypeError):
                confidence_val = 0.5

            reasoning_str = str(parsed_json.get("reasoning", "Classified based on query semantics.")).strip()
            if not reasoning_str:
                reasoning_str = "Classified based on query semantics."

            classification = TaskClassification(
                task=matched_task,
                subtask=subtask_str,
                confidence=confidence_val,
                reasoning=reasoning_str
            )
        except Exception as validation_err:
            logger.error(f"Pydantic validation failed for classifier output: {validation_err}. Raw output: {raw_text}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to validate task classification schema."
            )

        logger.info(
            f"Classified query '{query[:40]}' -> task={classification.task.value}, "
            f"model={settings.OPENROUTER_MODEL}, latency={latency_ms}ms"
        )

        return classification

    def _extract_and_parse_json(self, raw_text: str) -> Dict[str, Any]:
        """Strips markdown fences and parses JSON safely."""
        text = raw_text.strip()
        # Strip ```json ... ``` code fences if present
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
            text = re.sub(r"\s*```$", "", text)
        
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Match first {...} block
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            
            # If all else fails and it returned unsupported plain text, force unknown
            logger.warning(f"Could not find valid JSON in OpenRouter response: {raw_text}")
            return {
                "task": "unknown",
                "subtask": "unsupported_query",
                "confidence": 0.5,
                "reasoning": "Failed to parse structured JSON response from LLM."
            }


task_classifier = TaskClassifier()
