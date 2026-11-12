import { FastifyInstance } from 'fastify';
import { LeaveController } from '../controllers/leave.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export async function leaveRoutes(fastify: FastifyInstance) {
  const auth = [authenticateToken];
  const admin = [authenticateToken, requirePermission('ops:attendance:record')];

  fastify.post('/api/leave', { preHandler: auth }, LeaveController.submitRequest);
  fastify.get('/api/leave', { preHandler: auth }, LeaveController.listRequests);
  fastify.patch('/api/leave/:id/approve', { preHandler: admin }, LeaveController.approveRequest);
  fastify.delete('/api/leave/:id', { preHandler: auth }, LeaveController.withdrawRequest);
}
