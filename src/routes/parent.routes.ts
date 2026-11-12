import { FastifyInstance } from 'fastify';
import { ParentController } from '../controllers/parent.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export async function parentRoutes(fastify: FastifyInstance) {
  // Generate token — authenticated staff only
  fastify.post('/api/parent/tokens',
    { preHandler: [authenticateToken, requirePermission('assessment:homework:grade')] },
    ParentController.generateToken
  );

  // Parent portal — PUBLIC (no auth)
  fastify.get('/api/parent/portal/:token', ParentController.getPortal);
}
