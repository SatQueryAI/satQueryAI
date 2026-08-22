import React, { useState } from 'react';
import { MOCK_ANALYSIS_PRESETS } from '../data/mockAnalyses';
import { useAnalysis } from '../context/AnalysisContext';
import { useNavigate } from 'react-router-dom';
import { History, Search, Filter, Play, Clock, Sparkles, Radio, Scan, ArrowRight } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadPreset } = useAnalysis();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const historyItems = [
    {
      presetId: 'preset-buildings-vqa',
      title: 'How many buildings are visible near the arterial road?',
      project: 'URBAN DEVELOPMENT — CHENNAI INDUSTRIAL CORRIDOR',
      sensor: 'Cartosat-2S (1.2m Optical)',
      type: 'Object Identification & Counting',
      confidence: 89,
      timestamp: 'Today, 17:31 UTC',
      summary: '14 primary commercial and industrial structures localized along highway corridor with 4 grounding boxes extracted.',
    },
    {
      presetId: 'preset-temporal-change',
      title: 'What changed between the 2024 and 2026 imagery in this corridor?',
      project: 'URBAN DEVELOPMENT — CHENNAI INDUSTRIAL CORRIDOR',
      sensor: 'Sentinel-2 & Cartosat-2S Coregistered',
      type: 'Temporal Change Analysis',
      confidence: 93,
      timestamp: 'Today, 16:42 UTC',
      summary: 'Automated change detection confirms +0.24 km² new industrial warehouse park and 4-lane highway expansion.',
    },
    {
      presetId: 'preset-optical-sar',
      title: 'Compare optical and SAR observations for the southern sector.',
      project: 'URBAN DEVELOPMENT — CHENNAI INDUSTRIAL CORRIDOR',
      sensor: 'Cartosat Optical + RISAT-1A SAR',
      type: 'Optical–SAR Reasoning',
      confidence: 88,
      timestamp: 'Yesterday, 15:18 UTC',
      summary: 'Multimodal fusion highlights metallic warehouse dihedral reflections and specular calm water estuary boundary.',
    }
  ];

  const handleOpenAnalysis = (presetId: string) => {
    loadPreset(presetId);
    navigate('/analyze');
  };

  const filteredHistory = historyItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.summary.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'ALL' || item.type.includes(filterType);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-space-950 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-space-border pb-4">
        <h1 className="text-xl font-bold font-mono text-slate-100 uppercase tracking-tight">
          Analysis History & Telemetry Logs
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Review, inspect, and reload previous visual queries and grounded inference results.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-space-850 p-3 rounded-lg border border-space-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search previous queries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-space-900 border border-space-border rounded pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-geo-cyan font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto font-mono text-xs overflow-x-auto">
          <span className="text-slate-400 text-[11px] mr-1">Filter:</span>
          {[
            { id: 'ALL', label: 'All Queries' },
            { id: 'Counting', label: 'Object VQA' },
            { id: 'Change', label: 'Change Analysis' },
            { id: 'SAR', label: 'Optical + SAR' },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setFilterType(flt.id)}
              className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${
                filterType === flt.id
                  ? 'bg-space-800 text-geo-cyan border border-geo-cyan/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredHistory.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleOpenAnalysis(item.presetId)}
            className="bg-space-850 hover:bg-space-800 border border-space-border hover:border-geo-cyan/40 p-4 rounded-lg cursor-pointer transition-all space-y-3 group shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="px-2 py-0.5 bg-space-900 text-geo-cyan rounded border border-geo-cyan/30 font-semibold">
                    {item.type}
                  </span>
                  <span className="text-slate-400">{item.sensor}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-geo-cyan transition-colors font-sans mt-1">
                  "{item.title}"
                </h3>
              </div>

              <div className="text-right font-mono text-xs shrink-0">
                <div className="text-emerald-400 font-bold">{item.confidence}% Confidence</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.timestamp}</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed bg-space-900 p-2.5 rounded border border-space-border/80">
              {item.summary}
            </p>

            <div className="pt-2 border-t border-space-border/60 flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="truncate max-w-md">{item.project}</span>
              <div className="flex items-center gap-1 text-geo-cyan font-medium group-hover:translate-x-0.5 transition-all">
                <span>Load in Workstation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
