# /briefing — Momentum-Aware Context Injection

Generate a temporal briefing by reading current state and recent history.

## Instructions

0. **ALWAYS check Artifact Index first (cache-first):**
   - Read `/projects/.cache/artifact-index.json` BEFORE asking "where is X?"
   - If artifact exists: use path/notionUrl directly
   - If artifact missing: add it to index, then proceed
   - This prevents asking user for locations we should already know

1. **Read Battle Plan from Craft (if exists):**
   - Use Craft MCP: `mcp__craft__documents_list` with folderIds: `["49e8aaa0-bee2-d6e4-3fb8-231d242e933b"]` (Session Packets)
   - Find document with "Battle Plan" in title
   - Use `mcp__craft__blocks_get` to read content
   - This is the PRIMARY source for today's focus

2. **Read agency work from Notion (9-5 work):**
   - Use Notion MCP: `mcp__notion__API-query-data-source`
   - Database ID: `2fc70b64-55cb-8071-88e2-d7d751027eb9`
   - Data source ID: `2fc70b64-55cb-80de-9427-000be8501e25`
   - Filter: Only status "In progress" and "Not started" (ignore "Done")
   - **For "In Progress" items:** Read full page content using `mcp__notion__API-get-block-children` (need context to work on them)
   - **For "Not Started" items:** Just show title + project (high-level only)
   - Group by Project for readability

3. **Read session map (stream awareness):**
   - Read `.cache/session-map-YYYY-MM-DD.md` (today first, fallback to yesterday, fallback to latest)
   - Surface ORPHANED streams with ✗ marker — these need attention
   - Surface PARKED streams with ◇ marker — these have resume instructions
   - Show ACTIVE streams with ◆ marker
   - Add to briefing output as STREAMS section (before MOMENTUM)

4. **Read recent session packets (for momentum):**
   - Glob `/projects/session-packets/2026-*/` for folders and `.md` files
   - Sort by date descending
   - Take last 3 sessions
   - Extract: decisions made, status changes, key deliverables, work completed, open items

5. **Read current HUD state:**
   - Read `/projects/hud/v4-data.js`
   - Extract: date, doNext (with lastUpdated), active tracks (with startedAt), waiting items, wins, shipped

6. **Detect staleness and auto-update HUD:**
   - Compare HUD date to today's date
   - Compare HUD date to latest session packet date
   - If stale (HUD older than latest session):
     - Update HUD date to today
     - Update doNext with user's stated priority
     - Move recent session work to wins/shipped
     - Update active tracks to reflect current state
     - Update notes.footer with today's context
   - If Battle Plan items are complete, flag as outdated

7. **Synthesize actual state (don't parrot):**
   - What's actually complete vs what HUD/Battle Plan claim?
   - What's the real priority now (from user or latest session)?
   - What's blocking progress?
   - Distinguish: 9-5 work (agency/Notion) vs project work (HUD) vs side tasks

8. **Build temporal briefing:**

```
═══════════════════════════════════════════════
ACTUAL STATE (synthesized from latest session):
═══════════════════════════════════════════════
Today: {day of week, date}
Priority: {user's stated priority or latest session focus}

{If HUD was stale: "✓ HUD auto-updated"}
{If Battle Plan stale: "⚠ Battle Plan outdated — {items} complete"}

═══════════════════════════════════════════════
AGENCY WORK (9-5, from Notion):
═══════════════════════════════════════════════
IN PROGRESS (with context):
• [PROJECT] Task name
  Context: {brief summary from page content - 1-2 lines}
  Next: {what needs to happen}

• [PROJECT] Task name
  Context: {brief summary from page content}
  Next: {what needs to happen}

TODO (Not Started) - high level:
• [PROJECT] Task name
• [PROJECT] Task name

═══════════════════════════════════════════════
DO NEXT (9-5 work hours):
═══════════════════════════════════════════════
{action from HUD or user statement}
Why: {rationale}

═══════════════════════════════════════════════
STREAMS (from session map):
═══════════════════════════════════════════════
{If session map found:}
◆ {ACTIVE stream} — {what's in progress}
◇ {PARKED stream} — {resume instructions}
✗ {ORPHANED stream} — {needs attention, outputs at path}
● {DONE stream}
○ {TODO stream}

{If no session map: "No session map found. New day."}

═══════════════════════════════════════════════
MOMENTUM (last 3 sessions):
═══════════════════════════════════════════════
• {date}: {key work completed}
• {date}: {key work completed}
• {date}: {key work completed}

═══════════════════════════════════════════════
CONTEXT SEPARATION:
═══════════════════════════════════════════════
9-5 WORK (AGENCY): {from Notion - revenue-generating client work}
PROJECT WORK (SIDE): {from HUD - HB, PUMA, infrastructure, etc.}
SIDE TASKS: {open items not on critical path}

═══════════════════════════════════════════════
BLOCKERS:
═══════════════════════════════════════════════
{waiting items >48h with 🔴 urgent flags}

═══════════════════════════════════════════════
RECENT WINS:
═══════════════════════════════════════════════
{last 3-4 wins from HUD + latest session}

SESSION ANCHOR: {today's context in one line}
```

9. **Output the briefing** directly — this becomes context for the conversation.

## Key Improvements

**Feb 4: Agency work integration**
- Added Notion database integration for full agency work (non-Mikano)
- Pulls "In progress" and "Not started" items only (ignores "Done")
- Groups by project tags for high-level overview
- Clarifies 9-5 work (agency/Notion) vs project work (HUD/side)

**Feb 2: Auto-update HUD when stale**
- User feedback: "What's the point otherwise?"
- Detects staleness by comparing dates
- Updates HUD with latest session work before showing briefing

**Feb 2: Synthesize, don't parrot**
- Compare Battle Plan to actual completion status
- Compare HUD doNext to latest session priority
- Derive current state from momentum, not stale timestamps

**Feb 2: Context separation**
- Distinguish 9-5 work (revenue) from project work
- User critique: "Sometimes unable to meet that distinction"

## When to Use

- Start of new work session
- After `/resume`
- When feeling lost about current state
- Before making big decisions (to check momentum)
- Before processing voice notes (to load templates)

## Notes

- **This now UPDATES HUD when stale** (changed Feb 2 based on user feedback)
- Staleness detection: Compares HUD date to today + latest session packet date
- Synthesizes actual state instead of parroting timestamps
- Separates contexts: 9-5 work (revenue) vs project work vs side tasks
- Staleness thresholds: 48h = warning, 72h = urgent
- Track age thresholds: 5d = flag, 7d = urgent
