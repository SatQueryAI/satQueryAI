import React from 'react';
import { MOCK_DATASETS } from '../data/mockDatasets';
import { DatasetTable } from '../components/datasets/DatasetTable';

export const DatasetsPage: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-space-950 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-space-border pb-4">
        <h1 className="text-xl font-bold font-mono text-slate-100 uppercase tracking-tight">
          Remote Sensing Datasets & Benchmarks
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Manage multimodal remote sensing corpora, benchmark ground truth splits, and evaluation matrices.
        </p>
      </div>

      {/* Dataset Table with Detail Viewer */}
      <DatasetTable datasets={MOCK_DATASETS} />
    </div>
  );
};
