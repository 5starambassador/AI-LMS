# 05. ADMINISTRATIVE PANEL MODULE INVENTORY

This document details the functional specifications, database models, workflows, and administrative controls across the **School Administrator** and **Super Administrator** interfaces.

---

## Part A: School Administrator Modules

### Module 1: Institutional Executive Dashboard (`/schooladmin/home`)

#### Purpose
Provides the school principal, vice-principal, or academic director with high-level institutional metrics, active teaching rosters, student engagement, and compliance tracking.

#### Visual Components & KPIs
1. **Summary Stat Cards**:
   - `Total Active Teachers`: Number of teaching faculty onboarded.
   - `Total Enrolled Students`: Student population across all grades.
   - `Total Classes & Sections`: Count of active learning cohorts.
   - `Homework Completion Rate`: Percentage of submitted assignments across school.
2. **Academic Performance Heatmap**:
   - Class-by-class comparison of average quiz scores and syllabus completion velocity.
3. **Institutional Activity Feed**:
   - Real-time audit trail of newly created quizzes, assigned homework, and teacher log-ins.

#### Backing API Endpoints
- `POST /apis/api_index.php` -> `/getschooldetails2/school`
- `POST /apis/api_index.php` -> `/getpublisherSchoolCount/insight/`
- `POST /apis/api_index.php` -> `/getpublisherMonthlyChart/insight/`

---

### Module 2: Admin Tools Control Center (`/schooladmin/admintools`)

#### Purpose
The core management console for school administrators, structured into four tabs:
- **Tab 1: Classes & Sections**
- **Tab 2: Teachers & Allocations**
- **Tab 3: Students & Enrollments**
- **Tab 4: Subjects & Curriculum Mapping**

