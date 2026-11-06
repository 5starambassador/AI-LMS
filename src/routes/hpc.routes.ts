import { FastifyInstance } from 'fastify';
import { HpcController } from '../controllers/hpc.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export async function hpcRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  fastify.post('/api/hpc/observations', HpcController.recordObservation);
  fastify.get('/api/hpc/cards/student/:studentId', HpcController.getStudentProgressCard);
  fastify.post('/api/hpc/cards/publish', HpcController.publishProgressCard);
}

