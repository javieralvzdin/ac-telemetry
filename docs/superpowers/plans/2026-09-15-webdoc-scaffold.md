# AC Telemetry Docs Site Scaffold — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a working Next.js documentation site in `webDoc/` that presents `AcTelemetry.pdf`'s content as navigable pages, with the `LightPillar` (black/dark-red WebGL background) and `ScrollExpand` (showroom.jpg hero) effects wired in, per the approved design spec.

**Architecture:** Next.js 15 App Router + TypeScript app, content authored as MDX files under `content/docs/`, loaded server-side via a small filesystem loader (no CMS/build-plugin). Navigation is driven by one hand-written config (`lib/nav.ts`), not filesystem-derived routing magic, so ordering/grouping stays explicit. Both visual effects are ported verbatim from the provided component specs into typed React components.

**Tech Stack:** Next.js 15, React 18, TypeScript, Tailwind CSS 3, `three` (LightPillar), `fuse.js` (search), `next-mdx-remote` + `gray-matter` (MDX content), Vitest + React Testing Library + jsdom (tests), poppler (`pdftotext`/`pdfimages`, system tool used only by the extraction script).

**Spec:** `docs/superpowers/specs/2026-09-15-webdoc-scaffold-design.md`

## Global Constraints

- Never modify or create files outside `webDoc/` (spec).
- No `git push`, no deploy (spec).
- No invented documentation content — anything not sourced from `AcTelemetry.pdf`, the extracted staging text, or `README.md` is marked `[contenido pendiente]` inline (spec).
- No lossy re-compression of copied images/diagrams (spec).
- Dark-only theme this pass — no light/dark toggle (spec, confirmed by user: "pagina oscura, con practicamente negros y rojos oscuros").
- Package manager: npm (confirmed by user).
- Styling: Tailwind CSS (confirmed by user).
- IA: reorganized by topic, not mirroring the PDF's chapter order (confirmed by user).
- PDF extraction: local `poppler` install, approved by user ("Instala poppler/pdf-parse").
- **New beyond the spec, flagged for visibility:** this plan adds Vitest + React Testing Library + jsdom as dev dependencies to give each task a real automated test cycle, per the writing-plans skill's TDD requirement. These are dev-only, standard, and don't affect the shipped site.

---

## Task 1: Bootstrap the Next.js + TypeScript + Tailwind + Vitest project

**Files:**
- Create: `webDoc/package.json`
- Create: `webDoc/tsconfig.json`
- Create: `webDoc/next.config.mjs`
- Create: `webDoc/next-env.d.ts`
- Create: `webDoc/tailwind.config.ts`
- Create: `webDoc/postcss.config.mjs`
- Create: `webDoc/vitest.config.ts`
- Create: `webDoc/vitest.setup.ts`
- Create: `webDoc/.gitignore`
- Create: `webDoc/app/globals.css`
- Create: `webDoc/app/layout.tsx`
- Create: `webDoc/app/page.tsx`
- Test: `webDoc/tests/setup.test.ts`

**Interfaces:**
- Produces: working `npm run dev` / `npm run build` / `npm test` scripts that every later task relies on. Path alias `@/*` → `webDoc/*`.

- [ ] **Step 1: Write `webDoc/package.json`**

```json
{
  "name": "ac-telemetry-docs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "extract:pdf": "node scripts/extract-pdf.mjs"
  },
  "dependencies": {
    "next": "15.0.3",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "three": "0.167.1",
    "fuse.js": "7.0.0",
    "next-mdx-remote": "5.0.0",
    "gray-matter": "4.0.3"
  },
  "devDependencies": {
    "typescript": "5.5.4",
    "@types/node": "20.14.15",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "@types/three": "0.167.2",
    "tailwindcss": "3.4.10",
    "postcss": "8.4.41",
    "autoprefixer": "10.4.20",
    "eslint": "8.57.0",
    "eslint-config-next": "15.0.3",
    "vitest": "2.0.5",
    "@vitejs/plugin-react": "4.3.1",
    "jsdom": "24.1.1",
    "@testing-library/react": "16.0.0",
    "@testing-library/jest-dom": "6.4.8"
  }
}
```

- [ ] **Step 2: Write `webDoc/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `webDoc/next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Write `webDoc/next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 5: Write `webDoc/tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#0a0a0a',
        foreground: '#f5f5f5',
        muted: '#9a9a9a',
        accent: '#B91C1C',
        'accent-dark': '#7A0C0C',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Write `webDoc/postcss.config.mjs`**

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

- [ ] **Step 7: Write `webDoc/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': __dirname,
    },
  },
});
```

- [ ] **Step 8: Write `webDoc/vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }

  if (!('ResizeObserver' in window)) {
    class ResizeObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    // @ts-expect-error test-only polyfill
    window.ResizeObserver = ResizeObserverMock;
  }
}
```

- [ ] **Step 9: Write `webDoc/.gitignore`**

```
node_modules
.next
.pdf-staging
*.tsbuildinfo
```

- [ ] **Step 10: Write `webDoc/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-background: #050505;
  --color-surface: #0a0a0a;
  --color-foreground: #f5f5f5;
  --color-muted: #9a9a9a;
  --color-accent: #b91c1c;
  --color-accent-dark: #7a0c0c;
}

html,
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
}
```

- [ ] **Step 11: Write `webDoc/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AC Telemetry Docs',
  description: 'Documentation for the Assetto Corsa real-time telemetry pipeline.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 12: Write `webDoc/app/page.tsx`**

```tsx
export default function HomePage() {
  return <main className="p-8">AC Telemetry Docs — coming soon.</main>;
}
```

- [ ] **Step 13: Write the smoke test `webDoc/tests/setup.test.ts`**

```ts
import { describe, it, expect } from 'vitest';

