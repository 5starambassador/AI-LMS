import { FastifyInstance } from 'fastify';
import { AssessmentController } from '../controllers/assessment.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export async function assessmentRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  // Homework — read: all authenticated; write: teachers only
  fastify.get('/api/assessment/homework', AssessmentController.listHomework);
  fastify.post('/api/assessment/homework',
    { preHandler: [requirePermission('assessment:homework:create')] },
    AssessmentController.createHomework
  );
  fastify.post('/api/assessment/homework/:id/submit', AssessmentController.submitHomework);
  fastify.get('/api/assessment/homework/:id/submissions',
    { preHandler: [requirePermission('assessment:homework:grade')] },
    AssessmentController.listSubmissions
  );
  fastify.post('/api/assessment/homework/submissions/:id/grade',
    { preHandler: [requirePermission('assessment:homework:grade')] },
    AssessmentController.gradeHomework
  );

  // Quizzes — read: all authenticated; create: teachers only
  fastify.get('/api/assessment/quizzes', AssessmentController.listQuizzes);
  fastify.post('/api/assessment/quizzes',
    { preHandler: [requirePermission('assessment:quiz:create')] },
    AssessmentController.createQuiz
  );
  fastify.get('/api/assessment/quizzes/:id', AssessmentController.getQuizDetails);
  fastify.post('/api/assessment/quizzes/:id/submit', AssessmentController.submitQuiz);

  // Worksheets — read: all authenticated; create: teachers only
  fastify.get('/api/assessment/worksheets', AssessmentController.listWorksheets);
  fastify.post('/api/assessment/worksheets',
    { preHandler: [requirePermission('assessment:worksheet:create')] },
    AssessmentController.createWorksheet
  );
}
