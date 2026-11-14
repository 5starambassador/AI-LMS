import React, { useState, useEffect, useRef } from 'react';
import { apiGet } from '../lib/api';

interface StudentItem { id: string; name: string; roll: string; class: string; section: string }
interface SubjectRow { subject: string; avgPercent: number | null; submissions?: number; count?: number; grade?: string }
interface ExamRow { title: string; subject: string; marksObtained: number; totalMarks: number; percentage: number; grade: string; scheduledDate: string }
interface Report {
  student: { name: string; class: string | null; section: string | null; batch: string | null; roll: string | null };
  attendance: { present: number; absent: number; leave: number; total: number; percentage: number | null };
  homework: SubjectRow[];
  exams: ExamRow[];
  examBySubject: SubjectRow[];
  generatedAt: string;
}

function gradeColor(g: string) {
  if (g === 'A+') return 'text-emerald-700 bg-emerald-50';
  if (g === 'A')  return 'text-teal-700 bg-teal-50';
  if (g === 'B+') return 'text-blue-700 bg-blue-50';
  if (g === 'B')  return 'text-indigo-700 bg-indigo-50';
  if (g === 'C')  return 'text-amber-700 bg-amber-50';
  return 'text-rose-700 bg-rose-50';
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

const FALLBACK_STUDENTS: StudentItem[] = [
  { id: 'stu-fallback-1', name: 'Aarav Sundaram', roll: 'ACH-05A-01', class: 'Grade 5', section: 'A' },
  { id: 'stu-fallback-2', name: 'Diya Ramanathan', roll: 'ACH-05A-02', class: 'Grade 5', section: 'A' },
  { id: 'stu-fallback-3', name: 'Ananya Radhakrishnan', roll: 'ACH-05A-06', class: 'Grade 5', section: 'A' }
];

const FALLBACK_REPORTS: Record<string, Report> = {
  'stu-fallback-1': {
    student: { name: 'Aarav Sundaram', class: 'Grade 5', section: 'A', batch: '2026–2027 CBSE Competency Cohort', roll: 'ACH-05A-01' },
    attendance: { present: 112, absent: 4, leave: 2, total: 118, percentage: 95 },
    homework: [
      { subject: 'Mathematics', avgPercent: 90, submissions: 12 },
      { subject: 'Experiential Sciences', avgPercent: 92, submissions: 10 },
      { subject: 'English Language Lab', avgPercent: 89, submissions: 11 }
    ],
    examBySubject: [
      { subject: 'Mathematics', count: 2, avgPercent: 92, grade: 'A+' },
      { subject: 'Experiential Sciences', count: 2, avgPercent: 94, grade: 'A+' },
      { subject: 'English Language Lab', count: 1, avgPercent: 86, grade: 'A' }
    ],
    exams: [
      { title: 'Golden Concord Summative Exam (Set A)', subject: 'Mathematics', marksObtained: 46, totalMarks: 50, percentage: 92, grade: 'A+', scheduledDate: '2026-11-06' },
      { title: 'Term 1 Science & Energy Summative', subject: 'Experiential Sciences', marksObtained: 47, totalMarks: 50, percentage: 94, grade: 'A+', scheduledDate: '2026-10-28' },
      { title: 'Mid-Term English Fluency & Reading', subject: 'English Language Lab', marksObtained: 43, totalMarks: 50, percentage: 86, grade: 'A', scheduledDate: '2026-10-15' }
    ],
    generatedAt: '2026-11-14T00:00:00.000Z'
  },
  'stu-fallback-2': {
    student: { name: 'Diya Ramanathan', class: 'Grade 5', section: 'A', batch: '2026–2027 CBSE Competency Cohort', roll: 'ACH-05A-02' },
    attendance: { present: 115, absent: 2, leave: 1, total: 118, percentage: 97 },
    homework: [
      { subject: 'Mathematics', avgPercent: 97, submissions: 12 },
      { subject: 'Experiential Sciences', avgPercent: 98, submissions: 10 },
      { subject: 'English Language Lab', avgPercent: 94, submissions: 11 }
    ],
    examBySubject: [
      { subject: 'Mathematics', count: 2, avgPercent: 98, grade: 'A+' },
      { subject: 'Experiential Sciences', count: 2, avgPercent: 96, grade: 'A+' },
      { subject: 'English Language Lab', count: 1, avgPercent: 92, grade: 'A+' }
    ],
    exams: [
      { title: 'Golden Concord Summative Exam (Set B)', subject: 'Mathematics', marksObtained: 49, totalMarks: 50, percentage: 98, grade: 'A+', scheduledDate: '2026-11-06' },
      { title: 'Term 1 Science & Energy Summative', subject: 'Experiential Sciences', marksObtained: 48, totalMarks: 50, percentage: 96, grade: 'A+', scheduledDate: '2026-10-28' }
    ],
    generatedAt: '2026-11-14T00:00:00.000Z'
  },
  'stu-fallback-3': {
    student: { name: 'Ananya Radhakrishnan', class: 'Grade 5', section: 'A', batch: '2026–2027 CBSE Competency Cohort', roll: 'ACH-05A-06' },
    attendance: { present: 98, absent: 14, leave: 6, total: 118, percentage: 83 },
    homework: [
      { subject: 'Mathematics', avgPercent: 48, submissions: 9 },
      { subject: 'Experiential Sciences', avgPercent: 62, submissions: 9 },
      { subject: 'English Language Lab', avgPercent: 68, submissions: 10 }
    ],
    examBySubject: [
      { subject: 'Mathematics', count: 2, avgPercent: 48, grade: 'D' },
      { subject: 'Experiential Sciences', count: 2, avgPercent: 64, grade: 'B' },
      { subject: 'English Language Lab', count: 1, avgPercent: 66, grade: 'B' }
    ],
    exams: [
      { title: 'Golden Concord Summative Exam (Set C)', subject: 'Mathematics', marksObtained: 24, totalMarks: 50, percentage: 48, grade: 'D', scheduledDate: '2026-11-06' },
      { title: 'Term 1 Science & Energy Summative', subject: 'Experiential Sciences', marksObtained: 32, totalMarks: 50, percentage: 64, grade: 'B', scheduledDate: '2026-10-28' }
    ],
    generatedAt: '2026-11-14T00:00:00.000Z'
  }
};

export function ReportCardHub() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [studentId, setStudentId] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiGet<any>('/api/reportcard/students')
      .then(d => {
        const list = d?.success ? (d.students ?? []) : [];
        if (list.length > 0) {
          setStudents(list);
          setStudentId(list[0].id);
          setIsFallbackMode(false);
        } else {
          setStudents(FALLBACK_STUDENTS);
          setStudentId(FALLBACK_STUDENTS[0].id);
          setIsFallbackMode(true);
        }
      })
      .catch(() => {
        setStudents(FALLBACK_STUDENTS);
        setStudentId(FALLBACK_STUDENTS[0].id);
        setIsFallbackMode(true);
      });
  }, []);

  useEffect(() => {
    if (!studentId) { setReport(null); return; }
    if (FALLBACK_REPORTS[studentId]) {
      setReport(FALLBACK_REPORTS[studentId]);
      setLoading(false);
      return;
    }
    setLoading(true);
    apiGet<any>(`/api/reportcard/${studentId}`)
      .then(d => {
        if (d?.success) {
          setReport(d as Report);
        } else if (FALLBACK_REPORTS[studentId]) {
          setReport(FALLBACK_REPORTS[studentId]);
        }
      })
      .catch(() => {
        if (FALLBACK_REPORTS[studentId]) setReport(FALLBACK_REPORTS[studentId]);
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  const handlePrint = () => window.print();

  const student = students.find(s => s.id === studentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-xl">📋</div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">Student Report Card</h1>
              {isFallbackMode && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Preview Mode (Seeded Cohort)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">Full-term academic performance report with mastery tiers &amp; PDF export</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              window.history.pushState(null, '', '/staff/student-intelligence');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition-colors"
          >
            Open 360° Holistic Progress Card →
          </button>
          <button
            onClick={() => {
              window.history.pushState(null, '', '/staff/learning-gaps');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-colors"
          >
            AI Learning Gaps →
          </button>
          {report && (
            <button onClick={handlePrint}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
              Print / Export PDF
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select Student</div>
        <div className="flex flex-wrap gap-3 items-center">
          <select value={studentId} onChange={e => setStudentId(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none min-w-[260px]">
            <option value="">Choose a student…</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.class}/{s.section} (Roll {s.roll})</option>)}
          </select>
          {studentId && <span className="text-xs text-indigo-600 font-semibold">Report auto-generates on selection</span>}
        </div>
      </div>

      {!studentId ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl mx-auto mb-4">📋</div>
          <h3 className="font-bold text-slate-700 mb-1">No student selected</h3>
          <p className="text-slate-400 text-sm">Select a student above to generate their full academic report card with PDF export</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Generating report…</div>
      ) : report ? (
        <div id="report-card-print" ref={printRef} className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white print:rounded-none print:break-inside-avoid">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-extrabold">{report.student.name}</h2>
                <p className="text-indigo-200 text-sm mt-0.5">
                  {report.student.class && `Class ${report.student.class}`}
                  {report.student.section && ` – Section ${report.student.section}`}
                  {report.student.roll && ` · Roll ${report.student.roll}`}
                </p>
                {report.student.batch && <p className="text-indigo-200 text-xs mt-0.5">{report.student.batch}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs text-indigo-200">Report Generated</p>
                <p className="text-sm font-bold">{new Date(report.generatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print:break-inside-avoid">
            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Attendance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Present', value: report.attendance.present, color: 'text-emerald-700' },
                { label: 'Absent', value: report.attendance.absent, color: 'text-rose-600' },
                { label: 'Leave', value: report.attendance.leave, color: 'text-amber-600' },
                { label: 'Total Days', value: report.attendance.total, color: 'text-slate-700' },
              ].map(item => (
                <div key={item.label} className="text-center bg-slate-50 rounded-xl py-3">
                  <div className={`text-2xl font-black ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
            {report.attendance.percentage !== null && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span className="font-semibold">Attendance Rate</span>
                  <span className={`font-bold ${report.attendance.percentage >= 75 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {report.attendance.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${report.attendance.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${report.attendance.percentage}%` }} />
                </div>
                {report.attendance.percentage < 75 && (
                  <p className="text-xs text-rose-600 mt-1 font-semibold">Below 75% — attendance improvement required</p>
                )}
              </div>
            )}
          </div>

          {/* Homework per subject */}
          {report.homework.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print:break-inside-avoid">
              <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Homework Performance</h3>
              <div className="space-y-3">
                {report.homework.map(row => (
                  <div key={row.subject} className="flex items-center gap-4">
                    <div className="w-36 text-xs font-semibold text-slate-700 truncate shrink-0">{row.subject}</div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${row.avgPercent ?? 0}%` }} />
                    </div>
                    <div className="text-xs font-bold text-slate-700 w-12 text-right shrink-0">{row.avgPercent ?? '—'}%</div>
                    <div className="text-xs text-slate-400 w-20 text-right shrink-0 whitespace-nowrap">{row.submissions} tasks</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam results per subject */}
          {report.examBySubject.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print:break-inside-avoid">
              <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Exam Performance by Subject</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left pb-2 font-bold text-slate-500">Subject</th>
                      <th className="text-center pb-2 font-bold text-slate-500">Exams</th>
                      <th className="text-center pb-2 font-bold text-slate-500">Avg %</th>
                      <th className="text-center pb-2 font-bold text-slate-500">Grade</th>
                      <th className="text-center pb-2 font-bold text-slate-500">Mastery Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.examBySubject.map(row => {
                      const tier = classifyMasteryTier(row.avgPercent);
                      return (
                        <tr key={row.subject} className="border-b border-slate-100 last:border-0">
                          <td className="py-2 font-semibold text-slate-800">{row.subject}</td>
                          <td className="py-2 text-center text-slate-500">{row.count}</td>
                          <td className="py-2 text-center font-bold text-slate-700">{row.avgPercent}%</td>
                          <td className="py-2 text-center">
                            <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${gradeColor(row.grade ?? 'D')}`}>{row.grade}</span>
                          </td>
                          <td className="py-2 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${tier.badge}`}>{tier.label}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Individual exam list */}
          {report.exams.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print:break-inside-avoid">
              <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">All Exam Results</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left pb-2 font-bold text-slate-500">Exam</th>
                      <th className="text-left pb-2 font-bold text-slate-500">Subject</th>
                      <th className="text-center pb-2 font-bold text-slate-500">Marks</th>
                      <th className="text-center pb-2 font-bold text-slate-500">%</th>
                      <th className="text-center pb-2 font-bold text-slate-500">Grade</th>
                      <th className="text-center pb-2 font-bold text-slate-500">Mastery Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.exams.map((e, i) => {
                      const tier = classifyMasteryTier(e.percentage);
                      return (
                        <tr key={i} className="border-b border-slate-100 last:border-0">
                          <td className="py-2 font-semibold text-slate-800">{e.title}</td>
                          <td className="py-2 text-slate-500">{e.subject}</td>
                          <td className="py-2 text-center font-bold text-slate-700">{e.marksObtained}/{e.totalMarks}</td>
                          <td className="py-2 text-center text-slate-600">{e.percentage}%</td>
                          <td className="py-2 text-center">
                            <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${gradeColor(e.grade)}`}>{e.grade}</span>
                          </td>
                          <td className="py-2 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${tier.badge}`}>{tier.label}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
