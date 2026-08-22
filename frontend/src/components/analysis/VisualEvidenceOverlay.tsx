import React from 'react';
import { EvidenceRegion } from '../../types/analysis';
import { useAnalysis } from '../../context/AnalysisContext';

interface Props {
  evidenceRegions: EvidenceRegion[];
}

export const VisualEvidenceOverlay: React.FC<Props> = ({ evidenceRegions }) => {
  const { highlightedEvidenceId, setHighlightedEvidenceId, layerVisibility } = useAnalysis();

  if (!layerVisibility.evidence && !layerVisibility.detection) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {evidenceRegions.map((region) => {
        const [x, y, w, h] = region.bbox;
        const isHighlighted = highlightedEvidenceId === region.id;

        return (
          <div
            key={region.id}
            onClick={(e) => {
              e.stopPropagation();
              setHighlightedEvidenceId(region.id);
            }}
            onMouseEnter={() => setHighlightedEvidenceId(region.id)}
            className="absolute pointer-events-auto cursor-pointer transition-all duration-150 group"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${w}%`,
              height: `${h}%`,
            }}
          >
            {/* Box Border & Corner Reticles */}
            <div
              className={`w-full h-full border-2 transition-all relative ${
                isHighlighted
                  ? 'border-geo-cyan bg-geo-cyan/15 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'border-amber-400/80 bg-amber-400/5 hover:border-geo-cyan hover:bg-geo-cyan/10'
              }`}
            >
              {/* Corner crosshairs */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />

              {/* Tag Label */}
              <div
                className={`absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold whitespace-nowrap flex items-center gap-1 shadow-sm select-none ${
                  isHighlighted
                    ? 'bg-geo-cyan text-space-950'
                    : 'bg-space-900/90 text-amber-300 border border-amber-400/40 group-hover:bg-geo-cyan group-hover:text-space-950'
                }`}
              >
                <span>{`0${region.index}`}</span>
                <span>·</span>
                <span>{region.label}</span>
                <span className="opacity-80">({Math.round(region.confidence * 100)}%)</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
