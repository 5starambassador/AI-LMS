import { FastifyInstance } from 'fastify';
import { AcademicController } from '../controllers/academic.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export async function academicRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  // Read-only: any authenticated user can browse books and lessons
  fastify.get('/api/academic/books', AcademicController.listBooks);
  fastify.get('/api/academic/books/:id', AcademicController.getBookDetails);
  fastify.get('/api/academic/lessons/:id', AcademicController.getLessonDetails);

  // Student-facing: redeem a book QR code
  fastify.post('/api/academic/books/qr/redeem', AcademicController.redeemBookQr);

  // Admin-only: view QR redemption status dashboard
  fastify.get('/api/academic/admin/bookqrstatus',
    { preHandler: [requirePermission('academic:qr:admin')] },
    AcademicController.getBookQrStatus
  );
}
