import React from 'react';
import { LayerVisibility } from '../../types/imagery';
import { Eye, EyeOff, Layers, Sparkles, Map, Grid, RotateCcw } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const LayerPanel: React.FC = () => {
  const { layerVisibility, toggleLayer, resetViewport } = useAnalysis();

  const layers: { key: keyof LayerVisibility; label: string; icon: React.ElementType }[] = [
    { key: 'original', label: 'Original Imagery', icon: Layers },
    { key: 'evidence', label: 'Annotations', icon: Sparkles },
    { key: 'segmentation', label: 'Land Cover', icon: Map },
    { key: 'changeMask', label: 'Change Mask', icon: Layers },
    { key: 'grid', label: 'Grid', icon: Grid },
  ];

  return (
    <div className="space-y-2 pt-1">
      <div className="text-xs font-semibold text-slate-200">
        Layers
      </div>

      <div className="space-y-1">
        {layers.map((l) => {
          const Icon = l.icon;
          const isVisible = layerVisibility[l.key];
          return (
            <div
              key={l.key}
              onClick={() => toggleLayer(l.key)}
              className="flex items-center justify-between px-2.5 py-1.5 hover:bg-[#0d131f] rounded-lg cursor-pointer transition-colors text-xs select-none group"
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-3.5 h-3.5 ${isVisible ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className={`text-xs ${isVisible ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                  {l.label}
                </span>
              </div>
              <button
                className={`p-1 rounded ${isVisible ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`}
              >
                {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Reset View Button */}
      <button
        onClick={resetViewport}
        className="w-full mt-3 py-1.5 px-3 bg-[#0d131f] hover:bg-[#162032] border border-[#1e293b] hover:border-slate-700 rounded-lg text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all shadow-sm"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset View</span>
      </button>
    </div>
  );
};

