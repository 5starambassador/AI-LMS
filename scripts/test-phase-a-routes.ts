async function testPhaseARoutes() {
  console.log('=== VERIFYING PHASE A STANDALONE ROUTED PAGES ===\n');

  const routesToTest = [
    '/staff/attendance',
    '/staff/homework',
    '/staff/worksheet',
    '/student/homework',
    '/student/voicelab',
    '/staff/aitools',
    '/staff/myspace',
    '/superadmin'
  ];

  for (const route of routesToTest) {
    const res = await fetch(`http://localhost:4000${route}`);
    const text = await res.text();
    const isHtml = text.includes('<!DOCTYPE html>') && text.includes('Achariya AI ONE');
    console.log(`Route [${route}] -> Status: ${res.status} | Serves SPA Entry: ${isHtml}`);
    if (res.status !== 200 || !isHtml) {
      console.error(`✗ Route failed: ${route}`);
      process.exit(1);
    }
  }

  console.log('\n✓ ALL 8 STANDALONE PHASE A ROUTES SERVE SPA ENTRYPOINT SUCCESSFULLY!');
}

testPhaseARoutes().catch(console.error);
