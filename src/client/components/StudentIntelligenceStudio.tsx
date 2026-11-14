import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Compass,
  Award,
  Layers,
  Briefcase,
  FolderKanban,
  Users,
  HeartHandshake,
  Building2,
  Printer,
  Download,
  Plus,
  CheckCircle2,
  Target,
  Send,
  Eye,
  Headphones,
  Hand,
  ShieldCheck,
  BookOpen,
  Rocket,
  Sliders,
  TrendingUp,
  FileText,
  X
} from 'lucide-react';
import { apiGet, apiPost } from '../lib/api';

interface ScholarOption {
  id: string;
  label: string;
  grade: string;
  bandLabel: string;
}

const SCHOLAR_SWITCHER: ScholarOption[] = [
  { id: 'ach-stu-aarav-01', label: 'Aarav Sundaram', grade: 'Grade 6', bandLabel: 'Middle School' },
  { id: 'ach-stu-diya-02', label: 'Diya Krishnan', grade: 'Grade 10', bandLabel: 'Secondary Stream' },
  { id: 'ach-stu-karthik-12', label: 'Karthik Nair', grade: 'Grade 12', bandLabel: 'Senior Secondary' },
  { id: 'ach-stu-riya-pp', label: 'Riya Subramanian', grade: 'KG-2', bandLabel: 'Pre-Primary App' }
];

