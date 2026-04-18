# Design System — Prompt University

Warm editorial. Calm for the AI-anxious. Specific where it matters.

---

## Philosophy

Three rules, in order:

1. **Does it have a voice?** Copy speaks to *this* moment, not all moments.
2. **Is the emotion earned?** Celebrations are proportional. Routine saves get nothing. A 7-day streak gets something small. A milestone gets its moment.
3. **Does it know when to step back?** Restraint is the skill. Not every interaction is a feel moment.

Borrowed from the [interfaces-that-feel](skills/interfaces-that-feel/SKILL.md) framework. If you're about to ship something decorative, re-read those three questions.

---

## Color tokens

Live in [app/globals.css](app/globals.css). Use these; never hard-code.

### Foreground / Background
| Token | Light | Dark |
|---|---|---|
| `--bg` | `#F8F9FA` | `#0A0A0B` |
| `--bg-elev` | `#FFFFFF` | `#131416` |
| `--bg-sunk` | `#F1F2F4` | `#08090A` |
| `--fg` | `#0E0F11` | `#F2F3F5` |
| `--fg-2` | `#4A4D52` | `#B8BBC0` |
| `--fg-3` | `#888B91` | `#7A7D83` |
| `--border` | `#E6E7EA` | `#1E2024` |
| `--border-strong` | `#CFD2D7` | `#2C2F35` |

### Brand
| Token | Value | Use |
|---|---|---|
| `--brand` | `#185FA5` | Primary actions, links, verified checks |
| `--brand-deep` | `#0E4480` | Hover states, deep accents |
| `--brand-tint` | `#E8F0F9` | Subtle brand backgrounds |

### Accent (tweakable)
Accent hue is user-controlled via the Tweaks panel. Range: 0 (coral) → 360 (pink), defaulting to **30 (amber)**.

```css
--accent: oklch(0.86 0.22 var(--accent-h));
--accent-deep: oklch(0.62 0.18 var(--accent-h));
--accent-tint: color-mix(in oklch, var(--accent) 12%, var(--bg));
```

Use accent for: earned progress, success states, live indicators. Not for primary actions — those are brand blue.

### Signals
| Token | Value | Use |
|---|---|---|
| `--warn` | `#FFA500` | Validation warnings |
| `--error` | `#FF4444` | Destructive actions, errors |

---

## Type

**Sans:** Geist (`"Geist", ui-sans-serif, system-ui, ...`)
**Mono:** Geist Mono (`"Geist Mono", ui-monospace, ...`)

Mono is reserved for: counts, metadata, step labels, prompt snippets. Not decorative.

### Scale
| Class | Size | Purpose |
|---|---|---|
| `.h-display` | 56px / 1.02 | Onboarding hero, editorial front page |
| `.h-1` | 32px / 1.15 | Page titles |
| `.h-2` | 22px / 1.2 | Section headings |
| `body` | 14px / 1.5 | Default paragraph |
| `.eyebrow` | 11–12px mono caps, `letter-spacing: 0.04em` | Small labels, categories |

Letter-spacing goes negative as size increases. `.h-display` tightens to `-0.025em`.

---

## Motion

One easing, three durations, one rule: **never animate `all`, never `ease-in` for entering elements**.

```css
--ease: cubic-bezier(0.2, 0.8, 0.2, 1);
--t-fast: 150ms;   /* buttons, hovers */
--t-med: 250ms;    /* page changes, modals */
--t-slow: 400ms;   /* earned celebrations only */
```

### Frequency → decision
| How often it happens | Animate? |
|---|---|
| Every click, every keypress | No |
| Hover states | Minimal |
| Modals, drawers, toasts | `--t-med` |
| Milestones, first-time, streaks | `--t-slow`, allowed to carry feeling |

### What to animate
Only `transform` and `opacity`. Both are compositor-only, no layout thrash.

Never animate: `width`, `height`, `top`, `left`, `box-shadow` (expensive).

---

## Spacing & radius

```css
--radius-sm: 6px;    /* small buttons, tags */
--radius: 10px;      /* cards, inputs */
--radius-lg: 16px;   /* panels, modals */
--radius-xl: 22px;   /* big cards, heroes */
```

Content shell caps at **1320px** wide. At <720px, shell drops to 16px side padding.

---

## Voice — copy rules

### Empty states are invitations, not descriptions
| Avoid | Use |
|---|---|
| "No videos found" | "Nothing matches those filters — try removing one to see more" |
| "No projects" | "Your first project is one click away. [Create →]" |

### Errors are support, not blame
| Avoid | Use |
|---|---|
| "Invalid email" | "That doesn't look like an email — try name@example.com" |
| "Something went wrong" | "We couldn't connect — check your internet and try again" |

### Loading messages are specific
| Avoid | Use |
|---|---|
| "Loading…" | "Pulling your recommendations…" |
| "Please wait…" | "Almost there — assembling your home" |

### Destructive actions are named
| Avoid | Use |
|---|---|
| "Are you sure?" | "This will remove your 12 saved videos. Delete anyway?" |

### Rewards, not just penalties
Validation should acknowledge good input, not just catch bad input.

---

## Anti-patterns

Never ship any of these. Flag them in review.

- Confetti on routine saves
- Loading copy like "Herding pixels" or "Hang tight!"
- Quirky 404s on otherwise cold products
- `transition: all` (unpredictable, causes repaints)
- `ease-in` on UI that's entering (starts slow — the moment users watch most closely)
- Animating from `scale(0)` — appears from nowhere; use `scale(0.95)` + opacity
- Generic spinners with no context
- Glass morphism, purple gradients, hero metrics, rainbow AI color chips (AI-slop tells)
- Gray text on colored backgrounds (contrast death)
- Nested cards (visual noise)

---

## Accessibility baseline

- All interactive divs have `role`, `tabIndex={0}`, and `onKeyDown` for Enter/Space.
- Active nav items carry `aria-current="page"`.
- Toasts are in a `role="status"` container with `aria-live="polite"`.
- Points pill has a descriptive `aria-label`.
- Touch targets: 40px min-height on mobile nav.
- Contrast: foreground/background pairs meet WCAG AA.

See [interfaces-that-feel Review Checklist](skills/interfaces-that-feel/SKILL.md) for the rest.

---

## The four home variants

The Tweaks panel switches between these without reload. Each is a different discovery metaphor — pick the one that suits the user's mental model.

| Variant | Metaphor | Who it's for |
|---|---|---|
| **Editorial** | Magazine homepage | Someone who wants curation — hero + stats + active path |
| **Feed** | TikTok-ish vertical reel | Someone who wants to be shown, not search |
| **Library** | Color-coded book spines on shelves | Someone who wants to browse by domain |
| **Path** | Today's lesson + 3-day look-ahead | Someone who wants structure |

Default is **Editorial** (safest first impression). The Library variant is the most opinionated, Feed the boldest.

---

## Gamification dial

Three settings via Tweaks:

- **Subtle** — points pill hidden, no streak UI. Progress invisible.
- **Medium** — points shown, leaderboards accessible, no pushy CTAs.
- **Heavy** — full treatment. Streak banners, rank-change animations, toasts.

Default: **Subtle**. Gamification off by default because AI-hesitant users don't want to be graded. Opt-in is the respectful frame.
