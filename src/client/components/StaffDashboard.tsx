import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileCheck,
  CheckCircle2,
  Users,
  Calendar,
  PlusCircle,
  Eye,
  Check,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Heart,
  Target,
  BrainCircuit,
  Mic,
  Compass,
  FileText,
  ScanLine,
  ShieldCheck,
  Database,
  Layers
} from 'lucide-react';
import { Book, Homework, Quiz, Student } from '../types';
import { apiFetch } from '../lib/api';
import { QrSessionPanel } from './QrSessionPanel';

const DEFAULT_HOMEWORKS: Homework[] = [
  {
    id: 'hw-demo-1',
    title: 'Solar Rainwater Catchment Blueprint & Ratio Audit',
    description: 'Calculate catchment collection volume ratios and present annotated diagrams using equivalent fractions.',
    dueDate: '2026-11-18',
    maxMarks: 20,
    class: { id: 'cls-5', name: 'Grade 5' },
    section: { id: 'sec-a', name: 'Innovation Studio A' },
    subject: { id: 'sub-math', name: 'Mathematics & Ecological Stem' },
    teacher: { id: 'tch-1', fullName: 'Dr. Meenakshi S.' },
    _count: { submissions: 18 }
  },
  {
    id: 'hw-demo-2',
    title: 'The Great Banyan of Villianur · Oratory Reflection',
    description: 'Prepare a 90-second persuasive narration explaining ecosystem interdependence with 5 domain vocabulary words.',
    dueDate: '2026-11-19',
    maxMarks: 15,
    class: { id: 'cls-5', name: 'Grade 5' },
    section: { id: 'sec-a', name: 'Innovation Studio A' },
    subject: { id: 'sub-eng', name: 'English & Oratory Arts' },
    teacher: { id: 'tch-2', fullName: 'Anitha Krishnan' },
    _count: { submissions: 24 }
  }
];

const DEFAULT_QUIZZES: Quiz[] = [
  {
    id: 'quiz-demo-1',
    title: 'Equivalent Fractions to Percentages Diagnostic Check',
    quizType: 'DIAGNOSTIC',
    timeLimitMinutes: 15,
    class: { id: 'cls-5', name: 'Grade 5' },
    subject: { id: 'sub-math', name: 'Mathematics' },
    _count: { questions: 8, submissions: 28 }
  },
  {
    id: 'quiz-demo-2',
    title: 'Photosynthesis & Cellular Energy Checkpoint',
    quizType: 'FORMATIVE',
    timeLimitMinutes: 12,
    class: { id: 'cls-5', name: 'Grade 5' },
    subject: { id: 'sub-sci', name: 'Science' },
    _count: { questions: 6, submissions: 29 }
  }
];

