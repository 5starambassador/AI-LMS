# 02. COMPLETE NAVIGATION MAP & ROUTING MATRIX

## 1. Global Navigation Architecture

The application implements a multi-tier routing model divided into three core user panels, supported by a shared authentication subsystem.

```
+-----------------------------------------------------------------------------------------+
|                                    GLOBAL ROUTING MAP                                   |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  [ Auth Subsystem ]                                                                     |
|    |-- /login, /login/:token, /sso-login, /forgot-password, /lock-screen, /logout       |
|                                                                                         |
|  [ Panel 1: Staff / Teacher Panel ]                                                     |
|    |-- /staff/home ......................... Dashboard, Video Gallery, Day Webinars     |
|    |-- /staff/books ........................ Curriculum Books Catalog                   |
|    |     |-- /staff/books/lessons/:id ...... Lesson Outline & Topic List                |
|    |     |-- /staff/books/lessons/flip/:id1/:id2 ... Interactive S3 Flipbook Viewer     |
|    |     `-- /staff/books/lessons/pagebuilder ...... Content Page Authoring Engine      |
|    |-- /staff/Resources .................... Digital Learning Resources & Tools         |
|    |-- /staff/aitools ...................... AI Lesson Planner, Prompts, AI-Cam         |
|    |-- /staff/myspace ...................... Professional Development (PD) & PPG        |
|    |-- /staff/homeworks .................... HomeFun (Created, Assigned, Submissions)   |
|    |     `-- /staff/create-homework ........ Homework Authoring Wizard                  |
|    |-- /staff/quiz ......................... Assessment Engine Dashboard                |
|    |     |-- /staff/quiz/create_quiz ....... MCQ, Fill-in-Blanks, Match Pairs Builder   |
|    |     |-- /staff/quiz/preview/:quizId ... Interactive Quiz Preview                   |
|    |     `-- /staff/quiz/quizscoreview/:id/:studentKey ... Submission Score Review      |
|    |-- /staff/worksheets ................... Buddy Worksheets List                      |
|    |     |-- /staff/create-worksheet ....... Drag-and-Drop Worksheet Creator            |
|    |     `-- /staff/worksheets/draganddropscoreview/:id/:studentKey ... Score View      |
|    |-- /staff/studentlist .................. Student Class Roster                       |
|    |     `-- /staff/studentportfolio/:id1 .. Student Portfolio & Holistic Report        |
|    |-- /staff/chat ......................... Real-Time Communication & Messages         |
|    `-- /staff/staff-profile ................ Teacher Profile & Account Settings         |
|                                                                                         |
|  [ Panel 2: Student Panel ]                                                             |
|    |-- /student/home ....................... Student Home & Daily Learning Feed         |
|    |-- /student/books ...................... My Assigned Textbooks & Flipbooks          |
|    |     `-- /student/books/lessons/flip/:id1/:id2/ ... Digital Reader                  |
|    |-- /student/Resources .................. Digital Learning Multimedia & Video Lessons|
|    |-- /student/homeworks .................. HomeFun (Pending, Completed, Overdue)      |
|    |     `-- /student/homeworks/attendquiznew/:assignQuizKey ... Homework Submission    |
|    |-- /student/quiz ....................... Online Tests (Assigned, Completed, Missed) |
|    |     |-- /student/quiz/attendquiz/:assignQuizKey ... Online Exam Taker              |
|    |     `-- /student/Quiz/quizResult/:id1/:id2 ... Results, Scorecard & Solutions      |
|    |-- /student/worksheet .................. Buddy Interactive Worksheets               |
|    |     `-- /student/worksheets/draganddrop/:id ... Interactive Exercise Canvas        |
|    |-- /student/Portfolio .................. Student Portfolio, Term Milestones & HPC   |
|    |-- /student/chat ....................... Class Communication Channel                |
|    |-- /student/student-profile ............ Learner Profile & School Enrollment Info   |
|    `-- /student/access-denied .............. Subscription & Payment Wall                |
|                                                                                         |
|  [ Panel 3: Administrative Panel ]                                                      |
|    |-- Institutional (School Admin)                                                     |
|    |     |-- /schooladmin/home ............. School Executive Dashboard & Analytics     |
|    |     |-- /schooladmin/admintools ....... Admin Control Center (Tabs 1-4)            |
|    |     |     |-- /teacher ................ Teacher Roster, Allocations & Bulk Create  |
|    |     |     |-- /student ................ Student Enrollment & Batch Migration       |
|    |     |     |-- /class .................. Classes & Sections Setup                   |
|    |     |     `-- /subjects ............... Subject Curriculum Mapping                 |
|    |     |-- /schooladmin/books ............ School Textbook Allocation Matrix          |
|    |     |-- /schooladmin/resources ........ Institutional Resource Repository          |
|    |     |-- /schooladmin/homeworks ........ School-Wide Homework Compliance Reports    |
|    |     |-- /schooladmin/quiz ............. Institutional Exam Analytics               |
|    |     `-- /schooladmin/insights ......... Student Engagement & Learning Analytics    |
|    `-- Enterprise (Super Admin)                                                         |
|          |-- /admin/schools ................ Multi-Tenant School Provisioning & License |
|          |-- /admin/access-control ......... Granular RBAC Permission Matrix & Toggles  |
|          |-- /admin/publisherlist .......... Content Publisher Catalog & Contracts      |
|          |-- /admin/books .................. Master Textbook Catalog & Publishing       |
|          |-- /admin/bookqrstatus ........... QR Code Physical-to-Digital Sync           |
|          `-- /admin/homesetting ............ Platform Banners, Videos & Announcements   |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Staff Panel Navigation Specification

