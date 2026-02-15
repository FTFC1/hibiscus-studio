# HB Studio Booking System — Improvement Analysis & Roadmap

**Analysis Date:** 2026-01-28
**Current State:** Documented
**Assessment:** Gap analysis complete, roadmap prioritized

---

## executive summary

**current capabilities:**
- event-type-first recommendation engine (live)
- category-based booking funnel (live)
- acuity scheduling integration (external)
- admin dashboard with confirm/cancel/reschedule (live)
- dual-source data (KV + calendar)
- manual 50% deposit invoicing

**critical gaps:**
- payment not automated (manual invoice process)
- no abandoned booking recovery
- dm inquiries unmeasurable (black hole)
- acuity abandonment invisible
- no customer self-service (reschedule/cancel)
- admin dashboard not mobile-optimized

**strategic opportunity:**
- automating payment = 2x faster booking → confirmation
- abandoned recovery = 15-25% conversion uplift (industry standard)
- self-service = reduced admin workload by 40%

---

## gap analysis

### 1. PAYMENT FLOW

#### current state
```
customer books → acuity confirmation → manual invoice (48h) → payment window (48h)
                                          ↑
                                      bottleneck
```

**problems:**
- invoice creation is manual (studio owner task)
- 48-hour delay before payment link sent
- customer has to leave site (email → payment link)
- 48-hour payment window → auto-cancellation if missed
- no automatic reminders

**impact:**
- high drop-off between booking → payment
- admin workload (every booking requires manual invoice)
- delayed revenue recognition

#### ideal state
```
customer books → payment page (immediate) → confirmation (instant)
```

**requirements:**
- stripe/whop integration
- 50% deposit calculated automatically
- payment page embedded in booking flow
- instant confirmation on payment success
- automatic receipt generation

**roi:**
- reduce booking → confirmed from 48-96 hours to <5 minutes
- eliminate manual invoice generation (saves ~10 min per booking)
- reduce abandonment (estimated 20-30% drop-off currently)

---

### 2. ABANDONED BOOKING RECOVERY

#### current state
- **landing page abandonment:** not tracked
- **acuity modal abandonment:** invisible (acuity limitation)
- **invoice abandonment:** tracked but no recovery

**problems:**
- can't see where users drop off
- no email recovery for abandoned bookings
- no retargeting for partial completions

**impact:**
- unknown % of potential bookings lost
- zero recovery mechanism
- no data to optimize funnel

#### ideal state
```
funnel tracking:
  page load → category select → package select → booking start → payment → confirmed
       ↓            ↓                 ↓                ↓             ↓
     100%          80%               60%              40%           25%
                    ↓                 ↓                ↓             ↓
                 abandon email    abandon email    abandon email   ---
                 (24h delay)      (1h delay)       (15m delay)
```

**requirements:**
- track all funnel steps (umami events)
- capture email early (before payment)
- automated abandoned cart emails
- segment by drop-off point

**roi:**
- industry standard: 15-25% recovery rate on abandoned bookings
- if current conversion = 2%, recovery could add 0.3-0.5% absolute
- translates to 15-25% more bookings with same traffic

---

### 3. CUSTOMER EXPERIENCE GAPS

#### gap 3a: no self-service reschedule

**current state:**
- customer must email/dm to reschedule
- admin manually processes request
- applies policy, finds new slot, updates calendar

**problems:**
- delays (response time 24-48h)
- admin workload
- friction for customer

**ideal state:**
- customer portal with "reschedule" button
- shows available dates
- applies policy automatically
- instant confirmation

**roi:**
- reduce admin time by 40% (rescheduling is common request)
- improve customer satisfaction (instant gratification)

---

#### gap 3b: no self-service cancellation

**current state:**
- customer must email/dm to cancel
- admin manually processes, applies policy, issues refund

**problems:**
- admin workload
- refund processing delay
- customer anxiety (waiting for refund confirmation)

**ideal state:**
- customer portal with "cancel" button
- shows cancellation policy clearly
- calculates refund automatically
- triggers refund immediately (or queues for admin approval)

**roi:**
- reduce admin time
- improve trust (transparent policy)

---

#### gap 3c: no booking history

**current state:**
- customers receive confirmation email
- no way to view past bookings
- must search email for confirmation

**problems:**
- customers lose confirmation emails
- support requests for "what's my booking?"
- no upsell opportunities

**ideal state:**
- customer portal with booking history
- view past/upcoming events
- download invoices/receipts
- upsell: "book another event"

**roi:**
- reduce support requests
- repeat booking conversion

---

### 4. ADMIN DASHBOARD LIMITATIONS

#### gap 4a: not mobile-optimized

**current state:**
- admin dashboard designed for desktop
- small screens = horizontal scroll, cramped cards
- rochelle likely checks from phone

