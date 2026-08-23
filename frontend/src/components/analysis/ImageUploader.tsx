import React, { useRef, useState } from 'react';
import { Upload, MoreVertical, CheckCircle, Loader2, AlertCircle, X, FileText } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const ImageUploader: React.FC = () => {
  const {
    selectedImage,
    handleFileUpload,
    isUploading,
    uploadProgress,
    uploadError,
    clearUploadError,
  } = useAnalysis();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbError, setThumbError] = useState<boolean>(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && !isUploading) {
      setThumbError(false);
      handleFileUpload(e.target.files[0]);
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isUploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setThumbError(false);
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const isTiff = selectedImage?.filename?.toLowerCase().endsWith('.tif') || selectedImage?.filename?.toLowerCase().endsWith('.tiff');

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-200">
        Input Imagery
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".tif,.tiff,.png,.jpg,.jpeg"
        onChange={onFileChange}
        disabled={isUploading}
        className="hidden"
      />

      {/* Error Alert Display */}
      {uploadError && (
        <div className="bg-rose-950/60 border border-rose-500/40 rounded-lg p-3 text-xs text-rose-200 flex items-start gap-2.5 shadow-lg animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 whitespace-pre-line text-[11px] leading-relaxed">
            {uploadError}
          </div>
          <button
            onClick={clearUploadError}
            className="text-rose-400 hover:text-rose-200 p-0.5"
            title="Dismiss error"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border border-dashed rounded-lg p-4 text-center transition-all flex flex-col items-center justify-center space-y-2 group ${
          isUploading
            ? 'border-cyan-500/40 bg-[#0d131f] cursor-wait opacity-90'
            : 'border-[#1e293b] hover:border-cyan-500/50 bg-[#0d131f]/60 hover:bg-[#0d131f] cursor-pointer'
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-[#162032] border border-[#243247] flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
          {isUploading ? (
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </div>

        {isUploading ? (
          <div className="space-y-1.5 w-full max-w-[200px]">
            <div className="text-xs text-cyan-300 font-sans font-medium">
              Uploading imagery...
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-[#162032] h-1.5 rounded-full overflow-hidden border border-[#243247]">
              <div
                className="bg-cyan-500 h-full transition-all duration-200"
                style={{ width: `${Math.max(10, uploadProgress)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Appwrite Storage & Database {uploadProgress > 0 ? `(${uploadProgress}%)` : ''}
            </div>
          </div>
        ) : (
          <>
            <div className="text-xs text-slate-300 font-sans">
              Drop remote sensing raster here
              <div className="text-slate-400 text-[11px]">or</div>
            </div>
            <button
              type="button"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-3 py-1 bg-[#162032] hover:bg-[#1f2d45] border border-[#243247] text-cyan-400 text-xs rounded font-medium transition-colors"
            >
              Browse Files
            </button>
            <div className="text-[10px] text-slate-400 font-sans pt-1">
              Supported: GeoTIFF • TIFF • PNG • JPEG
            </div>
          </>
        )}
      </div>

      {/* Uploaded File Card */}
      {selectedImage && (
        <div className="bg-[#0d131f] border border-[#1e293b] rounded-lg p-2.5 flex items-center gap-3">
          {/* Thumbnail */}
          <div className="w-11 h-11 rounded bg-black shrink-0 overflow-hidden border border-slate-700 flex items-center justify-center">
            {!thumbError && selectedImage.thumbnailUrl && !isTiff ? (
              <img
                src={selectedImage.thumbnailUrl}
                alt={selectedImage.name}
                onError={() => setThumbError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#111827] flex flex-col items-center justify-center text-cyan-400/80 p-1 text-center">
                <FileText className="w-4 h-4" />
                <span className="text-[7px] font-mono text-slate-400 mt-0.5">TIFF</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-100 truncate font-mono" title={selectedImage.filename}>
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
