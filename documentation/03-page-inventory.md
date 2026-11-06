# 03. PAGE INVENTORY & IMPLEMENTATION STATUS MATRIX

This document registers every distinct page identified across the **Staff**, **Student**, and **Administrative** panels, recording layout structure, data bindings, action triggers, and current development status.

## Status Legend
- **Not Inspected**: Identified in route map but pending deep crawl.
- **Inspected**: Page runtime DOM, layout, and visual components recorded via automated browser session.
- **Documented**: Page structure, endpoints, schema, and workflows comprehensively documented.
- **Development Pending**: Awaiting full architectural sign-off before coding begins.
- **Developed**: Net-new implementation complete.
- **Tested**: Verified through automated end-to-end and unit tests.
- **Completed**: Ready for production deployment.

---

## 1. Staff Panel Page Inventory

| # | Page Title | Route (URL) | Primary Purpose | Key Widgets & Components | Backing API Endpoints | Status |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| ST-01 | Staff Home | `/staff/home` | Teacher executive portal, announcements, webinar feeds | Video Gallery, Carousel, Chrysalis Day 25-26 cards, Quick Stats | `/listhomevideogallerystaff/homesetting/`, `/listhomebannerstaff/homesetting/` | **Documented** |
| ST-02 | Staff Books | `/staff/books` | Digital textbook catalog by grade | Grade filter chips (`All`, `Grade 5`), Recents grid, All Books grid | `/getAllStaffBooks/book/`, `/getAllPubSeriesForStaff/series/` | **Documented** |
| ST-03 | Lesson List | `/staff/books/lessons/:id` | Chapter index and topic navigation | Lesson table, topic accordion, lesson status badges, PDF download | `/getAllstaffLessons/lesson/`, `/getseriesbasedOnBook/book/` | **Documented** |
| ST-04 | Flipbook Reader | `/staff/books/lessons/flip/:id1/:id2` | Interactive textbook dual-page flipbook | S3 flipbook iframe canvas, zoom, bookmark, thumbnail tray, notes | `s3viewbooks/index.php`, S3 bucket asset reader | **Documented** |
| ST-05 | Page Builder | `/staff/books/lessons/pagebuilder` | Custom digital lesson authoring | Rich WYSIWYG editor, multimedia uploader, interactive exercise embeds | `/createOtherLesson/lesson/`, `/createOtherResourcesLesson/lesson/` | **Documented** |
| ST-06 | Resources | `/staff/Resources` | Curated teaching multimedia & tools | Tool category cards, HPC resource cards, external tool links | `/NewmenuToolsListStaff/moretools/`, `/MenumoreBuketFilesStaff/moretools/` | **Documented** |
| ST-07 | AI Tools Suite | `/staff/aitools` | HPC/COMPASS (Autograde, HPC), SCORE (Exam Builder, Assign Exam, Exam Grader, Grading Runs, Exam Insights), VOICE (LSR Dashboard) | 3 domains, 8 interactive cards, tool launch modals | `/redirectaitools/ai_tools/`, AI grading & OCR engine | **Documented** |
| ST-08 | Exam Grader & AI Cam | `/staff/ai-cam` | Batch exam scanning, handwriting OCR & camera grader | WebRTC video feed, PDF scan batch uploader, OCR bounding boxes | Custom WebRTC + Vision OCR + Exam Grader Pipeline | **Documented** |
| ST-09 | My Space | `/staff/myspace` | Professional Development (PD) portal | Course progression cards, PPG guides, certification tracker | `/redirectpdtools/pd/`, `/redirectppgtools/ppg/` | **Documented** |
| ST-10 | HomeFun (Homework) | `/staff/homeworks` | Homework tracking & management | Tab bar (`Created`, `Assigned`, `Submissions`), filter by Subject, table | `/getAssignedactivity/teacher/`, `/getActivity/teacher/` | **Documented** |
| ST-11 | Create Homework | `/staff/create-homework` | Homework creation wizard | Step wizard, Class picker, Subject picker, due date, attachments | `/assignactivity/teacher/`, `/uploadimageActivity1/teacher/` | **Documented** |
| ST-12 | Quiz Manager | `/staff/quiz` | Assessment & exam overview | Tab bar (`Assigned`), Class selector, Subject filter, quiz status | `/getAssignedOptionQuiz/teacher/`, `/getAssignedFillQuiz/teacher/` | **Documented** |
| ST-13 | Create Quiz | `/staff/quiz/create_quiz` | Assessment authoring tool | Question type selector (MCQ, Fill, Match), Rich text, score rubric | `/createQuiz/quiz/`, `/updateOrInsertQuiz/quiz/`, `/uploadImage/quiz/` | **Documented** |
| ST-14 | Quiz Score View | `/staff/quiz/quizscoreview/:id/:studentKey` | Student exam evaluation & grade audit | Question audit stream, student answer vs correct key, manual override | `/getstudCompletedQuizReportsdata/quiz/`, `/getstudReportPreview/quiz/` | **Documented** |
| ST-15 | Buddy Worksheets | `/staff/worksheets` | Interactive digital exercise library | Worksheet data table, search input, pagination (10-50), Action buttons | `/getAllWorksheet/teacher/`, `/getAssignedWorksheet/teacher/` | **Documented** |
| ST-16 | Create Worksheet | `/staff/create-worksheet` | Drag-and-drop worksheet canvas | Canvas dropzone, item bank, match targets, image background uploader | `/createWorksheet/teacher/`, `/uploadimageWorksheet/teacher/` | **Documented** |
| ST-17 | Worksheet Score Review | `/staff/worksheets/draganddropscoreview/:id/:studentKey` | Visual verification of drag submissions | Completed canvas layout, correctness indicators (green/red), score | `/getWorksheetScore/teacher/`, `/getWorksheetincorrect/teacher/` | **Documented** |
| ST-18 | Student Roster | `/staff/studentlist` | Class student directory | Class dropdown, Section dropdown, Student avatar cards, action pills | `/getAllStudent/student/`, `/getClass/class` | **Documented** |
| ST-19 | Student Portfolio | `/staff/studentportfolio/:id1` | Holistic Progress Card (HPC) & growth | Student meta header, radar chart, term outcome breakdown, observations | `/staffstudentportfolio/portfolio/`, `/learningoutcomeportfolio/` | **Documented** |
| ST-20 | Teacher Profile | `/staff/staff-profile` | Teacher personal details & school info | Profile card, school identifier, assigned classes pill list, edit modal | `/updateTeacherDetails/profile/`, `/getstudentDetails/profile/` | **Documented** |
| ST-21 | Walkthrough Tour | `/staff/walkthrough` | Platform onboarding & interactive tour | Highlight step modals, interactive feature pointers, tour completion | `/getschoolid/walkthrough/`, `/getschoolid/walkthroughform/` | **Documented** |
| ST-22 | Class Chat | `/staff/chat` | Classroom broadcast & messaging | Conversation thread, online status indicator, text area, send trigger | `/staff/chat-message`, websocket / polling channel | **Documented** |
| ST-23 | Daily Attendance | `/staff/chat/lkg/attendance` | Daily classroom attendance roll call & counter | Student attendance radio grid (P/A/L), absent remarks, submit trigger | `/saveUsageData/user/`, Attendance API | **Documented** |
| ST-24 | School Social Feed | `/staff/updates&feeds` | Circulars, event photos & broadcast noticeboard | Timeline cards, channel filters, post creator, responsive mobile layout | Feed API, `/listpubhomepost/homesetting/` | **Documented** |
| ST-25 | Summative Exam Marks | `/studentMarks/exam/` | Direct gradebook for offline term examination marks | Mark entry table, maximum marks validation, auto-grade computation | `/studentMarks/exam/` | **Documented** |