| Navigation Menu Item | Target Route | Submenu / Child Actions | Query / State Parameters | Access Guard |
| :--- | :--- | :--- | :--- | :--- |
| **Home** | `/staff/home` | Video Gallery, Chrysalis Day, Webinars, Quick Stats | None | `Teacher` role |
| **Books** | `/staff/books` | Filter by Grade (`All`, `Grade 1` - `Grade 12`), Recents, All Books | None | `book_visibility === 1` |
| ↳ Book Lessons | `/staff/books/lessons/:id` | View chapter list, topics, digital assets | `id: pk_book_key` | Assigned class |
| ↳ Flipbook Viewer | `/staff/books/lessons/flip/:id1/:id2` | Interactive textbook page flip viewer | `id1: bookKey, id2: lessonKey` | Book access |
| ↳ Page Builder | `/staff/books/lessons/pagebuilder` | Rich text, multimedia, exercise attachment | None | Publishing flag |
| **Resources** | `/staff/Resources` | More Tools, HPC Guides, Lesson Resources | None | `Teacher` role |
| ↳ View Resource | `/staff/viewresources/:id1` | Multimedia view, PDF download, video player | `id1: resourceKey` | Resource access |
| **AI Tools** | `/staff/aitools` | HPC/COMPASS (Autograde, HPC), SCORE (Exam Builder, Assign Exam, Exam Grader, Grading Runs, Exam Insights), VOICE (LSR Dashboard) | None | `ai_tools_visibility === 1` |
| ↳ Autograde | `/staff/aitools/autograde` | AI-powered grading of student written text & handwriting | None | AI Suite access |
| ↳ Holistic Progress Card | `/staff/aitools/hpc` | Record observations across domains, build & share HPC | None | HPC access |
| ↳ Exam Builder | `/staff/aitools/exam-builder` | Generate and configure exams with AI | None | Score access |
| ↳ Assign Exam | `/staff/aitools/assign-exam` | Generate personalised exam copies for a class as batch PDF | None | Score access |
| ↳ Exam Grader | `/staff/aitools/exam-grader` | Grade scanned physical exams and debug pipeline | None | Score access |
| ↳ Grading Runs | `/staff/aitools/grading-runs` | Reopen an exam you have already scanned or graded | None | Score access |
| ↳ Exam Insights | `/staff/aitools/exam-insights` | Review class-level performance across graded exams | None | Score access |
| ↳ LSR Dashboard | `https://lsr.chrysalis.world` | Listening, Speaking & Reading audio analytics (Voice platform) | SSO Token | Voice access |
| ↳ Activity Library | `/staff/aitools/activity-library` | Ready-to-show multimedia videos and classroom activities per lesson | None | Resource access |
| **My Space** | `/staff/myspace` | Professional Development (PD), PPG Guide | None | `Teacher` role |
| **HomeFun (Homework)** | `/staff/homeworks` | Tabs: `Created`, `Assigned`, `Submissions` | None | `homework_visibility === 1` |
| ↳ Create Homework | `/staff/create-homework` | Homework authoring wizard, deadline setting, rubric | None | Homework access |
| **Quiz & Exams** | `/staff/quiz` | Tabs: `Assigned`, `Subject Filter`, `Class Filter` | None | `quiz_visibility === 1` |
| ↳ Create Quiz | `/staff/quiz/create_quiz` | MCQ, Fill in the Blanks, Match Following | None | Quiz permission |
| ↳ Score Review | `/staff/quiz/quizscoreview/:id/:studentKey` | Grade view, answer audit, feedback input | `id: quizId, studentKey: pk_student_key` | Assigned student |
| **Worksheets** | `/staff/worksheets` | Buddy Worksheets table, show 10/20/50 rows | None | `Teacher` role |
| ↳ Create Worksheet | `/staff/create-worksheet` | Drag-and-drop interactive exercise canvas | None | Worksheet creator |
| ↳ Score View | `/staff/worksheets/draganddropscoreview/:id/:studentKey` | Visual verification of drag and drop matches | `id: sheetId, studentKey` | Evaluator |
| **Students** | `/staff/studentlist` | Class dropdown, Section dropdown, Student roster | None | Assigned classes |
| ↳ Student Portfolio | `/staff/studentportfolio/:id1` | Holistic Progress Card (HPC), term reports | `id1: pk_student_key` | Student enrollment |
| **Communication** | `/staff/chat` | Classroom messaging, attendance messages | None | Teacher active |
| ↳ Daily Attendance | `/staff/chat/lkg/attendance` | Roll call marking (Present/Absent/Late), working days count | None | Teacher active |
| **Notice Feed** | `/staff/updates&feeds` | Circulars, event photos, announcements (Desktop & `/responsive`) | None | Teacher active |
| **Summative Marks**| `/studentMarks/exam/` | Direct gradebook for offline term examination marks | None | Teacher active |
| **Profile** | `/staff/staff-profile` | Teacher details, school info, password update | None | Authenticated |

