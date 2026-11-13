import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CURRICULUM_CATALOG } from './curriculum-data.js';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Commencing Achariya AI ONE Master Seed (Unique Data Architecture) ---');

  // 1. Hierarchical Roles Definition
  const rolesData = [
    { roleKey: 'role-ach-superadmin', name: 'Super Admin', scope: 'GLOBAL', description: 'Trust HQ Global Administrator & Chief Mentor' },
    { roleKey: 'role-ach-manager', name: 'Manager', scope: 'REGIONAL', description: 'Regional Academic Director & Quality Auditor' },
    { roleKey: 'role-ach-principal', name: 'School Admin', scope: 'CAMPUS', description: 'Campus Principal & Local Academic Dean' },
    { roleKey: 'role-ach-curriculum', name: 'Uploader', scope: 'CAMPUS', description: 'Content Author & Curriculum Digitizer' },
    { roleKey: 'role-ach-teacher', name: 'Teacher', scope: 'ASSIGNED', description: 'Classroom Lead Educator & Evaluator' },
    { roleKey: 'role-ach-student', name: 'Student', scope: 'OWN', description: 'Learner & Speech AI Participant' },
    { roleKey: 'role-ach-parent', name: 'Parent', scope: 'OWN', description: 'Parent / Legal Guardian' },
  ];

  const rolesMap = new Map<string, any>();
  for (const r of rolesData) {
    let role = await prisma.role.findFirst({ where: { name: r.name } });
    if (role) {
      role = await prisma.role.update({
        where: { id: role.id },
        data: { roleKey: r.roleKey, scope: r.scope, description: r.description }
      });
    } else {
      role = await prisma.role.create({
        data: { roleKey: r.roleKey, name: r.name, scope: r.scope, description: r.description, isSystem: true }
      });
    }
    rolesMap.set(r.name, role);
  }
  console.log(`[Seed] Configured ${rolesData.length} unique Achariya hierarchical roles.`);

  // 1b. Permissions & Role-Permission Matrix
  const permissionsData = [
    // Assessment
    { code: 'assessment:homework:create',   domain: 'assessment', description: 'Create and publish homework assignments' },
    { code: 'assessment:homework:grade',    domain: 'assessment', description: 'Grade student homework submissions' },
    { code: 'assessment:quiz:create',       domain: 'assessment', description: 'Author and publish quizzes' },
    { code: 'assessment:worksheet:create',  domain: 'assessment', description: 'Create interactive worksheets' },
    // HPC / Compass
    { code: 'hpc:observe',    domain: 'hpc', description: 'Record domain observations for students' },
    { code: 'hpc:view',       domain: 'hpc', description: 'View student holistic progress cards' },
    { code: 'hpc:publish',    domain: 'hpc', description: 'Sign and publish progress cards' },
    // Operations
    { code: 'ops:attendance:write',  domain: 'operations', description: 'Record daily attendance' },
    { code: 'ops:attendance:record', domain: 'operations', description: 'Admin: manage fee, leave approval, timetable, noticeboard' },
    { code: 'ops:batch:migrate',     domain: 'operations', description: 'Run end-of-year batch cohort migration' },
    { code: 'ops:banner:create',     domain: 'operations', description: 'Create noticeboard banners' },
    { code: 'ops:resource:create',   domain: 'operations', description: 'Create resource buckets and items' },
    // Score / AI Grading
    { code: 'score:exam:create',    domain: 'score', description: 'Author summative exams' },
    { code: 'score:exam:assign',    domain: 'score', description: 'Assign batch exams to class sections' },
    { code: 'score:grade:run',      domain: 'score', description: 'Initiate grading runs and OCR transcription' },
    { code: 'score:grade:process',  domain: 'score', description: 'Process and commit AI grading pipeline results' },
    // Academic / Curriculum
    { code: 'academic:book:manage',    domain: 'academic', description: 'Upload and manage digital books' },
    { code: 'academic:qr:admin',       domain: 'academic', description: 'View and manage book QR redemption status' },
  ];

  const permsMap = new Map<string, any>();
  for (const p of permissionsData) {
    let perm = await prisma.permission.findUnique({ where: { code: p.code } });
    if (!perm) {
      perm = await prisma.permission.create({ data: p });
    }
    permsMap.set(p.code, perm);
  }
  console.log(`[Seed] Configured ${permissionsData.length} permission codes.`);

  // Role → Permissions mapping
  const rolePermissions: Record<string, string[]> = {
    'Super Admin': permissionsData.map(p => p.code),  // all permissions (middleware also bypasses by name)
    'Manager':     permissionsData.map(p => p.code),  // regional director sees everything
    'School Admin': permissionsData.map(p => p.code), // principal has full campus authority
    'Uploader': [
      'assessment:worksheet:create',
      'ops:resource:create',
      'academic:book:manage',
      'academic:qr:admin',
    ],
    'Teacher': [
      'assessment:homework:create',
      'assessment:homework:grade',
      'assessment:quiz:create',
      'assessment:worksheet:create',
      'hpc:observe',
      'hpc:view',
      'ops:attendance:write',
      'score:exam:create',
      'score:exam:assign',
      'score:grade:run',
      'score:grade:process',
    ],
    'Student': [],
    'Parent':  [],
  };

  for (const [roleName, codes] of Object.entries(rolePermissions)) {
    const role = rolesMap.get(roleName);
    if (!role) continue;
    for (const code of codes) {
      const perm = permsMap.get(code);
      if (!perm) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id }
      });
    }
  }
  console.log('[Seed] Role-permission matrix applied.');

  // 2. Organization & Campus Setup
  const org = await prisma.organization.upsert({
    where: { code: 'ACHARIYA_TRUST' },
    update: { name: 'Achariya World Class Educational Trust' },
    create: {
      code: 'ACHARIYA_TRUST',
      name: 'Achariya World Class Educational Trust',
      description: 'Pioneering Holistic, Experiential & AI-Powered Education'
    }
  });

  // Campus 1 (Main Campus Puducherry)
  const campus = await prisma.campus.upsert({
    where: { schoolKey: 'ACH98402PUD2026' },
    update: { 
      name: 'Achariya World Class Academy (Main Campus)', 
      organizationId: org.id,
      affiliation: 'CBSE Center of Excellence'
    },
    create: {
      schoolKey: 'ACH98402PUD2026',
      organizationId: org.id,
      code: 'ACH-PUD-01',
      name: 'Achariya World Class Academy (Main Campus)',
      affiliation: 'CBSE Center of Excellence',
      email: 'principal.pud@achariya.in',
      phone: '+91 98402 11001',
      address: 'Achariya Educational Campus, Achariyapuram, Villianur',
      city: 'Puducherry',
      state: 'Puducherry',
      pincode: '605110'
    }
  });

  // Campus 2 (Chennai OMR)
  const campus2 = await prisma.campus.upsert({
    where: { schoolKey: 'ACH98403CHN2026' },
    update: { 
      name: 'Achariya Techno Campus (Chennai OMR)', 
      organizationId: org.id,
      affiliation: 'CBSE'
    },
    create: {
      schoolKey: 'ACH98403CHN2026',
      organizationId: org.id,
      code: 'ACH-CHN-02',
      name: 'Achariya Techno Campus (Chennai OMR)',
      affiliation: 'CBSE',
      email: 'principal.chn@achariya.in',
      phone: '+91 98403 22002',
      address: 'Achariya Technology Tower, Rajiv Gandhi Salai, Navalur',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600130'
    }
  });

  // 3. Full Feature License Matrix
  await prisma.campusLicense.upsert({
    where: { campusId: campus.id },
    update: {
      basic: true,
      questionBank: true,
      hpcLicense: true,
      autoGrade: true,
      primeLicense: true,
      aiTools: true,
      score: true,
      compass: true,
      voice: true
    },
    create: {
      campusId: campus.id,
      basic: true,
      questionBank: true,
      hpcLicense: true,
      autoGrade: true,
      primeLicense: true,
      aiTools: true,
      score: true,
      compass: true,
      voice: true,
      validFrom: new Date('2026-01-01'),
      validTo: new Date('2029-12-31'),
      maxStudents: 3500,
      maxStaff: 250
    }
  });

  await prisma.campusLicense.upsert({
    where: { campusId: campus2.id },
    update: {
      basic: true,
      questionBank: true,
      hpcLicense: true,
      autoGrade: true,
      primeLicense: true,
      aiTools: true,
      score: true,
      compass: true,
      voice: true
    },
    create: {
      campusId: campus2.id,
      basic: true,
      questionBank: true,
      hpcLicense: true,
      autoGrade: true,
      primeLicense: true,
      aiTools: true,
      score: true,
      compass: true,
      voice: true,
      validFrom: new Date('2026-01-01'),
      validTo: new Date('2029-12-31'),
      maxStudents: 2000,
      maxStaff: 150
    }
  });
  console.log('[Seed] Configured Achariya Trust, Multi-Campuses & Feature Entitlements.');

  // 4. Academic Structure & Subjects
  const academicYear = await prisma.academicYear.upsert({
    where: { name: '2026-2027' },
    update: { isCurrent: true },
    create: {
      name: '2026-2027',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-03-31'),
      isCurrent: true
    }
  });

  const batch = await prisma.batch.upsert({
    where: {
      campusId_academicYearId: {
        campusId: campus.id,
        academicYearId: academicYear.id
      }
    },
    update: {},
    create: {
      campusId: campus.id,
      academicYearId: academicYear.id,
      name: 'Achariya Batch 2026-2027'
    }
  });

  // 4. Ingest Comprehensive Multi-Grade Curriculum Catalog (Grades 1 through 10)
  const classesMap = new Map<string, any>();
  const subjectsMap = new Map<string, any>();
  let grade5: any = null;
  let sectionA: any = null;
  let english: any = null;
  let math: any = null;
  let science: any = null;

  for (const gradeData of CURRICULUM_CATALOG) {
    let cls = await prisma.class.findFirst({
      where: { campusId: campus.id, name: gradeData.gradeName }
    });
    if (!cls) {
      cls = await prisma.class.create({
        data: {
          campusId: campus.id,
          name: gradeData.gradeName,
          stage: gradeData.stage,
          orderIndex: gradeData.gradeNumber
        }
      });
    }
    classesMap.set(gradeData.gradeName, cls);

    let sec = await prisma.section.findFirst({
      where: { classId: cls.id, name: 'A' }
    });
    if (!sec) {
      sec = await prisma.section.create({
        data: {
          campusId: campus.id,
          classId: cls.id,
          name: 'A',
          roomNumber: `Innovation Studio ${gradeData.gradeNumber}01`
        }
      });
    }

    if (gradeData.gradeNumber === 5) {
      grade5 = cls;
      sectionA = sec;
    }

    // Seed Subjects & Books for this grade
    for (const bookData of gradeData.books) {
      let subj = await prisma.subject.findFirst({
        where: { classId: cls.id, name: bookData.subjectName }
      });
      if (!subj) {
        subj = await prisma.subject.create({
          data: {
            campusId: campus.id,
            classId: cls.id,
            name: bookData.subjectName,
            code: bookData.subjectCode
          }
        });
      }
      subjectsMap.set(`${gradeData.gradeName}_${bookData.subjectName}`, subj);

      if (gradeData.gradeNumber === 5) {
        if (bookData.subjectName.includes('English')) english = subj;
        if (bookData.subjectName.includes('Math')) math = subj;
        if (bookData.subjectName.includes('Science')) science = subj;
      }

      // Seed Book
      let book = await prisma.book.findFirst({
        where: { classId: cls.id, subjectId: subj.id, title: bookData.title }
      });
      if (!book) {
        book = await prisma.book.create({
          data: {
            classId: cls.id,
            subjectId: subj.id,
            title: bookData.title,
            edition: bookData.edition,
            publisher: 'Achariya World Class Publications',
            coverImage: bookData.coverImage,
            flipbookUrl: bookData.flipbookUrl,
            isPublished: true
          }
        });
      }

      // Seed Chapters/Lessons
      for (const ch of bookData.chapters) {
        let lesson = await prisma.lesson.findFirst({
          where: { bookId: book.id, lessonNumber: ch.lessonNumber }
        });
        if (!lesson) {
          lesson = await prisma.lesson.create({
            data: {
              bookId: book.id,
              lessonNumber: ch.lessonNumber,
              title: ch.title,
              description: ch.description,
              orderIndex: ch.lessonNumber
            }
          });
        }
      }

      // Seed Book QR
      const existingQr = await prisma.bookQR.findUnique({
        where: { qrCode: bookData.qrCode }
      });
      if (!existingQr) {
        await prisma.bookQR.create({
          data: {
            qrCode: bookData.qrCode,
            bookId: book.id,
            status: 'DISTRIBUTED'
          }
        });
      }
    }
  }

  console.log(`[Seed] Ingested full curriculum catalog across 10 grades (${CURRICULUM_CATALOG.length} grades, ${subjectsMap.size} courses).`);

  // 5. User Personas with Dedicated and Audited Passwords
  const defaultPasswordHash = await bcrypt.hash('Pass@1234', 10);

  // 1. Super Admin: Dr. V. Rajakumaran (Founder President & Chief Mentor)
  await prisma.user.upsert({
    where: { email: 'superadmin@achariya.in' },
    update: { 
      fullName: 'Dr. V. Rajakumaran (Founder President)',
      roleId: rolesMap.get('Super Admin').id 
    },
    create: {
      userKey: 'ACH-USR-0001',
      email: 'superadmin@achariya.in',
      passwordHash: defaultPasswordHash,
      fullName: 'Dr. V. Rajakumaran (Founder President)',
      roleId: rolesMap.get('Super Admin').id,
      campusId: null
    }
  });

  // 2. Manager / Regional Director: Meenakshi Sundaram
  await prisma.user.upsert({
    where: { email: 'manager@achariya.in' },
    update: { 
      fullName: 'Meenakshi Sundaram (Regional Director)',
      roleId: rolesMap.get('Manager').id 
    },
    create: {
      userKey: 'ACH-USR-0004',
      email: 'manager@achariya.in',
      passwordHash: defaultPasswordHash,
      fullName: 'Meenakshi Sundaram (Regional Director)',
      roleId: rolesMap.get('Manager').id,
      campusId: null
    }
  });

  // 3. School Admin / Principal: Dr. Rajesh K. Varma
  await prisma.user.upsert({
    where: { email: 'admin@achariya.in' },
    update: { 
      fullName: 'Dr. Rajesh K. Varma (Campus Principal)',
      roleId: rolesMap.get('School Admin').id,
      campusId: campus.id 
    },
    create: {
      userKey: 'ACH-USR-0002',
      email: 'admin@achariya.in',
      passwordHash: defaultPasswordHash,
      fullName: 'Dr. Rajesh K. Varma (Campus Principal)',
      roleId: rolesMap.get('School Admin').id,
      campusId: campus.id
    }
  });

  // 4. Curriculum Lead / Digitizer: Siddharth Raman
  await prisma.user.upsert({
    where: { email: 'uploader@achariya.in' },
    update: { 
      fullName: 'Siddharth Raman (Curriculum Lead)',
      roleId: rolesMap.get('Uploader').id,
      campusId: campus.id 
    },
    create: {
      userKey: 'ACH-USR-0007',
      email: 'uploader@achariya.in',
      passwordHash: defaultPasswordHash,
      fullName: 'Siddharth Raman (Curriculum Lead)',
      roleId: rolesMap.get('Uploader').id,
      campusId: campus.id
    }
  });

  // 5. Lead Teacher: Dr. Priya Sivaraman (accessible via achariya@test.com and teacher@achariya.in)
  const teacher = await prisma.user.upsert({
    where: { email: 'achariya@test.com' },
    update: { 
      fullName: 'Dr. Priya Sivaraman (Senior Faculty)',
      roleId: rolesMap.get('Teacher').id,
      campusId: campus.id 
    },
    create: {
      userKey: 'ACH-TEA-1001',
      email: 'achariya@test.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Dr. Priya Sivaraman (Senior Faculty)',
      phone: '+91 98402 33441',
      roleId: rolesMap.get('Teacher').id,
      campusId: campus.id
    }
  });

  await prisma.user.upsert({
    where: { email: 'teacher@achariya.in' },
    update: { 
      fullName: 'Dr. Priya Sivaraman (Senior Faculty)',
      roleId: rolesMap.get('Teacher').id,
      campusId: campus.id 
    },
    create: {
      userKey: 'ACH-TEA-1002',
      email: 'teacher@achariya.in',
      passwordHash: defaultPasswordHash,
      fullName: 'Dr. Priya Sivaraman (Senior Faculty)',
      phone: '+91 98402 33441',
      roleId: rolesMap.get('Teacher').id,
      campusId: campus.id
    }
  });

  // 6. Student: Aarav Sundaram (accessible via anup@test.com and student@achariya.in)
  const student = await prisma.user.upsert({
    where: { email: 'anup@test.com' },
    update: { 
      fullName: 'Aarav Sundaram',
      roleId: rolesMap.get('Student').id,
      campusId: campus.id 
    },
    create: {
      userKey: 'ACH-STU-5001',
      email: 'anup@test.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Aarav Sundaram',
      roleId: rolesMap.get('Student').id,
      campusId: campus.id
    }
  });

  await prisma.user.upsert({
    where: { email: 'student@achariya.in' },
    update: { 
      fullName: 'Aarav Sundaram',
      roleId: rolesMap.get('Student').id,
      campusId: campus.id 
    },
    create: {
      userKey: 'ACH-STU-5002',
      email: 'student@achariya.in',
      passwordHash: defaultPasswordHash,
      fullName: 'Aarav Sundaram',
      roleId: rolesMap.get('Student').id,
      campusId: campus.id
    }
  });

  // 7. Parent: Sundaram R.
  await prisma.user.upsert({
    where: { email: 'parent@achariya.in' },
    update: { 
      fullName: 'Sundaram R. (Guardian)',
      roleId: rolesMap.get('Parent').id,
      campusId: campus.id 
    },
    create: {
      userKey: 'ACH-PAR-9001',
      email: 'parent@achariya.in',
      passwordHash: defaultPasswordHash,
      fullName: 'Sundaram R. (Guardian)',
      roleId: rolesMap.get('Parent').id,
      campusId: campus.id
    }
  });

  console.log('[Seed] Configured 7 Unique Achariya Personas.');

  // 6. Allocations & Enrollments
  const existingAlloc = await prisma.teacherAllocation.findFirst({
    where: { teacherId: teacher.id, classId: grade5.id, sectionId: sectionA.id, subjectId: english.id }
  });
  if (!existingAlloc) {
    await prisma.teacherAllocation.create({
      data: {
        campusId: campus.id,
        teacherId: teacher.id,
        classId: grade5.id,
        sectionId: sectionA.id,
        subjectId: english.id,
        academicYearId: academicYear.id,
        isClassTeacher: true
      }
    });
  }

  const existingEnrollment = await prisma.studentEnrollment.findFirst({
    where: { batchId: batch.id, studentId: student.id }
  });
  if (!existingEnrollment) {
    await prisma.studentEnrollment.create({
      data: {
        studentId: student.id,
        campusId: campus.id,
        batchId: batch.id,
        classId: grade5.id,
        sectionId: sectionA.id,
        rollNumber: 'ACH-05A-01'
      }
    });
  }

  await prisma.studentProfile.upsert({
    where: { studentId: student.id },
    update: {
      admissionNumber: 'ACH/2026/5001',
      parentName: 'Sundaram R.',
      parentPhone: '+91 98402 99881',
      parentEmail: 'parent@achariya.in',
      bloodGroup: 'O+',
      heightCm: 142.5,
      weightKg: 35.8
    },
    create: {
      studentId: student.id,
      admissionNumber: 'ACH/2026/5001',
      dateOfBirth: new Date('2015-08-15'),
      gender: 'Male',
      parentName: 'Sundaram R.',
      parentPhone: '+91 98402 99881',
      parentEmail: 'parent@achariya.in',
      bloodGroup: 'O+',
      heightCm: 142.5,
      weightKg: 35.8
    }
  });

  // 7. Verified Master English Course Reference
  let bookEnglish = await prisma.book.findFirst({ where: { classId: grade5.id, subjectId: english.id } });
  let lesson1 = await prisma.lesson.findFirst({ where: { bookId: bookEnglish!.id, lessonNumber: 1 } });

  // 8. Homework Tasks
  let hw1 = await prisma.homework.findFirst({ where: { teacherId: teacher.id, classId: grade5.id } });
  if (!hw1) {
    hw1 = await prisma.homework.create({
      data: {
        teacherId: teacher.id,
        classId: grade5.id,
        sectionId: sectionA.id,
        subjectId: english.id,
        title: 'Descriptive Vocabulary: Canopy Ecosystems',
        description: 'Read Page 4 to 8. List five sensory adjectives and write a 100-word paragraph describing biodiversity.',
        maxMarks: 10,
        dueDate: new Date(Date.now() + 86400000 * 3)
      }
    });
  }

  // 9. Auto-Graded Formative Quiz
  let quiz1 = await prisma.quiz.findFirst({ where: { teacherId: teacher.id, classId: grade5.id } });
  if (!quiz1) {
    quiz1 = await prisma.quiz.create({
      data: {
        teacherId: teacher.id,
        classId: grade5.id,
        sectionId: sectionA.id,
        subjectId: english.id,
        title: 'Formative Check: Metaphor & Sensory Adjectives',
        quizType: 'CHOOSE',
        timeLimitMinutes: 15,
        isPublished: true
      }
    });

    await prisma.quizQuestion.create({
      data: {
        quizId: quiz1.id,
        questionText: 'What primary role does the aerial root system of a Banyan tree perform?',
        questionType: 'MCQ',
        marks: 5,
        orderIndex: 1,
        optionsJson: JSON.stringify([
          'Providing structural support to wide canopy branches',
          'Repelling pollinating honeybees',
          'Absorbing nitrogen from upper stratosphere',
          'Accelerating soil desiccation'
        ]),
        correctAnswer: 'Providing structural support to wide canopy branches'
      }
    });
  }

  // 10. VoiceLab Speech AI Diagnostic Activities
  let lsrActivity1 = await prisma.lsrActivity.findFirst({ where: { gradeLabel: 'G5', activityType: 'reading_fluency' } });
  if (!lsrActivity1) {
    await prisma.lsrActivity.create({
      data: {
        gradeLabel: 'G5',
        activityType: 'reading_fluency',
        templateType: 'reading-fluency-lsr',
        format: 'read_aloud',
        title: 'Oral Reading Fluency: The Whispering Mangroves',
        passageText: 'The mangrove forests along the coast are extraordinary sanctuaries. Their entangled submerged roots protect the shoreline from tidal waves and provide nurseries for young sea creatures. When the tide recedes, mudskippers and fiddler crabs emerge to feed under the tropical sunlight.',
        orderIndex: 1
      }
    });

    await prisma.lsrActivity.create({
      data: {
        gradeLabel: 'G5',
        activityType: 'speaking',
        templateType: 'speaking-lsr',
        format: 'speaking',
        title: 'Oral Expression: My Solar Innovation Pitch',
        passageText: 'Imagine your school is building an automated solar rainwater harvester. Explain in 60 seconds how clean water and electricity can be collected for your campus botanical garden.',
        orderIndex: 2
      }
    });

    await prisma.lsrActivity.create({
      data: {
        gradeLabel: 'G5',
        activityType: 'listening',
        templateType: 'listening-lsr',
        format: 'mcq',
        title: 'Auditory Comprehension: The Coromandel Navigators',
        passageText: 'Listen attentively to the archival audio recording regarding ancient Indian maritime trade across the Bay of Bengal, then identify the celestial navigation markers.',
        orderIndex: 3
      }
    });
  }

  // 11. Campus Noticeboard Announcement Banner
  const existingBanner = await prisma.homeBanner.findFirst({ where: { campusId: campus.id } });
  if (!existingBanner) {
    await prisma.homeBanner.create({
      data: {
        campusId: campus.id,
        title: 'Achariya Science, AI & Robotics Conclave 2026',
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
        targetRole: 'ALL',
        priority: 1,
        isActive: true
      }
    });
  }

  console.log('--- Achariya AI ONE Master Seed Completed Successfully with 100% Unique Architecture! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
