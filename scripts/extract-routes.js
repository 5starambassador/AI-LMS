const fs = require('fs');
const bundle = fs.readFileSync('scripts/main.bundle.js', 'utf8');

// Find all route configurations:
// Look for {path:"...", component:...} or element:...
const regex = /path:\s*["']([^"']+)["']/g;
let match;
const paths = new Set();
while ((match = regex.exec(bundle)) !== null) {
  paths.add(match[1]);
}
const filtered = Array.from(paths).filter(p => p.startsWith('/')).sort();
console.log('Total paths found:', filtered.length);
console.log(JSON.stringify(filtered, null, 2));

// Also let's extract API endpoints called via fetch/axios
const apiRegex = /["'](apis\/[^"']+|https:\/\/learning\.chrysalis\.world\/apis\/[^"']+)["']/g;
const apis = new Set();
while ((match = apiRegex.exec(bundle)) !== null) {
  apis.add(match[1]);
}
console.log('Total API endpoints found:', apis.size);
fs.writeFileSync('scripts/extracted-apis.json', JSON.stringify(Array.from(apis).sort(), null, 2));

