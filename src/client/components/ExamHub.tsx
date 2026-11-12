import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiGet, apiPost } from '../lib/api';
import {
  ClipboardList,
  Plus,
  ChevronRight,
  Printer,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Trophy,
  Users
} from 'lucide-react';

interface ScoreExam {
  id: string;
  title: string;
  subject: string;
  totalMarks: number;
  scheduledDate: string | null;
  classId: string;
  className?: string;
  status: string;
  createdAt: string;
}

interface StudentResult {
  studentId: string;
  studentName: string;
  rollNumber: string | null;
  marksObtained: number | null;
  totalMarks: number;
  percentage: number | null;
  grade: string | null;
  gradedAt: string | null;
  resultId: string | null;
}

interface ExamResultsData {
  exam: { id: string; title: string; totalMarks: number };
  results: StudentResult[];
}

type View = 'list' | 'entry' | 'gradecard';

function gradeColor(grade: string | null) {
  if (!grade) return 'bg-slate-100 text-slate-500';
  if (grade === 'A+' || grade === 'A') return 'bg-emerald-100 text-emerald-800';
  if (grade === 'B+' || grade === 'B') return 'bg-teal-100 text-teal-800';
  if (grade === 'C') return 'bg-amber-100 text-amber-800';
  return 'bg-rose-100 text-rose-800';
}

function pctColor(pct: number | null) {
  if (pct === null) return 'text-slate-400';
  if (pct >= 80) return 'text-emerald-700';
  if (pct >= 60) return 'text-teal-700';
  if (pct >= 40) return 'text-amber-700';
  return 'text-rose-700';
}

