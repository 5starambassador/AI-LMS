import { FastifyInstance } from 'fastify';
import { StudentIntelligenceController } from '../controllers/student-intelligence.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export async function studentIntelligenceRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  fastify.get('/api/student-intelligence/profile/:studentId', StudentIntelligenceController.getMasterProfile);
  fastify.post('/api/student-intelligence/bmit/assess', StudentIntelligenceController.updateBmitOrCounsellorReview);
  fastify.post('/api/student-intelligence/vak/assess', StudentIntelligenceController.submitVakAssessment);
  fastify.get('/api/student-intelligence/career/:studentId', StudentIntelligenceController.getCareerIntelligence);
  fastify.post('/api/student-intelligence/portfolio/:studentId', StudentIntelligenceController.addPortfolioEntry);
  fastify.post('/api/student-intelligence/parent-companion', StudentIntelligenceController.askParentCompanion);
  fastify.get('/api/student-intelligence/institutional-overview', StudentIntelligenceController.getInstitutionalOverview);
}
