import React, { useState } from 'react';
import { FileSpreadsheet, Download, RefreshCw, ChevronLeft, Calendar, FileText, Percent, AlertCircle, ShieldAlert, BadgeInfo, CheckCircle, Edit2, Check, X } from 'lucide-react';
import { Job, TablePageResult } from '../types';
import { downloadExcel, downloadOriginalPDF } from '../utils/download';

interface ResultInspectorProps {
  job: Job;
  onBack: () => void;
  onJobUpdated?: (updatedJob: Job) => void;
}

export function ResultInspector({ job, onBack, onJobUpdated }: ResultInspectorProps) {
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(job.fileName);
  const [isRenaming, setIsRenaming] = useState(false);

  const handleRename = async () => {
    if (!tempName.trim()) return;
    setIsRenaming(true);
    try {
      const res = await fetch(`/api/job/${job.id}/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: tempName.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        if (onJobUpdated) {
          onJobUpdated(data.job);
        }
        setIsEditingName(false);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to rename document file name.');
      }
    } catch (err) {
      console.error('Rename error:', err);
      alert('Error updating file name.');
    } finally {
      setIsRenaming(false);
    }
  };

  if (!job.pages || job.pages.length === 0) {
    return (
      <div className="font-sans max-w-4xl mx-auto py-12 px-6 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f172a]">No tabular results data found</h3>
        <p className="text-xs text-[#64748b] mb-6">There was an unexpected structure compile anomaly in this scanned document.</p>
        <button id="btn-inspector-back-err" onClick={onBack} className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border border-[#e2e8f0] py-2.5 px-5 rounded-[4px] bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer">
          Back to list
        </button>
      </div>
    );
  }

  const activePage: TablePageResult = job.pages[activePageIndex];

  return (
    <div className="font-sans max-w-6xl mx-auto py-8 px-6" id="result-inspector-container">
      {/* Navigation Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-3">
          <button
            id="btn-inspector-back"
            onClick={onBack}
            className="p-2 border border-[#e2e8f0] hover:bg-slate-55 rounded-[4px] text-slate-600 transition-all cursor-pointer flex items-center justify-center bg-white"
          >
            <ChevronLeft className="h-4 w-4 text-[#0f172a]" />
          </button>
          <div>
            {isEditingName ? (
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename();
                    if (e.key === 'Escape') {
                      setTempName(job.fileName);
                      setIsEditingName(false);
                    }
                  }}
                  disabled={isRenaming}
                  className="px-2.5 py-1 text-sm border border-blue-500 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 rounded-[4px] text-[#0f172a] font-bold min-w-[200px]"
                />
                <button
                  onClick={handleRename}
                  disabled={isRenaming}
                  className="p-1 px-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[4px] cursor-pointer"
                  title="Save Name"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setTempName(job.fileName);
                    setIsEditingName(false);
                  }}
                  disabled={isRenaming}
                  className="p-1 px-1.5 border border-[#e2e8f0] bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-[4px] cursor-pointer"
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-xl font-bold text-[#0f172a] tracking-tight select-all">{job.fileName}</h2>
                <button
                  onClick={() => {
                    setTempName(job.fileName);
                    setIsEditingName(true);
                  }}
                  className="p-1 text-[#64748b] hover:text-blue-600 hover:bg-slate-50 border border-transparent hover:border-[#e2e8f0] rounded-[4px] cursor-pointer transition-all"
                  title="Rename document file"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 border border-emerald-100 rounded-[4px] uppercase tracking-wider shrink-0 select-none">
                  PARS_COMPLETED
                </span>
              </div>
            )}
            <p className="text-xs text-[#64748b] mt-1">Uploaded at {new Date(job.createdAt).toLocaleString()} • Size: {job.fileSize}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0" id="inspector-actions">
          <button
            id="btn-inspector-pdf-download"
            onClick={() => downloadOriginalPDF(job.fileData, job.fileName)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-[#0f172a] border border-[#e2e8f0] font-bold text-xs uppercase tracking-wider rounded-[4px] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            title="Download the uploaded original PDF document"
          >
            <FileText className="h-4 w-4 text-rose-500" />
            <span>PDF Original</span>
          </button>

          <button
            id="btn-inspector-download"
            onClick={() => downloadExcel(job.id, job.fileName)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-[4px] transition-all flex items-center gap-2 cursor-pointer border border-transparent shadow-xs"
          >
            <Download className="h-4 w-4" />
            <span>Excel Sheet</span>
          </button>
        </div>
      </div>

      {/* Highlights metrics cards bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="inspector-brief-cards">
        <div className="bg-slate-50 border border-[#e2e8f0] p-4 rounded-[4px] flex items-center gap-3.5 shadow-xs">
          <div className="h-10 w-10 bg-white rounded-[4px] border border-[#e2e8f0] flex items-center justify-center shrink-0 text-blue-600 font-bold text-sm shadow-xxs font-mono">
            {job.sheetCount || 1}
          </div>
          <div>
            <span className="text-xxs font-bold text-[#64748b] uppercase tracking-widest font-sans">Workbook Sheets</span>
            <p className="text-xs font-bold text-[#0f172a] font-sans mt-0.5">Separate Page tabs</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-[#e2e8f0] p-4 rounded-[4px] flex items-center gap-3.5 shadow-xs">
          <div className="h-10 w-10 bg-white rounded-[4px] border border-[#e2e8f0] flex items-center justify-center shrink-0 text-emerald-600 font-bold text-sm shadow-xxs">
            <Percent className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <span className="text-xxs font-bold text-[#64748b] uppercase tracking-widest font-sans">Confidence Rating</span>
            <p className="text-xs font-bold text-[#0f172a] font-sans mt-0.5">{job.confidenceScore}% Accuracy</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-[#e2e8f0] p-4 rounded-[4px] flex items-center gap-3.5 col-span-2 shadow-xs">
          <div className="h-10 w-10 bg-white rounded-[4px] border border-[#e2e8f0] flex items-center justify-center shrink-0 text-md shadow-xxs font-mono">
            {(job.validationIssues && job.validationIssues.length > 0) ? (
              <ShieldAlert className="h-5 w-5 text-amber-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            )}
          </div>
          <div>
            <span className="text-xxs font-bold text-[#64748b] uppercase tracking-widest font-sans">Consistency Auditing Check</span>
            <p className="text-xs font-bold text-[#0f172a] font-sans mt-0.5">
              {(job.validationIssues && job.validationIssues.length > 0) 
                ? `Detected ${job.validationIssues.length} logical warnings` 
                : 'Verified successfully (0 discrepancies)'}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Workspace Layout with Sidebar (Page selection & Audit warning details) & Content (Active spreadsheet grid) */}
      <div className="grid lg:grid-cols-4 gap-8" id="inspector-workspace">
        {/* Left column navigation */}
        <div className="lg:col-span-1 space-y-6" id="inspector-control-rail">
          {/* Sheet Selector */}
          <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 shadow-xxs">
            <h4 className="text-[10px] font-bold text-[#0f172a] uppercase tracking-wider mb-3">Workbook sheets</h4>
            <div className="space-y-1.5" id="sheet-selector-buttons">
              {job.pages.map((p, idx) => (
                <button
                  key={idx}
                  id={`btn-select-sheet-page-${p.pageNumber}`}
                  onClick={() => setActivePageIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-[4px] text-left cursor-pointer transition-all ${
                    idx === activePageIndex
                      ? 'bg-blue-600 text-white shadow-xxs'
                      : 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className={`h-4 w-4 ${idx === activePageIndex ? 'text-blue-200' : 'text-slate-400'}`} />
                    <span>Page {p.pageNumber}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] ${idx === activePageIndex ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'}`}>
                    {p.rows.length} rows
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Validation Audit warning list box */}
          <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 shadow-xxs" id="inspector-audits-warnings">
            <h4 className="text-[10px] font-bold text-[#0f172a] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <BadgeInfo className="h-4 w-4 text-blue-500" />
              <span>Logic Audit Log</span>
            </h4>
            
            {job.validationIssues && job.validationIssues.length > 0 ? (
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {job.validationIssues.map((issue, idx) => (
                  <div key={idx} className="bg-amber-50 border border-amber-100 text-amber-900 rounded-[4px] p-3 text-xxs font-semibold leading-relaxed flex items-start gap-2 animate-fade-in" id={`audit-issue-${idx}`}>
                    <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 flex flex-col items-center justify-center p-3" id="audit-passed-state">
                <CheckCircle className="h-8 w-8 text-emerald-400 mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Auditing Clean</p>
                <p className="text-[10px] text-slate-400 mt-1">Numerical totals and row keys verify perfectly.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Interactive parsed spreadsheets grid sheet */}
        <div className="lg:col-span-3 space-y-4" id="inspector-spreadsheet-pane">
          <div className="bg-white border border-[#e2e8f0] rounded-[4px] overflow-hidden shadow-xs">
            <div className="bg-slate-50 py-3 px-4 border-b border-[#e2e8f0] flex justify-between items-center flex-wrap gap-2">
              <span className="text-[10px] font-bold text-[#0f172a] uppercase tracking-wider font-sans">
                Active tab view: Page {activePage.pageNumber}
              </span>
              <span className="font-mono text-[10px] text-[#334155] bg-white border border-[#e2e8f0] px-2 py-0.5 rounded-[4px] font-bold">
                ROWS_COUNT: {activePage.rows.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse select-all">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-xxs font-bold text-[#64748b] uppercase tracking-wider font-sans">
                    <th className="py-2.5 px-3 border-r border-[#e2e8f0] text-center w-12 select-none">#</th>
                    {activePage.headers.map((hdr, hIdx) => (
                      <th key={hIdx} className="py-2.5 px-3 border-r border-[#e2e8f0] font-sans font-bold text-[#0f172a]">
                        {hdr}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-xs font-mono text-[#334155]">
                  {activePage.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/40 group transition-colors">
                      <td className="py-2 px-3 border-r border-[#e2e8f0] text-center text-slate-400 select-none bg-slate-50/20 text-xxs font-sans font-bold">
                        {rIdx + 1}
                      </td>
                      {activePage.headers.map((hdr, hIdx) => {
                        const val = row[hdr] || '';
                        return (
                          <td key={hIdx} className="py-2 px-3 border-r border-[#e2e8f0] outline-none focus:bg-white select-all">
                            {val.toString()}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-50/40 p-3 text-xxs text-[#64748b] flex items-center justify-between border-t border-[#e2e8f0] select-none">
              <span>Rows correspond to the order of scanned document. Click and drag text blocks to manually copy values.</span>
              <span className="font-bold">XLSX PRESERVATION ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
