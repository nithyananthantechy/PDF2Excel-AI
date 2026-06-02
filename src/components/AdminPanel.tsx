import React, { useState, useEffect } from 'react';
import { Users, FileSpreadsheet, KeyRound, Ban, CheckCircle, Database, AlertCircle, Trash2, ChartPie, UserPlus, ShieldAlert, Star } from 'lucide-react';
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

  // New User Creation Form States
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  const [newPlan, setNewPlan] = useState<'free' | 'pro' | 'enterprise'>('pro');
  const [createMsg, setCreateMsg] = useState<{ type: 'success' | 'rules' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleToggleRole = async (id: string, currentRole: 'user' | 'admin') => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to modify role');
      
      // Update local state
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: data.user.role } : u));
    } catch (err: any) {
      alert(err.message || 'Error occurred during role modifications.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg(null);
    if (!newName || !newEmail || !newPassword) {
      setCreateMsg({ type: 'error', text: 'All credentials (name, email, password) are required.' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
          plan: newPlan
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user account');
      
      setCreateMsg({ 
        type: 'success', 
        text: `Created user account "${newName}" as a ${newRole === 'admin' ? 'Super Admin' : 'User'} successfully!` 
      });
      
      // Clear inputs
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewRole('user');
      setNewPlan('pro');
      
      // Reload user list
      fetchUsers();
    } catch (err: any) {
      setCreateMsg({ type: 'error', text: err.message || 'Failed to register account.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-sans max-w-6xl mx-auto py-8 px-6" id="admin-panel-container">
      <div className="flex justify-between items-center mb-8 border-b border-[#e2e8f0] pb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight flex items-center gap-2">
            <span>Admin Control Panel</span>
            <span className="text-[10px] uppercase font-mono tracking-widest bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-extrabold">Superuser</span>
          </h2>
          <p className="text-sm text-[#64748b] mt-1 font-sans">Global control overrides, add new administrators, modify server policies, and manage file pipelines</p>
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

      {/* Global telemetry cards */}
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
                      <th className="py-3 px-4">Role</th>
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
                        <td className="py-3.5 px-4">
                          {u.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 font-black text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-[4px] text-[10px] uppercase">
                              <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> Super Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-[4px] text-[10px] uppercase">
                              Standard User
                            </span>
                          )}
                        </td>
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
                          <div className="flex gap-2 justify-end items-center">
                            <button
                              id={`btn-promote-u-${u.id}`}
                              onClick={() => handleToggleRole(u.id, u.role)}
                              disabled={u.id === 'usr-1'} // primary superuser safeguard
                              className="px-2.5 py-1.5 bg-white border border-[#e2e8f0] text-[10px] font-bold uppercase tracking-wider rounded-[4px] shadow-xxs disabled:opacity-45 hover:bg-slate-55 hover:border-slate-300 text-slate-700 cursor-pointer"
                            >
                              {u.role === 'admin' ? 'Revoke Super' : 'Make Super Admin'}
                            </button>
                            <button
                              id={`btn-toggle-status-${u.id}`}
                              onClick={() => handleToggleUser(u.id)}
                              disabled={u.id === 'usr-1'}
                              className={`px-2.5 py-1.5 bg-white border border-[#e2e8f0] text-[10px] font-bold uppercase tracking-wider rounded-[4px] shadow-xxs disabled:opacity-40 select-none cursor-pointer ${
                                u.status === 'active' 
                                  ? 'text-red-500 hover:bg-rose-50 hover:border-red-200' 
                                  : 'text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200'
                              }`}
                            >
                              {u.status === 'active' ? 'Disable' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right sidebar form + jobs list */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Registration Panel */}
            <div className="bg-white border border-[#e2e8f0] rounded-[4px] overflow-hidden shadow-xs" id="admin-user-create-form">
              <div className="bg-slate-50 py-3.5 px-4 border-b border-[#e2e8f0] flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                  <span>Register User / Super Admin</span>
                </h4>
              </div>

              <form onSubmit={handleCreateUser} className="p-4 space-y-4 font-sans text-xs">
                {createMsg && (
                  <div className={`p-3 rounded-[4px] border ${
                    createMsg.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                      : 'bg-rose-50 text-rose-800 border-rose-100'
                  }`}>
                    {createMsg.text}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xxs font-extrabold uppercase tracking-wider text-[#64748b]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 border border-[#e2e8f0] p-2.5 rounded-[4px] focus:outline-hidden focus:border-blue-500 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xxs font-extrabold uppercase tracking-wider text-[#64748b]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="name@nithyanacable.com"
                    className="w-full bg-slate-50 border border-[#e2e8f0] p-2.5 rounded-[4px] focus:outline-hidden focus:border-blue-500 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xxs font-extrabold uppercase tracking-wider text-[#64748b]">Temporary Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-[#e2e8f0] p-2.5 rounded-[4px] focus:outline-hidden focus:border-blue-500 font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xxs font-extrabold uppercase tracking-wider text-[#64748b]">Role</label>
                    <select
                      value={newRole}
                      onChange={e => setNewRole(e.target.value as 'user' | 'admin')}
                      className="w-full bg-slate-50 border border-[#e2e8f0] p-2.5 rounded-[4px] focus:outline-hidden focus:border-blue-500 font-sans cursor-pointer font-bold"
                    >
                      <option value="user">Standard User</option>
                      <option value="admin">Super Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xxs font-extrabold uppercase tracking-wider text-[#64748b]">Tier Plan</label>
                    <select
                      value={newPlan}
                      onChange={e => setNewPlan(e.target.value as 'free' | 'pro' | 'enterprise')}
                      className="w-full bg-slate-50 border border-[#e2e8f0] p-2.5 rounded-[4px] focus:outline-hidden focus:border-blue-500 font-sans cursor-pointer"
                    >
                      <option value="free">Free Starter</option>
                      <option value="pro">Pro Analyst</option>
                      <option value="enterprise">Enterprise VIP</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-[4px] uppercase tracking-wider transition-colors cursor-pointer text-xs"
                >
                  {submitting ? 'Registering Account...' : 'Add User Account'}
                </button>
              </form>
            </div>

            {/* Jobs monitoring audits list */}
            <div className="bg-white border border-[#e2e8f0] rounded-[4px] overflow-hidden shadow-xs">
              <div className="bg-slate-50 py-3.5 px-4 border-b border-[#e2e8f0]">
                <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Recent Parser jobs logs</h4>
              </div>

              <div className="p-4 divide-y divide-[#e2e8f0] max-h-[290px] overflow-y-auto space-y-3.5">
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
