---
name: design-improve
description: Run after coding any UI component, page, or feature — before pushing or requesting review. Audits the current design, scores it across key dimensions, then activates only the improvement skills needed based on what's actually failing. Smart routing — diagnose first, fix only what scores below passing, always end with polish.
---

# Design Improve

Diagnose first. Fix only what's failing. Polish last.

---

## Step 1 — Diagnose

### Run `audit`
Read and invoke the `audit` skill. It scores:
- Accessibility (0–4)
- Performance (0–4)
- Theming (0–4)
- Responsive (0–4)
- Anti-patterns (0–4)

Overall health score out of 100. Issues tagged P0–P3.

### Run `critique`
Read and invoke the `critique` skill. It scores via Nielsen heuristics (0–40) and checks for:
- Visual hierarchy and cognitive load
- Emotional journey and discoverability
- AI slop tells (generic fonts, uniform rounding, purple gradients, etc.)

### Compile priority list
Merge both reports into a single issue list ordered by severity. Note which dimensions scored below 3/4. These are your routing inputs for Step 2.

---

## Step 2 — Smart Routing

Only activate skills for dimensions that are actually failing. Read each skill file and follow its full instructions.

All skill files live at `~/.claude/skills/[skill-name]/SKILL.md`.

| Failing dimension | Skills to run |
|-------------------|---------------|
| Layout / spacing score low | `arrange` → then `adapt` |
| Typography score low | `typeset` |
| Color flat or monochromatic | `colorize` |
| Design feels generic / too safe | `bolder` |
| Design feels busy / aggressive | `quieter` → then `distill` |
| Motion missing or easing wrong | `animate` → then `emil-design-eng` |
| Delight or personality absent | `delight` |
| Copy unclear or robotic | `clarify` |
| Design system drift detected | `normalize` |
| Accessibility failures found | `web-accessibility` |
| Onboarding or empty states weak | `onboard` |

**Order matters:** when multiple dimensions are failing, run structure fixes before color, color before motion, motion before copy, copy before system.

---

## Step 3 — Always: Polish

After all dimension-specific improvements are done, always run:

Read `~/.claude/skills/polish/SKILL.md` and follow its full instructions:
- Alignment, spacing consistency, micro-details
- Interaction states (hover, focus, active, disabled)
- Content and iconography consistency
- Cross-device and edge case check

---

## Output: Improvement Report

```
## Design Improvement Report — [component/page name]

### Before Scores
Audit health: [score]/100
Critique (heuristics): [score]/40
Failing dimensions: [list]

### Improvements Made
[Skill] → [what specifically changed]
[Skill] → [what specifically changed]

### After
Audit health: [re-run score if significant changes] /100
Remaining P0 issues: [list or "none"]
```

---

## Credits

This skill orchestrates:

| Skill | Author | Source |
|-------|--------|--------|
| `audit` | Paul Bakaus | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `bolder`, `quieter`, `distill`, `normalize`, `polish` | Paul Bakaus | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `arrange`, `adapt`, `typeset`, `colorize` | Marie Claire Dean | [Owl-Listener/designer-skills](https://github.com/Owl-Listener/designer-skills) |
| `animate`, `delight`, `clarify`, `onboard` | Marie Claire Dean | [Owl-Listener/designer-skills](https://github.com/Owl-Listener/designer-skills) |
| `web-accessibility` | Vercel Labs | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| `critique` | Unknown | — |
| `emil-design-eng` | Unknown | — |

Bundle designed by [Marie Spreitzer](https://github.com/mariespreitzer).
