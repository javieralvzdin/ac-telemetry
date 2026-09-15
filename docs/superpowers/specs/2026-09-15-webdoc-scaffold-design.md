# AC Telemetry Docs Site — Scaffold Design

Date: 2026-09-15
Location of implementation: `webDoc/` (new, isolated from the rest of the `ac-telemetry` repo)

## Goal

Turn `AcTelemetry.pdf` (source documentation for the Assetto Corsa real-time
telemetry pipeline) into a browsable, professional documentation website
(Next.js), living entirely inside `webDoc/`, without touching any existing
code, config, or logic in the parent repo.

This first pass optimizes for **correct scaffolding**: working navigation,
working content pipeline, working effects wiring. Visual/aesthetic polish is
explicitly deferred to a follow-up pass.

## Non-goals (this pass)

- Pixel-perfect visual design / final art direction.
- Light mode / theme toggle (site is dark-only for now).
- Full-text fuzzy search relevance tuning (a working simple search is enough).
- Deployment, hosting, or CI setup.
- Automatic MDX generation directly from raw PDF text extraction (see Content
  pipeline — extraction is a manual-assisted step, not templated codegen).

## Constraints (carried over from user instructions)

- Never modify files outside `webDoc/`.
- No `git push`, no deploy.
- No invented content — anything not present in the PDF or in
  `fotosACtelemetry/` is marked `[contenido pendiente]` rather than filled in.
- No lossy compression of diagrams/screenshots that would hurt legibility.
- Stop and ask before installing any non-trivial new dependency (the
  dependency list below has already been approved by the user; anything
  beyond it needs a fresh confirmation).

## Stack

- Next.js 15, App Router, TypeScript
- Tailwind CSS
- npm (package manager)
- `three` (required by the `LightPillar` effect)
- `fuse.js` (lightweight client-side search over doc headings/frontmatter)
- System dependency: `poppler` (`pdftotext` + `pdfimages`), installed via
  winget/choco, used once by a local extraction script — not a runtime
  dependency of the site itself.

## Content pipeline

1. Run `poppler`'s `pdftotext -layout` and `pdfimages -all` against
   `AcTelemetry.pdf` into a scratch/staging folder (outside `public/`, not
   committed) to get raw text per page and every embedded raster image.
2. Manually read the extracted text and map it to a topic-based information
   architecture (see IA below) — this is authored by hand, not templated,
   specifically to avoid garbled reading order or invented structure that a
   naive PDF→MDX converter would introduce.
3. For each resulting doc page, write real MDX content sourced only from the
   extracted text. Anything ambiguous or missing is marked
   `[contenido pendiente]` inline rather than guessed.
4. Cross-reference extracted images against page content; copy the relevant
   ones (renamed descriptively) into `public/docs-assets/`, plus the
   `showroom.jpg` and any other relevant file from
   `C:\Users\Javi\Documents\ProyectosMios\fotosACtelemetry` needed for the
   hero or inline figures. Images are copied at original resolution/quality —
   no re-compression.
5. The staging/extraction output itself is not committed; only the final
   curated MDX + copied images are.

## Information architecture

Reorganized by topic rather than mirroring the PDF's own chapter order
(confirmed with user). Expected top-level sections, to be finalized once the
extracted text is in hand — any section below not actually covered by the PDF
content is marked `[contenido pendiente]` rather than invented:

- Overview
- Architecture (3-layer: acquisition / processing / storage+viz)
- Hardware bridge (C / UDP telemetry protocol)
- Data pipeline (Python / `dashboard.py`)
- Storage & visualization (InfluxDB + Grafana)
- Installation & usage
- Troubleshooting

Sidebar navigation is driven by a single manually authored config
(`lib/nav.ts`), not filesystem-derived magic routing — keeps ordering and
grouping explicit and easy to edit by hand later.

## Folder structure (inside `webDoc/`)

```
webDoc/
  app/
    layout.tsx          # root layout: dark theme tokens, mounts <LightPillar/>
    page.tsx             # landing page, hero <ScrollExpand/>
    docs/
      layout.tsx          # sidebar + search + content shell
      [...slug]/page.tsx  # renders the matching content/docs/**/*.mdx
  content/
    docs/
      <section>/<page>.mdx
  components/
    effects/
      LightPillar.tsx + LightPillar.css   # from webDoc/effectsAssets/LightPilar.txt
      ScrollExpand.tsx + ScrollExpand.css # from webDoc/effectsAssets/ScrollExpand.txt
    docs/
      Sidebar.tsx
      SearchBox.tsx
      MDXComponents.tsx
  lib/
    nav.ts               # manual sidebar/IA config
  public/
    docs-assets/          # curated images copied from PDF + fotosACtelemetry
  scripts/
    extract-pdf.mjs        # one-off: shells out to pdftotext/pdfimages
  effectsAssets/            # existing, source prompts — left as-is
```

## Effects integration

**LightPillar** (from `webDoc/effectsAssets/LightPilar.txt`, Three.js-based):
mounted once in `app/layout.tsx` as a fixed, full-viewport background layer
behind all content (`position: fixed; inset: 0; z-index: -1`). Props:
`topColor="#7A0C0C"`, `bottomColor="#000000"`, `intensity` and `glowAmount`
kept low so body text stays legible over it; `interactive={false}`;
`quality="high"` (component already auto-downgrades on mobile/low-end
devices per its own logic).

**ScrollExpand** (from `webDoc/effectsAssets/ScrollExpand.txt`): used only on
the landing page hero, `src` pointing at a copy of
`fotosACtelemetry/showroom.jpg` in `public/docs-assets/`, with the project
title as the `title` overlay prop. Starts small/contracted, expands via
`clip-path` as the user scrolls past the hero, per the component's existing
scroll-progress logic — no changes to the component's internal behavior in
this pass.

Both components are dropped in verbatim from the provided specs (adjusted
only for TypeScript prop types and import paths), not redesigned.

## Theming

Dark-only palette defined as CSS variables in `globals.css` and mapped into
`tailwind.config.ts`: near-black backgrounds (`#050505`/`#0a0a0a`), dark red
accents (`#7A0C0C`/`#B91C1C`) matching the Assetto Corsa mark. No light theme
in this pass; tokens are structured so a future light variant is additive,
not a rewrite.

## Error handling / edge cases

- Missing/ambiguous PDF content for a planned section → page ships with
  `[contenido pendiente]` marker, never invented text.
- `LightPillar` reports `webGLSupported = false` on a given browser → the
  component already renders nothing gracefully; no extra handling needed.
- PDF extraction script is a one-off dev-time tool, not part of the Next.js
  build — its failure blocks content authoring, not the app running.

## Verification (before calling any phase done)

- `npm run dev` boots without errors.
- Every planned IA section has a corresponding page reachable from the
  sidebar (even if partially `[contenido pendiente]`).
- Every image referenced in curated MDX actually resolves under
  `public/docs-assets/`.
- Hero `ScrollExpand` and background `LightPillar` both render and don't
  break page scroll or make body text unreadable.
- No file outside `webDoc/` was modified (`git status` at repo root scoped to
  confirm).

## Checkpoints (per user's original request)

1. ✅ PDF/image extraction (staging text + curated images copied into
   `public/docs-assets/`)
2. ✅ Page/route structure + navigation (sidebar, IA, MDX rendering pipeline)
3. ✅ Effects + base styling (LightPillar background, ScrollExpand hero, dark
   token theme applied)
4. ✅ Final integration pass (cross-check all sections present, all images
   placed, `npm run dev` clean)
