---
session_id: YYYY-MM-DD-short-descriptor
parent_session: YYYY-MM-DD-parent-session
projects: [PROJECT_TAG]
stakeholders: []
work_type: implementation
value_tier: medium
decisions_made: 0
items_open: 0
impact_score: 5
---

# Session Packet: {Title}

**Session Date:** YYYY-MM-DD
**Project:** {Project Name}
**Status:** 🟡 In Progress
**Duration:** ~Xh Ym
**Work Type:** {implementation | research | review | infrastructure | stakeholder | correction}

---

## CONTEXT

**Problem/Opportunity:**
{What prompted this work}

**User Request:** *(if applicable)*
> "{Direct quote of what user asked for}"

**Related Work:**
- Previous packet: {link to related session packet}
- Blocked by: {what needs to happen first}
- Blocks: {what depends on this}

---

## DECISIONS MADE

### 1. {Decision Title} ✅

**Decision:** {What was decided}

**Rationale:**
- {Reason 1}
- {Reason 2}

**Alternatives Considered:**
- Option A: {why not chosen}
- Option B: {why not chosen}

**Impact:**
- {Consequence}

---

## WHAT WAS CREATED

### 1. {Artifact Name}

**File:** `path/to/file.ext`

**Purpose:** {What it does}

**Key Features:**
- {Feature 1}
- {Feature 2}

**Status:** ✅ Complete | 🟡 In Progress | ⏸️ Deferred

---

### 2. {Another Artifact}

{Same format}

---

## WHAT WAS UPDATED

### 1. {Existing File}

**File:** `path/to/existing-file.ext`

**Changes:**
- Added: {what was added}
- Updated: {what was changed}
- Removed: {what was deleted}

**Reason:** {Why these changes were needed}

---

## RESEARCH/ANALYSIS (if applicable)

**Question:** {What was being investigated}

**Findings:**
1. {Finding 1}
2. {Finding 2}

**Evidence:**
- {Data point or reference}

**Conclusion:**
{What this means}

---

## TECHNICAL DETAILS (if applicable)

**Architecture:**
```
Component A
├── Sub-component 1
└── Sub-component 2
```

**Key Technologies:**
- {Tech 1}: {Why chosen}
- {Tech 2}: {Why chosen}

**Implementation Notes:**
- {Note about approach}
- {Trade-off made}

---

## STAKEHOLDER COMMUNICATION (if applicable)

**Who:** {Stakeholder name}

**What:** {What was communicated}

**Feedback Received:**
- {Feedback item 1}
- {Feedback item 2}

**Actions Taken:**
- {How feedback was addressed}

---

## OPEN ITEMS

### 1. {Open Item Title}

**Issue:** {What's unresolved}

**Blocker:** {What's preventing resolution}

**Next Step:** {What needs to happen}

**Owner:** {Who should handle it}

**Priority:** 🔴 HIGH | 🟡 MEDIUM | 🟢 LOW

---

## NEXT ACTIONS

- [ ] {Action item 1}
- [ ] {Action item 2}
- [ ] {Action item 3}

**Dependencies:**
- Waiting on: {external dependency}
- Blocks: {what can't proceed until this is done}

---

## VALUE DELIVERED

**Estimated Time:** {X} hours
**Estimated Value:** ${amount} (at ${hourly rate}/hr)
**Impact Score:** {1-10}

**Rationale for Impact:**
- {Why this score}

**Stakeholder Benefit:**
- {How this helps the project/user}

---

## EXAMPLES (if helpful)

### Example 1: {Use Case}

**Input:**
```
{Example input}
```

**Output:**
```
{Example output}
```

**Notes:** {Any caveats or edge cases}

---

## LESSONS LEARNED (optional)

**What Worked Well:**
- {Success factor 1}

**What Didn't:**
- {Challenge faced}

**Would Do Differently:**
- {Improvement for next time}

---

**Status:** {emoji} {status text}
**Next Session:** {What to pick up next time}

---

## TEMPLATE USAGE NOTES

**When to use this template:**
- Project-specific work (HB Studio feature, PUMA deliverable, etc.)
- One packet per major topic/deliverable
- Multiple packets can be created in one session

**When NOT to use:**
- Session-level metadata (use SESSION-TEMPLATE.md instead)
- Quick updates (<15 min work) - add to existing packet as update

**Sections to keep:**
- CONTEXT (always)
- DECISIONS (if decisions made)
- WHAT WAS CREATED (if artifacts created)
- WHAT WAS UPDATED (if files modified)
- NEXT ACTIONS (always)
- VALUE DELIVERED (always)

**Sections to omit if not applicable:**
- RESEARCH/ANALYSIS (only for research work_type)
- TECHNICAL DETAILS (only for implementation work_type)
- STAKEHOLDER COMMUNICATION (only for stakeholder work_type)
- EXAMPLES (only if helpful for understanding)
- LESSONS LEARNED (optional, use for retrospective value)

**Pro tip:** Copy this template, delete unused sections, fill in the rest. Don't leave empty sections.
