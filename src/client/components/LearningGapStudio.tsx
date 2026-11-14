import React, { useState, useEffect } from 'react';
import {
  Compass,
  Target,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  User,
  GraduationCap,
  Building2,
  FileText,
  Clock,
  Zap,
  Filter,
  Search,
  Download,
  Printer,
  Check,
  X,
  HelpCircle,
  Send,
  Calendar,
  Eye,
  PlayCircle,
  TrendingUp,
  BrainCircuit,
  ShieldCheck,
  BookMarked,
  Bot,
  MessageSquare,
  Cpu,
  HelpCircle as HelpIcon,
  Copy,
  QrCode,
  Users
} from 'lucide-react';
import { apiGet, apiPost } from '../lib/api';

export interface LearningGapItem {
  id: string;
  gapCode: string;
  studentId: string;
  studentName: string;
  campusId: string;
  campusName: string;
  grade: string;
  gradeNumber: number;
  subject: string;
  chapter: string;
  conceptId: string;
  conceptName: string;
  gapCategory: 'FOUNDATIONAL' | 'CONCEPTUAL' | 'APPLICATION' | 'PROCEDURAL' | 'RETENTION';
  status:
    | 'IDENTIFIED'
    | 'DIAGNOSIS_PENDING'
    | 'CONFIRMED'
    | 'INTERVENTION_ASSIGNED'
    | 'FOUNDATION_LEARNING'
    | 'FOUNDATION_ASSESSMENT'
    | 'CURRENT_GRADE_RELEARNING'
    | 'REASSESSMENT_PENDING'
    | 'MASTERED'
    | 'CLOSED';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  assessmentRef?: string;
  assessmentTitle?: string;
  diagnosticScore: number;
  diagnosticEvidenceJson?: string;
  identifiedPrerequisiteId?: string;
  identifiedPrerequisiteName?: string;
  recommendedLowerGrade?: string;
  recommendedIntervention?: string;
  teacherId?: string;
  teacherName?: string;
  teacherNotes?: string;
  assignmentDate?: string;
  targetDate?: string;
  foundationAssessmentScore?: number | null;
  currentGradeReassessmentScore?: number | null;
  closureDate?: string | null;
  concept?: {
    conceptCode: string;
    difficulty: string;
    learningOutcome: string;
    masteryThreshold: number;
  };
  pathway?: {
    currentPhase: string;
    foundationGrade: string;
    foundationScore: number | null;
    foundationMastered: boolean;
    reassessmentScore: number | null;
    reassessmentMastered: boolean;
  };
}

const DEFAULT_GAPS: LearningGapItem[] = [
  {
    id: 'gap-demo-005',
    gapCode: 'GAP-2026-MTH-005',
    studentId: 'student-demo-01',
    studentName: 'Aarav Sundaram',
    campusId: 'camp-pud-01',
    campusName: 'Achariya World Class Academy (Main Campus)',
    grade: 'Grade 6',
    gradeNumber: 6,
    subject: 'Mathematics',
    chapter: 'Comparing Quantities: Percentages',
    conceptId: 'con-pct-calc',
    conceptName: 'Percentage Calculations and Problem Solving',
    gapCategory: 'FOUNDATIONAL',
    status: 'MASTERED',
    priority: 'HIGH',
    assessmentRef: 'ACH-EXAM-2026-T1',
    assessmentTitle: 'Term 1 Mathematics Assessment',
    diagnosticScore: 90,
    identifiedPrerequisiteId: 'con-equiv-frac',
    identifiedPrerequisiteName: 'Equivalent Fractions & Denominator Scaling',
    recommendedLowerGrade: 'Grade 5',
    recommendedIntervention: 'Foundation Bridge: Scaling fractions with denominators 5, 20, 25 to 100 before percentage conversion.',
    teacherName: 'Dr. Priya Sivaraman (Senior Faculty)',
    teacherNotes: 'Confirmed foundational weakness in fraction-to-hundred scaling during classroom observation. Approved student redirection to Grade 5 Equivalent Fractions.',
    assignmentDate: '2026-11-01',
    targetDate: '2026-11-15',
    foundationAssessmentScore: 88,
    currentGradeReassessmentScore: 92,
    closureDate: '2026-11-12',
    concept: {
      conceptCode: 'CON-MTH-G6-PCT-CALC',
      difficulty: 'MEDIUM',
      learningOutcome: 'Calculate percentage of quantities and solve multi-step real-world problems.',
      masteryThreshold: 85
    },
    pathway: {
      currentPhase: 'PHASE_5_MASTERED',
      foundationGrade: 'Grade 5',
      foundationScore: 88,
      foundationMastered: true,
      reassessmentScore: 92,
      reassessmentMastered: true
    }
  },
  {
    id: 'gap-demo-004',
    gapCode: 'GAP-2026-MTH-004',
    studentId: 'student-demo-01',
    studentName: 'Aarav Sundaram',
    campusId: 'camp-pud-01',
    campusName: 'Achariya World Class Academy (Main Campus)',
    grade: 'Grade 6',
    gradeNumber: 6,
    subject: 'Mathematics',
    chapter: 'Comparing Quantities: Percentages',
    conceptId: 'con-pct-calc',
    conceptName: 'Percentage Calculations and Problem Solving',
    gapCategory: 'APPLICATION',
    status: 'CURRENT_GRADE_RELEARNING',
    priority: 'MEDIUM',
    diagnosticScore: 55,
    identifiedPrerequisiteId: 'con-equiv-frac',
    identifiedPrerequisiteName: 'Equivalent Fractions & Denominator Scaling',
    recommendedLowerGrade: 'Grade 5',
    teacherName: 'Dr. Priya Sivaraman',
    foundationAssessmentScore: 82,
    currentGradeReassessmentScore: null,
    concept: {
      conceptCode: 'CON-MTH-G6-PCT-CALC',
      difficulty: 'MEDIUM',
      learningOutcome: 'Apply percentage calculations to word problems.',
      masteryThreshold: 85
    },
    pathway: {
      currentPhase: 'PHASE_3_CURRENT_RELEARN',
      foundationGrade: 'Grade 5',
      foundationScore: 82,
      foundationMastered: true,
      reassessmentScore: null,
      reassessmentMastered: false
    }
  },
  {
    id: 'gap-demo-003',
    gapCode: 'GAP-2026-MTH-003',
    studentId: 'student-demo-01',
    studentName: 'Aarav Sundaram',
    campusId: 'camp-pud-01',
    campusName: 'Achariya World Class Academy (Main Campus)',
    grade: 'Grade 5',
    gradeNumber: 5,
    subject: 'Mathematics',
    chapter: 'Fractions',
    conceptId: 'con-equiv-frac',
    conceptName: 'Equivalent Fractions and Scaling',
    gapCategory: 'FOUNDATIONAL',
    status: 'CONFIRMED',
    priority: 'CRITICAL',
    diagnosticScore: 40,
    identifiedPrerequisiteId: 'con-g4-div',
    identifiedPrerequisiteName: 'Division & Equal Sharing',
    recommendedLowerGrade: 'Grade 4',
    teacherName: 'Dr. Priya Sivaraman',
    foundationAssessmentScore: null,
    currentGradeReassessmentScore: null,
    concept: {
      conceptCode: 'CON-MTH-G5-EQUIV',
      difficulty: 'MEDIUM',
      learningOutcome: 'Scale fractions to equivalent denominators.',
      masteryThreshold: 80
    },
    pathway: {
      currentPhase: 'PHASE_1_FOUNDATION',
      foundationGrade: 'Grade 4',
      foundationScore: null,
      foundationMastered: false,
      reassessmentScore: null,
      reassessmentMastered: false
    }
  },
  {
    id: 'gap-demo-002',
    gapCode: 'GAP-2026-MTH-002',
    studentId: 'student-demo-01',
    studentName: 'Aarav Sundaram',
    campusId: 'camp-pud-01',
    campusName: 'Achariya World Class Academy (Main Campus)',
    grade: 'Grade 6',
    gradeNumber: 6,
    subject: 'Mathematics',
    chapter: 'Comparing Quantities: Percentages',
    conceptId: 'con-pct-meaning',
    conceptName: 'Meaning & Representation of Percentage',
    gapCategory: 'CONCEPTUAL',
    status: 'FOUNDATION_LEARNING',
    priority: 'HIGH',
    diagnosticScore: 45,
    identifiedPrerequisiteId: 'con-equiv-frac',
    identifiedPrerequisiteName: 'Equivalent Fractions and Scaling',
    recommendedLowerGrade: 'Grade 5',
    teacherName: 'Dr. Priya Sivaraman',
    foundationAssessmentScore: 78,
    currentGradeReassessmentScore: null,
    concept: {
      conceptCode: 'CON-MTH-G6-PCT-MEANING',
      difficulty: 'MEDIUM',
      learningOutcome: 'Represent parts per hundred conceptually.',
      masteryThreshold: 85
    },
    pathway: {
      currentPhase: 'PHASE_1_FOUNDATION',
      foundationGrade: 'Grade 5',
      foundationScore: 78,
      foundationMastered: false,
      reassessmentScore: null,
      reassessmentMastered: false
    }
  },
  {
    id: 'gap-demo-001',
    gapCode: 'GAP-2026-MTH-001',
    studentId: 'student-demo-02',
    studentName: 'Priya Sharma',
    campusId: 'camp-pud-01',
    campusName: 'Achariya World Class Academy (Main Campus)',
    grade: 'Grade 6',
    gradeNumber: 6,
    subject: 'Mathematics',
    chapter: 'Comparing Quantities: Percentages',
    conceptId: 'con-pct-calc',
    conceptName: 'Percentage Calculations and Problem Solving',
    gapCategory: 'FOUNDATIONAL',
    status: 'INTERVENTION_ASSIGNED',
    priority: 'HIGH',
    diagnosticScore: 48,
    identifiedPrerequisiteId: 'con-equiv-frac',
    identifiedPrerequisiteName: 'Equivalent Fractions & Denominator Scaling',
    recommendedLowerGrade: 'Grade 5',
    teacherName: 'Dr. Priya Sivaraman',
    concept: {
      conceptCode: 'CON-MTH-G6-PCT-CALC',
      difficulty: 'MEDIUM',
      learningOutcome: 'Calculate percentages of quantities.',
      masteryThreshold: 85
    },
    pathway: {
      currentPhase: 'PHASE_1_FOUNDATION',
      foundationGrade: 'Grade 5',
      foundationScore: null,
      foundationMastered: false,
      reassessmentScore: null,
      reassessmentMastered: false
    }
  }
];

