import React, { useState } from 'react';
import { Mail, Shield, User, Key, ArrowRight, CornerDownLeft, CircleAlert } from 'lucide-react';

interface AuthPagesProps {
  onAuthSuccess: (user: any) => void;
  initialMode?: 'login' | 'register' | 'forgot';
  onNavigate: (mode: 'login' | 'register' | 'forgot' | 'landing') => void;
}

export function AuthPages({ onAuthSuccess, initialMode = 'login', onNavigate }: AuthPagesProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        onAuthSuccess(data.user);
      } else if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        onAuthSuccess(data.user);
      } else {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to submit password retrieval');
        setMessage(data.message || 'Password reset instruction has been dispatched.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2" id="auth-logo-header">
          <div className="h-10 w-10 bg-[#0f172a] flex items-center justify-center rounded-[4px] text-white font-mono text-xl font-bold font-sans">
            P2E
          </div>
          <span className="text-2xl font-sans tracking-tight font-bold text-[#0f172a]">PDF2Excel AI</span>
        </div>
        <h2 className="mt-6 text-center text-xl font-bold uppercase tracking-wider text-[#0f172a] font-sans" id="auth-form-title">
          {mode === 'login' && 'Sign in to your account'}
          {mode === 'register' && 'Create your new account'}
          {mode === 'forgot' && 'Reset your password'}
        </h2>
        <p className="mt-2 text-center text-xs text-[#64748b] font-sans">
          Or{' '}
          {mode === 'login' && (
            <button id="nav-to-register" onClick={() => { setMode('register'); setError(null); }} className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer uppercase tracking-wider text-[11px]">
              start your free trial, no credit card required
            </button>
          )}
          {mode !== 'login' && (
            <button id="nav-to-login" onClick={() => { setMode('login'); setError(null); }} className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer uppercase tracking-wider text-[11px]">
              sign in to your existing account
            </button>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xs border border-[#e2e8f0] rounded-[4px] sm:px-10">
          
          {error && (
            <div id="auth-error-alert" className="mb-4 bg-rose-50 text-rose-750 text-xs p-4 rounded-[4px] border border-rose-150 flex items-start gap-3">
              <CircleAlert className="h-5 w-5 shrink-0 text-rose-500" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {message && (
            <div id="auth-success-alert" className="mb-4 bg-emerald-50 text-emerald-800 text-xs p-4 rounded-[4px] border border-emerald-100 flex items-start gap-3">
              <Shield className="h-5 w-5 shrink-0 text-emerald-500" />
              <span className="font-semibold">{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="auth-form">
            {mode === 'register' && (
              <div id="register-field-name">
                <label className="block text-xs font-bold text-slate-700 font-sans uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative rounded-[4px] shadow-xxs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-[#94a3b8]" />
                  </div>
                  <input
                    id="reg-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-[#e2e8f0] rounded-[4px] text-[#0f172a] font-bold text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}

            <div id="common-field-email">
              <label className="block text-xs font-bold text-slate-700 font-sans uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative rounded-[4px] shadow-xxs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#94a3b8]" />
                </div>
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-[#e2e8f0] rounded-[4px] text-[#0f172a] font-bold text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div id="common-field-password">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 font-sans uppercase tracking-wider">Password</label>
                  {mode === 'login' && (
                    <button
                      id="link-forgot-password"
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer uppercase tracking-wider"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative rounded-[4px] shadow-xxs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-[#94a3b8]" />
                  </div>
                  <input
                    id="auth-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-[#e2e8f0] rounded-[4px] text-[#0f172a] font-bold text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <div>
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={busy}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-[4px] text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed justify-center items-center gap-1.5 transition-colors cursor-pointer font-sans shadow-xs"
              >
                {busy ? (
                  <span className="animate-pulse">Authorizing...</span>
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Sign In'}
                      {mode === 'register' && 'Create Account'}
                      {mode === 'forgot' && 'Send recovery email'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Social login divider */}
          <div className="mt-6" id="auth-social-divider">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2e8f0]" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-2.5 bg-white text-[#64748b] uppercase tracking-wider font-bold">or authenticate with</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3" id="social-auth-buttons">
              <button
                id="social-google-btn"
                type="button"
                onClick={() => {
                  // Instant mockup login via Google
                  onAuthSuccess({
                    id: 'usr-google',
                    name: 'Nithyananthan Google',
                    email: 'nithyananthannagarajan092@gmail.com',
                    role: 'user',
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    plan: 'pro'
                  });
                }}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-[#e2e8f0] rounded-[4px] bg-white text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer justify-center items-center gap-2 font-sans shadow-xxs"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.251 1.636 15.48.5 12.24.5 5.816.5.6 5.716.6 12.1s5.216 11.6 11.64 11.6c6.7 0 11.16-4.711 11.16-11.378 0-.765-.082-1.348-.182-2.037H12.24z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                id="social-guest-btn"
                type="button"
                onClick={() => {
                  onAuthSuccess({
                    id: 'usr-guest',
                    name: 'Guest Tester',
                    email: 'guest@pdf2excel.ai',
                    role: 'user',
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    plan: 'free'
                  });
                }}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-[#e2e8f0] rounded-[4px] bg-white text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer justify-center items-center gap-2 font-sans shadow-xxs"
              >
                <Shield className="h-4.5 w-4.5 text-blue-600" />
                <span>Guest</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center" id="auth-go-home-link">
            <button
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748b] hover:text-[#0f172a] cursor-pointer"
            >
              <CornerDownLeft className="h-3.5 w-3.5 text-[#94a3b8]" />
              <span>Back to home</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
