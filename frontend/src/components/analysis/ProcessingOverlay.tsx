import React from 'react';
import { Activity, CheckCircle2, CircleDashed, Cpu } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const ProcessingOverlay: React.FC = () => {
  const { isAnalyzing, analysisStageIndex, analysisStageText } = useAnalysis();

  if (!isAnalyzing) return null;

  const stages = [
    'Image raster validated',
    'Spatial patch preprocessing',
    'Intent classification & pathway routing',
    'Vision-language model inference on GPU',
    'Visual grounding & calibrated confidence',
  ];

  return (
    <div className="bg-space-850 border border-geo-cyan/40 rounded p-3.5 space-y-3 font-mono shadow-xl animate-in fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-geo-cyan animate-spin" />
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Inference Pipeline Active
          </span>
        </div>
        <span className="text-[10px] text-geo-cyan px-2 py-0.5 bg-space-900 rounded border border-geo-cyan/30">
          Stage {analysisStageIndex + 1}/5
        </span>
      </div>

      <p className="text-xs text-slate-300 font-sans italic bg-space-900 p-2 rounded border border-space-border">
        {analysisStageText || 'Executing remote-sensing model pipeline...'}
      </p>

      {/* Checklist Progress */}
      <div className="space-y-1.5 pt-1 text-[11px]">
        {stages.map((stage, idx) => {
          const isDone = idx < analysisStageIndex;
          const isCurrent = idx === analysisStageIndex;
          return (
            <div key={idx} className="flex items-center gap-2">
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <CircleDashed className="w-3.5 h-3.5 text-geo-cyan animate-spin shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className={isDone ? 'text-slate-400' : isCurrent ? 'text-geo-cyan font-semibold' : 'text-slate-400'}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
