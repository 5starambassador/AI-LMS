const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectPdPpg() {
  function getRedirect(endpoint) {
    const postData = JSON.stringify({
      security_key: '279d6bcd4621d373cade4e832627b4g2',
      id: 385380,
      role: 'key0000000000013'
    });
    return new Promise((resolve, reject) => {
      const req = https.request('https://learning.chrysalis.world/apis/api_index.php' + endpoint, {
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
  }

  const pdUrl = await getRedirect('/redirectpdtools/pd/');
  const ppgUrl = await getRedirect('/redirectppgtools/ppg/');

  console.log('PD SSO URL:', pdUrl);
  console.log('PPG SSO URL:', ppgUrl);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // PD
  try {
    console.log('Navigating to PD...');
    await page.goto(pdUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 4000));
    console.log('PD Landed URL:', page.url(), await page.title());
    await page.screenshot({ path: path.join(__dirname, '../screenshots/staff/pd-live.png'), fullPage: true });
    fs.writeFileSync(path.join(__dirname, 'pd-audit.json'), JSON.stringify({
      url: page.url(),
      title: await page.title(),
      snippet: (await page.evaluate(() => document.body.innerText)).slice(0, 1000)
    }, null, 2));
  } catch(e) {
    console.log('PD err:', e.message);
  }

  // PPG
  try {
    console.log('Navigating to PPG...');
    await page.goto(ppgUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 4000));
    console.log('PPG Landed URL:', page.url(), await page.title());
    await page.screenshot({ path: path.join(__dirname, '../screenshots/staff/ppg-live.png'), fullPage: true });
    fs.writeFileSync(path.join(__dirname, 'ppg-audit.json'), JSON.stringify({
      url: page.url(),
      title: await page.title(),
      snippet: (await page.evaluate(() => document.body.innerText)).slice(0, 1000)
    }, null, 2));
  } catch(e) {
    console.log('PPG err:', e.message);
  }

  await browser.close();
}

inspectPdPpg();

