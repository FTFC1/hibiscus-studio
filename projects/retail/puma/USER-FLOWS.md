# PUMA Training App — User Flows

**Date:** 2026-02-14
**Status:** V1 — user reviewed, corrections applied
**Approach:** "What does each person need to DO?" → design screens → wire screens
**Frontend:** Variant UI web app, mobile-first (not Telegram bot — "too much, they didn't understand it")
**Platform:** NOT Selar. Custom web app. Supabase + Vercel/Railway.
**PRD Reference:** `REFERENCE-PRD-vibecoding.txt` — SlideForge PRD as model for backend thinking
**Games:** Build Your Basket, Customer Says, +1 more (TBD) — part of the flow alongside lessons/quizzes

---

## Three User Types

```
┌─────────────────────────────────────────────────────────┐
│                    PUMA TRAINING APP                     │
│                                                         │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│   │  ADMIN   │    │ MANAGER  │    │  SALES   │         │
│   │  (HQ)    │    │ (Store)  │    │ (Floor)  │         │
│   └─────┬────┘    └─────┬────┘    └─────┬────┘         │
│         │               │               │              │
│    Overview        Track Team       Learn + Do          │
│    Configure       Coach Staff     Practice + Prove     │
│    Alerts          Review Scores    Earn Progress       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## SALES STAFF — "Learn quickly, practice, prove it"

**This is the PRIMARY user. 80% of screens serve this person.**

### Jobs to be Done
1. Open app → see what's next (not a wall of choices)
2. Read today's lesson (< 5 min, maybe < 3 min)
3. Take quiz after lesson (5 questions, 80% pass)
4. Play a game (Build Your Basket, Customer Says, +1 TBD)
5. See progress (how far through module)
6. Practice at work → log it happened
7. See leaderboard / peer wins (motivation)
8. Unlock cheat sheet after completing a module

**Flow SPLITS — not linear:**
```
HOME → What's available today?
  ├── 📖 LESSON (read once, unlock cheat sheet after)
  ├── ❓ QUIZ (after lesson, 80% pass gate)
  └── 🎮 GAME (anytime, different frequency)
       ├── Build Your Basket
       ├── Customer Says
       └── [TBD game]
