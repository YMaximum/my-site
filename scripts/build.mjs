import { build } from 'vite';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Render once at build time; Netlify serves only the static client output.
await build();
try {
  await build({
    build: { ssr: 'src/entry-server.tsx', outDir: 'dist-ssr' },
    publicDir: false,
  });
  const { render } = await import(
    pathToFileURL(resolve('dist-ssr/entry-server.js')).href
  );
  const template = await readFile('dist/index.html', 'utf8');
  const marker = '<div id="root"></div>';
  if (!template.includes(marker))
    throw new Error('Prerender root marker missing');
  await writeFile(
    'dist/index.html',
    template.replace(marker, () => `<div id="root">${render()}</div>`),
  );
} finally {
  await rm('dist-ssr', { recursive: true, force: true });
}
