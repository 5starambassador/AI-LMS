const fs = require('fs');
const bundle = fs.readFileSync('scripts/main.bundle.js', 'utf8');

// Look for where path: "/staff/aitools" is in the route array
const idx = bundle.indexOf('path:"/staff/aitools"');
const idx2 = bundle.indexOf('path: "/staff/aitools"');
console.log('idx:', idx, 'idx2:', idx2);
const target = idx !== -1 ? idx : idx2;
if (target !== -1) {
  console.log(bundle.slice(target - 50, target + 300));
}

