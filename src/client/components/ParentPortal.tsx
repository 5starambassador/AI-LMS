import React, { useState, useEffect } from 'react';
import {
  User,
  CalendarCheck,
  BookOpen,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  School
} from 'lucide-react';

interface AttendanceDay { date: string; status: string }
interface HwSubmission {
  subject: string; title: string;
  marksAwarded: number | null; maxMarks: number;
  status: string; submittedAt: string;
}
interface ExamResult {
  title: string; subject: string;
  marksObtained: number; totalMarks: number;
  percentage: number; scheduledDate: string | null; gradedAt: string | null;
}
interface PortalData {
  student: { name: string; class: string | null; rollNumber: string | null };
  attendance: {
    percentage: number | null; presentDays: number; totalDays: number;
    recentDates: AttendanceDay[];
  };
  homework: { averagePercent: number | null; submissions: HwSubmission[] };
  exams: ExamResult[];
  tokenExpiresAt: string;
}

function pctBadge(pct: number | null) {
  if (pct === null) return 'bg-slate-100 text-slate-500';
  if (pct >= 80) return 'bg-emerald-100 text-emerald-800';
  if (pct >= 60) return 'bg-teal-100 text-teal-800';
  if (pct >= 40) return 'bg-amber-100 text-amber-800';
  return 'bg-rose-100 text-rose-800';
}

function StatusDot({ status }: { status: string }) {
  if (status === 'PRESENT') return <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" title="Present" />;
  if (status === 'ABSENT') return <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" title="Absent" />;
  return <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" title={status} />;
}

interface Props { token: string }

export const ParentPortal: React.FC<Props> = ({ token }) => {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/parent/portal/${token}`)
      .then(r => r.json())
      .then(d => {
        if (!d.success) setError(d.error ?? 'Invalid link.');
        else setData(d);
      })
      .catch(() => setError('Could not reach server.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-50">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-slate-500 text-sm">Loading student report…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-slate-50">
        <div className="text-center max-w-sm px-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-rose-600" />
          </div>
          <h2 className="text-lg font-black text-slate-900 mb-2">Link unavailable</h2>
          <p className="text-sm text-slate-500">{error ?? 'This report link has expired or is invalid. Please request a new link from your child\'s teacher.'}</p>
        </div>
      </div>
    );
  }

  const { student, attendance, homework, exams } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 to-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-indigo-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-lg">
                  Achariya AI ONE
                </span>
                <span className="text-xs text-slate-400">Parent Report</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">{student.name}</h1>
              <div className="text-sm text-slate-500 flex items-center space-x-2 mt-0.5">
                <School className="w-3.5 h-3.5" />
                <span>{student.class ?? 'Class not assigned'}</span>
                {student.rollNumber && <span>· Roll {student.rollNumber}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center">
            <CalendarCheck className="w-5 h-5 text-teal-600 mx-auto mb-1" />
            <div className={`text-2xl font-black ${attendance.percentage !== null ? (attendance.percentage >= 75 ? 'text-emerald-700' : 'text-rose-700') : 'text-slate-400'}`}>
              {attendance.percentage !== null ? `${attendance.percentage}%` : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Attendance</div>
            <div className="text-xs text-slate-400">{attendance.presentDays}/{attendance.totalDays} days</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center">
            <BookOpen className="w-5 h-5 text-violet-600 mx-auto mb-1" />
            <div className={`text-2xl font-black ${homework.averagePercent !== null ? (homework.averagePercent >= 60 ? 'text-emerald-700' : 'text-amber-700') : 'text-slate-400'}`}>
              {homework.averagePercent !== null ? `${homework.averagePercent}%` : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Homework Avg</div>
            <div className="text-xs text-slate-400">{homework.submissions.length} submitted</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center">
            <ClipboardList className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <div className={`text-2xl font-black ${exams.length > 0 ? (Math.round(exams.reduce((s,e)=>s+e.percentage,0)/exams.length) >= 60 ? 'text-emerald-700' : 'text-amber-700') : 'text-slate-400'}`}>
              {exams.length > 0
                ? `${Math.round(exams.reduce((s,e)=>s+e.percentage,0)/exams.length)}%`
                : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Exam Avg</div>
            <div className="text-xs text-slate-400">{exams.length} exam{exams.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Attendance strip */}
        {attendance.recentDates.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="text-xs font-bold text-slate-700 mb-3 flex items-center space-x-2">
              <CalendarCheck className="w-4 h-4 text-teal-600" />
              <span>Recent Attendance (last 7 days)</span>
            </div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              {attendance.recentDates.map((d, i) => (
                <div key={i} className="flex flex-col items-center space-y-1">
                  <StatusDot status={d.status} />
                  <span className="text-[10px] text-slate-400">
                    {new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
            {attendance.percentage !== null && attendance.percentage < 75 && (
              <div className="mt-3 flex items-start space-x-2 p-2.5 bg-rose-50 rounded-xl text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Attendance is below 75%. Please ensure regular attendance.</span>
              </div>
            )}
          </div>
        )}

        {/* Homework */}
        {homework.submissions.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="text-xs font-bold text-slate-700 mb-3 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-violet-600" />
              <span>Recent Homework</span>
            </div>
            <div className="space-y-2">
              {homework.submissions.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{s.title}</div>
                    <div className="text-[11px] text-slate-400">{s.subject}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {s.marksAwarded !== null ? (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${pctBadge(Math.round((s.marksAwarded/s.maxMarks)*100))}`}>
                        {s.marksAwarded}/{s.maxMarks}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{s.status === 'GRADED' ? 'Graded' : 'Pending'}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exams */}
        {exams.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="text-xs font-bold text-slate-700 mb-3 flex items-center space-x-2">
              <ClipboardList className="w-4 h-4 text-indigo-600" />
              <span>Exam Results</span>
            </div>
            <div className="space-y-2">
              {exams.map((e, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{e.title}</div>
                    <div className="text-[11px] text-slate-400">{e.subject}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${pctBadge(e.percentage)}`}>
                      {e.marksObtained}/{e.totalMarks} · {e.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 pb-4">
          This report link expires on {new Date(data.tokenExpiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}.
          <br />Contact your child's teacher for an updated link.
        </div>
      </div>
    </div>
  );
};
