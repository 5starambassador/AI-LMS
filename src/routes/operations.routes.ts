import { FastifyInstance } from 'fastify';
import { OperationsController } from '../controllers/operations.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export async function operationsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  // Attendance — record: teachers; view: any authenticated staff
  fastify.post('/api/operations/attendance/rollcall',
    { preHandler: [requirePermission('ops:attendance:write')] },
    OperationsController.recordRollCall
  );
  fastify.get('/api/operations/attendance/class/:classId/section/:sectionId',
    OperationsController.getClassAttendance
  );

  // Student Directory — list: any authenticated staff; migrations: admin only
  fastify.get('/api/operations/students', OperationsController.listStudents);
  fastify.post('/api/operations/students/batch-migration',
    { preHandler: [requirePermission('ops:batch:migrate')] },
    OperationsController.batchMigration
  );
  fastify.post('/api/operations/students/:id/restore',
    { preHandler: [requirePermission('ops:batch:migrate')] },
    OperationsController.restoreStudent
  );

  // Noticeboard Banners — view: all; create: admin/coordinator
  fastify.get('/api/operations/banners', OperationsController.listBanners);
  fastify.post('/api/operations/banners',
    { preHandler: [requirePermission('ops:banner:create')] },
    OperationsController.createBanner
  );

  // Resource Buckets — view: all; create: admin/coordinator
  fastify.get('/api/operations/moretools/buckets', OperationsController.listBuckets);
  fastify.post('/api/operations/moretools/buckets',
    { preHandler: [requirePermission('ops:resource:create')] },
    OperationsController.createBucket
  );

  // QR scan live feed — teacher polls this to see who has checked in
  fastify.get('/api/operations/attendance/qr-session/:token/live',
    { preHandler: [requirePermission('ops:attendance:record')] },
    OperationsController.qrAttendanceLive
  );
}
