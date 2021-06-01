const puppeteer = require("puppeteer");

const url = "http://localhost:3002";
const imgPath = "./test/e2e/imgs";

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function screenshot(page, name) {
  await page.screenshot({ path: `${imgPath}/${name}.png` });
}

(async () => {
  const browser = await puppeteer.launch({
    dumpio: true,
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1200,
    height: 800,
    deviceScaleFactor: 1,
  });
  await page.goto(url);

  await screenshot(page, "screen_0");
  await delay(1000);
  await screenshot(page, "screen_1");

  await browser.close();
})();
