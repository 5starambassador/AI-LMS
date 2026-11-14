import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { isUmbrellaRole, resolveCampusId } from '../middleware/auth.js';

export class FeeController {
  /** GET /api/fees?status=&studentId= — list fee records */
  static async listFees(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { status, studentId } = request.query as { status?: string; studentId?: string };

    const fees = await prisma.feePayment.findMany({
      where: {
        campusId: user.campusId ?? undefined,
        ...(status ? { status } : {}),
        ...(studentId ? { studentId } : {}),
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            enrollments: {
              where: { isDeleted: false },
              take: 1,
              select: {
                rollNumber: true,
                class: { select: { name: true } },
                section: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    // Auto-update OVERDUE status for past-due unpaid records
    const now = new Date();
    const overdueIds = fees
      .filter(f => f.status === 'PENDING' && f.dueDate < now)
      .map(f => f.id);

    if (overdueIds.length > 0) {
      await prisma.feePayment.updateMany({
        where: { id: { in: overdueIds } },
        data: { status: 'OVERDUE' },
      });
      overdueIds.forEach(oid => {
        const fee = fees.find(f => f.id === oid);
        if (fee) fee.status = 'OVERDUE';
      });
    }

    return reply.send({ success: true, fees });
  }

  /** POST /api/fees — create fee record(s) */
  static async createFee(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { studentId, feeType, amount, dueDate, remarks } = request.body as {
      studentId: string;
      feeType: string;
      amount: number;
      dueDate: string;
      remarks?: string;
    };

    if (!studentId || !feeType || !amount || !dueDate) {
      return reply.status(400).send({ success: false, error: 'studentId, feeType, amount, dueDate are required.' });
    }

    const student = await prisma.user.findUnique({ where: { id: studentId }, select: { campusId: true } });
    const campusId = user.campusId ?? student?.campusId ?? (await resolveCampusId(user));
    if (!campusId) return reply.status(400).send({ success: false, error: 'User not assigned to a campus.' });

    const fee = await prisma.feePayment.create({
      data: {
        studentId,
        campusId,
        feeType,
        amount,
        dueDate: new Date(dueDate),
        status: 'PENDING',
        remarks: remarks ?? null,
      },
    });

    return reply.status(201).send({ success: true, fee });
  }

  /** POST /api/fees/bulk — bulk create for a class */
  static async bulkCreateFee(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { classId, sectionId, feeType, amount, dueDate, remarks } = request.body as {
      classId: string;
      sectionId?: string;
      feeType: string;
      amount: number;
      dueDate: string;
      remarks?: string;
    };

    const cls = await prisma.class.findUnique({ where: { id: classId }, select: { campusId: true } });
    const campusId = user.campusId ?? cls?.campusId ?? (await resolveCampusId(user));
    if (!campusId) return reply.status(400).send({ success: false, error: 'User not assigned to a campus.' });

    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        campusId,
        classId,
        isDeleted: false,
        ...(sectionId ? { sectionId } : {}),
      },
      select: { studentId: true },
    });

    const records = enrollments.map(e => ({
      studentId: e.studentId,
      campusId,
      feeType,
      amount,
      dueDate: new Date(dueDate),
      status: 'PENDING',
      remarks: remarks ?? null,
    }));

    await prisma.feePayment.createMany({ data: records });

    return reply.send({ success: true, created: records.length });
  }

  /** PATCH /api/fees/:id/pay — mark as paid */
  static async markPaid(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const user = request.currentUser!;
    const { reference } = request.body as { reference?: string };

    const existing = await prisma.feePayment.findUnique({ where: { id } });
    if (!existing || (!isUmbrellaRole(user) && existing.campusId !== user.campusId)) {
      return reply.status(404).send({ success: false, error: 'Fee record not found.' });
    }

    const fee = await prisma.feePayment.update({
      where: { id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        reference: reference ?? null,
      },
    });

    return reply.send({ success: true, fee });
  }

  /** DELETE /api/fees/:id */
  static async deleteFee(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const user = request.currentUser!;

    const existing = await prisma.feePayment.findUnique({ where: { id } });
    if (!existing || (!isUmbrellaRole(user) && existing.campusId !== user.campusId)) {
      return reply.status(404).send({ success: false, error: 'Fee record not found.' });
    }

    await prisma.feePayment.delete({ where: { id } });
    return reply.send({ success: true });
  }

  /** GET /api/fees/summary — per-student fee summary for dashboard */
  static async summary(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;

    const fees = await prisma.feePayment.findMany({
      where: { campusId: user.campusId ?? undefined },
    });

    const paid    = fees.filter(f => f.status === 'PAID').length;
    const pending = fees.filter(f => f.status === 'PENDING').length;
    const overdue = fees.filter(f => f.status === 'OVERDUE').length;
    const totalAmount   = fees.reduce((s, f) => s + Number(f.amount), 0);
    const collectedAmount = fees.filter(f => f.status === 'PAID').reduce((s, f) => s + Number(f.amount), 0);

    return reply.send({
      success: true,
      summary: { paid, pending, overdue, totalAmount, collectedAmount },
    });
  }
}
