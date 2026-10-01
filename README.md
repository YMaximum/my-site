# Naufal Yassar's portfolio

A React portfolio about product ownership, full-stack delivery, and practical AI workflows. A compact carousel presents three Biaenergi-associated products with short descriptions, simplified system diagrams, and colored technology logos. Experience holds contribution and infrastructure details, alongside an overall toolkit with falling draggable badges on desktop and an automatic ribbon on mobile. The dark geometric background and transitions honor both the header motion toggle and system reduced-motion preferences. Enlarged diagrams use native dialogs with outside-click dismissal and sticky close controls.

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

The browser suite checks carousel selection and deep links, keyboard and swipe navigation, animated dismissal, outside-click and drag behavior, sticky close controls, keyboard focus, all workflow stages and navigation controls, exact section-divider alignment across breakpoints, updated employment dates, email copying and its failure path, responsive overflow, motion preferences, toolkit physics and keyboard interaction, mobile autoplay controls, and automated WCAG A/AA checks. Tests run against a production preview. If Chromium is already installed, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its absolute path instead of downloading another browser.

## Build and host

```sh
npm run build
npm run preview
```

The output is in `dist/` and can be served by a static host. No server, API credentials, remote font service, or account connection is required. Configure Vite's `base` when hosting below a domain subpath.

## Edit the content

- `src/data/portfolio.ts`: profile links, project summaries, AI workflow stages, and experience.
- `src/App.tsx`: page sections and navigation.
- `src/components/`: system diagrams, technology badges, carousel, native dialog, and workflow explorer.
- `src/index.css`: layout, design tokens, typography, and responsive styles.
- `index.html` and `public/favicon.svg`: metadata and site identity.

Company work is summarized without proprietary product names or infrastructure identifiers. Diagrams are simplified flows, not product screenshots. OpenClaw and VPS automation remain explorations. Carousel selection, enlarged diagrams, and workflow stages support `?work=analytics`, `?project=modeler`, and `?stage=review` links. Fonts and technology SVGs are bundled locally; brand marks are supplied by Simple Icons.

The design brief is in `docs/portfolio/implementation-brief.md`. Reviewed design instructions and their pinned sources are in `.agents/skills/`.
