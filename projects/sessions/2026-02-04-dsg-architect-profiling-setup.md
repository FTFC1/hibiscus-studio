---
session_id: 2026-02-04-dsg-architect-profiling-setup
session_date: 2026-02-04
duration_hours: 2.5
projects_touched: [GAS]
work_types: [implementation, infrastructure]
value_tier: high
impact_score: 8
decisions_count: 6
artifacts_count: 8
tasks_completed: 4
items_open: 1
---

# Session Packet: DSG Architect Profiling Database Setup

**Session Date:** 2026-02-04
**Status:** ✅ Complete
**Duration:** ~2.5h
**Work Type:** implementation + infrastructure

---

## CONTEXT

User requested application of DSG (Desperado Sales Group) "High Probability Prospecting" framework to Nigerian generator sales architect outreach. Previously had 10 architect contacts identified but no profiling system in place.

**Problem:** Contacts were identified but workflow was scattered across markdown files. When session ends, user loses context on who to contact, what messages to send, and what the execution plan is.

**User feedback:** "If you have these scripts and these random files, it doesn't work. Everything needs to be IN the database."

---

## DECISIONS MADE

### 1. Notion Database as Single Source of Truth (CRITICAL)

**Decision:** Build entire profiling workflow in Notion database instead of markdown files + CSV

**Why:** User needs self-contained system that survives session end. Each contact row contains: customized message (copy-paste ready), LinkedIn URL, phone number, profiling status, next action.

**Impact:** Zero mental overhead when starting Day 1 outreach tomorrow. Open database → see exactly who to message → copy message → send.

**Location:** https://www.notion.so/2fd70b6455cb802595c4c9bcce0800ff

---

### 2. Customized Messages Per Contact, Not Generic Templates (IMPORTANT)

**Decision:** Pre-write customized profiling message for each contact, store in "Next Action" field

**Why:** DSG framework requires firm-specific messaging (e.g., "estate/industrial" for FMA, "hotel/commercial" for Design Group). Generic templates waste time during execution.

**Impact:** 10 copy-paste-ready messages. User doesn't need to remember which firm does what.

**Location:** Notion "Next Action" field per contact

---

### 3. BTL-First Profiling Sequence (IMPORTANT)

**Decision:** 3 BTL contacts (junior architects) profiled Days 1-3, then use their intel to customize 7 ATL messages Days 3-5

**Why:** DSG "Below The Line" principle - junior contacts more honest about firm pipeline, provide intel to customize senior outreach

**Impact:**
- BTL: Mairo, Olujide, Bilikisu (Day 1 outreach)
- ATL: Emmanuel, Ndubuisi, Umele, Chukwudi, Segun (Day 3-5, customized with BTL intel)
- Gbenga (ATL but no BTL at CCP, send Day 1)

**Location:** Profiling order in DSG Execution Plan page

---

### 4. Sequential Multi-Channel (LinkedIn → WhatsApp), Not Parallel (IMPORTANT)

**Decision:** Wait for LinkedIn connection acceptance BEFORE WhatsApp follow-up

**Why:** User feedback: "I don't want people to start marking the number as spam" - cold WhatsApp without LinkedIn relationship = spam risk

**Impact:** Day 1 = LinkedIn only. Day 2-3 = WhatsApp ONLY if (1) LinkedIn accepted AND (2) no reply after 48h.

**Location:** Profiling scripts + Next Action fields

---

### 5. Phone Extraction via Clodura + Truecaller (MINOR)

**Decision:** Use Clodura for phone/email extraction, Truecaller for spam verification

**Why:** User has free trial of Clodura (1 contact), already verified Chukwudi's number (0802 340 0050)

**Impact:** User can extract remaining 9 phone numbers for multi-channel outreach. Chukwudi already has verified phone for WhatsApp backup.

**Location:** Intel Gathered field contains Clodura workflow instructions

---

### 6. Execution Plan IN Database, Not External Doc (IMPORTANT)

**Decision:** Create "📋 DSG EXECUTION PLAN" page inside Notion database with Day 1-7 strategy

**Why:** User's concern: "When this conversation ends, I want to know okay here are the people, here is the lead list, here is what we're doing, here is the plan."

**Impact:** Single database contains: contacts + messages + plan + tracking. No file-hopping.

**Location:** First row in Notion database (📋 DSG EXECUTION PLAN page)

---

## WHAT WAS CREATED

### 1. Notion Database "New Gen Prospecting"
- 10 architect contacts populated via API
- BTL/ATL classification
- Customized profiling messages (Next Action field)
- LinkedIn search patterns (Intel Gathered field)
- Connection tracking checkbox
- DSG Execution Plan page

### 2. Profiling Scripts Document
**File:** `/projects/00_Inbox/profiling-scripts.md`
- Script 1: LinkedIn post-connection message (concise Nigerian style)
- Script 2: WhatsApp follow-up
- Script 3: Phone profiling call (BTL/ATL)
- Script 4: RIQ prospecting (Green contacts only)
- Firm-specific variations (FMA, Interstate, Design Group, CCP)
- Traffic Light classification guide (Green/Yellow/Red)

### 3. Architect Contacts Reference
**File:** `/projects/00_Inbox/architect-contacts-reference.md`
- Detailed breakdown of 10 contacts
- LinkedIn search patterns
- BTL/ATL profiling order
- Phone extraction workflow (Clodura + Truecaller)

