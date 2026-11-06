const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function deepInspect() {
  console.log('Launching browser for deep multi-module inspection...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const deepLog = {};

  try {
    // Login as Teacher
    console.log('Logging in as Teacher...');
    await page.goto('https://learning.chrysalis.world/', { waitUntil: 'networkidle2' });
    await page.type('#username', 'achariya@test.com');
    await page.type('#userpassword', 'Pass@1234');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);
    await new Promise(r => setTimeout(r, 3000));

    // 1. Inspect AI Tools cards clicks
    console.log('--- Inspecting AI Tools Cards ---');
    await page.goto('https://learning.chrysalis.world/staff/aitools', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    const aiCards = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.card, [class*="card"], div[class*="pointer"], div[style*="cursor"]'));
      return cards.map(c => ({
        text: c.innerText.trim().replace(/\n+/g, ' | '),
        className: c.className
      }));
    });
    deepLog['ai_tools_cards'] = aiCards;
    console.log('Found AI tools cards:', aiCards.length);

    // Let's click on each card or find links in AI tools
    const cardLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a, button, div')).filter(el => {
        const t = el.innerText || '';
        return t.includes('Exam Builder') || t.includes('Autograde') || t.includes('Holistic Progress Card') || 
               t.includes('Assign Exam') || t.includes('Exam Grader') || t.includes('Grading Runs') || 
               t.includes('Exam Insights') || t.includes('LSR Dashboard') || t.includes('Activity Library');
      }).map(el => ({ text: el.innerText.trim().split('\n')[0], tag: el.tagName, href: el.getAttribute('href') }));
    });
    deepLog['ai_cards_links'] = cardLinks;
    console.log('Card links found:', cardLinks);

    // Let's test clicking "Exam Builder"
    console.log('Testing click on Exam Builder...');
    try {
      const examBuilderEl = await page.evaluateHandle(() => {
        const els = Array.from(document.querySelectorAll('*'));
        return els.find(e => e.innerText && e.innerText.includes('Exam Builder') && e.children.length === 0) || null;
      });
      if (examBuilderEl) {
        await examBuilderEl.click();
        await new Promise(r => setTimeout(r, 3000));
        console.log('After clicking Exam Builder, URL:', page.url());
        await page.screenshot({ path: path.join(__dirname, '../screenshots/staff/ai-exam-builder-click.png'), fullPage: true });
        deepLog['exam_builder_result'] = { url: page.url(), title: await page.title() };
      }
    } catch(e) {
      console.log('Exam builder click error:', e.message);
    }

    // 2. Inspect My Space cards clicks
    console.log('--- Inspecting My Space Cards ---');
    await page.goto('https://learning.chrysalis.world/staff/myspace', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Click Planner
    try {
      const plannerEl = await page.evaluateHandle(() => {
        const els = Array.from(document.querySelectorAll('*'));
        return els.find(e => e.innerText && e.innerText.trim() === 'Planner' && e.children.length === 0) || null;
      });
      if (plannerEl) {
        console.log('Clicking Planner...');
        await plannerEl.click();
        await new Promise(r => setTimeout(r, 3000));
        console.log('After clicking Planner, URL:', page.url());
        await page.screenshot({ path: path.join(__dirname, '../screenshots/staff/myspace-planner-click.png'), fullPage: true });
        deepLog['planner_click_result'] = { url: page.url(), title: await page.title() };
      }
    } catch(e) {
      console.log('Planner click error:', e.message);
    }

    // 3. Inspect Create Homework Page
    console.log('--- Inspecting /staff/create-homework ---');
    await page.goto('https://learning.chrysalis.world/staff/create-homework', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(__dirname, '../screenshots/staff/create-homework-live.png'), fullPage: true });
    deepLog['create_homework'] = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        inputs: Array.from(document.querySelectorAll('input, select, textarea, button')).map(el => ({
          tag: el.tagName,
          type: el.type,
          name: el.name,
          placeholder: el.placeholder,
          text: (el.innerText || el.value || '').trim()
        })),
        textSnippet: document.body.innerText.slice(0, 800)
      };
    });

    // 4. Inspect Create Quiz Page
    console.log('--- Inspecting /staff/quiz/create_quiz ---');
    await page.goto('https://learning.chrysalis.world/staff/quiz/create_quiz', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(__dirname, '../screenshots/staff/create-quiz-live.png'), fullPage: true });
    deepLog['create_quiz'] = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        inputs: Array.from(document.querySelectorAll('input, select, textarea, button')).map(el => ({
          tag: el.tagName,
          type: el.type,
          name: el.name,
          placeholder: el.placeholder,
          text: (el.innerText || el.value || '').trim()
        })),
        textSnippet: document.body.innerText.slice(0, 800)
      };
    });

    // 5. Inspect Create Worksheet Page
    console.log('--- Inspecting /staff/create-worksheet ---');
    await page.goto('https://learning.chrysalis.world/staff/create-worksheet', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(__dirname, '../screenshots/staff/create-worksheet-live.png'), fullPage: true });
    deepLog['create_worksheet'] = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        inputs: Array.from(document.querySelectorAll('input, select, textarea, button')).map(el => ({
          tag: el.tagName,
          type: el.type,
          name: el.name,
          placeholder: el.placeholder,
          text: (el.innerText || el.value || '').trim()
        })),
        textSnippet: document.body.innerText.slice(0, 800)
      };
    });

    // 6. Inspect Student List & Portfolio
    console.log('--- Inspecting /staff/studentlist dropdowns ---');
    await page.goto('https://learning.chrysalis.world/staff/studentlist', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 3000));
    
    // Select class & section if dropdowns exist
    const selects = await page.$$('select');
    if (selects.length >= 2) {
      console.log('Selecting class and section in studentlist...');
      await page.select('select:first-of-type', await selects[0].$eval('option:last-child', o => o.value).catch(e=>''));
      await new Promise(r => setTimeout(r, 2000));
    }
    await page.screenshot({ path: path.join(__dirname, '../screenshots/staff/studentlist-selected-live.png'), fullPage: true });

    // Click "View portfolio"
    try {
      const portfolioBtn = await page.$('a[href*="portfolio"], button:has-text("portfolio"), .btn:has-text("portfolio")');
      if (!portfolioBtn) {
        // Find by text
        const pBtn = await page.evaluateHandle(() => {
          return Array.from(document.querySelectorAll('a, button, span')).find(el => (el.innerText || '').toLowerCase().includes('portfolio'));
        });
        if (pBtn) {
          console.log('Clicking portfolio button...');
          await pBtn.click();
          await new Promise(r => setTimeout(r, 4000));
          console.log('Portfolio page URL:', page.url());
          await page.screenshot({ path: path.join(__dirname, '../screenshots/staff/student-portfolio-drilled-live.png'), fullPage: true });
          deepLog['portfolio_page'] = { url: page.url(), textSnippet: (await page.evaluate(() => document.body.innerText)).slice(0, 800) };
        }
      }
    } catch(e) {
      console.log('Portfolio click err:', e.message);
    }

    fs.writeFileSync(path.join(__dirname, 'deep-inspection-results.json'), JSON.stringify(deepLog, null, 2));
    console.log('Saved deep-inspection-results.json successfully!');

  } catch(err) {
    console.error('Deep inspection error:', err);
  } finally {
    await browser.close();
  }
}

deepInspect();

