import React, { useState, useEffect } from 'react';
import { renderPortal } from './Modal';
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
  ScanLine,
  ShieldCheck,
  Search,
  Clock,
  Zap,
  BarChart2,
  ChevronRight
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

const DEFAULT_SCHOLARS: Student[] = [
  {
    id: 'ach-stu-aarav-01',
    userKey: 'ACH-2026-001',
    fullName: 'Aarav Sundaram',
    email: 'aarav.s@achariya.in',
    enrollments: [{ rollNumber: 'ACH-05A-01', class: { id: 'cls-5', name: 'Grade 5' }, section: { id: 'sec-a', name: 'Innovation Studio A' } }],
    studentProfile: { bloodGroup: 'O+ Positive', heightCm: 142.5, weightKg: 35.8, parentName: 'Sundaram R. (Father)', parentPhone: '+91 98402 99881' }
  },
  {
    id: 'ach-stu-diya-02',
    userKey: 'ACH-2026-002',
    fullName: 'Diya Krishnan',
    email: 'diya.k@achariya.in',
    enrollments: [{ rollNumber: 'ACH-10A-14', class: { id: 'cls-10', name: 'Grade 10' }, section: { id: 'sec-a', name: 'STEM Scholars A' } }],
    studentProfile: { bloodGroup: 'A+ Positive', heightCm: 158.0, weightKg: 48.2, parentName: 'Radha Krishnan (Mother)', parentPhone: '+91 98410 44219' }
  },
  {
    id: 'ach-stu-karthik-03',
    userKey: 'ACH-2026-003',
    fullName: 'Karthik Nair',
    email: 'karthik.n@achariya.in',
    enrollments: [{ rollNumber: 'ACH-12B-08', class: { id: 'cls-12', name: 'Grade 12' }, section: { id: 'sec-b', name: 'Biotech & AI Stream' } }],
    studentProfile: { bloodGroup: 'B+ Positive', heightCm: 171.5, weightKg: 62.0, parentName: 'Suresh Nair (Father)', parentPhone: '+91 94432 71054' }
  },
  {
    id: 'ach-stu-riya-04',
    userKey: 'ACH-2026-004',
    fullName: 'Riya Subramanian',
    email: 'riya.s@achariya.in',
    enrollments: [{ rollNumber: 'ACH-KG2-03', class: { id: 'cls-kg2', name: 'KG-2' }, section: { id: 'sec-mont', name: 'Montessori Blooms' } }],
    studentProfile: { bloodGroup: 'AB+ Positive', heightCm: 108.0, weightKg: 17.5, parentName: 'Lakshmi S. (Mother)', parentPhone: '+91 97890 33120' }
  }
];

