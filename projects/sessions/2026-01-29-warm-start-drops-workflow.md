# Session Packet: Warm Start Drops Workflow

**Session Date:** 2026-01-29
**Project:** brain-bot
**Status:** ✅ Complete

---

## Problem

Need a workflow for laptop session starts that processes phone drops without complex automation:
- Phone captures drops silently throughout day (voice, photos, text)
- Laptop needs to review drops and start work
- How should drops connect to session packets?
- Should bot auto-create session packets or keep it manual?

---

## Approaches Considered

### Option 1: Triage UI
- Show drops with inline buttons per item
- User explicitly decides: "Add to [HB]", "Add to [BOT]", "Create new", "Skip"
- **Pros:** Precise control, drops integrated into packets
- **Cons:** Tedious if many drops, requires per-drop decisions

### Option 2: Smart Grouping + Choice (Hybrid)
- Bot auto-groups drops by project (keyword matching)
- Suggests actions: "3 HB drops → add to existing session?"
- User reviews groups and confirms
- **Pros:** Fast triage, semi-automated
- **Cons:** Matching logic complex, risk of misclassification

### Option 3: Drops as Reminders (Even Simpler) ✓
- "check my drops" shows list of all drops
- Shows recent session packets
- User picks what to work on
- Session packets created naturally during work (like always)
- **Pros:** Zero friction, natural workflow, no matching logic
- **Cons:** None identified

---

## Decision

**Chose Option 3: Even Simpler**

**Rationale:**
- Matching logic (Options 1 & 2) is too difficult and error-prone
- Drops are INPUTS to work, not work themselves
- Session packets should emerge from actual work, not from drops
- Keeps bot simple (capture only)
- Moves intelligence to Claude Code (full context)

---

## Implementation

### Phone Workflow
- Silent capture to bot (voice, photo, text, document)
- `/focus` shows CLAUDE.md Open Tasks

### Laptop Workflow
User says: **"check my drops"**

Claude Code:
1. Queries bot DB: `SELECT * FROM messages WHERE source = 'drop_group'`
2. Reads recent session packets from ParaPro-001/session-packets
3. Shows formatted list with icons (🎤 voice, 📷 photo, 💬 text, 📄 document)
4. Asks: "What should we work on?"

User picks a drop → Claude Code creates session packet naturally during work

### Example Output
```
◇ DROPS (2 items)

Jan 29 14:34  📷  Lock screen - Virgil Abloh visionary
Jan 29 14:22  📷  Meme about productivity

Recent session packets:
○ [BOT] 2026-01-29-focus-command-diagnosis → ✅ Complete
○ [BOT] 2026-01-28-brain-bot-ux-decisions → 🟡 In Progress

What should we work on?
```

---

## Technical Details

- Bot DB: `projects/1_Projects/brain-bot/brain.db`
- Drops identified by: `source = 'drop_group'`
- Photo classification added during capture (Vision API)
- No new bot command needed - just ad-hoc query when user asks
- Session packets location: `ParaPro-001/session-packets/*.md`

---

## Session Packet Updates

**How updates work:**
- Natural workflow (like always)
- Claude Code creates packet when there's a decision/milestone
- Updates during work as needed
- User can explicitly say "update the session packet"
- No special commands required

---

## What This Unlocks

**Complete capture → work flow:**
```
Phone (anytime)
├── Capture drops silently
└── /focus → see open tasks

Laptop (session start)
└── "check my drops"
    └── See all captures + recent work
        └── Pick something
            └── Work naturally
                └── Session packet created
```

**Key insight:** Drops are reminders, not work. Work creates packets.

---

## Notes

- No complex matching logic needed
- Bot stays simple (just capture + /focus)
- Intelligence lives in Claude Code with full context
- Workflow respects natural session packet creation
- User stays in control of what becomes a session
