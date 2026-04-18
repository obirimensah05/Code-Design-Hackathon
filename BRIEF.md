# Brief — Prompt University

Peer-to-peer AI learning with structure. For professionals. By professionals.

---

## The problem

Most people still feel overwhelmed by AI. They don't know where to start, what's useful for their job, or who to trust.

Peer-to-peer learning works — but today it happens in scattered, informal conversations with no structure, no discoverability, and no way to build on them.

Tips get buried in Slack threads. Clever prompts die in Twitter DMs. A colleague figures out a workflow that saves five hours a week, and no one in the next department ever learns it. Consulting firms are already billing six figures to build internal AI academies — signal that the demand is real and the status quo is losing people money.

---

## The opportunity

Langdock already helps thousands of people use AI at work. Prompt University is the public-facing knowledge layer that sits next to it: a community-driven hub where professionals share how they actually use AI in their roles, with video, walkthroughs, and discussion as the main content forms.

It's not a course platform. Nobody finishes those. This is closer to a magazine that respects your time, a library that knows your role, and a peer group that's actually good at the thing.

---

## Target user

Working professionals who feel left behind by AI. Mid-career. Not engineers. Roles include:

- Marketing managers
- Legal counsel
- HR and people ops
- Operations and admin
- Sales and BD
- Designers

They want practical, role-specific knowledge from people like them. They don't want theory. They don't want another learning platform. They want to see a peer using ChatGPT to cut three hours off a weekly task, then go try it.

---

## Design focus areas

### Discovery
Role filters, tool-first browsing, "what peers like you are learning this week," multiple home metaphors (Editorial / Feed / Library / Path) so people can find content the way they think.

### Trust
Creator role + company + verification. Real ratings. "47 marketers found this useful." Completion rates shown. No vanity metrics.

### Contribution
Two-step upload. Paste a link, add tags, publish. Lower the barrier past the point where most people would actually do it.

### Gamification
Points for watching, rating, sharing. Leaderboards scoped by role, level, and week. But dial-able — a Subtle setting that shows none of it, a Heavy setting for people who want the dopamine. Progress without prescription.

---

## What good looks like

- **Calm, minimal, warm.** A magazine / library feel. Strong hierarchy. Generous whitespace. Serif display type. Anxiety-reducing for AI-hesitant professionals.
- **Original, not derivative.** Doesn't look like a Coursera clone or a TikTok clone.
- **Fast and honest.** Real data, real ratings, real people. No stock photos. No AI-generated avatars.
- **Warmth in the copy.** Error messages that help, empty states that invite, confirmations that acknowledge.
- **Polished but unobtrusive.** Motion that carries meaning — not decoration.

### Anchor references (aesthetic, not feature)
How We Feel · Headspace · Gentler Streak · Amie · Arc Browser · the public library section of a good bookstore.

---

## Core content forms on the platform

- **Short videos** (Loom-style, 5–10 min) — the main unit
- **Walkthroughs** — step-by-step, with screenshots and copy-able prompts
- **Prompt templates** — small, tagged, shareable
- **Discussion threads** — attached to every piece
- **Before/after workflow cards** — "here's what this used to take, here's what it takes now"

---

## Features — shipped in the prototype

- **Onboarding (5 questions, ~2 minutes)** — field, tools, role, goals. Produces a tailored home.
- **Home with four variants** — Editorial / Feed / Library / Path. Tweakable in real time.
- **Browse** — filter by tool, skill level, field; sort by freshness, watch count, rating.
- **Tool detail** — 4 skill levels (Beginner → Expert), videos per level, creator info per video.
- **Video detail** — embedded player, creator, rating form, description, next-up.
- **Langdock integration** — "Try on Langdock" button opens the AI model in-panel so the user can practice the exercise on a real model mid-lesson.
- **Leaderboard** — weekly, scoped by role + level. Real-time update animations. A "Subtle" mode hides points entirely.
- **Share Knowledge** — upload flow, creator dashboard sketch.
- **Tweaks panel** — live-tunable home variant, gamification intensity, role lens, theme, accent hue. Persistent on every page.

---

## Visual direction

**Type system**
- Display: Geist (warm but neutral sans — substitutes for Instrument Serif in the handoff)
- Body: Geist
- Mono: Geist Mono (for metadata, counts, code)

**Color**
- Warm neutrals. Oklch-based palette with tweakable accent hue.
- Brand blue `#185FA5` for primary actions and trust signals.
- Accent is tunable (default amber) — controls success/progress moments.
- Dark mode is warm charcoal, not pure black.

**Motion**
- `cubic-bezier(0.2, 0.8, 0.2, 1)` — the single easing for everything except celebrations.
- Durations: 150ms fast · 250ms medium · 400ms reserved for earned moments.
- Animate transform + opacity only. Never `transition: all`.

---

## What this is *not*

- Not a course platform. Nobody is grading you.
- Not a certification factory. No badges pretending to be credentials.
- Not a social network. No follows, no likes.
- Not a chatbot wrapper. The AI isn't the teacher — peers are.

---

## Success signals (if this shipped)

- **Weekly active** > 60% of registered users
- **Contribution ratio** > 4% (people who upload, not just consume — the benchmark is 1% on open communities)
- **Video completion** > 70% median (YouTube sits around 50%)
- **First-session outcome**: user finds at least one relevant video within 90 seconds of onboarding

---

## Inspired by / owes a debt to

The original Claude Design handoff authored this product direction. The full implementation is in [app/](app/). The prototype source — React-via-Babel, exactly as designed — lives in [prototype/](prototype/) as a historical reference.
