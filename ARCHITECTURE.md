# Architecture

Keep it small. Client-rendered, one page, state in localStorage. Nothing clever.

---

## Stack

- **Next.js 16.2** (App Router, Turbopack)
- **React 19**
- **TypeScript 5** (strict, but component bodies are `.jsx` for port convenience)
- **Tailwind v4** (imported but used sparingly — design tokens live in `app/globals.css`)
- **No state library.** `useState` + `localStorage`.
- **No router library.** Internal `route` state in the App component.
- **No UI library.** All atoms are in-house in `app/components/atoms.jsx`.
- **Fonts:** Geist + Geist Mono via Google Fonts CDN (the prototype CSS references them by name).

---

## Code map

```
app/
├── layout.tsx            Root layout. Metadata + Google Fonts link.
├── page.tsx              One line: dynamic-import App with { ssr: false }.
├── globals.css           ~2000 lines. Tokens + components + responsive overrides.
└── components/
    ├── app.jsx           Main App. Holds all state. Routes internally.
    ├── atoms.jsx         PVLogo, Verified, Icon (15 svg icons), Thumb, VideoCard,
    │                     ToastStack, TopNav, StarRater.
    ├── data.jsx          Static data (TOOLS, FIELDS, LEVELS, CREATORS, VIDEOS)
    │                     + PV_DATA helper object (fmtViews, tool/video lookups).
    ├── onboarding.jsx    5-step onboarding flow.
    ├── home.jsx          4 home variants (Editorial, Feed, Library, Path) + Home router.
    ├── browse.jsx        Filterable video grid.
    ├── tool.jsx          Tool detail: 4 skill-level tabs.
    ├── video.jsx         Video detail: player, rating, discussion, langdock CTA.
    ├── langdock.jsx      Slide-over panel. "Try on Langdock" integration.
    ├── leaderboard.jsx   Weekly rank with real-time simulation.
    └── tweaks.jsx        Persistent dev panel: variant, gamification, role, theme, accent.

prototype/                The original Claude Design handoff. Historical only.
skills/                   Local-archive of Claude Code design skills. Reference material.
docs/                     Screenshots (hero.png, hero-mobile.png).
.github/workflows/        Pages deploy on push to main.
```

---

## Routing

No URL routing. The App component holds `route` as state and renders the right page:

```jsx
if (route === "home")        page = <Home ... />
else if (route === "browse") page = <Browse ... />
else if (route === "tool")   page = <ToolDetail ... />
else if (route === "video")  page = <VideoPage ... />
// ...
```

Navigation is via `goto(route, params)` passed down as a prop. `goto` sets `route`, `routeParams`, and scrolls to top.

**Why no URL routing:** the prototype came from Claude Design; internal state worked. For a real product you'd swap this for App Router pages in ~30 min — just move each route into `app/[route]/page.tsx` and use `useRouter().push`.

---

## State

All in `app/components/app.jsx`. Every piece is hydrated from localStorage on mount and persisted on change.

| State | localStorage key | Shape |
|---|---|---|
| `profile` | `pv_profile` | `{name, email, field, role, goals[], initials}` or `null` |
| `route` | `pv_route` | one of `home/browse/tool/video/leaderboard/learning/share/profile` |
| `routeParams` | `pv_route_params` | `{toolId?, videoId?}` |
| `points` | `pv_points` | number |
| `watched` | `pv_watched` | `{[videoId]: timestamp}` |
| `ratings` | `pv_ratings` | `{[videoId]: 1..5}` |
| `langdockCompletedFor` | `pv_ld_done` | `{[videoId]: timestamp}` |
| `tweaks` | — (in-memory; pushed to host via postMessage) | see below |

### Tweaks

Live view-state that the persistent Tweaks panel mutates. Never writes to localStorage — instead, posts to the parent window via the edit-mode protocol so the Claude Design host (or any embedder) can persist.

```ts
{
  theme: "light" | "dark",
  accentHue: 0 | 30 | 145 | 200 | 280,
  homeVariant: "editorial" | "feed" | "library" | "path",
  gamification: "subtle" | "medium" | "heavy",
  roleLens: "marketing" | "dev" | "design" | "legal" | "hr" | "ops",
}
```

Default in `DEFAULT_TWEAKS` at the top of `app.jsx`.

---

## Edit-mode protocol

Used when the app is embedded in a host (Claude Design, a Figma plugin iframe, etc.). Lives in `app.jsx` around line 92.

```js
// Incoming
window.addEventListener("message", (e) => {
  if (e.data?.type === "__activate_edit_mode")   { /* noop; panel is persistent */ }
  if (e.data?.type === "__deactivate_edit_mode") { /* noop */ }
});

// Outgoing, on mount
window.parent.postMessage({type: "__edit_mode_available"}, "*");

// Outgoing, on tweak change
window.parent.postMessage({type: "__edit_mode_set_keys", edits: next}, "*");
```

The Tweaks panel is now always rendered. The activate/deactivate messages are accepted for compatibility but don't gate visibility.

---

## SSR strategy

**There is none.** `app/page.tsx` dynamic-imports `App` with `{ ssr: false }`. The server sends an empty shell; client JS hydrates and takes over.

Why: the app's state initializers read `localStorage`, which is undefined on the server. Rather than guard every access, we bailout to CSR. Next.js renders a minimal HTML shell for SEO meta; the real UI appears after hydration.

Trade-off: no SEO content, no first-paint UI. Fine for a gated dashboard-style app. Wrong for a marketing site.

---

## Static export

```ts
// next.config.ts
output: "export"
basePath: process.env.NODE_ENV === "production" ? "/Code-Design-Hackathon" : ""
assetPrefix: same
trailingSlash: true
images: { unoptimized: true }
```

Production build produces `out/` — a fully static directory deployable to any CDN. GitHub Pages serves it at `/Code-Design-Hackathon/`.

---

## Performance notes

- All animations use `transform` + `opacity` only.
- `useCallback` wraps handlers that pass into deep trees (goto, resetDemo, openLangdock).
- `useMemo` caches the role-lensed profile to avoid re-computing on every render.
- Video generation (`makeVideos()` in `data.jsx`) runs once at module load — seeded PRNG keeps it deterministic.

No react-icons, no heavy deps. All icons are hand-authored SVG in `atoms.jsx`.

---

## Known quirks

- **Clickable divs**: atoms uses `<div role="button" tabIndex={0}>` instead of `<button>` so the prototype's CSS survives unchanged. Keyboard and ARIA are attached manually.
- **`prototype/` and `skills/`** are excluded from TypeScript via `tsconfig.json > exclude`. They contain example code that references unresolved modules.
- **The `/_not-found` route** is auto-generated by Next.js — it shows briefly during route transitions. Fine.
- **Dev server runs on `:3333`** (not 3000) to avoid collision with other local apps. Change in `package.json > scripts.dev`.
