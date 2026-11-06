const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function crawlLsrStudent() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('https://lsr.chrysalis.world/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'anup@test.com');
  await page.type('input[type="password"]', 'Pass@1234');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('button[type="submit"]')
  ]);
  await new Promise(r => setTimeout(r, 3000));

  console.log('Current URL:', page.url());

  // Click button with text "Let’s go"
  const clicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button, a')).find(el => (el.innerText || '').includes('go') || (el.innerText || '').includes('Go'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  console.log('Clicked Lets Go button:', clicked);
  await new Promise(r => setTimeout(r, 4000));

  console.log('After clicking, URL is:', page.url());
  await page.screenshot({ path: path.join(__dirname, '../screenshots/student/lsr-level-test-step1.png'), fullPage: true });

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Step text snippet:', text.replace(/\n+/g, ' ').slice(0, 800));

  // Inspect student navigation in LSR
  const navLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, button, nav')).map(el => ({
      tag: el.tagName,
      href: el.getAttribute('href'),
      text: (el.innerText || '').trim().replace(/\n+/g, ' | ')
    })).filter(x => x.text.length > 0 && x.text.length < 80);
  });

  console.log('Nav elements:', JSON.stringify(navLinks.slice(0, 20), null, 2));

  fs.writeFileSync(path.join(__dirname, 'lsr-student-audit.json'), JSON.stringify({
    url: page.url(),
    snippet: text.slice(0, 1500),
    navLinks
  }, null, 2));

  await browser.close();
}

crawlLsrStudent();

