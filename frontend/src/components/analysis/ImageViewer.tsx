import React, { useRef, useState, useEffect } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { ImageControls } from './ImageControls';
import { VisualEvidenceOverlay } from './VisualEvidenceOverlay';
import { TemporalSwipeViewer } from './TemporalSwipeViewer';
import { OpticalSarViewer } from './OpticalSarViewer';
import { Crosshair, Upload, Compass, Maximize2 } from 'lucide-react';

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
    handleFileUpload,
  } = useAnalysis();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorGeo, setCursorGeo] = useState<{ lat: number; lon: number; px: number; py: number; dn: number }>({
    lat: 13.0827,
    lon: 80.2707,
    px: 1024,
    py: 1024,
    dn: 842,
  });

  // Pan & drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (analysisMode === 'TEMPORAL_CHANGE') return; // Handled by divider
    if (e.button === 0) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      // Calculate approximate coordinate within raster bounding box
      if (selectedImage && selectedImage.coordinates) {
        const [minLon, minLat, maxLon, maxLat] = selectedImage.coordinates.bbox;
        const curLon = minLon + relX * (maxLon - minLon);
        const curLat = maxLat - relY * (maxLat - minLat);
        const px = Math.round(relX * selectedImage.dimensions.width);
        const py = Math.round(relY * selectedImage.dimensions.height);
        const dn = Math.round(300 + (px * 0.4 + py * 0.3) % 700);

        setCursorGeo({
          lat: Number(curLat.toFixed(4)),
          lon: Number(curLon.toFixed(4)),
          px,
          py,
          dn,
        });
      }
    }

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

  if (!selectedImage) {
    return (
      <div className="flex-1 h-full bg-space-950 bg-grid-dense flex flex-col items-center justify-center p-8 select-none">
        <div className="max-w-md w-full bg-space-900/90 border border-space-borderLight rounded-lg p-6 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-space-850 border border-space-border flex items-center justify-center mx-auto text-slate-400">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-semibold text-slate-200 uppercase tracking-wider">
              No Imagery Loaded
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Drop a satellite raster here or select an analysis feed from the left panel.
            </p>
          </div>
          <div className="pt-2 text-[10px] font-mono text-slate-400 border-t border-space-border">
            Supported: GeoTIFF · TIFF · Complex SAR · Multispectral PNG
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative flex-1 h-full bg-space-950 overflow-hidden select-none flex items-center justify-center ${
        layerVisibility.grid ? 'bg-grid-pattern' : ''
      } ${isPanning ? 'cursor-grabbing' : 'cursor-crosshair'}`}
    >
      {/* Top-Left Telemetry Overlay */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none bg-space-900/85 backdrop-blur-md border border-space-border px-2.5 py-1.5 rounded text-[11px] font-mono space-y-0.5 shadow-md">
        <div className="text-geo-cyan font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-geo-cyan animate-pulse"></span>
          <span>{selectedImage.sensor.toUpperCase()}</span>
        </div>
        <div className="text-slate-400 text-[10px]">
          GSD: <span className="text-slate-200">{selectedImage.resolution}</span> · BANDS: <span className="text-slate-200">{selectedImage.bandsCount}</span>
        </div>
      </div>

      {/* Top-Right Raster Resolution Overlay */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none bg-space-900/85 backdrop-blur-md border border-space-border px-2.5 py-1.5 rounded text-[11px] font-mono text-right space-y-0.5 shadow-md">
        <div className="text-slate-200 font-medium">
          {selectedImage.dimensions.width} × {selectedImage.dimensions.height} px
        </div>
        <div className="text-slate-400 text-[10px]">
          {selectedImage.crs.split(' ')[0]}
        </div>
      </div>

      {/* Bottom-Left Live Cursor Coordinates Reticle */}
      {layerVisibility.coordinates && (
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none bg-space-900/85 backdrop-blur-md border border-space-border px-2.5 py-1.5 rounded text-[11px] font-mono flex items-center gap-3 shadow-md text-slate-300">
          <div className="flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-geo-cyan" />
            <span>LAT: <strong className="text-slate-100 font-semibold">{cursorGeo.lat}° N</strong></span>
            <span className="text-slate-400">·</span>
            <span>LON: <strong className="text-slate-100 font-semibold">{cursorGeo.lon}° E</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-2 border-l border-space-border pl-3 text-[10px] text-slate-400">
            <span>PX: [{cursorGeo.px}, {cursorGeo.py}]</span>
            <span>DN: {cursorGeo.dn}</span>
          </div>
        </div>
      )}

      {/* Viewport Canvas Render Switcher */}
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
          {/* Main Raster Render */}
          {layerVisibility.original && (
            <img
              src={selectedImage.fullImageUrl}
              alt={selectedImage.name}
              className="w-full h-full object-contain max-w-full max-h-full drop-shadow-2xl select-none pointer-events-none"
            />
          )}

          {/* Evidence Region Overlays */}
          {currentResult && currentResult.evidenceRegions.length > 0 && (
            <VisualEvidenceOverlay evidenceRegions={currentResult.evidenceRegions} />
          )}
        </div>
      )}

      {/* Floating Canvas Controls */}
      <ImageControls />
    </div>
  );
};
