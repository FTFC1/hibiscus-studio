# Session Packet: brain-bot Context Awareness + /status Redesign

**Session Date:** 2026-01-28
**Project:** brain-bot (Telegram personal knowledge management)
**Duration:** ~2 hours
**Status:** 🟡 In Progress - Classification redesign planned

---

## Executive Summary

### What Changed
- ✅ **Context Awareness** (v0.3.0): Bot remembers last response, natural follow-ups work
- ✅ **Quick /status Fix** (v0.3.1): Better truncation, sentence boundaries, project tags
- 🔴 **Root Problem Identified**: Classification system fundamentally broken
- 📋 **Design Decision**: Complete /status redesign needed

### The Core Issue
**/status was showing "what exists" instead of "what to do"**

User complaint: "Insights at bottom is stupid - they're what I should work on"

The bot was treating all knowledge equally, organized by message type (ideas/plans/insights). But the user needs **action priority** (blocked → ready → questions → watching → backlog).

---

## Timeline of Work

### 1. Initial Context (9:30 AM)
User asked to see latest brain-bot updates.

**Current State:**
- 98 messages processed
- 218 knowledge files ingested
- Last commit: `119d586 feat: Action-first layout redesign for admin dashboard`

**Previous Session Context:**
User had asked about TODO list functionality, but nothing was built yet. This became relevant later.

---

### 2. Context Awareness Implementation (9:45 AM - 10:15 AM)

**Problem:** Bot couldn't handle natural follow-ups like "show me" or "yes"

**Solution:** Added conversation memory system

**How It Works:**
1. Bot stores what it just said: `/status` → stores plan/idea/insight counts
2. User says "show me" → bot knows to expand whatever was just summarized
3. User says "yes" after "Do you want details?" → bot knows what details to show
4. Context persists across bot restarts (stored in SQLite)

**Example Flow:**
```
User: /status
Bot: "You have 3 plans, 5 ideas, 2 insights"
     [Stores: last showed counts, can expand any category]

User: "show me the plans"
Bot: [Retrieves context, knows what "the plans" refers to]
     "Plan 1: ..., Plan 2: ..., Plan 3: ..."
```

**Version Bump:** v0.3.0

---

### 3. First Complaint: /status Shows Garbage (10:30 AM)

User: "/status shows truncated useless content"

**Examples of Bad Output:**
```
Plans (3):
• "can you explain to me why, with cursor closed but" [cuts off mid-thought]
• "3 plans" [what plans? This is a count, not a plan]

Insights (5):
• "[HB] Studio Booking Flow - Funnel → invoice" [project name, not insight]
• "what tools would I consider?" [question, not insight]
```

**Problem Analysis:**
1. Text truncated at 60 chars, often mid-sentence
2. Classification mixing up message types
3. No project context shown
4. Generic counts treated as content

---

### 4. Quick Fix Attempt (10:45 AM)

**Changes in v0.3.1:**
- Increased truncation from 60 to 150 chars
- Added smart sentence boundary detection
- Added [PROJECT] tags to insights
- Better multi-line content handling

**User Feedback:** "Still wrong, but let me explain the real problem..."

---

### 5. The Real Problem Revealed (11:00 AM)

User's actual complaints:

> **On Priority:**
> "Insights at bottom is stupid - they're what I should work on. They should be at the top."

> **On Classification:**
> - "'Idea: antigravity' is not a plan, it's a research question"
> - "'What tools would I consider?' is not a plan"
> - "[HB] Booking flow" is not an insight, just a project description

> **On Structure:**
> "I don't care how many ideas I have. I care what's blocked, what's ready, what questions I need to answer."

**The Fundamental Mistake:**

The bot was organizing by **message type** (ideas/plans/insights/todos), but the user needs organization by **action priority**.

Current (wrong):
```
Ideas → Plans → Todos → Insights
```

Needed (right):
```
BLOCKED → READY → QUESTIONS → WATCHING → BACKLOG
```

---

### 6. Expert Counsel (11:15 AM)

Called in 3 specialist agents for analysis.

#### Agent 1: Product Design Critic

**Diagnosis:**
> "Information hierarchy is inverted. User sees counts first, specifics last. Should be: what's blocking me → what can I do now → what needs more thought."

**Recommendation:**
```
1. BLOCKED (things waiting on external dependencies)
2. READY (things I can do right now)
3. QUESTIONS (things I need to research/decide)
4. WATCHING (things I'm tracking but not acting on)
5. BACKLOG (everything else)
```

#### Agent 2: NLP Classification Expert

**Diagnosis:**
> "Categories are confused. A 'plan' in current system includes research questions, project descriptions, and actual executable plans."

**Proper Classifications:**

| Type | Definition | Example |
|------|------------|---------|
| **PLAN** | Specific, executable sequence | "1. Design schema 2. Build UI 3. Test" |
| **QUESTION** | Needs research/decision | "What tools should I use?" |
| **THOUGHT** | Observation/reflection | "Users prefer dark mode" |
| **INSIGHT** | Actionable understanding | "Button placement affects conversion 3x" |
| **PROJECT** | Named initiative | "[HB] Studio Booking Flow" |
| **FEEDBACK** | External input | "Client wants faster load times" |

**Current System Mistakes:**
- "Build the checkout flow" → PLAN ✓
- "What database should I use?" → Currently PLAN, should be QUESTION ✗
- "[HB] Booking system" → Currently INSIGHT, should be PROJECT ✗

#### Agent 3: UX Information Architect

**Diagnosis:**
> "Showing counts is analyst behavior. User needs manager view: what's broken, what's next, what's pending."

**Recommended /status Structure:**

