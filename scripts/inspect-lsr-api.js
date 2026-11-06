const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectLsrApis() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();

  const apiResponses = {};

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('/api/activity/') || url.includes('/api/lsr-dictionary/')) {
      try {
        const json = await res.json();
        const key = url.split('?')[0].replace('https://lsr.chrysalis.world/api/', '');
        apiResponses[key] = json;
      } catch (e) {}
    }
  });

  await page.goto('https://lsr.chrysalis.world/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'anup@test.com');
  await page.type('input[type="password"]', 'Pass@1234');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('button[type="submit"]')
  ]);
  await new Promise(r => setTimeout(r, 4000));

  fs.writeFileSync('scripts/lsr-api-payloads.json', JSON.stringify(apiResponses, null, 2));
  console.log('Captured API responses for keys:', Object.keys(apiResponses));

  // Log summary of level-test/G5
  if (apiResponses['activity/lsr/level-test/G5']) {
    console.log('level-test/G5 sample:');
    console.log(JSON.stringify(apiResponses['activity/lsr/level-test/G5']).slice(0, 800));
  }

  await browser.close();
}

inspectLsrApis().catch(console.error);

