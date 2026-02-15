---
session_id: 2026-02-13-fgch-analysis-variant
session_date: 2026-02-13
status: checkpoint
projects_touched: [HB, ALOE, INFRA]
work_types: [product-design, recursive-evaluation, skill-scaffold, client-deliverable]
context_remaining: ~20%
pickup_priority: Build /variant-handoff skill → generate FGCH analysis handoff → paste into variant.com → pick best UI → export final HTML for Rochelle
---

# Checkpoint: FGCH Analysis + Variant Handoff

**Date:** 2026-02-13
**Status:** 🔄 Checkpoint
**Context Remaining:** ~20%

---

## WHERE WE ARE

Continued from R11 checkpoint. Extracted bot spec to standalone file. Ran /recursive R12-13 (build-ready, all 10 at 9+). Processed Rochelle's Google Drive zip (6 videos, ALL duplicates of TG export — confirmed via transcription). Built playbook/lay of the land ASCII. User corrected approach: DON'T build bot yet → DO bespoke work for Rochelle first (Rule of Three). Built FGCH analysis HTML (mobile-first, dark mode, Rochelle-facing deliverable). User wants to use Variant.ai to generate superior UI variations from the content rather than iterating CSS in Claude Code. Next: build /variant-handoff skill, then generate handoff file for FGCH analysis.

---

## DECISIONS MADE (confirmed this session)

### Bot Spec + /recursive
1. Bot spec extracted to `hb/flower-girl-bot-spec.md` (standalone, build-ready)
2. Questions rewritten in Nicholas's voice (not survey tone)
3. Q0 routing added: already running / planning first / used to, stopped
4. Pre-launch flow for new workshop owners (different question set)
5. FGCH-specific 90-day plan as reference implementation (with £ amounts)
6. Dog-food playbook: 12-step script for Nicholas to run V1 manually
7. Data gaps table: 6 items to capture during dog-food (non-blocking)
8. /casestudy skill scaffolded (3-phase: Before/Process/After, byproduct-not-burden)
9. R12-13 SHIPPED — all 10 build-readiness criteria at 9+/10

### Drive Processing
10. All 6 Drive videos = duplicates of TG export (verified via transcription probe + full agent comparison)
11. TG export has 12 MORE files not in Drive (Drive is a subset)
12. Folder structure = product hierarchy intel (Bento active, Sip&Paint empty, Sprinkle Squad barely exists)

### Approach Corrections (from user voice note)
13. **Admin dashboard = HBS, not FGCH** (I had it wrong in the lay of the land)
14. **Dog-food = already in the middle** (not future)
15. **DON'T build bot now** → Do bespoke work first → bot learns from that
16. **Rule of Three applies**: Bespoke #1 (Rochelle) → #2 (next client) → #3 → THEN abstract to bot
17. **Can have a VERSION of the bot after each bespoke build** (progressive, not big-bang)
18. **Digital product still in play** (not parked)
19. **Notion DB restructure still in play** (not parked)
20. **Rochelle is burnt out** — needs to see how she steps away from physical tasks. The deliverable must WOW her.
21. **The analysis IS the product** — what she sees in Craft meeting, what backwards-informs bot later

### Variant.ai Workflow
22. **Variant.ai** = UI generation tool. Scroll through variations, minimal prompting, exports to HTML/React
23. **Don't iterate CSS in Claude Code** → extract design intelligence + content → handoff to Variant → pick winners → export
24. **Variant-handoff methodology**: Extract design tokens → structure content → embed context → optimize for tool
25. **Key insight**: "You have the copy written down. There is a superior UI tool. Instead of spending time iterating, use that."

---

## DECISIONS PENDING

- [ ] When does Rochelle see the analysis? (TG? Meeting? WhatsApp link?)
- [ ] Does Nicholas review/edit the analysis before Rochelle sees it?
- [ ] Variant.ai account — does user have one? Free/paid?
- [ ] Bot scaffold: park completely or update after each bespoke round?
- [ ] /variant-handoff: skill for all projects or FGCH-specific first?

---

## FILES CREATED THIS SESSION

### Created
- `hb/flower-girl-bot-spec.md` — Complete bot spec with dog-food playbook, questions in Nicholas's voice, 90-day plan, data gaps
- `~/.claude/skills/casestudy/SKILL.md` — 3-phase case study skill (Before/Process/After)
- `hb/fgch-analysis.html` — Rochelle-facing analysis deliverable (mobile-first, dark mode, her numbers + quotes)
- `projects/workshop-accelerator-bot/` — V1 bot scaffold (7 files, Express + bare TG API). PARKED — not the next build.
  - `src/index.js`, `src/bot.js`, `src/telegram.js`, `src/questions.js`, `src/session.js`, `src/summary.js`, `scripts/set-webhook.js`
- `sessions/2026-02-13-fgch-analysis-variant-checkpoint.md` — THIS FILE

### From Drive Processing
- `/tmp/fgch-drive-processing/*.txt` — 6 transcripts from Drive videos (all duplicates)
- `/tmp/fgch-drive/` — Extracted zip contents (1.8GB, can be deleted)

### NOT modified (should be updated)
- `hud/v4-data.js` — needs session work added
- `sessions/LAUNCH.md` — needs update
- `memory/projects.md` — needs Flower Girl / FGCH / bot spec / variant sections

---

## PICKUP INSTRUCTIONS

### Read These First
- `sessions/2026-02-13-fgch-analysis-variant-checkpoint.md` (THIS FILE)
- `hb/fgch-analysis.html` (the Rochelle-facing deliverable — content is DONE, UI needs Variant treatment)
- `hb/FGCH-BUSINESS-PROFILE.md` (456-line source data)
- `hb/flower-girl-bot-spec.md` (bot spec, PARKED but reference for what offering looks like)