// ─── Grade Card Print View ────────────────────────────────────────────────────
function GradeCard({ exam, results }: { exam: ScoreExam; results: StudentResult[] }) {
  const graded = results.filter(r => r.marksObtained !== null);
  const avg = graded.length
    ? Math.round(graded.reduce((s, r) => s + (r.percentage ?? 0), 0) / graded.length)
    : null;
  const high = graded.length ? Math.max(...graded.map(r => r.marksObtained ?? 0)) : null;

  return (
    <div id="grade-card-print" className="bg-white p-8 max-w-3xl mx-auto rounded-2xl border border-slate-200 shadow-md print:shadow-none print:border-none print:rounded-none print:p-6">
      {/* Header */}
      <div className="text-center border-b border-slate-200 pb-6 mb-6">
        <div className="text-2xl font-black text-slate-900">Achariya World Class Academy</div>
        <div className="text-sm text-slate-500 mt-1">Puducherry Central Campus</div>
        <div className="mt-4 text-xl font-bold text-indigo-700">{exam.title}</div>
        <div className="flex items-center justify-center gap-6 mt-2 text-xs text-slate-600">
          <span>Subject: <strong>{exam.subject}</strong></span>
          <span>Total Marks: <strong>{exam.totalMarks}</strong></span>
          {exam.scheduledDate && (
            <span>Date: <strong>{new Date(exam.scheduledDate).toLocaleDateString('en-IN')}</strong></span>
          )}
          {avg !== null && <span>Class Avg: <strong>{avg}%</strong></span>}
          {high !== null && <span>Highest: <strong>{high}/{exam.totalMarks}</strong></span>}
        </div>
      </div>

      {/* Results table */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-700 font-semibold text-xs uppercase tracking-wide">
            <th className="py-2 px-3 text-left border border-slate-200">Roll No.</th>
            <th className="py-2 px-3 text-left border border-slate-200">Student Name</th>
            <th className="py-2 px-3 text-center border border-slate-200">Marks</th>
            <th className="py-2 px-3 text-center border border-slate-200">%</th>
            <th className="py-2 px-3 text-center border border-slate-200">Grade</th>
            <th className="py-2 px-3 text-left border border-slate-200">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={r.studentId} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
              <td className="py-2 px-3 border border-slate-200 text-slate-500">{r.rollNumber ?? '—'}</td>
              <td className="py-2 px-3 border border-slate-200 font-medium text-slate-800">{r.studentName}</td>
              <td className="py-2 px-3 border border-slate-200 text-center font-bold">
                {r.marksObtained !== null ? `${r.marksObtained}/${exam.totalMarks}` : '—'}
              </td>
              <td className={`py-2 px-3 border border-slate-200 text-center font-semibold ${pctColor(r.percentage)}`}>
                {r.percentage !== null ? `${r.percentage}%` : '—'}
              </td>
              <td className="py-2 px-3 border border-slate-200 text-center">
                {r.grade ? (
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${gradeColor(r.grade)}`}>{r.grade}</span>
                ) : '—'}
              </td>
              <td className="py-2 px-3 border border-slate-200 text-xs text-slate-500">
                {r.percentage !== null
                  ? r.percentage >= 75 ? 'Excellent' : r.percentage >= 60 ? 'Good' : r.percentage >= 40 ? 'Needs Improvement' : 'At Risk'
                  : 'Absent'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between items-end text-xs text-slate-500">
        <div>
          <div>Class Teacher Signature: ___________________</div>
          <div className="mt-3">Principal Signature: ___________________</div>
        </div>
        <div className="text-right">
          <div>Generated: {new Date().toLocaleDateString('en-IN')}</div>
          <div className="mt-1 text-slate-400">Achariya AI ONE · Grade Card</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const ExamHub: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [exams, setExams] = useState<ScoreExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedExam, setSelectedExam] = useState<ScoreExam | null>(null);
  const [resultsData, setResultsData] = useState<ExamResultsData | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);

  // Editable marks map: studentId → input string
  const [marksMap, setMarksMap] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Create exam form
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newMaxMarks, setNewMaxMarks] = useState('100');
  const [newDate, setNewDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet('/api/score/exams');
      setExams(data.exams ?? []);
    } catch (e: unknown) {
      setError((e as Error).message || 'Failed to load exams.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const openResults = async (exam: ScoreExam) => {
    setSelectedExam(exam);
    setResultsLoading(true);
    setResultsData(null);
    setView('entry');
    try {
      const data = await apiGet(`/api/score/exams/${exam.id}/results`);
      setResultsData(data);
      // Pre-fill marks from existing results
      const map: Record<string, string> = {};
      for (const r of (data.results ?? [])) {
        if (r.marksObtained !== null) map[r.studentId] = String(r.marksObtained);
      }
      setMarksMap(map);
    } catch (e: unknown) {
      setError((e as Error).message || 'Failed to load results.');
    } finally {
      setResultsLoading(false);
    }
  };

  const saveResults = async () => {
    if (!selectedExam) return;
    setSaving(true);
    setSaveMsg(null);
    const entries = Object.entries(marksMap)
      .filter(([, v]) => v !== '')
      .map(([studentId, v]) => ({ studentId, marksObtained: parseFloat(v) }));
    try {
      const res = await apiPost(`/api/score/exams/${selectedExam.id}/results/batch-entry`, { entries });
      setSaveMsg(`✓ ${res.saved} result${res.saved !== 1 ? 's' : ''} saved.`);
      // Reload results to reflect grades
      const data = await apiGet(`/api/score/exams/${selectedExam.id}/results`);
      setResultsData(data);
    } catch (e: unknown) {
      setSaveMsg('Error: ' + ((e as Error).message || 'Save failed.'));
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await apiPost('/api/score/exams', {
        title: newTitle.trim(),
        subject: newSubject.trim(),
        totalMarks: parseInt(newMaxMarks, 10),
        scheduledDate: newDate || undefined
      });
      setShowCreate(false);
      setNewTitle(''); setNewSubject(''); setNewMaxMarks('100'); setNewDate('');
      await fetchExams();
    } catch (e: unknown) {
      setCreateError((e as Error).message || 'Failed to create exam.');
    } finally {
      setCreating(false);
    }
  };

  // ── List View ──
  if (view === 'list') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Exam Hub</h1>
              <p className="text-xs text-slate-500">Summative exams · mark entry · grade card PDF export</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Exam</span>
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5 space-y-4">
            <div className="text-sm font-bold text-indigo-800 mb-1">Create Exam</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Exam Title *</label>
                <input
                  value={newTitle} onChange={e => setNewTitle(e.target.value)} required
                  placeholder="e.g. Term 1 Science Exam"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Subject *</label>
                <input
                  value={newSubject} onChange={e => setNewSubject(e.target.value)} required
                  placeholder="e.g. Science"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Total Marks</label>
                <input
                  type="number" min="1" max="1000"
                  value={newMaxMarks} onChange={e => setNewMaxMarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Exam Date (optional)</label>
                <input
                  type="date"
                  value={newDate} onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>
            {createError && <p className="text-xs text-rose-600">{createError}</p>}
            <div className="flex space-x-2">
              <button type="submit" disabled={creating}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold disabled:opacity-60 hover:bg-indigo-700 transition-colors"
              >
                {creating ? 'Creating…' : 'Create Exam'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Exam list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-rose-600 text-sm">{error}</div>
        ) : exams.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            No exams yet. Create your first exam above.
          </div>
        ) : (
          <div className="grid gap-3">
            {exams.map(exam => (
              <div
                key={exam.id}
                onClick={() => openResults(exam)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{exam.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {exam.subject} · {exam.totalMarks} marks
                      {exam.scheduledDate && ` · ${new Date(exam.scheduledDate).toLocaleDateString('en-IN')}`}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Grade Card Print View ──
  if (view === 'gradecard' && selectedExam && resultsData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between print:hidden">
          <button onClick={() => setView('entry')}
            className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Mark Entry</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
        <GradeCard exam={selectedExam} results={resultsData.results} />
      </div>
    );
  }

  // ── Mark Entry View ──
  if (view === 'entry' && selectedExam) {
    const graded = resultsData?.results.filter(r => r.marksObtained !== null).length ?? 0;
    const total = resultsData?.results.length ?? 0;

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => { setView('list'); setSelectedExam(null); setResultsData(null); }}
              className="flex items-center space-x-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Exams</span>
            </button>
            <span className="text-slate-300">/</span>
            <div>
              <span className="text-sm font-black text-slate-900">{selectedExam.title}</span>
              <span className="ml-2 text-xs text-slate-500">{selectedExam.subject} · {selectedExam.totalMarks} marks</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {resultsData && (
              <button onClick={() => setView('gradecard')}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-700 text-white rounded-xl text-xs font-bold shadow hover:bg-slate-800 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Grade Card PDF</span>
              </button>
            )}
            <button onClick={saveResults} disabled={saving}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Saving…' : 'Save Marks'}</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {resultsData && (
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <Users className="w-4 h-4" />
            <span>{graded} of {total} students graded</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-xs">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: total > 0 ? `${(graded / total) * 100}%` : '0%' }}
              />
            </div>
          </div>
        )}

        {saveMsg && (
          <div className={`flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded-xl ${
            saveMsg.startsWith('Error') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
          }`}>
            {saveMsg.startsWith('Error')
              ? <AlertCircle className="w-4 h-4 shrink-0" />
              : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{saveMsg}</span>
          </div>
        )}

        {/* Results table */}
        {resultsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : resultsData ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wide border-b border-slate-200">
                  <th className="py-3 px-4 text-left w-16">Roll No.</th>
                  <th className="py-3 px-4 text-left">Student Name</th>
                  <th className="py-3 px-4 text-center w-40">Marks (out of {selectedExam.totalMarks})</th>
                  <th className="py-3 px-4 text-center w-24">%</th>
                  <th className="py-3 px-4 text-center w-20">Grade</th>
                </tr>
              </thead>
              <tbody>
                {resultsData.results.map((r, i) => (
                  <tr key={r.studentId} className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                    <td className="py-3 px-4 text-slate-500 text-xs">{r.rollNumber ?? '—'}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{r.studentName}</td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max={selectedExam.totalMarks}
                        step="0.5"
                        value={marksMap[r.studentId] ?? ''}
                        onChange={e => setMarksMap(prev => ({ ...prev, [r.studentId]: e.target.value }))}
                        placeholder="—"
                        className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                      />
                    </td>
                    <td className={`py-3 px-4 text-center text-sm font-semibold ${pctColor(r.percentage)}`}>
                      {r.percentage !== null ? `${r.percentage}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {r.grade ? (
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${gradeColor(r.grade)}`}>{r.grade}</span>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    );
  }

  return null;
};
