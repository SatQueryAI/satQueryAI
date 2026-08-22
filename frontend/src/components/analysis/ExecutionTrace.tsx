import React, { useState } from 'react';
import { ExecutionTraceStep } from '../../types/analysis';
import { ChevronDown, ChevronRight, CheckCircle2, Clock, Terminal, Activity, AlertCircle } from 'lucide-react';

interface Props {
  traceSteps: ExecutionTraceStep[];
}

export const ExecutionTrace: React.FC<Props> = ({ traceSteps }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-space-850 border border-space-border rounded overflow-hidden">
      {/* Header Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-space-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-geo-cyan" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-200">
            Pipeline Execution Trace
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-space-900 text-slate-400 rounded border border-space-border">
            {traceSteps.length} Steps
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {/* Trace Timeline */}
      {isExpanded && (
        <div className="p-3 border-t border-space-border/60 space-y-2 font-mono text-[11px]">
          {traceSteps.map((step, idx) => (
            <div key={step.id || idx} className="flex items-start gap-2.5 group">
              <div className="mt-0.5 shrink-0">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : step.status === 'running' ? (
                  <Activity className="w-3.5 h-3.5 text-geo-cyan animate-spin" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span className="font-semibold text-slate-200">{step.stage}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">{step.timestamp}</span>
                    <span className="text-geo-cyan">{step.durationMs}ms</span>
                  </div>
                </div>

                <p className="text-slate-400 text-[10px] mt-0.5 font-sans leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
