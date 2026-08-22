import React, { useState } from 'react';
import { X, Plus, FolderPlus, MapPin, Globe } from 'lucide-react';
import { AnalysisMode } from '../../types/imagery';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (projectData: any) => void;
}

export const NewProjectModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState('13.0827');
  const [lon, setLon] = useState('80.2707');
  const [defaultMode, setDefaultMode] = useState<AnalysisMode>('TEMPORAL_CHANGE');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name: name.toUpperCase(),
      code: name.substring(0, 3).toUpperCase() + '-MON-' + new Date().getFullYear(),
      description,
      location,
      coordinates: { lat: parseFloat(lat) || 0, lon: parseFloat(lon) || 0 },
      defaultMode,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-space-900 border border-space-borderLight rounded-lg shadow-2xl overflow-hidden animate-in fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-space-border bg-space-850">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-geo-cyan" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
              Create Intelligence Project
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 font-mono text-xs">
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. KRISHNA BASIN DELTA MONITORING"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-space-850 border border-space-border rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-geo-cyan font-sans text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
              Description & Objectives
            </label>
            <textarea
              rows={3}
              placeholder="Describe monitoring purpose, target features, and analysis objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-space-850 border border-space-border rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-geo-cyan font-sans text-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Geographic Region
              </label>
              <input
                type="text"
                placeholder="e.g. Vijayawada, Andhra Pradesh"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-space-850 border border-space-border rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-geo-cyan font-sans text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Default Analysis Mode
              </label>
              <select
                value={defaultMode}
                onChange={(e) => setDefaultMode(e.target.value as AnalysisMode)}
                className="w-full bg-space-850 border border-space-border rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-geo-cyan text-xs"
              >
                <option value="SINGLE_IMAGE">Single Image VQA</option>
                <option value="TEMPORAL_CHANGE">Temporal Change Analysis</option>
                <option value="OPTICAL_SAR">Optical + SAR Reasoning</option>
                <option value="IMAGE_COMPARISON">Image Comparison</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Center Latitude (°N)
              </label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-space-850 border border-space-border rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-geo-cyan text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Center Longitude (°E)
              </label>
              <input
                type="text"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                className="w-full bg-space-850 border border-space-border rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-geo-cyan text-xs"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-space-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-space-border text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-geo-cyan hover:bg-cyan-400 text-space-950 font-semibold shadow transition-all"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
