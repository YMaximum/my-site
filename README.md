# Naufal Yassar's portfolio

A React portfolio about product ownership, full-stack delivery, and practical AI workflows. A compact carousel presents three Biaenergi-associated products with short descriptions, simplified system diagrams, and colored technology logos. Experience holds contribution and infrastructure details, alongside an overall toolkit with a transparent, single-line automatic strip with faded edges on desktop and mobile; desktop logos and names are slightly larger. The dark geometric background and transitions honor system reduced-motion preferences automatically. React Flow renders the diagrams using custom cards that retain the portfolio styling. Clicking a diagram opens a focused preview canvas with drag panning, wheel/pinch zoom, keyboard controls, fit-to-canvas, and React Flow animated edges. Native dialogs retain Escape, outside-click dismissal, and focus return. Mobile uses wrapping project buttons and swiping, with carousel arrows retained on desktop.

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

The browser suite checks carousel selection and deep links, keyboard and swipe navigation, animated dismissal, outside-click and drag behavior, visible canvas controls, keyboard focus, all workflow stages and navigation controls, exact section-divider alignment across breakpoints, updated employment dates, email copying and its failure path, responsive overflow, motion preferences, single-line toolkit autoplay, reduced-motion keyboard scrolling, edge fades, and automated WCAG A/AA checks. Tests run against a production preview. If Chromium is already installed, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its absolute path instead of downloading another browser.

## Build and host

```sh
npm run build
npm run preview
```

The build prerenders React into `dist/index.html`, then hydrates in the browser. All three project summaries, experience, and contact links are present before JavaScript runs. Without JavaScript, project cards appear as a readable stack. The temporary server bundle is removed after rendering. The output is in `dist/` and can be served by a static host. No server, API credentials, remote font service, or account connection is required. Configure Vite's `base` when hosting below a domain subpath.

## Edit the content

- `src/data/portfolio.ts`: profile links, project summaries, AI workflow stages, and experience.
- `src/data/diagrams.ts`: React Flow node layouts, explicit handles, and routed connections.
- `src/App.tsx`: page sections and navigation.
- `src/components/`: system diagrams, technology badges, carousel, native dialog, and workflow explorer.
- `src/index.css`: layout, design tokens, typography, and responsive styles.
- `index.html` and `public/favicon.svg`: metadata and site identity.

Company work is summarized without proprietary product names or infrastructure identifiers. Diagrams are simplified flows, not product screenshots. OpenClaw and VPS automation remain explorations. Carousel selection, enlarged diagrams, and workflow stages support `?work=analytics`, `?project=modeler`, and `?stage=review` links. Fonts and technology SVGs are bundled locally; brand marks are supplied by Simple Icons.

The design brief is in `docs/portfolio/implementation-brief.md`. Reviewed design instructions and their pinned sources are in `.agents/skills/`.

## SEO and the production domain

The canonical URL is `https://nyassar.com/`. `index.html` contains the title, description, canonical link, social metadata, and factual Person structured data. `public/robots.txt` advertises the one-page sitemap. Interactive query links remain usable but canonicalize to the homepage.

Netlify uses `netlify.toml` to build with Node 24, publish `dist`, and permanently redirect the production `nyassar.netlify.app` domain to `nyassar.com`, preserving paths and query parameters. Set `nyassar.com` as the primary domain in Netlify and verify DNS, HTTPS, and the `www` redirect in its dashboard. Deploy Previews use Netlify's automatic `X-Robots-Tag: noindex`; check that header on the preview and that it is absent from production. Branch deploys need separate indexing protection if enabled.

The checked-in 1200 × 630 PNG is generated from `scripts/social-preview.html` with the local Manrope font and favicon. Regenerate after changing its source:

```sh
# Install a Playwright browser, or set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.
node scripts/social-preview.mjs
```

The normal production build uses the checked-in PNG and does not require a browser. For the owner setup checklist, see [docs/portfolio/seo-setup.md](docs/portfolio/seo-setup.md).
