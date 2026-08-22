import React from 'react';
import { ConfidenceRating } from '../../types/analysis';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface Props {
  score: number; // 0 to 100
  rating: ConfidenceRating;
}

export const ConfidenceMeter: React.FC<Props> = ({ score, rating }) => {
  const getRatingColor = () => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500';
    if (score >= 75) return 'text-geo-cyan bg-geo-cyan';
    if (score >= 50) return 'text-amber-400 bg-amber-500';
    return 'text-rose-400 bg-rose-500';
  };

  const getTrackColor = () => {
    if (score >= 90) return 'bg-emerald-500/20';
    if (score >= 75) return 'bg-geo-cyan/20';
    if (score >= 50) return 'bg-amber-500/20';
    return 'bg-rose-500/20';
  };

  return (
    <div className="bg-space-850 border border-space-border rounded p-2.5 space-y-1.5 font-mono">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[10px] text-slate-400 uppercase font-semibold">
          Confidence Calibrated
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-100">{score}%</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${
            score >= 75 
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50' 
              : 'bg-amber-950/60 text-amber-300 border-amber-700/50'
          }`}>
            {rating}
          </span>
        </div>
      </div>

      {/* Horizontal precision bar */}
      <div className={`w-full h-1.5 rounded-full overflow-hidden ${getTrackColor()}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${getRatingColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