```markdown
🚨 BLOCKED (2)
• [Project X] Waiting on API keys from vendor
• [Project Y] Need design approval from client

✅ READY TO START (3)
• Build user registration flow
• Set up database migrations
• Write API documentation

❓ NEEDS DECISION (4)
• Which payment processor? (Stripe vs PayPal)
• Should we support dark mode in v1?
• What hosting: Vercel or Railway?

👁️ WATCHING (5)
• Client reviewing proposal
• Waiting for user feedback on prototype
• Monitoring competitor launch

📦 BACKLOG (12 items)
[collapsed by default]
```

**Key Principle:**
> "Status should answer: What's stopping me? What should I do next? What am I waiting to hear about?"

---

## Design Decisions Made

### Decision 1: Fix Classification System

**Problem:**
Current classification is too broad - "What database should I use?" gets classified as PLAN

**Solution:**
Add new message types to knowledge schema:

```python
MESSAGE_TYPES = {
    'plan',      # Executable sequence of actions
    'question',  # Needs research/decision
    'thought',   # Observation/reflection
    'insight',   # Actionable understanding
    'project',   # Named initiative
    'feedback',  # External input
    'idea',      # Original creative thought
    'todo'       # Single discrete task
}
```

**Migration Strategy:**
1. Add new types to schema
2. Re-classify existing messages
3. Update classification prompts
4. Test on existing knowledge base

---

### Decision 2: Redesign /status Display

**Old Structure (message-type based):**
```
Ideas (5) → Plans (3) → Todos (2) → Insights (1)
```

**New Structure (action-priority based):**
```
BLOCKED → READY → QUESTIONS → WATCHING → BACKLOG
```

**Display Rules:**
- BLOCKED and READY: Always expanded, show top 5
- QUESTIONS: Always show, up to 5
- WATCHING: Collapsed by default (count only)
- BACKLOG: Collapsed by default (count only)

---

### Decision 3: Update Data Model

**Add New Fields to Messages:**

```sql
ALTER TABLE messages ADD COLUMN message_type TEXT;
ALTER TABLE messages ADD COLUMN priority_status TEXT;
ALTER TABLE messages ADD COLUMN waiting_on TEXT;
ALTER TABLE messages ADD COLUMN project_tag TEXT;
```

**Why Separate Fields:**
- `message_type`: What kind of content (plan/question/insight/etc)
- `priority_status`: Where it appears in /status view
- `waiting_on`: What's blocking it (for BLOCKED items)
- `project_tag`: Which project it belongs to

---

## Files Modified

### bot.py
- **Version:** 0.2.1 → 0.3.1
- **Lines:** ~3536
- **Changes:**
  - Added context awareness system
  - Improved truncation logic
  - Added project tags to previews
  - Next: Classification + /status redesign

### TODO.md (Created)
- **Lines:** 207
- **Purpose:** Comprehensive redesign plan

### CONTEXT_AWARENESS.md (Created)
- **Purpose:** Document context tracking feature

---

## Next Steps

### Immediate Tasks (Next 1-2 hours)

1. **Update Classification System**
   - Add new message_type values
   - Write re-classification logic
   - Test on existing knowledge base

2. **Redesign /status Command**
   - Implement priority-based grouping
   - Add BLOCKED/READY/QUESTIONS sections
   - Test with real data

3. **Database Migration**
   - Add new fields to messages table
   - Migrate existing data
   - Update all queries

### Questions to Resolve

- **Tagging Strategy:** Should users manually tag items as BLOCKED/READY, or should bot infer from content?
- **Project Detection:** Extract project tags from content `[HB]`, or require explicit tagging?
- **Backlog Threshold:** How old/inactive before something moves to backlog?

### Success Criteria

You'll know this is done when:
- ✅ /status shows BLOCKED items first
- ✅ "What database should I use?" classified as QUESTION, not PLAN
- ✅ User can see what's stopping them and what they can do now
- ✅ No more garbage truncation mid-sentence

---

## Key Learnings

### What Worked
1. **Quick iteration:** v0.3.0 context awareness shipped in 30 min
2. **Expert counsel:** Calling in specialists revealed deep structural issues
3. **User feedback:** "Still wrong" led to root cause discovery

### What Didn't Work
1. **Surface fixes:** Increasing truncation limit didn't solve underlying problem
2. **Assumption:** Assumed user wanted better formatting, actually wanted different information

### Design Principle Discovered
> **Show action priority, not data organization**

Users don't care how the knowledge is stored. They care:
- What's blocking me?
- What can I do now?
- What needs my decision?

This is a shift from **librarian view** (organized by type) to **manager view** (organized by priority).

---

## Expert Recommendations Summary

### From Product Design Critic
> **Invert the hierarchy:** Show action priority, not message counts. User should see blockers first, not last.

**Actionable:**
- ✅ Redesign /status to show BLOCKED → READY → QUESTIONS
- ✅ Make BLOCKED and READY always expanded
- ✅ Collapse WATCHING and BACKLOG by default

### From NLP Classification Expert
> **Separate message types from action states:** A question is a type, being blocked is a state.

**Actionable:**
- ✅ Add `message_type` field (plan/question/insight/project/feedback)
- ✅ Add `priority_status` field (blocked/ready/watching/backlog)
- ✅ Re-classify existing messages with new taxonomy

### From UX Information Architect
> **Manager view, not analyst view:** User needs to know what to do, not statistics.

**Actionable:**
- ✅ Replace counts with previews
- ✅ Show "waiting on" reasons for blocked items
- ✅ Provide expansion commands for collapsed sections

---

**End of Session Packet**

*Generated: 2026-01-28*
*For: brain-bot knowledge base ingestion*
*Session Duration: ~2 hours*
*Status: Design complete, implementation pending*
