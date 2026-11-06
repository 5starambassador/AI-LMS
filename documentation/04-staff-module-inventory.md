# 04. STAFF / TEACHER MODULE INVENTORY

This document details the functional specifications, visual components, user interaction flows, and API integrations for the **Staff Panel**.

---

## Module 1: Staff Home & Dashboard (`/staff/home`)

### Purpose
Serves as the teacher's command center upon login, presenting institutional announcements, video webinar highlights, quick access shortcuts, and live class feeds.

### Visual Components & Layout
1. **Top Navigation Bar**:
   - Platform Version Indicator (`v2.8.18`).
   - Primary Navigation Links: `Home`, `Resources`, `AI Tools`, `My Space`.
   - School Identity Badge: Displays `Achariya School Demo` (tenant name).
   - Profile Dropdown: User Avatar with initial `A`, Name (`Achariya School Teacher`), Role (`Teacher`), `Profile` and `Logout` triggers.
2. **Video Gallery Section**:
   - Header: "Video Gallery"
   - Video Cards: Thumbnail, Video Title ("Chrysalis Day 2025-26", "Webinars"), duration badge, and video modal launcher.
3. **Quick Action Carousel**:
   - Promotional banners and pedagogical reminders fetched dynamically from AWS S3 storage.

### Action Controls & Buttons
| Button / Control | Visual Class / Style | Event / Action Trigger |
| :--- | :--- | :--- |
| `Profile` | `dropdown-item` | Navigates to `/staff/staff-profile` |
| `Logout` | `dropdown-item text-danger` | Calls `/logout?type=manual`, flushes localStorage, redirects to `/login` |
| Video Thumbnail | `.video-card-thumb` | Opens modal with embedded YouTube/Vimeo/S3 video stream |

### Backing API Endpoints
- `POST /apis/api_index.php` -> `/listhomevideogallerystaff/homesetting/`
- `POST /apis/api_index.php` -> `/listhomebannerstaff/homesetting/`

---

## Module 2: Curriculum Books & Flipbook Reader (`/staff/books`)

### Purpose
Allows teachers to browse, preview, and project digital curriculum textbooks assigned to their authorized grades and classes.

### Visual Components & Layout
1. **Grade Filter Bar**:
   - Filter chips: `All`, `Grade 1`, `Grade 2` ... `Grade 5` (highlighting active grade `Grade 5`).
2. **Recents Section**:
   - Displays recently accessed textbooks with resume page pointers.
3. **All Books Grid**:
   - Book Cards: Cover image from S3, Book Title (e.g., "English ThinkRoom Grade 5"), Class Badge, Series Name, and "Explore" action.
4. **Lesson Drilldown (`/staff/books/lessons/:id`)**:
   - Chapter index listing: Unit number, Chapter Name, Page ranges, Lesson Plan link, and Digital Resources accordion.
5. **Interactive Dual-Page Flipbook (`/staff/books/lessons/flip/:id1/:id2`)**:
   - Canvas: Powered by custom S3 flipbook viewer (`s3viewbooks/index.php`).
   - Toolbar: Zoom in/out, Page thumbnails, Full-screen toggle, Pen annotations, Bookmark, Table of Contents.

### Action Controls & Buttons
| Button / Control | Visual Class / Style | Event / Action Trigger |
| :--- | :--- | :--- |
| Grade Chip (`Grade 5`) | `btn btn-outline-primary active` | Filters book catalog by `fk_class_key` |
| Book Card Click | `.book-card` | Navigates to `/staff/books/lessons/:bookKey` |
| "Open Flipbook" | `btn btn-primary` | Opens `/staff/books/lessons/flip/:bookKey/:lessonKey` in projector view |
| "Lesson Plan PDF" | `btn btn-outline-info` | Initiates signed URL download from AWS S3 |

### Backing API Endpoints
- `POST /apis/api_index.php` -> `/getAllStaffBooks/book/`
- `POST /apis/api_index.php` -> `/getAllPubSeriesForStaff/series/`
- `POST /apis/api_index.php` -> `/getAllstaffLessons/lesson/`

---

