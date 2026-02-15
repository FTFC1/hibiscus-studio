# Pass 3: Sub-Agent Architecture Recommendations

**Date:** 2026-01-26
**Pass:** 3 of ~5
**Mode:** Sub-agent consensus synthesis

---

## Quick Summary

| Question | Recommendation | Complexity |
|----------|----------------|------------|
| Q1: Default Mode | **CLARIFY default** + `/dump` escape hatch | Low |
| Q2: Interruption | **Auto-park + smart resume** | Medium |
| Q3: Multi-Input | **Sequential, link via reply-chain** | Low |
| Q4: Reply Depth | **Full thread (5 max), summarize older** | Medium |
| Q5: Multi-File | **Primary + cross-reference** | Low-Medium |
| Q6: Dual Storage | **Keep both (CSV source, SQLite index)** | Medium |
| Q7: links.json | **Weekly digest + high-confidence inline** | Medium-High |
| Q8: Design V1 | **Route to Delphi skill** + prompt fallback | Medium |
| Q9: Image Analysis | **Detect type, route accordingly** | Low-Medium |
| Q10: Auto-Tagging | **Auto-detect, ask if <0.6 confidence** | Medium |
| Q11: Notifications | **Opt-in triggers, not time-based** | Low |

---

## Mode System (Q1-Q2)

### Q1: CLARIFY is Default

```
DEFAULT (no command)  → CLARIFY mode, interview begins
/dump                 → Save raw, acknowledge, no questions
/batch                → Process multiple dumps in sequence
```

**Key insight:** You said "always clarify" - the interview IS the value, not an optional feature.

### Q2: Auto-Park with Smart Resume

```
User sends video → Interview starts → Bot asks Q1
[2 hours pass]
User sends new voice note
  ↓
Bot checks: Is this semantically related to parked interview?
  ├─ YES → "Continuing our discussion about [X]..."
  └─ NO  → Parks previous, saves partial. "Saved your thoughts on [X]. What's this about?"

/clear → Abandon all parked interviews
/parked → Show list, tap to resume
```

**ADHD-fit:** Assumes interruption is normal. Never loses partial context.

---

## Input Handling (Q3-Q4)

### Q3: Respect Telegram's Reply-Chain

Your existing behavior (reply-to-message to link context) is the answer. No change needed.

- Forward video → Process standalone
- Reply to video with voice note → Include video as context

**Implementation:** Use Telegram's native `reply_to_message_id`.

### Q4: Thread Depth = 5 Messages Max

```
Last 3 messages → verbatim
Older messages → summarized
Total thread cap → 5 messages
```

**Why 5:** Most meaningful threads are 2-4 messages. Beyond 5 usually = new topic.

---

## Output Routing (Q5-Q7)

### Q5: Primary + Cross-Reference

When item is both action AND insight:

```markdown
## [2026-01-26] delphi
- [ ] Create questionnaire AI flow to guide clients through briefs
  > Insight ref: insights.md#voice-briefs-are-more-effective
```

**One home, no lost insights.**

### Q6: Dual Storage Confirmed

```
brain.csv (SOURCE OF TRUTH)    →    brain.sqlite (QUERY INDEX)
  - Human-editable                    - Full-text search
  - Git-diffable                      - Relationship queries
  - Portable                          - Never edited directly
```

**CSV always wins on sync conflict.** SQLite can be deleted and rebuilt.

### Q7: Weekly Digest for Trigger Suggestions

```
WEEKLY DIGEST (Sunday 8pm)

Suggested triggers this week:

HIGH CONFIDENCE (mention 5+)
• "cwad" → brain.csv (tools section)

Reply: "add 1" or "skip all"
```

**Plus:** Inline prompt for high-confidence cases only.

---

## Creative & Project (Q8-Q11)

### Q8: Route to Delphi Skill

Interview → creative brief → route to Delphi Telegram group OR generate DALL-E prompt as fallback.

**Don't duplicate Delphi's 9-phase workflow.** The brain bot just captures and routes.

