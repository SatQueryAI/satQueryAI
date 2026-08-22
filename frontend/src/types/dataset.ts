export type DatasetType = 'VQA' | 'Change Detection' | 'Visual Grounding' | 'Multimodal SAR-Opt' | 'Land Cover';

export interface DatasetSample {
  id: string;
  imageFilename: string;
  imageUrl: string;
  secondaryImageUrl?: string;
  question: string;
  groundTruthAnswer: string;
  modelPredictedAnswer: string;
  taskType: string;
  split: 'Train' | 'Val' | 'Test';
  confidence: number;
  isMatch: boolean;
}

export interface DatasetClassStat {
  className: string;
  sampleCount: number;
  percentage: number;
  color: string;
}

export interface DatasetEntity {
  id: string;
  name: string;
  fullName: string;
  type: DatasetType;
  totalImages: number;
  totalQuestions: number;
  resolution: string;
  sensors: string[];
  status: 'Available' | 'Processing' | 'Indexed' | 'Downloading';
  sizeDisk: string;
  description: string;
  license: string;
  accuracyBenchmark: number; // e.g. 84.6%
  classes: DatasetClassStat[];
  samples: DatasetSample[];
  citation: string;
}
