export interface User {
  id: string;
  userKey: string;
  email: string;
  fullName: string;
  roleKey: string;
  roleName: string;
  scope: string;
  campus?: {
    id: string;
    name: string;
    schoolKey: string;
    affiliation: string;
  };
  license?: {
    basic: boolean;
    questionBank: boolean;
    hpcLicense: boolean;
    autoGrade: boolean;
    primeLicense: boolean;
    aiTools: boolean;
    score: boolean;
    compass: boolean;
    voice: boolean;
  };
}

export interface Lesson {
  id: string;
  lessonKey?: string;
  title: string;
  lessonNumber: number;
  description?: string;
  learningOutcomes?: string[];
  periodAllocation?: number;
  pages?: Array<{
    id: string;
    pageNumber: number;
    title?: string;
    contentHtml?: string;
    vectorLayout?: any;
  }>;
}

export interface Book {
  id: string;
  bookKey: string;
  title: string;
  publisher: string;
  description?: string;
  coverImage?: string;
  class: { id: string; name: string };
  subject: { id: string; name: string; code: string };
  lessons?: Lesson[];
  _count?: { lessons: number };
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  class: { id: string; name: string };
  section: { id: string; name: string };
  subject: { id: string; name: string };
  teacher: { id: string; fullName: string };
  _count?: { submissions: number };
}

export interface Quiz {
  id: string;
  title: string;
  quizType: string;
  timeLimitMinutes: number;
  class: { id: string; name: string };
  subject: { id: string; name: string };
  _count?: { questions: number; submissions: number };
}

export interface Student {
  id: string;
  userKey: string;
  fullName: string;
  email: string;
  enrollments: Array<{
    rollNumber: string;
    class: { id: string; name: string };
    section: { id: string; name: string };
  }>;
  studentProfile?: {
    bloodGroup: string;
    heightCm: number;
    weightKg: number;
    parentName: string;
    parentPhone: string;
  };
}

export interface LsrActivity {
  id: string;
  activityType: string;
  template_type: string;
  format: string;
  title: string;
  passage?: string;
  audio_url?: string;
  options?: string[];
}

