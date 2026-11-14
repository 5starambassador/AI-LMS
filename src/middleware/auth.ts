import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { prisma } from '../lib/prisma.js';

export interface AuthenticatedUserPayload {
  id?: string;
  sub: string;
  userKey: string;
  fullName?: string;
  roleKey: string;
  roleName: string;
  campusId: string | null;
  schoolKey: string | null;
}

declare module 'fastify' {
  interface FastifyRequest {
    currentUser?: AuthenticatedUserPayload;
  }
}

/**
 * Verifies Bearer JWT token from Authorization header or cookies only.
 * Query-string tokens are intentionally NOT supported — they leak into
 * server logs, proxy logs, and browser history.
 */
export async function authenticateToken(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    let token: string | undefined;

    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const rawCookie = (request.headers as Record<string, string>).cookie ?? '';
      for (const part of rawCookie.split(';')) {
        const [k, v] = part.trim().split('=');
        if (k === 'achariya_token' || k === 'token') {
          token = v;
          break;
        }
      }
    }

    if (!token) {
      return void reply.status(401).send({
        success: false,
        error: 'Authentication required. No valid session token found.'
      });
    }

    const payload = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUserPayload;
    request.currentUser = { ...payload, id: payload.sub };
  } catch {
    return void reply.status(401).send({
      success: false,
      error: 'Invalid or expired session token. Please sign in again.'
    });
  }
}

/**
 * Domain partitioning guard.
 * Segregates Staff (learning.achariya.in) from Student (voice.achariya.in / Mobile).
 */
export function enforceClientDomain(portal: 'STAFF' | 'STUDENT') {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.currentUser;
    if (!user) {
      return void reply.status(401).send({ success: false, error: 'Unauthorized.' });
    }

    const isStudent = user.roleName === 'Student';

    if (portal === 'STAFF' && isStudent) {
      return void reply.status(403).send({
        success: false,
        error: 'Access Denied: Student accounts must sign in via Achariya VoiceLab or Mobile App.',
        redirectUrl: 'https://voice.achariya.in/student/'
      });
    }

    if (portal === 'STUDENT' && !isStudent && user.roleName !== 'Super Admin') {
      return void reply.status(403).send({
        success: false,
        error: 'Access Denied: Staff accounts must sign in via Achariya Educator LMS.',
        redirectUrl: 'https://learning.achariya.in/staff/home'
      });
    }
  };
}

export function isUmbrellaRole(user?: AuthenticatedUserPayload | null): boolean {
  if (!user) return false;
  return (
    user.roleKey === 'role-ach-superadmin' ||
    user.roleKey === 'role-ach-manager' ||
    user.roleName === 'Super Admin' ||
    user.roleName === 'Manager'
  );
}

/**
 * Resolves an effective campusId for the request.
 * Campus-bound users always use their own `user.campusId`.
 * Umbrella roles (`GLOBAL` Super Admin / `REGIONAL` Manager with `campusId: null`)
 * can pass an explicit `requestedCampusId` or fall back to the primary active campus.
 */
export async function resolveCampusId(
  user?: AuthenticatedUserPayload | null,
  requestedCampusId?: string | null
): Promise<string | null> {
  if (user && isUmbrellaRole(user) && requestedCampusId) {
    return requestedCampusId;
  }
  if (user?.campusId) {
    return user.campusId;
  }
  if (user && isUmbrellaRole(user)) {
    const primaryCampus = await prisma.campus.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true }
    });
    return primaryCampus?.id ?? null;
  }
  return null;
}
