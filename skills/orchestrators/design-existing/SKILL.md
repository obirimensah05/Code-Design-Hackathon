---
name: design-existing
description: Run on any existing website or app that needs a design quality lift. Full upgrade pipeline — baseline audit, premium redesign plan, systematic visual improvements (typography → color → layout → motion → delight → copy), then a final audit showing the improvement delta. Use when upgrading an existing project, reviewing a live site, or when someone asks to improve, redesign, or refresh an existing interface.
---

# Design Existing

Full upgrade pipeline for existing projects. Documents before/after improvement delta.

---

## Phase 1 — Baseline (document before state)

Run `audit` and `critique`. Record the scores as your before snapshot.

```
BEFORE:
Audit health: [score]/100
Heuristics: [score]/40
Top P0/P1 issues: [list]
```

Do not start improvements until this is saved.

---

## Phase 2 — Redesign Plan

Read `~/.claude/skills/redesign-existing-projects/SKILL.md` and follow its full instructions:
- Scan codebase to understand current design patterns, stack, and component structure
- Audit typography, color, layout, interactivity, content, components, iconography, code quality
- Diagnose generic patterns (AI slop, safe defaults, over-used conventions)
- Produce a prioritized upgrade plan with what to change and in what order

**Review the plan before proceeding.** If scope is larger than expected, confirm with the user before continuing.

---

## Phase 3 — Systematic Improvements

Run skills in this exact order. Each builds on the previous. Read each SKILL.md and follow its full instructions.

All skill files live at `~/.claude/skills/[skill-name]/SKILL.md`.

1. **`typeset`** — Typography foundation: font choices, hierarchy, scale, line-length, leading
2. **`colorize`** — Color system: introduce strategic color, apply semantically (states, hierarchy, categories)
3. **`arrange`** — Layout + spacing: visual rhythm, grid structure, whitespace, hierarchy
4. **`adapt`** — Responsive: breakpoints, touch targets, mobile behavior, content priority
5. **`normalize`** — Design system alignment: tokens, spacing scale, component consistency
6. **`animate`** — Motion layer: entrance animations, micro-interactions, transitions with correct easing
7. **`delight`** — Joy layer: success states, empty states, personality moments, proportional celebration
8. **`onboard`** — First-time experience (only if the project has onboarding or needs it)
9. **`clarify`** — Copy cleanup: error messages, labels, help text, empty states, button copy

---

## Phase 4 — Final Polish

Read `~/.claude/skills/polish/SKILL.md` and follow its full instructions:
- Alignment, spacing consistency, micro-details
- Interaction states across all components
- Cross-browser and cross-device check
- Console clean (no errors or warnings)

---

## Phase 5 — After Snapshot

Re-run `audit` and `critique`. Compare to Phase 1.

---

## Output: Upgrade Report

```
## Design Upgrade Report — [project name]

### Before
Audit health: [score]/100
Heuristics: [score]/40
Top issues: [list]

### Changes Made
1. Typography:    [summary of changes]
2. Color:         [summary of changes]
3. Layout:        [summary of changes]
4. Responsive:    [summary of changes]
5. Normalize:     [summary of changes]
6. Motion:        [summary of changes]
7. Delight:       [summary of changes]
8. Onboard:       [summary or "skipped — no onboarding"]
9. Copy:          [summary of changes]
10. Polish:       [summary of changes]

### After
Audit health: [score]/100  (+[delta] from before)
Heuristics:   [score]/40   (+[delta] from before)
Resolved P0/P1: [list]
Remaining:      [list or "none"]
```

---

## Credits

This skill orchestrates:

| Skill | Author | Source |
|-------|--------|--------|
| `audit` | Paul Bakaus | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `normalize`, `polish` | Paul Bakaus | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `typeset`, `colorize`, `arrange`, `adapt` | Marie Claire Dean | [Owl-Listener/designer-skills](https://github.com/Owl-Listener/designer-skills) |
| `animate`, `delight`, `onboard`, `clarify` | Marie Claire Dean | [Owl-Listener/designer-skills](https://github.com/Owl-Listener/designer-skills) |
| `critique` | Unknown | — |
| `redesign-existing-projects` | Unknown | — |

Bundle designed by [Marie Spreitzer](https://github.com/mariespreitzer).
