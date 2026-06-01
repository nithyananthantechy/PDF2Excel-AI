import React, { useState, useEffect } from 'react';
import { Users, FileSpreadsheet, KeyRound, Ban, CheckCircle, Database, AlertCircle, Trash2, ChartPie } from 'lucide-react';
import { Job } from '../types';

interface AdminPanelProps {
  onBack: () => void;
  allJobs: Job[];
  onDeleteJob: (id: string) => Promise<void>;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'disabled';
  createdAt: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export function AdminPanel({ onBack, allJobs, onDeleteJob }: AdminPanelProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to list user objects');
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching user log.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/toggle`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle status');
      
      // Update local state
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: data.user.status } : u));
    } catch (err: any) {
      alert(err.message || 'Error occurred during status toggle.');
    }
  };

  return (
    <div className="font-sans max-w-6xl mx-auto py-8 px-6" id="admin-panel-container">
      <div className="flex justify-between items-center mb-8 border-b border-[#e2e8f0] pb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">Admin dashboard console</h2>
          <p className="text-sm text-[#64748b] mt-1">Global control metrics, user permission overrides, storage calculations auditing</p>
        </div>
        <button
          id="btn-admin-ret-dash"
          onClick={onBack}
          className="text-xs font-bold uppercase tracking-wider text-[#0f172a] hover:bg-slate-50 border border-[#e2e8f0] py-2.5 px-4 rounded-[4px] cursor-pointer"
        >
          Return to Workspace
        </button>
      </div>

      {error && (
        <div id="admin-err-banner" className="mb-6 bg-rose-50 text-rose-750 text-xs p-4 rounded-[4px] border border-rose-100 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Global telemetry bento cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" id="admin-telemetry-grid">
        <div className="bg-slate-50 border border-[#e2e8f0] p-5 rounded-[4px] flex items-center gap-4 shadow-xs">
          <div className="h-12 w-12 bg-blue-600 text-white rounded-[4px] flex items-center justify-center font-bold text-lg select-none">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xxs font-bold text-[#64748b] uppercase tracking-widest font-sans">Active User Accounts</span>
            <p className="text-2xl font-black text-[#0f172a] mt-1">{users.length}</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-[#e2e8f0] p-5 rounded-[4px] flex items-center gap-4 shadow-xs">
          <div className="h-12 w-12 bg-[#0f172a] text-white rounded-[4px] flex items-center justify-center font-bold text-lg select-none">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xxs font-bold text-[#64748b] uppercase tracking-widest font-sans font-medium">Total PDFs scanned</span>
            <p className="text-2xl font-black text-[#0f172a] mt-1">{allJobs.length}</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-[#e2e8f0] p-5 rounded-[4px] flex items-center gap-4 shadow-xs">
          <div className="h-12 w-12 bg-emerald-600 text-white rounded-[4px] flex items-center justify-center font-bold text-lg select-none">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xxs font-bold text-[#64748b] uppercase tracking-widest font-sans">Network storage utilized</span>
            <p className="text-2xl font-black text-[#0f172a] mt-1">4.8 GB / 100 GB</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 animate-pulse text-[#64748b] select-none text-xs uppercase tracking-widest font-bold">
          Querying secure database clusters...
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8" id="admin-workspace-split">
          {/* User management list table - 2 Cols span */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-[#e2e8f0] rounded-[4px] overflow-hidden shadow-xs">
              <div className="bg-slate-50 py-3.5 px-4 border-b border-[#e2e8f0]">
                <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">User permissions controls</h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-xxs font-bold text-[#64748b] uppercase tracking-wider font-sans">
                      <th className="py-3 px-4">User Details</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Tier Plan</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0] text-xs text-[#334155]">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-sans max-w-xs truncate">
                          <p className="font-bold text-[#0f172a] leading-relaxed">{u.name}</p>
                          <p className="text-[#64748b] text-xxs font-sans mt-0.5">ID: {u.id} • Registered {new Date(u.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono truncate text-[#334155]">{u.email}</td>
                        <td className="py-3.5 px-4 capitalize">
                          <span className="inline-flex items-center gap-1 font-bold font-sans text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-[4px] text-[10px] uppercase">
                            {u.plan}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase ${
                            u.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            id={`btn-toggle-status-${u.id}`}
                            onClick={() => handleToggleUser(u.id)}
                            disabled={u.role === 'admin'}
                            className={`px-3 py-1.5 bg-white border border-[#e2e8f0] text-[10px] font-bold uppercase tracking-wider rounded-[4px] shadow-xxs disabled:opacity-40 select-none cursor-pointer ${
                              u.status === 'active' 
                                ? 'text-red-600 hover:bg-rose-50 hover:border-red-200' 
                                : 'text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200'
                            }`}
                          >
                            {u.status === 'active' ? 'Disable Account' : 'Reactivate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Jobs monitoring audits list - 1 Col span */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-[#e2e8f0] rounded-[4px] overflow-hidden shadow-xs">
              <div className="bg-slate-50 py-3.5 px-4 border-b border-[#e2e8f0]">
                <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Recent Parser jobs logs</h4>
              </div>

              <div className="p-4 divide-y divide-[#e2e8f0] max-h-[420px] overflow-y-auto space-y-3.5">
                {allJobs.map(job => (
                  <div key={job.id} className="pt-3.5 flex items-start justify-between gap-3 text-xs" id={`recent-admin-job-${job.id}`}>
                    <div className="min-w-0 font-sans">
                      <p className="font-bold text-[#0f172a] truncate leading-relaxed">{job.fileName}</p>
                      <p className="text-[#64748b] text-[10px] mt-0.5">Owner ID: {job.userId} • {job.fileSize}</p>
                      <p className="text-slate-500 font-mono text-[10px] mt-1">Status: {job.status.toUpperCase()} • Conf: {job.confidenceScore || 0}%</p>
                    </div>

                    <button
                      id={`btn-admin-purge-${job.id}`}
                      onClick={() => onDeleteJob(job.id)}
                      className="p-1.5 px-2 border border-[#e2e8f0] text-slate-400 hover:text-rose-600 rounded-[4px] hover:border-rose-100 transition-colors cursor-pointer text-xxs font-sans font-bold uppercase tracking-wider shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
