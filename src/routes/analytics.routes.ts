import { FastifyInstance } from 'fastify';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  fastify.get(
    '/api/analytics/score-insights',
    { preHandler: [requirePermission('assessment:homework:grade')] },
    AnalyticsController.getScoreInsights
  );

  fastify.get(
    '/api/analytics/recent-quiz-sessions',
    { preHandler: [requirePermission('assessment:homework:grade')] },
    AnalyticsController.getRecentQuizSessions
  );
}
