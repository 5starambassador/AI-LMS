import React, { useState } from 'react';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Upload,
  Sparkles,
  BookOpen,
  Award,
  Send,
  Camera,
  Paperclip,
  Check,
  Eye,
  HelpCircle,
  Calendar,
  PenTool,
  RotateCcw
} from 'lucide-react';

interface StudentHomework {
  id: string;
  title: string;
  subject: string;
  assignedBy: string;
  dueDate: string;
  maxMarks: number;
  status: 'PENDING' | 'SUBMITTED' | 'EVALUATED';
  instructions: string;
  rubricSummary: string;
  submittedAt?: string;
  submittedContent?: string;
  score?: number;
  feedback?: string;
  aiPreCheck?: {
    scoreEstimate: string;
    strengths: string[];
    improvements: string[];
  };
}

interface StudentHomeworkPortalProps {
  onNavigateToWorksheet?: () => void;
}

export const StudentHomeworkPortal: React.FC<StudentHomeworkPortalProps> = ({ onNavigateToWorksheet }) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'EVALUATED'>('ALL');
  const [selectedHomework, setSelectedHomework] = useState<StudentHomework | null>(null);
  const [writtenDraft, setWrittenDraft] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // AI Pre-Submission Copilot State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<{
    grammarScore: number;
    completeness: string;
    strengths: string[];
    suggestions: string[];
  } | null>(null);

  const [homeworkItems, setHomeworkItems] = useState<StudentHomework[]>([
    {
      id: 'hw-1',
      title: 'Descriptive Vocabulary: Canopy Ecosystems',
      subject: 'English & Oratory',
      assignedBy: 'Dr. Priya Sivaraman',
      dueDate: 'Nov 8, 2026 (In 2 Days)',
      maxMarks: 10,
      status: 'PENDING',
      instructions: 'Read Chapter 1 (Pages 4–8). List 5 sensory adjectives describing canopy flora, and write a 120-word descriptive reflection on how sunlight filters through emergent layers.',
      rubricSummary: 'Criteria: Sensory Adjectives (3 pts), Sentence Variety (4 pts), Vocabulary & Spelling (3 pts).'
    },
    {
      id: 'hw-2',
      title: 'Hands-on Protractor: Angle Measurement in Nature',
      subject: 'Mathematics (CPA)',
      assignedBy: 'Dr. Priya Sivaraman',
      dueDate: 'Nov 10, 2026 (In 4 Days)',
      maxMarks: 10,
      status: 'SUBMITTED',
      instructions: 'Identify three distinct angles in your natural surroundings (acute leaf vein, right tree branch, obtuse roof eaves). Measure with a protractor and describe.',
      rubricSummary: 'Criteria: Measurement Accuracy ±2° (4 pts), Angle Classification (3 pts), Real-world Connection (3 pts).',
      submittedAt: 'Nov 5, 2026 at 04:30 PM',
      submittedContent: '1. Leaf Vein: Measured at 38° — Acute angle.\n2. Wall Corner: Measured at 90° — Right angle.\n3. Tree Branch: Measured at 122° — Obtuse angle.'
    },
    {
      id: 'hw-3',
      title: 'Photosynthesis & Solar Photon Absorption',
      subject: 'Experiential Sciences',
      assignedBy: 'Dr. Priya Sivaraman',
      dueDate: 'Nov 2, 2026 (Completed)',
      maxMarks: 10,
      status: 'EVALUATED',
      instructions: 'Draw and explain the cross-section of a chloroplast cell showing stomata, light absorption by chlorophyll, and the chemical equation of photosynthesis.',
      rubricSummary: 'Criteria: Organelle Labeling (4 pts), Balanced Chemical Equation (3 pts), Conceptual Rigor (3 pts).',
      submittedAt: 'Nov 1, 2026 at 06:15 PM',
      submittedContent: 'Chloroplasts contain chlorophyll pigments that absorb blue and red photons from sunlight while reflecting green light. 6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂.',
      score: 9.5,
      feedback: 'Outstanding submission, Aarav! Your explanation of photon wavelengths is exemplary. Continue this high caliber of scientific inquiry!'
    }
  ]);

  const filteredItems = homeworkItems.filter(item => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  // Run AI Pre-submission Check
  const runAiPreCheck = () => {
    if (!writtenDraft.trim() || writtenDraft.trim().length < 20) {
      showToast('Please write at least a few sentences before requesting an AI pre-submission review.');
      return;
    }
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiReport({
        grammarScore: 94,
        completeness: 'High (All Prompt Rubrics Addressed)',
        strengths: [
          'Rich descriptive imagery used (e.g. "filtered emerald light", "dense emergent crown").',
          'Accurate sensory adjectives identified in context.'
        ],
        suggestions: [
          'Add a concluding reflection on how lower-canopy ferns adapt to shade.',
          'Double check spelling of "photosynthetic" in paragraph 2.'
        ]
      });
    }, 1200);
  };

  // Submit Homework
  const handleSubmitAssignment = () => {
    if (!writtenDraft.trim() && !attachedFile) {
      showToast('Please enter your written response or attach a worksheet before submitting.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (selectedHomework) {
        setHomeworkItems(prev => prev.map(hw => hw.id === selectedHomework.id ? {
          ...hw,
          status: 'SUBMITTED',
          submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          submittedContent: writtenDraft + (attachedFile ? `\n\n[Attached: ${attachedFile}]` : '')
        } : hw));
        setSelectedHomework(prev => prev ? {
          ...prev,
          status: 'SUBMITTED',
          submittedAt: 'Just now',
          submittedContent: writtenDraft
        } : null);
        setSubmittedSuccess(true);
      }
    }, 900);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60 mb-1">
            <span>Scholar Portal</span>
            <span>·</span>
            <span>Aarav Sundaram (Grade 5A)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Homework & Submission Studio
          </h1>
          <p className="text-xs text-slate-500">
            Submit assignments, attach interactive worksheet drawings, and receive teacher evaluations.
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-center min-w-[90px]">
            <div className="text-xl font-extrabold text-amber-700">1</div>
            <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Due Soon</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-center min-w-[90px]">
            <div className="text-xl font-extrabold text-emerald-700">9.5/10</div>
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Avg Score</div>
          </div>
        </div>
      </div>

      {/* 2. Filter Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-1.5 text-xs font-bold">
          {(['ALL', 'PENDING', 'SUBMITTED', 'EVALUATED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setFilter(tab); setSelectedHomework(null); }}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                filter === tab
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab === 'ALL' && `All Tasks (${homeworkItems.length})`}
              {tab === 'PENDING' && `Pending (1)`}
              {tab === 'SUBMITTED' && `Submitted (1)`}
              {tab === 'EVALUATED' && `Graded & Evaluated (1)`}
            </button>
          ))}
        </div>

        {onNavigateToWorksheet && (
          <button
            onClick={onNavigateToWorksheet}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <PenTool className="w-3.5 h-3.5 text-teal-600" />
            <span>Open Worksheet Studio</span>
          </button>
        )}
      </div>

      {/* 3. Main Workspace: Split Cards & Active Submission Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assignment Cards List (5 or 12 Cols depending on selection) */}
        <div className={`space-y-4 ${selectedHomework ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          {filteredItems.map(item => {
            const isSelected = selectedHomework?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedHomework(item);
                  setWrittenDraft(item.submittedContent || '');
                  setAiReport(null);
                  setSubmittedSuccess(false);
                }}
                className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'border-teal-500 ring-2 ring-teal-500/20'
                    : 'border-slate-200/80 hover:border-teal-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {item.subject}
                      </span>
                      {item.status === 'PENDING' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Action Required</span>
                        </span>
                      )}
                      {item.status === 'SUBMITTED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Under Review</span>
                        </span>
                      )}
                      {item.status === 'EVALUATED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                          <Award className="w-3 h-3" />
                          <span>Graded: {item.score}/{item.maxMarks}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 pt-1">{item.title}</h3>
                  </div>

                  <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-teal-600' : ''}`} />
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {item.instructions}
                </p>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  <span>Assigned by: {item.assignedBy}</span>
                  <span className="font-semibold text-slate-600 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.dueDate}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Workspace / Submission Studio */}
        {selectedHomework && (
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-7 space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                  <span className="font-bold text-teal-700">{selectedHomework.subject}</span>
                  <span>·</span>
                  <span>Max Marks: {selectedHomework.maxMarks}</span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">{selectedHomework.title}</h2>
              </div>
              <button
                onClick={() => setSelectedHomework(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Instructions & Rubric Accordion */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Teacher Instructions & Guidelines</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{selectedHomework.instructions}</p>
              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200">
                <span className="font-bold text-slate-700">Evaluation Rubric: </span>
                <span>{selectedHomework.rubricSummary}</span>
              </div>
            </div>

            {/* CASE 1: ALREADY EVALUATED */}
            {selectedHomework.status === 'EVALUATED' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span className="font-extrabold text-emerald-900 text-sm">Graded by Faculty</span>
                    </div>
                    <div className="text-lg font-black text-emerald-700">
                      {selectedHomework.score} / {selectedHomework.maxMarks} Marks
                    </div>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed bg-white/80 p-3 rounded-xl border border-emerald-100">
                    "{selectedHomework.feedback}"
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">Your Submitted Response:</span>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap">
                    {selectedHomework.submittedContent}
                  </div>
                </div>
              </div>
            )}

            {/* CASE 2: SUBMITTED (UNDER REVIEW) */}
            {selectedHomework.status === 'SUBMITTED' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center space-x-3 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="font-bold">Assignment Submitted Successfully</h4>
                    <p className="text-blue-700 text-[11px]">Submitted on {selectedHomework.submittedAt}. Teacher is reviewing your responses.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">Your Submission Copy:</span>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedHomework.submittedContent}
                  </div>
                </div>
              </div>
            )}

            {/* CASE 3: PENDING (ACTIVE WRITING & ATTACHING STUDIO) */}
            {selectedHomework.status === 'PENDING' && (
              <div className="space-y-5">
                {submittedSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h3 className="text-sm font-bold text-emerald-900">Submitted to Faculty!</h3>
                    <p className="text-xs text-emerald-700">Your work has been safely recorded and queued for Dr. Priya's assessment.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Your Written Response:</span>
                        <span className="text-slate-400 font-mono text-[11px]">{writtenDraft.split(/\s+/).filter(Boolean).length} Words</span>
                      </div>
                      <textarea
                        rows={7}
                        value={writtenDraft}
                        onChange={e => setWrittenDraft(e.target.value)}
                        placeholder="Type your reflection, essay answers, or observations here..."
                        className="w-full p-4 rounded-2xl border border-slate-200 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                      />
                    </div>

                    {/* Attachment & Drawing Connectors */}
                    <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2">
                        <Paperclip className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 font-medium">
                          {attachedFile ? attachedFile : 'Attach digital diagrams or photos:'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {onNavigateToWorksheet && (
                          <button
                            onClick={onNavigateToWorksheet}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:border-teal-400 flex items-center space-x-1 transition-colors"
                          >
                            <PenTool className="w-3.5 h-3.5 text-teal-600" />
                            <span>Draw on Worksheet</span>
                          </button>
                        )}
                        <button
                          onClick={() => setAttachedFile('canopy_adaptation_sketch.png')}
                          className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl font-bold hover:bg-teal-100 flex items-center space-x-1 transition-colors"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Attach Photo</span>
                        </button>
                      </div>
                    </div>

                    {/* AI Pre-Submission Review Copilot */}
                    <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-teal-600" />
                          <span className="text-xs font-bold text-teal-900">Achariya AI Pre-Flight Copilot</span>
                        </div>
                        <button
                          onClick={runAiPreCheck}
                          disabled={isAiAnalyzing}
                          className="px-3 py-1 bg-white hover:bg-teal-100 border border-teal-300 text-teal-800 rounded-lg text-[11px] font-bold transition-colors disabled:opacity-50"
                        >
                          {isAiAnalyzing ? 'Analyzing...' : 'Run Pre-Check →'}
                        </button>
                      </div>

                      {aiReport && (
                        <div className="bg-white p-3.5 rounded-xl border border-teal-100 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-teal-800 font-bold">
                            <span>Predicted Grammar & Flow: {aiReport.grammarScore}%</span>
                            <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">{aiReport.completeness}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 space-y-1">
                            <p className="font-semibold text-slate-800">Key Strengths:</p>
                            {aiReport.strengths.map((s, i) => (
                              <p key={i} className="text-emerald-700 flex items-center space-x-1">
                                <span>✓</span>
                                <span>{s}</span>
                              </p>
                            ))}
                            <p className="font-semibold text-slate-800 pt-1">Suggested Refinements:</p>
                            {aiReport.suggestions.map((s, i) => (
                              <p key={i} className="text-amber-700 flex items-center space-x-1">
                                <span>💡</span>
                                <span>{s}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Final Submission Button */}
                    <button
                      onClick={handleSubmitAssignment}
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Submitting to Teacher...' : 'Submit Homework to Faculty'}</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

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

