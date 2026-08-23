export type QueryClassification = 
  | 'Visual Question Answering'
  | 'Temporal Change Analysis'
  | 'Optical–SAR Reasoning'
  | 'Visual Grounding'
  | 'Land-Cover Interpretation'
  | 'Object Identification & Counting';

export type ConfidenceRating = 'Very High' | 'High' | 'Moderate' | 'Low';

export interface EvidenceRegion {
  id: string;
  index: number;
  label: string;
  category: 'building' | 'road' | 'vegetation' | 'water' | 'change' | 'infrastructure' | 'sar_anomaly';
  bbox: [number, number, number, number]; // [x%, y%, width%, height%] (normalized 0-100)
  confidence: number; // e.g. 0.94
  areaEstimate?: string;
  description?: string;
  badgeColor?: 'amber' | 'cyan' | 'emerald' | 'rose' | 'purple';
  attributes?: Record<string, string | number>;
}

export interface LandCoverDistribution {
  category: string;
  percentage: number;
  areaKm2: number;
  color: string;
}

export type TraceStatus = 'completed' | 'running' | 'pending' | 'warning' | 'error';

export interface ExecutionTraceStep {
  id: string;
  stepNumber: number;
  timestamp: string;
  stage: string;
  status: TraceStatus;
  description: string;
  durationMs: number;
  details?: string;
}

export interface AnalysisResult {
  id: string;
  imageId: string;
  query: string;
  queryType: QueryClassification;
  modelName: string;
  modelVersion: string;
  timestamp: string;
  latencySeconds: number;
  confidenceScore: number; // 0 - 100
  confidenceRating: ConfidenceRating;
  answerText: string;
  keyFindings: string[];
  evidenceRegions: EvidenceRegion[];
  landCoverBreakdown?: LandCoverDistribution[];
  executionTrace: ExecutionTraceStep[];
  isVerified?: boolean;
}

export interface AnalysisStageState {
  currentStageIndex: number;
  stages: {
    label: string;
    description: string;
    durationMs: number;
  }[];
}
