import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function verify() {
  console.log('=== VERIFYING DATABASE SEED STATE ===');

  const orgCount = await prisma.organization.count();
  const campusCount = await prisma.campus.count();
  const roleCount = await prisma.role.count();
  const userCount = await prisma.user.count();
  const classCount = await prisma.class.count();
  const subjectCount = await prisma.subject.count();
  const bookCount = await prisma.book.count();
  const lsrActivityCount = await prisma.lsrActivity.count();

  console.log({
    organizations: orgCount,
    campuses: campusCount,
    roles: roleCount,
    users: userCount,
    classes: classCount,
    subjects: subjectCount,
    books: bookCount,
    lsrActivities: lsrActivityCount
  });

  // Verify Teacher achariya@test.com
  const teacher = await prisma.user.findUnique({
    where: { email: 'achariya@test.com' },
    include: { role: true, campus: { include: { license: true } }, teacherAllocations: true }
  });
  console.log('\n--- Teacher Record ---');
  console.log({
    id: teacher?.id,
    userKey: teacher?.userKey,
    name: teacher?.fullName,
    role: teacher?.role.name,
    campus: teacher?.campus?.name,
    schoolKey: teacher?.campus?.schoolKey,
    licenses: teacher?.campus?.license
  });

  const isTeacherPwValid = await bcrypt.compare('Pass@1234', teacher?.passwordHash || '');
  console.log('Teacher Password (Pass@1234) valid:', isTeacherPwValid);

  // Verify Student anup@test.com
  const student = await prisma.user.findUnique({
    where: { email: 'anup@test.com' },
    include: { role: true, campus: true, enrollments: true, studentProfile: true }
  });
  console.log('\n--- Student Record ---');
  console.log({
    id: student?.id,
    userKey: student?.userKey,
    name: student?.fullName,
    role: student?.role.name,
    campus: student?.campus?.name,
    rollNumber: student?.enrollments[0]?.rollNumber,
    profile: {
      bloodGroup: student?.studentProfile?.bloodGroup,
      heightCm: student?.studentProfile?.heightCm,
      weightKg: student?.studentProfile?.weightKg,
      admissionNo: student?.studentProfile?.admissionNumber
    }
  });

  const isStudentPwValid = await bcrypt.compare('Pass@1234', student?.passwordHash || '');
  console.log('Student Password (Pass@1234) valid:', isStudentPwValid);

  await prisma.$disconnect();
}

verify().catch(console.error);

