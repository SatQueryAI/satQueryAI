import React, { useState } from 'react';
import { IntelligenceReport } from '../../types/report';
import { ReportViewerModal } from './ReportViewerModal';
import { FileText, Download, Eye, Calendar, FolderKanban, ShieldCheck, Plus } from 'lucide-react';

interface Props {
  reports: IntelligenceReport[];
}

export const ReportList: React.FC<Props> = ({ reports }) => {
  const [activeReport, setActiveReport] = useState<IntelligenceReport | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenReport = (report: IntelligenceReport) => {
    setActiveReport(report);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            onClick={() => handleOpenReport(rep)}
            className="bg-space-850 border border-space-border hover:border-geo-cyan/50 p-4 rounded-lg cursor-pointer transition-all hover:bg-space-800/80 group space-y-3 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="px-2 py-0.5 bg-space-900 text-geo-cyan rounded border border-geo-cyan/30 font-semibold">
                  {rep.reportNumber}
                </span>
                <span className="text-slate-400 text-[10px]">
                  {rep.format} · {rep.fileSizeBytes}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-geo-cyan transition-colors leading-snug">
                  {rep.title}
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                  {rep.executiveSummary}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
                <FolderKanban className="w-3.5 h-3.5 text-geo-cyan shrink-0" />
                <span className="truncate">{rep.projectName}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-space-border/60 flex items-center justify-between font-mono text-xs text-slate-400">
              <span>{rep.generatedDate.split(',')[0]}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenReport(rep);
                  }}
                  className="flex items-center gap-1 text-geo-cyan hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Inspector */}
      <ReportViewerModal
        report={activeReport}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
