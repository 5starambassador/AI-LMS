import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { apiGet, apiPost } from '../lib/api';

interface ClassItem { id: string; name: string; sections: { id: string; name: string }[] }
interface QrSession { token: string; expiresAt: string; ttlSeconds: number }

interface Props { onClose?: () => void }

export function QrSessionPanel({ onClose }: Props) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [session, setSession] = useState<QrSession | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    apiGet<{ classes: ClassItem[] }>('/api/academic/classes-with-sections')
      .then(d => setClasses(d.classes))
      .catch(() => setError('Could not load class list.'));
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const selectedClass = classes.find(c => c.id === classId);

  const startSession = useCallback(async () => {
    if (!classId) { setError('Select a class first.'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await apiPost<QrSession>('/api/auth/qr-session', { classId, sectionId: sectionId || undefined });
      setSession(data);
      setSecondsLeft(data.ttlSeconds);

      const landingUrl = `${window.location.origin}/qr/${data.token}`;
      const dataUrl = await QRCode.toDataURL(landingUrl, { width: 280, margin: 2, color: { dark: '#1e293b', light: '#ffffff' } });
      setQrDataUrl(dataUrl);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(timerRef.current!);
            setSession(null);
            setQrDataUrl('');
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } catch (e: any) {
      setError(e.message ?? 'Failed to create QR session.');
    } finally {
      setLoading(false);
    }
  }, [classId, sectionId]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const urgency = secondsLeft < 60;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 max-w-sm w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📱</span>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">QR Classroom Login</h3>
            <p className="text-xs text-slate-500">Students scan to sign in — no password</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg leading-none">✕</button>
        )}
      </div>

      {!session ? (
        <>
          {/* Class picker */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Class</label>
              <select
                value={classId}
                onChange={e => { setClassId(e.target.value); setSectionId(''); }}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">— Select class —</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {selectedClass && selectedClass.sections.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Section (optional)</label>
                <select
                  value={sectionId}
                  onChange={e => setSectionId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">All sections</option>
                  {selectedClass.sections.map(s => <option key={s.id} value={s.id}>Section {s.name}</option>)}
                </select>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-rose-600 mb-3">{error}</p>}

          <button
            onClick={startSession}
            disabled={loading || !classId}
            className="w-full py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating…' : 'Generate QR Code'}
          </button>
        </>
      ) : (
        <>
          {/* QR Display */}
          <div className="flex flex-col items-center gap-3">
            {qrDataUrl && (
              <div className="p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-inner">
                <img src={qrDataUrl} alt="QR code for student login" className="w-56 h-56" />
              </div>
            )}

            {/* Timer */}
            <div className={`flex items-center gap-1.5 text-sm font-mono font-bold ${urgency ? 'text-rose-600 animate-pulse' : 'text-teal-700'}`}>
              <span className="text-base">{urgency ? '⏳' : '⏱'}</span>
              <span>Expires in {mins}:{secs}</span>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Project this on the board. Students tap{' '}
              <strong className="text-slate-700">their name</strong> to sign in.
            </p>

            {/* Class label */}
            <div className="bg-teal-50 text-teal-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-200">
              {selectedClass?.name ?? 'Class'}{sectionId && selectedClass ? ` · Section ${selectedClass.sections.find(s => s.id === sectionId)?.name}` : ''}
            </div>

            <div className="flex gap-2 w-full mt-1">
              <button
                onClick={startSession}
                className="flex-1 py-2 border border-teal-600 text-teal-700 rounded-xl text-xs font-semibold hover:bg-teal-50 transition-colors"
              >
                Refresh QR
              </button>
              <button
                onClick={() => { setSession(null); setQrDataUrl(''); if (timerRef.current) clearInterval(timerRef.current); }}
                className="flex-1 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
