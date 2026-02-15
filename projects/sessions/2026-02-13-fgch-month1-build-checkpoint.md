---
session_id: 2026-02-13-fgch-month1-build
session_date: 2026-02-13
status: checkpoint
projects_touched: [HB, FG]
work_types: [shaping, recursive-build, research, wireframing]
context_remaining: ~10%
pickup_priority: Update ganache-variant-handoff.txt with new Rochelle intel (timeline, brand, domain, ClassBento data), then build the ganache page via Variant
---

# Checkpoint: FGCH Month 1 Build — Ganache 1-2-1 Shaping

**Date:** 2026-02-13
**Status:** 🔄 Checkpoint (context window low)
**Context Remaining:** ~10%

---

## WHERE WE ARE

Ran /recursive build mode (4 rounds) on Month 1 plan for Rochelle's Flour Girls Cakehouse. Shaped the ganache 1-2-1 booking flow end-to-end. Wrote complete copy + information flow for the ganache landing page (9 sections). Payment provider research complete (bank transfer + FreeAgent for MVP, GoCardless Phase 2). Then Rochelle sent voice notes + screenshots that SHIFTED THE TIMELINE: ganache 1-2-1 launches MAY (not now), March blocked (travel), next 60 days = prep not launch. Handoff file written but needs updating with new intel.

---

## DECISIONS MADE (confirmed)

### Shaping (/recursive)
1. HBS ≠ FG — different brands, different funnels, same person, can reuse infra
2. Ganache pricing by TIER not duration: 1-tier £350, 2-tier £650, 3-tier £900
3. Full reuse + adapt of HBS booking backend (not standalone lightweight page)
4. Preset options for masterclass selection (Basics / Advanced / Wedding Cake)
5. V2 (ganache page + booking) is MULTIPLE slices, not one build
6. Build order: V1 price increase → V2 ganache → V3 nurture → V4 post-workshop → V5 corporate
7. Copy + flow focus for Variant handoff — don't spend time on CSS

### Payment
8. NOT Stripe (user finds it troublesome)
9. Exclude Nigerian providers (Paystack, Flutterwave)
10. WHOP rejected (5.7-8.2% fees, USD-centric, digital product platform)
11. MVP = bank transfer + auto-generated invoice (FreeAgent if NatWest/RBS, else free invoicing)
12. Phase 2 = GoCardless (fee capped at £4/tx regardless of amount — best for high-ticket)
13. Phase 3 = Square Online (1.4% + 25p, next-day payouts)

### Timeline (from Rochelle voice notes)
14. 1-2-1 ganache launches MAY (not February/March)
15. March BLOCKED — Rochelle traveling (including America)
16. Next 60 days = PREP (corporate + 1-2-1), not launch
17. Corporate target: consistent bookings by Black History Month (October)
18. After travel: Rochelle takes proper content photos (April)
19. Will practice baking skills during travel

### Brand/Facts
20. Brand: "Flour Girls Cakehouse" (with S) — "flourgirlscakehouse"
21. Domain EXISTS: www.flourgirlscakehouse.com
22. Full address: 19a Peto St North, E16 1DP
23. Nearest tube: Canning Town (400m walk), NOT Custom House DLR
24. "Flower Girl" = Google search keyword customers use to find HBS
25. Direct bookings ARE happening (2 via website + 1 via Google search)
26. Digital product exists: Triple Chocolate Brownie Recipe, £3.50 on Shopify (5 channels)
27. Outreach lists are SEPARATE: workshop calc list ≠ corporate list
28. Key competitor: The Flower House, London — charges £65 for bento
29. Bento One Street sells cakes but NOT workshops (different market)

---

## DECISIONS PENDING (need user yes/no)

- [ ] Update ganache-variant-handoff.txt with new timeline + brand info, then paste into Variant?
- [ ] FG domain: use flourgirlscakehouse.com or CF Pages for testing?
- [ ] Corporate research: start now or after ganache page is built?
- [ ] Park this stream and switch to other active work (DSG/Clodura, TM/Hetzner)?

---

## ITEMS EXTRACTED BUT NOT ACTIONED

### Rochelle Voice Note 1 (13 seeds)
- Corporate targets: Netflix, LinkedIn, HSBC for team building
- Flower Girl Trello board is disorganized — needs structure
- Stan's store is inactive (was hosting brownie guide)
- Digital product should tie into core offering (showcase a baker who used formula to sell out)
- Average bento price £45-65 market range

### Rochelle Voice Note 2 (4 seeds)
- 2 ladies booked directly via HBS website and paid online (interested in decorating)
- 1 lady booked via ClassBento as Christmas gift from sister
- 1 booking found HBS via Google search — Rochelle's name appeared

### ClassBento Intel (scraped from user paste)
- FG listing: 1.5hrs, 1-12 guests, £45-50, earlybird £45 (14+ days)
- 11k Instagram followers shown
- 50p donation to Mental Health UK per booking
- Save £5 per guest if book 14+ days ahead (helps business planning)
- Gift card option (£50/1 guest, valid 3 years)
- Free cancel with 7 days notice
- BAD REVIEW: Genevieve Jones (Feb 2026) — ran out of cake, hygiene, noise complaints
- Good reviews: Jo Edun, Remi John — positive teacher feedback
- Competitor landscape: ~12 cake decorating classes on ClassBento London (£35-200 range)
- Hackney competitor: £80/person, 1-6 guests, 8yr business

