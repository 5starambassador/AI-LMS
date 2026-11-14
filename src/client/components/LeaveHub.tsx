import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../lib/api';

interface Leave {
  id: string; type: string; reason: string; startDate: string; endDate: string;
  status: string; remarks?: string; createdAt: string;
  user: { id: string; fullName: string; email: string };
  approver?: { id: string; fullName: string } | null;
  approvedAt?: string | null;
}

const LEAVE_TYPES = ['CASUAL', 'SICK', 'EARNED', 'EMERGENCY'];
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700',
};

export function LeaveHub() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'new'>('list');
  const [form, setForm] = useState({ type: 'CASUAL', reason: '', startDate: '', endDate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  const [loadError, setLoadError] = useState('');

  const load = () => {
    setLoading(true);
    setLoadError('');
    const qs = filterStatus ? `?status=${filterStatus}` : '';
    apiGet<any>(`/api/leave${qs}`).then(d => {
      if (d.success) setLeaves(d.leaves ?? []);
    }).catch(() => setLoadError('Failed to load leave requests. Please try again.')).finally(() => setLoading(false));
  };

  useEffect(load, [filterStatus]);

  const submit = async () => {
    if (!form.reason || !form.startDate || !form.endDate || form.endDate < form.startDate) return;
    setSubmitting(true);
    setLoadError('');
    try {
      const res = await apiPost('/api/leave', form);
      if (res.success) {
        setView('list');
        setForm({ type: 'CASUAL', reason: '', startDate: '', endDate: '' });
        load();
      } else {
        setLoadError('Failed to submit leave request.');
      }
    } catch {
      setLoadError('Failed to submit leave request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const approve = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    setActing(id);
    setLoadError('');
    try {
      const token = localStorage.getItem('achariya_token') ?? '';
      const res = await fetch(`/api/leave/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action }),
      }).then(r => r.json());
      if (res.success) {
        setLeaves(prev => prev.map(l => l.id === id ? res.leave : l));
      } else {
        setLoadError('Could not update leave decision.');
      }
    } catch {
      setLoadError('Network error while updating leave request.');
    } finally {
      setActing(null);
    }
  };

  const withdraw = async (id: string) => {
    setLoadError('');
    try {
      const token = localStorage.getItem('achariya_token') ?? '';
      const r = await fetch(`/api/leave/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) {
        setLoadError('Could not withdraw leave request.');
        return;
      }
      setLeaves(prev => prev.filter(l => l.id !== id));
    } catch {
      setLoadError('Network error while withdrawing request.');
    }
  };

  const days = (s: string, e: string) => {
    const diff = (new Date(e).getTime() - new Date(s).getTime()) / 86400000;
    return Math.max(1, Math.round(diff) + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-xl">🏖️</div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Leave Management</h1>
            <p className="text-xs text-slate-500">Submit and manage staff leave requests</p>
          </div>
        </div>
        <button onClick={() => setView(view === 'new' ? 'list' : 'new')}
          className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">
          {view === 'new' ? '← Back to List' : '+ New Request'}
        </button>
      </div>

      {loadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-700 text-sm">{loadError}</div>
      )}

      {view === 'new' ? (
        <div className="bg-white rounded-2xl border border-teal-200 p-6 shadow-sm max-w-lg">
          <h3 className="font-bold text-slate-800 mb-4">Submit Leave Request</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Leave Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none">
                {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">From</label>
                <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">To</label>
                <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Reason</label>
              <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                rows={3} placeholder="Brief reason for leave…"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none" />
            </div>
            {form.startDate && form.endDate && form.endDate < form.startDate && (
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 font-semibold">
                End date cannot be earlier than start date.
              </p>
            )}
            {form.startDate && form.endDate && form.endDate >= form.startDate && (
              <p className="text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2 font-semibold">
                Duration: {days(form.startDate, form.endDate)} day{days(form.startDate, form.endDate) > 1 ? 's' : ''}
              </p>
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setView('list')} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={submit} disabled={!form.reason || !form.startDate || !form.endDate || form.endDate < form.startDate || submitting}
                className="flex-1 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            {['', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${filterStatus === s ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading requests…</div>
          ) : leaves.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-14 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-2xl mx-auto mb-3">📋</div>
              <h3 className="font-bold text-slate-700 mb-1">No leave requests</h3>
              <p className="text-slate-400 text-sm">
                {filterStatus ? `No ${filterStatus.toLowerCase()} requests found.` : 'No requests yet — click "+ New Request" to submit one.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaves.map(l => (
                <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-sm">{l.user.fullName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[l.status] ?? 'bg-slate-100 text-slate-600'}`}>{l.status}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{l.type}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{l.reason}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(l.startDate).toLocaleDateString()} – {new Date(l.endDate).toLocaleDateString()}
                        {' '}· {days(l.startDate, l.endDate)} day{days(l.startDate, l.endDate) > 1 ? 's' : ''}
                      </p>
                      {l.approver && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {l.status} by {l.approver.fullName}{l.approvedAt ? ` on ${new Date(l.approvedAt).toLocaleDateString()}` : ''}
                        </p>
                      )}
                      {l.remarks && <p className="text-xs text-slate-500 mt-0.5 italic">"{l.remarks}"</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {l.status === 'PENDING' && (
                        <>
                          <button onClick={() => approve(l.id, 'APPROVED')} disabled={acting === l.id}
                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50">Approve</button>
                          <button onClick={() => approve(l.id, 'REJECTED')} disabled={acting === l.id}
                            className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold hover:bg-rose-200 disabled:opacity-50">Reject</button>
                          <button onClick={() => withdraw(l.id)}
                            className="text-xs text-slate-400 hover:text-rose-500 font-bold px-1">✕</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
