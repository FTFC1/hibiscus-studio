# Session Packet: HB Studio Duration Picker

**Session Date:** 2026-01-31 → 2026-02-01
**Project:** Hibiscus Studio
**Status:** ✅ Complete
**Duration:** ~4 hours
**Tasks:** 12 completed

## Deliverables

| What | Where | Status |
|------|-------|--------|
| **Booking funnel** | https://hibiscusstudio.co.uk/book | ✅ Live |
| **Duration pricing backend** | Cloudflare Worker | ✅ Live |
| **Craft price list** | Craft.do → Projects folder | ✅ Shareable |
| **HTML price list** | `/output/FAQ 006.html` | ✅ Backup |

## Quick Links
- [SESSION-SUMMARY.md](./SESSION-SUMMARY.md) - Full timeline, challenges, next actions
- [decisions.md](./decisions.md) - Structured decision log
- [session-tasks.csv](./session-tasks.csv) - Task index with energy/difficulty/role metadata

---

## Context

Rochelle asked about different booking time options (4 hours, 6 hours, half day, full day). Investigation revealed:

1. **PDF price list was outdated** (showed £510/£930)
2. **Session packets had current pricing** (from Jan 27-28):
   - 4hr: £345
   - 6hr: £465
   - 8hr: £645
   - 12hr: £885
3. **Backend was using wrong pricing** (`BASE_PRICE = 300`)
4. **No duration picker existed** - went straight from date to fixed 6hr time slots

---

## Implementation

### New Booking Flow

```
BEFORE:
Date → Time Slot (fixed 6hr) → Guests → Details → Confirm

AFTER:
Date → DURATION PICKER → Time Slots (dynamic) → Guests → Details → Confirm
        ↑
        Shows 4hr/6hr/8hr/12hr
        Recommends based on event type
```

### Files Changed

| File | Changes |
|------|---------|
| `hibiscus-studio-deploy/booking-demo.html` | +265 lines: duration step, CSS, JS functions |
| `hb-booking-backend/src/index.js` | Updated pricing, calendar creation, integration script |

### Frontend (booking-demo.html)

**New Step - Duration Picker:**
```html
<div class="step" id="stepDuration">
    <p class="step-title">How long do you need?</p>
    <p class="step-subtitle" id="durationRecommendation"></p>
    <div class="duration-options">
        <div class="duration-card" data-hours="4" onclick="selectDuration(4, 345)">
            <div class="duration-hours">4 hours</div>
            <div class="duration-price">£345</div>
        </div>
        <!-- ... 6hr, 8hr, 12hr cards -->
    </div>
</div>
```

**Recommendation Engine:**
```javascript
var durationRecommendations = {
    'bridal': 6,      // Bridal parties → 6 hours
    'baby': 6,        // Baby showers → 6 hours
    'birthday': 4,    // Casual birthdays → 4 hours
    'corporate': 12,  // Corporate → full day
    'workshop': 6,
    'content': 4
};
```

**Dynamic Time Slot Generation:**
```javascript
function generateTimeSlots(hours) {
    // 4hr: 5 options (10am-2pm, 12pm-4pm, 2pm-6pm, 4pm-8pm, 6pm-10pm)
    // 6hr: 4 options (10am-4pm, 12pm-6pm, 2pm-8pm, 4pm-10pm)
    // 8hr: 3 options (10am-6pm, 12pm-8pm, 2pm-10pm)
    // 12hr: 1 option (10am-10pm)
}
```

### Backend (src/index.js)

**Duration-Based Pricing:**
```javascript
const DURATION_PRICES = {
  4: 345,   // 4 hours Flexi
  6: 465,   // Half-day
  8: 645,   // 8 hours Flexi
  12: 885   // Full-day
};

function calculatePrice(booking) {
  const duration = parseInt(booking.duration) || 6;
  const basePrice = DURATION_PRICES[duration] || DURATION_PRICES[6];
  // ...
}
```

**Calendar Event Creation:**
```javascript
// Now supports both formats:
// - Legacy: timeSlot ID → lookup in TIME_SLOTS
// - New: startTime + endTime from duration picker
if (booking.startTime && booking.endTime) {
  startDateTime = `${booking.date}T${booking.startTime}:00`;
  endDateTime = `${booking.date}T${booking.endTime}:00`;
}
```

**Booking API:**
```javascript
// Accepts either format:
// - Legacy: { timeSlot: 'afternoon' }
// - New: { duration: 6, startTime: '14:00', endTime: '20:00' }
```

---

## Integration Hooks (Triple-Checked)

| # | Hook | Location | Verified |
|---|------|----------|----------|
| 1 | Date → Duration | `selectDate()` → `goToDuration()` | ✅ |
| 2 | Duration → Time | `selectDuration()` → `generateTimeSlots()` → `goToStep(5)` | ✅ |
| 3 | Time back → Duration | Step 5 back button → `goToDuration()` | ✅ |
| 4 | Pricing | `updateDepositAmount()` uses `selectedDurationPrice` | ✅ |
| 5 | API submission | integration.js sends `duration`, `startTime`, `endTime` | ✅ |
| 6 | Calendar event | `createProvisionalEvent()` uses new times | ✅ |

---

## Also Fixed (Earlier in Session)

- **PAST badge** for dates that have passed (was showing "TODAY")
- **Balance Due section** now has Change/Cancel buttons
- **Admin dashboard** deployed with payment tracking improvements

---

## Deployments

| Component | URL | Status |
|-----------|-----|--------|
| **Booking funnel** | https://hibiscusstudio.co.uk/book | ✅ Live |
| Frontend (legacy) | https://hibiscusstudio.co.uk/booking-demo.html | ✅ Live |
| Backend | https://hb-booking.nicholasfcoker.workers.dev | ✅ Live |
| Price list | Craft.do → Projects folder | ✅ Shareable |

---

## Testing Checklist

- [ ] Select "Bridal Party" → Duration step shows "6 hours" recommended
- [ ] Select "Birthday" → Duration step shows "4 hours" recommended
- [ ] Pick 4hr → See 5 time slot options
- [ ] Pick 12hr → See only "10am-10pm" option
- [ ] Complete booking → Calendar event has correct start/end times
- [ ] Invoice shows correct duration and price

---

## Also Delivered

### Craft.do Price List
**Location:** Craft → Projects folder → "Hibiscus Studio - Price List & Booking Guide"

Beautiful, shareable document with:
- All 4 duration packages (£345-£885)
- Capacity: 40 max
- FAQ section
- Booking steps
- Cancellation policy

### /book URL
**URL:** https://hibiscusstudio.co.uk/book

Clean, memorable URL for marketing. Points to duration picker funnel.

### HTML Price List (Backup)
**File:** `/output/Hibiscus Studio - Price List & FAQ 006.html`

Static HTML with correct pricing + capacity (40 max, not 60/80).

---

## Parked

- **ManyChat** - IG DM automation scoped but parked for later
- **event-type-funnel.html** - May need duration picker update

---

## Next Steps

1. **Rochelle to test** the new booking flow at hibiscusstudio.co.uk/book
2. **Share Craft price list** with Rochelle
3. Consider availability check for duration-based bookings
4. ManyChat setup when ready for IG automation