## Module 3: HomeFun (Homework Management) (`/staff/homeworks`)

### Purpose
Enables educators to draft, schedule, assign, and review homework assignments for students across assigned classes and subjects.

### Visual Components & Layout
1. **Status Tab Bar**:
   - `Created`: Draft assignments not yet published to students.
   - `Assigned`: Active assignments currently in progress.
   - `Submissions`: Submissions awaiting teacher grading or completed.
2. **Filter Controls**:
   - Class Dropdown: Select Grade (e.g., `Grade 5 - A`).
   - Subject Dropdown: Select Subject (e.g., `English`, `Mathematics`, `Science`).
3. **Homework Data Table**:
   - Columns: `S.No`, `Homework Title`, `Class/Section`, `Subject`, `Due Date`, `Assigned Count`, `Submitted Count`, `Status Badge`, `Actions`.
4. **Create Homework Wizard (`/staff/create-homework`)**:
   - Step 1: Basic Information (Title, Instructions, Subject, Class).
   - Step 2: Content Attachment (Upload image worksheet, PDF rubric, or attach quiz).
   - Step 3: Scheduling (Start Date, Due Date, Late Submission Allowed toggle).

### Action Controls & Buttons
| Button / Control | Visual Class / Style | Event / Action Trigger |
| :--- | :--- | :--- |
| `+ Create Homework` | `btn btn-primary waves-effect` | Navigates to `/staff/create-homework` |
| `View Submissions` | `btn btn-sm btn-info` | Displays student submissions table with grade status |
| `Evaluate Submission` | `btn btn-sm btn-success` | Opens student uploaded image/text with grading modal |
| `Delete Homework` | `btn btn-sm btn-danger` | Confirms and invokes `/deleteActivity/activity/` |

### Backing API Endpoints
- `POST /apis/api_index.php` -> `/getAssignedactivity/teacher/`
- `POST /apis/api_index.php` -> `/assignactivity/teacher/`
- `POST /apis/api_index.php` -> `/uploadimageActivity1/teacher/`
- `POST /apis/api_index.php` -> `/updateRating/activity/`

---

## Module 4: Assessment & Quiz Engine (`/staff/quiz`)

### Purpose
Provides a comprehensive assessment authoring and evaluation suite supporting multiple question types (Multiple Choice, Fill in the Blanks, Match the Following).

### Visual Components & Layout
1. **Filter Header**:
   - Class selector (`Grade 5`), Section selector (`A`), Subject selector (`English`).
2. **Assessment Catalog**:
   - Active Quizzes, Scheduled Dates, Student Attendance Count, Average Score.
3. **Assessment Builder (`/staff/quiz/create_quiz`)**:
   - Question Type Selector:
     - `Multiple Choice Question (MCQ)`: Question text, Image attachment, 4 options, Correct Answer Radio.
     - `Fill in the Blanks`: Text with `[blank]` placeholder, accepted alternative answers.
     - `Match the Following`: Left-column cues (text/image), Right-column target matches.
   - Scoring Configuration: Points per question, Negative marking toggle, Time limit (minutes).
4. **Student Score & Audit View (`/staff/quiz/quizscoreview/:id/:studentKey`)**:
   - Displays student name (`Anup`), time taken, total score, question-by-question breakdown with green checkmark for correct and red cross for incorrect.

### Backing API Endpoints
- `POST /apis/api_index.php` -> `/getAssignedOptionQuiz/teacher/`
- `POST /apis/api_index.php` -> `/getAssignedFillQuiz/teacher/`
- `POST /apis/api_index.php` -> `/getAssignedMatchQuiz/teacher/`
- `POST /apis/api_index.php` -> `/createQuiz/quiz/`
- `POST /apis/api_index.php` -> `/updateOrInsertQuiz/quiz/`
- `POST /apis/api_index.php` -> `/getstudCompletedQuizReportsdata/quiz/`

---

## Module 5: Interactive Buddy Worksheets (`/staff/worksheets`)

### Purpose
Delivers drag-and-drop interactive worksheets where students match concepts, label diagrams, or sort elements on canvas exercises.

