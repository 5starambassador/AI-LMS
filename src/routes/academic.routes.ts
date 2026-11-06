import { FastifyInstance } from 'fastify';
import { AcademicController } from '../controllers/academic.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export async function academicRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  fastify.get('/api/academic/books', AcademicController.listBooks);
  fastify.get('/api/academic/books/:id', AcademicController.getBookDetails);
  fastify.get('/api/academic/lessons/:id', AcademicController.getLessonDetails);
  fastify.post('/api/academic/books/qr/redeem', AcademicController.redeemBookQr);
  fastify.get('/api/academic/admin/bookqrstatus', AcademicController.getBookQrStatus);
}

