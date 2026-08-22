import React from 'react';
import { LeftControlPanel } from '../components/analysis/LeftControlPanel';
import { ImageViewer } from '../components/analysis/ImageViewer';
import { RightAnalysisPanel } from '../components/analysis/RightAnalysisPanel';

export const AnalyzePage: React.FC = () => {
  return (
    <div className="flex-1 w-full h-[calc(100vh-3.5rem-1.75rem)] flex overflow-hidden bg-space-950">
      {/* Left Control Panel (280 - 320px) */}
      <LeftControlPanel />

      {/* Main Image Viewport (Center Dominant) */}
      <ImageViewer />

      {/* Right AI Analysis Panel (360 - 400px) */}
      <RightAnalysisPanel />
    </div>
  );
};
