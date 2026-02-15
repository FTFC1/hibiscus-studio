# Session Packet: brain-bot UX Decisions + Open Tasks

**Session Date:** 2026-01-28
**Project:** brain-bot (Telegram personal knowledge management)
**Duration:** ~30 min (Uber commute feedback session)
**Status:** 🟡 In Progress - Implementation decisions made

---

## Executive Summary

User gave detailed UX feedback during commute. Key decisions locked in.

---

## Decisions Made

### Voice Note → Project Linking
**Decision:** Guess with confidence + let user correct
- Bot suggests project with reasoning
- Must have confidence threshold (don't suggest rubbish)
- Can "think through" suggestion briefly but not too long
- Show inline buttons: `[HB] [GAS] [RETAIL] [OTHER]`

### Processing Feedback
**Decision:** Show estimated time, then DELETE message
- `⏳ ~30s` based on audio length
- Self-cleaning: remove once processed
- No noise left behind

### /undo Command
**Decision:** Build it
- Reverts last bot action
- Delete message, unmark waiting, etc.

### Priorities Display
**Decision:** Group by project with status inline
- Not just a flat list
- Source of truth = session packets
- Would use daily

### AM vs PM Focus Mode
**Decision:** Different surfaces for different times
- **AM (arriving at office):** Finish latest work from session packets
- **PM (leaving office):** Close small open things, remind of pending, surface ONE thing to do at home if time permits

### /thinking Command
**Decision:** NOT NEEDED
- If sent offline (laptop closed), will process when laptop opens
- No separate capture-only mode required

---

## Open Task: HB Studio Documentation

**IMPORTANT - Bot needs to remember this:**

> "Today I need to find a way - seeing as we built the flow for the booking funnel for HB Studio - we need to document all of the flows programmatically so it can be reviewed by the owner."

**Requirements:**
- Programmatic documentation (not manual screenshots)
- We have the code, know what pixels look like
- Must be reviewable by owner
- Possibly use scout skill?

**Open Question:** Should brain-bot have access to skills? Not to run them, but to know about them.

---

## Status Corrections

### Motor Stock Report
**Old status:** 🟡 Proposal Sent - Awaiting Kickoff Call
**Corrected status:** 🟡 Active Iteration - Building with new info

They're past the proposal. Flow is:
1. They give new information
2. User shows it back to them
3. They agree
4. User continues building

### Classification Redesign
**Old status:** 🟡 In Progress - Classification redesign planned
**Corrected status:** ✅ Solved by /priorities

Priorities command solved the problem. No need for separate /status redesign.

---

## Implementation Priority

| Priority | Feature | Effort |
|----------|---------|--------|
| 1 | Processing feedback (⏳ + delete after) | Low |
| 2 | Priorities grouped by project | Medium |
| 3 | Inline project buttons for voice notes | Medium |
| 4 | /undo command | Low |
| 5 | AM/PM focus mode differences | Medium |

---

## Key Insight

> "Voice notes are slices across many projects. Bot should look at knowledge base AND voice notes to figure out what project a voice note attaches to - but with confidence, not just guessing rubbish."

---

**End of Session Packet**

*Generated: 2026-01-28*
*For: brain-bot knowledge base ingestion*
*Status: Decisions locked, implementation pending*
