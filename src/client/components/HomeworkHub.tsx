import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Upload,
  Download,
  Filter,
  Check,
  Search,
  MessageSquare,
  Award,
  Sparkles
} from 'lucide-react';

interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  description: string;
  maxMarks: number;
  assignedDate: string;
  dueDate: string;
  status: 'ACTIVE' | 'DRAFT' | 'CLOSED';
  submittedCount: number;
  totalCount: number;
  gradedCount: number;
}

interface StudentSubmission {
  id: string;
  studentName: string;
  roll: string;
  submittedAt: string;
  status: 'EVALUATED' | 'SUBMITTED' | 'PENDING';
  score?: number;
  maxMarks: number;
  content: string;
  feedback?: string;
}

import { apiGet, apiPost } from '../lib/api';

export const HomeworkHub: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };
  const [activeSubject, setActiveSubject] = useState<'All' | 'English' | 'Mathematics' | 'Science'>('All');
  const [selectedHomework, setSelectedHomework] = useState<HomeworkItem | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(9.5);
  const [gradingFeedback, setGradingFeedback] = useState<string>('Exemplary observation of canopy flora! Clear, accurate vocabulary used throughout.');
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [gradeSavedToast, setGradeSavedToast] = useState(false);

  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    apiGet<{ homeworks: Array<{
      id: string; title: string; description: string; maxMarks: number;
      dueDate: string; createdAt: string; status?: string;
      subject?: { name: string };
      _count?: { submissions: number };
    }> }>('/api/assessment/homework')
      .then(data => {
        setHomeworkList(data.homeworks.map(hw => ({
          id: hw.id,
          title: hw.title,
          subject: hw.subject?.name ?? 'General',
          description: hw.description,
          maxMarks: hw.maxMarks,
          assignedDate: new Date(hw.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          dueDate: new Date(hw.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: (hw.status ?? 'ACTIVE') as HomeworkItem['status'],
          submittedCount: hw._count?.submissions ?? 0,
          totalCount: 28,
          gradedCount: 0
        })));
      })
      .catch(() => showToast('Could not load homework list'))
      .finally(() => setListLoading(false));
  }, []);

  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  const fetchSubmissions = async (hwId: string) => {
    setSubmissions([]);
    setSubmissionsLoading(true);
    try {
      const data = await apiGet<{ submissions: Array<{
        id: string; studentName: string; rollNumber: string;
        status: string; submittedText: string | null;
        score: number | null; feedback: string | null;
        submittedAt: string | null; maxMarks: number;
      }> }>(`/api/assessment/homework/${hwId}/submissions`);
      setSubmissions(data.submissions.map(s => ({
        id: s.id,
        studentName: s.studentName,
        roll: s.rollNumber,
        submittedAt: s.submittedAt
          ? new Date(s.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
          : 'Not yet submitted',
        status: (s.status === 'EVALUATED' ? 'EVALUATED' : s.status === 'SUBMITTED' ? 'SUBMITTED' : 'PENDING') as StudentSubmission['status'],
        score: s.score ?? undefined,
        maxMarks: s.maxMarks,
        content: s.submittedText ?? '',
        feedback: s.feedback ?? ''
      })));
    } catch {
      showToast('Could not load submissions — check your permissions');
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const liveSubmittedCount = submissions.filter(s => s.status !== 'PENDING').length;
  const liveGradedCount = submissions.filter(s => s.status === 'EVALUATED').length;

  const filteredHomeworks = activeSubject === 'All'
    ? homeworkList
    : homeworkList.filter(h => h.subject === activeSubject);

  const handleGradeSubmit = async () => {
    if (!selectedSubmission) return;
    try {
      await apiPost(`/api/assessment/homework/submissions/${selectedSubmission.id}/grade`, {
        score: gradingScore,
        feedback: gradingFeedback
      });
    } catch (err: any) {
      showToast(err?.message ?? 'Failed to save grade');
      return;
    }
    setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? {
      ...s,
      status: 'EVALUATED',
      score: gradingScore,
      feedback: gradingFeedback
    } : s));
    setGradeSavedToast(true);
    setTimeout(() => {
      setGradeSavedToast(false);
      setSelectedSubmission(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header with Subject Selector & Create Task Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60 mb-1.5">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Curriculum Assignments Hub</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Homework & Task Management</h1>
          <p className="text-xs text-slate-500">Author, publish, review and grade experiential homework tasks across Grade 5A</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Subject Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            {(['All', 'English', 'Mathematics', 'Science'] as const).map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubject(sub)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeSubject === sub ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAuthorModal(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Task</span>
          </button>
        </div>
      </div>

      {/* 2. Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {listLoading && (
          <div className="col-span-3 p-8 text-center text-sm text-slate-400 font-medium">Loading homework tasks…</div>
        )}
        {!listLoading && filteredHomeworks.length === 0 && (
          <div className="col-span-3 p-8 text-center text-sm text-slate-400 font-medium">No homework tasks found. Publish one above.</div>
        )}
        {filteredHomeworks.map(hw => (
          <div
            key={hw.id}
            onClick={() => { setSelectedHomework(hw); fetchSubmissions(hw.id); }}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              selectedHomework?.id === hw.id
                ? 'bg-teal-50/40 border-teal-500 shadow-md ring-2 ring-teal-200/50'
                : 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border ${
                  hw.subject === 'English'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : hw.subject === 'Mathematics'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-teal-50 text-teal-700 border-teal-200'
                }`}>
                  {hw.subject}
                </span>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  hw.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {hw.status}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{hw.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{hw.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Due: {hw.dueDate}</span>
                <span className="font-bold text-slate-800">{hw.maxMarks} Marks</span>
              </div>

              {/* Submission Progress Bar */}
              <div>
                {(() => {
                  const isSelected = selectedHomework?.id === hw.id;
                  const submitted = isSelected ? liveSubmittedCount : hw.submittedCount;
                  const graded = isSelected ? liveGradedCount : hw.gradedCount;
                  const total = hw.totalCount || 1;
                  return (
                    <>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                        <span>Submissions: {submitted} / {total}</span>
                        <span className="text-teal-700">{graded} Graded</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-600 h-full rounded-full transition-all"
                          style={{ width: `${(submitted / total) * 100}%` }}
                        ></div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Submissions Review & Grading Console */}
      {selectedHomework && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{selectedHomework.subject}</span>
                <h3 className="text-base font-extrabold text-slate-900">{selectedHomework.title} — Submissions</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Click any scholar submission to review written response and record score</p>
            </div>

            <button
              onClick={() => setSelectedHomework(null)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              Close Drawer ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Submissions List */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submitted Scholars:</span>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs max-h-96 overflow-y-auto">
                {submissionsLoading && (
                  <div className="p-6 text-center text-slate-400 text-xs">Loading submissions…</div>
                )}
                {!submissionsLoading && submissions.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs">No submissions yet for this task.</div>
                )}
                {submissions.map(sub => (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubmission(sub);
                      if (sub.score) setGradingScore(sub.score);
                      if (sub.feedback) setGradingFeedback(sub.feedback);
                    }}
                    className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between ${
                      selectedSubmission?.id === sub.id
                        ? 'bg-teal-50 border-l-4 border-l-teal-600'
                        : 'hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900">{sub.studentName}</span>
                      <p className="text-[11px] text-slate-400">{sub.roll} · {sub.submittedAt}</p>
                    </div>

                    <div>
                      {sub.status === 'EVALUATED' ? (
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                          {sub.score} / {sub.maxMarks}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                          Pending Grade
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Detail & Grading Form */}
            <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-4">
              {selectedSubmission ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm">{selectedSubmission.studentName}</span>
                      <p className="text-[11px] text-slate-500 font-mono">Roll: {selectedSubmission.roll}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{selectedSubmission.submittedAt}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Scholar Written Submission:</label>
                    <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-serif text-sm shadow-xs">
                      &ldquo;{selectedSubmission.content}&rdquo;
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Score Allocation (Max {selectedSubmission.maxMarks}):</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max={selectedSubmission.maxMarks}
                        value={gradingScore}
                        onChange={e => setGradingScore(parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-sm focus:outline-none focus:border-teal-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Quick Grade Rating:</label>
                      <div className="flex items-center space-x-1 pt-1">
                        {[10, 9.5, 9, 8.5, 8].map(sc => (
                          <button
                            key={sc}
                            type="button"
                            onClick={() => setGradingScore(sc)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                              gradingScore === sc ? 'bg-teal-600 text-white' : 'bg-white border text-slate-600'
                            }`}
                          >
                            {sc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pedagogical Feedback for Scholar:</label>
                    <textarea
                      rows={2}
                      value={gradingFeedback}
                      onChange={e => setGradingFeedback(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {gradeSavedToast && (
                      <span className="text-emerald-700 font-bold flex items-center space-x-1 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Grade & Feedback Saved!</span>
                      </span>
                    )}
                    <button
                      onClick={handleGradeSubmit}
                      className="ml-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                    >
                      Save Grade & Return to Scholar
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <FileCheck className="w-10 h-10 text-slate-300" />
                  <p>Select any scholar on the left to inspect and grade submission</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Publish New Task Modal */}
      {showAuthorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Publish Experiential Homework Task</h3>
              <button onClick={() => setShowAuthorModal(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Observational Botany: Leaf Vein Architecture"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject:</label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-200 bg-white">
                    <option>English & Oratory Arts</option>
                    <option>Conceptual Mathematics</option>
                    <option>Experiential Sciences</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Marks:</label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Instructions for Scholars:</label>
                <textarea
                  rows={3}
                  placeholder="Explain requirements, chapters to read, and observational steps..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Section:</label>
                  <input
                    type="text"
                    disabled
                    value="Grade 5 - Section A"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date:</label>
                  <input
                    type="date"
                    defaultValue="2026-11-15"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Task published successfully to Grade 5A scholars!');
                  setShowAuthorModal(false);
                }}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Publish Assignment to Class
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

