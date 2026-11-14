import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Users, Award, AlertCircle,
  BookOpen, FileCheck, Sparkles, ChevronUp, ChevronDown,
  Zap, AlertTriangle
} from 'lucide-react';
import { apiGet } from '../lib/api';
import { LearningGapsReport } from './LearningGapsReport';

interface SubjectStat {
  name: string;
  hwAvg: number | null;
  quizAvg: number | null;
  hwGraded: number;
  hwTotal: number;
  quizAttempts: number;
}

interface Performer {
  studentId: string;
  name: string;
  avgPercent: number;
  assessmentCount: number;
}

interface TrendPoint {
  date: string;
  hw: number;
  quiz: number;
}

interface SessionRow {
  quizId: string;
  studentId: string;
  studentName: string;
  quizTitle: string;
  subject: string;
  class: string;
  percentage: number;
  score: number;
  totalMarks: number;
  gapCount: number;
  submittedAt: string;
}

interface InsightsData {
  summary: {
    totalHomeworks: number;
    totalQuizzes: number;
    totalSubmissions: number;
    evaluatedCount: number;
    quizAttempts: number;
    hwOverallAvg: number | null;
    quizOverallAvg: number | null;
    studentsAssessed: number;
  };
  subjects: SubjectStat[];
  topPerformers: Performer[];
  needsAttention: Performer[];
  trend: TrendPoint[];
}

function ScoreBar({ value, color = 'teal', label }: { value: number; color?: string; label?: string }) {
  const colorMap: Record<string, string> = {
    teal: 'bg-teal-500',
    indigo: 'bg-indigo-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    violet: 'bg-violet-500'
  };
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-[11px] text-slate-500 w-28 shrink-0 truncate">{label}</span>}
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${colorMap[color] ?? 'bg-teal-500'}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-[11px] font-mono font-bold text-slate-700 w-12 shrink-0 text-right">{value}%</span>
    </div>
  );
}

