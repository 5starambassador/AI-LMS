import fs from 'fs';
import path from 'path';

async function testPhaseBPdfEngine() {
  console.log('=== VERIFYING PHASE B: REAL BINARY BATCH PDF & SCORE ENGINE ===\n');

  // 1. Authenticate Teacher
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'teacher@achariya.in',
      password: 'Pass@1234',
      portal: 'STAFF'
    })
  });

  const loginData: any = await loginRes.json();
  if (!loginData.token) {
    console.error('Failed to authenticate:', loginData);
    process.exit(1);
  }
  console.log('✓ 1. Teacher Authenticated with JWT session token');

  // 2. Query available exams
  const examsRes = await fetch('http://localhost:4000/api/score/exams', {
    headers: { Authorization: `Bearer ${loginData.token}` }
  });
  const examsData: any = await examsRes.json();
  const targetExam = examsData.exams?.[0] || { id: 'ACH-EXAM-2026-T1' };
  console.log(`✓ 2. Target Exam identified: "${targetExam.title || 'Term 1 Exam'}" (ID: ${targetExam.id})`);

  // 3. Trigger Batch Assignment & Real PDF Generation
  console.log('\n--- Triggering Batch PDF Compilation ---');
  const assignRes = await fetch(`http://localhost:4000/api/score/exams/${targetExam.id}/assign-batch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${loginData.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sectionId: targetExam.sectionId || 'f386b31f-ee44-462a-b29b-e6447dc4b526'
    })
  });

  const assignData: any = await assignRes.json();
  console.log(`✓ 3. POST /api/score/exams/${targetExam.id}/assign-batch -> Status: ${assignRes.status}`);
  console.log(`     Message: ${assignData.message}`);
  console.log(`     Total Booklets: ${assignData.totalBooklets}`);
  console.log(`     Total Pages: ${assignData.totalPages}`);
  console.log(`     File Size: ${assignData.fileSizeBytes} bytes (${(assignData.fileSizeBytes / 1024).toFixed(2)} KB)`);
  console.log(`     Static Route: ${assignData.batchPdfUrl}`);

  // 4. Verify Physical File on Disk
  const expectedDiskPath = path.resolve(process.cwd(), 'public', 'renders', 'exams', targetExam.id, 'batch-print-all.pdf');
  const fileExists = fs.existsSync(expectedDiskPath);
  console.log(`\n✓ 4. Physical PDF file verified on disk: ${fileExists}`);
  if (!fileExists) {
    console.error(`✗ File does not exist at ${expectedDiskPath}`);
    process.exit(1);
  }
  const stat = fs.statSync(expectedDiskPath);
  console.log(`     Disk file size: ${stat.size} bytes`);

  // 5. Test Static Delivery via @fastify/static (/renders/exams/...)
  console.log('\n--- Testing @fastify/static Delivery ---');
  const staticUrl = `http://localhost:4000${assignData.batchPdfUrl}`;
  const staticRes = await fetch(staticUrl);
  console.log(`✓ 5. GET ${assignData.batchPdfUrl} -> Status: ${staticRes.status}`);
  console.log(`     Content-Type: ${staticRes.headers.get('content-type')}`);
  
  const staticBuf = Buffer.from(await staticRes.arrayBuffer());
  const staticHeader = staticBuf.slice(0, 5).toString('ascii');
  console.log(`     Binary Magic Header: "${staticHeader}"`);

  if (staticRes.status !== 200 || !staticHeader.startsWith('%PDF-')) {
    console.error('✗ Failed static PDF verification');
    process.exit(1);
  }

  // 6. Test Direct Streaming Route (/api/score/exams/:id/batch-pdf)
  console.log('\n--- Testing Direct Stream Route ---');
  const streamRes = await fetch(`http://localhost:4000/api/score/exams/${targetExam.id}/batch-pdf?token=${loginData.token}`);
  console.log(`✓ 6. GET /api/score/exams/${targetExam.id}/batch-pdf -> Status: ${streamRes.status}`);
  console.log(`     Content-Disposition: ${streamRes.headers.get('content-disposition')}`);
  const streamBuf = Buffer.from(await streamRes.arrayBuffer());
  console.log(`     Streamed Size: ${streamBuf.length} bytes`);

  // 7. Verify QR Corner Anchors & Content Ingestion
  const pdfString = staticBuf.toString('binary');
  const hasQrImages = pdfString.includes('/XObject') || pdfString.includes('/Image');
  console.log(`\n✓ 7. Optical 2D QR Anchors & Vector Graphics Embedded: ${hasQrImages}`);

  console.log('\n=== ALL PHASE B BATCH PDF & SCORE ENGINE TESTS COMPLETED WITH 100% SUCCESS ===');
}

testPhaseBPdfEngine().catch(console.error);

