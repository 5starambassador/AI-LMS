import { FastifyInstance } from 'fastify';
import { TimetableController } from '../controllers/timetable.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export async function timetableRoutes(fastify: FastifyInstance) {
  const auth = [authenticateToken];
  const edit = [authenticateToken, requirePermission('ops:attendance:record')];

  fastify.get('/api/timetable', { preHandler: auth }, TimetableController.listPeriods);
  fastify.post('/api/timetable', { preHandler: edit }, TimetableController.upsertPeriod);
  fastify.post('/api/timetable/bulk', { preHandler: edit }, TimetableController.bulkReplace);
  fastify.delete('/api/timetable/:id', { preHandler: edit }, TimetableController.deletePeriod);
}
