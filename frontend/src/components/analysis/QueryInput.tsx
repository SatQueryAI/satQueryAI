import React, { useState } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { Send, Mic, X, Sparkles, Terminal } from 'lucide-react';

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
      setCurrentQuery('What changes occurred along the transport corridor?');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative bg-space-850 border border-space-borderLight focus-within:border-geo-cyan/70 focus-within:ring-1 focus-within:ring-geo-cyan/30 rounded-lg overflow-hidden transition-all shadow-inner">
        <textarea
          rows={3}
          value={currentQuery}
          onChange={(e) => setCurrentQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the selected satellite imagery (e.g. 'How many buildings are near the road?')..."
          className="w-full bg-transparent px-3 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none resize-none leading-relaxed font-sans"
        />

        {/* Input Bottom Toolbar */}
        <div className="px-2.5 py-1.5 bg-space-900/90 border-t border-space-border/60 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Clear Button */}
            {currentQuery && (
              <button
                type="button"
                onClick={() => setCurrentQuery('')}
                className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-space-800 transition-colors"
                title="Clear question"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Voice Input Sim */}
            <button
              type="button"
              onClick={toggleVoiceSim}
              className={`p-1 rounded transition-colors ${
                isVoiceActive ? 'text-rose-400 bg-rose-950/50' : 'text-slate-400 hover:text-slate-200 hover:bg-space-800'
              }`}
              title="Voice input simulation"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!currentQuery.trim() || isAnalyzing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
              !currentQuery.trim() || isAnalyzing
                ? 'bg-space-800 text-slate-400 cursor-not-allowed border border-space-border'
                : 'bg-geo-cyan hover:bg-cyan-400 text-space-950 shadow-md shadow-cyan-950/50 active:scale-95'
            }`}
          >
            {isAnalyzing ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-space-950 border-t-transparent animate-spin" />
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
