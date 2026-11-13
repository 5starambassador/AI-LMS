import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../lib/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DEFAULT_PERIODS = [
  { n: 1, start: '08:00', end: '08:45' },
  { n: 2, start: '08:45', end: '09:30' },
  { n: 3, start: '09:30', end: '10:15' },
  { n: 4, start: '10:30', end: '11:15' },
  { n: 5, start: '11:15', end: '12:00' },
  { n: 6, start: '13:00', end: '13:45' },
  { n: 7, start: '13:45', end: '14:30' },
  { n: 8, start: '14:30', end: '15:15' },
];

interface ClassItem { id: string; name: string; sections: { id: string; name: string }[] }
interface Period {
  id?: string; dayOfWeek: number; periodNumber: number;
  subject: string; teacherName?: string; startTime: string; endTime: string;
}

export function TimetableHub() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [periods, setPeriods] = useState<Period[]>([]);
  const [editing, setEditing] = useState<{ day: number; period: number } | null>(null);
  const [editForm, setEditForm] = useState({ subject: '', teacherName: '', startTime: '', endTime: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet<any>('/api/academic/classes-with-sections').then(d => {
      if (d.success) setClasses(d.classes ?? []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!classId) { setPeriods([]); return; }
    setLoading(true);
    const qs = new URLSearchParams({ classId });
    if (sectionId) qs.set('sectionId', sectionId);
    apiGet<any>(`/api/timetable?${qs}`).then(d => {
      if (d.success) {
        setPeriods((d.periods ?? []).map((p: Record<string, unknown>) => ({
          ...p,
          teacherName: (p.teacher as Record<string, string> | null)?.fullName ?? '',
        })));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [classId, sectionId]);

  const getPeriod = (day: number, pNum: number) =>
    periods.find(p => p.dayOfWeek === day && p.periodNumber === pNum) ?? null;

  const openEdit = (day: number, pNum: number) => {
    const p = getPeriod(day, pNum);
    const def = DEFAULT_PERIODS[pNum - 1];
    setEditForm({
      subject: p?.subject ?? '',
      teacherName: p?.teacherName ?? '',
      startTime: p?.startTime ?? (def?.start ?? ''),
      endTime: p?.endTime ?? (def?.end ?? ''),
    });
    setEditing({ day, period: pNum });
  };

  const saveEdit = async () => {
    if (!editing || !classId) return;
    setSaving(true);
    try {
      const res = await apiPost('/api/timetable', {
        classId,
        sectionId: sectionId || undefined,
        dayOfWeek: editing.day,
        periodNumber: editing.period,
        subject: editForm.subject,
        startTime: editForm.startTime,
        endTime: editForm.endTime,
      });
      if (res.success) {
        setPeriods(prev => {
          const next = prev.filter(p => !(p.dayOfWeek === editing.day && p.periodNumber === editing.period));
          return [...next, { ...res.period, teacherName: editForm.teacherName }];
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
      setEditing(null);
    }
  };

  const clearSlot = async (day: number, pNum: number) => {
    const p = getPeriod(day, pNum);
    if (!p?.id) return;
    await fetch(`/api/timetable/${p.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('achariya_token')}` },
    });
    setPeriods(prev => prev.filter(x => !(x.dayOfWeek === day && x.periodNumber === pNum)));
  };

  const selectedClass = classes.find(c => c.id === classId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">🗓️</div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Timetable Manager</h1>
            <p className="text-xs text-slate-500">Build and manage weekly class schedules</p>
          </div>
        </div>
        {saved && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-pulse">✓ Saved</span>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select Class</div>
        <div className="flex flex-wrap gap-3 items-center">
          <select value={classId} onChange={e => { setClassId(e.target.value); setSectionId(''); }}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none min-w-[160px]">
            <option value="">Choose a class…</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {selectedClass && selectedClass.sections.length > 0 && (
            <select value={sectionId} onChange={e => setSectionId(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none">
              <option value="">All Sections</option>
              {selectedClass.sections.map(s => <option key={s.id} value={s.id}>Section {s.name}</option>)}
            </select>
          )}
          {classId && <span className="text-xs text-slate-400 font-medium">Click any cell to add or edit a period</span>}
        </div>
      </div>

      {!classId ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl mx-auto mb-4">📅</div>
          <h3 className="font-bold text-slate-700 mb-1">No class selected</h3>
          <p className="text-slate-400 text-sm">Choose a class above to view or build its weekly timetable</p>
        </div>
      ) : loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading timetable…</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-bold text-slate-500 w-24">Period</th>
                  {DAYS.map(d => (
                    <th key={d} className="px-3 py-3 text-left font-bold text-slate-700 min-w-[140px]">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEFAULT_PERIODS.map(def => (
                  <tr key={def.n} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-bold text-slate-700">P{def.n}</div>
                      <div className="text-[10px] text-slate-400">{def.start}–{def.end}</div>
                    </td>
                    {DAYS.map((_, i) => {
                      const dayNum = i + 1;
                      const p = getPeriod(dayNum, def.n);
                      return (
                        <td key={i} className="px-2 py-2">
                          {p ? (
                            <div className="bg-teal-50 border border-teal-200 rounded-xl px-3 py-2 cursor-pointer group relative hover:border-teal-400 transition-colors"
                              onClick={() => openEdit(dayNum, def.n)}>
                              <div className="font-bold text-teal-800 truncate">{p.subject}</div>
                              {p.teacherName && <div className="text-[10px] text-teal-600 truncate">{p.teacherName}</div>}
                              <button onClick={e => { e.stopPropagation(); clearSlot(dayNum, def.n); }}
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 font-bold text-xs">✕</button>
                            </div>
                          ) : (
                            <button onClick={() => openEdit(dayNum, def.n)}
                              className="w-full h-10 rounded-xl border-2 border-dashed border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-slate-400 hover:text-teal-600 text-lg transition-colors">+</button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-4">{DAYS[editing.day - 1]} · Period {editing.period}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Subject</label>
                <input value={editForm.subject} onChange={e => setEditForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Mathematics" autoFocus
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Teacher</label>
                <input value={editForm.teacherName} onChange={e => setEditForm(f => ({ ...f, teacherName: e.target.value }))}
                  placeholder="Teacher name"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Start</label>
                  <input type="time" value={editForm.startTime} onChange={e => setEditForm(f => ({ ...f, startTime: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">End</label>
                  <input type="time" value={editForm.endTime} onChange={e => setEditForm(f => ({ ...f, endTime: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditing(null)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={saveEdit} disabled={!editForm.subject || saving}
                className="flex-1 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
