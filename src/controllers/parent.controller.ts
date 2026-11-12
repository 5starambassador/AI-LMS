import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

const TOKEN_TTL_HOURS = 48;

export class ParentController {

  /**
   * POST /api/parent/tokens
   * Teacher/admin generates a time-limited parent access token for a student.
   */
  static async generateToken(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { studentId } = request.body as { studentId: string };

    if (!studentId) {
      return reply.status(400).send({ success: false, error: 'studentId is required.' });
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, fullName: true, campusId: true }
    });
    if (!student) return reply.status(404).send({ success: false, error: 'Student not found.' });

    const campusId = student.campusId ?? user.campusId;
    if (!campusId) return reply.status(400).send({ success: false, error: 'Campus not resolvable.' });

    // Invalidate any existing unused tokens for this student
    await prisma.parentToken.updateMany({
      where: { studentId, usedAt: null, expiresAt: { gt: new Date() } },
      data: { expiresAt: new Date() } // expire them now
    });

    const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

    const pt = await prisma.parentToken.create({
      data: { studentId, generatedBy: user.id, campusId, expiresAt }
    });

    const portalUrl = `${request.protocol}://${request.hostname}/parent/${pt.token}`;

    return reply.send({ success: true, token: pt.token, portalUrl, expiresAt, studentName: student.fullName });
  }

  /**
   * POST /api/parent/tokens/bulk
   * Bulk-generate parent tokens for a list of students (grade card distribution).
   */
  static async generateBulkTokens(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { studentIds } = request.body as { studentIds: string[] };

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return reply.status(400).send({ success: false, error: 'studentIds array is required.' });
    }

    const results: Array<{ studentId: string; studentName: string; token: string; portalUrl: string; expiresAt: string }> = [];

    for (const studentId of studentIds) {
      const student = await prisma.user.findUnique({
        where: { id: studentId },
        select: { id: true, fullName: true, campusId: true }
      });
      if (!student) continue;

      const campusId = student.campusId ?? user.campusId;
      if (!campusId) continue;

      // Expire prior unused tokens
      await prisma.parentToken.updateMany({
        where: { studentId, usedAt: null, expiresAt: { gt: new Date() } },
        data: { expiresAt: new Date() }
      });

      const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);
      const pt = await prisma.parentToken.create({
        data: { studentId, generatedBy: user.id, campusId, expiresAt }
      });

      const portalUrl = `${request.protocol}://${request.hostname}/parent/${pt.token}`;
      results.push({ studentId, studentName: student.fullName, token: pt.token, portalUrl, expiresAt: expiresAt.toISOString() });
    }

    return reply.send({ success: true, tokens: results });
  }

  /**
   * GET /api/parent/portal/:token  (PUBLIC — no auth required)
   * Returns the student summary for a valid, unexpired token.
   * Marks the token as used on first access (single-use).
   */
  static async getPortal(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.params as { token: string };

    const pt = await prisma.parentToken.findUnique({
      where: { token },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            enrollments: {
              where: { isDeleted: false },
              take: 1,
              orderBy: { createdAt: 'desc' },
              include: {
                class: { select: { name: true } },
                section: { select: { name: true } }
              }
            }
          }
        }
      }
    });

    if (!pt) return reply.status(404).send({ success: false, error: 'Invalid or expired link.' });
    if (pt.expiresAt < new Date()) return reply.status(410).send({ success: false, error: 'This link has expired.' });

    // Mark as used (single-use: subsequent views still allowed within TTL — usedAt is recorded only)
    if (!pt.usedAt) {
      await prisma.parentToken.update({ where: { id: pt.id }, data: { usedAt: new Date() } });
    }

    const student = pt.student;
    const enrollment = student.enrollments[0];

    // Attendance summary (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const attendances = await prisma.dailyAttendance.findMany({
      where: {
        studentId: student.id,
        date: { gte: thirtyDaysAgo }
      },
      select: { status: true, date: true },
      orderBy: { date: 'desc' }
    });
    const present = attendances.filter(a => a.status === 'PRESENT').length;
    const attendancePct = attendances.length > 0
      ? Math.round((present / attendances.length) * 100)
      : null;

    // Homework summary (last 10 submissions)
    const hwSubmissions = await prisma.homeworkSubmission.findMany({
      where: { studentId: student.id },
      orderBy: { submittedAt: 'desc' },
      take: 10,
      include: { homework: { select: { title: true, subject: true, maxMarks: true } } }
    });
    const gradedHw = hwSubmissions.filter(s => s.marksAwarded !== null);
    const hwAvg = gradedHw.length > 0
      ? Math.round(
          gradedHw.reduce((sum, s) => sum + ((s.marksAwarded ?? 0) / (s.homework.maxMarks || 1)) * 100, 0)
          / gradedHw.length
        )
      : null;

    // Exam results (last 5)
    const examResults = await prisma.scoreStudentResult.findMany({
      where: { studentId: student.id },
      orderBy: { gradedAt: 'desc' },
      take: 5,
      include: { exam: { select: { title: true, subject: true, totalMarks: true, scheduledDate: true } } }
    });

    return reply.send({
      success: true,
      student: {
        name: student.fullName,
        class: enrollment ? `${enrollment.class.name}${enrollment.section ? ` – ${enrollment.section.name}` : ''}` : null,
        rollNumber: enrollment?.rollNumber ?? null
      },
      attendance: {
        percentage: attendancePct,
        presentDays: present,
        totalDays: attendances.length,
        recentDates: attendances.slice(0, 7).map(a => ({ date: a.date, status: a.status }))
      },
      homework: {
        averagePercent: hwAvg,
        submissions: hwSubmissions.map(s => ({
          subject: s.homework.subject,
          title: s.homework.title,
          marksAwarded: s.marksAwarded,
          maxMarks: s.homework.maxMarks,
          status: s.status,
          submittedAt: s.submittedAt
        }))
      },
      exams: examResults.map(r => ({
        title: r.exam.title,
        subject: r.exam.subject,
        marksObtained: r.marksObtained,
        totalMarks: r.exam.totalMarks,
        percentage: Math.round((r.marksObtained / r.exam.totalMarks) * 100),
        scheduledDate: r.exam.scheduledDate,
        gradedAt: r.gradedAt
      })),
      tokenExpiresAt: pt.expiresAt
    });
  }
}
