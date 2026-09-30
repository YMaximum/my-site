# Portfolio implementation brief

Prepared 1 October 2026 (Asia/Jakarta). Implementation authorized. React is the only framework constraint; versions, supporting libraries and styling may change.

## Purpose and audience

Present Naufal Yassar as a software engineer who owns the path from a product problem to a usable, tested, deployed result, and is bringing practical AI workflows into product development. Primary audiences are engineering leaders, potential collaborators and hiring teams. Help them understand his contribution, inspect selected work and contact him.

Working positioning: **I build products and improve how teams deliver.**

Draft introduction: “I'm Naufal Yassar, a software engineer who works across product decisions, interfaces, implementation, testing and deployment. I'm now exploring how AI can help product teams work more effectively.”

Treat current AI adoption responsibilities as the user's account, not a verified new job title. Keep the existing Backend Engineer employment title until updated by evidence or the user. Do not label him an AI expert, imply model training expertise, or invent time savings.

## Content structure

1. **Introduction.** Name, software engineer role, positioning, concise introduction, “View selected work” anchor and “Email me” link. Top navigation: Work, Approach, Experience, Contact.
2. **Selected work.** Lead with the company data-integration case study in a sanitized form; follow with collaborative diagrams and one additional public project if source inspection supports enough substance. Prefer three substantial projects over every exercise repository.
3. **How I work with AI.** Explain the user's Claude Code workflow as a real process: brainstorm, plan tickets, implement, review, test, deploy. Describe Naufal's decisions and oversight. This is a workflow diagram, not an invented multi-agent product demo.
4. **Experience.** Preserve the existing Biaenergi, Sea Labs Indonesia and GoTo Impact Foundation history and dates. Rewrite verbose descriptions for clarity without extending them with guessed accomplishments.
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

The managed environment's network policy restricts destinations. LinkedIn and live inspiration sites have not been visually reviewed. GitHub connector reads supplied the following actual source references:

- [Brittany Chiang v4](https://github.com/bchiang7/v4): inspected README and featured-project component. Its 12-column layout, deliberate spacing and substantial project descriptions show useful project hierarchy. Use that principle with original composition. Avoid reproducing its code or signature navy/green palette. [Live version](https://v4.brittanychiang.com/).
- [Paco Coursey's archived portfolio](https://github.com/pacocoursey/paco): inspected README, introduction and project page. Useful for concise identity, curated work and restraint. The repository explicitly describes itself as the outdated 2020 site, so it does not establish the current appearance of paco.sh.

Further visual survey candidates, not yet inspected: [Godly](https://godly.website/), [Awwwards](https://www.awwwards.com/), [SiteInspire](https://www.siteinspire.com/), [One Page Love](https://onepagelove.com/), and [Behance](https://www.behance.net/). Do not report these as reviewed evidence or pretend to have seen their current examples.

## Visual direction

**Recommended: a clear, light product portfolio.** Use broad, left-aligned typography and generous spacing. Let the flagship project's conceptual data flow and the AI workflow be the memorable visual elements. Product problems and decisions supply the character.

Compact tokens:
- Page: cloud #F6F8FB.
- Primary surface: white #FFFFFF.
- Main text: ink #182338.
- Secondary text: slate #52627A.
- Action and focus: cobalt #2454C6.
- Dividers: mist #DCE3ED. Dividers are decorative, not the only indicator of a control's boundary.
- Verify actual text and control contrast during implementation; these are design intentions, not completed accessibility checks.
- Type: Manrope for headings, chosen for a broad, legible contemporary voice; body uses a readable system sans stack. Self-host Manrope only if the font can be obtained through an authorized source; use a strong system fallback without blocking content.
- Scale: heading 64–72px desktop / 36–42px mobile; section heading 32–40px / 28px; body 17–18px with line-height around 1.6. Keep body copy near 65 characters per line.
- Layout: maximum width about 1180px, 24px mobile gutters, 80–112px between large desktop sections and 48–64px on mobile.
- Use restrained 8–12px radii for diagrams and genuine grouped surfaces. Avoid putting every paragraph into an identical card.
- No automatic typewriter loop or cursor-tracking glow. Use short user-triggered transitions and respect reduced motion.
- Maintain stable geometry on hover. Every actionable element gets a visible keyboard focus state.

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

A generic collection of equal cards would flatten the difference between substantial company work and experiments. A terminal-themed hero would prioritize decoration over product ownership. The revised design uses one flagship section, public work beneath it, and a real six-step workflow. Numbers are appropriate only for that actual sequence. The light palette is a proposal, not a stated user preference; the user can steer it before or during implementation.

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
