import { FastifyInstance } from 'fastify';
import { ReportCardController } from '../controllers/reportcard.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export async function reportcardRoutes(fastify: FastifyInstance) {
  const auth = [authenticateToken];

  fastify.get('/api/reportcard/students', { preHandler: auth }, ReportCardController.listStudents);
  fastify.get('/api/reportcard/:studentId', { preHandler: auth }, ReportCardController.getReport);
}
