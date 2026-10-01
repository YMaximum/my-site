# Portfolio implementation brief

Prepared 1 October 2026 (Asia/Jakarta). Implementation authorized. React is the only framework constraint; versions, supporting libraries and styling may change.

## Purpose and audience

Present Naufal Yassar as a software engineer who owns the path from a product problem to a usable, tested, deployed result, and is bringing practical AI workflows into product development. Primary audiences are engineering leaders, potential collaborators and hiring teams. Help them understand his contribution, inspect selected work and contact him.

Working positioning: **I build products and improve how teams deliver.**

Draft introduction: “I'm Naufal Yassar, a software engineer who works across product decisions, interfaces, implementation, testing and deployment. I'm now exploring how AI can help product teams work more effectively.”

Treat current AI adoption responsibilities as the user's account, not a verified new job title. The user has corrected the current title to Full-stack Software Engineer and employment type to full-time since July 2025. The earlier Backend Engineer contract ran from August 2024 to July 2025. Do not label him an AI expert, imply model training expertise, or invent time savings.

## Content structure

1. **Introduction.** Name, software engineer role, positioning, concise introduction, “View selected work” anchor and “Email me” link. Top navigation: Work, Approach, Experience, Contact.
2. **Selected work.** Lead with the company data-integration case study in a sanitized form; follow with collaborative diagrams and one additional public project if source inspection supports enough substance. Prioritize the data integration flagship, FQ Analytical, and FQ Modeler; retain the two public projects as supporting work.
3. **How I work with AI.** Explain the user's Claude Code workflow as a real process: brainstorm, plan tickets, implement, review, test, deploy. Describe Naufal's decisions and oversight. This is a workflow diagram, not an invented multi-agent product demo.
4. **Experience.** Use the user-corrected Biaenergi history: full-time Full-stack Software Engineer from July 2025 to present, preceded by the Backend Engineer contract from August 2024 to July 2025. Preserve Sea Labs Indonesia and GoTo Impact Foundation history and dates. Rewrite verbose descriptions for clarity without extending them with guessed accomplishments.
5. **Currently exploring.** OpenClaw for scoped company-resource access and VPS-based daily automation. Explicitly label these as plans or ongoing learning. Do not claim deployed integrations.
6. **Contact.** Existing GitHub, LinkedIn and email links. No claim that Naufal is seeking employment or accepting freelance work without his instruction.

### Project evidence and proposed treatment

| Candidate | What is supported | Treatment |
| --- | --- | --- |
| Enterprise data integration | Authored and merged work spans data catalogs, operator previews, UI usability, installation and deploy configuration | Flagship case study; generalized product description, selected decisions, qualitative outcomes |
| AI-assisted review workflow | Authored and merged change runs Claude review jobs on a self-hosted runner; user describes broader end-to-end AI workflow | Approach section; distinguish repository evidence from self-reported process |
| Collaborative diagrams | Public repository contains a Next.js app using React Flow/Yjs and a NestJS/WebSocket server | Strong public candidate; inspect actual collaboration behavior before writing detailed claims |
| Obatin healthcare platform | Public repository contains frontend/backend, Docker/Nginx setup and a Go/Gin/Postgres backend | Additional candidate; determine personal contribution before claiming sole ownership |
| Alfath consultation site | Public repository uses React, TypeScript, Vite, styled-components and a carousel | Alternative additional project; inspect actual pages before deciding |
| OpenClaw and VPS automation | User's stated plans | Exploring section only |

Public project links:
- https://github.com/YMaximum/simple-diagrams-collaboration
- https://github.com/YMaximum/obatin-healthcare-platform
- https://github.com/YMaximum/fl-alfath-consultation

Each case study should state the problem, Naufal's contribution, one or two consequential decisions, the resulting behavior, and supported technology. Only public repository links go into the public website. Use clearly labeled conceptual system diagrams when real product screenshots are unavailable. Never manufacture screenshots, usage metrics, customer names or public demo URLs.

## Reference research and limits

The managed environment's network policy restricts destinations. LinkedIn remains unavailable under the managed network policy and has not been independently reviewed. The user’s employment corrections and work descriptions are authoritative; accessible GitHub evidence supports the technical details. Live inspiration sites have not been visually reviewed. GitHub connector reads supplied the following actual source references:

