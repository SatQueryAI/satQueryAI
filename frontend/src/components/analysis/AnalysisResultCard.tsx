import React, { useState } from 'react';
import { AnalysisResult } from '../../types/analysis';
import { EvidenceList } from './EvidenceList';
import { ExecutionTrace } from './ExecutionTrace';
import { ChevronDown, ChevronRight, FileText, Clock } from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

export const AnalysisResultCard: React.FC<Props> = ({ result }) => {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);

  return (
    <div className="space-y-3 pt-1">
      {/* Main Analysis Result Card */}
      <div className="bg-[#0d131f] border border-[#1e293b] rounded-lg p-3.5 space-y-3 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-100">
            Analysis Result
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded">
            Completed
          </span>
        </div>

        {/* Narrative Text */}
        <div className="text-xs text-slate-200 font-sans leading-relaxed">
          {result.answerText}
        </div>

        {/* 2x2 Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1e293b]/80">
          {/* Confidence */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-slate-400 font-sans">
              Confidence
            </div>
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>{result.confidenceScore || 87}%</span>
              <span className="text-emerald-400 font-medium text-[11px]">{result.confidenceRating || 'High'}</span>
            </div>
            {/* Cyan progress bar */}
            <div className="w-full h-1 bg-[#1e293b] rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: `${result.confidenceScore || 87}%` }}
              />
            </div>
          </div>

          {/* Analysis Type */}
          <div className="space-y-0.5">
            <div className="text-[10px] text-slate-400 font-sans">
              Analysis Type
            </div>
            <div className="text-xs font-semibold text-slate-100 truncate">
              {result.queryType === 'Object Identification & Counting' ? 'Object Counting' : result.queryType}
            </div>
          </div>

          {/* Model */}
          <div className="space-y-0.5">
            <div className="text-[10px] text-slate-400 font-sans">
              Model
            </div>
            <div className="text-xs font-semibold text-slate-100 truncate">
              Remote-Sensing VLM
            </div>
          </div>

          {/* Processing Time */}
          <div className="space-y-0.5">
            <div className="text-[10px] text-slate-400 font-sans">
              Processing Time
            </div>
            <div className="text-xs font-semibold text-slate-100">
              {result.latencySeconds || 2.38}s
            </div>
          </div>
        </div>
      </div>

      {/* Accordion: Evidence */}
      <div className="bg-[#0d131f] border border-[#1e293b] rounded-lg overflow-hidden">
        <button
          onClick={() => setEvidenceOpen(!evidenceOpen)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Evidence ({result.evidenceRegions?.length || 3} regions)</span>
          </div>
          {evidenceOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </button>
        {evidenceOpen && (
          <div className="p-3 border-t border-[#1e293b] bg-[#090e17]">
            <EvidenceList evidenceRegions={result.evidenceRegions} />
          </div>
        )}
      </div>

      {/* Accordion: Execution Trace */}
      <div className="bg-[#0d131f] border border-[#1e293b] rounded-lg overflow-hidden">
        <button
          onClick={() => setTraceOpen(!traceOpen)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Execution Trace ({result.executionTrace?.length || 5} steps)</span>
          </div>
          {traceOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </button>
        {traceOpen && (
          <div className="p-3 border-t border-[#1e293b] bg-[#090e17]">
            <ExecutionTrace traceSteps={result.executionTrace} />
          </div>
        )}
      </div>
    </div>
  );
};

