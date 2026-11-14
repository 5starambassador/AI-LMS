import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCurriculumAndLearningGaps() {
  console.log('Seeding Curriculum Master, Prerequisite Graph & Learning Gaps...');

  // 1. Fetch campus and teacher from DB
  const campus = await prisma.campus.findFirst({
    where: { name: { contains: 'Achariya' } }
  }) || await prisma.campus.findFirst();

  const campusId = campus?.id || 'campus-demo-01';
  const campusName = campus?.name || 'Achariya World Class Academy (Main Campus)';

  const teacher = await prisma.user.findFirst({
    where: { email: 'teacher@achariya.in' }
  });
  const teacherId = teacher?.id || 'teacher-demo-01';
  const teacherName = teacher?.fullName || 'Dr. Priya Sivaraman';

  const student = await prisma.user.findFirst({
    where: { email: 'student@achariya.in' }
  }) || await prisma.user.findFirst({
    where: { role: { name: 'Student' } }
  });
  const studentId = student?.id || 'student-demo-01';
  const studentName = student?.fullName || 'Aarav Sundaram';

  // =========================================================================
  // CURRICULUM MASTER: GRADE 4, 5, 6 MATHEMATICS & SCIENCE
  // =========================================================================

  // --- Grade 4 Prerequisite Concepts ---
  const cG4Div = await prisma.curriculumConcept.upsert({
    where: { conceptCode: 'CON-MTH-G4-DIV' },
    update: {},
    create: {
      conceptCode: 'CON-MTH-G4-DIV',
      academicYear: '2026-2027',
      board: 'CBSE',
      grade: 'Grade 4',
      gradeNumber: 4,
      subject: 'Mathematics',
      unit: 'Operations with Numbers',
      chapter: 'Division & Equal Sharing',
      topic: 'Equal Partitioning',
      subtopic: 'Division as grouping and equal distribution',
      name: 'Division and Equal Sharing',
      description: 'Understanding division as partitioning a quantity into equal groups and sharing equally.',
      learningOutcome: 'Divide whole numbers and interpret remainders in practical contexts.',
      difficulty: 'EASY',
      masteryThreshold: 80.0
    }
  });

  const cG4Frac = await prisma.curriculumConcept.upsert({
    where: { conceptCode: 'CON-MTH-G4-FRAC' },
    update: {},
    create: {
      conceptCode: 'CON-MTH-G4-FRAC',
      academicYear: '2026-2027',
      board: 'CBSE',
      grade: 'Grade 4',
      gradeNumber: 4,
      subject: 'Mathematics',
      unit: 'Fractions',
      chapter: 'Introduction to Fractions',
      topic: 'Fractions as Parts of a Whole',
      subtopic: 'Numerator and Denominator roles',
      name: 'Fractions as Parts of a Whole',
      description: 'Representing parts of a unit whole using numerators (parts considered) and denominators (total equal parts).',
      learningOutcome: 'Identify and represent unit and proper fractions visually on diagrams and number lines.',
      difficulty: 'EASY',
      masteryThreshold: 80.0
    }
  });

  // --- Grade 5 Prerequisite Concepts ---
  const cG5Equiv = await prisma.curriculumConcept.upsert({
    where: { conceptCode: 'CON-MTH-G5-EQUIV' },
    update: {},
    create: {
      conceptCode: 'CON-MTH-G5-EQUIV',
      academicYear: '2026-2027',
      board: 'CBSE',
      grade: 'Grade 5',
      gradeNumber: 5,
      subject: 'Mathematics',
      unit: 'Fractional & Decimal Arithmetic',
      chapter: 'Fractions & Proportions',
      topic: 'Equivalent Fractions',
      subtopic: 'Multiplying/Dividing numerator & denominator by common factors',
      name: 'Equivalent Fractions and Scaling',
      description: 'Recognizing and generating equivalent fractions by multiplying or dividing numerator and denominator by the same non-zero number, specifically scaling to base 100.',
      learningOutcome: 'Find equivalent fractions and convert fractional values to denominators of 10 and 100.',
      difficulty: 'MEDIUM',
      masteryThreshold: 80.0
    }
  });

  const cG5Dec = await prisma.curriculumConcept.upsert({
    where: { conceptCode: 'CON-MTH-G5-DEC' },
    update: {},
    create: {
      conceptCode: 'CON-MTH-G5-DEC',
      academicYear: '2026-2027',
      board: 'CBSE',
      grade: 'Grade 5',
      gradeNumber: 5,
      subject: 'Mathematics',
      unit: 'Decimals',
      chapter: 'Decimals as Special Fractions',
      topic: 'Fraction-to-Decimal Translation',
      subtopic: 'Tenths, hundredths, thousandths',
      name: 'Fraction and Decimal Relationships',
      description: 'Understanding decimals as place-value fractions with denominators of 10, 100, and 1000.',
      learningOutcome: 'Convert between fractions with base 10/100 and decimal notations seamlessly.',
      difficulty: 'MEDIUM',
      masteryThreshold: 80.0
    }
  });

  // --- Grade 6 Current Grade Target Concepts ---
  const cG6PctMeaning = await prisma.curriculumConcept.upsert({
    where: { conceptCode: 'CON-MTH-G6-PCT-MEANING' },
    update: {},
    create: {
      conceptCode: 'CON-MTH-G6-PCT-MEANING',
      academicYear: '2026-2027',
      board: 'CBSE',
      grade: 'Grade 6',
      gradeNumber: 6,
      subject: 'Mathematics',
      unit: 'Commercial Mathematics',
      chapter: 'Comparing Quantities: Percentages',
      topic: 'Meaning of Percentage',
      subtopic: 'Percentage as parts per hundred (centum)',
      name: 'Meaning & Representation of Percentage',
      description: 'Conceptualizing percentage as a ratio where the whole is standardized to 100 (parts per hundred).',
      learningOutcome: 'Define percentage and represent percentages visually on a 100-grid square.',
      difficulty: 'MEDIUM',
      masteryThreshold: 85.0
    }
  });

  const cG6PctCalc = await prisma.curriculumConcept.upsert({
    where: { conceptCode: 'CON-MTH-G6-PCT-CALC' },
    update: {},
    create: {
      conceptCode: 'CON-MTH-G6-PCT-CALC',
      academicYear: '2026-2027',
      board: 'CBSE',
      grade: 'Grade 6',
      gradeNumber: 6,
      subject: 'Mathematics',
      unit: 'Commercial Mathematics',
      chapter: 'Comparing Quantities: Percentages',
      topic: 'Percentage Calculations',
      subtopic: 'Finding percentage of a quantity and word problems',
      name: 'Percentage Calculations and Problem Solving',
      description: 'Calculating percentages of given quantities (e.g. 15% of 240) and solving real-world context problems.',
      learningOutcome: 'Calculate the percentage of a given quantity and solve practical multi-step problems accurately.',
      difficulty: 'HARD',
      masteryThreshold: 85.0
    }
  });

  // =========================================================================
  // PREREQUISITE GRAPH RELATIONSHIPS (Cross-Grade Mappings)
  // =========================================================================

  // Grade 5 Equivalent Fractions depends on Grade 4 Fractions as parts of whole
  await prisma.conceptPrerequisite.upsert({
    where: {
      conceptId_prerequisiteId: {
        conceptId: cG5Equiv.id,
        prerequisiteId: cG4Frac.id
      }
    },
    update: {},
    create: {
      conceptId: cG5Equiv.id,
      prerequisiteId: cG4Frac.id,
      prerequisiteGrade: 'Grade 4',
      prerequisiteGradeNumber: 4,
      prerequisiteType: 'FOUNDATIONAL',
      diagnosticMisconception: 'Does not recognize denominator as total parts of whole, leading to incorrect equivalent multiplier.',
      weight: 1.0
    }
  });

  // Grade 5 Equivalent Fractions depends on Grade 4 Division
  await prisma.conceptPrerequisite.upsert({
    where: {
      conceptId_prerequisiteId: {
        conceptId: cG5Equiv.id,
        prerequisiteId: cG4Div.id
      }
    },
    update: {},
    create: {
      conceptId: cG5Equiv.id,
      prerequisiteId: cG4Div.id,
      prerequisiteGrade: 'Grade 4',
      prerequisiteGradeNumber: 4,
      prerequisiteType: 'FOUNDATIONAL',
      diagnosticMisconception: 'Cannot simplify fractions due to weak division/factorization skills.',
      weight: 0.8
    }
  });

  // Grade 6 Percentage Meaning depends on Grade 5 Equivalent Fractions
  await prisma.conceptPrerequisite.upsert({
    where: {
      conceptId_prerequisiteId: {
        conceptId: cG6PctMeaning.id,
        prerequisiteId: cG5Equiv.id
      }
    },
    update: {},
    create: {
      conceptId: cG6PctMeaning.id,
      prerequisiteId: cG5Equiv.id,
      prerequisiteGrade: 'Grade 5',
      prerequisiteGradeNumber: 5,
      prerequisiteType: 'FOUNDATIONAL',
      diagnosticMisconception: 'Struggles to convert fractions with non-100 denominators (like 3/5 or 7/20) into base-100 equivalent fractions.',
      weight: 1.0
    }
  });

  // Grade 6 Percentage Meaning depends on Grade 5 Decimal Relationships
  await prisma.conceptPrerequisite.upsert({
    where: {
      conceptId_prerequisiteId: {
        conceptId: cG6PctMeaning.id,
        prerequisiteId: cG5Dec.id
      }
    },
    update: {},
    create: {
      conceptId: cG6PctMeaning.id,
      prerequisiteId: cG5Dec.id,
      prerequisiteGrade: 'Grade 5',
      prerequisiteGradeNumber: 5,
      prerequisiteType: 'FOUNDATIONAL',
      diagnosticMisconception: 'Confuses decimal placement when converting between hundredths (0.45) and percentages (45%).',
      weight: 0.9
    }
  });

  // Grade 6 Percentage Calculations depends directly on Percentage Meaning
  await prisma.conceptPrerequisite.upsert({
    where: {
      conceptId_prerequisiteId: {
        conceptId: cG6PctCalc.id,
        prerequisiteId: cG6PctMeaning.id
      }
    },
    update: {},
    create: {
      conceptId: cG6PctCalc.id,
      prerequisiteId: cG6PctMeaning.id,
      prerequisiteGrade: 'Grade 6',
      prerequisiteGradeNumber: 6,
      prerequisiteType: 'DIRECT',
      diagnosticMisconception: 'Attempts arithmetic operations without understanding that "p%" means p/100.',
      weight: 1.0
    }
  });

  // Grade 6 Percentage Calculations ALSO depends on Grade 5 Equivalent Fractions (Cross-grade root cause)
  await prisma.conceptPrerequisite.upsert({
    where: {
      conceptId_prerequisiteId: {
        conceptId: cG6PctCalc.id,
        prerequisiteId: cG5Equiv.id
      }
    },
    update: {},
    create: {
      conceptId: cG6PctCalc.id,
      prerequisiteId: cG5Equiv.id,
      prerequisiteGrade: 'Grade 5',
      prerequisiteGradeNumber: 5,
      prerequisiteType: 'FOUNDATIONAL',
      diagnosticMisconception: 'Unable to reduce (p/100) × Total into simpler equivalent fractions before multiplying.',
      weight: 1.0
    }
  });

  // =========================================================================
  // REMEDIAL RESOURCES (Interactive Step-by-Step Content)
  // =========================================================================

  // Resource 1: Grade 5 Foundation - Equivalent Fractions Mastery
  await prisma.conceptRemedialResource.deleteMany({
    where: { conceptId: cG5Equiv.id }
  });

  await prisma.conceptRemedialResource.create({
    data: {
      conceptId: cG5Equiv.id,
      title: 'Foundation Module: Master Equivalent Fractions & Base-100 Scaling',
      resourceType: 'INTERACTIVE_EXPLAINER',
      gradeLevel: 'Grade 5',
      estimatedMinutes: 15,
      orderIndex: 1,
      contentJson: JSON.stringify({
        prerequisiteFocus: 'Grade 5 Equivalent Fractions (Base 100 Preparation)',
        whyThisMatters: 'To find a percentage, you must first know how to scale any fraction so its denominator is 100. If you can do this, percentages become effortless!',
        sections: [
          {
            title: 'Step 1: The Golden Rule of Equivalent Fractions',
            body: 'Whatever you multiply or divide the bottom (denominator) by, you MUST multiply or divide the top (numerator) by the exact same number. The value never changes, only the appearance changes!',
            visualCard: {
              badge: 'Visual Scale',
              numerator: 3,
              denominator: 5,
              multiplier: 20,
              resultNumerator: 60,
              resultDenominator: 100,
              note: 'Because 5 × 20 = 100, we multiply 3 × 20 = 60. Therefore 3/5 = 60/100.'
            }
          },
          {
            title: 'Step 2: Common Scaling Factors to Reach 100',
            body: 'Memorize these four friendly partner pairs that multiply to 100:',
            pairs: [
              { factor: 2, partner: 50, equals: 100 },
              { factor: 4, partner: 25, equals: 100 },
              { factor: 5, partner: 20, equals: 100 },
              { factor: 10, partner: 10, equals: 100 }
            ]
          },
          {
            title: 'Step 3: Interactive Practice Checkpoint',
            prompt: 'Convert 7/25 into a fraction with denominator 100.',
            workingSteps: [
              '1. Ask: What multiplies 25 to make 100? Answer: 4.',
              '2. Multiply top by 4: 7 × 4 = 28.',
              '3. Result: 28/100.'
            ]
          }
        ]
      })
    }
  });

  await prisma.conceptRemedialResource.create({
    data: {
      conceptId: cG5Equiv.id,
      title: 'Interactive Worksheet: Scaling Fractions to Base-100',
      resourceType: 'WORKBOOK_WORKSHEET',
      gradeLevel: 'Grade 5',
      estimatedMinutes: 10,
      orderIndex: 2,
      contentJson: JSON.stringify({
        worksheetTitle: 'Equivalent Fractions: Route to Hundred',
        exercises: [
          { question: 'Convert 4/5 to denominator 100', answer: '80/100', hint: 'Multiply top & bottom by 20' },
          { question: 'Convert 9/20 to denominator 100', answer: '45/100', hint: 'Multiply top & bottom by 5' },
          { question: 'Convert 13/50 to denominator 100', answer: '26/100', hint: 'Multiply top & bottom by 2' },
          { question: 'Convert 3/4 to denominator 100', answer: '75/100', hint: 'Multiply top & bottom by 25' }
        ]
      })
    }
  });

  // Resource 2: Grade 6 Current-Grade Relearning - Percentage Calculations
  await prisma.conceptRemedialResource.deleteMany({
    where: { conceptId: cG6PctCalc.id }
  });

  await prisma.conceptRemedialResource.create({
    data: {
      conceptId: cG6PctCalc.id,
      title: 'Current Grade Relearning: The 3-Step Formula for Percentage of Quantities',
      resourceType: 'INTERACTIVE_EXPLAINER',
      gradeLevel: 'Grade 6',
      estimatedMinutes: 20,
      orderIndex: 1,
      contentJson: JSON.stringify({
        grade: 'Grade 6',
        topic: 'Percentage of a Quantity & Real-Life Applications',
        coreFormula: 'Value = (Percentage / 100) × Total Quantity',
        workedExamples: [
          {
            problem: 'Calculate 25% of 240 students in the Achariya Sports Meet.',
            step1: 'Step 1: Write 25% as fraction = 25/100.',
            step2: 'Step 2: Simplify fraction (using equivalent fractions): 25/100 = 1/4.',
            step3: 'Step 3: Multiply: (1/4) × 240 = 60 students.',
            insight: 'Notice how knowing that 25/100 simplifies to 1/4 turned a scary calculation into simple division by 4!'
          },
          {
            problem: 'A book costs ₹500. The store offers a 15% discount. What is the discount amount?',
            step1: 'Discount = (15 / 100) × 500.',
            step2: 'Divide 500 by 100 = 5.',
            step3: 'Multiply 15 × 5 = ₹75 discount. (Final price = ₹500 - ₹75 = ₹425).'
          }
        ],
        guidedPractice: [
          { q: 'What is 10% of 350?', ans: '35', explanation: '(10/100) × 350 = 35' },
          { q: 'What is 50% of 90?', ans: '45', explanation: 'Half of 90 = 45' },
          { q: 'What is 20% of 150?', ans: '30', explanation: '(20/100) × 150 = (1/5) × 150 = 30' }
        ]
      })
    }
  });

  // =========================================================================
  // ASSESSMENT QUESTIONS (Diagnostic, Foundation Check & Reassessment)
  // =========================================================================

  await prisma.conceptAssessmentQuestion.deleteMany({
    where: { conceptId: { in: [cG5Equiv.id, cG6PctCalc.id] } }
  });

  // Questions for Grade 5 Foundation Check (Phase 2 Test)
  await prisma.conceptAssessmentQuestion.createMany({
    data: [
      {
        conceptId: cG5Equiv.id,
        assessmentType: 'FOUNDATION_CHECK',
        gradeLevel: 'Grade 5',
        questionText: 'Which fraction is equivalent to 3/5 with a denominator of 100?',
        questionType: 'MCQ',
        optionsJson: JSON.stringify(['30/100', '60/100', '75/100', '50/100']),
        correctAnswer: '60/100',
        explanation: 'Multiply both numerator 3 and denominator 5 by 20 to get 60/100.',
        cognitiveSkill: 'UNDERSTAND',
        misconceptionCategory: 'DENOMINATOR_NEGLECT',
        marks: 1.0
      },
      {
        conceptId: cG5Equiv.id,
        assessmentType: 'FOUNDATION_CHECK',
        gradeLevel: 'Grade 5',
        questionText: 'If 7/20 is converted to a base of 100, what is the numerator?',
        questionType: 'MCQ',
        optionsJson: JSON.stringify(['28', '35', '40', '14']),
        correctAnswer: '35',
        explanation: '20 × 5 = 100, so 7 × 5 = 35. The equivalent fraction is 35/100.',
        cognitiveSkill: 'APPLY',
        misconceptionCategory: 'EQUIVALENCE_CONFUSION',
        marks: 1.0
      },
      {
        conceptId: cG5Equiv.id,
        assessmentType: 'FOUNDATION_CHECK',
        gradeLevel: 'Grade 5',
        questionText: 'A teacher shaded 18 squares out of a 25-grid. What fraction out of 100 is this equivalent to?',
        questionType: 'MCQ',
        optionsJson: JSON.stringify(['54/100', '72/100', '68/100', '80/100']),
        correctAnswer: '72/100',
        explanation: 'Multiply 18 and 25 by 4: 18 × 4 = 72 and 25 × 4 = 100. Result: 72/100.',
        cognitiveSkill: 'APPLY',
        misconceptionCategory: 'ADDITIVE_REASONING_ERROR',
        marks: 1.0
      }
    ]
  });

  // Questions for Grade 6 Reassessment Mastery (Phase 4 Test)
  await prisma.conceptAssessmentQuestion.createMany({
    data: [
      {
        conceptId: cG6PctCalc.id,
        assessmentType: 'REASSESSMENT_MASTERY',
        gradeLevel: 'Grade 6',
        questionText: 'What is 15% of 300 kg of organic produce?',
        questionType: 'MCQ',
        optionsJson: JSON.stringify(['45 kg', '30 kg', '15 kg', '60 kg']),
        correctAnswer: '45 kg',
        explanation: '(15 / 100) × 300 = 15 × 3 = 45 kg.',
        cognitiveSkill: 'APPLY',
        misconceptionCategory: 'DECIMAL_SHIFT_CONFUSION',
        marks: 1.0
      },
      {
        conceptId: cG6PctCalc.id,
        assessmentType: 'REASSESSMENT_MASTERY',
        gradeLevel: 'Grade 6',
        questionText: 'In an Achariya inter-campus quiz of 80 questions, Rohan answered 75% correctly. How many questions did he get right?',
        questionType: 'MCQ',
        optionsJson: JSON.stringify(['50', '60', '70', '64']),
        correctAnswer: '60',
        explanation: '75% = 75/100 = 3/4. (3/4) × 80 = 3 × 20 = 60 questions.',
        cognitiveSkill: 'APPLY',
        misconceptionCategory: 'PROCEDURAL_COMPUTATION_ERROR',
        marks: 1.0
      },
      {
        conceptId: cG6PctCalc.id,
        assessmentType: 'REASSESSMENT_MASTERY',
        gradeLevel: 'Grade 6',
        questionText: 'A school library purchased 450 new books. 40% are Science books. How many Science books were bought?',
        questionType: 'MCQ',
        optionsJson: JSON.stringify(['160', '180', '190', '200']),
        correctAnswer: '180',
        explanation: '40% = 40/100 = 2/5. (2/5) × 450 = 2 × 90 = 180 books.',
        cognitiveSkill: 'ANALYZE',
        misconceptionCategory: 'DENOMINATOR_NEGLECT',
        marks: 1.0
      }
    ]
  });

  // =========================================================================
  // SEED LEARNING GAP REGISTER ENTRY (Scenario: Aarav Sundaram - Percentage)
  // =========================================================================

  const existingGap = await prisma.learningGap.findFirst({
    where: {
      studentId: studentId,
      conceptId: cG6PctCalc.id
    }
  });

  let gapRecord;
  if (!existingGap) {
    gapRecord = await prisma.learningGap.create({
      data: {
        gapCode: 'GAP-2026-MTH-001',
        studentId: studentId,
        studentName: studentName,
        campusId: campusId,
        campusName: campusName,
        grade: 'Grade 6',
        gradeNumber: 6,
        subject: 'Mathematics',
        chapter: 'Comparing Quantities: Percentages',
        conceptId: cG6PctCalc.id,
        conceptName: cG6PctCalc.name,
        gapCategory: 'FOUNDATIONAL',
        status: 'INTERVENTION_ASSIGNED',
        priority: 'CRITICAL',
        assessmentRef: 'EXAM-TERM1-MTH6',
        assessmentTitle: 'Grade 6 Term 1 Summative Assessment',
        diagnosticScore: 33.3,
        diagnosticEvidenceJson: JSON.stringify({
          totalQuestionsTested: 3,
          correctQuestions: 1,
          incorrectQuestions: 2,
          accuracyRate: 33.3,
          errorPatterns: [
            {
              questionText: 'Express 7/20 as a percentage',
              studentAnswer: '7%',
              correctAnswer: '35%',
              misconception: 'Additive reasoning and ignoring denominator scaling. Wrote numerator directly as percentage.',
              cognitiveLevel: 'UNDERSTAND',
              rootCauseConcept: 'Grade 5 Equivalent Fractions (CON-MTH-G5-EQUIV)'
            },
            {
              questionText: 'Calculate 25% of 160',
              studentAnswer: '400',
              correctAnswer: '40',
              misconception: 'Multiplied 25 × 160 without dividing by 100 (missing place-value denominator division).',
              cognitiveLevel: 'APPLY',
              rootCauseConcept: 'Grade 5 Fraction-to-Decimal and Base-100 Division'
            }
          ],
          aiDiagnosticSummary: 'Student struggles with Grade 6 Percentage problems because of an unresolved foundational gap in Grade 5 Equivalent Fractions and scaling to base 100. Recommending targeted redirection to Grade 5 Equivalent Fractions before attempting current-grade relearning.'
        }),
        identifiedPrerequisiteId: cG5Equiv.id,
        identifiedPrerequisiteName: 'Grade 5: Equivalent Fractions and Scaling (CON-MTH-G5-EQUIV)',
        recommendedLowerGrade: 'Grade 5',
        recommendedIntervention: 'Complete Grade 5 Foundation Lesson on Base-100 Equivalent Fractions, pass Foundation Verification Test (min 80%), then proceed to Grade 6 3-step Percentage Relearning and final mastery reassessment.',
        teacherId: teacherId,
        teacherName: teacherName,
        teacherNotes: 'Confirmed foundational weakness in fraction-to-hundred scaling during classroom observations. Approved AI remediation pathway to Grade 5 curriculum.',
        assignmentDate: new Date(),
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        foundationAssessmentScore: null,
        currentGradeReassessmentScore: null,
        closureDate: null
      }
    });

    // Create Remediation Pathway for this gap
    await prisma.remediationPathway.create({
      data: {
        gapId: gapRecord.id,
        currentPhase: 'PHASE_1_FOUNDATION',
        foundationGrade: 'Grade 5',
        foundationConceptId: cG5Equiv.id,
        foundationConceptName: cG5Equiv.name,
        foundationResourcesCompleted: false,
        foundationScore: null,
        foundationMastered: false,
        currentGradeResourcesCompleted: false,
        reassessmentScore: null,
        reassessmentMastered: false,
        pathwayPlanJson: JSON.stringify({
          phases: [
            {
              phaseNumber: 1,
              phaseKey: 'PHASE_1_FOUNDATION',
              name: 'Phase 1: Foundation Learning (Lower Grade)',
              gradeLevel: 'Grade 5',
              conceptName: 'Equivalent Fractions & Base-100 Scaling',
              status: 'IN_PROGRESS',
              items: [
                { id: 'item-f1', type: 'INTERACTIVE_EXPLAINER', title: 'The Golden Rule of Equivalent Fractions', durationMins: 15, isDone: false },
                { id: 'item-f2', type: 'WORKBOOK_WORKSHEET', title: 'Practice Worksheet: Route to Hundred', durationMins: 10, isDone: false }
              ]
            },
            {
              phaseNumber: 2,
              phaseKey: 'PHASE_2_FOUNDATION_TEST',
              name: 'Phase 2: Foundation Diagnostic Check',
              gradeLevel: 'Grade 5',
              conceptName: 'Equivalent Fractions Verification',
              status: 'LOCKED',
              requiredScore: 80,
              questionCount: 3,
              attempts: 0
            },
            {
              phaseNumber: 3,
              phaseKey: 'PHASE_3_CURRENT_RELEARN',
              name: 'Phase 3: Current-Grade Relearning',
              gradeLevel: 'Grade 6',
              conceptName: 'Percentage Calculations & Problem Solving',
              status: 'LOCKED',
              items: [
                { id: 'item-c1', type: 'INTERACTIVE_EXPLAINER', title: '3-Step Formula for Percentage of Quantities', durationMins: 20, isDone: false }
              ]
            },
            {
              phaseNumber: 4,
              phaseKey: 'PHASE_4_CURRENT_TEST',
              name: 'Phase 4: Fresh Mastery Reassessment',
              gradeLevel: 'Grade 6',
              conceptName: 'Grade 6 Percentage Mastery Verification',
              status: 'LOCKED',
              requiredScore: 85,
              questionCount: 3
            },
            {
              phaseNumber: 5,
              phaseKey: 'PHASE_5_MASTERED',
              name: 'Phase 5: Verified Concept Mastery & Gap Closure',
              gradeLevel: 'Grade 6',
              status: 'LOCKED',
              criteria: 'Both Foundation (≥80%) and Current Grade (≥85%) verified.'
            }
          ]
        }),
        studentProgressJson: JSON.stringify({
          completedItemIds: [],
          answers: {}
        })
      }
    });

    // Create Initial Audit Log
    await prisma.learningGapAudit.create({
      data: {
        gapId: gapRecord.id,
        fromStatus: 'IDENTIFIED',
        toStatus: 'INTERVENTION_ASSIGNED',
        actorId: teacherId,
        actorName: teacherName,
        actorRole: 'Teacher',
        notes: 'AI diagnostic confirmed Grade 5 Equivalent Fraction prerequisite gap. Teacher approved personalized 5-phase pathway.'
      }
    });
  }

  // Also seed a couple more realistic gaps across other students/concepts to showcase HOC / Central Academy dashboards:
  const otherStudents = await prisma.user.findMany({
    where: { role: { name: 'Student' }, id: { not: studentId } },
    take: 3
  });

  const additionalGapConfigs = [
    {
      code: 'GAP-2026-MTH-002',
      name: 'Pooja Venkatesh',
      grade: 'Grade 6',
      gradeNum: 6,
      subject: 'Mathematics',
      chapter: 'Comparing Quantities: Percentages',
      concept: cG6PctMeaning,
      category: 'CONCEPTUAL',
      status: 'FOUNDATION_LEARNING',
      priority: 'HIGH',
      score: 45.0,
      prereq: cG5Dec,
      prereqName: 'Grade 5: Fraction & Decimal Relationships',
      lowerGrade: 'Grade 5'
    },
    {
      code: 'GAP-2026-MTH-003',
      name: 'Rohan Sharma',
      grade: 'Grade 5',
      gradeNum: 5,
      subject: 'Mathematics',
      chapter: 'Fractions & Proportions',
      concept: cG5Equiv,
      category: 'FOUNDATIONAL',
      status: 'CONFIRMED',
      priority: 'CRITICAL',
      score: 40.0,
      prereq: cG4Div,
      prereqName: 'Grade 4: Division & Equal Sharing',
      lowerGrade: 'Grade 4'
    },
    {
      code: 'GAP-2026-MTH-004',
      name: 'Kavya Rajesh',
      grade: 'Grade 6',
      gradeNum: 6,
      subject: 'Mathematics',
      chapter: 'Comparing Quantities: Percentages',
      concept: cG6PctCalc,
      category: 'APPLICATION',
      status: 'CURRENT_GRADE_RELEARNING',
      priority: 'MEDIUM',
      score: 55.0,
      prereq: cG5Equiv,
      prereqName: 'Grade 5: Equivalent Fractions and Scaling',
      lowerGrade: 'Grade 5'
    },
    {
      code: 'GAP-2026-MTH-005',
      name: 'Ananya Krishnan',
      grade: 'Grade 6',
      gradeNum: 6,
      subject: 'Mathematics',
      chapter: 'Comparing Quantities: Percentages',
      concept: cG6PctCalc,
      category: 'FOUNDATIONAL',
      status: 'MASTERED',
      priority: 'HIGH',
      score: 90.0,
      prereq: cG5Equiv,
      prereqName: 'Grade 5: Equivalent Fractions and Scaling',
      lowerGrade: 'Grade 5',
      closureDate: new Date()
    }
  ];

  for (let i = 0; i < additionalGapConfigs.length; i++) {
    const cfg = additionalGapConfigs[i];
    const s = otherStudents[i % otherStudents.length];
    const sId = s?.id || `student-extra-${i}`;
    const sName = s?.fullName || cfg.name;

    await prisma.learningGap.upsert({
      where: { gapCode: cfg.code },
      update: {},
      create: {
        gapCode: cfg.code,
        studentId: sId,
        studentName: sName,
        campusId: campusId,
        campusName: campusName,
        grade: cfg.grade,
        gradeNumber: cfg.gradeNum,
        subject: cfg.subject,
        chapter: cfg.chapter,
        conceptId: cfg.concept.id,
        conceptName: cfg.concept.name,
        gapCategory: cfg.category,
        status: cfg.status,
        priority: cfg.priority,
        diagnosticScore: cfg.score,
        identifiedPrerequisiteId: cfg.prereq.id,
        identifiedPrerequisiteName: cfg.prereqName,
        recommendedLowerGrade: cfg.lowerGrade,
        recommendedIntervention: `Targeted remediation in ${cfg.prereqName} followed by mastery verification.`,
        teacherId: teacherId,
        teacherName: teacherName,
        assignmentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        foundationAssessmentScore: cfg.status === 'MASTERED' ? 88.0 : (cfg.status === 'CURRENT_GRADE_RELEARNING' ? 85.0 : null),
        currentGradeReassessmentScore: cfg.status === 'MASTERED' ? 92.0 : null,
        closureDate: cfg.closureDate || null
      }
    });
  }

  console.log('✓ Curriculum Master, Prerequisite Graph & Learning Gaps seeded successfully.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedCurriculumAndLearningGaps()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

