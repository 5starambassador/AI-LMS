const fs = require('fs');
const bundle = fs.readFileSync('scripts/main.bundle.js', 'utf8');

// The route entry was: {path:"staff/aitools",component:(0,js.jsx)(_$,{})}
const routeIdx = bundle.indexOf('path:"staff/aitools"');
console.log('Route idx:', routeIdx);
const compNameMatch = bundle.slice(routeIdx, routeIdx + 100).match(/component:\(0,js\.jsx\)\(([^,]+),\{\}\)/);
console.log('Component match:', compNameMatch);
if (compNameMatch) {
  const compName = compNameMatch[1];
  console.log('Searching definition of component:', compName);
  let p = bundle.indexOf(compName + '=');
  if (p === -1) p = bundle.indexOf('const ' + compName);
  if (p === -1) p = bundle.indexOf('function ' + compName);
  console.log('Found at:', p);
  if (p !== -1) {
    console.log(bundle.slice(p, p + 1200));
  }
}

