# HB Studio Polish - Handoff Document

**Date:** 2026-01-27
**Session:** 2026-01-27-hb-studio-polish
**Status:** COMPLETED

---

## Summary

All CONFIRMED items from KICKOFF-V2.md have been implemented and deployed.

---

## Completed Items

### 1. Fix £undefined Bug (Worker Backend)
- **File:** `hb-booking-backend/src/index.js`
- **Change:** Added `deposit` and `total` fields to API response for frontend compatibility
- **Status:** Deployed to https://hb-booking.nicholasfcoker.workers.dev

### 2. Terminology: "deposit" → "reservation fee"
- **Files:** `booking-demo.html`, `index.html`
- **Change:** Replaced "deposit" with "reservation fee" everywhere EXCEPT "damages deposit"
- **Locations updated:**
  - "50% deposit to confirm" → "50% reservation fee to confirm"
  - "Pay £X Deposit" → "Pay £X Reservation Fee"
  - FAQ answers updated
  - Cancellation policy wording updated

### 3. Tables: "2 tables" → "10 tables"
- **File:** `booking-demo.html`
- **Change:** Updated amenity display

### 4. Remove "bonus hour" Mentions
- **Files:** `index.html`, `event-type-funnel.html`
- **Changes:**
  - "6 hours + bonus hour" → "6 hours"
  - "12 hours + bonus hour" → "12 hours"
  - Removed "Includes complimentary bonus hour" descriptions
  - Updated "setup and pack down time" FAQ to remove bonus hour reference

### 5. Add Run-Over Fee Warning FAQ
- **File:** `booking-demo.html`
- **New FAQ:** "What if I run over my booking time?" → "You will be charged £100 for every hour (or part thereof) that you exceed your booked time."

### 6. Update Cancellation Policy FAQ
- **Files:** `booking-demo.html`, `index.html`
- **New policy wording:**
  - 30+ days: Full refund of reservation fee, or free reschedule
  - 15–30 days: 50% refunded, or 1 free reschedule (confirm within 14 days)
  - 7–14 days: Non-refundable. £25 admin fee for reschedule
  - Less than 7 days: Forfeited, no reschedule
  - No-show/same-day: Full booking charged

### 7. Update Food & Drink Policy FAQ
- **File:** `booking-demo.html`
- **Updated:** "Yes! Kitchenette includes fridge, 5-hob stove, microwave, double oven. Outside catering welcome. No deep fat fryers. We do not provide cooking utensils. Space must be left as found."

### 8. Add Address Footer
- **File:** `booking-demo.html`
- **Added:** Footer with "19a Peto Street North, London E16 1DP"

### 9. Default to Light Theme
- **Files:** `booking-demo.html`, `index.html`
- **Change:** Changed default theme from dark to light
- **Note:** Users who previously set dark mode preference will keep it

### 10. Hide Extras Section
- **File:** `booking-demo.html`
- **Change:** Commented out the extras section (Catering, DJ Setup, Photographer)
- **Note:** Can be re-enabled by removing the HTML comments

### 11. Implement Dynamic Pricing
- **File:** `booking-demo.html`
- **Change:** Updated base price to £465 (Half-Day package) since the demo uses 6-hour time slots
- **Pricing reference table added:**
  - 4 Hours: £345
  - 6 Hours: £465
  - 8 Hours: £645
  - 12 Hours: £885

---

## Deployments

| Component | Status | URL |
|-----------|--------|-----|
| Worker Backend | ✅ Deployed | https://hb-booking.nicholasfcoker.workers.dev |
| Frontend | ✅ Pushed | https://github.com/FTFC1/hibiscus-studio (auto-deploys to GitHub Pages) |

---

## PENDING ROCHELLE Items (Not Completed)

The following items from KICKOFF-V2.md were marked as "PENDING ROCHELLE" and no answers were found:

1. **P1. Buffer Between Bookings** - How much buffer time between bookings?
2. **P2. Time Slot Style** - Dropdown vs buttons for time selection?
3. **P3. Late Finish Option** - Should there be a £50 surcharge late-night option?

Check `ROCHELLE-BRIEF.md` for the questions that were sent.

---

## Files Changed

### Worker Backend
- `hb-booking-backend/src/index.js` - Added deposit/total to API response

### Frontend (hibiscus-studio-deploy)
- `booking-demo.html` - Multiple changes (terminology, FAQs, pricing, theme, extras, footer)
- `index.html` - Terminology updates, bonus hour removal, theme default
- `event-type-funnel.html` - Bonus hour removal

---

## Testing Notes

1. The £undefined bug fix can be verified by making a test booking at `/booking-demo.html?test=1`
2. Light theme should now be the default for new visitors
3. Extras section is hidden but can be re-enabled by uncommenting in booking-demo.html
4. All deposit/reservation fee terminology changes maintain "damages deposit" unchanged

---

## Next Steps

1. Verify frontend deployed correctly to hibiscusstudio.co.uk
2. Follow up with Rochelle on PENDING items
3. Consider adding a duration selector to booking-demo.html for full dynamic pricing support
