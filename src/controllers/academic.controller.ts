import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AcademicController {
  /**
   * GET /api/academic/books
   * List books for the user's campus or specified class/subject
   */
  static async listBooks(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const { classId, subjectId, grade, search } = request.query as {
      classId?: string;
      subjectId?: string;
      grade?: string;
      search?: string;
    };

    const where: any = { isDeleted: false, isPublished: true };

    if (classId) where.classId = classId;
    if (subjectId) where.subjectId = subjectId;

    if (grade && grade !== 'ALL') {
      where.class = { ...(where.class || {}), name: { contains: grade } };
    }

    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } }
      ];
    }

    // Filter by campus if not global super admin
    if (user?.campusId && user.roleName !== 'Super Admin') {
      where.class = { ...(where.class || {}), campusId: user.campusId };
    }

    const books = await prisma.book.findMany({
      where,
      include: {
        class: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true, code: true } },
        _count: { select: { lessons: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send({ success: true, count: books.length, books });
  }

  /**
   * GET /api/academic/books/:id
   * Get single book with chapters/lessons and page assets
   */
  static async getBookDetails(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const book = await prisma.book.findFirst({
      where: {
        OR: [{ id }, { bookKey: id }],
        isDeleted: false
      },
      include: {
        class: true,
        subject: true,
        lessons: {
          where: { isDeleted: false },
          orderBy: { lessonNumber: 'asc' },
          include: {
            pages: { orderBy: { pageNumber: 'asc' } }
          }
        }
      }
    });

    if (!book) {
      return reply.status(404).send({ success: false, error: 'Book not found or deleted.' });
    }

    return reply.send({ success: true, book });
  }

  /**
   * GET /api/academic/lessons/:id
   * Get lesson with pages and vector assets for the 2-page flipbook reader
   */
  static async getLessonDetails(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        book: {
          include: { class: true, subject: true }
        },
        pages: {
          orderBy: { pageNumber: 'asc' }
        }
      }
    });

    if (!lesson || lesson.isDeleted) {
      return reply.status(404).send({ success: false, error: 'Lesson not found.' });
    }

    return reply.send({ success: true, lesson });
  }

  /**
   * POST /api/academic/books/qr/redeem
   * Single-use QR physical book redemption state machine
   */
  static async redeemBookQr(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser;
    const { qrCode } = request.body as { qrCode?: string };

    if (!qrCode) {
      return reply.status(400).send({ success: false, error: 'Missing qrCode in request body.' });
    }

    const qr = await prisma.bookQR.findUnique({
      where: { qrCode },
      include: { book: true }
    });

    if (!qr) {
      return reply.status(404).send({ success: false, error: 'Invalid book QR code. Not registered in system.' });
    }

    if (qr.status === 'REDEEMED') {
      return reply.status(400).send({
        success: false,
        error: 'This book QR code has already been redeemed.',
        redeemedAt: qr.redeemedAt
      });
    }

    if (qr.status === 'EXPIRED') {
      return reply.status(400).send({ success: false, error: 'This book QR license has expired.' });
    }

    // Transition state machine: GENERATED / DISTRIBUTED -> REDEEMED
    const updatedQr = await prisma.bookQR.update({
      where: { id: qr.id },
      data: {
        status: 'REDEEMED',
        redeemedBy: user?.id,
        redeemedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year validity
      },
      include: { book: true }
    });

    return reply.send({
      success: true,
      message: 'Book license successfully unlocked and assigned to account.',
      book: {
        id: updatedQr.book.id,
        title: updatedQr.book.title,
        validUntil: updatedQr.expiresAt
      }
    });
  }

  /**
   * GET /api/academic/admin/bookqrstatus
   * Real-time audit dashboard showing printed book QR code inventory
   */
  static async getBookQrStatus(request: FastifyRequest, reply: FastifyReply) {
    const { bookId } = request.query as { bookId?: string };

    const where: any = {};
    if (bookId) where.bookId = bookId;

    const [total, generated, printed, distributed, redeemed, expired] = await Promise.all([
      prisma.bookQR.count({ where }),
      prisma.bookQR.count({ where: { ...where, status: 'GENERATED' } }),
      prisma.bookQR.count({ where: { ...where, status: 'PRINTED' } }),
      prisma.bookQR.count({ where: { ...where, status: 'DISTRIBUTED' } }),
      prisma.bookQR.count({ where: { ...where, status: 'REDEEMED' } }),
      prisma.bookQR.count({ where: { ...where, status: 'EXPIRED' } })
    ]);

    return reply.send({
      success: true,
      metrics: {
        total,
        generated,
        printed,
        distributed,
        redeemed,
        expired,
        redemptionRate: total > 0 ? ((redeemed / total) * 100).toFixed(2) + '%' : '0%'
      }
    });
  }
}