---

## 2. Student Panel Page Inventory

| # | Page Title | Route (URL) | Primary Purpose | Key Widgets & Components | Backing API Endpoints | Status |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| SD-01 | Student Home | `/student/home` | Daily learning overview & tasks | Greeting banner, quick-start assignment pills, recent books carousel | `/listhomevideogallerystaff/homesetting/`, session feed | **Documented** |
| SD-02 | My Books | `/student/books` | Enrolled digital curriculum textbooks | Book cover gallery, search, grade filter, progress percentage badge | `/getAllstudLessons/lesson/`, `/getseriesbasedOnBook/book/` | **Documented** |
| SD-03 | Lesson Reader | `/student/books/lessons/:id` | Chapter index & digital activities | Lesson cards, video lesson triggers, interactive practice launchers | `/getAllstudLessons/lesson/`, `/getschoolid/walkthrough/` | **Documented** |
| SD-04 | Flipbook Reader | `/student/books/lessons/flip/:id1/:id2/` | Full-screen interactive reader | Page flip viewer, audio narrator (VOICE sync), pen tool, highlighter | `s3viewbooks/index.php`, S3 storage bucket | **Documented** |
| SD-05 | Resources | `/student/Resources` | Supplemental digital learning library | Video lesson grid, interactive simulation cards, download links | `/NewmenuToolsListStudent/moretools/`, `/MenumoreBuketFilesStudent/` | **Documented** |
| SD-06 | Assignments | `/student/homeworks` | HomeFun homework assignment portal | Tabs: `Pending`, `Completed`, `Overdue`; due date chips, submit button | `/getstudActivitiesReportsdata1/activity/`, `/getstudActivitiesReportscount/` | **Documented** |
| SD-07 | Attend Homework | `/student/homeworks/attendquiznew/:assignQuizKey` | Homework submission runner | Rich text answer editor, photo upload (camera/file), submit trigger | `/uploadstudActivity/activity/`, `/uploadstudActivity1/activity/` | **Documented** |
| SD-08 | Homework Result | `/student/homeworks/StudentQuizResultnew/:id1/:id2` | Graded homework review & teacher notes | Total score card, teacher feedback bubble, annotated attachment viewer | `/getstudCompletedActivities/activity/` | **Documented** |
| SD-09 | Online Tests | `/student/quiz` | Formal assessments & practice tests | Tabs: `Assigned`, `Completed`, `Missed`; test duration, start button | `/getstudQuizReportscount/quiz/`, `/getschoolOptionQuiz/quiz/` | **Documented** |
| SD-10 | Exam Taker | `/student/quiz/attendquiz/:assignQuizKey` | Timed examination runner | Countdown timer, question palette (1..N), review flag, finish dialog | `/studentOptionQuizAnswers/student/`, `/studentFillQuizAnswers/student/` | **Documented** |
| SD-11 | MCQ Runner | `/student/quiz/choose-the-correct-answer/:quizKey` | Multiple choice assessment player | Radio option cards, audio prompt player, instant validation (practice) | `/studentOptionQuizAnswers/student/` | **Documented** |
| SD-12 | Fill-in Blanks | `/student/quiz/fill-in-the-blanks/:quizKey` | Text input assessment player | Input blanks in sentence context, keyboard assistance | `/studentFillQuizAnswers/student/` | **Documented** |
| SD-13 | Match Pairs | `/student/quiz/match-the-following/:quizKey` | Drag-and-drop matching player | Left column cues, right column draggable responses, connecting lines | `/studentMatchQuizAnswers/student/` | **Documented** |
| SD-14 | Exam Result | `/student/Quiz/quizResult/:id1/:id2` | Score breakdown & analytics | Scorecard percentage dial, question review accordion, solution keys | `/getstudCompletedQuizReportsdata/quiz/` | **Documented** |
| SD-15 | Worksheets | `/student/worksheet` | Interactive exercise library | Buddy Worksheet data table, status pill (`Pending`/`Done`), action button | `/getAllWorksheetForClass/student/`, `/getWorksheetForClass/student/` | **Documented** |
| SD-16 | Worksheet Player| `/student/worksheets/draganddrop/:id` | Interactive canvas activity | Draggable labels, target target dropzones, audio cues, submit button | `/studCompleteImageWorksheet/activity/`, `/worksheetScores/student/` | **Documented** |
| SD-17 | Student LSR Hub | `https://lsr.chrysalis.world/student/level-test` | Listening, Speaking & Reading voice assessment suite | Audio narrator, "Tap to listen" trigger, microphone recorder, word cards | LSR Voice API, Speech Recognition Engine | **Documented** |
| SD-18 | LSR Listening Test | `https://lsr.chrysalis.world/student/level-test` (Listen) | Audio comprehension test with dynamic questions | Audio stream player, 3-option multiple choice answers (A, B, C) | LSR Speech API | **Documented** |
| SD-19 | LSR Speaking & Read | `https://lsr.chrysalis.world/student/level-test` (Speak/Read)| Real-time oral reading fluency & phonetics | Microphone permission gate, WebAudio recorder, pronunciation confidence | Web Speech API, Voice Scoring Model | **Documented** |
| SD-20 | My Portfolio | `/student/Portfolio` | Holistic student portfolio (HPC) | Academic year picker, radar chart of 5 competencies, reflection feed | `/Studentmyprofile/portfolio/`, `/Studentprofile/portfolio/` | **Documented** |
| SD-21 | Student Profile | `/student/student-profile` | Learner profile & enrollment details | Avatar, Student ID `618104`, Grade `5 - A`, School name, Parent info | `/updateStudentDetails/profile/`, `/getstudentDetails/profile/` | **Documented** |
| SD-22 | Class Messages | `/student/chat` | Classroom communication stream | Feed view of teacher broadcast messages, unread indicator | `/student/chat-message` | **Documented** |
| SD-23 | Student Notice Feed | `/student/updates&feeds` | School circulars, events, and student announcements | Timeline feed, circular attachments, responsive mobile view | Feed API, `/listpubhomepost/` | **Documented** |
| SD-24 | Access Denied | `/student/access-denied` | Subscription & digital paywall | "Purchase Now" button, book activation code input, contact school | Digital licensing service, `/studentqrregister/student` | **Documented** |

