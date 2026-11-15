import React, { useState, useEffect, useMemo } from 'react';
import {
  PlayCircle,
  PauseCircle,
  Volume2,
  Square,
  Sliders,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Target,
  BrainCircuit,
  Eye,
  Headphones,
  Hand,
  Plus,
  X,
  RotateCcw,
  Award,
  Layers,
  Clock,
  Send
} from 'lucide-react';
import { apiPost } from '../lib/api';

type VakModality = 'VISUAL' | 'AUDITORY' | 'KINAESTHETIC';
type SimulationKind =
  | 'FRACTION_100_GRID'
  | 'PERCENTAGE_SLIDER'
  | 'DIVISION_GROUPS'
  | 'MATTER_STATES'
  | 'INFERENCE_BUILDER'
  | 'FLOWCHART_TRACE';

export interface LmsLesson {
  id: string;
  conceptCode: string;
  grade: string;
  subject: string;
  title: string;
  track: 'CURRENT_GRADE' | 'FOUNDATION_BRIDGE';
  durationMinutes: number;
  summary: string;
  learningOutcome: string;
  visualScenes: Array<{
    step: number;
    heading: string;
    visualFormula: string;
    caption: string;
    highlightColor: string;
  }>;
  audioChapters: Array<{
    title: string;
    script: string;
    socraticPrompt: string;
  }>;
  simulationKind: SimulationKind;
  quiz: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

export interface VakTelemetryRecord {
  visualActions: number;
  auditoryActions: number;
  kinaestheticActions: number;
  lastModalityUsed: VakModality;
  lastMasteryScore: number | null;
  completedLessons: string[];
  computedVak: {
    visual: number;
    auditory: number;
    kinaesthetic: number;
  };
  updatedAt: string;
}

export const VAK_TELEMETRY_STORAGE_KEY = 'achariya_vak_telemetry_v1';
export const ACTIVE_LMS_LESSON_STORAGE_KEY = 'achariya_active_lms_lesson';

const DEFAULT_TELEMETRY: VakTelemetryRecord = {
  visualActions: 6,
  auditoryActions: 3,
  kinaestheticActions: 4,
  lastModalityUsed: 'VISUAL',
  lastMasteryScore: 88,
  completedLessons: [],
  computedVak: { visual: 46, auditory: 22, kinaesthetic: 32 },
  updatedAt: new Date().toISOString()
};

function loadVakTelemetry(): VakTelemetryRecord {
  try {
    const raw = localStorage.getItem(VAK_TELEMETRY_STORAGE_KEY);
    if (!raw) return DEFAULT_TELEMETRY;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_TELEMETRY,
      ...parsed,
      computedVak: {
        ...DEFAULT_TELEMETRY.computedVak,
        ...(parsed?.computedVak || {})
      },
      completedLessons: Array.isArray(parsed?.completedLessons) ? parsed.completedLessons : []
    };
  } catch {
    return DEFAULT_TELEMETRY;
  }
}

function saveVakTelemetry(next: VakTelemetryRecord) {
  try {
    localStorage.setItem(VAK_TELEMETRY_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('achariya:vak-updated', { detail: next }));
  } catch {
    // Ignore storage quota errors in restricted frames
  }
}

function normalizeVakTriple(v: number, a: number, k: number) {
  const safeV = Math.max(1, v);
  const safeA = Math.max(1, a);
  const safeK = Math.max(1, k);
  const sum = safeV + safeA + safeK;
  const visual = Math.round((safeV / sum) * 100);
  const auditory = Math.round((safeA / sum) * 100);
  const kinaesthetic = Math.max(0, 100 - visual - auditory);
  return { visual, auditory, kinaesthetic };
}

