const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, 'main.bundle.js'), 'utf8');
console.log('Bundle loaded. Length:', bundle.length);

// Extract all string literals matching paths: /staff/..., /student/..., /admin/...
const routeMatches = new Set();
const routeRegex = /["'](\/(?:staff|admin|student|parent|auth|school|superadmin|common)[a-zA-Z0-9_\-\/:]*)["']/g;
let m;
while ((m = routeRegex.exec(bundle)) !== null) {
  routeMatches.add(m[1]);
}

console.log('Total routes found matching prefixes:', routeMatches.size);
const sortedRoutes = Array.from(routeMatches).sort();

// Group routes by category
const categorized = {
  staff: sortedRoutes.filter(r => r.startsWith('/staff')),
  student: sortedRoutes.filter(r => r.startsWith('/student')),
  admin: sortedRoutes.filter(r => r.startsWith('/admin') || r.startsWith('/school') || r.startsWith('/superadmin')),
  parent: sortedRoutes.filter(r => r.startsWith('/parent')),
  auth: sortedRoutes.filter(r => r.startsWith('/auth') || r.includes('login') || r.includes('logout')),
  other: sortedRoutes.filter(r => !r.startsWith('/staff') && !r.startsWith('/student') && !r.startsWith('/admin') && !r.startsWith('/school') && !r.startsWith('/superadmin') && !r.startsWith('/parent') && !r.startsWith('/auth'))
};

console.log('Staff routes:', categorized.staff.length);
console.log('Student routes:', categorized.student.length);
console.log('Admin routes:', categorized.admin.length);
console.log('Parent routes:', categorized.parent.length);

// Extract API endpoints (e.g. /api/... or backend domain)
const apiMatches = new Set();
const apiRegex = /["'](\/[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-\/]+(?:\?[a-zA-Z0-9_\-=&]*)?)["']/g;
// also search for specific API baseURL
const baseUrls = new Set();
const urlRegex = /(https?:\/\/[a-zA-Z0-9_\-\.:]+(?:\/[a-zA-Z0-9_\-\.]+)*)/g;
let u;
while ((u = urlRegex.exec(bundle)) !== null) {
  if (u[1].includes('chrysalis') || u[1].includes('api')) {
    baseUrls.add(u[1]);
  }
}

// Search for role names
const roleRegex = /(["'](?:Teacher|Student|Parent|Admin|School Admin|Super Admin|Management|Principal|HOD|Coordinator)["'])/g;
const roles = new Set();
let r;
while ((r = roleRegex.exec(bundle)) !== null) {
  roles.add(r[1].replace(/['"]/g, ''));
}

// Save analysis
fs.writeFileSync(path.join(__dirname, 'bundle-analysis.json'), JSON.stringify({
  roles: Array.from(roles),
  baseUrls: Array.from(baseUrls),
  categorizedRoutes: categorized,
  allMatchedRoutes: sortedRoutes
}, null, 2));

console.log('Saved bundle-analysis.json');
console.log('Roles found:', Array.from(roles));
console.log('Base URLs found:', Array.from(baseUrls));

