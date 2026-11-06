const fs = require('fs');
const bundle = fs.readFileSync('scripts/main.bundle.js', 'utf8');

let pos = 0;
while ((pos = bundle.indexOf('/staff/aitools', pos)) !== -1) {
  console.log('--- At', pos, '---');
  console.log(bundle.slice(Math.max(0, pos - 80), pos + 200));
  pos += 14;
}

// Search for 'Autograde' or 'Exam Builder' in context of clicks/links
const autogradeIdx = bundle.indexOf('Autograde');
if (autogradeIdx !== -1) {
  console.log('--- Autograde at', autogradeIdx, '---');
  console.log(bundle.slice(Math.max(0, autogradeIdx - 200), autogradeIdx + 400));
}

