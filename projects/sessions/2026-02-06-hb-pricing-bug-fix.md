---
session_id: 2026-02-06-hb-pricing-bug-fix
session_date: 2026-02-06
duration_hours: 3.5
projects_touched: [HB]
work_types: [implementation, bugfix, infrastructure]
value_tier: critical
impact_score: 9
decisions_count: 8
artifacts_count: 5
tasks_completed: 7
items_open: 1
---

# Session Packet: HB Pricing Bug Fix + Dashboard Crash Recovery + Reschedule Fix

**Session Date:** 2026-02-06
**Status:** ✅ Complete
**Duration:** ~3.5h
**Work Type:** Bugfix, infrastructure, feature

---

## CONTEXT

Customer Bose Omoyeni (HB-MLAX4SS7) booked Content Creation 2h but was charged £465 instead of £90. User reported the incorrect pricing from the admin dashboard. Investigation revealed a critical backend pricing bug affecting all event types.

---

## DECISIONS MADE

### 1. Event-Type-Specific Pricing Tables (CRITICAL)

**Decision:** Replace single `DURATION_PRICES` table with three separate tables: `EVENT_HIRE_PRICES`, `WORKSHOP_PRICES`, `CONTENT_CREATION_PRICES`

**Why:** Backend had only one pricing table (4h=£345, 6h=£465, 8h=£645, 12h=£885). No 2-hour entry existed, so `parseInt(duration) || 6` defaulted to 6h = £465 for ALL event types. Frontend had correct per-type pricing but backend didn't.

**Impact:** All Content Creation and Workshop bookings were being overcharged. Content Creation 2h was £465 instead of £90.

**Location:** `hb-booking-backend/src/index.js:555-599`

### 2. safeJsonParse for Corrupted Data (CRITICAL)

**Decision:** Add `safeJsonParse()` function that strips markdown code fences (` ```json...``` `) before parsing

**Why:** Dashboard crashed with Error 1101 because a KV entry contained markdown-formatted JSON. All JSON.parse calls in admin routes updated to use safeJsonParse with try-catch. Corrupted entries are skipped instead of crashing the whole worker.

**Impact:** Dashboard no longer crashes on malformed data. Resilient to AI-generated content accidentally stored in KV.

**Location:** `hb-booking-backend/src/index.js:21-29`

### 3. Email+Date Dedup for KV Overrides (IMPORTANT)

**Decision:** Dedup calendar events against KV bookings by calendarEventId OR name+date OR email+date

**Why:** Manually-added KV entries (for price corrections) don't have a calendarEventId, so the original dedup logic couldn't match them to calendar events, causing duplicates.

**Impact:** KV overrides correctly suppress duplicate calendar entries on the dashboard.

**Location:** `hb-booking-backend/src/index.js:2320-2339`

### 4. London Timezone for All Business Logic (IMPORTANT)

**Decision:** Add `getLondonNow()` and `getLondonToday()` helpers, replace all `new Date()` + `setHours(0,0,0,0)` patterns

**Why:** User is in Lagos (WAT, UTC+1) but venue is in London. Workers run in UTC. All "today" calculations, day-of-week buckets, and cancellation policy windows now use `Europe/London` timezone explicitly.

**Impact:** Dashboard shows correct day boundaries and cancellation windows regardless of where the operator is.

**Location:** `hb-booking-backend/src/index.js:31-43`

### 5. Admin Calendar Sync Endpoint (MINOR)

**Decision:** Add `POST /api/admin/bookings/:id/sync-calendar` to create calendar events for KV-only bookings

**Why:** Bose's original calendar event was accidentally cancelled (wrong one). Needed a way to recreate it from the KV data without going through the full booking flow.

**Location:** `hb-booking-backend/src/index.js:2402-2422`

### 6. Manual KV Override for Bose's Booking (IMPORTANT)

**Decision:** Manually add KV entry for HB-MLAX4SS7 with correct £90 pricing

**Why:** Calendar event had old incorrect price (£465). KV entries override calendar entries in the dashboard merge. Created copy-to-clipboard HTML helper for exact JSON.

### 7. Duration-Aware Reschedule Slots (IMPORTANT)

