import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import * as path from 'path';
import * as fs from 'fs';
import { ENV } from './config/env.js';
import { AppError } from './lib/errors.js';
import { prisma } from './lib/prisma.js';
import { authRoutes } from './routes/auth.routes.js';
import { academicRoutes } from './routes/academic.routes.js';
import { assessmentRoutes } from './routes/assessment.routes.js';
import { operationsRoutes } from './routes/operations.routes.js';
import { scoreRoutes } from './routes/score.routes.js';
import { hpcRoutes } from './routes/hpc.routes.js';
import { lsrRoutes } from './routes/lsr.routes.js';
import { analyticsRoutes } from './routes/analytics.routes.js';
import { parentRoutes } from './routes/parent.routes.js';
import { timetableRoutes } from './routes/timetable.routes.js';
import { noticeboardRoutes } from './routes/noticeboard.routes.js';
import { reportcardRoutes } from './routes/reportcard.routes.js';
import { leaveRoutes } from './routes/leave.routes.js';
import { feeRoutes } from './routes/fee.routes.js';

export async function buildApp() {
  const app = fastify({
    logger: {
      level: ENV.NODE_ENV === 'test' ? 'silent' : 'info'
    }
  });

  // Strict CORS: only allow explicitly listed origins
  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow server-to-server requests with no origin (e.g. mobile apps, curl, cron jobs)
      if (!origin) return cb(null, true);

      if (
        ENV.ALLOWED_ORIGINS.includes(origin) ||
        origin.endsWith('.achariya.in') ||
        origin.endsWith('.chrysalis.world')
      ) {
        return cb(null, true);
      }

      // Reject all other origins — never fall through to cb(null, true)
      return cb(new Error(`CORS: Origin ${origin} not permitted.`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  });

  // Global error handler — translates AppError subclasses into consistent JSON responses
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: error.message,
        code: error.code ?? undefined
      });
    }

    // Fastify validation errors (request body schema mismatch)
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        error: 'Request validation failed.',
        details: error.validation
      });
    }

    // Log unexpected errors and respond with a safe 500
    app.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'An internal server error occurred. Please try again later.'
    });
  });

  // Liveness probe — returns immediately, no DB connection required
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    platform: 'Achariya AI ONE Enterprise Platform'
  }));

  // Readiness probe — confirms DB connection before accepting traffic
  app.get('/ready', async (_request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return reply.send({ status: 'ready', db: 'connected', timestamp: new Date().toISOString() });
    } catch (err) {
      app.log.error('Readiness check: database not reachable', err);
      return reply.status(503).send({ status: 'not_ready', db: 'disconnected' });
    }
  });

  // ─── API Routes (Fastify plugin registration) ──────────────────────────────
  // Each route module is an independent plugin. To add a new module:
  //   1. Create src/routes/<module>.routes.ts
  //   2. Create src/controllers/<module>.controller.ts
  //   3. Register below: await app.register(<module>Routes);
  await app.register(authRoutes);
  await app.register(academicRoutes);
  await app.register(assessmentRoutes);
  await app.register(operationsRoutes);
  await app.register(scoreRoutes);
  await app.register(hpcRoutes);
  await app.register(lsrRoutes);
  await app.register(analyticsRoutes);
  await app.register(parentRoutes);
  await app.register(timetableRoutes);
  await app.register(noticeboardRoutes);
  await app.register(reportcardRoutes);
  await app.register(leaveRoutes);
  await app.register(feeRoutes);

  // ─── Static Assets ─────────────────────────────────────────────────────────

  // Serve generated exam PDFs and OMR sheets
  const publicRendersPath = path.resolve(process.cwd(), 'public', 'renders');
  if (!fs.existsSync(publicRendersPath)) {
    fs.mkdirSync(publicRendersPath, { recursive: true });
  }
  await app.register(fastifyStatic, {
    root: publicRendersPath,
    prefix: '/renders/',
    decorateReply: false
  });

  // Serve compiled frontend SPA from dist/
  const distPath = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    await app.register(fastifyStatic, {
      root: distPath,
      prefix: '/',
      // decorateReply already set above — do not set again
    });

    // SPA fallback: non-API routes serve index.html so React handles routing
    app.setNotFoundHandler((req, reply) => {
      const url = req.raw.url ?? '';
      if (!url.startsWith('/api') && !url.startsWith('/apis') && !url.startsWith('/renders') && !url.startsWith('/health') && !url.startsWith('/ready')) {
        return reply.sendFile('index.html');
      }
      return reply.status(404).send({ success: false, error: 'Endpoint not found.' });
    });
  }

  return app;
}
