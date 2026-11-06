const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function crawlLsrDeep() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Listen to network requests to discover API calls and Next.js bundles
  const apis = [];
  page.on('request', req => {
    const url = req.url();
    if (url.includes('/api/') || url.includes('/_next/data/')) {
      apis.push({ method: req.method(), url });
    }
  });

  console.log('Navigating to LSR login...');
  await page.goto('https://lsr.chrysalis.world/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'anup@test.com');
  await page.type('input[type="password"]', 'Pass@1234');
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('button[type="submit"]')
  ]);
  await new Promise(r => setTimeout(r, 3000));

  console.log('Post-login URL:', page.url());

  // Navigate explicitly to /student/
  await page.goto('https://lsr.chrysalis.world/student/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  console.log('URL at /student/:', page.url());

  await page.screenshot({ path: path.join(__dirname, '../screenshots/student/lsr-student-main.png'), fullPage: true });

  // Extract all Next.js routes from window.__BUILD_MANIFEST
  const nextData = await page.evaluate(() => {
    const manifest = window.__BUILD_MANIFEST || {};
    const nextDataObj = window.__NEXT_DATA__ || {};
    return {
      manifestRoutes: Object.keys(manifest),
      nextData: {
        page: nextDataObj.page,
        props: nextDataObj.props,
        query: nextDataObj.query
      },
      bodyText: document.body.innerText,
      allLinks: Array.from(document.querySelectorAll('a, button')).map(el => ({
        tag: el.tagName,
        href: el.getAttribute('href'),
        text: (el.innerText || '').trim().replace(/\n+/g, ' ')
      })).filter(x => x.text || x.href)
    };
  });

  console.log('Next.js Manifest Routes:', nextData.manifestRoutes);
  console.log('Current Page props/data:', JSON.stringify(nextData.nextData, null, 2).slice(0, 500));
  console.log('Body Text snippet:', nextData.bodyText.slice(0, 500));

  fs.writeFileSync(path.join(__dirname, 'lsr-deep-audit.json'), JSON.stringify({
    url: page.url(),
    apis,
    ...nextData
  }, null, 2));

  // Let's also check if there are specific routes like /student/level-test
  if (nextData.manifestRoutes.length > 0) {
    for (const r of nextData.manifestRoutes) {
      if (r.startsWith('/student') && !r.includes('[') && r !== '/student') {
        const testUrl = 'https://lsr.chrysalis.world' + r;
        console.log('Testing discovered subroute:', testUrl);
        try {
          await page.goto(testUrl, { waitUntil: 'networkidle2', timeout: 10000 });
          await new Promise(res => setTimeout(res, 1500));
          const subSlug = r.replace(/[^a-zA-Z0-9]/g, '_');
          await page.screenshot({ path: path.join(__dirname, `../screenshots/student/lsr${subSlug}.png`), fullPage: true });
          console.log(`Captured screenshot for ${r}`);
        } catch (e) {
          console.log(`Failed or timed out on ${r}:`, e.message);
        }
      }
    }
  }

  await browser.close();
  console.log('LSR deep crawl completed successfully.');
}

crawlLsrDeep().catch(err => {
  console.error('Error during LSR deep crawl:', err);
});

