import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * RBAC + ABAC Middleware:
 * Checks whether the current user's role possesses the requested permission code.
 * Also handles Super Admin bypass.
 */
export function requirePermission(permissionCode: string) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.currentUser;
    if (!user) {
      reply.status(401).send({ success: false, error: 'Unauthorized.' });
      return;
    }

    // Super Admin has global bypass
    if (user.roleKey === 'key0000000000001' || user.roleName === 'Super Admin') {
      return;
    }

    // Query role permissions
    const hasPermission = await prisma.rolePermission.findFirst({
      where: {
        role: { roleKey: user.roleKey },
        permission: { code: permissionCode }
      }
    });

    if (!hasPermission) {
      reply.status(403).send({
        success: false,
        error: `Forbidden: Missing required permission [${permissionCode}].`
      });
      return;
    }
  };
}