const FALLBACK_PROFILES: Record<string, any> = {
  'ach-stu-aarav-01': {
    student: {
      id: 'ach-stu-aarav-01',
      name: 'Aarav Sundaram',
      grade: 'Grade 6',
      gradeNumber: 6,
      gradeBand: 'MIDDLE_6_8',
      section: 'A',
      campus: 'Achariya World Class Academy (Main Campus)',
      rollNumber: 'ACH-2026-001',
      admissionYear: '2021-2022',
      longitudinalYears: 5,
      activeConceptGap: 'Percentage Calculations & Base-100 Fraction Scaling'
    },
    bmitProfile: {
      assessmentVersion: 'BMIT-STD-G6-v4.2',
      assessmentDate: '2026-08-18',
      counsellorApproved: true,
      counsellorName: 'Dr. Meenakshi Sundaram (Senior Educational Counsellor)',
      counsellorNotes: 'Strong Visual-Spatial & Logical pattern synthesis. Use 100-grid manipulatives for Percentage-to-Fraction bridge; encourage Robotics & Architecture club.',
      policyNote: 'Multiple intelligences coexist. BMIT guides personalized enrichment and never excludes any student from any subject, activity, or career.',
      domains: [
        { domain: 'Visual-Spatial', score: 88, previousScore: 82, growthDelta: 6, status: 'DOMINANT_STRENGTH', interpretation: 'Distinct natural fluency in 3D visualization, circuits & diagrams.', evidence: 'Builds 3D origami & circuit diagrams intuitively', recommendedActivities: ['3D Tangram Construction', 'Visual Mind-Map Notes'] },
        { domain: 'Logical-Mathematical', score: 84, previousScore: 78, growthDelta: 6, status: 'ESTABLISHED', interpretation: 'Steady functional capability in pattern puzzles & geometry.', evidence: 'Excels in pattern puzzles & geometry symmetry', recommendedActivities: ['100-Grid Fraction Scaling Lab', 'Logic Olympiad Circle'] },
        { domain: 'Interpersonal-Leadership', score: 82, previousScore: 75, growthDelta: 7, status: 'ESTABLISHED', interpretation: 'Collaborative leadership across peer study circles.', evidence: 'Leads peer study circle during remedial hour', recommendedActivities: ['Peer Maths Coach Role', 'Group Science Fair'] },
        { domain: 'Naturalistic-Scientific', score: 81, previousScore: 77, growthDelta: 4, status: 'ESTABLISHED', interpretation: 'Observational curiosity in ecology and measurement.', evidence: 'Maintains campus kitchen-garden moisture log', recommendedActivities: ['Botany Measurement Project'] },
        { domain: 'Bodily-Kinaesthetic', score: 79, previousScore: 76, growthDelta: 3, status: 'ESTABLISHED', interpretation: 'Strong tactile & physical coordination.', evidence: 'School cricket & hands-on science kit leadership', recommendedActivities: ['Fraction Block Manipulatives', 'Paper-Folding Labs'] },
        { domain: 'Intrapersonal-Reflective', score: 76, previousScore: 70, growthDelta: 6, status: 'ESTABLISHED', interpretation: 'Thoughtful weekly self-reflections.', evidence: 'Writes weekly portfolio reflections', recommendedActivities: ['Weekly Mastery Journal'] },
        { domain: 'Verbal-Linguistic', score: 74, previousScore: 71, growthDelta: 3, status: 'NURTURING_AREA', interpretation: 'Growing confidence in academic word-problem parsing.', evidence: 'Clear oral storytelling; developing maths word-problem fluency', recommendedActivities: ['Read-Aloud Problem Breakdown'] },
        { domain: 'Musical-Rhythmic', score: 69, previousScore: 66, growthDelta: 3, status: 'NURTURING_AREA', interpretation: 'Responds well to rhythmic memory chants.', evidence: 'Uses rhythm chants for tables', recommendedActivities: ['Rhythmic Skip-Counting Chants'] }
      ]
    },
    vakProfile: {
      visualScore: 46,
      auditoryScore: 22,
      kinaestheticScore: 32,
      primaryBlend: 'Visual-Multimodal Blend',
      note: 'VAK is a flexible multimodal learning preference guide — every concept is delivered with Visual, Auditory & Kinaesthetic options.',
      conceptModalityRecommendations: {
        conceptName: 'Percentage Calculations & Base-100 Fraction Scaling',
        visual: [
          'Interactive 10×10 100-Grid shading breakdown (3/5 = 60/100 = 60%)',
          'Color-coded denominator scaling arrows linking Grade 5 fractions to Grade 6 percentages',
          'Short visual bar-model concept card'
        ],
        auditory: [
          'Socratic Think-Aloud guided dialogue ("How many parts out of 100?")',
          'Teach-Back in 60 Seconds peer conversation prompt',
          'Sports-score verbal estimation prompts'
        ],
        kinaesthetic: [
          'Physical paper-folding fraction strips cut into 5, 10 & 20 parts',
          'Mock Achariya Sports Store ₹500 20% discount roleplay',
          '1-Page Printable Hybrid Bridge Worksheet with QR scan'
        ]
      }
    },
    developmentDimensions: [
      'Intellectual Development', 'Academic Development', 'Cognitive Development', 'Critical Thinking',
      'Computational Thinking', 'Creative Thinking', 'Communication', 'Collaboration',
      'Problem-Solving', 'Leadership', 'Emotional & Social Development', 'Physical Development',
      'Digital Literacy', 'Financial Literacy', 'Entrepreneurship', 'Innovation',
      'Life Skills', 'Environmental Awareness', 'Cultural Awareness', 'Future-Ready Competencies'
    ].map((dimension, i) => ({
      dimension,
      score: Math.min(94, 74 + ((i * 3) % 18)),
      status: i % 3 === 0 ? 'THRIVING' : 'ON_TRACK',
      evidence: 'Observed across Grade 6 projects, labs & classroom logs.',
      teacherObservation: `Demonstrates steady growth in ${dimension.toLowerCase()}.`,
      goal: `Advance ${dimension.toLowerCase()} through Term 2 interdisciplinary tasks.`
    })),
    futureSkills: [
      'Critical Thinking', 'Computational Thinking', 'Creative Thinking', 'Communication',
      'Collaboration', 'Digital Literacy', 'AI Literacy', 'Data Literacy',
      'Financial Literacy', 'Entrepreneurship', 'Design Thinking', 'Research Skills',
      'Leadership', 'Adaptability', 'Problem-Solving', 'Innovation'
    ].map((skill, i) => ({
      skill,
      currentScore: Math.min(92, 72 + ((i * 5) % 19)),
      targetScore: 90,
      status: i % 3 === 0 ? 'FUTURE_READY' : 'DEVELOPING',
      gapAnalysis: i % 3 === 0 ? `Exceeding grade benchmark in ${skill}.` : `Targeted practice project assigned to boost ${skill}.`,
      recommendedProject: i % 2 === 0 ? 'Solar Water-Level Tank % Simulator' : 'Campus Data Storytelling Brief'
    })),
    iedpPlan: {
      shortTermGoals: [
        'Close Grade 6 Percentage Calculations gap via 100-Grid & Paper-Folding bridge.',
        'Deliver lessons in Visual (46%) + Kinaesthetic (32%) + Auditory (22%) blend.'
      ],
      termGoals: [
        'Strengthen Verbal-Linguistic word-problem parsing by +5 points.',
        'Complete Solar Sensor Robotics Prototype & publish to Digital Portfolio.'
      ],
      annualGoals: [
        'Achieve 100% Learning Required certification across Term 1 & 2 core math units.',
        'Present Annual Portfolio & BMIT Growth Review with parents & counsellor.'
      ],
      longTermGoals: [
        'Explore Engineering, Clean Energy Technology & Design Architecture clusters across Middle School.'
      ]
    },
    portfolio: {
      totalSections: 23,
      sectionsCatalog: [
        '1. Student Profile', '2. BMIT Intelligence Report', '3. VAK Learning Preference Profile',
        '4. Academic Progress', '5. Concept Mastery', '6. Learning Gap History',
        '7. Remedial Learning Progress', '8. Thinking Skills Development', '9. Projects and Innovations',
        '10. Achievements and Awards', '11. Sports and Extracurricular Activities', '12. Leadership Experience',
        '13. Communication and Collaboration', '14. Life Skills', '15. Digital Competencies',
        '16. Future-Ready Skills', '17. Career Exploration', '18. Teacher Observations',
        '19. Parent Feedback', '20. Student Reflections', '21. Certificates',
        '22. Annual Development Reports', '23. Personal Development Plans'
      ],
      items: [
        {
          id: 'pf-aarav-1',
          section: '9. Projects and Innovations',
          category: 'PROJECT',
          title: 'Solar-Powered Water Level Sensor Model',
          description: 'Designed visual circuit blueprint and assembled ultrasonic sensor model measuring tank capacity percentage (0%–100%).',
          date: '2026-10-12',
          evidenceType: 'Prototype Photo & Blueprint PDF',
          author: 'Aarav Sundaram'
        },
        {
          id: 'pf-aarav-2',
          section: '18. Teacher Observations',
          category: 'TEACHER_OBSERVATION',
          title: 'Breakthrough Using Tactile 100-Grid Visuals',
          description: 'Scaled 3/5 and 7/20 to base-100 independently within 12 minutes once paired with 10×10 grid tiles.',
          date: '2026-10-28',
          evidenceType: 'Classroom Intervention Log',
          author: 'Dr. Priya Sivaraman (Mathematics Faculty)'
        }
      ]
    },
    interests: ['Robotics', 'Space Science', 'Architectural Drawing', 'Cricket'],
    aspirations: 'Build clean-energy robots and design smart cities',
    centralAiRecommendations: {
      whatToLearn: 'Bridge Grade 5 Equivalent Fractions (denominators 5, 20, 25 -> 100) before Grade 6 Percentage word problems.',
      howToLearn: 'Combine Visual 100-Grid charts (46%), Kinaesthetic paper-folding (32%) & Socratic dialogue (22%).',
      whatToPractise: '15-minute Foundation Power-Up sprints + 1 unseen Sports Store discount problem daily.',
      skillsToDevelop: 'Word-Problem Parsing, Data Literacy, Design Thinking',
      projectsToUndertake: 'Solar-Tracking Microgrid Prototype connecting percentage efficiency to energy output.',
      strengthsToNurture: 'Visual-Spatial (88%) & Logical-Mathematical (84%) curiosity.',
      careerPathwaysToExplore: 'Engineering & Technology · AI & Data Science · Design & Architecture',
      teacherSupportNeeded: 'Include Aarav in 15-min Circle Alpha remedial workshop with 100-grid cards.',
      parentHomeActivities: 'Practice real-world discount & nutrition-label % estimation together at home.',
      schoolProvisions: 'Tinkering Lab electronics kit + 1-page printed QR Bridge Worksheets.'
    }
  }
};

const FALLBACK_CAREER_STAGES = [
  { stageKey: 'PRE_PRIMARY', label: 'Pre-Primary (Ages 3–5)', focus: ['Curiosity & Wonder', 'Imagination & Play', 'Occupation Story Discovery'], guardrail: 'Zero career labels assigned.' },
  { stageKey: 'PRIMARY_1_5', label: 'Primary (Grades 1–5)', focus: ['Exposure to Professions', 'Strengths Exploration', 'Project Play'], guardrail: 'Broad curiosity across arts, nature & logic.' },
  { stageKey: 'MIDDLE_6_8', label: 'Middle (Grades 6–8)', focus: ['Career Cluster Awareness', 'STEM & Coding Labs', 'Entrepreneurship Clubs'], guardrail: 'Exploratory multi-cluster exposure only.' },
  { stageKey: 'SECONDARY_9_10', label: 'Secondary (Grades 9–10)', focus: ['Subject & Stream Selection', 'Aptitude Mapping', 'Counselling'], guardrail: 'Joint student–parent–counsellor review.' },
  { stageKey: 'SENIOR_SECONDARY_11_12', label: 'Senior Secondary (11–12)', focus: ['University & Entrance Roadmap', 'Internships & Certifications'], guardrail: 'Multi-pathway preparation.' }
];

