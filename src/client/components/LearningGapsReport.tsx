import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, CheckCircle2, XCircle, MinusCircle,
  Clock, Target, Zap, BookOpen, TrendingUp, TrendingDown,
  AlertTriangle, ChevronRight, User, Calendar
} from 'lucide-react';
import { apiGet } from '../lib/api';

interface ReportData {
  quiz: {
    id: string;
    title: string;
    subject: string;
    class: string;
    section: string | null;
    timeLimitMinutes: number;
    totalQuestions: number;
    totalMarks: number;
  };
  student: {
    id: string;
    name: string;
    class: string;
    section: string | null;
    rollNumber: string | null;
  };
  session: { submittedAt: string; timeSpentMinutes: number };
  scoreCard: {
    percentage: number;
    correct: number;
    wrong: number;
    skipped: number;
    attempted: number;
    totalQuestions: number;
    score: number;
    totalMarks: number;
    gapCount: number;
  };
  learningGaps: {
    isFirstSession: boolean;
    carriedIn: number;
    closedHere: number;
    newHere: number;
    openNow: number;
    closedHereDetails: Array<{ questionNumber: number; conceptName: string }>;
    openGaps: Array<{ conceptName: string; questionNumbers: number[]; status: 'carried_in' | 'new_here' }>;
  };
  questionBreakdown: Array<{
    questionNumber: number;
    questionText: string;
    studentAnswer: any;
    correctAnswer: any;
    isCorrect: boolean;
    skipped: boolean;
    marks: number;
    marksAwarded: number;
  }>;
}

