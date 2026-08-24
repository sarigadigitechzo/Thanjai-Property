const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[PAGE CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.error('[PAGE ERROR]', err);
  });
  
  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED] ${request.url()} - ${request.failure().errorText}`);
  });
  
  await page.goto('http://localhost:5174/');
  await new Promise(r => setTimeout(r, 5000));
  
  const html = await page.content();
  console.log("[BODY PREVIEW]", html.substring(0, 500));
  
  await browser.close();
})();
