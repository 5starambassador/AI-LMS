import { FastifyInstance } from 'fastify';
import { ScoreController } from '../controllers/score.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export async function scoreRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  // List exams — any authenticated staff can view
  fastify.get('/api/score/exams', ScoreController.listExams);

  // Create exam — requires permission
  fastify.post('/api/score/exams',
    { preHandler: [requirePermission('score:exam:create')] },
    ScoreController.createExam
  );

  // Download batch PDF — teacher who owns exam
  fastify.get('/api/score/exams/:id/batch-pdf',
    { preHandler: [requirePermission('score:exam:create')] },
    ScoreController.downloadBatchPdf
  );

  // Handwriting OCR — requires autoGrade license (enforced at controller level too)
  fastify.post('/api/score/ocr/transcribe-handwriting',
    { preHandler: [requirePermission('score:grade:run')] },
    ScoreController.transcribeHandwriting
  );

  // Assign batch exam to class section
  fastify.post('/api/score/exams/:id/assign-batch',
    { preHandler: [requirePermission('score:exam:assign')] },
    ScoreController.assignBatchExam
  );

  // Grading pipeline
  fastify.post('/api/score/grader/runs',
    { preHandler: [requirePermission('score:grade:run')] },
    ScoreController.createGradingRun
  );
  fastify.post('/api/score/grader/runs/:id/process',
    { preHandler: [requirePermission('score:grade:process')] },
    ScoreController.processGradingRun
  );

  // Exam insights — any authenticated staff can view
  fastify.get('/api/score/exams/:id/insights', ScoreController.getExamInsights);
}