### ClassBento Admin (screenshots)
- Feb 14 session: 4/12 guests (£144) — Safiyah Sobrany, Anna Daniela Osipova (+1), Yasmin Sobrany
- Feb 28 session: 2/12 guests (£64) — Denver Obie (gifted by Belmira Okoro, 2 guests)

### PDF: CakeHouse.pdf
- Pop-up flyer: brownies/blondies/cookies (Oct 2025)
- Workshop flyers: Oct 2025 (spooky theme) + Feb-Mar 2026 dates
- Confirmed: £50 per person, 10:30am-12pm sessions
- Brand note (INTERNAL ONLY — do NOT share): design quality could be improved

---

## FILES CREATED THIS SESSION

- `hb/ganache-variant-handoff.txt` — Complete copy + flow for 9-section ganache landing page (Variant handoff)
- `hb/payment-providers-research.html` — 8-section comparison of payment providers (WHOP, GoCardless, Square, Mollie, etc.)
- `/tmp/cakehouse-brand.txt` — Extracted text from CakeHouse.pdf
- `sessions/2026-02-13-fgch-month1-build-checkpoint.md` — THIS FILE

### Files Modified
- `.cache/session-map-2026-02-13.md` — Added FGCH Analysis stream, updated DSG stream

### Agent Outputs
- Payment research: `/private/tmp/fgch-deploy/payment-providers-research.html` (copied to `hb/`)
- HB infrastructure audit: read in conversation (a75c21c), not saved to separate file

---

## PICKUP INSTRUCTIONS

### Read These First
1. `sessions/2026-02-13-fgch-month1-build-checkpoint.md` (THIS FILE)
2. `hb/ganache-variant-handoff.txt` (the Variant handoff — needs updating with new intel)
3. `hb/payment-providers-research.html` (payment stack decided)
4. `hb/FGCH-BUSINESS-PROFILE.md` (456-line source data on Rochelle's business)

### Then Do This
1. **Update `ganache-variant-handoff.txt`** with:
   - Brand: "Flour Girls Cakehouse" (with S)
   - Domain: www.flourgirlscakehouse.com
   - Location: Canning Town (400m), not Custom House DLR
   - Postcode: E16 1DP
   - Add ClassBento UX patterns (earlybird, gift card, social proof, cancellation)
   - Add "Who This Is For" section: gift buyers
   - Note: May launch timeline (no rush on the UI)

2. **User pastes handoff into variant.com** → picks UI → exports HTML

3. **Backend changes** (can start in parallel):
   - Add GANACHE_PRICES to CF Worker (`hb/booking-backend/src/index.js`)
   - Add ganacheTier field to booking schema
   - Skip guest count for ganache
   - FG-branded email template

4. **Corporate research** (V5 — can start independently):
   - Corporate team building near E16 1DP
   - Netflix, LinkedIn, HSBC — who handles team events?
   - Use EP research method + /grok for Perplexity search
   - Target: pipeline ready by April, bookings by October (BHM)

### User Needs To Answer
- When to paste handoff into Variant? (this session or later)
- Start corporate research now or park?

---

## RAW CONTEXT (for next session)

### Revised 60-Day Timeline
```
FEBRUARY (remaining ~2 weeks):
  V1: Price increase (Rochelle)
  V2a: Flow mapped ✅ DONE
  V2b: Ganache page copy → Variant handoff ready
  V5: Corporate research begins

MARCH (Rochelle traveling — Nicholas builds):
  V2c: Build ganache page (Variant → HTML)
  V2d: Adapt booking backend for ganache tiers
  V3: MailerLite + enquiry nurture sequence
  V4: Post-workshop email sequence
  V5: Corporate page + outreach templates ready
  BONUS: Fix flourgirlscakehouse.com if needed

APRIL (Rochelle returns):
  Content photos (studio, cakes, process shots)
  Review ganache page, give feedback
  Corporate outreach begins

MAY — LAUNCH:
  Ganache 1-2-1 goes live
  First sessions booked
```

### Booking Backend Structure (for ganache extension)
```
EXISTING PRICING TABLES (CF Worker index.js):
  EVENT_HIRE_PRICES:    4hr=£345  6hr=£465  8hr=£645  12hr=£885
  WORKSHOP_PRICES:      2hr=£120  6hr=£345  12hr=£645
  CONTENT_CREATION_PRICES: 2hr=£90  6hr=£250  12hr=£500

ADD:
  GANACHE_PRICES = {
    '1-tier': 350,    // Ganache Basics (~3hr)
    '2-tier': 650,    // Advanced Ganache (~5hr)
    '3-tier': 900     // Wedding Cake Masterclass (~6-8hr)
  };

CHANGES:
  - calculatePrice(): add ganache branch
  - Skip guestCount for ganache (always 1)
  - Add ganacheTier field
  - FG-branded email template
```

### Payment Stack (decided)
```
Phase 1 (MVP): Bank transfer + FreeAgent invoicing = £0 fees
Phase 2: GoCardless "Pay Now" links = £4/tx capped
Phase 3: Square Online = 1.4% + 25p/tx
REJECTED: WHOP (5.7%+), Stripe (user pref), Paystack/Flutterwave (Nigerian)
```

### Task List State
```
#17 V1: Price increase brief — pending
#18 V2a: Map ganache flow — COMPLETED ✅
#19 V2b+c: Build ganache page + adapt booking — pending (unblocked)
#20 V3: Nurture system setup — pending (blocked by #19)
#21 V4: Post-workshop email sequence — pending (blocked by #20)
#22 V5: Corporate outreach — pending
```
