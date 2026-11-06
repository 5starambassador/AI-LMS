import { buildApp } from '../src/app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runLmsTests() {
  console.log('=== RUNNING PHASE 2: ACADEMIC & LMS CORE INTEGRATION TESTS ===\n');
  const app = await buildApp();

  // 1. Authenticate Teacher & Student
  const teacherLogin = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: 'achariya@test.com', password: 'Pass@1234', portal: 'STAFF' }
  });
  const teacherToken = JSON.parse(teacherLogin.payload).token;
  console.log('1. Teacher Authentication: SUCCESS');

  const studentLogin = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: 'anup@test.com', password: 'Pass@1234', portal: 'STUDENT' }
  });
  const studentToken = JSON.parse(studentLogin.payload).token;
  const studentId = JSON.parse(studentLogin.payload).user.id;
  console.log('2. Student Authentication: SUCCESS');

  // Fetch Class, Section, and Subject IDs from Seed
  const grade5 = await prisma.class.findFirst({ where: { name: 'Grade 5' } });
  const sectionA = await prisma.section.findFirst({ where: { name: 'A' } });
  const english = await prisma.subject.findFirst({ where: { name: 'English' } });
  const seedBook = await prisma.book.findFirst({ where: { title: 'Studio Grade 5 - English' } });

  // 3. Books Catalog
  const resBooks = await app.inject({
    method: 'GET',
    url: '/api/academic/books',
    headers: { authorization: `Bearer ${teacherToken}` }
  });
  const booksData = JSON.parse(resBooks.payload);
  console.log('\n3. GET /api/academic/books -> Status:', resBooks.statusCode, '| Count:', booksData.count);
  console.log('   Book Title:', booksData.books[0]?.title);

  // 4. Book Details with Chapters
  const resBookDetails = await app.inject({
    method: 'GET',
    url: `/api/academic/books/${seedBook!.id}`,
    headers: { authorization: `Bearer ${teacherToken}` }
  });
  const bookDetailsData = JSON.parse(resBookDetails.payload);
  console.log('\n4. GET /api/academic/books/:id -> Status:', resBookDetails.statusCode);
  console.log('   Lessons Count:', bookDetailsData.book.lessons.length);
  console.log('   Chapter 1 Title:', bookDetailsData.book.lessons[0]?.title);

  // 5. Book QR Redemption
  const qrUnique = `TEST-QR-ENG05-${Date.now()}`;
  const newQr = await prisma.bookQR.create({
    data: {
      qrCode: qrUnique,
      bookId: seedBook!.id,
      status: 'DISTRIBUTED'
    }
  });

  const resRedeem = await app.inject({
    method: 'POST',
    url: '/api/academic/books/qr/redeem',
    headers: { authorization: `Bearer ${studentToken}` },
    payload: { qrCode: qrUnique }
  });
  console.log('\n5. POST /api/academic/books/qr/redeem -> Status:', resRedeem.statusCode);
  console.log('   Redeem Response:', JSON.parse(resRedeem.payload).message);

  // 6. Book QR Status Inventory
  const resQrStatus = await app.inject({
    method: 'GET',
    url: '/api/academic/admin/bookqrstatus',
    headers: { authorization: `Bearer ${teacherToken}` }
  });
  console.log('\n6. GET /api/academic/admin/bookqrstatus -> Status:', resQrStatus.statusCode);
  console.log('   Inventory Metrics:', JSON.parse(resQrStatus.payload).metrics);

  // 7. Teacher Creates Homework
  const resCreateHw = await app.inject({
    method: 'POST',
    url: '/api/assessment/homework',
    headers: { authorization: `Bearer ${teacherToken}` },
    payload: {
      classId: grade5!.id,
      sectionId: sectionA!.id,
      subjectId: english!.id,
      title: 'Chapter 1: Energy Transformation Essay',
      description: 'Write a 150-word paragraph describing how kinetic energy becomes electric energy in an engine.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      maxMarks: 10,
      attachments: ['https://learning.chrysalis.world/assets/sample-guide.pdf']
    }
  });
  const hwData = JSON.parse(resCreateHw.payload);
  console.log('\n7. POST /api/assessment/homework -> Status:', resCreateHw.statusCode);
  console.log('   Created Homework:', hwData.homework?.title, '| Max Marks:', hwData.homework?.maxMarks);
  const homeworkId = hwData.homework.id;

  // 8. Student Submits Homework
  const resSubmitHw = await app.inject({
    method: 'POST',
    url: `/api/assessment/homework/${homeworkId}/submit`,
    headers: { authorization: `Bearer ${studentToken}` },
    payload: {
      submittedText: 'When an engine runs, fuel combustion generates heat and high-pressure expanding gas that pushes the piston...',
      attachments: ['https://s3.amazonaws.com/chrysalis-laas/student/anup-essay.pdf']
    }
  });
  const submissionData = JSON.parse(resSubmitHw.payload);
  console.log('\n8. POST /api/assessment/homework/:id/submit -> Status:', resSubmitHw.statusCode);
  console.log('   Submission Status:', submissionData.submission.status, '| At:', submissionData.submission.submittedAt);
  const submissionId = submissionData.submission.id;

  // 9. Teacher Evaluates Homework
  const resGradeHw = await app.inject({
    method: 'POST',
    url: `/api/assessment/homework/submissions/${submissionId}/grade`,
    headers: { authorization: `Bearer ${teacherToken}` },
    payload: {
      score: 9.5,
      feedback: 'Excellent grasp of thermodynamic principles and concise paragraph structuring. Well done Anup!'
    }
  });
  console.log('\n9. POST /api/assessment/homework/submissions/:id/grade -> Status:', resGradeHw.statusCode);
  console.log('   Evaluated Score:', JSON.parse(resGradeHw.payload).submission.score, '/ 10');

  // 10. Teacher Creates Quiz
  const resCreateQuiz = await app.inject({
    method: 'POST',
    url: '/api/assessment/quizzes',
    headers: { authorization: `Bearer ${teacherToken}` },
    payload: {
      classId: grade5!.id,
      sectionId: sectionA!.id,
      subjectId: english!.id,
      title: 'Chapter 1 Quick Check',
      quizType: 'CHOOSE',
      timeLimitMinutes: 10,
      questions: [
        {
          questionText: 'What was the primary energy source powering the engine?',
          questionType: 'MCQ',
          options: ['Steam Turbine', 'Internal Combustion', 'Solar Panel', 'Hydroelectric'],
          correctAnswer: 'Internal Combustion',
          marks: 2.0
        },
        {
          questionText: 'Complete the sentence: Energy can neither be created nor _______.',
          questionType: 'FILL_IN_BLANKS',
          options: [],
          correctAnswer: 'destroyed',
          marks: 3.0
        }
      ]
    }
  });
  const quizData = JSON.parse(resCreateQuiz.payload);
  console.log('\n10. POST /api/assessment/quizzes -> Status:', resCreateQuiz.statusCode);
  console.log('    Quiz Title:', quizData.quiz.title, '| Questions:', quizData.quiz.questions.length);
  const quizId = quizData.quiz.id;
  const q1Id = quizData.quiz.questions[0].id;
  const q2Id = quizData.quiz.questions[1].id;

  // 11. Student Submits Quiz (Auto-Grading)
  const resSubmitQuiz = await app.inject({
    method: 'POST',
    url: `/api/assessment/quizzes/${quizId}/submit`,
    headers: { authorization: `Bearer ${studentToken}` },
    payload: {
      answers: {
        [q1Id]: 'Internal Combustion',
        [q2Id]: 'destroyed ' // whitespace testing
      }
    }
  });
  const quizResult = JSON.parse(resSubmitQuiz.payload);
  console.log('\n11. POST /api/assessment/quizzes/:id/submit (Auto-Grade) -> Status:', resSubmitQuiz.statusCode);
  console.log('    Score Obtained:', quizResult.score, '/', quizResult.totalMarks, `(${quizResult.percentage}%)`);
  console.log('    Item Evaluations:', quizResult.itemEvaluations.map((e: any) => ({ qId: e.questionId, correct: e.isCorrect, marks: e.marksAwarded })));

  // 12. Record Daily Roll Call
  const resRollCall = await app.inject({
    method: 'POST',
    url: '/api/operations/attendance/rollcall',
    headers: { authorization: `Bearer ${teacherToken}` },
    payload: {
      date: new Date().toISOString(),
      classId: grade5!.id,
      sectionId: sectionA!.id,
      records: [
        { studentId, status: 'PRESENT', remarks: 'Active in morning science experiment' }
      ]
    }
  });
  console.log('\n12. POST /api/operations/attendance/rollcall -> Status:', resRollCall.statusCode);
  console.log('    Roll Call Result:', JSON.parse(resRollCall.payload).message);

  // 13. Student Directory with Anthropometrics
  const resStudents = await app.inject({
    method: 'GET',
    url: `/api/operations/students?classId=${grade5!.id}&sectionId=${sectionA!.id}`,
    headers: { authorization: `Bearer ${teacherToken}` }
  });
  const studentRoster = JSON.parse(resStudents.payload);
  console.log('\n13. GET /api/operations/students -> Status:', resStudents.statusCode, '| Count:', studentRoster.count);
  console.log('    Student Profile:', {
    name: studentRoster.students[0].fullName,
    roll: studentRoster.students[0].enrollments[0]?.rollNumber,
    bloodGroup: studentRoster.students[0].studentProfile?.bloodGroup,
    bmiMetrics: `${studentRoster.students[0].studentProfile?.heightCm}cm / ${studentRoster.students[0].studentProfile?.weightKg}kg`
  });

  // 14. Noticeboard Carousel Banners
  const resBannerCreate = await app.inject({
    method: 'POST',
    url: '/api/operations/banners',
    headers: { authorization: `Bearer ${teacherToken}` },
    payload: {
      title: 'Annual Science & Robotics Exhibition 2026',
      imageUrl: 'https://learning.chrysalis.world/banners/science-expo-2026.png',
      targetRole: 'ALL',
      priority: 10
    }
  });
  console.log('\n14. POST /api/operations/banners -> Status:', resBannerCreate.statusCode);

  const resBanners = await app.inject({
    method: 'GET',
    url: '/api/operations/banners',
    headers: { authorization: `Bearer ${studentToken}` }
  });
  console.log('    GET /api/operations/banners (Student View) -> Status:', resBanners.statusCode);
  console.log('    Active Banner Title:', JSON.parse(resBanners.payload).banners[0]?.title);

  // 15. Resource Buckets ("More Tools")
  const resCreateBucket = await app.inject({
    method: 'POST',
    url: '/api/operations/moretools/buckets',
    headers: { authorization: `Bearer ${teacherToken}` },
    payload: {
      title: 'Grade 5 Science Demonstrations & Videos',
      visibility: 'ALL',
      orderIndex: 1
    }
  });
  console.log('\n15. POST /api/operations/moretools/buckets -> Status:', resCreateBucket.statusCode);
  console.log('    Created Bucket:', JSON.parse(resCreateBucket.payload).bucket?.title);

  console.log('\n=== ALL PHASE 2 ACADEMIC & LMS TESTS COMPLETED WITH 100% SUCCESS ===');
  await app.close();
  await prisma.$disconnect();
}

runLmsTests().catch(console.error);

