# HB Studio Booking Quick Reference

## three funnels

1. **event-type-first** (event-type-funnel.html)
   - event type → guest count → date → recommendation → acuity

2. **category-based** (index.html)
   - hero → category → packages → modal → acuity/tally

3. **demo flow** (booking-demo.html)
   - prototype only, not live

## critical timings

| event | timing |
|-------|--------|
| invoice sent | within 48h of booking |
| payment due | 48h from invoice |
| auto-cancel | if unpaid after payment window |
| tally response | within 48h |
| deposit refund | 1-3 days post-event |

## packages

| name | duration | price |
|------|----------|-------|
| 4hrs flexi | 4hrs | £345 |
| half-day | 6hrs | £465 |
| 8hrs flexi | 8hrs | £645 |
| full-day | 12hrs (10am-10pm) | £885 |

**proposal packages:**
- heart package: £1,700 (was £2,100)
- white whimsical: £770 (was £950)

## payment flow

```
booking → invoice (48h) → payment (48h) → confirmed
                                ↓
                           auto-cancel if unpaid
```

## cancellation policy

| window | refund | reschedule |
|--------|--------|------------|
| 30+ days | 100% | free |
| 15-30 days | 50% | 1 free |
| 7-14 days | 0% | £25 fee |
| <7 days | forfeited | none |

## analytics events

**event-type funnel:**
- funnel-event-type
- funnel-step
- funnel-date-selected
- funnel-recommendation-shown
- funnel-book-clicked

**main site:**
- selected-category
- scrolled-to-booking
- clicked-book-now

## forms

**tally (proposal packages):**
- package (dropdown) — required
- name (text) — required
- email (email) — required
- phone (tel) — required
- date (date) — optional
- details (textarea) — optional

**event-type funnel:**
- event type (button grid)
- guest count (number, 1-50)
- date (date picker, min=today)
- flexible? (checkbox)

## emails

1. **booking confirmation** — acuity → customer (immediate)
2. **invoice** — manual → customer (within 48h)
3. **proposal inquiry** — tally → studio (immediate)
4. **tally auto-reply** — tally → customer (immediate)

## recommendation engine

| event | guests | recommended | reason |
|-------|--------|-------------|--------|
| bridal shower | 1-35 | half-day | 8/12 chose this |
| bridal shower | 36-50 | 8hrs flexi | larger events |
| baby shower | 1-30 | half-day | pattern from data |
| birthday (milestone) | any | half-day | standard |
| workshop | 1-20 | half-day | workshop standard |
| corporate | any | full-day | expectations |

## validation

- guest count: warning if 40-50 ("flexible options available")
- date: no past dates allowed
- tally: required fields enforced by platform
- no aggressive error messages (soft validation)

## tech stack

- frontend: vanilla js + tailwind
- scheduling: acuity (external)
- forms: tally (external)
- analytics: umami
- hosting: github pages

## pain points

- manual invoice process (not automated)
- no acuity abandonment tracking
- dm inquiries = black hole
- no landing page drop-off visibility

## files

```
/2_Areas/01-Hibiscus-Studio/hibiscus-studio-deploy/
├── index.html               (main landing)
├── event-type-funnel.html   (recommendation engine)
├── booking-demo.html        (prototype)
└── TALLY_FORM_SETUP.md      (proposal setup)
```

## acuity urls

- studio viewing: `/appointment/80164274`
- half-day: `?appointmentType=79362536`
- 8hrs flexi: `?appointmentType=80372722`
- full-day: `/appointment/79453733`

## owner contact

- email: hibiscusstudiouk@gmail.com
- receives: tally form submissions, booking notifications

---

**last updated:** 2026-01-28
**source:** live code extraction
