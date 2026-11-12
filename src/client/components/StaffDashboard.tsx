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
  Heart
} from 'lucide-react';
import { Book, Homework, Quiz, Student } from '../types';
import { apiFetch } from '../lib/api';

export const StaffDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & States
  const [activeModal, setActiveModal] = useState<'bookReader' | 'rollCall' | 'createHomework' | 'studentDirectory' | null>(null);
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

      if (bRes.ok) setBooks((await bRes.json()).books || []);
      if (hRes.ok) setHomeworks((await hRes.json()).homeworks || []);
      if (qRes.ok) setQuizzes((await qRes.json()).quizzes || []);
      if (sRes.ok) setStudents((await sRes.json()).students || []);
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

      {/* 2. Daily Operations Quick Action Ribbon - Clean Light Aesthetic */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

            <div className="text-right pt-2">
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
