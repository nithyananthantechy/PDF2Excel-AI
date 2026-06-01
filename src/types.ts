export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'disabled';
  createdAt: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface Job {
  id: string;
  userId: string;
  fileName: string;
  fileSize: string; // e.g. "4.2 MB"
  fileType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  processingTime: number; // in seconds
  excelUrl?: string;
  confidenceScore?: number; // e.g. 95
  sheetCount?: number;
  validationIssues?: string[];
  pages?: TablePageResult[];
  fileData?: string;
}

export interface TableRow {
  [columnName: string]: string;
}

export interface TablePageResult {
  pageNumber: number;
  headers: string[];
  rows: TableRow[];
}

export interface ValidationIssue {
  type: 'missing' | 'duplicate' | 'total_mismatch';
  message: string;
  severity: 'low' | 'medium' | 'high';
}