---

## 3. Student Panel Navigation Specification

| Navigation Menu Item | Target Route | Submenu / Child Actions | Query / State Parameters | Access Guard |
| :--- | :--- | :--- | :--- | :--- |
| **Home** | `/student/home` | Daily schedule, current announcements, quick resume | None | `Student` / `Parent` role |
| **My Books** | `/student/books` | Filter: `All`, `Recents`. Digital textbooks list | None | `book_visibility === 1` |
| ↳ Lessons | `/student/books/lessons/:id` | Chapter index, audio-visual resources | `id: pk_book_key` | Enrolled subject |
| ↳ Flipbook | `/student/books/lessons/flip/:id1/:id2/` | Full-screen interactive textbook reader | `id1, id2` | Enrolled subject |
| **Resources** | `/student/Resources` | Digital Learning Media, Video Library | None | `Student` role |
| ↳ Resource Viewer | `/student/viewresources/:id1` | Interactive simulation, video lesson, reading material | `id1: resourceKey` | Free/Purchased |
| **Assignments** | `/student/homeworks` | Tabs: `Pending`, `Completed`, `Overdue` | None | `homework_visibility === 1` |
| ↳ Attend Homework | `/student/homeworks/attendquiznew/:assignQuizKey` | Complete questions, file attachment, submit | `assignQuizKey` | Pending status |
| ↳ Homework Result | `/student/homeworks/StudentQuizResultnew/:id1/:id2` | Score, teacher remarks, solution keys | `id1, id2` | Completed status |
| **Assessments** | `/student/quiz` | Tabs: `Assigned`, `Completed`, `Missed` | None | `quiz_visibility === 1` |
| ↳ Quiz Taker | `/student/quiz/attendquiz/:assignQuizKey` | Timed exam runner, auto-save, question tracker | `assignQuizKey` | Active schedule |
| ↳ Question Types | `/student/quiz/choose-the-correct-answer/:quizKey` | Multiple choice assessment runner | `quizKey` | Active exam |
| ↳ Question Types | `/student/quiz/fill-in-the-blanks/:quizKey` | Type-in blanks assessment runner | `quizKey` | Active exam |
| ↳ Question Types | `/student/quiz/match-the-following/:quizKey` | Interactive drag-and-match pairs runner | `quizKey` | Active exam |
| ↳ Quiz Result | `/student/Quiz/quizResult/:id1/:id2` | Comprehensive score breakdown, solution audit | `id1: quizId, id2: studentId` | Graded |
| **Worksheets** | `/student/worksheet` | Buddy Worksheet list, status badges | None | `Student` role |
| ↳ Worksheet Player | `/student/worksheets/draganddrop/:id` | Drag items to target slots, check score | `id: worksheetKey` | Assigned status |
| **Voice & LSR Suite** | `https://lsr.chrysalis.world/student/level-test` | Listening, Speaking & Reading interactive voice learning suite | SSO / Student Token | `voice_visibility === 1` |
| ↳ Listening Test | `https://lsr.chrysalis.world/student/level-test` (Listen) | Audio comprehension: "Tap to listen", audio player, multiple-choice questions | None | Active assessment |
| ↳ Speaking Test | `https://lsr.chrysalis.world/student/level-test` (Speak) | Oral reading fluency: microphone recorder, phonetics confidence analysis | Mic permission | Active assessment |
| ↳ Read Words | `https://lsr.chrysalis.world/student/level-test` (Read) | Vocabulary reading, pronunciation accuracy, syllable stress scoring | Mic permission | Active assessment |
| **My Portfolio** | `/student/Portfolio` | Holistic Progress Card (HPC), term radar chart | None | `portfolio_visibility === 1` |
| **Messages** | `/student/chat` | View teacher announcements, class feed | None | `Student` role |
| **Notice Feed** | `/student/updates&feeds` | View school circulars, events, and student notices | None | `Student` role |
| **Profile** | `/student/student-profile` | Student ID, Grade, Section, Parent Details | None | Authenticated |
| **Paywall** | `/student/access-denied` | "Purchase Now" button, book license activation | None | Unlicensed account |