### Visual Components & Layout
1. **Worksheets Data Table**:
   - Header: "WORKSHEET - Buddy Worksheet List Of Worksheets".
   - Pagination dropdown: `Show 10`, `Show 20`, `Show 30`, `Show 40`, `Show 50`.
   - Columns: `S No`, `Worksheet Name`, `Grade`, `Subject`, `Created Date`, `Actions`.
2. **Create Worksheet Canvas (`/staff/create-worksheet`)**:
   - Background canvas uploader (diagrams, maps, scenes).
   - Drag items generator: Add labels, images, or numerical values.
   - Target zones: Define bounding dropzones on the background image.

### Backing API Endpoints
- `POST /apis/api_index.php` -> `/getAllWorksheet/teacher/`
- `POST /apis/api_index.php` -> `/createWorksheet/teacher/`
- `POST /apis/api_index.php` -> `/uploadimageWorksheet/teacher/`
- `POST /apis/api_index.php` -> `/getWorksheetScore/teacher/`

---

## Module 6: Students Roster & Portfolio (`/staff/studentlist`)

### Purpose
Gives teachers a complete roster of students enrolled in their classes and access to individual student growth portfolios.

### Visual Components & Layout
1. **Filter Controls**:
   - `Select Class`: Dropdown listing assigned grades.
   - `Select Section`: Dropdown listing assigned sections (e.g. `Section A`).
2. **Student Roster List**:
   - Student Card: Avatar, Name (`Anup`), Roll Number (`618104`), Attendance %, Action buttons.
3. **Student Portfolio View (`/staff/studentportfolio/:id1`)**:
   - Student demographic header (Name, DOB, Grade, Term `2026-2027`).
   - Radar chart illustrating 5 developmental competencies (Cognitive, Social, Emotional, Creative, Physical).
   - Anecdotal notes entry form for teachers to submit term observations.

### Backing API Endpoints
- `POST /apis/api_index.php` -> `/getAllStudent/student/`
- `POST /apis/api_index.php` -> `/staffstudentportfolio/portfolio/`
- `POST /apis/api_index.php` -> `/learningoutcomeportfolio/portfolio/`

---

## Module 7: AI Tools Suite (`/staff/aitools`)

### Purpose
An advanced AI-powered educational suite dividing capabilities into three distinct domains: **HPC / COMPASS** (Holistic Progress & Autograding), **SCORE** (AI Exam Generation, Personalized Batch Printing, and Scanned Exam Pipeline Grading), and **VOICE** (Listening, Speaking & Reading Analytics).

### Visual Layout & Categorized Modules (Verified via Live Screenshot)