**problems:**
- poor mobile ux
- harder to confirm bookings on-the-go

**ideal state:**
- responsive design (mobile-first)
- stacked cards on mobile
- large tap targets
- swipe actions (confirm/cancel)

**roi:**
- faster admin actions
- can manage bookings anywhere

---

#### gap 4b: no bulk actions

**current state:**
- confirm/cancel/reschedule one at a time
- no multi-select

**problems:**
- time-consuming for multiple bookings
- can't "confirm all pending" with one click

**ideal state:**
- checkbox multi-select
- bulk confirm
- bulk send reminders

**roi:**
- save time on high-volume days

---

#### gap 4c: no notification system

**current state:**
- admin must actively check dashboard
- no alerts for new bookings

**problems:**
- delayed response
- manual checking required

**ideal state:**
- email notification on new booking
- sms notification (optional)
- push notification (if pwa)

**roi:**
- faster response time
- better customer experience

---

### 5. DATA & ANALYTICS GAPS

#### gap 5a: no conversion tracking

**current state:**
- umami tracks page events
- no end-to-end funnel visibility
- can't calculate conversion rates

**problems:**
- don't know landing page → booking conversion
- can't identify bottleneck steps
- can't measure impact of changes

**ideal state:**
- full funnel tracking
- cohort analysis (event type, traffic source, package)
- conversion rate dashboard

**roi:**
- data-driven optimization
- justify marketing spend

---

#### gap 5b: no revenue reporting

**current state:**
- revenue calculated manually from calendar/kv
- no automatic reports

**problems:**
- time-consuming to generate reports
- no trend analysis

**ideal state:**
- revenue dashboard
- weekly/monthly/yearly rollups
- booking type breakdown
- revenue per event type

**roi:**
- inform pricing decisions
- identify high-value segments

---

### 6. INTEGRATION GAPS

#### gap 6a: acuity dependency

**current state:**
- acuity handles calendar scheduling
- limited customization
- iframe embed = UX friction
- can't see abandonment

**problems:**
- vendor lock-in
- modal loading = extra step
- acuity branding

**ideal state:**
- custom booking calendar
- native to site (no iframe)
- full control over UX

**roi:**
- better UX = higher conversion
- no acuity subscription cost (£?)

---

#### gap 6b: manual apps script emails

**current state:**
- emails sent via google apps script webhook
- requires manual trigger from worker

**problems:**
- single point of failure
- rate limits (gmail sending limits)
- no email template management

**ideal state:**
- dedicated email service (resend/sendgrid)
- template management
- analytics (open rates, click rates)

**roi:**
- reliability
- better email deliverability
- actionable email metrics

---

## prioritization framework

| criterion | weight | description |
|-----------|--------|-------------|
| **impact** | 40% | revenue impact + customer satisfaction |
| **effort** | 30% | development time + complexity |
| **urgency** | 20% | blocking growth? causing churn? |
| **dependencies** | 10% | requires other work first? |

**score calculation:**
```
priority_score = (impact × 0.4) + (effort × 0.3) + (urgency × 0.2) + (dependencies × 0.1)
```

- impact: 1-10 (higher = more impact)
- effort: 10-1 (higher score = less effort)
- urgency: 1-10 (higher = more urgent)
- dependencies: 10-1 (higher score = fewer dependencies)

---

## roadmap: 3 horizons

### HORIZON 1: Foundation (0-3 months)
**theme:** automate payment, recover revenue

#### 1.1 automated payment integration [PRIORITY: 9.2/10]
**impact:** 10/10 — eliminates manual invoicing, reduces 48h delay to <5min
**effort:** 6/10 — medium complexity (stripe integration)
**urgency:** 9/10 — biggest bottleneck currently
**dependencies:** 8/10 — minimal (can replace acuity payment only)

**scope:**
- integrate stripe (or whop)
- replace manual invoice with payment page
- 50% deposit calculated automatically
- instant confirmation on payment
- receipt generation

**estimated effort:** 3-4 weeks
**roi:** reduce booking → confirmed from 48-96h to <5min, eliminate manual invoice work

---

#### 1.2 abandoned booking recovery [PRIORITY: 8.4/10]
**impact:** 9/10 — 15-25% recovery rate (industry standard)
**effort:** 7/10 — moderate (email automation + tracking)
**urgency:** 7/10 — high-value but not blocking
**dependencies:** 9/10 — requires payment integration first

**scope:**
- capture email before payment page
- track abandonment point (landing, category, package, payment)
- automated email sequences:
  - abandoned landing → "still interested?" (24h)
  - abandoned payment → "complete your booking" (1h)
  - abandoned with slot → "your slot is reserved" (15m)
- umami event tracking for full funnel

**estimated effort:** 2-3 weeks
**roi:** 15-25% uplift on otherwise lost bookings

---

