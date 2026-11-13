import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

// IDs from DB query
const CLASS_ID   = '673206e4-d1bf-4dc2-b220-78dace8c94ae'; // Grade 5
const SUBJECT_ID = '22ca91eb-f909-40e8-94f3-87ec70a1a081'; // Experiential Sciences
const TEACHER_ID = 'b67d6d83-2c2c-4352-a0f5-58bf6cdca1df';
const STUDENT_ID = 'abf09abe-f951-438d-8471-60db6e03983c'; // Aarav Sundaram

async function main() {
  // ── Quiz A: "baseline" session 2 weeks ago ─────────────────────────────
  // These 3 questions have matching text in Quiz B for lifecycle tracking
  const quizA = await p.quiz.create({
    data: {
      classId: CLASS_ID,
      subjectId: SUBJECT_ID,
      teacherId: TEACHER_ID,
      title: 'Forces & Friction: Baseline Check',
      quizType: 'CHOOSE',
      timeLimitMinutes: 10,
      isPublished: true,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      questions: {
        create: [
          {
            questionText: 'Calculate the resultant force when mass is 5 kg and acceleration is 4 m/s²',
            questionType: 'MCQ',
            optionsJson: JSON.stringify(['20 N','25 N','10 N','40 N']),
            correctAnswer: JSON.stringify('20 N'),
            marks: 1, orderIndex: 1
          },
          // ← This question text first-50 matches Quiz B Q3 (Carried In if still wrong)
          {
            questionText: 'Define static friction in terms of motion between surfaces',
            questionType: 'MCQ',
            optionsJson: JSON.stringify([
              'Resistance to initial relative motion between surfaces',
              'Friction when object slides fast',
              'Force that moves objects forward',
              'Friction that acts upward'
            ]),
            correctAnswer: JSON.stringify('Resistance to initial relative motion between surfaces'),
            marks: 1, orderIndex: 2
          },
          // ← Matches Quiz B Q4 (Closed Here — wrong in A, right in B)
          {
            questionText: 'What is the weight of an object with mass 10 kg? (g = 10 m/s²)',
            questionType: 'MCQ',
            optionsJson: JSON.stringify(['100 N','10 N','1000 N','50 N']),
            correctAnswer: JSON.stringify('100 N'),
            marks: 1, orderIndex: 3
          },
          // ← Matches Quiz B Q7 (Carried In — still wrong)
          {
            questionText: "State Newton's Third Law of Motion",
            questionType: 'MCQ',
            optionsJson: JSON.stringify([
              'Every action has an equal and opposite reaction',
              'Objects in motion stay in motion',
              'Force equals mass times acceleration',
              'Energy cannot be created or destroyed'
            ]),
            correctAnswer: JSON.stringify('Every action has an equal and opposite reaction'),
            marks: 1, orderIndex: 4
          }
        ]
      }
    },
    include: { questions: { orderBy: { orderIndex: 'asc' } } }
  });

  // Student answers for Quiz A: Q1 ✓, Q2 ✗ (gap), Q3 ✗ (gap), Q4 ✗ (gap)
  const answersA: Record<string, string> = {
    [quizA.questions[0].id]: '20 N',         // correct
    [quizA.questions[1].id]: 'Friction when object slides fast',  // wrong
    [quizA.questions[2].id]: '10 N',          // wrong
    [quizA.questions[3].id]: 'Objects in motion stay in motion'   // wrong
  };

  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  await p.quizSubmission.create({
    data: {
      quizId: quizA.id,
      studentId: STUDENT_ID,
      answersJson: JSON.stringify(answersA),
      score: 1,
      totalMarks: 4,
      startedAt: new Date(twoWeeksAgo.getTime() - 10 * 60 * 1000),
      submittedAt: twoWeeksAgo
    }
  });
  console.log('✓ Created Quiz A (baseline session, 2 weeks ago) — 1/4 correct');

  // ── Quiz B: "current" in-class session ─────────────────────────────────
  const quizB = await p.quiz.create({
    data: {
      classId: CLASS_ID,
      subjectId: SUBJECT_ID,
      teacherId: TEACHER_ID,
      title: "Laws of Motion: In-Class Session",
      quizType: 'CHOOSE',
      timeLimitMinutes: 15,
      isPublished: true,
      questions: {
        create: [
          {
            questionText: 'What force causes objects to fall towards the Earth?',
            questionType: 'MCQ',
            optionsJson: JSON.stringify(['Gravity','Magnetism','Friction','Tension']),
            correctAnswer: JSON.stringify('Gravity'),
            marks: 1, orderIndex: 1
          },
          {
            questionText: 'Name the force that opposes motion between two surfaces in contact',
            questionType: 'MCQ',
            optionsJson: JSON.stringify(['Friction','Gravity','Normal force','Tension']),
            correctAnswer: JSON.stringify('Friction'),
            marks: 1, orderIndex: 2
          },
          // ← SAME first-50 chars as Quiz A Q2 → will show "Carried In" (still wrong)
          {
            questionText: 'Define static friction in terms of motion between surfaces',
            questionType: 'MCQ',
            optionsJson: JSON.stringify([
              'Resistance to initial relative motion between surfaces',
              'A type of kinetic moving force',
              'Force that acts horizontally only',
              'Friction that disappears with speed'
            ]),
            correctAnswer: JSON.stringify('Resistance to initial relative motion between surfaces'),
            marks: 1, orderIndex: 3
          },
          // ← SAME first-50 chars as Quiz A Q3 → will show "Closed Here" (was wrong, now correct!)
          {
            questionText: 'What is the weight of an object with mass 10 kg? (g = 10 m/s²)',
            questionType: 'MCQ',
            optionsJson: JSON.stringify(['100 N','10 N','1000 N','50 N']),
            correctAnswer: JSON.stringify('100 N'),
            marks: 1, orderIndex: 4
          },
          {
            questionText: 'Calculate the resultant force when F₁ = 15 N and F₂ = 8 N act in the same direction',
            questionType: 'MCQ',
            optionsJson: JSON.stringify(['23 N','7 N','15 N','8 N']),
            correctAnswer: JSON.stringify('23 N'),
            marks: 1, orderIndex: 5
          },
          {
            questionText: 'What is the SI unit of pressure?',
            questionType: 'MCQ',
            optionsJson: JSON.stringify(['Pascal','Newton','Joule','Watt']),
            correctAnswer: JSON.stringify('Pascal'),
            marks: 1, orderIndex: 6
          },
          // ← SAME first-50 chars as Quiz A Q4 → will show "Carried In" (still wrong)
          {
            questionText: "State Newton's Third Law of Motion",
            questionType: 'MCQ',
            optionsJson: JSON.stringify([
              'Every action has an equal and opposite reaction',
              'Objects in motion stay in motion',
              'Force equals mass times acceleration',
              'Energy cannot be created or destroyed'
            ]),
            correctAnswer: JSON.stringify('Every action has an equal and opposite reaction'),
            marks: 1, orderIndex: 7
          },
          {
            questionText: 'Define inertia and give one real-life example',
            questionType: 'MCQ',
            optionsJson: JSON.stringify([
              "Resistance to change in state of motion — e.g. a passenger lurching when a bus brakes",
              'The force that keeps planets in orbit',
              'The energy released when two objects collide',
              'The tendency of water to flow downhill'
            ]),
            correctAnswer: JSON.stringify("Resistance to change in state of motion — e.g. a passenger lurching when a bus brakes"),
            marks: 1, orderIndex: 8
          }
        ]
      }
    },
    include: { questions: { orderBy: { orderIndex: 'asc' } } }
  });

  // Student answers for Quiz B:
  //  Q1 Gravity ✓ | Q2 Friction ✓ | Q3 wrong (Carried In) | Q4 correct (Closed Here!) |
  //  Q5 ✓ | Q6 wrong (New Here) | Q7 wrong (Carried In) | Q8 skipped (New Here)
  const answersB: Record<string, string | null> = {
    [quizB.questions[0].id]: 'Gravity',                             // ✓
    [quizB.questions[1].id]: 'Friction',                            // ✓
    [quizB.questions[2].id]: 'A type of kinetic moving force',      // ✗ Carried In
    [quizB.questions[3].id]: '100 N',                               // ✓ Closed Here!
    [quizB.questions[4].id]: '23 N',                                // ✓
    [quizB.questions[5].id]: 'Newton',                              // ✗ New Here
    [quizB.questions[6].id]: 'Objects in motion stay in motion',    // ✗ Carried In
    // Q8 intentionally omitted → skipped                           // ✗ New Here
  };

  const now = new Date();
  await p.quizSubmission.create({
    data: {
      quizId: quizB.id,
      studentId: STUDENT_ID,
      answersJson: JSON.stringify(answersB),
      score: 4,
      totalMarks: 8,
      startedAt: new Date(now.getTime() - 7 * 60 * 1000),
      submittedAt: now
    }
  });
  console.log('✓ Created Quiz B (current session, today) — 4/8 correct');

  console.log('\n=== DEMO READY ===');
  console.log('Quiz B ID (for direct URL):', quizB.id);
  console.log('Student ID:', STUDENT_ID);
  console.log('\nExpected Learning Gaps Report:');
  console.log('  Carried In: 2  (static friction + Newton 3rd law)');
  console.log('  Closed Here: 1  (weight calculation — was wrong before, right now!)');
  console.log('  New Here: 2  (SI unit of pressure + inertia skipped)');
  console.log('  Open Now: 4');
  console.log('\nScore: 50.0% · Correct:4 · Wrong:3 · Skipped:1 · Attempted:7/8 · Gaps:4');
}

main()
  .catch(e => { console.error('ERROR:', e.message); process.exit(1); })
  .finally(() => p.$disconnect());