### Q9: Detect Image Type, Route Accordingly

| Type | Action |
|------|--------|
| Whiteboard | Extract structure → mermaid diagram |
| Screenshot (UI) | Extract UX observations |
| Screenshot (code) | Extract code review notes |
| Reference image | Describe aesthetic, tag for retrieval |
| Context photo | Ask "What's the context for this?" |

### Q10: Auto-Tag if Confidence >= 0.6

| Signal | Weight |
|--------|--------|
| Explicit keyword ("for HB") | 0.9 |
| Project name ("Hibiscus") | 0.8 |
| Person linked to project ("Rochelle") | 0.7 |
| Recent session context | 0.6 |
| Content type match | 0.5 |

**If total < 0.6 → ask.** Otherwise auto-tag silently.

### Q11: Opt-In Notifications Only

| Trigger | Default |
|---------|---------|
| Unprocessed DUMPs > 10 | OFF |
| Deadline approaching | ON (24hr) |
| Weekly review prompt | OFF |
| Pattern alerts | OFF |

**Primary interface:** `/status` command. Bot is responsive, not proactive.

---

## Implementation Sequence

```
Phase 1: Foundation
├── SQLite schema (parked_interviews table)
├── CSV parser + SQLite index builder
└── CLARIFY as default behavior

Phase 2: Core Flow
├── Reply-chain context (Q3)
├── Thread summarization (Q4)
├── Auto-park logic (Q2)
└── Project auto-tagging (Q10)

Phase 3: Routing
├── Multi-file cross-reference (Q5)
├── Image type detection (Q9)
└── Delphi integration (Q8)

Phase 4: Polish
├── Weekly trigger digest (Q7)
├── Notification preferences (Q11)
└── /status, /parked, /clear commands
```

---

## Dependencies Graph

```
Q6 (Dual Storage)
  ↓
Q2 (Interruption) ← Q1 (Default Mode)
  ↓
Q4 (Reply Depth) ← Q3 (Multi-Input)
  ↓
Q10 (Auto-Tagging)
  ↓
Q5 (Multi-File) → Q7 (links.json updates)
  ↓
Q9 (Image Analysis) → Q8 (Delphi routing)
  ↓
Q11 (Notifications) [independent]
```

---

## Pass 4 Refinements (from user feedback)

### Reply Depth = Knowledge Graph, Not Fixed Number

Old approach: "Last 5 messages, summarize older"
New approach: **Topic-aware depth**

```
When user replies to message:
1. What topic is this about?
2. How long have we been discussing this topic?
3. What's the recent velocity? (lots of messages = more context)
4. Pull relevant context based on topic graph, not message count
```

**Example:** User replies to a message from 3 days ago about "HB pricing"
- Bot checks: "HB pricing" has been discussed across 12 messages over 2 weeks
- Recent velocity: 4 messages in last 24 hours (high)
- Pull all 12 messages as context, not just immediate parent

### Parked Thoughts = Flashcard/Spaced Repetition

Old approach: "Expire after N days" or "sit until user asks"
New approach: **Spaced repetition surfacing**

```
Day 1:  Thought parked
Day 3:  "Still thinking about [X]?" [Resume / Archive / Later]
Day 7:  Same prompt
Day 14: Less frequent
Day 30: Monthly review
```

**Key principle:** "Proactively helping but can't substitute thinking"

Like the gym - AI makes life easier, but you still need to spar. The bot surfaces old thoughts for YOU to process, not to process them for you.

### Garbage Questions Deleted

~~Delphi availability check~~ - Not needed. Bot routes to Telegram group OR generates prompt.
~~Confidence threshold tuning~~ - Start simple. If bot guesses wrong, it asks. Tune later.

### Remaining: Command Namespace

Finalize: `/dump`, `/clear`, `/status`, `/parked`, `/batch`

---

## Next Steps

- **Pass 4:** Resolve open decisions above
- **Pass 5:** Write bot.py scaffold
- **Build:** Implement Phase 1-4 sequence
