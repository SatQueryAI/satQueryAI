import React from 'react';
import { LayerVisibility } from '../../types/imagery';
import { Eye, EyeOff, Layers, Crosshair, Grid, Scan, Sparkles, Map } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const LayerPanel: React.FC = () => {
  const { layerVisibility, toggleLayer } = useAnalysis();

  const layers: { key: keyof LayerVisibility; label: string; icon: React.ElementType }[] = [
    { key: 'original', label: 'Original Imagery', icon: Layers },
    { key: 'evidence', label: 'Visual Evidence', icon: Sparkles },
    { key: 'detection', label: 'Detection BBoxes', icon: Scan },
    { key: 'changeMask', label: 'Change Mask / Heatmap', icon: Map },
    { key: 'grid', label: 'UTM / MGRS Grid', icon: Grid },
    { key: 'coordinates', label: 'Coordinate Reticle', icon: Crosshair },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
          Layers
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          {Object.values(layerVisibility).filter(Boolean).length} Active
        </span>
      </div>

      <div className="bg-space-850 border border-space-border rounded p-1 divide-y divide-space-border/50">
        {layers.map((l) => {
          const Icon = l.icon;
          const isVisible = layerVisibility[l.key];
          return (
            <div
              key={l.key}
              onClick={() => toggleLayer(l.key)}
              className="flex items-center justify-between px-2.5 py-1.5 hover:bg-space-800 rounded cursor-pointer transition-colors text-xs select-none"
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${isVisible ? 'text-geo-cyan' : 'text-slate-400'}`} />
                <span className={`font-mono text-[11px] ${isVisible ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                  {l.label}
                </span>
              </div>
              <button
                className={`p-1 rounded ${isVisible ? 'text-geo-cyan' : 'text-slate-400 hover:text-slate-400'}`}
              >
                {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
