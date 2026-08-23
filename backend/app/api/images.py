from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import RedirectResponse
from typing import Dict, Any

from app.services.image_service import image_service
from app.services.appwrite_image_service import appwrite_image_service
from app.schemas.image import ImageUploadResponse
from app.core.config import settings

router = APIRouter(prefix="/images", tags=["Images"])

@router.post(
    "/upload",
    response_model=ImageUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload satellite imagery",
    description="Accepts raster imagery (.tif, .tiff, .png, .jpg, .jpeg, .zip), extracts metadata in-memory, and stores 100% of binary files and records in Appwrite Storage & Database."
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
    summary="Get image metadata",
    description="Retrieve stored metadata for an uploaded image by its unique Appwrite ID."
)
async def get_image_metadata(image_id: str):
    meta = await appwrite_image_service.get_image(image_id)
    if not meta:
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
    description="Redirects to Appwrite Storage file preview URL."
)
async def get_image_preview(image_id: str):
    view_url = f"{settings.APPWRITE_ENDPOINT}/storage/buckets/{settings.APPWRITE_BUCKET_ID}/files/{image_id}/view?project={settings.APPWRITE_PROJECT_ID}"
    return RedirectResponse(url=view_url)

@router.get(
    "/{image_id}/file",
    summary="Download original image",
    description="Redirects to Appwrite Storage file download URL."
)
async def get_original_file(image_id: str):
    download_url = f"{settings.APPWRITE_ENDPOINT}/storage/buckets/{settings.APPWRITE_BUCKET_ID}/files/{image_id}/download?project={settings.APPWRITE_PROJECT_ID}"
    return RedirectResponse(url=download_url)
