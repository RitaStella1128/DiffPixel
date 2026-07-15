const { execSync } = require('child_process');
const path = require('path');

const chrome = process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const root = path.join(__dirname, '..');

// Chrome Web Store canvases: screenshots 1280x800, small tile 440x280, marquee 1400x560.
const jobs = [];
for (const lang of ['en', 'ja']) {
  const suffix = lang === 'ja' ? '_ja' : '';
  for (let n = 1; n <= 5; n++) {
    jobs.push({
      html: path.join(__dirname, `slide${n}.html`),
      out: path.join(__dirname, `slide${n}${suffix}.png`),
      size: '1280,800',
      lang,
    });
  }
  jobs.push({
    html: path.join(root, 'store-promo', 'promo-small.html'),
    out: path.join(root, 'store-promo', `diffpixel-promo-small-${lang}.png`),
    size: '440,280',
    lang,
  });
  jobs.push({
    html: path.join(root, 'store-promo', 'promo-marquee.html'),
    out: path.join(root, 'store-promo', `diffpixel-promo-marquee-${lang}.png`),
    size: '1400,560',
    lang,
  });
}

for (const job of jobs) {
  const url = `file://${job.html.replace(/\\/g, '/')}?lang=${job.lang}`;
  console.log(`Capturing ${path.basename(job.out)}...`);
  execSync(
    `"${chrome}" --headless=new --disable-gpu --hide-scrollbars ` +
    `--force-device-scale-factor=1 --allow-file-access-from-files ` +
    `--virtual-time-budget=10000 --window-size=${job.size} ` +
    `--screenshot="${job.out}" "${url}"`,
    { stdio: 'inherit' }
  );
}

console.log('Done.');
