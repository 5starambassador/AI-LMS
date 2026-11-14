import React, { useState, useMemo } from 'react';
import {
  Home,
  Check,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  BookOpen,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  RotateCcw,
  Sliders,
  Layers,
  Copy,
  Info
} from 'lucide-react';
import { apiPost } from '../lib/api';
import {
  ACHARIYA_EXAM_CATALOG,
  SubjectCurriculumCatalog,
  ChapterLessonCurriculum,
  LearningOutcomeItem
} from '../data/exam-builder-catalog';

interface QuestionBankEntry {
  id: string;
  catalogKey: 'g5-math' | 'g5-sci';
  boards: string[];
  type: 'MCQ' | 'Short Answer' | 'Case Study' | 'Long Answer';
  category: 'Competency-Based' | 'Application-Based' | 'Higher-Order Thinking (HOTS)';
  difficulty: 'Foundation' | 'Standard' | 'HOTS';
  marks: number;
  chapter: string;
  lo: string;
  q: string;
  ans: string;
  scheme: string;
  bloom: 'Knowledge' | 'Comprehension' | 'Application' | 'Analysis' | 'Synthesis';
}

const DEFAULT_QUESTION_BANK: QuestionBankEntry[] = [
  {
    id: 'qb-m-1', catalogKey: 'g5-math', boards: ['CBSE', 'ICSE', 'STATE'],
    type: 'MCQ', category: 'Competency-Based', difficulty: 'Foundation', marks: 1,
    chapter: 'We the Travellers - I', lo: '#35326',
    q: 'What is the place value of digit 7 in 47,825?',
    ans: '7,000 (Thousands)', scheme: '1M full credit for option B', bloom: 'Knowledge'
  },
  {
    id: 'qb-m-2', catalogKey: 'g5-math', boards: ['CBSE', 'STATE'],
    type: 'Short Answer', category: 'Application-Based', difficulty: 'Standard', marks: 2,
    chapter: 'We the Travellers - I', lo: '#35327',
    q: 'Round off 34,562 to the nearest ten and nearest hundred.',
    ans: '34,560 and 34,600', scheme: '1M for nearest ten + 1M for nearest hundred', bloom: 'Comprehension'
  },
  {
    id: 'qb-m-3', catalogKey: 'g5-math', boards: ['CBSE', 'ICSE'],
    type: 'Case Study', category: 'Application-Based', difficulty: 'Standard', marks: 2,
    chapter: 'Fractions', lo: '#35341',
    q: 'Out of 25 saplings planted in the campus garden, 18 survived. Express this fraction with denominator 100 and as a percentage.',
    ans: '72/100 = 72%', scheme: '1M equivalent fraction scaling (x4) + 1M percentage conversion', bloom: 'Application'
  },
  {
    id: 'qb-m-4', catalogKey: 'g5-math', boards: ['CBSE', 'ICSE', 'STATE'],
    type: 'Long Answer', category: 'Higher-Order Thinking (HOTS)', difficulty: 'HOTS', marks: 5,
    chapter: 'We the Travellers - II', lo: '#35364',
    q: 'A train travels from Puducherry to Villupuram (40 km) in 45 minutes. Calculate average speed.',
    ans: '53.33 km/h (accept 53 1/3 km/h or equivalent method)',
    scheme: '1M convert 45m -> 0.75h + 2M formula v=d/t + 2M calculation (any valid method accepted)', bloom: 'Analysis'
  },
  {
    id: 'qb-m-5', catalogKey: 'g5-math', boards: ['CBSE', 'STATE'],
    type: 'Short Answer', category: 'Competency-Based', difficulty: 'Standard', marks: 2,
    chapter: 'Angles as Turns', lo: '#35352',
    q: 'Through how many degrees does the minute hand of a clock rotate between 9:00 AM and 9:15 AM?',
    ans: '90° (one-quarter turn = right angle)', scheme: '1M quarter-turn identification + 1M degree calculation', bloom: 'Application'
  },
  {
    id: 'qb-s-1', catalogKey: 'g5-sci', boards: ['CBSE', 'ICSE', 'STATE'],
    type: 'MCQ', category: 'Competency-Based', difficulty: 'Foundation', marks: 1,
    chapter: 'Energy, Solar Radiation & Chlorophyll', lo: '#40101',
    q: 'Which pigment inside plant leaves absorbs solar photons during photosynthesis?',
    ans: 'Chlorophyll (in chloroplasts)', scheme: '1M full credit for Chlorophyll', bloom: 'Knowledge'
  },
  {
    id: 'qb-s-2', catalogKey: 'g5-sci', boards: ['CBSE', 'STATE'],
    type: 'Short Answer', category: 'Application-Based', difficulty: 'Standard', marks: 2,
    chapter: 'Energy, Solar Radiation & Chlorophyll', lo: '#40102',
    q: 'Write the balanced word equation for photosynthesis and state both raw materials.',
    ans: 'Carbon dioxide + Water --(Sunlight, Chlorophyll)--> Glucose + Oxygen',
    scheme: '1M raw materials (CO2 + Water) + 1M products (Glucose + O2)', bloom: 'Comprehension'
  },
  {
    id: 'qb-s-3', catalogKey: 'g5-sci', boards: ['CBSE', 'ICSE'],
    type: 'Long Answer', category: 'Higher-Order Thinking (HOTS)', difficulty: 'HOTS', marks: 5,
    chapter: 'Energy, Solar Radiation & Chlorophyll', lo: '#40103',
    q: 'Design a simple classroom experiment using an aquatic plant (Hydrilla) to prove oxygen is released under sunlight.',
    ans: 'Invert funnel over Hydrilla in beaker with water + sodium bicarbonate; gas bubbles collect in inverted test tube and relight a glowing splinter.',
    scheme: '2M labelled setup + 1M control vs sunlit tube + 2M glowing splinter oxygen test', bloom: 'Synthesis'
  }
];

