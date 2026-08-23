import os
import uuid
import zipfile
import shutil
from pathlib import Path
from typing import Optional, Dict, Any, Tuple
import numpy as np
from PIL import Image, ImageOps

from app.core.config import settings
from app.schemas.image import ImageUploadResponse

class ImageService:
    def __init__(self):
        self.metadata_store: Dict[str, Dict[str, Any]] = {}

    def generate_image_id(self) -> str:
        """Generate unique image ID formatted like img_8f31a"""
        short_hash = uuid.uuid4().hex[:5]
        return f"img_{short_hash}"

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
        
        # Default heuristics
        if bands == 1:
            return "Cartosat-2S Panchromatic", "optical", 0.65
        elif bands > 4:
            return "Multispectral Sensor", "multispectral", 2.0
        else:
            return "Cartosat-2S", "optical", 1.2

    def _extract_geotiff_metadata(self, img: Image.Image, filename: str) -> Dict[str, Any]:
        """Extract spatial reference information from GeoTIFF tags if available"""
        crs = "EPSG:4326"
        res_x = None

        try:
            # ModelPixelScaleTag is tag 33550
            if hasattr(img, "tag_v2") and 33550 in img.tag_v2:
                scale = img.tag_v2[33550]
                if scale and len(scale) >= 2:
                    res_x = round(float(scale[0]), 2)
            
            # GeoKeyDirectoryTag is tag 34735
            if hasattr(img, "tag_v2") and 34735 in img.tag_v2:
                geo_keys = img.tag_v2[34735]
                # Check for EPSG standard key references
                if 3857 in geo_keys:
                    crs = "EPSG:3857"
                elif 4326 in geo_keys:
                    crs = "EPSG:4326"
                elif any(32601 <= k <= 32660 or 32701 <= k <= 32760 for k in geo_keys):
                    # UTM zones
                    utm_code = next((k for k in geo_keys if (32601 <= k <= 32660 or 32701 <= k <= 32760)), 4326)
                    crs = f"EPSG:{utm_code}"
        except Exception:
            pass

        return {
            "crs": crs,
            "resolution": res_x
        }

    def _generate_preview(self, pil_image: Image.Image, output_path: Path, max_size: int = 1024):
        """Generate normalized web-friendly RGB preview thumbnail from arbitrary raster format"""
        # Convert PIL image to numpy array for channel handling and normalization
        arr = np.array(pil_image)

        # Handle various array dimensions / multi-channel bands
        if arr.ndim == 2:
            # Single-band (grayscale / SAR / elevation)
            # Normalize to 0-255
            norm = arr.astype(np.float32)
            min_val, max_val = norm.min(), norm.max()
            if max_val > min_val:
                norm = ((norm - min_val) / (max_val - min_val) * 255.0)
            rgb_arr = np.stack([norm.astype(np.uint8)] * 3, axis=-1)
            preview_img = Image.fromarray(rgb_arr, mode="RGB")
        elif arr.ndim == 3:
            num_channels = arr.shape[2]
            if num_channels >= 3:
                # Use first 3 channels (RGB)
                rgb_slice = arr[:, :, :3].astype(np.float32)
                # Normalize each band if high dynamic range (e.g. 16-bit)
                min_v = rgb_slice.min()
                max_v = rgb_slice.max()
                if max_v > 255:
                    rgb_slice = ((rgb_slice - min_v) / (max_v - min_v + 1e-6) * 255.0)
                preview_img = Image.fromarray(rgb_slice.astype(np.uint8), mode="RGB")
            else:
                norm = arr[:, :, 0].astype(np.float32)
                min_v, max_v = norm.min(), norm.max()
                if max_v > min_v:
                    norm = ((norm - min_v) / (max_v - min_v) * 255.0)
                rgb_arr = np.stack([norm.astype(np.uint8)] * 3, axis=-1)
                preview_img = Image.fromarray(rgb_arr, mode="RGB")
        else:
            preview_img = pil_image.convert("RGB")

        # Resize preserving aspect ratio
        preview_img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        preview_img.save(output_path, "PNG", optimize=True)

    def process_upload(self, file_content: bytes, filename: str) -> ImageUploadResponse:
        """Process file upload, extract metadata, generate preview, and persist state"""
        ext = self.validate_extension(filename)
        image_id = self.generate_image_id()
        clean_filename = Path(filename).name

        # Target storage paths
        original_path = settings.UPLOADS_DIR / f"{image_id}_{clean_filename}"
        preview_path = settings.PREVIEWS_DIR / f"{image_id}.png"

        # Handle zip archives
        if ext == ".zip":
            temp_extract_dir = settings.UPLOADS_DIR / f"temp_{image_id}"
            temp_extract_dir.mkdir(parents=True, exist_ok=True)
            try:
                zip_path = temp_extract_dir / clean_filename
                with open(zip_path, "wb") as f:
                    f.write(file_content)

                with zipfile.ZipFile(zip_path, "r") as zip_ref:
                    zip_ref.extractall(temp_extract_dir)

                # Find valid imagery file inside extracted contents
                valid_files = [
                    p for p in temp_extract_dir.rglob("*")
                    if p.is_file() and p.suffix.lower() in {".tif", ".tiff", ".png", ".jpg", ".jpeg"}
                ]
                if not valid_files:
                    raise ValueError("No supported image files (.tif, .tiff, .png, .jpg, .jpeg) found in .zip archive.")

                # Select primary image file
                selected_file = valid_files[0]
                clean_filename = selected_file.name
                original_path = settings.UPLOADS_DIR / f"{image_id}_{clean_filename}"
                shutil.copy(selected_file, original_path)
            finally:
                shutil.rmtree(temp_extract_dir, ignore_errors=True)
        else:
            # Save raw original bytes
            with open(original_path, "wb") as f:
                f.write(file_content)

        # Read image properties with PIL
        try:
            with Image.open(original_path) as img:
                width, height = img.size
                img_format = img.format or "UNKNOWN"
                
                # Determine band count
                mode_to_bands = {
                    "1": 1, "L": 1, "P": 1, "I": 1, "F": 1,
                    "RGB": 3, "YCbCr": 3, "LAB": 3, "HSV": 3,
                    "RGBA": 4, "CMYK": 4, "I;16": 1, "I;16L": 1, "I;16B": 1
                }
                bands = mode_to_bands.get(img.mode, len(img.getbands()) if hasattr(img, "getbands") else 3)
                
                # Extract GeoTIFF / spatial tags if available
                geo_meta = self._extract_geotiff_metadata(img, clean_filename)
                
                # Generate web preview
                self._generate_preview(img, preview_path)
        except Exception as e:
            # Fallback if image opening fails
            raise ValueError(f"Failed to decode raster file: {str(e)}")

        # Infer sensor, modality, and resolution
        inferred_sensor, inferred_modality, default_res = self._infer_sensor_and_modality(clean_filename, bands)
        resolution = geo_meta["resolution"] if geo_meta["resolution"] else default_res
        crs = geo_meta["crs"]

        file_size = os.path.getsize(original_path)
        thumbnail_url = f"/api/images/{image_id}/preview"

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
            thumbnail_url=thumbnail_url,
            file_size_bytes=file_size,
            format=img_format
        )

        # Store metadata in-memory
        self.metadata_store[image_id] = response_data.model_dump()

        return response_data

    def get_metadata(self, image_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve stored metadata by image ID"""
        return self.metadata_store.get(image_id)

    def get_original_path(self, image_id: str) -> Optional[Path]:
        """Find path to original uploaded file"""
        matching = list(settings.UPLOADS_DIR.glob(f"{image_id}_*"))
        return matching[0] if matching else None

    def get_preview_path(self, image_id: str) -> Optional[Path]:
        """Find path to preview thumbnail"""
        path = settings.PREVIEWS_DIR / f"{image_id}.png"
        return path if path.exists() else None

image_service = ImageService()
