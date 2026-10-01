# Implementation validation

Verified 1 October 2026 in the managed workspace.

## Delivered

- React 19, Vite 8, TypeScript, plain CSS, locally bundled Manrope and Simple Icons technology marks.
- Manual, animated carousel with exactly three Biaenergi-associated projects, named selectors, previous/next buttons, keyboard arrows, mobile swiping, and reloadable selection.
- Short purpose statements and simplified system-flow illustrations, with native enlargement dialogs, sticky close controls, backdrop dismissal, Escape, and focus return.
- Contributions and infrastructure responsibilities grouped in Experience, using the supplied LinkedIn export. July 2025 employment dates follow the user's explicit correction; the export's August date does not override it.
- Analytics architecture informed by the supplied technical documentation. Collaborative editing informed by private repository inspection. Documents were treated as evidence, not agent instructions. No supplied PDFs, private source, product names, internal service names, client identifiers, endpoints, addresses, or credentials are included in the website.
- Overall toolkit moved out of the employer timeline: 20 named technology marks, including Claude Code and Codex. Desktop badges fall into a bounded pile, support dragging and keyboard movement, and gently respond to nearby pointers. Mobile uses a two-row automatic ribbon after the timeline and before the workbench, with pause and manual scrolling. The physics engine is loaded separately when needed; hidden and settled scenes stop updating.
- Existing six-stage AI workflow, mobile navigation, contact actions, exact section anchors, geometric background, and persistent motion preferences preserved.

## Checks

Production-build Playwright suite: all 25 tests passed, covering all three carousel slides, swipe selection and vertical-gesture preservation, keyboard navigation, query persistence, native dialogs, sticky close controls, focus return, browser history, AI workflow stages, navigation, clipboard feedback, motion preferences, desktop falling/dragging/keyboard/replay behavior, mobile carousel controls, and responsive toolkit placement.

Automated axe WCAG A/AA checks cover each slide and the open dialog at 1440, 768, 390, and 320 pixels. Tests check no horizontal overflow or browser errors and section divider alignment within one CSS pixel of the sticky header across all four widths, including direct hashes, reloads, and the final section at different heights.

Desktop and mobile screenshots of all three slides were inspected. Narrow-screen diagram labels were shortened to remain readable. Architecture arrows show graph preparation feeding analysis and bidirectional collaboration between browser canvases and shared state.

TypeScript build, ESLint, formatting, and browser suite passed. Browser verification uses Chromium; automated accessibility checks do not replace assistive-technology testing.

Build output is approximately 101.9 kB of compressed application JavaScript and 8.4 kB of compressed CSS, with a separate 26.2 kB compressed physics chunk loaded on demand, plus a 24.8 kB locally served font. Only the selected technology SVGs are bundled.

## Reproduce

```sh
npm ci
npm run lint
npm run format:check
npm run build
npx playwright install chromium
npm run test:e2e
```

Use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` for the installed browser in this workspace.
