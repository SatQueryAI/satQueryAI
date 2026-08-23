import React, { useRef, useState, useEffect } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { VisualEvidenceOverlay } from './VisualEvidenceOverlay';
import { TemporalSwipeViewer } from './TemporalSwipeViewer';
import { OpticalSarViewer } from './OpticalSarViewer';
import { Plus, Minus, Layers, Crosshair, Maximize2, Database, HardDrive, Cpu, Radio } from 'lucide-react';

export const ImageViewer: React.FC = () => {
  const {
    selectedImage,
    analysisMode,
    layerVisibility,
    zoomLevel,
    setZoomLevel,
    panOffset,
    setPanOffset,
    currentResult,
    resetViewport,
    toggleLayer,
  } = useAnalysis();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);

  // Reset image error state whenever selected image changes
  useEffect(() => {
    setImageError(false);
  }, [selectedImage?.id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (analysisMode === 'TEMPORAL_CHANGE') return;
    if (e.button === 0) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 15 : -15;
    setZoomLevel((prev) => Math.max(50, Math.min(400, prev + zoomDelta)));
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 20, 400));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 20, 50));

  if (!selectedImage) return null;

  const isTiff = selectedImage.filename.toLowerCase().endsWith('.tif') || selectedImage.filename.toLowerCase().endsWith('.tiff');
  const shouldShowTiffFallback = imageError || (isTiff && !selectedImage.fullImageUrl.startsWith('data:image/svg'));

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative flex-1 h-full bg-[#070b12] overflow-hidden select-none flex items-center justify-center ${
        layerVisibility.grid ? 'bg-grid-pattern' : ''
      } ${isPanning ? 'cursor-grabbing' : 'cursor-crosshair'}`}
    >
      {/* Top-Left Metadata HUD Card */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto bg-[#0d131f]/90 backdrop-blur-md border border-[#1e293b] px-3 py-2 rounded-lg text-xs font-mono shadow-xl space-y-0.5">
        <div className="text-white font-bold tracking-wide flex items-center gap-2">
          <span>{selectedImage.sensor.toUpperCase()}</span>
          {selectedImage.id.startsWith('img_') || selectedImage.id.length >= 10 ? (
            <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1 py-0.2 rounded">
              APPWRITE
            </span>
          ) : null}
        </div>
        <div className="text-slate-400 text-[11px]">
          {selectedImage.resolution} • {selectedImage.bandsCount} Bands • {selectedImage.dimensions.width} × {selectedImage.dimensions.height}
        </div>
        <div className="text-slate-400 text-[11px]">
          Acquired: {selectedImage.acquisitionDate || '17 Aug 2026'} &nbsp;&nbsp; {selectedImage.crs.split(' ')[0]}
        </div>
      </div>

      {/* Top-Right Vertical Map Controls Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 bg-[#0d131f]/90 backdrop-blur-md border border-[#1e293b] p-1 rounded-lg shadow-xl text-slate-300">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-[#1a2538] hover:text-white rounded transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-[#1a2538] hover:text-white rounded transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => toggleLayer('original')}
          className="p-2 hover:bg-[#1a2538] hover:text-white rounded transition-colors"
          title="Toggle Layers"
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          onClick={resetViewport}
          className="p-2 hover:bg-[#1a2538] hover:text-geo-cyan rounded transition-colors"
          title="Recenter"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              containerRef.current?.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className="p-2 hover:bg-[#1a2538] hover:text-white rounded transition-colors"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Satellite Imagery Viewport */}
      {analysisMode === 'TEMPORAL_CHANGE' && selectedImage.isPair ? (
        <TemporalSwipeViewer image={selectedImage} />
      ) : analysisMode === 'OPTICAL_SAR' ? (
        <OpticalSarViewer image={selectedImage} />
      ) : (
        <div
          className="relative w-full h-full flex items-center justify-center p-4 transition-transform duration-75 origin-center"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel / 100})`,
          }}
        >
          {/* Main Satellite Raster */}
          {layerVisibility.original && (
            shouldShowTiffFallback ? (
              /* Requirement 9: Remote sensing raster uploaded fallback card for TIFF/GeoTIFF */
              <div className="max-w-md w-full bg-[#0d131f]/95 border border-[#1e293b] rounded-xl p-6 shadow-2xl text-center space-y-4 backdrop-blur-md">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-semibold">
                    Remote sensing raster uploaded
                  </div>
                  <div className="text-base font-bold text-slate-100 font-mono mt-1 break-all">
                    {selectedImage.filename}
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-2 text-left text-xs bg-[#070b12] p-3 rounded-lg border border-[#1e293b] font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">SENSOR</span>
                    <span className="text-slate-200 font-semibold">{selectedImage.sensor}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">MODALITY</span>
                    <span className="text-emerald-400 font-semibold uppercase">{selectedImage.modality}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">DIMENSIONS</span>
                    <span className="text-slate-200">{selectedImage.dimensions.width} × {selectedImage.dimensions.height} px</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">SPATIAL RESOLUTION</span>
                    <span className="text-slate-200">{selectedImage.resolution}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">CRS</span>
                    <span className="text-slate-200">{selectedImage.crs}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">STORAGE SIZE</span>
                    <span className="text-slate-200">{selectedImage.fileSizeBytes}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-sans flex items-center justify-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Stored securely in Appwrite Storage & Database</span>
                </div>
              </div>
            ) : (
              <img
                src={selectedImage.fullImageUrl}
                alt={selectedImage.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-contain max-w-full max-h-full drop-shadow-2xl select-none pointer-events-none rounded"
              />
            )
          )}

          {/* Evidence Region Overlays (Bounding boxes with colored pill tags) */}
          {currentResult && currentResult.evidenceRegions.length > 0 && (
            <VisualEvidenceOverlay evidenceRegions={currentResult.evidenceRegions} />
          )}
        </div>
      )}

      {/* Bottom-Left Scale Bar */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-[#0d131f]/80 backdrop-blur-sm border border-[#1e293b] px-2.5 py-1 rounded text-[11px] font-mono text-slate-300">
        <span>200 m</span>
        <div className="w-12 h-1.5 border-b-2 border-l-2 border-r-2 border-slate-300"></div>
      </div>

      {/* Bottom-Center Coordinates Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-[#0d131f]/90 backdrop-blur-md border border-[#1e293b] px-3 py-1 rounded-full text-xs font-mono text-slate-300 shadow-md">
        13.0827° N, 80.2787° E
      </div>

      {/* Bottom-Right Overview / Mini-map Inset */}
      <div className="absolute bottom-4 right-4 z-20 w-36 h-24 bg-[#0d131f]/90 backdrop-blur-md border border-[#1e293b] rounded-lg overflow-hidden shadow-2xl p-1">
        <div className="relative w-full h-full bg-black rounded overflow-hidden flex items-center justify-center">
          {shouldShowTiffFallback ? (
            <div className="text-[9px] font-mono text-cyan-400/80 text-center p-1">
              GeoTIFF Raster
            </div>
          ) : (
            <img
              src={selectedImage.thumbnailUrl}
              alt="Overview"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover opacity-75"
            />
          )}
          {/* Yellow Viewport Boundary Box */}
          <div
            className="absolute border-2 border-[#facc15] bg-[#facc15]/10 pointer-events-none"
            style={{
              left: '25%',
              top: '20%',
              width: '50%',
              height: '55%',
            }}
          />
        </div>
      </div>
    </div>
  );
};
