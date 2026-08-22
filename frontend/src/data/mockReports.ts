import { IntelligenceReport } from '../types/report';
import { MOCK_SATELLITE_IMAGES } from './mockImagery';
import { MOCK_ANALYSIS_PRESETS } from './mockAnalyses';

export const MOCK_REPORTS: IntelligenceReport[] = [
  {
    id: 'rep-001',
    reportNumber: 'REP-2026-08-041',
    title: 'ORAGADAM INDUSTRIAL CORRIDOR — BI-TEMPORAL CHANGE ASSESSMENT',
    subtitle: 'High-Resolution Multispectral Land-Use Conversion & Infrastructure Evaluation (2024–2026)',
    projectName: 'URBAN DEVELOPMENT — CHENNAI INDUSTRIAL CORRIDOR',
    projectId: 'proj-chennai-urban',
    generatedDate: '22 Aug 2026, 17:35 UTC',
    generatedBy: 'Sai Ramesh (Senior Remote Sensing Analyst)',
    classification: 'RESTRICTED / TECHNICAL',
    format: 'PDF',
    analysisCount: 26,
    status: 'Ready',
    fileSizeBytes: '14.2 MB',
    executiveSummary: 'This intelligence brief documents bi-temporal surface transformation across the Oragadam Industrial Corridor. Automated change detection confirms 0.245 km² of agricultural land conversion to industrial warehousing and a 4-lane expansion of the central transit highway.',
    methodology: 'Analysis conducted using harmonized bi-temporal multi-mission imagery (Sentinel-2 & Cartosat-2S) processed via the SatQuery BIT-CD-VQA model with sub-pixel co-registration (RMSE < 0.2 px) and calibrated confidence scoring.',
    keyFindings: [
      'Industrial Infill: 7 primary warehouse distribution centers erected with total roof footprint of 142,000 m²',
      'Transportation Network: Arterial highway cross-section expanded from 14m to 44m with dedicated emergency shoulders',
      'Hydrological Impact: Engineered retention pond capacity increased by 35% to mitigate stormwater surge',
      'Vegetation Canopy: Net reduction of 0.21 km² in active croplands, aligned with master plan zoning'
    ],
    changeStatistics: {
      builtUpGainKm2: 0.245,
      vegetationLossKm2: 0.210,
      waterVariancePercent: 12.4,
      confidenceAverage: 91.8,
    },
    associatedImagery: [MOCK_SATELLITE_IMAGES[2]],
    includedAnalyses: [MOCK_ANALYSIS_PRESETS[1].result, MOCK_ANALYSIS_PRESETS[0].result],
  },
  {
    id: 'rep-002',
    reportNumber: 'REP-2026-08-038',
    title: 'CHENNAI PORT & ESTUARY — OPTICAL & SAR STRUCTURAL INTEGRITY BRIEF',
    subtitle: 'Cross-Modal Radar Backscatter and Multispectral Feature Analysis',
    projectName: 'URBAN DEVELOPMENT — CHENNAI INDUSTRIAL CORRIDOR',
    projectId: 'proj-chennai-urban',
    generatedDate: '19 Aug 2026, 18:50 UTC',
    generatedBy: 'SatQuery Autonomous Geospatial Engine',
    classification: 'INTERNAL USE',
    format: 'PDF',
    analysisCount: 14,
    status: 'Ready',
    fileSizeBytes: '9.8 MB',
    executiveSummary: 'Multimodal assessment combining Cartosat-2S optical reflectance with RISAT-1A C-band synthetic aperture radar to evaluate maritime port infrastructure, metal cladding double-bounce signatures, and water channel navigability.',
    methodology: 'Fused Cross-Modal GeoVLM reasoning with Enhanced Lee speckle filtration and Pauli polarimetric decomposition.',
    keyFindings: [
      'Bridge Structural Health: Consistent double-bounce echo across all 8 reinforced concrete piers',
      'Metallic Warehouses: High radar return (> -3 dB) verifies heavy-duty industrial roofing durability',
      'Channel Navigation: Specular low-backscatter boundary indicates clear waterways without surface debris'
    ],
    changeStatistics: {
      builtUpGainKm2: 0.040,
      vegetationLossKm2: 0.012,
      waterVariancePercent: -2.1,
      confidenceAverage: 88.5,
    },
    associatedImagery: [MOCK_SATELLITE_IMAGES[0], MOCK_SATELLITE_IMAGES[1]],
    includedAnalyses: [MOCK_ANALYSIS_PRESETS[2].result],
  }
];
