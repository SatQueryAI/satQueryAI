import React from 'react';
import { SatelliteImageMeta } from '../../types/imagery';
import { useAnalysis } from '../../context/AnalysisContext';
import { VisualEvidenceOverlay } from './VisualEvidenceOverlay';
import { Radio, Eye, Sparkles } from 'lucide-react';
import { OPTICAL_SCENE_1_SVG, SAR_SCENE_1_SVG } from '../../data/mockImagery';

interface Props {
  image: SatelliteImageMeta;
}

export const OpticalSarViewer: React.FC<Props> = ({ image }) => {
  const { sarViewMode, setSarViewMode, currentResult } = useAnalysis();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-space-950 overflow-hidden select-none">
      {/* Top Modal Switcher Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-space-900/90 backdrop-blur-md border border-space-borderLight rounded p-1 shadow-lg">
        <button
          onClick={() => setSarViewMode('OPTICAL')}
          className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
            sarViewMode === 'OPTICAL'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Optical RGB (1.2m)
        </button>
        <button
          onClick={() => setSarViewMode('SAR')}
          className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
            sarViewMode === 'SAR'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          SAR C-band (VV/VH)
        </button>
        <button
          onClick={() => setSarViewMode('FUSED')}
          className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
            sarViewMode === 'FUSED'
              ? 'bg-purple-950/80 text-purple-300 border border-purple-700/60 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Fused Multimodal
        </button>
      </div>

      {/* Visual Canvas */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {sarViewMode === 'OPTICAL' && (
          <img
            src={OPTICAL_SCENE_1_SVG}
            alt="Optical Sensor View"
            className="w-full h-full object-contain max-w-full max-h-full"
          />
        )}

        {sarViewMode === 'SAR' && (
          <img
            src={SAR_SCENE_1_SVG}
            alt="SAR C-band Sensor View"
            className="w-full h-full object-contain max-w-full max-h-full"
          />
        )}

        {sarViewMode === 'FUSED' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={OPTICAL_SCENE_1_SVG}
              alt="Base Optical"
              className="w-full h-full object-contain max-w-full max-h-full"
            />
            <img
              src={SAR_SCENE_1_SVG}
              alt="SAR Overlay"
              className="absolute inset-0 w-full h-full object-contain max-w-full max-h-full opacity-60 mix-blend-screen"
            />
          </div>
        )}

        {/* Evidence Overlays */}
        {currentResult && currentResult.evidenceRegions.length > 0 && (
          <VisualEvidenceOverlay evidenceRegions={currentResult.evidenceRegions} />
        )}
      </div>
    </div>
  );
};
