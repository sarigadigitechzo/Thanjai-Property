import https from 'https';
import fs from 'fs';

const options = {
  hostname: 'www.thanjaiproperty.com',
  path: '/contact',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('./scratch/contact_page.html', data);
    console.log('Saved contact_page.html, status:', res.statusCode, 'size:', data.length);
  });
}).on('error', err => console.error(err));
