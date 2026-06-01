import React, { useState, useRef } from 'react';
import { Upload, File, FileSpreadsheet, Play, AlertCircle, Trash2, Check, Sparkles, Loader2, ArrowLeftRight } from 'lucide-react';
import { Job } from '../types';

interface UploadDashboardProps {
  onJobCreated: (job: Job) => void;
  onNavigateToHistory: () => void;
  currentUser: any;
}

export function UploadDashboard({ onJobCreated, onNavigateToHistory, currentUser }: UploadDashboardProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Array<{ name: string; size: string; type: string; base64: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    // Max 100MB
    if (file.size > 100 * 1024 * 1024) {
      setUploadError(`File ${file.name} exceeds the 100MB industrial upload limit.`);
      return;
    }

    const typeLower = file.type.toLowerCase();
    const nameLower = file.name.toLowerCase();
    const isValidFormat = 
      typeLower === 'application/pdf' || 
      nameLower.endsWith('.pdf') || 
      nameLower.endsWith('.png') || 
      nameLower.endsWith('.jpg') || 
      nameLower.endsWith('.jpeg') || 
      typeLower.startsWith('image/');

    if (!isValidFormat) {
      setUploadError(`Invalid file format: ${file.name}. Only PDF, JPG, and PNG documents are approved.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      
      setSelectedFiles(prev => [
        ...prev,
        {
          name: file.name,
          size: formattedSize,
          type: file.type || 'application/pdf',
          base64: base64
        }
      ]);
      setUploadError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        processFile(e.dataTransfer.files[i]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files.length; i++) {
        processFile(e.target.files[i]);
      }
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedFile = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const clearAllSelected = () => {
    setSelectedFiles([]);
    setUploadError(null);
    setSuccessCount(0);
  };

  const handleBatchProcess = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadError(null);
    let succ = 0;

    for (const file of selectedFiles) {
      try {
        // Step 1: Registry the file upload
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileData: file.base64
          })
        });

        if (!uploadRes.ok) {
          throw new Error(`Failed register upload metadata for ${file.name}`);
        }

        const uploadData = await uploadRes.json();
        const createdJob = uploadData.job;

        // Step 2: Trigger extraction pipeline
        const processRes = await fetch('/api/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: createdJob.id })
        });

        if (!processRes.ok) {
          const errJson = await processRes.json().catch(() => ({}));
          throw new Error(errJson.error || `Failed table parsing pipeline for ${file.name}`);
        }

        const processedData = await processRes.json();
        onJobCreated(processedData.job);
        succ++;
        setSuccessCount(succ);

      } catch (err: any) {
        setUploadError(`Failed processing file "${file.name}": ` + (err.message || 'Error occurred.'));
        break; // Stop batch run on error to inspect
      }
    }

    setIsUploading(false);
    
    if (succ === selectedFiles.length) {
      // Automatic clear state and transition to Job History log tab
      setTimeout(() => {
        clearAllSelected();
        onNavigateToHistory();
      }, 1500);
    }
  };

  return (
    <div className="font-sans max-w-4xl mx-auto py-8 px-6" id="upload-dashboard-container">
      <div className="flex items-center justify-between mb-8 border-b border-[#e2e8f0] pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0f172a]">Convert Documents</h2>
          <p className="text-sm text-[#64748b] mt-1">Upload files, logistics charts, handwritten sheets or scanned PDFs</p>
        </div>
        <button
          id="btn-nav-history-log"
          onClick={onNavigateToHistory}
          className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 border border-blue-200 bg-blue-50/50 hover:bg-blue-50 px-4 py-2 rounded-[4px] transition-all cursor-pointer"
        >
          View Job History log
        </button>
      </div>

      {uploadError && (
        <div id="upload-error-banner" className="mb-6 bg-rose-50 text-rose-750 text-xs p-4 rounded-[4px] border border-rose-100 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <span className="font-semibold">{uploadError}</span>
        </div>
      )}

      {successCount > 0 && (
        <div id="upload-success-counter" className="mb-6 bg-emerald-50 text-emerald-800 text-xs p-4 rounded-[4px] border border-emerald-100 flex items-start gap-3">
          <Check className="h-5 w-5 shrink-0 text-emerald-600" />
          <span className="font-semibold">
            Successfully extracted tables and formatted <strong>{successCount} / {selectedFiles.length}</strong> loaded documents as Sheet workbook databases!
          </span>
        </div>
      )}

      {/* Drag and Drop Zone Area - Geometric Balance */}
      <div
        id="drag-drop-zone"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileBrowser}
        className={`border-2 border-dashed rounded-[4px] p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          dragActive 
            ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-100/50' 
            : 'border-[#e2e8f0] hover:border-blue-600 bg-slate-50 hover:bg-white'
        }`}
      >
        <input
          id="file-input-hidden"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".pdf,.png,.jpg,.jpeg,image/*"
          className="hidden"
        />

        <div className="h-14 w-14 rounded-[4px] bg-white border border-[#e2e8f0] flex items-center justify-center mb-4 text-[#475569] shadow-xs">
          <Upload className="h-6 w-6 text-blue-600" />
        </div>

        <h4 className="text-sm font-bold uppercase tracking-wider text-[#0f172a] mb-1">Drag and drop files here, or click to browse</h4>
        <p className="text-xs text-[#64748b] max-w-xs mx-auto leading-relaxed">
          Supports multi-page PDF, PNG, or JPG documents up to <strong className="text-[#0f172a]">100 MB</strong> total size.
        </p>
      </div>

      {/* Selected files stack grid list - Geometric Balance */}
      {selectedFiles.length > 0 && (
        <div className="mt-8 bg-white border border-[#e2e8f0] rounded-[4px] overflow-hidden" id="selected-files-list">
          <div className="bg-slate-50 py-3.5 px-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <h5 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
              <File className="h-4 w-4 text-blue-600" />
              <span>Prepared for OCR Batch ({selectedFiles.length} documents)</span>
            </h5>
            <button
              id="btn-clear-selected-files"
              onClick={clearAllSelected}
              disabled={isUploading}
              className="text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 disabled:opacity-50 cursor-pointer"
            >
              Clear list
            </button>
          </div>

          <div className="divide-y divide-[#e2e8f0]">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 bg-blue-50 border border-blue-100 rounded-[4px] flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0f172a] truncate">{file.name}</p>
                    <p className="text-xs text-[#64748b] font-mono mt-0.5">{file.size} • {file.type.split('/')[1]?.toUpperCase() || 'PDF'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-remove-file-${idx}`}
                    onClick={() => removeSelectedFile(idx)}
                    disabled={isUploading}
                    className="p-1.5 text-[#64748b] hover:text-rose-600 hover:bg-rose-50 rounded-[4px] transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 py-4 px-6 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#64748b]">
              <Sparkles className="h-4 w-4 text-[#eab308]" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Processing via Google Gemini 2.5 Pro Vision rules.</span>
            </div>

            <button
              id="btn-trigger-ocr"
              disabled={isUploading}
              onClick={handleBatchProcess}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-[4px] hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Scanning records ({successCount}/{selectedFiles.length})...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Process and Generate Excel sheets</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
