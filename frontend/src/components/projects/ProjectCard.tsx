import React from 'react';
import { ProjectEntity } from '../../types/project';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, MapPin, Calendar, Layers, Clock, ArrowRight, Activity } from 'lucide-react';

interface Props {
  project: ProjectEntity;
}

export const ProjectCard: React.FC<Props> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-space-850 border border-space-border hover:border-geo-cyan/40 rounded-lg p-4 cursor-pointer transition-all hover:bg-space-800/80 group flex flex-col justify-between space-y-4 shadow-sm"
    >
      <div className="space-y-2.5">
        {/* Top Code & Status */}
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="px-2 py-0.5 bg-space-900 text-geo-cyan rounded border border-geo-cyan/30 font-semibold">
            {project.code}
          </span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className={`w-1.5 h-1.5 rounded-full ${
              project.status === 'ACTIVE' ? 'bg-emerald-400' : project.status === 'MONITORING' ? 'bg-amber-400' : 'bg-slate-500'
            }`} />
            <span>{project.status}</span>
          </div>
        </div>

        {/* Project Title & Description */}
        <div>
          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-geo-cyan transition-colors line-clamp-1">
            {project.name}
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-1 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Location & Tags */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <MapPin className="w-3.5 h-3.5 text-geo-cyan shrink-0" />
          <span className="truncate">{project.location}</span>
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {project.tags.map((tag, idx) => (
            <span key={idx} className="text-[10px] font-mono px-1.5 py-0.2 bg-space-900 text-slate-400 rounded border border-space-border">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="pt-3 border-t border-space-border/60 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span>{project.imageCount} rasters</span>
          <span>·</span>
          <span>{project.analysesCount} analyses</span>
          <span>·</span>
          <span className="text-emerald-400 font-medium">{project.detectedChangesCount} changes</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-geo-cyan group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};
