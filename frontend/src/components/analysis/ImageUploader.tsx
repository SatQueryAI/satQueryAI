import React, { useRef } from 'react';
import { Upload, Plus, HardDrive, CheckCircle2 } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const ImageUploader: React.FC = () => {
  const { uploadedImages, selectedImage, setSelectedImage, handleFileUpload, resetViewport } = useAnalysis();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
          Input Imagery
        </span>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 text-[11px] font-mono text-geo-cyan hover:text-geo-cyan/80 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Add raster</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".tif,.tiff,.png,.jpg,.jpeg,.geojson"
        onChange={onFileChange}
        className="hidden"
      />

      {/* Drag & Drop mini dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border border-dashed border-space-borderLight hover:border-geo-cyan/50 bg-space-850 hover:bg-space-800/80 rounded p-3 text-center cursor-pointer transition-all group"
      >
        <Upload className="w-4 h-4 mx-auto text-slate-400 group-hover:text-geo-cyan transition-colors mb-1.5" />
        <div className="text-xs font-medium text-slate-300 group-hover:text-white">
          Drop remote sensing raster
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
          GeoTIFF · TIFF · PNG · Complex SAR
        </div>
      </div>

      {/* Preloaded Dataset Selector */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[10px] font-mono text-slate-400">Sample Raster Feeds:</div>
        <div className="grid grid-cols-1 gap-1">
          {uploadedImages.map((img) => {
            const isSelected = selectedImage.id === img.id;
            return (
              <button
                key={img.id}
                onClick={() => {
                  setSelectedImage(img);
                  resetViewport();
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-left text-xs transition-all border ${
                  isSelected
                    ? 'bg-space-800 border-geo-cyan/50 text-white shadow-sm'
                    : 'bg-space-850 border-space-border text-slate-400 hover:text-slate-200 hover:bg-space-800'
                }`}
              >
                <div className="w-5 h-5 rounded overflow-hidden bg-black shrink-0 border border-slate-700">
                  <img src={img.thumbnailUrl} alt={img.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[11px] truncate font-medium text-slate-200">
                    {img.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                    <span>{img.modality}</span>
                    <span>·</span>
                    <span>{img.resolution}</span>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-geo-cyan shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
