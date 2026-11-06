import { FastifyInstance } from 'fastify';
import { AssessmentController } from '../controllers/assessment.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export async function assessmentRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  // Homework Endpoints
  fastify.get('/api/assessment/homework', AssessmentController.listHomework);
  fastify.post('/api/assessment/homework', AssessmentController.createHomework);
  fastify.post('/api/assessment/homework/:id/submit', AssessmentController.submitHomework);
  fastify.post('/api/assessment/homework/submissions/:id/grade', AssessmentController.gradeHomework);

  // Quiz Endpoints
  fastify.get('/api/assessment/quizzes', AssessmentController.listQuizzes);
  fastify.post('/api/assessment/quizzes', AssessmentController.createQuiz);
  fastify.get('/api/assessment/quizzes/:id', AssessmentController.getQuizDetails);
  fastify.post('/api/assessment/quizzes/:id/submit', AssessmentController.submitQuiz);

  // Worksheet Endpoints
  fastify.get('/api/assessment/worksheets', AssessmentController.listWorksheets);
  fastify.post('/api/assessment/worksheets', AssessmentController.createWorksheet);
}