```
Different activities have different frequencies and touch points:
- Lesson: probably viewed once → then cheat sheet available
- Quiz: taken after lesson, can retry
- Game: played multiple times, scores tracked

### Flow

```
┌───────────────────────────────────────────────┐
│  SALES STAFF FLOW                             │
│                                               │
│  LOGIN                                        │
│    ↓                                          │
│  HOME ─────────────────────────────────┐      │
│  ┌────────────────────────────────┐    │      │
│  │  🎯 YOUR NEXT MISSION         │    │      │
│  │  Mission 3: The 70/30 Rule    │    │      │
│  │  ⏱️ 8 min read                │    │      │
│  │  [START] ←── primary action   │    │      │
│  └────────────────────────────────┘    │      │
│  ┌────────────────────────────────┐    │      │
│  │  📊 YOUR PROGRESS             │    │      │
│  │  ████████░░░░ 3/6 missions    │    │      │
│  │  Quiz avg: 87%                │    │      │
│  │  Streak: 4 days               │    │      │
│  └────────────────────────────────┘    │      │
│  ┌────────────────────────────────┐    │      │
│  │  🏆 TEAM WINS                 │    │      │
│  │  Peter: completed Mission 4!  │    │      │
│  │  Adedolapo: 100% on quiz 2   │    │      │
│  └────────────────────────────────┘    │      │
│    │                                   │      │
│    ▼                                   │      │
│  LESSON SCREEN                         │      │
│  ┌────────────────────────────────┐    │      │
│  │  MISSION 3: THE 70/30 RULE    │    │      │
│  │                                │    │      │
│  │  [VISUAL: diagram/illustration]│    │      │
│  │                                │    │      │
│  │  Caption text explaining...    │    │      │
│  │  (visual first, text assists)  │    │      │
│  │                                │    │      │
│  │  ──── sections ────            │    │      │
│  │  The Problem                   │    │      │
│  │  The Rule                      │    │      │
│  │  Example                       │    │      │
│  │  Today's Practice              │    │      │
│  │                                │    │      │
│  │  [TAKE QUIZ →]                 │    │      │
│  └────────────────────────────────┘    │      │
│    │                                   │      │
│    ▼                                   │      │
│  QUIZ SCREEN                           │      │
│  ┌────────────────────────────────┐    │      │
│  │  Q1 of 5                       │    │      │
│  │  Customer says "Let me think"  │    │      │
│  │  What's your first move?       │    │      │
│  │                                │    │      │
│  │  ○ Offer 10% discount          │    │      │
│  │  ● Ask what's making them      │    │      │
│  │    hesitate                    │    │      │
│  │  ○ Say "no problem" and let go │    │      │
│  │  ○ Repeat the product benefits │    │      │
│  │                                │    │      │
│  │  [NEXT →]                      │    │      │
│  └────────────────────────────────┘    │      │
│    │                                   │      │
│    ▼                                   │      │
│  RESULTS SCREEN                        │      │
│  ┌────────────────────────────────┐    │      │
│  │  ✅ 4/5 CORRECT (80%)         │    │      │
│  │  Mission 3 COMPLETE!           │    │      │
│  │                                │    │      │
│  │  ❌ Q3: The right answer was...│    │      │
│  │  (show correction inline)      │    │      │
│  │                                │    │      │
│  │  📋 TODAY'S PRACTICE:          │    │      │
│  │  □ Pick 3 customers            │    │      │
│  │  □ Ask 4 questions BEFORE      │    │      │
│  │    showing product             │    │      │
│  │  □ Track: asking more =        │    │      │
│  │    better recommendations?     │    │      │
│  │                                │    │      │
│  │  Next mission unlocks: Wed     │    │      │
│  │  [BACK TO HOME]               │    │      │
│  └────────────────────────────────┘    │      │
│                                        │      │
│  PRACTICE LOG (from home)       ◄──────┘      │
│  ┌────────────────────────────────┐           │
│  │  ✍️ LOG TODAY'S PRACTICE       │           │
│  │                                │           │
│  │  Which mission did you apply?  │           │
│  │  [Mission 3: 70/30 Rule  ▾]   │           │
│  │                                │           │
│  │  How many customers?  [3]      │           │
│  │  What happened? (quick note)   │           │
│  │  ┌──────────────────────────┐  │           │
│  │  │ Asked 4 questions to 3   │  │           │
│  │  │ customers. 2 bought more │  │           │
│  │  │ than expected...         │  │           │
│  │  └──────────────────────────┘  │           │
│  │                                │           │
│  │  [SUBMIT ✓]                    │           │
│  └────────────────────────────────┘           │
│                                               │
└───────────────────────────────────────────────┘
```

### MVP Screens (Sales)
| # | Screen | Priority | Notes |
|---|--------|----------|-------|
| 1 | Home (next mission + progress) | P0 | Single clear action |
| 2 | Lesson (visual + caption) | P0 | Visual-first, text assists |
| 3 | Quiz | P0 | 5 questions, pass/fail |
| 4 | Results | P0 | Correction + practice checklist |
| 5 | Game Screen (Build Your Basket / Customer Says) | P0 | Part of core flow |
| 6 | Practice Log | P1 | Simple form, could be V2 |
| 7 | Leaderboard / Team Wins | P1 | Motivation, could be V2 |
| 8 | Cheat Sheet (unlocked after module complete) | P1 | Reward/reference |

---

## MANAGER — "Track team, coach, be alerted"

### Jobs to be Done
1. See who's on track, who's behind (at a glance)
2. Get alerted when someone completes / falls behind
3. Review quiz scores per person
4. Post wins to motivate team
5. Do weekly review (10 min Friday)

### Flow

```
┌───────────────────────────────────────────────┐
│  MANAGER FLOW                                 │
│                                               │
│  LOGIN                                        │
│    ↓                                          │
│  DASHBOARD                                    │
│  ┌────────────────────────────────┐           │
│  │  📊 TEAM OVERVIEW              │           │
│  │                                │           │
│  │  7 staff | Module 1            │           │
│  │  ┌─────────────────────────┐   │           │
│  │  │ ✅ On Track    4        │   │           │
│  │  │ ⚠️ Behind     2        │   │           │
│  │  │ 🔴 Stale      1        │   │           │
│  │  └─────────────────────────┘   │           │
│  │                                │           │
│  │  🔔 ALERTS                     │           │
│  │  • Peter completed M4 (today)  │           │
│  │  • Molade hasn't opened M2     │           │
│  │    (3 days — needs nudge)      │           │
│  │                                │           │
│  │  📈 THIS WEEK                  │           │
│  │  Avg quiz score: 84%           │           │
│  │  Lessons completed: 12/18      │           │
│  │  Practice logs: 8              │           │
│  │                                │           │
│  └────────────────────────────────┘           │
│    │                                          │
│    ▼                                          │
│  STAFF DETAIL (tap any staff member)          │
│  ┌────────────────────────────────┐           │
│  │  PETER — Sales Staff           │           │
│  │                                │           │
│  │  Progress: ████████░░ 4/6      │           │
│  │  Quiz scores: 80 85 90 95      │           │
│  │  Game scores: Basket 85, CS 92 │           │
│  │  Practice logs: 3 submitted    │           │
│  │  Last active: 2 hours ago      │           │
│  │  Status: ✅ On Track           │           │
│  │                                │           │
│  │  [SEND ENCOURAGEMENT]          │           │
│  │  [VIEW PRACTICE LOGS]          │           │
│  └────────────────────────────────┘           │
│    │                                          │
│    ▼                                          │
│  WEEKLY REVIEW (Friday)                       │
│  ┌────────────────────────────────┐           │
│  │  📋 WEEK 3 REVIEW              │           │
│  │                                │           │
│  │  Completions: 12/18 (67%)      │           │
│  │  Avg score: 84%                │           │
│  │  Top performer: Peter          │           │
│  │  Needs attention: Molade       │           │
│  │                                │           │
│  │  Basket size trend:            │           │
│  │  W1: ₦22K → W2: ₦25K → W3: ? │           │
│  │  (manual input until POS link) │           │
│  │                                │           │
│  │  [EXPORT REPORT]               │           │
│  │  [POST WIN TO TEAM]            │           │
│  └────────────────────────────────┘           │
│                                               │
└───────────────────────────────────────────────┘
```

### MVP Screens (Manager)
| # | Screen | Priority | Notes |
|---|--------|----------|-------|
| 1 | Dashboard (team overview + alerts) | P0 | At a glance |
| 2 | Staff Detail | P0 | Drill into individual |
| 3 | Weekly Review | P1 | Could be auto-generated report |
| 4 | Send Encouragement | P2 | Nice to have |

---

## ADMIN — "Overview, configure, spot stale users"

### Jobs to be Done
1. See overall program health across stores
2. Know about stale users (who dropped off)
3. Configure modules (assign, schedule, unlock)
4. Export data (CSV, report)
5. Add/remove staff

### Flow

```
┌───────────────────────────────────────────────┐
│  ADMIN FLOW                                   │
│                                               │
│  LOGIN                                        │
│    ↓                                          │
│  ADMIN PANEL                                  │
│  ┌────────────────────────────────┐           │
│  │  🏢 PROGRAM OVERVIEW           │           │
│  │                                │           │
│  │  Stores: 1 (Lekki pilot)      │           │
│  │  Staff enrolled: 7             │           │
│  │  Module: 1 of 3               │           │
│  │  Overall completion: 67%       │           │
│  │                                │           │
│  │  ⚠️ STALE USERS (no activity 3d+) │       │
│  │  • Molade — last active Feb 11 │           │
│  │    [NUDGE] [REMOVE]            │           │
│  │                                │           │
│  │  📊 COMPLETION HEATMAP         │           │
│  │     M1  M2  M3  M4  M5  M6    │           │
│  │  P  ✅  ✅  ✅  ✅  ░░  ░░    │           │
│  │  A  ✅  ✅  ✅  ░░  ░░  ░░    │           │
│  │  M  ✅  ░░  ░░  ░░  ░░  ░░    │           │
│  │  ...                           │           │
│  └────────────────────────────────┘           │
│    │                                          │
│    ├─── CONFIGURE ──────────────────┐         │
│    │  ┌────────────────────────────┐│         │
│    │  │  MODULE SETTINGS           ││         │
│    │  │  Drip: Mon/Wed/Fri  [edit] ││         │
│    │  │  Pass threshold: 80% [edit]││         │
│    │  │  Module 2: [ASSIGN →]      ││         │
│    │  └────────────────────────────┘│         │
│    │                                │         │
│    ├─── MANAGE STAFF ───────────────┤         │
│    │  ┌────────────────────────────┐│         │
│    │  │  [+ ADD STAFF]             ││         │
│    │  │  [REMOVE STAFF]            ││         │
│    │  │  (no bulk import/export —  ││         │
│    │  │   we own the data)         ││         │
│    │  └────────────────────────────┘│         │
│    │                                │         │
│    └────────────────────────────────┘         │
│                                               │
└───────────────────────────────────────────────┘
```

### MVP Screens (Admin)
| # | Screen | Priority | Notes |
|---|--------|----------|-------|
| 1 | Program Overview + Stale Users | P0 | Core need |
| 2 | Completion Heatmap | P0 | Visual at-a-glance |
| 3 | Module Settings | P1 | Configure drip/threshold |
| 4 | Staff Management | P1 | Add/remove only (we own the data) |

---

## SCREEN INVENTORY — MVP (P0 only)

```
TOTAL MVP SCREENS: 9

