import React, { useState } from 'react';
import { SatelliteImageMeta } from '../../types/imagery';
import { ChevronDown, ChevronRight, Info, Compass, Sun, ShieldCheck } from 'lucide-react';

interface Props {
  image: SatelliteImageMeta;
}

export const MetadataPanel: React.FC<Props> = ({ image }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-space-850 border border-space-border rounded overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-space-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-geo-cyan" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
            Raster Metadata
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-3 pt-1 border-t border-space-border/60 space-y-2 text-[11px] font-mono">
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px]">Sensor:</span>
              <span>{image.sensor}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Platform:</span>
              <span>{image.platform}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Acquired:</span>
              <span>{image.acquisitionDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">GSD Resolution:</span>
              <span>{image.resolution}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Cloud Cover:</span>
              <span>{image.cloudCoverPercentage ? `${image.cloudCoverPercentage}%` : '0.0%'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Solar Elevation:</span>
              <span>{image.solarElevation ? `${image.solarElevation}°` : '64.2°'}</span>
            </div>
          </div>

          {/* Bands Breakdown */}
          <div className="pt-2 border-t border-space-border/40">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
              Spectral Bands & Polarizations:
            </span>
            <div className="space-y-1">
              {image.bandsList.map((b, idx) => (
                <div key={idx} className="flex items-start justify-between text-[10px] bg-space-900 px-1.5 py-1 rounded">
                  <span className="text-geo-cyan font-medium">{b.name}</span>
                  <span className="text-slate-400 truncate max-w-[120px]">{b.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
