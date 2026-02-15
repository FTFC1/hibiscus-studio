# Session Gems — 2026-01-21

## Context
Continuation of HB Studio analysis. Moved from capacity/utilization analysis to **conversion funnel** and **website optimization**.

---

## Key Discovery: The Funnel

All traffic funnels to the landing page we built. This makes **website conversion the highest leverage point**.

```
AWARENESS
├── Instagram (780 followers)
├── TikTok (1,328 followers, 10.1K likes)
└── Vendor tags (food vendors tag HB Studio)
         │
         ▼
INTEREST
├── DMs on Instagram/TikTok
├── OR click Linktree / link in bio
└── [BLACK HOLE - cannot measure this]
         │
         ▼
CONSIDERATION
├── Landing page: hibiscusstudio.co.uk
├── Progressive disclosure UI
├── Pick category → pick duration → see price
└── [CAN MEASURE - need analytics]
         │
         ▼
BOOKING
├── Acuity Scheduling
├── Payment, calendar, confirmation
└── [CAN MEASURE - have CSVs]
```

### The Black Hole
- Cannot easily export Instagram/TikTok DMs
- Don't know how many people DM'd but never clicked through
- Don't know bounce rate on landing page (no analytics installed)

---

## Social Media Stats (as of 2026-01-21)

| Platform | Followers | Notes |
|----------|-----------|-------|
| Instagram | 780 | Main discovery channel |
| TikTok | 1,328 | 10.1K likes |
| Linktree | - | Links to: IG, TikTok, Studio Hire (landing page), Studio Viewing (landing page) |

---

## Leverage Point Analysis

**Insight:** Improving conversion from 1% to 2% = 100% revenue lift with ZERO new traffic.

| Lever | Effort | Impact | Measurable? |
|-------|--------|--------|-------------|
| Website conversion | Low | High | Yes (with analytics) |
| Booking flow simplification | Medium | High | Yes |
| Chatbot improvement | Low | Medium | Partially |
| Demand generation (content) | High | Unknown | Hard |

**Decision: Focus on website conversion first.**

---

## Analytics Decision

### Current State
- No Google Analytics
- No tracking on landing page
- Site deployed on GitHub Pages

### Recommendation: Umami
- Free, self-hosted
- Deploy on Render (already have Render for chatbot)
- Supports custom events for tracking flow steps
- `umami.track('clicked-bridal-shower')` etc.

### Alternative Considered
- Lucky Orange — good for qualitative (heatmaps, session recordings)
- Could use both: Umami for quantitative, Lucky Orange for qualitative

---

## Booking Flow Redesign

### Current Problem
Customer must "t-shirt size" their event by TIME (4hr, 6hr, 8hr).
They don't know what they need. They pick cheapest option → often not enough time.

### Proposed Flow
```
Step 1: What are you celebrating?
        ○ Bridal Shower
        ○ Baby Shower
        ○ Birthday (milestone)
        ○ Birthday (casual)
        ○ Workshop/Class
        ○ Content shoot
        ○ Other

Step 2: How many guests?
        [ 25 ]

Step 3: When?
        [ February 15, 2026 ]
        □ I'm flexible on date

Step 4: RECOMMENDATION
        ┌─────────────────────────────────────────┐
        │ Based on your bridal shower for 25:    │
        │                                         │
        │ ★ RECOMMENDED: Half-Day (6 hrs)        │
        │   4pm-10pm · £465                      │
        │                                         │
        │   "8 of 12 bridal showers booked       │
        │    this package. 2 who booked 4 hours  │
        │    asked for more time in their notes" │
        │                                         │
        │   [Book This Package]                  │
        │                                         │
        │ ───────────────────────────────────────│
        │ Also available:                        │
        │ ○ 4 Hours · £345 (often not enough)    │
        │ ○ Full Day · £645                      │
        └─────────────────────────────────────────┘
```

### Key UX Principle
- Give appearance of choice
- Anchor to recommended option
- Show social proof ("X people booked this")
- Explain why cheaper option isn't enough BEFORE showing price

---

## Payment Architecture Decision

### Options Considered

| Keep Acuity | Replace with Whop + Custom |
|-------------|---------------------------|
| New flow → sends to Acuity at end | New flow → Whop payment in-page |
| Acuity handles calendar, email, payment | We build calendar integration, confirmation emails |
| Can't track abandoned bookings | Full control, full tracking |
| Lower effort | Higher effort |

### Decision: Incremental Approach

```
Week 1: Add Umami analytics
        → Measure current conversion rate

Week 2: Build new booking flow UI
        → Still sends to Acuity at end
        → Track each step with Umami events
        → Identify WHERE people drop off

Week 3+: IF data shows Acuity is the problem
         → THEN build Whop replacement
         → Calendar API, confirmation emails, etc.
```

**Rationale:** Don't build payment system based on hunch. Measure first, then decide.

---

## Technical Notes

### Site Stack
- Hosted: GitHub Pages
- Landing page: Static HTML (we built it)
- Booking: Acuity Scheduling
- Chatbot: Hosted on Render (basic prompt)

### To Add
- Umami analytics (deploy on Render)
- Script tag on GitHub Pages site
- Custom event tracking for flow steps

---

## Next Actions

1. **Deploy Umami on Render** — 15 min setup
2. **Add script tag to landing page** — 2 min
3. **Wait 1 week for baseline data**
4. **Build new booking flow UI** — wireframe first
5. **Track conversion through flow with Umami events**

---

## Files Referenced This Session

- `/Jan 20/HB-STUDIO-CAPACITY-SNAPSHOT.md` — utilization analysis
- `/Jan 20/schedule2026-01-20 (1).csv` — historical bookings
- `/Jan 20/schedule2026-01-20 (2).csv` — future bookings
- `/Jan 20/OWNER-PROFILE-ROCHELLE.md` — communication profile

---

## Thread Status

| Thread | Status | Notes |
|--------|--------|-------|
| HB Studio conversion funnel | ACTIVE | This session |
| HUD v4 planning | PARKED | Captured in HUD-V4-PLANNING.md |
| Capacity analysis | COMPLETED | HB-STUDIO-CAPACITY-SNAPSHOT.md |
| Owner profile | COMPLETED | OWNER-PROFILE-ROCHELLE.md |
