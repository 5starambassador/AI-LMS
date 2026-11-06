# 08. FORM FIELDS, DROPDOWNS & VALIDATION RULES SPECIFICATION

This document catalogs every input field, selector, validation rule, error message, and payload contract across the platform forms.

---

## 1. Authentication & User Forms

### Form 1.1: User Login (`/login`)

| Field Label | Input Type | Element Name / ID | Placeholder | Validation Rules | Error State Message |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Username / Email** | `text` / `email` | `username` / `#username` | "Enter username" | Required, Valid Email format or alphanumeric string (Min 3, Max 100) | "Please enter a valid username or email" |
| **Password** | `password` | `password` / `#userpassword`| "Enter password" | Required, Min 6 characters | "Please enter your password" |
| **Remember Me** | `checkbox` | `customControlInline` | - | Optional, boolean default `false` | - |
| **Log In Button** | `submit` | `button[type="submit"]` | - | Disabled during API in-flight request | Displays loading spinner |

#### Payload Contract (`POST /checkUserLogin/user/`)
```json
{
  "username": "achariya@test.com",
  "password": "Pass@1234",
  "security_key": "279d6bcd4621d373cade4e832627b4g2"
}
```

---

### Form 1.2: Add / Edit Teacher Modal (`/schooladmin/admintools/addteacher`)

| Field Label | Input Type | Name | Validation Rules | Accepted Values / Options | Error Message |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **First Name** | `text` | `first_name` | Required, Alpha only, 2-50 chars | Regex: `^[a-zA-Z\s]+$` | "First name is required" |
| **Last Name** | `text` | `last_name` | Optional, Alpha only, 1-50 chars | Regex: `^[a-zA-Z\s]*$` | "Invalid characters in last name" |
| **Email Address** | `email` | `email` | Required, Unique across school | Valid RFC 5322 email | "Enter a valid, unique email address" |
| **Mobile Number** | `tel` | `phone` | Required, 10 numeric digits | Regex: `^[6-9]\d{9}$` | "Enter a valid 10-digit mobile number" |
| **Password** | `password` | `password` | Required on create (Min 8, 1 Num, 1 Spec)| Min 8 chars | "Password must be at least 8 characters" |
| **Class Allocation**| `select (multi)` | `classes[]` | Required, At least 1 class selected | Fetched from active school classes | "Select at least one assigned class" |
| **Subject Allocation**| `select (multi)` | `subjects[]` | Required, At least 1 subject | Fetched from active school subjects | "Select at least one subject" |

---

### Form 1.3: Add / Edit Student Modal (`/schooladmin/admintools/addstudent`)

| Field Label | Input Type | Name | Validation Rules | Accepted Values / Options | Error Message |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Student Name** | `text` | `first_name` | Required, 3-100 characters | Regex: `^[a-zA-Z\s\.]+$` | "Student name is required" |
| **Roll Number** | `text` | `roll_no` | Required, Unique per class/sec | Alphanumeric (e.g. `618104`) | "Roll number already exists in this section" |
| **Class / Grade** | `select` | `fk_class_key` | Required | Active School Classes (`Grade 1` to `12`)| "Please select a grade" |
| **Section** | `select` | `fk_section_key`| Required | Active Class Sections (`A`, `B`, `C`)| "Please select a section" |
| **Date of Birth** | `date` | `dob` | Optional, Past date only | `YYYY-MM-DD` | "Date of birth must be in the past" |
| **Gender** | `select` | `gender` | Required | `Male`, `Female`, `Other` | "Please select gender" |
| **Parent Email** | `email` | `parent_email` | Required, RFC 5322 format | Email format | "Valid parent email required for notices" |
| **Parent Phone** | `tel` | `parent_phone` | Required, 10 digits | Regex: `^[6-9]\d{9}$` | "Valid mobile number required" |

---

### Form 1.4: Bulk Student CSV Uploader (`/bulkupload/student`)

- **Accepted File Formats**: `.csv`, `.xlsx`, `.xls`
- **Max File Size**: 10 MB
- **Required CSV Header Format**:
  `Roll_No, Student_Name, Class, Section, Gender, DOB, Parent_Name, Parent_Email, Parent_Phone`
