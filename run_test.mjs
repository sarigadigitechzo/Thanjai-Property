import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('Navigating to dashboard...');
  
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('thanjai_active_user', JSON.stringify({
      email: 'admin@realrest.example',
      role: 'Super Admin',
      fullName: 'Aishwarya R.'
    }));
  });

  await page.goto('http://localhost:5173/dashboard.html#partners', { waitUntil: 'networkidle2' });

  // wait 2 seconds just in case
  await new Promise(r => setTimeout(r, 2000));

  console.log('Page loaded. Checking for btn-add-partner...');
  
  try {
    const btnHtml = await page.evaluate(() => {
      const btn = document.getElementById('btn-add-partner');
      return btn ? btn.outerHTML : 'NOT FOUND';
    });
    console.log('Button HTML:', btnHtml);
    
    if (btnHtml !== 'NOT FOUND') {
      console.log('Clicking button...');
      await page.click('#btn-add-partner');
      await new Promise(r => setTimeout(r, 1000));
      
      const modalDisplayAfter = await page.evaluate(() => {
        const modal = document.getElementById('add-partner-modal');
        return modal ? window.getComputedStyle(modal).display : 'Modal NOT FOUND';
      });
      console.log('Modal display AFTER click:', modalDisplayAfter);
    } else {
      const bodyHtml = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
      console.log('Body HTML (first 500 chars):', bodyHtml);
      const url = await page.url();
      console.log('Current URL:', url);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }

  await browser.close();
})();
