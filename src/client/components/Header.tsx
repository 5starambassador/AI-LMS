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
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { User } from '../types';

export type ActiveTabType =
  | 'home'
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

export type StudentTabType = 'voicelab' | 'voice' | 'homework' | 'gaps' | 'intelligence';

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
      { label: 'Attendance', tab: 'attendance',  route: '/staff/attendance',  icon: <CalendarCheck className="w-4 h-4 text-teal-600" />, desc: 'Daily roll call, QR scan & register' },
      { label: 'Curriculum', tab: 'resources',   route: '/staff/resources',   icon: <BookOpen className="w-4 h-4 text-teal-600" />,     desc: 'Digital textbooks & flipbook reader' },
      { label: 'Homework',   tab: 'homework',    route: '/staff/homework',    icon: <FileCheck className="w-4 h-4 text-teal-600" />,    desc: 'Assign and grade homework tasks' },
      { label: 'Worksheet',  tab: 'worksheet',   route: '/staff/worksheet',   icon: <PenTool className="w-4 h-4 text-teal-600" />,      desc: 'Build interactive worksheets' },
    ]
  },
  {
    label: 'Assessment',
    icon: <ClipboardList className="w-3.5 h-3.5" />,
    color: 'text-violet-600',
    activeColor: 'bg-violet-50 text-violet-800 border-violet-200',
    items: [
      { label: 'Exam Builder', tab: 'exam-builder', route: '/staff/exam-builder', icon: <FileText className="w-4 h-4 text-violet-600" />, desc: 'Curriculum outcomes & blueprint builder' },
      { label: 'Exams',        tab: 'exams',        route: '/staff/exams',        icon: <ClipboardList className="w-4 h-4 text-violet-600" />, desc: 'Create and manage summative exams' },
      { label: 'Insights',     tab: 'insights',     route: '/staff/insights',     icon: <BarChart2 className="w-4 h-4 text-violet-600" />,    desc: 'Score analytics & AI grading' },
      { label: 'Reports',      tab: 'reportcard',   route: '/staff/reportcard',   icon: <FileText className="w-4 h-4 text-violet-600" />,     desc: 'Generate student report cards' },
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
  const isGroupActive = group.items.some(i => i.tab === activeTab);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
          isGroupActive
            ? `${group.activeColor} border shadow-xs`
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
        }`}
      >
        <span className={isGroupActive ? '' : group.color}>{group.icon}</span>
        <span>{group.label}</span>
        {isGroupActive && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-lg border border-slate-200/80 py-1.5 z-50">
          <div className="px-3 py-1.5 mb-1 border-b border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{group.label}</p>
          </div>
          {group.items.map(item => (
            <button
              key={item.tab}
              onClick={() => { onNavigate(item.route); setOpen(false); }}
              className={`w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-slate-50 transition-colors ${
                activeTab === item.tab ? 'bg-slate-50' : ''
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
              <div>
                <div className={`text-xs font-bold ${activeTab === item.tab ? 'text-slate-900' : 'text-slate-700'}`}>
                  {item.label}
                  {activeTab === item.tab && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-teal-500 align-middle" />}
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">{item.desc}</div>
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
  const displaySubtitle =
    currentUser?.roleName
      ? `${currentUser.roleName} · ${
          currentUser?.campus?.name ||
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
      : `Staff · ${currentUser?.campus?.name || 'Achariya'}`;
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-2.5">

          {/* Brand */}
          <button
            onClick={() => onNavigate(currentUser?.roleKey === 'role-ach-student' ? '/student/gaps' : '/staff/home')}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-xs font-bold text-base">
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
            <nav className="hidden lg:flex items-center gap-1 flex-1 min-w-0 overflow-x-auto no-scrollbar py-1">
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

              {/* Grouped dropdowns — filtered by role */}
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

              {/* Direct Flagship AI Studio Pills */}
              <button
                onClick={() => onNavigate('/staff/learning-gaps')}
                title="AI Learning Gap & Remediation Studio"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                  currentPortal === 'STAFF' && activeTab === 'learning-gaps'
                    ? 'bg-violet-50 text-violet-800 border-violet-200 shadow-xs font-bold'
                    : 'text-slate-700 hover:text-violet-800 hover:bg-violet-50/70 border-transparent'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-violet-600" />
                <span>Gap Studio</span>
              </button>

              <button
                onClick={() => onNavigate('/staff/student-intelligence')}
                title="Student 360°, BMIT, VAK, E-Portfolio & Career AI"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                  currentPortal === 'STAFF' && activeTab === 'student-intelligence'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200 shadow-xs font-bold'
                    : 'text-slate-700 hover:text-indigo-800 hover:bg-indigo-50/70 border-transparent'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>360° BMIT</span>
              </button>

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

              {/* AI Tools */}
              <button
                onClick={() => onNavigate('/staff/aitools')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                  currentPortal === 'STAFF' && activeTab === 'aitools'
                    ? 'bg-teal-50 text-teal-800 border-teal-200 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>AI Tools</span>
              </button>

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
            <nav className="hidden sm:flex items-center gap-1.5 flex-1 min-w-0 text-xs">
              {[
                { tab: 'gaps'     as StudentTabType, route: '/student/gaps',     label: 'My Learning Gaps & Mastery', icon: <Target className="w-3.5 h-3.5 text-purple-600" />, cls: 'bg-purple-50 text-purple-800 border-purple-200' },
                { tab: 'intelligence' as StudentTabType, route: '/student/intelligence', label: 'My 360° BMIT, VAK & Career', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600" />, cls: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
                { tab: 'voicelab' as StudentTabType, route: '/student/voicelab', label: 'VoiceLab Speech AI', icon: <Mic className="w-3.5 h-3.5 text-teal-600" />, cls: 'bg-teal-50 text-teal-800 border-teal-200' },
                { tab: 'voice'    as StudentTabType, route: '/student/voice',    label: 'Read Aloud',          icon: <Mic className="w-3.5 h-3.5 text-rose-500" />,  cls: 'bg-rose-50 text-rose-800 border-rose-200'  },
                { tab: 'homework' as StudentTabType, route: '/student/homework', label: 'Homework Studio',      icon: <FileCheck className="w-3.5 h-3.5 text-teal-600" />, cls: 'bg-teal-50 text-teal-800 border-teal-200' },
              ].map(item => (
                <button
                  key={item.tab}
                  onClick={() => onNavigate(item.route)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all whitespace-nowrap ${
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
          <div className="flex items-center gap-2 ml-auto flex-shrink-0 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-sm shrink-0">
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
                className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium truncate max-w-[220px]"
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
              className={`${currentPortal === 'STUDENT' ? 'sm:hidden' : 'lg:hidden'} p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors`}
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Collapsible Mobile / Tablet Navigation Drawer */}
      {mobileNavOpen && (
        <div className={`${currentPortal === 'STUDENT' ? 'sm:hidden' : 'lg:hidden'} border-t border-slate-200/80 bg-white px-4 py-3 space-y-3 max-h-[75vh] overflow-y-auto shadow-lg`}>
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
                { tab: 'gaps' as StudentTabType, route: '/student/gaps', label: 'My Learning Gaps & Mastery', icon: <Target className="w-3.5 h-3.5 text-purple-600" />, cls: 'bg-purple-50 text-purple-800 border-purple-200' },
                { tab: 'intelligence' as StudentTabType, route: '/student/intelligence', label: 'My 360° BMIT, VAK & Career', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600" />, cls: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
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
