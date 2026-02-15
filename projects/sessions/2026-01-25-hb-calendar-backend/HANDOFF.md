# Session Handoff - Jan 25 2026
**Context:** 100% filled - compressed for next session

---

## SESSION OVERVIEW

**Started with:** Voice braindump → interview-first triage
**Main focus:** HB Studio calendar backend
**Method:** Sequential questions to find force target

**Files created this session:**
- `00_Inbox/jan 25/braindump.txt` - Raw voice transcript
- `00_Inbox/jan 25/braindump-grouped.txt` - Organized extraction
- `00_Inbox/jan 25/hibiscus-booking-*.json` - Service account credential
- This handoff

---

## BRAINDUMP TRIAGE RESULTS

**Location:** `00_Inbox/jan 25/braindump-grouped.txt`

### Next Actions Extracted:
- [ ] **HB:** Design appointment changing flow
- [ ] **Delphi:** Extract reusable process, consider Fiverr listing
- [ ] **CRM:** Track motors conversion data (71 calls, unknown conversions)
- [ ] **MEP:** Follow up with consultant (this week)
- [ ] **Air Frontrunners:** Continue course, copy content
- [ ] **Telegram:** Build processing pipeline
- [ ] **Mobile:** Create Craft pack of key MD files
- [ ] **Playwright MCP:** Evaluate for lesson text extraction

### Key Insights from Braindump:
- "Own your data before platform lock-in happens"
- "The friction point IS the value point"
- "Mind blindness when opening laptop - look at frameworks-grounded.md FIRST"
- "Voice overview before jumping into tabs = good hygiene"

---

## DECISIONS MADE THIS SESSION

| Decision | Reasoning |
|----------|-----------|
| Bank transfer not Stripe | HB already uses this, avoids fees |
| Request-to-book not instant | Bank transfer can't auto-confirm |
| 50% deposit model | Already defined in frameworks-grounded.md |
| One-tap confirm for Rochelle | Minimize friction, mobile-friendly |
| Keep one brain.csv + project tags | Don't fragment, add tags instead |
| Provisional event on calendar | Blocks slot, updated on payment |

---

## HB BOOKING BACKEND - FINAL ARCHITECTURE

```
CUSTOMER FLOW:
1. Booking UI → selects event/date/time/details
2. Submit → System creates provisional calendar event (🟡)
3. Confirmation screen shows bank details + amount + reference
4. Invoice also emailed (existing Apps Script automation)
5. Customer transfers 50% deposit
6. Rochelle gets bank app notification
7. Rochelle taps "Confirm" link (mobile-friendly)
8. System: Calendar 🟡→✅ + Confirmation email sent
```

**Key decisions:**
- NO Stripe - bank transfer only
- NO 15-min hold expiry - request-to-book model
- Provisional event blocks calendar until confirmed or manually removed
- 50% deposit secures booking, remaining 7 days before event
- Bank details shown on screen + in invoice email

---

## WHAT EXISTS

| Component | Status | Location |
|-----------|--------|----------|
| Booking UI demo | ✅ Done | `2_Areas/01-Hibiscus-Studio/hibiscus-studio-deploy/booking-demo.html` |
| Invoice automation | ✅ Done | `2_Areas/01-Hibiscus-Studio/SOPs/Invoicing_Revamp/APPS_SCRIPT_CODE.js` |
| Service account | ✅ Done | `00_Inbox/jan 25/hibiscus-booking-5a667af173fb.json` |
| Calendar API enabled | ✅ Done | Project: hibiscus-booking |
| Calendar shared | ✅ Done | Both calendars shared with service account |
| Perplexity code | ✅ Reference | `00_Inbox/jan 25/perplexity-bundle/hibiscus_backend_code.js` |

---

## WHAT NEEDS TO BE BUILT

### Minimal Cloudflare Worker (~150 lines)

**Endpoints needed:**

