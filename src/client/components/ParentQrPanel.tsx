import React, { useState, useEffect, useRef } from 'react';
import { apiGet, apiPost } from '../lib/api';
import { QrCode, RefreshCw, Copy, CheckCheck, Users, ChevronDown } from 'lucide-react';

interface Student { id: string; fullName: string; rollNumber?: string | null }

interface Props {
  /** If provided, skips the student picker and uses this student directly */
  studentId?: string;
  studentName?: string;
}

/** Tiny inline SVG QR code using a data-URL from the goqr.me public API */
function QrImage({ url }: { url: string }) {
  const encoded = encodeURIComponent(url);
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`;
  return (
    <img
      src={src}
      alt="Parent portal QR code"
      className="w-48 h-48 rounded-xl border border-slate-200 shadow-sm"
    />
  );
}

export const ParentQrPanel: React.FC<Props> = ({ studentId: fixedStudentId, studentName: fixedStudentName }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedId, setSelectedId] = useState<string>(fixedStudentId ?? '');
  const [selectedName, setSelectedName] = useState<string>(fixedStudentName ?? '');
  const [studentsLoading, setStudentsLoading] = useState(!fixedStudentId);

  const [token, setToken] = useState<string | null>(null);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch enrolled students for picker (only when no fixed student)
  useEffect(() => {
    if (fixedStudentId) return;
    setStudentsLoading(true);
    apiGet('/api/academic/students')
      .then((d: { students?: Student[] }) => setStudents(d.students ?? []))
      .catch(() => {})
      .finally(() => setStudentsLoading(false));
  }, [fixedStudentId]);

  const generate = async () => {
    if (!selectedId) return;
    setGenerating(true);
    setError(null);
    setToken(null);
    setPortalUrl(null);
    try {
      const res = await apiPost('/api/parent/tokens', { studentId: selectedId });
      setToken(res.token);
      setPortalUrl(res.portalUrl);
      setExpiresAt(res.expiresAt);
      if (!fixedStudentId) setSelectedName(res.studentName ?? selectedName);
    } catch (e: unknown) {
      setError((e as Error).message || 'Failed to generate link.');
    } finally {
      setGenerating(false);
    }
  };

  const copy = () => {
    if (!portalUrl) return;
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center space-x-2">
        <QrCode className="w-5 h-5 text-indigo-600" />
        <span className="text-sm font-bold text-slate-800">Parent Report QR</span>
        <span className="text-xs text-slate-400">· 48 h link · single-use</span>
      </div>

      {/* Student selector (only when no fixed student) */}
      {!fixedStudentId && (
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Select Student</label>
          {studentsLoading ? (
            <div className="text-xs text-slate-400">Loading students…</div>
          ) : (
            <div className="relative">
              <select
                value={selectedId}
                onChange={e => {
                  setSelectedId(e.target.value);
                  const s = students.find(s => s.id === e.target.value);
                  setSelectedName(s?.fullName ?? '');
                  setToken(null); setPortalUrl(null);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-8"
              >
                <option value="">— choose student —</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.fullName}{s.rollNumber ? ` (${s.rollNumber})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          )}
        </div>
      )}

      {fixedStudentId && selectedName && (
        <div className="flex items-center space-x-2 text-sm text-slate-700 font-semibold">
          <Users className="w-4 h-4 text-indigo-500" />
          <span>{selectedName}</span>
        </div>
      )}

      <button
        onClick={generate}
        disabled={!selectedId || generating}
        className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-indigo-700 transition-colors shadow-sm w-full justify-center"
      >
        <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
        <span>{generating ? 'Generating…' : token ? 'Regenerate Link' : 'Generate QR Link'}</span>
      </button>

      {error && <p className="text-xs text-rose-600">{error}</p>}

      {portalUrl && token && (
        <div className="space-y-3 pt-1">
          <div className="flex justify-center">
            <QrImage url={portalUrl} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-500">Scan to open student report</p>
            {expiresAt && (
              <p className="text-xs text-slate-400">
                Expires: {new Date(expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <input
              readOnly
              value={portalUrl}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 bg-slate-50 font-mono truncate focus:outline-none"
            />
            <button
              onClick={copy}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0"
              title="Copy link"
            >
              {copied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Share this link or QR code with the parent. It expires in 48 hours.
          </p>
        </div>
      )}
    </div>
  );
};
