---
session_id: 2026-02-13-conv-ops-r11-fgch
session_date: 2026-02-13
status: checkpoint
projects_touched: [ALOE, HB, INFRA]
work_types: [recursive-evaluation, data-processing, strategy, product-design]
context_remaining: ~15%
pickup_priority: Read FGCH Business Profile → continue /recursive Round 12+ with REAL data → scaffold /casestudy skill
---

# Checkpoint: Conv Ops Platform R9-11 + FGCH Data Processing

**Date:** 2026-02-13
**Status:** 🔄 Checkpoint (context window low)
**Context Remaining:** ~15%

---

## WHERE WE ARE

Continued /recursive from Round 8 checkpoint. Corrected Flower Girl bot spec (workshop ACCELERATOR for OWNERS, not booking for attendees). Ran Rounds 9-11, all 10 criteria now at 9+/10 — SHIPPED. Then processed Rochelle's TG export (148 messages, 121 min media) token-efficiently using background transcription + subagents. Produced complete FGCH Business Profile + Case Study "Before" state. Rochelle said more videos coming — process tomorrow.

---

## DECISIONS MADE (confirmed this session)

### /recursive Rounds 9-11
1. Flower Girl Bot = Workshop ACCELERATOR for workshop OWNERS (B2B), not booking for attendees (B2C)
2. Calculator → Bot funnel for workshop OWNERS to craft their offering
3. Attendees book directly (IG/word of mouth) — not the bot's job
4. Intelligence engine = CENTERPIECE for this vertical (not Assess like PRL)
5. Intelligence Mode A (metric/PRL) vs Mode B (advisory/workshop) — same engine, different config
6. Nicholas insertion point = AFTER Analyze, AT Craft (the consulting meeting)
7. Output = TG messages (base) + upsell tiers in conversation (PDF, spreadsheet, etc.)
8. Calculator data flows into bot (no repeat — questions go DEEPER)
9. Detailed analysis WITH REASONING is what they pay for
10. Help acting on plan = consulting upsell (retainer)
11. Dog-food: V1-V7 Nicholas is 70-80% involved, gradually removes
12. Landing page (Loop) for paywall
13. 3-phase automation: Phase 1 (dog-food, 70-80% Nicholas) → Phase 2 (3-5 owners, 40-50%) → Phase 3 (10+, 10-20%)
14. Feedback loop = weekly review (Option C), intervention rate tracking
15. Criterion #9 reframed: "Value delivery independence" (not "revenue per hour")
16. Attendee booking funnel = separate future product (PARKED)

### From adversarial test
17. Add routing for experienced owners (fast-track to consulting)
18. Retainer pricing proportional to client revenue, not flat $2K

### Data processing decisions
19. Token-efficient pipeline: agents process, main context stays clean
20. D then B approach: text messages first (free), then big voice messages, videos last
21. Process what's here now, remaining videos tomorrow
22. FGCH Business Profile + Case Study Before = two outputs from one pass
23. /casestudy skill needed (not built yet — scaffold after real example complete)

---

## DECISIONS PENDING

- [ ] /casestudy skill: scaffold now or wait for "after" data?
- [ ] Loop page design for $5-27 paywall
- [ ] Exact upsell pricing within bot conversation
- [ ] Retainer tiers based on client revenue
- [ ] Remaining Rochelle videos — when does she finish uploading?
- [ ] When to schedule the Rochelle dog-food run (V8)?

---

## ITEMS EXTRACTED BUT NOT ACTIONED

1. **FGCH Business Profile** — saved to `hb/FGCH-BUSINESS-PROFILE.md` but not yet fed into bot design
2. **12 sticking points identified** — can feed directly into bot Assess question bank
3. **Competitor data** — One Cake Street £65, Tabby's Cakes, Ava Experiences — not used yet
4. **Revenue opportunity** — £20-30K current → £80-120K potential — not shared with Rochelle yet
5. **1 real lead** — @blessingbakes (£780 profit, £140 × 17 pax) — not followed up
6. **VA question** — "Is the system sending chase emails?" — answered (no) but no SOP built
7. **Princess client** — deprioritized, will wait for next availability
8. **Bot spec from Round 11** — exists in conversation, not extracted to standalone file yet
9. **Notion DB restructure plan** — exists from prior session, not executed (separate stream)

---

## FILES CREATED/MODIFIED THIS SESSION

### Created
- `hb/FGCH-BUSINESS-PROFILE.md` — 456-line business profile + case study before state
- `sessions/2026-02-13-conv-ops-r11-fgch-checkpoint.md` — THIS FILE
- `inbox/Feb 12/MF Feb 12 2124/processing/*.txt` — 18 transcripts (14 videos + 4 voice messages)
- `/tmp/process-flower-girl.sh` — transcription pipeline script (reusable for remaining videos)