```
+---------------------------------------------------------------------------------------------------+
|                                      STAFF AI TOOLS SUITE                                         |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [ Domain 1: HPC / COMPASS ]                                                                      |
|    |-- [ Autograde ] ................ AI-powered grading for students' written responses           |
|    `-- [ Holistic Progress Card ] ... Record observations across domains - build, view & share    |
|                                                                                                   |
|  [ Domain 2: SCORE (Exam & Assessment Pipeline) ]                                                 |
|    |-- [ Exam Builder ] ............. Generate and configure exams with AI                        |
|    |-- [ Assign Exam ] .............. Generate personalised exam copies for a class as a batch PDF|
|    |-- [ Exam Grader ] .............. Grade scanned exams and debug the grading pipeline          |
|    |-- [ Grading Runs ] ............. Reopen an exam you have already scanned or graded          |
|    `-- [ Exam Insights ] ............ Review class-level performance across your graded exams     |
|                                                                                                   |
|  [ Domain 3: VOICE (LSR Suite) ]                                                                  |
|    `-- [ LSR Dashboard ] ............ Listening, Speaking & Reading analytics (lsr.chrysalis.world)|
|                                                                                                   |
|  [ Domain 4: RESOURCES ]                                                                          |
|    `-- [ Activity Library ] ......... Videos and activities for every lesson - ready to show class|
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Detailed Functional Specification of AI Tool Cards

| Category | Tool Card Name | Functional Description & Workflow | Key Actions & Triggers | Backing Endpoints / Services |
| :--- | :--- | :--- | :--- | :--- |
| **HPC / COMPASS** | **Autograde** | AI-powered automated grading of student written text and uploaded handwritten responses. Uses OCR and rubric scoring. | `Click Card` -> Opens Autograde submission queue | AI Autograding API, `/saveExamController/teacher/` |
| **HPC / COMPASS** | **Holistic Progress Card** | Multi-domain observational recording interface. Enables teachers to build, view, and share the official HPC report card. | `Click Card` -> HPC Builder & Domain Rubric | `/learningoutcomeportfolio/portfolio/`, `/staffstudentportfolio/` |
| **SCORE** | **Exam Builder** | AI question synthesis tool that generates complete question papers (MCQs, short answer, long answer) based on syllabus topics. | `Click Card` -> Exam configuration wizard | AI Prompt Generator, `/createQuiz/quiz/`, `/updateOrInsertQuiz/` |
| **SCORE** | **Assign Exam** | Automated generation of personalized exam papers with unique student watermarks and QR codes compiled into a single batch PDF. | `Click Card` -> Generates downloadable Batch PDF for print | PDF Batch Generation Engine, `/downloadRollNoTemplate/` |
| **SCORE** | **Exam Grader** | Ingestion pipeline for scanned physical exam sheets. Parses student QR, locates bounding boxes, runs handwriting OCR, and grades. | `Click Card` -> Upload scanned PDF / Run Camera OCR | Vision OCR Pipeline, `/staff/ai-cam`, Exam Grader Service |
| **SCORE** | **Grading Runs** | Diagnostic audit log of historical scanning and grading batches. Allows re-inspecting ambiguous handwriting or manual overrides. | `Click Card` -> Table of scan batches with confidence scores | `/getstudCompletedQuizReportsdata/quiz/`, Audit Log Service |
| **SCORE** | **Exam Insights** | Institutional and classroom performance analytics across all AI-graded examinations. Item discrimination & class distribution. | `Click Card` -> Analytics dashboard & Charts | `/getassignquizadmininsight/insight/`, `/schooladmin/quizreport/` |
| **VOICE** | **LSR Dashboard** | Dedicated analytics console for student audio exercises: Listening comprehension, Speaking fluency, and Reading phonetics. | `Click Card` -> Redirects to `lsr.chrysalis.world` with auth SSO token | `lsr.chrysalis.world`, `/redirectaitools/ai_tools/`, Speech Engine |
| **RESOURCES** | **Activity Library** | Rich multimedia curriculum library with videos and interactive activities for every chapter, designed for in-class smartboard projection. | `Click Card` -> Opens Lesson Activity Explorer | `/NewmenuToolsListStaff/moretools/`, S3 Resource Bucket |



---

## Module 8: My Space (`/staff/myspace`)

### Purpose
Provides a personalized professional ecosystem for educators covering continuous teacher training, curriculum period planning, and classroom walkthrough analytics.

### Visual Layout & Categorized Modules (Verified via Live Screenshot)

```
+---------------------------------------------------------------------------------------------------+
|                                        MY SPACE DASHBOARD                                         |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [ Card 1: Professional Development ]  [ Card 2: Planner ]         [ Card 3: Walkthrough ]        |
|  - Icon: Pink Graduation Cap           - Icon: Pink Calendar       - Icon: Pink Monitor           |
|  - "Access your professional           - "Create and manage your   - "View walkthrough analytics  |
|    development resources and             period plans efficiently"   and fill walkthrough forms   |
|    training materials"                                               for your school"             |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Detailed Functional Specification of My Space Cards

| Card Name | Visual Icon & Styling | Functional Description & Workflow | Key Action / Target | Backing Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| **Professional Development** | Blue circle ring + Pink graduation cap | Access accredited professional development modules, teaching masterclasses, and pedagogical certification videos. | Opens `/staff/pd` course library | `/redirectpdtools/pd/`, `pd.chrysalis.world` |
| **Planner** | Blue circle ring + Pink calendar | Academic period planner. Allows educators to schedule curriculum units, assign teaching periods, and track syllabus completion dates against the academic calendar. | Opens Period Planning Calendar | `/staff/books/lessons/`, Period Planning API |
| **Walkthrough** | Blue circle ring + Pink computer display | Classroom observation and walkthrough system. Educators and academic supervisors can view classroom walkthrough analytics and complete observational feedback forms. | Opens `/staff/walkthrough` forms | `/getschoolid/walkthrough/`, `/getschoolid/walkthroughform/` |