SALES (5 screens — 56%)
├── Home (next mission/game + progress + team wins)
├── Lesson (visual-first + caption text)
├── Quiz (5 questions, pass/fail)
├── Results (correction + practice checklist)
└── Game (Build Your Basket / Customer Says)

MANAGER (2 screens — 22%)
├── Dashboard (team overview + alerts + game scores)
└── Staff Detail (individual progress + quiz + game scores)

ADMIN (2 screens — 22%)
├── Program Overview + Stale Users
└── Completion Heatmap
```

---

## INFORMATION ARCHITECTURE

```
APP
├── / (login — role detected → route to correct home)
│
├── /sales/
│   ├── home          ← next mission/game, progress bar, team wins
│   ├── lesson/:id    ← visual + caption content (viewed once)
│   ├── quiz/:id      ← 5 questions per mission (after lesson)
│   ├── results/:id   ← score + corrections + practice checklist
│   ├── game/:id      ← Build Your Basket / Customer Says (P0)
│   ├── cheatsheet/:id ← unlocked after module completion (P1)
│   ├── practice/log  ← submit practice notes (P1)
│   └── leaderboard   ← team rankings + game scores (P1)
│
├── /manager/
│   ├── dashboard     ← team overview, alerts, game scores, weekly stats
│   ├── staff/:id     ← individual progress + quiz + game scores
│   ├── review        ← weekly review auto-summary (P1)
│   └── encourage/:id ← send encouragement to staff member (P1)
│
├── /admin/
│   ├── overview      ← program health, stale users, heatmap
│   ├── configure     ← module settings, drip schedule (P1)
│   └── staff         ← add/remove staff only (we own the data) (P1)
│
└── /shared/
    ├── login
    ├── profile       ← name, role, store
    └── notifications ← alerts feed (P1)
