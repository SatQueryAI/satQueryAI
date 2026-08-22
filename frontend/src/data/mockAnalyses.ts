import { AnalysisResult, QueryClassification } from '../types/analysis';

export interface PreconfiguredAnalysisPreset {
  id: string;
  imageId: string;
  query: string;
  mode: 'SINGLE_IMAGE' | 'IMAGE_COMPARISON' | 'OPTICAL_SAR' | 'TEMPORAL_CHANGE';
  result: AnalysisResult;
}

export const MOCK_ANALYSIS_PRESETS: PreconfiguredAnalysisPreset[] = [
  {
    id: 'preset-buildings-vqa',
    imageId: 'img-cartosat-01',
    query: 'How many buildings are visible near the arterial road?',
    mode: 'SINGLE_IMAGE',
    result: {
      id: 'res-vqa-001',
      imageId: 'img-cartosat-01',
      query: 'How many buildings are visible near the arterial road?',
      queryType: 'Object Identification & Counting',
      modelName: 'Remote-Sensing VLM (RS-Llama-Geo-9B)',
      modelVersion: 'v2.4-fp16-cu124',
      timestamp: '17:31:42 UTC',
      latencySeconds: 2.38,
      confidenceScore: 89,
      confidenceRating: 'High',
      answerText: 'Approximately 14 commercial and industrial buildings are identified in close proximity to the central arterial road corridor. The structures consist of 5 high-density commercial blocks in the northern sector and 9 large-footprint industrial warehouse units in the southern logistics hub.',
      keyFindings: [
        '14 primary building structures verified along the transport corridor',
        'Average footprint area of industrial units: 18,200 m²',
        'Direct road ingress/egress confirmed via 2 access ramps',
        'Minimal setback distance: 42 meters from highway median'
      ],
      evidenceRegions: [
        {
          id: 'ev-01',
          index: 1,
          label: 'Commercial Complex Block A',
          category: 'building',
          bbox: [53, 10, 20, 12],
          confidence: 0.94,
          areaEstimate: '14,500 m²',
          description: 'Multi-story concrete office structure with reflective flat roof.',
        },
        {
          id: 'ev-02',
          index: 2,
          label: 'Northern Commercial Cluster B',
          category: 'building',
          bbox: [75, 12, 18, 14],
          confidence: 0.91,
          areaEstimate: '16,200 m²',
          description: 'High-density commercial building with paved parking perimeter.',
        },
        {
          id: 'ev-03',
          index: 3,
          label: 'Logistics Warehouse Bay 1',
          category: 'building',
          bbox: [10, 64, 25, 15],
          confidence: 0.96,
          areaEstimate: '24,000 m²',
          description: 'Long-span metallic warehouse with high specular roof signature.',
        },
        {
          id: 'ev-04',
          index: 4,
          label: 'Arterial Highway Bridge Crossing',
          category: 'infrastructure',
          bbox: [32, 40, 10, 10],
          confidence: 0.88,
          areaEstimate: '3,200 m²',
          description: 'Reinforced concrete bridge structure spanning the natural estuary channel.',
        }
      ],
      landCoverBreakdown: [
        { category: 'Agricultural / Vegetation', percentage: 48.5, areaKm2: 2.03, color: '#445c37' },
        { category: 'Built-up / Impervious', percentage: 32.1, areaKm2: 1.34, color: '#94a3b8' },
        { category: 'Waterbody / Estuary', percentage: 14.8, areaKm2: 0.62, color: '#143b4d' },
        { category: 'Bare Soil / Sandbar', percentage: 4.6, areaKm2: 0.19, color: '#786d52' },
      ],
      executionTrace: [
        {
          id: 'tr-1',
          stepNumber: 1,
          timestamp: '17:31:39.104',
          stage: 'Image Ingestion & CRS Validation',
          status: 'completed',
          description: 'Raster validated: 2048x2048x4 GeoTIFF (EPSG:4326), Radiometric calibration verified.',
          durationMs: 180,
        },
        {
          id: 'tr-2',
          stepNumber: 2,
          timestamp: '17:31:39.284',
          stage: 'Spatial Patch Preprocessing',
          status: 'completed',
          description: 'Tiled into 512x512 sub-patches with 15% overlap; Top-of-Atmosphere (TOA) reflectance adjusted.',
          durationMs: 240,
        },
        {
          id: 'tr-3',
          stepNumber: 3,
          timestamp: '17:31:39.524',
          stage: 'Intent Classification & Routing',
          status: 'completed',
          description: 'Classified query as [Object Identification & Counting] (Confidence: 98.4%). Routed to VLM + Grounding Head.',
          durationMs: 110,
        },
        {
          id: 'tr-4',
          stepNumber: 4,
          timestamp: '17:31:39.634',
          stage: 'Vision-Language Model Inference',
          status: 'completed',
          description: 'Executed RS-Llama-Geo-9B transformer backbone on NVIDIA RTX 4090 (Batch size: 4).',
          durationMs: 1420,
        },
        {
          id: 'tr-5',
          stepNumber: 5,
          timestamp: '17:31:41.054',
          stage: 'Visual Grounding & Bounding Box Extraction',
          status: 'completed',
          description: 'Detected 4 primary bounding regions with IoU threshold 0.65. Extracted geo-coordinates.',
          durationMs: 310,
        },
        {
          id: 'tr-6',
          stepNumber: 6,
          timestamp: '17:31:41.364',
          stage: 'Confidence Calibration & Synthesis',
          status: 'completed',
          description: 'Synthesized structured natural-language telemetry report. Confidence calibrated at 89.2%.',
          durationMs: 116,
        }
      ]
    }
  },
  {
    id: 'preset-temporal-change',
    imageId: 'img-temporal-chennai-pair',
    query: 'What changed between the 2024 and 2026 imagery in this corridor?',
    mode: 'TEMPORAL_CHANGE',
    result: {
      id: 'res-temporal-002',
      imageId: 'img-temporal-chennai-pair',
      query: 'What changed between the 2024 and 2026 imagery in this corridor?',
      queryType: 'Temporal Change Analysis',
      modelName: 'Bi-Temporal Change Transformer (BIT-CD-VQA)',
      modelVersion: 'v1.8-coreg',
      timestamp: '16:42:15 UTC',
      latencySeconds: 3.12,
      confidenceScore: 93,
      confidenceRating: 'Very High',
      answerText: 'Significant anthropogenic infrastructure transformation detected between June 2024 and August 2026. A 0.24 km² agricultural zone in the central sector has been converted into a high-capacity industrial logistics park with 7 warehouse units. Additionally, the arterial highway underwent a 4-lane expansion with newly engineered asphalt and an upgraded retention reservoir.',
      keyFindings: [
        'Net Built-up Expansion: +0.245 km² (+18.4% increase over baseline)',
        'Agricultural Land Conversion: -0.210 km² converted to impervious surfaces',
        'Roadway Capacity: Expanded from 2-lane rural roadway (14m) to 6-lane divided corridor (44m)',
        'Stormwater Retention: Retention pond expanded by +35% with engineered embankment'
      ],
      evidenceRegions: [
        {
          id: 'ev-temp-01',
          index: 1,
          label: 'Industrial Logistics Mega-Park',
          category: 'change',
          bbox: [4, 38, 92, 26],
          confidence: 0.97,
          areaEstimate: '245,000 m²',
          description: 'Full conversion of former agricultural parcels to industrial warehouse and freight hub.',
        },
        {
          id: 'ev-temp-02',
          index: 2,
          label: 'Expressway Multi-Lane Widening',
          category: 'change',
          bbox: [0, 48, 100, 8],
          confidence: 0.95,
          areaEstimate: '44,000 m²',
          description: 'Corridor widened with dedicated median and emergency shoulder paving.',
        },
        {
          id: 'ev-temp-03',
          index: 3,
          label: 'Engineered Stormwater Reservoir',
          category: 'water',
          bbox: [72, 72, 22, 18],
          confidence: 0.91,
          areaEstimate: '18,500 m²',
          description: 'Retention pond perimeter deepened and stabilized for industrial runoff management.',
        }
      ],
      landCoverBreakdown: [
        { category: 'Remaining Agriculture', percentage: 54.2, areaKm2: 2.27, color: '#445c37' },
        { category: 'New Industrial / Impervious', percentage: 38.6, areaKm2: 1.62, color: '#f43f5e' },
        { category: 'Retention Basin / Water', percentage: 7.2, areaKm2: 0.30, color: '#06b6d4' },
      ],
      executionTrace: [
        {
          id: 'tr-t1',
          stepNumber: 1,
          timestamp: '16:42:11.890',
          stage: 'Bi-Temporal Co-Registration',
          status: 'completed',
          description: 'Sub-pixel co-registration aligned T1 (2024) and T2 (2026) rasters (RMSE: 0.18 pixels).',
          durationMs: 420,
        },
        {
          id: 'tr-t2',
          stepNumber: 2,
          timestamp: '16:42:12.310',
          stage: 'Difference Feature Extraction',
          status: 'completed',
          description: 'Extracted NDVI differential (ΔNDVI: -0.42) and Normalized Difference Built-Up Index (ΔNDBI: +0.58).',
          durationMs: 380,
        },
        {
          id: 'tr-t3',
          stepNumber: 3,
          timestamp: '16:42:12.690',
          stage: 'Query Classification → Temporal Change',
          status: 'completed',
          description: 'Query classified as [Temporal Change Analysis]. Activated BIT-CD-VQA model.',
          durationMs: 90,
        },
        {
          id: 'tr-t4',
          stepNumber: 4,
          timestamp: '16:42:12.780',
          stage: 'Change Mask Segmentation Head',
          status: 'completed',
          description: 'Generated binary and multi-class change polygon masks with confidence threshold 0.80.',
          durationMs: 1650,
        },
        {
          id: 'tr-t5',
          stepNumber: 5,
          timestamp: '16:42:14.430',
          stage: 'Telemetry & Narrative Synthesis',
          status: 'completed',
          description: 'Compiled quantitative area statistics and visual evidence markers.',
          durationMs: 580,
        }
      ]
    }
  },
  {
    id: 'preset-optical-sar',
    imageId: 'img-risat-01',
    query: 'Compare optical and SAR observations for the southern sector.',
    mode: 'OPTICAL_SAR',
    result: {
      id: 'res-sar-003',
      imageId: 'img-risat-01',
      query: 'Compare optical and SAR observations for the southern sector.',
      queryType: 'Optical–SAR Reasoning',
      modelName: 'Cross-Modal GeoVLM (SAR-Opt-Fusion-8B)',
      modelVersion: 'v1.4-dualpol',
      timestamp: '15:18:04 UTC',
      latencySeconds: 2.85,
      confidenceScore: 88,
      confidenceRating: 'High',
      answerText: 'Multimodal cross-fusion reveals distinct complementary features. The optical imagery delineates surface spectral reflectance showing paved surfaces and roof colorations, whereas the C-band SAR backscatter shows intense double-bounce dihedral reflections (> -3 dB) on the metallic warehouse facades and highway bridge truss, penetrating haze and confirming metallic structural integrity.',
      keyFindings: [
        'Metallic Building Signature: High radar backscatter (VV/VH ratio 4.2 dB) confirms metal cladding',
        'Water Specular Reflection: River channel exhibits zero backscatter (< -24 dB), indicating smooth water surface',
        'Bridge Superstructure: Double-bounce radar signature confirms steel reinforced piers',
        'Vegetation Roughness: Moderate cross-polarization backscatter in surrounding agricultural zone'
      ],
      evidenceRegions: [
        {
          id: 'ev-sar-01',
          index: 1,
          label: 'Metallic Warehouse Double-Bounce',
          category: 'sar_anomaly',
          bbox: [12, 65, 30, 25],
          confidence: 0.95,
          areaEstimate: '32,000 m²',
          description: 'Strong dihedral reflection between vertical warehouse walls and horizontal ground plane.',
        },
        {
          id: 'ev-sar-02',
          index: 2,
          label: 'Specular Water Boundary (Low dB)',
          category: 'water',
          bbox: [0, 32, 100, 18],
          confidence: 0.98,
          areaEstimate: '1.2 km²',
          description: 'Calm water surface acts as specular mirror, sending radar energy away from sensor.',
        },
        {
          id: 'ev-sar-03',
          index: 3,
          label: 'Bridge Structural Radar Echo',
          category: 'infrastructure',
          bbox: [33, 40, 10, 8],
          confidence: 0.92,
          areaEstimate: '3,800 m²',
          description: 'Strong linear radar response along the bridge expansion joints and railings.',
        }
      ],
      executionTrace: [
        {
          id: 'tr-s1',
          stepNumber: 1,
          timestamp: '15:18:01.120',
          stage: 'Multi-Modal Co-Registration',
          status: 'completed',
          description: 'Radiometric calibration of RISAT-1A SAR Sigma-0 backscatter with Cartosat optical RGB.',
          durationMs: 390,
        },
        {
          id: 'tr-s2',
          stepNumber: 2,
          timestamp: '15:18:01.510',
          stage: 'Speckle Filtering & Polarimetry',
          status: 'completed',
          description: 'Applied Enhanced Lee Filter (7x7 window); Decomposed Pauli polarimetric channels.',
          durationMs: 440,
        },
        {
          id: 'tr-s3',
          stepNumber: 3,
          timestamp: '15:18:01.950',
          stage: 'Cross-Attention Multimodal Reasoning',
          status: 'completed',
          description: 'Fused optical feature map with SAR backscatter tensor in Cross-Modal GeoVLM.',
          durationMs: 1720,
        },
        {
          id: 'tr-s4',
          stepNumber: 4,
          timestamp: '15:18:03.670',
          stage: 'Evidence Synthesis & Output',
          status: 'completed',
          description: 'Identified complementary structural attributes and generated technical comparison report.',
          durationMs: 300,
        }
      ]
    }
  }
];

