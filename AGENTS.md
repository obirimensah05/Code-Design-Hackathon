<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AGENTS.md — Prompt University

Guide for AI agents or humans continuing this codebase. Facts, not fluff.

## What this is

A Next.js 16 + React 19 + Tailwind v4 static site, deployed to GitHub Pages. MVP prototype of a peer-to-peer AI learning platform. See [BRIEF.md](BRIEF.md) for product context.

## What this is not

- Not server-rendered. Not server-anything.
- Not routed via URLs (yet). Internal `route` state in `app/components/app.jsx`.
- Not backed by a database. Data is static in `app/components/data.jsx`.
- Not multi-user. Single-profile demo.

---

## Commands

```bash
npm install          # install deps (or `npm ci` on fresh checkout)
npm run dev          # start dev on http://localhost:3333
npm run build        # production build -> out/  (static export)
npm run lint         # eslint
```

Build runs in CI on every push to `main`: `.github/workflows/deploy.yml` publishes to GitHub Pages.

---

## Code map

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full map. TL;DR:

- `app/page.tsx` — one-line client entry, dynamic-imports App with `{ ssr: false }`
- `app/components/app.jsx` — the whole app. State, routing, edit-mode protocol.
- `app/components/*.jsx` — per-screen modules
- `app/globals.css` — ~2000 lines: design tokens + component styles + responsive overrides
- `prototype/` — the original Claude Design handoff. **Do not modify.**
- `skills/` — local archive of design skills (interfaces-that-feel, impeccable/*, etc.). Reference.

---

## Conventions

### Every component file
```jsx
'use client';
import React from 'react';
import { PV_DATA } from './data';
import { Icon } from './atoms';

const { useState, useEffect, useMemo } = React;

function MyComponent() {
  const D = PV_DATA;
  // ...
}

export { MyComponent };
```

`'use client'` is mandatory. `const D = PV_DATA` at the top of function bodies is a convention carried from the prototype.

### Styling
- Use design tokens from `globals.css` (`var(--fg)`, `var(--accent)`, `var(--radius)`, …).
- Don't add Tailwind utilities except trivial layout (`flex`, `gap-*`).
- New component styles go at the end of `globals.css`. Do not introduce CSS modules.

### Interactive elements
- Styled divs that take clicks: `<div role="button" tabIndex={0} onClick onKeyDown>`.
- Keyboard support is non-negotiable. See `handleKey` pattern in `atoms.jsx > TopNav`.
- Active nav items: `aria-current="page"`.
- Toasts: `role="status" aria-live="polite"` on the container.

### Naming
- Internal identifiers keep the `pv_` / `PV_` / `__PV_` prefix. Don't rename.
- User-facing name: **Prompt University**. Never "PromptVault" (legacy).

---

## State persistence

All in localStorage, prefixed `pv_`. See [ARCHITECTURE.md](ARCHITECTURE.md) for the full table. Adding new persisted state? Follow the pattern in `app.jsx`:

```jsx
const [thing, setThing] = useState(() => {
  try { return JSON.parse(localStorage.getItem("pv_thing") || "null"); }
  catch { return null; }
});
useEffect(() => { localStorage.setItem("pv_thing", JSON.stringify(thing)); }, [thing]);
```

---

## Tweaks panel

`app/components/tweaks.jsx`. Five controls: theme, accentHue, homeVariant, gamification, roleLens.

- **Persistent** — renders on every page. Not dismissable.
- Posts to parent via `window.parent.postMessage({ type: "__edit_mode_set_keys", edits: next }, "*")` — used by the Claude Design host.
- Defaults in `DEFAULT_TWEAKS` at top of `app.jsx`.

---

## Adding a new route

1. Build `app/components/myscreen.jsx`; `export { MyScreen }`.
2. Import in `app.jsx`: `import { MyScreen } from "./myscreen";`
3. Add a branch around line 167:
   ```jsx
   else if (route === "myscreen") page = <MyScreen profile={activeProfile} goto={goto} />;
   ```
4. Optionally add a nav link in `atoms.jsx > TopNav > items`.
5. Params via `goto("myscreen", { id: 42 })` → read from `routeParams` in App.

For URL routing later: move to Next.js App Router (`app/myscreen/page.tsx`) and thread state via context.

---

## Adding a tool / video / creator

Pure data. Edit `app/components/data.jsx`:
- New tool → `TOOLS` array
- New creator → `CREATORS` array
- Videos are generated deterministically by `makeVideos()` from `TITLE_BANK`

For real data, swap `VIDEOS = makeVideos()` for a fetch in `useEffect`.

---

## Deploy

Push to `main` → GitHub Actions builds + deploys to Pages.

**Live:** https://obirimensah05.github.io/Code-Design-Hackathon/

Workflow: `npm ci` → `NODE_ENV=production npm run build` → upload `out/` → deploy. ~45 seconds.

---

## Common gotchas

| Symptom | Cause | Fix |
|---|---|---|
| `window is not defined` at build | Module-level `localStorage` access | Wrap in `typeof window !== "undefined"` check, or dynamic-import with `ssr:false` |
| Broken layout in prod, fine in dev | Tailwind v4 preflight | Keep the `h1, h2, … { display: block }` rule near top of `globals.css` |
| Assets 404 in prod | Missing `basePath` | `next.config.ts` has conditional basePath for production — don't remove |
| TS errors in `skills/*.ts` | Example code with unresolved imports | `tsconfig.json > exclude` must contain `"skills"` |
| Slow build | `.next/` cache issue | `rm -rf .next && npm run build` |

---

## Before you push

1. `npm run build` passes locally.
2. Check a second viewport width. Persistent Tweaks panel overlaps primary CTAs on <500px — known.
3. Don't commit: `out/`, `.next/`, `node_modules/`, ephemeral screenshots.
4. Commits: imperative subject, body explains *why*. Co-Authored-By footer if an agent wrote the code.

---

## If you're an AI agent

- Read [BRIEF.md](BRIEF.md) first for product intent, [DESIGN.md](DESIGN.md) for the visual system.
- The [skills/interfaces-that-feel/SKILL.md](skills/interfaces-that-feel/SKILL.md) framework defines copy + motion rules. Follow them.
- Use [skills/orchestrators/design-improve/SKILL.md](skills/orchestrators/design-improve/SKILL.md) before shipping UI: audit → critique → fix → polish.
- User prefers terse, direct communication. No trailing summaries unless asked.
- Preserve the warm-editorial aesthetic. No gradient text, glass morphism, or rainbow AI palettes.
