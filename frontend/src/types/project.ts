import { SatelliteImageMeta, AnalysisMode } from './imagery';
import { AnalysisResult } from './analysis';

export interface ProjectEntity {
  id: string;
  name: string;
  code: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  defaultMode: AnalysisMode;
  createdAt: string;
  lastAnalyzedAt: string;
  imageCount: number;
  analysesCount: number;
  reportsCount: number;
  detectedChangesCount: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'MONITORING';
  tags: string[];
  thumbnailUrl: string;
  imagery: SatelliteImageMeta[];
  recentAnalyses: AnalysisResult[];
}
