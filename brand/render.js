const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path'), fs = require('fs');
const B = '/home/claude/brand', OUT = '/home/claude/brand/out';
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const shot = async (file, out) => {
    const page = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 2 });
    await page.setContent(`<html><head><meta charset="utf-8"></head><body style="margin:0;background:transparent">${fs.readFileSync(path.join(B, file), 'utf8')}</body></html>`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, out), omitBackground: true, clip: { x: 0, y: 0, width: 512, height: 512 } });
    await page.close();
  };
  await shot('logo.svg', 'icon-1024.png');        // rounded, see-through corners: header, tab icon, app icons
  await shot('logo-full.svg', 'full-1024.png');   // square: iPhone home screen (iOS rounds it itself)
  await shot('logo-mask.svg', 'mask-1024.png');   // square with extra margin: Android's circle icons
  fs.writeFileSync(path.join(B, 'og-built.html'), fs.readFileSync(path.join(B, 'og.html'), 'utf8').replace('%LOGO%', fs.readFileSync(path.join(B, 'logo.svg'), 'utf8')));
  const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await og.goto('file://' + path.join(B, 'og-built.html'));
  await og.waitForTimeout(300);
  await og.screenshot({ path: path.join(OUT, 'og-raw.png') });
  await browser.close();
  const src = path.join(OUT, 'icon-1024.png');
  await sharp(src).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'icon-512.png'));
  await sharp(src).resize(192, 192).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'icon-192.png'));
  // iOS home screen icons should be opaque and square: iOS rounds the corners
  await sharp(path.join(OUT, 'full-1024.png')).resize(180, 180).flatten({ background: '#0A1230' }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'apple-touch-icon.png'));
  await sharp(src).resize(32, 32).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'favicon-32.png'));
  // maskable (Android adaptive): full bleed, artwork inside the safe circle
  await sharp(path.join(OUT, 'mask-1024.png')).resize(512, 512).flatten({ background: '#0A1230' }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'maskable-512.png'));
  await sharp(path.join(OUT, 'og-raw.png')).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(OUT, 'og-image.png'));
  for (const f of fs.readdirSync(OUT)) console.log(String(fs.statSync(path.join(OUT, f)).size).padStart(8), f);
})();
