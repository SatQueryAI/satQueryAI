from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import FileResponse
from typing import Dict, Any

from app.services.image_service import image_service
from app.schemas.image import ImageUploadResponse

router = APIRouter(prefix="/images", tags=["Images"])

@router.post(
    "/upload",
    response_model=ImageUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload satellite imagery",
    description="Accepts raster imagery (.tif, .tiff, .png, .jpg, .jpeg, .zip), extracts metadata, generates preview, and returns image metadata."
)
async def upload_image(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload request."
        )

    try:
        content = await file.read()
        if not content or len(content) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty."
            )

        metadata = image_service.process_upload(content, file.filename)
        return metadata
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal error processing satellite image: {str(exc)}"
        )

@router.get(
    "/{image_id}",
    response_model=ImageUploadResponse,
    summary="Get image metadata",
    description="Retrieve stored metadata for an uploaded image by its unique ID."
)
async def get_image_metadata(image_id: str):
    meta = image_service.get_metadata(image_id)
    if not meta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image with ID '{image_id}' not found."
        )
    return meta

@router.get(
    "/{image_id}/preview",
    summary="Get image preview",
    description="Stream the generated web-friendly raster preview."
)
async def get_image_preview(image_id: str):
    preview_path = image_service.get_preview_path(image_id)
    if not preview_path or not preview_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Preview for image ID '{image_id}' not found."
        )
    return FileResponse(preview_path, media_type="image/png")

@router.get(
    "/{image_id}/file",
    summary="Download original image",
    description="Download the raw uploaded satellite imagery file."
)
async def get_original_file(image_id: str):
    original_path = image_service.get_original_path(image_id)
    if not original_path or not original_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Original file for image ID '{image_id}' not found."
        )
    return FileResponse(original_path, filename=original_path.name)