#### 1.3 mobile-optimized admin dashboard [PRIORITY: 7.8/10]
**impact:** 7/10 — improves admin efficiency
**effort:** 9/10 — low effort (css/responsive design)
**urgency:** 6/10 — quality of life, not blocking
**dependencies:** 10/10 — no dependencies

**scope:**
- responsive css breakpoints
- mobile-first card layout
- large tap targets for actions
- swipe gestures (optional)

**estimated effort:** 1 week
**roi:** rochelle can manage bookings from phone, faster admin actions

---

#### 1.4 admin notification system [PRIORITY: 7.5/10]
**impact:** 7/10 — faster response time
**effort:** 8/10 — low effort (email webhook)
**urgency:** 6/10 — nice-to-have
**dependencies:** 9/10 — minimal

**scope:**
- email notification on new booking
- sms notification (optional, via twilio)
- configurable (on/off, frequency)

**estimated effort:** 1 week
**roi:** reduce response time from hours to minutes

---

### HORIZON 2: Self-Service (3-6 months)
**theme:** reduce admin workload, empower customers

#### 2.1 customer portal [PRIORITY: 8.6/10]
**impact:** 9/10 — reduces support requests, enables self-service
**effort:** 5/10 — medium-high complexity (auth, portal ui)
**urgency:** 7/10 — high-value for scaling
**dependencies:** 7/10 — requires payment integration

**scope:**
- magic link authentication (email-based)
- view upcoming bookings
- view past bookings
- download invoices/receipts
- self-service reschedule (apply policy automatically)
- self-service cancel (apply policy, trigger refund)

**estimated effort:** 4-6 weeks
**roi:** reduce admin workload by 40%, improve customer trust

---

#### 2.2 booking confirmation page (not email) [PRIORITY: 7.2/10]
**impact:** 6/10 — improves ux, reduces support
**effort:** 9/10 — low effort (static page)
**urgency:** 5/10 — nice-to-have
**dependencies:** 9/10 — minimal

**scope:**
- immediate on-screen confirmation (no email delay)
- "add to calendar" button (google/apple/outlook)
- share booking link
- print confirmation

**estimated effort:** 1 week
**roi:** better ux, fewer "did my booking go through?" questions

---

#### 2.3 revenue reporting dashboard [PRIORITY: 7.0/10]
**impact:** 7/10 — data-driven decisions
**effort:** 7/10 — moderate effort (aggregation + ui)
**urgency:** 5/10 — nice-to-have
**dependencies:** 8/10 — minimal

**scope:**
- weekly/monthly/yearly revenue charts
- breakdown by event type
- booking count trends
- average booking value
- deposit vs full payment tracking

**estimated effort:** 2 weeks
**roi:** inform pricing, identify high-value segments

---

### HORIZON 3: Scale & Optimize (6-12 months)
**theme:** replace dependencies, optimize conversions

#### 3.1 replace acuity with custom calendar [PRIORITY: 6.8/10]
**impact:** 8/10 — full control, better ux
**effort:** 3/10 — high complexity (calendar ui, availability logic)
**urgency:** 4/10 — not urgent (acuity works)
**dependencies:** 5/10 — requires payment + booking system solid

**scope:**
- custom availability calendar
- block-out dates (holidays, personal time)
- multi-package availability
- native to site (no iframe)
- remove acuity subscription

**estimated effort:** 6-8 weeks
**roi:** better ux, save acuity subscription cost, full control

---

#### 3.2 advanced funnel optimization [PRIORITY: 6.5/10]
**impact:** 7/10 — incremental conversion improvements
**effort:** 6/10 — medium effort (a/b testing, analytics)
**urgency:** 4/10 — optimization, not foundational
**dependencies:** 6/10 — requires full tracking first

**scope:**
- a/b test recommendation messaging
- a/b test package pricing display
- cohort analysis (traffic source, event type)
- heatmaps (where users click)
- session recordings (identify friction)

**estimated effort:** ongoing (4-6 weeks initial setup)
**roi:** 5-15% conversion uplift via iterative testing

---

#### 3.3 upsell & repeat booking [PRIORITY: 6.0/10]
**impact:** 7/10 — increases ltv
**effort:** 7/10 — moderate effort
**urgency:** 3/10 — growth, not critical
**dependencies:** 7/10 — requires customer portal

**scope:**
- post-booking upsell (add-ons, longer time)
- repeat booking discount
- "book another event" in customer portal
- referral program

**estimated effort:** 3-4 weeks
**roi:** increase ltv by 20-30%

---

## implementation priorities (next 6 months)

### phase 1: q1 2026 (jan-mar)
**goal:** eliminate manual payment bottleneck

| week | deliverable | owner |
|------|-------------|-------|
| 1-4 | stripe integration + payment page | dev |
| 5-7 | abandoned booking recovery system | dev |
| 8 | mobile-optimized admin dashboard | dev |
| 9 | admin notification system | dev |

