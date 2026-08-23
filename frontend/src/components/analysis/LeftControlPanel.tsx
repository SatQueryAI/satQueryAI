import React from 'react';
import { ImageUploader } from './ImageUploader';
import { ModeSelector } from './ModeSelector';
import { LayerPanel } from './LayerPanel';

export const LeftControlPanel: React.FC = () => {
  return (
    <aside className="w-[280px] h-full bg-[#090e17] border-r border-[#1e293b] flex flex-col shrink-0 overflow-hidden select-none">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-[#1e293b] bg-[#090e17]">
        <h2 className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
          INPUT & CONFIGURATION
        </h2>
      </div>

      {/* Scrollable Controls */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Input Imagery & Upload */}
        <ImageUploader />

        {/* Mode Selector */}
        <ModeSelector />

        {/* Layer Controls & Reset View */}
        <LayerPanel />
      </div>
    </aside>
  );
};

