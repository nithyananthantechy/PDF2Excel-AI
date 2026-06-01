import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, ShieldAlert, BadgeDollarSign, ChevronRight, Zap, Sparkles, Star, Users, Database, FileText } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'register' | 'dashboard' | 'pricing' | 'admin') => void;
  currentUser: any;
  onLogout: () => void;
}

export function LandingPage({ onNavigate, currentUser, onLogout }: LandingPageProps) {
  const [stripeProgress, setStripeProgress] = useState<'idle' | 'checkout' | 'success'>('idle');
  const [razorProgress, setRazorProgress] = useState<'idle' | 'checkout' | 'success'>('idle');
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const triggerMockStripe = (plan: string) => {
    setSelectedPlan(plan);
    setStripeProgress('checkout');
    setTimeout(() => {
      setStripeProgress('success');
      setTimeout(() => {
        setStripeProgress('idle');
      }, 3000);
    }, 2000);
  };

  const triggerMockRazorpay = (plan: string) => {
    setSelectedPlan(plan);
    setRazorProgress('checkout');
    setTimeout(() => {
      setRazorProgress('success');
      setTimeout(() => {
        setRazorProgress('idle');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Dynamic Stripe/Razorpay Simulation Dialogs */}
      {stripeProgress !== 'idle' && (
        <div id="stripe-sim-modal" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600 animate-pulse"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <BadgeDollarSign className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-sans text-slate-900">Stripe Secure Gateway</h3>
                <p className="text-xs text-slate-500 font-mono">Invoice reference: ST-SUB-{Math.floor(Math.random() * 89999 + 10000)}</p>
              </div>
            </div>

            {stripeProgress === 'checkout' && (
              <div className="space-y-4 font-sans text-slate-700 animate-fade-in" id="stripe-checkout-state">
                <p className="text-sm">Initiating checkout for <strong className="text-indigo-600">{selectedPlan} Plan</strong> subscription...</p>
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
                    <span>Card Holder</span>
                    <span>Card Number</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold mb-3">
                    <span>{currentUser?.name || "Nithyananthan Nagarjan"}</span>
                    <span>•••• •••• •••• 4242</span>
                  </div>
                  <div className="text-xs text-slate-400">Merchant: PDF2Excel AI Global Inc. SSL Secured.</div>
                </div>
                <div className="flex items-center gap-3 justify-center text-sm font-medium py-2">
                  <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing secure payment...</span>
                </div>
              </div>
            )}

            {stripeProgress === 'success' && (
              <div className="space-y-3 font-sans text-center py-4 animate-scale-up" id="stripe-success-state">
                <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-2 text-emerald-600">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <h4 className="text-md font-bold text-slate-900">Subscription Updated</h4>
                <p className="text-sm text-slate-500">Stripe payment confirmed successfully. Your account plan is updated to <strong>{selectedPlan}</strong>. Seamless scanning enabled!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {razorProgress !== 'idle' && (
        <div id="razorpay-sim-modal" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-cyan-500 animate-pulse"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                <svg className="h-6 w-6 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 22h20L12 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold font-sans text-slate-900">Razorpay Live Gateway</h3>
                <p className="text-xs text-slate-500 font-mono">Receipt: RPZ-{Math.floor(Math.random() * 89999 + 10000)}</p>
              </div>
            </div>

            {razorProgress === 'checkout' && (
              <div className="space-y-4 font-sans text-slate-700 animate-fade-in" id="razor-checkout-state">
                <p className="text-sm">Initiating transaction for <strong className="text-cyan-500">{selectedPlan} Plan</strong> via UPI / Netbanking...</p>
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
                    <span>UPI ID</span>
                    <span>Account reference</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold mb-3">
                    <span>{currentUser?.email?.split('@')[0] || "nithya"}@okhdfcbank</span>
                    <span>{currentUser?.name || "Nithya N."}</span>
                  </div>
                  <div className="text-xs text-slate-400">Protected by UPI 2-Factor Authentication Shield.</div>
                </div>
                <div className="flex items-center gap-3 justify-center text-sm font-medium py-2">
                  <svg className="animate-spin h-5 w-5 text-cyan-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing secure UPI channel...</span>
                </div>
              </div>
            )}

            {razorProgress === 'success' && (
              <div className="space-y-3 font-sans text-center py-4 animate-scale-up" id="razor-success-state">
                <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-2 text-emerald-600">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <h4 className="text-md font-bold text-slate-900">Subscription Upgraded Successfully</h4>
                <p className="text-sm text-slate-500">Razorpay UPI payment confirmed. Your account plan is updated to <strong>{selectedPlan}</strong>.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modern Navigation Header Layout - Geometric Balance */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] px-8 py-4 flex items-center justify-between mx-auto w-full">
        <div className="flex items-center gap-3" id="nav-brand">
          <div className="h-8 w-8 bg-blue-600 flex items-center justify-center rounded-[4px] text-white font-black text-lg select-none">
            P
          </div>
          <span className="text-lg font-bold tracking-tight text-[#0f172a] font-sans">
            PDF2Excel <span className="text-blue-600 font-extrabold">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#64748b] font-sans">
          <a href="#features-section" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#benefits-section" className="hover:text-blue-600 transition-colors">How it works</a>
          <a href="#pricing-grid" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#tech-specs" className="hover:text-blue-600 transition-colors">Specs</a>
        </nav>

        <div className="flex items-center gap-4" id="nav-actions">
          {currentUser ? (
            <>
              <button
                id="btn-goto-dashboard"
                onClick={() => onNavigate('dashboard')}
                className="text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 border border-transparent rounded-[4px] transition-all cursor-pointer font-sans"
              >
                Dashboard
              </button>
              {currentUser.role === 'admin' && (
                <button
                  id="btn-goto-admin"
                  onClick={() => onNavigate('admin')}
                  className="text-xs font-bold uppercase tracking-wider text-[#0f172a] hover:bg-slate-50 px-4 py-2 border border-[#e2e8f0] rounded-[4px] transition-all cursor-pointer font-sans"
                >
                  Admin Panel
                </button>
              )}
              <button
                id="btn-logout-landing"
                onClick={onLogout}
                className="text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 cursor-pointer font-sans"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                id="btn-nav-login"
                onClick={() => onNavigate('login')}
                className="text-xs font-bold uppercase tracking-wider text-[#64748b] hover:text-[#0f172a] cursor-pointer font-sans"
              >
                Sign In
              </button>
              <button
                id="btn-nav-register"
                onClick={() => onNavigate('register')}
                className="text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-[4px] transition-all cursor-pointer font-sans"
              >
                Start Free Trial
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-6" id="hero-banner">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-50/70 rounded-full filter blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-12 left-10 w-80 h-80 bg-cyan-50/50 rounded-full filter blur-[80px] -z-10"></div>

        <div className="text-center max-w-4xl mx-auto font-sans">
          <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs px-3.5 py-1.5 rounded-full font-semibold tracking-wide uppercase mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-slate-900" />
            <span>OCR Powered by Google Gemini 2.5 Pro Vision</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-sans tracking-tight font-extrabold text-slate-950 leading-tight">
            Convert Handwritten Forms, PDFs, & Logistics Records into <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 bg-clip-text text-transparent">Flawless Excel Sheets</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Instantly extract intricate scanned warehouses tables, multi-page stock receiving records, invoices, and physical paperwork directly to dynamic formatting spreadsheets. Preserve row hierarchy perfectly.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4" id="hero-cta-group">
            <button
              id="cta-get-started"
              onClick={() => onNavigate(currentUser ? 'dashboard' : 'register')}
              className="w-full sm:w-auto text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 px-8 py-4 rounded-xl transition-all inline-flex items-center justify-center gap-2 shadow-md hover:translate-y-[-1px] cursor-pointer font-sans"
            >
              <span>{currentUser ? "Go to workspace" : "Get started for free"}</span>
              <ChevronRight className="h-5 w-5" />
            </button>
            <a
              href="#pricing-grid"
              className="w-full sm:w-auto text-base font-semibold text-slate-700 hover:text-slate-900 px-6 py-4 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all inline-flex items-center justify-center gap-1.5 float-right cursor-pointer font-sans"
            >
              <span>View Pricing plans</span>
            </a>
          </div>

          <div className="mt-12 flex justify-center items-center gap-8 flex-wrap" id="hero-features-ribbon">
            <div className="flex items-center gap-2.5 text-slate-500 font-sans text-xs sm:text-sm font-semibold">
              <Star className="h-4 w-4 text-indigo-600 fill-indigo-600" />
              <span>Multi-page PDFs to Multi-sheet Excel</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500 font-sans text-xs sm:text-sm font-semibold">
              <Star className="h-4 w-4 text-indigo-600 fill-indigo-600" />
              <span>Handwritten Digitizer</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500 font-sans text-xs sm:text-sm font-semibold">
              <Star className="h-4 w-4 text-indigo-600 fill-indigo-600" />
              <span>AI Logic Math Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Overview Section */}
      <section className="bg-slate-50 py-20 px-6 border-y border-slate-200/50" id="features-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto font-sans mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Engineered for Industrial Logistics & Document Ops
            </h2>
            <p className="mt-4 text-md text-slate-600 leading-relaxed">
              Standard OCR fails on structural tables, handwritten inventory slips, and multi-page receipts. PDF2Excel AI adapts with a dual-OCR vision neural parsing architecture.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 font-sans">
            <div className="bg-white p-6 border border-slate-200/80 rounded-xl hover:shadow-xs transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Drag & Drop Batch Upload</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Seamlessly upload multipage PDFs, scanned sheets, JPEG, or PNG packages. Supports high resolution files up to 100MB per file with safe sanitization checks.
              </p>
            </div>

            <div className="bg-white p-6 border border-slate-200/80 rounded-xl hover:shadow-xs transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Table Structure Preservation</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Preserves row ordering, blank padding values, currency headers, dates, and names explicitly. Never summarize calculations or force change numerical constants without your permission.
              </p>
            </div>

            <div className="bg-white p-6 border border-slate-200/80 rounded-xl hover:shadow-xs transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Validation & Confidence</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Detect missing field cells, duplicate layout entries, and calculation inconsistencies (such as Qty × Unit Price mismatches) instantly on our result inspector.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Visual Narrative */}
      <section className="py-20 px-6 max-w-7xl mx-auto" id="benefits-section">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="font-sans space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              One Sheet per Page: Flawless Multipage Exporting
            </h2>
            <p className="text-md text-slate-600 leading-relaxed">
              When working with structured warehouses logs or monthly invoice bundles, parsing page-by-page is vital.
              PDF2Excel AI is programmed to generate a distinct Excel Sheet tab for every single page in your document:
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-600" />
                <span>Page 1 is exported to <strong className="text-slate-900">Sheet 1</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-600" />
                <span>Page 2 is exported to <strong className="text-slate-900">Sheet 2</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-600" />
                <span>Auto-calculating cell columns width prevents content truncate</span>
              </li>
            </ul>
            <div className="pt-4">
              <button
                onClick={() => onNavigate(currentUser ? 'dashboard' : 'login')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                <span>Process your first document now</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-1.5">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                <span className="font-sans font-bold text-sm text-slate-700">Workbook Preview: receiving_log_5.xlsx</span>
              </div>
              <span className="font-mono text-xxs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm font-bold">EXCEL_WORKBOOK</span>
            </div>

            <div className="space-y-2 select-none">
              <div className="grid grid-cols-5 text-xxs font-mono text-slate-400 font-bold uppercase tracking-wide gap-1">
                <span>Row #</span>
                <span>Date</span>
                <span>Supplier SKU</span>
                <span>Qty Recv</span>
                <span>Status</span>
              </div>
              <div className="grid grid-cols-5 text-xs font-mono text-slate-800 border-b border-slate-100 py-1 gap-1 bg-white p-1 rounded-sm shadow-xxs">
                <span className="text-slate-400">1</span>
                <span>2026-05-31</span>
                <span>SKU-77401</span>
                <span>1,550</span>
                <span className="text-emerald-600 font-semibold">RECEIVED</span>
              </div>
              <div className="grid grid-cols-5 text-xs font-mono text-slate-800 border-b border-slate-100 py-1 gap-1">
                <span className="text-slate-400">2</span>
                <span>2026-06-01</span>
                <span>SKU-00431</span>
                <span>412</span>
                <span className="text-emerald-600 font-semibold">RECEIVED</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex gap-2">
              <span className="px-2.5 py-1 text-xxs bg-emerald-600 text-white rounded-md font-sans font-bold">Page 1 (Sheet 1)</span>
              <span className="px-2.5 py-1 text-xxs bg-slate-200 text-slate-600 rounded-md font-sans">Page 2 (Sheet 2)</span>
              <span className="px-2.5 py-1 text-xxs bg-slate-200 text-slate-600 rounded-md font-sans">Page 3 (Sheet 3)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Module Grid Section */}
      <section className="bg-slate-50 py-20 px-6 border-t border-[#e2e8f0]" id="pricing-grid">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto font-sans mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Pricing & Subscription Plans</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f172a] mt-2">
              Simple, Transparent SaaS Tiers
            </h2>
            <p className="mt-3 text-sm text-[#64748b]">
              Unlock handwritten digitization, higher limits, and unlimited secure exports. Integrates live with both Razorpay and Stripe gateways.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch font-sans">
            {/* Free */}
            <div className="bg-white p-8 border border-[#e2e8f0] rounded-[4px] flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-xl font-bold text-[#0f172a]">Free Tier</h3>
                <p className="mt-2 text-xs text-[#64748b] leading-relaxed">Perfect for micro independent testers checking basic PDFs.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#0f172a]">$0</span>
                  <span className="text-xs text-[#64748b]">/ forever</span>
                </div>
                <div className="border-t border-[#e2e8f0] my-5"></div>
                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>10 PDFs</strong> / month limit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Preserve basic structural tables</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Downloadable Excel sheets files</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <button
                  id="btn-subscribe-free"
                  onClick={() => onNavigate('register')}
                  className="w-full py-2.5 px-4 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-800 text-xs font-bold uppercase tracking-wider rounded-[4px] transition-all cursor-pointer"
                >
                  Start Scanning
                </button>
              </div>
            </div>

            {/* Pro */}
            <div className="bg-white p-8 border-2 border-blue-600 rounded-[4px] flex flex-col justify-between relative shadow-sm">
              <span className="absolute top-0 right-6 translate-y-[-50%] bg-blue-600 text-white text-xxs px-3 py-1 rounded-[4px] font-sans font-extrabold uppercase tracking-widest">Most Popular</span>
              <div>
                <h3 className="text-xl font-bold text-[#0f172a]">Pro Operator</h3>
                <p className="mt-2 text-xs text-[#64748b] leading-relaxed">Engineered for medium warehouse nodes and logistics teams.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-blue-600">$49</span>
                  <span className="text-xs text-[#64748b]">/ month</span>
                </div>
                <div className="border-t border-[#e2e8f0] my-5"></div>
                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 animate-pulse" />
                    <span><strong>1,000 PDFs</strong> / month limit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Handwritten Vision Digitizer (Gemini)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Calculation consistency checks audits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Batch logistics record imports</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 space-y-2">
                <button
                  id="btn-pro-stripe"
                  onClick={() => triggerMockStripe('Pro')}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-[4px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Pay with Stripe</span>
                </button>
                <button
                  id="btn-pro-razor"
                  onClick={() => triggerMockRazorpay('Pro')}
                  className="w-full py-2.5 px-4 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold uppercase tracking-widest rounded-[4px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Pay with Razorpay</span>
                </button>
              </div>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 border border-[#e2e8f0] rounded-[4px] flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-xl font-bold text-[#0f172a]">Enterprise High-Volume</h3>
                <p className="mt-2 text-xs text-[#64748b] leading-relaxed">For large-scale logistics operations, bulk shipping documents, custom S3 servers.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#0f172a]">$299</span>
                  <span className="text-xs text-[#64748b]">/ month</span>
                </div>
                <div className="border-t border-[#e2e8f0] my-5"></div>
                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>Unlimited PDFs</strong> conversion uploads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Dedicated AWS S3 bucket architecture</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Dual OCR custom backend routing rule</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Custom rate-limiting & priority queues</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 space-y-2">
                <button
                  id="btn-ent-stripe"
                  onClick={() => triggerMockStripe('Enterprise')}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold uppercase tracking-widest rounded-[4px] transition-all cursor-pointer"
                >
                  Pay with Stripe
                </button>
                <button
                  id="btn-ent-razor"
                  onClick={() => triggerMockRazorpay('Enterprise')}
                  className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-850 text-xs font-bold uppercase tracking-widest rounded-[4px] transition-all cursor-pointer"
                >
                  Pay with Razorpay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Engineering Specifications Section */}
      <section className="bg-white py-16 px-6 max-w-7xl mx-auto border-t border-slate-100" id="tech-specs">
        <div className="font-sans">
          <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2 mb-6">
            <Database className="h-5 w-5 text-indigo-600" />
            <span>Developer Cloud-Ready Microservice Specifications</span>
          </h3>

          <div className="grid md:grid-cols-4 gap-6 text-xs text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-200/80">
            <div>
              <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-indigo-600" /> OCR Engine</h5>
              <p>Google Gemini 2.5 Pro Vision fallback to paddleOCR modules.</p>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-indigo-600" /> Formatters</h5>
              <p>Python openpyxl / Node.js SheetJS dynamic cell compiler pipelines.</p>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-indigo-600" /> Authentication</h5>
              <p>Stateless JWT tokens verification + Secure RSA cookie headers.</p>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-indigo-600" /> DB Engine</h5>
              <p>AWS PostgreSQL Relational instances + Local S3 Object Storage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Grid */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-white shrink-0 text-slate-950 flex items-center justify-center rounded-md font-mono font-bold text-xs">P</div>
            <span className="font-bold text-white text-sm">PDF2Excel AI</span>
          </div>

          <p>© 2026 PDF2Excel AI Systems. Google AI Studio cloud-ready sandbox stack.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Charter</a>
            <a href="#" className="hover:text-white transition-colors">SLA Warranties</a>
            <a href="#" className="hover:text-white transition-colors">Developer Logs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
