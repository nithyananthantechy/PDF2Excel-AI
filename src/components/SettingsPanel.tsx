import React, { useState } from 'react';
import { Settings, Shield, KeyRound, User, Database, Building, Bell, Star } from 'lucide-react';

interface SettingsPanelProps {
  currentUser: any;
  onBack: () => void;
}

export function SettingsPanel({ currentUser, onBack }: SettingsPanelProps) {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [apiKey, setApiKey] = useState('••••••••••••••••••••••••••••••••');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="font-sans max-w-4xl mx-auto py-8 px-6" id="settings-panel-container">
      <div className="flex justify-between items-center mb-8 border-b border-[#e2e8f0] pb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">Account Settings</h2>
          <p className="text-sm text-[#64748b] mt-1">Configure your profile, API tokens, and subscription details</p>
        </div>
        <button
          id="btn-settings-ret-dash"
          onClick={onBack}
          className="text-xs font-bold uppercase tracking-wider text-[#0f172a] hover:bg-slate-50 border border-[#e2e8f0] py-2.5 px-4 rounded-[4px] cursor-pointer"
        >
          Return to Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8" id="settings-workspace">
        {/* Left tabs selector */}
        <div className="md:col-span-1 space-y-1.5" id="settings-tabs">
          <button className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-[4px] flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile Details</span>
          </button>
          <button className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50 rounded-[4px] flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            <span>Cloud Secrets Keys</span>
          </button>
          <button className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50 rounded-[4px] flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Pricing billing details</span>
          </button>
        </div>

        {/* Right side editing pane */}
        <div className="md:col-span-3 space-y-6" id="settings-forms-pane">
          {saved && (
            <div id="settings-save-success" className="bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider p-4 border border-emerald-100 rounded-[4px]">
              Settings configurations saved successfully.
            </div>
          )}

          <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-4 border-b border-[#e2e8f0] pb-3">User Profile info</h3>
            <form onSubmit={handleSave} className="space-y-4 font-sans text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 pb-1.5 uppercase tracking-wider">Full Operator Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-3 py-2 border border-[#e2e8f0] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-xs rounded-[4px] text-[#0f172a] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 pb-1.5 uppercase tracking-wider">Certified Email Link</label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="block w-full px-3 py-2 border border-[#e2e8f0] bg-slate-100 text-slate-500 text-xs rounded-[4px] cursor-not-allowed select-text font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  id="btn-settings-save"
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-[4px] hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-3 border-b border-[#e2e8f0] pb-3 flex items-center gap-1.5">
              <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
              <span>Subscription details</span>
            </h3>
            <div className="flex items-center justify-between text-xs" id="settings-billing-brief">
              <div>
                <p className="font-bold text-[#0f172a]">Active Tier: {currentUser?.plan?.toUpperCase() || 'FREE'}</p>
                <p className="text-slate-400 font-sans mt-0.5">Renews automatically on July 1, 2026. SSL Certified billing.</p>
              </div>
              <span className="font-mono bg-blue-50 text-blue-700 font-bold px-3 py-1 border border-blue-100 rounded-[4px] text-[10px] uppercase tracking-wider">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
