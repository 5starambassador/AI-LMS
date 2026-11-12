import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

export class ReportCardController {
  /** GET /api/reportcard/students — list enrollable students for picker */
  static async listStudents(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { classId, sectionId } = request.query as { classId?: string; sectionId?: string };

    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        campusId: user.campusId ?? undefined,
        isDeleted: false,
        ...(classId ? { classId } : {}),
        ...(sectionId ? { sectionId } : {}),
      },
      select: {
        rollNumber: true,
        class: { select: { name: true } },
        section: { select: { name: true } },
        student: { select: { id: true, fullName: true } },
      },
      orderBy: { rollNumber: 'asc' },
    });

    return reply.send({
      success: true,
      students: enrollments.map(e => ({
        id: e.student.id,
        name: e.student.fullName,
        roll: e.rollNumber,
        class: e.class.name,
        section: e.section.name,
      })),
    });
  }

  /** GET /api/reportcard/:studentId — full term report */
  static async getReport(request: FastifyRequest, reply: FastifyReply) {
    const { studentId } = request.params as { studentId: string };

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        fullName: true,
        enrollments: {
          where: { isDeleted: false },
          take: 1,
          orderBy: { enrolledAt: 'desc' },
          include: {
            class: { select: { name: true } },
            section: { select: { name: true } },
            batch: { select: { name: true } },
          },
        },
      },
    });

    if (!student) return reply.status(404).send({ success: false, error: 'Student not found.' });

    const enrollment = student.enrollments[0];

    // === Attendance (full year) ===
    const attendances = await prisma.dailyAttendance.findMany({
      where: { studentId },
      select: { status: true, date: true },
      orderBy: { date: 'asc' },
    });
    const present = attendances.filter(a => a.status === 'PRESENT').length;
    const absent  = attendances.filter(a => a.status === 'ABSENT').length;
    const leave   = attendances.filter(a => a.status === 'LEAVE').length;
    const attendancePct = attendances.length > 0
      ? Math.round((present / attendances.length) * 100)
      : null;

    // === Homework — per-subject averages ===
    const submissions = await prisma.homeworkSubmission.findMany({
      where: { studentId },
      include: { homework: { select: { subject: true, maxMarks: true } } },
    });

    const hwBySubject: Record<string, { total: number; count: number; max: number }> = {};
    for (const s of submissions) {
      if (s.marksAwarded == null) continue;
      const sub = s.homework.subject;
      if (!hwBySubject[sub]) hwBySubject[sub] = { total: 0, count: 0, max: 0 };
      hwBySubject[sub].total += Number(s.marksAwarded);
      hwBySubject[sub].count++;
      hwBySubject[sub].max += s.homework.maxMarks;
    }

    const homeworkBySubject = Object.entries(hwBySubject).map(([subject, v]) => ({
      subject,
      avgPercent: v.max > 0 ? Math.round((v.total / v.max) * 100) : null,
      submissions: v.count,
    }));

    // === Exams ===
    const examResults = await prisma.scoreStudentResult.findMany({
      where: { studentId },
      include: { exam: { select: { title: true, subject: true, totalMarks: true, scheduledDate: true } } },
      orderBy: { gradedAt: 'asc' },
    });

    const exams = examResults.map(r => ({
      title: r.exam.title,
      subject: r.exam.subject,
      marksObtained: r.marksObtained,
      totalMarks: r.exam.totalMarks,
      percentage: r.exam.totalMarks > 0 ? Math.round((r.marksObtained / r.exam.totalMarks) * 100) : 0,
      scheduledDate: r.exam.scheduledDate,
      grade: calcGrade(r.exam.totalMarks > 0 ? (r.marksObtained / r.exam.totalMarks) * 100 : 0),
    }));

    // Overall exam average per subject
    const examBySubject: Record<string, { total: number; count: number }> = {};
    for (const e of examResults) {
      const sub = e.exam.subject;
      if (!examBySubject[sub]) examBySubject[sub] = { total: 0, count: 0 };
      examBySubject[sub].total += e.exam.totalMarks > 0 ? (e.marksObtained / e.exam.totalMarks) * 100 : 0;
      examBySubject[sub].count++;
    }
    const examBySubjectArr = Object.entries(examBySubject).map(([subject, v]) => ({
      subject,
      avgPercent: Math.round(v.total / v.count),
      count: v.count,
      grade: calcGrade(v.total / v.count),
    }));

    return reply.send({
      success: true,
      student: {
        name: student.fullName,
        class: enrollment ? enrollment.class.name : null,
        section: enrollment ? enrollment.section.name : null,
        batch: enrollment ? enrollment.batch.name : null,
        roll: enrollment ? enrollment.rollNumber : null,
      },
      attendance: { present, absent, leave, total: attendances.length, percentage: attendancePct },
      homework: homeworkBySubject,
      exams,
      examBySubject: examBySubjectArr,
      generatedAt: new Date().toISOString(),
    });
  }
}

function calcGrade(pct: number): string {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  return 'D';
}
