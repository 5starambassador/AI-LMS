const fs = require('fs');
const bundle = fs.readFileSync('scripts/main.bundle.js', 'utf8');

// Find all action: "..." or url:...
const regex = /action\s*:\s*["']([^"']+)["']/g;
let match;
const actions = new Set();
while ((match = regex.exec(bundle)) !== null) {
  actions.add(match[1]);
}
console.log('Total API Actions found:', actions.size);
const sortedActions = Array.from(actions).sort();
console.log(JSON.stringify(sortedActions.slice(0, 50), null, 2));

fs.writeFileSync('scripts/extracted-actions.json', JSON.stringify(sortedActions, null, 2));