```javascript
GET  /api/availability?date=YYYY-MM-DD
  → Query freeBusy on BOTH calendars
  → Return available slots

POST /api/bookings
  → Create provisional calendar event (🟡 title)
  → Store booking in KV
  → Return booking ID + bank details

POST /api/bookings/:id/confirm?token=XXX
  → Verify token (simple auth)
  → Update calendar event (🟡 → ✅)
  → Send confirmation email
  → Return success page

GET  /api/bookings/:id
  → Return booking status
```

**Remove from Perplexity code:**
- All Stripe logic (~100 lines)
- 15-min expiry/cleanup cron
- Stripe webhook handler

**Keep from Perplexity code:**
- Calendar client setup (getCalendarClient)
- freeBusy query logic
- Event create/update logic
- Basic email sending (or use existing Apps Script)

---

## STEP-BY-STEP TO WORKING SYSTEM

### Phase 1: Backend (2 hours)
1. Create Cloudflare Worker project
2. Store secrets: `GOOGLE_SERVICE_ACCOUNT_JSON`, `GOOGLE_CALENDAR_ID`
3. Implement `/api/availability` - test with curl
4. Implement `/api/bookings` - test creates calendar event
5. Implement `/api/bookings/:id/confirm` - test updates event

### Phase 2: Frontend Connection (1 hour)
6. Update booking-demo.html to call `/api/availability` on date select
7. Update submit to call `/api/bookings`
8. Show confirmation screen with bank details
9. Generate "Confirm" link for Rochelle

### Phase 3: Email (30 mins)
10. Either: Trigger existing Apps Script for invoice
11. Or: Add Resend for confirmation email

### Phase 4: Test End-to-End (30 mins)
12. Customer: Complete booking flow
13. Rochelle: Receive notification + tap confirm
14. Customer: Receive confirmation email
15. Calendar: Event shows ✅

---

## CRITICAL FILES TO READ FIRST

```
/00_Inbox/jan 25/hibiscus-booking-5a667af173fb.json  (service account)
/00_Inbox/jan 25/perplexity-bundle/hibiscus_backend_code.js  (reference)
/2_Areas/01-Hibiscus-Studio/SOPs/Invoicing_Revamp/APPS_SCRIPT_CODE.js  (existing)
```

---

## HB STUDIO FACTS (Don't forget again)

- **Event types:** Bridal Party / Private Event / Workshop / Viewing
- **NOT a photography studio** - multi-purpose venue
- **Pricing:** £300 base, £50 late-night surcharge
- **Deposit:** 50% to secure, remaining 7 days before
- **Payment:** Bank transfer ONLY (no Stripe)
- **Admin:** Rochelle (business owner, gets bank notifications)
- **VA:** Thailand timezone (not for payment confirmation)
- **Calendars:**
  - NEW: contacthibiscusstudio@gmail.com (write here)
  - OLD: hibiscusstudiouk@gmail.com (read for conflicts)

---

## OPEN QUESTIONS FOR NEXT SESSION

1. Does Rochelle want "I've paid" button for customer to notify faster?
2. Cancellation policy terms (14 days full / 7 days 50% / <7 days none)?
3. Should dual-booking collision create soft-hold or just notify admin?
4. Email: Use existing Apps Script or new Resend integration?

---

## LINKS.JSON TRIGGERS

When you see these words, check these files:
- "HB booking" → this handoff + session-packets folder
- "calendar backend" → perplexity-bundle + service account JSON
- "invoice automation" → Apps Script in SOPs folder
- "jan 25" → braindump-grouped.txt + this session packet

---

## PROCESS LESSONS (For AI)

**Mistakes made this session:**
1. Assumed "photography studio" - HB is multi-purpose venue (workshops, bridal showers, etc.)
2. Ran with Stripe assumption too long before checking user's actual payment method
3. Didn't check file dates - perplexity-bundle was from today, should have read first
4. Proposed "24 hour" confirmation SLA - lazy thinking, Rochelle gets instant bank notifications

**What worked:**
1. Interview-first model - sequential questions to find force target
2. Two-agent sparring for blind spots
3. Running decisions through frameworks-grounded.md
4. User corrections caught assumptions early

**For next time:**
- Read newest files first (check dates)
- Verify product/service details before designing
- Ask about existing payment flow before proposing new one
- Think harder before defaulting to "24 hours"
