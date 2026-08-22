import React from 'react';
import { QueryClassification } from '../../types/analysis';
import { Sparkles, Cpu, Clock, Radio, Scan, Layers } from 'lucide-react';

interface Props {
  classification: QueryClassification;
}

export const QueryClassifierBadge: React.FC<Props> = ({ classification }) => {
  const getIcon = () => {
    switch (classification) {
      case 'Temporal Change Analysis':
        return Clock;
      case 'Optical–SAR Reasoning':
        return Radio;
      case 'Visual Grounding':
        return Scan;
      default:
        return Cpu;
    }
  };

  const Icon = getIcon();

  return (
    <div className="bg-space-850/90 border border-space-borderLight rounded p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded bg-geo-cyan/15 text-geo-cyan">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 block leading-none">
            Query Classification
          </span>
          <span className="text-xs font-mono font-semibold text-slate-100 mt-0.5 block">
            {classification}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-space-800 text-geo-cyan rounded border border-geo-cyan/30">
        Active Route
      </span>
    </div>
  );
};
