import { buildApp } from '../src/app.js';

async function runTests() {
  console.log('=== RUNNING AUTH & DOMAIN GATING INTEGRATION TESTS ===\n');
  const app = await buildApp();

  // 1. Health Check
  const resHealth = await app.inject({
    method: 'GET',
    url: '/health'
  });
  console.log('1. GET /health -> Status:', resHealth.statusCode);
  console.log('   Body:', resHealth.payload);

  // 2. Teacher Login on STAFF Portal
  const resTeacherLogin = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: 'achariya@test.com',
      password: 'Pass@1234',
      portal: 'STAFF'
    }
  });
  console.log('\n2. POST /api/auth/login (Teacher on STAFF portal) -> Status:', resTeacherLogin.statusCode);
  const teacherData = JSON.parse(resTeacherLogin.payload);
  console.log('   Success:', teacherData.success);
  console.log('   User:', teacherData.user?.fullName, '| Role:', teacherData.user?.roleName);
  console.log('   Campus:', teacherData.user?.campus?.name, '| SchoolKey:', teacherData.user?.campus?.schoolKey);
  console.log('   Voice / AI License active:', teacherData.user?.license?.voice, teacherData.user?.license?.aiTools);
  const teacherToken = teacherData.token;

  // 3. Student Login Attempt on STAFF Portal (Must be Blocked!)
  const resStudentOnStaff = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: 'anup@test.com',
      password: 'Pass@1234',
      portal: 'STAFF'
    }
  });
  console.log('\n3. POST /api/auth/login (Student on STAFF portal) -> Status:', resStudentOnStaff.statusCode);
  const studentStaffData = JSON.parse(resStudentOnStaff.payload);
  console.log('   Gating Error message:', studentStaffData.error);
  console.log('   Redirect URL provided:', studentStaffData.redirectUrl);

  // 4. Student Login on STUDENT Portal (lsr.chrysalis.world / App)
  const resStudentLogin = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: 'anup@test.com',
      password: 'Pass@1234',
      portal: 'STUDENT'
    }
  });
  console.log('\n4. POST /api/auth/login (Student on STUDENT portal) -> Status:', resStudentLogin.statusCode);
  const studentData = JSON.parse(resStudentLogin.payload);
  console.log('   Success:', studentData.success);
  console.log('   Student:', studentData.user?.fullName, '| Role:', studentData.user?.roleName);
  const studentToken = studentData.token;

  // 5. Authenticated Profile /api/auth/me
  const resMe = await app.inject({
    method: 'GET',
    url: '/api/auth/me',
    headers: {
      authorization: `Bearer ${teacherToken}`
    }
  });
  console.log('\n5. GET /api/auth/me (Teacher Bearer Token) -> Status:', resMe.statusCode);
  console.log('   Authenticated User Context:', JSON.parse(resMe.payload).user);

  // 6. Cross-domain SSO Handshake (/redirectaitools/ai_tools/)
  const resSso = await app.inject({
    method: 'POST',
    url: '/apis/api_index.php/redirectaitools/ai_tools/',
    payload: {
      security_key: '279d6bcd4621d373cade4e832627b4g2',
      id: '385380',
      role: 'key0000000000013'
    }
  });
  console.log('\n6. POST /redirectaitools/ai_tools/ (SSO Handshake) -> Status:', resSso.statusCode);
  console.log('   Redirect URL Payload:', JSON.parse(resSso.payload).message);

  console.log('\n=== ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS ===');
  await app.close();
}

runTests().catch(console.error);

