---
session_id: 2026-02-04-fidson-qualification
session_date: 2026-02-04
duration_hours: 0.5
projects_touched: [GAS]
work_types: [implementation]
value_tier: high
impact_score: 7
decisions_count: 4
artifacts_count: 3
tasks_completed: 1
items_open: 1
---

# Session Packet: Fidson Healthcare Qualification

**Session Date:** 2026-02-04
**Status:** ✅ Complete
**Duration:** ~30m
**Work Type:** Implementation

---

## CONTEXT

Sarah Ezeama (Fidson Healthcare BD Manager) offered to intro user to engineering team via email forward. Thread dormant since December 2025.

**User concern:** "I'm just a bit scared that i won't know all the stuff to tell them... could prep if they respond?"

**Challenge:** User needs qualification materials but doesn't want to push too hard (no immediate site visit ask). Wants to qualify fast without appearing salesy.

**Pharma context:** Fidson is WHO-compliant with GSK partnership. Manufacturing requires uninterrupted power (critical application for gas generators).

---

## DECISIONS MADE

### 1. Qualify Fast with 3 Discovery Questions (IMPORTANT)

**Decision:** Send soft email with 3 discovery questions instead of pitching site visit

**Why:**
- User doesn't know pharma-specific requirements yet
- Better to ASK smart questions than pretend to know everything
- Qualifies in 1-2 exchanges (timeline, budget owner, pain point)
- Easy out if timing isn't right (not pushy)

**Impact:** User can send email immediately without deep technical prep

**Questions chosen:**
1. Planning upgrades in next 6-12 months? (reveals timeline)
2. Current backup power setup? (reveals pain point)
3. Who evaluates power decisions? (reveals decision-maker)

**Location:** `/projects/00_Inbox/Feb 4/fidson-qualification-email.txt`

---

### 2. Discovery Script for When They Respond (CRITICAL)

**Decision:** Create prep doc explaining what each answer reveals + red/green flags

**Why:** User feels unprepared for engineering call. Script flips the dynamic: user is assessing fit too, not just being assessed.

**Impact:** User has confidence to qualify or disqualify based on:
- Red flags: No timeline, vague ownership, "just exploring" → Park
- Green flags: 6-month timeline, diesel setup, decision-maker identified → Move forward

**When to offer site visit:** ONLY if all 3 green flags present

**Location:** `/projects/00_Inbox/Feb 4/fidson-discovery-script.md`

---

### 3. LinkedIn Reply After Email Sent (MINOR)

**Decision:** Short thank-you message to Sarah on LinkedIn after sending email

**Why:**
- Confirms email was sent (closes the loop)
- Acknowledges her help (relationship maintenance)
- No extra asks (she's already helping)

**Location:** `/projects/00_Inbox/Feb 4/fidson-linkedin-reply.txt`

---

### 4. Track in HUD as Active Deal (IMPORTANT)

**Decision:** Add Fidson to HUD active tracks (not waiting)

**Why:** This is an active qualification (email sent), not passive waiting

**Impact:** Won't slip through cracks like it did Dec-Jan

**Location:** `/projects/hud/data.js` (openItems in "9-5 WORK" track)

---

## WHAT WAS CREATED

### 1. Qualification Email Template
- **File:** `fidson-qualification-email.txt`
- Professional, curious tone (not salesy)
- 3 discovery questions
- Soft close with easy out
- Ready to copy-paste (just add phone number)

### 2. Discovery Script
- **File:** `fidson-discovery-script.md`
- What each answer reveals (timeline, pain points, decision-maker)
- Red flags table (disqualify fast)
- Green flags table (move forward)
- When to offer site visit (qualification criteria)
- Follow-up templates (positive response + no response)

### 3. LinkedIn Reply Template
- **File:** `fidson-linkedin-reply.txt`
- Short thank-you message
- Copy-paste ready

---

## WHAT WAS UPDATED

### 1. HUD Data (`/projects/hud/data.js`)

**Added to active tracks (9-5 WORK):**
```
'Fidson Healthcare: Sent qualification email via Sarah Ezeama (3 discovery questions) → Wait for engineering response'
```

**Added to shipped items:**
```
{ tag: 'GAS', item: 'Fidson qualification materials: Email (3 discovery questions), LinkedIn reply, discovery script (red flags, green flags, when to offer site visit)', at: '2026-02-04T20:30:00' }
```

**Updated footer:**
- Added Fidson context (pharma lead via Sarah Ezeama)

---

## VALUE DELIVERED

### Immediate
- User can send qualification email tonight (no prep needed)
- Warm lead reactivated (dormant since Dec)
- Confidence boost: User knows what to ask, not expected to have all answers

### Foundational
- Discovery script reusable for future pharma leads
- Qualification framework (red/green flags) applies to all leads
- Pattern: Qualify fast, park if no timeline/decision-maker/pain point

---

## OPEN ITEMS

1. **User needs to send email** — Copy from `fidson-qualification-email.txt`, add phone number, send to sarahezeama@fidson.com
2. **User needs to reply to Sarah on LinkedIn** — After email is sent (copy from `fidson-linkedin-reply.txt`)
3. **Wait 5 days for response** — If no response, soft follow-up to Sarah
4. **If they respond positively** — Use discovery script to qualify further

---

## META

**Pattern observed:** User more confident when given questions to ASK vs. answers to GIVE. Discovery mindset > expert pitch mindset.

**Lesson:** "You're qualifying them as much as they're qualifying you." User doesn't need to know pharma-specific power requirements yet — just needs smart questions to assess fit.

**Why this matters:** Fidson is better than Fisayo's 7 referrals because:
- Warm intro (Sarah vouched)
- Pharma can't afford downtime (WHO compliance)
- Budget likely exists (GSK partnership)
- User initiated 2 months ago (shows persistence)

**Key principle:** Don't chase dead leads. Fidson only worth pursuing if timeline + decision-maker + pain point. Otherwise park and focus on Fisayo.

---

**Sources (80/20):**
- 90% — LinkedIn conversation with Sarah Ezeama (user-provided)
- 10% — HUD state, Fisayo referral context (for comparison/positioning)
