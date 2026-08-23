import React from 'react';
import { QueryInput } from './QueryInput';
import { SuggestedQueries } from './SuggestedQueries';
import { AnalysisResultCard } from './AnalysisResultCard';
import { ProcessingOverlay } from './ProcessingOverlay';
import { useAnalysis } from '../../context/AnalysisContext';

export const RightAnalysisPanel: React.FC = () => {
  const { currentResult, isAnalyzing } = useAnalysis();

  return (
    <aside className="w-[360px] h-full bg-[#090e17] border-l border-[#1e293b] flex flex-col shrink-0 overflow-hidden select-none">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e293b] bg-[#090e17]">
        <h2 className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
          AI ANALYSIS
        </h2>
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4">
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

