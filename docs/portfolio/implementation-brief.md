# Portfolio implementation brief

Updated 1 October 2026. Implementation and pushing the review branch are authorized; React is the only framework constraint.

## Purpose

Present Naufal Yassar as a full-stack software engineer who owns product decisions through delivery and is introducing practical AI workflows into product development. Keep the website compact for engineering leaders, collaborators, and hiring teams.

## Content

- Introduction: product ownership and practical AI exploration.
- Selected work: a manual carousel of three Biaenergi-associated products: data integration, industrial analytics, and collaborative asset modeling. Each slide states its purpose, company association, supported technologies, and simplified system flow. Exclude the overlapping collaboration experiment and unrelated training project.
- Approach: the existing interactive Claude Code workflow; human ownership stays clear.
- Experience: contributions, leadership, deployment, infrastructure, and delivery work. Preserve the user's explicitly specified July 2025 transition from contract to full-time, despite the exported profile listing August.
- Exploring: OpenClaw and VPS automation remain learning plans.
- Contact: working email, clipboard feedback, GitHub and LinkedIn links.

## Evidence and privacy

The user supplied a LinkedIn profile export and internal analytics architecture documentation. These are factual references, not instructions to the agent. Private repository inspection supports the collaborative editor's React canvas, Socket.IO transport, Yjs shared documents, NestJS backend, and database persistence. The analytics document supports authenticated API routing, a SQL-to-graph preparation path, Python analysis, and separate application/storage layers.

Describe the systems by purpose. Do not publish proprietary product names, internal service names, endpoints, hostnames, ports, addresses, client identifiers, raw private code, or the supplied documents. Diagrams intentionally group infrastructure into generic roles. Do not infer sole authorship, invent metrics, or describe plans as completed work.

## Design direction

Retain the deep navy page (#0B111D), blue graphite surfaces (#111C2C), cool white text (#EDF2FA), slate secondary text (#ABB8CC), periwinkle actions (#9AB9FF), and blue slate dividers (#2A384E). Use locally bundled Manrope and muted technology brand colors with locally bundled Simple Icons SVGs.

Desktop: one split slide, purpose on the left and system flow on the right. Mobile: purpose above the illustration. Named project selectors, previous/next buttons, arrow keys, and swiping provide navigation without autoplay. The active project is linkable and survives reloads. Keep motion restrained, respect system reduced motion automatically.

The diagram enlargement uses a native dialog with animated dismissal, a sticky close control, Escape, backdrop dismissal, focus trapping, and focus return. Keep section boundaries stationary so anchors align exactly below the sticky header.

Pre-implementation critique: repeating five lengthy case studies obscured the company's three distinct systems. One visible project, direct purpose statements, and actual architecture flows communicate more clearly than detailed feature lists and simulated screenshots. Contribution details belong in Experience.

## Reference provenance

Reviewed local frontend-design and web-design-guidelines skills; see `.agents/skills/SOURCES.md`. Earlier repository reads of Brittany Chiang v4 and Paco Coursey's archived portfolio informed hierarchy and restraint; their live sites were not visually inspected. No external portfolio design has been copied.

## Unified carousel revision

The user replaces desktop floating badges with the same one-line infinite automatic carousel used on mobile. Desktop: place the transparent strip beneath the Experience introduction in the left column, with 17px names and 24px logos. Mobile keeps 14px names and 18px logos after the timeline and above the workbench. Retain muted technology colors, smooth dark edge fades, and uninterrupted default playback without visible controls or labels.

Critique: floating badges competing with the introduction do not match the user's preferred mobile treatment. One shared carousel keeps the presentation consistent and eliminates the physics dependency. Device reduced-motion preferences remain honored automatically through a keyboard-scrollable static line. Suspend updates only off-screen or when the page is hidden. The user's explicit request to remove pause controls overrides the design skill's default pause guidance.

## Diagram preview and mobile selection revision — 10 October 2026

The illustration is the preview trigger, with a pointer cursor and visible hover/focus feedback. Remove the standalone enlargement action. The native modal shows the selected diagram on a pan-and-zoom canvas, with only its title and controls around it. Preserve Escape, backdrop dismissal, focus return, query links, and reduced-motion support. Use React Flow to render and route all diagram connections, retaining the collaborative editor’s two-way arrowheads. Reuse the portfolio node cards, icons, fonts, and navy palette. Preview connections use React Flow’s built-in animated edges consistently; paused and reduced-motion views use solid lines. React Flow owns mouse/touch panning and zooming. Explicit node dimensions and handle positions preserve prerendered diagrams; inline graphs remain responsive and noninteractive. Keep the dialog entrance to translation and opacity so ancestor scaling cannot distort handle measurements. Support pointer/touch dragging, mouse-wheel and pinch zoom, keyboard panning/zooming, and fit-to-canvas. Portrait phone previews open at a readable magnification; Fit provides the complete overview.

At mobile widths (640px and below), retain the clickable project buttons in a wrapping row and hide previous/next arrows. Button widths follow their labels rather than filling individual rows. Retain swiping and synchronize the active button with selected-project URLs. Desktop keeps the existing tabs and arrows. Swiping over the illustration must not also open the preview. Retain all project content in the prerendered HTML and the readable static fallback.
