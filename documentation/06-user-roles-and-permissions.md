# 06. ENTERPRISE ACCESS PERMISSION CONTROL & RBAC SPECIFICATION

## 1. Executive Access Control Architecture

The platform implements an **Enterprise Hybrid RBAC + ABAC (Role-Based & Attribute-Based Access Control) Engine** designed to scale from a single school to a multi-campus educational organization.

Access governance is enforced across four hierarchical boundaries:
1. **Organization / Trust Level** (Multi-Campus Global Scope)
2. **Campus / School Level** (Tenant Branch Scope via `pk_school_key`)
3. **Department / Grade / Section Scope** (Class Cohort Scope via `fk_class_key`, `fk_section_key`)
4. **Subject Scope** (Subject Specialization via `fk_subject_key`)

```
+---------------------------------------------------------------------------------------------------+
|                              HIERARCHICAL ACCESS CONTROL MODEL                                    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [ LEVEL 1: SUPER ADMIN / TRUST HQ ] ............. Global Multi-Campus Authority                  |
|    |-- Can define master roles, permission sets, campus licenses, and global feature gates       |
|                                                                                                   |
|  [ LEVEL 2: CAMPUS ADMIN / PRINCIPAL ] ........... Campus Branch Scope (pk_school_key)            |
|    |-- Can allocate local staff permissions, manage branch rosters, and view campus audits        |
|                                                                                                   |
|  [ LEVEL 3: COORDINATOR / HOD ] .................. Department / Grade Level Scope                 |
|    |-- Can review exam blueprints, approve homework, monitor grade-level pacing                   |
|                                                                                                   |
|  [ LEVEL 4: CLASS & SUBJECT TEACHER ] ............ Assigned Class & Subject Scope                 |
|    |-- Can create homework, build quizzes, grade student submissions for assigned cohorts only    |
|                                                                                                   |
|  [ LEVEL 5: STUDENT / LEARNER ] .................. Individual Self Record Scope                   |
|    |-- Can access licensed textbooks, submit homework, take assigned tests, view own results     |
|                                                                                                   |
|  [ LEVEL 6: PARENT / GUARDIAN ] .................. Linked Ward(s) Scope                           |
|    |-- Can view linked child's attendance, submissions, grades, and Holistic Progress Cards       |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Granular Permissions Registry (Permission Nodes)

Every action in the system is mapped to an atomic permission string. Permissions are grouped into 10 functional domains:

### Domain 1: Multi-Campus & Tenant Governance (`tenant.*`)
- `tenant.campus.create`: Provision a new school campus / branch.
- `tenant.campus.read`: View campus directories, metadata, and license status.
- `tenant.campus.update`: Modify campus configurations, boards, domains, and branding.
- `tenant.campus.delete`: Soft-delete or archive a campus tenant.
- `tenant.license.manage`: Allocate student/teacher seat quotas, AI quotas, and module flags.

### Domain 2: Access & Permission Management (`security.*`)
- `security.role.create`: Define new custom roles (e.g. Exam Controller, Librarian).
- `security.role.manage`: Assign/revoke granular permissions to roles.
- `security.user.assign_role`: Grant roles to users.
- `security.permission.override`: Apply user-specific permission overrides (grant/deny).
- `security.audit.read`: Inspect system security logs, login history, and permission changes.

### Domain 3: Academic Structure (`academic.*`)
- `academic.batch.manage`: Manage academic years, batch promotion, and student migration.
- `academic.class.manage`: Create and edit classes, grades, sections, and section capacities.
- `academic.subject.manage`: Create master subjects and map them to classes.
- `academic.timetable.manage`: Configure class schedules and teaching periods.

### Domain 4: User Directory & Lifecycle (`user.*`)
- `user.admin.manage`: Create and manage branch administrators.
- `user.teacher.create`: Add individual teachers and execute bulk CSV onboarding.
- `user.teacher.allocate`: Assign classes and subjects to teachers.
- `user.student.create`: Enroll students and execute bulk Excel/roll number onboarding.
- `user.student.transfer`: Execute inter-campus student branch transfers.
- `user.parent.link`: Associate parent/guardian accounts with enrolled students.

### Domain 5: Curriculum & Content Authoring (`content.*`)
- `content.book.manage`: Upload and curate digital textbooks and master series.
- `content.book.allocate`: Map digital books to specific grades and schools.
- `content.flipbook.read`: Access the interactive S3 flipbook reader.
- `content.lesson.create`: Author custom digital lessons, topics, and multimedia pages.
- `content.resource.manage`: Curate and upload teaching videos, simulations, and HPC toolkits.

### Domain 6: Homework & Daily Activities (`homework.*`)
- `homework.create`: Author homework tasks, instructions, and due dates.
- `homework.assign`: Publish homework to specific classes and sections.
- `homework.submit`: Submit homework responses (text + file uploads) [Student only].
- `homework.evaluate`: Grade homework submissions, enter qualitative feedback, and score.
- `homework.report.read`: View class-level and institution-level homework completion rates.

### Domain 7: Quizzes & Formal Examinations (`exam.*`)
- `exam.author`: Build quizzes and tests (MCQ, Fill in the Blanks, Match Pairs).
- `exam.schedule`: Schedule online exams with timers and start/end windows.
- `exam.take`: Launch and execute online examination runner [Student only].
- `exam.grade.auto`: Execute automated grading pipeline for online submissions.
- `exam.grade.manual`: Review, override scores, and mark subjective responses.
- `exam.report.read`: Inspect class item difficulty, question discrimination, and analytics.

### Domain 8: SCORE AI Exam & Physical Paper Pipeline (`score.*`)
- `score.exambuilder.use`: Generate complete exams using AI syllabus synthesis.
- `score.assign.batchpdf`: Generate personalized student test copies with QR codes as batch PDF.
- `score.grader.scan`: Ingest scanned physical exam sheets via AI Cam or batch scanner.
- `score.grader.runs`: Review OCR confidence runs, handwriting ambiguities, and overrides.
- `score.insights.read`: View longitudinal exam analytics and branch-level metrics.

### Domain 9: Holistic Student Portfolios & HPC (`portfolio.*`)
- `portfolio.domain.record`: Enter observational qualitative notes across 5 developmental domains.
- `portfolio.card.generate`: Build, finalize, and sign Holistic Progress Cards (HPC).
- `portfolio.view.own`: View personal learning portfolio and competency radar chart [Student].
- `portfolio.view.ward`: View child's learning portfolio and growth timeline [Parent].
- `portfolio.export.pdf`: Download print-ready official term report cards.

### Domain 10: AI Teaching Assistant & Voice LSR (`ai.*`)
- `ai.lesson.generate`: Use Generative AI for lesson planning and pedagogical structuring.
- `ai.assessment.generate`: Auto-generate question items from chapter text.
- `ai.cam.ocr`: Use live camera OCR for instant document parsing.
- `ai.voice.lsr`: Access the Listening, Speaking, and Reading phonetics analytics suite (`lsr.chrysalis.world`).

---

## 3. Client Domain Partitioning & Login Boundary Enforcement

> [!IMPORTANT]
> **Strict Gateway Authentication Partitioning:**
> - **Teacher / Staff / Administrative Gateway (`https://learning.chrysalis.world/`)**:
>   - Exclusively authenticates **Super Admins, Regional Managers, School Admins, Uploaders, Coordinators, and Teachers**.
>   - Unauthorized student login attempts trigger role-gating redirects to the mobile application or `lsr.chrysalis.world`.
> - **Student & Parent Gateways**:
>   1. **Web Browser (`https://lsr.chrysalis.world/`)**: Student-facing browser endpoint for **Voice & Language Learning (Listening, Speaking, Reading)**, speech evaluations, and reading tests.
>   2. **Mobile Application (`com.chrysalis.app`)**: Primary daily touchpoint on Android/iOS for daily homework, quizzes, digital flipbooks, portfolios, school circular feeds, and attendance tracking.

