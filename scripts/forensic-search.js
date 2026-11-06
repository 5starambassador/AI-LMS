const fs = require('fs');
const bundle = fs.readFileSync('scripts/main.bundle.js', 'utf8');

// 1. Find all occurrences of t("...") for internationalization / labels
const tRegex = /t\s*\(\s*["']([^"']{3,40})["']\s*\)/g;
let m;
const labels = new Set();
while ((m = tRegex.exec(bundle)) !== null) {
  labels.add(m[1]);
}
console.log('Total translated labels:', labels.size);
fs.writeFileSync('scripts/extracted-labels.json', JSON.stringify(Array.from(labels).sort(), null, 2));

// 2. Check for thinkroom.chrysalis.world occurrences
let pos = 0;
const thinkroomOccurrences = [];
while ((pos = bundle.indexOf('thinkroom.chrysalis.world', pos)) !== -1) {
  thinkroomOccurrences.push(bundle.slice(Math.max(0, pos - 100), pos + 200));
  pos += 24;
}
console.log('Thinkroom occurrences:', thinkroomOccurrences.length);

// 3. Search for chat / attendance routes
const chatMatches = [];
pos = 0;
while ((pos = bundle.indexOf('/chat', pos)) !== -1) {
  chatMatches.push(bundle.slice(Math.max(0, pos - 50), pos + 150));
  pos += 5;
}

// 4. Search for studentMarks or exam marks
const markMatches = [];
pos = 0;
while ((pos = bundle.indexOf('studentMarks', pos)) !== -1) {
  markMatches.push(bundle.slice(Math.max(0, pos - 50), pos + 150));
  pos += 12;
}

// 5. Search for HPC / report card
const hpcMatches = [];
pos = 0;
while ((pos = bundle.indexOf('hpc', pos)) !== -1) {
  hpcMatches.push(bundle.slice(Math.max(0, pos - 50), pos + 150));
  pos += 3;
}

console.log('Results summary:');
console.log('Thinkroom snippets:', thinkroomOccurrences.slice(0, 5));
console.log('Mark matches:', markMatches.slice(0, 5));
console.log('Chat matches count:', chatMatches.length);
console.log('HPC matches count:', hpcMatches.length);

