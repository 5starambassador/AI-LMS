const fs = require('fs');
const payloads = JSON.parse(fs.readFileSync('scripts/lsr-api-payloads.json', 'utf8'));

console.log('--- lsr-dictionary/manifest ---');
console.log(JSON.stringify(payloads['lsr-dictionary/manifest']).slice(0, 500));

console.log('--- activity/lsr/result ---');
console.log(JSON.stringify(payloads['activity/lsr/result']).slice(0, 500));

console.log('--- activity/lsr/level-test-result ---');
console.log(JSON.stringify(payloads['activity/lsr/level-test-result']).slice(0, 500));