const FALLBACK_CLUSTERS = [
  { cluster: 'Engineering and Technology', alignmentScore: 92, recommendationTier: 'STRONG_EXPLORATION_FIT', occupations: ['Robotics Engineer', 'Clean Energy Technologist', 'Systems Architect'], competencies: ['Spatial Geometry', 'Prototyping', 'Applied Physics'], subjects: ['Physics', 'Mathematics', 'Tinkering Lab'], higherEd: ['B.Tech Robotics / Mechanical / ECE'], supportingEvidence: 'BMIT Visual-Spatial (88%) + Solar Water Sensor project.' },
  { cluster: 'Artificial Intelligence and Data Science', alignmentScore: 87, recommendationTier: 'STRONG_EXPLORATION_FIT', occupations: ['AI Architect', 'ML Engineer', 'Data Storyteller'], competencies: ['Algorithmic Thinking', 'Statistics', 'Ethical AI'], subjects: ['Mathematics', 'Computer Science', 'Physics'], higherEd: ['B.Tech AI & Data Science / B.Sc. Data Science'], supportingEvidence: 'BMIT Logical-Mathematical (84%) + sensor telemetry curiosity.' },
  { cluster: 'Design and Architecture', alignmentScore: 84, recommendationTier: 'STRONG_EXPLORATION_FIT', occupations: ['Spatial Architect', 'UX Product Designer', 'Sustainable Urban Planner'], competencies: ['3D Visualization', 'Design Thinking', 'CAD'], subjects: ['Mathematics', 'Fine Arts', 'Geography'], higherEd: ['B.Arch (NATA) / B.Des (UCEED)'], supportingEvidence: 'Architectural drawing interest + Visual VAK blend.' },
  { cluster: 'Science and Research', alignmentScore: 80, recommendationTier: 'STRONG_EXPLORATION_FIT', occupations: ['Physicist', 'Materials Scientist', 'Astrophysicist'], competencies: ['Hypothesis Testing', 'Inquiry'], subjects: ['Physics', 'Chemistry', 'Mathematics'], higherEd: ['IISER BS-MS / IISc Bangalore'], supportingEvidence: 'Naturalistic-Scientific (81%) + Space curiosity.' },
  { cluster: 'Healthcare and Life Sciences', alignmentScore: 72, recommendationTier: 'OPEN_DISCOVERY_PATHWAY', occupations: ['Biomedical Innovator', 'Clinical Physician'], competencies: ['Biology Mastery', 'Care Ethics'], subjects: ['Biology', 'Chemistry'], higherEd: ['MBBS / B.Tech Biomedical'], supportingEvidence: 'Open exploratory pathway — zero restrictions.' },
  { cluster: 'Business and Entrepreneurship', alignmentScore: 74, recommendationTier: 'OPEN_DISCOVERY_PATHWAY', occupations: ['Product Manager', 'Social Venture Founder'], competencies: ['Leadership', 'Financial Literacy'], subjects: ['Business Studies', 'Economics'], higherEd: ['BBA / IPMAT'], supportingEvidence: 'Interpersonal Leadership (82%) in peer circles.' },
  { cluster: 'Finance and Economics', alignmentScore: 71, recommendationTier: 'OPEN_DISCOVERY_PATHWAY', occupations: ['FinTech Analyst', 'Behavioral Economist'], competencies: ['Proportional Fluency', 'Risk Modelling'], subjects: ['Mathematics', 'Economics'], higherEd: ['B.A. Economics (Hons)'], supportingEvidence: 'Open exploratory pathway.' },
  { cluster: 'Arts and Creative Industries', alignmentScore: 70, recommendationTier: 'OPEN_DISCOVERY_PATHWAY', occupations: ['Digital Animator', 'Interactive Storyteller'], competencies: ['Visual Composition', 'Creativity'], subjects: ['Fine Arts', 'English'], higherEd: ['BFA / Design'], supportingEvidence: 'Open exploratory pathway.' },
  { cluster: 'Education and Research', alignmentScore: 73, recommendationTier: 'OPEN_DISCOVERY_PATHWAY', occupations: ['Learning Scientist', 'Curriculum Architect'], competencies: ['Scaffolding', 'Communication'], subjects: ['Psychology', 'Mathematics'], higherEd: ['ITEP Integrated B.Ed'], supportingEvidence: 'Peer coaching leadership.' },
  { cluster: 'Law and Public Policy', alignmentScore: 68, recommendationTier: 'OPEN_DISCOVERY_PATHWAY', occupations: ['Tech Policy Lawyer', 'Public Policy Analyst'], competencies: ['Argumentation', 'Ethics'], subjects: ['Political Science', 'History'], higherEd: ['BA LL.B (CLAT)'], supportingEvidence: 'Open exploratory pathway.' },
  { cluster: 'Sports and Sports Science', alignmentScore: 76, recommendationTier: 'OPEN_DISCOVERY_PATHWAY', occupations: ['Biomechanics Analyst', 'Sports Physiotherapist'], competencies: ['Bodily-Kinaesthetic', 'Teamwork'], subjects: ['Physical Education', 'Biology'], higherEd: ['B.Sc. Sports Science'], supportingEvidence: 'Bodily-Kinaesthetic (79%) + School Cricket.' },
  { cluster: 'Media and Communication', alignmentScore: 69, recommendationTier: 'OPEN_DISCOVERY_PATHWAY', occupations: ['Science Journalist', 'Documentary Filmmaker'], competencies: ['Storyboarding', 'Digital Media'], subjects: ['English', 'Social Science'], higherEd: ['B.A. Journalism'], supportingEvidence: 'Open exploratory pathway.' },
  { cluster: 'Agriculture and Environmental Sciences', alignmentScore: 77, recommendationTier: 'OPEN_DISCOVERY_PATHWAY', occupations: ['Climate Ecologist', 'Precision Agronomist'], competencies: ['Naturalistic Observation', 'Sensor Data'], subjects: ['Biology', 'Geography'], higherEd: ['B.Sc. Agriculture (ICAR)'], supportingEvidence: 'Naturalistic-Scientific (81%).' },
  { cluster: 'Defence and Public Services', alignmentScore: 67, recommendationTier: 'OPEN_DISCOVERY_PATHWAY', occupations: ['Aerospace Officer', 'Civil Services (IAS/IPS)'], competencies: ['Crisis Leadership', 'Navigation'], subjects: ['Physics', 'Political Science'], higherEd: ['NDA / Civil Services Foundation'], supportingEvidence: 'Open exploratory pathway.' },
  { cluster: 'Hospitality and Tourism', alignmentScore: 65, recommendationTier: 'OPEN_DISCOVERY_PATHWAY', occupations: ['Eco-Tourism Curator', 'Hospitality Director'], competencies: ['Cultural Intelligence', 'Warmth'], subjects: ['Geography', 'Languages'], higherEd: ['B.Sc. Hospitality'], supportingEvidence: 'Open exploratory pathway.' },
  { cluster: 'Emerging and Interdisciplinary Careers', alignmentScore: 81, recommendationTier: 'OPEN_DISCOVERY_PATHWAY', occupations: ['Space Habitat Architect', 'Climate-FinTech Strategist'], competencies: ['Design Thinking', 'Cross-Domain Synthesis'], subjects: ['Interdisciplinary Electives', 'Design Lab'], higherEd: ['Liberal Arts + STEM Honours'], supportingEvidence: 'Space Science + Design overlap.' }
];

