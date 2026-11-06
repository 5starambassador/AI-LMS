const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching browser for student audit...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const apiCalls = [];
    page.on('response', async response => {
      const url = response.url();
      if (url.includes('/api/') || url.includes('/student/') || url.includes('json') || response.request().resourceType() === 'fetch' || response.request().resourceType() === 'xhr') {
        let text = '';
        try {
          text = await response.text();
        } catch(e) {}
        apiCalls.push({
          url,
          status: response.status(),
          method: response.request().method(),
          responseSnippet: text.slice(0, 500)
        });
      }
    });

    console.log('Navigating to login page...');
    await page.goto('https://learning.chrysalis.world/', { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('Filling student credentials...');
    await page.type('#username', 'anup@test.com');
    await page.type('#userpassword', 'Pass@1234');

    console.log('Clicking Log In...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(e => console.log('Navigation event info:', e.message)),
      page.click('button[type="submit"]')
    ]);

    await new Promise(r => setTimeout(r, 6000));

    console.log('Current URL after student login:', page.url());
    console.log('Page title:', await page.title());

    await page.screenshot({ path: path.join(__dirname, '../screenshots/student/01-student-home.png'), fullPage: true });
    console.log('Saved screenshots/student/01-student-home.png');

    const navStructure = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a, button, li')).map(el => {
        const text = (el.innerText || '').trim();
        const href = el.getAttribute('href') || '';
        return { tag: el.tagName, text: text.split('\n')[0], href, class: el.className };
      }).filter(item => item.text.length > 0 && item.text.length < 50);

      const localStorageData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        localStorageData[k] = localStorage.getItem(k);
      }

      return {
        links: links.slice(0, 100),
        localStorageKeys: Object.keys(localStorageData),
        userAuth: localStorageData['authUser'] || localStorageData['token'] || localStorageData['user'] || null
      };
    });

    console.log('Student nav extraction:', JSON.stringify(navStructure, null, 2));
    fs.writeFileSync(path.join(__dirname, 'student-initial-audit.json'), JSON.stringify({ navStructure, apiCalls }, null, 2));

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await browser.close();
  }
}

run();