---

## Module 8: My Space (`/staff/myspace`)

### Purpose
Provides a personalized professional ecosystem for educators covering continuous teacher training, curriculum period planning, and classroom walkthrough analytics.

### Visual Layout & Categorized Modules (Verified via Live Screenshot)

```
+---------------------------------------------------------------------------------------------------+
|                                        MY SPACE DASHBOARD                                         |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [ Card 1: Professional Development ]  [ Card 2: Planner ]         [ Card 3: Walkthrough ]        |
|  - Icon: Pink Graduation Cap           - Icon: Pink Calendar       - Icon: Pink Monitor           |
|  - "Access your professional           - "Create and manage your   - "View walkthrough analytics  |
|    development resources and             period plans efficiently"   and fill walkthrough forms   |
|    training materials"                                               for your school"             |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Detailed Functional Specification of My Space Cards

| Card Name | Visual Icon & Styling | Functional Description & Workflow | Key Action / Target | Backing Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| **Professional Development** | Blue circle ring + Pink graduation cap | Access accredited professional development modules, teaching masterclasses, and pedagogical certification videos. | Opens `/staff/pd` course library | `/redirectpdtools/pd/`, `pd.chrysalis.world` |
| **Planner** | Blue circle ring + Pink calendar | Academic period planner. Allows educators to schedule curriculum units, assign teaching periods, and track syllabus completion dates against the academic calendar. | Opens Period Planning Calendar | `/staff/books/lessons/`, Period Planning API |
| **Walkthrough** | Blue circle ring + Pink computer display | Classroom observation and walkthrough system. Educators and academic supervisors can view classroom walkthrough analytics and complete observational feedback forms. | Opens `/staff/walkthrough` forms | `/getschoolid/walkthrough/`, `/getschoolid/walkthroughform/` |


---

## Module 9: Satellite Platform Subsystems (SSO Interconnected)

The reference architecture does not operate as a single monolithic UI; it federates into four dedicated satellite web applications linked via single-sign-on (SSO) ticket redemption:

```
+---------------------------------------------------------------------------------------------------+
|                                   SATELLITE APPLICATION MAPPING                                   |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  1. Exam Template & SCORE Suite ...... https://templates.chrysalis.world/menu                     |
|     - SSO Ticket Handshake: POST /redirectaitools/ai_tools/                                       |
|     - Sub-routes: /exam-builder, /exam-assign, /exam-grader, /exam-grader/runs, /exam-insights    |
|                                                                                                   |
|  2. Professional Development (PD) .... https://pd.chrysalis.world/teacher/modules                 |
|     - SSO Token Handshake: POST /redirectpdtools/pd/                                              |
|     - Sub-routes: /dashboard, /courses, /webinars, /video-library, /reading-material,             |
|                   /assessments, /certificates                                                     |
|                                                                                                   |
|  3. Pedagogical Planning Guide (PPG) . https://ppg.chrysalis.world/                               |
|     - SSO Access Token: POST /redirectppgtools/ppg/                                               |
|     - Sub-routes: /lesson-planner, /annual-plan, /monthly-view, /dashboard, /settings             |
|                                                                                                   |
|  4. Voice & LSR Analytics ............ https://lsr.chrysalis.world/                               |
|     - SSO Ticket: /api/lsr-sso                                                                    |
|     - Capabilities: Listening comprehension, Speech fluency, Reading phonetics                    |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Detailed Functional Breakdown of SCORE Suite Sub-Routes
1. **Summative Exam Builder (`/exam-builder`)**:
   - Allows selecting Grade (`Grade 5`) and syllabus topics.
   - Action: `📋 All Exams` directory.
   - Synthesizes balanced question blueprints mapped to cognitive levels.
