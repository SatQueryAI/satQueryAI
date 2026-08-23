import React, { createContext, useContext, useState, useEffect } from 'react';
import { SatelliteImageMeta, AnalysisMode, LayerVisibility } from '../types/imagery';
import { AnalysisResult } from '../types/analysis';
import { MOCK_SATELLITE_IMAGES } from '../data/mockImagery';
import { MOCK_ANALYSIS_PRESETS, generateMockAnalysis } from '../data/mockAnalyses';
import { uploadImage, listImages, StorageServiceError, DatabaseServiceError } from '../lib/appwrite';
import { apiService } from '../services/api';

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
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  
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
  handleFileUpload: (file: File) => Promise<void>;
  clearUploadError: () => void;
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
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  // Load persistent uploaded imagery from Appwrite on application startup
  useEffect(() => {
    async function loadPersistedImages() {
      try {
        const persisted = await listImages();
        if (persisted && persisted.length > 0) {
          const appMetaList = persisted.map((p) => p.appMeta);
          setUploadedImages((prev) => {
            const combined = [...appMetaList, ...prev.filter((m) => !appMetaList.some((a) => a.id === m.id))];
            return combined;
          });
          setSelectedImage(appMetaList[0]);
        }
      } catch (err) {
        console.warn('Could not load persisted images from Appwrite:', err);
      }
    }
    loadPersistedImages();
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

  const clearUploadError = () => {
    setUploadError(null);
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
    setIsAnalyzing(true);
    setCurrentResult(null);

    const stages = [
      'Ingesting raster tile and verifying Coordinate Reference System (CRS)...',
      'Routing query to multi-spectral attention & spectral index engine...',
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

  /**
   * Complete Appwrite upload flow:
   * 1. Validate file format (.tif, .tiff, .png, .jpg, .jpeg)
   * 2. Upload binary directly to Appwrite Storage (bucket: 6a8ac4580027071eb467)
   * 3. Create metadata document in Appwrite Database (database: 6a8ac43a0027d3534c2c)
   * 4. Update UI with the persistent Appwrite image reference
   */
  const handleFileUpload = async (file: File) => {
    if (isUploading) return; // Prevent duplicate concurrent uploads

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // 1. Upload to Appwrite Storage & Database
      const appwriteResult = await uploadImage(file, {
        onProgress: (percent) => setUploadProgress(percent),
      });

      let finalMeta: SatelliteImageMeta = appwriteResult.appMeta;

      // 2. Also optionally notify FastAPI backend if running (graceful fallback)
      try {
        const backendRes = await apiService.uploadImage(file);
        if (backendRes) {
          finalMeta = {
            ...finalMeta,
            resolution: `${backendRes.resolution} m GSD`,
            dimensions: { width: backendRes.width, height: backendRes.height },
            bandsCount: backendRes.bands,
            sensor: backendRes.sensor || finalMeta.sensor,
            crs: backendRes.crs || finalMeta.crs,
          };
        }
      } catch {
        // Backend optional for pure client Appwrite upload
      }

      setUploadedImages((prev) => [finalMeta, ...prev]);
      setSelectedImage(finalMeta);
      resetViewport();
    } catch (err: any) {
      console.error('Imagery upload failed:', err);
      let userFriendlyMessage = 'Unable to upload imagery.\nPlease try again.';

      if (err instanceof StorageServiceError) {
        userFriendlyMessage = err.message;
      } else if (err instanceof DatabaseServiceError) {
        userFriendlyMessage = err.message;
      } else if (err?.message) {
        userFriendlyMessage = err.message;
      }

      setUploadError(userFriendlyMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
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
        isUploading,
        uploadProgress,
        uploadError,
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
        clearUploadError,
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
