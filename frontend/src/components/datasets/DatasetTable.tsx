import React, { useState } from 'react';
import { DatasetEntity, DatasetSample } from '../../types/dataset';
import { SampleViewerModal } from './SampleViewerModal';
import { Database, Eye, CheckCircle, BarChart3, ChevronRight, Layers } from 'lucide-react';

interface Props {
  datasets: DatasetEntity[];
}

export const DatasetTable: React.FC<Props> = ({ datasets }) => {
  const [selectedDataset, setSelectedDataset] = useState<DatasetEntity>(datasets[0]);
  const [activeSample, setActiveSample] = useState<DatasetSample | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleInspectSample = (sample: DatasetSample) => {
    setActiveSample(sample);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Master Datasets Table */}
      <div className="bg-space-850 border border-space-border rounded-lg overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-space-border bg-space-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-geo-cyan" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
              Available Benchmark & Evaluation Catalogs
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {datasets.length} Catalogs Indexed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-space-900 text-slate-400 text-[11px] uppercase border-b border-space-border">
              <tr>
                <th className="px-4 py-2.5">Dataset Corpus</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Total Images</th>
                <th className="px-4 py-2.5">QA Pairs</th>
                <th className="px-4 py-2.5">GSD Resolution</th>
                <th className="px-4 py-2.5">Accuracy</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-border/60 text-slate-300">
              {datasets.map((ds) => {
                const isSelected = selectedDataset.id === ds.id;
                return (
                  <tr
                    key={ds.id}
                    onClick={() => setSelectedDataset(ds)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-space-800 text-white' : 'hover:bg-space-800/60'
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-100">
                      <div>{ds.name}</div>
                      <div className="text-[10px] text-slate-400 font-sans font-normal truncate max-w-xs">
                        {ds.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-space-900 text-geo-cyan rounded border border-geo-cyan/30 text-[10px]">
                        {ds.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{ds.totalImages.toLocaleString()}</td>
                    <td className="px-4 py-3">{ds.totalQuestions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-400">{ds.resolution}</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">{ds.accuracyBenchmark}%</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {ds.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDataset(ds);
                        }}
                        className="px-2.5 py-1 bg-space-900 hover:bg-space-750 text-slate-200 rounded border border-space-border text-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Dataset Detail Inspection Tabs */}
      {selectedDataset && (
        <div className="bg-space-850 border border-space-border rounded-lg p-5 space-y-4">
          <div className="flex items-start justify-between border-b border-space-border/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 font-mono">
                  {selectedDataset.name} — {selectedDataset.fullName}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 rounded">
                  {selectedDataset.license}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                {selectedDataset.description}
              </p>
            </div>
            <div className="text-right font-mono text-xs">
              <div className="text-slate-400 text-[10px]">Disk Footprint</div>
              <div className="text-slate-200 font-semibold">{selectedDataset.sizeDisk}</div>
            </div>
          </div>

          {/* Class Distribution Bars */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase font-semibold text-slate-400">
              Benchmark Class Balance:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedDataset.classes.map((cls, idx) => (
                <div key={idx} className="bg-space-900 p-2.5 rounded border border-space-border/80 font-mono text-xs">
                  <div className="text-slate-300 truncate">{cls.className}</div>
                  <div className="text-slate-100 font-bold mt-1 text-sm">{cls.percentage}%</div>
                  <div className="text-[10px] text-slate-400">{cls.sampleCount.toLocaleString()} samples</div>
                  <div className="w-full h-1 rounded-full bg-space-800 mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cls.percentage}%`, backgroundColor: cls.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Questions Browser */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between font-mono">
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Evaluation QA Verification Samples:
              </span>
              <span className="text-[10px] text-slate-400">Click a sample to inspect model output</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedDataset.samples.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleInspectSample(s)}
                  className="bg-space-900 hover:bg-space-800 p-3 rounded border border-space-border hover:border-geo-cyan/40 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="h-28 rounded bg-black overflow-hidden relative">
                    <img src={s.imageUrl} alt="Sample" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-space-950/80 rounded text-[9px] font-mono text-slate-300">
                      {s.taskType}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200 line-clamp-2 font-sans group-hover:text-geo-cyan transition-colors">
                      "{s.question}"
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center justify-between">
                      <span className="text-emerald-400 font-medium">GT: {s.groundTruthAnswer}</span>
                      <span>{Math.round(s.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inspection Modal */}
      <SampleViewerModal
        dataset={selectedDataset}
        sample={activeSample}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
