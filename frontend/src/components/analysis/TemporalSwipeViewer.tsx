import React, { useRef, useState, useEffect } from 'react';
import { SatelliteImageMeta } from '../../types/imagery';
import { useAnalysis } from '../../context/AnalysisContext';
import { VisualEvidenceOverlay } from './VisualEvidenceOverlay';
import { Calendar, SlidersHorizontal, Sparkles } from 'lucide-react';

interface Props {
  image: SatelliteImageMeta;
}

export const TemporalSwipeViewer: React.FC<Props> = ({ image }) => {
  const { splitPosition, setSplitPosition, layerVisibility, currentResult } = useAnalysis();
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const beforeUrl = image.secondaryImageUrl || image.thumbnailUrl;
  const afterUrl = image.fullImageUrl;
  const changeMaskUrl = image.changeMaskUrl;

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setSplitPosition(percentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setSplitPosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden bg-space-950 flex items-center justify-center"
    >
      {/* T2 (After: 2026) Base Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={afterUrl}
          alt="T2 After State"
          className="w-full h-full object-contain max-w-full max-h-full"
        />
      </div>

      {/* T1 (Before: 2024) Clipped Image via Split Position */}
      <div
        className="absolute inset-0 overflow-hidden flex items-center justify-center"
        style={{ clipPath: `polygon(0 0, ${splitPosition}% 0, ${splitPosition}% 100%, 0 100%)` }}
      >
        <img
          src={beforeUrl}
          alt="T1 Before State"
          className="w-full h-full object-contain max-w-full max-h-full"
        />
      </div>

      {/* Change Mask Overlay (if active) */}
      {layerVisibility.changeMask && changeMaskUrl && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <img
            src={changeMaskUrl}
            alt="Change Mask Overlay"
            className="w-full h-full object-contain max-w-full max-h-full opacity-70 mix-blend-screen"
          />
        </div>
      )}

      {/* Visual Evidence Grounding Bounding Boxes */}
      {currentResult && currentResult.evidenceRegions.length > 0 && (
        <VisualEvidenceOverlay evidenceRegions={currentResult.evidenceRegions} />
      )}

      {/* Draggable Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-geo-cyan z-20 cursor-ew-resize flex items-center justify-center"
        style={{ left: `${splitPosition}%` }}
        onMouseDown={handleMouseDown}
      >
        {/* Split Handle Button */}
        <div className="w-7 h-7 -ml-[13px] rounded-full bg-space-900 border-2 border-geo-cyan text-geo-cyan flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-ew-resize">
          <SlidersHorizontal className="w-3.5 h-3.5 rotate-90" />
        </div>
      </div>

      {/* Top Labels: T1 (Before) vs T2 (After) */}
      <div className="absolute top-4 left-4 z-10 bg-space-900/90 backdrop-blur-md border border-space-border px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 shadow-md">
        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
        <span>BEFORE: 18 JUN 2024 (T1)</span>
      </div>

      <div className="absolute top-4 right-4 z-10 bg-space-900/90 backdrop-blur-md border border-space-border px-2.5 py-1 rounded text-[11px] font-mono text-geo-cyan flex items-center gap-1.5 shadow-md">
        <Calendar className="w-3.5 h-3.5 text-geo-cyan" />
        <span>AFTER: 22 AUG 2026 (T2)</span>
      </div>
    </div>
  );
};
