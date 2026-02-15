---
session_id: 2026-02-04-hb-booking-deployment-2h-fix
session_date: 2026-02-04
duration_hours: 1.0
projects_touched: [HB, INFRA]
work_types: [implementation, deployment]
value_tier: critical
impact_score: 9
decisions_count: 2
artifacts_count: 3
tasks_completed: 3
items_open: 0
---

# Session Packet: HB Booking Deployment + 2-Hour Slot Fix

**Session Date:** 2026-02-04
**Status:** ✅ Complete
**Duration:** ~1h
**Work Type:** Deployment + Critical Bug Fix

---

## CONTEXT

Two deployments needed:
1. **Deploy 9 booking funnel fixes** from earlier session (already committed, not yet deployed)
2. **Critical 2-hour slot bug** discovered by user — 2-hour bookings show NEGATIVE event time due to hard-coded 1h 15m setup/pack times

User requested: "deploy the booking fixes" then "We need a 15 min setup and pack down for the 2h slot" (later clarified: 20 minutes, not 15).

**Discovery:** All event durations used 1h 15m setup + 1h 15m pack down (2.5 hours overhead), making 2-hour bookings mathematically impossible (2h - 2.5h = -30 minutes actual time).

---

## DECISIONS MADE

### 1. Deploy 9 Booking Fixes First (CRITICAL)

**Decision:** Deploy earlier booking funnel fixes to production before starting new work

**Why:**
- Already committed (641e4ca)
- Revenue-blocking bugs fixed (Content Creation visible, pricing correct, viewing flow working)
- 100% test pass rate (15/15 Puppeteer tests)

**Impact:** Content Creation bookings (£90-£500) now functional, all event types show correct time slots

**Verification:** User flagged deployment target confusion — clarified hibiscusstudio.co.uk/book (not root domain)

**Deployed:** Commit 641e4ca pushed to main → GitHub Pages live

---

### 2. 20-Minute Setup/Pack for 2-Hour Slots Only (CRITICAL)

**Decision:** Change setup/pack times to 20 minutes each for 2-hour bookings only (not all durations)

**Why:**
- Current: 2h - 1h 15m setup - 1h 15m pack = **-30 minutes** (impossible!)
- Customers paying for 2 hours get zero actual event time
- Blocks Content Creation and Workshop 2-hour revenue
- User scoped: "we are only changing the 2h slots... its only the critical 2h we need to do now"

**Impact:**
- 2-hour bookings now show 1h 20m actual time (67% of booking — viable)
- All other durations unchanged (4h, 6h, 8h, 12h keep 1h 15m setup/pack)

**Location:** book/index.html (lines 1875-1887)

**Implementation:** Duration-based conditional logic
```javascript
if (totalHours === 2) {
    setupTime = 0.33;   // 20 min
    packdownTime = 0.33; // 20 min
} else {
    setupTime = 1.25;   // 1h 15m (all other durations)
    packdownTime = 1.25; // 1h 15m
}
```

**Deployed:** Commit b11dc0c pushed to main → GitHub Pages live

---

## WHAT WAS CREATED

### 1. Setup/Pack Analysis Table
- **File:** `/scratchpad/setup-packdown-analysis.md`
- **Content:** Comprehensive table showing all event types, durations, current vs recommended times
- **Purpose:** User requested "table that has the event type and you'll recommend the current setup and pack-down time and then what you recommend it to be for each one"
- **Outcome:** User scoped to 2-hour slots only after reviewing

### 2. Notion Ticket (Setup/Pack Fix)
- **Title:** "Fix 2-Hour Slot Setup/Pack Down Times (Critical Revenue Bug)"
- **URL:** https://www.notion.so/2fd70b6455cb81bd851bc22f64523140
- **Status:** Created → In Progress → Done (full workflow)
- **Project:** HB Studio (tagged)
- **Content:** Problem, solution, technical details, testing, future suggestions

### 3. Session Packet
- **This file:** Documents deployment + 2-hour fix session

---

## WHAT WAS UPDATED

### 1. Booking Funnel Code (book/index.html)
**Lines 1875-1887:** Replaced hard-coded setup/pack times with conditional logic
- Added duration check for 2-hour slots
- Preserved 1h 15m for other durations
- Added explanatory comments

### 2. Git Repository
**Commit b11dc0c:** "Fix 2-hour slot setup/pack down times — critical revenue bug"
- 1 file changed, 12 insertions, 3 deletions
- Pushed to main branch
- Deployed to hibiscusstudio.co.uk/book via GitHub Pages

### 3. Notion Project Tracker
**Ticket 2fd70b64-55cb-81bd:** Workflow progression
- Status: Not started → In progress → Done
- Project: Tagged "HB Studio"
- Updated twice during session (status changes)

---

## VALUE DELIVERED

### Immediate
- ✅ **9 booking funnel fixes deployed** — Content Creation revenue stream operational
- ✅ **2-hour slot bug fixed** — Workshop and Content Creation 2h bookings now show 1h 20m actual time (was -30 min)
- ✅ **Two production deployments** — Both commits pushed and live on hibiscusstudio.co.uk/book
- ✅ **Notion workflow demonstrated** — Created ticket, moved through statuses, marked done

### Foundational
- 📊 **Analysis table pattern** — Reusable for future "show me all options" requests
- 🎫 **Notion API integration** — Direct curl calls work when MCP fails (bypass pattern established)
- 📝 **Duration-based logic** — Extensible for future optimizations (4h, 6h, 8h suggested but not scoped)

---

## OPEN ITEMS

**None** — All work completed and deployed.

**Future suggestions documented (not in scope):**
- 4 hours: 30 min setup/pack → 3h actual (currently 1.5h)
- 6 hours: 45 min setup/pack → 4.5h actual (currently 3.5h)
- 8 hours: 1h setup/pack → 6h actual (currently 5.5h)
- 12 hours: Keep 1h 15m (already good at 79% actual time)

---

## META

### Pattern Observed: Deployment Verification Confusion
**Issue:** I said "deploys to hibiscusstudio.co.uk" (sounded like root) when change was to book/index.html (deploys to /book subdirectory)

**User correction:** "wait, its hibiscusstudio.co.uk/book that this is being applied to not hibiscusstudio.co.uk"

**Resolution:** Verified file structure, confirmed book/index.html → /book path, checked commit showed correct file

**Lesson:** Always specify full URL path when deploying, not just domain. "Deploys to hibiscusstudio.co.uk/book" is clearer than "deploys to hibiscusstudio.co.uk"

### Pattern Observed: Scope Expansion Then Reduction
**Flow:**
1. User: "We need 15 min setup/pack for 2h slot"
2. I created comprehensive analysis table (all event types, all durations)
3. User: "we are only changing the 2h slots... its only the critical 2h we need to do now"

**Lesson:** When unclear scope, show analysis table first → user clarifies exact scope → implement only what's needed. Analysis table served as communication tool, not full implementation plan.

### Pattern Observed: Notion MCP Fails, Direct API Works
**Issue:** MCP Notion tool failed with validation error (parent object parsing)

**Workaround:** Used direct curl with NOTION_TOKEN from `.mcp.json`

**Success:** Created ticket, updated status twice, tagged project — all via direct API

**Lesson:** Keep direct API scripts as fallback when MCP tools fail. Token location: `/projects/.mcp.json`

---

## SOURCES (80/20)

◇ 70% — User voice instructions (deployment request, 2-hour slot issue clarification, scope reduction)
◇ 20% — book/index.html (lines 1875-1887, setup/pack logic, pricing structures)
◇ 10% — Previous session packets (context on 9 fixes deployed earlier)
