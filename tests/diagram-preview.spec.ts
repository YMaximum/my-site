import { test, expect } from '@playwright/test';

test.use({ hasTouch: true });

test('diagram preview supports pointer pan, anchored wheel zoom, keyboard controls, fit, and motion preferences', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#work');
  const trigger = page.getByRole('button', {
    name: 'Preview data integration platform system diagram',
    exact: true,
  });
  await expect(trigger).toHaveCSS('cursor', 'pointer');
  await expect(page.getByText('Enlarge diagram', { exact: true })).toHaveCount(
    0,
  );
  await trigger.focus();
  await page.keyboard.press('Enter');
  const canvas = page.getByRole('region', { name: 'System diagram canvas' });
  const scene = canvas.locator('.diagram-canvas-scene');
  const zoom = page.getByRole('status', { name: 'Diagram zoom' });
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveAttribute('data-lines', 'animated');
  await expect(canvas.locator('.flow-pulse').first()).toHaveCSS(
    'animation-name',
    'diagram-edge-travel',
  );
  const fitted = await scene.getAttribute('style');
  const bounds = await canvas.boundingBox();
  if (!bounds) throw new Error('Missing canvas bounds');
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds.x + bounds.width / 2 + 80,
    bounds.y + bounds.height / 2 + 50,
    { steps: 5 },
  );
  await expect(canvas).toHaveAttribute('data-dragging', 'true');
  await page.mouse.up();
  await expect(canvas).toHaveAttribute('data-dragging', 'false');
  await expect(scene).not.toHaveAttribute('style', fitted!);
  const node = canvas.locator('.flow-processing');
  const before = await node.boundingBox();
  if (!before) throw new Error('Missing node bounds');
  const initialZoom = await zoom.innerText();
  const pageScroll = await page.evaluate(() => window.scrollY);
  await page.mouse.move(
    before.x + before.width / 2,
    before.y + before.height / 2,
  );
  await page.mouse.wheel(0, -100);
  await expect(zoom).not.toHaveText(initialZoom);
  const after = await node.boundingBox();
  expect(
    Math.abs(after!.x + after!.width / 2 - (before.x + before.width / 2)),
  ).toBeLessThan(2);
  expect(
    Math.abs(after!.y + after!.height / 2 - (before.y + before.height / 2)),
  ).toBeLessThan(2);
  expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
  await canvas.focus();
  const beforeKeys = await scene.getAttribute('style');
  await page.keyboard.press('ArrowLeft');
  await expect(scene).not.toHaveAttribute('style', beforeKeys!);
  await page.keyboard.press('0');
  await expect(scene).toHaveAttribute('style', fitted!);
  await page.keyboard.press('+');
  await expect(zoom).not.toHaveText(initialZoom);
  await page.getByRole('button', { name: 'Fit diagram to canvas' }).click();
  await expect(scene).toHaveAttribute('style', fitted!);
  await page
    .getByRole('button', { name: 'Pause connection animation' })
    .click();
  await expect(canvas).toHaveAttribute('data-lines', 'static');
  expect(
    await canvas
      .locator('.arrow-right')
      .first()
      .evaluate(
        (element) => getComputedStyle(element, '::after').animationName,
      ),
  ).toBe('none');
  await page.getByRole('button', { name: 'Play connection animation' }).click();
  await expect(canvas).toHaveAttribute('data-lines', 'animated');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(canvas).toHaveAttribute('data-lines', 'static');
  await expect(
    page.getByRole('button', { name: 'Pause connection animation' }),
  ).toHaveCount(0);
  await expect(canvas.locator('.flow-pulse').first()).not.toBeVisible();
  const zoomIn = page.getByRole('button', { name: 'Zoom in', exact: true });
  for (let i = 0; i < 12 && (await zoomIn.isEnabled()); i++)
    await zoomIn.click();
  await expect(zoom).toHaveText('300%');
  await expect(zoomIn).toBeDisabled();
  const zoomOut = page.getByRole('button', { name: 'Zoom out', exact: true });
  for (let i = 0; i < 20 && (await zoomOut.isEnabled()); i++)
    await zoomOut.click();
  await expect(zoom).toHaveText('20%');
  await expect(zoomOut).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('mobile diagram taps open the preview, swipe does not, and pinch zoom stays inside the canvas', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setTouchEmulationEnabled', {
    enabled: true,
    maxTouchPoints: 2,
  });
  await page.goto('/#work');
  const trigger = page.getByRole('button', {
    name: 'Preview data integration platform system diagram',
  });
  await trigger.scrollIntoViewIfNeeded();
  const bounds = await trigger.boundingBox();
  if (!bounds) throw new Error('Missing trigger bounds');
  const y = bounds.y + bounds.height / 2;
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 300, y }],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: 100, y }],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await expect(page.locator('#project-slide').getByRole('heading')).toHaveText(
    'Industrial analytics platform',
  );
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(
    page.getByRole('combobox', { name: 'Choose a project' }),
  ).toHaveValue('analytics');
  const illustration = page.getByRole('button', {
    name: 'Preview industrial analytics platform system diagram',
  });
  await illustration.tap();
  const canvas = page.getByRole('region', { name: 'System diagram canvas' });
  await expect(canvas).toBeVisible();
  const canvasBounds = await canvas.boundingBox();
  if (!canvasBounds) throw new Error('Missing canvas bounds');
  const cx = canvasBounds.x + canvasBounds.width / 2;
  const cy = canvasBounds.y + canvasBounds.height / 2;
  const zoom = page.getByRole('status', { name: 'Diagram zoom' });
  const initialZoom = parseInt(await zoom.innerText());
  const beforeScroll = await page.evaluate(() => window.scrollY);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [
      { id: 0, x: cx - 35, y: cy },
      { id: 1, x: cx + 35, y: cy },
    ],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [
      { id: 0, x: cx - 75, y: cy },
      { id: 1, x: cx + 75, y: cy },
    ],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await expect
    .poll(async () => parseInt(await zoom.innerText()))
    .toBeGreaterThan(initialZoom);
  await expect(canvas).toHaveAttribute('data-dragging', 'false');
  expect(await page.evaluate(() => window.scrollY)).toBe(beforeScroll);
  const scene = canvas.locator('.diagram-canvas-scene');
  const beforePan = await scene.getAttribute('style');
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ id: 0, x: cx, y: cy }],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ id: 0, x: cx + 40, y: cy + 30 }],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await expect(scene).not.toHaveAttribute('style', beforePan!);
  await expect(canvas).toHaveAttribute('data-dragging', 'false');
  const beforeTapZoom = parseInt(await zoom.innerText());
  await page.getByRole('button', { name: 'Zoom in', exact: true }).tap();
  await expect
    .poll(async () => parseInt(await zoom.innerText()))
    .toBeGreaterThan(beforeTapZoom);
  expect(
    Math.abs(parseInt(await zoom.innerText()) - beforeTapZoom * 1.25),
  ).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: 'Fit diagram to canvas' }).tap();
  await expect
    .poll(async () => parseInt(await zoom.innerText()))
    .toBeLessThan(initialZoom);
  await page.getByRole('button', { name: 'Close system diagram' }).tap();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(errors).toEqual([]);
});
