# HB Studio Conversion Funnel

**Created:** 2026-01-21
**Status:** Mapped, needs measurement

---

## The Funnel (Visual)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AWARENESS                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Instagram   │  │   TikTok     │  │ Vendor Tags  │              │
│  │  780 follow  │  │  1.3K follow │  │ (food etc)   │              │
│  │              │  │  10.1K likes │  │              │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                 │                       │
│         └────────────┬────┴─────────────────┘                       │
│                      ▼                                              │
├─────────────────────────────────────────────────────────────────────┤
│                         INTEREST                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  DMs on Instagram / TikTok                                  │   │
│  │       OR                                                    │   │
│  │  Click Linktree / Link in Bio                              │   │
│  │                                                             │   │
│  │  ⚠️  BLACK HOLE: Cannot measure this step                   │   │
│  │      - Can't export DMs                                     │   │
│  │      - Don't know how many inquire but don't click through │   │
│  │                                                             │   │
│  └─────────────────────────────┬───────────────────────────────┘   │
│                                ▼                                    │
├─────────────────────────────────────────────────────────────────────┤
│                       CONSIDERATION                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  Landing Page: hibiscusstudio.co.uk                        │   │
│  │                                                             │   │
│  │  Current Flow:                                              │   │
│  │  1. Land on page                                            │   │
│  │  2. Scroll → Click "View Booking Options"                   │   │
│  │  3. Progressive disclosure cards appear:                    │   │
│  │     - Studio Viewing                                        │   │
│  │     - Event Hire                                            │   │
│  │     - Workshops                                             │   │
│  │     - Content                                               │   │
│  │     - Proposal Packages                                     │   │
│  │  4. Click category → opens duration options                 │   │
│  │  5. Click "Book Now" → goes to Acuity                      │   │
│  │                                                             │   │
│  │  ✅ CAN MEASURE: Need to add analytics (Umami)              │   │
│  │                                                             │   │
│  └─────────────────────────────┬───────────────────────────────┘   │
│                                ▼                                    │
├─────────────────────────────────────────────────────────────────────┤
│                          BOOKING                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  Acuity Scheduling                                          │   │
│  │                                                             │   │
│  │  - Handles: Payment, calendar, confirmation email           │   │
│  │  - 50% deposit on booking (encourages early booking)        │   │
│  │                                                             │   │
│  │  ✅ CAN MEASURE: Have CSV exports                           │   │
│  │  ❌ CANNOT MEASURE: Abandoned bookings (started but didn't  │   │
│  │     complete)                                               │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Measurement Gaps

| Funnel Stage | Can We Measure? | Tool Needed |
|--------------|-----------------|-------------|
| Awareness (reach) | Partial | Platform analytics (vanity metrics) |
| Interest (DMs, clicks) | No | Can't export DMs |
| Consideration (landing page) | **NO — GAP** | Need Umami |
| Booking (completed) | Yes | Acuity CSV |
| Booking (abandoned) | No | Acuity doesn't provide |

---

## Linktree Structure

```
Linktree
├── Instagram button
├── TikTok button
├── Studio Hire → hibiscusstudio.co.uk (landing page)
└── Studio Viewing → hibiscusstudio.co.uk (landing page)
```

Both "Studio Hire" and "Studio Viewing" go to the same landing page.

---

## Traffic Sources (Qualitative)

Based on owner conversation:
1. **Instagram** — people find page, DM, then book
2. **TikTok** — same flow
3. **Vendor tags** — food vendors tag HB Studio in posts, people click through
4. **Peerspace/aggregators** — NOT a major source (mentioned but dismissed)

---

## The Key Insight

**All paths lead to the landing page.**

This means:
- Improving landing page conversion = improving ALL conversions
- Don't need to fix 3 different funnels, just 1
- Website optimization is the highest leverage point

---

## Conversion Math

If current conversion is 1%:
- 100 visitors → 1 booking

If we improve to 2%:
- 100 visitors → 2 bookings
- **100% revenue increase with ZERO new traffic**

This is why website conversion > demand generation as first priority.
