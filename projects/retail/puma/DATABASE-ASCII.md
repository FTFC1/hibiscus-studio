# PUMA Training App — Database Design (ASCII)

**Date:** 2026-02-14
**Status:** V1 — user reviewed, corrections applied
**Principle:** "Review at the level you think. Build at the level the machine needs."
**Next:** User says yes → translate to Supabase SQL

---

## THE PEOPLE

```
┌──────────────────────────────┐
│  STORE                       │
│  ─────                       │
│  name: "Puma Lekki"          │
│  location: "Lekki, Lagos"    │
│  status: active / paused     │
└──────────┬───────────────────┘
           │
           │ "a store has many people"
           │
┌──────────▼───────────────────┐
│  USER                        │
│  ─────                       │
│  name: "Peter"               │
│  email: peter@puma.ng        │
│  role: sales / manager       │
│        / admin               │
│  store: → Puma Lekki         │
│  phone: 080xxxxxxxx          │
│  whatsapp: (if different)    │
│  telegram: @handle (optional)│
│  last_active: Feb 14         │
│  status: active / stale      │
│  streak: 4 days              │
│                              │
│  Contact fields are optional │
│  — we add as needed. Basics  │
│  first, expand later.        │
└──────────────────────────────┘

  "Stale" = last_active > 3 days ago.
  Manager sees this. Admin sees this.
  Streak = consecutive days of engagement
  (lesson, quiz, game, or daily review).
```

---

## THE CONTENT

```
┌──────────────────────────────┐
│  MODULE                      │
│  ─────                       │
│  name: "Module 1"            │
│  description: "Retail Sales  │
│    Foundations"               │
│  mission_count: 6            │
│  order: 1                    │
└──────────┬───────────────────┘
           │
           │ "a module has many missions"
           │
┌──────────▼───────────────────┐
│  MISSION (= Lesson)          │
│  ─────                       │
│  name: "The 5-30-60 Rule"    │
│  order: 1 (within module)    │
│  content_md: (lesson text)   │
│  visual_key: (pointer to     │
│    illustration/diagram)     │
│  read_time: "2 min"          │
│  practice_checklist: [       │
│    "Greet in 5 sec",         │
│    "Approach 80%+",          │
│    "Kill can I help you"     │
│  ]                           │
└──────────┬───────────────────┘
           │
           │ "a mission has one quiz"
           │
┌──────────▼───────────────────┐
│  QUIZ                        │
│  ─────                       │
│  mission: → Mission 1        │
│  pass_threshold: 80%         │
│  question_count: 5           │
└──────────┬───────────────────┘
           │
           │ "a quiz has many questions"
           │
┌──────────▼───────────────────┐
│  QUESTION                    │
│  ─────                       │
│  text: "Customer says 'Let   │
│    me think.' First move?"   │
│  options: [                  │
│    "Offer 10% discount",     │
│    "Ask what's making them   │
│     hesitate",          ← ✓  │
│    "Say no problem",         │
│    "Repeat benefits"         │
│  ]                           │
│  correct_answer: 1           │
│  explanation: "Probe before  │
│    offering solutions..."    │
└──────────────────────────────┘
```

---

## THE GAMES

```
┌──────────────────────────────┐
│  GAME                        │
│  ─────                       │
│  name: "Build Your Basket"   │
│  type: basket / scenario     │
│        / tbd                 │
│  description: "Add items to  │
│    hit basket value target"  │
│  principle: "Upselling and   │
│    cross-selling skills"     │
│    (what this game teaches)  │
│  config: (game-specific      │
│    settings as JSON)         │
│  related_missions: [1, 2]    │
│    (which missions this      │
│     game reinforces)         │
└──────────┬───────────────────┘
           │
           │ "Build Your Basket needs real products"
           │
┌──────────▼───────────────────┐
│  PRODUCT CATALOG             │
│  ─────                       │
│  name: "Puma RS-X"           │
│  category: "Running Shoes"   │
│  price: ₦45,000              │
│  related_products: [         │
│    "Socks", "Insoles",       │
│    "Running shorts"          │
│  ]                           │
│                              │
│  Loaded from store's CSV /   │
│  Excel of real products.     │
│  Makes the game feel real —  │
│  staff practice with their   │
│  actual inventory.           │
└──────────────────────────────┘

Games exist ALONGSIDE missions, not inside them.
Sales staff can play anytime.
```

---

## REWARDS (beyond cheat sheets)

```
┌──────────────────────────────┐
│  REWARD                      │
│  ─────                       │
│  name: "Module 1 Cheat       │
│    Sheet"                    │
│  type: cheat_sheet /         │
│    badge / certificate /     │
│    custom                    │
│  trigger: module_complete /  │
│    quiz_perfect_score /      │
│    game_high_score /         │
│    streak_7_days /           │
│    manager_given             │
│  content: (the cheat sheet   │
│    markdown, or badge image, │
│    or certificate text)      │
│  module: → Module 1          │
│    (if module-specific)      │
└──────────────────────────────┘

┌──────────────────────────────┐
│  USER REWARD (who earned it) │
│  ─────                       │
│  user: → Peter               │
│  reward: → Module 1 Cheat    │
│  earned_at: Feb 14           │
│  given_by: system / manager  │
│                              │
│  Manager can see:            │
│  "Peter unlocked 3 rewards"  │
│  Manager can give:           │
│  "Award Peter custom badge"  │
└──────────────────────────────┘
```

---

## DAILY REVIEW (keeps engagement + gives manager signal)