---

## 3. Administrative Panel Page Inventory

| # | Page Title | Route (URL) | Primary Purpose | Key Widgets & Components | Backing API Endpoints | Status |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| AD-01 | School Admin Home | `/schooladmin/home` | Institutional executive dashboard | KPI cards: Teachers, Students, Classes, Homework Completion %, Graphs | `/getschooldetails2/school`, `/getpublisherSchoolCount/insight/` | **Documented** |
| AD-02 | Admin Tools Console | `/schooladmin/admintools` | Centralized administrative hub | Tab 1: Classes, Tab 2: Teachers, Tab 3: Students, Tab 4: Subjects | Redux state dispatchers, bulk actions | **Documented** |
| AD-03 | Class Management | `/schooladmin/admintools/class` | Create & structure grades and sections | Class table, Add Class modal, Section capacity editor, Assign Teacher | `/getAllClasses/class/`, `/SelectschoolClass/class/`, `/updateClass/` | **Documented** |
| AD-04 | Teacher Roster | `/schooladmin/admintools/teacher` | Staff account lifecycle & allocations | Teacher table, Add Teacher modal, Subject & Class allocation badges | `/getAllTeacher/teacher/`, `/createTeacher/teacher/`, `/bulkcreateTeacher/`| **Documented** |
| AD-05 | Student Enrollment | `/schooladmin/admintools/student` | Student registration & roll management | Student table, Add Student modal, Roll No template download, CSV import | `/getAllStudent/student/`, `/createStudent1/student/`, `/bulkupload/student`| **Documented** |
| AD-06 | Batch Migration | `/schooladmin/admintools/student/restore` | Academic year student promotion | Batch promotion selector, roll number reassignment, archive tool | `/updateStudentsBatchmigration/student/`, `/restoreStudent/student/` | **Documented** |
| AD-07 | Subject Curriculum | `/schooladmin/admintools/subjects` | Subject & course catalog mapping | Subject list, Add Subject form, Class-to-Subject multi-select mapping | `/getAllSubjects/subject/`, `/createschoolSubject/schoolsubject/` | **Documented** |
| AD-08 | Book Allocation | `/schooladmin/books` | Assign digital curriculum to classes | Book-to-Grade assignment matrix, series filter, licensing toggle | `/mapBookToSchool/book/`, `/getAllBooksForMapping/book/` | **Documented** |
| AD-09 | Homework Monitor | `/schooladmin/homeworks` | Institutional homework tracking | Class-wise homework submission rate table, overdue alerts, filter bar | `/getAdminHomeworkReportList1/insight/` | **Documented** |
| AD-10 | Exam Governance | `/schooladmin/quiz` | School-wide examination analytics | Exam schedules, average score distribution, question discrimination index | `/getassignquizadmininsight/insight/`, `/schooladmin/quizreport/:id1` | **Documented** |
| AD-11 | School Insights | `/schooladmin/insights` | Institutional business intelligence | Student engagement trends, teacher activity logs, monthly usage graphs | `/getpublisherMonthlyChart/insight/`, `/saveUsageData/user/` | **Documented** |
| AD-12 | Institutional Portfolio | `/schooladmin/studentportfolio/:id1` | Administrative review of student growth | Full institutional transcript, holistic progress verification, print report | `/adminstudentportfolio/portfolio/`, `/adminClassStudentData/` | **Documented** |
| AD-13 | Super: School Directory | `/admin/schools` | Multi-tenant school onboarding | School directory table, Create School modal, Domain setting, License plan | `/createSchool/school/`, `/updateSchool/school/`, `/deleteSchool/` | **Documented** |
| AD-14 | Super: Access Control | `/admin/access-control` | Granular permission & feature matrix | School selector, feature toggle checkboxes (Books, Quizzes, AI, HW) | `/insertOrUpdateAccessControl/school/`, `/updateSchoolAccessControl/` | **Documented** |
| AD-15 | Super: QR Codes | `/admin/bookqrstatus` | Physical textbook digital registration | QR batch generation table, download print-ready PDFs, scan audit | `/getAllbookqrStatus/book/`, `/QrGenerateRequest/book/` | **Documented** |
| AD-16 | Super: CMS & Banners | `/admin/homesetting` | Platform announcement governance | Banner image uploader, video link manager, platform news broadcaster | `/addhomebanner/homesetting/`, `/addvideo/homesetting/`, `/updatehomebanner`| **Documented** |