const INITIAL_LMS_LESSONS: LmsLesson[] = [
  {
    id: 'lms-mth-g5-equiv',
    conceptCode: 'CON-MTH-G5-EQUIV',
    grade: 'Grade 5',
    subject: 'Mathematics',
    title: 'Equivalent Fractions & Base-100 Denominator Scaling',
    track: 'FOUNDATION_BRIDGE',
    durationMinutes: 12,
    summary: 'Bridge prerequisite: scale denominators (4, 5, 10, 20, 25) evenly to 100 so percentages become effortless.',
    learningOutcome: 'Convert any benchmark fraction into an equivalent fraction out of 100 visually, orally, and interactively.',
    simulationKind: 'FRACTION_100_GRID',
    visualScenes: [
      {
        step: 1,
        heading: 'Meet the Base-100 Fraction Bar',
        visualFormula: '3 / 5   ➔   ? / 100',
        caption: 'To read a fraction as a percentage ("per hundred"), we first resize the bottom denominator to 100.',
        highlightColor: 'from-purple-600 to-indigo-600'
      },
      {
        step: 2,
        heading: 'Find the Scaling Multiplier',
        visualFormula: '5 × 20 = 100',
        caption: 'Ask: "What times 5 equals 100?" Because 100 ÷ 5 = 20, our magic scaling multiplier is × 20.',
        highlightColor: 'from-amber-500 to-orange-600'
      },
      {
        step: 3,
        heading: 'Golden Rule: Top & Bottom Together',
        visualFormula: '(3 × 20) / (5 × 20) = 60 / 100',
        caption: 'Multiply the numerator by the exact same × 20 so the actual value stays 100% unchanged!',
        highlightColor: 'from-teal-600 to-emerald-600'
      },
      {
        step: 4,
        heading: 'Instant Percentage Translation',
        visualFormula: '60 / 100 = 60%',
        caption: 'Once the denominator is 100, the numerator directly gives your percentage: 60 out of 100 squares = 60%.',
        highlightColor: 'from-indigo-600 to-sky-600'
      }
    ],
    audioChapters: [
      {
        title: 'Part 1 · Why 100 Matters',
        script: 'Welcome! Think of the word per-cent as literally meaning out of one hundred. Whenever you see three over five, your first goal is to ask: how do I turn the bottom number five into one hundred?',
        socraticPrompt: 'Say aloud: "100 divided by 5 equals what number?"'
      },
      {
        title: 'Part 2 · The Golden Balance Rule',
        script: 'Since 5 times 20 makes 100, we must treat top and bottom fairly. Multiply 3 by 20 to get 60, and 5 by 20 to get 100. Sixty over one hundred is simply sixty percent!',
        socraticPrompt: 'Now try mentally with 7 over 20: What times 20 gives 100? Multiply 7 by that number!'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which multiplier converts the fraction 3/5 into an equivalent fraction with denominator 100?',
        options: ['× 10', '× 20', '× 25', '× 5'],
        correctAnswer: '× 20',
        explanation: 'Since 5 × 20 = 100, multiply both numerator and denominator by 20.'
      },
      {
        id: 'q2',
        question: 'What is 7/20 expressed with denominator 100 and as a percentage?',
        options: ['35/100 (35%)', '14/100 (14%)', '27/100 (27%)', '70/100 (70%)'],
        correctAnswer: '35/100 (35%)',
        explanation: '20 × 5 = 100, so 7 × 5 = 35 → 35/100 = 35%.'
      },
      {
        id: 'q3',
        question: 'On a 10×10 grid (100 squares), how many squares represent 3/4?',
        options: ['34 squares', '60 squares', '75 squares', '80 squares'],
        correctAnswer: '75 squares',
        explanation: '4 × 25 = 100, so 3 × 25 = 75 shaded squares (75%).'
      }
    ]
  },
  {
    id: 'lms-mth-g6-pct',
    conceptCode: 'CON-MTH-G6-PCT',
    grade: 'Grade 6',
    subject: 'Mathematics',
    title: 'Percentage Calculations & Real-World Problem Solving',
    track: 'CURRENT_GRADE',
    durationMinutes: 15,
    summary: 'Apply percentage-to-fraction fluency to calculate quantities, exam scores, and real-world Achariya store discounts.',
    learningOutcome: 'Compute p% of a total quantity N accurately and interpret multi-step real-life word problems.',
    simulationKind: 'PERCENTAGE_SLIDER',
    visualScenes: [
      {
        step: 1,
        heading: 'Decode "Percent Of" as Multiplication',
        visualFormula: '25% of 240 = (25 / 100) × 240',
        caption: 'Replace "%" with "/ 100" and replace the word "of" with multiplication (×).',
        highlightColor: 'from-indigo-600 to-purple-600'
      },
      {
        step: 2,
        heading: 'Simplify Using Equivalent Fractions',
        visualFormula: '25 / 100  =  1 / 4',
        caption: 'Your Grade 5 Equivalent Fractions superpower makes 25/100 simplify cleanly to 1/4!',
        highlightColor: 'from-teal-600 to-emerald-600'
      },
      {
        step: 3,
        heading: 'Divide & Compute Effortlessly',
        visualFormula: '(1 / 4) × 240  =  240 ÷ 4  =  60',
        caption: 'Dividing 240 into 4 equal groups immediately gives 60 students.',
        highlightColor: 'from-amber-500 to-orange-600'
      },
      {
        step: 4,
        heading: 'Real-Life Discount Application',
        visualFormula: '₹500 − 20% = ₹500 − ₹100 = ₹400',
        caption: 'Calculate the percentage saving first (20% of ₹500 = ₹100), then subtract from original price.',
        highlightColor: 'from-rose-500 to-pink-600'
      }
    ],
    audioChapters: [
      {
        title: 'Part 1 · Translating Words Into Maths',
        script: 'Whenever a word problem asks for 25 percent of 240 students, remember two translation rules: percent means divide by 100, and the word OF means multiply. So 25 percent of 240 is 25 over 100 times 240.',
        socraticPrompt: 'Pause and simplify 25 over 100 in your head: how many 25s fit inside 100?'
      },
      {
        title: 'Part 2 · Shopping & Discount Strategy',
        script: 'Suppose a cricket kit at the school store costs 500 rupees with a 20 percent discount. First find 10 percent, which is 50 rupees. Double it for 20 percent, getting 100 rupees off—so the final price is 400 rupees!',
        socraticPrompt: 'Can you explain in one sentence why 10 percent is an easy mental anchor?'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'In an Achariya Sports Meet with 240 students, 25% won house medals. How many students won medals?',
        options: ['40 students', '48 students', '60 students', '80 students'],
        correctAnswer: '60 students',
        explanation: '25% = 1/4, and 240 ÷ 4 = 60 students.'
      },
      {
        id: 'q2',
        question: 'A science kit marked at ₹500 has a 20% discount. What is the discount amount saved?',
        options: ['₹50', '₹100', '₹120', '₹400'],
        correctAnswer: '₹100',
        explanation: '20% of 500 = (20/100) × 500 = 1/5 × 500 = ₹100 saved.'
      },
      {
        id: 'q3',
        question: 'If 60% of 50 problems are solved already, how many problems are solved?',
        options: ['25', '30', '35', '40'],
        correctAnswer: '30',
        explanation: '60% of 50 = (60/100) × 50 = 60/2 = 30 problems.'
      }
    ]
  },
  {
    id: 'lms-mth-g4-div',
    conceptCode: 'CON-MTH-G4-DIV',
    grade: 'Grade 4',
    subject: 'Mathematics',
    title: 'Multi-Digit Division & Equal Sharing Models',
    track: 'FOUNDATION_BRIDGE',
    durationMinutes: 10,
    summary: 'Master equal-group partitioning and remainder reasoning as the foundation for ratios, fractions, and long division.',
    learningOutcome: 'Model dividend ÷ divisor into equal groups and interpret remainders in context.',
    simulationKind: 'DIVISION_GROUPS',
    visualScenes: [
      {
        step: 1,
        heading: 'Division Means Fair Equal Groups',
        visualFormula: '54 ÷ 4 = 13 equal groups, Remainder 2',
        caption: 'Start with 54 unit blocks and share them fairly across 4 equal baskets.',
        highlightColor: 'from-teal-600 to-cyan-600'
      },
      {
        step: 2,
        heading: 'Split Tens First (Place Value Shortcut)',
        visualFormula: '40 ÷ 4 = 10 per basket (14 left)',
        caption: 'Sharing big tens chunks first makes mental division rapid and intuitive.',
        highlightColor: 'from-indigo-600 to-blue-600'
      },
      {
        step: 3,
        heading: 'Share Remaining Ones & Check Leftover',
        visualFormula: '14 ÷ 4 = 3 each (12 used) + 2 left',
        caption: 'Each basket gets 10 + 3 = 13 items, with 2 remaining because 2 < 4.',
        highlightColor: 'from-purple-600 to-pink-600'
      },
      {
        step: 4,
        heading: 'Verify by Reverse Multiplication',
        visualFormula: '(13 × 4) + 2 = 52 + 2 = 54 ✓',
        caption: 'Quotient × Divisor + Remainder always reconstructs the original Dividend!',
        highlightColor: 'from-emerald-600 to-teal-600'
      }
    ],
    audioChapters: [
      {
        title: 'Part 1 · Share Big Tens Before Ones',
        script: 'Instead of guessing long division steps, share tens first! To divide 54 into 4 equal groups, hand out 10 to each group right away. That uses 40, leaving only 14!',
        socraticPrompt: 'With 14 left for 4 groups, how many more can each group receive fairly?'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'When sharing 54 notebooks equally among 4 tables, how many notebooks are on each table and left over?',
        options: ['12 each, R 6', '13 each, R 2', '14 each, R 0', '11 each, R 10'],
        correctAnswer: '13 each, R 2',
        explanation: '4 × 13 = 52, leaving a remainder of 2.'
      },
      {
        id: 'q2',
        question: 'Which rule checks if Quotient Q, Divisor D, Remainder R match Dividend N?',
        options: ['N = Q + D + R', 'N = (Q × D) + R', 'N = (Q × R) + D', 'N = D ÷ Q'],
        correctAnswer: 'N = (Q × D) + R',
        explanation: 'Multiplying Quotient × Divisor and adding Remainder yields the Dividend.'
      },
      {
        id: 'q3',
        question: 'Can the remainder when dividing by 6 ever be 7?',
        options: ['Yes, always', 'No, remainder must be less than divisor 6', 'Only for odd numbers', 'Yes, if quotient is 0'],
        correctAnswer: 'No, remainder must be less than divisor 6',
        explanation: 'If 7 remained, you could give 1 more to each of the 6 groups!'
      }
    ]
  },
  {
    id: 'lms-sci-g6-matter',
    conceptCode: 'CON-SCI-G6-MATTER',
    grade: 'Grade 6',
    subject: 'Science',
    title: 'States of Matter & Particle Kinetic Energy',
    track: 'CURRENT_GRADE',
    durationMinutes: 14,
    summary: 'Explore how temperature controls molecular spacing, vibration energy, and phase transitions (Solid ↔ Liquid ↔ Gas).',
    learningOutcome: 'Connect thermal energy input to particle spacing, motion speed, and macroscopic shape/volume properties.',
    simulationKind: 'MATTER_STATES',
    visualScenes: [
      {
        step: 1,
        heading: 'Solid State (< 0°C Ice Matrix)',
        visualFormula: 'Tightly Packed · Fixed Lattice · Low Kinetic Energy',
        caption: 'Particles vibrate in locked positions — fixed shape and fixed volume.',
        highlightColor: 'from-sky-600 to-blue-700'
      },
      {
        step: 2,
        heading: 'Melting & Liquid State (0°C – 99°C)',
        visualFormula: 'Sliding Particles · Fixed Volume · Adapts to Container',
        caption: 'Adding heat lets molecules slide past each other fluidly without escaping the vessel.',
        highlightColor: 'from-teal-500 to-emerald-600'
      },
      {
        step: 3,
        heading: 'Boiling & Gaseous Steam (≥ 100°C)',
        visualFormula: 'High Speed · Wide Spacing · Fills Entire Space',
        caption: 'At 100°C, kinetic energy overcomes attraction completely — molecules bounce freely in 3D.',
        highlightColor: 'from-amber-500 to-rose-600'
      },
      {
        step: 4,
        heading: 'Reversible Physical Change Cycle',
        visualFormula: 'Cooling Removes Energy: Gas → Liquid → Solid',
        caption: 'Cooling slows particle motion down so intermolecular bonds pull particles closer again.',
        highlightColor: 'from-purple-600 to-indigo-600'
      }
    ],
    audioChapters: [
      {
        title: 'Part 1 · Temperature Is Particle Dance Speed',
        script: 'Imagine water molecules as tiny magnets holding hands. When freezing cold below zero degrees, they shiver in place as solid ice. Heat them past zero, and their hands loosen so they slide into liquid water. At one hundred degrees Celsius, they burst apart into fast-flying steam!',
        socraticPrompt: 'Notice the kinetic energy clue: when temperature rises, does particle speed increase or decrease?'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What happens to molecular kinetic energy as water is heated from 20°C to 105°C?',
        options: ['Kinetic energy decreases', 'Molecules stop vibrating', 'Kinetic energy increases rapidly', 'Mass disappears'],
        correctAnswer: 'Kinetic energy increases rapidly',
        explanation: 'Thermal energy transfers into molecular kinetic motion, increasing speed and spacing.'
      },
      {
        id: 'q2',
        question: 'Which state of matter has fixed volume but adapts to the shape of its container?',
        options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
        correctAnswer: 'Liquid',
        explanation: 'Liquid particles slide smoothly while staying close together, keeping volume constant.'
      },
      {
        id: 'q3',
        question: 'At normal atmospheric pressure, water boils into gas/steam starting at:',
        options: ['0°C', '50°C', '100°C', '150°C'],
        correctAnswer: '100°C',
        explanation: '100°C is the standard boiling point of pure water.'
      }
    ]
  },
  {
    id: 'lms-eng-g6-comp',
    conceptCode: 'CON-ENG-G6-INF',
    grade: 'Grade 6',
    subject: 'English',
    title: 'Active Reading Comprehension & Inference Strategies',
    track: 'CURRENT_GRADE',
    durationMinutes: 12,
    summary: 'Combine explicit text clues with background knowledge to uncover character motives, tone, and implied meaning.',
    learningOutcome: 'Apply the Clue + Prior Schema = Inference formula on unseen reading passages.',
    simulationKind: 'INFERENCE_BUILDER',
    visualScenes: [
      {
        step: 1,
        heading: 'Notice Literal Text Clues First',
        visualFormula: 'Text Clue = Direct Observation From Passage',
        caption: 'Highlight exact words describing actions, dialogue, or setting without guessing wildly.',
        highlightColor: 'from-rose-500 to-orange-500'
      },
      {
        step: 2,
        heading: 'Add Real-World Experience (Schema)',
        visualFormula: '+ Real-World Schema (What We Know)',
        caption: 'Connect the author’s detail to familiar cause-and-effect patterns from everyday life.',
        highlightColor: 'from-indigo-600 to-purple-600'
      },
      {
        step: 3,
        heading: 'Synthesize a Evidence-Backed Inference',
        visualFormula: '= Logical Inference (Implied Meaning)',
        caption: 'State what the author shows rather than explicitly tells — always backed by a line number.',
        highlightColor: 'from-emerald-600 to-teal-600'
      },
      {
        step: 4,
        heading: 'Verify Against Counter-Evidence',
        visualFormula: 'Does the rest of the paragraph agree? ✓',
        caption: 'Good readers re-check the next two sentences to confirm their inference holds true.',
        highlightColor: 'from-sky-600 to-indigo-600'
      }
    ],
    audioChapters: [
      {
        title: 'Part 1 · Reading Between the Lines',
        script: 'Authors love to show instead of tell. If a story says Maya zipped her coat tight and blew warm air onto her fingers, it never uses the word winter—yet you combine coat plus cold hands to infer freezing weather!',
        socraticPrompt: 'Think of one action clue that shows someone is nervous before a speech.'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: '"Arjun glanced at the clock three times while tapping his pencil rapidly." What is the best inference?',
        options: ['He is asleep', 'He feels anxious or impatient about the time', 'He forgot how to read clocks', 'The classroom is empty'],
        correctAnswer: 'He feels anxious or impatient about the time',
        explanation: 'Clock-watching plus rapid tapping signals anxiety or impatience.'
      },
      {
        id: 'q2',
        question: 'Which formula accurately represents an inference?',
        options: ['Random Guess Only', 'Text Clue + Background Schema = Inference', 'Dictionary Definition Only', 'Title − Ending'],
        correctAnswer: 'Text Clue + Background Schema = Inference',
        explanation: 'Inferences require direct textual evidence paired with real-world reasoning.'
      },
      {
        id: 'q3',
        question: 'When checking if an inference is valid, what must you always provide?',
        options: ['A word count', 'Supporting evidence from the text', 'Your favourite color', 'Only the first word'],
        correctAnswer: 'Supporting evidence from the text',
        explanation: 'Every valid inference anchors back to specific words or details in the passage.'
      }
    ]
  },
  {
    id: 'lms-cs-g8-ai',
    conceptCode: 'CON-CS-G8-ALG',
    grade: 'Grade 8',
    subject: 'Computer Science & AI',
    title: 'Pattern Recognition & Algorithmic Flowcharts',
    track: 'CURRENT_GRADE',
    durationMinutes: 14,
    summary: 'Trace step-by-step loops, conditionals, and accumulator variables using visual flowcharts and live dry-run execution.',
    learningOutcome: 'Predict loop termination and trace variable states across iterative algorithms.',
    simulationKind: 'FLOWCHART_TRACE',
    visualScenes: [
      {
        step: 1,
        heading: 'Initialize Input & Accumulator',
        visualFormula: 'Input N  |  sum = 0  |  i = 1',
        caption: 'Every reliable loop starts by initializing both the running total and the loop counter.',
        highlightColor: 'from-slate-800 to-indigo-900'
      },
      {
        step: 2,
        heading: 'Decision Diamond Check',
        visualFormula: 'Is i <= N ?   [YES ➔ Loop]   [NO ➔ Output]',
        caption: 'Flowchart diamonds test conditions cleanly before each iteration executes.',
        highlightColor: 'from-purple-600 to-indigo-600'
      },
      {
        step: 3,
        heading: 'Process Box Update',
        visualFormula: 'sum = sum + i  ;  i = i + 1',
        caption: 'Update the accumulator first, then increment the counter so the loop eventually exits.',
        highlightColor: 'from-teal-600 to-emerald-600'
      },
      {
        step: 4,
        heading: 'Dry-Run Table Verification',
        visualFormula: 'N = 4  ➔  0 + 1 + 2 + 3 + 4 = 10',
        caption: 'Tracing each variable column prevents off-by-one bugs in coding and AI logic.',
        highlightColor: 'from-amber-500 to-orange-600'
      }
    ],
    audioChapters: [
      {
        title: 'Part 1 · Think Like a Computer Step-by-Step',
        script: 'An algorithm is just a recipe with zero ambiguity. Watch two boxes closely: the accumulator sum keeps adding each step, while the counter i steps up by one until it crosses N and exits cleanly.',
        socraticPrompt: 'What happens if you accidentally forget to add i = i + 1 inside a loop?'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'When running the sum-from-1-to-N flowchart with N = 4, what is the final sum?',
        options: ['6', '10', '14', '15'],
        correctAnswer: '10',
        explanation: '1 + 2 + 3 + 4 = 10.'
      },
      {
        id: 'q2',
        question: 'Which flowchart shape represents a Yes/No decision condition?',
        options: ['Oval', 'Diamond', 'Parallelogram', 'Circle'],
        correctAnswer: 'Diamond',
        explanation: 'Diamonds represent conditional branches in standard flowcharts.'
      },
      {
        id: 'q3',
        question: 'If i = i + 1 is omitted inside a while (i <= N) loop, what occurs?',
        options: ['Syntax compile crash immediately', 'Infinite loop (never terminates)', 'Sum multiplies by 2', 'Auto-skips iteration'],
        correctAnswer: 'Infinite loop (never terminates)',
        explanation: 'Without changing the loop variable i, the condition stays true forever.'
      }
    ]
  }
];

