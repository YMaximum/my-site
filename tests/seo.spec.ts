import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { profile, projects } from '../src/data/portfolio';

const canonical = 'https://nyassar.com/';

test('production HTML contains portfolio content and consistent SEO metadata', async ({
  request,
  page,
}) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('data-interactive="false"');
  expect(html).toContain(profile.name);
  expect(html).toContain('Full-stack Software Engineer');
  expect(html).toContain('Sea Labs Indonesia');
  expect(html).toContain(`mailto:${profile.email}`);
  for (const project of projects) {
    expect(html).toContain(project.title);
    expect(html).toContain(project.summary);
  }
  expect(html).toContain('Last Spire – The Runeforged Age');
  expect(html).toContain('A personal assistant on WhatsApp');
  expect(html).toContain('daily reports');
  expect(html).toContain('cash-flow tracking');
  await page.goto('/?work=analytics&stage=review');
  await expect(page).toHaveTitle(
    'Naufal Yassar — Full-stack Software Engineer',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    canonical,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    canonical,
  );
  const image = page.locator('meta[property="og:image"]');
  await expect(image).toHaveAttribute(
    'content',
    `${canonical}social-preview.png`,
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    `${canonical}social-preview.png`,
  );
  const person = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  expect(person).toMatchObject({
    '@type': 'Person',
    name: profile.name,
    url: canonical,
    sameAs: [profile.github, profile.linkedin],
  });
  expect(html).not.toMatch(/name="robots"[^>]*noindex/);
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain(`<loc>${canonical}</loc>`);
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(`Sitemap: ${canonical}sitemap.xml`);
  const preview = await request.get('/social-preview.png');
  expect(preview.status()).toBe(200);
  expect(preview.headers()['content-type']).toContain('image/png');
  const png = await preview.body();
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
});

test('search icons are declared in HTML and served as real image files', async ({
  page,
  request,
}) => {
  await page.goto('/');
  for (const [path, size, rel] of [
    ['/favicon-96x96.png', 96, 'icon'],
    ['/apple-touch-icon.png', 180, 'apple-touch-icon'],
  ] as const) {
    await expect(
      page.locator(`link[rel="${rel}"][href="${path}"]`),
    ).toHaveAttribute('sizes', `${size}x${size}`);
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    const image = await response.body();
    expect(image.subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    );
    expect(image.readUInt32BE(16)).toBe(size);
    expect(image.readUInt32BE(20)).toBe(size);
  }
  await expect(
    page.locator('link[rel="icon"][href="/favicon.ico"]'),
  ).toHaveCount(1);
  const icon = await request.get('/favicon.ico');
  expect(icon.status()).toBe(200);
  expect(icon.headers()['content-type']).toMatch(
    /image\/(?:x-icon|vnd\.microsoft\.icon)/,
  );
  const ico = await icon.body();
  expect(ico.readUInt16LE(0)).toBe(0);
  expect(ico.readUInt16LE(2)).toBe(1);
  expect(ico.readUInt16LE(4)).toBe(2);
});

test('prerendered deep links hydrate without browser errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/?work=analytics&project=modeler&stage=review#approach');
  await expect(page.locator('.portfolio')).toHaveAttribute(
    'data-interactive',
    'true',
  );
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page
      .getByRole('dialog')
      .getByRole('heading', { name: 'Collaborative asset editor' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close system diagram' }).click();
  await expect(
    page.getByRole('region', { name: 'Company projects' }).getByRole('heading'),
  ).toHaveText('Industrial analytics platform');
  await expect(
    page.getByRole('heading', { name: 'Give the work a second look.' }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

for (const width of [390, 1440]) {
  test(`portfolio remains readable without JavaScript at ${width}px`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 1000 },
      baseURL,
    });
    try {
      const page = await context.newPage();
      await page.goto('/');
      for (const project of projects) {
        await expect(
          page.getByRole('heading', { name: project.title, exact: true }),
        ).toBeVisible();
      }
      const personal = page.getByRole('region', { name: 'Built beyond work' });
      await expect(
        personal.getByRole('link', { name: 'Play Last Spire' }),
      ).toHaveAttribute('href', 'https://last-spire.nyassar.com/');
      await expect(
        personal.getByRole('link', { name: 'Source code' }),
      ).toHaveAttribute('href', 'https://github.com/YMaximum/last-spire');
      await expect(
        personal.getByRole('heading', {
          name: 'A personal assistant on WhatsApp',
        }),
      ).toBeVisible();
      await expect(personal.getByText('Deployed & in use')).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Biaenergi' }),
      ).toHaveCount(2);
      await expect(
        page.getByRole('link', { name: profile.email, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Next project' }),
      ).not.toBeVisible();
      const measurements = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));
      expect(measurements.content).toBeLessThanOrEqual(
        measurements.viewport + 1,
      );
    } finally {
      await context.close();
    }
  });
}

for (const width of [390, 1440]) {
  test(`static HTML passes accessibility checks at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    // Block the application while allowing the audit script to execute.
    await page.route('**/assets/*.js', (route) => route.abort());
    await page.goto('/');
    await expect(page.locator('.portfolio')).toHaveAttribute(
      'data-interactive',
      'false',
    );
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(accessibility.violations).toEqual([]);
  });
}
