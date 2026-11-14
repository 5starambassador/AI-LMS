import React, { useState, useEffect } from 'react';

interface Student { id: string; name: string; roll: string; checkedIn?: boolean }

interface Props {
  token: string;
  onLoggedIn: (token: string, user: Record<string, unknown>) => void;
}

export function QrStudentPicker({ token, onLoggedIn }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    fetch(`/api/auth/qr/${token}/students`)
      .then(r => r.json())
      .then(data => {
        if (!data.success) { setError(data.error ?? 'Invalid QR code.'); return; }
        setStudents(data.students);
        setExpiresAt(new Date(data.expiresAt));
      })
      .catch(() => setError('Could not reach server. Check your connection.'))
      .finally(() => setLoading(false));
  }, [token]);

  const claim = async (studentId: string) => {
    setClaiming(studentId);
    setError('');
    try {
      const res = await fetch(`/api/auth/qr/${token}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });
      const data = await res.json();
      if (!data.success) { setError(data.error ?? 'Sign-in failed.'); return; }
      onLoggedIn(data.token, data.user);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setClaiming(null);
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-slate-50">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-slate-500 text-sm">Loading class…</p>
        </div>
      </div>
    );
  }

  if (error && students.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-slate-50 p-6">
        <div className="bg-white rounded-2xl border border-rose-200 p-8 max-w-sm w-full text-center shadow-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-bold text-slate-800 text-lg mb-2">QR Code Invalid</h2>
          <p className="text-sm text-slate-500">{error}</p>
          <p className="text-xs text-slate-400 mt-3">Ask your teacher to show a fresh QR code on the board.</p>
        </div>
      </div>
    );
  }

  const secondsLeft = expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000)) : 0;
  const urgent = secondsLeft < 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-tight">Achariya AI ONE</p>
            <p className="text-xs text-slate-500">Tap your name to sign in</p>
          </div>
        </div>
        {expiresAt && (
          <div className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${urgent ? 'text-rose-600 border-rose-200 bg-rose-50 animate-pulse' : 'text-teal-700 border-teal-200 bg-teal-50'}`}>
            {urgent ? '⏳' : '⏱'} {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
          </div>
        )}
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {/* Search */}
        {students.length > 8 && (
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search your name or roll number…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              autoFocus
            />
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">{error}</div>
        )}

        {/* Student grid */}
        {filtered.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-12">No students match your search.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(student => (
              <button
                key={student.id}
                onClick={() => !student.checkedIn && claim(student.id)}
                disabled={!!claiming || student.checkedIn}
                className={`
                  relative border-2 rounded-2xl p-4 text-left transition-all shadow-xs
                  ${student.checkedIn
                    ? 'bg-emerald-50 border-emerald-200 cursor-default opacity-80'
                    : claiming === student.id
                      ? 'bg-teal-50 border-teal-500 scale-95'
                      : 'bg-white border-slate-200 hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer'
                  }
                  ${claiming && claiming !== student.id && !student.checkedIn ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {/* Avatar initial */}
                <div className={`w-10 h-10 rounded-full font-bold text-lg flex items-center justify-center mb-2 ${
                  student.checkedIn ? 'bg-emerald-200 text-emerald-800' : 'bg-teal-100 text-teal-800'
                }`}>
                  {student.checkedIn ? '✓' : student.name.charAt(0).toUpperCase()}
                </div>
                <p className={`font-semibold text-sm leading-tight truncate ${student.checkedIn ? 'text-emerald-800' : 'text-slate-800'}`}>
                  {student.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {student.checkedIn ? 'Already checked in ✓' : `Roll ${student.roll}`}
                </p>

                {claiming === student.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-teal-50/80 rounded-2xl">
                    <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-slate-400 mt-6">
          {students.length} students in this session · Don't see your name? Ask your teacher.
        </p>
      </div>
    </div>
  );
}
