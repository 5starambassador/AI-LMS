const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function crawlScore() {
  const postData = JSON.stringify({
    security_key: '279d6bcd4621d373cade4e832627b4g2',
    id: 385380,
    role: 'key0000000000013'
  });

  const redirectUrl = await new Promise((resolve, reject) => {
    const req = https.request('https://learning.chrysalis.world/apis/api_index.php/redirectaitools/ai_tools/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data).message.redirect_url));
    });
    req.write(postData);
    req.end();
  });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Redeem SSO ticket
  await page.goto(redirectUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const scoreRoutes = [
    { name: 'exam-builder', path: '/exam-builder' },
    { name: 'exam-assign', path: '/exam-assign' },
    { name: 'exam-grader', path: '/exam-grader' },
    { name: 'exam-grader-runs', path: '/exam-grader/runs' },
    { name: 'exam-insights', path: '/exam-insights' }
  ];

  const results = {};

  for (const r of scoreRoutes) {
    console.log(`Visiting https://templates.chrysalis.world${r.path}...`);
    try {
      await page.goto(`https://templates.chrysalis.world${r.path}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(res => setTimeout(res, 2500));

      const screenshotPath = path.join(__dirname, `../screenshots/staff/score-${r.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      const info = await page.evaluate(() => {
        return {
          title: document.title,
          heading: document.querySelector('h1, h2, h3, h4')?.innerText || '',
          buttons: Array.from(document.querySelectorAll('button, a.btn, input[type="submit"]')).map(b => (b.innerText || b.value || '').trim()).filter(Boolean),
          inputs: Array.from(document.querySelectorAll('input, select, textarea')).map(i => ({
            tag: i.tagName,
            type: i.type,
            placeholder: i.placeholder,
            name: i.name,
            id: i.id
          })),
          textSnippet: document.body.innerText.slice(0, 1000)
        };
      });

      results[r.name] = info;
      console.log(`Captured ${r.name}`);
    } catch(err) {
      console.error(`Error on ${r.name}:`, err.message);
    }
  }

  fs.writeFileSync(path.join(__dirname, 'score-submodules-audit.json'), JSON.stringify(results, null, 2));
  await browser.close();
  console.log('SCORE submodules audit complete!');
}

crawlScore();

