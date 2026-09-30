import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('case studies support links, Escape, focus return, and browser Back', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
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

for (const width of [1440, 390]) {
  test(`dialog outside click and sticky close control at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 700 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const trigger = page.getByRole('button', {
      name: 'Read the case study',
      exact: true,
    });
    const dialog = page.getByRole('dialog');
    const close = page.getByRole('button', { name: 'Close case study' });
    await trigger.click();
    await dialog
      .getByRole('heading', { name: 'The problem', exact: true })
      .click();
    await expect(dialog).toBeVisible();

    // A drag that starts in the content must not be mistaken for a backdrop click.
    const bounds = await dialog.boundingBox();
    if (!bounds) throw new Error('Missing dialog bounds');
    await page.mouse.move(bounds.x + 40, bounds.y + 95);
    await page.mouse.down();
    await page.mouse.move(4, 350);
    await page.mouse.up();
    await expect(dialog).toBeVisible();

    await dialog.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    expect(
      await dialog.evaluate((element) => element.scrollTop),
    ).toBeGreaterThan(100);
    await expect(close).toBeInViewport({ ratio: 1 });
    const closeBounds = await close.boundingBox();
    const scrolledBounds = await dialog.boundingBox();
    expect(closeBounds!.y).toBeGreaterThanOrEqual(scrolledBounds!.y);
    expect(closeBounds!.y).toBeLessThan(scrolledBounds!.y + 30);
    await close.click();
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await page.mouse.click(4, 350);
    await expect(dialog).not.toBeVisible();
    await expect(page).not.toHaveURL(/project=/);
    await expect(trigger).toBeFocused();
  });
}

test('motion can be paused, persists on reload, and respects system changes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const orbit = page.locator('.geometry-orbit');
  await expect(
    page.getByRole('button', { name: 'Pause motion' }),
  ).toHaveAttribute('aria-pressed', 'true');
  const firstTransform = await orbit.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await expect
    .poll(() =>
      orbit.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(firstTransform);
  await page.mouse.move(200, 300);
  await expect
    .poll(() =>
      page
        .locator('.ambient-scene')
        .evaluate((element) => element.style.getPropertyValue('--pointer-x')),
    )
    .not.toBe('0px');
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await expect(page.locator('.portfolio')).toHaveAttribute(
    'data-motion',
    'off',
  );
  expect(
    await orbit.evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Enable motion' }),
  ).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Enable motion' }).click();
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'on');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.portfolio')).toHaveAttribute(
    'data-motion',
    'off',
  );
  await expect(
    page.getByRole('button', {
      name: 'Motion reduced by your system preference',
    }),
  ).toBeDisabled();
  expect(
    await orbit.evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
});

for (const width of [1440, 390]) {
  test(`every workflow stage changes its content at ${width}px while the live region stays mounted`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/#approach');
    const stages = [
      ['Brainstorm', 'Start with the right problem.'],
      ['Plan', 'Turn the idea into clear work.'],
      ['Build', 'Make something that works.'],
      ['Review', 'Give the work a second look.'],
      ['Test', 'Check the result, not just the code.'],
      ['Deploy', 'Follow through to delivery.'],
    ];
    await page
      .locator('#workflow-detail')
      .evaluate((element) => element.setAttribute('data-mounted', 'true'));
    for (const [label, heading] of stages) {
      const button = page.getByRole('button', { name: new RegExp(label) });
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(
        page.locator('.workflow-step[aria-pressed="true"]'),
      ).toHaveCount(1);
      await expect(
        page
          .locator('#workflow-detail')
          .getByRole('heading', { name: heading, exact: true }),
      ).toBeVisible();
      await expect(page.locator('#workflow-detail')).toHaveAttribute(
        'data-mounted',
        'true',
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus-visible')).toHaveCount(1);
  });
}

test('all project buttons open their case study and the return action closes it', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  for (const [label, id] of [
    ['Read the case study', 'integration'],
    ['Read the collaboration experiment case study', 'diagrams'],
    ['Read the healthcare team project case study', 'obatin'],
  ]) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`project=${id}`));
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Back to selected work' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  }
});

test('navigation, contact links, and unavailable clipboard remain useful', async ({
  page,
}) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  for (const id of ['work', 'approach', 'experience', 'contact']) {
    await navigation.locator(`a[href="#${id}"]`).click();
    await expect(page.locator(`#${id}`)).toBeInViewport();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
  }
  await page.getByRole('link', { name: 'Back to top', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await page.getByRole('link', { name: 'Explore my work' }).click();
  await expect(page.locator('#work')).toBeInViewport();
  await page
    .getByRole('link', { name: 'A little more about how I work' })
    .click();
  await expect(page.locator('#approach')).toBeInViewport();
  await expect(page.locator('.email-link')).toHaveAttribute(
    'href',
    'mailto:yassarnaufal@gmail.com',
  );
  await expect(page.locator('.social-links a').nth(0)).toHaveAttribute(
    'href',
    'https://github.com/YMaximum',
  );
  await expect(page.locator('.social-links a').nth(1)).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/nyassar/',
  );
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('Denied')) },
      configurable: true,
    });
  });
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Copy is unavailable. You can use the email link instead.',
  );
});
