import React from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const SuggestedQueries: React.FC = () => {
  const { selectedImage, analysisMode, setCurrentQuery, runAnalysis } = useAnalysis();

  const getSuggestedList = () => {
    if (analysisMode === 'TEMPORAL_CHANGE') {
      return [
        'What changed between the 2024 and 2026 imagery in this corridor?',
        'Calculate new impervious built-up area expansion',
        'Identify agricultural parcels converted to industrial use',
        'Assess road widening and infrastructure improvements'
      ];
    }
    if (analysisMode === 'OPTICAL_SAR') {
      return [
        'Compare optical and SAR observations for the southern sector.',
        'Identify metallic structures exhibiting high radar double-bounce',
        'Delineate specular calm water boundaries in SAR backscatter',
        'Assess cloud/haze penetration comparison over the coastline'
      ];
    }
    return [
      'How many buildings are visible near the arterial road?',
      'What land-cover types are visible in this scene?',
      'Identify critical transportation and bridge infrastructure',
      'Assess vegetative canopy health and biomass distribution'
    ];
  };

  const suggestions = getSuggestedList();

  const handleSelect = (query: string) => {
    setCurrentQuery(query);
    runAnalysis(query);
  };

  return (
    <div className="space-y-1.5 font-mono">
      <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-semibold">
        <Sparkles className="w-3 h-3 text-geo-cyan" />
        <span>Suggested Questions</span>
      </div>

      <div className="flex flex-col gap-1">
        {suggestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(q)}
            className="flex items-center justify-between px-2.5 py-1.5 bg-space-850 hover:bg-space-800 border border-space-border/80 hover:border-geo-cyan/40 rounded text-left text-xs text-slate-300 hover:text-white transition-all group"
          >
            <span className="truncate pr-2 font-sans">{q}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-geo-cyan shrink-0 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};
