import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Crosshair, Ruler } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

interface Props {
  onToggleFullscreen?: () => void;
}

export const ImageControls: React.FC<Props> = ({ onToggleFullscreen }) => {
  const { zoomLevel, setZoomLevel, resetViewport } = useAnalysis();

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  return (
    <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 bg-space-900/90 backdrop-blur-md border border-space-borderLight rounded p-1 shadow-lg text-slate-300">
      <button
        onClick={handleZoomOut}
        className="p-1.5 hover:bg-space-800 hover:text-white rounded transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <div className="px-2 py-0.5 text-xs font-mono font-medium text-slate-200 min-w-[52px] text-center select-none">
        {zoomLevel}%
      </div>

      <button
        onClick={handleZoomIn}
        className="p-1.5 hover:bg-space-800 hover:text-white rounded transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-space-border mx-1" />

      <button
        onClick={resetViewport}
        className="p-1.5 hover:bg-space-800 hover:text-geo-cyan rounded transition-colors"
        title="Reset Zoom & Pan"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 hover:bg-space-800 hover:text-white rounded transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
