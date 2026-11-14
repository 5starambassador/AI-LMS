import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../lib/api';

interface Banner {
  id: string; title: string; imageUrl: string; targetRole: string;
  clickUrl?: string; priority: number; isActive: boolean;
  createdAt: string;
}

const TARGET_ROLES = ['ALL', 'STAFF', 'STUDENT', 'ADMIN'];

export function NoticeboardHub() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', imageUrl: '', targetRole: 'ALL', clickUrl: '', priority: '0' });
  const [submitting, setSubmitting] = useState(false);
  const [includeInactive, setIncludeInactive] = useState(true);
  const [actionError, setActionError] = useState('');

  const load = () => {
    setLoading(true);
    apiGet<any>(`/api/noticeboard?includeInactive=${includeInactive}`).then(d => {
      if (d.success) setBanners(d.banners ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, [includeInactive]);

  const submit = async () => {
    if (!form.title) return;
    setSubmitting(true);
    setActionError('');
    try {
      const res = await apiPost('/api/noticeboard', {
        title: form.title,
        imageUrl: form.imageUrl || undefined,
        targetRole: form.targetRole,
        clickUrl: form.clickUrl || undefined,
        priority: parseInt(form.priority) || 0,
      });
      if (res.success) {
        setBanners(prev => [res.banner, ...prev]);
        setForm({ title: '', imageUrl: '', targetRole: 'ALL', clickUrl: '', priority: '0' });
        setShowForm(false);
      } else {
        setActionError('Could not publish notice. Check your permissions.');
      }
    } catch {
      setActionError('Failed to save notice. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggle = async (id: string) => {
    setActionError('');
    try {
      const token = localStorage.getItem('achariya_token') ?? '';
      const res = await fetch(`/api/noticeboard/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json());
      if (res.success) setBanners(prev => prev.map(b => b.id === id ? res.banner : b));
      else setActionError('Could not update notice visibility.');
    } catch {
      setActionError('Network error while updating notice status.');
    }
  };

  const remove = async (id: string) => {
    setActionError('');
    try {
      const token = localStorage.getItem('achariya_token') ?? '';
      const r = await fetch(`/api/noticeboard/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) {
        setActionError('Could not delete notice from server.');
        return;
      }
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch {
      setActionError('Network error while deleting notice.');
    }
  };

  const roleColor: Record<string, string> = {
    ALL: 'bg-slate-100 text-slate-700',
    STAFF: 'bg-blue-100 text-blue-700',
    STUDENT: 'bg-teal-100 text-teal-700',
    ADMIN: 'bg-indigo-100 text-indigo-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">📢</div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Noticeboard</h1>
            <p className="text-xs text-slate-500">Manage school-wide and class announcements</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer bg-white border border-slate-200 rounded-xl px-3 py-1.5">
            <input type="checkbox" checked={includeInactive} onChange={e => setIncludeInactive(e.target.checked)} className="rounded" />
            Show inactive
          </label>
          <button onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">
            + New Notice
          </button>
        </div>
      </div>

      {actionError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-700 text-xs font-semibold flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="text-rose-500 hover:text-rose-800 font-bold">✕</button>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl border border-teal-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Create Notice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Notice title" autoFocus
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Target Audience</label>
              <select value={form.targetRole} onChange={e => setForm(f => ({ ...f, targetRole: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none">
                {TARGET_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Image URL</label>
              <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://…"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Link URL</label>
              <input value={form.clickUrl} onChange={e => setForm(f => ({ ...f, clickUrl: e.target.value }))}
                placeholder="https://… (optional)"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Priority (higher = top)</label>
              <input type="number" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={submit} disabled={!form.title || submitting}
              className="px-6 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">
              {submitting ? 'Saving…' : 'Create Notice'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading notices…</div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-14 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl mx-auto mb-3">📢</div>
          <h3 className="font-bold text-slate-700 mb-1">No notices yet</h3>
          <p className="text-slate-400 text-sm">Click "+ New Notice" to publish your first campus announcement</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map(b => (
            <div key={b.id} className={`bg-white rounded-2xl border p-4 flex items-start gap-4 shadow-sm transition-opacity ${b.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
              {b.imageUrl && (
                <img src={b.imageUrl} alt="" className="w-16 h-12 object-cover rounded-xl shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-800 text-sm">{b.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColor[b.targetRole] ?? roleColor.ALL}`}>{b.targetRole}</span>
                  {b.priority > 0 && <span className="text-[10px] text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full font-semibold">Priority {b.priority}</span>}
                  {!b.isActive && <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">Inactive</span>}
                </div>
                {b.clickUrl && <p className="text-xs text-slate-400 mt-0.5 truncate">{b.clickUrl}</p>}
                <p className="text-xs text-slate-400 mt-0.5">{new Date(b.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggle(b.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${b.isActive ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'border-teal-200 text-teal-700 hover:bg-teal-50'}`}>
                  {b.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => remove(b.id)} className="text-xs text-rose-500 hover:text-rose-700 font-bold px-2">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
