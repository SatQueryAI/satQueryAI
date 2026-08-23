import React from 'react';
import { EvidenceRegion } from '../../types/analysis';
import { useAnalysis } from '../../context/AnalysisContext';

interface Props {
  evidenceRegions: EvidenceRegion[];
}

export const VisualEvidenceOverlay: React.FC<Props> = ({ evidenceRegions }) => {
  const { highlightedEvidenceId, setHighlightedEvidenceId, layerVisibility } = useAnalysis();

  if (!layerVisibility.evidence && !layerVisibility.detection) return null;

  const getColorStyles = (color?: string, category?: string) => {
    const c = color || (category === 'infrastructure' ? 'cyan' : category === 'vegetation' ? 'emerald' : 'amber');
    
    if (c === 'cyan') {
      return {
        border: 'border-[#06b6d4]',
        bg: 'bg-[#06b6d4]/10',
        pill: 'bg-[#06b6d4] text-slate-950',
        glow: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]',
      };
    }
    if (c === 'emerald') {
      return {
        border: 'border-[#22c55e]',
        bg: 'bg-[#22c55e]/10',
        pill: 'bg-[#22c55e] text-slate-950',
        glow: 'shadow-[0_0_15px_rgba(34,197,94,0.4)]',
      };
    }
    return {
      border: 'border-[#facc15]',
      bg: 'bg-[#facc15]/10',
      pill: 'bg-[#facc15] text-slate-950',
      glow: 'shadow-[0_0_15px_rgba(250,204,21,0.4)]',
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {evidenceRegions.map((region) => {
        const [x, y, w, h] = region.bbox;
        const isHighlighted = highlightedEvidenceId === region.id;
        const styles = getColorStyles(region.badgeColor, region.category);

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
            {/* Box Border */}
            <div
              className={`w-full h-full border-2 transition-all relative ${styles.border} ${styles.bg} ${
                isHighlighted ? `${styles.glow} ring-1 ring-white/40` : ''
              }`}
            >
              {/* Tag Pill Badge (Top Left of Box) */}
              {region.label && (
                <div
                  className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap flex items-center gap-1.5 shadow-md select-none transition-transform group-hover:scale-105 ${styles.pill}`}
                >
                  <span>{region.label}</span>
                  <span className="font-extrabold text-[9px] px-1 py-0.2 bg-black/20 rounded">
                    {Math.round(region.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

