---
name: design-start
description: Run at the beginning of any design session — before touching any UI, when asked to design X, start a new design project, set up visual direction, or begin any UX/product work. Establishes project design DNA, visual direction, emotional lens, and delight targets in one setup sequence. Always run this before delight-first-design, interfaces-that-feel, frontend-design, or any visual implementation.
---

# Design Start

Sets up everything needed before any design work begins. Run once per session.

---

## Step 1 — Restore or Establish Project Design DNA

Check for `.impeccable.md` in the project root:

- **If found:** Read it. Summarize the key constraints (brand personality, aesthetic direction, banned patterns) at the top of your response.
- **If not found:** Read `~/.claude/skills/teach-impeccable/SKILL.md` and follow its full instructions — ask the 3 questions, gather context, save `.impeccable.md` before continuing.

---

## Step 2 — Visual Direction Interview

Ask the user these questions to establish visual direction. Use `AskUserQuestion` with all questions in one prompt so they can answer in one pass:

> "Before we set visual direction, a few quick questions:
> 1. **What are we designing?** (type — app / website / poster / component — and one sentence on what it does)
> 2. **Mood in 3–5 words** — what should it feel like?
> 3. **Color direction** — warm / cool / neutral? Bold or muted? Any specific hues or hex values?
> 4. **Typography feel** — serif or sans? Editorial/expressive or clean/functional? Heavy or light?
> 5. **Layout** — airy and spacious, or dense and packed? Strict grid or organic?
> 6. **References** — any brands, apps, sites, films, physical objects, or eras that feel right?
> 7. **Hard avoids** — what style would completely miss the mark?"

Once the user responds, synthesize their answers into a Visual Direction Brief:

```
## Visual Direction Brief — [date]

### Mood
[3–5 words from the user's response]

### Color Palette
- Primary: [hex + description]
- Secondary: [hex + description]
- Accent: [hex + description]
- Neutral: [hex + description]
- Background: [hex + description]

### Typography
- Heading feel: [from user's response]
- Body feel: [inferred from heading direction]
- Scale: [inferred from layout philosophy]

### Layout
[2–3 sentences derived from user's layout + mood answers]

### References
[List what user named; note the design qualities they imply]

### What to avoid
[Directly from user's hard avoids + anything implied by their references]
```

This brief governs every color, type, and layout decision in this session. Every subsequent design choice references it.

---

## Step 3 — Emotional Lens

Read `~/.claude/skills/interfaces-that-feel/SKILL.md` for the full framework. Then answer these 3 questions for the specific work ahead:

1. **Does it have a voice?** What is the specific tone — who wrote this, and what do they sound like?
2. **Is the emotion earned?** Which moments deserve acknowledgment? Which ones just need to work?
3. **Does it know when to step back?** Where will restraint create more impact than expression?

---

## Step 4 — Delight Targets

Using the emotional lens from Step 3, answer these 4 questions for the specific work ahead:

1. Where is the moment of surprise?
2. Where is the earned satisfaction?
3. Where is the personality?
4. What's currently forgettable that we're going to fix?

---

## Step 5 — Business Context (optional)

Only run this step if the work involves a product or feature decision that will need stakeholder alignment or business justification.

Read `~/.claude/skills/business-design/SKILL.md` and apply:
- **Three WHATs** — what's being sold, the unit of sale, and the implied incentive
- **Profit Tree** — which lever does this design work move (more customers, more spend, lower costs)?

---

## Output: Design Session Brief

Produce one **Design Session Brief** before starting any implementation:

```
## Design Session Brief — [date]

### Project Design DNA
[Key constraints from .impeccable.md]

### Visual Direction
Mood: [3–5 words]
Primary: [hex] — [description]
Secondary: [hex] — [description]
Accent: [hex] — [description]
Neutral: [hex] — [description]
Background: [hex] — [description]
Typography: [heading feel] / [body feel]
Layout: [1–2 sentences on grid, density, whitespace]
Avoid: [3–5 explicit things not present in the inspiration]

### Emotional Lens
Voice: [who sounds like this]
Earned moments: [what gets acknowledged vs. what just works]
Restraint zones: [where to hold back]

### Delight Targets
Surprise: [the unexpected moment we're designing for]
Satisfaction: [the feedback loop that makes completion feel good]
Personality: [the layer that makes it feel human]
Eliminating: [what's currently generic that we're replacing]

### Business Context (if applicable)
Implied incentive: [the metric that drives revenue]
Profit lever: [which branch of the tree this touches]
```

This brief is the north star for the session. Do not start implementing until it is complete.

---

## Credits

This skill orchestrates:

| Skill | Author | Source |
|-------|--------|--------|
| `teach-impeccable` | Paul Bakaus | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `interfaces-that-feel` | Marie Spreitzer | [mariespreitzer/skill](https://github.com/mariespreitzer/skill) |
| `business-design` | Marie Spreitzer | — |

Bundle designed by [Marie Spreitzer](https://github.com/mariespreitzer).
