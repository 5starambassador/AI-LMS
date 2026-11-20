import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Compass,
  BookOpen,
  FileCheck,
  CalendarCheck,
  PenTool,
  Mic,
  GraduationCap,
  ClipboardList,
  CalendarDays,
  Megaphone,
  FileText,
  UmbrellaOff,
  CreditCard,
  ChevronDown,
  Home,
  BarChart2,
  LayoutGrid,
  Target,
  BrainCircuit,
  Menu,
  X,
  LogOut,
  PlayCircle
} from 'lucide-react';
import { User } from '../types';

export type ActiveTabType =
  | 'home'
  | 'lms'
  | 'resources'
  | 'homework'
  | 'attendance'
  | 'worksheet'
  | 'aitools'
  | 'exam-builder'
  | 'learning-gaps'
  | 'student-intelligence'
  | 'myspace'
  | 'insights'
  | 'exams'
  | 'timetable'
  | 'noticeboard'
  | 'reportcard'
  | 'leaves'
  | 'fees';

export type StudentTabType = 'lms' | 'voicelab' | 'voice' | 'homework' | 'gaps' | 'intelligence';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  studentTab: StudentTabType;
  setStudentTab: (tab: StudentTabType) => void;
  currentUser: User | null;
  currentPortal: 'STAFF' | 'STUDENT' | 'SUPERADMIN';
  setCurrentPortal: (portal: 'STAFF' | 'STUDENT' | 'SUPERADMIN') => void;
  onNavigate: (route: string) => void;
  onLogout?: () => void;
}

const ADMIN_ROLES = ['role-ach-superadmin', 'role-ach-manager', 'role-ach-principal'];

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  color: string;
  activeColor: string;
  allowedRoles?: string[];
  items: { label: string; tab: ActiveTabType; route: string; icon: React.ReactNode; desc: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Teaching',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: 'text-teal-600',
    activeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    items: [
      { label: 'AI LMS Studio',   tab: 'lms',        route: '/staff/lms',         icon: <PlayCircle className="w-4 h-4 text-teal-600" />,    desc: 'Video, Audio & Simulation VAK lessons' },
      { label: 'Attendance',      tab: 'attendance', route: '/staff/attendance',  icon: <CalendarCheck className="w-4 h-4 text-teal-600" />, desc: 'Daily roll call, QR scan & register' },
      { label: 'Curriculum',      tab: 'resources',  route: '/staff/resources',   icon: <BookOpen className="w-4 h-4 text-teal-600" />,      desc: 'Digital textbooks & flipbook reader' },
      { label: 'Homework Studio', tab: 'homework',   route: '/staff/homework',    icon: <FileCheck className="w-4 h-4 text-teal-600" />,     desc: 'Assign and grade homework tasks' },
      { label: 'Worksheet Canvas',tab: 'worksheet',  route: '/staff/worksheet',   icon: <PenTool className="w-4 h-4 text-teal-600" />,       desc: 'Build interactive worksheets' },
    ]
  },
  {
    label: 'Assessment',
    icon: <ClipboardList className="w-3.5 h-3.5" />,
    color: 'text-violet-600',
    activeColor: 'bg-violet-50 text-violet-800 border-violet-200',
    items: [
      { label: 'Exam Builder',      tab: 'exam-builder',  route: '/staff/exam-builder',  icon: <FileText className="w-4 h-4 text-violet-600" />,     desc: 'Curriculum outcomes & blueprint builder' },
      { label: 'Summative Exams',   tab: 'exams',         route: '/staff/exams',         icon: <ClipboardList className="w-4 h-4 text-violet-600" />, desc: 'Create and manage summative exams' },
      { label: 'Score Insights',    tab: 'insights',      route: '/staff/insights',      icon: <BarChart2 className="w-4 h-4 text-violet-600" />,    desc: 'Score analytics & AI grading' },
      { label: 'Report Cards',      tab: 'reportcard',    route: '/staff/reportcard',    icon: <FileText className="w-4 h-4 text-violet-600" />,     desc: 'Generate student report cards' },
      { label: 'Learning Gap Studio',tab: 'learning-gaps',route: '/staff/learning-gaps', icon: <Target className="w-4 h-4 text-violet-600" />,       desc: 'Cross-grade error tracing & DAG' },
    ]
  },
  {
    label: 'AI Studios',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: 'text-teal-600',
    activeColor: 'bg-teal-50 text-teal-800 border-teal-200 font-bold',
    items: [
      { label: 'Achariya AI Tools Suite', tab: 'aitools',              route: '/staff/aitools',              icon: <Sparkles className="w-4 h-4 text-teal-600" />,     desc: 'Exam Grader, VoiceLab, HPC 360° & PAL' },
      { label: 'AI Learning Gap Studio',  tab: 'learning-gaps',        route: '/staff/learning-gaps',        icon: <Target className="w-4 h-4 text-violet-600" />,     desc: 'Prerequisite DAG & 100% Mastery' },
      { label: '360° Student Intelligence',tab: 'student-intelligence', route: '/staff/student-intelligence', icon: <BrainCircuit className="w-4 h-4 text-indigo-600" />, desc: 'BMIT, VAK, E-Portfolio & Career AI' },
      { label: 'AI LMS Studio',          tab: 'lms',                  route: '/staff/lms',                  icon: <PlayCircle className="w-4 h-4 text-teal-600" />,    desc: 'Video, Audio & Simulation VAK lessons' },
    ]
  },
  {
    label: 'Operations',
    icon: <LayoutGrid className="w-3.5 h-3.5" />,
    color: 'text-orange-500',
    activeColor: 'bg-orange-50 text-orange-800 border-orange-200',
    allowedRoles: ADMIN_ROLES,
    items: [
      { label: 'Timetable',   tab: 'timetable',   route: '/staff/timetable',   icon: <CalendarDays className="w-4 h-4 text-orange-500" />, desc: 'Class schedules & period planner' },
      { label: 'Leave',       tab: 'leaves',      route: '/staff/leaves',      icon: <UmbrellaOff className="w-4 h-4 text-rose-500" />,    desc: 'Staff leave requests & approvals' },
      { label: 'Noticeboard', tab: 'noticeboard', route: '/staff/noticeboard', icon: <Megaphone className="w-4 h-4 text-orange-500" />,    desc: 'Campus banners & announcements' },
      { label: 'Fees',        tab: 'fees',        route: '/staff/fees',        icon: <CreditCard className="w-4 h-4 text-emerald-600" />,  desc: 'Fee tracker & payment status' },
    ]
  },
];

