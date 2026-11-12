import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

export class OperationsController {
  // ==========================================
  // 1. ATTENDANCE OPERATIONS
  // ==========================================

  /**
   * POST /api/operations/attendance/rollcall
   * Daily roll call batch submission
   */
  static async recordRollCall(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const { date, classId, sectionId, records } = request.body as {
      date: string;
      classId: string;
      sectionId: string;
      records: Array<{
        studentId: string;
        status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
        remarks?: string;
      }>;
    };

    if (!date || !classId || !sectionId || !Array.isArray(records)) {
      return reply.status(400).send({ success: false, error: 'Missing mandatory roll call fields.' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const savedRecords = [];
    for (const r of records) {
      const rec = await prisma.dailyAttendance.upsert({
        where: {
          date_studentId: {
            date: attendanceDate,
            studentId: r.studentId
          }
        },
        update: {
          status: r.status,
          remarks: r.remarks || null
        },
        create: {
          date: attendanceDate,
          campusId: user!.campusId!,
          classId,
          sectionId,
          studentId: r.studentId,
          status: r.status,
          remarks: r.remarks || null
        }
      });
      savedRecords.push(rec);
    }

    return reply.send({
      success: true,
      message: `Roll call recorded for ${savedRecords.length} students on ${date}.`,
      date: attendanceDate,
      count: savedRecords.length
    });
  }

  /**
   * GET /api/operations/attendance/class/:classId/section/:sectionId
   * Monthly roll call statistics & attendance percentages
   */
  static async getClassAttendance(request: FastifyRequest, reply: FastifyReply) {
    const { classId, sectionId } = request.params as { classId: string; sectionId: string };
    const { month, year } = request.query as { month?: string; year?: string };

    const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month, 10) - 1 : new Date().getMonth();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const attendances = await prisma.dailyAttendance.findMany({
      where: {
        classId,
        sectionId,
        date: { gte: startDate, lte: endDate }
      },
      orderBy: { date: 'asc' }
    });

    // Compute distinct working days
    const distinctDates = new Set(attendances.map(a => a.date.toISOString().split('T')[0]));
    const totalWorkingDays = distinctDates.size;

    return reply.send({
      success: true,
      month: targetMonth + 1,
      year: targetYear,
      totalWorkingDays,
      totalRecords: attendances.length,
      attendances
    });
  }

  // ==========================================
  // 2. STUDENT DIRECTORY & BATCH MIGRATION
  // ==========================================

  /**
   * GET /api/operations/students
   * List students with class, section, profile & roll number
   */
  static async listStudents(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const { classId, sectionId, search, cursor, limit: limitStr } = request.query as {
      classId?: string;
      sectionId?: string;
      search?: string;
      cursor?: string;
      limit?: string;
    };

    const pageSize = Math.min(parseInt(limitStr ?? '50', 10) || 50, 200);

    const where: any = {
      isDeleted: false,
      role: { name: 'Student' }
    };

    if (user?.campusId && user.roleName !== 'Super Admin') {
      where.campusId = user.campusId;
    }

    if (classId || sectionId) {
      where.enrollments = {
        some: {
          isDeleted: false,
          ...(classId ? { classId } : {}),
          ...(sectionId ? { sectionId } : {})
        }
      };
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const students = await prisma.user.findMany({
      where,
      include: {
        enrollments: {
          where: { isDeleted: false },
          include: {
            class: { select: { id: true, name: true } },
            section: { select: { id: true, name: true } }
          }
        },
        studentProfile: true
      },
      orderBy: { fullName: 'asc' },
      take: pageSize + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
    });

    const hasMore = students.length > pageSize;
    const page = hasMore ? students.slice(0, pageSize) : students;
    const nextCursor = hasMore ? page[page.length - 1]?.id : undefined;

    return reply.send({
      success: true,
      count: page.length,
      students: page,
      pagination: { hasMore, nextCursor: nextCursor ?? null }
    });
  }

  /**
   * POST /api/operations/students/batch-migration
   * End-of-year batch cohort rollover from one class to next
   */
  static async batchMigration(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const { studentIds, targetBatchId, targetClassId, targetSectionId } = request.body as {
      studentIds: string[];
      targetBatchId: string;
      targetClassId: string;
      targetSectionId: string;
    };

    if (!Array.isArray(studentIds) || !targetBatchId || !targetClassId || !targetSectionId) {
      return reply.status(400).send({ success: false, error: 'Missing mandatory batch migration targets.' });
    }

    const migrated = [];
    for (let i = 0; i < studentIds.length; i++) {
      const studentId = studentIds[i];
      const rollNumber = `MIG-${targetClassId.slice(0, 3)}-${String(i + 1).padStart(2, '0')}`;

      // Update old enrollments to PROMOTED
      await prisma.studentEnrollment.updateMany({
        where: { studentId },
        data: { status: 'PROMOTED' }
      });

      // Create new enrollment in target batch
      const newEnrollment = await prisma.studentEnrollment.create({
        data: {
          studentId,
          campusId: user!.campusId!,
          batchId: targetBatchId,
          classId: targetClassId,
          sectionId: targetSectionId,
          rollNumber,
          status: 'ACTIVE'
        }
      });
      migrated.push(newEnrollment);
    }

    return reply.send({
      success: true,
      message: `Batch migration completed: ${migrated.length} students advanced to target cohort.`,
      migratedCount: migrated.length
    });
  }

  /**
   * POST /api/operations/students/:id/restore
   * Soft-delete recycle bin recovery
   */
  static async restoreStudent(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const student = await prisma.user.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null }
    });

    await prisma.studentEnrollment.updateMany({
      where: { studentId: id },
      data: { isDeleted: false, deletedAt: null }
    });

    return reply.send({ success: true, message: 'Student record restored from recycle bin.', student });
  }