---

## 4. Admin Panel Navigation Specification

| Navigation Menu Item | Target Route | Submenu / Child Actions | Query / State Parameters | Access Guard |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `/schooladmin/home` | Institutional KPIs, teacher count, student count, active classes | None | `School Admin` |
| **Admin Tools** | `/schooladmin/admintools` | Tabbed Management Console (Tabs 1-4) | `state: {activeTab}` | `School Admin` |
| ↳ Class Management | `/schooladmin/admintools/class` | Create Class, Section allocation, Capacity | `activeTab: "1"` | Admin permission |
| ↳ Teacher Management | `/schooladmin/admintools/teacher` | Add Teacher, Edit Teacher, Bulk CSV Upload, Role | `activeTab: "2"` | Admin permission |
| ↳ Student Management | `/schooladmin/admintools/student` | Add Student, Edit Student, Batch Migration, Restore | `activeTab: "3"` | Admin permission |
| ↳ Subject Mapping | `/schooladmin/admintools/subjects` | Create Subject, Map Class to Subject | `activeTab: "4"` | Admin permission |
| **Curriculum Books** | `/schooladmin/books` | Map Books to Grades, Series allocation | None | `School Admin` |
| **Homework Reports** | `/schooladmin/homeworks` | School-wide homework compliance & tracking | None | `School Admin` |
| **Quiz Analytics** | `/schooladmin/quiz` | Institution exam performance, question-level analysis | None | `School Admin` |
| **Performance Insights**| `/schooladmin/insights` | Engagement metrics, active users, weekly trends | None | `School Admin` |
| **Super Admin: Schools**| `/admin/schools` | Multi-tenant school creation, subscription plans | None | `Super Admin` |
| **Super Admin: Security**| `/admin/access-control`| Feature flag configuration per school / role | None | `Super Admin` |
| **Super Admin: QR Codes**| `/admin/bookqrstatus` | QR batch generation for physical books | None | `Super Admin` |
| **Super Admin: Banners** | `/admin/homesetting` | Global banners, video gallery, promotional updates | None | `Super Admin` |

