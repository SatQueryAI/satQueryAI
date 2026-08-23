from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ImageUploadResponse(BaseModel):
    image_id: str = Field(..., description="Unique generated image identifier (e.g. img_8f31a)")
    filename: str = Field(..., description="Original filename of the uploaded image")
    sensor: str = Field(default="Cartosat-2S", description="Detected or inferred satellite/sensor name")
    modality: str = Field(default="optical", description="Modality type (optical, sar, multispectral, etc.)")
    width: int = Field(..., description="Image width in pixels")
    height: int = Field(..., description="Image height in pixels")
    bands: int = Field(default=3, description="Number of spectral/raster channels")
    resolution: float = Field(default=1.2, description="Ground Sample Distance / resolution in meters")
    crs: str = Field(default="EPSG:4326", description="Coordinate Reference System")
    
    # Supplementary fields for rich client support
    thumbnail_url: Optional[str] = Field(None, description="URL or relative path to generated web preview")
    file_size_bytes: Optional[int] = Field(None, description="Original file size in bytes")
    format: Optional[str] = Field(None, description="Image format (TIFF, PNG, JPEG, etc.)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "image_id": "img_8f31a",
                "filename": "CARTOSAT_25S_CHENNAI.tif",
                "sensor": "Cartosat-2S",
                "modality": "optical",
                "width": 2048,
                "height": 2048,
                "bands": 4,
                "resolution": 1.2,
                "crs": "EPSG:4326"
            }
        }

class ImageMetadata(ImageUploadResponse):
    pass
