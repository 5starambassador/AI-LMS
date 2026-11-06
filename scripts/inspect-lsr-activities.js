const fs = require('fs');
const payloads = JSON.parse(fs.readFileSync('scripts/lsr-api-payloads.json', 'utf8'));

const test = payloads['activity/lsr/level-test/G5'];
console.log('Grade:', test.grade, test.gradeLabel);
console.log('Blueprint:', test.blueprint);
console.log('Total activities:', test.activities.length);

test.activities.forEach((act, i) => {
  console.log(`\n--- Activity #${i+1}: ${act.activityType} (${act.template_type}) ---`);
  console.log('Format:', act.format, '| Skill:', act.skill, '| Subskill:', act.subSkill);
  console.log('Prompt/Text:', (act.title || act.prompt || act.passage || act.question || '').slice(0, 150));
  if (act.options) console.log('Options:', act.options);
  if (act.audio_url || act.audioUrl) console.log('Audio URL:', act.audio_url || act.audioUrl);
});

