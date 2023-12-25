const puppeteer = require("puppeteer");

async function captureScreenshot(url, outputPath) {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "/usr/bin/chromium-browser",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
  const page = await browser.newPage();
  await page.goto(url);

  const xpath = "/html/body/div/div/div/div/div";
  await page.waitForXPath(xpath);

  const [element] = await page.$x(xpath);
  if (!element) {
    throw new Error("Element not found using XPath");
  }

  await element.screenshot({ path: outputPath });
  await browser.close();
}

module.exports = captureScreenshot;
