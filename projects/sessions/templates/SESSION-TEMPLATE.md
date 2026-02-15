# Session Template

Use this for session-level documentation (the sitting itself, not individual project work).

---

## YAML Frontmatter

```yaml
---
session_id: YYYY-MM-DD-short-descriptor
session_date: YYYY-MM-DD
duration_hours: 2.5
projects_touched: [HB, PUMA, INFRA]
work_types: [implementation, research]  # Can include multiple
value_tier: high                         # critical | high | medium | low
impact_score: 8                          # 1-10 (optional)
decisions_count: 5
artifacts_count: 8
tasks_completed: 6
challenges_count: 2
---
```

---

## Session Files to Create

For each session, create these files:

1. **SESSION-{date}-INDEX.csv** - Task metadata
2. **SESSION-{date}-ARTIFACTS.md** - What was created/updated
3. **SESSION-{date}-TIMELINE.md** - Chronological events
4. **SESSION-{date}-DECISIONS.md** - Key decisions (if any)
5. **SESSION-{date}-OPEN-QUESTIONS.md** - Unresolved (if any)
6. **SESSION-{date}-CHALLENGES.md** - Blockers, friction (if any)

---

## CSV Index Format

```csv
task_id,task_name,energy_level,difficulty,role_skill,est_hourly_rate,duration_mins,status,output_artifact
1,Sprint review tasks,high,medium,analysis + documentation,150,45,completed,"SPRINT-REVIEW.md, DEEP-DIVE.md"
2,User feedback integration,medium,low,stakeholder communication,100,10,completed,verbal feedback
```

**Columns:**
- `energy_level` - high | medium | low
- `difficulty` - high | medium | low
- `role_skill` - Type of work (analysis, documentation, research, implementation, etc.)
- `est_hourly_rate` - $100-150 typical range
- `duration_mins` - Estimated time spent
- `status` - completed | in_progress | blocked
- `output_artifact` - What was created (comma-separated if multiple)

---

## Artifacts Markdown Format

```markdown
# Session Artifacts: {Date}

**Session ID:** {session_id}
**Duration:** ~{X} hours
**Status:** 🟢 Active

---

## ARTIFACTS CREATED

### 1. {Category}

| File | Purpose | Size | Status |
|------|---------|------|--------|
| `file-name.md` | Brief description | 12KB | ✅ Complete |

---

## ARTIFACTS UPDATED

| File | Changes Made | Reason |
|------|--------------|--------|
| `existing-file.md` | Added section X | User feedback |

---

## RESEARCH OUTPUTS

**Finding:** {key discovery}
- Evidence: {supporting data}
- Conclusion: {what it means}

---

## TOTAL OUTPUT

**Files Created:** {count}
**Files Updated:** {count}
**Research Items:** {count}
**Lines of Documentation:** ~{estimate}
**Estimated Time:** {hours}
**Estimated Value:** ${amount} (at ${rate}/hr blended)
```

---

## Timeline Markdown Format

```markdown
# Session Timeline: {Date}

**Session Start:** {time}
**Session Type:** {type of work}

---

## CHRONOLOGICAL EVENTS

### Phase 1: {Phase Name} (Tasks #{X}-#{Y})

**~{time}** - {Event description}
- Action taken
- Result

**~{time}** - {Next event}

---

## KEY TIMESTAMPS

| Time | Event | Impact |
|------|-------|--------|
| {time} | {event} | {impact} |

---

## NEXT EXPECTED EVENTS

1. {What's coming next}
2. {Follow-up action}

---

**Session Status:** 🟢 Active/Complete
**Total Duration:** ~{X} hours
**Context Preservation:** High/Medium/Low
```

---

## Decisions Markdown Format

```markdown
# Session Decisions: {Date}

**Session ID:** {session_id}
**Decision Count:** {count} major decisions

---

## STRATEGIC DECISIONS

### 1. {Decision Title} ✅

**Decision:** {What was decided}

**Rationale:**
> "{Direct quote or explanation}"

**Impact:**
- {Consequence 1}
- {Consequence 2}

**What Changed:**
- Was: {old state}
- Now: {new state}

**Next Actions:**
- [ ] {Action item 1}
- [ ] {Action item 2}

---

## TACTICAL DECISIONS

{Same format as strategic, but for smaller decisions}

---

## DECISIONS PENDING USER INPUT

1. **{Topic}** - {What needs to be decided}

---

## CARRY FORWARD TO NEXT SESSION

**Strategic:**
- {Item to remember}

**Tactical:**
- {Action to take}
```

---

## Open Questions Format

```markdown
# Open Questions: {Date}

**Session ID:** {session_id}
**Total Open Questions:** {count}

---

## IMMEDIATE (Blocking Next Steps)

### 1. {Question Title}

**Question:** {The actual question}

**Context:** {Background/why it matters}

**Blocking:** {What can't proceed without this}

**Next Step:** {How to resolve}

**Priority:** 🔴 HIGH | 🟡 MEDIUM | 🟢 LOW

---

## STRATEGIC (Design/Architecture)

{Same format}

---

## TACTICAL (Implementation Details)

{Same format}

---

## CLARIFICATION (Need More Context)

{Same format}
```

---

## Challenges Format

```markdown
# Current Challenges: {Date}

**Session ID:** {session_id}
**Total Challenges:** {count}

---

## ACTIVE BLOCKERS

### 1. {Challenge Title} ⏸️

**Challenge:** {What's the problem}

**Impact:** {What it's blocking}

**Root Cause:** {Why it's happening}

**Next Steps:**
1. {Step to resolve}
2. {Step to resolve}

**Status:** 🔴 BLOCKING | 🟡 ONGOING | 🟢 MITIGATED

**Estimated Resolution:** {timeline}

---

## WORKFLOW FRICTION

{Same format, but for slower/annoying issues, not full blockers}

---

## ARCHITECTURAL DEBT

{Same format, for technical debt that's accumulating}

---

## PROCESS GAPS

{Same format, for missing processes or standards}

---

## CHALLENGES RESOLVED THIS SESSION

### ✅ {Challenge That Was Fixed}

**Challenge:** {What it was}

**Resolution:** {How it was fixed}

**Status:** ✅ RESOLVED
```

---

## Usage

1. **Start of session:** Create session folder with metadata files
2. **During session:** Create session packets for each project worked on
3. **End of session:** Fill out metadata files (timeline, decisions, etc.)
4. **Review:** Use CSV index to see effort distribution, value tiers to filter

---

## Example Session Structure

```
/projects/00_Inbox/sprint-review-jan-21-31/
├── SESSION-2026-01-31-INDEX.csv
├── SESSION-2026-01-31-ARTIFACTS.md
├── SESSION-2026-01-31-TIMELINE.md
├── SESSION-2026-01-31-DECISIONS.md
├── SESSION-2026-01-31-OPEN-QUESTIONS.md
├── SESSION-2026-01-31-CHALLENGES.md
└── packets/
    ├── session-packet-2026-01-31-puma-localization.md
    ├── session-packet-2026-01-31-sprint-review.md
    └── session-packet-2026-01-31-craft-research.md
```

**Session = Container (metadata about the sitting)**
**Packets = Contents (deliverables for specific projects)**
