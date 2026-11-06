const fs = require('fs');
const bundle = fs.readFileSync('scripts/main.bundle.js', 'utf8');

const regex = /api_index\.php["']\s*,\s*["'](\/[^"']+)["']/g;
let match;
const endpoints = new Set();
while ((match = regex.exec(bundle)) !== null) {
  endpoints.add(match[1]);
}

console.log('Total api_index.php endpoints:', endpoints.size);
const sorted = Array.from(endpoints).sort();
console.log(JSON.stringify(sorted, null, 2));

fs.writeFileSync('scripts/all-api-endpoints.json', JSON.stringify(sorted, null, 2));