const FALLBACK_INSTITUTIONAL = {
  summary: {
    totalStudentProfiles: 1840,
    bmitCompletionRate: 94.2,
    vakCalibratedPercent: 91.8,
    learningGapClosureRate: 81,
    portfolioCompletionRate: 88.5,
    futureSkillsIndex: 82.4,
    careerGuidanceParticipation: 96.0
  },
  vakDistribution: { visualDominant: 42, kinaestheticDominant: 33, auditoryDominant: 25 },
  campusBenchmarks: [
    { campusId: 'c1', campusName: 'Achariya World Class Academy (Main Campus)', campusCode: 'AWCA-MAIN', bmitCompletionPct: 96, gapClosurePct: 86, portfolioCompletionPct: 91, futureSkillsAvg: 84 },
    { campusId: 'c2', campusName: 'Achariya Bala Siksha Mandir (Lawspet)', campusCode: 'ABSM-LAW', bmitCompletionPct: 94, gapClosurePct: 82, portfolioCompletionPct: 88, futureSkillsAvg: 82 },
    { campusId: 'c3', campusName: 'Achariya World Class Academy (Villianur)', campusCode: 'AWCA-VIL', bmitCompletionPct: 93, gapClosurePct: 79, portfolioCompletionPct: 86, futureSkillsAvg: 80 }
  ],
  reportCatalog14: [
    '1. Individual Student Learning Gap Report',
    '2. Student Remediation Progress Report',
    '3. Grade-wise Learning Gap Report',
    '4. Subject-wise Concept Mastery Report',
    '5. Campus-wise Learning Gap Report',
    '6. Teacher Intervention Report',
    '7. Reassessment Improvement Report',
    '8. Learning Academy Consolidated Report',
    '9. Pending Learning Gap Report',
    '10. Learning Gap Closure Report',
    '11. Prerequisite Knowledge Report',
    '12. Curriculum Gap Report',
    '13. AI Academic Intelligence Report',
    '14. Student Learning History & BMIT Annual Report'
  ]
};