function classifyMastery(pct: number | null): {
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

function StatCard({ icon, label, value, sub, accent }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; accent?: string
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-start gap-3 ${accent ?? ''}`}>
      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-extrabold text-slate-900 leading-tight">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export const ScoreInsights: React.FC = () => {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'overview' | 'performers' | 'sessions'>('overview');
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [openReport, setOpenReport] = useState<{ quizId: string; studentId: string } | null>(null);

  useEffect(() => {
    apiGet<InsightsData & { success: boolean }>('/api/analytics/score-insights')
      .then(d => setData(d))
      .catch(e => setError(e?.message ?? 'Could not load analytics data.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (view !== 'sessions') return;
    setSessionsLoading(true);
    apiGet<{ success: boolean; sessions: SessionRow[] }>('/api/analytics/recent-quiz-sessions')
      .then(d => setSessions(d.sessions ?? []))
      .catch(() => setSessions([]))
      .finally(() => setSessionsLoading(false));
  }, [view]);

  // Session report drill-down
  if (openReport) {
    return (
      <LearningGapsReport
        quizId={openReport.quizId}
        studentId={openReport.studentId}
        onBack={() => setOpenReport(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="inline-block w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Crunching class scores…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
        <p className="text-sm text-rose-700 font-medium">{error || 'No data available.'}</p>
      </div>
    );
  }

  const { summary, subjects, topPerformers, needsAttention, trend } = data;
  const maxTrend = Math.max(...trend.map(t => t.hw + t.quiz), 1);
  const allPerformers = [
    ...topPerformers,
    ...needsAttention.filter(p => !topPerformers.some(t => t.studentId === p.studentId))
  ];
  const proficientCount = allPerformers.filter(p => p.avgPercent >= 75).length;
  const progressingCount = allPerformers.filter(p => p.avgPercent >= 50 && p.avgPercent < 75).length;
  const beginnerCount = allPerformers.filter(p => p.avgPercent < 50).length;
  const assignedCount = Math.max(
    summary.totalHomeworks * Math.max(summary.studentsAssessed, 1),
    summary.totalSubmissions
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60 mb-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>SCORE Insights Dashboard</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Class Performance Analytics</h1>
            <p className="text-xs text-slate-500">Aggregated from homework evaluations and quiz submissions — updated live</p>
          </div>

          {/* View switcher & Cross-Module Links */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                window.history.pushState(null, '', '/staff/exams');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all"
            >
              Exam Hub →
            </button>
            <button
              onClick={() => {
                window.history.pushState(null, '', '/staff/reportcard');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold transition-all"
            >
              Report Cards →
            </button>
            <button
              onClick={() => {
                window.history.pushState(null, '', '/staff/learning-gaps');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-purple-200" />
              <span>AI Learning Gap Studio →</span>
            </button>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setView('overview')}
                className={`px-3 py-1.5 rounded-lg transition-all ${view === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setView('performers')}
                className={`px-3 py-1.5 rounded-lg transition-all ${view === 'performers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                Performers
              </button>
              <button
                onClick={() => setView('sessions')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${view === 'sessions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                <Zap className="w-3 h-3" />
                Sessions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-4 h-4" />}
          label="Students Assessed"
          value={summary.studentsAssessed}
          sub={`${summary.totalSubmissions} total submissions`}
        />
        <StatCard
          icon={<FileCheck className="w-4 h-4" />}
          label="HW Avg Score"
          value={summary.hwOverallAvg !== null ? `${summary.hwOverallAvg}%` : '—'}
          sub={`${summary.evaluatedCount} graded`}
        />
        <StatCard
          icon={<Sparkles className="w-4 h-4" />}
          label="Quiz Avg Score"
          value={summary.quizOverallAvg !== null ? `${summary.quizOverallAvg}%` : '—'}
          sub={`${summary.quizAttempts} attempts`}
        />
        <StatCard
          icon={<BookOpen className="w-4 h-4" />}
          label="Tasks Published"
          value={summary.totalHomeworks + summary.totalQuizzes}
          sub={`${summary.totalHomeworks} HW · ${summary.totalQuizzes} Quiz`}
        />
      </div>

      {view === 'sessions' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-500" />
            <h2 className="font-extrabold text-slate-900 text-sm">Recent Quiz Sessions</h2>
            <span className="text-[10px] text-slate-400 font-normal">— click any row to view the full Learning Gaps report</span>
          </div>

          {sessionsLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400 mt-2">Loading sessions…</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-12 text-center">
              <Zap className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">No quiz sessions yet.</p>
              <p className="text-[11px] text-slate-300 mt-1">Create a quiz and have students submit to see session reports here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Student</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Quiz</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Subject</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Score</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Gaps</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Date</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sessions.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50 cursor-pointer" onClick={() => setOpenReport({ quizId: s.quizId, studentId: s.studentId })}>
                      <td className="px-5 py-3 font-semibold text-slate-800">{s.studentName}</td>
                      <td className="px-5 py-3 text-slate-600 max-w-[260px] truncate">{s.quizTitle}</td>
                      <td className="px-5 py-3 text-slate-500">{s.subject}</td>
                      <td className="px-5 py-3">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded-lg text-[11px] ${
                          s.percentage >= 80 ? 'bg-emerald-50 text-emerald-700' :
                          s.percentage >= 60 ? 'bg-teal-50 text-teal-700' :
                          s.percentage >= 40 ? 'bg-amber-50 text-amber-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>{s.percentage}%</span>
                      </td>
                      <td className="px-5 py-3">
                        {s.gapCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                            <AlertTriangle className="w-3 h-3" /> {s.gapCount}
                          </span>
                        ) : (
                          <span className="text-emerald-500 font-bold">0</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-400 font-mono text-[10px]">
                        {new Date(s.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-indigo-600 font-bold text-[11px] hover:text-indigo-800 flex items-center gap-0.5">
                          View →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : view === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject performance */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-slate-900 text-sm">Subject-wise Performance</h2>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Homework</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Quiz</span>
              </div>
            </div>

            {subjects.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No graded submissions yet.</p>
            ) : (
              <div className="space-y-5">
                {subjects.map(s => {
                  const vals = [s.hwAvg, s.quizAvg].filter((v): v is number => v !== null);
                  const combinedAvg = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
                  const subjMastery = classifyMastery(combinedAvg);
                  return (
                    <div key={s.name} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{s.name}</span>
                          {combinedAvg !== null && (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${subjMastery.badge}`}>
                              {subjMastery.label}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{s.hwGraded} graded · {s.quizAttempts} quiz attempts</span>
                      </div>
                      {s.hwAvg !== null && <ScoreBar value={s.hwAvg} color="teal" label="Homework" />}
                      {s.quizAvg !== null && <ScoreBar value={s.quizAvg} color="indigo" label="Quiz" />}
                      {s.hwAvg === null && s.quizAvg === null && (
                        <p className="text-[11px] text-slate-400 pl-20">Not yet graded</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 14-day activity trend */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-slate-900 text-sm">14-Day Submission Activity</h2>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> HW</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Quiz</span>
              </div>
            </div>

            <div className="flex items-end gap-1 h-32">
              {trend.map(t => {
                const total = t.hw + t.quiz;
                const hwH = maxTrend > 0 ? Math.round((t.hw / maxTrend) * 100) : 0;
                const quizH = maxTrend > 0 ? Math.round((t.quiz / maxTrend) * 100) : 0;
                const isToday = t.date === new Date().toISOString().slice(0, 10);
                return (
                  <div key={t.date} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                    {/* Tooltip */}
                    {total > 0 && (
                      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {t.date.slice(5)}: {t.hw}+{t.quiz}
                      </div>
                    )}
                    <div className="w-full flex flex-col items-stretch gap-0.5">
                      <div
                        className="w-full rounded-t bg-teal-400 transition-all"
                        style={{ height: `${hwH}%`, minHeight: t.hw > 0 ? '4px' : '0' }}
                      />
                      <div
                        className="w-full bg-indigo-400 transition-all"
                        style={{ height: `${quizH}%`, minHeight: t.quiz > 0 ? '4px' : '0' }}
                      />
                    </div>
                    <span className={`text-[7px] font-mono mt-1 ${isToday ? 'text-teal-700 font-bold' : 'text-slate-300'}`}>
                      {t.date.slice(8)}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-400 text-right">Hover bars to see details · Dates are DD of month</p>
          </div>

          {/* Homework completion funnel & Cohort Mastery Distribution */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm">Homework Funnel — Submission → Evaluation</h2>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
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
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Assigned (Est. Cohort)', rawValue: assignedCount, color: 'slate' },
                { label: 'Submitted', rawValue: summary.totalSubmissions, color: 'teal' },
                { label: 'Graded', rawValue: summary.evaluatedCount, color: 'emerald' }
              ].map((s, i) => (
                <div key={i} className={`rounded-2xl border p-4 ${
                  s.color === 'emerald' ? 'bg-emerald-50 border-emerald-200' :
                  s.color === 'teal' ? 'bg-teal-50 border-teal-200' :
                  'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-2xl font-extrabold ${
                    s.color === 'emerald' ? 'text-emerald-800' :
                    s.color === 'teal' ? 'text-teal-800' :
                    'text-slate-700'
                  }`}>{s.rawValue}</p>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top performers */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h2 className="font-extrabold text-slate-900 text-sm">Top Performers</h2>
            </div>
            {topPerformers.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No graded assessments yet.</p>
            ) : (
              <div className="space-y-3">
                {topPerformers.map((p, i) => (
                  <div key={p.studentId} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                      i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-slate-100 text-slate-600' :
                      'bg-orange-50 text-orange-700'
                    }`}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800 truncate">{p.name}</span>
                        <span className="text-xs font-mono font-extrabold text-teal-700 ml-2">{p.avgPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${p.avgPercent}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{p.assessmentCount} tasks</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Needs attention */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <h2 className="font-extrabold text-slate-900 text-sm">Needs Attention  <span className="text-[10px] font-normal text-slate-400">(below 50%)</span></h2>
            </div>
            {needsAttention.length === 0 ? (
              <div className="py-6 text-center space-y-1">
                <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-emerald-600 font-semibold">All assessed students are above 50%!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {needsAttention.map(p => (
                  <div key={p.studentId} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-700 font-bold text-sm flex items-center justify-center shrink-0">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800 truncate">{p.name}</span>
                        <span className="text-xs font-mono font-extrabold text-rose-600 ml-2">{p.avgPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-400 rounded-full" style={{ width: `${p.avgPercent}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{p.assessmentCount} tasks</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All students sorted table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-3 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm">All Performers — Class Rank</h2>
              <span className="text-[11px] font-bold text-slate-500">
                {proficientCount} Proficient · {progressingCount} Progressing · {beginnerCount} Beginner
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 text-[10px] font-bold text-slate-400 uppercase pr-4">Rank</th>
                    <th className="text-left py-2 text-[10px] font-bold text-slate-400 uppercase pr-4">Student</th>
                    <th className="text-left py-2 text-[10px] font-bold text-slate-400 uppercase pr-4">Avg Score</th>
                    <th className="text-left py-2 text-[10px] font-bold text-slate-400 uppercase pr-4">Mastery Tier</th>
                    <th className="text-left py-2 text-[10px] font-bold text-slate-400 uppercase">Assessments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allPerformers.map((p, i) => {
                    const mastery = classifyMastery(p.avgPercent);
                    return (
                      <tr key={p.studentId} className="hover:bg-slate-50">
                        <td className="py-2.5 pr-4 font-mono text-slate-500">#{i + 1}</td>
                        <td className="py-2.5 pr-4 font-semibold text-slate-800">{p.name}</td>
                        <td className="py-2.5 pr-4">
                          <span className={`font-mono font-bold px-2 py-0.5 rounded-lg text-[11px] ${
                            p.avgPercent >= 80 ? 'bg-emerald-50 text-emerald-700' :
                            p.avgPercent >= 60 ? 'bg-teal-50 text-teal-700' :
                            p.avgPercent >= 40 ? 'bg-amber-50 text-amber-700' :
                            'bg-rose-50 text-rose-700'
                          }`}>{p.avgPercent}%</span>
                        </td>
                        <td className="py-2.5 pr-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${mastery.badge}`}>
                            {mastery.label}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-400">{p.assessmentCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
