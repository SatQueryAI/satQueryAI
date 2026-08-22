import React from 'react';
import { SatelliteImageMeta } from '../../types/imagery';
import { Eye, Trash2, Layers, MapPin, Radio, Calendar } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

interface Props {
  image: SatelliteImageMeta;
}

export const UploadedImageCard: React.FC<Props> = ({ image }) => {
  const { resetViewport } = useAnalysis();

  return (
    <div className="bg-space-850 border border-space-border rounded p-3 space-y-2.5">
      {/* Header Info */}
      <div className="flex items-start gap-2.5">
        <div className="w-12 h-12 rounded overflow-hidden bg-black shrink-0 border border-slate-700 shadow-inner">
          <img src={image.thumbnailUrl} alt={image.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-xs font-semibold text-slate-100 truncate">
            {image.name}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded border ${
              image.modality === 'OPTICAL'
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                : image.modality === 'SAR'
                ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60'
                : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
            }`}>
              {image.modality}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {image.sensor}
            </span>
          </div>
        </div>
      </div>

      {/* Technical Spec Grid */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono bg-space-900/80 p-2 rounded border border-space-border/50">
        <div>
          <span className="text-slate-400 block text-[10px]">Dimensions:</span>
          <span className="text-slate-200">{image.dimensions.width} × {image.dimensions.height}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Resolution:</span>
          <span className="text-slate-200">{image.resolution}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Spectral Bands:</span>
          <span className="text-slate-200">{image.bandsCount} Channels</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Projection:</span>
          <span className="text-slate-200">{image.crs.split(' ')[0]}</span>
        </div>
      </div>

      {/* Geolocation String */}
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 truncate">
        <MapPin className="w-3 h-3 text-geo-cyan shrink-0" />
        <span className="truncate">{image.coordinates.locationName}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-1 border-t border-space-border/60">
        <button
          onClick={resetViewport}
          className="flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-geo-cyan transition-colors"
        >
          <Eye className="w-3 h-3" />
          <span>Reset View</span>
        </button>
        <span className="text-[10px] font-mono text-slate-400">
          {image.fileSizeBytes}
        </span>
      </div>
    </div>
  );
};