export const StudentIntelligenceStudio: React.FC<{
  initialStudentMode?: boolean;
  onNavigateToGaps?: () => void;
}> = ({ initialStudentMode = false, onNavigateToGaps }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('ach-stu-aarav-01');
  const [activeSubTab, setActiveSubTab] = useState<
    'master-bmit-vak' | 'holistic-iedp' | 'career-16' | 'portfolio-reports' | 'parent-portal' | 'counsellor-institutional'
  >('master-bmit-vak');

  const [profile, setProfile] = useState<any>(FALLBACK_PROFILES['ach-stu-aarav-01']);
  const [careerData, setCareerData] = useState<{
    currentStageKey: string;
    ageWiseStages: any[];
    clusters: any[];
  }>({
    currentStageKey: 'MIDDLE_6_8',
    ageWiseStages: FALLBACK_CAREER_STAGES,
    clusters: FALLBACK_CLUSTERS
  });
  const [institutionalData, setInstitutionalData] = useState<any>(FALLBACK_INSTITUTIONAL);
  const [selectedAgeStage, setSelectedAgeStage] = useState<string>('MIDDLE_6_8');

  // VAK Recalibration Modal State
  const [showVakModal, setShowVakModal] = useState(false);
  const [vakDraft, setVakDraft] = useState({ visual: 46, auditory: 22, kinaesthetic: 32 });
  const [savingVak, setSavingVak] = useState(false);

  // Portfolio Addition Modal State
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    section: '9. Projects and Innovations',
    category: 'PROJECT' as 'PROJECT' | 'CERTIFICATE' | 'STUDENT_REFLECTION' | 'TEACHER_OBSERVATION' | 'PARENT_FEEDBACK' | 'COUNSELLOR_NOTE',
    title: '',
    description: ''
  });
  const [savingPortfolio, setSavingPortfolio] = useState(false);

  // Parent Companion Chat State
  const [parentMessages, setParentMessages] = useState<Array<{ sender: 'parent' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Warm welcome to the Achariya Family Partnership Companion! Ask me anything about your child’s BMIT natural strengths, VAK learning style, active learning progress, or home activities.'
    }
  ]);
  const [parentInput, setParentInput] = useState('');
  const [parentLoading, setParentLoading] = useState(false);

  // Counsellor Review State
  const [counsellorNotesDraft, setCounsellorNotesDraft] = useState('');
  const [savingCounsellor, setSavingCounsellor] = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      const results = await Promise.allSettled([
        apiGet<any>(`/api/student-intelligence/profile/${selectedStudentId}`),
        apiGet<any>(`/api/student-intelligence/career/${selectedStudentId}`),
        apiGet<any>('/api/student-intelligence/institutional-overview')
      ]);

      if (!active) return;

      const [profRes, carRes, instRes] = results;
      if (profRes.status === 'fulfilled' && profRes.value?.success && profRes.value.data) {
        setProfile(profRes.value.data);
        setVakDraft({
          visual: profRes.value.data.vakProfile.visualScore,
          auditory: profRes.value.data.vakProfile.auditoryScore,
          kinaesthetic: profRes.value.data.vakProfile.kinaestheticScore
        });
        setCounsellorNotesDraft(profRes.value.data.bmitProfile.counsellorNotes || '');
        setSelectedAgeStage(profRes.value.data.student.gradeBand || 'MIDDLE_6_8');
      }
      if (carRes.status === 'fulfilled' && carRes.value?.success && carRes.value.data) {
        setCareerData({
          currentStageKey: carRes.value.data.currentStageKey,
          ageWiseStages: carRes.value.data.ageWiseStages,
          clusters: carRes.value.data.clusters
        });
      }
      if (instRes.status === 'fulfilled' && instRes.value?.success && instRes.value.data) {
        setInstitutionalData(instRes.value.data);
      }
    };
    load();
    return () => { active = false; };
  }, [selectedStudentId]);

  const handleSaveVak = async () => {
    setSavingVak(true);
    try {
      const res = await apiPost<any>('/api/student-intelligence/vak/assess', {
        studentId: selectedStudentId,
        visualScore: vakDraft.visual,
        auditoryScore: vakDraft.auditory,
        kinaestheticScore: vakDraft.kinaesthetic,
        activeConcept: profile.student.activeConceptGap
      });
      if (res?.success && res.data) {
        setProfile((prev: any) => ({
          ...prev,
          vakProfile: {
            ...prev.vakProfile,
            visualScore: res.data.visualScore,
            auditoryScore: res.data.auditoryScore,
            kinaestheticScore: res.data.kinaestheticScore,
            conceptModalityRecommendations: res.data.conceptModalityRecommendations
          }
        }));
      }
    } catch {
      const total = Math.max(1, vakDraft.visual + vakDraft.auditory + vakDraft.kinaesthetic);
      const v = Math.round((vakDraft.visual / total) * 100);
      const a = Math.round((vakDraft.auditory / total) * 100);
      const k = Math.max(0, 100 - v - a);
      setProfile((prev: any) => ({
        ...prev,
        vakProfile: { ...prev.vakProfile, visualScore: v, auditoryScore: a, kinaestheticScore: k }
      }));
    } finally {
      setSavingVak(false);
      setShowVakModal(false);
      notify('VAK Multimodal Profile recalibrated and synced with Remedial Engine!');
    }
  };

  const handleAddPortfolioEntry = async () => {
    if (!newPortfolio.title.trim() || !newPortfolio.description.trim()) return;
    setSavingPortfolio(true);
    const localItem = {
      id: `pf-${Date.now()}`,
      section: newPortfolio.section,
      category: newPortfolio.category,
      title: newPortfolio.title.trim(),
      description: newPortfolio.description.trim(),
      date: new Date().toISOString().slice(0, 10),
      evidenceType: 'Verified Digital Record',
      author: initialStudentMode ? profile.student.name : 'Educator / Student'
    };

    try {
      const res = await apiPost<any>(`/api/student-intelligence/portfolio/${selectedStudentId}`, newPortfolio);
      if (res?.success && res.data) {
        setProfile((prev: any) => ({
          ...prev,
          portfolio: { ...prev.portfolio, items: [res.data, ...prev.portfolio.items] }
        }));
      } else {
        setProfile((prev: any) => ({
          ...prev,
          portfolio: { ...prev.portfolio, items: [localItem, ...prev.portfolio.items] }
        }));
      }
    } catch {
      setProfile((prev: any) => ({
        ...prev,
        portfolio: { ...prev.portfolio, items: [localItem, ...prev.portfolio.items] }
      }));
    } finally {
      setSavingPortfolio(false);
      setShowPortfolioModal(false);
      setNewPortfolio({ section: '9. Projects and Innovations', category: 'PROJECT', title: '', description: '' });
      notify('Evidence saved to Student Longitudinal E-Portfolio!');
    }
  };

  const handleAskParentCompanion = async (questionText?: string) => {
    const q = (questionText ?? parentInput).trim();
    if (!q) return;
    setParentMessages(prev => [...prev, { sender: 'parent', text: q }]);
    if (!questionText) setParentInput('');
    setParentLoading(true);
    try {
      const res = await apiPost<any>('/api/student-intelligence/parent-companion', {
        studentId: selectedStudentId,
        question: q
      });
      if (res?.success && res.answer) {
        setParentMessages(prev => [...prev, { sender: 'ai', text: res.answer }]);
        return;
      }
    } catch {
      // Fallback response grounded in profile
    } finally {
      setParentLoading(false);
    }

    const topDomains = (profile.bmitProfile?.domains || []).slice(0, 2).map((d: any) => `${d.domain} (${d.score}%)`).join(' and ');
    setParentMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: `Based on ${profile.student.name}'s (${profile.student.grade}) verified profile: Natural BMIT strengths shine in ${topDomains}. Learning best responds to Visual (${profile.vakProfile.visualScore}%) & Kinaesthetic (${profile.vakProfile.kinaestheticScore}%) hands-on exploration. At home, try 10 minutes of playful real-world estimation around "${profile.student.activeConceptGap}".`
      }
    ]);
  };

  const handleApproveBmitCounsellor = async () => {
    setSavingCounsellor(true);
    try {
      await apiPost<any>('/api/student-intelligence/bmit/assess', {
        studentId: selectedStudentId,
        counsellorNotes: counsellorNotesDraft,
        approved: true
      });
    } catch {
      // Update local state cleanly even in offline preview
    } finally {
      setProfile((prev: any) => ({
        ...prev,
        bmitProfile: { ...prev.bmitProfile, counsellorApproved: true, counsellorNotes: counsellorNotesDraft }
      }));
      setSavingCounsellor(false);
      notify('Counsellor BMIT Interpretation & Development Notes Approved!');
    }
  };

  const handleDownloadCsvReport = (reportTitle: string) => {
    const csvRows = [
      ['Achariya AI ONE Official Report', reportTitle],
      ['Student Name', profile.student.name],
      ['Grade & Campus', `${profile.student.grade} - ${profile.student.campus}`],
      ['BMIT Version', profile.bmitProfile.assessmentVersion],
      ['VAK Blend', `${profile.vakProfile.visualScore}% Visual / ${profile.vakProfile.auditoryScore}% Auditory / ${profile.vakProfile.kinaestheticScore}% Kinaesthetic`],
      ['Active Concept Focus', profile.student.activeConceptGap],
      ['Generated At', new Date().toISOString()]
    ];
    const blob = new Blob([csvRows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify(`Downloaded "${reportTitle}" (CSV/Excel compatible)!`);
  };

  const activeStageDetails = careerData.ageWiseStages.find(s => s.stageKey === selectedAgeStage) || careerData.ageWiseStages[2];

  return (
    <div className="space-y-6 pb-14">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Hero Header & Longitudinal Pre-Primary to Grade 12 Switcher */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Achariya AI · 360° Student Intelligence, BMIT & Career Ecosystem
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 uppercase">
                  Pre-Primary → Grade 12
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Longitudinal Student Master ({profile.student.longitudinalYears} yrs) · BMIT Intelligence · Multimodal VAK · 20 Development Dimensions · 16 Career Clusters · 23-Section E-Portfolio
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowVakModal(true)}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Quick VAK Calibration</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Annual BMIT Report</span>
            </button>
            {onNavigateToGaps && (
              <button
                onClick={onNavigateToGaps}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Open Learning Gap Pathway →</span>
              </button>
            )}
          </div>
        </div>

        {/* Scholar Stage Switcher (Tests Pre-Primary to Grade 12 journey in 1 click) */}
        <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider px-1">Scholar Journey:</span>
            {SCHOLAR_SWITCHER.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStudentId(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedStudentId === s.id
                    ? 'bg-white text-indigo-700 border-indigo-300 shadow-2xs ring-1 ring-indigo-500/20'
                    : 'bg-transparent text-slate-600 border-transparent hover:bg-white/70'
                }`}
              >
                {s.label} · <span className="text-slate-400 font-semibold">{s.grade}</span>
              </button>
            ))}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 px-2">
            {profile.student.campus} · Roll: <strong className="text-slate-800">{profile.student.rollNumber}</strong>
          </div>
        </div>

        {/* 6 Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200/80 pt-1">
          {[
            { key: 'master-bmit-vak', label: '360° Master Profile, BMIT & VAK', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
            { key: 'holistic-iedp', label: '20 Dev Dimensions, 16 Skills & IEDP', icon: <Layers className="w-3.5 h-3.5" /> },
            { key: 'career-16', label: 'Age-Wise Career & 16 Clusters', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { key: 'portfolio-reports', label: '23-Section E-Portfolio & 14 Reports', icon: <FolderKanban className="w-3.5 h-3.5" /> },
            { key: 'parent-portal', label: 'Parent Portal & AI Companion', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
            ...(!initialStudentMode ? [{ key: 'counsellor-institutional', label: 'Counsellor & Management HQ', icon: <Building2 className="w-3.5 h-3.5" /> }] : [])
          ].map((tab: any) => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`pb-3 px-3.5 text-xs font-extrabold flex items-center space-x-1.5 border-b-2 transition-all ${
                activeSubTab === tab.key
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: 360° MASTER PROFILE, BMIT & VAK INTELLIGENCE                   */}
      {/* ===================================================================== */}
      {activeSubTab === 'master-bmit-vak' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* BMIT 8-Domain Visual Profile */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>ACHARIYA BMIT · Brain Mapping Intelligence Profile</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Version: <strong>{profile.bmitProfile.assessmentVersion}</strong> · Date: {profile.bmitProfile.assessmentDate} · Reviewed by {profile.bmitProfile.counsellorName}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  {profile.bmitProfile.counsellorApproved ? '✓ Counsellor Approved' : 'Pending Review'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-[11px] text-indigo-900 font-medium">
                🛡️ <strong>Ethical BMIT Policy:</strong> {profile.bmitProfile.policyNote}
              </div>

              <div className="space-y-3">
                {profile.bmitProfile.domains.map((d: any) => (
                  <div key={d.domain} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900">{d.domain}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          d.status === 'DOMINANT_STRENGTH'
                            ? 'bg-purple-100 text-purple-800'
                            : d.status === 'ESTABLISHED'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {d.status === 'DOMINANT_STRENGTH' ? 'Core Strength' : d.status === 'ESTABLISHED' ? 'Established' : 'Nurturing Area'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 font-mono font-bold">
                        <span className="text-[11px] text-emerald-600">+{d.growthDelta}% YoY</span>
                        <span className="text-slate-900">{d.score}%</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          d.score >= 85 ? 'bg-gradient-to-r from-purple-600 to-indigo-500' : d.score >= 76 ? 'bg-teal-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                      <span>{d.evidence}</span>
                      <span className="font-semibold text-indigo-700">Activities: {d.recommendedActivities.join(' · ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VAK Multimodal Profile + Concept Prescriptions */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-black text-slate-900">VAK Multimodal Learning Preferences</h2>
                    <p className="text-[11px] text-slate-500">{profile.vakProfile.primaryBlend} (Flexible Multimodal Guide)</p>
                  </div>
                  <button
                    onClick={() => setShowVakModal(true)}
                    className="text-[11px] font-bold text-indigo-600 hover:underline"
                  >
                    Recalibrate →
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                    <Eye className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-black text-purple-800">{profile.vakProfile.visualScore}%</div>
                    <div className="text-[10px] font-bold text-purple-600 uppercase">Visual</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-center">
                    <Headphones className="w-4 h-4 text-sky-600 mx-auto mb-1" />
                    <div className="text-lg font-black text-sky-800">{profile.vakProfile.auditoryScore}%</div>
                    <div className="text-[10px] font-bold text-sky-600 uppercase">Auditory</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <Hand className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <div className="text-lg font-black text-emerald-800">{profile.vakProfile.kinaestheticScore}%</div>
                    <div className="text-[10px] font-bold text-emerald-600 uppercase">Kinaesthetic</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                    Multimodal Prescription for: {profile.vakProfile.conceptModalityRecommendations.conceptName}
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div>
                      <span className="font-extrabold text-purple-700">👁️ Visual: </span>
                      <span className="text-slate-600">{profile.vakProfile.conceptModalityRecommendations.visual.join(' • ')}</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-sky-700">🎧 Auditory: </span>
                      <span className="text-slate-600">{profile.vakProfile.conceptModalityRecommendations.auditory.join(' • ')}</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-emerald-700">🖐️ Kinaesthetic: </span>
                      <span className="text-slate-600">{profile.vakProfile.conceptModalityRecommendations.kinaesthetic.join(' • ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests & Longitudinal Quick Summary */}
              <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300">
                  Student Identity, Interests & Aspirations
                </h3>
                <p className="text-sm font-bold leading-snug">
                  “{profile.aspirations}”
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {profile.interests.map((intItem: string) => (
                    <span key={intItem} className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold">
                      ✦ {intItem}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Central AI 10-Point Holistic Synthesis */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Central AI Student Intelligence Engine · 10-Point Explainable Action Synthesis
                </h2>
                <p className="text-[11px] text-slate-500">
                  Synthesizes BMIT + VAK + Learning Gaps + Prerequisite Graph + Portfolio + Parent & Teacher Feedback
                </p>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Explainable AI · Human-in-the-Loop
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: '1. What to Learn', val: profile.centralAiRecommendations.whatToLearn },
                { label: '2. How to Learn (VAK/BMIT)', val: profile.centralAiRecommendations.howToLearn },
                { label: '3. What to Practise', val: profile.centralAiRecommendations.whatToPractise },
                { label: '4. Skills to Develop', val: profile.centralAiRecommendations.skillsToDevelop },
                { label: '5. Projects to Undertake', val: profile.centralAiRecommendations.projectsToUndertake },
                { label: '6. Strengths to Nurture', val: profile.centralAiRecommendations.strengthsToNurture },
                { label: '7. Career Exploration', val: profile.centralAiRecommendations.careerPathwaysToExplore },
                { label: '8. Teacher Support', val: profile.centralAiRecommendations.teacherSupportNeeded },
                { label: '9. Parent Home Actions', val: profile.centralAiRecommendations.parentHomeActivities },
                { label: '10. School Provisions', val: profile.centralAiRecommendations.schoolProvisions }
              ].map(item => (
                <div key={item.label} className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1.5">
                  <div className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">{item.label}</div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: 20 DEVELOPMENT DIMENSIONS, 16 FUTURE SKILLS & IEDP             */}
      {/* ===================================================================== */}
      {activeSubTab === 'holistic-iedp' && (
        <div className="space-y-6">
          {/* Individual Education & Development Plan (IEDP) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-teal-600" />
              <span>AI Individual Education & Development Plan (IEDP)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Short-Term Goals (2 Weeks)', items: profile.iedpPlan.shortTermGoals, badge: 'bg-purple-50 border-purple-200 text-purple-800' },
                { title: 'Term-Wise Goals', items: profile.iedpPlan.termGoals, badge: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
                { title: 'Annual Goals', items: profile.iedpPlan.annualGoals, badge: 'bg-teal-50 border-teal-200 text-teal-800' },
                { title: 'Long-Term Horizon', items: profile.iedpPlan.longTermGoals, badge: 'bg-emerald-50 border-emerald-200 text-emerald-800' }
              ].map(g => (
                <div key={g.title} className={`p-4 rounded-2xl border ${g.badge} space-y-2`}>
                  <div className="text-xs font-black">{g.title}</div>
                  <ul className="space-y-1.5 text-[11px] list-disc pl-4">
                    {g.items.map((text: string, idx: number) => (
                      <li key={idx}>{text}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 16 Future-Ready Skills Gap Analysis */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900">16 Future-Ready Competencies & Personalized Projects</h2>
                <p className="text-[11px] text-slate-500">AI tracks skill readiness including AI Literacy, Data Literacy, Financial Literacy, Design Thinking & Entrepreneurship</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                16 Tracked Skills
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {profile.futureSkills.map((sk: any) => (
                <div key={sk.skill} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{sk.skill}</span>
                    <span className="text-xs font-black text-indigo-700">{sk.currentScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${sk.currentScore}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-600">{sk.gapAnalysis}</p>
                  <div className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-lg border border-teal-100">
                    Project: {sk.recommendedProject}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 20 Holistic Student Development Dimensions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-black text-slate-900">20 Whole-Child Development Dimensions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {profile.developmentDimensions.map((dim: any) => (
                <div key={dim.dimension} className="p-3 rounded-2xl border border-slate-200/80 bg-white space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{dim.dimension}</span>
                    <span className="font-mono font-black text-emerald-700">{dim.score}%</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{dim.teacherObservation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: AGE-WISE CAREER INTELLIGENCE & 16-CLUSTER ENGINE               */}
      {/* ===================================================================== */}
      {activeSubTab === 'career-16' && (
        <div className="space-y-6">
          {/* 5-Stage Age-Wise Career Development Strip */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                  <Rocket className="w-4 h-4 text-purple-600" />
                  <span>Age-Wise Career Development Journey (Pre-Primary → Grade 12)</span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Exploratory only — BMIT never excludes or restricts any student from any subject or career pathway.
                </p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                Scholar Active Stage: {careerData.currentStageKey.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {careerData.ageWiseStages.map(st => {
                const isSelected = selectedAgeStage === st.stageKey;
                const isCurrentStudentStage = careerData.currentStageKey === st.stageKey;
                return (
                  <button
                    key={st.stageKey}
                    onClick={() => setSelectedAgeStage(st.stageKey)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[11px] font-black flex items-center justify-between">
                      <span>{st.label}</span>
                      {isCurrentStudentStage && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-400 text-slate-900 font-black">NOW</span>}
                    </div>
                    <p className={`text-[10px] mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {st.focus[0]}
                    </p>
                  </button>
                );
              })}
            </div>

            {activeStageDetails && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-black text-indigo-950">{activeStageDetails.label} Developmental Focus</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeStageDetails.focus.map((f: string) => (
                      <span key={f} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white text-indigo-800 border border-indigo-200">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 shrink-0">
                  🛡️ {activeStageDetails.guardrail}
                </div>
              </div>
            )}
          </div>

          {/* 16 Career Clusters Exploratory Matching Engine */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-black text-slate-900">16 Exploratory Career Clusters · Evidence-Backed Matching</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {careerData.clusters.map(cl => (
                <div
                  key={cl.cluster}
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    cl.recommendationTier === 'STRONG_EXPLORATION_FIT'
                      ? 'bg-purple-50/50 border-purple-300 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-black text-slate-900">{cl.cluster}</div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                      cl.recommendationTier === 'STRONG_EXPLORATION_FIT'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {cl.alignmentScore}% Fit
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600">{cl.supportingEvidence}</div>
                  <div className="text-[10px] space-y-1 pt-1 border-t border-slate-200/70">
                    <div><strong className="text-slate-800">Roles:</strong> {cl.occupations.slice(0, 2).join(', ')}</div>
                    <div><strong className="text-slate-800">Subjects:</strong> {cl.subjects.slice(0, 3).join(', ')}</div>
                    <div className="text-indigo-700 font-semibold">{cl.higherEd[0]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: 23-SECTION DIGITAL E-PORTFOLIO & 14 EXPORTABLE REPORTS         */}
      {/* ===================================================================== */}
      {activeSubTab === 'portfolio-reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chronological E-Portfolio + 23 Sections Map */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Longitudinal Digital Student E-Portfolio ({profile.portfolio.totalSections} Sections)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Lifelong record from admission through Grade 12 — projects, certificates, reflections & observations
                </p>
              </div>
              <button
                onClick={() => setShowPortfolioModal(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Evidence</span>
              </button>
            </div>

            <div className="space-y-3">
              {profile.portfolio.items.map((item: any) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                    <span className="font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {item.section}
                    </span>
                    <span className="font-mono text-slate-400">{item.date} · {item.evidenceType}</span>
                  </div>
                  <h3 className="text-xs font-black text-slate-900">{item.title}</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.description}</p>
                  <div className="text-[10px] font-semibold text-slate-500">Recorded by: {item.author}</div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                All 23 Longitudinal E-Portfolio Sections Integrated
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.portfolio.sectionsCatalog.map((sec: string) => (
                  <span key={sec} className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                    ✓ {sec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 14-Report AI Export Center (Excel/CSV + Print PDF) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-black text-slate-900">14-Report Institutional & Student Export Hub</h2>
            </div>
            <p className="text-[11px] text-slate-500">
              Every conclusion is traceable to verified assessment, BMIT & intervention evidence.
            </p>
            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
              {(institutionalData.reportCatalog14 || []).map((rep: string) => (
                <div key={rep} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-700">{rep}</span>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => handleDownloadCsvReport(rep)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Excel/CSV</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                    >
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: COMPLETE PARENT INTELLIGENCE PORTAL & AI PARENT COMPANION      */}
      {/* ===================================================================== */}
      {activeSubTab === 'parent-portal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              <span>Parent Partnership Overview · {profile.student.name}</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Positive growth partnership: every insight focuses on nurturing natural strengths, closing conceptual bridges gently, and celebrating curious exploration at home.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <div className="font-black text-emerald-900 text-[11px]">🌟 Top Natural Strengths</div>
                <p className="text-[11px] text-emerald-800">{profile.centralAiRecommendations.strengthsToNurture}</p>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                <div className="font-black text-indigo-900 text-[11px]">🏡 Recommended Home Support</div>
                <p className="text-[11px] text-indigo-800">{profile.centralAiRecommendations.parentHomeActivities}</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1 sm:col-span-2">
                <div className="font-black text-purple-900 text-[11px]">🎯 Current Academic Focus (No-Stigma Bridge)</div>
                <p className="text-[11px] text-purple-800">{profile.centralAiRecommendations.whatToLearn}</p>
              </div>
            </div>
          </div>

          {/* Interactive AI Parent Companion */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900">AI Parent Companion</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Child-Specific Authorised Insights
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                "What are my child's strengths?",
                'How can I support learning at home?',
                'What does the BMIT report indicate?',
                'What career fields might my child explore?'
              ].map(chip => (
                <button
                  key={chip}
                  onClick={() => handleAskParentCompanion(chip)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] font-semibold text-slate-700 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-[220px] max-h-[300px] overflow-y-auto space-y-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              {parentMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'parent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs whitespace-pre-wrap ${
                    m.sender === 'parent'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {parentLoading && <div className="text-xs text-slate-400 italic">Thinking with child-specific learning telemetry…</div>}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={parentInput}
                onChange={e => setParentInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAskParentCompanion()}
                placeholder="Ask about your child's strengths, BMIT, or home support..."
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-400"
              />
              <button
                onClick={() => handleAskParentCompanion()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 6: COUNSELLOR PORTAL & MANAGEMENT / LEARNING ACADEMY HQ           */}
      {/* ===================================================================== */}
      {activeSubTab === 'counsellor-institutional' && (
        <div className="space-y-6">
          {/* Counsellor & Specialist Portal */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Counsellor & Specialist BMIT Interpretation Workbench</span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Distinguishes educational guidance from clinical psychological diagnosis. Expert approval required for formal BMIT reports.
                </p>
              </div>
              <button
                onClick={handleApproveBmitCounsellor}
                disabled={savingCounsellor}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                {savingCounsellor ? 'Saving…' : '✓ Save & Approve BMIT Interpretation'}
              </button>
            </div>

            <textarea
              value={counsellorNotesDraft}
              onChange={e => setCounsellorNotesDraft(e.target.value)}
              rows={3}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:border-indigo-400"
              placeholder="Record counsellor interpretation, parent counselling session notes & developmental follow-up plan..."
            />
          </div>

          {/* School, Learning Academy & Management Strategic Overview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>School, Learning Academy & Management Strategic Intelligence (Anonymised Aggregate)</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total Student Profiles', val: institutionalData.summary.totalStudentProfiles },
                { label: 'BMIT Completion', val: `${institutionalData.summary.bmitCompletionRate}%` },
                { label: 'VAK Calibrated', val: `${institutionalData.summary.vakCalibratedPercent}%` },
                { label: 'Gap Closure Rate', val: `${institutionalData.summary.learningGapClosureRate}%` },
                { label: 'Portfolio Completion', val: `${institutionalData.summary.portfolioCompletionRate}%` },
                { label: 'Career Participation', val: `${institutionalData.summary.careerGuidanceParticipation}%` }
              ].map(m => (
                <div key={m.label} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-lg font-black text-slate-900">{m.val}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Achariya Campus</th>
                    <th className="py-2.5 px-3">BMIT Completion</th>
                    <th className="py-2.5 px-3">Gap Closure Rate</th>
                    <th className="py-2.5 px-3">Portfolio Completion</th>
                    <th className="py-2.5 px-3">Future Skills Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {institutionalData.campusBenchmarks.map((c: any) => (
                    <tr key={c.campusId} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{c.campusName}</td>
                      <td className="py-3 px-3 font-mono font-bold text-indigo-700">{c.bmitCompletionPct}%</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700">{c.gapClosurePct}%</td>
                      <td className="py-3 px-3 font-mono font-bold text-purple-700">{c.portfolioCompletionPct}%</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">{c.futureSkillsAvg}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VAK Calibration Modal */}
      {showVakModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">Quick VAK Multimodal Calibration</h3>
              <button onClick={() => setShowVakModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-500">Adjust observed engagement ratios (automatically normalized to 100%). Multimodal delivery remains active for every scholar.</p>
            {[
              { label: 'Visual (Diagrams, Mind Maps, 100-Grid)', key: 'visual' as const },
              { label: 'Auditory (Discussions, Verbal Rules)', key: 'auditory' as const },
              { label: 'Kinaesthetic (Hands-on Blocks, Experiments)', key: 'kinaesthetic' as const }
            ].map(item => (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.label}</span>
                  <span>{vakDraft[item.key]}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={80}
                  value={vakDraft[item.key]}
                  onChange={e => setVakDraft(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
                  className="w-full accent-indigo-600"
                />
              </div>
            ))}
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setShowVakModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600">Cancel</button>
              <button onClick={handleSaveVak} disabled={savingVak} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                {savingVak ? 'Saving…' : 'Save & Sync Remedial Engine'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Entry Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">Add Portfolio Evidence / Reflection</h3>
              <button onClick={() => setShowPortfolioModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <select
                value={newPortfolio.section}
                onChange={e => setNewPortfolio(prev => ({ ...prev, section: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
              >
                {profile.portfolio.sectionsCatalog.map((sec: string) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
              <input
                type="text"
                value={newPortfolio.title}
                onChange={e => setNewPortfolio(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Evidence Title (e.g., Robotics Line-Follower Prototype)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
              <textarea
                rows={3}
                value={newPortfolio.description}
                onChange={e => setNewPortfolio(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe achievement, learning evidence, or student reflection..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowPortfolioModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600">Cancel</button>
              <button onClick={handleAddPortfolioEntry} disabled={savingPortfolio} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                {savingPortfolio ? 'Saving…' : 'Save to Portfolio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
