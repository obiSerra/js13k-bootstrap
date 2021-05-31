const puppeteer = require("puppeteer");

const url = "http://localhost:3002";
const imgPath = "./test/e2e/imgs";


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const now = Date.now();
  await page.screenshot({ path: `${imgPath}/${now}.png` });

  await browser.close();
})();
