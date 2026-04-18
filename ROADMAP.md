# Roadmap

Honest status. No vanity roadmap.

---

## Shipped — works in the prototype

- [x] Onboarding (5 steps, ~2 min) — field, tools, role, goals → produces a profile
- [x] Home with 4 live-switchable variants: Editorial / Feed / Library / Path
- [x] Browse: filter by tool / level / field, sort, grid of VideoCards
- [x] Tool detail: 4 skill-level tabs (Beginner → Expert), videos per level
- [x] Video detail: player placeholder, rating (1–5 stars), creator info, description
- [x] Langdock integration: "Try on Langdock" CTA + slide-over panel with model picker
- [x] Leaderboard: weekly scoped by role + level, top 10, user's position pinned
- [x] Share Knowledge: 2-step upload flow (paste link → tag → publish)
- [x] My Learning (profile): watched history, active tools, points
- [x] Tweaks panel: theme, accent hue, home variant, gamification dial, role lens — persistent on every page
- [x] Points + toasts on video watch + Langdock completion
- [x] MobileView simulator (iPhone frame inside desktop viewport, for design review)
- [x] Responsive layout: 3 major breakpoints (1080 / 880 / 720 / 560)
- [x] Keyboard-accessible primary nav + aria-current on active route
- [x] Dark mode with warm charcoal palette
- [x] Static export deployed to GitHub Pages

---

## Next (post-hackathon, if this continues)

### Week 1 — Get it to real users
- [ ] Supabase wiring: auth, profiles table, videos table, ratings table
- [ ] Real YouTube embed on video detail (currently a styled placeholder)
- [ ] Real file-backed Langdock handoff (URL with model + starter prompt encoded)
- [ ] URL routing (move internal `route` state to Next.js App Router pages)
- [ ] PostHog or Vercel analytics

### Week 2 — Trust signals
- [ ] Real verified checkmarks (creator must link company domain email)
- [ ] "47 marketers found this useful" — count + gate behind real data
- [ ] Report / flag flow on videos and comments
- [ ] Moderator view for flagged content

### Week 3 — Creator tools
- [ ] Creator dashboard: per-video stats, field breakdown, feedback
- [ ] Upload with screenshot annotations (not just YouTube link)
- [ ] Draft saves; unpublished videos visible only to creator
- [ ] Weekly digest email to top contributors

### Week 4 — Feel polish
- [ ] Real rank-change animations on leaderboard (currently simulated)
- [ ] First-time experience warmth: personalized welcome after onboarding
- [ ] Error states for network failures (currently assumes happy path)
- [ ] Loading skeletons for browse grid
- [ ] Empty states across all routes (only browse has one currently)

---

## Explicitly not doing

- Certificates / credentials. Not the product.
- Built-in chat. Slack wins; don't compete.
- Discussion threads nested 5 levels deep. Reddit tried; it's not good.
- AI-generated avatars. Real people only.
- Social graph (follow / block / DM). Stays a knowledge hub, not a network.
- Gamification as dark pattern (streaks that guilt-trip). Dial stays opt-in.

---

## Known issues in the current build

- Onboarding `<h1>` + `<p>` spacing looks tight in 1440px desktop screenshots — visual check needed on real hardware to confirm fix
- `/_not-found` flashes briefly during route transitions (Next.js internals)
- Mobile "Continue" button is obscured by the Tweaks panel on small viewports because the panel is fixed persistent per request
- Tweaks panel has no dismiss on small viewports (by design — remove if this ships past hackathon)
- postMessage protocol for edit mode is always-on; no-op in standalone hosting

---

## Decisions worth remembering

- **Client-only rendering.** Bailed on SSR via `next/dynamic({ ssr: false })` because localStorage initializers would fail on the server. Reversible if we move state to cookies.
- **No URL routing.** Internal state drives the view. Shippable this way for an MVP; non-negotiable if we want shareable deep links or SEO.
- **Tweaks panel is persistent.** By user request, not by default design. In production this would be a keyboard-shortcut-toggled overlay (⌘K style), not a permanent floating block.
- **Gamification defaults to Subtle.** The target user is AI-hesitant; points-in-your-face is hostile to them. Opt-in is respectful.
- **Static export to GitHub Pages.** No server cost. Trade-off: no server features. Zero → free tier. Revisit if we need auth or real-time.
