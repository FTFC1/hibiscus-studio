---
session_id: 2026-01-31-momentum-system
parent_session: null
projects: [HUD, BOT]
stakeholders: []
decisions_made: 3
items_open: 0
priority: null
---

# Session Packet: Momentum System + JSONL Exploration

**Session Date:** 2026-01-31
**Project:** HUD / Context Infrastructure
**Status:** ✅ Complete
**Duration:** ~2h

---

## Context

Built momentum-aware context injection system. Then explored whether JSONL parsing could provide a "threads" view across sessions.

---

## What Changed

### Decision: Timestamps Everywhere
**Choice:** Add `startedAt` to active tracks, `at` to shipped items, `lastUpdated` to doNext
**Why:** Enables staleness detection and "X ago" displays
**Files:** `/projects/hud/data.js`, `/projects/hud/index.html`

### Decision: Manual /briefing Over Auto-Injection
**Choice:** Create `/briefing` command instead of SessionStart hook
**Why:** SessionStart hook has platform bug (doesn't fire on cold start). Manual trigger works 100%.
**Files:** `/.claude/commands/briefing.md`

### Decision: Don't Parse JSONL for Threads
**Choice:** Rely on HUD `active` tracks instead of JSONL parsing
**Why:** All projects are in one monorepo (trello-mcp). JSONL files are per-repo, not per-project. The `cwd` field changes within sessions but doesn't map cleanly to conceptual projects. HUD already tracks this.

---

## Work Completed

| Artifact | Location | Type | Status |
|----------|----------|------|--------|
| HUD timestamps | `/projects/hud/data.js` | js | delivered |
| HUD age display | `/projects/hud/index.html` | html | delivered |
| /briefing command | `/.claude/commands/briefing.md` | md | delivered |
| Session packet template | `/projects/session-packets/TEMPLATE.md` | md | delivered |
| CLAUDE.md updates | `/CLAUDE.md` | md | delivered |

---

## Open Items

None. System is complete.

---

## Key Learnings

**JSONL Structure:**
```
Each line = one event
├── type: "user" | "assistant" | "file-history-snapshot"
├── timestamp: ISO-8601
├── sessionId: unique per session
├── cwd: current working directory
├── message.content: actual content
└── parentUuid: links messages in chain
```

**Why JSONL parsing doesn't help for "threads":**
- All work happens in one repo (trello-mcp)
- All JSONL files share the same project hash
- Conceptual "projects" (HB, PUMA, GAS) are just subfolders
- HUD `active` tracks already serve as the "threads" view

**The loop:**
```
Work → Update session packet → Update HUD → /briefing reads both
```

---

**Session ended:** 17:00
**Next review:** N/A - system complete
