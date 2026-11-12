import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ENV } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRateLimit } from '../lib/rate-limit.js';

export async function authRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/auth/login
   * Unified login endpoint — rate-limited to 5 attempts per IP per minute.
   */
  fastify.post('/api/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const clientIp = request.ip ?? 'unknown';
    const { allowed, remaining, resetAt } = checkRateLimit(`login:${clientIp}`, 5, 60_000);

    if (!allowed) {
      reply.header('Retry-After', Math.ceil((resetAt - Date.now()) / 1000).toString());
      return reply.status(429).send({
        success: false,
        error: 'Too many login attempts. Please wait before trying again.',
        retryAfterSeconds: Math.ceil((resetAt - Date.now()) / 1000)
      });
    }

    const { email, password, portal } = request.body as {
      email?: string;
      password?: string;
      portal?: 'STAFF' | 'STUDENT' | 'SUPERADMIN';
    };

    if (!email || !password) {
      return reply.status(400).send({ success: false, error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } }
          }
        },
        campus: { include: { license: true } }
      }
    });

    if (!user) {
      return reply.status(401).send({ success: false, error: 'Invalid credentials.' });
    }

    if (user.isDeleted) {
      return reply.status(401).send({ success: false, error: 'This account has been deactivated.' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return reply.status(401).send({ success: false, error: 'Invalid credentials.' });
    }

    const isStudent = user.role.name === 'Student';
    if (portal === 'STAFF' && isStudent) {
      return reply.status(403).send({
        success: false,
        error: 'Student accounts must sign in via Achariya VoiceLab or Mobile App.',
        redirectUrl: 'https://voice.achariya.in/student/'
      });
    }

    const token = jwt.sign(
      {
        sub:      user.id,
        userKey:  user.userKey,
        roleKey:  user.role.roleKey,
        roleName: user.role.name,
        campusId: user.campusId,
        schoolKey: user.campus?.schoolKey ?? null
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return reply.send({
      success: true,
      token,
      user: {
        id:        user.id,
        userKey:   user.userKey,
        email:     user.email,
        fullName:  user.fullName,
        roleKey:   user.role.roleKey,
        roleName:  user.role.name,
        scope:     user.role.scope,
        campus: user.campus ? {
          id:          user.campus.id,
          name:        user.campus.name,
          schoolKey:   user.campus.schoolKey,
          affiliation: user.campus.affiliation
        } : null,
        license:     user.campus?.license ?? null,
        permissions: user.role.permissions.map(rp => rp.permission.code)
      }
    });
  });

  /**
   * GET /api/auth/me
   * Returns the full authenticated user profile (used by frontend to restore session).
   */
  fastify.get('/api/auth/me', { preHandler: [authenticateToken] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.currentUser!;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } }
          }
        },
        campus: { include: { license: true } }
      }
    });

    if (!user || user.isDeleted) {
      return reply.status(401).send({ success: false, error: 'Session invalid. Please sign in again.' });
    }

    return reply.send({
      success: true,
      user: {
        id:        user.id,
        userKey:   user.userKey,
        email:     user.email,
        fullName:  user.fullName,
        roleKey:   user.role.roleKey,
        roleName:  user.role.name,
        scope:     user.role.scope,
        campus: user.campus ? {
          id:          user.campus.id,
          name:        user.campus.name,
          schoolKey:   user.campus.schoolKey,
          affiliation: user.campus.affiliation
        } : null,
        license:     user.campus?.license ?? null,
        permissions: user.role.permissions.map(rp => rp.permission.code)
      }
    });
  });

  /**
   * POST /api/auth/logout
   * Clears the session cookie (token invalidation requires a token blacklist in production).
   */
  fastify.post('/api/auth/logout', { preHandler: [authenticateToken] }, async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie('achariya_token');
    return reply.send({ success: true, message: 'Signed out successfully.' });
  });

  /**
   * POST /apis/api_index.php/redirectaitools/ai_tools/
   * SSO ticket handshake for Achariya AI Tools.
   * Uses constant-time comparison to prevent timing attacks.
   */
  fastify.post('/apis/api_index.php/redirectaitools/ai_tools/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { security_key, id, role } = request.body as {
      security_key?: string;
      id?: string;
      role?: string;
    };

    if (!security_key) {
      return reply.status(403).send({ success: false, error: 'Missing security key.' });
    }

    const expected = Buffer.from(ENV.SSO_HMAC_SECRET, 'utf8');
    const received = Buffer.from(security_key, 'utf8');

    const keysMatch =
      expected.length === received.length &&
      crypto.timingSafeEqual(expected, received);

    if (!keysMatch) {
      return reply.status(403).send({ success: false, error: 'Invalid security key.' });
    }

    if (!id) {
      return reply.status(400).send({ success: false, error: 'Missing user ID.' });
    }

    const ticket = crypto.randomBytes(32).toString('hex');
    const redirectUrl = `https://score.achariya.in/api/auth/sso?ticket=${ticket}&uid=${encodeURIComponent(id)}&role=${encodeURIComponent(role ?? '')}`;

    return reply.send({ message: { success: true, redirect_url: redirectUrl } });
  });
}
