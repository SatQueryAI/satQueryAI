import logging
from typing import Optional, Dict, Any

from app.core.config import settings
from app.core.appwrite import databases, storage, Query

logger = logging.getLogger(__name__)


class AppwriteImageService:
    """Service to retrieve and verify image metadata and storage references from Appwrite"""

    def __init__(self):
        self.database_id = settings.APPWRITE_DATABASE_ID
        self.collection_id = settings.APPWRITE_IMAGE_COLLECTION_ID
        self.bucket_id = settings.APPWRITE_BUCKET_ID

    async def get_image(self, image_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves image metadata from Appwrite Database or Storage.
        Checks:
        1. Document by $id == image_id
        2. Document by fileId == image_id
        3. File directly in Storage by $id == image_id
        """
        if not image_id or not image_id.strip():
            return None

        clean_id = image_id.strip()

        # 1. Try fetching document by direct Document ID
        try:
            doc = databases.get_document(
                database_id=self.database_id,
                collection_id=self.collection_id,
                document_id=clean_id
            )
            if doc:
                return self._format_doc(doc, clean_id)
        except Exception as e:
            logger.debug(f"Document lookup by ID '{clean_id}' failed: {e}")

        # 2. Try querying document by fileId attribute
        try:
            results = databases.list_documents(
                database_id=self.database_id,
                collection_id=self.collection_id,
                queries=[Query.equal("fileId", clean_id), Query.limit(1)]
            )
            if results and hasattr(results, "documents") and len(results.documents) > 0:
                return self._format_doc(results.documents[0], clean_id)
        except Exception as e:
            logger.debug(f"Document query by fileId '{clean_id}' failed: {e}")

        # 3. Fallback: Check if file exists in Storage bucket
        try:
            file_obj = storage.get_file(
                bucket_id=self.bucket_id,
                file_id=clean_id
            )
            if file_obj:
                doc_dict = file_obj.to_dict() if hasattr(file_obj, "to_dict") else vars(file_obj)
                return {
                    "image_id": clean_id,
                    "document_id": None,
                    "file_id": doc_dict.get("$id", clean_id),
                    "filename": doc_dict.get("name", "satellite_image.tif"),
                    "mime_type": doc_dict.get("mimeType", "image/tiff"),
                    "file_size": int(doc_dict.get("sizeOriginal", 0)),
                    "storage_bucket_id": doc_dict.get("bucketId", self.bucket_id),
                    "width": None,
                    "height": None,
                    "bands": None,
                    "sensor": None,
                    "modality": "optical",
                    "resolution": None,
                    "crs": None,
                    "project_id": None,
                }
        except Exception as e:
            logger.debug(f"Storage lookup for file '{clean_id}' failed: {e}")

        return None

    def _format_doc(self, doc: Any, queried_id: str) -> Dict[str, Any]:
        """Formats Appwrite document object into normalized dictionary"""
        doc_dict = doc.to_dict() if hasattr(doc, "to_dict") else (doc if isinstance(doc, dict) else vars(doc))
        data = doc_dict.get("data", {}) if "data" in doc_dict else doc_dict

        file_id = data.get("fileId") or doc_dict.get("$id", queried_id)
        doc_id = doc_dict.get("$id")

        return {
            "image_id": queried_id,
            "document_id": doc_id,
            "file_id": file_id,
            "filename": data.get("filename") or "satellite_image.tif",
            "mime_type": data.get("mimeType") or "image/tiff",
            "file_size": data.get("fileSize") or 0,
            "storage_bucket_id": data.get("storageBucketId") or self.bucket_id,
            "uploaded_at": data.get("uploadedAt") or doc_dict.get("$createdAt"),
            "width": data.get("width"),
            "height": data.get("height"),
            "bands": data.get("bands"),
            "sensor": data.get("sensor"),
            "modality": data.get("modality", "optical"),
            "resolution": data.get("resolution"),
            "crs": data.get("crs"),
            "project_id": data.get("projectId"),
        }


appwrite_image_service = AppwriteImageService()
