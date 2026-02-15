# Session Packet: PUMA Practice Mechanic

**Session Date:** 2026-01-30
**Project:** FORJE Retail / PUMA Lekki
**Status:** ✅ Complete (Games ready for demo)

---

## the goal

**Teach staff to read CUSTOMER TYPE, then apply the right approach.**

The skill isn't memorizing product pairs — it's recognizing WHO is buying.

---

## what we built

### Games (Practice Layer)

| Game | Purpose | Status |
|------|---------|--------|
| **Customer Says** | Identify customer type from quotes | ✅ Ready (35 scenarios) |
| **Build the Basket** | Select correct add-ons | ✅ Ready (R6.2 design, accuracy feedback) |
| **The Approach** | What to actually SAY | ✅ Ready (8 scenarios) |

**Learning flow:** Identify → Build → Approach

### UI Decisions Landed

| Decision | What we chose |
|----------|---------------|
| Card design | R6.2 SPACIOUS — horizontal rows, 18px padding, corner badges |
| Cash register strip | Black bar at top, transforms on submit |
| Feedback model | CORRECT / WRONG / MISSED (accuracy, not money) |
| Product names | Title case (not ALL CAPS) |
| Feedback badges | Corner position (✓ green, ✗ red, ! yellow) |

---

## full delivery structure

### What's Needed

```
PUMA LEKKI TRAINING
├── Module 1: Customer Types (lesson/theory)
│   └── HTML or PDF — needs visual redesign to match games
├── Module 2: Building the Basket (lesson)
│   └── Corresponding theory for Build the Basket game
├── Module 3: The Approach (lesson)
│   └── Corresponding theory for The Approach game
├── Games (practice)
│   ├── customer-says.html
│   ├── build-the-basket.html
│   └── the-approach.html
└── Telegram Group
    ├── Pinned navigation message
    ├── Links to hosted games
    └── Quick reference doc
```

### Telegram Pinned Message (Draft)

```
🏪 PUMA Lekki Training Navigation 🏪

📖 LESSONS
Module 1: Customer Types — Learn to identify GUIDED, EXPERT, ACTIVITY, MATERIAL-CURIOUS, and GIFT buyers
Module 2: Building the Basket — Match add-ons to customer type, not just product
Module 3: The Approach — What to actually SAY to each customer type

🎮 PRACTICE GAMES
Customer Says — Quick-fire customer type identification
Build the Basket — Select the right add-ons for each scenario
The Approach — Practice your sales conversation

📊 LEADERBOARD
[Link to shared leaderboard — coming soon]

💡 HOW TO USE
Start with Module 1 to understand customer types.
Then play Customer Says until you can identify types instantly.
Move to Module 2 + Build the Basket.
Finish with Module 3 + The Approach.
Play games between customers to stay sharp.
```

---

## customer types framework

From Timi's real store observations:

| Type | What They Say | Staff Approach | Cross-Sell |
|------|---------------|----------------|------------|
| **GUIDED** | "Give me things that fit" | Lead aggressively | HIGH — they'll say yes |
| **EXPERT** | "I buy the Nitro every year" | Respect expertise | MEDIUM — casual ask |
| **ACTIVITY** | "I want to start running" | Match add-on to activity | HIGH — gear for activity |
| **MATERIAL-CURIOUS** | "How do I clean this suede?" | They're ASKING for it | VERY HIGH — don't miss |
| **GIFT** | "For my son's birthday" | Presentation matters | HIGH — bags, kits |

---

## files

All in `/projects/00_Inbox/jan 29/`:

```
puma-customer-game.html       # Customer type identification (35 scenarios)
puma-basket-game-v2.html      # Build the basket — R6.2 design, accuracy feedback
puma-approach-game.html       # What to say methodology (8 scenarios)
puma-products.json            # Real PUMA Lekki inventory (479 main, 65 addons)
design-variations.html        # UI iteration history (R1-R6)
FORJE_GAME_DESIGN_SYSTEM.md   # R6.2 SPACIOUS design patterns
TIMI_VALIDATION_PACK.md       # Timi's testing instructions + Telegram setup
```

---

## decisions made

### Telegram delivery
- Link out to hosted HTML games (not Telegram Mini App)
- Games pinned at top of Telegram group
- Pinned message = navigation hub (like AI Frontrunners model)

### Seller (12k platform)
- Keep for course modules, theory, certificates
- Games stay as separate HTML files
- **Seller = credibility layer, Games = engagement layer**

### Leaderboards
- Current: localStorage (per device)
- For shared leaderboard: needs simple backend (Firebase/Supabase)

### Demo flow
1. Timi validates scenarios first
2. Then demo to Adedolapo
3. Don't show Adedolapo until Timi confirms

---

## reusables (FORJE template)

| Component | Reusable for other brands? |
|-----------|---------------------------|
| Customer type framework | ✅ Adapt types per brand |
| Game mechanics (procedural scenarios) | ✅ Same code, swap products |
| Product JSON structure | ✅ Template for any inventory |
| UI patterns (R6.2, cash register, accuracy) | ✅ Brand-agnostic |
| Telegram pinned message structure | ✅ Copy for any retail client |

**This is now a FORJE retail training template.**

---

## next actions

| Task | Owner | Status |
|------|-------|--------|
| Apply R6.2 design to Customer Says | Claude | ✅ Done |
| Apply R6.2 design to The Approach | Claude | ✅ Done |
| Apply R6.2 design to Build the Basket | Claude | ✅ Done (earlier session) |
| Module 1 lessons (HTML) | — | ✅ Exist (missions 1-6 in PUMA-Training-Pilot-2026) |
| Host games (Vercel) | Nick | ⬜ |
| Set up Telegram group | Nick | ⬜ |
| Timi plays + validates | Timi | ⬜ |
| Demo to Adedolapo | Nick + Timi | ⬜ |

### Demo Package Ready
All 3 games with consistent R6.2 SPACIOUS design:
- `puma-customer-game.html` — Customer type identification (35 scenarios)
- `puma-basket-game-v2.html` — Build the basket (accuracy feedback)
- `puma-approach-game.html` — What to say (8 scenarios)

Module 1 lessons exist at:
`/projects/1_Projects/PUMA-Training-Pilot-2026/docs/mission-01.html` through `mission-06.html`

---

## sources

- [Taylor & Francis: Gamification in Virtual Sales Training](https://www.tandfonline.com/doi/full/10.1080/08853134.2024.2431817)
- [The Learning Lab: Gamification for Retail](https://www.thelearning-lab.com/blog-elearning-platform/gamification-concepts-retail-training)
- PUMA Lekki Product List (1,325 products, 6,100+ SKUs)
- Timi's direct observations from store floor
- AI Frontrunners pinned message structure (reference for Telegram navigation)

---

**context retention:** All 3 games complete with R6.2 SPACIOUS design (light theme, black progress bar, corner badges, inline feedback). Design system documented in `FORJE_GAME_DESIGN_SYSTEM.md`. Timi validation pack ready with Telegram pinned message draft. Next: GitHub Pages deploy → Telegram group → Timi plays.
