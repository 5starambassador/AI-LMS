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
  LayoutGrid
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
  | 'myspace'
  | 'insights'
  | 'exams'
  | 'timetable'
  | 'noticeboard'
  | 'reportcard'
  | 'leaves'
  | 'fees';

export type StudentTabType = 'voicelab' | 'voice' | 'homework';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  studentTab: StudentTabType;
  setStudentTab: (tab: StudentTabType) => void;
  currentUser: User | null;
  currentPortal: 'STAFF' | 'STUDENT' | 'SUPERADMIN';
  setCurrentPortal: (portal: 'STAFF' | 'STUDENT' | 'SUPERADMIN') => void;
  onNavigate: (route: string) => void;
}

const ADMIN_ROLES = ['role-ach-superadmin', 'role-ach-manager', 'role-ach-principal', 'role-ach-curriculum'];

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
  const activeItem = group.items.find(i => i.tab === activeTab);

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
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
          isGroupActive
            ? `${group.activeColor} border shadow-xs`
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
        }`}
      >
        <span className={isGroupActive ? '' : group.color}>{group.icon}</span>
        <span>{isGroupActive ? (activeItem?.label ?? group.label) : group.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-2xl shadow-lg border border-slate-200/80 py-1.5 z-50">
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
  onNavigate
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 gap-4">

          {/* Brand */}
          <button
            onClick={() => onNavigate('/staff/home')}
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-xs font-bold text-base">
              ⚡
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">achariya</span>
              <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 font-black px-1.5 py-0.5 rounded-md tracking-wider">
                AI ONE
              </span>
            </div>
          </button>

          {/* Portal switcher — hidden for students; Trust HQ only for super-admins */}
          {currentUser?.roleKey !== 'role-ach-student' && currentUser?.roleKey !== 'role-ach-parent' && (
            <div className="hidden md:flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200/80 text-xs flex-shrink-0">
              <button
                onClick={() => onNavigate('/staff/home')}
                className={`px-3 py-1.5 rounded-[10px] font-semibold transition-all ${
                  currentPortal === 'STAFF'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Educator LMS
              </button>
              <button
                onClick={() => onNavigate('/student/voicelab')}
                className={`px-3 py-1.5 rounded-[10px] font-semibold transition-all flex items-center gap-1 ${
                  currentPortal === 'STUDENT'
                    ? 'bg-white text-teal-700 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>🎙️</span><span>VoiceLab AI</span>
              </button>
              {(currentUser?.roleKey === 'role-ach-superadmin' || currentUser?.roleKey === 'role-ach-manager') && (
                <button
                  onClick={() => onNavigate('/superadmin')}
                  className={`px-3 py-1.5 rounded-[10px] font-semibold transition-all ${
                    currentPortal === 'SUPERADMIN'
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Trust HQ
                </button>
              )}
            </div>
          )}

          {/* Staff nav */}
          {currentPortal === 'STAFF' && (
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {/* Home — always direct */}
              <button
                onClick={() => onNavigate('/staff/home')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  activeTab === 'home'
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
                <DropdownMenu key={group.label} group={group} activeTab={activeTab} onNavigate={onNavigate} />
              ))}

              {/* ── Divider: academic / utility ── */}
              <span className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />

              {/* Standalone Leave for teachers (not in Operations group) */}
              {currentUser && !ADMIN_ROLES.includes(currentUser.roleKey) && (
                <button
                  onClick={() => onNavigate('/staff/leaves')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    activeTab === 'leaves'
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
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  activeTab === 'aitools'
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
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  activeTab === 'myspace'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span>My Space</span>
              </button>
            </nav>
          )}

          {/* Student nav */}
          {currentPortal === 'STUDENT' && (
            <nav className="hidden sm:flex items-center gap-2 flex-1 text-xs">
              {[
                { tab: 'voicelab' as StudentTabType, route: '/student/voicelab', label: 'VoiceLab Speech AI', icon: <Mic className="w-3.5 h-3.5 text-teal-600" />, cls: 'bg-teal-50 text-teal-800 border-teal-200' },
                { tab: 'voice'    as StudentTabType, route: '/student/voice',    label: 'Read Aloud',          icon: <Mic className="w-3.5 h-3.5 text-rose-500" />,  cls: 'bg-rose-50 text-rose-800 border-rose-200'  },
                { tab: 'homework' as StudentTabType, route: '/student/homework', label: 'Homework Studio',      icon: <FileCheck className="w-3.5 h-3.5 text-teal-600" />, cls: 'bg-teal-50 text-teal-800 border-teal-200' },
              ].map(item => (
                <button
                  key={item.tab}
                  onClick={() => onNavigate(item.route)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold border transition-all ${
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

          {/* Right: campus + user */}
          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
            <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
              <span className="font-semibold text-slate-700 truncate max-w-[140px]">
                {currentUser?.campus?.name || 'Achariya World Class Academy'}
              </span>
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-sm">
                {currentPortal === 'SUPERADMIN' ? 'R' : currentPortal === 'STUDENT' ? 'A' : (currentUser?.fullName?.[0] ?? 'U')}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold leading-tight text-slate-900">
                  {currentPortal === 'SUPERADMIN'
                    ? 'Dr. V. Rajakumaran'
                    : currentPortal === 'STUDENT'
                    ? 'Aarav Sundaram'
                    : currentUser?.fullName || '—'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {currentPortal === 'SUPERADMIN'
                    ? 'Super Admin · Trust President'
                    : currentPortal === 'STUDENT'
                    ? 'Scholar · Grade 5A'
                    : currentUser?.roleName || 'Staff'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
