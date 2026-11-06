const fs = require('fs');
const bundle = fs.readFileSync('scripts/main.bundle.js', 'utf8');

// Find occurrences of moretools
let pos = 0;
while ((pos = bundle.indexOf('moretools', pos)) !== -1) {
  const snippet = bundle.slice(Math.max(0, pos - 100), pos + 150);
  if (snippet.includes('path:') || snippet.includes('route') || snippet.includes('Nav') || snippet.includes('tools')) {
    console.log('--- moretools at', pos, '---');
    console.log(snippet);
  }
  pos += 9;
}

