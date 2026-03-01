const { chromium } = require('playwright');

// These are the exact URLs from the assignment page - Seeds 47-56
const URLS = [
  'https://sanand0.github.io/tdsdata/scrape/?seed=47',
  'https://sanand0.github.io/tdsdata/scrape/?seed=48',
  'https://sanand0.github.io/tdsdata/scrape/?seed=49',
  'https://sanand0.github.io/tdsdata/scrape/?seed=50',
  'https://sanand0.github.io/tdsdata/scrape/?seed=51',
  'https://sanand0.github.io/tdsdata/scrape/?seed=52',
  'https://sanand0.github.io/tdsdata/scrape/?seed=53',
  'https://sanand0.github.io/tdsdata/scrape/?seed=54',
  'https://sanand0.github.io/tdsdata/scrape/?seed=55',
  'https://sanand0.github.io/tdsdata/scrape/?seed=56',
];

async function scrapeTableSum(page, url) {
  console.log(`Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for table to appear
  await page.waitForSelector('table', { timeout: 10000 });

  const numbers = await page.evaluate(() => {
    const cells = document.querySelectorAll('table td, table th');
    const nums = [];
    cells.forEach(cell => {
      const text = cell.innerText.trim();
      const num = parseFloat(text);
      if (!isNaN(num)) {
        nums.push(num);
      }
    });
    return nums;
  });

  console.log(`  Found ${numbers.length} numbers`);
  const sum = numbers.reduce((a, b) => a + b, 0);
  return sum;
}

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  let grandTotal = 0;

  for (const url of URLS) {
    try {
      const sum = await scrapeTableSum(page, url);
      console.log(`URL: ${url} => sum = ${sum}`);
      grandTotal += sum;
    } catch (err) {
      console.error(`Error on ${url}: ${err.message}`);
    }
  }

  console.log('');
  console.log('=============================');
  console.log(`GRAND TOTAL = ${grandTotal}`);
  console.log('=============================');

  await browser.close();
})();
