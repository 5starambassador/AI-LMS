# 10. DEVELOPMENT ROADMAP & FEATURE IMPLEMENTATION TRACKER

## 1. Executive Engineering Roadmap

The target implementation is organized into 8 strategic phases to deliver the unified **Three-Panel Platform Architecture** (Admin, Staff, Student) with zero disruption and enterprise-grade reliability.

```
+-----------------------------------------------------------------------------------------+
|                                    PROJECT ROADMAP                                      |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  [ Phase 0: Complete Forensic Audit & Reverse Engineering ] ............ [COMPLETED]   |
|    - 236 routes, 381 APIs, 30+ visual screenshots, 13 specification documents           |
|                                                                                         |
|  [ Phase 1: Core Architecture, Database & Domain Gating ] .............. [COMPLETED]   |
|    - 40 Prisma models, SQLite dev.db / Postgres, JWT auth, domain partitioning          |
|    - 7 roles, full Achariya campus seed, 6/6 integration tests passing (100%)          |
|                                                                                         |
|  [ Phase 2: Core Academic, Assessment & Operations LMS ] ............... [COMPLETED]   |
|    - Books, Flipbooks, QR codes, Homework, Quizzes, Attendance, Directory, Banners     |
|    - 15/15 integration tests passing (100%)                                             |
|                                                                                         |
|  [ Phase 3: AI Assessment & Specialized Satellite Pipelines ] .......... [COMPLETED]   |
|    - SCORE AI Exam Builder, Batch PDF QR Anchors, Vision OCR Grader, IRT Psychometrics |
|    - HPC / Compass 5-Domain Radar Polygon Vector & AI Narrative Report Card             |
|    - LSR Speech AI, Oral Reading Fluency (WCPM), Phoneme Alignment, R2 Storage          |
|    - 15/15 integration tests passing (100%)                                             |
|                                                                                         |
|  [ Phase 4: Modern Frontend SPA & UI Assembly ] ........................ [IN PROGRESS] |
|    - React 19 + TypeScript + Vite + Tailwind CSS + Shadcn UI                            |
|    - Unified Dashboard for Staff, Admin, and Student Voice Web Portal                  |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Phase-by-Phase Deliverables & Milestones

### Phase 1: Core Foundation & Centralized Data Architecture (Weeks 1–2)
- **Goal**: Establish the multi-tenant relational database and centralized API framework.
- **Deliverables**:
  1. Complete PostgreSQL schema with primary keys, indexes, foreign keys, and multi-tenant constraints (`pk_school_key`).
  2. Database migration scripts (Prisma / Drizzle ORM).
  3. Cloud Object Storage driver (AWS S3 / Cloudflare R2) with presigned upload/download URLs.
  4. Unified REST API Gateway with structured response formatting and global exception handling.

### Phase 2: Centralized Authentication, RBAC & Access Permission Engine (Weeks 3–4)
- **Goal**: Implement identity, multi-campus role hierarchy, granular permission matrix, and dynamic feature flag entitlement.
- **Deliverables**:
  1. Secure authentication endpoints (`/login`, `/logout`, `/sso-login`, `/forgot-password`).
  2. JWT token generation with HS256 / RS256 signature, refresh tokens, and rate-limiting.
  3. Granular Access Permission Engine: 10 permission domains (`tenant`, `security`, `academic`, `user`, `content`, `homework`, `exam`, `score`, `portfolio`, `ai`).
  4. Custom Role Builder UI & Permission Set allocator for Super Admin (`/admin/access-permissions`).
  5. Dynamic Feature Flag Middleware enforcing `book_visibility`, `homework_visibility`, `quiz_visibility`, `portfolio_visibility`, `ai_tools_visibility`.
  6. Backend tenant isolation filters guaranteeing cross-campus and cross-class data security (`pk_school_key`, `fk_class_key`).

### Phase 3: Administrative Panel Engineering (Weeks 5–6)
- **Goal**: Deliver institutional controls for School Administrators and Super Administrators.
- **Deliverables**:
  1. School Admin Dashboard with live KPI counters (`/schooladmin/home`).
  2. Admin Tools Console (`/schooladmin/admintools`):
     - Class & Section creation and teacher assignment (`/class`).
     - Teacher roster management, allocation, and bulk import (`/teacher`).
     - Student directory, Excel/CSV bulk onboarding, roll number sync (`/student`).
     - Academic batch migration & archive/restore (`/student/restore`).
     - Subject catalog and class-to-subject multi-mapping (`/subjects`).
  3. Super Admin School Provisioning & global access control matrix (`/admin/schools`, `/admin/access-control`).

### Phase 4: Staff / Teacher Panel Engineering (Weeks 7–8)
- **Goal**: Build classroom teaching, content delivery, and evaluation workflows.
- **Deliverables**:
  1. Teacher Home dashboard with video highlights and announcements (`/staff/home`).
  2. Curriculum Books catalog with grade filtering (`/staff/books`).
  3. Interactive S3 dual-page flipbook reader integration (`/staff/books/lessons/flip/:id1/:id2`).
  4. HomeFun Homework manager: Create, assign, review submissions (`/staff/homeworks`).
  5. Quiz and assessment engine: MCQ, Fill-in-Blanks, Match Pairs (`/staff/quiz`).
  6. Buddy Interactive Worksheet drag-and-drop creator (`/staff/worksheets`).
  7. Student class roster and Holistic Progress Card (HPC) grading (`/staff/studentlist`).

### Phase 5: Student / Learner Panel Engineering (Weeks 9–10)
- **Goal**: Deliver an engaging, distraction-free learning experience for students and parents.
- **Deliverables**:
  1. Student Home dashboard with daily tasks and homework alerts (`/student/home`).
  2. "My Books" digital textbook reader with bookmarking and audio sync (`/student/books`).
  3. Homework submission runner: Rich text + image attachments (`/student/homeworks`).
  4. Online Test Player with countdown timer and instant scoring (`/student/quiz`).
  5. Interactive drag-and-drop worksheet exercise canvas (`/student/worksheet`).
  6. Student Portfolio with interactive 5-axis competency radar chart (`/student/Portfolio`).
  7. Digital Paywall and book activation modal (`/student/access-denied`).

### Phase 6: Cross-Panel Integrations & Advanced Capabilities (Weeks 11–12)
- **Goal**: Wire cross-panel real-time communications and AI microservices.
- **Deliverables**:
  1. Real-time classroom broadcast chat channel (`/staff/chat` <-> `/student/chat`).
  2. AI Lesson Plan Creator and AI Quiz Generator (`/staff/aitools`).
  3. AI Cam OCR document scanner for automated student worksheet parsing (`/staff/ai-cam`).
  4. Physical-to-Digital book activation via mobile QR scanning (`/studentqrregister/student`).
  5. Institutional analytics reports for homework and exams (`/schooladmin/homeworks`, `/schooladmin/quiz`).

### Phase 7: Verification, Security Hardening & Rollout (Weeks 13–14)
- **Goal**: Validate end-to-end reliability, data protection, and platform scalability.
- **Deliverables**:
  1. Full automated test suite (Unit, Integration, and E2E Playwright tests).
  2. Penetration test and security audit (OWASP Top 10, RBAC boundary verification).
  3. Load and stress testing (10,000 concurrent student test submissions).
  4. Production staging deployment and administrator user training.

---

## 3. Comprehensive Feature Implementation Checklist

| Feature ID | Panel | Module Name | Scope & Capabilities | Current Status | Target Milestone |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AUTH-01** | Shared | User Authentication | Username/password login, JWT tokens, remember me | **Documented** | Phase 2 |
| **AUTH-02** | Shared | SSO & External Auth | Token-based redirect and SSO authentication | **Documented** | Phase 2 |
| **AUTH-03** | Shared | Password Recovery | Password reset workflow with email token verification | **Documented** | Phase 2 |
| **RBAC-01** | Shared | Role Permissions | Hierarchical roles (Super, School Admin, Teacher, Student) | **Documented** | Phase 2 |
| **RBAC-02** | Shared | Feature Flag Engine | Dynamic toggles (`book`, `homework`, `quiz`, `portfolio`, `ai`) | **Documented** | Phase 2 |
| **ADM-01** | Admin | School Executive Home | Real-time KPIs, teacher/student counts, completion rates | **Documented** | Phase 3 |
| **ADM-02** | Admin | Class & Section Setup | Create class, section capacity, assign class teacher | **Documented** | Phase 3 |
| **ADM-03** | Admin | Teacher Management | Teacher roster, profile, class/subject allocations | **Documented** | Phase 3 |
| **ADM-04** | Admin | Teacher Bulk Provision | CSV/Excel template download and batch teacher import | **Documented** | Phase 3 |
| **ADM-05** | Admin | Student Enrollment | Student registration, roll numbers, parent contact info | **Documented** | Phase 3 |
| **ADM-06** | Admin | Student Bulk Onboard | CSV student importer with roll number conflict detection | **Documented** | Phase 3 |
| **ADM-07** | Admin | Batch Migration | Academic year promotion, cohort advancement, archival | **Documented** | Phase 3 |
| **ADM-08** | Admin | Subject Mapping | Subject catalog creation and class mapping | **Documented** | Phase 3 |
| **ADM-09** | Admin | Curriculum Allocation | Assign digital books and series to grades/classes | **Documented** | Phase 3 |
| **ADM-10** | Admin | Homework Compliance | School-wide homework monitoring and overdue reports | **Documented** | Phase 3 |
| **ADM-11** | Admin | Exam Analytics | Institutional score distribution and item difficulty | **Documented** | Phase 3 |
| **ADM-12** | Admin | Super: School Directory| Multi-tenant school creation, domain setup, licensing | **Documented** | Phase 3 |
| **ADM-13** | Admin | Super: Access Control | Platform-wide permission and feature toggle matrix | **Documented** | Phase 3 |
| **ADM-14** | Admin | Super: QR Codes | Physical textbook QR code generation and tracking | **Documented** | Phase 3 |
| **ADM-15** | Admin | Super: CMS & Banners | Global video gallery, promotional banners, announcements | **Documented** | Phase 3 |
| **STF-01** | Staff | Staff Home | Video gallery, webinars, Chrysalis Day highlights | **Documented** | Phase 4 |
| **STF-02** | Staff | Curriculum Books | Book catalog by grade, recents, chapter outline | **Documented** | Phase 4 |
| **STF-03** | Staff | Flipbook Reader | Interactive dual-page reader with projection mode | **Documented** | Phase 4 |
| **STF-04** | Staff | Page Builder | Custom lesson authoring and multimedia embedding | **Documented** | Phase 4 |
| **STF-05** | Staff | Resources Hub | Digital teaching materials, HPC guides, external tools | **Documented** | Phase 4 |
| **STF-06** | Staff | Homework (HomeFun) | Create homework, due dates, attachments, grading | **Documented** | Phase 4 |
| **STF-07** | Staff | Assessment Authoring | Quiz creator: MCQ, Fill in blanks, Match pairs | **Documented** | Phase 4 |
| **STF-08** | Staff | Exam Score Review | Question-by-question student score audit and override | **Documented** | Phase 4 |
| **STF-09** | Staff | Buddy Worksheets | Interactive worksheet library and data table | **Documented** | Phase 4 |
| **STF-10** | Staff | Worksheet Creator | Drag-and-drop canvas designer with bounding targets | **Documented** | Phase 4 |
| **STF-11** | Staff | Student Class Roster | Enrolled students list with class and section filters | **Documented** | Phase 4 |
| **STF-12** | Staff | Holistic Portfolio (HPC)| Student radar chart and qualitative competency notes | **Documented** | Phase 4 |
| **STF-13** | Staff | AI Tools Suite | Generative AI lesson planner and quiz creator | **Documented** | Phase 6 |
| **STF-14** | Staff | AI Cam Scanner | Camera-based student worksheet OCR and digitizer | **Documented** | Phase 6 |
| **STF-15** | Staff | Teacher Profile | Account settings, school details, password update | **Documented** | Phase 4 |
| **STF-16** | Staff | Class Chat | Real-time classroom broadcast communication | **Documented** | Phase 6 |
| **STU-01** | Student | Student Home | Daily schedule, homework alerts, recent books | **Documented** | Phase 5 |
| **STU-02** | Student | My Books | Enrolled textbooks, chapter reader, audio sync | **Documented** | Phase 5 |
| **STU-03** | Student | Flipbook Reader | Full-screen interactive textbook reader with notes | **Documented** | Phase 5 |
| **STU-04** | Student | Digital Resources | Video lesson library and interactive simulations | **Documented** | Phase 5 |
| **STU-05** | Student | Assignments (HomeFun) | Pending, Completed, Overdue tabs; submission modal | **Documented** | Phase 5 |
| **STU-06** | Student | Homework Submissions | File uploader, image uploads, typed response | **Documented** | Phase 5 |
| **STU-07** | Student | Online Tests (Quiz) | Assigned, Completed, Missed tabs; exam start | **Documented** | Phase 5 |
| **STU-08** | Student | Timed Exam Runner | Countdown timer, question palette, auto-save answers | **Documented** | Phase 5 |
| **STU-09** | Student | Exam Scorecard | Instant results, percentage dial, solution breakdown | **Documented** | Phase 5 |
| **STU-10** | Student | Interactive Worksheets| Drag-and-drop canvas exercise player with audio cues | **Documented** | Phase 5 |
| **STU-11** | Student | Student Portfolio | 5-competency radar chart, term reflections, HPC PDF | **Documented** | Phase 5 |
| **STU-12** | Student | Student Profile | Learner ID, grade, section, school enrollment details | **Documented** | Phase 5 |
| **STU-13** | Student | Class Messages | Classroom announcement feed and notifications | **Documented** | Phase 6 |
| **STU-14** | Student | QR Book Activation | Scan physical book QR code to unlock digital access | **Documented** | Phase 6 |
| **STU-15** | Student | Access Denied / Paywall| Subscription expiry paywall with "Purchase Now" CTA | **Documented** | Phase 5 |

