import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AssessmentController {
  // ==========================================
  // HOMEWORK OPERATIONS
  // ==========================================

  /**
   * GET /api/assessment/homework
   * List homework assignments
   */
  static async listHomework(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const { classId, sectionId, subjectId } = request.query as {
      classId?: string;
      sectionId?: string;
      subjectId?: string;
    };

    const where: any = {};
    if (classId) where.classId = classId;
    if (sectionId) where.sectionId = sectionId;
    if (subjectId) where.subjectId = subjectId;

    // If teacher, only show homeworks created or assigned to them
    if (user?.roleName === 'Teacher') {
      where.teacherId = user.id;
    }

    const homeworks = await prisma.homework.findMany({
      where,
      include: {
        class: { select: { id: true, name: true } },
        section: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, fullName: true } },
        _count: { select: { submissions: true } }
      },
      orderBy: { dueDate: 'desc' }
    });

    return reply.send({ success: true, count: homeworks.length, homeworks });
  }

  /**
   * POST /api/assessment/homework
   * Create a new homework assignment (Teacher / Coordinator)
   */
  static async createHomework(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const { classId, sectionId, subjectId, title, description, dueDate, maxMarks = 10, attachments } = request.body as {
      classId: string;
      sectionId: string;
      subjectId: string;
      title: string;
      description: string;
      dueDate: string;
      maxMarks?: number;
      attachments?: string[];
    };

    if (!classId || !sectionId || !subjectId || !title || !dueDate) {
      return reply.status(400).send({ success: false, error: 'Missing mandatory homework fields.' });
    }

    const homework = await prisma.homework.create({
      data: {
        classId,
        sectionId,
        subjectId,
        teacherId: user!.id,
        title,
        description: description || '',
        dueDate: new Date(dueDate),
        maxMarks,
        attachments: attachments ? JSON.stringify(attachments) : null
      },
      include: {
        class: true,
        section: true,
        subject: true
      }
    });

    return reply.status(201).send({ success: true, message: 'Homework created and published.', homework });
  }

  /**
   * POST /api/assessment/homework/:id/submit
   * Student submits response to homework
   */
  static async submitHomework(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const { id } = request.params as { id: string };
    const { submittedText, attachments } = request.body as {
      submittedText?: string;
      attachments?: string[];
    };

    const homework = await prisma.homework.findUnique({ where: { id } });
    if (!homework) {
      return reply.status(404).send({ success: false, error: 'Homework not found.' });
    }

    const submission = await prisma.homeworkSubmission.upsert({
      where: {
        homeworkId_studentId: {
          homeworkId: id,
          studentId: user!.id
        }
      },
      update: {
        status: 'SUBMITTED',
        submittedText: submittedText || '',
        attachments: attachments ? JSON.stringify(attachments) : null,
        submittedAt: new Date()
      },
      create: {
        homeworkId: id,
        studentId: user!.id,
        status: 'SUBMITTED',
        submittedText: submittedText || '',
        attachments: attachments ? JSON.stringify(attachments) : null,
        submittedAt: new Date()
      }
    });

    return reply.send({ success: true, message: 'Homework submitted successfully.', submission });
  }

  /**
   * POST /api/assessment/homework/submissions/:id/grade
   * Teacher grades student homework submission
   */
  static async gradeHomework(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { score, feedback } = request.body as { score: number; feedback?: string };

    if (score === undefined || score === null) {
      return reply.status(400).send({ success: false, error: 'Score is required to grade.' });
    }

    const submission = await prisma.homeworkSubmission.update({
      where: { id },
      data: {
        status: 'EVALUATED',
        score,
        feedback: feedback || '',
        evaluatedAt: new Date()
      }
    });

    return reply.send({ success: true, message: 'Homework evaluated and marks committed.', submission });
  }

  // ==========================================
  // QUIZ OPERATIONS
  // ==========================================

  /**
   * GET /api/assessment/quizzes
   * List quizzes
   */
  static async listQuizzes(request: FastifyRequest, reply: FastifyReply) {
    const { classId, subjectId } = request.query as { classId?: string; subjectId?: string };
    const where: any = {};
    if (classId) where.classId = classId;
    if (subjectId) where.subjectId = subjectId;

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        class: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        _count: { select: { questions: true, submissions: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send({ success: true, count: quizzes.length, quizzes });
  }

  /**
   * POST /api/assessment/quizzes
   * Create Quiz with question items (MCQ, Fill in blanks, Match pairs)
   */
  static async createQuiz(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const { classId, sectionId, subjectId, title, quizType = 'CHOOSE', timeLimitMinutes = 15, questions = [] } = request.body as {
      classId: string;
      sectionId?: string;
      subjectId: string;
      title: string;
      quizType?: string;
      timeLimitMinutes?: number;
      questions?: Array<{
        questionText: string;
        questionType: string;
        options: any;
        correctAnswer: any;
        marks?: number;
      }>;
    };

    if (!classId || !subjectId || !title) {
      return reply.status(400).send({ success: false, error: 'Missing mandatory quiz metadata.' });
    }

    const quiz = await prisma.quiz.create({
      data: {
        classId,
        sectionId: sectionId || null,
        subjectId,
        teacherId: user!.id,
        title,
        quizType,
        timeLimitMinutes,
        isPublished: true,
        questions: {
          create: questions.map((q, idx) => ({
            questionText: q.questionText,
            questionType: q.questionType,
            optionsJson: JSON.stringify(q.options),
            correctAnswer: JSON.stringify(q.correctAnswer),
            marks: q.marks || 1.0,
            orderIndex: idx + 1
          }))
        }
      },
      include: {
        questions: true
      }
    });

    return reply.status(201).send({ success: true, message: 'Quiz created successfully.', quiz });
  }

  /**
   * GET /api/assessment/quizzes/:id
   * Fetch quiz details and questions for taking the test
   */
  static async getQuizDetails(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        class: true,
        subject: true,
        questions: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            questionText: true,
            questionType: true,
            optionsJson: true,
            marks: true,
            orderIndex: true
          }
        }
      }
    });

    if (!quiz) {
      return reply.status(404).send({ success: false, error: 'Quiz not found.' });
    }

    // Parse optionsJson for client consumption
    const parsedQuiz = {
      ...quiz,
      questions: quiz.questions.map(q => ({
        ...q,
        options: JSON.parse(q.optionsJson)
      }))
    };

    return reply.send({ success: true, quiz: parsedQuiz });
  }

  /**
   * POST /api/assessment/quizzes/:id/submit
   * Synchronous quiz auto-grading and score compilation
   */
  static async submitQuiz(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const { id } = request.params as { id: string };
    const { answers } = request.body as { answers: Record<string, any> };

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true }
    });

    if (!quiz) {
      return reply.status(404).send({ success: false, error: 'Quiz not found.' });
    }

    let totalMarks = 0;
    let scoreObtained = 0;
    const itemEvaluations: any[] = [];

    for (const q of quiz.questions) {
      totalMarks += q.marks;
      const studentAnswer = answers ? answers[q.id] : null;
      let isCorrect = false;

      try {
        const correctVal = JSON.parse(q.correctAnswer);
        if (typeof correctVal === 'string' && typeof studentAnswer === 'string') {
          // Case-insensitive, whitespace-trimmed comparison for text
          isCorrect = correctVal.trim().toLowerCase() === studentAnswer.trim().toLowerCase();
        } else if (typeof correctVal === 'number' && typeof studentAnswer === 'number') {
          isCorrect = correctVal === studentAnswer;
        } else {
          isCorrect = JSON.stringify(correctVal) === JSON.stringify(studentAnswer);
        }
      } catch (e) {
        isCorrect = q.correctAnswer === studentAnswer;
      }

      if (isCorrect) {
        scoreObtained += q.marks;
      }

      itemEvaluations.push({
        questionId: q.id,
        isCorrect,
        studentAnswer,
        marksAwarded: isCorrect ? q.marks : 0
      });
    }

    const percentage = totalMarks > 0 ? (scoreObtained / totalMarks) * 100 : 0;

    const submission = await prisma.quizSubmission.create({
      data: {
        quizId: id,
        studentId: user!.id,
        answersJson: JSON.stringify(answers || {}),
        score: scoreObtained,
        totalMarks,
        submittedAt: new Date()
      }
    });

    return reply.send({
      success: true,
      submissionId: submission.id,
      score: scoreObtained,
      totalMarks,
      percentage: Math.round(percentage * 10) / 10,
      itemEvaluations
    });
  }

  // ==========================================
  // WORKSHEET OPERATIONS
  // ==========================================

  /**
   * GET /api/assessment/worksheets
   */
  static async listWorksheets(request: FastifyRequest, reply: FastifyReply) {
    const { classId, subjectId } = request.query as { classId?: string; subjectId?: string };
    const where: any = {};
    if (classId) where.classId = classId;
    if (subjectId) where.subjectId = subjectId;

    const worksheets = await prisma.worksheet.findMany({
      where,
      include: {
        class: true,
        subject: true
      }
    });

    return reply.send({ success: true, count: worksheets.length, worksheets });
  }

  /**
   * POST /api/assessment/worksheets
   */
  static async createWorksheet(request: FastifyRequest, reply: FastifyReply) {
    const { classId, subjectId, title, canvasData } = request.body as {
      classId: string;
      subjectId: string;
      title: string;
      canvasData: any;
    };

    const worksheet = await prisma.worksheet.create({
      data: {
        classId,
        subjectId,
        title,
        canvasData: JSON.stringify(canvasData || {})
      }
    });

    return reply.status(201).send({ success: true, worksheet });
  }
}

