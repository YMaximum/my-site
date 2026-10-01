import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('case studies support links, Escape, focus return, and browser Back', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const trigger = page.getByRole('button', {
    name: 'Enlarge data integration platform system diagram',
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/project=integration/);
  await expect(
    page.getByRole('heading', { name: 'System flow' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page).not.toHaveURL(/project=/);

  await trigger.click();
  await page.goBack();
  await expect(page.getByRole('dialog')).not.toBeVisible();

  await page.goto('/?project=modeler');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page
      .getByRole('dialog')
      .getByRole('heading', { name: 'Collaborative asset editor' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close system diagram' }).click();
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
    for (const title of [
      'Industrial analytics platform',
      'Collaborative asset editor',
      'Data integration platform',
    ]) {
      await page
        .getByRole('button', { name: `Show ${title.toLowerCase()}` })
        .click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      const audit = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(audit.violations.map((item) => item.id)).toEqual([]);
    }
    await page
      .getByRole('button', {
        name: 'Enlarge data integration platform system diagram',
        exact: true,
      })
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
        .getByRole('button', { name: 'Close system diagram' }),
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
    await page.setViewportSize({ width, height: 400 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const trigger = page.getByRole('button', {
      name: 'Enlarge data integration platform system diagram',
      exact: true,
    });
    const dialog = page.getByRole('dialog');
    const close = page.getByRole('button', { name: 'Close system diagram' });
    await trigger.click();
    await dialog
      .getByRole('heading', { name: 'System flow', exact: true })
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

test('motion plays by default without controls and respects system changes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() =>
    localStorage.setItem('portfolio-motion', 'paused'),
  );
  await page.goto('/');
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'on');
  await expect(
    page.getByRole('button', { name: /pause|play|enable motion/i }),
  ).toHaveCount(0);
  const orbit = page.locator('.geometry-orbit');
  const transform = await orbit.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await expect
    .poll(() =>
      orbit.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(transform);
  await page.mouse.move(200, 300);
  await expect
    .poll(() =>
      page
        .locator('.ambient-scene')
        .evaluate((element) => element.style.getPropertyValue('--pointer-x')),
    )
    .not.toBe('0px');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.portfolio')).toHaveAttribute(
    'data-motion',
    'off',
  );
  expect(
    await orbit.evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'on');
  await page.reload();
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'on');
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

test('carousel selection, keyboard navigation, deep links, and diagram actions work', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#work');
  const carousel = page.getByRole('region', { name: 'Company projects' });
  for (const [title, id] of [
    ['Data integration platform', 'integration'],
    ['Industrial analytics platform', 'analytics'],
    ['Collaborative asset editor', 'modeler'],
  ]) {
    const tab = carousel.getByRole('button', {
      name: `Show ${title.toLowerCase()}`,
    });
    await tab.click();
    await expect(tab).toHaveAttribute('aria-pressed', 'true');
    await expect(
      carousel.getByRole('heading', { name: title, exact: true }),
    ).toBeVisible();
    await expect(carousel).toContainText('Associated with Biaenergi');
    await carousel
      .getByRole('button', {
        name: `Enlarge ${title.toLowerCase()} system diagram`,
      })
      .click();
    await expect(page).toHaveURL(new RegExp(`project=${id}`));
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Back to selected work' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  }
  await carousel
    .getByRole('button', { name: 'Next project', exact: true })
    .click();
  await expect(carousel.getByRole('heading')).toHaveText(
    'Data integration platform',
  );
  await carousel.getByRole('button', { name: 'Previous project' }).click();
  await expect(carousel.getByRole('heading')).toHaveText(
    'Collaborative asset editor',
  );
  await page.keyboard.press('ArrowLeft');
  await expect(carousel.getByRole('heading')).toHaveText(
    'Industrial analytics platform',
  );
  await page.reload();
  await expect(carousel.getByRole('heading')).toHaveText(
    'Industrial analytics platform',
  );
  await expect(carousel.locator('.tech-tags li svg')).toHaveCount(5);
  await expect(page.locator('body')).not.toContainText(
    /FQ Analytical|FQ Modeler|Flowqount|Collaboration experiment|Healthcare team project/i,
  );
});

test('mobile carousel swipes change projects while vertical gestures preserve selection', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#work');
  const slide = page.locator('#project-slide');
  await slide.dispatchEvent('touchstart', {
    touches: [{ identifier: 0, clientX: 300, clientY: 350 }],
  });
  await slide.dispatchEvent('touchend', {
    changedTouches: [{ identifier: 0, clientX: 100, clientY: 370 }],
  });
  await expect(slide.getByRole('heading')).toHaveText(
    'Industrial analytics platform',
  );
  await slide.dispatchEvent('touchstart', {
    touches: [{ identifier: 0, clientX: 300, clientY: 350 }],
  });
  await slide.dispatchEvent('touchend', {
    changedTouches: [{ identifier: 0, clientX: 200, clientY: 550 }],
  });
  await expect(slide.getByRole('heading')).toHaveText(
    'Industrial analytics platform',
  );
  await page.getByRole('button', { name: 'Next project', exact: true }).click();
  await expect(slide.getByRole('heading')).toHaveText(
    'Collaborative asset editor',
  );
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

for (const width of [1440, 768, 390, 320]) {
  test(`section dividers align below the header at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const previous = {
      work: '.hero',
      approach: '#work',
      experience: '#approach',
      contact: '.exploring-section',
    };

    async function expectAligned(id: keyof typeof previous) {
      await expect
        .poll(() =>
          page.evaluate((sectionId) => {
            const header = document
              .querySelector('.site-header')!
              .getBoundingClientRect();
            const section = document
              .getElementById(sectionId)!
              .getBoundingClientRect();
            return Math.abs(section.top - header.bottom);
          }, id),
        )
        .toBeLessThanOrEqual(1);
      expect(
        await page.locator(previous[id]).evaluate((element) => {
          return (
            element.getBoundingClientRect().bottom -
            document.querySelector('.site-header')!.getBoundingClientRect()
              .bottom
          );
        }),
      ).toBeLessThanOrEqual(1);
    }

    await page.getByRole('link', { name: 'Explore my work' }).click();
    await expectAligned('work');
    for (const id of ['approach', 'experience', 'contact', 'work'] as const) {
      if (width <= 640)
        await page.getByRole('button', { name: 'Open navigation' }).click();
      await page
        .getByRole('navigation', { name: 'Main navigation' })
        .locator(`a[href="#${id}"]`)
        .click();
      await expectAligned(id);
    }
    await page.reload();
    await expectAligned('work');
    // Direct section URLs use the same offset, including the final section.
    await page.goto('/#contact');
    await expectAligned('contact');
    await page.setViewportSize({ width, height: 400 });
    await page.reload();
    await expectAligned('contact');
  });
}

test('company work and employment dates reflect the updated profile', async ({
  page,
}) => {
  await page.goto('/#experience');
  const current = page.locator('.experience-item').nth(0);
  await expect(current).toContainText('Jul 2025 — Present');
  await expect(current).toContainText('Full-stack Software Engineer');
  await expect(current).toContainText('Full-time');
  await expect(current).toContainText('client on-premise deployments');
  const contract = page.locator('.experience-item').nth(1);
  await expect(contract).toContainText('Aug 2024 — Jul 2025');
  await expect(contract).toContainText('Contract');
  for (const id of ['analytics', 'modeler']) {
    await page.goto(`/?project=${id}`);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('link', { name: 'Explore the repository' }),
    ).toHaveCount(0);
    await expect(
      dialog.getByRole('heading', { name: 'System flow' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Close system diagram' }).click();
    await expect(dialog).not.toBeVisible();
  }
  await expect(
    page.getByRole('link', { name: /source on GitHub/ }),
  ).toHaveCount(0);
});

for (const width of [1440, 768]) {
  test(`desktop toolkit floats across the column with drag and keyboard at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(45000);
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    const stage = page.locator('.toolkit-stage');
    await expect(stage).not.toHaveAttribute('data-physics', 'ready');
    await expect(page.locator('.experience-item .tech-tags')).toHaveCount(0);
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveAttribute('data-physics', 'ready');
    const badges = stage.locator('.toolkit-badges:first-child li');
    await expect(badges).toHaveCount(20);
    const area = await stage.boundingBox();
    const sidebar = await page.locator('.experience-sidebar').boundingBox();
    if (!area || !sidebar) throw new Error('Missing toolkit area');
    expect(area.height).toBeCloseTo(sidebar.height, 0);
    expect(area.width).toBeCloseTo(sidebar.width, 0);
    expect(
      await stage.evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe('rgba(0, 0, 0, 0)');
    await expect
      .poll(() =>
        badges.evaluateAll((items) => {
          const area = document
            .querySelector('.toolkit-stage')!
            .getBoundingClientRect();
          return items.every((item) => {
            const rect = item.getBoundingClientRect();
            return (
              rect.top >= area.top - 8 &&
              rect.bottom <= area.bottom + 8 &&
              rect.left >= area.left - 8 &&
              rect.right <= area.right + 8
            );
          });
        }),
      )
      .toBe(true);
    const distribution = await badges.evaluateAll((items) => {
      const area = document
        .querySelector('.toolkit-stage')!
        .getBoundingClientRect();
      return items.map(
        (item) => (item.getBoundingClientRect().top - area.top) / area.height,
      );
    });
    expect(Math.min(...distribution)).toBeLessThan(0.25);
    expect(Math.max(...distribution)).toBeGreaterThan(0.7);
    const beforeFloat = await badges.first().getAttribute('style');
    await expect
      .poll(() => badges.first().getAttribute('style'))
      .not.toBe(beforeFloat);
    // Choose an unobstructed badge below the introductory text, still on screen.
    const index = await badges.evaluateAll((items) => {
      const candidates = items.map((item, index) => ({
        index,
        rect: item.getBoundingClientRect(),
      }));
      const candidate = candidates.find(
        ({ rect, index }) =>
          rect.top > 350 &&
          rect.bottom < innerHeight - 20 &&
          document
            .elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
            ?.closest('li') === items[index],
      );
      if (!candidate) throw new Error('No unobstructed badge');
      return candidate.index;
    });
    const badge = badges.nth(index).getByRole('button');
    const original = await badge.boundingBox();
    if (!original) throw new Error('Missing badge');
    await page.mouse.move(
      original.x + original.width / 2,
      original.y + original.height / 2,
    );
    await page.mouse.down();
    await expect(stage).toHaveAttribute('data-dragging', 'true');
    await page.mouse.move(
      original.x + original.width / 2,
      original.y + original.height / 2 - 110,
      { steps: 15 },
    );
    await expect
      .poll(async () => (await badge.boundingBox())!.y)
      .toBeLessThan(original.y - 30);
    await page.mouse.up();
    await expect(stage).not.toHaveAttribute('data-dragging');
    await badge.focus();
    const beforeKey = await badge.evaluate(
      (el) => el.parentElement!.style.transform,
    );
    await page.keyboard.press('ArrowLeft');
    await expect
      .poll(() => badge.evaluate((el) => el.parentElement!.style.transform))
      .not.toBe(beforeKey);
    const linkedIn = page.locator('.experience-intro a');
    await linkedIn.scrollIntoViewIfNeeded();
    expect(
      await linkedIn.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return (
          document
            .elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
            ?.closest('a') === el
        );
      }),
    ).toBe(true);
    await expect(
      page.getByText('Tools I build with', { exact: true }),
    ).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(stage).not.toHaveAttribute('data-physics');
    await expect(stage.locator('button')).toHaveCount(0);
    await expect(stage.getByText('Claude Code', { exact: true })).toBeVisible();
    await expect(stage.getByText('Codex', { exact: true })).toBeVisible();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(stage).toHaveAttribute('data-physics', 'ready');
    expect(errors).toEqual([]);
  });
}

for (const width of [390, 320]) {
  test(`mobile toolkit is a transparent one-line autoplay strip at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(45000);
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/#experience');
    const stage = page.locator('.toolkit-stage');
    await stage.scrollIntoViewIfNeeded();
    const order = await page.evaluate(() => ({
      timeline: document
        .querySelector('.experience-list')!
        .getBoundingClientRect().bottom,
      toolkit: document
        .querySelector('.experience-toolkit')!
        .getBoundingClientRect().top,
      toolkitEnd: document
        .querySelector('.experience-toolkit')!
        .getBoundingClientRect().bottom,
      workbench: document
        .querySelector('.exploring-section')!
        .getBoundingClientRect().top,
    }));
    expect(order.toolkit).toBeGreaterThanOrEqual(order.timeline);
    expect(order.workbench).toBeGreaterThanOrEqual(order.toolkitEnd);
    await expect(stage).not.toHaveAttribute('data-physics');
    await expect(
      page.getByRole('button', { name: /pause|play|enable motion/i }),
    ).toHaveCount(0);
    await expect(
      page.getByText('Tools I build with', { exact: true }),
    ).toHaveCount(0);
    expect(
      await stage.evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe('rgba(0, 0, 0, 0)');
    expect(
      await stage.evaluate((el) => getComputedStyle(el).maskImage),
    ).toContain('linear-gradient');
    const tops = await stage
      .locator('.toolkit-badges:first-child li')
      .evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().top),
      );
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(1);
    const position = await stage.evaluate((el) => el.scrollLeft);
    await expect
      .poll(() => stage.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(position + 12);
    await stage.hover();
    const hovered = await stage.evaluate((el) => el.scrollLeft);
    await expect
      .poll(() => stage.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(hovered + 12);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(stage.locator('.toolkit-badges')).toHaveCount(1);
    await expect.poll(() => stage.evaluate((el) => el.scrollLeft)).toBe(0);
    await stage.focus();
    await page.keyboard.press('ArrowRight');
    await expect
      .poll(() => stage.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(0);
    // Let Chromium finish its native animated keyboard scroll before checking stability.
    await expect
      .poll(async () => {
        const before = await stage.evaluate((el) => el.scrollLeft);
        await page.waitForTimeout(150);
        return (await stage.evaluate((el) => el.scrollLeft)) === before;
      })
      .toBe(true);
    await stage.evaluate((el) => {
      el.scrollLeft = 200;
    });
    await page.waitForTimeout(350);
    expect(await stage.evaluate((el) => el.scrollLeft)).toBe(200);
    await expect(stage.getByText('Claude Code', { exact: true })).toHaveCount(
      1,
    );
    await expect(stage.getByText('Codex', { exact: true })).toHaveCount(1);
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(audit.violations.map((item) => item.id)).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(stage.locator('.toolkit-badges')).toHaveCount(2);
    await expect
      .poll(() => stage.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(12);
  });
}