- [Brittany Chiang v4](https://github.com/bchiang7/v4): inspected README and featured-project component. Its 12-column layout, deliberate spacing and substantial project descriptions show useful project hierarchy. Use that principle with original composition. Avoid reproducing its code or signature navy/green palette. [Live version](https://v4.brittanychiang.com/).
- [Paco Coursey's archived portfolio](https://github.com/pacocoursey/paco): inspected README, introduction and project page. Useful for concise identity, curated work and restraint. The repository explicitly describes itself as the outdated 2020 site, so it does not establish the current appearance of paco.sh.

Further visual survey candidates, not yet inspected: [Godly](https://godly.website/), [Awwwards](https://www.awwwards.com/), [SiteInspire](https://www.siteinspire.com/), [One Page Love](https://onepagelove.com/), and [Behance](https://www.behance.net/). Do not report these as reviewed evidence or pretend to have seen their current examples.

## Visual direction

**Current direction: a dark, fluid product portfolio.** The user has requested a darker palette, visible geometric movement, smooth interactive transitions, fully working controls, and a native-style case-study dialog with outside-click dismissal and a persistent close button.

Compact tokens:
- Page: deep navy #0B111D.
- Primary surface: blue graphite #111C2C.
- Main text: cool white #EDF2FA.
- Secondary text: slate #ABB8CC.
- Action and focus: periwinkle #9AB9FF.
- Dividers: blue slate #2A384E.
- Type: locally bundled Manrope, retaining the broad headings and readable line lengths.
- Layout: retain the project-led composition, generous spacing and responsive grids. Left alignment makes the work easy to scan.
- Motion: an orchestrated introduction, section arrivals, animated workflow changes, diagram connections, subtle geometric rotation and pointer/scroll parallax. Animate transforms and opacity where possible; pointer movement must not rerender the React tree.
- Include a persistent pause control, honor system reduced motion, and preserve native scrolling and keyboard operation.
- Dialog: native `showModal()` for focus trapping, Escape and focus return; animate enter/exit, dismiss after an outside pointer press and release, retain the content through exit, and use a sticky close header inside the scrolling dialog.

Critique before implementation: a single bright accent on black would flatten the three projects into a generic developer template. Use restrained blue, lilac and teal diagram surfaces to distinguish their subject matter. Geometric movement extends the connections already present in the real workflow diagrams; it must remain behind the readable content and leave every control stable and usable.

### Layout comparison

Recommended, project-led:
```text
[ Naufal Yassar                     Work  Approach  Experience  Contact ]
[ I build products and             Short introduction                  ]
[ improve how teams deliver.       View selected work / Email me       ]
[ Selected work                                                        ]
[ Flagship project: problem + role       Conceptual integration diagram ]
[ Decisions and resulting behavior                                     ]
[ Public project                         Public project                 ]
[ How I work with AI: explain + six-step workflow                       ]
[ Experience                             Currently exploring           ]
[ Contact links                                                        ]
```

Alternative, minimal reading layout:
```text
                 [ Name / introduction ]
                 [ Selected work list   ]
                 [ AI approach          ]
                 [ Experience           ]
                 [ Contact              ]
```

The minimal option is simpler but gives less space to demonstrate product ownership. The recommended option offers stronger case-study hierarchy while keeping the reading path direct.

### Critique against the brief

A generic collection of equal cards would flatten the difference between substantial company work and experiments. A terminal-themed hero would prioritize decoration over product ownership. The revised design uses one flagship section, public work beneath it, and a real six-step workflow. Numbers are appropriate only for that actual sequence. The initial light proposal has been superseded by the user’s explicit preference for a dark, animated design.

## Existing source findings

- Home currently renders only a short about paragraph and experience cards; Projects is not implemented.
- MenuItem is a div with no link or click behavior. Sections have no matching anchor IDs.
- The two-column layout has no responsive breakpoints; the sidebar occupies a full viewport height.
- Mouse movement updates React state on every event solely to drive the background glow.
- The typewriter runs indefinitely without a reduced-motion alternative.
- Social links need clear accessible names; the email icon has no label.
- Font-size and icon-size changes on hover can shift navigation layout.
- Experience rows display a pointer cursor although they have no action.
- Global smooth scrolling needs reduced-motion handling.
- The default Vite favicon remains; metadata is minimal and copyright is hardcoded to 2025.
- The footer component is empty and unused.

These are source-review findings. No browser screenshot audit has been completed.

## Implementation boundaries and file plan

Use React 19, current Vite and TypeScript, plain CSS with semantic component classes, Lucide icons and locally bundled Manrope. Replace the old styled-components, router and typewriter dependencies. React is the user's only framework constraint.

- src/App.tsx: compose the planned sections.
- src/data/: maintain typed project, experience and approach content separately from presentation.
- src/components/: add project illustrations, accessible case-study dialogs, navigation and the AI workflow explorer.
- src/index.css: define the reviewed tokens, typography, layout and focus/motion behavior.
- index.html and public/: replace default branding and improve title/description/social metadata with genuine assets and verified URLs.
- Remove obsolete effect components/dependencies only if the final implementation no longer uses them.

Make case-study details readable with semantic HTML; if expandable disclosures are useful, use native details/summary rather than a new library. No dummy buttons, fake contact form, invented blog feed, or links to unavailable private demos.

## Validation and delivery

Preparation baseline at commit 1c1f1cb:
- npm run build: passed.
- npm run lint: passed.
- Starting Vite preview at 127.0.0.1:4173 returned EPERM in the current execution sandbox. Browser-based verification remains outstanding and should be resolved in the implementation session through the supported execution permissions, not claimed as passed.

After implementation:
1. Run build and lint once changes are complete.
2. Inspect desktop and mobile rendering at approximately 1440px, 768px, 390px and 320px; check overflow, content order and anchor navigation.
3. Check keyboard navigation, focus visibility, accessible link names, contrast and reduced motion.
4. Verify actual public links, project claims and HTML metadata.
5. Review the screenshots against this brief and refine the visual hierarchy.
6. Inspect the final diff for accidental private information, generated output and unrelated changes.
7. Commit and push a feature branch to YMaximum/my-site when the user resumes the implementation-and-push work. Prefer a reviewable PR; attach any created PR to the chat. Do not merge or deploy without authorization for that step.

Read .agents/skills/frontend-design/SKILL.md before implementing, then use .agents/skills/web-design-guidelines/SKILL.md for the review pass.

## Dark theme and interaction verification

The dark theme and motion revision passes the production build, ESLint, formatting, and all 15 Playwright browser tests. Page and dialog accessibility checks cover 1440px, 768px, 390px, and 320px. Desktop and mobile screenshots were inspected.

The browser checks cover animated Escape and browser Back dismissal, outside-click dismissal without mistaking a content drag for a backdrop click, the close button after scrolling to the bottom, all three case-study actions, all six workflow stages on desktop and mobile, every navigation anchor, clipboard success and failure, and persisted motion preferences including live system preference changes. The top anchor was moved from the sticky header to the page root after the new navigation test exposed that bug.

Motion uses CSS and the Web Animations API without another runtime dependency. Browser verification used Chromium; a full cross-browser matrix has not been run. GitHub-hosted checks have previously been blocked by an account billing lock; local verification is complete.


## Section alignment and company work revision

Use one scroll offset matching the sticky header at each breakpoint. Section margins must not add a second offset. Anchor the section boundary immediately below the header, keeping its normal internal spacing. Give the final Contact section enough height to align even near the document end; use the dynamic viewport height for mobile browser chrome. Keep native anchor links, smooth scrolling, reduced-motion behavior, query state, and direct hash URLs.

The user describes FQ Analytical work with pandas, NumPy, and Python statistics libraries; FQ Modeler leadership for a real-time collaborative asset editor; client on-premise deployments; and company on-premise server management. Add these as company work with conceptual illustrations and contribution-specific copy. Current connected company dependency manifests and authored commits corroborate React/Next.js analytics interfaces, NumPy services, data-population filters, chart states, report previews/downloads, and analytical result formatting/error handling, and the modeler’s React Flow, Yjs, Socket.IO/WebSocket and NestJS/TypeScript stack, including canvas presence handling. The Python pandas usage and leadership scope come from the user’s account. The current work’s development branches were checked rather than relying on older default-branch manifests.

Keep company repository URLs, internal paths, client information, and source code out of the public site and documentation. Add no unavailable source-link controls to the company case studies. The current experience lists a supported stack; it does not claim an independently reviewed LinkedIn skills list.
