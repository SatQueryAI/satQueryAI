import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_PROJECTS } from '../data/mockProjects';
import { useAnalysis } from '../context/AnalysisContext';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Layers, 
  Activity, 
  FileText, 
  Play, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedImage, setAnalysisMode } = useAnalysis();
  const [activeTab, setActiveTab] = useState<'overview' | 'imagery' | 'analyses' | 'changes' | 'reports'>('overview');

  const project = MOCK_PROJECTS.find((p) => p.id === id) || MOCK_PROJECTS[0];

  const handleLaunchAnalysis = () => {
    if (project.imagery.length > 0) {
      setSelectedImage(project.imagery[0]);
      setAnalysisMode(project.defaultMode);
    }
    navigate('/analyze');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-space-950 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Back button & Header */}
      <div className="space-y-3">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-geo-cyan transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-space-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-space-900 text-geo-cyan rounded border border-geo-cyan/30 text-xs font-mono font-semibold">
                {project.code}
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {project.status}
              </span>
            </div>
            <h1 className="text-xl font-bold font-mono text-slate-100 uppercase tracking-tight">
              {project.name}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-geo-cyan" />
                {project.location}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Created {project.createdAt}
              </span>
            </div>
          </div>

          <button
            onClick={handleLaunchAnalysis}
            className="flex items-center gap-2 px-4 py-2 bg-geo-cyan hover:bg-cyan-400 text-space-950 font-mono text-xs font-semibold rounded shadow-md transition-all self-start md:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Open in Workstation</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-space-border font-mono text-xs">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'imagery', label: `Imagery (${project.imageCount})` },
          { id: 'analyses', label: `Analyses (${project.analysesCount})` },
          { id: 'changes', label: `Detected Changes (${project.detectedChangesCount})` },
          { id: 'reports', label: `Reports (${project.reportsCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium transition-all border-b-2 -mb-[1px] ${
              activeTab === tab.id
                ? 'border-geo-cyan text-geo-cyan font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-space-850 p-3.5 rounded-lg border border-space-border font-mono text-xs">
              <span className="text-slate-400 text-[10px] uppercase">Rasters Ingested</span>
              <div className="text-lg font-bold text-slate-100 mt-0.5">{project.imageCount} Files</div>
              <span className="text-[10px] text-geo-cyan">Optical & C-band SAR</span>
            </div>
            <div className="bg-space-850 p-3.5 rounded-lg border border-space-border font-mono text-xs">
              <span className="text-slate-400 text-[10px] uppercase">VQA Queries Run</span>
              <div className="text-lg font-bold text-slate-100 mt-0.5">{project.analysesCount} Analyses</div>
              <span className="text-[10px] text-emerald-400">92.4% Avg Confidence</span>
            </div>
            <div className="bg-space-850 p-3.5 rounded-lg border border-space-border font-mono text-xs">
              <span className="text-slate-400 text-[10px] uppercase">Surface Changes</span>
              <div className="text-lg font-bold text-rose-400 mt-0.5">{project.detectedChangesCount} Zones</div>
              <span className="text-[10px] text-slate-400">+0.24 km² Built-up</span>
            </div>
            <div className="bg-space-850 p-3.5 rounded-lg border border-space-border font-mono text-xs">
              <span className="text-slate-400 text-[10px] uppercase">Generated Briefs</span>
              <div className="text-lg font-bold text-slate-100 mt-0.5">{project.reportsCount} Reports</div>
              <span className="text-[10px] text-geo-cyan">PDF & GeoJSON</span>
            </div>
          </div>

          {/* Description & Objective */}
          <div className="bg-space-850 p-4 rounded-lg border border-space-border space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-300">
              Project Description & Scope
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Recent Analyses List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-300">
              Recent Analytical Results
            </h3>
            <div className="space-y-2">
              {project.recentAnalyses.map((res) => (
                <div
                  key={res.id}
                  onClick={() => navigate('/analyze')}
                  className="bg-space-850 hover:bg-space-800 p-3.5 rounded-lg border border-space-border hover:border-geo-cyan/40 cursor-pointer transition-all flex items-start justify-between gap-4 font-mono text-xs group"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-100 group-hover:text-geo-cyan transition-colors font-sans">
                      "{res.query}"
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="text-geo-cyan">{res.queryType}</span>
                      <span>·</span>
                      <span>{res.timestamp}</span>
                      <span>·</span>
                      <span className="text-emerald-400">Confidence {res.confidenceScore}%</span>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 bg-space-900 text-slate-300 rounded border border-space-border text-xs group-hover:border-geo-cyan/40 transition-colors shrink-0">
                    View in Workspace
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'imagery' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {project.imagery.map((img) => (
            <div key={img.id} className="bg-space-850 border border-space-border rounded-lg p-3 space-y-2.5">
              <div className="h-40 bg-black rounded overflow-hidden flex items-center justify-center">
                <img src={img.thumbnailUrl} alt={img.name} className="w-full h-full object-contain" />
              </div>
              <div className="font-mono text-xs font-semibold text-slate-200 truncate">
                {img.name}
              </div>
              <div className="text-[11px] font-mono text-slate-400 space-y-1">
                <div>Sensor: {img.sensor}</div>
                <div>GSD: {img.resolution} · {img.bandsCount} Bands</div>
                <div>CRS: {img.crs.split(' ')[0]}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analyses' && (
        <div className="space-y-2 font-mono text-xs">
          {project.recentAnalyses.map((res) => (
            <div key={res.id} className="bg-space-850 p-4 rounded-lg border border-space-border space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-geo-cyan font-bold">{res.queryType}</span>
                <span className="text-slate-400">{res.timestamp}</span>
              </div>
              <div className="text-xs font-semibold text-slate-100 font-sans">
                "{res.query}"
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed bg-space-900 p-2.5 rounded border border-space-border">
                {res.answerText}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'changes' && (
        <div className="bg-space-850 p-6 rounded-lg border border-space-border space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-space-border pb-3">
            <span className="text-xs font-bold text-slate-100 uppercase">
              Automated Change Detection Summary (2024–2026)
            </span>
            <span className="text-emerald-400 font-semibold">Sub-pixel RMSE 0.18 px</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-space-900 p-3 rounded border border-space-border">
              <span className="text-[10px] text-slate-400 block">New Impervious Built-Up</span>
              <span className="text-base font-bold text-rose-400">+0.245 km²</span>
            </div>
            <div className="bg-space-900 p-3 rounded border border-space-border">
              <span className="text-[10px] text-slate-400 block">Cropland Conversion</span>
              <span className="text-base font-bold text-amber-400">-0.210 km²</span>
            </div>
            <div className="bg-space-900 p-3 rounded border border-space-border">
              <span className="text-[10px] text-slate-400 block">Reservoir Expansion</span>
              <span className="text-base font-bold text-geo-cyan">+35.2%</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-space-850 p-6 rounded-lg border border-space-border space-y-3 font-mono text-xs">
          <span className="text-xs font-bold text-slate-100 uppercase block">
            Associated Intelligence Reports
          </span>
          <p className="text-xs text-slate-400 font-sans">
            Ready-to-export intelligence documents for this monitoring project.
          </p>
          <Link
            to="/reports"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-geo-cyan text-space-950 font-semibold mt-2"
          >
            <span>View Reports Center</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