```

---

## WIRING: What Happens Behind Each Screen

| Screen | Data Source | Backend Action |
|--------|-----------|----------------|
| Sales Home | DB: user progress, next mission | Read only |
| Lesson | DB: mission content (from compressed MD) | Read only |
| Quiz | DB: questions.json (existing) | Write: save answers |
| Results | DB: quiz scores + practice items | Write: save score, update progress |
| Practice Log | DB: practice submissions | Write: save log entry |
| Manager Dashboard | DB: all staff progress | Read + aggregate |
| Staff Detail | DB: one staff member's data | Read only |
| Admin Overview | DB: all data + stale calculation | Read + compute |
| Heatmap | DB: completion matrix | Read + compute |

---

## VISUAL-FIRST LESSON FORMAT

**Key insight from user:** "The visual conveys the message faster. Text is captioning/annotation."

```
CURRENT (text-first):          GOAL (visual-first):
┌──────────────────┐          ┌──────────────────┐
│ THE PROBLEM      │          │ [ILLUSTRATION]   │
│ Customer walks   │          │ Customer alone,  │
│ in. You're       │          │ staff restocking,│
│ restocking...    │          │ arrow showing    │
│                  │          │ customer leaving │
│ Cost: ₦15.6M/yr │          │                  │
│                  │          │ ₦15.6M/year lost │
│ THE RULE         │          │ from this moment │
│ 5 sec: eye       │          ├──────────────────┤
│ 30 sec: approach │          │ THE RULE         │
│ 60 sec: always   │          │ 5→30→60          │
│                  │          │ [VISUAL TIMELINE]│
│ ...etc...        │          │                  │
│                  │          │ Caption: "Eye    │
│                  │          │ contact in 5,    │
│                  │          │ approach in 30,  │
│                  │          │ always by 60."   │
└──────────────────┘          └──────────────────┘
```

**For MVP:** Use AI-generated illustrations or simple diagrams. Each mission gets 2-3 key visuals that land the point before text assists.

---

## VISUAL-FIRST APPROACH — Modular Pipeline

**Key insight:** Don't jump to image generation (expensive, slow). Build up in layers:

```
LAYER 1: ASCII art    → hone the angle, message, layout
LAYER 2: JSON schema  → structure the data (what goes where)
LAYER 3: Wireframe    → Variant UI components, mobile-first
LAYER 4: Visual       → AI illustrations / branded graphics (last, expensive)
```

This is the same modular approach as the engine: low-fi → validate → expensive layer.

---

## NEXT STEPS — PRD-DRIVEN BUILD

**Reference:** `REFERENCE-PRD-vibecoding.txt` — 23-page SlideForge PRD shows the level of backend thinking needed.

**What to adapt from the PRD approach:**
1. Database schema (users, modules, lessons, quizzes, games, progress, scores)
2. API endpoints (edge functions for quiz scoring, progress tracking, game logic)
3. Design system (Variant UI tokens — colors, spacing, typography)
4. Component library (buttons, cards, progress bars, quiz UI, game UI)
5. Edge cases (offline handling, stale users, retry on fail)
6. Notification flow (email trigger → open web app → role-based view)

**Build sequence:**
1. ✅ User flows (THIS document — V1 done)
2. **NEXT: Database schema** — adapt SlideForge pattern for training app
3. **NEXT: API endpoints** — define what each screen calls
4. **NEXT: Build Sales Home screen** — in Variant UI, mobile-first
5. **NEXT: Wire to Supabase** — real data, real auth
6. **NEXT: Deploy** — Vercel or Railway, share with Timi

**Platform decisions confirmed:**
- Frontend: Next.js + Variant UI patterns (mobile-first)
- Backend: Supabase (auth, DB, storage)
- Hosting: Vercel or Railway (no spike charges)
- Notification: Email trigger (not Telegram, not WhatsApp automation)
- Data ownership: We own all data. No export feature for admins.