### Then Do This
1. **Build /variant-handoff skill** — scaffold using methodology in this checkpoint:
   - Phase 1: Extract design intelligence (colors, typography, layout, components)
   - Phase 2: Structure content (page-by-page, hierarchy markers, data tables)
   - Phase 3: Embed context (constraints, brand voice, technical specs)
   - Phase 4: Optimize for tool (complete brief, natural language, no follow-ups needed)

2. **Generate FGCH analysis handoff** — apply /variant-handoff to `hb/fgch-analysis.html`:
   - Extract design tokens from the existing HTML (colors, fonts, spacing)
   - Structure all content sections (hero, revenue map, capacity, sticking points, 90-day plan, vision)
   - Package as single copyable text file (VARIANT_HANDOFF.txt)
   - User copies → pastes into variant.com → scrolls through variations → picks winner → exports HTML

3. **Run /recursive on the handoff** — evaluate whether the handoff gives Variant enough context for 80%+ accurate first draft with <2 iteration cycles

4. **After Variant produces final HTML** — that becomes the deliverable Rochelle sees

### User Needs To Answer
- Does user have a Variant.ai account?
- When does Rochelle see this?
- Does Nicholas want to edit content before handoff to Variant?

---

## RAW CONTEXT (for next session)

### FGCH Analysis Design Tokens (from existing HTML)
```
Colors:
  --bg: #0a0a0f        (background)
  --card: #13131a       (card background)
  --border: #1e1e2a     (borders)
  --text: #e0e0e8       (primary text)
  --muted: #7a7a8e      (secondary text)
  --accent: #c4956a     (warm accent — headings, quotes)
  --accent2: #6ac49b    (green — positive numbers, potential)
  --red: #c46a6a        (negative — current low numbers)
  --gold: #c4b06a       (medium — warnings)
  --purple: #8a6ac4     (accent — big opportunities)

Typography:
  Font: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  Hero title: 28px, 700 weight
  Section title: 20px, 600 weight
  Body: 14px
  Labels: 11-12px, uppercase, 1.5px letter-spacing
  Quotes: 14px italic

Layout:
  Max-width: 600px (mobile-first)
  Card padding: 20px
  Card border-radius: 12px
  Section gap: 16px
  Quote: left border 3px accent + gradient bg

Components:
  - Hero card (centered title + subtitle + date)
  - Big number display (current → potential with arrow)
  - Quote card (left accent border + gradient)
  - Opportunity row (name + amount + effort tag)
  - Bar chart (track + fill with color coding)
  - Stat row (label + value)
  - Sticking point (header with severity tag + body + fix)
  - Month card (header with theme + action items with impact)
  - Vision card (gradient border, centered)
```

### Variant-Handoff Methodology (from user)
```
PHASE 1: EXTRACT DESIGN INTELLIGENCE
├─ Colors (hex codes from existing work)
├─ Typography (sizes, weights, families)
├─ Layout (margins, gaps, card sizes)
├─ Components (hero cards, tables, callouts)
└─ Patterns (dark mode, accent bars, borders)

PHASE 2: STRUCTURE CONTENT
├─ Page-by-page breakdown
├─ Hierarchy markers (headers, body, captions)
├─ Data tables (formatted for readability)
├─ Special states (highlighted rows, strikethrough)
└─ Callouts (bottom bars, emphasis boxes)

PHASE 3: EMBED CONTEXT
├─ Design constraints (what NOT to do)
├─ Brand voice (premium, editorial, data-driven)
├─ Technical specs (mobile-first, max-width 600px)
├─ Priority pages (which matter most)
└─ Examples (dark mode hero = emphasis)

PHASE 4: OPTIMIZE FOR TOOL
├─ Variant needs: Complete brief upfront
├─ Natural language (not code/XML)
├─ Visual indicators (ascii tables, ──── dividers)
├─ Component reuse (define once, reference)
└─ Export target (HTML/React-friendly structure)
```

### Key Content Sections for FGCH Analysis (for handoff)
```
1. HERO: "Flour Girl Cakehouse — Workshop Business Analysis"
2. BIG NUMBER: £20-30K → £80-120K
3. QUOTE: "I want us to focus on our health..."
4. REVENUE MAP: 6 opportunities with £ amounts + effort tags
5. CAPACITY: Bar chart showing 17% utilization
6. STATS: 4 rows of zeros (follow-ups, digital, weekday, passive income)
7. STICKING POINTS: 5 items with severity + body + fix
8. 90-DAY PLAN: 3 months × 4 actions each with impact
9. VISION: Where this goes (the emotional close)
10. PROVENANCE: "How this was built" (credibility section)
```

### Bot Scaffold (PARKED — reference only)
```
projects/workshop-accelerator-bot/
├── package.json          Express only
├── .env.example          BOT_TOKEN + NICHOLAS_CHAT_ID
├── src/
│   ├── index.js          Express server + webhook
│   ├── bot.js            State machine: /start → Q0 → Q1..Q10 → DONE
│   ├── telegram.js       Bare TG API helpers
│   ├── questions.js      10 Assess + 5 Planning Qs
│   ├── session.js        In-memory Map() state
│   └── summary.js        Formats answers → Nicholas
└── scripts/
    └── set-webhook.js    Webhook setup

Status: PARKED. Update after each bespoke round.
Pattern: Same as hbs-helper-bot (Railway, bare TG API, Express).
```
