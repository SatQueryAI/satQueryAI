import React, { useRef } from 'react';
import { Upload, MoreVertical, CheckCircle } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const ImageUploader: React.FC = () => {
  const { selectedImage, handleFileUpload, resetViewport } = useAnalysis();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-200">
        Input Imagery
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".tif,.tiff,.png,.jpg,.jpeg,.geojson"
        onChange={onFileChange}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border border-dashed border-[#1e293b] hover:border-cyan-500/50 bg-[#0d131f]/60 hover:bg-[#0d131f] rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group"
      >
        <div className="w-8 h-8 rounded-lg bg-[#162032] border border-[#243247] flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
          <Upload className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300 font-sans">
          Drag & drop imagery here
          <div className="text-slate-400 text-[11px]">or</div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-3 py-1 bg-[#162032] hover:bg-[#1f2d45] border border-[#243247] text-cyan-400 text-xs rounded font-medium transition-colors"
        >
          Browse Files
        </button>
        <div className="text-[10px] text-slate-400 font-sans pt-1">
          Supported: GeoTIFF • TIFF • PNG • JPEG • SAR
        </div>
      </div>

      {/* Uploaded File Card */}
      {selectedImage && (
        <div className="bg-[#0d131f] border border-[#1e293b] rounded-lg p-2.5 flex items-center gap-3">
          {/* Thumbnail */}
          <div className="w-11 h-11 rounded bg-black shrink-0 overflow-hidden border border-slate-700">
            <img src={selectedImage.thumbnailUrl} alt={selectedImage.name} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-100 truncate font-mono">
              {selectedImage.name.replace('.TIF', '.tif')}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded">
                {selectedImage.modality}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {selectedImage.resolution} • {selectedImage.bandsCount} Bands
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {selectedImage.dimensions.width} × {selectedImage.dimensions.height} px
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center justify-between h-10 shrink-0">
            <button className="text-slate-400 hover:text-slate-200">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
            <CheckCircle className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
      )}
    </div>
  );
};