**Decision:** Admin dashboard reschedule modal now generates time slots based on booking's actual duration, not fixed 6h blocks

**Why:** Bose requested a date change for her 2h Content Creation booking. The reschedule modal only showed 6h slots (10am-4pm, etc.), making it impossible to reschedule shorter bookings correctly. Admin said: "the system only provides six hour slots but this is content which is a two hour slot."

**Impact:** All booking types now get duration-appropriate slots when rescheduling. 2h bookings get hourly slots (10am-12pm, 11am-1pm, etc.), 4h bookings get 4h slots, etc. The `/api/availability` endpoint now accepts `?duration=X` parameter.

**Location:** `hb-booking-backend/src/index.js` — `generateDurationSlots()`, `checkAvailability()`, `showChangeDateModal()`, `fetchSlots()`, `change-date` endpoint

### 8. Notion Task Tracking Update (MINOR)

**Decision:** Mark completed HB tasks as Done in Notion "Aloe Labs Work" database

**Why:** Keep Notion project board in sync with actual work completed. "Double Booking Test" marked Done. Note: Notion MCP `post-page` has JSON serialization bug — use curl + JSON file pattern for creating new pages.

**Impact:** Notion board reflects current state. 4 new Done items need to be created via curl pattern (pricing fix, reschedule fix, timezone, dashboard crash recovery).

---

## WHAT WAS CREATED

1. `safeJsonParse()` function — Markdown code fence stripping + JSON.parse
2. `getLondonNow()` / `getLondonToday()` helpers — London timezone for all business logic
3. `POST /api/admin/bookings/:id/sync-calendar` — Create calendar events for KV bookings
4. Bose corrected email HTML — Formatted confirmation with strikethrough £465, correct £90
5. `generateDurationSlots(duration)` — Creates hourly start-time slots for any booking duration

---

## WHAT WAS UPDATED

1. `hb-booking-backend/src/index.js` — Pricing tables, safeJsonParse, timezone, dedup, sync endpoint, duration-aware reschedule
2. KV namespace — Added HB-MLAX4SS7 with correct £90 pricing
3. Google Calendar — Recreated Bose's calendar event via sync-calendar endpoint
4. Multiple deployments: pricing fix → crash fix → dedup fix → timezone fix → sync endpoint → reschedule fix
5. Notion "Aloe Labs Work" database — "Double Booking Test" marked Done

---

## VALUE DELIVERED

### Immediate
- Bose's booking now shows correct £90 in dashboard (was £465)
- Calendar event recreated for Feb 17 Content Creation
- Future Content Creation bookings will be priced correctly (2h=£90, 6h=£250, 12h=£500)
- Future Workshop bookings will be priced correctly (2h=£120, 6h=£345, 12h=£645)
- Dashboard no longer crashes on corrupted KV data
- All business logic uses London timezone
- Admin can reschedule any booking type with correct duration slots (not just 6h)

### Foundational
- safeJsonParse prevents future crashes from markdown-formatted data
- Email+date dedup allows manual KV overrides without duplicates
- London timezone helpers available for all future time-sensitive logic
- sync-calendar endpoint enables calendar recovery for any booking
- generateDurationSlots() works for any duration — future event types automatically supported
- Notion MCP bug documented — use curl + JSON file pattern for page creation

---

## OPEN ITEMS

- Send corrected confirmation email to Bose (boseomoyeni23@gmail.com) — HTML ready, needs to be sent via Resend API or manually
- Create 4 Notion pages via curl (pricing fix, reschedule fix, timezone, dashboard crash) — MCP post-page broken

---

## META

**Pattern observed:** Single pricing table for multiple event types is a common source of overcharging bugs. Backend should always mirror frontend pricing logic.

**Lesson:** When debugging Worker crashes (Error 1101), add an outer try-catch first to capture the actual error message. The Cloudflare error page gives no useful information. Also: AI tools can accidentally write markdown-formatted JSON to storage — always sanitize before parsing.

**Lesson:** When operating from a different timezone than the business, always use explicit timezone helpers rather than `new Date()` which uses the runtime's timezone (UTC on Workers).
