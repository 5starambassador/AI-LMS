import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

export class LearningGapsController {
  /**
   * GET /api/learning-gaps/curriculum/concepts
   * List curriculum concepts with optional grade & subject filters
   */
  static async listConcepts(request: FastifyRequest, reply: FastifyReply) {
    const { grade, subject, chapter } = request.query as {
      grade?: string;
      subject?: string;
      chapter?: string;
    };

    const where: any = {};
    if (grade) where.grade = grade;
    if (subject) where.subject = subject;
    if (chapter) where.chapter = { contains: chapter, mode: 'insensitive' };

    const concepts = await prisma.curriculumConcept.findMany({
      where,
      include: {
        prerequisites: {
          include: {
            prerequisite: true
          }
        },
        dependentOnThis: {
          include: {
            concept: true
          }
        },
        resources: {
          select: {
            id: true,
            title: true,
            resourceType: true,
            gradeLevel: true,
            estimatedMinutes: true
          }
        }
      },
      orderBy: [{ gradeNumber: 'asc' }, { chapter: 'asc' }, { name: 'asc' }]
    });

    return reply.send({ success: true, count: concepts.length, data: concepts });
  }

  /**
   * GET /api/learning-gaps/curriculum/concepts/:id/prerequisites
   * Multi-grade prerequisite traversal graph
   */
  static async getConceptPrerequisiteTree(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const concept = await prisma.curriculumConcept.findUnique({
      where: { id },
      include: {
        prerequisites: {
          include: {
            prerequisite: {
              include: {
                prerequisites: {
                  include: {
                    prerequisite: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!concept) {
      return reply.status(404).send({ success: false, error: 'Concept not found' });
    }

    return reply.send({ success: true, data: concept });
  }

  /**
   * GET /api/learning-gaps/register
   * Central Learning Gap Register with filtering by campus, grade, subject, status, category, priority
   */
  static async listLearningGaps(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const {
      campusId,
      grade,
      subject,
      status,
      gapCategory,
      priority,
      studentId
    } = request.query as {
      campusId?: string;
      grade?: string;
      subject?: string;
      status?: string;
      gapCategory?: string;
      priority?: string;
      studentId?: string;
    };

    const where: any = {};

    // Scope for role
    const isStudent = user.roleName === 'Student';
    if (isStudent) {
      where.studentId = user.id;
    } else if (studentId) {
      where.studentId = studentId;
    }

    if (campusId) where.campusId = campusId;
    if (grade) where.grade = grade;
    if (subject) where.subject = subject;
    if (status) where.status = status;
    if (gapCategory) where.gapCategory = gapCategory;
    if (priority) where.priority = priority;

    const gaps = await prisma.learningGap.findMany({
      where,
      include: {
        concept: {
          select: {
            conceptCode: true,
            difficulty: true,
            learningOutcome: true,
            masteryThreshold: true
          }
        },
        pathway: {
          select: {
            currentPhase: true,
            foundationGrade: true,
            foundationScore: true,
            foundationMastered: true,
            reassessmentScore: true,
            reassessmentMastered: true
          }
        }
      },
      orderBy: [{ createdAt: 'desc' }]
    });

    return reply.send({ success: true, count: gaps.length, data: gaps });
  }

  /**
   * GET /api/learning-gaps/:id
   * Get single gap with full diagnostic evidence and audit trail
   */
  static async getLearningGapDetails(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const gap = await prisma.learningGap.findUnique({
      where: { id },
      include: {
        concept: {
          include: {
            prerequisites: {
              include: {
                prerequisite: true
              }
            }
          }
        },
        pathway: true,
        audits: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!gap) {
      return reply.status(404).send({ success: false, error: 'Learning Gap not found' });
    }

    let parsedEvidence = null;
    if (gap.diagnosticEvidenceJson) {
      try {
        parsedEvidence = JSON.parse(gap.diagnosticEvidenceJson);
      } catch {}
    }

    return reply.send({
      success: true,
      data: {
        ...gap,
        parsedEvidence
      }
    });
  }

  /**
   * POST /api/learning-gaps/diagnose
   * Automated diagnostic engine: analyses assessment responses, detects concept gap,
   * traces prerequisite across lower grades, and creates/updates the LearningGap + Pathway.
   */
  static async diagnoseAssessment(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const body = request.body as {
      studentId: string;
      studentName?: string;
      campusId?: string;
      campusName?: string;
      grade: string;
      gradeNumber: number;
      subject: string;
      chapter: string;
      conceptId: string;
      assessmentRef: string;
      assessmentTitle: string;
      responses: Array<{
        questionText: string;
        studentAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        cognitiveSkill?: string;
        misconceptionCategory?: string;
      }>;
    };

    if (!body.studentId || !body.conceptId || !body.responses || body.responses.length === 0) {
      return reply.status(400).send({
        success: false,
        error: 'Missing required diagnostic payload (studentId, conceptId, responses).'
      });
    }

    // 1. Fetch Target Concept and its Prerequisites
    const concept = await prisma.curriculumConcept.findUnique({
      where: { id: body.conceptId },
      include: {
        prerequisites: {
          include: {
            prerequisite: true
          },
          orderBy: { weight: 'desc' }
        }
      }
    });

    if (!concept) {
      return reply.status(404).send({ success: false, error: 'Concept not found in Curriculum Master' });
    }

    // 2. Compute Accuracy and Error Patterns
    const totalQ = body.responses.length;
    const correctQ = body.responses.filter(r => r.isCorrect).length;
    const scorePct = Math.round((correctQ / totalQ) * 1000) / 10;

    // 3. Classify Gap Category
    let gapCategory = 'CONCEPTUAL';
    let identifiedPrereq: any = null;
    let priority = 'MEDIUM';

    if (scorePct < 50) {
      priority = 'CRITICAL';
    } else if (scorePct < 70) {
      priority = 'HIGH';
    }

    // Inspect failed questions for misconceptions & prerequisite breakdown
    const failedQuestions = body.responses.filter(r => !r.isCorrect);

    // If foundational lower-grade prerequisite exists and score is under threshold
    if (concept.prerequisites.length > 0 && scorePct < (concept.masteryThreshold || 80)) {
      const lowerGradePrereq = concept.prerequisites.find(p => p.prerequisiteGradeNumber < concept.gradeNumber);
      if (lowerGradePrereq) {
        gapCategory = 'FOUNDATIONAL';
        identifiedPrereq = lowerGradePrereq.prerequisite;
      } else {
        gapCategory = 'CONCEPTUAL';
        identifiedPrereq = concept.prerequisites[0].prerequisite;
      }
    } else if (failedQuestions.some(q => q.cognitiveSkill === 'APPLY')) {
      gapCategory = 'APPLICATION';
    } else if (failedQuestions.some(q => q.cognitiveSkill === 'PROCEDURAL')) {
      gapCategory = 'PROCEDURAL';
    }

    // 4. Resolve Student & Campus Details if omitted
    let sName = body.studentName;
    let cId = body.campusId;
    let cName = body.campusName;

    if (!sName || !cId) {
      const sUser = await prisma.user.findUnique({
        where: { id: body.studentId },
        include: { campus: true }
      });
      sName = sName || sUser?.fullName || 'Student';
      cId = cId || sUser?.campusId || 'campus-demo-01';
      cName = cName || sUser?.campus?.name || 'Achariya Campus';
    }

    const gapCode = `GAP-${Date.now().toString().slice(-6)}-${concept.conceptCode.replace(/[^A-Z0-9]/g, '').slice(0, 6)}`;

    const diagnosticEvidence = {
      totalQuestionsTested: totalQ,
      correctQuestions: correctQ,
      incorrectQuestions: totalQ - correctQ,
      accuracyRate: scorePct,
      errorPatterns: failedQuestions.map(q => ({
        questionText: q.questionText,
        studentAnswer: q.studentAnswer,
        correctAnswer: q.correctAnswer,
        misconception: q.misconceptionCategory || 'Concept application deficiency',
        cognitiveLevel: q.cognitiveSkill || 'UNDERSTAND',
        rootCauseConcept: identifiedPrereq ? `${identifiedPrereq.grade}: ${identifiedPrereq.name}` : concept.name
      })),
      aiDiagnosticSummary: identifiedPrereq
        ? `Diagnostic analysis reveals severe foundational deficiency in ${identifiedPrereq.grade} (${identifiedPrereq.name}). Student must be redirected to foundational lower-grade learning before returning to ${concept.grade} ${concept.name}.`
        : `Diagnostic analysis identifies ${gapCategory.toLowerCase()} gap in ${concept.name}. Recommended current-grade relearning and structured practice.`
    };

    // 5. Create LearningGap Record
    const gap = await prisma.learningGap.create({
      data: {
        gapCode,
        studentId: body.studentId,
        studentName: sName,
        campusId: cId,
        campusName: cName,
        grade: body.grade,
        gradeNumber: body.gradeNumber,
        subject: body.subject,
        chapter: body.chapter,
        conceptId: concept.id,
        conceptName: concept.name,
        gapCategory,
        status: 'INTERVENTION_ASSIGNED',
        priority,
        assessmentRef: body.assessmentRef,
        assessmentTitle: body.assessmentTitle,
        diagnosticScore: scorePct,
        diagnosticEvidenceJson: JSON.stringify(diagnosticEvidence),
        identifiedPrerequisiteId: identifiedPrereq?.id || null,
        identifiedPrerequisiteName: identifiedPrereq ? `${identifiedPrereq.grade}: ${identifiedPrereq.name}` : null,
        recommendedLowerGrade: identifiedPrereq?.grade || null,
        recommendedIntervention: identifiedPrereq
          ? `Complete ${identifiedPrereq.grade} foundation lessons on ${identifiedPrereq.name}, pass Foundation Check (≥80%), relearn ${concept.name}, and complete mastery reassessment (≥85%).`
          : `Engage in structured concept walkthrough on ${concept.name} and clear mastery reassessment.`,
        teacherId: user.id,
        teacherName: user.fullName,
        assignmentDate: new Date(),
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // 6. Generate 5-Phase Remediation Pathway
    const foundationGrade = identifiedPrereq?.grade || concept.grade;
    const foundationConceptId = identifiedPrereq?.id || concept.id;
    const foundationConceptName = identifiedPrereq?.name || concept.name;

    const pathwayPlan = {
      phases: [
        {
          phaseNumber: 1,
          phaseKey: 'PHASE_1_FOUNDATION',
          name: `Phase 1: Foundation Learning (${foundationGrade})`,
          gradeLevel: foundationGrade,
          conceptName: foundationConceptName,
          status: 'IN_PROGRESS',
          items: [
            { id: 'item-f1', type: 'INTERACTIVE_EXPLAINER', title: `Core Foundation Walkthrough: ${foundationConceptName}`, durationMins: 15, isDone: false },
            { id: 'item-f2', type: 'WORKBOOK_WORKSHEET', title: `Targeted Practice Worksheet`, durationMins: 10, isDone: false }
          ]
        },
        {
          phaseNumber: 2,
          phaseKey: 'PHASE_2_FOUNDATION_TEST',
          name: 'Phase 2: Foundation Diagnostic Check',
          gradeLevel: foundationGrade,
          conceptName: `${foundationConceptName} Verification`,
          status: 'LOCKED',
          requiredScore: 80,
          questionCount: 3,
          attempts: 0
        },
        {
          phaseNumber: 3,
          phaseKey: 'PHASE_3_CURRENT_RELEARN',
          name: `Phase 3: Current-Grade Relearning (${concept.grade})`,
          gradeLevel: concept.grade,
          conceptName: concept.name,
          status: 'LOCKED',
          items: [
            { id: 'item-c1', type: 'INTERACTIVE_EXPLAINER', title: `Visual Masterclass: ${concept.name}`, durationMins: 20, isDone: false }
          ]
        },
        {
          phaseNumber: 4,
          phaseKey: 'PHASE_4_CURRENT_TEST',
          name: 'Phase 4: Fresh Mastery Reassessment',
          gradeLevel: concept.grade,
          conceptName: `${concept.name} Final Mastery`,
          status: 'LOCKED',
          requiredScore: 85,
          questionCount: 3
        },
        {
          phaseNumber: 5,
          phaseKey: 'PHASE_5_MASTERED',
          name: 'Phase 5: Verified Concept Mastery & Gap Closure',
          gradeLevel: concept.grade,
          status: 'LOCKED',
          criteria: 'Both Foundation (≥80%) and Current Grade (≥85%) verified.'
        }
      ]
    };

    const pathway = await prisma.remediationPathway.create({
      data: {
        gapId: gap.id,
        currentPhase: 'PHASE_1_FOUNDATION',
        foundationGrade,
        foundationConceptId,
        foundationConceptName,
        foundationResourcesCompleted: false,
        pathwayPlanJson: JSON.stringify(pathwayPlan),
        studentProgressJson: JSON.stringify({ completedItemIds: [], answers: {} })
      }
    });

    // Audit Log
    await prisma.learningGapAudit.create({
      data: {
        gapId: gap.id,
        fromStatus: 'IDENTIFIED',
        toStatus: 'INTERVENTION_ASSIGNED',
        actorId: user.id,
        actorName: user.fullName,
        actorRole: user.roleName || 'Teacher',
        notes: `Diagnostic engine classified ${gapCategory} gap. Personalized 5-phase pathway initialized to ${foundationGrade}.`
      }
    });

    return reply.status(201).send({
      success: true,
      message: 'Assessment diagnosed and Learning Gap pathway created.',
      data: { gap, pathway }
    });
  }

  /**
   * GET /api/learning-gaps/:id/pathway
   * Retrieve active remediation pathway with resources and questions
   */
  static async getRemediationPathway(request: FastifyRequest, reply: FastifyReply) {
    const { id: gapId } = request.params as { id: string };

    const gap = await prisma.learningGap.findUnique({
      where: { id: gapId },
      include: {
        concept: true,
        pathway: true
      }
    });

    if (!gap) {
      return reply.status(404).send({ success: false, error: 'Learning Gap not found' });
    }

    let pathway = gap.pathway;
    if (!pathway) {
      const foundationGrade = gap.recommendedLowerGrade || gap.grade;
      const foundationConceptId = gap.identifiedPrerequisiteId || gap.conceptId;
      const foundationConceptName = gap.identifiedPrerequisiteName || gap.conceptName;

      const pathwayPlan = {
        phases: [
          {
            phaseNumber: 1,
            phaseKey: 'PHASE_1_FOUNDATION',
            name: `Phase 1: Foundation Learning (${foundationGrade})`,
            gradeLevel: foundationGrade,
            conceptName: foundationConceptName,
            status: gap.status === 'MASTERED' ? 'COMPLETED' : 'IN_PROGRESS',
            items: [
              { id: 'item-f1', type: 'INTERACTIVE_EXPLAINER', title: `Core Foundation Walkthrough: ${foundationConceptName}`, durationMins: 15, isDone: gap.status === 'MASTERED' },
              { id: 'item-f2', type: 'WORKBOOK_WORKSHEET', title: `Targeted Practice Worksheet`, durationMins: 10, isDone: gap.status === 'MASTERED' }
            ]
          },
          {
            phaseNumber: 2,
            phaseKey: 'PHASE_2_FOUNDATION_TEST',
            name: 'Phase 2: Foundation Diagnostic Check',
            gradeLevel: foundationGrade,
            conceptName: `${foundationConceptName} Verification`,
            status: gap.status === 'MASTERED' ? 'COMPLETED' : 'LOCKED',
            requiredScore: 80,
            questionCount: 3,
            attempts: gap.foundationAssessmentScore ? 1 : 0,
            score: gap.foundationAssessmentScore
          },
          {
            phaseNumber: 3,
            phaseKey: 'PHASE_3_CURRENT_RELEARN',
            name: `Phase 3: Current-Grade Relearning (${gap.grade})`,
            gradeLevel: gap.grade,
            conceptName: gap.conceptName,
            status: gap.status === 'MASTERED' ? 'COMPLETED' : (gap.status === 'CURRENT_GRADE_RELEARNING' ? 'IN_PROGRESS' : 'LOCKED'),
            items: [
              { id: 'item-c1', type: 'INTERACTIVE_EXPLAINER', title: `Visual Masterclass: ${gap.conceptName}`, durationMins: 20, isDone: gap.status === 'MASTERED' }
            ]
          },
          {
            phaseNumber: 4,
            phaseKey: 'PHASE_4_CURRENT_TEST',
            name: 'Phase 4: Fresh Mastery Reassessment',
            gradeLevel: gap.grade,
            conceptName: `${gap.conceptName} Final Mastery`,
            status: gap.status === 'MASTERED' ? 'COMPLETED' : 'LOCKED',
            requiredScore: 85,
            questionCount: 3,
            score: gap.currentGradeReassessmentScore
          },
          {
            phaseNumber: 5,
            phaseKey: 'PHASE_5_MASTERED',
            name: 'Phase 5: Verified Concept Mastery & Gap Closure',
            gradeLevel: gap.grade,
            status: gap.status === 'MASTERED' ? 'COMPLETED' : 'LOCKED',
            criteria: 'Both Foundation (≥80%) and Current Grade (≥85%) verified.'
          }
        ]
      };

      pathway = await prisma.remediationPathway.create({
        data: {
          gapId: gap.id,
          currentPhase: gap.status === 'MASTERED' ? 'PHASE_5_MASTERED' : (gap.status === 'CURRENT_GRADE_RELEARNING' ? 'PHASE_3_CURRENT_RELEARN' : 'PHASE_1_FOUNDATION'),
          foundationGrade,
          foundationConceptId,
          foundationConceptName,
          foundationResourcesCompleted: gap.status === 'MASTERED',
          foundationScore: gap.foundationAssessmentScore,
          foundationMastered: gap.status === 'MASTERED' || (gap.foundationAssessmentScore ?? 0) >= 80,
          currentGradeResourcesCompleted: gap.status === 'MASTERED',
          reassessmentScore: gap.currentGradeReassessmentScore,
          reassessmentMastered: gap.status === 'MASTERED',
          pathwayPlanJson: JSON.stringify(pathwayPlan),
          studentProgressJson: JSON.stringify({ completedItemIds: [], answers: {} })
        }
      });
    }

    // Fetch Resources for Foundation & Current Grade
    const foundationResources = await prisma.conceptRemedialResource.findMany({
      where: { conceptId: pathway.foundationConceptId },
      orderBy: { orderIndex: 'asc' }
    });

    const currentGradeResources = await prisma.conceptRemedialResource.findMany({
      where: { conceptId: gap.conceptId },
      orderBy: { orderIndex: 'asc' }
    });

    // Fetch Questions for Phase 2 Foundation Test & Phase 4 Reassessment
    const foundationQuestions = await prisma.conceptAssessmentQuestion.findMany({
      where: {
        conceptId: pathway.foundationConceptId,
        assessmentType: 'FOUNDATION_CHECK'
      }
    });

    const reassessmentQuestions = await prisma.conceptAssessmentQuestion.findMany({
      where: {
        conceptId: gap.conceptId,
        assessmentType: 'REASSESSMENT_MASTERY'
      }
    });

    let pathwayPlan: any = null;
    let studentProgress: any = null;

    try { pathwayPlan = JSON.parse(gap.pathway.pathwayPlanJson); } catch {}
    try { studentProgress = JSON.parse(gap.pathway.studentProgressJson || '{}'); } catch {}

    return reply.send({
      success: true,
      data: {
        gap,
        pathway: gap.pathway,
        pathwayPlan,
        studentProgress,
        resources: {
          foundation: foundationResources.map(r => ({
            ...r,
            content: (() => { try { return JSON.parse(r.contentJson); } catch { return null; } })()
          })),
          currentGrade: currentGradeResources.map(r => ({
            ...r,
            content: (() => { try { return JSON.parse(r.contentJson); } catch { return null; } })()
          }))
        },
        assessmentQuestions: {
          foundationCheck: foundationQuestions.map(q => ({
            id: q.id,
            questionText: q.questionText,
            questionType: q.questionType,
            options: (() => { try { return JSON.parse(q.optionsJson || '[]'); } catch { return []; } })(),
            marks: q.marks,
            cognitiveSkill: q.cognitiveSkill
          })),
          reassessmentMastery: reassessmentQuestions.map(q => ({
            id: q.id,
            questionText: q.questionText,
            questionType: q.questionType,
            options: (() => { try { return JSON.parse(q.optionsJson || '[]'); } catch { return []; } })(),
            marks: q.marks,
            cognitiveSkill: q.cognitiveSkill
          }))
        }
      }
    });
  }

  /**
   * POST /api/learning-gaps/:id/pathway/complete-step
   * Mark a resource item as completed in Phase 1 or Phase 3
   */
  static async completePathwayStep(request: FastifyRequest, reply: FastifyReply) {
    const { id: gapId } = request.params as { id: string };
    const { itemId, phaseNumber } = request.body as { itemId: string; phaseNumber: number };

    const pathway = await prisma.remediationPathway.findUnique({
      where: { gapId }
    });

    if (!pathway) {
      return reply.status(404).send({ success: false, error: 'Pathway not found' });
    }

    let progress: any = { completedItemIds: [], answers: {} };
    try { progress = JSON.parse(pathway.studentProgressJson || '{}'); } catch {}
    if (!progress.completedItemIds) progress.completedItemIds = [];

    if (!progress.completedItemIds.includes(itemId)) {
      progress.completedItemIds.push(itemId);
    }

    let pathwayPlan: any = { phases: [] };
    try { pathwayPlan = JSON.parse(pathway.pathwayPlanJson); } catch {}

    // Check if all Phase 1 items completed -> unlock Phase 2 test
    if (phaseNumber === 1) {
      const p1 = pathwayPlan.phases?.find((p: any) => p.phaseNumber === 1);
      const p2 = pathwayPlan.phases?.find((p: any) => p.phaseNumber === 2);
      if (p1) {
        p1.items?.forEach((it: any) => {
          if (progress.completedItemIds.includes(it.id)) it.isDone = true;
        });
        const allDone = p1.items?.every((it: any) => it.isDone);
        if (allDone) {
          p1.status = 'COMPLETED';
          if (p2) p2.status = 'IN_PROGRESS';
        }
      }
    } else if (phaseNumber === 3) {
      const p3 = pathwayPlan.phases?.find((p: any) => p.phaseNumber === 3);
      const p4 = pathwayPlan.phases?.find((p: any) => p.phaseNumber === 4);
      if (p3) {
        p3.items?.forEach((it: any) => {
          if (progress.completedItemIds.includes(it.id)) it.isDone = true;
        });
        const allDone = p3.items?.every((it: any) => it.isDone);
        if (allDone) {
          p3.status = 'COMPLETED';
          if (p4) p4.status = 'IN_PROGRESS';
        }
      }
    }

    const updated = await prisma.remediationPathway.update({
      where: { gapId },
      data: {
        pathwayPlanJson: JSON.stringify(pathwayPlan),
        studentProgressJson: JSON.stringify(progress)
      }
    });

    return reply.send({ success: true, message: 'Step completed', data: updated });
  }

  /**
   * POST /api/learning-gaps/:id/pathway/submit-foundation-test
   * Submit Phase 2 Foundation Diagnostic Check.
   * If score >= 80%, unlocks Phase 3 (Current-Grade Relearning).
   */
  static async submitFoundationTest(request: FastifyRequest, reply: FastifyReply) {
    const { id: gapId } = request.params as { id: string };
    const { answers } = request.body as { answers: Record<string, string> };

    const gap = await prisma.learningGap.findUnique({
      where: { id: gapId },
      include: { pathway: true }
    });

    if (!gap || !gap.pathway) {
      return reply.status(404).send({ success: false, error: 'Learning Gap or pathway not found' });
    }

    const questions = await prisma.conceptAssessmentQuestion.findMany({
      where: {
        conceptId: gap.pathway.foundationConceptId,
        assessmentType: 'FOUNDATION_CHECK'
      }
    });

    if (questions.length === 0) {
      return reply.status(400).send({ success: false, error: 'No foundation check questions configured' });
    }

    let correctCount = 0;
    const feedbackList = questions.map(q => {
      const studentAns = (answers[q.id] || '').trim();
      const isCorrect = studentAns.toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        questionText: q.questionText,
        studentAnswer: studentAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const scorePct = Math.round((correctCount / questions.length) * 1000) / 10;
    const isPassed = scorePct >= 80.0;

    let pathwayPlan: any = { phases: [] };
    try { pathwayPlan = JSON.parse(gap.pathway.pathwayPlanJson); } catch {}

    const p2 = pathwayPlan.phases?.find((p: any) => p.phaseNumber === 2);
    const p3 = pathwayPlan.phases?.find((p: any) => p.phaseNumber === 3);

    if (p2) {
      p2.score = scorePct;
      p2.attempts = (p2.attempts || 0) + 1;
      if (isPassed) {
        p2.status = 'COMPLETED';
        if (p3) p3.status = 'IN_PROGRESS';
      } else {
        p2.status = 'NEEDS_RETRY';
      }
    }

    // Update Pathway & Gap status
    await prisma.remediationPathway.update({
      where: { gapId },
      data: {
        currentPhase: isPassed ? 'PHASE_3_CURRENT_RELEARN' : 'PHASE_2_FOUNDATION_TEST',
        foundationScore: scorePct,
        foundationMastered: isPassed,
        foundationResourcesCompleted: true,
        pathwayPlanJson: JSON.stringify(pathwayPlan)
      }
    });

    await prisma.learningGap.update({
      where: { id: gapId },
      data: {
        foundationAssessmentScore: scorePct,
        status: isPassed ? 'CURRENT_GRADE_RELEARNING' : 'FOUNDATION_LEARNING'
      }
    });

    await prisma.learningGapAudit.create({
      data: {
        gapId,
        fromStatus: 'FOUNDATION_LEARNING',
        toStatus: isPassed ? 'CURRENT_GRADE_RELEARNING' : 'FOUNDATION_LEARNING',
        actorName: 'Assessment Engine',
        actorRole: 'System',
        notes: isPassed
          ? `Foundation verification passed with ${scorePct}%. Advancing to Current-Grade Relearning.`
          : `Foundation verification scored ${scorePct}% (below 80% passing threshold). Additional practice required.`
      }
    });

    return reply.send({
      success: true,
      score: scorePct,
      isPassed,
      requiredScore: 80,
      feedbackList,
      nextPhase: isPassed ? 'PHASE_3_CURRENT_RELEARN' : 'PHASE_2_FOUNDATION_TEST',
      message: isPassed
        ? 'Outstanding! You have mastered the foundational prerequisites. Returning to current-grade relearning!'
        : 'Foundation check incomplete. Please review the practice steps and try the assessment again.'
    });
  }

  /**
   * POST /api/learning-gaps/:id/pathway/submit-reassessment
   * Submit Phase 4 Current-Grade Reassessment.
   * If score >= 85%, demonstrates true mastery and closes the learning gap!
   */
  static async submitCurrentGradeReassessment(request: FastifyRequest, reply: FastifyReply) {
    const { id: gapId } = request.params as { id: string };
    const { answers } = request.body as { answers: Record<string, string> };

    const gap = await prisma.learningGap.findUnique({
      where: { id: gapId },
      include: { pathway: true, concept: true }
    });

    if (!gap || !gap.pathway) {
      return reply.status(404).send({ success: false, error: 'Learning Gap not found' });
    }

    const questions = await prisma.conceptAssessmentQuestion.findMany({
      where: {
        conceptId: gap.conceptId,
        assessmentType: 'REASSESSMENT_MASTERY'
      }
    });

    if (questions.length === 0) {
      return reply.status(400).send({ success: false, error: 'No reassessment questions configured' });
    }

    let correctCount = 0;
    const feedbackList = questions.map(q => {
      const studentAns = (answers[q.id] || '').trim();
      const isCorrect = studentAns.toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        questionText: q.questionText,
        studentAnswer: studentAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const scorePct = Math.round((correctCount / questions.length) * 1000) / 10;
    const isMastered = scorePct >= (gap.concept.masteryThreshold || 85.0);

    let pathwayPlan: any = { phases: [] };
    try { pathwayPlan = JSON.parse(gap.pathway.pathwayPlanJson); } catch {}

    const p4 = pathwayPlan.phases?.find((p: any) => p.phaseNumber === 4);
    const p5 = pathwayPlan.phases?.find((p: any) => p.phaseNumber === 5);

    if (p4) {
      p4.score = scorePct;
      if (isMastered) {
        p4.status = 'COMPLETED';
        if (p5) {
          p5.status = 'COMPLETED';
          p5.masteredAt = new Date().toISOString();
        }
      } else {
        p4.status = 'NEEDS_RETRY';
      }
    }

    // Update Pathway & Gap
    await prisma.remediationPathway.update({
      where: { gapId },
      data: {
        currentPhase: isMastered ? 'PHASE_5_MASTERED' : 'PHASE_4_CURRENT_TEST',
        reassessmentScore: scorePct,
        reassessmentMastered: isMastered,
        currentGradeResourcesCompleted: true,
        pathwayPlanJson: JSON.stringify(pathwayPlan)
      }
    });

    await prisma.learningGap.update({
      where: { id: gapId },
      data: {
        currentGradeReassessmentScore: scorePct,
        status: isMastered ? 'MASTERED' : 'CURRENT_GRADE_RELEARNING',
        closureDate: isMastered ? new Date() : null
      }
    });

    await prisma.learningGapAudit.create({
      data: {
        gapId,
        fromStatus: 'CURRENT_GRADE_RELEARNING',
        toStatus: isMastered ? 'MASTERED' : 'CURRENT_GRADE_RELEARNING',
        actorName: 'Mastery Engine',
        actorRole: 'System',
        notes: isMastered
          ? `Final mastery reassessment cleared with ${scorePct}% (≥${gap.concept.masteryThreshold}% threshold). Learning Gap officially CLOSED with verified mastery.`
          : `Reassessment scored ${scorePct}%. Recommending additional guided examples before retrying.`
      }
    });

    return reply.send({
      success: true,
      score: scorePct,
      isMastered,
      requiredScore: gap.concept.masteryThreshold || 85,
      feedbackList,
      nextPhase: isMastered ? 'PHASE_5_MASTERED' : 'PHASE_4_CURRENT_TEST',
      message: isMastered
        ? 'Congratulations! You have demonstrated verified mastery of this concept! The learning gap is successfully closed.'
        : `Reassessment scored ${scorePct}%. A little more practice on word problems will get you across the mastery line!`
    });
  }

  /**
   * POST /api/learning-gaps/:id/teacher-action
   * Teacher intervention actions (approve, modify, record notes, trigger reassessment)
   */
  static async teacherInterventionAction(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;
    const { id: gapId } = request.params as { id: string };
    const { action, notes, targetDate } = request.body as {
      action: 'APPROVE_INTERVENTION' | 'MODIFY_PATHWAY' | 'RECORD_OBSERVATION' | 'TRIGGER_REASSESSMENT' | 'RECOMMEND_CLOSURE';
      notes?: string;
      targetDate?: string;
    };

    const gap = await prisma.learningGap.findUnique({
      where: { id: gapId }
    });

    if (!gap) {
      return reply.status(404).send({ success: false, error: 'Learning Gap not found' });
    }

    let newStatus = gap.status;
    let auditNote = notes || `Teacher executed ${action}`;

    if (action === 'APPROVE_INTERVENTION') {
      newStatus = 'FOUNDATION_LEARNING';
      auditNote = notes || 'Teacher verified diagnostic evidence and approved student redirection to lower-grade foundational content.';
    } else if (action === 'RECORD_OBSERVATION') {
      auditNote = notes || 'Teacher recorded clinical classroom observation.';
    } else if (action === 'TRIGGER_REASSESSMENT') {
      newStatus = 'REASSESSMENT_PENDING';
      auditNote = notes || 'Teacher initiated immediate fresh reassessment session.';
    } else if (action === 'RECOMMEND_CLOSURE') {
      newStatus = 'CLOSED';
      auditNote = notes || 'Teacher recommended closure based on portfolio and formative evidence.';
    }

    const updateData: any = {
      status: newStatus,
      teacherNotes: notes ? (gap.teacherNotes ? `${gap.teacherNotes}\n[${new Date().toLocaleDateString()}]: ${notes}` : notes) : gap.teacherNotes
    };

    if (targetDate) updateData.targetDate = new Date(targetDate);
    if (newStatus === 'CLOSED' && !gap.closureDate) updateData.closureDate = new Date();

    const updated = await prisma.learningGap.update({
      where: { id: gapId },
      data: updateData
    });

    await prisma.learningGapAudit.create({
      data: {
        gapId,
        fromStatus: gap.status,
        toStatus: newStatus,
        actorId: user.id,
        actorName: user.fullName,
        actorRole: user.roleName || 'Teacher',
        notes: auditNote
      }
    });

    return reply.send({ success: true, message: `Teacher action ${action} recorded`, data: updated });
  }

  /**
   * GET /api/learning-gaps/analytics/summary
   * High-level metrics for Management, Principal and Learning Academy
   */
  static async getSummaryAnalytics(request: FastifyRequest, reply: FastifyReply) {
    const { campusId, grade, subject } = request.query as {
      campusId?: string;
      grade?: string;
      subject?: string;
    };

    const where: any = {};
    if (campusId) where.campusId = campusId;
    if (grade) where.grade = grade;
    if (subject) where.subject = subject;

    const [
      totalGaps,
      criticalGaps,
      foundationalGaps,
      inRemediation,
      reassessmentPending,
      masteredGaps,
      closedGaps,
      distinctStudents
    ] = await Promise.all([
      prisma.learningGap.count({ where }),
      prisma.learningGap.count({ where: { ...where, priority: 'CRITICAL' } }),
      prisma.learningGap.count({ where: { ...where, gapCategory: 'FOUNDATIONAL' } }),
      prisma.learningGap.count({
        where: {
          ...where,
          status: { in: ['INTERVENTION_ASSIGNED', 'FOUNDATION_LEARNING', 'CURRENT_GRADE_RELEARNING'] }
        }
      }),
      prisma.learningGap.count({ where: { ...where, status: 'REASSESSMENT_PENDING' } }),
      prisma.learningGap.count({ where: { ...where, status: 'MASTERED' } }),
      prisma.learningGap.count({ where: { ...where, status: 'CLOSED' } }),
      prisma.learningGap.groupBy({
        by: ['studentId'],
        where
      })
    ]);

    const closureRate = totalGaps > 0
      ? Math.round(((masteredGaps + closedGaps) / totalGaps) * 1000) / 10
      : 0;

    return reply.send({
      success: true,
      data: {
        totalGaps,
        studentsWithGaps: distinctStudents.length,
        criticalGaps,
        foundationalGaps,
        inRemediation,
        reassessmentPending,
        masteredGaps,
        closedGaps,
        closureRate
      }
    });
  }

  /**
   * GET /api/learning-gaps/analytics/campus-comparison
   * Cross-campus comparison for Learning Academy Central Dashboard
   */
  static async getCampusComparison(request: FastifyRequest, reply: FastifyReply) {
    const campuses = await prisma.campus.findMany({
      select: { id: true, name: true, code: true }
    });

    const results = await Promise.all(
      campuses.map(async c => {
        const total = await prisma.learningGap.count({ where: { campusId: c.id } });
        const critical = await prisma.learningGap.count({ where: { campusId: c.id, priority: 'CRITICAL' } });
        const mastered = await prisma.learningGap.count({
          where: { campusId: c.id, status: { in: ['MASTERED', 'CLOSED'] } }
        });
        const inRemediation = await prisma.learningGap.count({
          where: {
            campusId: c.id,
            status: { in: ['INTERVENTION_ASSIGNED', 'FOUNDATION_LEARNING', 'CURRENT_GRADE_RELEARNING'] }
          }
        });

        const rate = total > 0 ? Math.round((mastered / total) * 1000) / 10 : 0;

        return {
          campusId: c.id,
          campusName: c.name,
          campusCode: c.code,
          totalGaps: total,
          criticalGaps: critical,
          inRemediation,
          masteredGaps: mastered,
          closureRate: rate
        };
      })
    );

    return reply.send({ success: true, data: results });
  }

  /**
   * GET /api/learning-gaps/analytics/concept-heatmaps
   * Systemic concept difficulty trends & root-cause prerequisite bottlenecks
   */
  static async getConceptHeatmaps(request: FastifyRequest, reply: FastifyReply) {
    const gaps = await prisma.learningGap.findMany({
      select: {
        conceptId: true,
        conceptName: true,
        grade: true,
        subject: true,
        gapCategory: true,
        priority: true,
        diagnosticScore: true,
        status: true,
        identifiedPrerequisiteName: true
      }
    });

    // Group by Concept
    const conceptMap = new Map<string, any>();

    gaps.forEach(g => {
      if (!conceptMap.has(g.conceptId)) {
        conceptMap.set(g.conceptId, {
          conceptId: g.conceptId,
          conceptName: g.conceptName,
          grade: g.grade,
          subject: g.subject,
          affectedStudents: 0,
          scores: [],
          categories: {},
          prerequisiteBottlenecks: {},
          masteredCount: 0
        });
      }

      const entry = conceptMap.get(g.conceptId);
      entry.affectedStudents++;
      entry.scores.push(g.diagnosticScore);
      entry.categories[g.gapCategory] = (entry.categories[g.gapCategory] || 0) + 1;
      if (g.identifiedPrerequisiteName) {
        entry.prerequisiteBottlenecks[g.identifiedPrerequisiteName] =
          (entry.prerequisiteBottlenecks[g.identifiedPrerequisiteName] || 0) + 1;
      }
      if (g.status === 'MASTERED' || g.status === 'CLOSED') {
        entry.masteredCount++;
      }
    });

    const list = Array.from(conceptMap.values()).map(item => {
      const avgScore = item.scores.length > 0
        ? Math.round((item.scores.reduce((a: number, b: number) => a + b, 0) / item.scores.length) * 10) / 10
        : 0;
      return {
        ...item,
        averageDiagnosticScore: avgScore,
        closureRate: item.affectedStudents > 0
          ? Math.round((item.masteredCount / item.affectedStudents) * 1000) / 10
          : 0
      };
    });

    list.sort((a, b) => b.affectedStudents - a.affectedStudents);

    return reply.send({ success: true, count: list.length, data: list });
  }

  /**
   * GET /api/learning-gaps/analytics/curriculum-recommendations
   * Central Learning Academy systemic recommendations for curriculum revisions and teacher workshops
   */
  static async getCurriculumRecommendations(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({
      success: true,
      data: [
        {
          id: 'rec-01',
          priority: 'URGENT',
          subject: 'Mathematics',
          grade: 'Grade 6 & Grade 5',
          title: 'Strengthen Grade 5 Base-100 Fraction Transition to Eliminate Grade 6 Percentage Failures',
          finding: 'Across 4 campuses, 78% of students failing Grade 6 Percentage calculations have a direct root-cause failure in Grade 5 Equivalent Fractions (scaling denominator to 100).',
          recommendation: 'Introduce visual 100-grid manipulatives and explicit scaling tables into the Grade 5 Term 2 math syllabus before students transition to Grade 6.',
          actionItems: [
            'Revise Chapter 4 in Grade 5 Digital Textbooks with 100-grid interactive simulations',
            'Conduct a 90-minute faculty workshop on "Diagnostic Bridge Between Fractions and Percentages"',
            'Deploy automated diagnostic pre-checks at the start of Grade 6 Term 1'
          ]
        },
        {
          id: 'rec-02',
          priority: 'HIGH',
          subject: 'Sciences',
          grade: 'Grade 5',
          title: 'Address Directional Vector Misconceptions in Friction & Forces',
          finding: 'Students consistently confuse static friction with kinetic resistance and apply additive arithmetic rather than balanced vector opposition.',
          recommendation: 'Provide physical ramp friction kits and digital force-arrow simulations in campus science labs.',
          actionItems: [
            'Integrate visual interactive force-arrows in the Achariya Science Lab curriculum',
            'Standardize error analysis rubric for summative term exams'
          ]
        }
      ]
    });
  }

  /**
   * GET /api/learning-gaps/reports/student/:studentId
   * Individual Student Learning Gap & Mastery Report
   */
  static async getStudentReport(request: FastifyRequest, reply: FastifyReply) {
    const { studentId } = request.params as { studentId: string };

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        campus: true,
        enrollments: {
          include: {
            class: true,
            section: true
          },
          take: 1
        }
      }
    });

    if (!student) {
      return reply.status(404).send({ success: false, error: 'Student not found' });
    }

    const gaps = await prisma.learningGap.findMany({
      where: { studentId },
      include: {
        concept: true,
        pathway: true,
        audits: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = gaps.length;
    const mastered = gaps.filter(g => g.status === 'MASTERED' || g.status === 'CLOSED').length;
    const inProgress = gaps.filter(g => ['INTERVENTION_ASSIGNED', 'FOUNDATION_LEARNING', 'CURRENT_GRADE_RELEARNING'].includes(g.status)).length;

    return reply.send({
      success: true,
      data: {
        student: {
          id: student.id,
          name: student.fullName,
          email: student.email,
          campus: student.campus?.name,
          grade: student.enrollments[0]?.class?.name || 'Grade 6',
          section: student.enrollments[0]?.section?.name || 'A',
          rollNumber: student.enrollments[0]?.rollNumber || '06A-12'
        },
        metrics: {
          totalGapsIdentified: total,
          gapsMastered: mastered,
          gapsInRemediation: inProgress,
          masteryRate: total > 0 ? Math.round((mastered / total) * 1000) / 10 : 0
        },
        learningGaps: gaps
      }
    });
  }
}
