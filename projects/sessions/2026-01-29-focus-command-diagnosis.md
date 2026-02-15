# Session Packet: Focus Command Diagnosis

**Session Date:** 2026-01-29
**Project:** brain-bot
**Status:** ✅ Complete

---

## Problem

/focus command implemented but showing garbage:
- STATUS text parsed as questions ("In Progress - Implementation decisions made")
- Stale data (Motor Stock status wrong)
- Resolved items still appearing (Scout Skill)
- Transcript fragments surfacing

## Root Cause Identified

Bot treats all data sources equally when they're not equal.

| Source | Quality | Correct Use |
|--------|---------|-------------|
| CLAUDE.md Open Tasks | Curated | /focus, priorities |
| Session packets (explicit markers) | Structured | Context |
| Voice transcripts | Messy | Capture only |
| Messages table | Garbage | Nothing |

**Missing:** User correction mechanisms. Bot extracts automatically but has no feedback loop.

## Decisions Made

1. /focus should ONLY use CLAUDE.md Open Tasks section
2. Need `/resolve` command to mark tasks done
3. Voice notes = capture, never surface in /focus
4. Session packets need explicit "Open Question:" markers (not STATUS parsing)

## Next Steps

- [ ] Implement `/resolve` command
- [ ] Fix /focus to properly parse CLAUDE.md Open Tasks
- [ ] Add explicit markers to session packet format
- [ ] Test full flow

## Notes

Session ended with user asking to stop and think before acting. Diagnosis complete, implementation pending next session.
