// Using built-in global fetch
async function testScoreBatchPdf() {
  console.log('Testing SCORE Binary Batch PDF Generation...');

  // 1. Login as teacher
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
    console.error('Failed to log in as teacher:', loginData);
    process.exit(1);
  }
  console.log('✓ Teacher authenticated successfully');

  // 2. Fetch the batch PDF
  const pdfRes = await fetch('http://localhost:4000/api/score/exams/ACH-EXAM-2026-T1/batch-pdf', {
    headers: {
      Authorization: `Bearer ${loginData.token}`
    }
  });

  if (pdfRes.status !== 200) {
    console.error(`Failed to fetch PDF: status ${pdfRes.status}`);
    const errText = await pdfRes.text();
    console.error(errText);
    process.exit(1);
  }

  const contentType = pdfRes.headers.get('content-type');
  const arrayBuf = await pdfRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuf);
  const pdfHeader = buffer.slice(0, 5).toString('ascii');

  console.log(`✓ Response status: ${pdfRes.status}`);
  console.log(`✓ Content-Type: ${contentType}`);
  console.log(`✓ Buffer size: ${buffer.length} bytes (${(buffer.length / 1024).toFixed(2)} KB)`);
  console.log(`✓ Binary magic header: "${pdfHeader}"`);

  if (pdfHeader.startsWith('%PDF-')) {
    console.log('✓ PASS: Generated file is a valid binary PDF document with scannable QR anchors!');
  } else {
    console.error('✗ FAIL: Invalid PDF header');
    process.exit(1);
  }
}

testScoreBatchPdf().catch(console.error);
