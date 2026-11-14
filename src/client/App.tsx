import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Header, ActiveTabType, StudentTabType } from './components/Header';
import { StaffDashboard } from './components/StaffDashboard';
import { AiToolsHub } from './components/AiToolsHub';
import { MySpaceHub } from './components/MySpaceHub';
import { LsrStudentPortal } from './components/LsrStudentPortal';
import { StudentHomeworkPortal } from './components/StudentHomeworkPortal';
import { AttendanceHub } from './components/AttendanceHub';
import { HomeworkHub } from './components/HomeworkHub';
import { QrStudentPicker } from './components/QrStudentPicker';
import { VoiceActivity } from './components/VoiceActivity';
import { TimetableHub } from './components/TimetableHub';
import { NoticeboardHub } from './components/NoticeboardHub';
import { LeaveHub } from './components/LeaveHub';
import { FeeHub } from './components/FeeHub';
import { ParentPortal } from './components/ParentPortal';
import { ShieldAlert } from 'lucide-react';

const CurriculumHub = React.lazy(() => import('./components/CurriculumHub').then(m => ({ default: m.CurriculumHub })));
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

  // URL Routing Engine: Maps path string to State
  const applyRoute = (pathname: string) => {
    const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';

    if (cleanPath.startsWith('/superadmin')) {
      setCurrentPortal('SUPERADMIN');
    } else if (cleanPath.startsWith('/student')) {
      setCurrentPortal('STUDENT');
      if (cleanPath === '/student/homework') {
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
      if (cleanPath === '/staff/attendance' || cleanPath === '/attendance') {
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
    return <ParentPortal token={parentMatch[1]} />;
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading Achariya AI ONE…</p>
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
        <React.Suspense fallback={<div className="py-16 text-center text-xs font-semibold text-slate-400">Loading studio workspace…</div>}>
          {/* VIEW 1: EDUCATOR & FACULTY PORTAL (Comprehensive Standalone Workspaces) */}
          {currentPortal === 'STAFF' && (
            <div>
              {activeTab === 'home' && <StaffDashboard onNavigate={navigateTo} />}
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
                />
              )}
              {activeTab === 'student-intelligence' && (
                <StudentIntelligenceStudio
                  onNavigateToGaps={() => navigateTo('/staff/learning-gaps')}
                />
              )}
              {activeTab === 'aitools' && <AiToolsHub onNavigateToExamBuilder={() => navigateTo('/staff/exam-builder')} />}
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

          {/* VIEW 2: STUDENT PORTAL (VoiceLab & Homework Studio) */}
          {currentPortal === 'STUDENT' && (
            <div>
              {studentTab === 'voicelab' && <LsrStudentPortal />}
              {studentTab === 'voice' && <VoiceActivity />}
              {studentTab === 'homework' && (
                <StudentHomeworkPortal
                  onNavigateToWorksheet={() => navigateTo('/staff/worksheet')}
                />
              )}
              {studentTab === 'gaps' && (
                <LearningGapStudio
                  initialStudentMode={true}
                  onNavigateToIntelligence={() => navigateTo('/student/intelligence')}
                />
              )}
              {studentTab === 'intelligence' && (
                <StudentIntelligenceStudio
                  initialStudentMode={true}
                  onNavigateToGaps={() => navigateTo('/student/gaps')}
                />
              )}
            </div>
          )}

          {/* VIEW 3: SUPER ADMIN TRUST HQ */}
          {currentPortal === 'SUPERADMIN' && <SuperAdminPanel />}
        </React.Suspense>
      </main>

      {/* Footer Demonstration Helper Bar - Ultra Light & Minimalist */}
      <footer className="bg-white/80 border-t border-slate-200/80 py-4 mt-auto">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">Achariya AI ONE · Enterprise Learning Ecosystem</span>
            <span>·</span>
            <span>
              {currentUser.scope === 'GLOBAL'
                ? 'Trust Umbrella HQ · All Campuses'
                : currentUser.scope === 'REGIONAL'
                ? 'Regional Cluster Umbrella · Multi-Campus'
                : currentUser.campus?.name || 'Achariya World Class Academy'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-emerald-700 font-medium">Phase A Deep LMS Engine Live</span>
            <span>•</span>
            <button
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-800 font-semibold"
            >
              Sign Out
            </button>
          </div>
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