  // ==========================================
  // 3. HOME BANNERS & NOTICEBOARD
  // ==========================================

  /**
   * GET /api/operations/banners
   * List active noticeboard banners filtered by user role
   */
  static async listBanners(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const userAudience = user?.roleName === 'Student' ? 'STUDENT' : 'STAFF';

    const banners = await prisma.homeBanner.findMany({
      where: {
        isActive: true,
        OR: [
          { targetRole: 'ALL' },
          { targetRole: userAudience }
        ]
      },
      orderBy: { priority: 'desc' }
    });

    return reply.send({ success: true, count: banners.length, banners });
  }

  /**
   * POST /api/operations/banners
   * Publish noticeboard carousel banner
   */
  static async createBanner(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const { title, imageUrl, targetRole = 'ALL', clickUrl, priority = 0 } = request.body as {
      title: string;
      imageUrl: string;
      targetRole?: string;
      clickUrl?: string;
      priority?: number;
    };

    const banner = await prisma.homeBanner.create({
      data: {
        campusId: user?.campusId || null,
        title,
        imageUrl,
        targetRole,
        clickUrl: clickUrl || null,
        priority
      }
    });

    return reply.status(201).send({ success: true, message: 'Noticeboard banner published.', banner });
  }

  // ==========================================
  // 4. RESOURCE BUCKETS & "MORE TOOLS"
  // ==========================================

  /**
   * GET /api/operations/moretools/buckets
   */
  static async listBuckets(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;

    const buckets = await prisma.resourceBucket.findMany({
      where: {
        OR: [
          { campusId: null }, // Global master buckets
          ...(user?.campusId ? [{ campusId: user.campusId }] : [])
        ]
      },
      include: {
        items: { orderBy: { orderIndex: 'asc' } }
      },
      orderBy: { orderIndex: 'asc' }
    });

    return reply.send({ success: true, count: buckets.length, buckets });
  }

  /**
   * POST /api/operations/moretools/buckets
   */
  static async createBucket(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const { title, visibility = 'ALL', orderIndex = 0 } = request.body as {
      title: string;
      visibility?: string;
      orderIndex?: number;
    };

    const bucket = await prisma.resourceBucket.create({
      data: {
        campusId: user?.campusId || null,
        title,
        visibility,
        orderIndex
      }
    });

    return reply.status(201).send({ success: true, bucket });
  }

  /**
   * GET /api/operations/attendance/qr-session/:token/live
   * Returns all enrolled students for the QR session's class with today's
   * attendance status — teacher polls this for the live scan feed.
   */
  static async qrAttendanceLive(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.params as { token: string };

    const session = await prisma.qrSession.findUnique({ where: { token } });
    if (!session) return reply.status(404).send({ success: false, error: 'QR session not found.' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        classId: session.classId,
        ...(session.sectionId ? { sectionId: session.sectionId } : {}),
        isDeleted: false
      },
      include: { student: { select: { id: true, fullName: true } } },
      orderBy: { rollNumber: 'asc' }
    });

    const attendances = await prisma.dailyAttendance.findMany({
      where: {
        classId: session.classId,
        date: today
      },
      select: { studentId: true, status: true, remarks: true }
    });

    const attendanceMap = new Map(attendances.map(a => [a.studentId, a]));

    const students = enrollments.map(enr => {
      const att = attendanceMap.get(enr.studentId);
      return {
        studentId: enr.studentId,
        name: enr.student.fullName,
        rollNumber: enr.rollNumber,
        status: att?.status ?? 'ABSENT',
        scannedViaQr: att?.remarks === 'QR scan',
        markedAt: att ? today.toISOString() : null
      };
    });

    const present = students.filter(s => s.status === 'PRESENT').length;

    return reply.send({
      success: true,
      sessionExpired: session.expiresAt < new Date(),
      classId: session.classId,
      date: today,
      total: students.length,
      present,
      absent: students.length - present,
      students
    });
  }
}

