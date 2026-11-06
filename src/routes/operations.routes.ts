import { FastifyInstance } from 'fastify';
import { OperationsController } from '../controllers/operations.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export async function operationsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  // Attendance Endpoints
  fastify.post('/api/operations/attendance/rollcall', OperationsController.recordRollCall);
  fastify.get('/api/operations/attendance/class/:classId/section/:sectionId', OperationsController.getClassAttendance);

  // Student Directory & Cohort Management
  fastify.get('/api/operations/students', OperationsController.listStudents);
  fastify.post('/api/operations/students/batch-migration', OperationsController.batchMigration);
  fastify.post('/api/operations/students/:id/restore', OperationsController.restoreStudent);

  // Noticeboard Banners
  fastify.get('/api/operations/banners', OperationsController.listBanners);
  fastify.post('/api/operations/banners', OperationsController.createBanner);

  // Resource Buckets ("More Tools")
  fastify.get('/api/operations/moretools/buckets', OperationsController.listBuckets);
  fastify.post('/api/operations/moretools/buckets', OperationsController.createBucket);
}

