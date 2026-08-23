import React from 'react';
import { Cpu, Globe, Zap, SlidersHorizontal, Hash } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const StatusBar: React.FC = () => {
  const { selectedImage, currentResult } = useAnalysis();

  return (
    <footer className="h-7 bg-[#070b12] border-t border-[#1e293b] px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none z-20 shrink-0">
      {/* Left: Backend, Model, GPU, Latency */}
      <div className="flex items-center gap-5">
        {/* Backend Connected */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-slate-300">Backend:</span>
          <span className="text-emerald-400 font-medium">Connected</span>
        </div>

        {/* Model */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3 h-3 text-slate-400" />
          <span className="text-slate-300">Model:</span>
          <span className="text-cyan-400 font-medium">Remote-Sensing VLM</span>
        </div>

        {/* GPU */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-slate-400" />
          <span className="text-slate-300">GPU:</span>
          <span className="text-emerald-400 font-medium">RTX 4090</span>
        </div>

        {/* Latency */}
        <div className="hidden md:flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-slate-400" />
          <span className="text-slate-300">Latency:</span>
          <span className="text-slate-200">{currentResult?.latencySeconds || 2.38}s</span>
        </div>
      </div>

      {/* Right: CRS & Session */}
      <div className="flex items-center gap-5">
        {/* CRS */}
        <div className="flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-slate-400" />
          <span className="text-slate-400">CRS:</span>
          <span className="text-slate-200 font-medium">{selectedImage?.crs.split(' ')[0] || 'EPSG:4326'}</span>
        </div>

        {/* Session */}
        <div className="flex items-center gap-1.5">
          <Hash className="w-3 h-3 text-slate-400" />
          <span className="text-slate-400">Session:</span>
          <span className="text-slate-200 font-medium">SAT-8F2A</span>
        </div>
      </div>
    </footer>
  );
};