```
+-----------------------------------------------------------------------------------------+
|                          SCHOOL ADMIN TOOLS CONSOLE                                     |
+-----------------------------------------------------------------------------------------+
|  [ Tab 1: Classes ]  |  [ Tab 2: Teachers ]  |  [ Tab 3: Students ]  |  [ Tab 4: Subjects ]|
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  Current Active Tab Content: Data Grid + Search Filter + Action Bar                     |
|  - Action Buttons: [+ Add Entity]  [Import CSV]  [Export Report]  [Batch Operations]    |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

---

### Submodule 2.1: Class Management (`/schooladmin/admintools/class`)

#### Visual Components & Forms
1. **Class Listing Table**:
   - Columns: `Class Name` (e.g. `Grade 5`), `Section` (`A`, `B`, `C`), `Class Teacher Assigned`, `Total Students`, `Status`, `Actions`.
2. **Create Class Modal (`/schooladmin/admintools/createclass`)**:
   - Input: `Class Name` (Dropdown / Text input).
   - Input: `Section Name` (e.g. `A`).
   - Input: `Section Capacity` (e.g. `40`).
   - Select: `Assigned Class Teacher` (Dropdown populated from active teachers).
   - Submit: `Save Class`.

#### Backing API Endpoints
- `POST /apis/api_index.php` -> `/getAllClasses/class/`
- `POST /apis/api_index.php` -> `/SelectschoolClass/class/`
- `POST /apis/api_index.php` -> `/updateClass/class/`
- `POST /apis/api_index.php` -> `/deleteClass/class`

---

### Submodule 2.2: Teacher Roster & Allocation (`/schooladmin/admintools/teacher`)

#### Visual Components & Forms
1. **Teacher Roster Data Table**:
   - Columns: `Avatar`, `Teacher Name`, `Email Address`, `Contact Number`, `Assigned Classes`, `Assigned Subjects`, `Status (Active/Inactive)`, `Actions (Edit/Delete/Reset Password)`.
2. **Add Teacher Modal (`/schooladmin/admintools/addteacher`)**:
   - Fields: `First Name`, `Last Name`, `Email`, `Temporary Password`, `Phone`, `Subject Specialization`.
   - Multi-select: `Class Allocation` (e.g., `Grade 5 - A`, `Grade 5 - B`).
   - Multi-select: `Subject Allocation` (e.g., `English`, `Science`).
3. **Bulk Teacher Provisioning (`/bulkcreateTeacher/teacher/`)**:
   - Download CSV Template, Upload CSV, Validation preview table, Commit Import.

#### Backing API Endpoints
- `POST /apis/api_index.php` -> `/getAllTeacher/teacher/`
- `POST /apis/api_index.php` -> `/createTeacher/teacher/`
- `POST /apis/api_index.php` -> `/updateTeacher/teacher/`
- `POST /apis/api_index.php` -> `/deleteTeacher/teacher`
- `POST /apis/api_index.php` -> `/bulkcreateTeacher/teacher/`

---

### Submodule 2.3: Student Enrollment & Lifecycle (`/schooladmin/admintools/student`)

#### Visual Components & Forms
1. **Student Directory Table**:
   - Columns: `Roll Number`, `Avatar`, `Student Name`, `Grade & Section`, `Parent Email`, `Parent Phone`, `Enrolled Date`, `Actions`.
2. **Add Student Modal (`/schooladmin/admintools/addstudent`)**:
   - Student Info: `Full Name`, `Roll Number`, `Date of Birth`, `Gender`.
   - Academic Mapping: `Grade` (Select), `Section` (Select).
   - Parent/Guardian Info: `Parent Name`, `Email`, `Mobile Number`.
3. **Bulk Student Upload & Roll No Sync (`/bulkupload/student`, `/bulkupload/rollno`)**:
   - Dedicated Excel/CSV importer with automated validation for unique roll numbers and email addresses.
4. **Batch Migration & Academic Year Promotion (`/schooladmin/admintools/student/restore`)**:
   - Promotes entire grade cohort (e.g. `Grade 4 -> Grade 5`), handles student archival, and allows restoring soft-deleted student records.

#### Backing API Endpoints
- `POST /apis/api_index.php` -> `/getAllStudent/student/`
- `POST /apis/api_index.php` -> `/createStudent1/student/`
- `POST /apis/api_index.php` -> `/updateStudent1/student/`
- `POST /apis/api_index.php` -> `/deleteStudent/student`
- `POST /apis/api_index.php` -> `/restoreStudent/student/`
- `POST /apis/api_index.php` -> `/updateStudentsBatchmigration/student/`

---

### Submodule 2.4: Subjects & Curriculum Mapping (`/schooladmin/admintools/subjects`)

#### Visual Components & Forms
1. **Subject Catalog Table**:
   - Columns: `Subject Code`, `Subject Title`, `Applicable Grades`, `Curriculum Framework`, `Actions`.
2. **Create Subject Modal**:
   - Fields: `Subject Name`, `Short Code`, `Color Badge`, Checkbox array for target grades (`Grade 1` to `Grade 12`).

#### Backing API Endpoints
- `POST /apis/api_index.php` -> `/getAllSubjects/subject/`
- `POST /apis/api_index.php` -> `/createschoolSubject/schoolsubject/`
- `POST /apis/api_index.php` -> `/updateSubject/subject/`

---

### Module 3: Institutional Reporting & Compliance

#### 1. School Homework Compliance (`/schooladmin/homeworks`, `/schooladmin/hwreport/:id1`)
- Monitors homework assignments scheduled by each teacher, student submission percentage, and overdue delinquency across sections.

#### 2. Institutional Quiz & Exam Reports (`/schooladmin/quiz`, `/schooladmin/quizreport/:id1`)
- Evaluates assessment results, median scores, standard deviations, and detailed item-level question analysis (`/schooladmin/quizinsight/studentrespones/:id1/:id2`).

#### 3. School Insights & Business Intelligence (`/schooladmin/insights`)
- Tracks user logins, active session durations, flipbook page views, and teacher adoption metrics over time.

---

## Part B: Super Administrator Modules (Platform Governance)

### Module 4: Multi-Tenant School Provisioning (`/admin/schools`)
1. **School Directory**: Lists all registered partner schools, tenant keys (`pk_school_key`), licensing status, and renewal dates.
2. **Create School (`/admin/create-school`)**:
   - Fields: `School Name`, `School Code`, `Board (CBSE, ICSE, State)`, `Address`, `Contact Person`, `Logo Uploader`.
   - Generates tenant database partition and admin root credentials.

### Module 5: Role-Based Access Control & Feature Matrix (`/admin/access-control`)
Allows platform administrators to enable or disable features per school or per role:
- `Book Visibility` (`book_visibility` 0 or 1)
- `Homework Engine` (`homework_visibility` 0 or 1)
- `Quiz & Assessment System` (`quiz_visibility` 0 or 1)
- `Holistic Student Portfolio` (`portfolio_visibility` 0 or 1)
- `AI Teaching Suite` (`ai_tools_visibility` 0 or 1)
- `Publishing & Custom Authoring` (`publishing_visibility` 0 or 1)

### Module 6: Textbook QR Registration System (`/admin/bookqrstatus`)
- Manages unique QR codes printed inside physical student workbooks.
- Allows students/parents to scan QR codes on mobile to instantly link their account and unlock digital flipbooks.
- API: `/getAllbookqrStatus/book/`, `/QrGenerateRequest/book/`.

### Module 7: Platform Banner & Video CMS (`/admin/homesetting`)
- Controls platform-wide banners, promotional campaigns, Chrysalis Day announcements, and pedagogical webinars.
- API: `/listhomebanners/homesetting/`, `/addhomebanner/homesetting/`, `/addvideo/homesetting/`.



### Module 8: Enterprise Access Permission Control & Custom Role Builder (`/admin/access-permissions`)

#### Purpose
Allows Group Super Administrators to govern the platform-wide access permission matrix, define specialized roles (e.g., Exam Cell Controller, Head of Department, Cluster Director, Librarian), assign permission bitmasks, and review real-time security audit trails.

#### Visual Components & Management Controls
1. **Role Registry Table**:
   - Lists all system roles (Super Admin, Campus Admin, HOD, Teacher, Student, Parent, Custom Roles).
   - Columns: `Role Name`, `Hierarchy Level`, `Assigned Scope (Global / Campus / Class)`, `Active Users Count`, `Assigned Permissions Summary`, `Actions (Configure / Clone / Archive)`.
2. **Permission Matrix Matrix View**:
   - Interactive matrix table with permission nodes on rows (10 domains: Tenant, Security, Academic, User, Content, Homework, Exam, SCORE, Portfolio, AI) and roles on columns.
   - Live checkbox toggles for instant grant/revocation.
3. **Custom Role Builder Modal**:
   - `Role Name`: Unique title (e.g. "Primary Wing Academic Coordinator").
   - `Scope Selector`: Global Trust level, Campus-specific level, or Department level.
   - `Domain Permission Selectors`: Accordion with master select-all toggles per domain.
   - `Save & Publish Role`: Commits to `tbl_roles` and `tbl_role_permissions`.
4. **User-Level Permission Overrides (`/admin/access-control/user-overrides`)**:
   - Search user by email or employee ID.
   - Allows granting an exceptional permission (e.g. allowing a single teacher to author exams across all classes) or revoking specific capabilities.
5. **Security & Access Audit Trail (`/admin/audit-logs`)**:
   - Filterable stream recording: Timestamp, Actor, Affected Entity, Action (Grant/Revoke), Previous Value, New Value, IP Address.

#### Backing API Endpoints
- `POST /apis/api_index.php` -> `/insertOrUpdateAccessControl/school/`
- `POST /apis/api_index.php` -> `/updateSchoolAccessControl/moretools/`
- `POST /apis/api_index.php` -> `/accountStatusUpdate/user/`
- Custom RBAC Endpoints: `/api/security/roles`, `/api/security/permissions/matrix`, `/api/security/audit-trail`
