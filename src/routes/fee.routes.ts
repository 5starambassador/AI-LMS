import { FastifyInstance } from 'fastify';
import { FeeController } from '../controllers/fee.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export async function feeRoutes(fastify: FastifyInstance) {
  const admin = [authenticateToken, requirePermission('ops:attendance:record')];

  fastify.get('/api/fees', { preHandler: admin }, FeeController.listFees);
  fastify.get('/api/fees/summary', { preHandler: admin }, FeeController.summary);
  fastify.post('/api/fees', { preHandler: admin }, FeeController.createFee);
  fastify.post('/api/fees/bulk', { preHandler: admin }, FeeController.bulkCreateFee);
  fastify.patch('/api/fees/:id/pay', { preHandler: admin }, FeeController.markPaid);
  fastify.delete('/api/fees/:id', { preHandler: admin }, FeeController.deleteFee);
}
