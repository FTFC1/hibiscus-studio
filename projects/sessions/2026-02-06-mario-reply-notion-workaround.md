---
session_id: 2026-02-06-mario-reply-notion-workaround
session_date: 2026-02-06
duration_hours: 0.5
projects_touched: [GAS, INFRA]
work_types: [implementation, infrastructure]
value_tier: high
impact_score: 8
decisions_count: 3
artifacts_count: 2
tasks_completed: 3
items_open: 1
---

# Session Packet: Mario Reply + Notion MCP Workaround

**Session Date:** 2026-02-06
**Status:** ✅ Complete
**Duration:** ~30 min
**Work Type:** Implementation + Infrastructure

---

## CONTEXT

Mario Abugo (BTL architect at Design Group Nigeria) replied to DSG profiling message sent Feb 5. Her response contained critical process intel about backup power decision-making. Needed to:
1. Update her Notion profile with intel
2. Draft appropriate follow-up reply
3. Fix Notion MCP integration (was failing with JSON parsing errors)

**User corrections:**
- Mario = she (not he)
- MEP knowing early ≠ findable trigger (they know internally, won't post online)
- Hiring = weak trigger (not reliable enough)
- Rentals = smart door-opener idea (Mikano already offers them)

---

## DECISIONS MADE

### 1. Notion MCP Workaround via Direct API (CRITICAL)

**Decision:** Use direct Notion API calls via curl + JSON files instead of Notion MCP

**Why:** Notion MCP `mcp__notion__API-patch-page` has JSON parsing bug. Treats JSON properties object as string of individual character indices (error: "Couldn't find editable properties for these identifiers: 0,1,2,3,4..."). MCP read operations work, but writes fail.

**Impact:** Can now reliably update Notion database properties. Pattern documented in CLAUDE.md for future use.

**Location:** CLAUDE.md — New "Notion Integration" section

**Pattern:**
```bash
# 1. Create JSON payload in scratchpad
# 2. Extract token from .mcp.json
# 3. curl PATCH with -d @file.json
```

---

### 2. Construction Backup = Rentals Door-Opener (IMPORTANT)

**Decision:** Framed construction backup question as "rentals vs buy" demand inquiry (not "I hadn't thought about it")

**Why:** User corrected: "Mikano already does rentals, saying it like that makes me seem unaware commercially about what we offer." Original draft asked about construction backup as if it was a new idea. Corrected version acknowledges Mikano offers rentals and asks about DEMAND patterns.

**Impact:** Reply maintains commercial awareness while still being diagnostic/learning-focused.

**Location:** Mario's Notion "Next Action" field

---

### 3. Traffic Light: Green (IMPORTANT)

**Decision:** Marked Mario as Green in DSG Traffic Light system

**Why:** Her reply shows:
- Has active projects (backup power comes up regularly)
- Understands process (knows when/how electrical engineers engage)
- Willing to engage (replied within 24h, provided detailed intel)
- Defers to MEP consultants (validates 3.7x reply rate targeting)

**Impact:** Green = qualified prospect for continued profiling, potential referral source

**Location:** Mario's Notion "Traffic Light" field

---

## WHAT WAS CREATED

### 1. Notion Update Pattern Documentation
**File:** CLAUDE.md — "Notion Integration" section
**Purpose:** Reference for future Notion database updates via direct API
**Contains:**
- MCP bug description
- curl + JSON file pattern
- Token extraction from .mcp.json
- Example code

### 2. Mario Follow-Up Reply (Copy-Paste Ready)
**Location:** Mario's Notion "Next Action" field
**Content:**
```
Thank you Mairo! That's really helpful context.

Out of curiosity, when you work with electrical engineers on projects, do they typically bring their own generator specs, or do they ask vendors like Mikano for sizing recommendations?

Also interesting about construction backup. Do you see temporary rentals being common for that phase, or do developers usually prefer to buy outright?
```

**Tone:** Diagnostic/learning, not sales-y. Acknowledges Mikano offers rentals.

---

## WHAT WAS UPDATED

### 1. Mario Abugo Notion Profile
**Updated fields:**
- **Traffic Light:** → Green
- **Intel Gathered:** → Process intel captured (electrical engineers drive decisions, construction + operational backup needs, early engagement window exists)
- **Next Action:** → Follow-up reply ready to send

**Method:** Direct Notion API via curl (3 separate PATCH requests)

### 2. CLAUDE.md
**Added:** "Notion Integration" section after "Custom Skills & Commands"
**Contains:** MCP workaround pattern, when to use, example code

---

## VALUE DELIVERED

### Immediate
- ✅ **Mario's intel captured** — MEP consultants = decision drivers, early engagement window exists, construction backup = hidden opportunity
- ✅ **Reply ready to send** — Diagnostic questions about spec process + rental demand
- ✅ **Notion updates working** — Workaround pattern documented and tested
- ✅ **Commercial awareness maintained** — Reply acknowledges Mikano offers rentals

### Foundational
- ✅ **Notion MCP bug workaround documented** — Future database updates won't be blocked
- ✅ **DSG profiling validated** — 24h reply from BTL contact confirms approach works
- ✅ **Rentals-as-door-opener strategy** — Construction backup could be entry point to operational sales
- ✅ **MEP targeting validated** — Mario confirms electrical engineers drive backup power decisions (aligns with 3.7x reply rate data)

---

## STRATEGIC INTEL FROM MARIO

### Process Intel Captured:
- Backup power brought up by electrical engineers **as soon as they're engaged**
- They assess all power sources immediately
- Recommend backup for: (1) operational use, (2) construction phase
- Architect aware but defers to MEP/electrical team

### Strategic Implications:
✅ **MEP consultants = decision drivers** (validates 3.7x reply rate targeting)
✅ **Early engagement window exists** (not already specified by site visit time)
✅ **Construction backup = hidden entry point** (temporary gen → operational sale)
❌ **Early knowledge ≠ public trigger** (MEP knows internally, won't post online)
❌ **Hiring signals = weak trigger** (not reliable enough alone)

### Rentals Opportunity:
- Construction backup could be door-opener if end users agreed to use
- Short-term rental during build → spec permanent after
- Mikano already offers rentals - need to understand demand patterns

### Data Point Note:
One contact (but aligns with MEP interview intel from Feb 2 strategy pivot)

---

## OPEN ITEMS

### 1. Send Mario's Follow-Up Reply (USER ACTION)
**Message ready in Notion "Next Action" field**
**Questions:**
- Do electrical engineers bring their own specs or ask vendors for sizing?
- Are temporary rentals common for construction phase, or do developers prefer to buy?

**Expected Intel:**
- Spec-driven vs advisory-driven MEP consultants
- Construction rental demand patterns

---

## META

**Pattern observed:** DSG profiling approach works in Nigerian context. 24h reply from BTL architect with detailed process intel validates diagnostic/learning tone over sales pitch.

**Lesson:** When tools (like Notion MCP) have bugs, document workarounds in CLAUDE.md immediately. Direct API access via curl is reliable fallback when MCP fails.

**Commercial awareness matters:** User caught phrasing that made them seem unaware of their own offerings. Always frame questions assuming commercial knowledge exists, ask about demand/patterns instead.

**One data point ≠ pattern:** Mario's intel aligns with MEP interview from Feb 2, but still just one contact. Need more BTL responses before drawing broad conclusions about trigger findability.

---

## FILES CREATED THIS SESSION

1. `/Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/CLAUDE.md` — Updated (Notion Integration section added)
2. `/private/tmp/.../scratchpad/notion-update-intel.json` — Payload for Intel Gathered update
3. `/private/tmp/.../scratchpad/notion-update-action.json` — Payload for Next Action update

**Notion updates:** 3 API calls (Traffic Light, Intel Gathered, Next Action) — all successful

---

**Session completed:** 2026-02-06
**Value tier:** HIGH (validates DSG approach + fixes future Notion updates)
**Impact score:** 8/10 (process intel + infrastructure fix)
**Next action:** User sends Mario's reply, waits for spec process + rental demand intel
