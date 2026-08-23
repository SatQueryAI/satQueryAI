import React from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { ArrowRight } from 'lucide-react';

export const SuggestedQueries: React.FC = () => {
  const { setCurrentQuery, runAnalysis } = useAnalysis();

  const suggestions = [
    'What land-cover types are visible?',
    'Identify industrial areas in the scene',
    'Detect changes near the river',
    'What is the dominant land use?',
  ];

  const handleSelect = (query: string) => {
    setCurrentQuery(query);
    runAnalysis(query);
  };

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-300">
        Suggested Questions
      </div>

      <div className="space-y-1.5">
        {suggestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(q)}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#0d131f] hover:bg-[#162032] border border-[#1e293b] hover:border-slate-700 rounded-lg text-left text-xs text-slate-300 hover:text-white transition-all group"
          >
            <span className="truncate pr-2 font-sans">{q}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 shrink-0 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};