const BLUEPRINT_PRESETS: Record<string, { label: string; duration: string; bookBackRatio: number; sections: ExamSectionConfig[] }> = {
  TERM_50: {
    label: 'Term 1 Standard (50M)',
    duration: '1 hr 30 min',
    bookBackRatio: 20,
    sections: [
      {
        id: 'sec-preset-t1', romanNumeral: 'I', name: 'Section I — Objective', selectedOutcomeIds: [],
        questionTypes: [
          { id: 'qt-p1', type: 'MCQ', label: '◉ MCQ', icon: '◉', badgeBg: 'bg-purple-100 text-purple-900 border-purple-200', count: 5, marksEach: 1 },
          { id: 'qt-p2', type: 'FILL_BLANK', label: '_ Fill Blank', icon: '_', badgeBg: 'bg-sky-100 text-sky-900 border-sky-200', count: 5, marksEach: 1 },
          { id: 'qt-p3', type: 'TRUE_FALSE', label: '✓X True / False', icon: '✓X', badgeBg: 'bg-amber-100 text-amber-900 border-amber-200', count: 4, marksEach: 1 }
        ]
      },
      {
        id: 'sec-preset-t2', romanNumeral: 'II', name: 'Section II — Short Answer & Case Study', selectedOutcomeIds: [],
        questionTypes: [
          { id: 'qt-p4', type: 'SHORT_ANSWER', label: '✏️ Short Answer', icon: '✏️', badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200', count: 4, marksEach: 2 },
          { id: 'qt-p5', type: 'CASE_STUDY', label: '📖 Case Study', icon: '📖', badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-200', count: 1, marksEach: 2 },
          { id: 'qt-p6', type: 'MATCH_FOLLOWING', label: '🔗 Match Following', icon: '🔗', badgeBg: 'bg-rose-100 text-rose-900 border-rose-200', count: 1, marksEach: 1 }
        ]
      },
      {
        id: 'sec-preset-t3', romanNumeral: 'III', name: 'Section III — Long Answer & HOTS', selectedOutcomeIds: [],
        questionTypes: [
          { id: 'qt-p7', type: 'LONG_ANSWER', label: '📝 Long Answer', icon: '📝', badgeBg: 'bg-teal-100 text-teal-900 border-teal-200', count: 5, marksEach: 5 }
        ]
      }
    ]
  },
  DIAGNOSTIC_25: {
    label: 'Periodic Diagnostic (25M)',
    duration: '45 min',
    bookBackRatio: 10,
    sections: [
      {
        id: 'sec-preset-d1', romanNumeral: 'I', name: 'Section I — Competency MCQs', selectedOutcomeIds: [],
        questionTypes: [
          { id: 'qt-d1', type: 'MCQ', label: '◉ MCQ', icon: '◉', badgeBg: 'bg-purple-100 text-purple-900 border-purple-200', count: 10, marksEach: 1 }
        ]
      },
      {
        id: 'sec-preset-d2', romanNumeral: 'II', name: 'Section II — Prerequisite Reasoning', selectedOutcomeIds: [],
        questionTypes: [
          { id: 'qt-d2', type: 'SHORT_ANSWER', label: '✏️ Short Answer', icon: '✏️', badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200', count: 5, marksEach: 2 },
          { id: 'qt-d3', type: 'LONG_ANSWER', label: '📝 Long Answer', icon: '📝', badgeBg: 'bg-teal-100 text-teal-900 border-teal-200', count: 1, marksEach: 5 }
        ]
      }
    ]
  },
  CBSE_80: {
    label: 'CBSE Competency Board (80M)',
    duration: '3 hrs',
    bookBackRatio: 25,
    sections: [
      {
        id: 'sec-preset-c1', romanNumeral: 'I', name: 'Section I — Competency MCQ & Assertion-Reason', selectedOutcomeIds: [],
        questionTypes: [
          { id: 'qt-c1', type: 'MCQ', label: '◉ MCQ', icon: '◉', badgeBg: 'bg-purple-100 text-purple-900 border-purple-200', count: 16, marksEach: 1 },
          { id: 'qt-c2', type: 'ASSERTION_REASON', label: '⚡ Assertion & Reason', icon: '⚡', badgeBg: 'bg-orange-100 text-orange-900 border-orange-200', count: 4, marksEach: 2 }
        ]
      },
      {
        id: 'sec-preset-c2', romanNumeral: 'II', name: 'Section II — Short Application & Case Studies', selectedOutcomeIds: [],
        questionTypes: [
          { id: 'qt-c3', type: 'SHORT_ANSWER', label: '✏️ Short Answer', icon: '✏️', badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200', count: 10, marksEach: 2 },
          { id: 'qt-c4', type: 'CASE_STUDY', label: '📖 Case Study', icon: '📖', badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-200', count: 5, marksEach: 2 }
        ]
      },
      {
        id: 'sec-preset-c3', romanNumeral: 'III', name: 'Section III — HOTS Long Answers', selectedOutcomeIds: [],
        questionTypes: [
          { id: 'qt-c5', type: 'LONG_ANSWER', label: '📝 Long Answer', icon: '📝', badgeBg: 'bg-teal-100 text-teal-900 border-teal-200', count: 5, marksEach: 5 }
        ]
      }
    ]
  }
};

export type QuestionTypeId =
  | 'MCQ'
  | 'FILL_BLANK'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'CASE_STUDY'
  | 'MATCH_FOLLOWING'
  | 'LONG_ANSWER'
  | 'ASSERTION_REASON';

export interface QuestionTypeConfig {
  id: string;
  type: QuestionTypeId;
  label: string;
  icon: string;
  badgeBg: string;
  count: number;
  marksEach: number;
}

export interface ExamSectionConfig {
  id: string;
  romanNumeral: string;
  name: string;
  questionTypes: QuestionTypeConfig[];
  selectedOutcomeIds: string[];
}

const QUESTION_TYPE_TEMPLATES: Record<
  QuestionTypeId,
  { label: string; icon: string; badgeBg: string; defaultMarks: number }
> = {
  MCQ: {
    label: '◉ MCQ',
    icon: '◉',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
    defaultMarks: 1
  },
  FILL_BLANK: {
    label: '_ Fill Blank',
    icon: '_',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-200',
    defaultMarks: 1
  },
  TRUE_FALSE: {
    label: '✓X True / False',
    icon: '✓X',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
    defaultMarks: 1
  },
  SHORT_ANSWER: {
    label: '✏️ Short Answer',
    icon: '✏️',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    defaultMarks: 2
  },
  CASE_STUDY: {
    label: '📖 Case Study',
    icon: '📖',
    badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    defaultMarks: 2
  },
  MATCH_FOLLOWING: {
    label: '🔗 Match Following',
    icon: '🔗',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-200',
    defaultMarks: 1
  },
  LONG_ANSWER: {
    label: '📝 Long Answer',
    icon: '📝',
    badgeBg: 'bg-teal-100 text-teal-900 border-teal-200',
    defaultMarks: 5
  },
  ASSERTION_REASON: {
    label: '⚡ Assertion & Reason',
    icon: '⚡',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-200',
    defaultMarks: 2
  }
};

interface ExamBuilderStudioProps {
  onBackToHub?: () => void;
  onExamGenerated?: (examPayload: any) => void;
}

export const ExamBuilderStudio: React.FC<ExamBuilderStudioProps> = ({
  onBackToHub,
  onExamGenerated
}) => {
  // Navigation / Stepper State
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  // Catalog selectors
  const [selectedGrade, setSelectedGrade] = useState('Grade 5');
  const [selectedCatalogKey, setSelectedCatalogKey] = useState('g5-math');
  const catalog: SubjectCurriculumCatalog =
    ACHARIYA_EXAM_CATALOG[selectedCatalogKey] || ACHARIYA_EXAM_CATALOG['g5-math'];

  // Step 1: Learning Outcomes selection state
  // Map of outcome id -> boolean
  const [selectedOutcomeIds, setSelectedOutcomeIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    catalog.lessons.forEach(lesson => {
      lesson.outcomes.forEach(oc => {
        initial[oc.id] = true; // All selected by default as in screenshot
      });
    });
    return initial;
  });

  const [expandedLessonIds, setExpandedLessonIds] = useState<Record<string, boolean>>({
    'les-6404': true // First lesson expanded by default as in screenshot 1
  });

  const [outcomeSearchQuery, setOutcomeSearchQuery] = useState('');

  // Step 2: Blueprint & Sections state
  const [schoolName, setSchoolName] = useState('Achariya School Demo');
  const [examTitle, setExamTitle] = useState('Golden Concord Summative Exam');
  const [duration, setDuration] = useState('1 hr');
  const [existingExamCode, setExistingExamCode] = useState('exam:16:1616:1783619017070');
  const [bringOutcomesToo, setBringOutcomesToo] = useState(true);
  const [bookBackRatio, setBookBackRatio] = useState(0);
  const [parallelSetsCount, setParallelSetsCount] = useState<1 | 2 | 3>(3);
  const [activePreviewSet, setActivePreviewSet] = useState<'SET_A' | 'SET_B' | 'SET_C'>('SET_A');

  // Sections configuration
  const [sections, setSections] = useState<ExamSectionConfig[]>([
    {
      id: 'sec-1',
      romanNumeral: 'I',
      name: 'Section I — Objective',
      selectedOutcomeIds: [],
      questionTypes: [
        { id: 'qt-1', type: 'MCQ', label: '◉ MCQ', icon: '◉', badgeBg: 'bg-purple-100 text-purple-900 border-purple-200', count: 5, marksEach: 1 },
        { id: 'qt-2', type: 'FILL_BLANK', label: '_ Fill Blank', icon: '_', badgeBg: 'bg-sky-100 text-sky-900 border-sky-200', count: 5, marksEach: 1 },
        { id: 'qt-3', type: 'TRUE_FALSE', label: '✓X True / False', icon: '✓X', badgeBg: 'bg-amber-100 text-amber-900 border-amber-200', count: 4, marksEach: 1 }
      ]
    },
    {
      id: 'sec-2',
      romanNumeral: 'II',
      name: 'Section II — Short answer',
      selectedOutcomeIds: [],
      questionTypes: [
        { id: 'qt-4', type: 'SHORT_ANSWER', label: '✏️ Short Answer', icon: '✏️', badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200', count: 4, marksEach: 2 },
        { id: 'qt-5', type: 'CASE_STUDY', label: '📖 Case Study', icon: '📖', badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-200', count: 1, marksEach: 2 },
        { id: 'qt-6', type: 'MATCH_FOLLOWING', label: '🔗 Match Following', icon: '🔗', badgeBg: 'bg-rose-100 text-rose-900 border-rose-200', count: 1, marksEach: 1 }
      ]
    },
    {
      id: 'sec-3',
      romanNumeral: 'III',
      name: 'Section III — Long answer',
      selectedOutcomeIds: [],
      questionTypes: [
        { id: 'qt-7', type: 'LONG_ANSWER', label: '📝 Long Answer', icon: '📝', badgeBg: 'bg-teal-100 text-teal-900 border-teal-200', count: 2, marksEach: 5 }
      ]
    }
  ]);

  // Modals & Popovers
  const [showPictureHelp, setShowPictureHelp] = useState(false);
  const [showQuestionBankBrowser, setShowQuestionBankBrowser] = useState(false);
  const [showOutcomeScopeModal, setShowOutcomeScopeModal] = useState<string | null>(null);
  const [qbFilterBoard, setQbFilterBoard] = useState('CBSE');
  const [qbFilterChapter, setQbFilterChapter] = useState('ALL');
  const [qbFilterBloom, setQbFilterBloom] = useState('ALL');
  const [qbFilterDifficulty, setQbFilterDifficulty] = useState('ALL');
  const [qbFilterType, setQbFilterType] = useState('ALL');
  const [customBankQuestions, setCustomBankQuestions] = useState<QuestionBankEntry[]>([]);
  const [showAddCustomQ, setShowAddCustomQ] = useState(false);
  const [customQDraft, setCustomQDraft] = useState({
    q: '',
    ans: '',
    scheme: '',
    chapter: 'We the Travellers - I',
    bloom: 'Application' as QuestionBankEntry['bloom'],
    difficulty: 'Standard' as QuestionBankEntry['difficulty'],
    type: 'Short Answer' as QuestionBankEntry['type'],
    marks: 2
  });
  const [academicValidated, setAcademicValidated] = useState(true);
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);
  const [generatedExamModal, setGeneratedExamModal] = useState<any | null>(null);

  // In-app Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations for Step 1
  const allOutcomeIds = useMemo(() => {
    const ids: string[] = [];
    catalog.lessons.forEach(l => l.outcomes.forEach(o => ids.push(o.id)));
    return ids;
  }, [catalog]);

  const selectedOutcomesCount = useMemo(() => {
    return Object.values(selectedOutcomeIds).filter(Boolean).length;
  }, [selectedOutcomeIds]);

  // Calculations for Step 2
  const grandTotalQuestions = useMemo(() => {
    return sections.reduce(
      (acc, sec) => acc + sec.questionTypes.reduce((qAcc, qt) => qAcc + (Number(qt.count) || 0), 0),
      0
    );
  }, [sections]);

  const grandTotalMarks = useMemo(() => {
    return sections.reduce(
      (acc, sec) =>
        acc +
        sec.questionTypes.reduce(
          (qAcc, qt) => qAcc + (Number(qt.count) || 0) * (Number(qt.marksEach) || 0),
          0
        ),
      0
    );
  }, [sections]);

  // Step 1 Actions
  const handleSelectAllOutcomes = () => {
    const updated: Record<string, boolean> = {};
    allOutcomeIds.forEach(id => {
      updated[id] = true;
    });
    setSelectedOutcomeIds(updated);
    showToast(`All ${allOutcomeIds.length} curriculum outcomes selected.`);
  };

  const handleClearAllOutcomes = () => {
    setSelectedOutcomeIds({});
    showToast('All learning outcomes cleared. Please select at least one.');
  };

  const toggleOutcome = (id: string) => {
    setSelectedOutcomeIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLessonAll = (lesson: ChapterLessonCurriculum) => {
    const allLessonSelected = lesson.outcomes.every(o => selectedOutcomeIds[o.id]);
    setSelectedOutcomeIds(prev => {
      const next = { ...prev };
      lesson.outcomes.forEach(o => {
        next[o.id] = !allLessonSelected;
      });
      return next;
    });
  };

  const toggleLessonExpanded = (lessonId: string) => {
    setExpandedLessonIds(prev => ({ ...prev, [lessonId]: !prev[lessonId] }));
  };

  // Step 2 Actions
  const handleAddSection = () => {
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    const nextIdx = sections.length;
    const nextNum = numerals[nextIdx] || `${nextIdx + 1}`;
    const newSec: ExamSectionConfig = {
      id: `sec-${Date.now()}`,
      romanNumeral: nextNum,
      name: `Section ${nextNum} — Additional Section`,
      selectedOutcomeIds: [],
      questionTypes: [
        {
          id: `qt-${Date.now()}`,
          type: 'MCQ',
          label: '◉ MCQ',
          icon: '◉',
          badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
          count: 5,
          marksEach: 1
        }
      ]
    };
    setSections([...sections, newSec]);
    showToast(`Added Section ${nextNum}`);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (sections.length <= 1) {
      showToast('Exam must have at least one section.');
      return;
    }
    setSections(sections.filter(s => s.id !== sectionId));
    showToast('Section removed.');
  };

  const handleMoveSection = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const next = [...sections];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    setSections(next);
  };

  const handleAddQuestionType = (sectionId: string) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        const newQt: QuestionTypeConfig = {
          id: `qt-${Date.now()}`,
          type: 'SHORT_ANSWER',
          label: '✏️ Short Answer',
          icon: '✏️',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          count: 2,
          marksEach: 2
        };
        return { ...sec, questionTypes: [...sec.questionTypes, newQt] };
      })
    );
  };

  const handleUpdateQuestionType = (
    sectionId: string,
    qtId: string,
    updates: Partial<QuestionTypeConfig>
  ) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          questionTypes: sec.questionTypes.map(qt => (qt.id === qtId ? { ...qt, ...updates } : qt))
        };
      })
    );
  };

  const handleChangeQuestionTypeEnum = (sectionId: string, qtId: string, newType: QuestionTypeId) => {
    const tmpl = QUESTION_TYPE_TEMPLATES[newType];
    handleUpdateQuestionType(sectionId, qtId, {
      type: newType,
      label: tmpl.label,
      icon: tmpl.icon,
      badgeBg: tmpl.badgeBg,
      marksEach: tmpl.defaultMarks
    });
  };

  const handleDeleteQuestionType = (sectionId: string, qtId: string) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        if (sec.questionTypes.length <= 1) {
          showToast('Each section must contain at least 1 question type.');
          return sec;
        }
        return {
          ...sec,
          questionTypes: sec.questionTypes.filter(qt => qt.id !== qtId)
        };
      })
    );
  };

  const handleMoveQuestionType = (sectionId: string, index: number, direction: 'UP' | 'DOWN') => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id !== sectionId) return sec;
        const targetIdx = direction === 'UP' ? index - 1 : index + 1;
        if (targetIdx < 0 || targetIdx >= sec.questionTypes.length) return sec;
        const nextTypes = [...sec.questionTypes];
        const temp = nextTypes[index];
        nextTypes[index] = nextTypes[targetIdx];
        nextTypes[targetIdx] = temp;
        return { ...sec, questionTypes: nextTypes };
      })
    );
  };

  const handleCatalogChange = (newKey: string) => {
    setSelectedCatalogKey(newKey);
    setQbFilterChapter('ALL');
    const nextCatalog = ACHARIYA_EXAM_CATALOG[newKey] || ACHARIYA_EXAM_CATALOG['g5-math'];
    const nextOutcomes: Record<string, boolean> = {};
    nextCatalog.lessons.forEach(les => {
      les.outcomes.forEach(oc => {
        nextOutcomes[oc.id] = true;
      });
    });
    setSelectedOutcomeIds(nextOutcomes);
    const firstId = nextCatalog.lessons[0]?.id;
    setExpandedLessonIds(firstId ? { [firstId]: true } : {});
    setCustomQDraft(prev => ({
      ...prev,
      chapter: nextCatalog.lessons[0]?.title || prev.chapter
    }));
    showToast(`Switched curriculum catalog to ${selectedGrade} · ${nextCatalog.subjectName} (${nextCatalog.totalOutcomesCount} outcomes loaded).`);
  };

  // Blueprint Cloning & Presets
  const applyBlueprintPreset = (presetKey: keyof typeof BLUEPRINT_PRESETS, sourceLabel?: string) => {
    const preset = BLUEPRINT_PRESETS[presetKey];
    if (!preset) return;
    setSections(
      preset.sections.map((sec, idx) => ({
        ...sec,
        id: `sec-${Date.now()}-${idx}`,
        questionTypes: sec.questionTypes.map((qt, qIdx) => ({ ...qt, id: `qt-${Date.now()}-${idx}-${qIdx}` }))
      }))
    );
    setDuration(preset.duration);
    setBookBackRatio(preset.bookBackRatio);
    if (bringOutcomesToo) {
      handleSelectAllOutcomes();
    }
    showToast(`${sourceLabel || preset.label} synced to sections, duration (${preset.duration}) & weights.`);
  };

  const handleUseBlueprint = () => {
    const code = existingExamCode.trim();
    if (!code) {
      showToast('Please enter an exam code to reuse blueprint.');
      return;
    }
    if (code.includes('25') || code.toLowerCase().includes('diag')) {
      applyBlueprintPreset('DIAGNOSTIC_25', `Blueprint '${code}'`);
    } else if (code.includes('80') || code.toLowerCase().includes('board')) {
      applyBlueprintPreset('CBSE_80', `Blueprint '${code}'`);
    } else {
      applyBlueprintPreset('TERM_50', `Blueprint '${code}'`);
    }
  };

  // Final Exam Generation
  const handleTriggerExamGeneration = async () => {
    if (selectedOutcomesCount === 0) {
      showToast('Please select at least 1 learning outcome in Step 1.');
      setActiveStep(1);
      return;
    }

    if (grandTotalQuestions === 0 || grandTotalMarks === 0) {
      showToast('Please configure at least 1 question in your sections.');
      return;
    }

    if (!academicValidated) {
      showToast('Please confirm "Curriculum-Aligned & Academically Validated Before Publication" before generating.');
      return;
    }

    setIsGeneratingExam(true);

    const payload = {
      schoolName,
      examTitle,
      duration,
      grade: selectedGrade,
      subject: catalog.subjectName,
      subjectId: catalog.subjectId,
      selectedOutcomesCount,
      bookBackRatio,
      parallelSetsCount,
      parallelSetLabels: parallelSetsCount === 1 ? ['SET A'] : parallelSetsCount === 2 ? ['SET A', 'SET B'] : ['SET A', 'SET B', 'SET C'],
      totalQuestions: grandTotalQuestions,
      totalMarks: grandTotalMarks,
      sections: sections.map(sec => ({
        romanNumeral: sec.romanNumeral,
        name: sec.name,
        questionCount: sec.questionTypes.reduce((a, b) => a + (Number(b.count) || 0), 0),
        marksTotal: sec.questionTypes.reduce(
          (a, b) => a + (Number(b.count) || 0) * (Number(b.marksEach) || 0),
          0
        ),
        questionTypes: sec.questionTypes,
        selectedOutcomeIds: sec.selectedOutcomeIds
      }))
    };

    const parsedHoursMatch = duration.match(/(\d+(?:\.\d+)?)\s*hr/i);
    const parsedMinsMatch = duration.match(/(\d+)\s*min/i);
    const durationMins =
      (parsedHoursMatch ? Math.round(parseFloat(parsedHoursMatch[1]) * 60) : 0) +
      (parsedMinsMatch ? parseInt(parsedMinsMatch[1], 10) : 0) || 60;

    let persistedExamId = `ACH-EXAM-${Date.now().toString().slice(-6)}`;
    let persistedToServer = false;

    try {
      const res = await apiPost<any>('/api/score/exams', {
        title: `${examTitle.trim()} (${selectedGrade})`,
        grade: selectedGrade,
        subject: catalog.subjectName,
        totalMarks: grandTotalMarks,
        durationMins,
        blueprint: payload
      });
      if (res?.success && res.exam?.id) {
        persistedExamId = res.exam.id;
        persistedToServer = true;
      }
    } catch {
      // Fallback gracefully when unauthenticated or offline
    } finally {
      setIsGeneratingExam(false);
      setGeneratedExamModal({
        examId: persistedExamId,
        persistedToServer,
        blueprintCode: `exam:16:${catalog.subjectId}:${Date.now()}`,
        ...payload
      });
      if (onExamGenerated) {
        onExamGenerated({ ...payload, examId: persistedExamId });
      }
      showToast(
        persistedToServer
          ? 'Exam compiled & saved to Exam Hub (SCORE repository)!'
          : 'Exam compiled locally with Set A/B/C & 2D QR ready!'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP GLOBAL CONTROL BAR (Exact match to Screenshots 1 & 2)              */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToHub}
              title="Return to Staff Dashboard"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>

            {/* Grade Selector */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GRADE</span>
              <div className="relative">
                <select
                  value={selectedGrade}
                  onChange={e => setSelectedGrade(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
                >
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Subject Selector */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SUBJECT</span>
              <div className="relative">
                <select
                  value={selectedCatalogKey}
                  onChange={e => handleCatalogChange(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
                >
                  <option value="g5-math">{selectedGrade} · Mathematics (ID: 1595)</option>
                  <option value="g5-sci">{selectedGrade} · Experiential Sciences (ID: 1596)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* All Exams Pill Button */}
            <button
              onClick={() => {
                window.history.pushState({}, '', '/staff/exams');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="mt-3.5 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <span>📋</span>
              <span>All Exams</span>
            </button>
          </div>

          {/* Stepper Status Indicators */}
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setActiveStep(1)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
                activeStep === 1
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">1</span>
              <span>1. Learning Outcomes</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300" />

            <button
              onClick={() => setActiveStep(2)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
                activeStep === 2
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">2</span>
              <span>2. Blueprint & Sections</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Body Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* ======================================================================= */}
        {/* STEP 1: LEARNING OUTCOMES SELECTION (Screenshots 1 & 2)                  */}
        {/* ======================================================================= */}
        {activeStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Indigo Subject Outcomes Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-6 shadow-md flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-tight">{catalog.subjectName}</h1>
                <p className="text-xs text-indigo-100 mt-1 font-medium">
                  {selectedGrade} · Subject ID: {catalog.subjectId} · Standard CBSE Syllabus
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black">{catalog.totalOutcomesCount}</div>
                <div className="text-[11px] text-indigo-200 uppercase font-bold tracking-wider">Total Outcomes</div>
              </div>
            </div>

            {/* Search & Bulk Actions Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search outcomes or lessons..."
                  value={outcomeSearchQuery}
                  onChange={e => setOutcomeSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleSelectAllOutcomes}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Select All
                </button>
                <button
                  onClick={handleClearAllOutcomes}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Lesson Accordions List */}
            <div className="space-y-3">
              {catalog.lessons
                .filter(
                  l =>
                    l.title.toLowerCase().includes(outcomeSearchQuery.toLowerCase()) ||
                    l.description.toLowerCase().includes(outcomeSearchQuery.toLowerCase()) ||
                    l.outcomes.some(o => o.text.toLowerCase().includes(outcomeSearchQuery.toLowerCase()))
                )
                .map(lesson => {
                  const selectedInLesson = lesson.outcomes.filter(o => selectedOutcomeIds[o.id]).length;
                  const totalInLesson = lesson.outcomes.length;
                  const isExpanded = !!expandedLessonIds[lesson.id];
                  const allChecked = selectedInLesson === totalInLesson && totalInLesson > 0;

                  return (
                    <div
                      key={lesson.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
                    >
                      {/* Lesson Accordion Header */}
                      <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center space-x-3.5">
                          <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={() => toggleLessonAll(lesson)}
                            className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                          />
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-sm">{lesson.title}</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {lesson.outcomes.length} outcomes · {lesson.lessonKey}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                              selectedInLesson > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {selectedInLesson}/{totalInLesson}
                          </span>

                          <button
                            onClick={() => toggleLessonExpanded(lesson.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Lesson Details */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 animate-in fade-in duration-100">
                          {/* Pedagogical Description */}
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                            {lesson.description}
                          </p>

                          {/* Concept Tag Pills */}
                          <div className="flex flex-wrap gap-1.5">
                            {lesson.conceptTags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Granular Learning Outcomes List */}
                          <div className="divide-y divide-slate-100 pt-1">
                            {lesson.outcomes.map(oc => {
                              const isChecked = !!selectedOutcomeIds[oc.id];
                              return (
                                <div
                                  key={oc.id}
                                  onClick={() => toggleOutcome(oc.id)}
                                  className="py-3 flex items-start justify-between gap-3 hover:bg-purple-50/30 px-2 rounded-lg cursor-pointer transition-colors"
                                >
                                  <div className="flex items-start space-x-3">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleOutcome(oc.id)}
                                      className="w-4 h-4 rounded accent-purple-600 mt-0.5 cursor-pointer"
                                    />
                                    <div>
                                      <p className="text-xs font-semibold text-slate-800 leading-snug">
                                        {oc.text}
                                      </p>
                                      <span className="text-[10px] text-purple-700 font-bold">
                                        Bloom's: {oc.bloomTaxonomy}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2 shrink-0">
                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      {oc.bankCount} in bank
                                    </span>
                                    <span className="text-[11px] font-mono text-slate-400">
                                      {oc.code}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 2: BLUEPRINT & QUESTION MATRIX STUDIO (Screenshots 3, 4 & 5)       */}
        {/* ======================================================================= */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Feature Banner: How picture questions work */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="bg-sky-100 text-sky-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-sky-200">
                NEW
              </span>
              <button
                onClick={() => setShowPictureHelp(true)}
                className="text-sky-700 hover:text-sky-900 font-bold underline flex items-center space-x-1"
              >
                <span>How picture questions work</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* General Exam Settings Form Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    SCHOOL NAME
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={e => setSchoolName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    EXAM TITLE
                  </label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={e => setExamTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    DURATION
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Start from an existing exam blueprint code */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-700">Start from an existing exam</span>
                  <span className="text-[11px] text-slate-400">
                    paste an Exam Code to reuse its sections and question types
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={existingExamCode}
                    onChange={e => setExistingExamCode(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-700 focus:outline-none focus:border-purple-500"
                  />

                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bringOutcomesToo}
                      onChange={e => setBringOutcomesToo(e.target.checked)}
                      className="w-4 h-4 rounded accent-purple-600"
                    />
                    <span>Bring outcomes too</span>
                  </label>

                  <button
                    onClick={handleUseBlueprint}
                    className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    Use blueprint
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets:</span>
                  {(['TERM_50', 'DIAGNOSTIC_25', 'CBSE_80'] as const).map(presetKey => (
                    <button
                      key={presetKey}
                      type="button"
                      onClick={() => applyBlueprintPreset(presetKey)}
                      className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-[11px] font-bold transition-colors"
                    >
                      {BLUEPRINT_PRESETS[presetKey].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parallel Paper Sets & CBSE Competency Mastery Bands */}
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-purple-950">Instant Parallel Paper Sets</span>
                    <span className="text-[10px] bg-purple-700 text-white font-bold px-2 py-0.5 rounded-full">
                      Isomorphic LO &amp; Bloom&apos;s Lock
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-800">
                    Generates parallel seats testing the exact same Learning Outcomes &amp; Bloom&apos;s Taxonomy difficulty weights; tags learners as Beginner / Progressing / Proficient.
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  {([1, 2, 3] as const).map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => {
                        setParallelSetsCount(cnt);
                        showToast(`Parallel Set generator set to ${cnt} ${cnt === 1 ? 'paper' : 'isomorphic sets'}.`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        parallelSetsCount === cnt
                          ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                          : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      {cnt === 1 ? '1 Set' : cnt === 2 ? '2 Sets (A, B)' : '3 Sets (A, B, C)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sections Header with Add Section Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">Sections</h2>
              <button
                onClick={handleAddSection}
                className="px-4 py-2 bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add section</span>
              </button>
            </div>

            {/* Sections Cards Loop (Screenshots 3, 4 & 5) */}
            <div className="space-y-6">
              {sections.map((section, sIdx) => {
                const sectionQuestionsCount = section.questionTypes.reduce(
                  (a, b) => a + (Number(b.count) || 0),
                  0
                );
                const sectionMarksTotal = section.questionTypes.reduce(
                  (a, b) => a + (Number(b.count) || 0) * (Number(b.marksEach) || 0),
                  0
                );

                return (
                  <div
                    key={section.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5"
                  >
                    {/* Section Top Header & Name */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-extrabold text-xs flex items-center justify-center shrink-0">
                          {section.romanNumeral}
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                          SECTION NAME
                        </span>
                        <input
                          type="text"
                          value={section.name}
                          onChange={e => {
                            const newName = e.target.value;
                            setSections(prev =>
                              prev.map(s => (s.id === section.id ? { ...s, name: newName } : s))
                            );
                          }}
                          className="flex-1 max-w-md px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-purple-500"
                        />
                      </div>

                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <button
                          disabled={sIdx === 0}
                          onClick={() => handleMoveSection(sIdx, 'UP')}
                          title="Move section up"
                          className="p-1.5 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={sIdx === sections.length - 1}
                          onClick={() => handleMoveSection(sIdx, 'DOWN')}
                          title="Move section down"
                          className="p-1.5 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          title="Delete section"
                          className="p-1.5 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question Types Matrix Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                            <th className="py-2 w-16">MOVE</th>
                            <th className="py-2">QUESTION TYPE</th>
                            <th className="py-2 w-28 text-center">COUNT</th>
                            <th className="py-2 w-28 text-center">MARKS EACH</th>
                            <th className="py-2 w-28 text-center">TOTAL MARKS</th>
                            <th className="py-2 w-12 text-center"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {section.questionTypes.map((qt, qIdx) => {
                            const rowTotal = (Number(qt.count) || 0) * (Number(qt.marksEach) || 0);

                            return (
                              <tr key={qt.id} className="hover:bg-slate-50/60 transition-colors">
                                {/* Move Arrows */}
                                <td className="py-3 text-slate-400">
                                  <div className="flex items-center space-x-1">
                                    <button
                                      disabled={qIdx === 0}
                                      onClick={() => handleMoveQuestionType(section.id, qIdx, 'UP')}
                                      className="p-0.5 hover:text-slate-700 disabled:opacity-20"
                                    >
                                      <MoveUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      disabled={qIdx === section.questionTypes.length - 1}
                                      onClick={() => handleMoveQuestionType(section.id, qIdx, 'DOWN')}
                                      className="p-0.5 hover:text-slate-700 disabled:opacity-20"
                                    >
                                      <MoveDown className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>

                                {/* Question Type Pill with dropdown */}
                                <td className="py-3">
                                  <div className="relative inline-block">
                                    <select
                                      value={qt.type}
                                      onChange={e =>
                                        handleChangeQuestionTypeEnum(
                                          section.id,
                                          qt.id,
                                          e.target.value as QuestionTypeId
                                        )
                                      }
                                      className={`appearance-none font-bold text-xs px-3 py-1.5 pr-8 rounded-xl border shadow-xs cursor-pointer focus:outline-none ${qt.badgeBg}`}
                                    >
                                      <option value="MCQ">◉ MCQ</option>
                                      <option value="FILL_BLANK">_ Fill Blank</option>
                                      <option value="TRUE_FALSE">✓X True / False</option>
                                      <option value="SHORT_ANSWER">✏️ Short Answer</option>
                                      <option value="CASE_STUDY">📖 Case Study</option>
                                      <option value="MATCH_FOLLOWING">🔗 Match Following</option>
                                      <option value="LONG_ANSWER">📝 Long Answer</option>
                                      <option value="ASSERTION_REASON">⚡ Assertion & Reason</option>
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                                  </div>
                                </td>

                                {/* Question Count Input */}
                                <td className="py-3 text-center">
                                  <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={qt.count}
                                    onChange={e =>
                                      handleUpdateQuestionType(section.id, qt.id, {
                                        count: parseInt(e.target.value) || 0
                                      })
                                    }
                                    className="w-16 mx-auto px-2 py-1.5 text-center font-bold text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                                  />
                                </td>

                                {/* Marks Each Input */}
                                <td className="py-3 text-center">
                                  <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={qt.marksEach}
                                    onChange={e =>
                                      handleUpdateQuestionType(section.id, qt.id, {
                                        marksEach: parseInt(e.target.value) || 0
                                      })
                                    }
                                    className="w-16 mx-auto px-2 py-1.5 text-center font-bold text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                                  />
                                </td>

                                {/* Total Marks Calculated */}
                                <td className="py-3 text-center font-extrabold text-slate-800">
                                  {rowTotal}
                                </td>

                                {/* Row Delete Action */}
                                <td className="py-3 text-center">
                                  <button
                                    onClick={() => handleDeleteQuestionType(section.id, qt.id)}
                                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Add Question Type Row Link + Section Total Summary */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => handleAddQuestionType(section.id)}
                        className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add question type</span>
                      </button>

                      <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                        Section total: {sectionQuestionsCount} questions · {sectionMarksTotal} marks
                      </div>
                    </div>

                    {/* Section Learning Outcomes Scope Box */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-slate-700">Choose learning outcomes</span>
                        <button
                          onClick={() => setShowOutcomeScopeModal(section.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs"
                        >
                          <span>{section.selectedOutcomeIds.length}</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-bold text-slate-400 tracking-wider">
                          {section.selectedOutcomeIds.length === 0
                            ? 'NONE SELECTED FOR THIS SECTION'
                            : `${section.selectedOutcomeIds.length} SPECIFIC OUTCOMES LOCKED`}
                        </span>
                      </div>

                      {section.selectedOutcomeIds.length === 0 && (
                        <p className="text-[11px] text-amber-700 flex items-center space-x-1">
                          <span>⚠</span>
                          <span>
                            {section.name} has no learning outcomes selected — its questions will draw
                            from ALL outcomes chosen at lesson selection.
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Generation Panel (Screenshot 5) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowQuestionBankBrowser(true)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-purple-700" />
                  <span>Browse Question Bank</span>
                </button>

                {/* Book Back Percentage Input */}
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                  <span className="font-bold text-slate-700 flex items-center space-x-1">
                    <span>📖</span>
                    <span>Book back</span>
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={bookBackRatio}
                    onChange={e => setBookBackRatio(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                    className="w-12 text-center font-bold text-xs bg-white border border-slate-300 rounded-lg py-1 focus:outline-none focus:border-purple-500"
                  />
                  <span className="font-bold text-slate-500">%</span>
                </div>
              </div>

              {/* Validation Gate & Generate Button */}
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center space-x-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={academicValidated}
                    onChange={e => setAcademicValidated(e.target.checked)}
                    className="w-3.5 h-3.5 accent-emerald-600"
                  />
                  <span>Academically Validated</span>
                </label>

                <div className="text-right">
                  <div className="text-base font-black text-slate-900">
                    {grandTotalQuestions} questions · {grandTotalMarks} marks
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">
                    {selectedOutcomesCount} Outcomes Covered
                  </div>
                </div>

                <button
                  disabled={isGeneratingExam}
                  onClick={handleTriggerExamGeneration}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isGeneratingExam ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingExam ? 'Compiling Blueprint...' : 'Generate Exam'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* STICKY BOTTOM NAVIGATION BAR (Exact match to Screenshots 1, 2, 3, 4, 5)   */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3.5 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            {activeStep === 1 ? (
              <span>
                <strong className="text-purple-700 font-extrabold">{selectedOutcomesCount}</strong>{' '}
                outcomes selected — deselect any you don't want to test
              </span>
            ) : (
              <span>Configure exam settings then generate</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {activeStep === 2 && (
              <button
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                ← Back
              </button>
            )}

            {activeStep === 1 ? (
              <button
                onClick={() => {
                  if (selectedOutcomesCount === 0) {
                    showToast('Please select at least 1 outcome to proceed.');
                    return;
                  }
                  setActiveStep(2);
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center space-x-1"
              >
                <span>Continue →</span>
              </button>
            ) : (
              <button
                disabled={isGeneratingExam}
                onClick={handleTriggerExamGeneration}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center space-x-1 disabled:opacity-50"
              >
                <span>{isGeneratingExam ? 'Compiling...' : 'Generate Exam →'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: PICTURE QUESTIONS EXPLAINER                                      */}
      {/* ========================================================================= */}
      {showPictureHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2 text-sky-700">
                <Info className="w-5 h-5" />
                <h3 className="font-extrabold text-sm text-slate-900">How Picture Questions Work</h3>
              </div>
              <button onClick={() => setShowPictureHelp(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                <strong>1. Automated High-Resolution Vector Rendering:</strong> When generating questions that require diagrams (geometric angles, clock turns, fraction bars, maps), the SCORE engine automatically embeds high-contrast SVG vector figures into the printed exam booklet.
              </p>
              <p>
                <strong>2. Dual-Page Booklet Spacing:</strong> Questions labeled with diagrammatic assets are budgeted with dedicated visual spacing on Sheet 1 or Sheet 2 to avoid crowded answer lines.
              </p>
              <p>
                <strong>3. Scannable Handwriting Zones:</strong> Student answers under picture questions preserve optical alignment fiducials so that Google Cloud Vision OCR accurately transcribes responses without distortion.
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPictureHelp(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: QUESTION BANK BROWSER DRAWER (10-FACET CURRICULUM FILTERS)      */}
      {/* ========================================================================= */}
      {showQuestionBankBrowser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Achariya AI Question Bank &amp; Marking Schemes</h3>
                <p className="text-xs text-slate-500">Filter by Board, Grade, Subject, Chapter, Concept, LO, Bloom&apos;s, Difficulty, Marks &amp; Type</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomQ(prev => !prev)}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-[11px] font-bold transition-colors"
                >
                  {showAddCustomQ ? 'Cancel Custom Q' : '+ Add Custom Question'}
                </button>
                <button onClick={() => setShowQuestionBankBrowser(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                  ✕
                </button>
              </div>
            </div>

            {showAddCustomQ && (
              <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2.5 text-xs">
                <div className="font-bold text-purple-900">Author New Curriculum-Aligned Bank Item ({catalog.subjectName})</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={customQDraft.chapter}
                    onChange={e => setCustomQDraft(p => ({ ...p, chapter: e.target.value }))}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    {catalog.lessons.map(l => (
                      <option key={l.id} value={l.title}>{l.title}</option>
                    ))}
                  </select>
                  <select
                    value={customQDraft.bloom}
                    onChange={e => setCustomQDraft(p => ({ ...p, bloom: e.target.value as QuestionBankEntry['bloom'] }))}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="Knowledge">Knowledge</option>
                    <option value="Comprehension">Comprehension</option>
                    <option value="Application">Application</option>
                    <option value="Analysis">Analysis</option>
                    <option value="Synthesis">Synthesis</option>
                  </select>
                  <div className="flex items-center space-x-1.5">
                    <select
                      value={customQDraft.difficulty}
                      onChange={e => setCustomQDraft(p => ({ ...p, difficulty: e.target.value as QuestionBankEntry['difficulty'] }))}
                      className="flex-1 px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold"
                    >
                      <option value="Foundation">Foundation</option>
                      <option value="Standard">Standard</option>
                      <option value="HOTS">HOTS</option>
                    </select>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={customQDraft.marks}
                      onChange={e => setCustomQDraft(p => ({ ...p, marks: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-16 px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-center"
                      title="Marks"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Question prompt..."
                  value={customQDraft.q}
                  onChange={e => setCustomQDraft(p => ({ ...p, q: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Official Answer Key..."
                    value={customQDraft.ans}
                    onChange={e => setCustomQDraft(p => ({ ...p, ans: e.target.value }))}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Step-wise Marking Scheme..."
                    value={customQDraft.scheme}
                    onChange={e => setCustomQDraft(p => ({ ...p, scheme: e.target.value }))}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!customQDraft.q.trim() || !customQDraft.ans.trim()) {
                        showToast('Please enter both a question prompt and an answer key.');
                        return;
                      }
                      const newEntry: QuestionBankEntry = {
                        id: `qb-custom-${Date.now()}`,
                        catalogKey: selectedCatalogKey === 'g5-sci' ? 'g5-sci' : 'g5-math',
                        boards: [qbFilterBoard, 'CBSE'],
                        type: customQDraft.type,
                        category: customQDraft.difficulty === 'HOTS' ? 'Higher-Order Thinking (HOTS)' : customQDraft.difficulty === 'Standard' ? 'Application-Based' : 'Competency-Based',
                        difficulty: customQDraft.difficulty,
                        marks: customQDraft.marks,
                        chapter: customQDraft.chapter,
                        lo: catalog.lessons.find(l => l.title === customQDraft.chapter)?.outcomes[0]?.code || '#CUSTOM',
                        q: customQDraft.q.trim(),
                        ans: customQDraft.ans.trim(),
                        scheme: customQDraft.scheme.trim() || `${customQDraft.marks}M for accurate step-wise solution`,
                        bloom: customQDraft.bloom
                      };
                      setCustomBankQuestions(prev => [newEntry, ...prev]);
                      setCustomQDraft(prev => ({ ...prev, q: '', ans: '', scheme: '' }));
                      setShowAddCustomQ(false);
                      showToast('Custom question added to Question Bank.');
                    }}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
                  >
                    Save to Question Bank
                  </button>
                </div>
              </div>
            )}

            {/* 10-Facet Filter Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-500 block mb-0.5">Board / Grade / Subject</span>
                <select
                  value={qbFilterBoard}
                  onChange={e => setQbFilterBoard(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  <option value="CBSE">CBSE · {selectedGrade} · {catalog.subjectName}</option>
                  <option value="ICSE">ICSE · {selectedGrade}</option>
                  <option value="STATE">State Board · {selectedGrade}</option>
                </select>
              </div>
              <div>
                <span className="font-bold text-slate-500 block mb-0.5">Chapter</span>
                <select
                  value={qbFilterChapter}
                  onChange={e => setQbFilterChapter(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  <option value="ALL">All Chapters</option>
                  {Array.from(new Set(catalog.lessons.map(l => l.title))).map(ch => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              </div>
              <div>
                <span className="font-bold text-slate-500 block mb-0.5">Bloom&apos;s Level</span>
                <select
                  value={qbFilterBloom}
                  onChange={e => setQbFilterBloom(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  <option value="ALL">All Bloom&apos;s Levels</option>
                  <option value="Knowledge">Remember / Knowledge</option>
                  <option value="Comprehension">Comprehension</option>
                  <option value="Application">Application</option>
                  <option value="Analysis">Analysis / HOTS</option>
                </select>
              </div>
              <div>
                <span className="font-bold text-slate-500 block mb-0.5">Difficulty Tier</span>
                <select
                  value={qbFilterDifficulty}
                  onChange={e => setQbFilterDifficulty(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Standard">Competency Standard</option>
                  <option value="HOTS">Higher-Order (HOTS)</option>
                </select>
              </div>
              <div>
                <span className="font-bold text-slate-500 block mb-0.5">Question Type &amp; Marks</span>
                <select
                  value={qbFilterType}
                  onChange={e => setQbFilterType(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  <option value="ALL">All Types &amp; Marks</option>
                  <option value="MCQ">Competency MCQ (1M)</option>
                  <option value="Application">Application Short (2M)</option>
                  <option value="HOTS">HOTS Step-Solved (5M)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {(() => {
                const bankItems = [...customBankQuestions, ...DEFAULT_QUESTION_BANK]
                  .filter(i => i.catalogKey === (selectedCatalogKey === 'g5-sci' ? 'g5-sci' : 'g5-math'))
                  .filter(i => i.boards.includes(qbFilterBoard))
                  .filter(i => qbFilterChapter === 'ALL' || i.chapter === qbFilterChapter)
                  .filter(i => qbFilterBloom === 'ALL' || i.bloom === qbFilterBloom)
                  .filter(i => qbFilterDifficulty === 'ALL' || i.difficulty === qbFilterDifficulty)
                  .filter(
                    i =>
                      qbFilterType === 'ALL' ||
                      (qbFilterType === 'MCQ' && i.type === 'MCQ') ||
                      (qbFilterType === 'Application' && (i.type === 'Short Answer' || i.type === 'Case Study' || i.category.includes('Application'))) ||
                      (qbFilterType === 'HOTS' && i.difficulty === 'HOTS')
                  );

                if (bankItems.length === 0) {
                  return (
                    <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 font-medium">
                      No matching bank questions found for {catalog.subjectName} with current filters. Reset filters or add a custom item above.
                    </div>
                  );
                }

                return bankItems.map(item => (
                  <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                          {item.type} · {item.marks}M
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-200">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-600">{item.lo} · {item.chapter}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">Bloom: {item.bloom} · {item.difficulty}</span>
                    </div>
                    <p className="font-semibold text-slate-800">{item.q}</p>
                    <p className="text-[11px] text-emerald-700 font-mono">Answer Key: {item.ans}</p>
                    <p className="text-[11px] text-slate-500"><strong>Marking Scheme:</strong> {item.scheme}</p>
                  </div>
                ));
              })()}
            </div>

            {/* Curriculum Validation Gate Before Publication */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <label className="flex items-center space-x-2 font-bold text-emerald-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={academicValidated}
                  onChange={e => setAcademicValidated(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600"
                />
                <span>Curriculum-Aligned &amp; Academically Validated Before Publication</span>
              </label>
              <button
                onClick={() => {
                  showToast(`Questions & marking schemes synced (${qbFilterBoard}).`);
                  setShowQuestionBankBrowser(false);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
              >
                Apply Filter &amp; Sync Bank
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2B: SECTION LEARNING OUTCOMES SCOPE PICKER                          */}
      {/* ========================================================================= */}
      {showOutcomeScopeModal && (() => {
        const activeSection = sections.find(s => s.id === showOutcomeScopeModal);
        if (!activeSection) return null;
        const enabledStep1Ids = allOutcomeIds.filter(id => selectedOutcomeIds[id]);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Section Learning Outcome Scope — {activeSection.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lock specific Learning Outcomes for this section, or leave empty to draw from all {enabledStep1Ids.length} exam outcomes.
                  </p>
                </div>
                <button
                  onClick={() => setShowOutcomeScopeModal(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSections(prev =>
                      prev.map(s =>
                        s.id === activeSection.id ? { ...s, selectedOutcomeIds: [...enabledStep1Ids] } : s
                      )
                    );
                    showToast(`Locked ${enabledStep1Ids.length} selected outcomes to ${activeSection.name}.`);
                  }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                >
                  Select All Outcomes for Section
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSections(prev =>
                      prev.map(s => (s.id === activeSection.id ? { ...s, selectedOutcomeIds: [] } : s))
                    );
                    showToast(`${activeSection.name} reset to draw from all selected exam outcomes.`);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Use All Exam Outcomes (Default)
                </button>
              </div>

              <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                {catalog.lessons.map(lesson => (
                  <div key={lesson.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="text-xs font-extrabold text-slate-800">{lesson.title}</div>
                    <div className="space-y-1.5">
                      {lesson.outcomes.map(oc => {
                        const checked = activeSection.selectedOutcomeIds.includes(oc.id);
                        return (
                          <label
                            key={oc.id}
                            className="flex items-start space-x-2 text-xs text-slate-700 cursor-pointer hover:bg-white p-1.5 rounded-lg"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setSections(prev =>
                                  prev.map(s => {
                                    if (s.id !== activeSection.id) return s;
                                    const exists = s.selectedOutcomeIds.includes(oc.id);
                                    return {
                                      ...s,
                                      selectedOutcomeIds: exists
                                        ? s.selectedOutcomeIds.filter(id => id !== oc.id)
                                        : [...s.selectedOutcomeIds, oc.id]
                                    };
                                  })
                                );
                              }}
                              className="mt-0.5 w-3.5 h-3.5 accent-purple-600"
                            />
                            <span className="flex-1">
                              <strong className="font-mono text-purple-700">{oc.code}</strong> — {oc.text}
                              {!selectedOutcomeIds[oc.id] && (
                                <span className="ml-1.5 text-[10px] text-amber-700 font-bold">(Unselected in Step 1)</span>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowOutcomeScopeModal(null)}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                >
                  Save Scope ({activeSection.selectedOutcomeIds.length || 'All'} Outcomes)
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 3: EXAM GENERATION SUCCESS & BATCH DOWNLOAD MODAL                   */}
      {/* ========================================================================= */}
      {generatedExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Exam Blueprint Compiled</h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-slate-500 font-mono">ID: {generatedExamModal.examId}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${generatedExamModal.persistedToServer ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {generatedExamModal.persistedToServer ? 'Saved to Exam Hub' : 'Local Preview'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setGeneratedExamModal(null)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Exam Title:</span>
                <span className="font-bold text-slate-900">{generatedExamModal.examTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Questions & Marks:</span>
                <span className="font-bold text-purple-700">
                  {generatedExamModal.totalQuestions} questions · {generatedExamModal.totalMarks} marks
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Curriculum Scope:</span>
                <span className="font-bold text-slate-800">
                  {generatedExamModal.selectedOutcomesCount} Outcomes Covered
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reusable Blueprint Code:</span>
                <span className="font-mono text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                  {generatedExamModal.blueprintCode}
                </span>
              </div>
            </div>

            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl text-xs space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-purple-900">
                  {generatedExamModal.parallelSetsCount || 3} Parallel Isomorphic Paper Sets Compiled:
                </span>
                <div className="flex items-center space-x-1">
                  {(['SET_A', 'SET_B', 'SET_C'] as const)
                    .slice(0, generatedExamModal.parallelSetsCount || 3)
                    .map(setKey => (
                      <button
                        key={setKey}
                        type="button"
                        onClick={() => setActivePreviewSet(setKey)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border transition-colors ${
                          activePreviewSet === setKey
                            ? 'bg-purple-700 text-white border-purple-700'
                            : 'bg-white text-purple-800 border-purple-200'
                        }`}
                      >
                        {setKey.replace('_', ' ')}
                      </button>
                    ))}
                </div>
              </div>
              {(() => {
                const isScience = generatedExamModal.subjectId === '1596';
                const sampleBySet = isScience
                  ? {
                      SET_A: {
                        q: 'Q1 (1M · Knowledge): Which leaf pigment captures solar energy for photosynthesis? Q2 (2M · Application): State two raw materials plants absorb to synthesize glucose.',
                        ans: 'A1: Chlorophyll | A2: Carbon dioxide (stomata) & water (roots).',
                        scheme: '1M pigment identification + 1M CO2 + 1M H2O (full credit for balanced word equation).'
                      },
                      SET_B: {
                        q: 'Q1 (1M · Knowledge): Name the green organelle where solar photons convert water and CO2 into food. Q2 (2M · Application): Why does a variegated leaf form starch only in its green zones?',
                        ans: 'A1: Chloroplast | A2: Non-green zones lack chlorophyll needed for light absorption.',
                        scheme: '1M organelle name + 2M causal link between chlorophyll presence & starch synthesis.'
                      },
                      SET_C: {
                        q: 'Q1 (1M · Knowledge): Identify the gaseous byproduct released into the atmosphere during photosynthesis. Q2 (2M · Application): Compare leaf starch test results after 48h in darkness vs sunlight.',
                        ans: 'A1: Oxygen (O2) | A2: Sunlight leaf turns blue-black with iodine; dark leaf stays brown.',
                        scheme: '1M oxygen + 1M iodine color change + 1M light dependency explanation.'
                      }
                    }
                  : {
                      SET_A: {
                        q: 'Q1 (1M · Knowledge): Write the place value of 7 in 47,825. Q2 (5M · Analysis): A train travels from Puducherry to Villupuram (40 km) in 45 minutes. Find average speed.',
                        ans: 'A1: 7,000 | A2: 53.33 km/h (accept 53 1/3 km/h)',
                        scheme: '1M place value + 1M 45m->0.75h + 2M v=d/t + 2M arithmetic (alternate valid methods accepted).'
                      },
                      SET_B: {
                        q: 'Q1 (1M · Knowledge): Write the place value of 6 in 64,915. Q2 (5M · Analysis): A bus covers 48 km between two campuses in 40 minutes. Calculate its average speed in km/h.',
                        ans: 'A1: 60,000 | A2: 72 km/h',
                        scheme: '1M place value + 1M 40m->2/3 h + 2M v=d/t + 2M final speed.'
                      },
                      SET_C: {
                        q: 'Q1 (1M · Knowledge): Write the place value of 2 in 82,340. Q2 (5M · Analysis): A cyclist travels 54 km in 45 minutes along a coastal track. Determine average speed.',
                        ans: 'A1: 2,000 | A2: 72 km/h',
                        scheme: '1M place value + 1M time conversion + 2M speed formula + 2M final value.'
                      }
                    };
                const activeSample = sampleBySet[activePreviewSet];
                return (
                  <div className="p-2.5 bg-white rounded-xl border border-purple-100 text-[11px] text-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-purple-900">
                      <span>Active Preview: {activePreviewSet.replace('_', ' ')} ({generatedExamModal.subject})</span>
                      <span className="text-emerald-700">Beginner / Progressing / Proficient Calibrated</span>
                    </div>
                    <p className="font-semibold text-slate-800">{activeSample.q}</p>
                    <p className="text-emerald-700 font-mono"><strong>Key:</strong> {activeSample.ans}</p>
                    <p className="text-slate-500"><strong>Marking Scheme:</strong> {activeSample.scheme}</p>
                  </div>
                );
              })()}
              <p className="text-purple-800">
                Phase B Batch PDF embeds 4-corner 2D QR optical anchors + same-day remedial &amp; parent outcome insights upon scanning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  window.open(`/api/score/exams/${generatedExamModal.examId}/batch-pdf`, '_blank');
                  showToast('Initiating binary PDF download...');
                }}
                className="py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Batch PDF</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                  showToast('Opened print preview for question paper & marking scheme.');
                }}
                className="py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Paper &amp; Key</span>
              </button>

              <button
                onClick={() => {
                  setGeneratedExamModal(null);
                  window.history.pushState({}, '', '/staff/exams');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Open in Exam Hub →</span>
              </button>

              <button
                onClick={() => {
                  setGeneratedExamModal(null);
                  window.history.pushState({}, '', '/staff/learning-gaps');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>AI Learning Gap Studio →</span>
              </button>
            </div>

            <div className="pt-1 flex justify-center">
              <button
                onClick={() => {
                  setGeneratedExamModal(null);
                  if (onBackToHub) onBackToHub();
                }}
                className="py-2 px-6 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors"
              >
                Return to AI Tools Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

