import React from 'react';
import {
  ClipboardList,
  FileText,
  BarChart2,
  Printer,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Layers,
  Award,
  ChevronRight,
  BarChart3,
  BookOpen
} from 'lucide-react';

interface AssessmentHubProps {
  onNavigate: (route: string) => void;
}

export const AssessmentHub: React.FC<AssessmentHubProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pb-16">
      {/* ── EXCLUSIVE HERO HEADER ── */}
      <div
        className="relative overflow-hidden rounded-3xl px-6 py-7 border border-slate-200/80 shadow-xs"
        style={{
          background: 'linear-gradient(135deg, #fbfbfe 0%, #f5f3ff 45%, #ede9fe 100%)'
        }}
      >
        <div
          className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
        />

        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-md text-white shrink-0">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-700 bg-violet-100/80 px-2.5 py-0.5 rounded-full border border-violet-200">
                  Institutional Evaluation Hub
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Term 2 Active
                </span>
              </div>
              <h1
                className="text-2xl font-black text-slate-900 leading-tight"
                style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', letterSpacing: '-0.02em' }}
              >
                Assessment Command Center
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                End-to-end examination lifecycle: curriculum outcome tagging, parallel Sets A/B/C blueprinting, QR booklet batch printing, optical handwriting OCR grading &amp; multi-board report cards.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <span className="px-3 py-1.5 rounded-xl bg-white/90 text-violet-800 border border-violet-200 shadow-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
              CBSE Competency Ready
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/90 text-indigo-800 border border-indigo-200 shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Optical OCR Grader Live
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI OPERATIONAL METRICS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Exams</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">14 Cycles</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">8 In Progress Today</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parallel Sets</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">42 Booklets</p>
            <p className="text-[10px] text-indigo-600 font-bold mt-0.5">Sets A / B / C Balanced</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scripts Evaluated</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">1,280 / 1,450</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">88.3% Optical OCR</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Attainment</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">78.4%</p>
            <p className="text-[10px] text-purple-600 font-bold mt-0.5">Bloom L3–L5 Proficient</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── FOUR PRIMARY MODULE LAUNCHPADS ── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Examination &amp; Evaluation Modules
            </h2>
            <p className="text-xs text-slate-500">Direct operational gateways to all assessment workflows</p>
          </div>
          <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-200/60">
            4 Dedicated Workspaces
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Exam Builder Studio */}
          <div
            onClick={() => onNavigate('/staff/exam-builder')}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-violet-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 border border-violet-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] bg-violet-100 text-violet-800 font-extrabold px-2.5 py-0.5 rounded-full border border-violet-200">
                  Sets A / B / C Engine
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-violet-700 transition-colors">
                Exam Builder Studio
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Blueprint papers in minutes tagged to Learning Outcomes &amp; Bloom&apos;s taxonomy levels. Automatically generate parallel paper sets (A, B, C) with difficulty-balanced question banks.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">Curriculum &amp; Blueprints</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 group-hover:translate-x-1 transition-transform">
                Launch Exam Builder <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Summative Exams & Booklet Printing */}
          <div
            onClick={() => onNavigate('/staff/exams')}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Printer className="w-6 h-6" />
                </div>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200">
                  QR Booklets &amp; Schedule
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                Summative Exams &amp; Batch Print
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Organize full examination cycles, class rosters, and seating charts. Compile and batch-print personalized, QR-anchored answer booklets for multi-campus standardized examinations.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">Timetable &amp; Booklets</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform">
                Open Summative Exams <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: AI Exam Grader & Score Insights */}
          <div
            onClick={() => onNavigate('/staff/insights')}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Optical OCR &amp; Rubrics
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                AI Exam Grader &amp; Score Insights
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Optical handwriting OCR and AI rubric grading for scanned papers. Reduces correction time by 90% with instant teacher overrides and outcome-level mastery distribution analytics.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">AI OCR &amp; Attainment</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                Open AI Optical Grader <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 4: Report Card Studio */}
          <div
            onClick={() => onNavigate('/staff/reportcard')}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-2.5 py-0.5 rounded-full border border-purple-200">
                  CBSE &amp; Term Cards
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                Report Card Studio
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Synthesize final grades, scholastic marks, and co-scholastic descriptors. Generate printable CBSE grade cards and digital report cards with immediate parent portal synchronization.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">Term &amp; Annual Reports</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 group-hover:translate-x-1 transition-transform">
                Generate Report Cards <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTIVE EXAM CYCLES OVERVIEW ── */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Active Assessment Cycle: Mid-Term Examination 2026-27
            </h3>
            <p className="text-xs text-slate-500">Live multi-campus grading and verification status</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/staff/insights')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 text-xs font-bold hover:bg-violet-100 transition-colors"
          >
            <span>Live Grading Runs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 font-bold">Grade &amp; Subject</th>
                <th className="py-2.5 font-bold">Paper Sets</th>
                <th className="py-2.5 font-bold">Total Scholars</th>
                <th className="py-2.5 font-bold">Grading Status</th>
                <th className="py-2.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-bold text-slate-800">Grade 5 · Science (Photosynthesis &amp; Plants)</td>
                <td className="py-3 font-semibold text-slate-600">Sets A / B / C</td>
                <td className="py-3 font-semibold text-slate-600">48 Students</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Graded (96%)
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onNavigate('/staff/insights')}
                    className="text-xs font-bold text-violet-700 hover:text-violet-900"
                  >
                    View Scores →
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-800">Grade 7 · Mathematics (Algebra &amp; Geometry)</td>
                <td className="py-3 font-semibold text-slate-600">Sets A / B / C</td>
                <td className="py-3 font-semibold text-slate-600">52 Students</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-600" /> Optical OCR in Progress (74%)
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onNavigate('/staff/insights')}
                    className="text-xs font-bold text-violet-700 hover:text-violet-900"
                  >
                    Resume OCR →
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-800">Grade 10 · English Literature (Prose &amp; Poetry)</td>
                <td className="py-3 font-semibold text-slate-600">Sets A / B / C</td>
                <td className="py-3 font-semibold text-slate-600">45 Students</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200">
                    <FileText className="w-3 h-3 text-violet-600" /> Booklets Printed &amp; Scheduled
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onNavigate('/staff/exams')}
                    className="text-xs font-bold text-violet-700 hover:text-violet-900"
                  >
                    Manage Exam →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
