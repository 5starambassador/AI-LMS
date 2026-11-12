import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

/**
 * RBAC middleware.
 * Checks whether the authenticated user's role possesses the given permission code.
 * Super Admin bypasses all permission checks.
 *
 * Usage in a route file:
 *   fastify.post('/api/hpc/cards/publish',
 *     { preHandler: [authenticateToken, requirePermission('hpc:publish')] },
 *     HpcController.publishProgressCard
 *   );
 */
export function requirePermission(permissionCode: string) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.currentUser;
    if (!user) {
      return void reply.status(401).send({ success: false, error: 'Unauthorized.' });
    }

    if (user.roleKey === 'key0000000000001' || user.roleName === 'Super Admin') {
      return;
    }

    const hasPermission = await prisma.rolePermission.findFirst({
      where: {
        role: { roleKey: user.roleKey },
        permission: { code: permissionCode }
      }
    });

    if (!hasPermission) {
      return void reply.status(403).send({
        success: false,
        error: `Forbidden: Missing permission [${permissionCode}].`,
        code: 'MISSING_PERMISSION'
      });
    }
  };
}
