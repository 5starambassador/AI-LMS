import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

export class AnalyticsController {
  /**
   * GET /api/analytics/score-insights
   * Class-level score analytics from HomeworkSubmission + QuizSubmission data.
   * Returns subject averages, top/bottom performers, completion rates, and trends.
   */
  static async getScoreInsights(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;

    // Resolve the teacher's class from their homework assignments (most recent)
    const latestHomework = await prisma.homework.findFirst({
      where: { teacherId: user.id },
      select: { classId: true, sectionId: true },
      orderBy: { createdAt: 'desc' }
    });

    // Admins and coordinators see campus-wide data; teachers see their class
    const isAdmin = ['Super Admin', 'Principal', 'Coordinator', 'Manager', 'School Admin'].includes(user.roleName ?? '');

    const hwWhere: any = {};
    const quizWhere: any = {};

    if (!isAdmin) {
      if (latestHomework) {
        hwWhere.classId = latestHomework.classId;
        quizWhere.classId = latestHomework.classId;
      } else {
        hwWhere.teacherId = user.id;
        quizWhere.teacherId = user.id;
      }
    } else if (user.campusId) {
      // Admin: scope to their campus via class
      const campusClasses = await prisma.class.findMany({
        where: { campusId: user.campusId },
        select: { id: true }
      });
      const classIds = campusClasses.map(c => c.id);
      hwWhere.classId = { in: classIds };
      quizWhere.classId = { in: classIds };
    }

    // ── Homework analytics ───────────────────────────────────────────────────
    const homeworks = await prisma.homework.findMany({
      where: hwWhere,
      select: {
        id: true,
        title: true,
        maxMarks: true,
        dueDate: true,
        subject: { select: { id: true, name: true } },
        submissions: {
          select: { studentId: true, status: true, score: true, submittedAt: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // ── Quiz analytics ───────────────────────────────────────────────────────
    const quizzes = await prisma.quiz.findMany({
      where: quizWhere,
      select: {
        id: true,
        title: true,
        subject: { select: { id: true, name: true } },
        submissions: {
          select: { studentId: true, score: true, totalMarks: true, submittedAt: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // ── Build subject-level rollup ───────────────────────────────────────────
    const subjectMap = new Map<string, {
      name: string;
      hwScores: number[];
      quizScores: number[];
      hwTotal: number;
      quizTotal: number;
    }>();

    for (const hw of homeworks) {
      const subName = hw.subject?.name ?? 'General';
      if (!subjectMap.has(subName)) subjectMap.set(subName, { name: subName, hwScores: [], quizScores: [], hwTotal: 0, quizTotal: 0 });
      const s = subjectMap.get(subName)!;
      s.hwTotal += hw.submissions.length;
      for (const sub of hw.submissions) {
        if (sub.status === 'EVALUATED' && sub.score !== null) {
          s.hwScores.push((sub.score / hw.maxMarks) * 100);
        }
      }
    }

    for (const quiz of quizzes) {
      const subName = quiz.subject?.name ?? 'General';
      if (!subjectMap.has(subName)) subjectMap.set(subName, { name: subName, hwScores: [], quizScores: [], hwTotal: 0, quizTotal: 0 });
      const s = subjectMap.get(subName)!;
      s.quizTotal += quiz.submissions.length;
      for (const sub of quiz.submissions) {
        if (sub.totalMarks > 0) {
          s.quizScores.push((sub.score / sub.totalMarks) * 100);
        }
      }
    }

    const subjects = Array.from(subjectMap.values()).map(s => ({
      name: s.name,
      hwAvg: s.hwScores.length > 0 ? Math.round(s.hwScores.reduce((a, b) => a + b, 0) / s.hwScores.length) : null,
      quizAvg: s.quizScores.length > 0 ? Math.round(s.quizScores.reduce((a, b) => a + b, 0) / s.quizScores.length) : null,
      hwGraded: s.hwScores.length,
      hwTotal: s.hwTotal,
      quizAttempts: s.quizTotal
    }));

    // ── Per-student rollup for performer lists ───────────────────────────────
    const studentScores = new Map<string, { scores: number[]; name?: string }>();

    for (const hw of homeworks) {
      for (const sub of hw.submissions) {
        if (sub.status === 'EVALUATED' && sub.score !== null) {
          if (!studentScores.has(sub.studentId)) studentScores.set(sub.studentId, { scores: [] });
          studentScores.get(sub.studentId)!.scores.push((sub.score / hw.maxMarks) * 100);
        }
      }
    }
    for (const quiz of quizzes) {
      for (const sub of quiz.submissions) {
        if (sub.totalMarks > 0) {
          if (!studentScores.has(sub.studentId)) studentScores.set(sub.studentId, { scores: [] });
          studentScores.get(sub.studentId)!.scores.push((sub.score / sub.totalMarks) * 100);
        }
      }
    }

    // Enrich with student names
    if (studentScores.size > 0) {
      const studentIds = [...studentScores.keys()];
      const users = await prisma.user.findMany({
        where: { id: { in: studentIds } },
        select: { id: true, fullName: true }
      });
      for (const u of users) {
        const entry = studentScores.get(u.id);
        if (entry) entry.name = u.fullName;
      }
    }

    const performers = Array.from(studentScores.entries())
      .map(([id, data]) => ({
        studentId: id,
        name: data.name ?? 'Unknown',
        avgPercent: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
        assessmentCount: data.scores.length
      }))
      .sort((a, b) => b.avgPercent - a.avgPercent);

    const topPerformers = performers.slice(0, 5);
    const needsAttention = performers.filter(p => p.avgPercent < 50).slice(0, 5);

    // ── Summary stats ────────────────────────────────────────────────────────
    const allHwSubmissions = homeworks.flatMap(h => h.submissions);
    const allQuizSubmissions = quizzes.flatMap(q => q.submissions);
    const evaluatedHw = allHwSubmissions.filter(s => s.status === 'EVALUATED' && s.score !== null);

    const hwOverallAvg = evaluatedHw.length > 0
      ? Math.round(evaluatedHw.reduce((acc, s) => {
          const hw = homeworks.find(h => h.submissions.some(sub => sub.studentId === s.studentId && sub.status === s.status));
          return acc + ((s.score! / (hw?.maxMarks ?? 10)) * 100);
        }, 0) / evaluatedHw.length)
      : null;

    const quizOverallAvg = allQuizSubmissions.length > 0
      ? Math.round(allQuizSubmissions
          .filter(s => s.totalMarks > 0)
          .reduce((acc, s) => acc + (s.score / s.totalMarks) * 100, 0) / allQuizSubmissions.filter(s => s.totalMarks > 0).length)
      : null;

    // ── 30-day submission trend ──────────────────────────────────────────────
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentHw = allHwSubmissions.filter(s => s.submittedAt && s.submittedAt >= thirtyDaysAgo);
    const recentQuiz = allQuizSubmissions.filter(s => s.submittedAt && s.submittedAt >= thirtyDaysAgo);

    // Group by date (last 14 days, daily buckets)
    const trendMap = new Map<string, { hw: number; quiz: number }>();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      trendMap.set(d.toISOString().slice(0, 10), { hw: 0, quiz: 0 });
    }
    for (const s of recentHw) {
      if (s.submittedAt) {
        const key = s.submittedAt.toISOString().slice(0, 10);
        if (trendMap.has(key)) trendMap.get(key)!.hw++;
      }
    }
    for (const s of recentQuiz) {
      const key = s.submittedAt.toISOString().slice(0, 10);
      if (trendMap.has(key)) trendMap.get(key)!.quiz++;
    }

    const trend = Array.from(trendMap.entries()).map(([date, counts]) => ({ date, ...counts }));

    return reply.send({
      success: true,
      summary: {
        totalHomeworks: homeworks.length,
        totalQuizzes: quizzes.length,
        totalSubmissions: allHwSubmissions.filter(s => s.status !== 'ASSIGNED').length,
        evaluatedCount: evaluatedHw.length,
        quizAttempts: allQuizSubmissions.length,
        hwOverallAvg,
        quizOverallAvg,
        studentsAssessed: studentScores.size
      },
      subjects,
      topPerformers,
      needsAttention,
      trend
    });
  }

  /**
   * GET /api/analytics/recent-quiz-sessions
   * Last 30 quiz submissions with student name + gap count, for the Sessions tab.
   */
  static async getRecentQuizSessions(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const isAdmin = ['Super Admin', 'Principal', 'Coordinator', 'Manager', 'School Admin'].includes(user.roleName ?? '');

    const quizWhere: any = {};
    if (!isAdmin) quizWhere.teacherId = user.id;

    const quizIds = (await prisma.quiz.findMany({
      where: quizWhere,
      select: { id: true }
    })).map(q => q.id);

    if (quizIds.length === 0) {
      return reply.send({ success: true, sessions: [] });
    }

    const submissions = await prisma.quizSubmission.findMany({
      where: { quizId: { in: quizIds } },
      include: {
        quiz: {
          include: {
            subject: { select: { name: true } },
            class:   { select: { name: true } },
            questions: { orderBy: { orderIndex: 'asc' } }
          }
        }
      },
      orderBy: { submittedAt: 'desc' },
      take: 30
    });

    const studentIds = [...new Set(submissions.map(s => s.studentId))];
    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, fullName: true }
    });
    const studentMap = new Map(students.map(s => [s.id, s.fullName]));

    const sessions = submissions.map(sub => {
      let answers: Record<string, any> = {};
      try { answers = JSON.parse(sub.answersJson); } catch {}
      let gapCount = 0;
      for (const q of sub.quiz.questions) {
        const sa = answers[q.id] ?? null;
        if (sa === null || sa === '') { gapCount++; continue; }
        let cv: any;
        try { cv = JSON.parse(q.correctAnswer); } catch { cv = q.correctAnswer; }
        let isCorrect = false;
        try {
          isCorrect = typeof cv === 'string' && typeof sa === 'string'
            ? cv.trim().toLowerCase() === sa.trim().toLowerCase()
            : JSON.stringify(cv) === JSON.stringify(sa);
        } catch {}
        if (!isCorrect) gapCount++;
      }
      const percentage = sub.totalMarks > 0
        ? Math.round((sub.score / sub.totalMarks) * 1000) / 10 : 0;
      return {
        quizId:      sub.quizId,
        studentId:   sub.studentId,
        studentName: studentMap.get(sub.studentId) ?? 'Unknown',
        quizTitle:   sub.quiz.title,
        subject:     sub.quiz.subject.name,
        class:       sub.quiz.class.name,
        percentage,
        score:       sub.score,
        totalMarks:  sub.totalMarks,
        gapCount,
        submittedAt: sub.submittedAt
      };
    });

    return reply.send({ success: true, sessions });
  }
}
