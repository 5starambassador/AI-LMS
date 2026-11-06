const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testLsrLogin() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to lsr.chrysalis.world/login...');
  await page.goto('https://lsr.chrysalis.world/login', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(__dirname, '../screenshots/student/lsr-login-screen.png') });

  console.log('Testing student login on LSR with anup@test.com...');
  await page.type('input[type="email"]', 'anup@test.com');
  await page.type('input[type="password"]', 'Pass@1234');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(e => console.log('Nav:', e.message)),
    page.click('button[type="submit"]')
  ]);

  await new Promise(r => setTimeout(r, 4000));
  console.log('LSR after student login URL:', page.url());
  console.log('LSR title:', await page.title());
  await page.screenshot({ path: path.join(__dirname, '../screenshots/student/lsr-student-dashboard.png'), fullPage: true });

  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('LSR Student page snippet:', bodyText.replace(/\n+/g, ' ').slice(0, 500));

  await browser.close();
}

testLsrLogin();

