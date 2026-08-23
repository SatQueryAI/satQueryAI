import React, { useState } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { Send, Mic, X } from 'lucide-react';

export const QueryInput: React.FC = () => {
  const { currentQuery, setCurrentQuery, runAnalysis, isAnalyzing } = useAnalysis();
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuery.trim() || isAnalyzing) return;
    runAnalysis();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleVoiceSim = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setCurrentQuery('How many buildings are visible near the arterial road?');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5">
      <div className="text-xs text-slate-300 font-sans">
        Ask about this imagery
      </div>

      <div className="bg-[#0d131f] border border-[#1e293b] focus-within:border-cyan-500/60 rounded-lg overflow-hidden transition-all shadow-md">
        <textarea
          rows={3}
          value={currentQuery}
          onChange={(e) => setCurrentQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this imagery..."
          className="w-full bg-transparent p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none resize-none leading-relaxed font-sans"
        />

        {/* Input Bottom Toolbar */}
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Clear Button */}
            {currentQuery && (
              <button
                type="button"
                onClick={() => setCurrentQuery('')}
                className="text-slate-400 hover:text-slate-200 transition-colors"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Voice Input Sim */}
            <button
              type="button"
              onClick={toggleVoiceSim}
              className={`transition-colors ${
                isVoiceActive ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Voice Input"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={!currentQuery.trim() || isAnalyzing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !currentQuery.trim() || isAnalyzing
                ? 'bg-[#162032] text-slate-400 cursor-not-allowed border border-[#243247]'
                : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md shadow-cyan-950/40'
            }`}
          >
            {isAnalyzing ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-3 h-3" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