// Fallback generator for arbitrary queries
export function generateMockAnalysis(query: string, imageMeta: any, mode: string): AnalysisResult {
  const queryLower = query.toLowerCase();
  const timestamp = new Date().toISOString().substring(11, 19) + ' UTC';

  let queryType: QueryClassification = 'Visual Question Answering';
  if (queryLower.includes('change') || queryLower.includes('before') || queryLower.includes('difference') || mode === 'TEMPORAL_CHANGE') {
    queryType = 'Temporal Change Analysis';
  } else if (queryLower.includes('sar') || queryLower.includes('radar') || queryLower.includes('backscatter') || mode === 'OPTICAL_SAR') {
    queryType = 'Optical–SAR Reasoning';
  } else if (queryLower.includes('how many') || queryLower.includes('count') || queryLower.includes('number of')) {
    queryType = 'Object Identification & Counting';
  } else if (queryLower.includes('land cover') || queryLower.includes('vegetation') || queryLower.includes('classify')) {
    queryType = 'Land-Cover Interpretation';
  }

  return {
    id: `res-${Date.now()}`,
    imageId: imageMeta.id,
    query: query,
    queryType: queryType,
    modelName: 'Remote-Sensing VLM (RS-Llama-Geo-9B)',
    modelVersion: 'v2.4-fp16-cu124',
    timestamp: timestamp,
    latencySeconds: 2.14,
    confidenceScore: 87,
    confidenceRating: 'High',
    answerText: `Analysis for "${query}": The remote sensing scene over ${imageMeta.coordinates.locationName} demonstrates distinctive geospatial patterns. Key features have been localized and cross-referenced against the raster band signatures.`,
    keyFindings: [
      `Primary localized structures align with ${imageMeta.sensor} resolution (${imageMeta.resolution})`,
      `Radiometric consistency verified across ${imageMeta.bandsCount} spectral channels`,
      `Spatial coordinates anchored at EPSG:4326 (${imageMeta.coordinates.lat.toFixed(4)}° N, ${imageMeta.coordinates.lon.toFixed(4)}° E)`,
      `No atmospheric occlusion or significant cloud degradation detected`
    ],
    evidenceRegions: [
      {
        id: `ev-dyn-1`,
        index: 1,
        label: 'Primary Detected Feature',
        category: 'infrastructure',
        bbox: [25, 20, 35, 25],
        confidence: 0.91,
        areaEstimate: '19,400 m²',
        description: 'High spatial confidence feature verified by vision-language attention.',
      },
      {
        id: `ev-dyn-2`,
        index: 2,
        label: 'Secondary Feature Cluster',
        category: 'vegetation',
        bbox: [60, 55, 25, 20],
        confidence: 0.85,
        areaEstimate: '12,800 m²',
        description: 'Vegetative cluster showing consistent spectral response.',
      }
    ],
    landCoverBreakdown: [
      { category: 'Vegetation / Forest', percentage: 51.0, areaKm2: 2.14, color: '#445c37' },
      { category: 'Built-up / Roads', percentage: 34.2, areaKm2: 1.43, color: '#94a3b8' },
      { category: 'Waterbody', percentage: 14.8, areaKm2: 0.62, color: '#143b4d' },
    ],
    executionTrace: [
      {
        id: 'tr-d1',
        stepNumber: 1,
        timestamp: `${timestamp.slice(0, 8)}.105`,
        stage: 'Image Ingestion & Validation',
        status: 'completed',
        description: `Raster metadata verified: ${imageMeta.filename} (${imageMeta.resolution})`,
        durationMs: 140,
      },
      {
        id: 'tr-d2',
        stepNumber: 2,
        timestamp: `${timestamp.slice(0, 8)}.245`,
        stage: 'Query Classification & Feature Extraction',
        status: 'completed',
        description: `Classified as [${queryType}]. Extracted spatial embeddings.`,
        durationMs: 220,
      },
      {
        id: 'tr-d3',
        stepNumber: 3,
        timestamp: `${timestamp.slice(0, 8)}.465`,
        stage: 'Vision-Language Model Inference',
        status: 'completed',
        description: 'Executed RS-Llama-Geo-9B transformer backbone on GPU.',
        durationMs: 1540,
      },
      {
        id: 'tr-d4',
        stepNumber: 4,
        timestamp: `${timestamp.slice(0, 8)}.005`,
        stage: 'Evidence Localization & Result Synthesis',
        status: 'completed',
        description: 'Synthesized response and calibrated confidence at 87.4%.',
        durationMs: 240,
      }
    ]
  };
}