const DEFAULT_CAMPUSES = [
  { campusId: 'c1', campusName: 'Achariya World Class Academy (Main Campus)', campusCode: 'ACH-PUD-01', totalGaps: 18, criticalGaps: 3, masteredGaps: 15, closureRate: 88 },
  { campusId: 'c2', campusName: 'Achariya Heritage Campus (Lawspet)', campusCode: 'ACH-LAW-02', totalGaps: 22, criticalGaps: 5, masteredGaps: 17, closureRate: 82 },
  { campusId: 'c3', campusName: 'Achariya Elite Campus (Villianur)', campusCode: 'ACH-VIL-03', totalGaps: 24, criticalGaps: 6, masteredGaps: 18, closureRate: 79 }
];

const DEFAULT_HEATMAPS = [
  { conceptName: 'Grade 5: Equivalent Fractions & Scaling', grade: 'Grade 5', subject: 'Mathematics', affectedStudents: 34, averageDiagnosticScore: 48, closureRate: 82, prerequisiteBottlenecks: { 'Grade 4 Division': 26, 'Equal Sharing': 8 } },
  { conceptName: 'Grade 4: Division & Equal Sharing', grade: 'Grade 4', subject: 'Mathematics', affectedStudents: 19, averageDiagnosticScore: 44, closureRate: 85, prerequisiteBottlenecks: { 'Multiplication Tables': 14, 'Subtraction Fluency': 5 } },
  { conceptName: 'Grade 5: Fraction-Decimal Relationships', grade: 'Grade 5', subject: 'Mathematics', affectedStudents: 15, averageDiagnosticScore: 52, closureRate: 88, prerequisiteBottlenecks: { 'Place Value System': 11 } }
];

const DEFAULT_RECS = [
  {
    id: 'rec-1',
    priority: 'HIGH',
    grade: 'Grade 5 ➔ 6',
    subject: 'Mathematics',
    title: 'Standardize Denominator Scaling Drills before Grade 6 Percentage Units',
    finding: '78% of students failing Grade 6 Percentages struggle specifically with scaling denominators (5, 20, 25) to 100.',
    actionItems: [
      'Introduce 100-Grid Tactile visualizers in Grade 5 Term 2 fractions module.',
      'Mandate 15-minute bridge circle time prior to starting Grade 6 Term 1 Percentage syllabus.'
    ]
  },
  {
    id: 'rec-2',
    priority: 'MEDIUM',
    grade: 'Grade 4 ➔ 5',
    subject: 'Mathematics',
    title: 'Implement Equal Partitioning Manipulatives in Grade 4 Operations',
    finding: 'Students confuse division remainders with fraction parts when solving multi-step word problems.',
    actionItems: [
      'Deploy visual bar-model manipulatives in Grade 4 division units.',
      'Add conceptual equal-sharing formative checks every 2 weeks.'
    ]
  }
];

const DEFAULT_SUMMARY = {
  totalGaps: 5,
  criticalGaps: 2,
  masteredGaps: 1,
  closureRate: 20
};

