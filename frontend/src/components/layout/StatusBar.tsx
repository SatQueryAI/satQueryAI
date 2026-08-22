import React from 'react';
import { Activity, Cpu, Database, Globe, Zap, Terminal } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const StatusBar: React.FC = () => {
  const { isAnalyzing, selectedImage, currentResult } = useAnalysis();

  return (
    <footer className="h-7 bg-space-950 border-t border-space-border px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none z-20 shrink-0">
      {/* Left: Backend & Inference status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-300">Backend:</span>
          <span className="text-emerald-400">FastAPI Connected</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 border-l border-space-border pl-4">
          <span className="w-1.5 h-1.5 rounded-full bg-geo-cyan"></span>
          <span className="text-slate-300">Model:</span>
          <span className="text-geo-cyan">Remote-Sensing VLM</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 border-l border-space-border pl-4">
          <Cpu className="w-3 h-3 text-slate-400" />
          <span className="text-slate-300">GPU:</span>
          <span className="text-slate-300">RTX 4090 / CUDA 12.4</span>
        </div>
      </div>

      {/* Center: Realtime Processing Indicator */}
      {isAnalyzing && (
        <div className="hidden lg:flex items-center gap-2 text-geo-cyan animate-pulse">
          <Activity className="w-3 h-3 animate-spin" />
          <span>INFERENCE EXECUTING...</span>
        </div>
      )}

      {/* Right: Latency + Projection + Session */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Latency:</span>
          <span className="text-slate-200">{currentResult ? `${currentResult.latencySeconds}s` : '2.4s'}</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 border-l border-space-border pl-4">
          <Globe className="w-3 h-3 text-slate-400" />
          <span>CRS:</span>
          <span className="text-slate-300">{selectedImage.crs.split(' ')[0]}</span>
        </div>

        <div className="flex items-center gap-1.5 border-l border-space-border pl-4">
          <Terminal className="w-3 h-3 text-slate-400" />
          <span>Session:</span>
          <span className="text-slate-300">SAT-8F2A</span>
        </div>
      </div>
    </footer>
  );
};
