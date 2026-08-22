import React from 'react';
import { AnalysisMode } from '../../types/imagery';
import { Layers, GitCompare, Radio, Clock, Shield } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const ModeSelector: React.FC = () => {
  const { analysisMode, setAnalysisMode, selectedImage, uploadedImages, setSelectedImage } = useAnalysis();

  const modes: { id: AnalysisMode; label: string; description: string; icon: React.ElementType }[] = [
    {
      id: 'SINGLE_IMAGE',
      label: 'Single Image',
      description: 'Visual QA, feature grounding & land-cover analysis',
      icon: Layers,
    },
    {
      id: 'TEMPORAL_CHANGE',
      label: 'Temporal Change',
      description: 'Bi-temporal comparison & infrastructure change detection',
      icon: Clock,
    },
    {
      id: 'OPTICAL_SAR',
      label: 'Optical + SAR',
      description: 'Multimodal radar backscatter & optical cross-reasoning',
      icon: Radio,
    },
    {
      id: 'IMAGE_COMPARISON',
      label: 'Image Comparison',
      description: 'Synchronized dual-view multi-raster comparison',
      icon: GitCompare,
    },
  ];

  const handleModeChange = (mode: AnalysisMode) => {
    setAnalysisMode(mode);
    if (mode === 'TEMPORAL_CHANGE' && !selectedImage.isPair) {
      const pair = uploadedImages.find((i) => i.isPair);
      if (pair) setSelectedImage(pair);
    } else if (mode === 'OPTICAL_SAR' && selectedImage.modality !== 'SAR') {
      const sarImg = uploadedImages.find((i) => i.modality === 'SAR');
      if (sarImg) setSelectedImage(sarImg);
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
        Analysis Mode
      </div>

      <div className="grid grid-cols-1 gap-1">
        {modes.map((m) => {
          const Icon = m.icon;
          const isSelected = analysisMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={`w-full flex items-start gap-2.5 p-2 rounded text-left transition-all border ${
                isSelected
                  ? 'bg-space-800 border-geo-cyan/50 text-white shadow-sm'
                  : 'bg-space-850/60 border-space-border text-slate-400 hover:text-slate-200 hover:bg-space-800'
              }`}
            >
              <div className={`p-1 rounded shrink-0 ${isSelected ? 'bg-geo-cyan/20 text-geo-cyan' : 'bg-space-900 text-slate-400'}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium leading-tight ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
                  {m.label}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">
                  {m.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
