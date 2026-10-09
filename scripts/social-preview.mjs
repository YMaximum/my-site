/* global document */
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const font = await readFile(
  'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2',
);
const favicon = await readFile('public/favicon.svg', 'utf8');
const template = await readFile('scripts/social-preview.html', 'utf8');
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    template
      .replace(
        'FONT_SOURCE',
        `data:font/woff2;base64,${font.toString('base64')}`,
      )
      .replace('FAVICON_SOURCE', favicon),
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/social-preview.png' });
} finally {
  await browser.close();
}
