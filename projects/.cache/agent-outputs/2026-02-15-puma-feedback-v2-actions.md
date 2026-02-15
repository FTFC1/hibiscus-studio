# PUMA Feedback V2 — Extracted Actions
**Source:** 3 screen recordings (Feb 14-15, ~18 min total)
**Extracted:** 2026-02-15
**Previous round:** `.cache/agent-outputs/2026-02-14-puma-feedback-actions.md` (28 items)

---

## Summary
39 items total: 15 PUMA app feedback, 8 lesson page, 4 tooling/process, 7 architecture/design, 3 business, 2 positive signals.

**Key insight:** Nicholas is referencing skill.adapt (Ryan Singer's design skills site) as the design quality bar. The patterns there — spacing, text-to-visual ratio, dark cards, interactivity, cheat sheets — are what he wants the PUMA app to look like.

---

## PUMA APP FEEDBACK (mapped to /shape page tree)

### HOME PAGE (7 items)

| # | Priority | Item | Status | Source |
|---|----------|------|--------|--------|
| H1 | P1 | Header "PUMA Training" looks basic → needs more visual presence | ⚠️ Was improved (brand split) but still not enough | V1 |
| H2 | P2 | Avatar initials not clickable → should navigate to Profile | NEW | V1 |
| H3 | P1 | Quick action cards: "Play game" doesn't say WHICH game | NEW | V1 |
| H4 | P1 | Quick action: "Daily review" — no clear action verb. Is it SUBMIT a review? | NEW | V1 |
| H5 | P1 | Quick action: "Practice log" — no action. Is it VIEW? | NEW | V1 |
| H6 | P2 | Module header needs visual/image to "sell it" more | NEW — header approved but below it needs enrichment | V1 |
| H7 | P2 | 3/6 missions text competing with module header → remove or integrate | REPEAT from V1 feedback | V3 |

### LESSON PAGE (8 items)

| # | Priority | Item | Status | Source |
|---|----------|------|--------|--------|
| L1 | P1 | Swipe hit area must be WHOLE SCREEN — swiping at edges triggers iOS back gesture | REPEAT — was "fixed" but still broken | V3 |
| L2 | P1 | Text is "just plain text, doesn't make sense" → needs visual treatment, not just text | NEW — biggest lesson complaint | V3 |
| L3 | P1 | Color on number but nothing else → need more visual hierarchy throughout | NEW | V3 |
| L4 | P2 | Arrow should point DOWNWARDS (flow direction) | Toolkit arrows exist but maybe not visible enough | V3 |
| L5 | P2 | Text should be BIGGER | NEW | V3 |
| L6 | P1 | Sticky bar (progress/nav) should dynamically appear, not always take space | NEW | V3 |
| L7 | P2 | Reference button: should be outline button with word "Reference" + icon (not just icon) | NEW | V3 |
| L8 | P1 | "Try this today" practice section → needs action button ("Start quiz" / "Ready to practice") and shouldn't be so low | NEW | V3 |

### MANAGER VIEW (2 items)

| # | Priority | Item | Status | Source |
|---|----------|------|--------|--------|
| M1 | — | Manager view is "great" | ✅ POSITIVE | V3 |
| M2 | P2 | If manager has activity content, "games" in nav doesn't make sense → already fixed (4-tab) | ✅ DONE | V3 |

### PROFILE (2 items)

| # | Priority | Item | Status | Source |
|---|----------|------|--------|--------|
| P1 | — | Profile "looks good" | ✅ POSITIVE | V3 |
| P2 | P3 | Add "Request help / Support" → creates voice ticket → notifies manager (HBS bot pattern) | NEW — future feature | V3 |

### NAVIGATION (1 item)

| # | Priority | Item | Status | Source |
|---|----------|------|--------|--------|
| N1 | P2 | Should show "what's new" when changes are deployed | NEW | V3 |

### GENERAL UX (1 item)

| # | Priority | Item | Status | Source |
|---|----------|------|--------|--------|
| G1 | P3 | Duolingo as reference for below-fold card layout | REFERENCE | V3 |

---

## TOOLING / PROCESS IDEAS (4 items)

| # | Item | Notes |
|---|------|-------|
| T1 | **Feedback recording tool:** iOS native camera + transcription overlay + screen recording + volume indicator | Capture improvement — relates to GH #26 |
| T2 | **Airdrop watcher:** Mac watches for airdropped screenshots, auto-captures + catalogs | Pipeline improvement |
| T3 | **Pattern reference tool:** `/adapt` or `/reference [pattern-name]` to instantly show a design pattern example | Skill idea |
| T4 | **"What's new" changelog:** Show users what changed since last visit | Product feature |

---

## ARCHITECTURE / DESIGN PATTERNS (7 items)

| # | Item | Notes |
|---|------|-------|
| A1 | **skill.adapt** = design quality bar. spacing, text-to-visual ratio, dark cards + dark borders, interactivity | Reference: Ryan Singer's shaping-skills site |
| A2 | **"AI harness"** = domain-specific skills with fundamentals of that school of thought | Already exists: our skills system |
| A3 | **Butler concept:** reads fundamentals across domains, creates concoction for your task | Already built: /orchestrate skill |
| A4 | **Football formation:** forwards = diagnostic (interact with reality first), backs = enhancement (delayed, process outflows) | Already in /orchestrate (Phase ordering) |
| A5 | **Periodic table taxonomy:** elements grouped by fundamentals, interactive display | Already in /orchestrate (6 phases) |
| A6 | **Cheat sheets** that expand to show visual examples | Skill improvement idea |
| A7 | **Pattern library:** collecting good design patterns for reuse across projects | Not built — seed raised |

---

## BUSINESS / CONTENT (3 items)

| # | Item | Notes |
|---|------|-------|
| B1 | Visual articulation process → case studies → teardown content for marketing | /vv + content strategy |
| B2 | "Work speaks to itself" — free skills + tip model + marketplace | Aloe Labs positioning reference |
| B3 | "This process of giving visual articulation is something we can use to make case studies and teardown people's apps that can create content" | Content play: app teardowns |

---

## PRIORITY SUMMARY (PUMA app only)

### P1 — Must fix (8 items)
- H1: Header still looks basic
- H3: Quick action "play game" — which game?
- H4: "Daily review" — what's the action?
- H5: "Practice log" — what's the action?
- L1: Swipe hit area (whole screen)
- L2: Lesson text = plain text, needs visual treatment
- L3: More visual hierarchy in lessons
- L6: Sticky bar dynamically appearing
- L8: Practice section needs action button + higher position

### P2 — Should fix (6 items)
- H2: Avatar clickable to profile
- H6: Module header needs visual/image
- H7: 3/6 missions redundancy
- L4: Arrow direction (downwards)
- L5: Text bigger
- L7: Reference = outline button with label
- N1: "What's new" indicator

### P3 — Nice to have (2 items)
- P2: Support ticket with voice (HBS bot pattern)
- G1: Duolingo reference for card layout

---

## MAPPING TO /shape PAGE TREE

```
PAGE               STATUS    P1 ITEMS    P2 ITEMS    TOTAL
────────────────────────────────────────────────────────────
Lesson page        ❌         4           3           7
Home (staff)       ⚠️         4           3           7
Home (manager)     ✅         0           0           0
Practice           ✅         0           0           0
Activity           ⚠️         0           0           0
Profile            ✅         0           1           1
Navigation         ⚠️         0           1           1
```

**Design order (confirmed by data):**
1. **Lesson page** — 4 P1 items, core product, every staff sees it every session
2. **Home (staff)** — 4 P1 items, first impression, below-fold still dated
3. Profile polish — 1 P3 (support ticket, future)

**This matches the /shape output from previous session.**
