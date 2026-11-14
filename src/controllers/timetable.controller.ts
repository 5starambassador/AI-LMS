import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { isUmbrellaRole, resolveCampusId } from '../middleware/auth.js';

export class TimetableController {
  /** GET /api/timetable?classId=&sectionId= */
  static async listPeriods(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { classId, sectionId } = request.query as { classId?: string; sectionId?: string };
    if (!classId) return reply.status(400).send({ success: false, error: 'classId is required.' });

    const periods = await prisma.timetablePeriod.findMany({
      where: {
        campusId: user.campusId ?? undefined,
        classId,
        ...(sectionId ? { sectionId } : {}),
      },
      include: { teacher: { select: { id: true, fullName: true } } },
      orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
    });

    return reply.send({ success: true, periods });
  }

  /** POST /api/timetable — upsert a single period slot */
  static async upsertPeriod(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { classId, sectionId, dayOfWeek, periodNumber, subject, teacherId, startTime, endTime } =
      request.body as {
        classId: string;
        sectionId?: string;
        dayOfWeek: number;
        periodNumber: number;
        subject: string;
        teacherId?: string;
        startTime: string;
        endTime: string;
      };

    if (!classId || !dayOfWeek || !periodNumber || !subject || !startTime || !endTime) {
      return reply.status(400).send({ success: false, error: 'classId, dayOfWeek, periodNumber, subject, startTime, endTime are required.' });
    }

    const cls = await prisma.class.findUnique({ where: { id: classId }, select: { campusId: true } });
    const campusId = user.campusId ?? cls?.campusId ?? (await resolveCampusId(user));
    if (!campusId) return reply.status(400).send({ success: false, error: 'User not assigned to a campus.' });

    const period = await prisma.timetablePeriod.upsert({
      where: {
        classId_sectionId_dayOfWeek_periodNumber: {
          classId,
          sectionId: sectionId ?? null as unknown as string,
          dayOfWeek,
          periodNumber,
        },
      },
      update: { subject, teacherId: teacherId ?? null, startTime, endTime, updatedAt: new Date() },
      create: { campusId, classId, sectionId: sectionId ?? null, dayOfWeek, periodNumber, subject, teacherId: teacherId ?? null, startTime, endTime },
    });

    return reply.send({ success: true, period });
  }

  /** DELETE /api/timetable/:id */
  static async deletePeriod(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const user = request.currentUser!;

    const existing = await prisma.timetablePeriod.findUnique({ where: { id } });
    if (!existing || (!isUmbrellaRole(user) && existing.campusId !== user.campusId)) {
      return reply.status(404).send({ success: false, error: 'Period not found.' });
    }

    await prisma.timetablePeriod.delete({ where: { id } });
    return reply.send({ success: true });
  }

  /** POST /api/timetable/bulk — replace all periods for a class/section */
  static async bulkReplace(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { classId, sectionId, periods } = request.body as {
      classId: string;
      sectionId?: string;
      periods: Array<{
        dayOfWeek: number;
        periodNumber: number;
        subject: string;
        teacherId?: string;
        startTime: string;
        endTime: string;
      }>;
    };

    const cls = await prisma.class.findUnique({ where: { id: classId }, select: { campusId: true } });
    const campusId = user.campusId ?? cls?.campusId ?? (await resolveCampusId(user));
    if (!campusId) return reply.status(400).send({ success: false, error: 'User not assigned to a campus.' });

    // Delete existing periods for this class/section
    await prisma.timetablePeriod.deleteMany({
      where: { campusId, classId, sectionId: sectionId ?? null },
    });

    // Insert new ones
    if (periods && periods.length > 0) {
      await prisma.timetablePeriod.createMany({
        data: periods.map(p => ({
          campusId,
          classId,
          sectionId: sectionId ?? null,
          dayOfWeek: p.dayOfWeek,
          periodNumber: p.periodNumber,
          subject: p.subject,
          teacherId: p.teacherId ?? null,
          startTime: p.startTime,
          endTime: p.endTime,
        })),
      });
    }

    const saved = await prisma.timetablePeriod.findMany({
      where: { campusId, classId, sectionId: sectionId ?? null },
      include: { teacher: { select: { id: true, fullName: true } } },
      orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
    });

    return reply.send({ success: true, periods: saved });
  }
}
