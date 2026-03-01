const { chromium } = require('playwright');

const SEEDS = [47, 48, 49, 50, 51, 52, 53, 54, 55, 56];
const BASE_URL = 'https://sanand0.github.io/tdsdata/';

async function scrapeTableSum(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });

  // Extract all numbers from all table cells
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

  const sum = numbers.reduce((a, b) => a + b, 0);
  return sum;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let grandTotal = 0;

  for (const seed of SEEDS) {
    const url = `${BASE_URL}?seed=${seed}`;
    try {
      const sum = await scrapeTableSum(page, url);
      console.log(`Seed ${seed}: sum = ${sum}`);
      grandTotal += sum;
    } catch (err) {
      console.error(`Error on seed ${seed}: ${err.message}`);
    }
  }

  console.log(`\n=============================`);
  console.log(`GRAND TOTAL = ${grandTotal}`);
  console.log(`=============================`);

  await browser.close();
})();
