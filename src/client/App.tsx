import React, { useState, useEffect } from 'react';
import { Header, ActiveTabType, StudentTabType } from './components/Header';
import { StaffDashboard } from './components/StaffDashboard';
import { AiToolsHub } from './components/AiToolsHub';
import { MySpaceHub } from './components/MySpaceHub';
import { LsrStudentPortal } from './components/LsrStudentPortal';
import { StudentHomeworkPortal } from './components/StudentHomeworkPortal';
import { SuperAdminPanel } from './components/SuperAdminPanel';
import { AttendanceHub } from './components/AttendanceHub';
import { HomeworkHub } from './components/HomeworkHub';
import { WorksheetCanvas } from './components/WorksheetCanvas';
import { CurriculumHub } from './components/CurriculumHub';
import { User } from './types';
import { ShieldAlert, CheckCircle, ExternalLink, Sparkles, Building2, MapPin } from 'lucide-react';

export const App: React.FC = () => {
  const [currentPortal, setCurrentPortal] = useState<'STAFF' | 'STUDENT' | 'SUPERADMIN'>('STAFF');
  const [activeTab, setActiveTab] = useState<ActiveTabType>('home');
  const [studentTab, setStudentTab] = useState<StudentTabType>('voicelab');
  const [accessDeniedAlert, setAccessDeniedAlert] = useState<string | null>(null);

  // Seeded User Context (Dr. Priya Sivaraman)
  const [currentUser] = useState<User>({
    id: 'ach-usr-priya-01',
    userKey: 'ACH-TEA-1001',
    email: 'achariya@test.com',
    fullName: 'Dr. Priya Sivaraman',
    roleKey: 'role-ach-teacher',
    roleName: 'Senior Faculty',
    scope: 'ASSIGNED',
    campus: {
      id: 'ach-campus-pud-01',
      name: 'Achariya World Class Academy',
      schoolKey: 'ACH98402PUD2026',
      affiliation: 'CBSE Center of Excellence'
    },
    license: {
      basic: true,
      questionBank: true,
      hpcLicense: true,
      autoGrade: true,
      primeLicense: true,
      aiTools: true,
      score: true,
      compass: true,
      voice: true
    }
  });

  // URL Routing Engine: Maps path string to State
  const applyRoute = (pathname: string) => {
    const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';

    if (cleanPath.startsWith('/superadmin')) {
      setCurrentPortal('SUPERADMIN');
    } else if (cleanPath.startsWith('/student')) {
      setCurrentPortal('STUDENT');
      if (cleanPath === '/student/homework') {
        setStudentTab('homework');
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
      } else if (cleanPath === '/staff/aitools' || cleanPath === '/aitools') {
        setActiveTab('aitools');
      } else if (cleanPath === '/staff/myspace' || cleanPath === '/myspace') {
        setActiveTab('myspace');
      } else if (cleanPath === '/staff/resources' || cleanPath === '/resources') {
        setActiveTab('resources');
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

  // Programmatic Navigator
  const navigateTo = (route: string) => {
    if (window.location.pathname !== route) {
      window.history.pushState(null, '', route);
    }
    applyRoute(route);
  };

  // Domain Partitioning Demonstration Test
  const triggerDomainGatingTest = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student@achariya.in',
          password: 'Pass@1234',
          portal: 'STAFF'
        })
      });
      const data = await res.json();
      if (res.status === 403) {
        setAccessDeniedAlert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

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
      />

      {/* Domain Partitioning Access-Denied Alert Notification */}
      {accessDeniedAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="p-4 bg-rose-50/90 border border-rose-200 text-rose-900 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-xs animate-in fade-in">
            <div className="flex items-center space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{accessDeniedAlert}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  navigateTo('/student/voicelab');
                  setAccessDeniedAlert(null);
                }}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-xs"
              >
                Switch to VoiceLab AI Portal →
              </button>
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
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        {/* VIEW 1: EDUCATOR & FACULTY PORTAL (Comprehensive Standalone Workspaces) */}
        {currentPortal === 'STAFF' && (
          <div>
            {activeTab === 'home' && <StaffDashboard />}
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
            {activeTab === 'aitools' && <AiToolsHub />}
            {activeTab === 'myspace' && <MySpaceHub />}
          </div>
        )}

        {/* VIEW 2: STUDENT PORTAL (VoiceLab & Homework Studio) */}
        {currentPortal === 'STUDENT' && (
          <div>
            {studentTab === 'voicelab' && <LsrStudentPortal />}
            {studentTab === 'homework' && (
              <StudentHomeworkPortal
                onNavigateToWorksheet={() => navigateTo('/staff/worksheet')}
              />
            )}
          </div>
        )}

        {/* VIEW 3: SUPER ADMIN TRUST HQ */}
        {currentPortal === 'SUPERADMIN' && <SuperAdminPanel />}
      </main>

      {/* Footer Demonstration Helper Bar - Ultra Light & Minimalist */}
      <footer className="bg-white/80 border-t border-slate-200/80 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">Achariya AI ONE · Enterprise Learning Ecosystem</span>
            <span>·</span>
            <span>Puducherry Central Campus</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={triggerDomainGatingTest}
              className="text-teal-700 hover:text-teal-900 font-semibold underline"
            >
              Simulate Student Web Guard (403 Block)
            </button>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Phase A Deep LMS Engine Live</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
