const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const routesToVisit = [
  { name: '01-staff-home', url: 'https://learning.chrysalis.world/staff/home' },
  { name: '02-staff-books', url: 'https://learning.chrysalis.world/staff/books' },
  { name: '03-staff-resources', url: 'https://learning.chrysalis.world/staff/Resources' },
  { name: '04-staff-aitools', url: 'https://learning.chrysalis.world/staff/aitools' },
  { name: '05-staff-myspace', url: 'https://learning.chrysalis.world/staff/myspace' },
  { name: '06-staff-homeworks', url: 'https://learning.chrysalis.world/staff/homeworks' },
  { name: '07-staff-quiz', url: 'https://learning.chrysalis.world/staff/quiz' },
  { name: '08-staff-worksheets', url: 'https://learning.chrysalis.world/staff/worksheets' },
  { name: '09-staff-studentlist', url: 'https://learning.chrysalis.world/staff/studentlist' },
  { name: '10-staff-profile', url: 'https://learning.chrysalis.world/staff/staff-profile' },
  { name: '11-staff-walkthrough', url: 'https://learning.chrysalis.world/staff/walkthrough' },
  { name: '12-staff-chat', url: 'https://learning.chrysalis.world/staff/chat' }
];

async function run() {
  console.log('Launching browser for staff crawl...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const pageData = {};

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Logging in as teacher...');
    await page.goto('https://learning.chrysalis.world/', { waitUntil: 'networkidle2' });
    await page.type('#username', 'achariya@test.com');
    await page.type('#userpassword', 'Pass@1234');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(e => console.log(e.message)),
      page.click('button[type="submit"]')
    ]);

    await new Promise(r => setTimeout(r, 4000));

    for (const r of routesToVisit) {
      console.log(`Visiting ${r.name}: ${r.url}`);
      try {
        await page.goto(r.url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(res => setTimeout(res, 3000));

        const screenshotPath = path.join(__dirname, `../screenshots/staff/${r.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        const info = await page.evaluate(() => {
          return {
            title: document.title,
            currentUrl: window.location.href,
            heading: document.querySelector('h1, h2, h3, h4')?.innerText || '',
            buttons: Array.from(document.querySelectorAll('button, a.btn')).map(b => (b.innerText || '').trim()).filter(Boolean),
            inputs: Array.from(document.querySelectorAll('input, select, textarea')).map(i => ({
              tag: i.tagName,
              type: i.type,
              placeholder: i.placeholder,
              name: i.name,
              id: i.id
            })),
            tables: Array.from(document.querySelectorAll('table')).map(t => ({
              headers: Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim()),
              rowCount: t.querySelectorAll('tr').length
            })),
            cards: Array.from(document.querySelectorAll('.card, .card-body, [class*="card"]')).length,
            visibleTextSnippet: document.body.innerText.slice(0, 600)
          };
        });

        pageData[r.name] = info;
        console.log(`Saved screenshot and data for ${r.name}`);
      } catch (err) {
        console.error(`Failed on route ${r.name}:`, err.message);
      }
    }

    fs.writeFileSync(path.join(__dirname, 'staff-crawl-results.json'), JSON.stringify(pageData, null, 2));
    console.log('Completed staff crawl!');

  } catch (err) {
    console.error('Fatal crawl error:', err);
  } finally {
    await browser.close();
  }
}

run();

