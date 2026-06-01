import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Play, Download, Trash2, CheckCircle2, AlertTriangle, Clock, Percent, ShieldCheck, ChevronRight } from 'lucide-react';
import { Job } from '../types';
import { downloadExcel } from '../utils/download';

interface HistoryDashboardProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onDeleteJob: (id: string) => Promise<void>;
  onNavigateToUpload: () => void;
}

export function HistoryDashboard({ jobs, onSelectJob, onDeleteJob, onNavigateToUpload }: HistoryDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'processing'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="font-sans max-w-6xl mx-auto py-8 px-6" id="history-dashboard-container">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-[#e2e8f0] pb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">Parser Job logs</h2>
          <p className="text-sm text-[#64748b] mt-1">Track structural table OCR extractions, confidence scores, and spreadsheet downloads</p>
        </div>
        <button
          id="btn-goto-upload-dash"
          onClick={onNavigateToUpload}
          className="text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-[4px] transition-all cursor-pointer"
        >
          New Document Conversion
        </button>
      </div>

      {jobs.length === 0 ? (
        <div id="history-empty-placeholder" className="bg-slate-50 border border-dashed border-[#e2e8f0] p-12 text-center rounded-[4px] font-sans">
          <FileText className="h-12 w-12 text-[#94a3b8] mx-auto mb-4" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#0f172a] mb-1">No jobs recorded yet</h4>
          <p className="text-xs text-[#64748b] max-w-sm mx-auto leading-relaxed mb-6">
            Upload your first scanned invoices, receives sheets, or handwritten records to run OCR.
          </p>
          <button
            id="empty-cta-upload"
            onClick={onNavigateToUpload}
            className="text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-[4px] transition-all cursor-pointer"
          >
            Process document now
          </button>
        </div>
      ) : (
        <div className="space-y-6" id="history-main-grid">
          {/* Quick Stats Summary Banner - Geometric Balance */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="history-stats-bar">
            <div className="bg-slate-50 p-4 rounded-[4px] border border-[#e2e8f0] font-sans shadow-xs">
              <span className="text-xxs font-bold text-[#64748b] uppercase tracking-widest">Total Logs</span>
              <p className="text-2xl font-black text-[#0f172a] mt-1">{jobs.length}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-[4px] border border-[#e2e8f0] font-sans shadow-xs">
              <span className="text-xxs font-bold text-[#64748b] uppercase tracking-widest font-sans">Excel Sheets Done</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {jobs.filter(j => j.status === 'completed').length}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-[4px] border border-[#e2e8f0] font-sans shadow-xs">
              <span className="text-xxs font-bold text-[#64748b] uppercase tracking-widest font-sans">Avg Confidence %</span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {(
                  jobs
                    .filter(j => j.status === 'completed' && j.confidenceScore)
                    .reduce((acc, curr) => acc + (curr.confidenceScore || 0), 0) /
                  (jobs.filter(j => j.status === 'completed' && j.confidenceScore).length || 1)
                ).toFixed(1)}%
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-[4px] border border-[#e2e8f0] font-sans shadow-xs">
              <span className="text-xxs font-bold text-[#64748b] uppercase tracking-widest font-sans">Avg Speed</span>
              <p className="text-2xl font-black text-slate-700 mt-1">
                {(
                  jobs
                    .filter(j => j.status === 'completed' && j.processingTime)
                    .reduce((acc, curr) => acc + (curr.processingTime || 0), 0) /
                  (jobs.filter(j => j.status === 'completed' && j.processingTime).length || 1)
                ).toFixed(1)}s
              </p>
            </div>
          </div>

          {/* Table Filters & Search UI */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-sans bg-slate-50 border border-[#e2e8f0] p-4 rounded-[4px]">
            <div className="flex bg-white border border-[#e2e8f0] rounded-[4px] p-0.5" id="history-status-filters">
              {(['all', 'completed', 'processing', 'failed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-[4px] cursor-pointer transition-all ${
                    filter === f 
                      ? 'bg-[#0f172a] text-white' 
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <input
              id="history-search-input"
              type="text"
              placeholder="Search file name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:max-w-xs px-3 py-2 bg-white border border-[#e2e8f0] rounded-[4px] text-xs font-sans focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          {/* Job Logs Table List */}
          <div className="bg-white border border-[#e2e8f0] rounded-[4px] overflow-hidden shadow-xs" id="history-table-wrapper">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#e2e8f0] text-xxs font-bold text-[#64748b] uppercase tracking-wider font-sans">
                    <th className="py-3 px-4">Document Details</th>
                    <th className="py-3 px-4">Extraction Date</th>
                    <th className="py-3 px-4 text-center">Pages / Sheets</th>
                    <th className="py-3 px-4">Speed / Confidence</th>
                    <th className="py-3 px-4">Auditing / Warnings</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-xs text-[#334155]">
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-[#64748b] font-sans">
                        No matches correspond to the filter query criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-4 font-sans">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 bg-blue-50 border border-blue-100 rounded-[4px] flex items-center justify-center shrink-0">
                              <FileSpreadsheet className="h-4.5 w-4.5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#0f172a] truncate max-w-xs">{job.fileName}</p>
                              <p className="text-[#64748b] text-xxs mt-0.5">{job.fileSize} • {job.fileType.split('/')[1]?.toUpperCase() || 'PDF'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono text-slate-600">
                          {new Date(job.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                        </td>

                        <td className="py-4 px-4 font-sans text-center">
                          <span className="inline-flex items-center gap-1 bg-slate-100 font-bold text-slate-800 px-2 py-0.5 rounded-[4px] text-[10px]">
                            {job.sheetCount || 1} { (job.sheetCount || 1) === 1 ? 'Sheet' : 'Sheets' }
                          </span>
                        </td>

                        <td className="py-4 px-4 font-sans">
                          {job.status === 'completed' && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-[#64748b]">
                                <Clock className="h-3 w-3" />
                                <span>{job.processingTime}s</span>
                              </div>
                              <div className="flex items-center gap-1 font-bold text-emerald-600">
                                <Percent className="h-3 w-3" />
                                <span>{job.confidenceScore}%</span>
                              </div>
                            </div>
                          )}
                          {job.status === 'processing' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-700 animate-pulse uppercase">
                              Processing...
                            </span>
                          )}
                          {job.status === 'failed' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-rose-50 text-rose-700 uppercase">
                              Failed
                            </span>
                          )}
                          {job.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-slate-50 text-slate-600 uppercase">
                              Enqueued
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 font-sans">
                          {job.status === 'completed' && (
                            <>
                              {job.validationIssues && job.validationIssues.length > 0 ? (
                                <div className="text-amber-700 flex items-start gap-1.5 max-w-xs">
                                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                  <span className="line-clamp-2 text-xxs font-semibold leading-relaxed">
                                    {job.validationIssues[0]}
                                  </span>
                                </div>
                              ) : (
                                <div className="text-emerald-700 flex items-center gap-1 text-xxs font-semibold">
                                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                                  <span>Passed calculation validation audits</span>
                                </div>
                              )}
                            </>
                          )}
                        </td>

                        <td className="py-4 px-4 text-right font-sans">
                          <div className="flex items-center justify-end gap-2">
                            {job.status === 'completed' && (
                              <>
                                <button
                                  id={`btn-inspect-job-${job.id}`}
                                  onClick={() => onSelectJob(job)}
                                  className="text-xxs font-bold uppercase tracking-wider text-[#0f172a] bg-slate-50 hover:bg-slate-100 border border-[#e2e8f0] py-1.5 px-3 rounded-[4px] transition-all cursor-pointer flex items-center gap-1 shrink-0"
                                >
                                  <span>Inspect</span>
                                  <ChevronRight className="h-3 w-3" />
                                </button>
                                <button
                                  id={`btn-download-excel-${job.id}`}
                                  onClick={() => downloadExcel(job.id, job.fileName)}
                                  className="text-xxs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 py-2 px-3 rounded-[4px] transition-colors inline-flex items-center gap-1 shrink-0 cursor-pointer"
                                >
                                  <Download className="h-3 w-3" />
                                  <span>Excel</span>
                                </button>
                              </>
                            )}

                            <button
                              id={`btn-delete-job-${job.id}`}
                              onClick={() => onDeleteJob(job.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[4px] border border-transparent hover:border-rose-100 transition-all cursor-pointer shrink-0"
                              title="Delete job log"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
