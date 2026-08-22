import React, { useState } from 'react';
import { MOCK_REPORTS } from '../data/mockReports';
import { ReportList } from '../components/reports/ReportList';
import { FileText, Plus, Search, Filter } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [search, setSearch] = useState('');

  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) || r.projectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-space-950 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-space-border pb-4">
        <div>
          <h1 className="text-xl font-bold font-mono text-slate-100 uppercase tracking-tight">
            Generated Intelligence Reports
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Compiled Earth Observation briefings, change statistics, and downloadable PDF intelligence packages.
          </p>
        </div>

        <button
          onClick={() => alert('Compiling latest workspace analysis into new Intelligence Brief (PDF)...')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-geo-cyan hover:bg-cyan-400 text-space-950 font-mono text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-space-850 p-3 rounded-lg border border-space-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports by title or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-space-900 border border-space-border rounded pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-geo-cyan font-sans"
          />
        </div>

        <span className="text-xs font-mono text-slate-400">
          {filteredReports.length} Reports Ready
        </span>
      </div>

      {/* Reports List */}
      <ReportList reports={filteredReports} />
    </div>
  );
};