describe('test runner', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 14: Install dependencies**

Run (from `webDoc/`): `npm install`
Expected: installs cleanly, `node_modules/` created, no peer-dependency errors that block install.

- [ ] **Step 15: Run the test suite**

Run: `npm test`
Expected: PASS — `test runner > runs`.

- [ ] **Step 16: Run the production build**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors.

- [ ] **Step 17: Commit**

```bash
git add webDoc/package.json webDoc/tsconfig.json webDoc/next.config.mjs webDoc/next-env.d.ts webDoc/tailwind.config.ts webDoc/postcss.config.mjs webDoc/vitest.config.ts webDoc/vitest.setup.ts webDoc/.gitignore webDoc/app webDoc/tests webDoc/package-lock.json
git commit -m "chore(webdoc): bootstrap Next.js + Tailwind + Vitest scaffold"
```

---

## Task 2: Dark theme tokens

**Files:**
- Modify: `webDoc/tailwind.config.ts` (already has the palette from Task 1 — this task only adds the verifying test)
- Test: `webDoc/tests/theme.test.ts`

**Interfaces:**
- Consumes: `tailwind.config.ts`'s `theme.extend.colors` object from Task 1.
- Produces: nothing new consumed by later tasks — later tasks just use the Tailwind class names (`bg-background`, `text-accent`, etc.) directly.

- [ ] **Step 1: Write the failing test**

```ts
// webDoc/tests/theme.test.ts
import { describe, it, expect } from 'vitest';
import tailwindConfig from '../tailwind.config';

describe('tailwind theme tokens', () => {
  it('defines the Assetto Corsa dark palette', () => {
    const colors = tailwindConfig.theme?.extend?.colors as Record<string, string>;
    expect(colors.background).toBe('#050505');
    expect(colors.surface).toBe('#0a0a0a');
    expect(colors.accent).toBe('#B91C1C');
    expect(colors['accent-dark']).toBe('#7A0C0C');
  });
});
```

- [ ] **Step 2: Run it to confirm it currently passes (tokens already exist from Task 1)**

Run: `npm test -- tests/theme.test.ts`
Expected: PASS (this locks the palette in as a regression test — if it were failing here, Task 1's config would need fixing first).

- [ ] **Step 3: Commit**

```bash
git add webDoc/tests/theme.test.ts
git commit -m "test(webdoc): lock in dark theme token values"
```

---

## Task 3: PDF → staging extraction pipeline

**Files:**
- Create: `webDoc/scripts/extract-pdf.mjs`
- Test: `webDoc/tests/extract-pdf.test.ts`

**Interfaces:**
- Produces: `.pdf-staging/text/full.txt` and `.pdf-staging/images/page-*.*` (gitignored, read by hand in Task 4 — not imported as code by any later task).

- [ ] **Step 1: Write the failing test**

```ts
// webDoc/tests/extract-pdf.test.ts
import { describe, it, expect } from 'vitest';
import { buildExtractionPlan } from '../scripts/extract-pdf.mjs';

describe('buildExtractionPlan', () => {
  it('produces pdftotext and pdfimages commands targeting the staging dir', () => {
    const plan = buildExtractionPlan('/tmp/in.pdf', '/tmp/out');
    expect(plan.commands).toHaveLength(2);
    expect(plan.commands[0]).toEqual({
      cmd: 'pdftotext',
      args: ['-layout', '/tmp/in.pdf', '/tmp/out/text/full.txt'],
    });
    expect(plan.commands[1]).toEqual({
      cmd: 'pdfimages',
      args: ['-all', '/tmp/in.pdf', '/tmp/out/images/page'],
    });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/extract-pdf.test.ts`
Expected: FAIL — `scripts/extract-pdf.mjs` does not exist yet.

- [ ] **Step 3: Write `webDoc/scripts/extract-pdf.mjs`**

```js
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export function buildExtractionPlan(pdfPath, outDir) {
  return {
    textDir: join(outDir, 'text'),
    imagesDir: join(outDir, 'images'),
    commands: [
      { cmd: 'pdftotext', args: ['-layout', pdfPath, join(outDir, 'text', 'full.txt')] },
      { cmd: 'pdfimages', args: ['-all', pdfPath, join(outDir, 'images', 'page')] },
    ],
  };
}

function main() {
  const pdfPath = join(process.cwd(), '..', 'AcTelemetry.pdf');
  const outDir = join(process.cwd(), '.pdf-staging');
  const plan = buildExtractionPlan(pdfPath, outDir);

  mkdirSync(plan.textDir, { recursive: true });
  mkdirSync(plan.imagesDir, { recursive: true });

  for (const { cmd, args } of plan.commands) {
    execFileSync(cmd, args, { stdio: 'inherit' });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/extract-pdf.test.ts`
Expected: PASS.

- [ ] **Step 5: Install poppler on the system**

Run: `winget search poppler`
Pick the resulting package id (a Windows poppler build) and install it, e.g.: `winget install <id-from-search>`. If winget has nothing suitable, fall back to `choco install poppler`.
Confirm: `pdftotext -v` prints a version instead of "command not found".

- [ ] **Step 6: Run the real extraction**

Run (from `webDoc/`): `npm run extract:pdf`
Expected: `.pdf-staging/text/full.txt` and one or more files under `.pdf-staging/images/` exist. Verify with `ls .pdf-staging/text .pdf-staging/images`.

- [ ] **Step 7: Commit**

```bash
git add webDoc/scripts/extract-pdf.mjs webDoc/tests/extract-pdf.test.ts
git commit -m "feat(webdoc): add PDF text/image staging extraction script"
```

(`.pdf-staging/` itself is gitignored from Task 1 and is never committed — it's read by hand in Task 4, then disposable.)

---

## Task 4: Navigation config + IA content authoring

**Files:**
- Create: `webDoc/lib/nav.ts`
- Create: `webDoc/lib/docs.ts`
- Create: `webDoc/content/docs/overview.mdx`
- Create: `webDoc/content/docs/architecture.mdx`
- Create: `webDoc/content/docs/hardware-bridge.mdx`
- Create: `webDoc/content/docs/data-pipeline.mdx`
- Create: `webDoc/content/docs/storage-visualization.mdx`
- Create: `webDoc/content/docs/installation.mdx`
- Create: `webDoc/content/docs/troubleshooting.mdx`
- Test: `webDoc/tests/nav-content-parity.test.ts`

**Interfaces:**
- Produces: `NavPage`, `NavSection` types, `nav: NavSection[]`, `flattenNav()`, `findNavPage(slug)` from `lib/nav.ts`; `getDocSource(slug): { content, frontmatter } | null` and `DocFrontmatter = { title: string; description?: string }` from `lib/docs.ts`. Tasks 5, 6, 9 import these directly.

**Content sourcing rule for this task:** the seven page bodies below are written from `README.md` (already read in full — it covers overview, architecture, prerequisites, install/usage, and troubleshooting almost 1:1 with the PDF's likely structure) so the plan contains real, non-invented text instead of a placeholder. After Task 3's `.pdf-staging/text/full.txt` exists, before marking this task done: read it, and for each page either (a) confirm the PDF says the same thing — no change needed, or (b) the PDF has more/different detail — expand or correct the page body accordingly, or (c) the PDF covers something not listed below — append it under the right page with a new heading. Never delete accurate README-sourced content to make room; add to it. Anything genuinely unclear after reading the PDF text is marked `[contenido pendiente]` inline rather than guessed.

- [ ] **Step 1: Write the failing test**

```ts
// webDoc/tests/nav-content-parity.test.ts
import { describe, it, expect } from 'vitest';
import { flattenNav } from '../lib/nav';
import { getDocSource } from '../lib/docs';

describe('nav/content parity', () => {
  it('every nav entry has a matching content file with a matching title', () => {
    for (const page of flattenNav()) {
      const doc = getDocSource(page.slug);
      expect(doc, `missing content/docs/${page.slug}.mdx`).not.toBeNull();
      expect(doc!.frontmatter.title).toBe(page.title);
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/nav-content-parity.test.ts`
Expected: FAIL — `lib/nav.ts` and `lib/docs.ts` don't exist yet.

- [ ] **Step 3: Write `webDoc/lib/nav.ts`**

```ts
export type NavPage = {
  title: string;
  slug: string;
  description: string;
};

export type NavSection = {
  title: string;
  pages: NavPage[];
};

export const nav: NavSection[] = [
  {
    title: 'Get Started',
    pages: [
      { title: 'Overview', slug: 'overview', description: 'What this project is and how the pieces fit together.' },
      { title: 'Installation & Usage', slug: 'installation', description: 'Get the pipeline running end to end.' },
    ],
  },
  {
    title: 'Architecture',
    pages: [
      { title: 'System Architecture', slug: 'architecture', description: 'The three-layer design: acquisition, processing, storage & visualization.' },
      { title: 'Hardware Bridge (C / UDP)', slug: 'hardware-bridge', description: 'How ac_telemetry.dll talks to Assetto Corsa.' },
      { title: 'Data Pipeline (Python)', slug: 'data-pipeline', description: 'How dashboard.py bridges the DLL to InfluxDB.' },
      { title: 'Storage & Visualization', slug: 'storage-visualization', description: 'InfluxDB and Grafana.' },
    ],
  },
  {
    title: 'Reference',
    pages: [
      { title: 'Troubleshooting', slug: 'troubleshooting', description: 'Common issues and fixes.' },
    ],
  },
];

export function flattenNav(sections: NavSection[] = nav): NavPage[] {
  return sections.flatMap((section) => section.pages);
}

export function findNavPage(slug: string, sections: NavSection[] = nav): NavPage | undefined {
  return flattenNav(sections).find((page) => page.slug === slug);
}
```

- [ ] **Step 4: Write `webDoc/lib/docs.ts`**

```ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'docs');

export type DocFrontmatter = { title: string; description?: string };

export function getDocSource(slug: string): { content: string; frontmatter: DocFrontmatter } | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(raw);
  return { content, frontmatter: data as DocFrontmatter };
}
```

- [ ] **Step 5: Write `webDoc/content/docs/overview.mdx`**

```mdx
---
title: "Overview"
description: "What this project is and how the pieces fit together."
---

AC Telemetry is a real-time telemetry pipeline for Assetto Corsa. It extracts
data directly from the simulator's physics engine using C, processes it via
Python, and visualizes it in real time on a professional Grafana dashboard
using InfluxDB as a time-series database.

The entire database and visualization environment is containerized with
Docker, so it's meant to be plug-and-play once configured.

This project only works locally: Assetto Corsa and the pipeline must run on
the same machine, since the C bridge talks to `127.0.0.1`, not a remote
server.

Where to go next:

- **[System Architecture](/docs/architecture)** — the three layers that make this work.
- **[Installation & Usage](/docs/installation)** — get it running end to end.
- **[Troubleshooting](/docs/troubleshooting)** — fixes for the most common issues.
```

- [ ] **Step 6: Write `webDoc/content/docs/architecture.mdx`**

```mdx
---
title: "System Architecture"
description: "The three-layer design: acquisition, processing, storage & visualization."
---

The system consists of three main layers:

1. **Data acquisition (C)** — a compiled library (`ac_telemetry.dll`)
   communicates via Assetto Corsa's UDP telemetry protocol to extract raw
   telemetry from the game. See [Hardware Bridge](/docs/hardware-bridge).
2. **Processing (Python)** — the `dashboard.py` script acts as a bridge. It
   uses the `ctypes` library to interact with the C DLL, processes variables
   (RPM, gears, steering wheel, etc.), and injects them into the database.
   See [Data Pipeline](/docs/data-pipeline).
3. **Storage and visualization (Docker)** — InfluxDB 2.7 stores data in time
   series with high write frequency, and Grafana reads from InfluxDB and
   displays it on a pre-configured dashboard. See
   [Storage & Visualization](/docs/storage-visualization).

[contenido pendiente: diagrama de arquitectura del PDF, si existe uno, pendiente de incorporar tras la extracción.]
```

- [ ] **Step 7: Write `webDoc/content/docs/hardware-bridge.mdx`**

```mdx
---
title: "Hardware Bridge (C / UDP)"
description: "How ac_telemetry.dll talks to Assetto Corsa."
---

`ac_telemetry.dll` is a compiled C library that reads Assetto Corsa's UDP
telemetry protocol directly from the simulator's physics engine.

It ships precompiled and committed in the repository, so no C compiler is
required to run it — it only works on Windows, since it talks to Assetto
Corsa's local UDP interface.

The Python layer (`dashboard.py`) loads this DLL via Python's `ctypes`
library rather than talking UDP itself; see
[Data Pipeline](/docs/data-pipeline) for how that hand-off works.

[contenido pendiente: detalle del protocolo UDP y de las variables expuestas por el DLL, pendiente de la extracción del PDF.]
```

- [ ] **Step 8: Write `webDoc/content/docs/data-pipeline.mdx`**

```mdx
---
title: "Data Pipeline (Python)"
description: "How dashboard.py bridges the DLL to InfluxDB."
---

`dashboard.py` is the bridge between the C telemetry layer and storage. It
uses Python's `ctypes` library to call into `ac_telemetry.dll`, reads
variables like RPM, gear, and steering angle, and writes them into InfluxDB.

When launched, it asks for **circuito** (circuit) and **coche** (car) —
type them in, or press Enter to skip and get a generic session id instead.
Assetto Corsa's UDP telemetry doesn't expose the track/car name itself, so
this prompt is the only reliable way to label a session in Grafana.

You must be in the car (in the pits or on track) for Assetto Corsa to start
emitting telemetry — otherwise the script has nothing to read.

[contenido pendiente: lista completa de variables procesadas, pendiente de la extracción del PDF.]
```

- [ ] **Step 9: Write `webDoc/content/docs/storage-visualization.mdx`**

```mdx
---
title: "Storage & Visualization"
description: "InfluxDB and Grafana."
---

- **InfluxDB 2.7** stores telemetry in time series with high write
  frequency.
- **Grafana** reads from InfluxDB and displays it on a pre-configured
  dashboard.

Both are provisioned automatically by Docker Compose using the values from
your `.env` file — no manual dashboard setup is needed.

The dashboard is viewable anonymously (read-only) at `http://localhost:3000`
— no login required just to watch it. To edit the dashboard or its config,
log in with the `GRAFANA_ADMIN_USER` / `GRAFANA_ADMIN_PASSWORD` you set in
`.env`.

[contenido pendiente: detalle de los paneles/queries concretos del dashboard, pendiente de la extracción del PDF.]
```

- [ ] **Step 10: Write `webDoc/content/docs/installation.mdx`**

```mdx
---
title: "Installation & Usage"
description: "Get the pipeline running end to end."
---

**Requirements:** Windows, Assetto Corsa, Docker Desktop, Python 3.x. This
project only works locally — Assetto Corsa and this pipeline must run on the
same machine.

1. **Configure your secrets** — copy `.env.example` to `.env` and set your
   own values (InfluxDB token, InfluxDB/Grafana admin passwords). `.env` is
   git-ignored — never commit it.
2. **Stand up the infrastructure** — from the project's root folder, run
   `docker compose up -d`. This downloads and starts InfluxDB and Grafana in
   the background, auto-configured from your `.env` values.
3. **Install Python dependencies** — `pip install -r requirements.txt`.
4. **Hit the track** — open Assetto Corsa (or Content Manager) and enter a
   practice session or race. You must be in the car for the game to start
   emitting telemetry.
5. **Launch the data bridge** — run `python dashboard.py`. It will ask for
   **circuito** and **coche** (press Enter to skip either). If everything
   goes well, you'll see data being sent in the console.

Then open `http://localhost:3000` to view the dashboard immediately — no
Grafana login required.

To shut down: close the Python console (Ctrl+C), then run
`docker compose down` (data and configuration are preserved in local
volumes).
```

- [ ] **Step 11: Write `webDoc/content/docs/troubleshooting.mdx`**

```mdx
---
title: "Troubleshooting"
description: "Common issues and fixes."
---

- **Grafana shows "No data"** — make sure the Python script is running,
  that you're in the car in Assetto Corsa, and that Grafana's time range
  (top right) is set to "Last 5 minutes" with auto-refresh enabled.
- **"Port already allocated" when running `docker compose`** — stop and
  delete old InfluxDB/Grafana containers from Docker Desktop before
  launching new ones.
- **`dashboard.py` exits immediately, missing `INFLUXDB_TOKEN` /
  `INFLUXDB_ORG` / `INFLUXDB_BUCKET`** — you skipped `cp .env.example .env`
  and filling it in.
- **`python dashboard.py` fails to load `ac_telemetry.dll`** — run it from
  the repo root (the script resolves the DLL next to itself), and make sure
  you're on Windows.
- **Session name in Grafana looks like a random id** instead of
  `<circuito>_<coche>_...` — you pressed Enter without typing anything when
  prompted. Re-run `dashboard.py` and fill in circuito/coche.
```

- [ ] **Step 12: Run the test to verify it passes**

Run: `npm test -- tests/nav-content-parity.test.ts`
Expected: PASS.

- [ ] **Step 13: Cross-check against the extracted PDF text**

Open `.pdf-staging/text/full.txt` (from Task 3) and read it fully. For each
page above, apply the sourcing rule described before Step 1: expand/correct
where the PDF has more or different detail, add new headings for anything
the PDF covers that isn't listed, and replace any `[contenido pendiente]`
marker you can now actually answer. Re-run Step 12's test after edits — it
must still pass (titles are unaffected by body edits).

- [ ] **Step 14: Commit**

```bash
git add webDoc/lib/nav.ts webDoc/lib/docs.ts webDoc/content webDoc/tests/nav-content-parity.test.ts
git commit -m "feat(webdoc): add IA nav config and authored docs content"
```

---

## Task 5: Docs routing + Sidebar

**Files:**
- Create: `webDoc/components/docs/Sidebar.tsx`
- Create: `webDoc/components/docs/SidebarNav.tsx`
- Create: `webDoc/app/docs/layout.tsx`
- Create: `webDoc/app/docs/[slug]/page.tsx`
- Test: `webDoc/tests/sidebar.test.tsx`

**Interfaces:**
- Consumes: `NavSection`, `nav`, `flattenNav()` from `lib/nav.ts` (Task 4); `getDocSource(slug)` from `lib/docs.ts` (Task 4).
- Produces: `Sidebar({ nav, pathname })` pure component, reused as-is by Task 6 for layout placement alongside `SearchBox`.

- [ ] **Step 1: Write the failing test**

```tsx
// webDoc/tests/sidebar.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Sidebar } from '../components/docs/Sidebar';
import type { NavSection } from '../lib/nav';

const fixtureNav: NavSection[] = [
  { title: 'Get Started', pages: [{ title: 'Overview', slug: 'overview', description: '' }] },
];

describe('Sidebar', () => {
  it('renders section titles and page links, marking the active one', () => {
    render(<Sidebar nav={fixtureNav} pathname="/docs/overview" />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Overview' });
    expect(link).toHaveAttribute('href', '/docs/overview');
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark a non-matching page as current', () => {
    render(<Sidebar nav={fixtureNav} pathname="/docs/something-else" />);
    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/sidebar.test.tsx`
Expected: FAIL — `components/docs/Sidebar.tsx` doesn't exist yet.

- [ ] **Step 3: Write `webDoc/components/docs/Sidebar.tsx`**

```tsx
import Link from 'next/link';
import type { NavSection } from '@/lib/nav';

export function Sidebar({ nav, pathname }: { nav: NavSection[]; pathname: string }) {
  return (
    <nav aria-label="Documentation" className="flex flex-col gap-6 text-sm">
      {nav.map((section) => (
        <div key={section.title}>
          <p className="mb-2 font-semibold uppercase tracking-wide text-muted">{section.title}</p>
          <ul className="flex flex-col gap-1">
            {section.pages.map((page) => {
              const href = `/docs/${page.slug}`;
              const isActive = pathname === href;
              return (
                <li key={page.slug}>
                  <Link
                    href={href}
                    className={isActive ? 'font-medium text-accent' : 'text-foreground/80 hover:text-foreground'}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {page.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/sidebar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write `webDoc/components/docs/SidebarNav.tsx`**

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { nav } from '@/lib/nav';
import { Sidebar } from './Sidebar';

export function SidebarNav() {
  const pathname = usePathname();
  return <Sidebar nav={nav} pathname={pathname} />;
}
```

- [ ] **Step 6: Write `webDoc/app/docs/layout.tsx`**

```tsx
import { SidebarNav } from '@/components/docs/SidebarNav';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-6 py-10">
      <aside className="w-64 shrink-0">
        <SidebarNav />
      </aside>
      <main className="prose prose-invert min-w-0 flex-1">{children}</main>
    </div>
  );
}
```

- [ ] **Step 7: Write `webDoc/app/docs/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { flattenNav } from '@/lib/nav';
import { getDocSource } from '@/lib/docs';

export function generateStaticParams() {
  return flattenNav().map((page) => ({ slug: page.slug }));
}

export default async function DocPage({ params }: { params: { slug: string } }) {
  const doc = getDocSource(params.slug);
  if (!doc) notFound();

  const { content } = await compileMDX({ source: doc.content });

  return (
    <article>
      <h1>{doc.frontmatter.title}</h1>
      {content}
    </article>
  );
}
```

- [ ] **Step 8: Run the full test suite and the build**

Run: `npm test`
Expected: all suites PASS.

Run: `npm run build`
Expected: succeeds, and the build output lists 7 static `/docs/*` routes (one per `flattenNav()` entry).

- [ ] **Step 9: Commit**

```bash
git add webDoc/components/docs webDoc/app/docs webDoc/tests/sidebar.test.tsx
git commit -m "feat(webdoc): add docs routing, MDX rendering, and sidebar"
```

---

## Task 6: Search

**Files:**
- Create: `webDoc/lib/search.ts`
- Create: `webDoc/components/docs/SearchBox.tsx`
- Modify: `webDoc/app/docs/layout.tsx` (add `<SearchBox />` above the sidebar nav)
- Test: `webDoc/tests/search.test.ts`
- Test: `webDoc/tests/search-box.test.tsx`

**Interfaces:**
- Consumes: `NavPage`, `flattenNav()` from `lib/nav.ts` (Task 4).
- Produces: `buildSearchIndex(pages: NavPage[])`, `searchDocs(index, query): NavPage[]` — not consumed elsewhere in this plan, but kept as the seam for a future search UI change.

- [ ] **Step 1: Write the failing test**

```ts
// webDoc/tests/search.test.ts
import { describe, it, expect } from 'vitest';
import { buildSearchIndex, searchDocs } from '../lib/search';
import type { NavPage } from '../lib/nav';

const pages: NavPage[] = [
  { title: 'Hardware Bridge (C / UDP)', slug: 'hardware-bridge', description: 'How ac_telemetry.dll talks to Assetto Corsa.' },
  { title: 'Troubleshooting', slug: 'troubleshooting', description: 'Common issues and fixes.' },
];

describe('search', () => {
  it('finds a page by a term in its title', () => {
    const index = buildSearchIndex(pages);
    const results = searchDocs(index, 'udp');
    expect(results[0].slug).toBe('hardware-bridge');
  });

  it('returns no results for an empty query', () => {
    const index = buildSearchIndex(pages);
    expect(searchDocs(index, '   ')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/search.test.ts`
Expected: FAIL — `lib/search.ts` doesn't exist yet.

- [ ] **Step 3: Write `webDoc/lib/search.ts`**

```ts
import Fuse from 'fuse.js';
import type { NavPage } from './nav';

export function buildSearchIndex(pages: NavPage[]) {
  return new Fuse(pages, {
    keys: ['title', 'description'],
    threshold: 0.35,
  });
}

export function searchDocs(index: Fuse<NavPage>, query: string): NavPage[] {
  if (!query.trim()) return [];
  return index.search(query).map((result) => result.item);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/search.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing component test**

```tsx
// webDoc/tests/search-box.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SearchBox } from '../components/docs/SearchBox';

describe('SearchBox', () => {
  it('shows a matching result while typing', () => {
    render(<SearchBox />);
    const input = screen.getByLabelText('Search documentation');
    fireEvent.change(input, { target: { value: 'grafana' } });
    expect(screen.getByRole('link', { name: /Storage/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npm test -- tests/search-box.test.tsx`
Expected: FAIL — `components/docs/SearchBox.tsx` doesn't exist yet.

- [ ] **Step 7: Write `webDoc/components/docs/SearchBox.tsx`**

```tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { flattenNav } from '@/lib/nav';
import { buildSearchIndex, searchDocs } from '@/lib/search';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const index = useMemo(() => buildSearchIndex(flattenNav()), []);
  const results = useMemo(() => searchDocs(index, query), [index, query]);

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search docs..."
        aria-label="Search documentation"
        className="w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-foreground"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-white/10 bg-surface shadow-lg">
          {results.map((page) => (
            <li key={page.slug}>
              <Link href={`/docs/${page.slug}`} className="block px-3 py-2 text-sm hover:bg-white/5">
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test -- tests/search-box.test.tsx`
Expected: PASS.

- [ ] **Step 9: Wire `SearchBox` into the docs layout**

Modify `webDoc/app/docs/layout.tsx`'s sidebar column:

```tsx
import { SearchBox } from '@/components/docs/SearchBox';
import { SidebarNav } from '@/components/docs/SidebarNav';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-6 py-10">
      <aside className="w-64 shrink-0 space-y-6">
        <SearchBox />
        <SidebarNav />
      </aside>
      <main className="prose prose-invert min-w-0 flex-1">{children}</main>
    </div>
  );
}
```

- [ ] **Step 10: Run the full suite and build**

Run: `npm test && npm run build`
Expected: all PASS, build succeeds.

- [ ] **Step 11: Commit**

```bash
git add webDoc/lib/search.ts webDoc/components/docs/SearchBox.tsx webDoc/app/docs/layout.tsx webDoc/tests/search.test.ts webDoc/tests/search-box.test.tsx
git commit -m "feat(webdoc): add client-side docs search"
```

---

## Task 7: LightPillar background effect

**Files:**
- Create: `webDoc/components/effects/LightPillar.tsx`
- Create: `webDoc/components/effects/LightPillar.css`
- Modify: `webDoc/app/layout.tsx` (mount `<LightPillar />` as a fixed background)
- Test: `webDoc/tests/light-pillar.test.tsx`

**Interfaces:**
- Produces: `LightPillar` React component, `LightPillarProps` type. Consumed only by `app/layout.tsx` in this plan.

- [ ] **Step 1: Write the failing test**

```tsx
// webDoc/tests/light-pillar.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LightPillar } from '../components/effects/LightPillar';

describe('LightPillar', () => {
  it('degrades gracefully when WebGL is unavailable (jsdom has no WebGL context)', () => {
    render(<LightPillar topColor="#7A0C0C" bottomColor="#000000" />);
    expect(screen.getByText('WebGL not supported')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/light-pillar.test.tsx`
Expected: FAIL — `components/effects/LightPillar.tsx` doesn't exist yet.

- [ ] **Step 3: Write `webDoc/components/effects/LightPillar.tsx`**

This is a TypeScript port of `webDoc/effectsAssets/LightPilar.txt`'s Full Component Source block (same shader/render logic, typed refs and a `LightPillarProps` interface instead of a plain destructured object):

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './LightPillar.css';

export interface LightPillarProps {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  className?: string;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  mixBlendMode?: string;
  pillarRotation?: number;
  quality?: 'low' | 'medium' | 'high';
  lightMode?: boolean;
}

type QualityLevel = 'low' | 'medium' | 'high';

export function LightPillar({
  topColor = '#5227FF',
  bottomColor = '#FF9FFC',
  intensity = 1.0,
  rotationSpeed = 0.3,
  interactive = false,
  className = '',
  glowAmount = 0.005,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  noiseIntensity = 0.5,
  mixBlendMode = 'screen',
  pillarRotation = 0,
  quality = 'high',
  lightMode = false,
}: LightPillarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const timeRef = useRef(0);
  const rotationSpeedRef = useRef(rotationSpeed);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setWebGLSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !webGLSupported) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = isMobile || Boolean(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    let effectiveQuality: QualityLevel = quality;
    if (isLowEndDevice && quality === 'high') effectiveQuality = 'medium';
    if (isMobile && quality !== 'low') effectiveQuality = 'low';

    const qualitySettings: Record<
      QualityLevel,
      { iterations: number; waveIterations: number; pixelRatio: number; precision: 'mediump' | 'highp'; stepMultiplier: number }
    > = {
      low: { iterations: 24, waveIterations: 1, pixelRatio: 0.5, precision: 'mediump', stepMultiplier: 1.5 },
      medium: { iterations: 40, waveIterations: 2, pixelRatio: 0.65, precision: 'mediump', stepMultiplier: 1.2 },
      high: {
        iterations: 80,
        waveIterations: 4,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        precision: 'highp',
        stepMultiplier: 1.0,
      },
    };

    const settings = qualitySettings[effectiveQuality] || qualitySettings.medium;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: effectiveQuality === 'high' ? 'high-performance' : 'low-power',
        precision: settings.precision,
        stencil: false,
        depth: false,
      });
    } catch (error) {
      setWebGLSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(settings.pixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const parseColor = (hex: string) => {
      const color = new THREE.Color(hex);
      return new THREE.Vector3(color.r, color.g, color.b);
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision ${settings.precision} float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uLightMode;
      uniform float uRotCos;
      uniform float uRotSin;
      uniform float uPillarRotCos;
      uniform float uPillarRotSin;
      uniform float uWaveSin;
      uniform float uWaveCos;
      varying vec2 vUv;

      const float STEP_MULT = ${settings.stepMultiplier.toFixed(1)};
      const int MAX_ITER = ${settings.iterations};
      const int WAVE_ITER = ${settings.waveIterations};

      void main() {
        vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
        uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);

        vec3 ro = vec3(0.0, 0.0, -10.0);
        vec3 rd = normalize(vec3(uv, 1.0));

        float rotC = uRotCos;
        float rotS = uRotSin;
        if(uInteractive && (uMouse.x != 0.0 || uMouse.y != 0.0)) {
          float a = uMouse.x * 6.283185;
          rotC = cos(a);
          rotS = sin(a);
        }

        vec3 col = vec3(0.0);
        float t = 0.1;

        for(int i = 0; i < MAX_ITER; i++) {
          vec3 p = ro + rd * t;
          p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);

          vec3 q = p;
          q.y = p.y * uPillarHeight + uTime;

          float freq = 1.0;
          float amp = 1.0;
          for(int j = 0; j < WAVE_ITER; j++) {
            q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
            q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
            freq *= 2.0;
            amp *= 0.5;
          }

          float d = length(cos(q.xz)) - 0.2;
          float bound = length(p.xz) - uPillarWidth;
          float k = 4.0;
          float h = max(k - abs(d - bound), 0.0);
          d = max(d, bound) + h * h * 0.0625 / k;
          d = abs(d) * 0.15 + 0.01;

          float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
          col += mix(uBottomColor, uTopColor, grad) / d;

          t += d * STEP_MULT;
          if(t > 50.0) break;
        }

        float widthNorm = uPillarWidth / 3.0;
        col = tanh(col * uGlowAmount / widthNorm);

        col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;

        vec3 result = clamp(col * uIntensity, 0.0, 1.0);
        if (uLightMode > 0.5) {
          float energy = max(result.r, max(result.g, result.b));
          vec3 hue = result / max(energy, 0.001);
          float coverage = smoothstep(0.025, 0.95, energy);
          hue = pow(clamp(hue, 0.0, 1.0), vec3(1.25));
          result = mix(vec3(1.0), hue, coverage * 0.94);
        }
        gl_FragColor = vec4(result, 1.0);
      }
    `;

    const pillarRotRad = (pillarRotation * Math.PI) / 180;
    const waveSin = Math.sin(0.4);
    const waveCos = Math.cos(0.4);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: mouseRef.current },
        uTopColor: { value: parseColor(topColor) },
        uBottomColor: { value: parseColor(bottomColor) },
        uIntensity: { value: intensity },
        uInteractive: { value: interactive },
        uGlowAmount: { value: glowAmount },
        uPillarWidth: { value: pillarWidth },
        uPillarHeight: { value: pillarHeight },
        uNoiseIntensity: { value: noiseIntensity },
        uLightMode: { value: lightMode ? 1 : 0 },
        uRotCos: { value: 1.0 },
        uRotSin: { value: 0.0 },
        uPillarRotCos: { value: Math.cos(pillarRotRad) },
        uPillarRotSin: { value: Math.sin(pillarRotRad) },
        uWaveSin: { value: waveSin },
        uWaveCos: { value: waveCos },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    geometryRef.current = geometry;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let mouseMoveTimeout: number | null = null;
    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      if (mouseMoveTimeout) return;
      mouseMoveTimeout = window.setTimeout(() => {
        mouseMoveTimeout = null;
      }, 16);
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.set(x, y);
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    let lastTime = performance.now();
    const targetFPS = effectiveQuality === 'low' ? 30 : 60;
    const frameTime = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (!materialRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameTime) {
        timeRef.current += 0.016 * rotationSpeedRef.current;
        const t = timeRef.current;
        materialRef.current.uniforms.uTime.value = t;
        materialRef.current.uniforms.uRotCos.value = Math.cos(t * 0.3);
        materialRef.current.uniforms.uRotSin.value = Math.sin(t * 0.3);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        lastTime = currentTime - (deltaTime % frameTime);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = window.setTimeout(() => {
        if (!rendererRef.current || !materialRef.current || !containerRef.current) return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        rendererRef.current.setSize(newWidth, newHeight);
        materialRef.current.uniforms.uResolution.value.set(newWidth, newHeight);
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
      if (materialRef.current) materialRef.current.dispose();
      if (geometryRef.current) geometryRef.current.dispose();

      rendererRef.current = null;
      materialRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      geometryRef.current = null;
      rafRef.current = null;
    };
  }, [webGLSupported, quality]);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    if (!materialRef.current) return;
    const parseColor = (hex: string) => {
      const color = new THREE.Color(hex);
      return new THREE.Vector3(color.r, color.g, color.b);
    };
    materialRef.current.uniforms.uTopColor.value = parseColor(topColor);
  }, [topColor]);

  useEffect(() => {
    if (!materialRef.current) return;
    const parseColor = (hex: string) => {
      const color = new THREE.Color(hex);
      return new THREE.Vector3(color.r, color.g, color.b);
    };
    materialRef.current.uniforms.uBottomColor.value = parseColor(bottomColor);
  }, [bottomColor]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uIntensity.value = intensity;
  }, [intensity]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uInteractive.value = interactive;
  }, [interactive]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uGlowAmount.value = glowAmount;
  }, [glowAmount]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uPillarWidth.value = pillarWidth;
  }, [pillarWidth]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uPillarHeight.value = pillarHeight;
  }, [pillarHeight]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uNoiseIntensity.value = noiseIntensity;
  }, [noiseIntensity]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uLightMode.value = lightMode ? 1 : 0;
  }, [lightMode]);

  useEffect(() => {
    if (!materialRef.current) return;
    const pillarRotRad = (pillarRotation * Math.PI) / 180;
    materialRef.current.uniforms.uPillarRotCos.value = Math.cos(pillarRotRad);
    materialRef.current.uniforms.uPillarRotSin.value = Math.sin(pillarRotRad);
  }, [pillarRotation]);

  if (!webGLSupported) {
    return (
      <div className={`light-pillar-fallback ${className}`} style={{ mixBlendMode }}>
        WebGL not supported
      </div>
    );
  }

  return <div ref={containerRef} className={`light-pillar-container ${className}`} style={{ mixBlendMode }} />;
}
```

Copy the `### Component CSS` block from `webDoc/effectsAssets/LightPilar.txt` verbatim into `webDoc/components/effects/LightPillar.css` (`.light-pillar-fallback` and `.light-pillar-container` rules).

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/light-pillar.test.tsx`
Expected: PASS (jsdom's `canvas.getContext('webgl')` returns `null`, so `webGLSupported` becomes `false` and the fallback renders — this is the real degrade-gracefully path, not a mock).

- [ ] **Step 5: Mount it as the page background in `webDoc/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { LightPillar } from '@/components/effects/LightPillar';
import './globals.css';

export const metadata: Metadata = {
  title: 'AC Telemetry Docs',
  description: 'Documentation for the Assetto Corsa real-time telemetry pipeline.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="pointer-events-none fixed inset-0 -z-10">
          <LightPillar
            topColor="#7A0C0C"
            bottomColor="#000000"
            intensity={0.6}
            glowAmount={0.003}
            interactive={false}
            quality="high"
            className="h-full w-full"
          />
        </div>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Run the full suite and build**

Run: `npm test && npm run build`
Expected: all PASS, build succeeds.

- [ ] **Step 7: Commit**

```bash
git add webDoc/components/effects/LightPillar.tsx webDoc/components/effects/LightPillar.css webDoc/app/layout.tsx webDoc/tests/light-pillar.test.tsx
git commit -m "feat(webdoc): add LightPillar background effect"
```

---

## Task 8: ScrollExpand hero + landing page

**Files:**
- Create: `webDoc/components/effects/ScrollExpand.tsx`
- Create: `webDoc/components/effects/ScrollExpand.css`
- Create: `webDoc/public/docs-assets/showroom.jpg` (copied, not re-encoded)
- Modify: `webDoc/app/page.tsx`
- Test: `webDoc/tests/scroll-expand.test.ts`
- Test: `webDoc/tests/scroll-expand-render.test.tsx`

**Interfaces:**
- Produces: `ScrollExpand` component, `ScrollExpandProps` type, exported pure helpers `clamp`, `smoothstep`. Consumed only by `app/page.tsx` in this plan.
- Consumes: nothing from earlier tasks (self-contained effect).

- [ ] **Step 1: Write the failing pure-function test**

```ts
// webDoc/tests/scroll-expand.test.ts
import { describe, it, expect } from 'vitest';
import { clamp, smoothstep } from '../components/effects/ScrollExpand';

describe('clamp', () => {
  it('clamps values into range', () => {
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(2, 0, 1)).toBe(1);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });
});

describe('smoothstep', () => {
  it('returns 0 and 1 at the edges', () => {
    expect(smoothstep(0, 1, 0)).toBe(0);
    expect(smoothstep(0, 1, 1)).toBe(1);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/scroll-expand.test.ts`
Expected: FAIL — `components/effects/ScrollExpand.tsx` doesn't exist yet.

- [ ] **Step 3: Write `webDoc/components/effects/ScrollExpand.tsx`**

Open `webDoc/effectsAssets/ScrollExpand.txt` and take the `### Full Component Source` code block as the base. Create this file with:

```tsx
'use client';

import { useCallback, useEffect, useRef } from 'react';
import './ScrollExpand.css';

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

export interface ScrollExpandProps {
  src?: string;
  mediaType?: 'image' | 'video';
  poster?: string;
  alt?: string;
  title?: string;
  scrollHint?: string;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  useWindowScroll?: boolean;
  enabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollExpand({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}: ScrollExpandProps) {
  // ...refs (rootRef, trackRef, stageRef, frameRef, mediaRef, titleRef,
  // overlayRef, scrimRef, hintRef, propsRef), the `applyProgress` callback,
  // the scroll-tracking `useEffect`, and the final JSX (the
  // scroll-expand/track/stage/frame/media/scrim/title/hint tree) are copied
  // unchanged from `webDoc/effectsAssets/ScrollExpand.txt`'s Full Component
  // Source block — only the two pure helpers and the props signature above
  // change for TypeScript.
}
```

3. Copy the `### Component CSS` block from `ScrollExpand.txt` verbatim into `webDoc/components/effects/ScrollExpand.css`.

- [ ] **Step 4: Run the pure-function test to verify it passes**

Run: `npm test -- tests/scroll-expand.test.ts`
Expected: PASS.

- [ ] **Step 5: Copy the hero image**

Run: `cp "C:\Users\Javi\Documents\ProyectosMios\fotosACtelemetry\showroom.jpg" "C:\Users\Javi\Documents\ProyectosMios\ac-telemetry\webDoc\public\docs-assets\showroom.jpg"`
(create the `public/docs-assets/` directory first if it doesn't exist yet: `mkdir -p webDoc/public/docs-assets`)
Verify: the copied file's byte size matches the source exactly (no re-encoding).

- [ ] **Step 6: Write the failing render test**

```tsx
// webDoc/tests/scroll-expand-render.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScrollExpand } from '../components/effects/ScrollExpand';

describe('ScrollExpand', () => {
  it('renders the media and title', () => {
    render(
      <ScrollExpand src="/docs-assets/showroom.jpg" alt="Showroom" title="AC Telemetry" useWindowScroll />
    );
    const img = screen.getByAltText('Showroom') as HTMLImageElement;
    expect(img.src).toContain('/docs-assets/showroom.jpg');
    expect(screen.getByText('AC Telemetry')).toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Run it to verify it fails, then implement until it passes**

Run: `npm test -- tests/scroll-expand-render.test.tsx`
Expected first: FAIL (if Step 3's port is incomplete) or PASS (if it's already a faithful, complete port). If it fails, compare against `ScrollExpand.txt` line by line and finish copying the missing JSX/logic, then re-run.
Expected after fixing: PASS.

- [ ] **Step 8: Replace `webDoc/app/page.tsx` with the real landing page**

```tsx
import Link from 'next/link';
import { ScrollExpand } from '@/components/effects/ScrollExpand';

export default function HomePage() {
  return (
    <main>
      <ScrollExpand
        src="/docs-assets/showroom.jpg"
        alt="Assetto Corsa showroom"
        title="AC Telemetry"
        scrollHint="Scroll"
        useWindowScroll
      >
        <p className="max-w-xl text-lg text-foreground/80">
          Real-time telemetry pipeline for Assetto Corsa — from the sim to a live Grafana dashboard.
        </p>
        <Link
          href="/docs/overview"
          className="mt-6 inline-block rounded-md bg-accent px-5 py-2 font-medium text-white"
        >
          Read the docs
        </Link>
      </ScrollExpand>
    </main>
  );
}
```

- [ ] **Step 9: Run the full suite and build**

Run: `npm test && npm run build`
Expected: all PASS, build succeeds.

- [ ] **Step 10: Commit**

```bash
git add webDoc/components/effects/ScrollExpand.tsx webDoc/components/effects/ScrollExpand.css webDoc/public/docs-assets/showroom.jpg webDoc/app/page.tsx webDoc/tests/scroll-expand.test.ts webDoc/tests/scroll-expand-render.test.tsx
git commit -m "feat(webdoc): add ScrollExpand hero and landing page"
```

---

## Task 9: Final integration & verification pass

**Files:**
- Create: `webDoc/tests/content-images.test.ts`

**Interfaces:**
- Consumes: `flattenNav()` and `getDocSource(slug)` from Task 4.

- [ ] **Step 1: Write the content-image integrity test**

```ts
// webDoc/tests/content-images.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { flattenNav } from '../lib/nav';
import { getDocSource } from '../lib/docs';

function extractImagePaths(mdx: string): string[] {
  return [...mdx.matchAll(/!\[[^\]]*\]\((\/docs-assets\/[^)]+)\)/g)].map((m) => m[1]);
}

describe('content image references', () => {
  it('every referenced docs-asset image exists in public/docs-assets', () => {
    for (const page of flattenNav()) {
      const doc = getDocSource(page.slug)!;
      for (const imagePath of extractImagePaths(doc.content)) {
        const abs = path.join(process.cwd(), 'public', imagePath);
        expect(fs.existsSync(abs), `missing image ${imagePath} referenced in ${page.slug}.mdx`).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 2: Run it**

Run: `npm test -- tests/content-images.test.ts`
Expected: PASS (there are no `![...](/docs-assets/...)` references yet unless Task 4's Step 13 cross-check added figures from the PDF — either way, the test must pass; if it doesn't, either fix the missing image or fix the MDX reference).

- [ ] **Step 3: Run the entire test suite**

Run: `npm test`
Expected: every suite from Tasks 1–9 PASSes.

- [ ] **Step 4: Run the build and lint**

Run: `npm run build`
Expected: succeeds, no type errors, static `/docs/*` routes listed for all 7 pages.

Run: `npm run lint`
Expected: no errors (warnings are acceptable for this pass).

- [ ] **Step 5: Manual browser check**

Run: `npm run dev`, open `http://localhost:3000`, and confirm:
- The `LightPillar` black/dark-red background is visible behind the hero and doesn't block scrolling or interaction.
- The `ScrollExpand` hero starts small and expands to full-bleed as you scroll, with the "AC Telemetry" title fading out as it does.
- Clicking "Read the docs" lands on `/docs/overview`.
- All 7 sidebar links navigate to their pages and highlight the active one.
- Typing in the search box (e.g. "grafana") surfaces a matching result.
- The overall palette reads as near-black with dark red accents, no light-mode leakage.

- [ ] **Step 6: Confirm the parent repo wasn't touched**

Run (from the `ac-telemetry` repo root): `git status`
Expected: the only changes are inside `webDoc/` and the two files under `docs/superpowers/` from the brainstorming/planning phase — nothing in `app.py`-equivalent files, `docker-compose.yml`, `ac_telemetry.c`, `.env*`, `grafana/`, or `README.md` was modified.

- [ ] **Step 7: Commit**

```bash
git add webDoc/tests/content-images.test.ts
git commit -m "test(webdoc): add content/image integrity check and close out scaffold pass"
```