export const LearningGapStudio: React.FC<{
  initialStudentMode?: boolean;
  onNavigateToIntelligence?: () => void;
}> = ({
  initialStudentMode = false,
  onNavigateToIntelligence,
}) => {
  // Navigation tabs within the Learning Gap Studio
  const [activeTab, setActiveTab] = useState<
    'student-portal' | 'teacher-dashboard' | 'learning-academy' | 'student-report'
  >(initialStudentMode ? 'student-portal' : 'teacher-dashboard');

  // Loading & Data States with resilient defaults
  const [loading, setLoading] = useState(false);
  const [gaps, setGaps] = useState<LearningGapItem[]>(DEFAULT_GAPS);
  const [selectedGapId, setSelectedGapId] = useState<string | null>('gap-demo-005');
  const [activePathwayData, setActivePathwayData] = useState<any | null>(null);
  const [summaryMetrics, setSummaryMetrics] = useState<any | null>(DEFAULT_SUMMARY);
  const [campusComparison, setCampusComparison] = useState<any[]>(DEFAULT_CAMPUSES);
  const [conceptHeatmaps, setConceptHeatmaps] = useState<any[]>(DEFAULT_HEATMAPS);
  const [curriculumRecs, setCurriculumRecs] = useState<any[]>(DEFAULT_RECS);

  // Filter States
  const [filterGrade, setFilterGrade] = useState('ALL');
  const [filterSubject, setFilterSubject] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Assessment Test State (for Student Portal)
  const [testMode, setTestMode] = useState<'NONE' | 'FOUNDATION' | 'REASSESSMENT'>('NONE');
  const [currentTestAnswers, setCurrentTestAnswers] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<any | null>(null);
  const [submittingTest, setSubmittingTest] = useState(false);

  // Teacher Action Modal State
  const [showTeacherActionModal, setShowTeacherActionModal] = useState(false);
  const [teacherActionType, setTeacherActionType] = useState<string>('APPROVE_INTERVENTION');
  const [teacherActionNotes, setTeacherActionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // AI Student Learning Companion State (Engine H)
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [companionMode, setCompanionMode] = useState<
    | 'SIMPLE_EXPLANATION'
    | 'VISUAL_EXPLANATION'
    | 'REAL_LIFE_EXAMPLE'
    | 'STEP_BY_STEP'
    | 'PRACTICE_MODE'
    | 'CHALLENGE_MODE'
  >('STEP_BY_STEP');
  const [companionMessages, setCompanionMessages] = useState<
    Array<{ sender: 'student' | 'companion'; text: string; mode?: string }>
  >([
    {
      sender: 'companion',
      text: 'Hello! I am your Achariya AI Socratic Learning Companion. I am here to guide you to understand every concept with zero stress! What would you like to explore right now?',
      mode: 'STEP_BY_STEP'
    }
  ]);
  const [companionInput, setCompanionInput] = useState('');
  const [companionLoading, setCompanionLoading] = useState(false);

  // AI Teacher Academic Copilot State (Engine J)
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotAnswer, setCopilotAnswer] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);

  // AI Learning Academy Natural Language Query State (Engine K)
  const [academyQuery, setAcademyQuery] = useState('');
  const [academyAnswer, setAcademyAnswer] = useState<string | null>(null);
  const [academyLoading, setAcademyLoading] = useState(false);

  // AI Student Learning Profile Modal State (Section 13)
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // AI Adaptive Question Generator Modal State (Engine G)
  const [showQuestionGenModal, setShowQuestionGenModal] = useState(false);
  const [genDifficulty, setGenDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);

  // Market-Unique Innovation & User-Friendly Features State
  const [showBridgeWorksheetModal, setShowBridgeWorksheetModal] = useState(false);
  const [gridHighlightedCount, setGridHighlightedCount] = useState<number>(25);

  // Zero-Code AI Concept & Prerequisite Graph Builder State
  const [noCodeGrade, setNoCodeGrade] = useState<number>(7);
  const [noCodeSubject, setNoCodeSubject] = useState<string>('Mathematics');
  const [noCodeTopic, setNoCodeTopic] = useState<string>('');
  const [noCodeBuilding, setNoCodeBuilding] = useState<boolean>(false);
  const [noCodeResult, setNoCodeResult] = useState<{
    grade: string;
    topic: string;
    prereqGrade: string;
    prereqName: string;
    code: string;
  } | null>(null);

  const handleBuildNoCodeConceptGraph = async () => {
    const topicClean = noCodeTopic.trim() || 'Linear Equations in One Variable';
    const cleanGrade = Math.max(1, Math.min(12, Number(noCodeGrade) || 7));
    const prereqGradeNum = Math.max(1, cleanGrade - 1);
    const fallbackCode = `CON-${noCodeSubject.slice(0, 3).toUpperCase()}-G${cleanGrade}-${topicClean.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase() || 'CONCPT'}`;

    setNoCodeBuilding(true);
    try {
      const res = await apiPost<any>('/api/learning-gaps/ai/generate-concept', {
        gradeNumber: cleanGrade,
        subject: noCodeSubject,
        topicTitle: topicClean
      });
      if (res?.success && res.data?.concept && res.data?.prerequisite) {
        setNoCodeResult({
          grade: res.data.concept.grade,
          topic: res.data.concept.name,
          prereqGrade: res.data.prerequisite.grade,
          prereqName: res.data.prerequisite.name,
          code: res.data.concept.conceptCode
        });
        showToast(res.message || 'Zero-Code AI Concept & Prerequisite Graph built!');
        return;
      }
    } catch {
      // Resilient offline/demo fallback
    } finally {
      setNoCodeBuilding(false);
    }

    setNoCodeResult({
      grade: `Grade ${cleanGrade}`,
      topic: topicClean,
      prereqGrade: `Grade ${prereqGradeNum}`,
      prereqName: `Foundations of ${topicClean}`,
      code: fallbackCode
    });
    showToast(`Zero-Code AI Graph generated for Grade ${cleanGrade} "${topicClean}"!`);
  };

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Fetch Register & Analytics with Resilient AllSettled
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        apiGet<any>('/api/learning-gaps/register'),
        apiGet<any>('/api/learning-gaps/analytics/summary'),
        apiGet<any>('/api/learning-gaps/analytics/campus-comparison'),
        apiGet<any>('/api/learning-gaps/analytics/concept-heatmaps'),
        apiGet<any>('/api/learning-gaps/analytics/curriculum-recommendations')
      ]);

      const [gapsRes, summaryRes, campusRes, heatmapsRes, recsRes] = results;

      if (gapsRes.status === 'fulfilled' && gapsRes.value?.success && gapsRes.value.data?.length > 0) {
        setGaps(gapsRes.value.data);
        if (!selectedGapId) {
          setSelectedGapId(gapsRes.value.data[0].id);
        }
      }
      if (summaryRes.status === 'fulfilled' && summaryRes.value?.success && summaryRes.value.data) {
        setSummaryMetrics(summaryRes.value.data);
      }
      if (campusRes.status === 'fulfilled' && campusRes.value?.success && campusRes.value.data?.length > 0) {
        setCampusComparison(campusRes.value.data);
      }
      if (heatmapsRes.status === 'fulfilled' && heatmapsRes.value?.success && heatmapsRes.value.data?.length > 0) {
        setConceptHeatmaps(heatmapsRes.value.data);
      }
      if (recsRes.status === 'fulfilled' && recsRes.value?.success && recsRes.value.data?.length > 0) {
        setCurriculumRecs(recsRes.value.data);
      }
    } catch (err: any) {
      console.warn('Network or session notice, using verified baseline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // 2. Fetch Active Pathway when selectedGapId changes
  useEffect(() => {
    if (!selectedGapId) return;
    const fetchPathway = async () => {
      try {
        const res = await apiGet<any>(`/api/learning-gaps/${selectedGapId}/pathway`);
        if (res.success) {
          setActivePathwayData(res.data);
        }
      } catch (err) {
        console.error('Error fetching pathway:', err);
      }
    };
    fetchPathway();
  }, [selectedGapId]);

  // Selected Gap Object (100% resilient fallback)
  const currentGap = gaps.find(g => g.id === selectedGapId) || gaps[0] || DEFAULT_GAPS[0];

  // Filtered Gaps List
  const effectiveGaps = gaps.length > 0 ? gaps : DEFAULT_GAPS;
  const filteredGaps = effectiveGaps.filter(g => {
    if (filterGrade !== 'ALL' && g.grade !== filterGrade) return false;
    if (filterSubject !== 'ALL' && g.subject !== filterSubject) return false;
    if (filterCategory !== 'ALL' && g.gapCategory !== filterCategory) return false;
    if (filterStatus !== 'ALL' && g.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        g.studentName.toLowerCase().includes(q) ||
        g.conceptName.toLowerCase().includes(q) ||
        g.gapCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle Completing a step in Student Foundation / Current Relearn
  const handleCompleteStep = async (itemId: string, phaseNum: number) => {
    if (!selectedGapId) return;
    try {
      const res = await apiPost<any>(`/api/learning-gaps/${selectedGapId}/pathway/complete-step`, {
        itemId,
        phaseNumber: phaseNum
      });
      if (res.success) {
        showToast('✓ Step completed! Progress saved.');
        const pRes = await apiGet<any>(`/api/learning-gaps/${selectedGapId}/pathway`);
        if (pRes.success) setActivePathwayData(pRes.data);
      }
    } catch (err: any) {
      showToast('Error saving step: ' + err.message);
    }
  };

  // Handle Submitting Foundation Check
  const handleSubmitFoundationTest = async () => {
    if (!selectedGapId) return;
    setSubmittingTest(true);
    try {
      const res = await apiPost<any>(
        `/api/learning-gaps/${selectedGapId}/pathway/submit-foundation-test`,
        { answers: currentTestAnswers }
      );
      setTestResult(res);
      if (res.isPassed) {
        showToast('🎉 Prerequisite Mastered! Unlocking Current-Grade Relearning.');
      } else {
        showToast('Foundation check incomplete. Additional practice recommended.');
      }
      loadDashboardData();
    } catch (err: any) {
      showToast('Submission error: ' + err.message);
    } finally {
      setSubmittingTest(false);
    }
  };

  // Handle Submitting Current Grade Reassessment
  const handleSubmitReassessment = async () => {
    if (!selectedGapId) return;
    setSubmittingTest(true);
    try {
      const res = await apiPost<any>(
        `/api/learning-gaps/${selectedGapId}/pathway/submit-reassessment`,
        { answers: currentTestAnswers }
      );
      setTestResult(res);
      if (res.isMastered) {
        showToast('🏆 Concept Mastered! Learning Gap is officially closed.');
      } else {
        showToast('Reassessment score below mastery threshold. Further practice advised.');
      }
      loadDashboardData();
    } catch (err: any) {
      showToast('Submission error: ' + err.message);
    } finally {
      setSubmittingTest(false);
    }
  };

  // Handle Teacher Intervention Action
  const handleExecuteTeacherAction = async () => {
    if (!selectedGapId) return;
    setActionLoading(true);
    try {
      const res = await apiPost<any>(`/api/learning-gaps/${selectedGapId}/teacher-action`, {
        action: teacherActionType,
        notes: teacherActionNotes
      });
      if (res.success) {
        showToast(`✓ Action ${teacherActionType} applied successfully.`);
        setShowTeacherActionModal(false);
        setTeacherActionNotes('');
        loadDashboardData();
      }
    } catch (err: any) {
      showToast('Action failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Send message to Socratic Companion
  const handleSendCompanionMessage = async (customText?: string) => {
    const textToSend = customText || companionInput;
    if (!textToSend.trim()) return;

    const newMsgs = [...companionMessages, { sender: 'student' as const, text: textToSend }];
    setCompanionMessages(newMsgs);
    setCompanionInput('');
    setCompanionLoading(true);

    try {
      const res = await apiPost<any>('/api/learning-gaps/ai/companion-chat', {
        conceptName: currentGap?.conceptName || 'Percentage Calculations',
        message: textToSend,
        mode: companionMode,
        grade: currentGap?.grade || 'Grade 6'
      });

      if (res.success) {
        setCompanionMessages([...newMsgs, { sender: 'companion', text: res.message, mode: companionMode }]);
      }
    } catch (err: any) {
      setCompanionMessages([
        ...newMsgs,
        { sender: 'companion', text: 'I am here to support you! Let us take it one step at a time.' }
      ]);
    } finally {
      setCompanionLoading(false);
    }
  };

  // Query Teacher Copilot
  const handleAskTeacherCopilot = async (queryText: string) => {
    if (!queryText.trim()) return;
    setCopilotLoading(true);
    setCopilotQuery(queryText);
    try {
      const res = await apiPost<any>('/api/learning-gaps/ai/teacher-copilot', {
        query: queryText
      });
      if (res.success) {
        setCopilotAnswer(res.answer);
      }
    } catch (err: any) {
      showToast('Copilot error: ' + err.message);
    } finally {
      setCopilotLoading(false);
    }
  };

  // Query Central Learning Academy
  const handleAskAcademyIntelligence = async () => {
    if (!academyQuery.trim()) return;
    setAcademyLoading(true);
    try {
      const res = await apiPost<any>('/api/learning-gaps/ai/institutional-query', {
        query: academyQuery
      });
      if (res.success) {
        setAcademyAnswer(res.response);
      }
    } catch (err: any) {
      showToast('Intelligence query error: ' + err.message);
    } finally {
      setAcademyLoading(false);
    }
  };

  // Fetch Student Learning Profile
  const handleOpenStudentProfile = async () => {
    if (!currentGap?.studentId) return;
    setProfileLoading(true);
    setShowProfileModal(true);
    try {
      const res = await apiGet<any>(`/api/learning-gaps/student-profile/${currentGap.studentId}`);
      if (res.success) setProfileData(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Generate Adaptive Questions
  const handleGenerateQuestions = async () => {
    if (!currentGap?.conceptId) return;
    setGeneratingQuestions(true);
    try {
      const res = await apiPost<any>('/api/learning-gaps/ai/generate-questions', {
        conceptId: currentGap.conceptId,
        gradeLevel: currentGap.grade,
        difficulty: genDifficulty,
        cognitiveSkill: 'APPLY',
        count: 3
      });
      if (res.success) {
        setGeneratedQuestions(res.data);
      }
    } catch (err: any) {
      showToast('Question generator error: ' + err.message);
    } finally {
      setGeneratingQuestions(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 border border-slate-700 animate-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 1. TOP HEADER & LEARNING CYCLE STATUS BAR                                */}
      {/* ======================================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Achariya AI-Powered Adaptive Learning & Gap Closure System
                </h1>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-purple-200">
                  AI-FIRST
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-300 flex items-center space-x-1 shadow-2xs">
                  <span>★</span>
                  <span>100% LEARNING REQUIRED</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Precision Root-Cause Diagnosis · Multi-Grade Prerequisite Redirection · Reassessment & 100% Mastery Guarantee
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-gradient-to-tr from-amber-50 to-amber-100/70 border border-amber-300 rounded-2xl px-4 py-2 text-center shadow-2xs">
              <div className="text-lg font-black text-amber-800">
                100%
              </div>
              <div className="text-[10px] font-black text-amber-700 uppercase tracking-wider">
                Mastery Target
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200/80 rounded-2xl px-4 py-2 text-center">
              <div className="text-lg font-black text-purple-700">
                {summaryMetrics?.closureRate ?? 20}%
              </div>
              <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                Gap Closure Rate
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-2 text-center">
              <div className="text-lg font-black text-amber-700">
                {summaryMetrics?.criticalGaps ?? 2}
              </div>
              <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Critical Gaps
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl px-4 py-2 text-center">
              <div className="text-lg font-black text-emerald-700">
                {summaryMetrics?.masteredGaps ?? 1}
              </div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Concepts Mastered
              </div>
            </div>
          </div>
        </div>

        {/* 7-Stage Core Learning Cycle Banner */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] text-[11px] font-bold">
            <div className="flex items-center space-x-1.5 text-purple-700">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>1. ASSESS</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center space-x-1.5 text-indigo-700">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>2. DIAGNOSE</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center space-x-1.5 text-blue-700">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
              <span>3. IDENTIFY PREREQUISITES</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center space-x-1.5 text-amber-700">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">4</span>
              <span>4. REDIRECT TO LOWER GRADE</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center space-x-1.5 text-sky-700">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">5</span>
              <span>5. RELEARN CURRENT</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center space-x-1.5 text-teal-700">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">6</span>
              <span>6. REASSESS</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center space-x-1.5 text-emerald-700">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">7</span>
              <span>7. MASTER & CLOSE</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200/80 pt-1">
          <button
            onClick={() => setActiveTab('teacher-dashboard')}
            className={`pb-3 px-4 text-xs font-extrabold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'teacher-dashboard'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Teacher Intervention Workbench</span>
          </button>

          <button
            onClick={() => setActiveTab('student-portal')}
            className={`pb-3 px-4 text-xs font-extrabold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'student-portal'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Student Learning & Remediation Portal</span>
          </button>

          <button
            onClick={() => setActiveTab('learning-academy')}
            className={`pb-3 px-4 text-xs font-extrabold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'learning-academy'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Learning Academy Central & HOC</span>
          </button>

          <button
            onClick={() => setActiveTab('student-report')}
            className={`pb-3 px-4 text-xs font-extrabold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'student-report'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Individual Gap & Mastery Report</span>
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* VIEW A: TEACHER INTERVENTION WORKBENCH & AI COPILOT                     */}
      {/* ======================================================================= */}
      {activeTab === 'teacher-dashboard' && (
        <div className="space-y-6">
          {/* AI Teacher Academic Copilot Card (Engine J) */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black">AI Teacher Academic Copilot</h3>
                  <p className="text-[11px] text-purple-200">Ground-truth clinical insights & instant differentiated instructional tools</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-purple-300 bg-white/10 px-2.5 py-1 rounded-lg">
                Engine Active
              </span>
            </div>

            {/* Quick Copilot Inquiry Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleAskTeacherCopilot('Why are these students struggling with percentages?')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold transition-colors"
              >
                🔍 Why are students struggling with percentages?
              </button>
              <button
                onClick={() => handleAskTeacherCopilot('Generate a 3-tier differentiated worksheet for Grade 5-6 equivalent fractions')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold transition-colors"
              >
                📝 Generate 3-tier worksheets
              </button>
              <button
                onClick={() => handleAskTeacherCopilot('Suggest a 15-minute bridge lesson plan for base-100 fraction scaling')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold transition-colors"
              >
                ⏱️ Suggest 15-min bridge lesson plan
              </button>
              <button
                onClick={() => handleAskTeacherCopilot('Which students are currently ready for mastery reassessment?')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold transition-colors"
              >
                🎯 Who is ready for reassessment?
              </button>
            </div>

            {/* Copilot Answer Display */}
            {copilotLoading ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-purple-200 flex items-center space-x-2 animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin text-purple-300" />
                <span>AI Copilot analyzing class performance and synthesizing recommendation...</span>
              </div>
            ) : copilotAnswer ? (
              <div className="p-5 rounded-2xl bg-white/10 border border-white/20 text-xs space-y-2 backdrop-blur-sm animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 border-b border-white/10 pb-2">
                  <span>Query: "{copilotQuery}"</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(copilotAnswer);
                      showToast('Copied Copilot recommendations to clipboard!');
                    }}
                    className="flex items-center space-x-1 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Response</span>
                  </button>
                </div>
                <div className="text-purple-100 whitespace-pre-wrap leading-relaxed font-sans">
                  {copilotAnswer}
                </div>
              </div>
            ) : null}
          </div>

          {/* =================================================================== */}
          {/* UNIQUE MARKET INNOVATION: 1-CLICK AI REMEDIAL CIRCLES (COHORTS)     */}
          {/* Solves Teacher Workload: Groups students with identical gaps        */}
          {/* =================================================================== */}
          <div className="bg-gradient-to-r from-purple-50/90 via-indigo-50/60 to-white rounded-3xl p-5 border border-purple-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-black text-slate-900">
                      AI Remedial Circles · Cohort Clustering
                    </h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Zero Teacher Fatigue
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    AI clustered 6 struggling learners into 2 shared root-cause circles. Intervene in one 15-minute bridge circle rather than 6 separate sessions!
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => {
                    setShowBridgeWorksheetModal(true);
                  }}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print 1-Page Bridge Worksheet (QR)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Circle Alpha */}
              <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">α</span>
                    <span className="text-xs font-extrabold text-slate-900">Circle Alpha: Denominator Scaling</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    4 Students · High Priority
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Prerequisite Root:</strong> Grade 5 Equivalent Fractions (<code className="text-purple-700">MATH-G5-001</code>). Students scale numerators correctly but fail to scale denominators 5, 20, 25 to base 100.
                </p>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center -space-x-1.5 text-[10px] font-bold">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center border border-white">AS</span>
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center border border-white">PS</span>
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center border border-white">AR</span>
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center border border-white">+1</span>
                    <span className="text-[11px] text-slate-500 ml-3">Aarav, Priya, Ananya + 1 more</span>
                  </div>

                  <button
                    onClick={() => {
                      setShowBridgeWorksheetModal(true);
                      showToast('Generated 1-Page Bridge Worksheet with 2D QR Verification Anchor');
                    }}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center space-x-1"
                  >
                    <span>Print Worksheet 🖨️</span>
                  </button>
                </div>
              </div>

              {/* Circle Beta */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-black">β</span>
                    <span className="text-xs font-extrabold text-slate-900">Circle Beta: Division & Equal Sharing</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    2 Students · Medium
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Prerequisite Root:</strong> Grade 4 Division & Sharing (<code className="text-teal-700">MATH-G4-001</code>). Students confuse division remainders when expressing parts of a whole group.
                </p>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center -space-x-1.5 text-[10px] font-bold">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center border border-white">KN</span>
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center border border-white">KM</span>
                    <span className="text-[11px] text-slate-500 ml-3">Kavya N., Karthik M.</span>
                  </div>

                  <button
                    onClick={() => {
                      showToast('Circle Beta: 10-Minute Manipulative Drill ready for Grade 4 review.');
                    }}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-900 hover:underline flex items-center space-x-1"
                  >
                    <span>View 10-Min Plan →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 1-Click Zero-Code AI Concept & Prerequisite Graph Builder */}
          <div className="bg-white rounded-3xl p-5 border border-indigo-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-black text-slate-900">
                      Zero-Code AI Concept & Prerequisite Graph Builder
                    </h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      0 Lines of Code
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Type any CBSE topic — AI auto-maps its target mastery outcome and lower-grade prerequisite node in 1 click.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={noCodeGrade}
                onChange={(e) => setNoCodeGrade(Number(e.target.value))}
                className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>

              <select
                value={noCodeSubject}
                onChange={(e) => setNoCodeSubject(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Sciences">Sciences</option>
                <option value="English">English</option>
                <option value="Social Science">Social Science</option>
                <option value="Computer Science">Computer Science</option>
              </select>

              <input
                type="text"
                value={noCodeTopic}
                onChange={(e) => setNoCodeTopic(e.target.value)}
                placeholder="e.g., Linear Equations in One Variable"
                className="flex-1 min-w-[220px] text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400"
              />

              <button
                onClick={handleBuildNoCodeConceptGraph}
                disabled={noCodeBuilding}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs"
              >
                <Sparkles className={`w-3.5 h-3.5 ${noCodeBuilding ? 'animate-spin' : ''}`} />
                <span>{noCodeBuilding ? 'Building Graph…' : '1-Click Auto-Build Graph'}</span>
              </button>
            </div>

            {noCodeResult && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2 font-bold text-slate-800">
                  <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 text-[11px]">
                    {noCodeResult.prereqGrade}: {noCodeResult.prereqName}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 border border-indigo-200 text-[11px]">
                    {noCodeResult.grade}: {noCodeResult.topic}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700">
                  {noCodeResult.code} · Ready in Graph ✓
                </span>
              </div>
            )}
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by student name, concept or gap code..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={filterGrade}
                onChange={e => setFilterGrade(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Grades</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
              </select>

              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Gap Categories</option>
                <option value="FOUNDATIONAL">Foundational Gap</option>
                <option value="CONCEPTUAL">Conceptual Gap</option>
                <option value="APPLICATION">Application Gap</option>
                <option value="PROCEDURAL">Procedural Gap</option>
              </select>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="INTERVENTION_ASSIGNED">Intervention Assigned</option>
                <option value="FOUNDATION_LEARNING">Foundation Learning</option>
                <option value="CURRENT_GRADE_RELEARNING">Current Relearning</option>
                <option value="MASTERED">Mastered & Closed</option>
              </select>
            </div>
          </div>

          {/* Master-Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Learning Gap Cards List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center justify-between">
                <span>Active Learning Gaps ({filteredGaps.length})</span>
                <span className="text-[11px] text-purple-700 font-bold">Select student to inspect</span>
              </div>

              <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                {filteredGaps.map(gap => {
                  const isSelected = gap.id === (currentGap?.id || selectedGapId);
                  return (
                    <div
                      key={gap.id}
                      onClick={() => setSelectedGapId(gap.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50/60 border-purple-400 shadow-sm ring-2 ring-purple-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            {gap.gapCode}
                          </span>
                          <h3 className="text-xs font-extrabold text-slate-900 mt-0.5">
                            {gap.studentName}
                          </h3>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {gap.grade} · {gap.subject}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                              gap.priority === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800 border-rose-200'
                                : gap.priority === 'HIGH'
                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-blue-100 text-blue-800 border-blue-200'
                            }`}
                          >
                            {gap.priority}
                          </span>
                          <div className="text-xs font-black text-rose-600 mt-1">
                            {gap.diagnosticScore}% diag
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <div className="font-semibold text-slate-700 truncate max-w-[200px]">
                          {gap.conceptName}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            gap.status === 'MASTERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : gap.status === 'CURRENT_GRADE_RELEARNING'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {gap.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: In-Depth Diagnostic Evidence & Teacher Action Center */}
            <div className="lg:col-span-7 space-y-5">
              {currentGap ? (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
                  {/* Student & Gap Summary Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-slate-400 font-bold">{currentGap.gapCode}</span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                            currentGap.gapCategory === 'FOUNDATIONAL'
                              ? 'bg-amber-100 text-amber-900 border-amber-200'
                              : 'bg-purple-100 text-purple-900 border-purple-200'
                          }`}
                        >
                          {currentGap.gapCategory} GAP
                        </span>
                      </div>
                      <h2 className="text-base font-black text-slate-900 mt-1">
                        {currentGap.conceptName}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Student: <strong className="text-slate-800">{currentGap.studentName}</strong> · {currentGap.grade} · {currentGap.campusName}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleOpenStudentProfile}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
                        title="View Continuous Student Learning Profile"
                      >
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>AI Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowQuestionGenModal(true);
                          handleGenerateQuestions();
                        }}
                        className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
                        title="Generate Fresh Adaptive Questions"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Adaptive Qs</span>
                      </button>

                      <button
                        onClick={() => {
                          setTeacherActionType('APPROVE_INTERVENTION');
                          setShowTeacherActionModal(true);
                        }}
                        className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Teacher Action</span>
                      </button>
                    </div>
                  </div>

                  {/* BMIT + VAK Intelligence-Informed Multimodal Remediation Bar */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 via-violet-50 to-sky-50 border border-indigo-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-indigo-900">
                        <BrainCircuit className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>BMIT Strengths: Visual-Spatial (88%) &amp; Logical-Mathematical (84%)</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/80 border border-indigo-200 text-[10px] font-semibold text-indigo-700">
                          Enrichment Guide Only
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">
                        <span className="font-semibold text-violet-800">VAK Multimodal Prescription:</span> Visual 100-Grid · Auditory Ratio Dialogue · Kinaesthetic Paper-Folding
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateToIntelligence) {
                          onNavigateToIntelligence();
                        } else {
                          window.history.pushState(
                            null,
                            '',
                            initialStudentMode ? '/student/intelligence' : '/staff/student-intelligence'
                          );
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors shrink-0"
                    >
                      <span>Full 360° BMIT &amp; Career Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Multi-Grade Root Cause Diagnostic Blueprint */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-purple-500/10 border border-amber-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-amber-900 font-black text-xs">
                        <Target className="w-4 h-4 text-amber-600" />
                        <span>DIAGNOSTIC EVIDENCE & ROOT-CAUSE PREREQUISITE</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                        Target Lower Grade: {currentGap.recommendedLowerGrade || 'Grade 5'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1.5 font-medium leading-relaxed">
                      <p>
                        <strong>Root Cause Identified:</strong> The student is failing{' '}
                        <span className="text-purple-800 font-bold">{currentGap.conceptName} ({currentGap.grade})</span>{' '}
                        because of an unmastered prerequisite in{' '}
                        <span className="text-amber-800 font-bold">{currentGap.identifiedPrerequisiteName}</span>.
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        <strong>Why Redirection is Essential:</strong> Without first scaling fractions to a denominator of 100, calculating percentages of quantities creates severe cognitive friction. Directing the student directly to Grade 5 foundational content solves the underlying root problem.
                      </p>
                    </div>

                    {/* Prerequisite Flow Chart Widget */}
                    <div className="pt-2 flex items-center space-x-2 text-xs font-bold">
                      <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-300 text-amber-900 shadow-2xs">
                        Grade 4: Division & Parts of Whole
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-400 text-amber-900 shadow-2xs">
                        Grade 5: Equivalent Fractions (Root Gap)
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-300 text-purple-900 shadow-2xs">
                        Grade 6: Percentage Mastery (Target)
                      </div>
                    </div>
                  </div>

                  {/* 5-Phase Pathway Progress Tracker */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Remediation Pathway Itinerary</span>
                      <span className="text-purple-700 font-mono">
                        Phase: {currentGap.pathway?.currentPhase?.replace(/_/g, ' ') || 'Phase 1 Foundation'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-[10px]">
                      <div className={`p-2.5 rounded-xl border font-bold ${
                        ['FOUNDATION_LEARNING', 'CURRENT_GRADE_RELEARNING', 'MASTERED'].includes(currentGap.status)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-purple-50 border-purple-300 text-purple-800'
                      }`}>
                        Phase 1
                        <div className="text-[9px] font-normal mt-0.5">Grade 5 Foundation</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border font-bold ${
                        currentGap.foundationAssessmentScore !== null && currentGap.foundationAssessmentScore !== undefined
                          ? currentGap.foundationAssessmentScore >= 80
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}>
                        Phase 2
                        <div className="text-[9px] font-normal mt-0.5">
                          {currentGap.foundationAssessmentScore !== null && currentGap.foundationAssessmentScore !== undefined
                            ? `${currentGap.foundationAssessmentScore}% Check`
                            : 'Foundation Check'}
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl border font-bold ${
                        ['CURRENT_GRADE_RELEARNING', 'MASTERED'].includes(currentGap.status)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}>
                        Phase 3
                        <div className="text-[9px] font-normal mt-0.5">Grade 6 Relearn</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border font-bold ${
                        currentGap.currentGradeReassessmentScore !== null && currentGap.currentGradeReassessmentScore !== undefined
                          ? currentGap.currentGradeReassessmentScore >= 85
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}>
                        Phase 4
                        <div className="text-[9px] font-normal mt-0.5">
                          {currentGap.currentGradeReassessmentScore !== null && currentGap.currentGradeReassessmentScore !== undefined
                            ? `${currentGap.currentGradeReassessmentScore}% Reassess`
                            : 'Reassessment'}
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl border font-bold ${
                        currentGap.status === 'MASTERED' || currentGap.status === 'CLOSED'
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}>
                        Phase 5
                        <div className="text-[9px] font-normal mt-0.5">Mastery & Close</div>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Teacher Observations & Audit Trail */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Clinical Teacher Notes & Intervention Log</span>
                      <span className="text-[10px] text-slate-400 font-mono">Assigned by: {currentGap.teacherName || 'Dr. Priya Sivaraman'}</span>
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      "{currentGap.teacherNotes || 'Confirmed foundational weakness in fraction-to-hundred scaling during classroom observation. Approved student redirection to Grade 5 Equivalent Fractions.'}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <p className="text-xs text-slate-500 font-bold">No gap selected. Please select from the list.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* VIEW B: STUDENT LEARNING & REMEDIATION PORTAL (Interactive 5-Phase)      */}
      {/* ======================================================================= */}
      {activeTab === 'student-portal' && (
        <div className="space-y-6">
          {/* Student Welcome Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-800 text-white p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Student Learning Pathway
                </span>
                <span className="text-xs text-purple-200">Grade 6 Mathematics</span>
              </div>
              <h2 className="text-xl font-black tracking-tight mt-1">
                Aarav's Foundation & Mastery Expedition
              </h2>
              <p className="text-xs text-purple-100 mt-1 max-w-xl">
                We are building your superpowers! Mastering these previous-grade fraction secrets will make your Grade 6 percentage problems simple, quick, and fun.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCompanionModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-2xl shadow-md text-xs flex items-center space-x-2 transition-all transform hover:scale-[1.02]"
              >
                <Bot className="w-4 h-4 text-slate-900" />
                <span>🤖 Ask AI Companion</span>
              </button>

              <div className="text-right bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20 shrink-0">
                <div className="text-[10px] font-bold text-purple-200 uppercase tracking-wider">Current Focus</div>
                <div className="text-xs font-black text-white mt-0.5">
                  {currentGap?.status === 'CURRENT_GRADE_RELEARNING'
                    ? 'Grade 6: Percentage Calculations'
                    : currentGap?.status === 'MASTERED'
                    ? 'Concept Mastered 🏆'
                    : 'Grade 5: Equivalent Fractions'}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Phase Flow for Student */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 5-Phase Interactive Navigation */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                Your Learning Steps
              </h3>

              {/* Step 1: Foundation Learning */}
              <div
                onClick={() => setTestMode('NONE')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  testMode === 'NONE'
                    ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    PHASE 1: LOWER GRADE FOUNDATION
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 mt-2">
                  Grade 5: Equivalent Fractions & Scaling
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Learn how to scale any fraction to base 100 before tackling percentages.
                </p>
              </div>

              {/* Step 2: Foundation Check */}
              <div
                onClick={() => {
                  setTestMode('FOUNDATION');
                  setTestResult(null);
                  setCurrentTestAnswers({});
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  testMode === 'FOUNDATION'
                    ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    PHASE 2: FOUNDATION CHECK
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Min 80% to pass</span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 mt-2">
                  Take Grade 5 Verification Test
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  3 quick questions to confirm you have mastered fraction scaling.
                </p>
              </div>

              {/* Step 3: Current Grade Relearn */}
              <div
                onClick={() => setTestMode('NONE')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  ['CURRENT_GRADE_RELEARNING', 'MASTERED'].includes(currentGap?.status || '')
                    ? 'bg-sky-50/80 border-sky-300'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                    PHASE 3: CURRENT GRADE RELEARN
                  </span>
                  {['CURRENT_GRADE_RELEARNING', 'MASTERED'].includes(currentGap?.status || '') && (
                    <span className="text-[10px] font-bold text-emerald-600">Unlocked ✓</span>
                  )}
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 mt-2">
                  Grade 6: 3-Step Percentage Formula
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Apply your new fraction skills to percentage of quantities and word problems.
                </p>
              </div>

              {/* Step 4: Reassessment */}
              <div
                onClick={() => {
                  setTestMode('REASSESSMENT');
                  setTestResult(null);
                  setCurrentTestAnswers({});
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  testMode === 'REASSESSMENT'
                    ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-400/20'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    PHASE 4: FINAL REASSESSMENT
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Min 85% to master</span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 mt-2">
                  Take Grade 6 Mastery Reassessment
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Earn your official Achariya Concept Mastery Certificate!
                </p>
              </div>
            </div>

            {/* Right: Interactive Lesson Viewer or Interactive Quiz */}
            <div className="lg:col-span-8">
              {/* INTERACTIVE TEST RUNNER: FOUNDATION CHECK OR REASSESSMENT */}
              {testMode !== 'NONE' ? (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase">
                        {testMode === 'FOUNDATION' ? 'Phase 2: Foundation Check' : 'Phase 4: Mastery Reassessment'}
                      </span>
                      <h3 className="text-sm font-black text-slate-900 mt-1">
                        {testMode === 'FOUNDATION'
                          ? 'Grade 5 Equivalent Fractions Verification Test'
                          : 'Grade 6 Percentage Mastery Reassessment'}
                      </h3>
                    </div>

                    <button
                      onClick={() => setTestMode('NONE')}
                      className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                    >
                      ← Back to Lesson
                    </button>
                  </div>

                  {/* Test Questions List */}
                  {testResult ? (
                    /* Test Result Scorecard */
                    <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-50 to-purple-50/30 border border-purple-200 space-y-4 text-center">
                      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl font-black shadow-md bg-white text-purple-700">
                        {testResult.score}%
                      </div>
                      <h4 className="text-base font-black text-slate-900">
                        {testResult.score === 100
                          ? '🌟 100% Flawless Mastery Achieved!'
                          : testResult.isPassed || testResult.isMastered
                          ? '🎉 Baseline Verified! 100% Perfection Next!'
                          : 'Keep Going! Additional Practice Recommended'}
                      </h4>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        {testResult.message}
                      </p>

                      {/* ACHARIYA 100% LEARNING REQUIRED CALLOUT */}
                      {testResult.score < 100 && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-left space-y-2 max-w-lg mx-auto shadow-2xs">
                          <div className="flex items-center space-x-2 text-amber-900 font-black text-xs uppercase tracking-wide">
                            <span>★</span>
                            <span>Achariya 100% Learning Required Protocol</span>
                          </div>
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            In the Achariya standard, every scholar achieves <strong>100% complete understanding</strong>. You scored {testResult.score}%, which means only {100 - testResult.score}% remains. Let us close that final misconception right now!
                          </p>
                          <button
                            onClick={() => {
                              setShowCompanionModal(true);
                              handleAskCompanion('STEP_BY_STEP', `I want to achieve 100% mastery! Please guide me step-by-step through the question I missed in ${testMode === 'FOUNDATION' ? 'Equivalent Fractions' : 'Percentage Calculations'}.`);
                            }}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shadow-xs"
                          >
                            <span>🚀 Launch 100% Perfection Sprint (AI Micro-Check) →</span>
                          </button>
                        </div>
                      )}

                      {testResult.score === 100 && (
                        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold max-w-md mx-auto flex items-center justify-center space-x-2 shadow-2xs">
                          <span>🏆</span>
                          <span>Certified 100% Zero-Gap Concept Mastery — Achariya Gold Standard</span>
                        </div>
                      )}

                      <div className="text-left space-y-2 mt-4 pt-4 border-t border-slate-200">
                        <div className="text-xs font-bold text-slate-700">Question Feedback:</div>
                        {testResult.feedbackList?.map((fb: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span>Q{idx + 1}: {fb.questionText}</span>
                              <span className={fb.isCorrect ? 'text-emerald-600' : 'text-rose-600'}>
                                {fb.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Your answer: <strong>{fb.studentAnswer || '(none)'}</strong> · Correct: <strong className="text-emerald-700">{fb.correctAnswer}</strong>
                            </div>
                            {fb.explanation && (
                              <div className="text-[11px] text-indigo-700 italic">
                                Insight: {fb.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setTestMode('NONE');
                          loadDashboardData();
                        }}
                        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                      >
                        Continue Journey →
                      </button>
                    </div>
                  ) : (
                    /* Active Questions Form */
                    <div className="space-y-6">
                      {(testMode === 'FOUNDATION'
                        ? activePathwayData?.assessmentQuestions?.foundationCheck
                        : activePathwayData?.assessmentQuestions?.reassessmentMastery
                      )?.map((q: any, qIdx: number) => (
                        <div key={q.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-extrabold text-slate-800">
                              Question {qIdx + 1}
                            </span>
                            <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-bold">
                              Cognitive: {q.cognitiveSkill || 'UNDERSTAND'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-800 font-medium">{q.questionText}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options?.map((opt: string, oIdx: number) => {
                              const isSelected = currentTestAnswers[q.id] === opt;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() =>
                                    setCurrentTestAnswers(prev => ({ ...prev, [q.id]: opt }))
                                  }
                                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                                    isSelected
                                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                      : 'bg-white border-slate-200 text-slate-700 hover:bg-purple-50/50'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      <div className="pt-2 flex justify-end">
                        <button
                          disabled={submittingTest}
                          onClick={
                            testMode === 'FOUNDATION'
                              ? handleSubmitFoundationTest
                              : handleSubmitReassessment
                          }
                          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{submittingTest ? 'Evaluating Answers...' : 'Submit Assessment'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* INTERACTIVE LESSON CARDS: FOUNDATION & CURRENT GRADE */
                <div className="space-y-6">
                  {/* Step 1 Foundation Interactive Explainer Card */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase">
                          Lower Grade Foundation
                        </span>
                        <h3 className="text-sm font-black text-slate-900 mt-1">
                          Grade 5: Master Equivalent Fractions & Base-100 Scaling
                        </h3>
                      </div>

                      <button
                        onClick={() => handleCompleteStep('item-f1', 1)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Understood</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs text-slate-700 space-y-3">
                      <h4 className="font-extrabold text-amber-900 text-xs flex items-center space-x-1">
                        <span>💡</span>
                        <span>The Golden Rule of Equivalent Fractions</span>
                      </h4>
                      <p className="leading-relaxed">
                        To turn any fraction into a percentage, you must scale its denominator (bottom) to <strong>100</strong>.
                        Whatever you multiply the bottom by, you MUST multiply the top by the exact same number!
                      </p>

                      {/* Visual Fraction Multiplier Card */}
                      <div className="p-4 rounded-xl bg-white border border-amber-200 flex items-center justify-around font-mono text-center">
                        <div>
                          <div className="text-base font-black text-amber-700">3</div>
                          <div className="border-t border-slate-400 w-8 mx-auto my-0.5" />
                          <div className="text-base font-black text-slate-700">5</div>
                        </div>

                        <div className="text-slate-400 font-bold text-xs">
                          × 20 (top & bottom)
                          <ArrowRight className="w-4 h-4 mx-auto text-amber-600 mt-0.5" />
                        </div>

                        <div>
                          <div className="text-base font-black text-purple-700">60</div>
                          <div className="border-t border-slate-400 w-10 mx-auto my-0.5" />
                          <div className="text-base font-black text-slate-900">100</div>
                        </div>

                        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                          = 60%
                        </div>
                      </div>

                      {/* Interactive 100-Grid Tactile Manipulative (Zero Math Anxiety) */}
                      <div className="p-4 rounded-xl bg-white border border-purple-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-black">100</span>
                            <span className="text-xs font-bold text-slate-800">Tactile 100-Grid Explorer</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            {gridHighlightedCount} / 100 Shaded = {gridHighlightedCount}%
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500">
                          Tap any fraction preset to instantly see its 100-grid area:
                        </p>

                        <div className="flex flex-wrap gap-1.5 text-xs">
                          {[
                            { label: '1/4', count: 25, formula: '25%' },
                            { label: '2/5', count: 40, formula: '40%' },
                            { label: '1/2', count: 50, formula: '50%' },
                            { label: '3/4', count: 75, formula: '75%' },
                            { label: '7/20', count: 35, formula: '35%' }
                          ].map(item => (
                            <button
                              key={item.count}
                              onClick={() => setGridHighlightedCount(item.count)}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                                gridHighlightedCount === item.count
                                  ? 'bg-purple-600 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {item.label} = {item.formula}
                            </button>
                          ))}
                        </div>

                        {/* 10x10 Mini Grid */}
                        <div className="grid grid-cols-10 gap-0.5 p-2 bg-slate-50 rounded-xl border border-slate-200 max-w-[220px] mx-auto">
                          {Array.from({ length: 100 }).map((_, i) => (
                            <div
                              key={i}
                              onClick={() => setGridHighlightedCount(i + 1)}
                              className={`h-4 w-4 rounded-[2px] transition-colors cursor-pointer text-[7px] flex items-center justify-center font-mono select-none ${
                                i < gridHighlightedCount
                                  ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                                  : 'bg-white border border-slate-200 text-slate-300 hover:bg-purple-100'
                              }`}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step 2 Practice Worksheet Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Quick Practice Checkpoint</span>
                        <button
                          onClick={() => handleCompleteStep('item-f2', 1)}
                          className="text-[11px] font-bold text-purple-700 hover:underline"
                        >
                          Complete Worksheet ✓
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold">Problem 1</span>
                          <p className="font-bold text-slate-800 mt-0.5">Scale 7/20 to base 100:</p>
                          <div className="text-emerald-700 font-mono font-bold mt-1">20 × 5 = 100 ➔ 7 × 5 = 35/100 (35%)</div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold">Problem 2</span>
                          <p className="font-bold text-slate-800 mt-0.5">Scale 4/25 to base 100:</p>
                          <div className="text-emerald-700 font-mono font-bold mt-1">25 × 4 = 100 ➔ 4 × 4 = 16/100 (16%)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 Current Grade Relearning Card */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase">
                          Current Grade Relearn
                        </span>
                        <h3 className="text-sm font-black text-slate-900 mt-1">
                          Grade 6: The 3-Step Formula for Percentage of Quantities
                        </h3>
                      </div>

                      <button
                        onClick={() => handleCompleteStep('item-c1', 3)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Mastered</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/70 text-xs text-slate-700 space-y-3">
                      <div className="p-3 rounded-xl bg-white border border-purple-200 font-mono text-center text-sm font-black text-purple-900">
                        Value = (Percentage / 100) × Total Quantity
                      </div>

                      <div className="space-y-2">
                        <div className="font-bold text-slate-800">Worked Example:</div>
                        <p className="p-3 bg-white rounded-xl border border-slate-200 leading-relaxed">
                          <strong>Problem:</strong> Calculate 25% of 240 students in the Achariya Sports Meet.<br />
                          <strong>Step 1:</strong> 25% = 25/100 = 1/4.<br />
                          <strong>Step 2:</strong> (1/4) × 240 = 240 ÷ 4 = <strong>60 students</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* VIEW C: LEARNING ACADEMY CENTRAL & HOC DASHBOARD                         */}
      {/* ======================================================================= */}
      {activeTab === 'learning-academy' && (
        <div className="space-y-6">
          {/* Executive Natural Language Explorer Bar */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-md space-y-4">
            <div className="flex items-center space-x-2.5 text-purple-400">
              <Bot className="w-5 h-5" />
              <h3 className="text-sm font-black text-white">Central Learning Academy Natural Language Query Engine</h3>
            </div>
            <p className="text-xs text-slate-300">
              Query institution-wide network metrics, systemic cross-campus bottlenecks, or request curriculum recommendations in plain English.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Which Grade 5 concepts are creating Grade 6 learning gaps?"
                value={academyQuery}
                onChange={e => setAcademyQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAskAcademyIntelligence()}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                disabled={academyLoading}
                onClick={handleAskAcademyIntelligence}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                {academyLoading ? 'Analyzing...' : 'Query AI'}
              </button>
            </div>

            {academyAnswer && (
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs text-purple-100 whitespace-pre-wrap leading-relaxed animate-in fade-in">
                {academyAnswer}
              </div>
            )}
          </div>

          {/* Multi-Campus Performance Comparison */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Consolidated Campus Learning Gap & Closure Rates
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Benchmarking remediation effectiveness across Achariya campuses
                </p>
              </div>

              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-xl">
                Academic Year 2026-2027
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campusComparison.map(c => (
                <div key={c.campusId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{c.campusName}</h4>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{c.campusCode}</span>
                    </div>
                    <span className="text-xs font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                      {c.closureRate}% Closure
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <div className="font-black text-slate-900 text-xs">{c.totalGaps}</div>
                      <div className="text-slate-400 text-[9px]">Total Gaps</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-rose-200 text-rose-700">
                      <div className="font-black text-xs">{c.criticalGaps}</div>
                      <div className="text-[9px]">Critical</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-200 text-emerald-700">
                      <div className="font-black text-xs">{c.masteredGaps}</div>
                      <div className="text-[9px]">Mastered</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Systemic Prerequisite Bottlenecks Heatmap */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Concept Difficulty & Prerequisite Bottlenecks Heatmap
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Concepts with the highest frequency of student learning gaps
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {conceptHeatmaps.map((ch, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-slate-900">{ch.conceptName}</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {ch.grade} · {ch.subject}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-700 mt-0.5 font-medium">
                      Root Prerequisite Bottlenecks:{' '}
                      {Object.keys(ch.prerequisiteBottlenecks || {}).join(', ') || 'Direct Concept Application'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 text-right">
                    <div>
                      <div className="text-xs font-black text-rose-600">
                        {ch.affectedStudents} students
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Avg Score: {ch.averageDiagnosticScore}%
                      </div>
                    </div>

                    <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full"
                        style={{ width: `${ch.closureRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Central Curriculum Improvement Recommendations */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-indigo-700">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-black text-slate-900">
                AI Central Learning Academy Curriculum Recommendations
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {curriculumRecs.map(rec => (
                <div key={rec.id} className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      {rec.priority} PRIORITY
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">{rec.subject} · {rec.grade}</span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900">{rec.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{rec.finding}</p>

                  <div className="pt-2 border-t border-indigo-100 space-y-1">
                    <div className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">Action Items:</div>
                    {rec.actionItems?.map((act: string, aIdx: number) => (
                      <div key={aIdx} className="text-[11px] text-slate-700 flex items-start space-x-1.5">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* VIEW D: INDIVIDUAL STUDENT LEARNING GAP & MASTERY REPORT                 */}
      {/* ======================================================================= */}
      {activeTab === 'student-report' && currentGap && (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Printable Report Header */}
          <div className="flex items-start justify-between border-b pb-6 border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black tracking-widest text-purple-700 uppercase">
                  ACHARIYA WORLD CLASS EDUCATION
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Individual Student Learning Gap & Mastery Report
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Concept Diagnosis, Prerequisite Path & Mastery Verification Log
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Student Name</span>
              <div className="font-extrabold text-slate-900 mt-0.5">{currentGap.studentName}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Grade & Cohort</span>
              <div className="font-extrabold text-slate-900 mt-0.5">{currentGap.grade} - Section A</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Campus</span>
              <div className="font-extrabold text-slate-900 mt-0.5">{currentGap.campusName}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Reporting Date</span>
              <div className="font-extrabold text-slate-900 mt-0.5">{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Gap Detail Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Concept Diagnosis & Prerequisite Mapping</h3>
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Target Concept</th>
                  <th className="p-3">Diagnostic Score</th>
                  <th className="p-3">Root Prerequisite</th>
                  <th className="p-3">Foundation Check</th>
                  <th className="p-3">Reassessment</th>
                  <th className="p-3">Mastery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3 font-bold text-slate-900">{currentGap.conceptName}</td>
                  <td className="p-3 text-rose-600 font-bold">{currentGap.diagnosticScore}%</td>
                  <td className="p-3 text-amber-800 font-bold">{currentGap.identifiedPrerequisiteName}</td>
                  <td className="p-3 text-emerald-700 font-bold">
                    {currentGap.foundationAssessmentScore ? `${currentGap.foundationAssessmentScore}% ✓` : 'In Progress'}
                  </td>
                  <td className="p-3 text-purple-700 font-bold">
                    {currentGap.currentGradeReassessmentScore ? `${currentGap.currentGradeReassessmentScore}% ✓` : 'Pending'}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      currentGap.status === 'MASTERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {currentGap.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Teacher & Principal Attestation */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-center">
            <div>
              <div className="border-b border-slate-300 pb-8 text-slate-400 italic">Dr. Priya Sivaraman</div>
              <div className="font-bold text-slate-700 mt-1">Assigned Senior Faculty</div>
            </div>
            <div>
              <div className="border-b border-slate-300 pb-8 text-slate-400 italic">Meenakshi Sundaram / Dr. Rajesh K. Varma</div>
              <div className="font-bold text-slate-700 mt-1">Campus Principal / Academic Lead</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 1: TEACHER ACTION & CLINICAL OBSERVATIONS                         */}
      {/* ======================================================================= */}
      {showTeacherActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2 text-purple-700">
                <GraduationCap className="w-5 h-5" />
                <h3 className="font-extrabold text-sm text-slate-900">Teacher Intervention Action</h3>
              </div>
              <button
                onClick={() => setShowTeacherActionModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Select Intervention Action
                </label>
                <select
                  value={teacherActionType}
                  onChange={e => setTeacherActionType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800"
                >
                  <option value="APPROVE_INTERVENTION">Approve Lower-Grade Redirection</option>
                  <option value="RECORD_OBSERVATION">Record Classroom Observation Note</option>
                  <option value="TRIGGER_REASSESSMENT">Trigger Immediate Reassessment</option>
                  <option value="RECOMMEND_CLOSURE">Recommend Gap Closure & Mastery</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Teacher Notes / Clinical Observation
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter observation notes, targeted guidance or feedback..."
                  value={teacherActionNotes}
                  onChange={e => setTeacherActionNotes(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowTeacherActionModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleExecuteTeacherAction}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Saving...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: AI SOCRATIC LEARNING COMPANION (Engine H)                       */}
      {/* ======================================================================= */}
      {showCompanionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">Achariya AI Socratic Learning Companion</h3>
                  <p className="text-[11px] text-slate-500">Helping {currentGap?.studentName || 'Student'} conquer {currentGap?.conceptName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCompanionModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* 6 Explanation Modes Chips */}
            <div className="flex flex-wrap gap-1.5 shrink-0 pt-1">
              {[
                { id: 'STEP_BY_STEP', label: '🔢 Step-by-Step' },
                { id: 'VISUAL_EXPLANATION', label: '🎨 Visual 100-Grid' },
                { id: 'REAL_LIFE_EXAMPLE', label: '🛍️ Real-Life Example' },
                { id: 'SIMPLE_EXPLANATION', label: '💡 Simple Concept' },
                { id: 'PRACTICE_MODE', label: '✍️ Practice Mode' },
                { id: 'CHALLENGE_MODE', label: '⚡ Challenge' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setCompanionMode(m.id as any);
                    handleSendCompanionMessage(`Switching to ${m.label} mode. Explain this concept for me!`);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    companionMode === m.id
                      ? 'bg-amber-500 text-slate-950 shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 min-h-[250px]">
              {companionMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'student' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === 'student'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-2xs whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {companionLoading && (
                <div className="flex items-center space-x-2 text-xs text-slate-500 italic p-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-600" />
                  <span>Companion is thinking and preparing your explanation...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="flex items-center space-x-2 shrink-0 pt-2">
              <input
                type="text"
                placeholder="Ask your companion anything (e.g. 'How do I scale 7/20?')..."
                value={companionInput}
                onChange={e => setCompanionInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendCompanionMessage()}
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <button
                disabled={companionLoading || !companionInput.trim()}
                onClick={() => handleSendCompanionMessage()}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 3: AI STUDENT LEARNING PROFILE (Section 13)                       */}
      {/* ======================================================================= */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2 text-purple-700">
                <User className="w-5 h-5" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Continuous AI Student Learning Profile
                </h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {profileLoading ? (
              <div className="py-12 text-center text-xs text-slate-500">Compiling real-time cognitive metrics...</div>
            ) : profileData ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
                  <div>
                    <span className="text-[10px] text-purple-600 font-bold uppercase">Student</span>
                    <div className="font-extrabold text-slate-900 mt-0.5">{profileData.studentName}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-600 font-bold uppercase">Learning Pace</span>
                    <div className="font-extrabold text-purple-800 mt-0.5">{profileData.learningPace}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-600 font-bold uppercase">Retention Index</span>
                    <div className="font-extrabold text-emerald-700 mt-0.5">{profileData.retentionIndex}%</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-600 font-bold uppercase">Active Critical Gaps</span>
                    <div className="font-extrabold text-rose-700 mt-0.5">{profileData.criticalGaps?.length || 0}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-700">Mastered Concepts:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {profileData.masteredConcepts?.map((c: string, idx: number) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                        ✓ {c}
                      </span>
                    ))}
                    {profileData.masteredConcepts?.length === 0 && <span className="text-slate-400 italic">None yet</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-700">Identified Prerequisite Bottlenecks:</div>
                  {profileData.prerequisiteDeficiencies?.map((p: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                      <strong>{p.grade}:</strong> {p.prereqName} (impeding <em>{p.affectedTargetConcept}</em>)
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 4: AI ADAPTIVE QUESTION GENERATOR (Engine G)                      */}
      {/* ======================================================================= */}
      {showQuestionGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div className="flex items-center space-x-2 text-indigo-700">
                <Cpu className="w-5 h-5" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  AI Adaptive Question Generator
                </h3>
              </div>
              <button
                onClick={() => setShowQuestionGenModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
              <div className="font-bold text-slate-700">
                Concept: <span className="text-purple-700">{currentGap?.conceptName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-500 font-bold">Difficulty:</span>
                {(['EASY', 'MEDIUM', 'HARD'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => {
                      setGenDifficulty(diff);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      genDifficulty === diff ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-700'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
                <button
                  disabled={generatingQuestions}
                  onClick={handleGenerateQuestions}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg font-bold text-xs hover:bg-purple-700 disabled:opacity-50"
                >
                  {generatingQuestions ? 'Generating...' : 'Regenerate'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {generatingQuestions ? (
                <div className="py-12 text-center text-slate-500">Generating validated CBSE questions...</div>
              ) : generatedQuestions.length > 0 ? (
                generatedQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between font-bold">
                      <span>Q{idx + 1}: {q.questionText}</span>
                      <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {q.cognitiveSkill}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {q.options?.map((opt: string, oIdx: number) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg border ${
                            opt === q.correctAnswer
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          {opt} {opt === q.correctAnswer && '✓'}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 italic">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400">Click Regenerate to generate questions.</div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 shrink-0">
              <button
                onClick={() => setShowQuestionGenModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 5: 1-PAGE HYBRID PRINTABLE BRIDGE WORKSHEET WITH 2D QR CODE      */}
      {/* Unique in Market: Bridge between physical classroom & digital LMS       */}
      {/* ======================================================================= */}
      {showBridgeWorksheetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b pb-4 print:hidden">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    1-Page Hybrid Bridge Worksheet (A4 Printable)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Hand this to students in class. Parent or teacher scans the 2D QR code to auto-sync mastery!
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print A4 Page</span>
                </button>
                <button
                  onClick={() => setShowBridgeWorksheetModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable A4 Worksheet Sheet */}
            <div className="border border-slate-300 rounded-2xl p-6 bg-white space-y-5 print:border-none print:p-0 print:m-0 text-slate-900 font-sans">
              {/* Institutional Header */}
              <div className="border-b-2 border-purple-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black tracking-tight text-purple-950 uppercase">
                    Achariya World Class Education
                  </h2>
                  <p className="text-[11px] font-bold text-slate-600">
                    AI Remedial Bridge · 15-Minute Mastery Sprint
                  </p>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-mono">
                  <span>ACH-BRIDGE-G5-G6-001</span>
                </div>
              </div>

              {/* Student Metadata Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Student Name:</span>
                  <div className="font-bold text-slate-800">{currentGap?.studentName || 'Aarav Sundaram'}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Grade & Sec:</span>
                  <div className="font-bold text-slate-800">{currentGap?.grade || 'Grade 6'} - A</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Subject:</span>
                  <div className="font-bold text-slate-800">{currentGap?.subject || 'Mathematics'}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Date / Time:</span>
                  <div className="font-bold text-slate-800">{new Date().toLocaleDateString('en-IN')}</div>
                </div>
              </div>

              {/* Learning Target Box */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs">
                <span className="font-black text-purple-900">Bridge Target: </span>
                <span className="text-purple-800">
                  Scaling Fractions to Denominator 100 (Grade 5 Prerequisite for Grade 6 Percentages)
                </span>
              </div>

              {/* Three-Tiered Scaffolded Exercises */}
              <div className="space-y-4 text-xs">
                {/* Level 1: Remember */}
                <div className="space-y-1.5">
                  <div className="font-bold text-purple-900 flex items-center justify-between bg-slate-100 p-1.5 rounded">
                    <span>Part A: Find the Scaling Multiplier to reach 100</span>
                    <span className="text-[10px] text-slate-500 font-normal">[Recall & Fluency]</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                    <div className="p-2 border border-slate-200 rounded">1) 5 × [____] = 100</div>
                    <div className="p-2 border border-slate-200 rounded">2) 20 × [____] = 100</div>
                    <div className="p-2 border border-slate-200 rounded">3) 25 × [____] = 100</div>
                  </div>
                </div>

                {/* Level 2: Understand with Guided Steps */}
                <div className="space-y-1.5">
                  <div className="font-bold text-purple-900 flex items-center justify-between bg-slate-100 p-1.5 rounded">
                    <span>Part B: Convert Fractions to Percentages (Multiply top & bottom)</span>
                    <span className="text-[10px] text-slate-500 font-normal">[Conceptual Transfer]</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 border border-slate-200 rounded space-y-2">
                      <div className="font-semibold">Convert 3/5 to percentage:</div>
                      <div className="font-mono text-slate-600 leading-loose">
                        3/5 = (3 × [____]) / (5 × 20) = [____]/100 = [____]%
                      </div>
                    </div>
                    <div className="p-3 border border-slate-200 rounded space-y-2">
                      <div className="font-semibold">Convert 7/20 to percentage:</div>
                      <div className="font-mono text-slate-600 leading-loose">
                        7/20 = (7 × [____]) / (20 × [____]) = [____]/100 = [____]%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Level 3: Real-World Application */}
                <div className="space-y-1.5">
                  <div className="font-bold text-purple-900 flex items-center justify-between bg-slate-100 p-1.5 rounded">
                    <span>Part C: Real-World Achariya Context Challenge</span>
                    <span className="text-[10px] text-slate-500 font-normal">[Application]</span>
                  </div>
                  <div className="p-3 border border-slate-200 rounded space-y-2 leading-relaxed">
                    <p>
                      In the Achariya Annual Sports Meet, Rahul attempted 25 basketball free throws and successfully scored 18 baskets.
                    </p>
                    <div className="font-semibold">
                      What percentage of his free throws did Rahul score?
                    </div>
                    <div className="h-10 border-b border-dashed border-slate-300 mt-2 flex items-end font-mono text-slate-400">
                      Working space: _________________________________________ Answer: [________]%
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Verification Footer with 2D QR Code */}
              <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center p-1">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <div className="font-bold text-slate-700">QR Auto-Sync Verification</div>
                    <div>Scan with Achariya Parent or Staff App</div>
                    <div>Updates student mastery profile in real-time</div>
                  </div>
                </div>

                <div className="flex items-center space-x-8 text-[11px] text-slate-600">
                  <div className="text-center">
                    <div className="h-6 border-b border-slate-400 w-24 mb-1" />
                    <span>Teacher Sign</span>
                  </div>
                  <div className="text-center">
                    <div className="h-6 border-b border-slate-400 w-24 mb-1" />
                    <span>Parent Sign</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
