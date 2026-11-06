import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { ENV } from '../config/env.js';
import { authenticateToken } from '../middleware/auth.js';

const prisma = new PrismaClient();

export async function authRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/auth/login
   * Unified Login endpoint for Achariya AI ONE
   */
  fastify.post('/api/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password, portal } = request.body as {
      email?: string;
      password?: string;
      portal?: 'STAFF' | 'STUDENT' | 'SUPERADMIN';
    };

    if (!email || !password) {
      return reply.status(400).send({
        success: false,
        error: 'Email and password are required.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true }
            }
          }
        },
        campus: {
          include: { license: true }
        }
      }
    });

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid credentials. User account not found.'
      });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid credentials.'
      });
    }

    const isStudent = user.role.name === 'Student';

    // Enforce Domain Partitioning Rule:
    // If student attempts to log in via STAFF portal:
    if (portal === 'STAFF' && isStudent) {
      return reply.status(403).send({
        success: false,
        error: 'Access Denied: Student accounts must sign in via Achariya VoiceLab or Mobile App.',
        redirectUrl: 'https://voice.achariya.in/student/'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        sub: user.id,
        userKey: user.userKey,
        roleKey: user.role.roleKey,
        roleName: user.role.name,
        campusId: user.campusId,
        schoolKey: user.campus?.schoolKey || null
      },
      ENV.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return reply.send({
      success: true,
      token,
      user: {
        id: user.id,
        userKey: user.userKey,
        email: user.email,
        fullName: user.fullName,
        roleKey: user.role.roleKey,
        roleName: user.role.name,
        scope: user.role.scope,
        campus: user.campus
          ? {
              id: user.campus.id,
              name: user.campus.name,
              schoolKey: user.campus.schoolKey,
              affiliation: user.campus.affiliation
            }
          : null,
        license: user.campus?.license || null,
        permissions: user.role.permissions.map((rp) => rp.permission.code)
      }
    });
  });

  /**
   * GET /api/auth/me
   * Return authenticated profile
   */
  fastify.get('/api/auth/me', { preHandler: [authenticateToken] }, async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      success: true,
      user: request.currentUser
    });
  });

  /**
   * POST /apis/api_index.php/redirectaitools/ai_tools/
   * Asymmetric SSO Ticket Handshake for Achariya AI Tools
   */
  fastify.post('/apis/api_index.php/redirectaitools/ai_tools/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { security_key, id, role } = request.body as {
      security_key?: string;
      id?: string;
      role?: string;
    };

    if (security_key !== ENV.SSO_HMAC_SECRET) {
      return reply.status(403).send({ success: false, error: 'Invalid security key handshake.' });
    }

    const ticket = crypto.randomBytes(32).toString('hex');
    const redirectUrl = `https://score.achariya.in/api/auth/sso?ticket=${ticket}&uid=${id}&role=${role}`;

    return reply.send({
      message: {
        success: true,
        redirect_url: redirectUrl
      }
    });
  });
}
