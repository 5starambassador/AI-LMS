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
      <div className="w-full max-w-md">
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
      </div>
    </div>
  );
};
