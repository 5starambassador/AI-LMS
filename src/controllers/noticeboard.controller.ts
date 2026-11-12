import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

export class NoticeboardController {
  /** GET /api/noticeboard?targetRole= */
  static async listBanners(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { targetRole, includeInactive } = request.query as { targetRole?: string; includeInactive?: string };

    const banners = await prisma.homeBanner.findMany({
      where: {
        campusId: user.campusId ?? undefined,
        ...(includeInactive !== 'true' ? { isActive: true } : {}),
        ...(targetRole ? { targetRole } : {}),
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return reply.send({ success: true, banners });
  }

  /** POST /api/noticeboard */
  static async createBanner(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { title, imageUrl, targetRole, clickUrl, priority, isActive } = request.body as {
      title: string;
      imageUrl?: string;
      targetRole?: string;
      clickUrl?: string;
      priority?: number;
      isActive?: boolean;
    };

    if (!title) return reply.status(400).send({ success: false, error: 'title is required.' });

    const banner = await prisma.homeBanner.create({
      data: {
        campusId: user.campusId ?? null,
        title,
        imageUrl: imageUrl ?? '',
        targetRole: targetRole ?? 'ALL',
        clickUrl: clickUrl ?? null,
        priority: priority ?? 0,
        isActive: isActive !== false,
      },
    });

    return reply.status(201).send({ success: true, banner });
  }

  /** PUT /api/noticeboard/:id */
  static async updateBanner(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const updates = request.body as Partial<{
      title: string;
      imageUrl: string;
      targetRole: string;
      clickUrl: string;
      priority: number;
      isActive: boolean;
    }>;

    const banner = await prisma.homeBanner.update({
      where: { id },
      data: updates,
    });

    return reply.send({ success: true, banner });
  }

  /** DELETE /api/noticeboard/:id */
  static async deleteBanner(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await prisma.homeBanner.delete({ where: { id } });
    return reply.send({ success: true });
  }

  /** PATCH /api/noticeboard/:id/toggle */
  static async toggleActive(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const existing = await prisma.homeBanner.findUnique({ where: { id } });
    if (!existing) return reply.status(404).send({ success: false, error: 'Notice not found.' });

    const banner = await prisma.homeBanner.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    return reply.send({ success: true, banner });
  }
}
