# 07. END-TO-END WORKFLOW DOCUMENTATION

This document provides step-by-step specifications, state machine transitions, and cross-panel interaction sequences for the seven core workflows of the platform.

---

## Workflow 1: Institutional Onboarding & Class Setup

### Overview
Connects Super Admin, School Admin, and Teaching Staff to establish a fully operational school tenant.

```mermaid
sequenceDiagram
    autonumber
    actor SuperAdmin as Super Administrator
    actor SchoolAdmin as School Administrator
    actor Teacher as Teacher
    participant API as Central API Gateway
    participant DB as Central Database

    SuperAdmin->>API: POST /createSchool/school/ (Name, Code, Board, License)
    API->>DB: INSERT INTO tbl_schools (pk_school_key, school_name, status)
    API-->>SuperAdmin: School Created + Admin Root Credentials Generated

    SchoolAdmin->>API: POST /checkUserLogin/user/ (Login with School Admin)
    API-->>SchoolAdmin: Authenticated Session (Role: School Admin)

    SchoolAdmin->>API: POST /SelectschoolClass/class/ (Grade 5, Section A, Capacity: 40)
    API->>DB: INSERT INTO tbl_classes, tbl_sections
    API-->>SchoolAdmin: Class & Section Created

    SchoolAdmin->>API: POST /createschoolSubject/schoolsubject/ (English, Math, Science)
    API->>DB: INSERT INTO tbl_subjects & tbl_class_subjects
    API-->>SchoolAdmin: Subjects Mapped to Grade 5

    SchoolAdmin->>API: POST /createTeacher/teacher/ (Email: achariya@test.com, Alloc: Grade 5-A, English)
    API->>DB: INSERT INTO tbl_users, tbl_teacher_allocations
    API-->>SchoolAdmin: Teacher Account Created + Welcome Email Sent

    Teacher->>API: POST /checkUserLogin/user/ (Login with achariya@test.com)
    API-->>Teacher: Auth Response with Assigned Classes [Grade 5-A] & Subjects [English]
```

### State Transitions (Class Lifecycle)
`DRAFT` -> `ACTIVE` -> `ASSIGNED_TO_TEACHER` -> `STUDENTS_ENROLLED` -> `ARCHIVED`

---

## Workflow 2: Homework Creation, Submission & Grading (HomeFun)

### Overview
Illustrates the complete end-to-end homework loop connecting Teacher and Student.

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as Teacher
    actor Student as Student (Anup)
    participant API as Central API Gateway
    participant S3 as AWS S3 Storage
    participant DB as Central Database

    Teacher->>API: POST /create-homework (Title: "Reading Comprehension", Due: 10 Nov)
    Teacher->>S3: Upload Worksheet PDF / Prompt Attachment
    API->>DB: INSERT INTO tbl_activities (pk_activity_key, class_key, status='CREATED')
    Teacher->>API: POST /assignactivity/teacher/ (Assign to Grade 5 - Section A)
    API->>DB: UPDATE tbl_activities SET status='ASSIGNED'; INSERT INTO tbl_student_activities
    API-->>Student: Push Notification: "New Homework Assigned: Reading Comprehension"

    Student->>API: GET /student/homeworks (Tabs: Pending)
    API-->>Student: Displays "Reading Comprehension" in Pending tab

    Student->>API: POST /student/homeworks/attendquiznew/:assignQuizKey
    Student->>S3: Upload Completed Assignment Photos / Typed Text
    Student->>API: POST /uploadstudActivity/activity/ (Submit Assignment)
    API->>DB: UPDATE tbl_student_activities SET status='SUBMITTED', submitted_at=NOW()
    API-->>Teacher: Notification: "Anup submitted Reading Comprehension"

    Teacher->>API: GET /staff/homeworks (Tab: Submissions)
    Teacher->>API: POST /updateRating/activity/ (Grade: 9/10, Feedback: "Excellent vocabulary!")
    API->>DB: UPDATE tbl_student_activities SET score=9, feedback="Excellent", status='EVALUATED'

    Student->>API: GET /student/homeworks (Tab: Completed)
    API-->>Student: View Score (9/10), Teacher Feedback bubble, and marked submission
