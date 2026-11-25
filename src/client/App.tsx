import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Header, ActiveTabType, StudentTabType } from './components/Header';
import { QrStudentPicker } from './components/QrStudentPicker';
import { ShieldAlert } from 'lucide-react';

const StaffDashboard = React.lazy(() => import('./components/StaffDashboard').then(m => ({ default: m.StaffDashboard })));
const AiToolsHub = React.lazy(() => import('./components/AiToolsHub').then(m => ({ default: m.AiToolsHub })));
const MySpaceHub = React.lazy(() => import('./components/MySpaceHub').then(m => ({ default: m.MySpaceHub })));
const LsrStudentPortal = React.lazy(() => import('./components/LsrStudentPortal').then(m => ({ default: m.LsrStudentPortal })));
const StudentHomeworkPortal = React.lazy(() => import('./components/StudentHomeworkPortal').then(m => ({ default: m.StudentHomeworkPortal })));
const AttendanceHub = React.lazy(() => import('./components/AttendanceHub').then(m => ({ default: m.AttendanceHub })));
const HomeworkHub = React.lazy(() => import('./components/HomeworkHub').then(m => ({ default: m.HomeworkHub })));
const VoiceActivity = React.lazy(() => import('./components/VoiceActivity').then(m => ({ default: m.VoiceActivity })));
const TimetableHub = React.lazy(() => import('./components/TimetableHub').then(m => ({ default: m.TimetableHub })));
const NoticeboardHub = React.lazy(() => import('./components/NoticeboardHub').then(m => ({ default: m.NoticeboardHub })));
const LeaveHub = React.lazy(() => import('./components/LeaveHub').then(m => ({ default: m.LeaveHub })));
const FeeHub = React.lazy(() => import('./components/FeeHub').then(m => ({ default: m.FeeHub })));
const ParentPortal = React.lazy(() => import('./components/ParentPortal').then(m => ({ default: m.ParentPortal })));

const CurriculumHub = React.lazy(() => import('./components/CurriculumHub').then(m => ({ default: m.CurriculumHub })));
const LmsStudio = React.lazy(() => import('./components/LmsStudio').then(m => ({ default: m.LmsStudio })));
const WorksheetCanvas = React.lazy(() => import('./components/WorksheetCanvas').then(m => ({ default: m.WorksheetCanvas })));
const ScoreInsights = React.lazy(() => import('./components/ScoreInsights').then(m => ({ default: m.ScoreInsights })));
const ExamHub = React.lazy(() => import('./components/ExamHub').then(m => ({ default: m.ExamHub })));
const ReportCardHub = React.lazy(() => import('./components/ReportCardHub').then(m => ({ default: m.ReportCardHub })));
const ExamBuilderStudio = React.lazy(() => import('./components/ExamBuilderStudio').then(m => ({ default: m.ExamBuilderStudio })));
const LearningGapStudio = React.lazy(() => import('./components/LearningGapStudio').then(m => ({ default: m.LearningGapStudio })));
const StudentIntelligenceStudio = React.lazy(() => import('./components/StudentIntelligenceStudio').then(m => ({ default: m.StudentIntelligenceStudio })));
const SuperAdminPanel = React.lazy(() => import('./components/SuperAdminPanel').then(m => ({ default: m.SuperAdminPanel })));

