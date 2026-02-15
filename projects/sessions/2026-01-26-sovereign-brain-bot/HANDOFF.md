# Session Handoff: Sovereign Brain Bot Architecture

**Date:** 2026-01-26
**Pass:** 2 of ~5 (refinement in progress)
**Mode:** Architecture Design (not building yet)

---

## The Vision

A "sovereign mind" system that:
1. **Captures** anything thrown at it (voice, text, image, URL, video)
2. **Clarifies** by asking one question at a time, building understanding
3. **Routes** to existing file structure (actions.md, insights.md, brain.csv, etc.)
4. **Remembers** via hybrid storage (files + SQLite/embeddings)

**Core Thesis:** "Own your AI memory layer. Don't let platforms control it."

---

## Architecture Decisions (Pass 2)

### Confirmed

| Decision | Rationale |
|----------|-----------|
| **Local-first** | No VPS for Phase 1. Bot runs when laptop is on. |
| **SQLite in git repo** | Database travels with the repo. Simple. Portable. |
| **Claude API billing** | ~$15-20/month. User accepts this. Worth the quality. |
| **Hybrid storage** | Files (structured) + SQLite/embeddings (semantic search) |
| **Reply-to-message context** | Telegram feature: forward video + voice note explanation |
| **Video processing needed** | Instagram videos common input. Whisper can handle. |

### Modes

| Mode | Behavior |
|------|----------|
| `DUMP` | Save raw, no processing |
| `CLARIFY` | Ask questions one at a time, build understanding |
| `AUTO` | Extract immediately, no questions |

**User note:** "Always clarify" - the clarify mode may be the default, not optional.

### NOT Building Yet

- No VPS (until 24/7 needed)
- No vector embeddings yet (SQLite FTS is enough to start)
- No multi-channel (Telegram only for now)

---

## The Interview Flow (Key Insight)

This is NOT just "voice → transcribe → extract".

It's an **interactive interview** that:
1. **Accepts any input:** voice, text, image, URL, Instagram video
2. **Asks one Q at a time:** builds understanding iteratively
3. **Digs deeper:** doesn't just surface-extract, follows threads
4. **Outputs structured brief:** summary, key decisions, action items
5. **Can output V1 concepts:** for creative work (logos → DALL-E, not ASCII)

**Example flow:**
```
User: [forwards Instagram reel of competitor's brand]
Bot: "What caught your attention about this?"
User: "The way they position the pricing"
Bot: "What specifically - the structure, the numbers, or how they frame value?"
User: "How they frame value - they don't show prices at all"
Bot: "Got it. Is this something you want to replicate, or something to avoid?"
...continues until understanding is complete...
Bot: [outputs brief with recommendations]
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────┐
│                    TELEGRAM                     │
│  (voice, text, image, URL, video, reply-chain)  │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│              bot.py (LOCAL)                     │
│  ┌─────────────────────────────────────────┐   │
│  │  MODE ROUTER                            │   │
│  │  DUMP → save raw to inbox               │   │
│  │  CLARIFY → interview loop               │   │
│  │  AUTO → extract immediately             │   │
│  └─────────────────────────────────────────┘   │
│                      │                          │
│  ┌───────────────────┼───────────────────┐     │
│  │                   ▼                   │     │
│  │  ┌─────────────────────────────────┐  │     │
│  │  │        INTERVIEW ENGINE         │  │     │
│  │  │  - Ask one Q at a time          │  │     │
│  │  │  - Build context over turns     │  │     │
│  │  │  - Claude API for reasoning     │  │     │
│  │  └─────────────────────────────────┘  │     │
│  │                   │                   │     │
│  │                   ▼                   │     │
│  │  ┌─────────────────────────────────┐  │     │
│  │  │         EXTRACTOR               │  │     │
│  │  │  - Whisper for voice/video      │  │     │
│  │  │  - Claude for classification    │  │     │
│  │  │  - Output: actions, decisions,  │  │     │
│  │  │    insights, questions, forks   │  │     │
│  │  └─────────────────────────────────┘  │     │
│  └───────────────────────────────────────┘     │
│                      │                          │
│                      ▼                          │
│  ┌─────────────────────────────────────────┐   │
│  │              FILE ROUTER                │   │
│  │  actions → actions.md                   │   │
│  │  decisions → decisions.md               │   │
│  │  insights → insights.md                 │   │
│  │  questions → questions.md               │   │
│  │  forks → forks.md                       │   │
│  │  raw → 00_Inbox/{date}/                 │   │
│  │  all → SQLite (brain.db)                │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## Cost Estimate

| Component | Monthly Cost |
|-----------|--------------|
| Claude API (50 extractions/day) | ~$14-15 |
| Telegram Bot API | Free |
| Whisper (local) | Free (CPU) |
| SQLite | Free |
| **Total** | **~$15-20/month** |

(No VPS cost in Phase 1 - only when 24/7 is needed)

---

## Open Questions for Sub-Agent Review

### Architecture Questions

1. **Mode naming:** Is DUMP/CLARIFY/AUTO the right taxonomy? User said "always clarify" - should CLARIFY be the default with DUMP as escape hatch?

2. **Reply-chain handling:** How deep should context linking go? Just immediate parent, or full thread?

3. **Interview state persistence:** What happens if interview is interrupted? Save state to SQLite mid-interview?

4. **Multi-input in single message:** User forwards video + sends voice note. Process sequentially or merge?

### Integration Questions

5. **Existing file structure:** How strict should routing be? What if an item fits multiple files?

6. **brain.csv vs SQLite:** Duplicate storage or single source? Current plan is both (CSV for human-readable, SQLite for search).

7. **links.json updates:** Should the bot automatically suggest new trigger words?

### Scope Questions

8. **Creative output (V1s):** When interview is for design brief, should bot auto-invoke DALL-E? Or just output prompt for user to run?

9. **Project tagging:** Auto-detect project from content, or always ask?

10. **Notification preferences:** When should bot proactively message? (e.g., "You have 5 unprocessed dumps")

---

## Related References

| Topic | Location |
|-------|----------|
| Clawdbot (inspiration) | [clawd.bot](https://clawd.bot), [github.com/clawdbot/clawdbot](https://github.com/clawdbot/clawdbot) |
| Existing extraction schema | `context-manager-skill/brain_schema.sql` |
| Current file structure | `context-manager-skill/links.json` |
| Voice processing example | `session-packets/2026-01-26-telegram-voice-processing/` |
| Extraction types | actions, decisions, insights, questions, forks |

---

## Next Steps

1. **Pass 3:** Sub-agent review of architecture questions
2. **Pass 4:** Resolve open questions, finalize schema
3. **Pass 5:** Write bot.py scaffold
4. **Build:** Actually implement

**User note:** "We need to probably go to four or five [passes] and then we can start building."

---

## Key Quotes from User

- "I see things and see it as a connection faster than I can digest all of the information"
- "You know more than I know about this" (Claude has processed their captured material)
- "I'm trying to make it so that when we do work now, it's like a steel sheet as opposed to a cheese grater"
- "Always clarify" (regarding interview mode)
- "I think I do have to pay the extra money, but I think it's worth it" (on Claude API)
