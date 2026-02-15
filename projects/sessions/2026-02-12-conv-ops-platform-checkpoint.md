---
session_id: 2026-02-12-conv-ops-platform
session_date: 2026-02-12
status: checkpoint
projects_touched: [FORJE, HB, INFRA, ALOE]
work_types: [strategy, research, recursive-evaluation]
context_remaining: ~10%
pickup_priority: Download Rochelle's Flower Girl TG videos and start business ops bot
---

# Checkpoint: Conversational Operations Platform Discovery

**Date:** 2026-02-12
**Status:** 🔄 Checkpoint (context window low)
**Context Remaining:** ~10%

---

## WHERE WE ARE

4-round /recursive exploration that evolved from "training as a service" (Round 1) → "conversational operations" (Round 2) → voice+media as differentiator (Round 3) → business ops bot as highest-scoring vertical + EP framework validation (Round 4). Platform identity converged. Ready to build Flower Girl bot as proof of concept #2 (alongside PRL training trial starting Tuesday).

---

## DECISIONS MADE (confirmed)

1. **Platform = "conversational ops engine" internally.** Context-dependent naming externally (training platform / business ops partner / client intake bot depending on audience).
2. **5 universal engines:** Assess, Practice, Deliver, Channel, Intelligence. Same stack, different content + routing per vertical.
3. **"I'll send you a bot" = the pattern.** Replaces forms, calls, PDFs, meetings with multimedia conversations.
4. **Voice + media = technical edge.** Forms can't accept voice notes. This is the positioning differentiator. (But wording still needs work — "conversations that understand voice notes" doesn't land yet.)
5. **$5 paywall = door, not room.** Commitment filter for workshop bot. Revenue lives in $2K+/month retainer.
6. **EP pricing: hybrid model.** Setup fee ($3-5K) + monthly retainer ($500-1K) + performance bonus. Don't pick one.
7. **Phase 2 = agents, not junior hires.** User explicitly said "I can just make agents" instead of hiring.
8. **N-ATLaS bookmarked, not integrated.** Yoruba too weak (2.7/5). Revisit for Northern Nigeria expansion (Hausa 4.0/5).
9. **Telegram groups, NOT WhatsApp groups** for data extraction. This is why they moved to Telegram.
10. **Flower Girl bot = dog-fooding the service.** Help Rochelle build something to run her workshops, then unbundle parts and sell them.
11. **Practice engine NOT needed for Flower Girl right now.** She doesn't need scenario training — she needs business ops infrastructure.
12. **HBS/Flower Girl is an anchor client BEFORE PRL** — Rochelle has been working with Nicholas longer. PRL has more scaling potential but Flower Girl is more immediate.
13. **Case study flywheel = document every client automatically.** Idea: case study bot that helps with documentation after each engagement.
14. **Build order revised:** PRL trial (Tue) → Flower Girl bot (today/tomorrow) → other stuff later. QR code hub and client intake NOT priority right now.

---

## DECISIONS PENDING (need user yes/no)

- [ ] What does "workshop management" include specifically? (The retainer — what do they get for $2K/month?)
- [ ] Positioning wording — "streamline your processes into a conversation" vs something else? Current options all feel incomplete.
- [ ] Flower Girl bot: which TG group to pull from? How many videos/voice notes to start with?
- [ ] PRL pricing: are we charging for the trial? (Currently: 6 weeks free. When does pricing conversation happen?)

---

## ITEMS EXTRACTED BUT NOT ACTIONED

1. **Flower Girl TG group content** — Rochelle uploading 8-20 videos/voice notes. User wants to download today and start processing.
2. **Case study bot concept** — auto-document every client engagement. Not built, not designed.
3. **QR code hub page** — one URL → multiple entry points. ~2h build. User says "not now, need portfolio first" but has "some stuff."
4. **Positioning statement** — technical edge confirmed but wording doesn't land. Needs /recursive on copy.
5. **N-ATLaS model** — `huggingface.co/NCAIR1/N-ATLaS` — Llama-3 8B for Hausa/Igbo/Yoruba. Bookmarked for future.
6. **EP distribution lesson** — "100 days, 100 pictures" content idea. User mentioned sending pitches with visual content daily. Not fleshed out.

---

## FILES CREATED/MODIFIED THIS SESSION

