import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

export class LeaveController {
  /** POST /api/leave — submit leave request */
  static async submitRequest(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { type, reason, startDate, endDate } = request.body as {
      type?: string;
      reason: string;
      startDate: string;
      endDate: string;
    };

    if (!reason || !startDate || !endDate) {
      return reply.status(400).send({ success: false, error: 'reason, startDate, endDate are required.' });
    }

    const campusId = user.campusId;
    if (!campusId) return reply.status(400).send({ success: false, error: 'User not assigned to a campus.' });

    const leave = await prisma.leaveRequest.create({
      data: {
        userId: user.sub,
        campusId,
        type: type ?? 'CASUAL',
        reason,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return reply.status(201).send({ success: true, leave });
  }

  /** GET /api/leave — list (staff: own; admin: all campus) */
  static async listRequests(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { status, userId } = request.query as { status?: string; userId?: string };

    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].some(r =>
      user.roleName?.toUpperCase().includes(r)
    );

    const leaves = await prisma.leaveRequest.findMany({
      where: {
        campusId: user.campusId ?? undefined,
        ...(isAdmin
          ? userId ? { userId } : {}
          : { userId: user.sub }),
        ...(status ? { status } : {}),
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        approver: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reply.send({ success: true, leaves });
  }

  /** PATCH /api/leave/:id/approve */
  static async approveRequest(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const user = request.currentUser!;
    const { action, remarks } = request.body as { action: 'APPROVED' | 'REJECTED'; remarks?: string };

    const leave = await prisma.leaveRequest.findUnique({ where: { id } });
    if (!leave || leave.campusId !== user.campusId) {
      return reply.status(404).send({ success: false, error: 'Leave request not found.' });
    }
    if (leave.status !== 'PENDING') {
      return reply.status(400).send({ success: false, error: 'Request has already been processed.' });
    }

    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: action,
        approverId: user.sub,
        approvedAt: new Date(),
        remarks: remarks ?? null,
      },
      include: {
        user: { select: { id: true, fullName: true } },
        approver: { select: { id: true, fullName: true } },
      },
    });

    return reply.send({ success: true, leave: updated });
  }

  /** DELETE /api/leave/:id — withdraw own pending request */
  static async withdrawRequest(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const user = request.currentUser!;

    const leave = await prisma.leaveRequest.findUnique({ where: { id } });
    if (!leave || leave.userId !== user.sub) {
      return reply.status(404).send({ success: false, error: 'Leave request not found.' });
    }
    if (leave.status !== 'PENDING') {
      return reply.status(400).send({ success: false, error: 'Only pending requests can be withdrawn.' });
    }

    await prisma.leaveRequest.delete({ where: { id } });
    return reply.send({ success: true });
  }
}