### 4. Notion API Population Scripts
**Files:**
- `/projects/00_Inbox/populate-notion.sh` - Create 10 contact pages
- `/projects/00_Inbox/update-notion-actions.sh` - Add customized messages
- `/projects/00_Inbox/add-linkedin-info.sh` - Add LinkedIn search patterns
- `/projects/00_Inbox/create-plan-page.sh` - Create DSG execution plan page

### 5. DSG Plan Document
**File:** `/Users/nicholasfeyintolafolarin-coker/.claude/plans/sorted-churning-garden.md`
- DSG framework violations analysis (6 violations identified)
- Corrected profiling approach (BTL-first, Traffic Light sorting)
- Nigerian context adaptation (Load Creep pain point, referral model)
- Risk mitigation strategies

---

## WHAT WAS UPDATED

### 1. Notion Database (Manual Updates by User)
- LinkedIn URLs added for 9 contacts (Enehezeyi no longer at company)
- Full name found: Gbenga → Gbenga Ogunjimi
- Connection requests sent: 5 contacts (Mairo, Olujide, Bilikisu, Ndubuisi, Segun)
- Phone verified: Chukwudi Osakwe (0802 340 0050) via Clodura + Truecaller

### 2. Contact Classification
- BTL: 3 contacts (Mairo, Olujide, Bilikisu)
- ATL: 6 contacts (Emmanuel, Umele, Chukwudi, Gbenga, Ndubuisi, Segun)
- Disqualified: 1 (Enehezeyi - no longer at Design Group)

---

## VALUE DELIVERED

### Immediate
- **Ready for Day 1 execution tomorrow (Feb 5):** User opens Notion database → sees 4 contacts to message (Mairo, Olujide, Bilikisu, Gbenga) → copy-paste messages from Next Action field → send when LinkedIn connections accepted
- **Zero mental load:** All context preserved in database. No need to remember firm types, profiling order, or message templates.
- **Phone backup:** Chukwudi has verified WhatsApp number if LinkedIn fails

### Foundational
- **DSG framework applied to Nigerian market:** Profiling-first approach (vs direct prospecting), BTL intel gathering, Traffic Light sorting adapted for private trigger environment
- **Reusable profiling system:** Same database structure can be used for MEP consultants, developers, other ICP segments
- **Multi-channel outreach infrastructure:** LinkedIn → WhatsApp → Phone sequence with spam protection (sequential, not parallel)

---

## OPEN ITEMS

### User Tasks (Day 0 - Tonight/Tomorrow Morning)
1. ⏳ Extract remaining 9 phone numbers via Clodura (8 remaining after Chukwudi verified)
2. ⏳ Add phone numbers to Notion "Phone" field
3. ⏳ Wait for 5 pending LinkedIn connections to accept (Mairo, Olujide, Bilikisu, Ndubuisi, Segun)

### Day 1 Execution (Feb 5)
1. ⏳ When connections accepted, send profiling messages (copy from Next Action field)
2. ⏳ Update Profiling Date and Reply Status in Notion
3. ⏳ Send remaining 4 connection requests (Emmanuel, Umele, Chukwudi, Gbenga)

---

## META

**Pattern observed:** User needs execution systems that survive session end. Markdown files scattered across `/projects/00_Inbox/` don't work because:
1. Too many files to remember/navigate
2. Context lost when conversation compacts
3. No single view of "what do I do next?"

**Solution:** Database-as-system. Each row = contact + context + action. Single URL to bookmark.

**Lesson:** For client-facing deliverables or user's own workflows, consolidate into ONE interactive system (database, HUD) rather than multiple reference docs. "Everything needs to be IN the database" = minimize context-switching.

**DSG Framework Applicability:** Successfully adapted US software sales framework (DSG) to Nigerian generator sales:
- BTL/ATL profiling works (junior architects give pipeline intel)
- Traffic Light sorting applies (Green = active project <90 days)
- Multi-channel sequence needed (LinkedIn alone = 6.8% reply rate)
- Referral model integration critical (Yellow contacts = Fisayo-type network builders)

**Next session pattern:** If user says "populate database", don't create CSV/markdown intermediates - go straight to API population. Files created today (populate-notion.sh, update-notion-actions.sh) are examples of this pattern.

---

## FILES CREATED THIS SESSION

1. `/projects/00_Inbox/profiling-scripts.md` (4,130 bytes)
2. `/projects/00_Inbox/architect-contacts-reference.md` (7,201 bytes)
3. `/projects/00_Inbox/architect-contacts-import.csv` (1,234 bytes - NOT USED, went direct to API)
4. `/projects/00_Inbox/populate-notion.sh` (2,105 bytes)
5. `/projects/00_Inbox/populate-notion.py` (1,872 bytes - NOT USED, bash worked)
6. `/projects/00_Inbox/update-notion-actions.sh` (3,456 bytes)
7. `/projects/00_Inbox/add-linkedin-info.sh` (2,789 bytes)
8. `/projects/00_Inbox/create-plan-page.sh` (5,123 bytes)

**Total:** 8 files created, 27,910 bytes

**Notion database:** 10 contacts + 1 plan page = 11 pages created via API

---

**Session packet location:** `/projects/session-packets/2026-02-04-dsg-architect-profiling-setup.md`