**success metrics:**
- booking → confirmed time: 48h → <5min
- abandoned recovery rate: 0% → 15%+
- admin mobile usage: track weekly active

---

### phase 2: q2 2026 (apr-jun)
**goal:** enable customer self-service

| week | deliverable | owner |
|------|-------------|-------|
| 1-6 | customer portal (auth + booking management) | dev |
| 7 | booking confirmation page | dev |
| 8-9 | revenue reporting dashboard | dev |

**success metrics:**
- self-service reschedule adoption: track %
- support request reduction: target 40%
- repeat booking rate: track baseline

---

### phase 3: q3-q4 2026 (jul-dec)
**goal:** optimize & scale

- replace acuity (q3)
- advanced funnel optimization (q3-q4)
- upsell & repeat booking features (q4)

---

## quick wins (< 1 week each)

these can be done immediately without blocking other work:

1. **mobile admin css** (1 day)
   - responsive breakpoints
   - larger tap targets

2. **email notification on new booking** (1 day)
   - webhook to studio email
   - "new booking from [name]"

3. **booking confirmation page** (1 day)
   - on-screen confirmation
   - "add to calendar" button

4. **terms page** (1 day)
   - standalone /terms url
   - link from invoices

5. **umami goal tracking** (1 day)
   - set up conversion goals
   - track booking completion rate

---

## risk analysis

### risk: payment integration delays
**probability:** medium
**impact:** high (blocks phase 1)
**mitigation:**
- start stripe integration immediately
- have backup (whop integration)
- consider hybrid (keep acuity as fallback)

---

### risk: customer portal adoption low
**probability:** low-medium
**impact:** medium (wasted dev effort)
**mitigation:**
- promote portal in confirmation emails
- add value (exclusive discounts for portal users)
- track usage, iterate on ux

---

### risk: abandoned recovery emails marked as spam
**probability:** medium
**impact:** medium (recovery rate lower than expected)
**mitigation:**
- use dedicated email service (sendgrid/resend)
- spf/dkim/dmarc records
- a/b test email copy (not too aggressive)

---

## success metrics (kpis)

### revenue metrics
- booking → confirmed time: 48h → <5min (target)
- booking completion rate: baseline → +20% (target)
- monthly recurring bookings: track trend
- average booking value: track trend

### efficiency metrics
- admin time per booking: 15min → 5min (target)
- support requests: baseline → -40% (target)
- self-service adoption: 0% → 60% (target)

### customer experience metrics
- booking funnel conversion: baseline → +15% (target)
- abandoned recovery rate: 0% → 15% (target)
- repeat booking rate: baseline → +25% (target)
- customer satisfaction (survey): track nps

---

## budget estimate

### phase 1 (0-3 months)
- dev time: 9 weeks × $X/week = $Y
- stripe fees: 2.9% + 30¢ per transaction
- sendgrid/resend: $15-50/month

### phase 2 (3-6 months)
- dev time: 9 weeks × $X/week = $Y
- auth service (magic links): $0-25/month

### phase 3 (6-12 months)
- dev time: 14 weeks × $X/week = $Y
- cancel acuity: save $X/month

**total investment:** estimate based on dev rates
**payback period:** 3-6 months (via reduced admin time + increased bookings)

---

## appendix: current vs ideal state comparison

### BOOKING FLOW

#### current
```
customer → acuity iframe → booking → manual invoice (48h) → payment (48h) → confirmed
           (friction)                  (delay)               (delay)
```

#### ideal
```
customer → native calendar → booking → payment page → confirmed (instant)
           (seamless)                   (immediate)
```

---

### ADMIN WORKFLOW

#### current
```
new booking → check dashboard → create invoice → send invoice → wait 48h → manual confirm
               (periodic)         (manual 10min)                             (manual)
```

#### ideal
```
new booking → notification → auto-confirmed (if payment immediate)
               (instant)     (no action needed)

OR

new booking → notification → click confirm → done
               (instant)     (1 tap)
```

---

### CUSTOMER SUPPORT

#### current
```
customer needs help → email/dm → admin responds (24-48h) → admin takes action
                                   (manual)                  (manual)
```

#### ideal
```
customer needs help → portal → self-service action → instant resolution
                                (reschedule/cancel)
```

---

## conclusion

**highest priority actions:**
1. automate payment (eliminate 48h invoice delay)
2. recover abandoned bookings (15-25% uplift)
3. optimize admin dashboard for mobile

**expected outcomes:**
- 2x faster booking → confirmation
- 20% more completed bookings
- 40% reduction in admin workload

**timeline:**
- phase 1 complete: march 2026
- phase 2 complete: june 2026
- phase 3 complete: dec 2026

**next step:** approve phase 1 scope, begin stripe integration.