2. **Assign Exam (`/exam-assign`)**:
   - Step 1: Exam selection via `EXAM CODE` or grade/subject browse.
   - Step 2: Print mode selection:
     - `Pre-printed booklets`: Personalized copies for each student with unique QR code watermarks.
     - `Free-form paper`: Standard question papers where students write in separate school answer books.
   - Step 3: Action `📄 Generate Batch PDF (N)` compiling all student test copies into a single print file.
3. **Exam Grader (`/exam-grader`)**:
   - Ingestion station for scanned student test papers.
   - Uses OCR and QR identification to match papers to student records.
4. **Grading Runs (`/exam-grader/runs`)**:
   - Audit trail of scan runs.
   - Filter tabs: `All statuses`, `Not started`, `Ready to grade`, `Needs review`, `In review`, `Submitted`, `Locked`.
5. **Exam Insights (`/exam-insights`)**:
   - Class-level performance analytics across all graded batches.

### Detailed Functional Breakdown of Professional Development (PD Platform)
- Top Navigation: `Dashboard`, `Courses`, `Webinars`, `Video Library`, `Reading Material`, `Assessments`, `Certificates` (v1.0.15).
- Metric Badges: `📜 Certificates Earned`, `🎖 Badges Earned`.
- Course Filters: `All`, `In Progress`, `Completed`, `Not Started`, `Favourites`.
- Active Catalog: `C-CH001 ChrysalisConnect` (Modules, Qualification criteria, Progress %, `View Modules` CTA).

### Detailed Functional Breakdown of Pedagogical Planning Guide (PPG Platform)
- Modules: `📚 Lesson Planner`, `📅 Annual plan`, `📆 Monthly View`, `📊 Dashboard`, `⚙️ Settings`.
- Global Pacing Filters: `Grade`, `Section`, `Subject`, `Teacher`, `Month`.
- Delivery Status Toggles: `All status`, `On track`, `Behind`, `In progress`, `Completed`.


---

## Module 10: Daily Attendance Tracking (`/staff/chat/lkg/attendance`)

### Purpose
Allows classroom teachers to mark daily student attendance (Present, Absent, Late), maintain the cumulative working day count (`attendancecount`), and auto-pipe attendance percentages into the student profile and Holistic Progress Card (HPC).

### Visual Components & Controls
1. **Class Header**: Selected Class (e.g. `Grade 5 - A`), Total Enrolled Students, Total Present, Total Absent.
2. **Attendance Grid**:
   - Columns: `Roll No`, `Avatar`, `Student Name`, `Present (Radio)`, `Absent (Radio)`, `Late (Radio)`, `Remarks`.
3. **Actions**:
   - `Mark All Present` quick toggle.
   - `Submit Attendance` button.
   - Syncs to `/staff/chat-message` as an automated notification: *"Today's attendance for Grade 5-A has been recorded: 38/40 Present."*

---

## Module 11: School Circulars & Social Feed (`/staff/updates&feeds`)

### Purpose
An institutional community feed and noticeboard broadcasting circulars, event photos, and announcements across faculty, students, and parents.

### Visual Components & Responsive Layout
1. **Desktop View (`/staff/updates&feeds`)**:
   - Left Sidebar: Channel filters (`School Notices`, `Academic Circulars`, `Sports & Events`, `Exam Alerts`).
   - Center Feed: Post creator (Text + Image upload), Timeline cards with publisher badge, timestamp, like/comment counters.
   - Right Sidebar: Active online teachers and upcoming events calendar.
2. **Responsive Mobile View (`/staff/updates&feeds/responsive`)**:
   - Single-column infinite scroll feed optimized for mobile viewports (`<= 767.98px`).

---

## Module 12: Summative Exam Marks Entry (`/studentMarks/exam/`)

### Purpose
Direct spreadsheet-like gradebook for teachers to enter raw marks for offline, pen-and-paper school term exams (Mid-term, Quarterly, Half-Yearly, Annual).

### Key Features
- Class & Section selector.
- Subject & Maximum Marks header.
- Student table with editable marks inputs, grade auto-computation (A1, A2, B1...), and validation against maximum marks cap.
