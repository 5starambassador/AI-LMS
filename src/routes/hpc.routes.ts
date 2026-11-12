import { FastifyInstance } from 'fastify';
import { HpcController } from '../controllers/hpc.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export async function hpcRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  // Record a domain observation (teacher/coordinator)
  fastify.post('/api/hpc/observations',
    { preHandler: [requirePermission('hpc:observe')] },
    HpcController.recordObservation
  );

  // View a student's Holistic Progress Card (any authenticated staff)
  fastify.get('/api/hpc/cards/student/:studentId',
    { preHandler: [requirePermission('hpc:view')] },
    HpcController.getStudentProgressCard
  );

  // Publish / sign the HPC (coordinator or above)
  fastify.post('/api/hpc/cards/publish',
    { preHandler: [requirePermission('hpc:publish')] },
    HpcController.publishProgressCard
  );
}
