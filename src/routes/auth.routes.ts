import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ENV } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRateLimit } from '../lib/rate-limit.js';

const QR_TTL_MS = 5 * 60 * 1000; // 5 minutes

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

  // ─── CLASS & SECTION PICKER (used by QR panel) ───────────────────────────

  /**
   * GET /api/academic/classes-with-sections
   * Returns classes + their sections for the user's campus (teacher / admin use).
   */
  fastify.get('/api/academic/classes-with-sections', { preHandler: [authenticateToken] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.currentUser!;
    if (!user.campusId) return reply.send({ success: true, classes: [] });

    const classes = await prisma.class.findMany({
      where: { campusId: user.campusId },
      include: { sections: { select: { id: true, name: true }, orderBy: { name: 'asc' } } },
      orderBy: { orderIndex: 'asc' }
    });

    return reply.send({ success: true, classes: classes.map(c => ({ id: c.id, name: c.name, sections: c.sections })) });
  });

  // ─── QR CLASSROOM LOGIN ───────────────────────────────────────────────────

  /**
   * POST /api/auth/qr-session
   * Teacher creates a QR session for their class. Returns a short-lived token
   * that encodes into a QR code students can scan to log in without a password.
   */
  fastify.post('/api/auth/qr-session', { preHandler: [authenticateToken] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.currentUser!;
    const { classId, sectionId } = request.body as { classId: string; sectionId?: string };

    if (!classId) {
      return reply.status(400).send({ success: false, error: 'classId is required.' });
    }

    if (!user.campusId) {
      return reply.status(400).send({ success: false, error: 'User is not assigned to a campus.' });
    }

    // Expire any active sessions from this teacher for this class (clean slate)
    await prisma.qrSession.deleteMany({
      where: { createdById: user.sub, classId, expiresAt: { gt: new Date() } }
    });

    const expiresAt = new Date(Date.now() + QR_TTL_MS);
    const session = await prisma.qrSession.create({
      data: {
        campusId: user.campusId,
        classId,
        sectionId: sectionId ?? null,
        createdById: user.sub,
        expiresAt
      }
    });

    return reply.status(201).send({
      success: true,
      token: session.token,
      expiresAt: session.expiresAt,
      ttlSeconds: QR_TTL_MS / 1000
    });
  });

  /**
   * GET /api/auth/qr/:token/students
   * Public endpoint — no auth required. Validates token and returns the roster
   * of students the teacher assigned to this QR session's class/section.
   */
  fastify.get('/api/auth/qr/:token/students', async (request: FastifyRequest, reply: FastifyReply) => {
    const { token } = request.params as { token: string };

    const session = await prisma.qrSession.findUnique({ where: { token } });
    if (!session || session.expiresAt < new Date()) {
      return reply.status(410).send({ success: false, error: 'QR session has expired. Ask your teacher to regenerate.' });
    }

    const where: Record<string, unknown> = {
      campusId: session.campusId,
      classId: session.classId,
      isDeleted: false
    };
    if (session.sectionId) where.sectionId = session.sectionId;

    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        campusId: session.campusId,
        classId: session.classId,
        ...(session.sectionId ? { sectionId: session.sectionId } : {})
      },
      select: {
        rollNumber: true,
        student: { select: { id: true, fullName: true } }
      },
      orderBy: { rollNumber: 'asc' }
    });

    const students = enrollments.map(e => ({
      id: e.student.id,
      name: e.student.fullName,
      roll: e.rollNumber
    }));

    return reply.send({
      success: true,
      count: students.length,
      expiresAt: session.expiresAt,
      students
    });
  });

  /**
   * POST /api/auth/qr/:token/claim
   * Public endpoint — student taps their name, server issues a full JWT for them.
   */
  fastify.post('/api/auth/qr/:token/claim', async (request: FastifyRequest, reply: FastifyReply) => {
    const { token } = request.params as { token: string };
    const { studentId } = request.body as { studentId: string };

    if (!studentId) {
      return reply.status(400).send({ success: false, error: 'studentId is required.' });
    }

    const session = await prisma.qrSession.findUnique({ where: { token } });
    if (!session || session.expiresAt < new Date()) {
      return reply.status(410).send({ success: false, error: 'QR session has expired.' });
    }

    // Verify the student actually belongs to this campus/class
    const enrollment = await prisma.studentEnrollment.findFirst({
      where: {
        studentId,
        campusId: session.campusId,
        classId: session.classId,
        ...(session.sectionId ? { sectionId: session.sectionId } : {})
      }
    });
    if (!enrollment) {
      return reply.status(403).send({ success: false, error: 'Student not found in this class.' });
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
        campus: { include: { license: true } }
      }
    });
    if (!student || student.isDeleted) {
      return reply.status(404).send({ success: false, error: 'Student account not found.' });
    }

    const jwtToken = jwt.sign(
      {
        sub:      student.id,
        userKey:  student.userKey,
        roleKey:  student.role.roleKey,
        roleName: student.role.name,
        campusId: student.campusId,
        schoolKey: student.campus?.schoolKey ?? null
      },
      ENV.JWT_SECRET,
      { expiresIn: '8h' }
    );

    await prisma.user.update({ where: { id: student.id }, data: { lastLoginAt: new Date() } });

    // Auto-mark PRESENT for today via QR scan
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.dailyAttendance.upsert({
      where: { date_studentId: { date: today, studentId: student.id } },
      update: { status: 'PRESENT', remarks: 'QR scan' },
      create: {
        date: today,
        campusId: session.campusId,
        classId: session.classId,
        sectionId: session.sectionId ?? enrollment.sectionId ?? '',
        studentId: student.id,
        status: 'PRESENT',
        remarks: 'QR scan'
      }
    });

    return reply.send({
      success: true,
      token: jwtToken,
      user: {
        id:        student.id,
        userKey:   student.userKey,
        email:     student.email,
        fullName:  student.fullName,
        roleKey:   student.role.roleKey,
        roleName:  student.role.name,
        scope:     student.role.scope,
        campus: student.campus ? {
          id:          student.campus.id,
          name:        student.campus.name,
          schoolKey:   student.campus.schoolKey,
          affiliation: student.campus.affiliation
        } : null,
        license:     student.campus?.license ?? null,
        permissions: student.role.permissions.map(rp => rp.permission.code)
      }
    });
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
