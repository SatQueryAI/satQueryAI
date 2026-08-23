import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Boxes, 
  Bell,
  Search,
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { setCommandPaletteOpen } = useAnalysis();

  const navLinks = [
    { name: 'Analyze', path: '/analyze' },
    { name: 'Projects', path: '/projects' },
    { name: 'History', path: '/history' },
    { name: 'Datasets', path: '/datasets' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/analyze' && (location.pathname === '/' || location.pathname === '/analyze')) return true;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="h-14 bg-[#090e17] border-b border-[#1e293b] px-5 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-8">
        <Link to="/analyze" className="flex items-center gap-2.5 group">
          <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
            {/* Custom satellite diamond crosshair icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 12l10 10 10-10L12 2z" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-white tracking-tight text-sm leading-none">
              SatQuery AI
            </div>
            <p className="text-[11px] text-slate-400 font-sans tracking-wide leading-none mt-1">
              Remote Sensing Intelligence
            </p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-6 h-14">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`h-full flex items-center text-xs font-medium transition-colors relative ${
                  active
                    ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: System Status & User Profile */}
      <div className="flex items-center gap-5">
        {/* System Online Status */}
        <div className="flex items-center gap-2 text-xs font-sans">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-200 text-xs font-medium">System Online</span>
        </div>

        {/* Notification Bell */}
        <button
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#162032] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* User Identity */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#1e293b]">
          <div className="w-8 h-8 rounded-full bg-[#1e293b] border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shadow-inner">
            SR
          </div>
          <div className="hidden lg:block text-left leading-tight">
            <div className="text-xs font-semibold text-slate-200">Sai Ramesh</div>
            <div className="text-[10px] text-slate-400">Lead Analyst</div>
          </div>
        </div>
      </div>
    </header>
  );
};