```

### State Transitions (Homework Lifecycle)
`CREATED` -> `ASSIGNED` -> `PENDING` -> `SUBMITTED` -> `UNDER_EVALUATION` -> `EVALUATED` (or `OVERDUE`)

---

## Workflow 3: Assessment Authoring, Timed Exam & Result Analytics

### Overview
Automates the lifecycle of quizzes, mid-term tests, and online practice exams.

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as Teacher
    actor Student as Student (Anup)
    actor Admin as School Admin
    participant API as Central API Gateway
    participant DB as Central Database

    Teacher->>API: POST /createQuiz/quiz/ (Title: "Science Unit 1 Test", Duration: 30m)
    Teacher->>API: POST /updateOrInsertQuiz/quiz/ (Add 10 MCQs, 5 Fill-in-Blanks)
    Teacher->>API: POST /assignQuiz/quiz/ (Schedule for Grade 5 - A, Start: 9:00 AM)
    API->>DB: INSERT INTO tbl_quizzes, tbl_questions, tbl_assigned_quizzes

    Student->>API: GET /student/quiz (Assigned tab)
    Student->>API: POST /student/quiz/attendquiz/:assignQuizKey (Start Exam)
    API->>DB: RECORD exam_start_time
    API-->>Student: Question Payload (without answer keys) + Client Countdown Timer (30:00)

    loop Question Answering
        Student->>API: POST /studentOptionQuizAnswers/student/ (Save Answer Q1 -> Option B)
        API->>DB: INSERT/UPDATE tbl_student_answers (auto-saved)
    end

    Student->>API: POST /saveQuizData/quiz/ (Finish & Submit Exam)
    API->>DB: System Auto-Grading (Compare answers with correct key)
    API->>DB: INSERT INTO tbl_quiz_results (total_marks=28/30, percentage=93.3%)

    Student->>API: GET /student/Quiz/quizResult/:id1/:id2
    API-->>Student: Instant Scorecard, Radar Chart, and Solution Explanations

    Admin->>API: GET /schooladmin/quizreport/:id1
    API-->>Admin: Class average (82%), Question Difficulty Breakdown, Highest/Lowest scores
```

### State Transitions (Quiz Lifecycle)
`DRAFT` -> `PUBLISHED` -> `SCHEDULED` -> `IN_PROGRESS` -> `SUBMITTED` -> `AUTO_GRADED` -> `RESULTS_RELEASED`

---

## Workflow 4: Interactive Drag-and-Drop Buddy Worksheets

### Overview
Covers interactive canvas exercises where students drag labels or images onto target zones.

1. **Teacher Creation**:
   - Teacher accesses `/staff/create-worksheet`.
   - Uploads a background canvas image (e.g. human digestive system or world map).
   - Adds draggable labels (`Stomach`, `Liver`, `Intestine`).
   - Places corresponding dropzone rectangles on the canvas.
   - Saves worksheet via `/createWorksheet/teacher/` and assigns to Grade 5.
2. **Student Execution**:
   - Student navigates to `/student/worksheet` and clicks "Start Worksheet".
   - Drag items are rendered in a bank using `react-dnd` (HTML5 Drag & Drop).
   - Student drags each label onto its corresponding target dropzone.
   - On clicking "Check Answers", `/studCompleteImageWorksheet/activity/` is invoked.
   - Immediate visual feedback: Dropzones flash green (correct) or red (incorrect) with audio sound effect.
3. **Teacher Verification**:
   - Teacher opens `/staff/worksheets/draganddropscoreview/:id/:studentKey`.
   - Views the student's exact canvas placement and error breakdown (`/getWorksheetincorrect/teacher/`).

---

## Workflow 5: Holistic Student Portfolio (HPC) & Term Evaluation

### Overview
Tracks continuous multi-dimensional student growth beyond traditional marks.

1. **Continuous Evidence Collection**:
   - Homework scores, quiz results, and worksheet milestones are automatically piped into the portfolio engine.
2. **Teacher Observation Input**:
   - Teacher accesses `/staff/studentportfolio/:studentId`.
   - Enters descriptive qualitative notes under 5 core competencies:
     - *Cognitive & Critical Thinking*
     - *Social & Emotional Well-being*
     - *Creativity & Expression*
     - *Physical & Motor Development*
     - *Communication & Language*
   - Submits observations via `/learningoutcomeportfolio/portfolio/`.
3. **Student & Parent Review**:
   - Student visits `/student/Portfolio`.
   - Visualizes term progress as an interactive 5-axis Radar Chart.
   - Generates and downloads the official Holistic Progress Card (HPC) PDF for term reporting.

---

## Workflow 7: SCORE Suite (AI Exam Generation, Batch PDF Print & Scan Grader Pipeline)

