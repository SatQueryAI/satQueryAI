import React from 'react';
import { DatasetEntity, DatasetSample } from '../../types/dataset';
import { X, CheckCircle, HelpCircle, Sparkles, Database, Layers } from 'lucide-react';

interface Props {
  dataset: DatasetEntity;
  sample: DatasetSample | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SampleViewerModal: React.FC<Props> = ({ dataset, sample, isOpen, onClose }) => {
  if (!isOpen || !sample) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-space-900 border border-space-borderLight rounded-lg shadow-2xl overflow-hidden animate-in fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-space-border bg-space-850">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-geo-cyan" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
              Benchmark Sample Inspection — {dataset.name}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 font-mono text-xs">
          {/* Sample Raster View */}
          <div className="w-full h-64 bg-black rounded border border-space-border overflow-hidden relative flex items-center justify-center">
            <img
              src={sample.imageUrl}
              alt={sample.imageFilename}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-2 left-2 bg-space-900/90 px-2 py-0.5 rounded text-[10px] text-slate-300 border border-space-border">
              {sample.imageFilename} · {sample.split} Split
            </div>
          </div>

          {/* QA Comparison Card */}
          <div className="space-y-2.5 bg-space-850 p-3.5 rounded border border-space-border">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Question Prompt:
              </span>
              <div className="text-xs font-semibold text-slate-100 mt-0.5 font-sans">
                "{sample.question}"
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-space-border/60">
              {/* Ground Truth */}
              <div className="bg-space-900 p-2.5 rounded border border-slate-700/60">
                <div className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Ground Truth Reference</span>
                </div>
                <div className="text-xs text-slate-200 mt-1 font-sans font-medium">
                  {sample.groundTruthAnswer}
                </div>
              </div>

              {/* Model Predicted */}
              <div className="bg-space-900 p-2.5 rounded border border-geo-cyan/40">
                <div className="text-[10px] text-geo-cyan font-semibold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>SatQuery Model Prediction</span>
                </div>
                <div className="text-xs text-slate-200 mt-1 font-sans font-medium">
                  {sample.modelPredictedAnswer}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
              <span>Task Category: <strong className="text-slate-200">{sample.taskType}</strong></span>
              <span className="text-emerald-400 font-semibold">Evaluation Confidence: {Math.round(sample.confidence * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-2.5 bg-space-850 border-t border-space-border flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-space-800 hover:bg-space-750 text-slate-200 text-xs font-mono font-medium"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
