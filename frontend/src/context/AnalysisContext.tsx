import React, { createContext, useContext, useState, useEffect } from 'react';
import { SatelliteImageMeta, AnalysisMode, LayerVisibility } from '../types/imagery';
import { AnalysisResult } from '../types/analysis';
import { MOCK_SATELLITE_IMAGES } from '../data/mockImagery';
import { MOCK_ANALYSIS_PRESETS, generateMockAnalysis } from '../data/mockAnalyses';

interface AnalysisContextType {
  selectedImage: SatelliteImageMeta;
  uploadedImages: SatelliteImageMeta[];
  analysisMode: AnalysisMode;
  layerVisibility: LayerVisibility;
  currentQuery: string;
  isAnalyzing: boolean;
  analysisStageIndex: number;
  analysisStageText: string;
  currentResult: AnalysisResult | null;
  highlightedEvidenceId: string | null;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  splitPosition: number;
  sarViewMode: 'OPTICAL' | 'SAR' | 'FUSED';
  commandPaletteOpen: boolean;
  
  setSelectedImage: (image: SatelliteImageMeta) => void;
  setAnalysisMode: (mode: AnalysisMode) => void;
  toggleLayer: (layerKey: keyof LayerVisibility) => void;
  setCurrentQuery: (query: string) => void;
  runAnalysis: (customQuery?: string) => Promise<void>;
  setHighlightedEvidenceId: (id: string | null) => void;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  setPanOffset: (offset: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  resetViewport: () => void;
  setSplitPosition: (pos: number) => void;
  setSarViewMode: (mode: 'OPTICAL' | 'SAR' | 'FUSED') => void;
  setCommandPaletteOpen: (open: boolean) => void;
  loadPreset: (presetId: string) => void;
  handleFileUpload: (file: File) => void;
}

const defaultLayers: LayerVisibility = {
  original: true,
  evidence: true,
  detection: true,
  changeMask: true,
  grid: true,
  coordinates: true,
  segmentation: false,
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedImages, setUploadedImages] = useState<SatelliteImageMeta[]>(MOCK_SATELLITE_IMAGES);
  const [selectedImage, setSelectedImage] = useState<SatelliteImageMeta>(MOCK_SATELLITE_IMAGES[0]);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('SINGLE_IMAGE');
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>(defaultLayers);
  const [currentQuery, setCurrentQuery] = useState<string>('How many buildings are visible near the arterial road?');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStageIndex, setAnalysisStageIndex] = useState<number>(0);
  const [analysisStageText, setAnalysisStageText] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(MOCK_ANALYSIS_PRESETS[0].result);
  const [highlightedEvidenceId, setHighlightedEvidenceId] = useState<string | null>('ev-01');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [sarViewMode, setSarViewMode] = useState<'OPTICAL' | 'SAR' | 'FUSED'>('OPTICAL');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleLayer = (layerKey: keyof LayerVisibility) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const resetViewport = () => {
    setZoomLevel(100);
    setPanOffset({ x: 0, y: 0 });
  };

  const loadPreset = (presetId: string) => {
    const preset = MOCK_ANALYSIS_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const img = uploadedImages.find((i) => i.id === preset.imageId) || uploadedImages[0];
      setSelectedImage(img);
      setAnalysisMode(preset.mode);
      setCurrentQuery(preset.query);
      setCurrentResult(preset.result);
      if (preset.result.evidenceRegions.length > 0) {
        setHighlightedEvidenceId(preset.result.evidenceRegions[0].id);
      }
      resetViewport();
    }
  };

  const runAnalysis = async (customQuery?: string) => {
    const queryToExecute = customQuery || currentQuery;
    if (!queryToExecute.trim()) return;

    setIsAnalyzing(true);
    setCurrentResult(null);

    const stages = [
      'Validating GeoTIFF raster & CRS projection...',
      'Partitioning spatial patches & radiometric normalization...',
      'Classifying query intent & selecting vision-language pathway...',
      'Executing Remote-Sensing VLM inference on GPU...',
      'Extracting visual grounding coordinates & calibrating confidence...',
    ];

    for (let i = 0; i < stages.length; i++) {
      setAnalysisStageIndex(i);
      setAnalysisStageText(stages[i]);
      await new Promise((res) => setTimeout(res, 450 + Math.random() * 200));
    }

    // Check if matches known preset or generate dynamic
    const preset = MOCK_ANALYSIS_PRESETS.find(
      (p) => p.query.toLowerCase() === queryToExecute.toLowerCase() && p.imageId === selectedImage.id
    );

    const finalResult = preset ? preset.result : generateMockAnalysis(queryToExecute, selectedImage, analysisMode);

    setCurrentResult(finalResult);
    setIsAnalyzing(false);
    if (finalResult.evidenceRegions.length > 0) {
      setHighlightedEvidenceId(finalResult.evidenceRegions[0].id);
    }
  };

  const handleFileUpload = (file: File) => {
    const newImage: SatelliteImageMeta = {
      id: `img-user-${Date.now()}`,
      name: file.name.toUpperCase(),
      filename: file.name,
      sensor: file.name.toLowerCase().includes('sar') ? 'Custom SAR Instrument' : 'Custom Multispectral Raster',
      platform: 'User Upload / Airborne Platform',
      modality: file.name.toLowerCase().includes('sar') ? 'SAR' : 'OPTICAL',
      acquisitionDate: new Date().toISOString().split('T')[0],
      acquisitionTime: '12:00:00 UTC',
      resolution: '0.8 m GSD',
      dimensions: { width: 2048, height: 2048 },
      bandsCount: 4,
      bandsList: [
        { name: 'Band 1 (Red)', description: 'Surface reflectance' },
        { name: 'Band 2 (Green)', description: 'Vegetation spectrum' },
        { name: 'Band 3 (Blue)', description: 'Coastal / Water' },
        { name: 'Band 4 (NIR)', description: 'Biomass index' },
      ],
      crs: 'EPSG:4326 (WGS 84)',
      coordinates: {
        lat: 13.0500,
        lon: 80.2500,
        bbox: [80.22, 13.03, 80.28, 13.07],
        locationName: 'User Ingested Imagery Tile',
      },
      thumbnailUrl: URL.createObjectURL(file),
      fullImageUrl: URL.createObjectURL(file),
      fileSizeBytes: `${(file.size / (1024 * 1024)).toFixed(1)} MB (GeoTIFF)`,
    };

    setUploadedImages((prev) => [newImage, ...prev]);
    setSelectedImage(newImage);
    resetViewport();
  };

  return (
    <AnalysisContext.Provider
      value={{
        selectedImage,
        uploadedImages,
        analysisMode,
        layerVisibility,
        currentQuery,
        isAnalyzing,
        analysisStageIndex,
        analysisStageText,
        currentResult,
        highlightedEvidenceId,
        zoomLevel,
        panOffset,
        splitPosition,
        sarViewMode,
        commandPaletteOpen,
        setSelectedImage,
        setAnalysisMode,
        toggleLayer,
        setCurrentQuery,
        runAnalysis,
        setHighlightedEvidenceId,
        setZoomLevel,
        setPanOffset,
        resetViewport,
        setSplitPosition,
        setSarViewMode,
        setCommandPaletteOpen,
        loadPreset,
        handleFileUpload,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
