const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectTemplates() {
  // 1. Get ticket
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
      res.on('end', () => {
        const json = JSON.parse(data);
        resolve(json.message.redirect_url);
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  console.log('Got SSO ticket URL:', redirectUrl);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to SSO redeem URL...');
  await page.goto(redirectUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  console.log('Landed on URL:', page.url());
  console.log('Page title:', await page.title());

  await page.screenshot({ path: path.join(__dirname, '../screenshots/staff/templates-menu-full.png'), fullPage: true });

  const linksAndButtons = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a, button, div.card, [class*="card"], [class*="item"]')).map(el => {
      return {
        tag: el.tagName,
        href: el.getAttribute('href'),
        text: (el.innerText || '').trim().replace(/\n+/g, ' | ')
      };
    }).filter(c => c.text.length > 5 && c.text.length < 150);

    return {
      url: window.location.href,
      title: document.title,
      cards: cards.slice(0, 50)
    };
  });

  console.log('Templates evaluation:', JSON.stringify(linksAndButtons, null, 2));
  fs.writeFileSync(path.join(__dirname, 'templates-menu-audit.json'), JSON.stringify(linksAndButtons, null, 2));

  await browser.close();
}

inspectTemplates();

