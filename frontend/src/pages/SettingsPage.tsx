import React, { useState } from 'react';
import { 
  Settings, 
  Cpu, 
  Database, 
  Sliders, 
  ShieldCheck, 
  HardDrive, 
  Activity, 
  CheckCircle2, 
  Zap,
  Terminal,
  Save
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [model, setModel] = useState('Remote-Sensing VLM (RS-Llama-Geo-9B)');
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [iouThreshold, setIouThreshold] = useState(0.65);
  const [autoEvidence, setAutoEvidence] = useState(true);
  const [retentionDays, setRetentionDays] = useState(30);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-space-950 p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-space-border pb-4">
        <h1 className="text-xl font-bold font-mono text-slate-100 uppercase tracking-tight">
          System Configuration & Model Parameters
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Configure model inference weights, confidence calibration thresholds, and system telemetry.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
        {/* Section 1: Vision-Language Model Parameters */}
        <div className="bg-space-850 border border-space-border rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-space-border/60 pb-2">
            <Cpu className="w-4 h-4 text-geo-cyan" />
            <h3 className="text-xs font-bold uppercase text-slate-100">
              Inference Engine & Model Configuration
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Active Vision-Language Model Backbone
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-space-900 border border-space-border rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-geo-cyan text-xs"
              >
                <option value="Remote-Sensing VLM (RS-Llama-Geo-9B)">Remote-Sensing VLM (RS-Llama-Geo-9B) — Default</option>
                <option value="BIT-CD-VQA (Bi-Temporal Change Transformer)">BIT-CD-VQA (Bi-Temporal Change Transformer)</option>
                <option value="Cross-Modal GeoVLM (SAR-Opt-Fusion-8B)">Cross-Modal GeoVLM (SAR-Opt-Fusion-8B)</option>
                <option value="GeoChat-RS-7B (Lightweight)">GeoChat-RS-7B (Lightweight Low Latency)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Confidence Reporting Threshold
                  </span>
                  <span className="text-geo-cyan font-bold">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={95}
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-geo-cyan bg-space-900 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">
                  Filters responses with lower statistical softmax probabilities.
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Grounding Box IoU Cutoff
                  </span>
                  <span className="text-geo-cyan font-bold">{iouThreshold}</span>
                </div>
                <input
                  type="range"
                  min={0.3}
                  max={0.9}
                  step={0.05}
                  value={iouThreshold}
                  onChange={(e) => setIouThreshold(Number(e.target.value))}
                  className="w-full accent-geo-cyan bg-space-900 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">
                  Intersection-over-Union threshold for non-maximum suppression.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoEvidence}
                  onChange={(e) => setAutoEvidence(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-space-900 text-geo-cyan accent-geo-cyan"
                />
                <span className="text-slate-200">Automatically display visual evidence bounding boxes on query completion</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Storage & Cache Retention */}
        <div className="bg-space-850 border border-space-border rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-space-border/60 pb-2">
            <HardDrive className="w-4 h-4 text-geo-cyan" />
            <h3 className="text-xs font-bold uppercase text-slate-100">
              Raster Cache & Data Retention
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                GeoTIFF Tile Cache Retention (Days)
              </label>
              <input
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-full bg-space-900 border border-space-border rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-geo-cyan text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Default Coordinate Reference System (CRS)
              </label>
              <input
                type="text"
                disabled
                value="EPSG:4326 (WGS 84 / Geographic)"
                className="w-full bg-space-900 border border-space-border rounded px-3 py-2 text-slate-400 text-xs cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 3: System Health & Hardware Telemetry */}
        <div className="bg-space-850 border border-space-border rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-space-border/60 pb-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase text-slate-100">
              System Diagnostics & Runtime Telemetry
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-space-900 p-2.5 rounded border border-space-border">
              <span className="text-[10px] text-slate-400 block">FastAPI Backend:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            </div>
            <div className="bg-space-900 p-2.5 rounded border border-space-border">
              <span className="text-[10px] text-slate-400 block">Hardware Acceleration:</span>
              <span className="text-geo-cyan font-bold mt-0.5 block">CUDA 12.4 (RTX 4090)</span>
            </div>
            <div className="bg-space-900 p-2.5 rounded border border-space-border">
              <span className="text-[10px] text-slate-400 block">VRAM Allocation:</span>
              <span className="text-slate-200 font-bold mt-0.5 block">7.8 GB / 24 GB</span>
            </div>
            <div className="bg-space-900 p-2.5 rounded border border-space-border">
              <span className="text-[10px] text-slate-400 block">Platform Version:</span>
              <span className="text-slate-200 font-bold mt-0.5 block">SatQuery v0.1.0-VLM</span>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings saved successfully
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-geo-cyan hover:bg-cyan-400 text-space-950 font-semibold shadow-md transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
