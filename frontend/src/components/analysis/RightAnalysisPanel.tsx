import React from 'react';
import { QueryInput } from './QueryInput';
import { SuggestedQueries } from './SuggestedQueries';
import { AnalysisResultCard } from './AnalysisResultCard';
import { ProcessingOverlay } from './ProcessingOverlay';
import { useAnalysis } from '../../context/AnalysisContext';
import { Cpu, Terminal, HelpCircle } from 'lucide-react';

export const RightAnalysisPanel: React.FC = () => {
  const { currentResult, isAnalyzing } = useAnalysis();

  return (
    <aside className="w-96 h-full bg-space-900 border-l border-space-border flex flex-col shrink-0 overflow-hidden select-none">
      {/* Header */}
      <div className="p-3 border-b border-space-border bg-space-900/90 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase">
            AI Analysis
          </h2>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Ask natural-language questions
          </p>
        </div>
        <div className="w-6 h-6 rounded bg-space-850 border border-space-border flex items-center justify-center text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-geo-cyan" />
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {/* Natural Language Query Input */}
        <QueryInput />

        {/* Suggested Quick Questions */}
        {!isAnalyzing && <SuggestedQueries />}

        {/* Real-time Analytical Progress Pipeline */}
        {isAnalyzing && <ProcessingOverlay />}

        {/* Structured Results & Evidence & Execution Trace */}
        {!isAnalyzing && currentResult && (
          <AnalysisResultCard result={currentResult} />
        )}
      </div>
    </aside>
  );
};
