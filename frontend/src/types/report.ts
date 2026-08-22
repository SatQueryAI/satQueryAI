import { AnalysisResult } from './analysis';
import { SatelliteImageMeta } from './imagery';

export interface IntelligenceReport {
  id: string;
  reportNumber: string; // e.g. "REP-2026-08-041"
  title: string;
  subtitle: string;
  projectName: string;
  projectId: string;
  generatedDate: string;
  generatedBy: string;
  classification: 'RESTRICTED / TECHNICAL' | 'INTERNAL USE' | 'CONFIDENTIAL';
  format: 'PDF' | 'GEOJSON' | 'HTML_BUNDLE';
  analysisCount: number;
  status: 'Ready' | 'Generating' | 'Archived';
  fileSizeBytes: string;
  executiveSummary: string;
  methodology: string;
  keyFindings: string[];
  changeStatistics: {
    builtUpGainKm2: number;
    vegetationLossKm2: number;
    waterVariancePercent: number;
    confidenceAverage: number;
  };
  associatedImagery: SatelliteImageMeta[];
  includedAnalyses: AnalysisResult[];
}
