# /session-update — End Session & Update HUD

Create session packet documenting work done, then update HUD with latest state.

## Instructions

### 1. Create Session Packet

**Check for existing packet first:**
- Check if session packet already exists for today (`/projects/session-packets/YYYY-MM-DD-*.md`)
- If exists: Update it
- If not: Create new one

**YAML Frontmatter (required):**
```yaml
---
session_id: YYYY-MM-DD-short-name
session_date: YYYY-MM-DD
duration_hours: X.X (estimate from timestamps)
projects_touched: [HB, PUMA, INFRA, etc.]
work_types: [implementation, research, infrastructure, etc.]
value_tier: critical | high | medium | low
impact_score: 1-10
decisions_count: X
artifacts_count: X
tasks_completed: X
items_open: X
---
```

**Required Sections:**

```markdown
# Session Packet: {Title}

**Session Date:** YYYY-MM-DD
**Status:** ✅ Complete | 🟡 In Progress | 🔴 Blocked
**Duration:** ~Xh
**Work Type:** {work_type}

---

## CONTEXT

{What was the situation at start? What prompted this work?}

---

## DECISIONS MADE

### 1. {Decision Title} ({CRITICAL | IMPORTANT | MINOR})

**Decision:** {What was decided}

**Why:** {Rationale}

**Impact:** {What this affects}

**Location:** {File path or code location}

---

## WHAT WAS CREATED

{List all new files, features, systems built}

---

## WHAT WAS UPDATED

{List all modified files, systems changed}

---

## VALUE DELIVERED

### Immediate
- {What works now that didn't before}

### Foundational
- {What future work this enables}

---

## OPEN ITEMS

{Unfinished work, blockers, questions}

---

## META

**Pattern observed:** {Any interesting patterns}

**Lesson:** {What was learned}
```

**Save to:** `/projects/session-packets/YYYY-MM-DD-{short-name}.md`

---

### 2. Update HUD

After creating session packet, update HUD (`/projects/hud/v4-data.js`):

**Update these fields:**

1. **date** - Today's date, day of week
2. **doNext** - Next priority (ask user if not clear from session)
3. **wins** - Move completed work from active to wins
4. **active** - Update status of tracks
5. **shipped** - Add items completed in this session with timestamps
6. **suggestions** - Update based on session learnings

**Auto-update timestamp:** `lastUpdated: 'YYYY-MM-DDTHH:mm:00'`

---

### 3. Update Artifact Index (if new artifacts created)

If session created new files/systems:
- Add to `/projects/.cache/artifact-index.json`
- Add to Notion artifact index (use create-pages)
- Update totalArtifacts count

---

### 4. Output Summary

```
═══════════════════════════════════════════════
  SESSION PACKET CREATED
═══════════════════════════════════════════════

Session: YYYY-MM-DD-{name}
Duration: ~Xh
Projects: [list]
Work Type: {type}

DECISIONS: X
ARTIFACTS: X created, X updated
OPEN ITEMS: X

═══════════════════════════════════════════════
  HUD UPDATED
═══════════════════════════════════════════════

DO NEXT: {action}
WINS: {count} new
SHIPPED: {count} items

Session packet: /projects/session-packets/YYYY-MM-DD-{name}.md
```

---

## When to Use

- End of work session
- Before compacting context
- Before switching to new major task
- When user says "wrap up", "close down", "end session"

## Notes

- This tool CREATES and UPDATES files (session packet + HUD)
- Read artifact index FIRST to check what needs updating
- Ask user for clarification if:
  - Next priority unclear
  - Session name unclear
  - Value tier uncertain
- Default duration: Calculate from timestamps in conversation if possible
- Default value_tier: "medium" unless work is clearly critical/high impact
