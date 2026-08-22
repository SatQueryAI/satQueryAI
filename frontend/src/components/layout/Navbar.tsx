import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Satellite, 
  Search, 
  Activity, 
  Layers, 
  FolderKanban, 
  History, 
  Database, 
  FileText, 
  Settings,
  Terminal
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { setCommandPaletteOpen } = useAnalysis();

  const navLinks = [
    { name: 'Analyze', path: '/analyze', icon: Layers },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'History', path: '/history', icon: History },
    { name: 'Datasets', path: '/datasets', icon: Database },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/analyze' && (location.pathname === '/' || location.pathname === '/analyze')) return true;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="h-14 bg-space-900 border-b border-space-border px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-6">
        <Link to="/analyze" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-space-850 border border-geo-cyan/40 flex items-center justify-center text-geo-cyan group-hover:border-geo-cyan transition-colors shadow-sm">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 tracking-tight text-sm">SatQuery AI</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 bg-geo-cyan/10 border border-geo-cyan/30 text-geo-cyan rounded">
                v0.1.0-VLM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide leading-none">
              Remote Sensing Intelligence
            </p>
          </div>
        </Link>

        {/* Global Nav Links */}
        <nav className="hidden md:flex items-center gap-1 border-l border-space-border pl-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  active
                    ? 'bg-space-800 text-geo-cyan border border-geo-cyan/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-850 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-geo-cyan' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: Quick Search + Telemetry Status + User Info */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-space-850 hover:bg-space-800 border border-space-border rounded text-xs text-slate-400 hover:text-slate-200 transition-colors"
          title="Open Command Palette (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px]">Search...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-space-900 border border-slate-700 rounded text-slate-400">
            Ctrl K
          </kbd>
        </button>

        {/* System Online Status */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-space-850 border border-space-border rounded text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
          <span className="text-[11px] text-emerald-400 font-semibold tracking-wider">SYSTEM ONLINE</span>
        </div>

        {/* User Identity */}
        <div className="flex items-center gap-2.5 border-l border-space-border pl-3">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
            SR
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-slate-200 leading-tight">Sai Ramesh</div>
            <div className="text-[10px] font-mono text-slate-400">Lead Analyst</div>
          </div>
        </div>
      </div>
    </header>
  );
};
