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

export function ReportCardHub() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [studentId, setStudentId] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiGet<any>('/api/reportcard/students').then(d => {
      if (d.success) setStudents(d.students ?? []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!studentId) { setReport(null); return; }
    setLoading(true);
    apiGet<any>(`/api/reportcard/${studentId}`).then(d => {
      if (d.success) setReport(d as Report);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [studentId]);

  const handlePrint = () => window.print();

  const student = students.find(s => s.id === studentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Report Card</h1>
          <p className="text-sm text-slate-500 mt-0.5">Full-term academic performance report with PDF export</p>
        </div>
        {report && (
          <button onClick={handlePrint}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
            Print / Export PDF
          </button>
        )}
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 mb-1 block">Select Student</label>
        <select value={studentId} onChange={e => setStudentId(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none max-w-xs">
          <option value="">Choose a student…</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.class}/{s.section} (Roll {s.roll})</option>)}
        </select>
      </div>

      {!studentId ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-slate-500 text-sm">Select a student to generate their comprehensive report card</p>
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
                    <div className="w-28 text-xs font-semibold text-slate-700 truncate shrink-0">{row.subject}</div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${row.avgPercent ?? 0}%` }} />
                    </div>
                    <div className="text-xs font-bold text-slate-700 w-10 text-right">{row.avgPercent ?? '—'}%</div>
                    <div className="text-xs text-slate-400 w-16 text-right shrink-0">{row.submissions} tasks</div>
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
                    </tr>
                  </thead>
                  <tbody>
                    {report.examBySubject.map(row => (
                      <tr key={row.subject} className="border-b border-slate-100 last:border-0">
                        <td className="py-2 font-semibold text-slate-800">{row.subject}</td>
                        <td className="py-2 text-center text-slate-500">{row.count}</td>
                        <td className="py-2 text-center font-bold text-slate-700">{row.avgPercent}%</td>
                        <td className="py-2 text-center">
                          <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${gradeColor(row.grade ?? 'D')}`}>{row.grade}</span>
                        </td>
                      </tr>
                    ))}
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
                    </tr>
                  </thead>
                  <tbody>
                    {report.exams.map((e, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0">
                        <td className="py-2 font-semibold text-slate-800">{e.title}</td>
                        <td className="py-2 text-slate-500">{e.subject}</td>
                        <td className="py-2 text-center font-bold text-slate-700">{e.marksObtained}/{e.totalMarks}</td>
                        <td className="py-2 text-center text-slate-600">{e.percentage}%</td>
                        <td className="py-2 text-center">
                          <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${gradeColor(e.grade)}`}>{e.grade}</span>
                        </td>
                      </tr>
                    ))}
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
