# Implementation validation

Verified 1 October 2026 in the managed workspace.

## Delivered

- React 19, Vite 8, TypeScript, plain CSS, locally bundled Manrope and Simple Icons technology marks.
- Manual, animated carousel with exactly three Biaenergi-associated projects, named selectors, previous/next buttons, keyboard arrows, mobile swiping, and reloadable selection.
- Short purpose statements and simplified system-flow illustrations, with native enlargement dialogs, sticky close controls, backdrop dismissal, Escape, and focus return.
- Contributions and infrastructure responsibilities grouped in Experience, using the supplied LinkedIn export. July 2025 employment dates follow the user's explicit correction; the export's August date does not override it.
- Analytics architecture informed by the supplied technical documentation. Collaborative editing informed by private repository inspection. Documents were treated as evidence, not agent instructions. No supplied PDFs, private source, product names, internal service names, client identifiers, endpoints, addresses, or credentials are included in the website.
- Overall toolkit moved out of the employer timeline: 20 named technology marks, including Claude Code and Codex. Desktop badges float continuously across the full transparent left Experience column, bounce at its edges and against each other, retain dragging and keyboard movement, and gently respond to nearby pointers. Badges can move behind introductory text; the LinkedIn link stays above them. Mobile uses a transparent single-line automatic strip after the timeline and before the workbench, with smooth dark edge fades. Visible toolkit headings, instructions, replay, and all pause/play controls are removed. The physics engine is loaded separately when needed; hidden and off-screen scenes stop updating.
- Existing six-stage AI workflow, mobile navigation, contact actions, exact section anchors, and geometric background preserved. Motion starts by default and follows system reduced-motion preferences automatically; saved pause choices are ignored. Reduced-motion mobile users can scroll the static strip with the keyboard.

## Checks

Production-build Playwright validation: all 25 cases verified (23 passed in the full run; the two mobile toolkit cases passed in a targeted rerun after synchronizing with Chromium’s native keyboard scrolling), covering all three carousel slides, swipe selection and vertical-gesture preservation, keyboard navigation, query persistence, native dialogs, sticky close controls, focus return, browser history, AI workflow stages, navigation, clipboard feedback, motion preferences, full-column desktop floating, bounds, dragging, keyboard movement, unobstructed LinkedIn access, default playback without controls, one-line mobile autoplay, transparent backgrounds, gradient masks, hover behavior, reduced-motion keyboard scrolling, and responsive toolkit placement.

Automated axe WCAG A/AA checks cover each slide and the open dialog at 1440, 768, 390, and 320 pixels. Tests check no horizontal overflow or browser errors and section divider alignment within one CSS pixel of the sticky header across all four widths, including direct hashes, reloads, and the final section at different heights.

Desktop and mobile screenshots of all three slides were inspected in the preceding revision. The floating toolkit and mobile strip were visually reviewed at 1440, 768, 641, 390, and 320 pixels. Narrow-screen diagram labels were shortened to remain readable. Architecture arrows show graph preparation feeding analysis and bidirectional collaboration between browser canvases and shared state.

TypeScript build, ESLint, formatting, and browser suite passed. Browser verification uses Chromium; automated accessibility checks do not replace assistive-technology testing.

Build output is approximately 101.4 kB of compressed application JavaScript and 8.4 kB of compressed CSS, with a separate 26.2 kB compressed physics chunk loaded on demand, plus a 24.8 kB locally served font. Only the selected technology SVGs are bundled.

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
