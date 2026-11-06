const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testAdmin() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.goto('https://learning.chrysalis.world/', { waitUntil: 'networkidle2' });
  await page.type('#username', 'achariya@test.com');
  await page.type('#userpassword', 'Pass@1234');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(e => {}),
    page.click('button[type="submit"]')
  ]);

  const adminUrls = [
    '/schooladmin/home',
    '/schooladmin/admintools',
    '/schooladmin/admintools/teacher',
    '/schooladmin/admintools/student',
    '/schooladmin/admintools/class',
    '/admin/schools'
  ];

  for (const u of adminUrls) {
    await page.goto('https://learning.chrysalis.world' + u, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    console.log(u, '->', page.url(), await page.title());
    const safeName = u.replace(/\//g, '_') + '.png';
    await page.screenshot({ path: path.join(__dirname, '../screenshots/admin', safeName) });
  }
  await browser.close();
}

testAdmin();