export const StaffDashboard: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>(DEFAULT_HOMEWORKS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(DEFAULT_QUIZZES);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const navigateToRoute = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.history.pushState(null, '', route);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // Modals & States
  const [activeModal, setActiveModal] = useState<'bookReader' | 'rollCall' | 'createHomework' | 'studentDirectory' | 'qrLogin' | null>(null);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [selectedStudentStatus, setSelectedStudentStatus] = useState<'PRESENT' | 'ABSENT' | 'LATE'>('PRESENT');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [bRes, hRes, qRes, sRes] = await Promise.all([
        apiFetch('/api/academic/books'),
        apiFetch('/api/assessment/homework'),
        apiFetch('/api/assessment/quizzes'),
        apiFetch('/api/operations/students')
      ]);

      if (bRes.ok) {
        const list = (await bRes.json()).books || [];
        if (list.length > 0) setBooks(list);
      }
      if (hRes.ok) {
        const list = (await hRes.json()).homeworks || [];
        if (list.length > 0) setHomeworks(list);
      }
      if (qRes.ok) {
        const list = (await qRes.json()).quizzes || [];
        if (list.length > 0) setQuizzes(list);
      }
      if (sRes.ok) {
        const list = (await sRes.json()).students || [];
        if (list.length > 0) setStudents(list);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRollCallSubmit = async () => {
    try {
      if (students.length > 0) {
        await apiFetch('/api/operations/attendance/rollcall', {
          method: 'POST',
          body: JSON.stringify({
            date: new Date().toISOString(),
            classId: students[0].enrollments[0]?.class?.id || 'demo-class',
            sectionId: students[0].enrollments[0]?.section?.id || 'demo-sec',
            records: [
              {
                studentId: students[0].id,
                status: selectedStudentStatus,
                remarks: 'Verified during morning classroom roll call'
              }
            ]
          })
        });
        setAttendanceSubmitted(true);
        setTimeout(() => {
          setActiveModal(null);
          setAttendanceSubmitted(false);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Luminous Light Hero Noticeboard Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-50/90 via-sky-50/80 to-indigo-50/90 border border-teal-200/70 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-teal-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Achariya Central Campus Conclave</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Achariya Science, AI & Robotics Conclave 2026
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Grade 5 scholars are demonstrating automated solar rainwater harvesting and ecological robotics models in the central amphitheatre this Friday.
          </p>
          <div className="mt-4 flex items-center space-x-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center space-x-1.5 text-teal-800 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Campus Noticeboard</span>
            </span>
            <span>•</span>
            <span>Audience: Faculty, Scholars & Parents</span>
          </div>
        </div>
      </div>

      {/* 1B. Flagship AI Academic & Student Intelligence Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          onClick={() => navigateToRoute('/staff/learning-gaps')}
          className="cursor-pointer group rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-violet-50 via-white to-purple-50/70 border border-violet-200/80 shadow-xs hover:shadow-md hover:border-violet-300 transition-all flex flex-col justify-between gap-4"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                    AI-FIRST Flagship Module
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    AI Learning Gap, Remediation &amp; 100% Mastery Studio
                  </h2>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Traces exam errors across grades via the prerequisite DAG, auto-clusters students into shared-cause AI Remedial Circles, generates 1-page QR bridge worksheets, and enforces Dual-Threshold (80% / 85%) + Gold 100% Mastery with Zero-Code AI Concept Graph Builder.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Cross-Grade DAG', 'AI Remedial Circles', 'Dual-Threshold + Gold 100%', 'Zero-Code Concept Builder'].map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-violet-200 text-violet-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-violet-100">
            <span className="text-[11px] font-semibold text-violet-700">Pre-Primary to Grade 12 · Adaptive Cycle</span>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                navigateToRoute('/staff/learning-gaps');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 group-hover:bg-violet-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span>Open Learning Gap Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          onClick={() => navigateToRoute('/staff/student-intelligence')}
          className="cursor-pointer group rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-indigo-50 via-white to-sky-50/70 border border-indigo-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between gap-4"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-sm shrink-0">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    Whole-Child 360° Ecosystem
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    360° Student Intelligence, BMIT, VAK, E-Portfolio &amp; Career AI
                  </h2>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Longitudinal 24-section Student Master Profile uniting official BMIT 8-domain brain mapping (enrichment guide only), multimodal VAK prescriptions, 20 development dimensions, 16 future-ready skills, 23-section E-Portfolio, Parent AI Companion &amp; Career AI.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['24-Section 360° Profile', '8-Domain BMIT', 'VAK Multimodal', '23-Section E-Portfolio', '16 Career Pathways'].map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
            <span className="text-[11px] font-semibold text-indigo-700">14 Exportable Reports · Counsellor &amp; Parent Portal</span>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                navigateToRoute('/staff/student-intelligence');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span>Open 360° BMIT &amp; Career Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 1C. Achariya AI ONE · 4 Connected Pillars & One Connected Data Layer */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
              Achariya AI ONE Architecture · Grades KG–12
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
              Four Integrated Academic Pillars · All Campuses Standardised
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">90% Less Correction Time</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">Same-Day Remedial Planning</span>
          </div>
        </div>

        {/* Top Row: Pillar 01 & Pillar 02 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quadrant 01: AI-Powered Assessment & Evaluation */}
          <div className="rounded-2xl border-2 border-blue-900/15 bg-blue-50/30 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-sky-300">01</span>
                    <h3 className="text-sm font-extrabold">AI-Powered Assessment &amp; Evaluation</h3>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-0.5">
                    Grades 1–12 · CBSE Competency Ready
                  </p>
                </div>
                <FileText className="w-5 h-5 text-sky-300 shrink-0" />
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                    <span><strong>Exam Builder:</strong> Blueprint-based papers in minutes tagged to Learning Outcomes &amp; Bloom&apos;s levels with <strong>Parallel Sets (Set A, B, C)</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                    <span><strong>Exam Grader:</strong> Grade scanned answer scripts consistently without bias and with AI reasoning.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                    <span><strong>Instant Insights &amp; Publish Reports:</strong> Question, outcome, class &amp; student mastery (<strong>Beginner, Progressing, Proficient</strong>) shared with parents for same-day remediation.</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white border-l-4 border-blue-900 rounded-r-xl text-[11px] font-semibold text-slate-800">
                  <span className="block text-[9px] font-black uppercase tracking-wider text-blue-900 mb-0.5">Benefit for Achariya</span>
                  90% less teacher correction time, giving hours back to experiential teaching with one standardised benchmark across all campuses.
                </div>
              </div>
            </div>
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              <button
                onClick={() => navigateToRoute('/staff/exams')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1"
              >
                <span>Open Exam Builder (Sets A/B/C)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => navigateToRoute('/staff/aitools')}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-[11px] font-bold"
              >
                Grader &amp; Parent Reports
              </button>
            </div>
          </div>

          {/* Quadrant 02: AI English Language Lab */}
          <div className="rounded-2xl border-2 border-sky-600/20 bg-sky-50/30 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="bg-sky-700 text-white px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-sky-200">02</span>
                    <h3 className="text-sm font-extrabold">AI English Language Lab</h3>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sky-100 mt-0.5">
                    Listening · Speaking · Reading · Vocabulary | Grades 1–12
                  </p>
                </div>
                <Mic className="w-5 h-5 text-sky-200 shrink-0" />
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                    <span><strong>125+ Levelled Skill Checks:</strong> Adaptive Listening, Speaking, Reading fluency &amp; Vocabulary across grades.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                    <span><strong>AI Voice Scoring on Achariya Cloud (India):</strong> Scores reading aloud &amp; early-spots students needing L/S/R support.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                    <span><strong>Before-and-After Voice Evidence &amp; Digital Lab:</strong> Compare start-of-year vs. current recordings alongside <strong>Dubbing, Storybooks &amp; Conversations</strong>.</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white border-l-4 border-sky-700 rounded-r-xl text-[11px] font-semibold text-slate-800">
                  <span className="block text-[9px] font-black uppercase tracking-wider text-sky-800 mb-0.5">Benefit for Achariya</span>
                  Confident communicators with year-long competency evidence and tangible voice progress parents can hear at admissions &amp; PTMs.
                </div>
              </div>
            </div>
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              <button
                onClick={() => navigateToRoute('/student/voicelab')}
                className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1"
              >
                <span>Launch VoiceLab &amp; Before/After Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => navigateToRoute('/staff/aitools')}
                className="px-3 py-1.5 bg-white border border-sky-200 hover:bg-sky-50 text-sky-900 rounded-xl text-[11px] font-bold"
              >
                Cohort LSR Spotter
              </button>
            </div>
          </div>
        </div>

        {/* Center Horizontal Spine: ONE CONNECTED DATA LAYER */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border-y-2 border-amber-400 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black tracking-widest uppercase text-slate-900 text-[11px]">
                ONE CONNECTED DATA LAYER
              </span>
              <span className="text-slate-600 font-medium text-xs ml-2">
                — Every assessment, voice sample, BMIT observation and PAL activity builds one unified profile per child.
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-extrabold">
            <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white">10,480 Unified Profiles</span>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">40,000+ HPC Cards Scale</span>
            <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">India-Hosted Privacy</span>
          </div>
        </div>

        {/* Bottom Row: Pillar 03 & Pillar 04 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quadrant 03: Holistic Progress Card */}
          <div className="rounded-2xl border-2 border-pink-600/20 bg-pink-50/30 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="bg-pink-700 text-white px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-pink-200">03</span>
                    <h3 className="text-sm font-extrabold">Holistic Progress Card (HPC)</h3>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-pink-100 mt-0.5">
                    Grades KG–12 · NEP 2020 &amp; PARAKH Aligned
                  </p>
                </div>
                <Compass className="w-5 h-5 text-pink-200 shrink-0" />
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-pink-700 shrink-0 mt-0.5" />
                    <span><strong>Beyond Marks:</strong> Authentic growth journey aligned with <strong>NEP 2020 and PARAKH</strong> 360° frameworks.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-pink-700 shrink-0 mt-0.5" />
                    <span><strong>Competency-Level Reports:</strong> Personalised multi-domain feedback &amp; actionable next steps.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-pink-700 shrink-0 mt-0.5" />
                    <span><strong>Proven at Scale:</strong> Built for <strong>40,000+ progress cards</strong> across campuses.</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white border-l-4 border-pink-700 rounded-r-xl text-[11px] font-semibold text-slate-800">
                  <span className="block text-[9px] font-black uppercase tracking-wider text-pink-800 mb-0.5">Benefit for Achariya</span>
                  The whole child made visible: BMIT Brain Mapping, Achariya Experiential Labs, and the 5 Arts beside academics.
                </div>
              </div>
            </div>
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              <button
                onClick={() => navigateToRoute('/staff/aitools')}
                className="px-3 py-1.5 bg-pink-700 hover:bg-pink-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1"
              >
                <span>Open HPC &amp; 5 Arts Card</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => navigateToRoute('/staff/student-intelligence')}
                className="px-3 py-1.5 bg-white border border-pink-200 hover:bg-pink-50 text-pink-900 rounded-xl text-[11px] font-bold"
              >
                BMIT &amp; Experiential Profile
              </button>
            </div>
          </div>

          {/* Quadrant 04: Personalised Learning & Student Insights */}
          <div className="rounded-2xl border-2 border-amber-500/25 bg-amber-50/35 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="bg-amber-500 text-slate-950 px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-amber-950">04</span>
                    <h3 className="text-sm font-extrabold">Personalised Learning &amp; Insights</h3>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-950/80 mt-0.5">
                    Grades KG–12 · Adaptive PAL &amp; Student Portfolio
                  </p>
                </div>
                <Layers className="w-5 h-5 text-amber-950 shrink-0" />
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong>Personalised Adaptive Learning (PAL):</strong> Level-matched activities, summative growth tracking &amp; digital student portfolio.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong>Autograding Written Work:</strong> Instant correction &amp; diagnostic feedback for written responses.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong>Weekly Snapshot of the Child:</strong> Continuous term-to-term record with weekly home-support recommendations for parents.</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white border-l-4 border-amber-500 rounded-r-xl text-[11px] font-semibold text-slate-800">
                  <span className="block text-[9px] font-black uppercase tracking-wider text-amber-800 mb-0.5">Benefit for Achariya</span>
                  Every child learns at the right level reflecting Achariya&apos;s belief in individual intelligence; teachers &amp; parents get recommendations, not just data.
                </div>
              </div>
            </div>
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              <button
                onClick={() => navigateToRoute('/staff/aitools')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1"
              >
                <span>Open PAL &amp; Weekly Snapshot</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => navigateToRoute('/staff/learning-gaps')}
                className="px-3 py-1.5 bg-white border border-amber-200 hover:bg-amber-50 text-amber-900 rounded-xl text-[11px] font-bold"
              >
                Adaptive Remediation Loops
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Daily Operations Quick Action Ribbon - Clean Light Aesthetic */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setActiveModal('bookReader')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-teal-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Digital Textbooks</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Dual-page vector reader</div>
        </button>

        <button
          onClick={() => setActiveModal('rollCall')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-sky-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Daily Attendance</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Record Grade 5A roll call</div>
        </button>

        <button
          onClick={() => setActiveModal('studentDirectory')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-indigo-100">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Scholar Directory</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Health card & anthropometrics</div>
        </button>

        <button
          onClick={() => setActiveModal('createHomework')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-amber-100">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Assign Homework</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Publish experiential tasks</div>
        </button>

        <button
          onClick={() => setActiveModal('qrLogin')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-400 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-teal-100 text-lg">
            📱
          </div>
          <div className="text-xs font-bold text-slate-900">QR Class Login</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Students scan to sign in</div>
        </button>
      </div>

      {/* 3. Academic Content & Formative Assessments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Homework Tasks */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Active Homework Tasks</h2>
              <p className="text-xs text-slate-500">Grade 5 · Innovation Studio A</p>
            </div>
            <span className="text-xs bg-teal-50 text-teal-800 font-bold px-2.5 py-1 rounded-full border border-teal-200/60">
              {homeworks.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {homeworks.map(hw => (
              <div key={hw.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{hw.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{hw.description}</p>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-lg shrink-0 ml-2">
                    {hw.maxMarks} Marks
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/50">
                  <span>Subject: {hw.subject?.name || 'English & Oratory Arts'}</span>
                  <span className="text-teal-700 font-semibold">1 Submission Evaluated</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Quizzes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Formative Quizzes</h2>
              <p className="text-xs text-slate-500">Auto-graded pedagogical check-ins</p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-800 font-bold px-2.5 py-1 rounded-full border border-indigo-200/60">
              {quizzes.length} Published
            </span>
          </div>

          <div className="space-y-3">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{quiz.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Type: {quiz.quizType} · Time Limit: {quiz.timeLimitMinutes} mins
                    </p>
                  </div>
                  <span className="text-[11px] bg-teal-50 text-teal-800 border border-teal-200/80 font-bold px-2.5 py-0.5 rounded-lg flex items-center space-x-1 shrink-0 ml-2">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    <span>Auto-Graded</span>
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/50">
                  <span>Questions: {quiz._count?.questions || 1}</span>
                  <span className="font-semibold text-teal-700">Class Average: 100%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: DUAL-PAGE FLIPBOOK VIEWER                                        */}
      {/* ========================================================================= */}
      {activeModal === 'bookReader' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Achariya Global Lingua: Grade 5 Integrated English & Oratory Arts
                </h3>
                <p className="text-xs text-slate-500">Chapter 1: The Great Banyan of Villianur · Interactive Vector Reader</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕ Close
              </button>
            </div>

            {/* Two-Page Spread with Light Clean Aesthetic */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-slate-800">
              <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-3">
                <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Page 1 · Natural Canopy</div>
                <h4 className="font-bold text-slate-900 text-sm">The Whispering Roots of Villianur</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Centuries ago, beneath the tropical azure sky of Puducherry, a single seed took root. Its branches expanded horizontally, sending forth aerial roots that anchored themselves into the fertile red soil.
                </p>
                <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-lg text-[11px] text-teal-900">
                  <strong>Vocabulary Focus:</strong> Aerial Prop Roots · Canopy Microclimate · Symbiosis
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-3">
                <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Page 2 · Ecological Balance</div>
                <h4 className="font-bold text-slate-900 text-sm">Biodiversity Under One Roof</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Today, this single living entity shelters over eighty species of birds, countless nocturnal pollinators, and provides cooling shade to the village assembly.
                </p>
                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-[11px] text-indigo-900">
                  <strong>Reflective Question:</strong> How does the banyan tree exemplify collaborative community resilience?
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>Achariya Central Curriculum Repository · Authorized Digital Vector Edition</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DAILY ATTENDANCE ROLL CALL                                       */}
      {/* ========================================================================= */}
      {activeModal === 'rollCall' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Morning Classroom Roll Call</h3>
                <p className="text-xs text-slate-500">Grade 5 · Innovation Studio A</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕
              </button>
            </div>

            {attendanceSubmitted ? (
              <div className="p-6 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
                <h4 className="font-bold text-teal-900 text-sm">Attendance Synchronized</h4>
                <p className="text-xs text-teal-700">Roll call records successfully submitted to Achariya ERP.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Aarav Sundaram</span>
                    <p className="text-[11px] text-slate-500 font-mono">Roll: ACH-05A-01 · ID: ACH/2026/5001</p>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {(['PRESENT', 'ABSENT', 'LATE'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => setSelectedStudentStatus(st)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                          selectedStudentStatus === st
                            ? st === 'PRESENT'
                              ? 'bg-teal-600 text-white shadow-xs'
                              : st === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-amber-500 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleRollCallSubmit}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                >
                  Confirm & Submit Roll Call
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SCHOLAR DIRECTORY & HEALTH CARD                                  */}
      {/* ========================================================================= */}
      {activeModal === 'studentDirectory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Scholar Profile & CBSE Health Card</h3>
                <p className="text-xs text-slate-500">Anthropometric measurements and guardian contact</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-base shadow-xs">
                  A
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Aarav Sundaram</h4>
                  <p className="text-xs text-slate-500">Grade 5 · Innovation Studio A · Roll #ACH-05A-01</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">HEIGHT</span>
                  <span className="font-bold text-slate-800">142.5 cm</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">WEIGHT</span>
                  <span className="font-bold text-slate-800">35.8 kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">BLOOD GROUP</span>
                  <span className="font-bold text-teal-700">O+ Positive</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">BMI INDEX</span>
                  <span className="font-bold text-slate-800">17.6 (Normal)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">GUARDIAN CONTACT</span>
                <p className="font-bold text-slate-800">Sundaram R. (Father) · +91 98402 99881</p>
                <p className="text-[11px] text-slate-500">parent@achariya.in</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    navigateToRoute('/staff/student-intelligence');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>View 360° BMIT, VAK &amp; E-Portfolio</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    navigateToRoute('/staff/learning-gaps');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 rounded-xl text-xs font-bold transition-colors"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Inspect Learning Gaps</span>
                </button>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ASSIGN HOMEWORK TASK                                             */}
      {/* ========================================================================= */}
      {activeModal === 'createHomework' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Publish New Experiential Task</h3>
                <p className="text-xs text-slate-500">Assign to Grade 5A</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Title:</label>
                <input
                  type="text"
                  defaultValue="Hands-on Protractor: Angle Measurement in Nature"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructions:</label>
                <textarea
                  rows={3}
                  defaultValue="Identify three angles in your home or garden (acute, right, obtuse). Measure using protractor and sketch."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Marks:</label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date:</label>
                  <input
                    type="date"
                    defaultValue="2026-11-12"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Task published successfully to Grade 5A student stream!');
                  setActiveModal(null);
                }}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Publish to Scholars
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Classroom Login Modal */}
      {activeModal === 'qrLogin' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <QrSessionPanel onClose={() => setActiveModal(null)} />
        </div>
      )}

      {/* In-app Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