```
┌──────────────────────────────┐
│  DAILY REVIEW                │
│  ─────                       │
│  user: → Peter               │
│  date: Feb 14                │
│  day_rating: 1-5 stars       │
│    ("How was your day?")     │
│  confidence: 1-5             │
│    ("How confident were you  │
│     using what you learned?")│
│  highlight: "Saved a sale    │
│    using the 70/30 rule"     │
│    (optional quick note)     │
│  submitted_at: 5:30 PM       │
│                              │
│  MUST BE:                    │
│  - Quick (< 30 seconds)      │
│  - Interactive (tap, not type │
│    — except optional note)   │
│  - End-of-shift trigger      │
│  - Part of streak counting   │
│                              │
│  MANAGER SEES:               │
│  - Who submitted today       │
│  - Who hasn't (nudge target) │
│  - Trend over time (going    │
│    up = training is working) │
└──────────────────────────────┘

  If someone hasn't done their daily review,
  manager sees "Peter hasn't checked in today."
  Not punitive — just visible.
```

---

## THE FULL PICTURE (updated)

```
STORE ──────────── has many ──── USERS
                                   │
                 ┌────────────┬────┼─────────┬──────────┐
                 │            │    │         │          │
              reads        takes  plays   reviews    earns
                 │            │    │         │          │
                 ▼            ▼    ▼         ▼          ▼
MODULE ─ has ─ MISSIONS ─── QUIZZES  GAMES  DAILY    REWARDS
  │              │            │       │    REVIEW       │
  │              │            │       │                 │
  │           creates      creates creates           tracks
  │              │            │       │                 │
  │              ▼            ▼       ▼                 ▼
  │          PROGRESS      QUIZ    GAME             USER
  │                      ATTEMPTS  SCORES          REWARDS
  │              │
  │           logs
  │              │
  │              ▼
  │          PRACTICE
  │          LOGS
  │
  │          GAMES need ──── PRODUCT CATALOG
  │                          (real store inventory)
  │
  └──── unlocks ──── REWARDS (cheat sheets, badges, etc.)
                        │
                     MANAGER
                        │
                  sends + gives
                        │
                        ▼
                 ENCOURAGEMENT
                    → STAFF
                 CUSTOM REWARDS
                    → STAFF
```

---

## WHAT EACH SCREEN READS FROM (updated)

```
SALES HOME        → PROGRESS + next MISSION + GAME SCORES + STREAK + REWARDS
LESSON SCREEN     → MISSION content + visual
QUIZ SCREEN       → QUESTIONS for that mission
RESULTS SCREEN    → QUIZ ATTEMPT + MISSION practice checklist
GAME SCREEN       → GAME config + PRODUCT CATALOG, writes GAME SCORE
DAILY REVIEW      → writes DAILY REVIEW (stars + confidence + note)
CHEAT SHEET       → REWARD (if earned)

MANAGER DASHBOARD → all PROGRESS + QUIZ ATTEMPTS + GAME SCORES +
                     DAILY REVIEWS + STREAKS for their STORE
STAFF DETAIL      → one USER's everything: PROGRESS + ATTEMPTS +
                     GAME SCORES + PRACTICE LOGS + DAILY REVIEWS +
                     REWARDS + STREAK
ENCOURAGEMENT     → writes ENCOURAGEMENT to specific staff

ADMIN OVERVIEW    → all USERS + PROGRESS across all STORES
ADMIN HEATMAP     → PROGRESS (completion matrix)
ADMIN CONFIGURE   → MODULE settings + REWARD settings
ADMIN STAFF       → USERS (add/remove)
```

---

## PLAIN LIST — ALL BOXES

| # | Box | What it holds | Pilot size |
|---|-----|--------------|------------|
| 1 | Store | Puma Lekki | 1 |
| 2 | User | Staff, managers, admins | ~9 |
| 3 | Module | Module 1, 2, 3 | 3 |
| 4 | Mission | 6 per module | 18 |
| 5 | Quiz | 1 per mission | 18 |
| 6 | Question | 5 per quiz | 90 |
| 7 | Game | Build Your Basket, Customer Says, TBD | 3 |
| 8 | Product Catalog | Real store inventory (from CSV) | ~200 products |
| 9 | Reward | Cheat sheets, badges, certificates | ~10 types |
| 10 | Progress | per user × per mission | grows |
| 11 | Quiz Attempt | per user × per quiz × retries | grows |
| 12 | Game Score | per user × per game × plays (highest + latest shown) | grows |
| 13 | Daily Review | per user × per day (stars + confidence) | grows |
| 14 | Practice Log | per user × per mission | grows |
| 15 | User Reward | which user earned which reward | grows |
| 16 | Encouragement | manager → staff messages | grows |

**Total: 16 boxes** (up from 11 after your corrections)

---

## WHAT'S NEW SINCE V0

| Change | Why |
|--------|-----|
| + Contact fields (phone, WhatsApp, Telegram) | "Just in case" — optional, add as needed |
| + Streak tracking on User | Consecutive days of ANY engagement |
| + Product Catalog | Build Your Basket uses REAL store inventory |
| + Game.principle | What skill each game teaches |
| + Reward system (not just cheat sheets) | Badges, certificates, manager-given awards |
| + User Reward tracking | Who earned what, when, how |
| + Daily Review | Quick end-of-shift check-in (stars + confidence) |
| + Highest AND latest game scores | Both matter |
| Progressive disclosure noted | 42 rows is fine — user only sees their next thing |
