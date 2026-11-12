import { FastifyInstance } from 'fastify';
import { NoticeboardController } from '../controllers/noticeboard.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export async function noticeboardRoutes(fastify: FastifyInstance) {
  const auth = [authenticateToken];
  const edit = [authenticateToken, requirePermission('ops:attendance:record')];

  fastify.get('/api/noticeboard', { preHandler: auth }, NoticeboardController.listBanners);
  fastify.post('/api/noticeboard', { preHandler: edit }, NoticeboardController.createBanner);
  fastify.put('/api/noticeboard/:id', { preHandler: edit }, NoticeboardController.updateBanner);
  fastify.patch('/api/noticeboard/:id/toggle', { preHandler: edit }, NoticeboardController.toggleActive);
  fastify.delete('/api/noticeboard/:id', { preHandler: edit }, NoticeboardController.deleteBanner);
}