- `sessions/2026-02-12-puma-demo-delivery.md` — Session packet (demo + transcript + recursive eval)
- `hud/v4-data.js` — Updated: recentShipped (6 new), wins (5 new FORJE), midGoals, waiting, Mairo closed
- `sessions/LAUNCH.md` — Regenerated with post-demo state + platform insight section
- `retail/puma/demo-speaker-notes.html` — 4 iterations (tab fix, light mode, Nigerian images, emoji removal)
- `retail/puma/meeting-flow.png`, `demo-screen.png`, `staff-play.png` — AI images (Round 2, Nigerian representation)
- `/tmp/puma-training-demo/` — GitHub Pages repo, 4 commits pushed

---

## PICKUP INSTRUCTIONS

### Read These First
- `sessions/2026-02-12-conv-ops-platform-checkpoint.md` (this file)
- `sessions/2026-02-12-puma-demo-delivery.md` (demo context)
- `hud/v4-data.js` (current state)
- `memory/MEMORY.md` (rules + context)

### Then Do This
1. **Ask Nicholas which TG group has Rochelle's Flower Girl content** (videos/voice notes)
2. **Download + process Flower Girl videos** using /video or /process-convo pipeline
3. **Design Flower Girl business ops bot** — not a booking bot, a business intelligence partner that also books. Pull from TG group → transcribe → understand business model → ask follow-ups → "here's how to price, here's your costs"
4. **PRL trial prep** (if Timi has TG accounts): compress lessons to 2-3 pages, set up reporting

### User Preferences for Next Session
- Flower Girl bot is personal priority (HBS = anchor client)
- PRL trial = locked for Tuesday but waiting on Timi for staff TG accounts
- Don't build QR code hub or client intake bot yet
- Don't think about PRL scaling — think about what makes a pitch-ready thing Nicholas can send to new prospects
- Phase 2 = agents (automated workers), not human junior hires

---

## RAW CONTEXT (for next session)

### Vertical Scoring (Round 4 Final)

```
VERTICAL                  SCORE  9+/6   VERDICT
──────────────────────────────────────────────────────────────────
Business Ops Bot (Flower)  9.7   6/6    ★★★ BUILD (dog-food the service)
Client Intake (Aloe Labs)  9.3   6/6    ★★★ NOT NOW (later)
Lead Qualification (DSG)   8.8   5/6    ★★  LATER (after intake)
Product Knowledge (PRL)    8.7   3/6    ★   DURING TRIAL (upsell)
Onboarding                 8.5   3/6    ★   SAME BUYER (upsell)
Quote Comparison           7.7   1/6    🟡  PARK (new engineering)
```

### Platform Identity

```
INTERNAL: Conversational ops engine
EXTERNAL (context-dependent):
  Retail ops → "Staff training platform"
  Workshop owner → "Business operations partner"
  Freelancer → "Client intake bot"
  EP framework → "Automation + Implementation hybrid"

PATTERN: "I'll send you a bot" replaces forms, calls, PDFs, meetings

5 ENGINES: Assess | Practice | Deliver | Channel | Intelligence
EDGE: Voice + media inputs (voice notes, photos, screen recordings)
```

### EP Key Frameworks Applied

```
- $5 = commitment filter, not revenue (door, not room)
- Hybrid pricing: setup + retainer + performance bonus
- Case study flywheel: ONE niche → document → share → NODE referrals
- Phase 1 (build) → Phase 2 (document + agents) → Phase 3 (platform)
- Don't name the platform yet. Name the outcome per audience.
- Voice + media = Technical Edge (EP M2 Ch1 L4)
- Rule of Three: don't abstract until 3 clients use it
```

### N-ATLaS Reference

```
Model: huggingface.co/NCAIR1/N-ATLaS
What: Llama-3 8B fine-tuned for Hausa/Igbo/Yoruba/English
Made by: Awarri Technologies + NCAIR (Nigerian govt)
Performance: English 4.2/5, Hausa 4.0/5, Igbo 3.9/5, Yoruba 2.7/5
Use: TEXT processing (not speech). Needs Whisper upstream for voice.
Status: BOOKMARKED. Yoruba too weak for Lagos use. Revisit for Northern expansion.
License: Free up to 1,000 users, commercial needs agreement.
```

### Demo Performance (from earlier this session)

```
14-criteria /recursive eval: 6.9/10 average, 0/14 at 9+
Key insight: product is stronger than presentation
Top 3 fixes: follow speaker notes, accept feedback first, show more narrate less
Trial: 6 weeks free, Puma Lekki, starts Tuesday
Open: compress lessons, get staff TG accounts, set up reporting
```
