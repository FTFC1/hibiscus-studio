# Open Questions for Sub-Agent Review

**Purpose:** These questions need resolution before building begins.
**Pass:** 2 of ~5
**For:** Architecture refinement via sub-agent analysis

---

## Category A: Mode System

### Q1: Default Mode
**Current design:** Three modes - DUMP, CLARIFY, AUTO
**User signal:** "Always clarify" - suggests CLARIFY should be default
**Question:** Should the mode taxonomy be:
- Option A: DUMP (escape hatch) / CLARIFY (default) / AUTO (bulk processing)
- Option B: Just CLARIFY with `/dump` and `/auto` commands
- Option C: Implicit mode detection based on content type

**Constraints:**
- User wants to move fast in capture moments
- But also wants depth when extracting value
- Friction should be minimal

---

### Q2: Interview Interruption
**Scenario:** User starts CLARIFY mode, bot asks Q1, user never responds. 2 hours later, user sends new content.

**Options:**
- A: Expire interview after N minutes, save partial state
- B: Ask "Continue previous interview or start new?"
- C: Always save partial, let user explicitly `/clear` to reset

**Considerations:**
- User has ADHD - interruptions are common
- Don't want to lose context from partial interviews
- Don't want stale interviews blocking new inputs

---

## Category B: Input Handling

### Q3: Multi-Input Messages
**Scenario:** User forwards Instagram video, then immediately sends voice note explaining why.

**Options:**
- A: Process sequentially, link via reply-chain
- B: Wait N seconds, merge into single input
- C: Always ask "Is this related to your last message?"

**User pattern:** Uses reply-to-message for linking. This is the native Telegram pattern.

---

### Q4: Reply-Chain Depth
**Question:** When user replies to a message, how much context to pull?

**Options:**
- A: Just immediate parent
- B: Full thread up to N messages
- C: Full thread, but summarize if > N messages

**Consideration:** Deep threads could exhaust context window.

---

## Category C: Output Routing

### Q5: Multi-File Routing
**Scenario:** Item is both an action AND contains an insight.

**Options:**
- A: Pick primary type, route to one file
- B: Duplicate to multiple files
- C: Route to primary, add cross-reference to others
- D: Ask user where it belongs

**Current files:** actions.md, decisions.md, insights.md, questions.md, forks.md

---

### Q6: Dual Storage (brain.csv + SQLite)
**Current design:** Both CSV (human-readable) and SQLite (searchable)

**Question:** Is this redundant?

**Options:**
- A: Keep both - CSV for humans, SQLite for queries
- B: SQLite only, generate CSV views on demand
- C: CSV only, add simple grep-based search

**User preference:** Values human-readable files. Doesn't want "black box" database.

---

### Q7: links.json Auto-Updates
**Current:** links.json maps trigger words to files (manual updates)

**Question:** Should bot suggest new triggers?

**Example:** Bot notices "FORJE" mentioned 5 times with no trigger → suggests adding

**Options:**
- A: Never auto-suggest (manual only)
- B: Suggest via weekly digest message
- C: Suggest inline when gap detected

---

## Category D: Creative Output

### Q8: Design Brief → V1
**Scenario:** Interview produces design brief for logo. User wants V1 concepts.

**Current insight:** ASCII won't work for logos - needs to invoke emotion.

**Options:**
- A: Output DALL-E prompt, user runs manually
- B: Auto-invoke DALL-E, show in chat
- C: Output Midjourney prompt (requires Discord)
- D: Integrate with Delphi skill (graphic designer agent)

**Consideration:** This connects to the Delphi project. May want unified creative output system.

---

### Q9: Image Analysis
**Scenario:** User sends photo of whiteboard sketch.

**Question:** How to handle visual content?

**Options:**
- A: Always describe and extract (Claude vision)
- B: Ask what to focus on first
- C: Detect content type (whiteboard, screenshot, photo) and route accordingly

---

## Category E: Project Management

### Q10: Auto-Tagging Projects
**Current projects:** hb-studio, delphi, forje, bhm-nigeria, mikano, etc.

**Options:**
- A: Always ask "Which project?"
- B: Auto-detect from keywords, confirm
- C: Auto-detect, only ask if confidence < threshold
- D: Let items be untagged, batch-tag later

**User pattern:** Often works on multiple projects in single session.

---

### Q11: Notification Cadence
**Question:** When should bot proactively message?

**Scenarios:**
- Unprocessed DUMPs pile up
- Weekly review time
- Deadline approaching (if captured)
- Cross-project pattern detected

**User signal:** Doesn't want noise. Values intentional engagement.

---

## Sub-Agent Prompt Template

```
You are reviewing architecture questions for a Telegram-based "sovereign brain" bot.

Context:
- User captures thoughts via voice/text/image/video on Telegram
- Bot extracts and routes to structured files (actions.md, insights.md, etc.)
- Must integrate with existing file structure (brain.csv, links.json)
- User has ADHD - friction must be minimal but depth must be available
- Phase 1 is local-only (no VPS)

Question to analyze: [PASTE QUESTION]

Provide:
1. Your recommended option with rationale
2. Edge cases to consider
3. Implementation complexity (Low/Medium/High)
4. Dependencies on other questions
```

---

## Priority Order

1. **Q1 (Default Mode)** - Affects entire UX
2. **Q2 (Interruption)** - Common scenario for ADHD user
3. **Q5 (Multi-File)** - Affects data model
4. **Q6 (Dual Storage)** - Affects implementation scope
5. Rest can be decided during build
