import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPages } from './components/AuthPages';
import { UploadDashboard } from './components/UploadDashboard';
import { HistoryDashboard } from './components/HistoryDashboard';
import { ResultInspector } from './components/ResultInspector';
import { AdminPanel } from './components/AdminPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { Job } from './types';
import { LayoutDashboard, Upload, History, Settings, LogOut, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'register' | 'forgot' | 'dashboard' | 'upload' | 'history' | 'settings' | 'admin'>('landing');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activeJobForInspector, setActiveJobForInspector] = useState<Job | null>(null);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchJobs();
    }
  }, [currentUser]);

  const checkCurrentUser = async () => {
    setLoadingUser(true);
    try {
      const res = await fetch('/api/auth/current-user');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setCurrentPage('dashboard');
      } else {
        setCurrentUser(null);
        setCurrentPage('landing');
      }
    } catch (err) {
      setCurrentUser(null);
      setCurrentPage('landing');
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Error loading jobs log:', err);
    }
  };

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setCurrentUser(null);
    setJobs([]);
    setCurrentPage('landing');
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you certain you wish to purge this conversion work log from the records?')) return;
    try {
      const res = await fetch(`/api/job/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setJobs(prev => prev.filter(j => j.id !== id));
        if (activeJobForInspector?.id === id) {
          setActiveJobForInspector(null);
        }
      }
    } catch (err) {
      console.error('Failed to purge job log:', err);
    }
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);
  };

  const handleJobUpdated = (updatedJob: Job) => {
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    if (activeJobForInspector?.id === updatedJob.id) {
      setActiveJobForInspector(updatedJob);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Initializing scanned workbook clusters...</p>
      </div>
    );
  }

  // Render simple login / landing pages
  if (currentPage === 'landing') {
    return <LandingPage onNavigate={(p) => setCurrentPage(p)} currentUser={currentUser} onLogout={handleLogout} />;
  }

  if (currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot') {
    return (
      <AuthPages
        initialMode={currentPage === 'forgot' ? 'forgot' : currentPage === 'register' ? 'register' : 'login'}
        onAuthSuccess={handleAuthSuccess}
        onNavigate={(p) => setCurrentPage(p)}
      />
    );
  }

  // Dashboard / Workspace layout (Requires login context)
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Upper navigation row - Geometric Balance Navbar */}
      <header className="bg-white text-[#0f172a] py-4 px-8 flex items-center justify-between border-b border-[#e2e8f0] h-16 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-[4px] flex items-center justify-center text-white font-black text-lg select-none">
            N
          </div>
          <span className="text-lg font-bold tracking-tight text-[#0f172a] font-sans">
            Nithyana Cable <span className="text-blue-600">Admin</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono text-slate-450 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded uppercase font-extrabold tracking-widest text-[#64748b]">Nithyananthan Administration Console</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-xs font-semibold text-[#64748b]">
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer">API Reference</span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Support</span>
          </div>

          <div className="flex items-center gap-4 border-l border-[#e2e8f0] pl-6">
            <div className="hidden md:flex flex-col items-end text-xs font-sans">
              <span className="font-bold text-[#0f172a] leading-none">{currentUser?.name}</span>
              <span className="text-[#64748b] text-[10px] uppercase font-bold tracking-wider mt-1">{currentUser?.plan} Plan</span>
            </div>

            <button
              id="workspace-btn-logout"
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-semibold transition-colors border border-slate-200 hover:bg-slate-50 rounded-[4px] text-slate-600 cursor-pointer"
              title="Log out of application"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main workspace section with sidebar & workspace grids */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Workspace Sidebar - Geometric Compact Design */}
        <nav className="w-full md:w-[72px] bg-white border-r border-[#e2e8f0] p-4 shrink-0 flex flex-row md:flex-col gap-5 items-center justify-start md:justify-start overflow-x-auto md:overflow-visible">
          <button
            id="sidebar-btn-dashboard"
            onClick={() => { setCurrentPage('dashboard'); setActiveJobForInspector(null); }}
            className={`p-2.5 rounded-[4px] transition-all relative group cursor-pointer ${
              currentPage === 'dashboard' && !activeJobForInspector
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#64748b] hover:text-blue-600 hover:bg-slate-50 border border-transparent'
            }`}
            title="Dashboard Statistics"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="absolute left-16 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap hidden md:inline-block">
              Dashboard Statistics
            </span>
          </button>

          <button
            id="sidebar-btn-upload"
            onClick={() => { setCurrentPage('upload'); setActiveJobForInspector(null); }}
            className={`p-2.5 rounded-[4px] transition-all relative group cursor-pointer ${
              currentPage === 'upload' && !activeJobForInspector
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#64748b] hover:text-blue-600 hover:bg-slate-50 border border-transparent'
            }`}
            title="Convert Document"
          >
            <Upload className="h-5 w-5" />
            <span className="absolute left-16 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap hidden md:inline-block">
              Convert Document
            </span>
          </button>

          <button
            id="sidebar-btn-history"
            onClick={() => { setCurrentPage('history'); setActiveJobForInspector(null); }}
            className={`p-2.5 rounded-[4px] transition-all relative group cursor-pointer ${
              currentPage === 'history' && !activeJobForInspector
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#64748b] hover:text-blue-600 hover:bg-slate-50 border border-transparent'
            }`}
            title="Job Log Histories"
          >
            <History className="h-5 w-5" />
            <span className="absolute left-16 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap hidden md:inline-block">
              Job Log Histories
            </span>
          </button>

          <button
            id="sidebar-btn-settings"
            onClick={() => { setCurrentPage('settings'); setActiveJobForInspector(null); }}
            className={`p-2.5 rounded-[4px] transition-all relative group cursor-pointer ${
              currentPage === 'settings' && !activeJobForInspector
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#64748b] hover:text-blue-600 hover:bg-slate-50 border border-transparent'
            }`}
            title="Account Settings"
          >
            <Settings className="h-5 w-5" />
            <span className="absolute left-16 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap hidden md:inline-block">
              Account Settings
            </span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              id="sidebar-btn-admin"
              onClick={() => { setCurrentPage('admin'); setActiveJobForInspector(null); }}
              className={`p-2.5 rounded-[4px] transition-all relative group cursor-pointer ${
                currentPage === 'admin' && !activeJobForInspector
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-indigo-600 bg-indigo-50/50 hover:bg-indigo-150/40 border border-indigo-100'
              }`}
              title="Admin Panel"
            >
              <ShieldAlert className="h-5 w-5" />
              <span className="absolute left-16 bg-indigo-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap hidden md:inline-block">
                Admin Panel
              </span>
            </button>
          )}
        </nav>

        {/* Core dynamic content grid box */}
        <main className="flex-1 bg-[#f8fafc] overflow-y-auto">
          {activeJobForInspector ? (
            <ResultInspector 
              job={activeJobForInspector} 
              onBack={() => setActiveJobForInspector(null)} 
              onJobUpdated={handleJobUpdated}
            />
          ) : (
            <>
              {currentPage === 'dashboard' && (
                <div className="font-sans max-w-5xl mx-auto py-8 px-4 animate-fade-in" id="dashboard-landing-summary-stats">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-[#0f172a] flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-none inline-block"></span>
                      <span>Welcome back, {currentUser?.name}!</span>
                    </h2>
                    <p className="text-xs text-[#64748b] uppercase tracking-wider font-semibold">Your vision OCR parser workstations are executing with geometric balance.</p>
                  </div>

                  {/* Bento grids stats tracker - Geometric Balance */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="dashboard-bento-grid">
                    <div className="bg-white p-5 border border-[#e2e8f0] rounded-[4px] shadow-sm">
                      <span className="text-xxs font-bold text-[#64748b] uppercase tracking-wider font-sans">Total Processed</span>
                      <p className="text-2xl font-bold text-[#0f172a] font-sans mt-2">{jobs.length}</p>
                    </div>

                    <div className="bg-white p-5 border border-[#e2e8f0] rounded-[4px] shadow-sm">
                      <span className="text-xxs font-bold text-[#64748b] uppercase tracking-wider font-sans">Storage Used</span>
                      <p className="text-2xl font-bold text-[#0f172a] mt-2">4.82 GB</p>
                    </div>

                    <div className="bg-white p-5 border border-[#e2e8f0] rounded-[4px] shadow-sm">
                      <span className="text-xxs font-bold text-[#64748b] uppercase tracking-wider font-sans">Avg. Confidence</span>
                      <p className="text-2xl font-bold text-emerald-600 font-sans mt-2">
                        {jobs.filter(j => j.status === 'completed').length > 0
                          ? `${(jobs.filter(j => j.status === 'completed' && j.confidenceScore).reduce((acc, curr) => acc + (curr.confidenceScore || 0), 0) / (jobs.filter(j => j.status === 'completed' && j.confidenceScore).length || 1)).toFixed(1)}%`
                          : '99.2%'}
                      </p>
                    </div>

                    <div className="bg-white p-5 border border-[#e2e8f0] rounded-[4px] shadow-sm">
                      <span className="text-xxs font-bold text-[#64748b] uppercase tracking-wider font-sans">Active Plan</span>
                      <p className="text-2xl font-bold text-blue-600 font-sans capitalize mt-2">{currentUser?.plan}</p>
                    </div>
                  </div>

                  {/* Quick-links Actions Area */}
                  <div className="grid md:grid-cols-2 gap-6 items-stretch mb-8" id="dashboard-quickactions">
                    <div className="border border-[#e2e8f0] p-6 rounded-[4px] bg-white flex flex-col justify-between shadow-sm">
                      <div className="font-sans">
                        <h4 className="text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-widest border-b border-[#e2e8f0] pb-2">Convert a New Document</h4>
                        <p className="text-xs text-[#64748b] leading-relaxed">
                          Process multipage warehouse logs, handwritten lists or freight bills into formatted .xlsx Sheets instantly.
                        </p>
                      </div>
                      <div className="pt-6">
                        <button
                          id="btn-dash-fast-upload"
                          onClick={() => setCurrentPage('upload')}
                          className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-[4px] transition-colors cursor-pointer w-full text-center uppercase tracking-wider"
                        >
                          New Batch Upload
                        </button>
                      </div>
                    </div>

                    <div className="border border-[#e2e8f0] p-6 rounded-[4px] bg-white flex flex-col justify-between shadow-sm">
                      <div className="font-sans">
                        <h4 className="text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-widest border-b border-[#e2e8f0] pb-2">Configure Account preferences</h4>
                        <p className="text-xs text-[#64748b] leading-relaxed">
                          Verify subscription tiers billing, user parameters information, custom secrets, paths, and platform access logs.
                        </p>
                      </div>
                      <div className="pt-6">
                        <button
                          id="btn-dash-goto-settings"
                          onClick={() => setCurrentPage('settings')}
                          className="text-xs font-bold text-blue-600 border border-blue-600 bg-white hover:bg-blue-50 py-2 px-4 rounded-[4px] transition-colors cursor-pointer w-full text-center uppercase tracking-wider"
                        >
                          Account configurations
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Jobs Sub-table logs list */}
                  <div className="bg-white border border-[#e2e8f0] rounded-[4px] overflow-hidden shadow-sm">
                    <div className="bg-white py-4 px-6 border-b border-[#e2e8f0] flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Recently scanned document log</h4>
                      <button
                        id="btn-dash-history-expansion"
                        onClick={() => setCurrentPage('history')}
                        className="text-xxs font-bold text-blue-600 hover:text-blue-800 tracking-wider uppercase cursor-pointer"
                      >
                        See all records
                      </button>
                    </div>

                    <div className="divide-y divide-[#e2e8f0]" id="dash-recent-jobs-substack">
                      {jobs.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-sans select-none">
                          No document files processed yet. Let's make your first file conversion!
                        </div>
                      ) : (
                        jobs.slice(0, 3).map((job) => (
                          <div key={job.id} className="p-4 flex items-center justify-between gap-4 text-xs font-sans hover:bg-slate-50/55">
                            <div className="min-w-0">
                              <p className="font-bold text-[#0f172a] truncate max-w-sm">{job.fileName}</p>
                              <p className="text-[#64748b] text-[10px] uppercase tracking-wider font-semibold mt-1">
                                Size: {job.fileSize} • Uploaded {new Date(job.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              {job.status === 'completed' ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 bg-slate-100 rounded-[2px] w-[60px] relative overflow-hidden">
                                      <div className="h-full bg-blue-600 rounded-[2px]" style={{ width: `${job.confidenceScore || 90}%` }}></div>
                                    </div>
                                    <span className="text-xxs font-mono font-bold text-[#0f172a]">
                                      {job.confidenceScore || 90}%
                                    </span>
                                  </div>
                                  <span className="text-xxxs font-bold text-emerald-800 bg-emerald-100/80 uppercase tracking-widest px-2 py-0.5 rounded-[2px]">
                                    Completed
                                  </span>
                                  <button
                                    id={`dash-recent-inspect-${job.id}`}
                                    onClick={() => setActiveJobForInspector(job)}
                                    className="text-xxs font-bold text-blue-600 border border-blue-600 hover:bg-blue-50 py-1 px-3 rounded-[4px] cursor-pointer inline-flex items-center uppercase tracking-wider"
                                  >
                                    View
                                  </button>
                                </>
                              ) : (
                                <span className={`text-xxxs font-bold uppercase py-0.5 px-2 rounded-[2px] tracking-widest ${
                                  job.status === 'processing' 
                                    ? 'bg-yellow-100 text-yellow-850 animate-pulse' 
                                    : job.status === 'failed' 
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {job.status}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 'upload' && (
                <UploadDashboard
                  onJobCreated={handleJobCreated}
                  onNavigateToHistory={() => setCurrentPage('history')}
                  currentUser={currentUser}
                />
              )}

              {currentPage === 'history' && (
                <HistoryDashboard
                  jobs={jobs}
                  onSelectJob={setActiveJobForInspector}
                  onDeleteJob={handleDeleteJob}
                  onNavigateToUpload={() => setCurrentPage('upload')}
                />
              )}

              {currentPage === 'settings' && (
                <SettingsPanel
                  currentUser={currentUser}
                  onBack={() => setCurrentPage('dashboard')}
                />
              )}

              {currentUser?.role === 'admin' && currentPage === 'admin' && (
                <AdminPanel
                  onBack={() => setCurrentPage('dashboard')}
                  allJobs={jobs}
                  onDeleteJob={handleDeleteJob}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
