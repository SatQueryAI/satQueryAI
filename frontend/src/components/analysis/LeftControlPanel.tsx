import React from 'react';
import { ImageUploader } from './ImageUploader';
import { UploadedImageCard } from './UploadedImageCard';
import { ModeSelector } from './ModeSelector';
import { LayerPanel } from './LayerPanel';
import { MetadataPanel } from './MetadataPanel';
import { useAnalysis } from '../../context/AnalysisContext';

export const LeftControlPanel: React.FC = () => {
  const { selectedImage } = useAnalysis();

  return (
    <aside className="w-80 h-full bg-space-900 border-r border-space-border flex flex-col shrink-0 overflow-hidden select-none">
      {/* Panel Header */}
      <div className="p-3 border-b border-space-border bg-space-900/90">
        <h2 className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase">
          Analysis Controls
        </h2>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
          Configure imagery & analytical modes
        </p>
      </div>

      {/* Scrollable controls */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Upload & Raster selection */}
        <ImageUploader />

        {/* Selected Image Specs Card */}
        {selectedImage && <UploadedImageCard image={selectedImage} />}

        {/* Mode Selector */}
        <ModeSelector />

        {/* Layer Controls */}
        <LayerPanel />

        {/* Technical Metadata Details */}
        {selectedImage && <MetadataPanel image={selectedImage} />}
      </div>
    </aside>
  );
};
