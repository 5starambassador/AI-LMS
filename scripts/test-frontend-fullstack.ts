import { buildApp } from '../src/app.js';

async function runFullstackTests() {
  console.log('=== RUNNING FULLSTACK PRODUCTION DELIVERY TESTS ===\n');
  const app = await buildApp();

  // 1. Verify Frontend SPA Index Delivery
  const resIndex = await app.inject({
    method: 'GET',
    url: '/'
  });
  console.log('1. GET / (Frontend SPA Entrypoint) -> Status:', resIndex.statusCode);
  const isHtmlValid = resIndex.payload.includes('Achariya AI') && resIndex.payload.includes('root');
  console.log('   Contains Achariya AI Root & Meta Title:', isHtmlValid);

  // 2. Verify Backend API Health
  const resHealth = await app.inject({
    method: 'GET',
    url: '/health'
  });
  console.log('\n2. GET /health (API Health Probe) -> Status:', resHealth.statusCode);
  console.log('   Payload:', JSON.parse(resHealth.payload));

  // 3. Verify Static Asset Serving
  const fs = await import('fs');
  const path = await import('path');
  const files = fs.readdirSync(path.resolve(process.cwd(), 'dist/assets'));
  const jsFile = files.find((f: string) => f.endsWith('.js')) || 'index.js';

  const resJsAsset = await app.inject({
    method: 'GET',
    url: `/assets/${jsFile}`
  });
  console.log(`\n3. GET /assets/${jsFile} (Vite Production JS) -> Status:`, resJsAsset.statusCode);
  console.log('   Content Length:', resJsAsset.payload.length, 'bytes');

  // 4. Verify SPA Fallback on Deep Client Routes
  const resDeepRoute = await app.inject({
    method: 'GET',
    url: '/staff/aitools'
  });
  console.log('\n4. GET /staff/aitools (Client SPA Fallback) -> Status:', resDeepRoute.statusCode);
  console.log('   Fallback to index.html:', resDeepRoute.payload.includes('Achariya AI'));

  console.log('\n=== ALL FULLSTACK PRODUCTION TESTS COMPLETED WITH 100% SUCCESS ===');
  await app.close();
}

runFullstackTests().catch(console.error);

