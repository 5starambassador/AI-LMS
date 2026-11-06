const fs = require('fs');
const bundle = fs.readFileSync('scripts/main.bundle.js', 'utf8');

const target = 'if("Admin"===e)t("/admin/insights"';
const idx = bundle.indexOf(target);
if (idx !== -1) {
  console.log('--- LOGIN REDIRECT HANDLER ---');
  console.log(bundle.slice(idx - 100, idx + 800));
}

