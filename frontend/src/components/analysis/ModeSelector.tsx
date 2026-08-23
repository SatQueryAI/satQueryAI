import React from 'react';
import { AnalysisMode } from '../../types/imagery';
import { Layers, GitCompare, Radio, Clock, ChevronDown } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const ModeSelector: React.FC = () => {
  const { analysisMode, setAnalysisMode, selectedImage, uploadedImages, setSelectedImage } = useAnalysis();

  const modes: { id: AnalysisMode; label: string; description: string; icon: React.ElementType }[] = [
    {
      id: 'SINGLE_IMAGE',
      label: 'Single Image',
      description: 'Analyze one image',
      icon: Layers,
    },
    {
      id: 'IMAGE_COMPARISON',
      label: 'Compare Images',
      description: 'Compare two time periods',
      icon: GitCompare,
    },
    {
      id: 'OPTICAL_SAR',
      label: 'Optical + SAR',
      description: 'Multi-modal analysis',
      icon: Radio,
    },
    {
      id: 'TEMPORAL_CHANGE',
      label: 'Change Detection',
      description: 'Detect temporal changes',
      icon: Clock,
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
      <div className="text-xs font-semibold text-slate-200">
        Analysis Mode
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {modes.map((m) => {
          const Icon = m.icon;
          const isSelected = analysisMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all border ${
                isSelected
                  ? 'bg-[#0e2238] border-cyan-500/50 text-white shadow-sm'
                  : 'bg-[#0d131f]/60 border-[#1e293b] text-slate-400 hover:text-slate-200 hover:bg-[#0d131f]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-medium leading-tight ${isSelected ? 'text-cyan-200' : 'text-slate-200'}`}>
                    {m.label}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">
                    {m.description}
                  </div>
                </div>
              </div>
              {isSelected && <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

