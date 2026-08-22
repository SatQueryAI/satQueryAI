import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../data/mockProjects';
import { ProjectCard } from '../components/projects/ProjectCard';
import { NewProjectModal } from '../components/projects/NewProjectModal';
import { ProjectEntity } from '../types/project';
import { FolderKanban, Plus, Search, Filter } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectEntity[]>(MOCK_PROJECTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = (newProj: any) => {
    const created: ProjectEntity = {
      ...newProj,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastAnalyzedAt: 'Just now',
      imageCount: 1,
      analysesCount: 0,
      reportsCount: 0,
      detectedChangesCount: 0,
      status: 'ACTIVE',
      tags: ['New Ingestion', 'Earth Observation'],
      thumbnailUrl: MOCK_PROJECTS[0].thumbnailUrl,
      imagery: [],
      recentAnalyses: [],
    };
    setProjects([created, ...projects]);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-space-950 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-space-border pb-4">
        <div>
          <h1 className="text-xl font-bold font-mono text-slate-100 uppercase tracking-tight">
            Intelligence Projects
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Organize satellite rasters, multi-temporal analyses, and intelligence reports.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-geo-cyan hover:bg-cyan-400 text-space-950 font-mono text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-space-850 p-3 rounded-lg border border-space-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, code or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-space-900 border border-space-border rounded pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-geo-cyan font-sans"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto font-mono text-xs">
          <span className="text-slate-400 text-[11px]">Filter Status:</span>
          {['ALL', 'ACTIVE', 'MONITORING', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                statusFilter === st
                  ? 'bg-space-800 text-geo-cyan border border-geo-cyan/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-space-850 border border-space-border rounded-lg p-12 text-center space-y-3">
          <FolderKanban className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-mono font-semibold text-slate-300">No Projects Found</h3>
          <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
            Create a project to group satellite imagery, temporal change tracks, and downloadable reports.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 rounded bg-geo-cyan text-space-950 text-xs font-mono font-semibold"
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
};
