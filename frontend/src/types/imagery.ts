export type ModalityType = 'OPTICAL' | 'SAR' | 'MULTISPECTRAL' | 'TEMPORAL_PAIR' | 'FUSED';

export interface GeoBands {
  name: string;
  wavelength?: string;
  description: string;
  centralWavelength?: string;
}

export interface SatelliteImageMeta {
  id: string;
  name: string;
  filename: string;
  sensor: string;
  platform: string;
  modality: ModalityType;
  acquisitionDate: string;
  acquisitionTime?: string;
  resolution: string; // e.g. "1.2 m GSD"
  dimensions: { width: number; height: number };
  bandsCount: number;
  bandsList: GeoBands[];
  crs: string; // e.g. "EPSG:4326"
  coordinates: {
    lat: number;
    lon: number;
    bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
    locationName: string;
  };
  cloudCoverPercentage?: number;
  solarAzimuth?: number;
  solarElevation?: number;
  polarization?: string; // For SAR: "VV / VH" or "HH / HV"
  incidenceAngle?: number;
  thumbnailUrl: string;
  fullImageUrl: string;
  secondaryImageUrl?: string; // For temporal pairs or SAR co-registration
  changeMaskUrl?: string;
  fileSizeBytes: string;
  isPair?: boolean;
  pairMetadata?: {
    beforeDate: string;
    afterDate: string;
    beforeLabel: string;
    afterLabel: string;
  };
}

export type AnalysisMode = 
  | 'SINGLE_IMAGE'
  | 'IMAGE_COMPARISON'
  | 'OPTICAL_SAR'
  | 'TEMPORAL_CHANGE';

export interface LayerVisibility {
  original: boolean;
  evidence: boolean;
  detection: boolean;
  changeMask: boolean;
  grid: boolean;
  coordinates: boolean;
  segmentation: boolean;
}
