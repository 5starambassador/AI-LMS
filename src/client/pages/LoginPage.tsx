import React, { useState, FormEvent } from 'react';
import { useAuthContext } from '../context/AuthContext';

interface LoginPageProps {
  defaultPortal?: 'STAFF' | 'STUDENT' | 'SUPERADMIN';
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultPortal = 'STAFF', onLoginSuccess }) => {
  const { login } = useAuthContext();
  const [portal, setPortal] = useState<'STAFF' | 'STUDENT'>(defaultPortal === 'STUDENT' ? 'STUDENT' : 'STAFF');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email.trim(), password, portal);

    setIsSubmitting(false);

    if (result.success) {
      onLoginSuccess();
    } else if (result.redirectUrl) {
      setError(`${result.error} Redirecting…`);
      setTimeout(() => { window.location.href = result.redirectUrl!; }, 1500);
    } else {
      setError(result.error ?? 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Achariya AI ONE</h1>
          <p className="text-sm text-slate-500 mt-1">Enterprise Learning &amp; Assessment Ecosystem</p>
        </div>

        {/* Portal Toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6 gap-1">
          {(['STAFF', 'STUDENT'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => { setPortal(p); setError(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                portal === p
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p === 'STAFF' ? 'Educator Portal' : 'Student Portal'}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@school.edu.in"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm text-sm"
          >
            {isSubmitting ? 'Signing in…' : `Sign in to ${portal === 'STAFF' ? 'Educator' : 'Student'} Portal`}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          {portal === 'STUDENT'
            ? 'Students: use Achariya VoiceLab app on mobile for best experience.'
            : 'Educators: contact your campus administrator if you need access.'}
        </p>

        {/* Umbrella & Campus Role Quick-Fill Matrix */}
        <div className="mt-5 bg-white/90 rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Umbrella &amp; Campus Role Switcher
            </span>
            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              5 Scopes · Click to Fill
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { role: 'Super Admin', scope: 'GLOBAL', badge: 'bg-indigo-100 text-indigo-700', email: 'superadmin@achariya.in', targetPortal: 'STAFF' as const },
              { role: 'Manager', scope: 'REGIONAL', badge: 'bg-violet-100 text-violet-700', email: 'manager@achariya.in', targetPortal: 'STAFF' as const },
              { role: 'Principal', scope: 'CAMPUS', badge: 'bg-teal-100 text-teal-700', email: 'admin@achariya.in', targetPortal: 'STAFF' as const },
              { role: 'Curriculum Lead', scope: 'CAMPUS', badge: 'bg-sky-100 text-sky-700', email: 'uploader@achariya.in', targetPortal: 'STAFF' as const },
              { role: 'Teacher', scope: 'ASSIGNED', badge: 'bg-amber-100 text-amber-700', email: 'teacher@achariya.in', targetPortal: 'STAFF' as const },
              { role: 'Scholar', scope: 'OWN', badge: 'bg-emerald-100 text-emerald-700', email: 'student@achariya.in', targetPortal: 'STUDENT' as const },
            ].map(item => (
              <button
                key={item.email}
                type="button"
                onClick={() => {
                  setPortal(item.targetPortal);
                  setEmail(item.email);
                  setPassword('Pass@1234');
                  setError(null);
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-left transition-colors"
              >
                <div className="min-w-0 pr-1">
                  <div className="text-xs font-bold text-slate-800 truncate">{item.role}</div>
                  <div className="text-[10px] text-slate-400 truncate">{item.email}</div>
                </div>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${item.badge}`}>
                  {item.scope}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
