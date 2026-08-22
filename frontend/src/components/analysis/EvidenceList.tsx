import React, { useState } from 'react';
import { EvidenceRegion } from '../../types/analysis';
import { useAnalysis } from '../../context/AnalysisContext';
import { ChevronDown, ChevronRight, Sparkles, MapPin, ExternalLink, Target } from 'lucide-react';

interface Props {
  evidenceRegions: EvidenceRegion[];
}

export const EvidenceList: React.FC<Props> = ({ evidenceRegions }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { highlightedEvidenceId, setHighlightedEvidenceId } = useAnalysis();

  return (
    <div className="bg-space-850 border border-space-border rounded overflow-hidden">
      {/* Header Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-space-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-geo-cyan" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-200">
            Visual Grounding Evidence
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-space-900 text-geo-cyan rounded border border-space-border">
            {evidenceRegions.length} Regions
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {/* Expanded list */}
      {isExpanded && (
        <div className="p-2 border-t border-space-border/60 space-y-1.5 font-mono">
          {evidenceRegions.map((region) => {
            const isHighlighted = highlightedEvidenceId === region.id;
            return (
              <div
                key={region.id}
                onClick={() => setHighlightedEvidenceId(region.id)}
                className={`p-2 rounded cursor-pointer transition-all border ${
                  isHighlighted
                    ? 'bg-space-800 border-geo-cyan text-white shadow-sm'
                    : 'bg-space-900/60 border-space-border/60 text-slate-300 hover:bg-space-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <span className="text-geo-cyan">{`0${region.index}`}</span>
                    <span className="truncate">{region.label}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {Math.round(region.confidence * 100)}%
                  </span>
                </div>

                {region.description && (
                  <p className="text-[11px] text-slate-400 font-sans mt-1 leading-snug">
                    {region.description}
                  </p>
                )}

                {region.areaEstimate && (
                  <div className="mt-1.5 pt-1 border-t border-space-border/40 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Est. Footprint:</span>
                    <span className="text-slate-200">{region.areaEstimate}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
