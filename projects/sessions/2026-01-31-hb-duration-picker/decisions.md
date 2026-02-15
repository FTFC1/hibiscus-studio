# Decisions: HB Duration Picker

## D1: Pricing Source

**Question:** PDF showed different pricing than session packets. Which is correct?

**Decision:** Use session packet pricing (Jan 27-28)
- 4hr: £345
- 6hr: £465
- 8hr: £645
- 12hr: £885

**Rationale:** Session packets from Jan 27 HANDOFF.md explicitly documented dynamic pricing was implemented. PDF (FAQ 005) was older/outdated.

---

## D2: Where to Build Duration Picker

**Question:** Build in Cloudflare Worker or GitHub Pages?

**Decision:** GitHub Pages (`booking-demo.html`)

**Rationale:**
- Already has fancier UI
- Easier to edit (normal HTML vs template literals in JS)
- Deploys via git push
- User confirmed this is the customer-facing booking page

---

## D3: Backward Compatibility

**Question:** How to handle existing bookings that used old `timeSlot` format?

**Decision:** Support both formats
- Legacy: `{ timeSlot: 'afternoon' }` → lookup in TIME_SLOTS
- New: `{ duration: 6, startTime: '14:00', endTime: '20:00' }`

**Rationale:**
- Don't break existing integrations
- Calendar-only bookings from before system was built still work
- Gradual migration path

---

## D4: Recommendation Engine Logic

**Question:** How to recommend duration based on event type?

**Decision:** Simple mapping:
```javascript
'bridal': 6,      // Most need 6 hours
'baby': 6,        // Similar to bridal
'birthday': 4,    // Casual, shorter
'corporate': 12,  // Full day
'workshop': 6,    // Standard half-day
'content': 4      // Shoots are quick
```

**Rationale:** Based on existing recommendation engine data from `structured-data.md` session packet. Can be refined with actual booking data later.

---

## D5: Time Slot Generation

**Question:** What time slots to show for each duration?

**Decision:** Generate based on studio operating hours (10am-10pm):

| Duration | Slots |
|----------|-------|
| 4hr | 10am-2pm, 12pm-4pm, 2pm-6pm, 4pm-8pm, 6pm-10pm |
| 6hr | 10am-4pm, 12pm-6pm, 2pm-8pm, 4pm-10pm |
| 8hr | 10am-6pm, 12pm-8pm, 2pm-10pm |
| 12hr | 10am-10pm (only option) |

**Rationale:**
- All slots end by 10pm (studio closing)
- More duration = fewer start time options
- Full day is fixed to maximize usage

---

## D6: Availability Check for New Format

**Question:** How to check if duration fits in calendar?

**Decision:** Trust frontend display for now (TODO for later)

**Rationale:**
- Frontend shows slots based on static operating hours
- Real availability check would require querying calendar for each potential slot
- Can implement duration-aware freebusy check as enhancement
- Current system works because most bookings are same-day only