function AppShell() {
  const { user: currentUser, isLoading, isAuthenticated, logout, loginWithToken } = useAuthContext();
  const [currentPortal, setCurrentPortal] = useState<'STAFF' | 'STUDENT' | 'SUPERADMIN'>('STAFF');
  const [activeTab, setActiveTab] = useState<ActiveTabType>('home');
  const [studentTab, setStudentTab] = useState<StudentTabType>('voicelab');
  const [accessDeniedAlert, setAccessDeniedAlert] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // URL Routing Engine: Maps path string to State
  const applyRoute = (pathname: string) => {
    const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';

    if (cleanPath.startsWith('/superadmin')) {
      setCurrentPortal('SUPERADMIN');
    } else if (cleanPath.startsWith('/student')) {
      setCurrentPortal('STUDENT');
      if (cleanPath === '/student/aitools') {
        // AI Tools Suite is an educator/faculty module; redirect scholars to AI LMS
        window.history.replaceState(null, '', '/student/lms');
        setStudentTab('lms');
      } else if (cleanPath === '/student/lms') {
        setStudentTab('lms');
      } else if (cleanPath === '/student/homework') {
        setStudentTab('homework');
      } else if (cleanPath === '/student/voice') {
        setStudentTab('voice');
      } else if (cleanPath === '/student/gaps' || cleanPath === '/student/learning-gaps') {
        setStudentTab('gaps');
      } else if (cleanPath === '/student/intelligence') {
        setStudentTab('intelligence');
      } else {
        setStudentTab('voicelab');
      }
    } else {
      setCurrentPortal('STAFF');
      if (cleanPath === '/staff/lms' || cleanPath === '/lms') {
        setActiveTab('lms');
      } else if (cleanPath === '/staff/attendance' || cleanPath === '/attendance') {
        setActiveTab('attendance');
      } else if (cleanPath === '/staff/homework' || cleanPath === '/homework') {
        setActiveTab('homework');
      } else if (cleanPath === '/staff/worksheet' || cleanPath === '/worksheet') {
        setActiveTab('worksheet');
      } else if (cleanPath === '/staff/exam-builder' || cleanPath === '/exam-builder') {
        setActiveTab('exam-builder');
      } else if (cleanPath === '/staff/learning-gaps' || cleanPath === '/learning-gaps') {
        setActiveTab('learning-gaps');
      } else if (cleanPath === '/staff/student-intelligence' || cleanPath === '/student-intelligence') {
        setActiveTab('student-intelligence');
      } else if (cleanPath === '/staff/aitools' || cleanPath === '/aitools') {
        setActiveTab('aitools');
      } else if (cleanPath === '/staff/myspace' || cleanPath === '/myspace') {
        setActiveTab('myspace');
      } else if (cleanPath === '/staff/resources' || cleanPath === '/resources') {
        setActiveTab('resources');
      } else if (cleanPath === '/staff/insights' || cleanPath === '/insights') {
        setActiveTab('insights');
      } else if (cleanPath === '/staff/exams' || cleanPath === '/exams') {
        setActiveTab('exams');
      } else if (cleanPath === '/staff/timetable' || cleanPath === '/timetable') {
        setActiveTab('timetable');
      } else if (cleanPath === '/staff/noticeboard' || cleanPath === '/noticeboard') {
        setActiveTab('noticeboard');
      } else if (cleanPath === '/staff/reportcard' || cleanPath === '/reportcard') {
        setActiveTab('reportcard');
      } else if (cleanPath === '/staff/leaves' || cleanPath === '/leaves') {
        setActiveTab('leaves');
      } else if (cleanPath === '/staff/fees' || cleanPath === '/fees') {
        setActiveTab('fees');
      } else {
        setActiveTab('home');
      }
    }
  };

  // Synchronize with browser history on mount and on popstate
  useEffect(() => {
    applyRoute(window.location.pathname);

    const handlePopState = () => {
      applyRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Role-based portal & route enforcement — redirect to the authorized portal/route for the logged-in role
  useEffect(() => {
    if (!currentUser) return;
    const { roleKey } = currentUser;
    const ADMIN_ROLES = ['role-ach-superadmin', 'role-ach-manager', 'role-ach-principal'];
    const SUPERADMIN_ROLES = ['role-ach-superadmin', 'role-ach-manager'];

    if (roleKey === 'role-ach-student' && currentPortal !== 'STUDENT') {
      navigateTo('/student/voicelab');
    } else if (roleKey === 'role-ach-parent' && currentPortal !== 'STUDENT') {
      // Parents use the token-based /parent/<token> route; redirect to login
      navigateTo('/student/voicelab');
    } else if (currentPortal === 'SUPERADMIN' && !SUPERADMIN_ROLES.includes(roleKey)) {
      setAccessDeniedAlert('Access restricted: Trust HQ requires Super Admin or Trust Manager privileges.');
      navigateTo('/staff/home');
    } else if (
      currentPortal === 'STAFF' &&
      ['timetable', 'noticeboard', 'fees'].includes(activeTab) &&
      !ADMIN_ROLES.includes(roleKey)
    ) {
      setAccessDeniedAlert('Access restricted: Campus Operations modules require Administrator or Principal privileges.');
      navigateTo('/staff/home');
    }
  }, [currentUser?.roleKey, currentPortal, activeTab]);

  // Programmatic Navigator
  const navigateTo = (route: string) => {
    if (window.location.pathname !== route) {
      window.history.pushState(null, '', route);
    }
    applyRoute(route);
  };

  const handleLogout = () => {
    logout();
  };

  // Parent portal: public route — no auth needed
  const parentMatch = window.location.pathname.match(/^\/parent\/([^/]+)/);
  if (parentMatch) {
    return (
      <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-xs font-medium text-slate-400">Loading Parent Portal…</div>}>
        <ParentPortal token={parentMatch[1]} />
      </React.Suspense>
    );
  }

  // QR login: students land on /qr/<token> without prior auth
  const qrMatch = window.location.pathname.match(/^\/qr\/([^/]+)/);
  if (qrMatch) {
    return (
      <QrStudentPicker
        token={qrMatch[1]}
        onLoggedIn={(token, user) => {
          loginWithToken(token, user as Parameters<typeof loginWithToken>[1]);
          window.history.replaceState(null, '', '/student/voicelab');
        }}
      />
    );
  }

  // Show loading spinner while session is being restored
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-5">
          <div className="relative mx-auto w-14 h-14">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-lg">
              ⚡
            </div>
            <div className="absolute -inset-1.5 rounded-[1.25rem] border-2 border-teal-400/40 animate-ping" style={{ animationDuration: '1.4s' }} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-700" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}>Achariya AI ONE</p>
            <p className="text-xs text-slate-400 font-medium">Starting enterprise workspace…</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <LoginPage
        defaultPortal={window.location.pathname.startsWith('/student') ? 'STUDENT' : 'STAFF'}
        onLoginSuccess={() => {
          applyRoute(window.location.pathname);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="bg-amber-400 text-slate-950 px-4 py-1.5 text-xs font-black text-center flex items-center justify-center gap-2 shadow-xs sticky top-0 z-[60]">
          <span>⚡ Offline Mode Active: Working with cached lessons. Real-time cloud sync will resume when connection returns.</span>
        </div>
      )}

      {/* Light & Modern Navigation Header with Deep-Routing */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => navigateTo(`/staff/${tab}`)}
        studentTab={studentTab}
        setStudentTab={(sTab) => navigateTo(`/student/${sTab}`)}
        currentUser={currentUser}
        currentPortal={currentPortal}
        setCurrentPortal={(portal) => {
          if (portal === 'STAFF') navigateTo('/staff/home');
          else if (portal === 'STUDENT') navigateTo('/student/voicelab');
          else navigateTo('/superadmin');
        }}
        onNavigate={navigateTo}
        onLogout={handleLogout}
      />

      {/* Domain Partitioning Access-Denied Alert Notification */}
      {accessDeniedAlert && (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="p-4 bg-rose-50/90 border border-rose-200 text-rose-900 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-xs animate-in fade-in">
            <div className="flex items-center space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{accessDeniedAlert}</span>
            </div>
            <div className="flex items-center space-x-2">
              {(currentUser.roleKey === 'role-ach-student' || currentUser.roleKey === 'role-ach-parent') && (
                <button
                  onClick={() => {
                    navigateTo('/student/voicelab');
                    setAccessDeniedAlert(null);
                  }}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-xs"
                >
                  Switch to VoiceLab AI Portal →
                </button>
              )}
              <button
                onClick={() => setAccessDeniedAlert(null)}
                className="text-rose-400 hover:text-rose-700 ml-2 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Body: Routed Standalone Pages */}
      <main className="flex-1 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <React.Suspense fallback={
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Loading workspace…</span>
          </div>
        }>
          {/* VIEW 1: EDUCATOR & FACULTY PORTAL (Comprehensive Standalone Workspaces) */}
          {currentPortal === 'STAFF' && (
            <div>
              {activeTab === 'home' && <StaffDashboard onNavigate={navigateTo} />}
              {activeTab === 'lms' && (
                <LmsStudio
                  onNavigateToGaps={() => navigateTo('/staff/learning-gaps')}
                  onNavigateToIntelligence={() => navigateTo('/staff/student-intelligence')}
                />
              )}
              {activeTab === 'resources' && <CurriculumHub />}
              {activeTab === 'homework' && <HomeworkHub />}
              {activeTab === 'attendance' && <AttendanceHub />}
              {activeTab === 'worksheet' && (
                <WorksheetCanvas
                  onAssignAsHomework={(title, subject) => {
                    navigateTo('/staff/homework');
                  }}
                />
              )}
              {activeTab === 'exam-builder' && (
                <ExamBuilderStudio
                  onBackToHub={() => navigateTo('/staff/aitools')}
                  onExamGenerated={() => navigateTo('/staff/exams')}
                />
              )}
              {activeTab === 'learning-gaps' && (
                <LearningGapStudio
                  onNavigateToIntelligence={() => navigateTo('/staff/student-intelligence')}
                  onNavigateToLms={() => navigateTo('/staff/lms')}
                />
              )}
              {activeTab === 'student-intelligence' && (
                <StudentIntelligenceStudio
                  onNavigateToGaps={() => navigateTo('/staff/learning-gaps')}
                  onNavigateToLms={() => navigateTo('/staff/lms')}
                />
              )}
              {activeTab === 'aitools' && (
                <AiToolsHub
                  isStudentView={false}
                  onNavigate={navigateTo}
                  onNavigateToExamBuilder={() => navigateTo('/staff/exam-builder')}
                />
              )}
              {activeTab === 'myspace' && <MySpaceHub />}
              {activeTab === 'insights' && <ScoreInsights />}
              {activeTab === 'exams' && <ExamHub />}
              {activeTab === 'timetable' && <TimetableHub />}
              {activeTab === 'noticeboard' && <NoticeboardHub />}
              {activeTab === 'reportcard' && <ReportCardHub />}
              {activeTab === 'leaves' && <LeaveHub />}
              {activeTab === 'fees' && <FeeHub />}
            </div>
          )}

          {/* VIEW 2: STUDENT PORTAL (AI LMS, VoiceLab, Gaps & Portfolio) */}
          {currentPortal === 'STUDENT' && (
            <div>
              {studentTab === 'lms' && (
                <LmsStudio
                  initialStudentMode={true}
                  onNavigateToGaps={() => navigateTo('/student/gaps')}
                  onNavigateToIntelligence={() => navigateTo('/student/intelligence')}
                />
              )}
              {studentTab === 'voicelab' && <LsrStudentPortal />}
              {studentTab === 'voice' && <VoiceActivity />}
              {studentTab === 'homework' && (
                <StudentHomeworkPortal
                  onNavigateToWorksheet={() => navigateTo('/student/worksheet')}
                />
              )}
              {studentTab === 'worksheet' && (
                <WorksheetCanvas
                  onAssignAsHomework={() => navigateTo('/student/homework')}
                />
              )}
              {studentTab === 'gaps' && (
                <LearningGapStudio
                  initialStudentMode={true}
                  onNavigateToIntelligence={() => navigateTo('/student/intelligence')}
                  onNavigateToLms={() => navigateTo('/student/lms')}
                />
              )}
              {studentTab === 'intelligence' && (
                <StudentIntelligenceStudio
                  initialStudentMode={true}
                  onNavigateToGaps={() => navigateTo('/student/gaps')}
                  onNavigateToLms={() => navigateTo('/student/lms')}
                />
              )}
            </div>
          )}

          {/* VIEW 3: SUPER ADMIN TRUST HQ */}
          {currentPortal === 'SUPERADMIN' && <SuperAdminPanel />}
        </React.Suspense>
      </main>

      {/* Footer — ultra-minimal, brand-anchored */}
      <footer className="border-t border-slate-100 py-3.5 mt-auto bg-white/60 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-600" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', letterSpacing: '-0.01em' }}>Achariya AI ONE</span>
            <span className="text-slate-200">·</span>
            <span>
              {currentUser.scope === 'GLOBAL'
                ? 'Trust Umbrella · All Campuses'
                : currentUser.scope === 'REGIONAL'
                ? 'Regional Umbrella · Multi-Campus'
                : currentUser.campus?.name || 'Achariya World Class Academy'}
            </span>
            <span className="hidden sm:inline text-slate-200">·</span>
            <span className="hidden sm:inline text-emerald-600 font-medium">Phase A LMS Live</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
          >
            Sign out
          </button>
        </div>
      </footer>
    </div>
  );
}

export const App: React.FC = () => (
  <AuthProvider>
    <AppShell />
  </AuthProvider>
);
