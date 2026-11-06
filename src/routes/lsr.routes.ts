import { FastifyInstance } from 'fastify';
import { LsrController } from '../controllers/lsr.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export async function lsrRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  fastify.get('/api/activity/lsr/level-test/:grade', LsrController.getLevelTest);
  fastify.get('/api/lsr-dictionary/manifest', LsrController.getDictionaryManifest);
  fastify.post('/api/activity/lsr/evaluate-phonemes', LsrController.evaluatePhonemes);
  fastify.post('/api/activity/lsr/submit-speech', LsrController.submitSpeech);
  fastify.get('/api/activity/lsr/result', LsrController.getStudentResults);
  fastify.get('/api/activity/lsr/level-test-result', LsrController.getLevelTestResult);
}

