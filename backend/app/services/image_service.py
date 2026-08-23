import io
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Dict, Any, Tuple
import numpy as np
from PIL import Image

from app.core.config import settings
from app.core.appwrite import databases, storage, ID
from app.schemas.image import ImageUploadResponse
from appwrite.input_file import InputFile

logger = logging.getLogger(__name__)


class ImageService:
    """In-memory imagery service that delegates 100% of binary storage and metadata records to Appwrite"""

    def __init__(self):
        self.metadata_store: Dict[str, Dict[str, Any]] = {}

    def validate_extension(self, filename: str) -> str:
        """Validate filename extension against allowed formats"""
        ext = Path(filename).suffix.lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise ValueError(
                f"Unsupported file format '{ext}'. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )
        return ext

    def _infer_sensor_and_modality(self, filename: str, bands: int) -> Tuple[str, str, float]:
        """Infer sensor name, modality, and spatial resolution from filename heuristics and band count"""
        fname = filename.lower()
        
        if "cartosat" in fname or "cs2" in fname:
            return "Cartosat-2S", "optical", 1.2
        elif "sentinel-1" in fname or "s1" in fname or "sar" in fname or "radar" in fname:
            return "Sentinel-1 SAR", "sar", 10.0
        elif "sentinel-2" in fname or "s2" in fname:
            return "Sentinel-2 MSI", "multispectral" if bands > 3 else "optical", 10.0
        elif "landsat" in fname:
            return "Landsat-8 OLI", "multispectral" if bands > 3 else "optical", 15.0
        elif "planet" in fname or "dove" in fname:
            return "PlanetScope", "optical", 3.0
        elif "gaofen" in fname or "gf" in fname:
            return "GaoFen-2", "optical", 0.8
        elif "worldview" in fname or "wv" in fname:
            return "WorldView-3", "optical", 0.3
        elif "pleiades" in fname:
            return "Pleiades Neo", "optical", 0.5
        
        if bands == 1:
            return "Cartosat-2S Panchromatic", "optical", 0.65
        elif bands > 4:
            return "Multispectral Sensor", "multispectral", 2.0
        else:
            return "Cartosat-2S", "optical", 1.2

    def _extract_geotiff_metadata(self, img: Image.Image) -> Dict[str, Any]:
        """Extract spatial reference information from GeoTIFF tags if available"""
        crs = "EPSG:4326"
        res_x = None

        try:
            if hasattr(img, "tag_v2") and 33550 in img.tag_v2:
                scale = img.tag_v2[33550]
                if scale and len(scale) >= 2:
                    res_x = round(float(scale[0]), 2)
            
            if hasattr(img, "tag_v2") and 34735 in img.tag_v2:
                geo_keys = img.tag_v2[34735]
                if 3857 in geo_keys:
                    crs = "EPSG:3857"
                elif 4326 in geo_keys:
                    crs = "EPSG:4326"
                elif any(32601 <= k <= 32660 or 32701 <= k <= 32760 for k in geo_keys):
                    utm_code = next((k for k in geo_keys if (32601 <= k <= 32660 or 32701 <= k <= 32760)), 4326)
                    crs = f"EPSG:{utm_code}"
        except Exception:
            pass

        return {
            "crs": crs,
            "resolution": res_x
        }

    def process_upload(self, file_content: bytes, filename: str) -> ImageUploadResponse:
        """
        Process uploaded imagery purely in-memory:
        1. Validates extension
        2. Inspects raster metadata via PIL in-memory BytesIO
        3. Uploads binary directly to Appwrite Storage (no local disk writes)
        4. Saves metadata record to Appwrite Database
        """
        ext = self.validate_extension(filename)
        clean_filename = Path(filename).name
        file_size = len(file_content)

        # In-memory PIL metadata inspection
        try:
            with Image.open(io.BytesIO(file_content)) as img:
                width, height = img.size
                img_format = img.format or "TIFF"
                
                mode_to_bands = {
                    "1": 1, "L": 1, "P": 1, "I": 1, "F": 1,
                    "RGB": 3, "YCbCr": 3, "LAB": 3, "HSV": 3,
                    "RGBA": 4, "CMYK": 4, "I;16": 1, "I;16L": 1, "I;16B": 1
                }
                bands = mode_to_bands.get(img.mode, len(img.getbands()) if hasattr(img, "getbands") else 3)
                geo_meta = self._extract_geotiff_metadata(img)
        except Exception as e:
            # Fallback for raw binary or unparsable raster
            logger.warning(f"Could not inspect raster dimensions in-memory: {e}")
            width, height = 2048, 2048
            img_format = ext.replace(".", "").upper()
            bands = 3
            geo_meta = {"crs": "EPSG:4326", "resolution": None}

        # Infer sensor and modality
        inferred_sensor, inferred_modality, default_res = self._infer_sensor_and_modality(clean_filename, bands)
        resolution = geo_meta["resolution"] if geo_meta["resolution"] else default_res
        crs = geo_meta["crs"]

        # Generate unique Appwrite File ID
        image_id = ID.unique()
        mime_type = "image/tiff" if ext in (".tif", ".tiff") else (f"image/{ext.replace('.', '')}")

        # Upload binary directly to Appwrite Storage (No local files created!)
        if settings.APPWRITE_API_KEY and settings.APPWRITE_BUCKET_ID:
            try:
                input_file = InputFile.from_bytes(file_content, filename=clean_filename, mime_type=mime_type)
                storage.create_file(
                    bucket_id=settings.APPWRITE_BUCKET_ID,
                    file_id=image_id,
                    file=input_file
                )
                logger.info(f"Uploaded file '{clean_filename}' directly to Appwrite Storage bucket (ID: {image_id})")
            except Exception as appwrite_err:
                logger.error(f"Appwrite Storage direct upload failed: {appwrite_err}")

            # Save document to Appwrite Database
            if settings.APPWRITE_DATABASE_ID and settings.APPWRITE_IMAGE_COLLECTION_ID:
                try:
                    doc_id = ID.unique()
                    databases.create_document(
                        database_id=settings.APPWRITE_DATABASE_ID,
                        collection_id=settings.APPWRITE_IMAGE_COLLECTION_ID,
                        document_id=doc_id,
                        data={
                            "fileId": image_id,
                            "filename": clean_filename,
                            "mimeType": mime_type,
                            "fileSize": file_size,
                            "storageBucketId": settings.APPWRITE_BUCKET_ID,
                            "uploadedAt": datetime.now(timezone.utc).isoformat(),
                            "width": width,
                            "height": height,
                            "bands": bands,
                            "sensor": inferred_sensor,
                            "modality": inferred_modality,
                            "resolution": str(resolution),
                            "crs": crs,
                            "projectId": None,
                        }
                    )
                    logger.info(f"Created Appwrite Database metadata document for fileId '{image_id}'")
                except Exception as db_err:
                    logger.error(f"Appwrite Database direct doc creation failed: {db_err}")

        response_data = ImageUploadResponse(
            image_id=image_id,
            filename=clean_filename,
            sensor=inferred_sensor,
            modality=inferred_modality,
            width=width,
            height=height,
            bands=bands,
            resolution=resolution,
            crs=crs,
            thumbnail_url=None,
            file_size_bytes=file_size,
            format=img_format
        )

        self.metadata_store[image_id] = response_data.model_dump()
        return response_data

    def get_metadata(self, image_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve stored metadata by image ID"""
        return self.metadata_store.get(image_id)


image_service = ImageService()
