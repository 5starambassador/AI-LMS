import React, { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '../lib/api';
import { ParentQrPanel } from './ParentQrPanel';
import {
  ClipboardList,
  Plus,
  ChevronRight,
  Printer,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Users,
  QrCode,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface ScoreExam {
  id: string;
  title: string;
  subject: string | { id: string; name: string; code?: string | null };
  subjectDetails?: { id: string; name: string; code?: string | null };
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

function getSubjectLabel(sub: ScoreExam['subject']): string {
  if (!sub) return 'General';
  return typeof sub === 'string' ? sub : sub.name || 'General';
}

function computeGradeFromPct(pct: number | null): string | null {
  if (pct === null || Number.isNaN(pct)) return null;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  return 'D';
}

function classifyMasteryTier(pct: number | null): {
  label: 'Proficient' | 'Progressing' | 'Beginner' | 'Pending';
  badge: string;
} {
  if (pct === null || Number.isNaN(pct)) {
    return { label: 'Pending', badge: 'bg-slate-100 text-slate-500 border-slate-200' };
  }
  if (pct >= 75) {
    return { label: 'Proficient', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  }
  if (pct >= 50) {
    return { label: 'Progressing', badge: 'bg-amber-100 text-amber-800 border-amber-200' };
  }
  return { label: 'Beginner', badge: 'bg-rose-100 text-rose-800 border-rose-200' };
}

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
function GradeCard({ exam, results, qrUrls }: { exam: ScoreExam; results: StudentResult[]; qrUrls: Record<string, string> }) {
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
        <div className="flex flex-wrap items-center justify-center gap-6 mt-2 text-xs text-slate-600">
          <span>Subject: <strong>{getSubjectLabel(exam.subject)}</strong></span>
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
            <th className="py-2 px-3 text-center border border-slate-200">Mastery Tier</th>
            <th className="py-2 px-3 text-left border border-slate-200">Remarks</th>
            {Object.keys(qrUrls).length > 0 && (
              <th className="py-2 px-3 text-center border border-slate-200">Verify (Parent QR)</th>
            )}
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => {
            const mastery = classifyMasteryTier(r.percentage);
            return (
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
                <td className="py-2 px-3 border border-slate-200 text-center">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${mastery.badge}`}>
                    {mastery.label}
                  </span>
                </td>
                <td className="py-2 px-3 border border-slate-200 text-xs text-slate-500">
                  {r.percentage !== null
                    ? r.percentage >= 75 ? 'Excellent' : r.percentage >= 60 ? 'Good' : r.percentage >= 40 ? 'Needs Improvement' : 'At Risk'
                    : 'Absent'}
                </td>
                {Object.keys(qrUrls).length > 0 && (
                  <td className="py-2 px-3 border border-slate-200 text-center">
                    {qrUrls[r.studentId] ? (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(qrUrls[r.studentId])}`}
                        alt="Verify"
                        className="w-12 h-12 mx-auto"
                      />
                    ) : '—'}
                  </td>
                )}
              </tr>
            );
          })}
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

  // Per-student parent QR URLs for grade card distribution
  const [qrUrls, setQrUrls] = useState<Record<string, string>>({});
  const [qrGenerating, setQrGenerating] = useState(false);

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

  const generateBulkQr = async () => {
    if (!resultsData) return;
    setQrGenerating(true);
    const gradedIds = resultsData.results
      .filter(r => r.marksObtained !== null)
      .map(r => r.studentId);
    try {
      const res = await apiPost('/api/parent/tokens/bulk', { studentIds: gradedIds });
      const map: Record<string, string> = {};
      for (const t of (res.tokens ?? [])) map[t.studentId] = t.portalUrl;
      setQrUrls(map);
    } catch { /* non-fatal */ }
    finally { setQrGenerating(false); }
  };

  const openResults = async (exam: ScoreExam) => {
    setSelectedExam(exam);
    setResultsLoading(true);
    setResultsData(null);
    setQrUrls({});
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
      .filter(([, v]) => v !== '' && !Number.isNaN(parseFloat(v)))
      .map(([studentId, v]) => ({
        studentId,
        marksObtained: Math.min(Math.max(parseFloat(v), 0), selectedExam.totalMarks)
      }));
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
        totalMarks: parseInt(newMaxMarks, 10) || 100,
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Exam Hub</h1>
              <p className="text-xs text-slate-500">Summative exams · mark entry · grade card PDF export</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/staff/exam-builder');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="flex items-center space-x-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Exam Builder →</span>
            </button>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/staff/aitools');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="flex items-center space-x-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-xl text-xs font-bold transition-colors"
            >
              <span>AI Exam Grader →</span>
            </button>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Exam</span>
            </button>
          </div>
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
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="font-bold text-slate-700 mb-1">No exams yet</h3>
            <p className="text-slate-400 text-sm mb-4">Create your first summative exam to start tracking student performance</p>
            <button onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">
              <Plus className="w-3.5 h-3.5" /><span>Create First Exam</span>
            </button>
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
                      {getSubjectLabel(exam.subject)} · {exam.totalMarks} marks
                      {exam.className ? ` · ${exam.className}` : ''}
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
        <div className="flex items-center justify-between flex-wrap gap-3 print:hidden">
          <button onClick={() => setView('entry')}
            className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Mark Entry</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={generateBulkQr}
              disabled={qrGenerating || !resultsData}
              className="flex items-center space-x-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow hover:bg-teal-700 disabled:opacity-60 transition-colors"
            >
              <QrCode className={`w-4 h-4 ${qrGenerating ? 'animate-spin' : ''}`} />
              <span>{qrGenerating ? 'Generating…' : Object.keys(qrUrls).length > 0 ? 'Regenerate QR Links' : 'Add QR Links for Parents'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
        {Object.keys(qrUrls).length > 0 && (
          <p className="text-xs text-teal-700 font-semibold print:hidden">
            ✓ QR codes ready — each parent can scan to verify their child's result. Print now to include them.
          </p>
        )}
        <div className="flex gap-5 items-start print:block">
          <div className="flex-1">
            <GradeCard exam={selectedExam} results={resultsData.results} qrUrls={qrUrls} />
          </div>
          <div className="w-72 shrink-0 print:hidden">
            <ParentQrPanel />
          </div>
        </div>
      </div>
    );
  }

  // ── Mark Entry View ──
  if (view === 'entry' && selectedExam) {
    const computedRows = (resultsData?.results ?? []).map(r => {
      const raw = marksMap[r.studentId];
      const hasInput = raw !== undefined && raw.trim() !== '' && !Number.isNaN(Number(raw));
      const clampedNum = hasInput
        ? Math.min(Math.max(parseFloat(raw), 0), selectedExam.totalMarks)
        : null;
      const livePct =
        clampedNum !== null && selectedExam.totalMarks > 0
          ? Math.round((clampedNum / selectedExam.totalMarks) * 100)
          : r.percentage;
      const liveGrade = clampedNum !== null ? computeGradeFromPct(livePct) : r.grade;
      const mastery = classifyMasteryTier(livePct);
      return { r, hasInput, livePct, liveGrade, mastery };
    });

    const graded = computedRows.filter(row => row.hasInput || row.r.marksObtained !== null).length;
    const total = computedRows.length;
    const proficientCount = computedRows.filter(row => row.mastery.label === 'Proficient').length;
    const progressingCount = computedRows.filter(row => row.mastery.label === 'Progressing').length;
    const beginnerCount = computedRows.filter(row => row.mastery.label === 'Beginner').length;

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
              <span className="ml-2 text-xs text-slate-500">
                {getSubjectLabel(selectedExam.subject)} · {selectedExam.totalMarks} marks
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/staff/learning-gaps');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="flex items-center space-x-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors shadow-xs"
              title="Inspect learning gaps and prerequisite diagnosis for this cohort"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Learning Gaps</span>
            </button>
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

        {/* Progress & Cohort Mastery Distribution Bar */}
        {resultsData && (
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3 text-slate-600 flex-1 min-w-[220px]">
              <Users className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-semibold">{graded} of {total} students graded</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-xs">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: total > 0 ? `${(graded / total) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                Proficient (≥75%): {proficientCount}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                Progressing (50–74%): {progressingCount}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
                Beginner (&lt;50%): {beginnerCount}
              </span>
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
                  <th className="py-3 px-4 text-left w-28 whitespace-nowrap">Roll No.</th>
                  <th className="py-3 px-4 text-left">Student Name</th>
                  <th className="py-3 px-4 text-center w-40">Marks (out of {selectedExam.totalMarks})</th>
                  <th className="py-3 px-4 text-center w-24">%</th>
                  <th className="py-3 px-4 text-center w-20">Grade</th>
                  <th className="py-3 px-4 text-center w-36 whitespace-nowrap">Mastery Tier</th>
                </tr>
              </thead>
              <tbody>
                {computedRows.map(({ r, livePct, liveGrade, mastery }, i) => (
                  <tr key={r.studentId} className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                    <td className="py-3 px-4 text-slate-500 text-xs whitespace-nowrap">{r.rollNumber ?? '—'}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{r.studentName}</td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max={selectedExam.totalMarks}
                        step="0.5"
                        value={marksMap[r.studentId] ?? ''}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '') {
                            setMarksMap(prev => ({ ...prev, [r.studentId]: '' }));
                            return;
                          }
                          const num = parseFloat(val);
                          if (Number.isNaN(num)) return;
                          const bounded =
                            num > selectedExam.totalMarks
                              ? String(selectedExam.totalMarks)
                              : num < 0
                              ? '0'
                              : val;
                          setMarksMap(prev => ({ ...prev, [r.studentId]: bounded }));
                        }}
                        placeholder="—"
                        className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                      />
                    </td>
                    <td className={`py-3 px-4 text-center text-sm font-semibold ${pctColor(livePct)}`}>
                      {livePct !== null ? `${livePct}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {liveGrade ? (
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${gradeColor(liveGrade)}`}>{liveGrade}</span>
                      ) : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${mastery.badge}`}>
                        {mastery.label}
                      </span>
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
