import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  const users = await prisma.user.findMany({
    include: { role: true, campus: true },
    orderBy: { role: { roleKey: 'asc' } }
  });

  console.log('\n=== COMPLETE DEMO ACCESS ACCOUNTS ACROSS ALL 7 LEVELS ===\n');
  users.forEach((u, i) => {
    console.log(`[Level ${i+1}] ${u.role.name} (${u.role.scope})`);
    console.log(`  Name:     ${u.fullName}`);
    console.log(`  Email:    ${u.email}`);
    console.log(`  Password: Pass@1234`);
    console.log(`  Role Key: ${u.role.roleKey}`);
    console.log(`  Campus:   ${u.campus?.name || 'Trust Global / Regional Scope'}`);
    console.log('--------------------------------------------------');
  });

  await prisma.$disconnect();
}

listUsers().catch(console.error);

