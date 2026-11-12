import React from 'react';
import {
  Sparkles,
  Compass,
  BookOpen,
  Layers,
  Shield,
  School,
  User as UserIcon,
  FileCheck,
  CalendarCheck,
  PenTool,
  Home,
  Mic,
  GraduationCap,
  ClipboardList,
  CalendarDays,
  Megaphone,
  FileText,
  UmbrellaOff,
  CreditCard
} from 'lucide-react';
import { User } from '../types';

export type ActiveTabType =
  | 'home'
  | 'resources'
  | 'homework'
  | 'attendance'
  | 'worksheet'
  | 'aitools'
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
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Identity & Portal Selector */}
          <div className="flex items-center space-x-5">
            <div
              onClick={() => onNavigate('/staff/home')}
              className="flex items-center space-x-2.5 cursor-pointer select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-xs font-bold text-lg">
                ⚡
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                  achariya
                </span>
                <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 font-black px-1.5 py-0.5 rounded-md tracking-wider">
                  AI ONE
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden xl:inline">
                  v2.0
                </span>
              </div>
            </div>

            {/* Light Segmented Portal Switcher */}
            <div className="hidden md:flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200/80 text-xs">
              <button
                onClick={() => onNavigate('/staff/home')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  currentPortal === 'STAFF'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Educator LMS
              </button>
              <button
                onClick={() => onNavigate('/student/voicelab')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1 ${
                  currentPortal === 'STUDENT'
                    ? 'bg-white text-teal-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🎙️</span>
                <span>VoiceLab AI</span>
              </button>
              <button
                onClick={() => onNavigate('/superadmin')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  currentPortal === 'SUPERADMIN'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trust HQ
              </button>
            </div>
          </div>

          {/* Center: Comprehensive Light Navigation Tabs */}
          {currentPortal === 'STAFF' && (
            <nav className="hidden lg:flex items-center space-x-1 text-xs">
              <button
                onClick={() => onNavigate('/staff/home')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'home'
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('/staff/resources')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'resources'
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Curriculum
              </button>
              <button
                onClick={() => onNavigate('/staff/homework')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'homework'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Homework</span>
              </button>
              <button
                onClick={() => onNavigate('/staff/attendance')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'attendance'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Attendance</span>
              </button>
              <button
                onClick={() => onNavigate('/staff/worksheet')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'worksheet'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Worksheet</span>
              </button>
              <button
                onClick={() => onNavigate('/staff/aitools')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'aitools'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>AI Tools</span>
              </button>
              <button
                onClick={() => onNavigate('/staff/myspace')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'myspace'
                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>My Space</span>
              </button>
              <button
                onClick={() => onNavigate('/staff/insights')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'insights'
                    ? 'bg-violet-50 text-violet-800 border border-violet-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
                <span>Insights</span>
              </button>
              <button
                onClick={() => onNavigate('/staff/exams')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'exams'
                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5 text-indigo-600" />
                <span>Exams</span>
              </button>
              <button
                onClick={() => onNavigate('/staff/timetable')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'timetable'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5 text-teal-600" />
                <span>Timetable</span>
              </button>
              <button
                onClick={() => onNavigate('/staff/noticeboard')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'noticeboard'
                    ? 'bg-orange-50 text-orange-800 border border-orange-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5 text-orange-500" />
                <span>Notices</span>
              </button>
              <button
                onClick={() => onNavigate('/staff/reportcard')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'reportcard'
                    ? 'bg-violet-50 text-violet-800 border border-violet-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-violet-600" />
                <span>Reports</span>
              </button>
              <button
                onClick={() => onNavigate('/staff/leaves')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'leaves'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <UmbrellaOff className="w-3.5 h-3.5 text-rose-500" />
                <span>Leave</span>
              </button>
              <button
                onClick={() => onNavigate('/staff/fees')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'fees'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fees</span>
              </button>
            </nav>
          )}

          {/* Center: Student Navigation Tabs */}
          {currentPortal === 'STUDENT' && (
            <nav className="hidden sm:flex items-center space-x-2 text-xs">
              <button
                onClick={() => onNavigate('/student/voicelab')}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1.5 ${
                  studentTab === 'voicelab'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-teal-600" />
                <span>VoiceLab Speech AI</span>
              </button>
              <button
                onClick={() => onNavigate('/student/voice')}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1.5 ${
                  studentTab === 'voice'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-rose-500" />
                <span>Read Aloud</span>
              </button>
              <button
                onClick={() => onNavigate('/student/homework')}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1.5 ${
                  studentTab === 'homework'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Homework Studio</span>
              </button>
            </nav>
          )}

          {/* Right: Multi-Campus Badge & Active User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
              <span className="font-semibold text-slate-700">
                {currentUser?.campus?.name || 'Achariya World Class Academy'}
              </span>
            </div>

            <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-teal-100 border border-teal-200/80 flex items-center justify-center text-teal-800 font-bold text-sm shadow-xs">
                {currentPortal === 'SUPERADMIN' ? 'R' : currentPortal === 'STUDENT' ? 'A' : 'P'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold leading-tight text-slate-900">
                  {currentPortal === 'SUPERADMIN'
                    ? 'Dr. V. Rajakumaran'
                    : currentPortal === 'STUDENT'
                    ? 'Aarav Sundaram'
                    : currentUser?.fullName || 'Dr. Priya Sivaraman'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {currentPortal === 'SUPERADMIN'
                    ? 'Super Admin · Trust President'
                    : currentPortal === 'STUDENT'
                    ? 'Scholar · Grade 5A'
                    : 'Senior Faculty · Grade 5'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
