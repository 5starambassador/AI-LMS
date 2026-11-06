# 09. UI DESIGN SYSTEM & VISUAL REFERENCE GUIDE

This document captures the visual language, typography, color palette, component specifications, and screenshot references for the rebuilt platform.

---

## 1. Color Palette & Theming Tokens

The application employs a modern, accessible educational design system featuring high-contrast feedback states and calm academic primary tones.

```
+-----------------------------------------------------------------------------------------+
|                                    COLOR SYSTEM TOKENS                                  |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  [ Primary Indigo ]   #556EE6   hsl(229, 76%, 62%)   Primary Brand, Nav Active, CTAs     |
|  [ Primary Dark ]     #3B50C4   hsl(231, 54%, 50%)   Hover, Focused States               |
|  [ Chrysalis Accent ] #A27AFC   hsl(258, 95%, 74%)   Custom Ribbons, Book Tags           |
|  [ Secondary Slate ]  #74788D   hsl(233, 10%, 50%)   Muted Text, Subtitles, Borders      |
|  [ Success Emerald ]  #19C277   hsl(153, 77%, 43%)   Passed, Submitted, Correct Answers  |
|  [ Warning Amber ]    #F1B44C   hsl(38, 86%, 62%)    Pending, Due Soon, Review Needed    |
|  [ Danger Crimson ]   #F46A6A   hsl(0, 86%, 69%)     Overdue, Missed, Incorrect Answers  |
|  [ Info Sky ]         #50A5F1   hsl(208, 86%, 63%)   Tooltips, Informational Badges      |
|                                                                                         |
|  [ Background Light ] #F8F8FB   hsl(240, 33%, 98%)   Dashboard Background Canvas         |
|  [ Card Surface ]     #FFFFFF   hsl(0, 0%, 100%)     Card Containers, Modals, Forms      |
|  [ Text Primary ]     #495057   hsl(210, 9%, 31%)    Headings, Body Copy, Table Content  |
|  [ Text Heading ]     #2A3042   hsl(225, 22%, 21%)   Hero Headings, Page Titles          |
|  [ Border Tone ]      #EFF2F7   hsl(218, 38%, 95%)   Divider Lines, Table Row Borders    |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Typography Hierarchy

- **Font Family**: `'Poppins', 'Nunito', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif`
- **Iconography**: Google Material Symbols Rounded (`opsz 24, wght 400, FILL 0, GRAD 0`) + Lucide Icons

| Style Token | Size / Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Display 1** | `32px / 40px` | Bold (`700`) | Auth Hero Titles, Welcome Banner |
| **Heading 1** | `24px / 32px` | SemiBold (`600`) | Main Page Titles (`Home`, `My Books`, `HomeFun`) |
| **Heading 2** | `20px / 28px` | SemiBold (`600`) | Section Headers, Modal Titles |
| **Heading 3** | `16px / 24px` | Medium (`500`) | Card Titles, Accordion Headers |
| **Body Regular** | `14px / 20px` | Regular (`400`) | Table Data, Form Descriptions, Paragraphs |
| **Body Small** | `12px / 16px` | Regular (`400`) | Timestamps, Secondary Badges, Footers |
| **Label Bold** | `13px / 18px` | Medium (`500`) | Form Field Labels, Table Headers |

---

## 3. UI Component Specifications

### 3.1 Buttons
- **Primary Button**: `bg-[#556EE6] text-white px-4 py-2 rounded-md font-medium hover:bg-[#3B50C4] shadow-sm transition-all`
- **Secondary / Outline Button**: `border border-[#74788D] text-[#495057] px-4 py-2 rounded-md hover:bg-gray-50`
- **Success Action**: `bg-[#19C277] text-white hover:bg-[#149E60]`
- **Danger Action**: `bg-[#F46A6A] text-white hover:bg-[#D9534F]`
- **Interactive State**: Disabled state displays `opacity-50 cursor-not-allowed` with inline SVG spinner during asynchronous operations.

### 3.2 Data Tables
- **Header**: `#F8F8FB` background, `uppercase tracking-wider text-xs font-semibold text-[#74788D]`, border bottom `1px solid #EFF2F7`.
- **Row Styling**: Alternating hover effect `hover:bg-[#F9FAFC]`, height `48px`, padding `12px 16px`.
- **Pagination Control**: Integrated row count dropdown (`Show 10`, `Show 20`, `Show 50`), page range counter, previous/next chevron buttons.

### 3.3 Cards & Elevation
- **Card Surface**: Background `#FFFFFF`, border `1px solid #EFF2F7`, border radius `8px` (`rounded-lg`).
- **Shadow Token**: `0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)` (soft academic elevation).
- **Hover Micro-interaction**: `transition: transform 0.2s ease, box-shadow 0.2s ease; transform: translateY(-2px); shadow-md`.

### 3.4 Status Pills & Badges
- **Active / Completed / Correct**: `bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-semibold`
- **Pending / Due Soon**: `bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-semibold`
- **Overdue / Missed / Deleted**: `bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-semibold`
- **Grade Badge**: `bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-xs font-bold`

---

## 4. Responsive Breakpoints

| Breakpoint | Viewport Width | Layout Adaptations |
| :--- | :--- | :--- |
| **Mobile (`xs`/`sm`)** | `< 768px` | Top bar collapses into slide-out hamburger drawer; tables convert into stacked card lists; bottom navigation bar enabled. |
| **Tablet (`md`)** | `768px - 1024px` | Sidebar collapses to icon rail (mini-sidebar); two-column grid for dashboard widgets. |
| **Desktop (`lg`/`xl`)** | `1024px - 1440px`| Full desktop experience; sticky sidebar; multi-column data tables with fixed action columns. |
| **Wide Screen (`2xl`)** | `> 1440px` | Max container width clamped at `1320px` with fluid centered margins to prevent eye fatigue. |

---

## 5. Visual Audit Screenshot Registry

All screenshots captured during the live session have been archived in the repository:

### Staff Panel Screenshots (`/screenshots/staff/`)
- `01-staff-home.png`: Teacher Home, video webinars, announcements.
- `02-staff-books.png`: Digital textbooks catalog, Grade 5 active filter.
- `03-staff-resources.png`: Teaching resources repository and tools.
- `04-staff-aitools.png`: AI Tools assistant suite.
- `05-staff-myspace.png`: Professional Development & Pedagogical Planning Guide.
- `06-staff-homeworks.png`: HomeFun homework management dashboard.
- `07-staff-quiz.png`: Assessment and quiz engine overview.
- `08-staff-worksheets.png`: Buddy interactive worksheets table and creation trigger.
- `09-staff-studentlist.png`: Student class roster showing Anup.
- `10-staff-profile.png`: Teacher profile and password settings.
- `11-staff-walkthrough.png`: Platform onboarding tour.
- `12-staff-chat.png`: Classroom real-time communication channel.

### Student Panel Screenshots (`/screenshots/student/`)
- `01-student-home.png`: Student home landing.
- `02-student-books.png`: "My Books" catalog showing assigned textbooks.
- `03-student-resources.png`: Digital learning media library.
- `04-student-homeworks.png`: Assignments dashboard (Pending, Completed, Overdue tabs).
- `05-student-quiz.png`: Online tests dashboard (Assigned, Completed, Missed tabs).
- `06-student-worksheet.png`: Buddy worksheet student activity view.
- `07-student-portfolio.png`: Holistic Progress Card (HPC) with radar chart.
- `08-student-profile.png`: Learner profile card (Student ID 618104, Grade 5-A).
- `09-student-chat.png`: Student messaging feed.
- `10-student-access-denied.png`: Digital textbook subscription paywall & purchase prompt.

### Administrative Screenshots (`/screenshots/admin/`)
- `_schooladmin_home.png`: School administrative executive overview.
- `_schooladmin_admintools.png`: Central admin tools hub.
- `_schooladmin_admintools_class.png`: Class and section setup.
- `_schooladmin_admintools_teacher.png`: Teacher provisioning and allocation.
- `_schooladmin_admintools_student.png`: Student directory and roll number mapping.
- `_admin_schools.png`: Super admin multi-tenant school onboarding.