- **Validation Checks**:
  1. Validates absence of blank mandatory cells.
  2. Checks for internal duplicate roll numbers within file.
  3. Checks for database duplicate roll numbers against active school cohort.
  4. Pre-validates phone numbers (10 digits) and email syntax.
- **Feedback**: Renders preview error table highlighting invalid rows in red with specific cell error tooltips.

---

## 2. Academic & Teaching Forms

### Form 2.1: Create Homework (HomeFun) (`/staff/create-homework`)

| Field Label | Input Type | Name | Validation Rules | Error Message |
| :--- | :--- | :--- | :--- | :--- |
| **Homework Title** | `text` | `activity_name` | Required, 5-150 characters | "Title is required (min 5 characters)" |
| **Instructions** | `textarea` / RichText | `description` | Required, 10-2000 characters | "Provide clear homework instructions" |
| **Select Class** | `select` | `fk_class_key` | Required, Must be assigned to teacher | "Select target class" |
| **Select Section**| `select` | `fk_section_key`| Required | "Select target section" |
| **Subject** | `select` | `fk_subject_key`| Required | "Select subject" |
| **Submission Due Date**| `datetime-local` | `due_date` | Required, Must be in the future | "Due date must be in the future" |
| **Attachment File**| `file` | `attachment` | Optional, `.pdf`, `.png`, `.jpg` (Max 15MB) | "File exceeds 15MB or invalid format" |
| **Late Submissions**| `switch / toggle` | `allow_late` | Boolean, default `true` | - |

---

### Form 2.2: Create Assessment / Quiz (`/staff/quiz/create_quiz`) (Verified Live)

| Field Label | Input Type | Element Name / Selector | Validation Rules | Error Message |
| :--- | :--- | :--- | :--- | :--- |
| **Quiz Title** | `text` | `#quizName` / "Enter quiz name" | Required, 3-200 characters | "Quiz name is required" |
| **Select Class\*** | `select` | `select[name="class"]` | Required, Must choose assigned class | "Select a class" |
| **Select Subject\*** | `select` | `select[name="subject"]` | Required, Must choose assigned subject | "Select a subject" |
| **Select Book\*** | `select` | `select[name="book"]` | Required, Textbook mapped to subject | "Select a book" |
| **Select Lesson\*** | `select` | `select[name="lesson"]` | Required, Chapter/Unit within book | "Select a lesson" |
| **Actions** | `buttons` | `SAVE DRAFT`, `PUBLISH` | Form state verification before publish | - |

---

### Form 2.3: Create Worksheet (`/staff/create-worksheet`) (Verified Live)

| Field Label | Input Type | Element Name / Selector | Validation Rules | Description / Options |
| :--- | :--- | :--- | :--- | :--- |
| **Worksheet Name** | `text` | `input[placeholder*="Name"]` | Required, 3-100 characters | Worksheet title |
| **Select Class** | `select` | `select[name="class"]` | Required | `Grade 5` |
| **Select Subject** | `select` | `select[name="subject"]` | Required | `English`, `Mathematics`, `Science`, `Social Studies`, `Environmental Studies`, `Coding and Computer Technology`, `Curricular Resources` |
| **Question Title** | `text` | `input[name="question_1"]` | Required | First exercise prompt |
| **Option Name** | `text` | `input[name="option_name"]` | Required | Matching label or answer option |
| **Option Image** | `file` | `input[type="file"]` | Optional, `.png`, `.jpg` | Accompanying diagram or image |
| **Actions** | `buttons` | `Add Question`, `Create Worksheet` | Adds questions or submits sheet | Submits to `/createWorksheet/teacher/` |

---

### Form 2.4: Assign Exam & Batch PDF Generator (`/exam-assign`) (Verified Live)

| Field Label | Input Type | Name | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Exam Code** | `text` | `exam_code` | Optional (if browsing exams) | Paste a code shared by a colleague |
| **Printing Mode** | `radio / card` | `print_mode` | Required | `Pre-printed booklets` (personalized copy per student with QR) OR `Free-form paper` |
| **Generate Batch PDF** | `button` | `btn_generate` | Enabled once exam and class selected | Generates consolidated print PDF for class |

