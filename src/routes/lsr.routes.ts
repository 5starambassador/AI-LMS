import { FastifyInstance } from 'fastify';
import { LsrController } from '../controllers/lsr.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export async function lsrRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  // Level test and dictionary are readable by any authenticated user (student/teacher)
  fastify.get('/api/activity/lsr/level-test/:grade', LsrController.getLevelTest);
  fastify.get('/api/lsr-dictionary/manifest', LsrController.getDictionaryManifest);

  // Speech evaluation and submission — students only (enforced at controller level by role check)
  fastify.post('/api/activity/lsr/evaluate-phonemes', LsrController.evaluatePhonemes);
  fastify.post('/api/activity/lsr/submit-speech', LsrController.submitSpeech);

  // Results accessible by both student (own) and teacher (class view)
  fastify.get('/api/activity/lsr/result', LsrController.getStudentResults);
  fastify.get('/api/activity/lsr/level-test-result', LsrController.getLevelTestResult);
}