---

## 4. Comprehensive Master Role Permission Matrix

The table below defines default permissions across standard enterprise roles:
- **ALL**: Unrestricted access across all campuses.
- **BRANCH**: Restricted strictly to user's assigned school campus (`pk_school_key`).
- **ASSIGNED**: Restricted strictly to teacher's allocated classes/subjects.
- **OWN**: Restricted strictly to student's own record or parent's linked child.
- **DENIED (`-`)**: No access permitted.

| Permission Domain & Capability | Super Admin (Group HQ) | Campus Admin (Principal) | Coordinator / HOD | Teacher / Staff | Student | Parent |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Multi-Campus Provisioning (`tenant.campus.*`)** | **ALL** | - | - | - | - | - |
| **Global Licensing & Quotas (`tenant.license.*`)** | **ALL** | - | - | - | - | - |
| **Custom Roles & Permissions (`security.role.*`)** | **ALL** | - | - | - | - | - |
| **Security Audit Logs (`security.audit.*`)** | **ALL** | **BRANCH** | - | - | - | - |
| **Class & Section Setup (`academic.class.*`)** | **ALL** | **BRANCH** | - | - | - | - |
| **Subject Curriculum Mapping (`academic.subject.*`)**| **ALL** | **BRANCH** | - | - | - | - |
| **Batch Academic Migration (`academic.batch.*`)** | **ALL** | **BRANCH** | - | - | - | - |
| **Teacher Account Management (`user.teacher.*`)** | **ALL** | **BRANCH** | - | - | - | - |
| **Teacher Class Allocation (`user.teacher.allocate`)**| **ALL** | **BRANCH** | - | - | - | - |
| **Student Enrollment & CSV Import (`user.student.*`)**| **ALL** | **BRANCH** | - | - | - | - |
| **Inter-Campus Student Transfers (`user.student.transfer`)**| **ALL** | **BRANCH** (Request)| - | - | - | - |
| **Parent-Child Account Linking (`user.parent.*`)** | **ALL** | **BRANCH** | - | - | - | - |
| **Master Books Catalog (`content.book.manage`)** | **ALL** | - | - | - | - | - |
| **Campus Book Allocation (`content.book.allocate`)** | **ALL** | **BRANCH** | - | - | - | - |
| **Flipbook Digital Reader (`content.flipbook.read`)**| **ALL** | **BRANCH** | **BRANCH** | **ASSIGNED** | **OWN** (Licensed)| **OWN** (Licensed)|
| **Create/Assign Homework (`homework.create/assign`)**| **ALL** | **BRANCH** | **BRANCH** | **ASSIGNED** | - | - |
| **Submit Homework (`homework.submit`)** | - | - | - | - | **OWN** | - |
| **Grade Homework Submissions (`homework.evaluate`)** | **ALL** | **BRANCH** | **BRANCH** | **ASSIGNED** | - | - |
| **Homework Compliance Reports (`homework.report.*`)**| **ALL** | **BRANCH** | **BRANCH** | **ASSIGNED** | **OWN** | **OWN** |
| **Create Quizzes & Exams (`exam.author`)** | **ALL** | **BRANCH** | **BRANCH** | **ASSIGNED** | - | - |
| **Launch & Take Online Tests (`exam.take`)** | - | - | - | - | **OWN** | - |
| **Exam Score Review & Overrides (`exam.grade.*`)** | **ALL** | **BRANCH** | **BRANCH** | **ASSIGNED** | - | - |
| **AI Exam Builder & Batch PDF (`score.*`)** | **ALL** | **BRANCH** | **BRANCH** | **ASSIGNED** | - | - |
| **Scan Grader & Runs Audit (`score.grader.*`)** | **ALL** | **BRANCH** | **BRANCH** | **ASSIGNED** | - | - |
| **HPC Portfolio Observations (`portfolio.domain.*`)**| **ALL** | **BRANCH** | **BRANCH** | **ASSIGNED** | - | - |
| **View Portfolio & HPC Radar (`portfolio.view.*`)** | **ALL** | **BRANCH** | **BRANCH** | **ASSIGNED** | **OWN** | **OWN** |
| **AI Lesson Planner & Prompts (`ai.lesson.*`)** | **ALL** | **BRANCH** | **BRANCH** | **ASSIGNED** (Quota)| - | - |
| **Voice LSR Analytics (`ai.voice.lsr`)** | **ALL** | **BRANCH** | **BRANCH** | **ASSIGNED** | **OWN** | **OWN** |
| **Cross-Campus Analytics & BI (`reports.global`)** | **ALL** | - | - | - | - | - |