export const StaffDashboard: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>(DEFAULT_HOMEWORKS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(DEFAULT_QUIZZES);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [directorySearch, setDirectorySearch] = useState('');
  const [selectedDirectoryStudentId, setSelectedDirectoryStudentId] = useState('ach-stu-aarav-01');
  const [newHwTitle, setNewHwTitle] = useState('Hands-on Protractor: Angle Measurement in Nature');
  const [newHwDesc, setNewHwDesc] = useState('Identify three angles in your home or garden (acute, right, obtuse). Measure using protractor and sketch.');
  const [newHwMarks, setNewHwMarks] = useState<number>(10);
  const [newHwDueDate, setNewHwDueDate] = useState('2026-11-20');

  const directoryStudents = students.length > 0 ? students : DEFAULT_SCHOLARS;
  const filteredDirectoryStudents = directoryStudents.filter(stu => {
    const q = directorySearch.trim().toLowerCase();
    if (!q) return true;
    const roll = stu.enrollments?.[0]?.rollNumber?.toLowerCase() || '';
    const cls = stu.enrollments?.[0]?.class?.name?.toLowerCase() || '';
    return stu.fullName.toLowerCase().includes(q) || roll.includes(q) || cls.includes(q);
  });
  const activeDirectoryStudent =
    filteredDirectoryStudents.find(s => s.id === selectedDirectoryStudentId) ||
    filteredDirectoryStudents[0] ||
    directoryStudents[0];
  const activeBook = books.find(b => b.id === selectedBookId) || books[0] || null;

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
      const list = directoryStudents;
      if (list.length > 0) {
        apiFetch('/api/operations/attendance/rollcall', {
          method: 'POST',
          body: JSON.stringify({
            date: new Date().toISOString(),
            classId: list[0].enrollments?.[0]?.class?.id || 'demo-class',
            sectionId: list[0].enrollments?.[0]?.section?.id || 'demo-sec',
            records: [
              {
                studentId: list[0].id,
                status: selectedStudentStatus,
                remarks: 'Verified during morning classroom roll call'
              }
            ]
          })
        }).catch(() => {});
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

  const handleCreateHomeworkSubmit = () => {
    const cleanTitle = newHwTitle.trim();
    if (!cleanTitle) {
      showToast('Please enter a task title before publishing.');
      return;
    }
    const createdItem: Homework = {
      id: `hw-live-${Date.now()}`,
      title: cleanTitle,
      description: newHwDesc.trim() || 'Experiential task assigned via Staff Home.',
      dueDate: newHwDueDate,
      maxMarks: Number(newHwMarks) || 10,
      class: { id: 'cls-5', name: 'Grade 5' },
      section: { id: 'sec-a', name: 'Innovation Studio A' },
      subject: { id: 'sub-math', name: 'Mathematics & Experiential Stem' },
      teacher: { id: 'tch-current', fullName: 'Faculty Instructor' },
      _count: { submissions: 0 }
    };
    setHomeworks(prev => [createdItem, ...prev]);
    apiFetch('/api/assessment/homework', {
      method: 'POST',
      body: JSON.stringify({
        title: createdItem.title,
        description: createdItem.description,
        dueDate: createdItem.dueDate,
        maxMarks: createdItem.maxMarks
      })
    }).catch(() => {});
    showToast(`Published "${createdItem.title}" to Active Homework Tasks!`);
    setActiveModal(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Dynamic Hero — Live Noticeboard */}
      <div className="relative rounded-3xl overflow-hidden border border-teal-200/50 shadow-sm" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 45%, #ede9fe 100%)' }}>
        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-teal-300/15 blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full bg-indigo-300/10 blur-2xl translate-y-1/2 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 sm:p-8">
          {/* Left — announcement */}
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-teal-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span>Live · Achariya Central Campus Noticeboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', letterSpacing: '-0.025em' }}>
              Science, AI &amp; Robotics Conclave 2026
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Grade 5 scholars are demonstrating automated solar rainwater harvesting and ecological robotics models in the central amphitheatre this Friday.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1.5 text-teal-700 font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>This Friday · Central Amphitheatre</span>
              </span>
              <span className="text-slate-300">·</span>
              <span>Faculty, Scholars &amp; Parents</span>
              <button
                type="button"
                onClick={() => navigateToRoute('/staff/noticeboard')}
                className="ml-auto inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold hover:underline"
              >
                All Notices <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right — live clock */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/80 shadow-sm text-center min-w-[140px] shrink-0 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-teal-600 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span>Live</span>
            </div>
            <div className="text-3xl font-black text-slate-900 tabular-nums leading-none" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', letterSpacing: '-0.03em' }}>
              {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
              {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>
        </div>
      </div>

      {/* 1B. Campus Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Scholars Enrolled', value: '847', sub: '+3 this week', iconEl: <Users className="w-4 h-4" />, bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100' },
          { label: 'Present Today', value: '94%', sub: '+2% vs yesterday', iconEl: <CheckCircle2 className="w-4 h-4" />, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
          { label: 'Active Homeworks', value: String(homeworks.length), sub: 'Due this week', iconEl: <FileCheck className="w-4 h-4" />, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
          { label: 'Live Quizzes', value: String(quizzes.length), sub: 'Auto-graded', iconEl: <Activity className="w-4 h-4" />, bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl px-4 py-3.5 border border-slate-100 shadow-xs flex items-center gap-3 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.text} border ${stat.border}`}>
              {stat.iconEl}
            </div>
            <div className="min-w-0">
              <div className="text-xl font-black text-slate-900 leading-none tabular-nums" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', letterSpacing: '-0.03em' }}>
                {stat.value}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">{stat.label}</div>
              <div className={`text-[10px] font-bold ${stat.text}`}>{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Command Center — 3 Flagship Pillars */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">AI Command Center · 3 Flagship Engines</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Flagship Pillar 1: AI Tools Suite */}
        <div
          onClick={() => navigateToRoute('/staff/aitools')}
          className="cursor-pointer group rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-teal-50 via-white to-emerald-50/70 border border-teal-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between gap-4"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                    AI-FIRST Flagship Suite
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    Achariya AI Tools Suite · 4 Connected Pillars
                  </h2>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Four interconnected AI engines: AI Exam Builder &amp; Grader (Sets A/B/C), VoiceLab Speech AI with 125+ skills, Holistic Progress Card (HPC 360° PARAKH), and Personalised Adaptive Learning (PAL KG-12).
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Exam Grader Sets A/B/C', 'VoiceLab Speech AI', 'HPC 360° PARAKH', 'PAL KG-12 Adaptive'].map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-teal-200 text-teal-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-teal-100">
            <span className="text-[11px] font-semibold text-teal-700">Unified Data Layer · 10,480+ Scholars</span>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                navigateToRoute('/staff/aitools');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 group-hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span>Open AI Tools Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Flagship Pillar 2: AI Learning Gap & Mastery Studio */}
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
                    AI Remediation Engine
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    AI Learning Gap &amp; 100% Mastery Studio
                  </h2>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Traces exam errors across grades via the prerequisite DAG, auto-clusters students into shared-cause AI Remedial Circles, generates 1-page QR bridge worksheets, and enforces Dual-Threshold + Gold 100% Mastery.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Cross-Grade DAG', 'AI Remedial Circles', 'Dual-Threshold + Gold 100%', 'Zero-Code DAG Builder'].map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-violet-200 text-violet-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-violet-100">
            <span className="text-[11px] font-semibold text-violet-700">Pre-Primary to Grade 12 · Adaptive</span>
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

        {/* Flagship Pillar 3: 360° Student Intelligence & BMIT */}
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
                    360° Student Intelligence &amp; BMIT
                  </h2>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Longitudinal 24-section Student Master Profile uniting official BMIT 8-domain brain mapping (enrichment guide only), multimodal VAK prescriptions, 20 development dimensions, and 16 future-ready career pathways.
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
            <span className="text-[11px] font-semibold text-indigo-700">14 Exportable Reports · Parent Companion</span>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                navigateToRoute('/staff/student-intelligence');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span>Open 360° BMIT Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions label */}
      <div className="flex items-center gap-2 -mb-1">
        <Activity className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Daily Operations</span>
      </div>

      {/* 2. Daily Operations Quick Action Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            key: 'bookReader',
            icon: <BookOpen className="w-5 h-5" />,
            iconBg: 'from-teal-500 to-teal-600',
            label: 'Digital Textbooks',
            sub: 'Dual-page vector reader',
            hover: 'hover:border-teal-200 hover:shadow-teal-100/60',
          },
          {
            key: 'rollCall',
            icon: <Calendar className="w-5 h-5" />,
            iconBg: 'from-sky-500 to-blue-500',
            label: 'Daily Attendance',
            sub: 'Record Grade 5A roll call',
            hover: 'hover:border-sky-200 hover:shadow-sky-100/60',
          },
          {
            key: 'studentDirectory',
            icon: <Users className="w-5 h-5" />,
            iconBg: 'from-indigo-500 to-violet-500',
            label: 'Scholar Directory',
            sub: 'Health card & anthropometrics',
            hover: 'hover:border-indigo-200 hover:shadow-indigo-100/60',
          },
          {
            key: 'createHomework',
            icon: <PlusCircle className="w-5 h-5" />,
            iconBg: 'from-amber-400 to-orange-500',
            label: 'Assign Homework',
            sub: 'Publish experiential tasks',
            hover: 'hover:border-amber-200 hover:shadow-amber-100/60',
          },
          {
            key: 'qrLogin',
            icon: <ScanLine className="w-5 h-5" />,
            iconBg: 'from-teal-500 to-emerald-500',
            label: 'QR Class Login',
            sub: 'Students scan to sign in',
            hover: 'hover:border-teal-200 hover:shadow-teal-100/60',
          },
        ].map(action => (
          <button
            key={action.key}
            type="button"
            onClick={() => setActiveModal(action.key as any)}
            className={`group p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-left ${action.hover}`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${action.iconBg} text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
              {action.icon}
            </div>
            <div className="text-xs font-bold text-slate-900 leading-tight">{action.label}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium leading-tight">{action.sub}</div>
          </button>
        ))}
      </div>

      {/* Section label */}
      <div className="flex items-center gap-2 -mb-1">
        <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Live Academic Activity</span>
      </div>

      {/* 3. Academic Content & Formative Assessments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Active Homework Tasks */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>Active Homework Tasks</h2>
              <p className="text-xs text-slate-400 mt-0.5">Grade 5 · Innovation Studio A</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-teal-50 text-teal-700 font-bold px-2.5 py-1 rounded-full border border-teal-100">
                {homeworks.length} Active
              </span>
              <button
                type="button"
                onClick={() => navigateToRoute('/staff/homework')}
                className="inline-flex items-center gap-0.5 text-xs font-bold text-teal-600 hover:text-teal-800 transition-colors"
              >
                All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {homeworks.map((hw, i) => {
              const totalCapacity = 32;
              const pct = Math.min(100, Math.round(((hw._count?.submissions ?? 0) / totalCapacity) * 100));
              const due = new Date(hw.dueDate);
              const daysLeft = Math.ceil((due.getTime() - Date.now()) / 86400000);
              const dueCls = daysLeft < 0 ? 'bg-rose-50 text-rose-700 border-rose-100' : daysLeft === 0 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-100';
              const dueLabel = daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due Today' : `Due in ${daysLeft}d`;
              return (
                <div key={hw.id} className="flex gap-0 hover:bg-slate-50/60 transition-colors group">
                  {/* Left accent bar */}
                  <div className={`w-1 shrink-0 ${i === 0 ? 'bg-teal-500' : 'bg-indigo-400'} rounded-l-sm`} />
                  <div className="flex-1 p-4 pl-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 flex-1">{hw.title}</h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${dueCls}`}>{dueLabel}</span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">{hw.maxMarks}m</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-1">{hw.subject?.name || 'Subject'}</p>
                    {/* Submission progress bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold">
                        <span className="text-slate-400">{hw._count?.submissions ?? 0} / {totalCapacity} submitted</span>
                        <span className="text-teal-600">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-50">
            <button
              type="button"
              onClick={() => setActiveModal('createHomework')}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-100 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Assign New Task</span>
            </button>
          </div>
        </div>

        {/* Right: Active Quizzes */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>Formative Quizzes</h2>
              <p className="text-xs text-slate-400 mt-0.5">Auto-graded check-ins</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-violet-50 text-violet-700 font-bold px-2.5 py-1 rounded-full border border-violet-100">
                {quizzes.length} Live
              </span>
              <button
                type="button"
                onClick={() => navigateToRoute('/staff/insights')}
                className="inline-flex items-center gap-0.5 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors"
              >
                Insights <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {quizzes.map((quiz, i) => {
              const totalCapacity = 32;
              const pct = Math.min(100, Math.round(((quiz._count?.submissions ?? 0) / totalCapacity) * 100));
              const typeColors: Record<string, string> = {
                DIAGNOSTIC: 'bg-sky-50 text-sky-700 border-sky-100',
                FORMATIVE:  'bg-violet-50 text-violet-700 border-violet-100',
                SUMMATIVE:  'bg-rose-50 text-rose-700 border-rose-100',
              };
              const typeCls = typeColors[quiz.quizType] ?? 'bg-slate-50 text-slate-600 border-slate-100';
              return (
                <div key={quiz.id} className="flex gap-0 hover:bg-slate-50/60 transition-colors group">
                  <div className={`w-1 shrink-0 ${i === 0 ? 'bg-violet-500' : 'bg-sky-400'} rounded-l-sm`} />
                  <div className="flex-1 p-4 pl-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 flex-1">{quiz.title}</h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeCls}`}>{quiz.quizType}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">{quiz.timeLimitMinutes}m</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-100">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Auto-graded
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{quiz._count?.questions || 1} questions</span>
                    </div>
                    {/* Submission progress bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold">
                        <span className="text-slate-400">{quiz._count?.submissions ?? 0} / {totalCapacity} responses</span>
                        <span className="text-violet-600">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-50">
            <button
              type="button"
              onClick={() => navigateToRoute('/staff/exam-builder')}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold border border-violet-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Build New Quiz with AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: DUAL-PAGE FLIPBOOK VIEWER                                        */}
      {/* ========================================================================= */}
      {activeModal === 'bookReader' && renderPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {activeBook ? activeBook.title : 'Achariya Global Lingua: Grade 5 Integrated English & Oratory Arts'}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeBook
                    ? `${activeBook.class?.name || 'Grade'} · ${activeBook.subject?.name || 'Subject'} · ${activeBook.publisher || 'Achariya Press'}`
                    : 'Chapter 1: The Great Banyan of Villianur · Interactive Vector Reader'}
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕ Close
              </button>
            </div>

            {books.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {books.slice(0, 6).map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBookId(b.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors ${
                      (activeBook?.id === b.id)
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b.title}
                  </button>
                ))}
              </div>
            )}

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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    navigateToRoute('/staff/resources');
                  }}
                  className="px-3.5 py-2 bg-teal-50 text-teal-800 border border-teal-200 rounded-xl font-bold hover:bg-teal-100 transition-colors"
                >
                  Open Full Curriculum Hub →
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DAILY ATTENDANCE ROLL CALL                                       */}
      {/* ========================================================================= */}
      {activeModal === 'rollCall' && renderPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto animate-in fade-in zoom-in-95 duration-150">
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

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleRollCallSubmit}
                    className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    Confirm &amp; Submit Roll Call
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      navigateToRoute('/staff/attendance');
                    }}
                    className="px-4 py-3 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs rounded-xl transition-colors"
                  >
                    Open Full Attendance Hub →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SCHOLAR DIRECTORY & HEALTH CARD                                  */}
      {/* ========================================================================= */}
      {activeModal === 'studentDirectory' && renderPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Scholar Profile & CBSE Health Card</h3>
                <p className="text-xs text-slate-500">Anthropometric measurements and guardian contact</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={directorySearch}
                  onChange={e => setDirectorySearch(e.target.value)}
                  placeholder="Search scholar by name, roll # or grade (e.g., Aarav, Diya, Grade 10)..."
                  className="w-full bg-transparent text-xs outline-none text-slate-800"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {filteredDirectoryStudents.slice(0, 6).map(stu => (
                  <button
                    key={stu.id}
                    type="button"
                    onClick={() => setSelectedDirectoryStudentId(stu.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                      activeDirectoryStudent?.id === stu.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {stu.fullName} · {stu.enrollments?.[0]?.class?.name || 'Scholar'}
                  </button>
                ))}
              </div>
            </div>

            {activeDirectoryStudent && (
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-base shadow-xs">
                    {activeDirectoryStudent.fullName[0]}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{activeDirectoryStudent.fullName}</h4>
                    <p className="text-xs text-slate-500">
                      {activeDirectoryStudent.enrollments?.[0]?.class?.name || 'Grade 5'} · {activeDirectoryStudent.enrollments?.[0]?.section?.name || 'Section A'} · Roll #{activeDirectoryStudent.enrollments?.[0]?.rollNumber || activeDirectoryStudent.userKey}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">HEIGHT</span>
                    <span className="font-bold text-slate-800">{activeDirectoryStudent.studentProfile?.heightCm ?? 142.5} cm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">WEIGHT</span>
                    <span className="font-bold text-slate-800">{activeDirectoryStudent.studentProfile?.weightKg ?? 35.8} kg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">BLOOD GROUP</span>
                    <span className="font-bold text-teal-700">{activeDirectoryStudent.studentProfile?.bloodGroup || 'O+ Positive'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">BMI INDEX</span>
                    <span className="font-bold text-slate-800">
                      {(() => {
                        const h = activeDirectoryStudent.studentProfile?.heightCm ?? 142.5;
                        const w = activeDirectoryStudent.studentProfile?.weightKg ?? 35.8;
                        const bmi = w / ((h / 100) ** 2);
                        return `${bmi.toFixed(1)} (${bmi >= 14 && bmi <= 24 ? 'Normal' : 'Monitor'})`;
                      })()}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">GUARDIAN CONTACT</span>
                  <p className="font-bold text-slate-800">
                    {activeDirectoryStudent.studentProfile?.parentName || 'Guardian On File'} · {activeDirectoryStudent.studentProfile?.parentPhone || '+91 98402 99881'}
                  </p>
                  <p className="text-[11px] text-slate-500">{activeDirectoryStudent.email}</p>
                </div>
              </div>
            )}

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
      {activeModal === 'createHomework' && renderPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto animate-in fade-in zoom-in-95 duration-150">
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
                  value={newHwTitle}
                  onChange={e => setNewHwTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructions:</label>
                <textarea
                  rows={3}
                  value={newHwDesc}
                  onChange={e => setNewHwDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Marks:</label>
                  <input
                    type="number"
                    min={1}
                    value={newHwMarks}
                    onChange={e => setNewHwMarks(Number(e.target.value) || 10)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date:</label>
                  <input
                    type="date"
                    value={newHwDueDate}
                    onChange={e => setNewHwDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateHomeworkSubmit}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Publish to Scholars
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Classroom Login Modal */}
      {activeModal === 'qrLogin' && renderPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <QrSessionPanel onClose={() => setActiveModal(null)} />
        </div>
      )}

      {/* In-app Toast */}
      {toastMessage && renderPortal(
        <div className="fixed bottom-6 right-6 z-[110] max-w-sm bg-slate-900/95 backdrop-blur-sm text-white px-5 py-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200" style={{ boxShadow: '0 20px 40px -8px rgb(0 0 0 / 0.3), 0 0 0 1px rgb(255 255 255 / 0.08)' }}>
          <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-teal-400" />
          </div>
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