export const LmsStudio: React.FC<{
  initialStudentMode?: boolean;
  onNavigateToGaps?: () => void;
  onNavigateToIntelligence?: () => void;
}> = ({ initialStudentMode = false, onNavigateToGaps, onNavigateToIntelligence }) => {
  const [lessons, setLessons] = useState<LmsLesson[]>(INITIAL_LMS_LESSONS);
  const [filterTrack, setFilterTrack] = useState<'ALL' | 'FOUNDATION_BRIDGE' | 'CURRENT_GRADE'>('ALL');
  const [filterSubject, setFilterSubject] = useState<string>('ALL');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(INITIAL_LMS_LESSONS[0].id);

  // Live VAK Telemetry & Modality Player State
  const [telemetry, setTelemetry] = useState<VakTelemetryRecord>(() => loadVakTelemetry());
  const [activeModality, setActiveModality] = useState<VakModality>('VISUAL');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Audio Voiceover State
  const [audioSpeaking, setAudioSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Kinaesthetic Simulations State
  const [gridCount, setGridCount] = useState(60); // 3/5 = 60/100
  const [simPercent, setSimPercent] = useState(25);
  const [simTotalQty, setSimTotalQty] = useState(240);
  const [simDivisors, setSimDivisors] = useState(4);
  const [simDividend, setSimDividend] = useState(54);
  const [simTempC, setSimTempC] = useState(25);
  const [selectedInferenceIdx, setSelectedInferenceIdx] = useState(0);
  const [simLoopN, setSimLoopN] = useState(4);

  // Mastery Check State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean; feedback: string } | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Staff Create Lesson Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [draftLesson, setDraftLesson] = useState({
    title: '',
    grade: 'Grade 6',
    subject: 'Mathematics',
    track: 'CURRENT_GRADE' as 'CURRENT_GRADE' | 'FOUNDATION_BRIDGE',
    visualFormula: '',
    audioScript: '',
    simulationKind: 'PERCENTAGE_SLIDER' as SimulationKind
  });
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Pick up requested lesson from LearningGapStudio or Student's top VAK modality on mount
  useEffect(() => {
    const requestedLesson = localStorage.getItem(ACTIVE_LMS_LESSON_STORAGE_KEY);
    if (requestedLesson) {
      const exists = INITIAL_LMS_LESSONS.find(l => l.id === requestedLesson);
      if (exists) setSelectedLessonId(exists.id);
      localStorage.removeItem(ACTIVE_LMS_LESSON_STORAGE_KEY);
    }
    const t = loadVakTelemetry();
    setTelemetry(t);
    const { visual, auditory, kinaesthetic } = t.computedVak;
    if (visual >= auditory && visual >= kinaesthetic) setActiveModality('VISUAL');
    else if (kinaesthetic >= auditory) setActiveModality('KINAESTHETIC');
    else setActiveModality('AUDITORY');
  }, []);

  // Auto-advance Visual Storyboard scenes when Play Video Animation is active
  const currentLesson = useMemo(
    () => lessons.find(l => l.id === selectedLessonId) || lessons[0],
    [lessons, selectedLessonId]
  );

  useEffect(() => {
    if (!videoPlaying) return;
    const id = setInterval(() => {
      setSceneIndex(prev => (prev + 1) % currentLesson.visualScenes.length);
    }, 3400);
    return () => clearInterval(id);
  }, [videoPlaying, currentLesson.visualScenes.length]);

  // Cancel TTS when switching lesson or unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [selectedLessonId]);

  const recordVakInteraction = (modality: VakModality) => {
    setActiveModality(modality);
    setTelemetry(prev => {
      const visualActions = prev.visualActions + (modality === 'VISUAL' ? 1 : 0);
      const auditoryActions = prev.auditoryActions + (modality === 'AUDITORY' ? 1 : 0);
      const kinaestheticActions = prev.kinaestheticActions + (modality === 'KINAESTHETIC' ? 1 : 0);
      const computedVak = normalizeVakTriple(visualActions, auditoryActions, kinaestheticActions);
      const next: VakTelemetryRecord = {
        ...prev,
        visualActions,
        auditoryActions,
        kinaestheticActions,
        lastModalityUsed: modality,
        computedVak,
        updatedAt: new Date().toISOString()
      };
      saveVakTelemetry(next);
      return next;
    });
  };

  const handleSelectLesson = (lessonId: string) => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setAudioSpeaking(false);
    setVideoPlaying(false);
    setSceneIndex(0);
    setQuizAnswers({});
    setQuizResult(null);
    setSelectedLessonId(lessonId);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      notify('Browser speech synthesis unavailable — follow the synchronized audio transcript below.');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-IN';
    utter.rate = speechRate;
    utter.onend = () => setAudioSpeaking(false);
    utter.onerror = () => setAudioSpeaking(false);
    setAudioSpeaking(true);
    recordVakInteraction('AUDITORY');
    window.speechSynthesis.speak(utter);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setAudioSpeaking(false);
  };

  const handleSubmitMasteryQuiz = async () => {
    const total = currentLesson.quiz.length;
    const correct = currentLesson.quiz.filter(q => quizAnswers[q.id] === q.correctAnswer).length;
    const score = Math.round((correct / total) * 100);
    const passed = score >= 67;

    setSubmittingQuiz(true);
    const updatedCompleted = passed
      ? Array.from(new Set([...telemetry.completedLessons, currentLesson.id]))
      : telemetry.completedLessons;

    // Weight current preferred modality slightly more on high mastery gain (+2 mastery bonus)
    const bonusV = passed && activeModality === 'VISUAL' ? 2 : 0;
    const bonusA = passed && activeModality === 'AUDITORY' ? 2 : 0;
    const bonusK = passed && activeModality === 'KINAESTHETIC' ? 2 : 0;

    const nextV = telemetry.visualActions + bonusV;
    const nextA = telemetry.auditoryActions + bonusA;
    const nextK = telemetry.kinaestheticActions + bonusK;
    const computedVak = normalizeVakTriple(nextV, nextA, nextK);

    const nextTelemetry: VakTelemetryRecord = {
      ...telemetry,
      visualActions: nextV,
      auditoryActions: nextA,
      kinaestheticActions: nextK,
      lastModalityUsed: activeModality,
      lastMasteryScore: score,
      completedLessons: updatedCompleted,
      computedVak,
      updatedAt: new Date().toISOString()
    };
    saveVakTelemetry(nextTelemetry);
    setTelemetry(nextTelemetry);

    // Sync live VAK telemetry & portfolio mastery record to backend API when available
    try {
      await apiPost('/api/student-intelligence/vak/assess', {
        studentId: 'ach-stu-aarav-01',
        visualScore: computedVak.visual,
        auditoryScore: computedVak.auditory,
        kinaestheticScore: computedVak.kinaesthetic,
        activeConcept: currentLesson.title
      });
      if (passed) {
        await apiPost('/api/student-intelligence/portfolio/ach-stu-aarav-01', {
          section: currentLesson.track === 'FOUNDATION_BRIDGE' ? '7. Remedial Learning Progress' : '5. Concept Mastery',
          category: 'CERTIFICATE',
          title: `LMS Multimodal Mastery: ${currentLesson.title}`,
          description: `Scored ${score}% after learning in ${activeModality} mode (Visual ${computedVak.visual}% · Auditory ${computedVak.auditory}% · Kinaesthetic ${computedVak.kinaesthetic}%).`,
          evidenceType: 'AI LMS Telemetry & Mastery Check'
        });
      }
    } catch {
      // Offline / sandbox fallback safely retains localStorage telemetry
    } finally {
      setSubmittingQuiz(false);
      setQuizResult({
        score,
        passed,
        feedback: passed
          ? `Great mastery! Scored ${score}% via ${activeModality} mode — VAK telemetry (${computedVak.visual}% V · ${computedVak.auditory}% A · ${computedVak.kinaesthetic}% K) synced with your 360° Portfolio.`
          : `You scored ${score}%. Try switching to another modality (Video, Audio, or Interactive Lab) above and retake the check!`
      });
      notify(passed ? `Mastery ${score}% synced to VAK & Portfolio!` : `Check complete (${score}%) — try another modality tab!`);
    }
  };

  const handleCreateCustomLesson = () => {
    if (!draftLesson.title.trim()) return;
    const newId = `lms-custom-${Date.now()}`;
    const created: LmsLesson = {
      id: newId,
      conceptCode: `CON-CUS-${Date.now().toString().slice(-4)}`,
      grade: draftLesson.grade,
      subject: draftLesson.subject,
      title: draftLesson.title.trim(),
      track: draftLesson.track,
      durationMinutes: 12,
      summary: `Faculty-authored multimodal unit combining Visual storyboard, Audio narration, and interactive Simulation.`,
      learningOutcome: `Demonstrate conceptual understanding of ${draftLesson.title.trim()} across VAK modes.`,
      simulationKind: draftLesson.simulationKind,
      visualScenes: [
        {
          step: 1,
          heading: 'Core Concept Overview',
          visualFormula: draftLesson.visualFormula.trim() || `${draftLesson.title.trim()} → Key Pattern`,
          caption: 'Start by examining the core structural relationship visually.',
          highlightColor: 'from-indigo-600 to-purple-600'
        },
        {
          step: 2,
          heading: 'Worked Step-by-Step Application',
          visualFormula: 'Given → Rule Applied → Verified Result',
          caption: 'Break problems into bite-sized visual checkpoints before final computation.',
          highlightColor: 'from-teal-600 to-emerald-600'
        }
      ],
      audioChapters: [
        {
          title: 'Faculty Audio Walkthrough',
          script:
            draftLesson.audioScript.trim() ||
            `Welcome to ${draftLesson.title.trim()} for ${draftLesson.grade} ${draftLesson.subject}. Focus carefully on the pattern first, then test yourself in the simulation tab.`,
          socraticPrompt: 'Pause and summarize the core rule in your own words!'
        }
      ],
      quiz: INITIAL_LMS_LESSONS[0].quiz
    };
    setLessons(prev => [created, ...prev]);
    setSelectedLessonId(newId);
    setShowCreateModal(false);
    setDraftLesson({
      title: '',
      grade: 'Grade 6',
      subject: 'Mathematics',
      track: 'CURRENT_GRADE',
      visualFormula: '',
      audioScript: '',
      simulationKind: 'PERCENTAGE_SLIDER'
    });
    notify(`Created multimodal LMS lesson "${created.title}"!`);
  };

  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      if (filterTrack !== 'ALL' && l.track !== filterTrack) return false;
      if (filterSubject !== 'ALL' && l.subject !== filterSubject) return false;
      return true;
    });
  }, [lessons, filterTrack, filterSubject]);

  const activeScene = currentLesson.visualScenes[sceneIndex] || currentLesson.visualScenes[0];
  const dominantModalityLabel =
    telemetry.computedVak.visual >= telemetry.computedVak.auditory &&
    telemetry.computedVak.visual >= telemetry.computedVak.kinaesthetic
      ? 'Visual-Multimodal'
      : telemetry.computedVak.kinaesthetic >= telemetry.computedVak.auditory
      ? 'Kinaesthetic-Multimodal'
      : 'Auditory-Multimodal';

  const renderSimulationCanvas = () => {
    switch (currentLesson.simulationKind) {
      case 'FRACTION_100_GRID':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  Interactive 100-Grid &amp; Equivalent Fraction Simulator
                </h4>
                <p className="text-xs text-slate-500">
                  Tap any fraction preset or click any square (1–100) to scale denominators directly to 100.
                </p>
              </div>
              <span className="text-xs font-mono font-black text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                {gridCount} / 100 = {gridCount}%
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: '1/4 (×25)', count: 25, eq: '25/100 = 25%' },
                { label: '2/5 (×20)', count: 40, eq: '40/100 = 40%' },
                { label: '1/2 (×50)', count: 50, eq: '50/100 = 50%' },
                { label: '3/5 (×20)', count: 60, eq: '60/100 = 60%' },
                { label: '3/4 (×25)', count: 75, eq: '75/100 = 75%' },
                { label: '7/20 (×5)', count: 35, eq: '35/100 = 35%' }
              ].map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setGridCount(preset.count);
                    recordVakInteraction('KINAESTHETIC');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    gridCount === preset.count
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="grid grid-cols-10 gap-1 p-3 bg-slate-50 rounded-2xl border border-slate-200 max-w-[280px] mx-auto w-full">
                {Array.from({ length: 100 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setGridCount(idx + 1);
                      recordVakInteraction('KINAESTHETIC');
                    }}
                    className={`h-5 w-full rounded-[3px] text-[9px] font-mono transition-colors ${
                      idx < gridCount
                        ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-300 hover:bg-purple-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                <div className="font-black text-amber-900">Live Base-100 readout:</div>
                <div className="font-mono text-base font-black text-purple-900 bg-white p-3 rounded-xl border border-purple-200 text-center">
                  {gridCount} / 100 Squares = {gridCount}%
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Unshaded remaining squares: <strong>{100 - gridCount} / 100</strong> ({100 - gridCount}%). Notice how <strong>{gridCount}% + {100 - gridCount}% = 100%</strong>!
                </p>
              </div>
            </div>
          </div>
        );

      case 'PERCENTAGE_SLIDER': {
        const computedVal = ((simPercent / 100) * simTotalQty).toFixed(simTotalQty % 10 === 0 ? 1 : 2).replace(/\.0$/, '');
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-black text-slate-900">
                Interactive Percentage-of-Quantity &amp; Discount Lab
              </h4>
              <p className="text-xs text-slate-500">
                Drag both sliders to watch how Percentage (%) scales dynamically against any Total Quantity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-slate-800">
                  <span>Target Percentage (%)</span>
                  <span className="text-purple-700 font-mono">{simPercent}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={95}
                  step={5}
                  value={simPercent}
                  onChange={e => {
                    setSimPercent(Number(e.target.value));
                    recordVakInteraction('KINAESTHETIC');
                  }}
                  className="w-full accent-purple-600"
                />
                <div className="flex gap-1.5 pt-1">
                  {[10, 20, 25, 50, 75].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setSimPercent(p);
                        recordVakInteraction('KINAESTHETIC');
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        simPercent === p ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-slate-800">
                  <span>Total Quantity (Students / ₹ Amount)</span>
                  <span className="text-indigo-700 font-mono">{simTotalQty}</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={1000}
                  step={20}
                  value={simTotalQty}
                  onChange={e => {
                    setSimTotalQty(Number(e.target.value));
                    recordVakInteraction('KINAESTHETIC');
                  }}
                  className="w-full accent-indigo-600"
                />
                <div className="flex gap-1.5 pt-1">
                  {[100, 240, 500, 800].map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setSimTotalQty(q);
                        recordVakInteraction('KINAESTHETIC');
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        simTotalQty === q ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-purple-200 space-y-3">
              <div className="w-full h-7 bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all flex items-center justify-center text-white text-[11px] font-black"
                  style={{ width: `${simPercent}%` }}
                >
                  {simPercent}% = {computedVal}
                </div>
                <div className="flex-1 flex items-center justify-center text-[11px] font-bold text-slate-500">
                  Remaining {100 - simPercent}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 font-mono text-xs font-bold text-indigo-950 text-center">
                ({simPercent} / 100) × {simTotalQty} = <strong>{computedVal}</strong>
              </div>
            </div>
          </div>
        );
      }

      case 'DIVISION_GROUPS': {
        const quotient = Math.floor(simDividend / simDivisors);
        const remainder = simDividend % simDivisors;
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900">
              Equal-Group Division &amp; Remainder Lab
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Total Items (Dividend)</span>
                  <span className="font-mono text-teal-700">{simDividend}</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={84}
                  value={simDividend}
                  onChange={e => {
                    setSimDividend(Number(e.target.value));
                    recordVakInteraction('KINAESTHETIC');
                  }}
                  className="w-full accent-teal-600"
                />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Equal Groups (Divisor)</span>
                  <span className="font-mono text-indigo-700">{simDivisors}</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={simDivisors}
                  onChange={e => {
                    setSimDivisors(Number(e.target.value));
                    recordVakInteraction('KINAESTHETIC');
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Array.from({ length: simDivisors }).map((_, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-center">
                  <div className="text-[10px] font-bold text-teal-700 uppercase">Group {idx + 1}</div>
                  <div className="text-lg font-black text-teal-900">{quotient}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 text-center font-mono">
              {simDividend} ÷ {simDivisors} = {quotient} each · Remainder = {remainder} · Check: ({quotient} × {simDivisors}) + {remainder} = {quotient * simDivisors + remainder} ✓
            </div>
          </div>
        );
      }

      case 'MATTER_STATES': {
        const stateLabel = simTempC < 0 ? 'SOLID (Ice Lattice)' : simTempC < 100 ? 'LIQUID (Water)' : 'GAS (Steam)';
        const particleGap = simTempC < 0 ? 'gap-1' : simTempC < 100 ? 'gap-2.5' : 'gap-6';
        const stateColor = simTempC < 0 ? 'bg-sky-600' : simTempC < 100 ? 'bg-teal-500' : 'bg-rose-500 animate-pulse';
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900">Molecular Kinetic Energy Temperature Chamber</h4>
              <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                {simTempC}°C · {stateLabel}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Adjust Thermal Energy (-20°C to +130°C)</span>
                <span>{simTempC}°C</span>
              </div>
              <input
                type="range"
                min={-20}
                max={130}
                value={simTempC}
                onChange={e => {
                  setSimTempC(Number(e.target.value));
                  recordVakInteraction('KINAESTHETIC');
                }}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className={`p-6 rounded-2xl bg-slate-900 flex flex-wrap justify-center items-center min-h-[140px] transition-all ${particleGap}`}>
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full transition-all shadow-md ${stateColor}`} />
              ))}
            </div>
          </div>
        );
      }

      case 'INFERENCE_BUILDER': {
        const cases = [
          { clue: 'Maya zipped her coat tight and blew warm air onto her hands.', schema: 'People warm hands and zip coats in freezing weather.', inference: 'It is freezing cold outside.' },
          { clue: 'Arjun glanced at the clock three times and tapped his pencil rapidly.', schema: 'Repeated clock-checking + rapid tapping indicates stress.', inference: 'Arjun feels anxious or impatient about the time.' },
          { clue: 'Every desk had safety goggles and bubbling beakers beside notebooks.', schema: 'Goggles and beakers are used for chemistry experiments.', inference: 'A science lab experiment is underway.' }
        ];
        const currentCase = cases[selectedInferenceIdx];
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900">Interactive Clue + Schema → Inference Builder</h4>
            <div className="flex flex-wrap gap-2">
              {cases.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedInferenceIdx(idx);
                    recordVakInteraction('KINAESTHETIC');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    selectedInferenceIdx === idx ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Evidence Scenario #{idx + 1}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="font-black text-rose-800 uppercase text-[10px] mb-1">1. Text Clue</div>
                <p className="text-slate-700 font-semibold">{currentCase.clue}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
                <div className="font-black text-indigo-800 uppercase text-[10px] mb-1">2. Prior Schema</div>
                <p className="text-slate-700 font-semibold">{currentCase.schema}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="font-black text-emerald-800 uppercase text-[10px] mb-1">3. Logical Inference</div>
                <p className="text-emerald-950 font-black">{currentCase.inference}</p>
              </div>
            </div>
          </div>
        );
      }

      case 'FLOWCHART_TRACE': {
        let running = 0;
        const traceRows = Array.from({ length: simLoopN }).map((_, idx) => {
          const i = idx + 1;
          running += i;
          return { i, sum: running };
        });
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900">Live Loop Trace Simulator (Sum 1..N)</h4>
              <span className="text-xs font-mono font-black bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                N = {simLoopN} → Final Sum = {running}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <input
                type="range"
                min={1}
                max={8}
                value={simLoopN}
                onChange={e => {
                  setSimLoopN(Number(e.target.value));
                  recordVakInteraction('KINAESTHETIC');
                }}
                className="w-full accent-indigo-600"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {traceRows.map(r => (
                <div key={r.i} className="p-2.5 rounded-xl bg-white border border-indigo-200 font-mono text-xs text-center">
                  <div className="text-slate-500">Step i = {r.i}</div>
                  <div className="font-black text-indigo-800">sum = {r.sum}</div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* 1. HERO HEADER WITH LIVE VAK TELEMETRY BAR */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
              <PlayCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  AI MULTIMODAL LMS STUDIO
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {dominantModalityLabel} Active
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Achariya Adaptive Video, Audio &amp; Interactive Simulation LMS
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {initialStudentMode
                  ? 'Learn regular curriculum topics and relearn lower-grade prerequisites through Video, Spoken Audio & Interactive Labs — automatically tuning your VAK profile.'
                  : 'Author, preview, and deliver multimodal Video, Audio, and Simulation lessons synced directly with Learning Gap Studio & 360° BMIT/VAK.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-purple-50 border border-purple-200 text-center">
              <div className="text-sm font-black text-purple-800">{telemetry.computedVak.visual}%</div>
              <div className="text-[10px] font-bold text-purple-600 uppercase">Visual (V)</div>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-sky-50 border border-sky-200 text-center">
              <div className="text-sm font-black text-sky-800">{telemetry.computedVak.auditory}%</div>
              <div className="text-[10px] font-bold text-sky-600 uppercase">Audio (A)</div>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <div className="text-sm font-black text-emerald-800">{telemetry.computedVak.kinaesthetic}%</div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase">Sim (K)</div>
            </div>

            {!initialStudentMode && (
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Multimodal Lesson</span>
              </button>
            )}
          </div>
        </div>

        {/* Connected Loop Quick Switch Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-600">Filter Track:</span>
            {(['ALL', 'CURRENT_GRADE', 'FOUNDATION_BRIDGE'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterTrack(t)}
                className={`px-3 py-1 rounded-xl font-bold border transition-colors ${
                  filterTrack === t
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t === 'ALL' ? 'All Lessons' : t === 'CURRENT_GRADE' ? 'Current Grade Learning' : 'Foundation Bridge (Relearn)'}
              </button>
            ))}

            <select
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              className="px-3 py-1 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
            >
              <option value="ALL">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Computer Science & AI">Computer Science &amp; AI</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToGaps && (
              <button
                type="button"
                onClick={onNavigateToGaps}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold transition-colors"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Back to Learning Gap Studio</span>
              </button>
            )}
            {onNavigateToIntelligence && (
              <button
                type="button"
                onClick={onNavigateToIntelligence}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold transition-colors"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>View Live VAK &amp; 360° Portfolio</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. COURSE CATALOG (LEFT) + MULTIMODAL LESSON PLAYER (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Course & Prerequisite Catalog */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Curriculum &amp; Remedial Library ({filteredLessons.length})</span>
            <span className="text-emerald-700">{telemetry.completedLessons.length} Completed</span>
          </div>

          <div className="space-y-2.5">
            {filteredLessons.map(lesson => {
              const isSelected = lesson.id === currentLesson.id;
              const isDone = telemetry.completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => handleSelectLesson(lesson.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-400 shadow-sm ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        lesson.track === 'FOUNDATION_BRIDGE'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-teal-100 text-teal-800 border-teal-200'
                      }`}
                    >
                      {lesson.track === 'FOUNDATION_BRIDGE' ? `${lesson.grade} Bridge` : lesson.grade} · {lesson.subject}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lesson.durationMinutes}m
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-black text-slate-900 leading-snug">{lesson.title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{lesson.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Multimodal VAK Learning & Simulation Player */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-indigo-700">
                  <span>{currentLesson.conceptCode}</span>
                  <span>·</span>
                  <span>{currentLesson.grade} {currentLesson.subject}</span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">{currentLesson.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{currentLesson.learningOutcome}</p>
              </div>
            </div>

            {/* 3 VAK Modality Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  recordVakInteraction('VISUAL');
                }}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeModality === 'VISUAL'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Visual Video ({telemetry.computedVak.visual}%)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVideoPlaying(false);
                  recordVakInteraction('AUDITORY');
                }}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeModality === 'AUDITORY'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>Audio Coach ({telemetry.computedVak.auditory}%)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  setVideoPlaying(false);
                  recordVakInteraction('KINAESTHETIC');
                }}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeModality === 'KINAESTHETIC'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Hand className="w-4 h-4" />
                <span>Simulation Lab ({telemetry.computedVak.kinaesthetic}%)</span>
              </button>
            </div>

            {/* MODE 1: VISUAL ANIMATED VIDEO STORYBOARD */}
            {activeModality === 'VISUAL' && (
              <div className="space-y-4">
                <div className={`rounded-3xl bg-gradient-to-br ${activeScene.highlightColor} text-white p-6 sm:p-8 shadow-md space-y-5`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full bg-white/20 font-black uppercase tracking-wider">
                      Animated Scene {sceneIndex + 1} of {currentLesson.visualScenes.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPlaying(p => !p);
                        recordVakInteraction('VISUAL');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-xs transition-colors"
                    >
                      {videoPlaying ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                      <span>{videoPlaying ? 'Pause Video' : 'Auto-Play Animated Video'}</span>
                    </button>
                  </div>

                  <div className="text-center space-y-3 py-2">
                    <h3 className="text-base sm:text-lg font-black text-white/95">{activeScene.heading}</h3>
                    <div className="inline-block px-6 py-4 rounded-2xl bg-slate-950/35 border border-white/25 font-mono text-base sm:text-xl font-black tracking-wide">
                      {activeScene.visualFormula}
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto leading-relaxed">
                      {activeScene.caption}
                    </p>
                  </div>

                  {/* Scene Scrubber */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {currentLesson.visualScenes.map((sc, sIdx) => (
                      <button
                        key={sc.step}
                        type="button"
                        onClick={() => {
                          setSceneIndex(sIdx);
                          setVideoPlaying(false);
                          recordVakInteraction('VISUAL');
                        }}
                        className={`p-2 rounded-xl text-left text-[11px] font-bold border transition-all ${
                          sIdx === sceneIndex
                            ? 'bg-white text-slate-900 border-white shadow-sm'
                            : 'bg-white/10 text-white/85 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        Scene {sc.step}: {sc.heading.split(' ').slice(0, 2).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: AUDITORY VOICE COACH & SOCRATIC LISTEN-ALOUD */}
            {activeModality === 'AUDITORY' && (
              <div className="p-5 rounded-3xl bg-sky-50/70 border border-sky-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-sky-950">Achariya Voiceover Coach &amp; Spoken Audio Studio</h3>
                    <p className="text-xs text-sky-700">Tap Play on any audio segment below to hear Indian-English narrated explanation.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600">Speed:</span>
                    {[0.85, 1.0, 1.15].map(rate => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setSpeechRate(rate)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold border ${
                          speechRate === rate ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                    {audioSpeaking && (
                      <button
                        type="button"
                        onClick={stopSpeech}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold"
                      >
                        <Square className="w-3 h-3" /> Stop
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {currentLesson.audioChapters.map((chap, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-sky-200/80 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-slate-900">{chap.title}</span>
                        <button
                          type="button"
                          onClick={() => speakText(`${chap.title}. ${chap.script} ${chap.socraticPrompt}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen Aloud</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{chap.script}</p>
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900">
                        🗣️ Oral Think-Aloud Check: {chap.socraticPrompt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODE 3: KINAESTHETIC VIRTUAL SIMULATION LAB */}
            {activeModality === 'KINAESTHETIC' && (
              <div className="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-200">
                {renderSimulationCanvas()}
              </div>
            )}
          </div>

          {/* 3-QUESTION LESSON MASTERY CHECK (Closes LMS -> VAK Telemetry -> Portfolio Loop) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  3-Question Micro-Check · Auto-Syncs VAK &amp; Portfolio
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-1">Verify Concept Understanding</h3>
              </div>
              {quizResult && (
                <span className={`px-3 py-1 rounded-full text-xs font-black ${
                  quizResult.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  Score: {quizResult.score}%
                </span>
              )}
            </div>

            {quizResult && (
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                quizResult.passed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                <div className="font-black flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>{quizResult.feedback}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {currentLesson.quiz.map((q, qIdx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="text-xs font-extrabold text-slate-900">
                    Q{qIdx + 1}. {q.question}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map(opt => {
                      const picked = quizAnswers[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                            picked
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50/50'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {quizResult && (
                    <div className="text-[11px] font-semibold text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg">
                      ✓ Explanation: {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {quizResult && (
                <button
                  type="button"
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizResult(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Check</span>
                </button>
              )}
              <button
                type="button"
                disabled={submittingQuiz}
                onClick={handleSubmitMasteryQuiz}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingQuiz ? 'Syncing VAK & Portfolio...' : 'Submit Mastery Check & Sync VAK'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STAFF / CONTENT CREATOR: ADD MULTIMODAL LESSON MODAL */}
      {!initialStudentMode && showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black text-slate-900">Create Multimodal VAK Lesson Module</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Lesson Title (e.g., Ratios & Direct Proportion Visual Lab)"
                value={draftLesson.title}
                onChange={e => setDraftLesson(p => ({ ...p, title: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={draftLesson.grade}
                  onChange={e => setDraftLesson(p => ({ ...p, grade: e.target.value }))}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                >
                  <option>Grade 4</option>
                  <option>Grade 5</option>
                  <option>Grade 6</option>
                  <option>Grade 7</option>
                  <option>Grade 8</option>
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                </select>
                <select
                  value={draftLesson.subject}
                  onChange={e => setDraftLesson(p => ({ ...p, subject: e.target.value }))}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                >
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>English</option>
                  <option>Computer Science &amp; AI</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={draftLesson.track}
                  onChange={e => setDraftLesson(p => ({ ...p, track: e.target.value as any }))}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="CURRENT_GRADE">Current Grade Learning</option>
                  <option value="FOUNDATION_BRIDGE">Foundation Bridge (Relearn)</option>
                </select>
                <select
                  value={draftLesson.simulationKind}
                  onChange={e => setDraftLesson(p => ({ ...p, simulationKind: e.target.value as SimulationKind }))}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="PERCENTAGE_SLIDER">Sim: Percentage &amp; Discount Lab</option>
                  <option value="FRACTION_100_GRID">Sim: 100-Grid Fraction Scaler</option>
                  <option value="DIVISION_GROUPS">Sim: Equal Sharing Lab</option>
                  <option value="MATTER_STATES">Sim: Particle Kinetic Chamber</option>
                  <option value="INFERENCE_BUILDER">Sim: Reading Inference Lab</option>
                  <option value="FLOWCHART_TRACE">Sim: Algorithmic Loop Trace</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Visual Storyboard Key Formula (e.g., Ratio A:B = Scaled A:B)"
                value={draftLesson.visualFormula}
                onChange={e => setDraftLesson(p => ({ ...p, visualFormula: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
              <textarea
                rows={3}
                placeholder="Audio Voiceover Script (will be spoken aloud in Auditory mode)..."
                value={draftLesson.audioScript}
                onChange={e => setDraftLesson(p => ({ ...p, audioScript: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCustomLesson}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
              >
                Publish to AI LMS Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

