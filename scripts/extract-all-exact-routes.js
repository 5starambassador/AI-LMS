const fs = require('fs');
const bundle = fs.readFileSync('scripts/main.bundle.js', 'utf8');

// Find all occurrences of path:"..."
const regex = /path:\"([^\"]+)\"/g;
let match;
const routes = new Set();
while ((match = regex.exec(bundle)) !== null) {
  routes.add(match[1]);
}

const sortedRoutes = Array.from(routes).sort();
console.log('Total routes found:', sortedRoutes.length);

// Let's filter routes by category
const adminRoutes = sortedRoutes.filter(r => r.startsWith('/admin') || r.includes('schooladmin') || r.includes('superadmin') || r.includes('publisher') || r.includes('manager'));
const staffRoutes = sortedRoutes.filter(r => r.startsWith('/staff') || r.startsWith('/teacher'));
const studentRoutes = sortedRoutes.filter(r => r.startsWith('/student') || r.startsWith('/stud'));
const otherRoutes = sortedRoutes.filter(r => !adminRoutes.includes(r) && !staffRoutes.includes(r) && !studentRoutes.includes(r));

console.log('--- ADMIN / PUBLISHER / MANAGER ROUTES (' + adminRoutes.length + ') ---');
console.log(adminRoutes);

console.log('--- OTHER SPECIALIZED ROUTES (' + otherRoutes.length + ') ---');
console.log(otherRoutes);

