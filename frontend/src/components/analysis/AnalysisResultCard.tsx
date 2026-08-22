import React from 'react';
import { AnalysisResult } from '../../types/analysis';
import { ConfidenceMeter } from './ConfidenceMeter';
import { QueryClassifierBadge } from './QueryClassifierBadge';
import { EvidenceList } from './EvidenceList';
import { ExecutionTrace } from './ExecutionTrace';
import { CheckCircle, Copy, Download, Share2, Sparkles, PieChart } from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

export const AnalysisResultCard: React.FC<Props> = ({ result }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${result.query}\n\n${result.answerText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {/* Route Classification */}
      <QueryClassifierBadge classification={result.queryType} />

      {/* Main Structured Result Box */}
      <div className="bg-space-850 border border-space-borderLight rounded-lg p-3.5 space-y-3 shadow-md">
        {/* Header Metadata */}
        <div className="flex items-start justify-between border-b border-space-border/60 pb-2">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Analysis Result
            </div>
            <div className="text-xs font-mono text-slate-300 flex items-center gap-2 mt-0.5">
              <span>{result.modelName}</span>
              <span className="text-slate-400">·</span>
              <span className="text-geo-cyan">{result.latencySeconds}s</span>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-space-800 transition-colors"
            title="Copy Result"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Narrative Answer */}
        <div className="text-xs text-slate-100 font-sans leading-relaxed bg-space-900/90 p-3 rounded border border-space-border/80">
          {result.answerText}
        </div>

        {/* Key Findings List */}
        {result.keyFindings && result.keyFindings.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono uppercase font-semibold text-slate-400 block">
              Key Technical Observations:
            </span>
            <ul className="space-y-1 text-xs text-slate-300 font-sans">
              {result.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-geo-cyan mt-1.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Land-Cover Distribution Breakdown */}
        {result.landCoverBreakdown && (
          <div className="space-y-1.5 pt-2 border-t border-space-border/50 font-mono text-[11px]">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-semibold">
              <span>Surface Classification Breakdown</span>
              <PieChart className="w-3 h-3 text-geo-cyan" />
            </div>

            <div className="space-y-1 bg-space-900 p-2 rounded border border-space-border/60">
              {result.landCoverBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-300">{item.category}</span>
                    <span className="text-slate-200 font-semibold">{item.percentage}% ({item.areaKm2} km²)</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-space-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Calibrated Bar */}
        <ConfidenceMeter score={result.confidenceScore} rating={result.confidenceRating} />
      </div>

      {/* Grounding Evidence List */}
      {result.evidenceRegions && result.evidenceRegions.length > 0 && (
        <EvidenceList evidenceRegions={result.evidenceRegions} />
      )}

      {/* Step-by-Step Execution Trace */}
      {result.executionTrace && result.executionTrace.length > 0 && (
        <ExecutionTrace traceSteps={result.executionTrace} />
      )}
    </div>
  );
};
