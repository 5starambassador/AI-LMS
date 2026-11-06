import { FastifyInstance } from 'fastify';
import { ScoreController } from '../controllers/score.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export async function scoreRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  fastify.get('/api/score/exams', ScoreController.listExams);
  fastify.get('/api/score/exams/:id/batch-pdf', ScoreController.downloadBatchPdf);
  fastify.post('/api/score/exams', ScoreController.createExam);
  fastify.post('/api/score/ocr/transcribe-handwriting', ScoreController.transcribeHandwriting);
  fastify.post('/api/score/exams/:id/assign-batch', ScoreController.assignBatchExam);
  fastify.post('/api/score/grader/runs', ScoreController.createGradingRun);
  fastify.post('/api/score/grader/runs/:id/process', ScoreController.processGradingRun);
  fastify.get('/api/score/exams/:id/insights', ScoreController.getExamInsights);
}

