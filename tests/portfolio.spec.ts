import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('case studies support links, Escape, focus return, and browser Back', async ({
  page,
}) => {
  await page.goto('/');
  const trigger = page.getByRole('button', {
    name: 'Read the case study',
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/project=integration/);
  await expect(
    page.getByRole('heading', { name: 'My contribution' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page).not.toHaveURL(/project=/);

  await trigger.click();
  await page.goBack();
  await expect(page.getByRole('dialog')).not.toBeVisible();

  await page.goto('/?project=diagrams');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page
      .getByRole('dialog')
      .getByRole('heading', { name: 'A shared space for ideas.' }),
  ).toBeVisible();
  await expect(
    page
      .getByRole('dialog')
      .getByRole('link', { name: 'Explore the repository' }),
  ).toHaveAttribute(
    'href',
    'https://github.com/YMaximum/simple-diagrams-collaboration',
  );
  await page.getByRole('button', { name: 'Close case study' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('the AI workflow preserves the selected stage through reloads', async ({
  page,
}) => {
  await page.goto('/?stage=review#approach');
  await expect(
    page.getByRole('heading', {
      name: 'AI on the team. Ownership stays with me.',
    }),
  ).toBeInViewport();
  await expect(page.getByRole('button', { name: /04 Review/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(
    page.getByRole('heading', { name: 'Give the work a second look.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: /06 Deploy/ }).click();
  await expect(page).toHaveURL(/stage=deploy/);
  await expect(
    page.getByRole('heading', { name: 'Follow through to delivery.' }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /06 Deploy/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: /01 Brainstorm/ }).focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Start with the right problem.' }),
  ).toBeVisible();
  await expect(page).not.toHaveURL(/stage=/);
});

test('mobile navigation opens, follows anchors, and closes with Escape', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(navigation).not.toBeVisible();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(navigation).toBeVisible();
  await navigation.getByRole('link', { name: 'Approach', exact: true }).click();
  await expect(page).toHaveURL(/#approach/);
  await expect(navigation).not.toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'AI on the team. Ownership stays with me.',
    }),
  ).toBeInViewport();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await navigation.getByRole('link', { name: 'Work', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(navigation).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Open navigation' }),
  ).toBeFocused();
});

for (const width of [1440, 768, 390, 320]) {
  test(`layout and accessibility at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    expect(errors).toEqual([]);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const pageAudit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      pageAudit.violations.map((item) => ({
        id: item.id,
        nodes: item.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      })),
    ).toEqual([]);
    await page
      .getByRole('button', { name: 'Read the case study', exact: true })
      .click();
    const dialogAudit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      dialogAudit.violations.map((item) => ({
        id: item.id,
        nodes: item.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      })),
    ).toEqual([]);
    await expect(
      page
        .getByRole('dialog')
        .getByRole('button', { name: 'Close case study' }),
    ).toBeFocused();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus-visible')).toHaveCount(1);
  });
}

test('contact copy reports success and reduced motion disables smooth scrolling', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#contact');
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.getByRole('status')).toHaveText('Email address copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'yassarnaufal@gmail.com',
  );
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
});