### NOT modified (should be updated next session)
- `hud/v4-data.js` — needs FGCH processing added to shipped/wins
- `sessions/LAUNCH.md` — needs update
- `memory/projects.md` — Flower Girl section needs FGCH data

---

## PICKUP INSTRUCTIONS

### Read These First
- `sessions/2026-02-13-conv-ops-r11-fgch-checkpoint.md` (THIS FILE)
- `hb/FGCH-BUSINESS-PROFILE.md` (the complete business profile — 456 lines, everything about FGCH)
- `sessions/2026-02-12-conv-ops-r8-checkpoint.md` (corrections from Round 8 — still relevant context)

### Then Do This
1. **Check if Rochelle uploaded more videos** — look in `inbox/Feb 12/MF Feb 12 2124/` for new files. If yes, run `/tmp/process-flower-girl.sh` again (it skips already-processed files).
2. **Extract bot spec to standalone file** — the Workshop Accelerator spec from Round 11 is in conversation only. Write it to `hb/flower-girl-bot-spec.md` with question bank, analysis templates, output format.
3. **Continue /recursive Round 12+** — now with REAL FGCH data. The bot Assess questions can reference actual pricing (£45-50), actual sticking points (no follow-ups, empty weekdays), actual competitors (One Cake Street £65). This makes the spec concrete, not placeholder.
4. **Consider /casestudy scaffold** — user asked for it. Design the skill so case study material is a byproduct of client processing, not separate work.
5. **Run /session-update** when done — update HUD with FGCH processing, conv ops R11 shipped, case study before captured.

### User Needs To Answer
- Has Rochelle finished uploading? ("Haven't finished" was her last message)
- When does the Rochelle dog-food (V8) start?
- Should we scaffold /casestudy now or after the "after" data exists?

---

## RAW CONTEXT (for next session)

### /recursive Final Scores (Round 11 — SHIPPED)
```
 #  Criterion                  Score  Status
 1  Delivery clarity           9      Three tiers, engine mapping, Nicholas insertion, upsells
 2  Time to live               9      2-3 weeks for Rochelle pilot
 3  Reusability                9      70/30 template. Baker → fitness → events
 4  Operational load           9      Phase 1 heavy but designed to reduce
 5  Value demonstration        9      Rochelle dog-food = the demo (before/after)
 6  Upsell path                9      $5 → analysis → meeting → upsells → retainer
 7  Documentation              9      Standalone spec + question bank + analysis templates
 8  Content portability        9      Config folder pattern
 9  Value delivery independence 9     3-phase path + weekly review feedback loop
10  Defensibility              9      Intelligence moat grows with each client

ALL 10/10 AT 9+ ✅ — ADVERSARIAL PASSED
```

### Workshop Accelerator Service Architecture (Round 10-11)
```
TIER 1: Calculator (free) → what running a workshop involves
TIER 2: Bot Accelerator ($5-27 via Loop page)
  Phase A — ASSESS (bot-led, 10-15 min)
  Phase B — ANALYZE (bot drafts, Nicholas reviews in Phase 1)
  Phase C — CRAFT (Nicholas meeting = conversion point)
  Output: TG messages (base) + upsell tiers
TIER 3: Operations Retainer ($2K+/month)
  Bot: "How did last Saturday go?" → updates model
  Nicholas: periodic consulting, help acting on plan
```

### FGCH Key Numbers (from Business Profile)
```
Revenue:     £20-30K current → £80-120K potential
Products:    7 (3 active, 2 planned, 1 paused, 1 dead)
Pricing:     Bento £45-50 (market: £65), Ganache £350-900
Schedule:    36 active weeks/year, 30 unused weekday hrs/week
Team:        Rochelle solo + VA + freelancer (May)
Follow-ups:  ZERO automated
Weekday rev: ZERO
Digital:     ZERO products
```

### TG Export Stats
```
Group:     Motion x Flour (148 msgs, Feb 10-12)
Senders:   Rochelle 81, Nicholas 49, Bot 13
Media:     35 voice (76 min) + 14 video (45 min) = 121 min
Processed: 18 transcripts (14 video + 4 big voice)
Remaining: ~32 short voice messages (15-30 sec each, low value)
           + whatever Rochelle uploads next
```

### Processing Pipeline (reusable)
```
Script:  /tmp/process-flower-girl.sh
What:    ffmpeg audio extract → mlx_whisper transcribe → .txt
Output:  inbox/Feb 12/MF Feb 12 2124/processing/*.txt
Skips:   already-processed files (idempotent)
Cost:    0 API tokens (local compute only)
Time:    ~10 min for 18 files
```

### Agent Outputs (reference)
```
Text parse:     /private/tmp/.../tasks/a112e9d.output (148 msg structured)
Synthesis:      /private/tmp/.../tasks/a5b7206.output (business profile)
Transcription:  bb37c7b (completed, all 18 files)
```
