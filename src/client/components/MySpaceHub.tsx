import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Video, 
  CheckCircle, 
  X, 
  Play, 
  Download, 
  Award, 
  BookOpen, 
  ChevronRight, 
  Clock, 
  Star, 
  Sparkles, 
  FileText, 
  Send, 
  BarChart2, 
  CalendarDays, 
  Check, 
  RefreshCw 
} from 'lucide-react';

export const MySpaceHub: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'pd' | 'ppg' | 'walkthrough' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [verifiedCert, setVerifiedCert] = useState<{ title: string; code: string; date: string } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // PD Modal State
  const [activePdTab, setActivePdTab] = useState<'courses' | 'certifications'>('courses');
  const [selectedCourseVideo, setSelectedCourseVideo] = useState<string | null>(null);

  // PPG Planner State
  const [selectedSubject, setSelectedSubject] = useState<'Mathematics' | 'English' | 'Science'>('Mathematics');
  const [rebalancedNotice, setRebalancedNotice] = useState(false);

  // Walkthrough State
  const [walkthroughTab, setWalkthroughTab] = useState<'audit' | 'history'>('audit');
  const [auditScores, setAuditScores] = useState({
    instructional: 5,
    engagement: 4,
    formative: 5,
    atmosphere: 5
  });
  const [strengths, setStrengths] = useState('Superb use of Concrete-Pictorial-Abstract (CPA) manipulative lab for angle classification. Scholars demonstrated active peer learning.');
  const [growthAreas, setGrowthAreas] = useState('Allow 30 seconds more wait-time before calling on eager volunteers to empower reflective learners.');
  const [auditSubmitted, setAuditSubmitted] = useState(false);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">My Space</h2>
          <p className="text-xs text-slate-500">Professional Development · Pacing Guides · Quality Observation Audits</p>
        </div>
      </div>

      {/* 3 Interactive Cards - Ultra Light, Clean & Unique
          - Delicate top accent border (border-t-4 border-t-teal-600)
          - Circular icon with teal ring border (border-2 border-teal-500)
          - Soft, luminous white surfaces with subtle shadows
          - Explicit high-visibility launch buttons on every card
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Professional Development */}
        <div
          onClick={() => setActiveModal('pd')}
          className="bg-white rounded-3xl border border-slate-200/90 border-t-4 border-t-teal-600 shadow-xs hover:shadow-lg hover:border-teal-300 transition-all duration-200 cursor-pointer p-8 text-center flex flex-col items-center justify-between group transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-teal-500 bg-teal-50/60 flex items-center justify-center text-teal-700 mb-5 group-hover:scale-105 transition-transform shadow-xs">
              <GraduationCap className="w-10 h-10 text-teal-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              Professional Development
            </h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              Access your 50-hour mandatory teacher development modules, masterclasses and verified CPD credentials.
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveModal('pd'); }}
            className="mt-6 w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Launch PD Portal</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Planner (PPG) */}
        <div
          onClick={() => setActiveModal('ppg')}
          className="bg-white rounded-3xl border border-slate-200/90 border-t-4 border-t-teal-600 shadow-xs hover:shadow-lg hover:border-teal-300 transition-all duration-200 cursor-pointer p-8 text-center flex flex-col items-center justify-between group transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-teal-500 bg-teal-50/60 flex items-center justify-center text-teal-700 mb-5 group-hover:scale-105 transition-transform shadow-xs">
              <Calendar className="w-10 h-10 text-teal-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              Planner (PPG)
            </h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              Create and manage your period plans efficiently with automated state holiday rebalancing and buffer control.
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveModal('ppg'); }}
            className="mt-6 w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Launch PPG Planner</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Walkthrough */}
        <div
          onClick={() => setActiveModal('walkthrough')}
          className="bg-white rounded-3xl border border-slate-200/90 border-t-4 border-t-teal-600 shadow-xs hover:shadow-lg hover:border-teal-300 transition-all duration-200 cursor-pointer p-8 text-center flex flex-col items-center justify-between group transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-teal-500 bg-teal-50/60 flex items-center justify-center text-teal-700 mb-5 group-hover:scale-105 transition-transform shadow-xs">
              <Video className="w-10 h-10 text-teal-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              Walkthrough
            </h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              View walkthrough quality analytics and fill classroom observation audit rubrics.
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveModal('walkthrough'); }}
            className="mt-6 w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Open Walkthrough Audit</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: PROFESSIONAL DEVELOPMENT (PD) PORTAL                             */}
      {/* ========================================================================= */}
      {activeModal === 'pd' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Light Clean Modal Header */}
            <div className="px-6 py-5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 shadow-xs">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                    <span>Achariya Educator CPD Hub</span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full font-bold">50-Hr Mandate</span>
                  </h3>
                  <p className="text-xs text-slate-500">Continuous Professional Development & Accredited Micro-Credentials</p>
                </div>
              </div>
              <button
                onClick={() => { setActiveModal(null); setSelectedCourseVideo(null); }}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            {/* Subnav Tabs */}
            <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center space-x-6 text-xs font-bold">
              <button
                onClick={() => setActivePdTab('courses')}
                className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
                  activePdTab === 'courses'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>My Active Courses (3)</span>
              </button>
              <button
                onClick={() => setActivePdTab('certifications')}
                className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
                  activePdTab === 'certifications'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Earned Credentials & Badges (4)</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {activePdTab === 'courses' && (
                <div className="space-y-4">
                  {/* Active Course 1 */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">In Progress (75%)</span>
                        <span className="text-[10px] text-slate-400">· 8 Hours Credit</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">NEP 2020 Pedagogical Framework & Experiential Learning</h4>
                      <p className="text-xs text-slate-600">Module 4: 5-Domain Holistic Progress Card (HPC) Micro-Observations & Formative Rubrics.</p>
                      
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                        <div className="bg-teal-600 h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCourseVideo('Module 4: 5-Domain Holistic Progress Card (HPC)')}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume Module 4</span>
                    </button>
                  </div>

                  {/* Active Course 2 */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">Completed (100%)</span>
                        <span className="text-[10px] text-slate-400">· 6 Hours Credit</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Achariya AI ONE: Interactive Classroom Digital Pedagogies</h4>
                      <p className="text-xs text-slate-600">Digital textbooks vector reader, flipbook annotations, and instant formative polls.</p>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setVerifiedCert({
                          title: 'Achariya AI ONE: Interactive Classroom Digital Pedagogies',
                          code: 'ACH-CPD-2026-091',
                          date: 'Nov 2026'
                        });
                        showToast('Verified CPD accreditation certificate opened.');
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Certificate</span>
                    </button>
                  </div>

                  {/* Active Course 3 */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">In Progress (40%)</span>
                        <span className="text-[10px] text-slate-400">· 10 Hours Credit</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Inquiry-Based Math & Science Instruction (Concrete-Pictorial-Abstract)</h4>
                      <p className="text-xs text-slate-600">Fostering higher-order mathematical reasoning through scholar-led discovery tasks.</p>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCourseVideo('Module 2: Inquiry-Based Math CPA Framework')}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume Module 2</span>
                    </button>
                  </div>

                  {/* Video Player */}
                  {selectedCourseVideo && (
                    <div className="p-5 rounded-2xl border border-teal-200 bg-teal-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Play className="w-4 h-4 text-teal-700 fill-current" />
                          <span className="text-xs font-bold text-slate-900">{selectedCourseVideo}</span>
                        </div>
                        <button
                          onClick={() => setSelectedCourseVideo(null)}
                          className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          ✕ Close Player
                        </button>
                      </div>
                      <div className="aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white p-6 text-center space-y-3 shadow-inner">
                        <Sparkles className="w-10 h-10 text-teal-400 animate-pulse" />
                        <div>
                          <p className="text-sm font-bold">Interactive Masterclass Video Streaming</p>
                          <p className="text-xs text-slate-400">Achariya Teacher Excellence Academy · 1080p Ultra HD</p>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-mono">14:22 / 20:00</span>
                          <button
                            onClick={() => showToast('Progress recorded to Achariya CPD database: +15 minutes logged!')}
                            className="px-3 py-1 bg-teal-600 hover:bg-teal-700 rounded-full text-[10px] font-bold text-white transition-colors"
                          >
                            Mark Step Complete ✓
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activePdTab === 'certifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'NEP 2020 Master Practitioner', date: 'Oct 14, 2026', code: 'ACH-CPD-2026-091', color: 'bg-teal-50 text-teal-700 border-teal-200' },
                    { title: 'CBSE Experiential Pedagogy Level 2', date: 'Sep 28, 2026', code: 'ACH-CPD-2026-044', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { title: 'Bloom\'s Taxonomy Question Design', date: 'Aug 19, 2026', code: 'ACH-CPD-2026-012', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { title: 'Oral Reading Fluency (ORF) Assessor', date: 'Jul 05, 2026', code: 'ACH-CPD-2026-003', color: 'bg-purple-50 text-purple-700 border-purple-200' }
                  ].map((cert, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs font-bold ${cert.color}`}>
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-xs font-bold text-slate-900">{cert.title}</h4>
                        <p className="text-[11px] text-slate-500 font-mono">ID: {cert.code}</p>
                        <p className="text-[10px] text-slate-400">Awarded on {cert.date}</p>
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              setVerifiedCert({ title: cert.title, code: cert.code, date: cert.date });
                              showToast(`Verified credential: ${cert.code}`);
                            }}
                            className="text-xs text-teal-700 hover:underline font-bold flex items-center space-x-1"
                          >
                            <span>Verify Credential</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span>Total CPD Hours Completed: <strong>38 / 50 Hours</strong> (76%)</span>
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors"
              >
                Close Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PLANNER (PPG - PEDAGOGICAL PACING GUIDE)                         */}
      {/* ========================================================================= */}
      {activeModal === 'ppg' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 shadow-xs">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                    <span>Curriculum Pacing Guide & Timetable Engine</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">On-Track</span>
                  </h3>
                  <p className="text-xs text-slate-500">Grade 5 · Academic Year 2026-2027 · Automated Holiday Rebalancing</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            {/* Subject Selector & Pacing Status */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-700">Subject:</span>
                {(['Mathematics', 'English', 'Science'] as const).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      selectedSubject === sub
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setRebalancedNotice(true);
                    setTimeout(() => setRebalancedNotice(false), 3000);
                  }}
                  className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 rounded-lg font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Run Holiday Rebalance</span>
                </button>
              </div>
            </div>

            {rebalancedNotice && (
              <div className="mx-6 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Holiday Rebalance Complete: 2 buffer periods dynamically adjusted for upcoming State Holiday. Pacing remains 100% on schedule!</span>
              </div>
            )}

            {/* Pacing Overview Statistics */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Periods</span>
                  <div className="text-xl font-black text-slate-900">160 Periods</div>
                  <span className="text-[11px] text-slate-500">Prescribed by CBSE syllabus</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Completed to Date</span>
                  <div className="text-xl font-black text-emerald-700">54 Periods</div>
                  <span className="text-[11px] text-emerald-600">33.75% of academic year</span>
                </div>
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                  <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">Buffer Available</span>
                  <div className="text-xl font-black text-sky-700">+4 Buffer Periods</div>
                  <span className="text-[11px] text-sky-600">Zero deficit / No extra classes needed</span>
                </div>
              </div>

              {/* Weekly Lesson Units Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Current Month: November 2026 Lesson Schedule</span>
                  <span className="text-slate-400 font-normal">Showing {selectedSubject}</span>
                </h4>

                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
                  {[
                    {
                      week: 'Week 1 (Nov 2 - Nov 6)',
                      topic: 'Unit 4: Geometry - Types of Angles & Classification',
                      periods: '5 Periods (Periods 50 - 54)',
                      pedagogy: 'Hands-on Protractor & Compass manipulative lab',
                      status: 'Completed',
                      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    },
                    {
                      week: 'Week 2 (Nov 9 - Nov 13)',
                      topic: 'Unit 5: Perimeter & Area of 2D Shapes',
                      periods: '5 Periods (Periods 55 - 59)',
                      pedagogy: 'Graph sheet square counting & formula induction',
                      status: 'In Progress (Period 56 Today)',
                      statusColor: 'bg-amber-100 text-amber-800 border-amber-200'
                    },
                    {
                      week: 'Week 3 (Nov 16 - Nov 20)',
                      topic: 'Unit 6: Fractions & Mixed Numbers Operations',
                      periods: '6 Periods (Periods 60 - 65)',
                      pedagogy: 'CPA model: Strip folding & number line representation',
                      status: 'Upcoming',
                      statusColor: 'bg-slate-100 text-slate-700 border-slate-200'
                    },
                    {
                      week: 'Week 4 (Nov 23 - Nov 27)',
                      topic: 'Unit 7: Decimals and Place Value Expansions',
                      periods: '5 Periods (Periods 66 - 70)',
                      pedagogy: 'Currency & metric measurement application tasks',
                      status: 'Upcoming',
                      statusColor: 'bg-slate-100 text-slate-700 border-slate-200'
                    }
                  ].map((row, i) => (
                    <div key={i} className="p-4 bg-white hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{row.week}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${row.statusColor}`}>{row.status}</span>
                        </div>
                        <p className="font-semibold text-slate-700">{row.topic}</p>
                        <p className="text-[11px] text-slate-400">Pedagogy: {row.pedagogy}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{row.periods}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Achariya Centralized Curriculum Pacing Engine v2.0</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors"
              >
                Close Planner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: WALKTHROUGH (CLASSROOM QUALITY OBSERVATION AUDIT)                 */}
      {/* ========================================================================= */}
      {activeModal === 'walkthrough' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 shadow-xs">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                    <span>Classroom Observation & Walkthrough Audit</span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full font-bold">Quality Standard</span>
                  </h3>
                  <p className="text-xs text-slate-500">Observation Form, Formative Feedback & Rubric Scores</p>
                </div>
              </div>
              <button
                onClick={() => { setActiveModal(null); setAuditSubmitted(false); }}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            {/* Subnav Tabs */}
            <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center space-x-6 text-xs font-bold">
              <button
                onClick={() => setWalkthroughTab('audit')}
                className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
                  walkthroughTab === 'audit'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Conduct New Audit Form</span>
              </button>
              <button
                onClick={() => setWalkthroughTab('history')}
                className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
                  walkthroughTab === 'history'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Audit History & Trend Analytics (4)</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {walkthroughTab === 'audit' && (
                <div className="space-y-5">
                  {auditSubmitted && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Observation Audit successfully recorded! Feedback has been indexed into the Academic Leadership Dashboard with composite score: 4.85 / 5.0.</span>
                    </div>
                  )}

                  {/* Audit Metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px]">FACULTY OBSERVED</span>
                      <span className="font-bold text-slate-900">Dr. Priya Sivaraman</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px]">GRADE & SECTION</span>
                      <span className="font-bold text-slate-900">Grade 5 - Studio A</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px]">SUBJECT / PERIOD</span>
                      <span className="font-bold text-slate-900">Mathematics · Period 2</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px]">OBSERVER ROLE</span>
                      <span className="font-bold text-slate-900">Dr. Rajesh K. Varma (Principal)</span>
                    </div>
                  </div>

                  {/* Rubric Rating Categories */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Evaluation Rubric Criteria (1 - 5 Stars)
                    </h4>

                    {[
                      {
                        key: 'instructional',
                        title: '1. Instructional Delivery & Concept Clarity',
                        desc: 'Lesson objectives stated clearly, concept introduced with real-world examples, clear instructions.'
                      },
                      {
                        key: 'engagement',
                        title: '2. Scholar Engagement & Active Participation',
                        desc: 'Scholars asking questions, peer discussion active, high ratio of student talk vs teacher talk.'
                      },
                      {
                        key: 'formative',
                        title: '3. Formative Checks & Scaffolding',
                        desc: 'Frequent checks for understanding, error correction without intimidation, timely scaffolding.'
                      },
                      {
                        key: 'atmosphere',
                        title: '4. Classroom Atmosphere & Positive Praise',
                        desc: 'Respectful rapport, constructive encouragement, seamless transition between activities.'
                      }
                    ].map((item) => {
                      const score = auditScores[item.key as keyof typeof auditScores];
                      return (
                        <div key={item.key} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="space-y-0.5 max-w-md">
                            <span className="font-bold text-slate-900">{item.title}</span>
                            <p className="text-[11px] text-slate-500">{item.desc}</p>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setAuditScores({ ...auditScores, [item.key]: star })}
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= score
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-200 fill-slate-100'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="font-bold text-slate-700 ml-2 font-mono">{score}/5</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Qualitative Feedback Textareas */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Key Strengths & Commendations:
                      </label>
                      <textarea
                        rows={2}
                        value={strengths}
                        onChange={(e) => setStrengths(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Opportunities for Growth & Action Steps:
                      </label>
                      <textarea
                        rows={2}
                        value={growthAreas}
                        onChange={(e) => setGrowthAreas(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => setAuditSubmitted(true)}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Classroom Observation Audit</span>
                    </button>
                  </div>
                </div>
              )}

              {walkthroughTab === 'history' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Recent Classroom Observation Audits (Average Score: 4.8 / 5.0)
                  </h4>

                  {[
                    { date: 'Nov 6, 2026', subject: 'Grade 5A - Math', observer: 'Campus Principal', score: '4.9 / 5.0', tag: 'Exemplary' },
                    { date: 'Oct 21, 2026', subject: 'Grade 5A - English', observer: 'Cluster Coordinator', score: '4.7 / 5.0', tag: 'Proficient' },
                    { date: 'Oct 04, 2026', subject: 'Grade 5A - Science', observer: 'Academic Director', score: '4.9 / 5.0', tag: 'Exemplary' },
                    { date: 'Sep 15, 2026', subject: 'Grade 5A - Math', observer: 'Campus Principal', score: '4.8 / 5.0', tag: 'Exemplary' }
                  ].map((rec, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{rec.subject}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">{rec.tag}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Observed by {rec.observer} on {rec.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {rec.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Achariya Academic Quality Assurance Framework</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verified Credential Modal */}
      {verifiedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-teal-700" />
                <h3 className="text-sm font-extrabold text-slate-900">Verified Credential</h3>
              </div>
              <button onClick={() => setVerifiedCert(null)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <div className="p-6 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-2">
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Achariya Institute of Teacher Training</span>
              <h4 className="text-sm font-black text-slate-900">{verifiedCert.title}</h4>
              <p className="text-xs text-slate-500">Awarded to Dr. Priya Sivaraman</p>
              <div className="pt-2">
                <span className="font-mono text-xs font-bold text-teal-900 bg-white px-3 py-1 rounded-lg border border-teal-200 shadow-xs inline-block">
                  {verifiedCert.code}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Verified digital certificate issued by Achariya Central Campus Academic Council · Status: Active & In Good Standing.
            </p>

            <button
              onClick={() => {
                showToast('Certificate PDF generated for print/download.');
                setVerifiedCert(null);
              }}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Close Verification
            </button>
          </div>
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
