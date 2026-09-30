# Naufal Yassar's portfolio

A React portfolio about product ownership, full-stack delivery, and practical AI workflows. A dark palette, geometric background, and fluid transitions frame selected project case studies, an interactive development workflow, experience, ongoing explorations, and contact links. A header control pauses motion; system reduced-motion preferences take priority. Case studies use native modal dialogs with outside-click dismissal and sticky close controls.

## Run locally

Use Node.js 22.12 or newer (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

## Verify

```sh
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite checks case-study deep links, animated dismissal, outside-click and drag behavior, sticky close controls, keyboard focus, all workflow stages and navigation controls, email copying and its failure path, responsive overflow, motion preferences, and automated WCAG A/AA checks. Tests run against a production preview. If Chromium is already installed, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its absolute path instead of downloading another browser.

## Build and host

```sh
npm run build
npm run preview
```

The output is in `dist/` and can be served by a static host. No server, API credentials, remote font service, or account connection is required. Configure Vite's `base` when hosting below a domain subpath.

## Edit the content

- `src/data/portfolio.ts`: profile links, project case studies, AI workflow stages, and experience.
- `src/App.tsx`: page sections and navigation.
- `src/components/`: conceptual illustrations, case-study dialog, and workflow explorer.
- `src/index.css`: layout, design tokens, typography, and responsive styles.
- `index.html` and `public/favicon.svg`: metadata and site identity.

Company work is summarized at a high level. Public project illustrations are labeled as concepts; they are not screenshots. OpenClaw and VPS automation are presented as explorations. Case studies and workflow stages support `?project=diagrams` and `?stage=review` links.

The design brief is in `docs/portfolio/implementation-brief.md`. Reviewed design instructions and their pinned sources are in `.agents/skills/`.
