# Session Summary: HB Duration Picker + Price List

**Session Date:** 2026-01-31
**Duration:** ~3 hours
**Project:** Hibiscus Studio
**Status:** 🟡 Mostly Complete (1 blocker)

---

## TIMELINE

| Time | Event | Outcome |
|------|-------|---------|
| 1 | Context restoration | Picked up from compacted session |
| 2 | Fixed PAST badge | Admin dashboard shows correct urgency for past dates |
| 3 | Added Balance Due actions | Change/Cancel buttons on confirmed bookings |
| 4 | Pricing investigation | Found session packets > old PDF for pricing truth |
| 5 | Duration picker UI | 4 cards (4hr/6hr/8hr/12hr) with £345-£885 pricing |
| 6 | Recommendation engine | Event type → suggested duration mapping |
| 7 | Dynamic time slots | generateTimeSlots() based on selected duration |
| 8 | Backend integration | DURATION_PRICES, calendar events, booking API |
| 9 | 6-hook verification | Frontend-backend integration triple-checked |
| 10 | Price list v006 | Static HTML document with current business logic |
| 11 | Capacity fix | Corrected 60/80 → 40 max guests |
| 12 | Craft MCP setup | Session restart required |
| 13 | Craft price list | Created beautiful shareable doc in Craft.do |
| 14 | /book URL | hibiscusstudio.co.uk/book now live |
| 15 | ManyChat scoped | Parked IG DM automation for later |

---

## DECISIONS

| ID | Decision | Rationale |
|----|----------|-----------|
| D1 | Use session packet pricing (£345-885) | Jan 27 HANDOFF.md explicitly documented dynamic pricing |
| D2 | Build in GitHub Pages (booking-demo.html) | Easier to edit, fancier UI, deploys via git push |
| D3 | Support both legacy + new formats | Don't break existing timeSlot integrations |
| D4 | Event type → duration mapping | Simple lookup table, refineable with booking data |
| D5 | Generate slots from operating hours | 10am-10pm, fewer options for longer durations |
| D6 | Trust frontend for availability | Real check would require calendar query per slot |
| D7 | Max capacity = 40 guests | Verified from booking-demo.html guest selector |
| D8 | Use Craft.do for shareable docs | Better design than raw HTML, but blocked on MCP |

---

## OPEN QUESTIONS

1. **Craft MCP tools** - Session restart needed to access mcp__craft__* functions?
2. **event-type-funnel.html** - Does it also need the duration picker?
3. **Availability checking** - Implement duration-aware freebusy for real availability?
4. **Price list format** - Craft.do doc vs HTML vs PDF for Rochelle's use case?
5. **Workshop/Content pricing** - Are those also getting duration options?

---

## CURRENT CHALLENGES

| Challenge | Impact | Mitigation |
|-----------|--------|------------|
| Craft MCP tools not in session | Can't create beautiful shareable docs | Restart session OR use HTML for now |
| Old PDF still circulating | Customers may see wrong pricing (£510/£930) | Need to update/replace old PDF |
| No real availability check | Frontend shows slots that might conflict | TODO: duration-aware calendar query |
| Manual testing required | Can't auto-verify booking flow works | Rochelle to test manually |

---

## ARTIFACTS CREATED

| File | Type | Purpose |
|------|------|---------|
| `booking-demo.html` | Frontend | Duration picker + recommendations |
| `src/index.js` | Backend | DURATION_PRICES + calendar integration |
| `FAQ 006.html` | Document | Static price list with correct capacity |
| `index.md` | Session packet | Primary documentation |
| `decisions.md` | Session packet | Structured decision log |
| `session-tasks.csv` | Index | Task metadata for analysis |
| `SESSION-SUMMARY.md` | Session packet | This file |

---

## DEPLOYMENTS

| Component | URL | Status |
|-----------|-----|--------|
| **Booking Funnel** | https://hibiscusstudio.co.uk/book | ✅ Live |
| Frontend (legacy) | https://hibiscusstudio.co.uk/booking-demo.html | ✅ Live |
| Backend | https://hb-booking.nicholasfcoker.workers.dev | ✅ Live |
| Price List (Craft) | Craft.do → Projects folder | ✅ Shareable |
| Price List (HTML) | Local only (output/FAQ 006.html) | 📄 Backup |

---

## NEXT ACTIONS

1. [x] ~~Restart Claude session~~ - Done, Craft MCP working
2. [x] ~~Create Craft.do price list~~ - Done, in Projects folder
3. [x] ~~Set up /book URL~~ - Done, hibiscusstudio.co.uk/book live
4. [ ] **Rochelle testing** - verify duration picker works end-to-end
5. [ ] **Share Craft price list** - get link to Rochelle
6. [ ] **Deprecate old PDF** - FAQ 005 has wrong pricing + capacity
7. [ ] **ManyChat setup** (parked) - IG DM automation for later
8. [ ] **event-type-funnel.html** - may need same duration picker

---

## SUGGESTED SAVE LOCATIONS

| Artifact | Location | Reason |
|----------|----------|--------|
| Session packet folder | `/session-packets/2026-01-31-hb-duration-picker/` | ✅ Already here |
| Price list HTML | `/output/` or `/hibiscus-studio-deploy/docs/` | For GitHub Pages deployment |
| CSV task index | `/session-packets/` subfolder | Stays with session context |
| Craft.do doc (future) | Craft workspace | Shareable link, beautiful design |
| Final PDF export | `/output/` + email to Rochelle | Client-facing deliverable |

---

## SESSION METRICS

- **Tasks completed:** 8/9 (89%)
- **Blockers:** 1 (Craft MCP)
- **Lines changed:** ~500+ (frontend + backend)
- **Integration hooks verified:** 6
- **Documents created:** 4