function DropdownMenu({
  group,
  activeTab,
  onNavigate,
}: {
  group: NavGroup;
  activeTab: ActiveTabType;
  onNavigate: (route: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isGroupActive = group.items.some(i => i.tab === activeTab);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 180);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
          isGroupActive
            ? `${group.activeColor} border shadow-xs font-bold`
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
        }`}
      >
        <span className={isGroupActive ? '' : group.color}>{group.icon}</span>
        <span>{group.label}</span>
        {isGroupActive && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100" style={{ boxShadow: 'var(--shadow-popup)' }}>
          <div className="px-3 py-1.5 mb-1 border-b border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{group.label}</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
              {group.items.length} Modules
            </span>
          </div>
          {group.items.map(item => (
            <button
              key={item.tab}
              type="button"
              onClick={() => {
                onNavigate(item.route);
                setOpen(false);
              }}
              className={`w-full flex items-start gap-2.5 px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                activeTab === item.tab ? 'bg-slate-50 text-slate-900 font-bold' : ''
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
              <div className="min-w-0">
                <div className={`text-xs font-bold leading-tight ${activeTab === item.tab ? 'text-slate-900' : 'text-slate-700'}`}>
                  {item.label}
                  {activeTab === item.tab && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-teal-500 align-middle" />}
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5 leading-snug truncate">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  studentTab,
  setStudentTab,
  currentUser,
  currentPortal,
  setCurrentPortal,
  onNavigate,
  onLogout
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleMobileNavigate = (route: string) => {
    onNavigate(route);
    setMobileNavOpen(false);
  };

  const displayName =
    currentUser?.fullName ||
    (currentPortal === 'SUPERADMIN' ? 'Dr. V. Rajakumaran' : currentPortal === 'STUDENT' ? 'Aarav Sundaram' : '—');
  const displayInitial = displayName !== '—' ? displayName[0].toUpperCase() : 'U';
  const cleanCampusName = currentUser?.campus?.name?.replace(/\s*\(Main Campus\)/i, '');
  const displaySubtitle =
    currentUser?.roleName
      ? `${currentUser.roleName} · ${
          cleanCampusName ||
          (currentUser.scope === 'GLOBAL'
            ? 'Trust Umbrella (Global)'
            : currentUser.scope === 'REGIONAL'
            ? 'Regional Umbrella'
            : 'Achariya')
        }`
      : currentPortal === 'SUPERADMIN'
      ? 'Super Admin · Trust Umbrella (Global)'
      : currentPortal === 'STUDENT'
      ? 'Scholar · Grade 5A'
      : `Staff · ${cleanCampusName || 'Achariya'}`;
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-2.5">

          {/* Brand */}
          <button
            onClick={() => onNavigate(currentUser?.roleKey === 'role-ach-student' ? '/student/gaps' : '/staff/home')}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-sm font-bold text-base">
              ⚡
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">achariya</span>
              <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 font-black px-1.5 py-0.5 rounded-md tracking-wider whitespace-nowrap">
                AI ONE
              </span>
            </div>
          </button>

          {/* Role-based Staff / Admin nav */}
          {(currentPortal === 'STAFF' || currentPortal === 'SUPERADMIN') &&
            currentUser?.roleKey !== 'role-ach-student' &&
            currentUser?.roleKey !== 'role-ach-parent' && (
            <nav className="hidden lg:flex items-center gap-1.5 flex-1 min-w-0 py-1">
              {/* Home — always direct */}
              <button
                onClick={() => onNavigate('/staff/home')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                  currentPortal === 'STAFF' && activeTab === 'home'
                    ? 'bg-slate-100 text-slate-900 border-slate-200 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              {/* Grouped dropdowns: Teaching, Assessment, AI Studios, Operations */}
              {NAV_GROUPS.filter(group =>
                !group.allowedRoles || (currentUser && group.allowedRoles.includes(currentUser.roleKey))
              ).map(group => (
                <DropdownMenu
                  key={group.label}
                  group={group}
                  activeTab={currentPortal === 'STAFF' ? activeTab : 'home'}
                  onNavigate={onNavigate}
                />
              ))}

              {/* ── Divider: academic / utility ── */}
              <span className="w-px h-5 bg-slate-200 mx-0.5 flex-shrink-0" />

              {/* Standalone Leave for teachers (not in Operations group) */}
              {currentUser && !ADMIN_ROLES.includes(currentUser.roleKey) && (
                <button
                  onClick={() => onNavigate('/staff/leaves')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                    currentPortal === 'STAFF' && activeTab === 'leaves'
                      ? 'bg-rose-50 text-rose-800 border-rose-200 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <UmbrellaOff className="w-3.5 h-3.5 text-rose-500" />
                  <span>Leave</span>
                </button>
              )}

              {/* My Space */}
              <button
                onClick={() => onNavigate('/staff/myspace')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                  currentPortal === 'STAFF' && activeTab === 'myspace'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span>My Space</span>
              </button>

              {/* Trust HQ — only for Super Admin & Trust Manager */}
              {(currentUser?.roleKey === 'role-ach-superadmin' || currentUser?.roleKey === 'role-ach-manager') && (
                <button
                  onClick={() => onNavigate('/superadmin')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                    currentPortal === 'SUPERADMIN'
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-200 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-indigo-800 hover:bg-indigo-50/70 border-transparent'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Trust HQ</span>
                </button>
              )}
            </nav>
          )}

          {/* Student nav */}
          {currentPortal === 'STUDENT' && (
            <nav className="hidden lg:flex items-center gap-1 flex-1 min-w-0 overflow-x-auto no-scrollbar py-1 text-xs">
              {[
                { tab: 'lms'          as StudentTabType, route: '/student/lms',          label: 'AI LMS',          icon: <PlayCircle className="w-3.5 h-3.5 text-teal-600" />, cls: 'bg-teal-50 text-teal-800 border-teal-200' },
                { tab: 'gaps'         as StudentTabType, route: '/student/gaps',         label: 'Gaps & Mastery',  icon: <Target className="w-3.5 h-3.5 text-purple-600" />,   cls: 'bg-purple-50 text-purple-800 border-purple-200' },
                { tab: 'intelligence' as StudentTabType, route: '/student/intelligence', label: '360° BMIT',       icon: <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />, cls: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
                { tab: 'voicelab'     as StudentTabType, route: '/student/voicelab',     label: 'VoiceLab',        icon: <Mic className="w-3.5 h-3.5 text-teal-600" />,        cls: 'bg-teal-50 text-teal-800 border-teal-200' },
                { tab: 'voice'        as StudentTabType, route: '/student/voice',        label: 'Read Aloud',      icon: <Mic className="w-3.5 h-3.5 text-rose-500" />,        cls: 'bg-rose-50 text-rose-800 border-rose-200'  },
                { tab: 'homework'     as StudentTabType, route: '/student/homework',     label: 'Homework',        icon: <FileCheck className="w-3.5 h-3.5 text-teal-600" />,  cls: 'bg-teal-50 text-teal-800 border-teal-200' },
              ].map(item => (
                <button
                  key={item.tab}
                  onClick={() => onNavigate(item.route)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-semibold border transition-all whitespace-nowrap ${
                    studentTab === item.tab
                      ? `${item.cls} shadow-xs font-bold`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  {item.icon}<span>{item.label}</span>
                </button>
              ))}
            </nav>
          )}

          {/* Right: consolidated campus status + user profile + sign out + mobile menu toggle */}
          <div className="flex items-center gap-2 ml-auto flex-shrink-0 pl-3 border-l border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
              {displayInitial}
            </div>
            <div className="hidden md:block text-left min-w-0">
              <div className="flex items-center gap-1.5">
                <div className="text-xs font-bold leading-tight text-slate-900 truncate max-w-[165px]">
                  {displayName}
                </div>
                {currentUser?.scope && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 leading-none inline-flex items-center rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex-shrink-0">
                    {currentUser.scope}
                  </span>
                )}
              </div>
              <div
                className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium truncate max-w-[260px]"
                title={
                  currentUser?.campus?.name ||
                  (currentUser?.scope === 'GLOBAL'
                    ? 'Trust Umbrella (All Campuses)'
                    : currentUser?.scope === 'REGIONAL'
                    ? 'Regional Umbrella'
                    : 'Achariya World Class Academy')
                }
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                <span className="truncate">{displaySubtitle}</span>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Sign Out"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Sign Out</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileNavOpen(o => !o)}
              aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Collapsible Mobile / Tablet Navigation Drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white px-4 py-3 space-y-3 max-h-[75vh] overflow-y-auto shadow-lg">
          {(currentPortal === 'STAFF' || currentPortal === 'SUPERADMIN') &&
            currentUser?.roleKey !== 'role-ach-student' &&
            currentUser?.roleKey !== 'role-ach-parent' && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    onClick={() => handleMobileNavigate('/staff/home')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border text-left ${
                      currentPortal === 'STAFF' && activeTab === 'home'
                        ? 'bg-slate-100 text-slate-900 border-slate-300'
                        : 'bg-slate-50/70 text-slate-700 border-slate-200/70'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </button>
                  <button
                    onClick={() => handleMobileNavigate('/staff/learning-gaps')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border text-left ${
                      currentPortal === 'STAFF' && activeTab === 'learning-gaps'
                        ? 'bg-violet-50 text-violet-800 border-violet-300'
                        : 'bg-slate-50/70 text-slate-700 border-slate-200/70'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5 text-violet-600" />
                    <span>Gap Studio</span>
                  </button>
                  <button
                    onClick={() => handleMobileNavigate('/staff/student-intelligence')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border text-left ${
                      currentPortal === 'STAFF' && activeTab === 'student-intelligence'
                        ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                        : 'bg-slate-50/70 text-slate-700 border-slate-200/70'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>360° BMIT</span>
                  </button>
                  <button
                    onClick={() => handleMobileNavigate('/staff/aitools')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border text-left ${
                      currentPortal === 'STAFF' && activeTab === 'aitools'
                        ? 'bg-teal-50 text-teal-800 border-teal-300'
                        : 'bg-slate-50/70 text-slate-700 border-slate-200/70'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>AI Tools</span>
                  </button>
                </div>

                {NAV_GROUPS.filter(group =>
                  !group.allowedRoles || (currentUser && group.allowedRoles.includes(currentUser.roleKey))
                ).map(group => (
                  <div key={group.label} className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                      {group.label}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {group.items.map(item => (
                        <button
                          key={item.tab}
                          onClick={() => handleMobileNavigate(item.route)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border text-left ${
                            currentPortal === 'STAFF' && activeTab === item.tab
                              ? 'bg-slate-100 text-slate-900 border-slate-300 font-bold'
                              : 'bg-white text-slate-700 border-slate-200/80'
                          }`}
                        >
                          {item.icon}
                          <span className="truncate">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 border-t border-slate-100">
                  {currentUser && !ADMIN_ROLES.includes(currentUser.roleKey) && (
                    <button
                      onClick={() => handleMobileNavigate('/staff/leaves')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border text-left ${
                        currentPortal === 'STAFF' && activeTab === 'leaves'
                          ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                          : 'bg-white text-slate-700 border-slate-200/80'
                      }`}
                    >
                      <UmbrellaOff className="w-3.5 h-3.5 text-rose-500" />
                      <span>Leave</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleMobileNavigate('/staff/myspace')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border text-left ${
                      currentPortal === 'STAFF' && activeTab === 'myspace'
                        ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold'
                        : 'bg-white text-slate-700 border-slate-200/80'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-indigo-500" />
                    <span>My Space</span>
                  </button>
                  {(currentUser?.roleKey === 'role-ach-superadmin' || currentUser?.roleKey === 'role-ach-manager') && (
                    <button
                      onClick={() => handleMobileNavigate('/superadmin')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border text-left ${
                        currentPortal === 'SUPERADMIN'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold'
                          : 'bg-white text-slate-700 border-slate-200/80'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Trust HQ</span>
                    </button>
                  )}
                </div>
              </div>
            )}

          {currentPortal === 'STUDENT' && (
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { tab: 'lms' as StudentTabType, route: '/student/lms', label: 'AI LMS · Video, Audio & Simulations', icon: <PlayCircle className="w-3.5 h-3.5 text-teal-600" />, cls: 'bg-teal-50 text-teal-800 border-teal-200' },
                { tab: 'gaps' as StudentTabType, route: '/student/gaps', label: 'My Learning Gaps & Mastery', icon: <Target className="w-3.5 h-3.5 text-purple-600" />, cls: 'bg-purple-50 text-purple-800 border-purple-200' },
                { tab: 'intelligence' as StudentTabType, route: '/student/intelligence', label: 'My 360° BMIT, VAK & Career', icon: <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />, cls: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
                { tab: 'voicelab' as StudentTabType, route: '/student/voicelab', label: 'VoiceLab Speech AI', icon: <Mic className="w-3.5 h-3.5 text-teal-600" />, cls: 'bg-teal-50 text-teal-800 border-teal-200' },
                { tab: 'voice' as StudentTabType, route: '/student/voice', label: 'Read Aloud', icon: <Mic className="w-3.5 h-3.5 text-rose-500" />, cls: 'bg-rose-50 text-rose-800 border-rose-200' },
                { tab: 'homework' as StudentTabType, route: '/student/homework', label: 'Homework Studio', icon: <FileCheck className="w-3.5 h-3.5 text-teal-600" />, cls: 'bg-teal-50 text-teal-800 border-teal-200' },
              ].map(item => (
                <button
                  key={item.tab}
                  onClick={() => handleMobileNavigate(item.route)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border text-left ${
                    studentTab === item.tab
                      ? `${item.cls} font-bold`
                      : 'bg-white text-slate-700 border-slate-200/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
