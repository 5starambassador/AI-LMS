import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export interface AuthenticatedUserPayload {
  id?: string;
  sub: string;
  userKey: string;
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
 * Verifies Bearer JWT token from Authorization header or cookies.
 */
export async function authenticateToken(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if ((request.query as any)?.token) {
      token = (request.query as any).token;
    } else if ((request.headers as any).cookie) {
      const cookies = (request.headers as any).cookie.split(';');
      for (const cookie of cookies) {
        const [k, v] = cookie.trim().split('=');
        if (k === 'achariya_token' || k === 'token') {
          token = v;
          break;
        }
      }
    }

    if (!token) {
      reply.status(401).send({
        success: false,
        error: 'Authentication required. No valid session token found.'
      });
      return;
    }

    const payload = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUserPayload;
    request.currentUser = { ...payload, id: payload.sub };
  } catch (err) {
    reply.status(401).send({
      success: false,
      error: 'Invalid or expired session token.'
    });
  }
}

/**
 * Domain Partitioning Guard:
 * Strictly segregates Staff (`learning.achariya.in`) from Student (`voice.achariya.in` / Mobile App).
 */
export function enforceClientDomain(portal: 'STAFF' | 'STUDENT') {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.currentUser;
    if (!user) {
      reply.status(401).send({ success: false, error: 'Unauthorized.' });
      return;
    }

    const isStudent = user.roleName === 'Student';

    if (portal === 'STAFF' && isStudent) {
      reply.status(403).send({
        success: false,
        error: 'Access Denied: Student accounts must sign in via Achariya VoiceLab or Mobile App.',
        redirectUrl: 'https://voice.achariya.in/student/'
      });
      return;
    }

    if (portal === 'STUDENT' && !isStudent && user.roleName !== 'Super Admin') {
      reply.status(403).send({
        success: false,
        error: 'Access Denied: Staff accounts must sign in via Achariya Educator LMS.',
        redirectUrl: 'https://learning.achariya.in/staff/home'
      });
      return;
    }
  };
}
