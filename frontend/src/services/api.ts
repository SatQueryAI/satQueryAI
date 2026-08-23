export interface UploadResponse {
  image_id: string;
  filename: string;
  sensor: string;
  modality: string;
  width: number;
  height: number;
  bands: number;
  resolution: number;
  crs: string;
  thumbnail_url?: string;
  file_size_bytes?: number;
  format?: string;
}

const API_BASE_URL = ''; // Relative path leverages Vite proxy or direct API

export const apiService = {
  /**
   * Upload raster satellite imagery (.tif, .tiff, .png, .jpg, .jpeg, .zip)
   */
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Upload failed with status ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Retrieve metadata for an uploaded image
   */
  async getImageMetadata(imageId: string): Promise<UploadResponse> {
    const response = await fetch(`${API_BASE_URL}/api/images/${imageId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata for image ${imageId}`);
    }
    return await response.json();
  },

  /**
   * Get preview URL for an image ID
   */
  getImagePreviewUrl(imageId: string): string {
    return `${API_BASE_URL}/api/images/${imageId}/preview`;
  },
};