---

## 4. Dynamic Permission Set & Custom Role Builder

In addition to static defaults, the Super Admin has full authority to construct **Custom Permission Sets**:

```
+---------------------------------------------------------------------------------------------------+
|                              SUPER ADMIN CUSTOM ROLE BUILDER                                      |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  Role Name: [ Exam Cell Controller                          ]                                     |
|  Assigned Scope: [ Campus Specific v ]  Target Campus: [ Achariya Campus 1 - Villianur v ]        |
|                                                                                                   |
|  Permission Toggles:                                                                              |
|  [x] exam.author               [x] exam.schedule            [x] exam.grade.manual                 |
|  [x] score.exambuilder.use     [x] score.assign.batchpdf    [x] score.grader.scan                 |
|  [x] score.grader.runs         [x] score.insights.read      [ ] user.teacher.create (Disabled)    |
|  [ ] academic.class.manage     [ ] tenant.campus.create     [x] academic.timetable.manage         |
|                                                                                                   |
|  [ Cancel ]                                                            [ Save Role Definition ]   |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 5. Backend Enforcement & Security Verification Rules

1. **Dual-Layer Gatekeeping**:
   - **Layer 1 (Route Middleware)**: Verifies that the JWT contains the required permission token or role scope before invoking the controller.
   - **Layer 2 (Database Data Scoping)**: Automatically injects tenant and entity constraints into every SQL query:
     ```sql
     -- For Campus Admin:
     WHERE school_id = :session_school_key

     -- For Teacher:
     WHERE school_id = :session_school_key 
       AND class_id IN (SELECT class_id FROM tbl_teacher_allocations WHERE teacher_id = :session_user_id)
       AND subject_id IN (SELECT subject_id FROM tbl_teacher_allocations WHERE teacher_id = :session_user_id)

     -- For Student:
     WHERE student_id = :session_user_id
     ```

2. **Zero Client-Side Trust**:
   - Menu items and buttons are hidden purely for user experience. 
   - A direct API call bypassing the UI without the required permissions returns an immediate `HTTP 403 Forbidden` with a standardized audit error:
     ```json
     {
       "error": "FORBIDDEN",
       "message": "User lacks required permission: [homework.evaluate]",
       "required_permission": "homework.evaluate",
       "timestamp": "2026-11-06T10:55:00Z"
     }
     ```

3. **Dynamic Feature Flag Override**:
   - Even if a role possesses a permission (e.g. `ai.lesson.generate`), if the campus-level license disables AI tools (`ai_tools_visibility: 0`), the middleware blocks execution with an institutional entitlement notice.
