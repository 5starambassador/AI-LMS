const fs = require('fs');
const endpoints = JSON.parse(fs.readFileSync('scripts/all-api-endpoints.json', 'utf8'));

const keywords = ['uploader', 'manager', 'qrstatus', 'banner', 'restore', 'recycle', 'batchmigration', 'bucket', 'hpcresources', 'softdelete'];

const found = {};
keywords.forEach(k => {
  found[k] = endpoints.filter(e => e.toLowerCase().includes(k));
});

console.log(JSON.stringify(found, null, 2));