---

### Form 2.5: Student Homework Submission (`/student/homeworks/attendquiznew/:id`)

| Field Label | Input Type | Name | Validation Rules | Error Message |
| :--- | :--- | :--- | :--- | :--- |
| **Written Response**| `textarea` | `student_response`| Optional if attachment provided | "Please enter a response or upload work" |
| **Work Upload** | `file (multiple)` | `submission_files[]`| `.pdf`, `.png`, `.jpg`, `.jpeg` (Max 3 files, 10MB each)| "Maximum 3 files allowed, up to 10MB each" |
| **Submission Confirmation**| `modal button`| `btn_submit` | Requires click confirmation: "Submit Assignment?" | - |

---

### Form 2.6: Drag-and-Drop Worksheet Creator (`/staff/create-worksheet`)

| Field Label | Input Type | Name | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Worksheet Title**| `text` | `worksheet_title` | Required, 5-100 characters | Title of the interactive exercise |
| **Canvas Background**| `file` | `background_image` | Required, `.png`, `.jpg` (1440x900 recommended) | Educational diagram or scene image |
| **Draggable Labels**| `tags input` | `labels[]` | Required, Min 2, Max 20 items | Word/phrase labels to be dragged |
| **Dropzone Coordinates**| `canvas selector`| `dropzones[]` | Required, Coordinates `[x, y, w, h]` for each label | Bounding box where label must be placed |



---

## 3. Physical Health, Attendance & Marks Forms

### Form 3.1: Student Anthropometrics & Health Records

| Field Label | Input Type | Name | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Height** | `number` | `height` | Positive float, Range: 50.0 to 250.0 cm | Physical height measurement |
| **Weight** | `number` | `weight` | Positive float, Range: 10.0 to 180.0 kg | Physical weight measurement |
| **Blood Group** | `select` | `blood_group` | Valid blood group (`A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`) | Medical record for emergency care |
| **Father's Name** | `text` | `father_name` | Required, 2-100 characters | Parent / Legal guardian name |
| **Mother's Name** | `text` | `mother_name` | Required, 2-100 characters | Parent / Legal guardian name |
| **Emergency Contact 1**| `tel` | `phone1` | Required, 10 digits (`^[6-9]\d{9}$`) | Primary emergency phone |
| **Emergency Contact 2**| `tel` | `phone2` | Optional, 10 digits | Secondary emergency phone |
| **Residential Address**| `textarea` | `residential_address` | Required, 10-250 characters | Current residence |
| **Permanent Address** | `textarea` | `permanent_address` | Optional, "Same as residential" checkbox | Permanent residence |
| **Cumulative Attendance**| `number`| `attendancecount` | Computed integer (0 to 365) | Total working days student was present |

---

### Form 3.2: Daily Classroom Attendance Marking (`/staff/chat/lkg/attendance`)

| Field Label | Input Type | Name | Values / Options | Action |
| :--- | :--- | :--- | :--- | :--- |
| **Attendance Date** | `date` | `attendance_date` | Defaults to today (`YYYY-MM-DD`) | Date of record |
| **Student Status** | `radio` (per row) | `status_{studentId}` | `P` (Present), `A` (Absent), `L` (Late) | Individual attendance toggle |
| **Attendance Remarks**| `text` | `remarks_{studentId}` | Optional, 50 chars (e.g. "Medical Leave") | Reason for absence |
| **Submit Attendance** | `button` | `btn_attendance` | Commits daily roll call | Auto-notifies parents of absentees |

---

### Form 3.3: Summative Exam Marks Entry (`/studentMarks/exam/`)

| Field Label | Input Type | Name | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Select Exam** | `select` | `exam_id` | Required | Mid-term, Half-Yearly, Annual |
| **Maximum Marks** | `number` | `max_marks` | Read-only integer (e.g. 100 or 50) | Exam total cap |
| **Student Marks** | `number` (Array) | `marks[{studentId}]` | Required, `0.0 <= marks <= max_marks` | Score obtained by student |
| **Grade / Remarks** | `text` | `grade[{studentId}]` | Auto-computed (`A1`, `A2`, `B1`...) | CBSE / State board grade rubric |
