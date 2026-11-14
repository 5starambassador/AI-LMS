import { FastifyInstance } from 'fastify';
import { LearningGapsController } from '../controllers/learning-gaps.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export async function learningGapsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticateToken);

  // 1. Curriculum Master & Prerequisite Graph
  fastify.get('/api/learning-gaps/curriculum/concepts', LearningGapsController.listConcepts);
  fastify.get('/api/learning-gaps/curriculum/concepts/:id/prerequisites', LearningGapsController.getConceptPrerequisiteTree);

  // 2. Central Register & Gap Diagnostic Engine
  fastify.get('/api/learning-gaps/register', LearningGapsController.listLearningGaps);
  fastify.get('/api/learning-gaps/:id', LearningGapsController.getLearningGapDetails);
  fastify.post('/api/learning-gaps/diagnose', LearningGapsController.diagnoseAssessment);

  // 3. Personalized Remediation Pathway & Interactive Steps
  fastify.get('/api/learning-gaps/:id/pathway', LearningGapsController.getRemediationPathway);
  fastify.post('/api/learning-gaps/:id/pathway/complete-step', LearningGapsController.completePathwayStep);
  fastify.post('/api/learning-gaps/:id/pathway/submit-foundation-test', LearningGapsController.submitFoundationTest);
  fastify.post('/api/learning-gaps/:id/pathway/submit-reassessment', LearningGapsController.submitCurrentGradeReassessment);

  // 4. Teacher Interventions
  fastify.post('/api/learning-gaps/:id/teacher-action', LearningGapsController.teacherInterventionAction);

  // 5. Academic Analytics & Dashboards
  fastify.get('/api/learning-gaps/analytics/summary', LearningGapsController.getSummaryAnalytics);
  fastify.get('/api/learning-gaps/analytics/campus-comparison', LearningGapsController.getCampusComparison);
  fastify.get('/api/learning-gaps/analytics/concept-heatmaps', LearningGapsController.getConceptHeatmaps);
  fastify.get('/api/learning-gaps/analytics/curriculum-recommendations', LearningGapsController.getCurriculumRecommendations);

  // 6. Reports
  fastify.get('/api/learning-gaps/reports/student/:studentId', LearningGapsController.getStudentReport);

  // 7. AI-First Intelligence Engines (Companion, Copilot, Adaptive Gen, Academy Intelligence)
  fastify.post('/api/learning-gaps/ai/companion-chat', LearningGapsController.chatWithCompanion);
  fastify.post('/api/learning-gaps/ai/teacher-copilot', LearningGapsController.queryTeacherCopilot);
  fastify.post('/api/learning-gaps/ai/generate-questions', LearningGapsController.generateAdaptiveQuestions);
  fastify.post('/api/learning-gaps/ai/institutional-query', LearningGapsController.queryInstitutionIntelligence);
  fastify.post('/api/learning-gaps/ai/generate-concept', LearningGapsController.generateNoCodeConceptGraph);
  fastify.get('/api/learning-gaps/student-profile/:studentId', LearningGapsController.getStudentLearningProfile);
  fastify.get('/api/learning-gaps/predict-vulnerabilities/:studentId', LearningGapsController.getPredictedVulnerabilities);
}

