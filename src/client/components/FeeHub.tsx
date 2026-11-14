import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../lib/api';

interface FeeRecord {
  id: string; feeType: string; amount: string; dueDate: string;
  paidAt: string | null; status: string; reference: string | null; remarks: string | null;
  createdAt: string;
  student: {
    id: string; fullName: string;
    enrollments: Array<{
      rollNumber: string;
      class: { name: string };
      section: { name: string };
    }>;
  };
}

interface Summary { paid: number; pending: number; overdue: number; totalAmount: number; collectedAmount: number }

const FEE_TYPES = ['TUITION', 'TRANSPORT', 'EXAM', 'LIBRARY', 'SPORTS', 'OTHER'];
const STATUS_COLORS: Record<string, string> = {
  PAID: 'bg-emerald-100 text-emerald-700',
  PENDING: 'bg-amber-100 text-amber-700',
  OVERDUE: 'bg-rose-100 text-rose-700',
};

export function FeeHub() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [view, setView] = useState<'list' | 'new'>('list');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState({ studentId: '', feeType: 'TUITION', amount: '', dueDate: '', remarks: '' });
  const [submitting, setSubmitting] = useState(false);
  const [marking, setMarking] = useState<string | null>(null);
  const [students, setStudents] = useState<{ id: string; name: string; roll: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const qs = filterStatus ? `?status=${filterStatus}` : '';
      const token = localStorage.getItem('achariya_token');
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const [fr, sr] = await Promise.all([
        fetch(`/api/fees${qs}`, { headers }),
        fetch('/api/fees/summary', { headers }),
      ]);
      if (fr.status === 403 || sr.status === 403) { setAccessDenied(true); return; }
      const [f, s] = await Promise.all([fr.json(), sr.json()]);
      if (f.success) setFees(f.fees ?? []);
      if (s.success) setSummary(s.summary);
    } catch { /* network error — keep empty state */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterStatus]);

  useEffect(() => {
    apiGet('/api/reportcard/students')
      .then(d => {
        if (d.success) setStudents(d.students ?? []);
      })
      .catch(() => {});
  }, []);

  const submit = async () => {
    if (!form.studentId || !form.amount || !form.dueDate) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await apiPost('/api/fees', {
        studentId: form.studentId,
        feeType: form.feeType,
        amount: parseFloat(form.amount),
        dueDate: form.dueDate,
        remarks: form.remarks || undefined,
      });
      if (res.success) {
        setView('list');
        setForm({ studentId: '', feeType: 'TUITION', amount: '', dueDate: '', remarks: '' });
        load();
      } else {
        setErrorMsg('Could not create fee record.');
      }
    } catch {
      setErrorMsg('Failed to create fee record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const markPaid = async (id: string) => {
    setMarking(id);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('achariya_token') ?? '';
      const res = await fetch(`/api/fees/${id}/pay`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      }).then(r => r.json());
      if (res.success) {
        setFees(prev => prev.map(f => f.id === id ? { ...f, status: 'PAID', paidAt: res.fee.paidAt } : f));
        load();
      } else {
        setErrorMsg('Could not update payment status.');
      }
    } catch {
      setErrorMsg('Network error while recording fee payment.');
    } finally {
      setMarking(null);
    }
  };

  const remove = async (id: string) => {
    setErrorMsg('');
    try {
      const token = localStorage.getItem('achariya_token') ?? '';
      const r = await fetch(`/api/fees/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) {
        setErrorMsg('Could not remove fee record.');
        return;
      }
      setFees(prev => prev.filter(f => f.id !== id));
      load();
    } catch {
      setErrorMsg('Network error while deleting fee record.');
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl">🔒</div>
        <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
        <p className="text-slate-500 max-w-sm">Fee management is available to school administrators only. Contact your school admin for fee-related queries.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">💳</div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Fee Status Tracker</h1>
            <p className="text-xs text-slate-500">Track and manage student fee payments</p>
          </div>
        </div>
        <button onClick={() => setView(view === 'new' ? 'list' : 'new')}
          className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">
          {view === 'new' ? '← Back' : '+ Add Fee'}
        </button>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-700 text-xs font-semibold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-rose-500 hover:text-rose-800 font-bold">✕</button>
        </div>
      )}

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Paid', value: summary.paid, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Pending', value: summary.pending, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
            { label: 'Overdue', value: summary.overdue, color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
            { label: 'Total Billed', value: fmt(summary.totalAmount), color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
            { label: 'Collected', value: fmt(summary.collectedAmount), color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
          ].map(item => (
            <div key={item.label} className={`rounded-2xl border p-3 text-center ${item.bg}`}>
              <div className={`text-lg font-black ${item.color}`}>{item.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {view === 'new' ? (
        <div className="bg-white rounded-2xl border border-teal-200 p-6 shadow-sm max-w-lg">
          <h3 className="font-bold text-slate-800 mb-4">Add Fee Record</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Student</label>
              <select value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none">
                <option value="">Select student…</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} (Roll {s.roll})</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Fee Type</label>
                <select value={form.feeType} onChange={e => setForm(f => ({ ...f, feeType: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none">
                  {FEE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Amount (₹)</label>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="e.g. 5000"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Remarks</label>
              <input value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
                placeholder="Optional note"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setView('list')} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={submit} disabled={!form.studentId || !form.amount || !form.dueDate || submitting}
                className="flex-1 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">
                {submitting ? 'Saving…' : 'Create Record'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            {['', 'PENDING', 'PAID', 'OVERDUE'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${filterStatus === s ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading fees…</div>
          ) : fees.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-14 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl mx-auto mb-3">💳</div>
              <h3 className="font-bold text-slate-700 mb-1">No fee records</h3>
              <p className="text-slate-400 text-sm">
                {filterStatus ? `No ${filterStatus.toLowerCase()} fees found.` : 'Click "+ Add Fee" to create the first fee record.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-left font-bold text-slate-500">Student</th>
                      <th className="px-3 py-3 text-left font-bold text-slate-500">Fee Type</th>
                      <th className="px-3 py-3 text-right font-bold text-slate-500">Amount</th>
                      <th className="px-3 py-3 text-left font-bold text-slate-500">Due Date</th>
                      <th className="px-3 py-3 text-left font-bold text-slate-500">Status</th>
                      <th className="px-3 py-3 text-left font-bold text-slate-500">Paid On</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map(f => {
                      const enr = f.student?.enrollments?.[0];
                      return (
                        <tr key={f.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-800">{f.student?.fullName ?? 'Scholar'}</div>
                            {enr && <div className="text-slate-400">{enr.class?.name}/{enr.section?.name} · {enr.rollNumber}</div>}
                          </td>
                          <td className="px-3 py-3 font-medium text-slate-700">{f.feeType}</td>
                          <td className="px-3 py-3 text-right font-bold text-slate-800">{fmt(parseFloat(f.amount))}</td>
                          <td className="px-3 py-3 text-slate-500">{new Date(f.dueDate).toLocaleDateString()}</td>
                          <td className="px-3 py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[f.status] ?? 'bg-slate-100 text-slate-600'}`}>{f.status}</span>
                          </td>
                          <td className="px-3 py-3 text-slate-400">{f.paidAt ? new Date(f.paidAt).toLocaleDateString() : '—'}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              {f.status !== 'PAID' && (
                                <button onClick={() => markPaid(f.id)} disabled={marking === f.id}
                                  className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap">
                                  {marking === f.id ? '…' : 'Mark Paid'}
                                </button>
                              )}
                              <button onClick={() => remove(f.id)} className="text-rose-400 hover:text-rose-600 font-bold">✕</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
