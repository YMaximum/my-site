import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

// Keep favicon URLs stable so crawlers can refresh the same resources.
const svg = await readFile('public/favicon.svg', 'utf8');
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
});
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const render = async (size) => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<style>body{margin:0}svg{display:block;width:100%;height:100%}</style>${svg}`,
    );
    return page.screenshot({ omitBackground: true });
  };
  for (const [size, filename] of [
    [96, 'favicon-96x96.png'],
    [180, 'apple-touch-icon.png'],
  ]) {
    await writeFile(`public/${filename}`, await render(size));
  }
  // ICO supports embedded PNG images; include conventional browser sizes.
  const sizes = [32, 48];
  const images = [];
  for (const size of sizes) images.push(await render(size));
  const directory = Buffer.alloc(6 + sizes.length * 16);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(sizes.length, 4);
  let offset = directory.length;
  images.forEach((png, i) => {
    const entry = 6 + i * 16;
    directory[entry] = sizes[i];
    directory[entry + 1] = sizes[i];
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(png.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  await writeFile('public/favicon.ico', Buffer.concat([directory, ...images]));
} finally {
  await browser.close();
}