### Overview
Automates physical examination authoring, batch PDF generation, optical scanning/AI camera grading, and diagnostic verification as seen in the live **SCORE** suite.

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as Teacher
    actor Student as Student
    participant AI as AI Engine & Exam Builder
    participant Batch as Batch PDF Generator
    participant Grader as Exam Grader Pipeline (OCR)
    participant DB as Central Database

    Teacher->>AI: Select Subject, Class (Grade 5), Topics & Bloom's Taxonomy
    AI-->>Teacher: Generates Complete Exam Blueprint (Questions, Marking Scheme)
    Teacher->>AI: Configure & Confirm ("Exam Builder")

    Teacher->>Batch: Click "Assign Exam"
    Batch->>DB: Fetch enrolled students in Grade 5-A (Anup, etc.)
    Batch->>Batch: Generate personalized exam sheets with unique QR codes per student
    Batch-->>Teacher: Download single consolidated batch PDF ready for classroom printing

    Note over Teacher,Student: Physical Exam Conducted in Classroom

    Teacher->>Grader: Launch "Exam Grader" / AI-Cam
    Teacher->>Grader: Upload scanned exam batch PDF / Capture via Camera
    Grader->>Grader: Detect student QR code, crop answer bounding boxes, run handwriting OCR
    Grader->>Grader: Run Autograde pipeline against marking rubric
    Grader->>DB: Record preliminary marks & confidence scores

    Teacher->>DB: Open "Grading Runs"
    Teacher->>DB: Review flagged ambiguous handwriting, adjust scores if needed, and confirm
    Teacher->>DB: Open "Exam Insights" -> View item-level discrimination and class performance curves
```

---

## Workflow 8: Physical-to-Digital Book QR Code Activation

### Overview
Connects physical print materials to digital platform licenses.

```mermaid
sequenceDiagram
    autonumber
    actor Parent as Parent / Student
    actor MobileApp as Chrysalis Mobile App
    participant API as Central API Gateway
    participant DB as Central Database

    Parent->>MobileApp: Scans QR code printed in physical book
    MobileApp->>API: POST /studentqrregister/student (Scanned Token + Student Key)
    API->>DB: SELECT * FROM tbl_book_qr WHERE qr_token = :token
    alt Valid and Unused QR Token
        API->>DB: UPDATE tbl_book_qr SET is_redeemed=1, redeemed_by=:studentKey
        API->>DB: INSERT INTO tbl_student_book_licenses (student_key, book_key, expires_at)
        API->>DB: UPDATE tbl_student_access SET book_visibility = 1
        API-->>MobileApp: "Book Activated Successfully! Digital Flipbook Unlocked"
    else Invalid or Already Redeemed
        API-->>MobileApp: "Error: This QR code has already been redeemed"
    end
```



---

## Workflow 9: Student Voice & LSR Suite (Listening, Speaking, Reading)

### Overview
Automates interactive voice assessments for English language acquisition, oral reading fluency, and comprehension.

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student (Anup)
    participant LSRApp as Chrysalis LSR App (Next.js)
    participant SpeechEngine as WebAudio & Speech AI Engine
    participant TeacherDash as Teacher LSR Analytics

    Student->>LSRApp: Login with anup@test.com
    LSRApp-->>Student: Launch "My Level Test" ("Hello Anup! Let's hear your English")
    Student->>LSRApp: Click "▶ Let's go!"

    rect rgb(240, 248, 255)
    Note over Student,LSRApp: Module 1: LISTENING COMPREHENSION
    LSRApp->>Student: Display Question ("What stopped the energy flow in the broken engine?")
    Student->>LSRApp: Click "Tap to listen"
    LSRApp->>Student: Play Audio Story Snippet
    Student->>LSRApp: Select Option [A / B / C]
    end

    rect rgb(255, 245, 245)
    Note over Student,SpeechEngine: Module 2: SPEAKING & FLUENCY
    LSRApp->>Student: Request Microphone Access ("Ask a grown-up to tap Allow")
    LSRApp->>Student: Display Reading Prompt Sentence
    Student->>SpeechEngine: Speaks aloud into microphone
    SpeechEngine->>SpeechEngine: Stream audio, transcribe phonemes, compute WCPM (Words Correct Per Minute)
    SpeechEngine-->>LSRApp: Return confidence score & phonetics pronunciation accuracy
    end

    rect rgb(245, 255, 245)
    Note over Student,SpeechEngine: Module 3: READ WORDS
    LSRApp->>Student: Display vocabulary flashcard
    Student->>SpeechEngine: Pronounces word
    SpeechEngine-->>LSRApp: Instant visual feedback (green highlight on syllables correct)
    end

    LSRApp->>TeacherDash: Sync session telemetry to Teacher LSR Dashboard (lsr.chrysalis.world)
    TeacherDash-->>TeacherDash: Update Student Fluency Radar & Class Reading Level
```
