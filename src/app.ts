import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';
import { authRoutes } from './routes/auth.routes.js';
import { academicRoutes } from './routes/academic.routes.js';
import { assessmentRoutes } from './routes/assessment.routes.js';
import { operationsRoutes } from './routes/operations.routes.js';
import { scoreRoutes } from './routes/score.routes.js';
import { hpcRoutes } from './routes/hpc.routes.js';
import { lsrRoutes } from './routes/lsr.routes.js';

export async function buildApp() {
  const app = fastify({
    logger: {
      level: ENV.NODE_ENV === 'test' ? 'silent' : 'info'
    }
  });

  // Register CORS
  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return cb(null, true);
      if (ENV.ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.chrysalis.world')) {
        return cb(null, true);
      }
      return cb(null, true); // Permissive in development
    },
    credentials: true
  });

  // Register Health Check
  app.get('/health', async () => {
    return { status: 'healthy', timestamp: new Date().toISOString(), platform: 'Achariya AI ONE Enterprise Platform' };
  });

  // Register API Routes
  await app.register(authRoutes);
  await app.register(academicRoutes);
  await app.register(assessmentRoutes);
  await app.register(operationsRoutes);
  await app.register(scoreRoutes);
  await app.register(hpcRoutes);
  await app.register(lsrRoutes);

  // Serve Generated Physical Batch Exam PDFs & Static Assets via @fastify/static
  const publicRendersPath = path.resolve(process.cwd(), 'public', 'renders');
  if (!fs.existsSync(publicRendersPath)) {
    fs.mkdirSync(publicRendersPath, { recursive: true });
  }
  await app.register(fastifyStatic, {
    root: publicRendersPath,
    prefix: '/renders/',
    decorateReply: false
  });

  // Serve Static Production Frontend SPA from dist/
  const distPath = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    await app.register(fastifyStatic, {
      root: distPath,
      prefix: '/'
    });

    // SPA Fallback: Any non-API & non-static route serves index.html
    app.setNotFoundHandler((req, reply) => {
      if (!req.raw.url?.startsWith('/api') && !req.raw.url?.startsWith('/apis') && !req.raw.url?.startsWith('/renders')) {
        return reply.sendFile('index.html');
      }
      return reply.status(404).send({ success: false, error: 'Endpoint not found.' });
    });
  }

  return app;
}

