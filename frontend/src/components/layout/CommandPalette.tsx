import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Layers, 
  FolderKanban, 
  History, 
  Database, 
  FileText, 
  Settings, 
  Upload, 
  Zap, 
  X 
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, runAnalysis, setAnalysisMode, setSelectedImage, uploadedImages } = useAnalysis();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!commandPaletteOpen) {
      setSearchTerm('');
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const actions = [
    {
      category: 'Navigation',
      items: [
        { label: 'Go to Analyze Workspace', icon: Layers, action: () => { navigate('/analyze'); setCommandPaletteOpen(false); } },
        { label: 'Go to Projects', icon: FolderKanban, action: () => { navigate('/projects'); setCommandPaletteOpen(false); } },
        { label: 'Go to Analysis History', icon: History, action: () => { navigate('/history'); setCommandPaletteOpen(false); } },
        { label: 'Go to Datasets Catalog', icon: Database, action: () => { navigate('/datasets'); setCommandPaletteOpen(false); } },
        { label: 'Go to Generated Reports', icon: FileText, action: () => { navigate('/reports'); setCommandPaletteOpen(false); } },
        { label: 'Go to System Settings', icon: Settings, action: () => { navigate('/settings'); setCommandPaletteOpen(false); } },
      ]
    },
    {
      category: 'Analysis Modes',
      items: [
        { label: 'Switch to Single Image VQA', icon: Zap, action: () => { setAnalysisMode('SINGLE_IMAGE'); navigate('/analyze'); setCommandPaletteOpen(false); } },
        { label: 'Switch to Temporal Change Analysis', icon: Zap, action: () => { setAnalysisMode('TEMPORAL_CHANGE'); navigate('/analyze'); setCommandPaletteOpen(false); } },
        { label: 'Switch to Optical + SAR Reasoning', icon: Zap, action: () => { setAnalysisMode('OPTICAL_SAR'); navigate('/analyze'); setCommandPaletteOpen(false); } },
      ]
    },
    {
      category: 'Preloaded Datasets',
      items: uploadedImages.map(img => ({
        label: `Load Raster: ${img.name} (${img.sensor})`,
        icon: Upload,
        action: () => {
          setSelectedImage(img);
          navigate('/analyze');
          setCommandPaletteOpen(false);
        }
      }))
    }
  ];

  const filteredActions = actions.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-space-900 border border-space-borderLight rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-space-border bg-space-850">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search commands, layers, actions, or jump to page..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none font-mono"
          />
          <button 
            onClick={() => setCommandPaletteOpen(false)}
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-space-border/50">
          {filteredActions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-mono">
              No matching commands found
            </div>
          ) : (
            filteredActions.map((group, gIdx) => (
              <div key={gIdx} className="py-2 first:pt-0 last:pb-0">
                <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider px-2.5 mb-1.5">
                  {group.category}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item, iIdx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={iIdx}
                        onClick={item.action}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs text-slate-300 hover:text-white hover:bg-space-800 text-left transition-colors font-medium group"
                      >
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-geo-cyan transition-colors" />
                        <span className="flex-1">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-space-950 border-t border-space-border flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Use ↑ ↓ to navigate</span>
          <span>ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
