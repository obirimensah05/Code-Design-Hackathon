---
name: design-ship
description: Run before any PR, merge, or production push. Ship-readiness gate — hardens edge cases, verifies accessibility, checks web guidelines, runs Playwright smoke tests, proves the feature works, then creates the PR. Blocked if any P0 issue remains after hardening. Use when about to push UI changes, before creating a pull request, or before deploying any frontend work.
---

# Design Ship

Pre-ship gate. Run all gates in sequence. Do not skip.

**If any gate produces a P0 issue — stop. Fix it. Then restart from that gate.**

---

## Gate 1 — Harden

Read `~/.claude/skills/harden/SKILL.md` and follow its full instructions:
- Edge cases, error states, empty states
- Text overflow and internationalization resilience
- Graceful degradation when APIs fail or data is missing
- Form validation and destructive action confirmation (specific, not vague)

---

## Gate 2 — Accessibility

Read `~/.claude/skills/web-accessibility/SKILL.md` and follow its full instructions:
- WCAG 2.1 AA compliance
- Semantic HTML elements, keyboard navigation, ARIA attributes
- Color contrast minimum 4.5:1 for normal text
- Screen reader support and focus management

---

## Gate 3 — Web Guidelines

Read `~/.claude/skills/web-design-guidelines/SKILL.md` and follow its full instructions:
- Vercel web interface guidelines compliance check
- Flag any violations

---

## Gate 4 — Functional Verification

Read `~/.claude/skills/webapp-testing/SKILL.md` and follow its full instructions:
- Playwright smoke test of critical user flows
- Screenshot key states: default, hover, active, error, empty, loading
- Check browser console for errors and warnings

---

## Gate 5 — Completion Verification

Invoke `superpowers:verification-before-completion`:
- Produce fresh evidence that the feature works as intended
- No completion claim without proof
- Diff behavior between main and the changes where relevant

---

## Gate 6 — Ship

Invoke `superpowers:finishing-a-development-branch`:
- Verify tests pass
- Create PR with comprehensive summary (what changed, why, test plan)
- Execute merge workflow per user preference

---

## Ship-Readiness Checklist

Output this before Gate 6:

```
## Ship Readiness — [feature/branch name]

### Gate Results
- Harden:           [ pass / issues: X ]
- Accessibility:    [ pass / WCAG issues: X ]
- Web guidelines:   [ pass / violations: X ]
- Webapp testing:   [ pass / failures: X ]
- Verification:     [ pass / blocked: reason ]

### P0 Issues Remaining
[List each, or "None — clear to ship"]

### Decision
[ SHIP — proceeding to PR ]
[ BLOCKED — fix [issue] before continuing ]
```

---

## Credits

This skill orchestrates:

| Skill | Author | Source |
|-------|--------|--------|
| `harden` | Paul Bakaus | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) |
| `web-accessibility` | Vercel Labs | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| `web-design-guidelines` | Vercel Labs | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| `webapp-testing` | Vercel Labs | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| `superpowers:verification-before-completion` | Jesse Vincent | [obra/superpowers](https://github.com/obra/superpowers) |
| `superpowers:finishing-a-development-branch` | Jesse Vincent | [obra/superpowers](https://github.com/obra/superpowers) |

Bundle designed by [Marie Spreitzer](https://github.com/mariespreitzer).