function fmt(val: any): string {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

function ScoreRing({ percentage }: { percentage: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const fill = (percentage / 100) * circ;
  const color = percentage >= 75 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div className="text-center">
        <p className="text-xl font-extrabold text-slate-900 leading-none">{percentage}%</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Score</p>
      </div>
    </div>
  );
}

function LifecycleBox({
  label, value, color, hint
}: { label: string; value: number | string; color: string; hint?: string }) {
  const colorMap: Record<string, string> = {
    slate: 'bg-slate-50 border-slate-200 text-slate-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
  };
  return (
    <div className={`rounded-2xl border p-4 text-center ${colorMap[color]}`}>
      <p className="text-2xl font-extrabold leading-none">
        {value === 0 || value === '—' ? <span className="text-slate-300">—</span> : value}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-80">{label}</p>
      {hint && <p className="text-[10px] opacity-60 mt-0.5">{hint}</p>}
    </div>
  );
}

export const LearningGapsReport: React.FC<{
  quizId: string;
  studentId: string;
  onBack: () => void;
}> = ({ quizId, studentId, onBack }) => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    apiGet<{ success: boolean; report: ReportData }>(
      `/api/assessment/quizzes/${quizId}/session-report?studentId=${studentId}`
    )
      .then(d => setReport(d.report))
      .catch(e => setError(e?.message ?? 'Could not load session report.'))
      .finally(() => setLoading(false));
  }, [quizId, studentId]);

  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading session report…</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
        <p className="text-sm text-rose-700 font-medium">{error || 'No data available.'}</p>
        <button onClick={onBack} className="mt-3 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 mx-auto">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>
    );
  }

  const { quiz, student, session, scoreCard, learningGaps, questionBreakdown } = report;
  const dateStr = new Date(session.submittedAt).toLocaleString('en-IN', {
    dateStyle: 'medium', timeStyle: 'short'
  });

  return (
    <div className="space-y-5 pb-16">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Sessions
      </button>

      {/* Header card — matches video style */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-100 bg-white/20 px-3 py-1 rounded-full mb-2">
            <Zap className="w-3.5 h-3.5" />
            In-Class Session Report
          </div>
          <h2 className="text-lg font-extrabold text-white leading-tight">{quiz.title}</h2>
          <p className="text-xs text-indigo-200 mt-0.5">{quiz.subject} · {quiz.class}{quiz.section ? ` · ${quiz.section}` : ''}</p>
        </div>

        <div className="px-6 py-4 flex flex-wrap items-center gap-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-800">{student.name}</span>
            {student.rollNumber && <span className="text-slate-400">· Roll {student.rollNumber}</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateStr}</span>
          </div>
        </div>

        {/* Score card row */}
        <div className="px-6 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <ScoreRing percentage={scoreCard.percentage} />

            <div className="flex-1 grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { label: 'Correct',   value: scoreCard.correct,   icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />, accent: 'text-emerald-700' },
                { label: 'Wrong',     value: scoreCard.wrong,     icon: <XCircle       className="w-3.5 h-3.5 text-rose-500" />,    accent: 'text-rose-700' },
                { label: 'Skipped',   value: scoreCard.skipped,   icon: <MinusCircle   className="w-3.5 h-3.5 text-slate-400" />,  accent: 'text-slate-600' },
                { label: 'Attempted', value: `${scoreCard.attempted}/${scoreCard.totalQuestions}`, icon: <Target className="w-3.5 h-3.5 text-indigo-500" />, accent: 'text-indigo-700' },
                { label: 'Time Spent',value: `${session.timeSpentMinutes} min`, icon: <Clock className="w-3.5 h-3.5 text-teal-500" />,   accent: 'text-teal-700' },
                { label: 'Gaps',      value: scoreCard.gapCount,  icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,  accent: 'text-amber-700' },
              ].map(m => (
                <div key={m.label} className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <div className="flex items-center gap-1 mb-1">{m.icon}<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{m.label}</span></div>
                  <p className={`text-base font-extrabold ${m.accent}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Gaps Panel */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <h3 className="font-extrabold text-slate-900 text-sm">Learning Gaps</h3>
        </div>

        {/* Lifecycle grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <LifecycleBox label="Carried In"   value={learningGaps.carriedIn}  color="slate"   hint="From earlier sessions" />
          <LifecycleBox label="Closed Here"  value={learningGaps.closedHere} color="emerald" hint="Fixed in this session" />
          <LifecycleBox label="New Here"     value={learningGaps.newHere}    color="amber"   hint="Appeared this session" />
          <LifecycleBox label="Open Now"     value={learningGaps.openNow}    color="rose"    hint="Still unresolved" />
        </div>

        {/* Context note */}
        {learningGaps.isFirstSession && (
          <p className="text-[11px] text-slate-400 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
            First session for this subject — no earlier report to compare against. All gaps are marked as New Here.
          </p>
        )}

        {/* Closed gaps */}
        {learningGaps.closedHereDetails.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Closed This Session
            </p>
            {learningGaps.closedHereDetails.map((g, i) => (
              <div key={i} className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-800">{g.conceptName}</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Fixed on question {g.questionNumber}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Open gaps */}
        {learningGaps.openGaps.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wide flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> Still Open
            </p>
            {learningGaps.openGaps.map((g, i) => (
              <div key={i} className={`flex items-start gap-2 rounded-xl px-4 py-3 border ${
                g.status === 'carried_in'
                  ? 'bg-rose-50 border-rose-100'
                  : 'bg-amber-50 border-amber-100'
              }`}>
                <XCircle className={`w-4 h-4 mt-0.5 shrink-0 ${g.status === 'carried_in' ? 'text-rose-500' : 'text-amber-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${g.status === 'carried_in' ? 'text-rose-800' : 'text-amber-800'}`}>
                    {g.conceptName}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${g.status === 'carried_in' ? 'text-rose-500' : 'text-amber-600'}`}>
                    Missed on question{g.questionNumbers.length > 1 ? 's' : ''} {g.questionNumbers.join(', ')}
                  </p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  g.status === 'carried_in'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {g.status === 'carried_in' ? 'Carried In' : 'New Here'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
            <p className="text-xs text-emerald-600 font-semibold">No open gaps — perfect session!</p>
          </div>
        )}
      </div>

      {/* Question-wise Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <button
          onClick={() => setShowBreakdown(v => !v)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-500" />
            <span className="font-extrabold text-slate-900 text-sm">Question-wise Breakdown</span>
            <span className="text-[10px] text-slate-400 font-normal">{questionBreakdown.length} questions</span>
          </div>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showBreakdown ? 'rotate-90' : ''}`} />
        </button>

        {showBreakdown && (
          <div className="border-t border-slate-100 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase w-8">#</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Question</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase min-w-[100px]">Your Answer</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase min-w-[100px]">Correct</th>
                  <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase w-16">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {questionBreakdown.map(q => (
                  <tr key={q.questionNumber} className={`hover:bg-slate-50 ${
                    q.isCorrect ? '' : q.skipped ? 'bg-slate-50/40' : 'bg-rose-50/30'
                  }`}>
                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">{q.questionNumber}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs">
                      <span className="line-clamp-2">{q.questionText}</span>
                    </td>
                    <td className="px-4 py-3">
                      {q.skipped ? (
                        <span className="text-slate-400 italic text-[11px]">Skipped</span>
                      ) : (
                        <span className={`font-medium ${q.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {fmt(q.studentAnswer)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600">{fmt(q.correctAnswer)}</td>
                    <td className="px-4 py-3 text-center">
                      {q.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : q.skipped ? (
                        <MinusCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
