import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnalysisProvider } from './context/AnalysisContext';
import { Navbar } from './components/layout/Navbar';
import { StatusBar } from './components/layout/StatusBar';
import { CommandPalette } from './components/layout/CommandPalette';
import { AnalyzePage } from './pages/AnalyzePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { HistoryPage } from './pages/HistoryPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <div className="min-h-screen h-screen flex flex-col bg-space-950 text-slate-100 overflow-hidden select-none font-sans">
          {/* Global Navigation Header (60px) */}
          <Navbar />

          {/* Main Application Routes */}
          <main className="flex-1 flex overflow-hidden relative">
            <Routes>
              <Route path="/" element={<Navigate to="/analyze" replace />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/datasets" element={<DatasetsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/analyze" replace />} />
            </Routes>
          </main>

          {/* Bottom Instrumentation Status Bar */}
          <StatusBar />

          {/* Global Command Palette (Ctrl+K) */}
          <CommandPalette />
        </div>
      </BrowserRouter>
    </AnalysisProvider>
  );
};

export default App;
