const fs = require('fs');
const endpoints = require('./all-api-endpoints.json');

const categories = {
  books_and_lessons: [],
  homework_activities: [],
  quizzes_assessments: [],
  worksheets: [],
  students_parents: [],
  teachers_staff: [],
  classes_subjects: [],
  schools_tenants: [],
  homesetting_cms: [],
  moretools_resources: [],
  portfolios_hpc: [],
  insights_analytics: [],
  ai_and_sso: [],
  other: []
};

for (const ep of endpoints) {
  const lower = ep.toLowerCase();
  if (lower.includes('book') || lower.includes('lesson') || lower.includes('series')) {
    categories.books_and_lessons.push(ep);
  } else if (lower.includes('activity') || lower.includes('homework')) {
    categories.homework_activities.push(ep);
  } else if (lower.includes('quiz') || lower.includes('exam')) {
    categories.quizzes_assessments.push(ep);
  } else if (lower.includes('worksheet')) {
    categories.worksheets.push(ep);
  } else if (lower.includes('student') || lower.includes('stud') || lower.includes('rollno')) {
    categories.students_parents.push(ep);
  } else if (lower.includes('teacher') || lower.includes('staff')) {
    categories.teachers_staff.push(ep);
  } else if (lower.includes('class') || lower.includes('subject') || lower.includes('section')) {
    categories.classes_subjects.push(ep);
  } else if (lower.includes('school') || lower.includes('manager') || lower.includes('publisher')) {
    categories.schools_tenants.push(ep);
  } else if (lower.includes('homebanner') || lower.includes('homesetting') || lower.includes('homepost') || lower.includes('video')) {
    categories.homesetting_cms.push(ep);
  } else if (lower.includes('moretool') || lower.includes('bucket')) {
    categories.moretools_resources.push(ep);
  } else if (lower.includes('portfolio') || lower.includes('hpc')) {
    categories.portfolios_hpc.push(ep);
  } else if (lower.includes('insight') || lower.includes('report') || lower.includes('count')) {
    categories.insights_analytics.push(ep);
  } else if (lower.includes('ai_tools') || lower.includes('sso') || lower.includes('redirect')) {
    categories.ai_and_sso.push(ep);
  } else {
    categories.other.push(ep);
  }
}

console.log('--- SUMMARY OF 381 API ENDPOINTS ---');
for (const [cat, eps] of Object.entries(categories)) {
  console.log(`${cat}: ${eps.length} endpoints`);
}
console.log('Unclassified "other" endpoints:', categories.other);

