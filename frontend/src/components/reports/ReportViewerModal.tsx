import React from 'react';
import { IntelligenceReport } from '../../types/report';
import { X, Download, Printer, FileText, CheckCircle2, Shield, Calendar, MapPin } from 'lucide-react';

interface Props {
  report: IntelligenceReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportViewerModal: React.FC<Props> = ({ report, isOpen, onClose }) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-space-900 border border-space-borderLight rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in">
        {/* Top Actions Bar */}
        <div className="px-4 py-3 border-b border-space-border bg-space-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-geo-cyan" />
            <span className="text-xs font-mono font-bold text-slate-100 uppercase">
              {report.reportNumber} — {report.classification}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => alert(`Downloading ${report.reportNumber}.pdf...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-geo-cyan text-space-950 font-semibold hover:bg-cyan-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-space-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Body (Simulating Technical PDF Layout) */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-950 space-y-6 text-slate-200 max-w-3xl mx-auto w-full font-sans border-x border-space-border/40 shadow-inner">
          {/* Document Header Header */}
          <div className="border-b-2 border-geo-cyan pb-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>SATQUERY AI // EARTH OBSERVATION INTELLIGENCE</span>
              <span className="text-geo-cyan font-bold">{report.classification}</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {report.title}
            </h1>
            <p className="text-xs text-slate-300 font-mono">
              {report.subtitle}
            </p>
          </div>

          {/* Metadata Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-space-900 p-3.5 rounded border border-space-border text-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px]">Project:</span>
              <span className="truncate block font-semibold text-white">{report.projectName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Date Generated:</span>
              <span>{report.generatedDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Lead Analyst:</span>
              <span>{report.generatedBy}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Analyses Included:</span>
              <span className="text-emerald-400 font-bold">{report.analysisCount} Verified Runs</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-geo-cyan border-b border-space-border pb-1">
              1. Executive Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-space-900/60 p-3 rounded border border-space-border/60">
              {report.executiveSummary}
            </p>
          </div>

          {/* Quantitative Change Statistics */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-geo-cyan border-b border-space-border pb-1">
              2. Quantitative Surface Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-space-900 p-3 rounded border border-space-border">
                <span className="text-[10px] text-slate-400 block">Built-Up Gain:</span>
                <span className="text-base font-bold text-rose-400">+{report.changeStatistics.builtUpGainKm2} km²</span>
              </div>
              <div className="bg-space-900 p-3 rounded border border-space-border">
                <span className="text-[10px] text-slate-400 block">Cropland Loss:</span>
                <span className="text-base font-bold text-amber-400">-{report.changeStatistics.vegetationLossKm2} km²</span>
              </div>
              <div className="bg-space-900 p-3 rounded border border-space-border">
                <span className="text-[10px] text-slate-400 block">Water Variance:</span>
                <span className="text-base font-bold text-geo-cyan">{report.changeStatistics.waterVariancePercent}%</span>
              </div>
              <div className="bg-space-900 p-3 rounded border border-space-border">
                <span className="text-[10px] text-slate-400 block">Mean Confidence:</span>
                <span className="text-base font-bold text-emerald-400">{report.changeStatistics.confidenceAverage}%</span>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-geo-cyan border-b border-space-border pb-1">
              3. Detailed Grounding Observations
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {report.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-space-900/40 p-2 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-geo-cyan mt-1.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Raster Imagery Figures */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-geo-cyan border-b border-space-border pb-1">
              4. Remote Sensing Raster Figures & Ground Truth Annotations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.associatedImagery.map((img, idx) => (
                <div key={idx} className="space-y-1 bg-space-900 p-2 rounded border border-space-border">
                  <div className="h-40 rounded bg-black overflow-hidden flex items-center justify-center">
                    <img src={img.thumbnailUrl} alt={img.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
                    <span>Fig {idx + 1}: {img.name}</span>
                    <span>{img.resolution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Footer */}
          <div className="border-t border-space-border pt-4 text-center font-mono text-[10px] text-slate-400">
            SatQuery AI Geospatial Engine · End of Official Briefing Report · {report.reportNumber}
          </div>
        </div>
      </div>
    </div>
  );
};
