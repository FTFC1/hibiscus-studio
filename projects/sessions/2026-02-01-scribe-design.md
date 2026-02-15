---
session_id: 2026-02-01-scribe-design
session_date: 2026-02-01
projects: [INFRA, BOT]
stakeholders: []
work_type: infrastructure
value_tier: high
decisions_made: 5
items_open: 3
impact_score: 9
battlePlan:
  craftDocId: 589de0a8-e39d-34f0-d601-0a5d3655a519
  craftFolder: Session Packets
---

# Session Packet: Scribe Agent Design

**Session Date:** 2026-02-01
**Project:** INFRA, BOT
**Status:** ✅ Complete (4 design passes)
**Duration:** ~3h
**Work Type:** infrastructure

---

## CONTEXT

Continuing from Infrastructure Day (earlier today). Sprint Review Jan 21-31 identified:
- Context Preservation: 5/10
- Artifact Organization: 6/10
- Root cause: Implicit decisions create drift

**Problem:** Manual session packet creation takes 5-10 min per session. Need automation.

**Approach:** Design Scribe agent to auto-generate session packets from conversation.

---

## DECISIONS MADE

### 1. Scribe Agent v1 Scope (PASS 1)

**Decision:** Create Task agent that reads conversation JSONL and generates structured session packets.

**Initial design:**
- Input: Full conversation JSONL (~/.claude/projects/{session_id}.jsonl)
- Parse: Extract decisions, files loaded, created/updated
- Output: Session packet with YAML + markdown + location metadata
- Integration: Outputs to `/projects/session-packets/`, /briefing reads from there

**Rationale:** Automate the 5-10 min manual work per session.

**Location:** SOUL.md defined in conversation (Pass 1 design)

---

### 2. Location Metadata Strategy (PASS 2)

**Decision:** Session packets must include WHERE artifacts are located, not just names.

**Rules:**
- Local files → Full path: `/projects/hud/data.js`
- Notion pages → Database name + search hint: `Notion: "MK LinkedIn Outreach" (use notion-search)`
- Craft docs → Doc title + folder: `Craft: "Feb 1 — Battle Plan" (Session Packets folder)`
- Reference Artifact Index: `notion://database/855535eb12644fbe8d09b7ee1a392293`

**Rationale:** User feedback: "You haven't said where the sprint review is located... you've referred to the MK LinkedIn outreach... it's going to be looking for something that's not there."

**Impact:** Future sessions can find referenced files without re-discovery.

---

### 3. Integration with /briefing Command (PASS 2)

**Decision:** Scribe outputs must be /briefing-compatible.

**Requirements:**
- YAML frontmatter with required fields: `session_id`, `session_date`, `projects`, `decisions_made`, `items_open`
- Optional: `battlePlan.craftDocId` for Craft integration
- Markdown structure: `## DECISIONS MADE`, `## WHAT WAS CREATED/UPDATED`, `## NEXT ACTIONS`

**Workflow:**
1. Scribe writes session packet → `/projects/session-packets/YYYY-MM-DD-*.md`
2. /briefing reads last 3 session packets (step 4 in briefing.md)
3. /briefing extracts decisions, status changes, deliverables

**Rationale:** Scribe output feeds into /briefing context injection system.

**Location:** `.claude/commands/briefing.md` (step 4: "Read recent session packets")

---

### 4. Critical Constraint Hit: File Size (PASS 3)

**Problem:** Agent attempted to read full conversation JSONL.

**Error log:**
```
File content (6.6MB) exceeds maximum allowed size (256KB)
File content (16.1MB) exceeds maximum allowed size (256KB)
```

**Root cause:** Conversation JSONL grows from 6.6MB → 16.1MB as agent adds its own attempts.

**User insight:** "The conversation is so much extra fluff and that's why we even make the session packets"

**Impact:** Can't read full conversation JSONL. Initial design fundamentally broken.

**Decision:** PIVOT. Don't read conversation, read existing session packets instead.

---

### 5. Pivot to "Read Recent Work, Not Conversation" (PASS 4 - FINAL)

**Decision:** Scribe reads existing documentation, not raw conversation.

**New input strategy:**
1. ✅ **Recent session packets** (last 3-5 by modification time) - learn structure/pattern
2. ✅ **HUD state** (`/projects/hud/data.js`) - what changed today
3. ✅ **Artifact Index** (Notion) - file locations
4. ✅ **Last 20-30 conversation messages** (recent context, not full history)
5. ✅ **Session packet templates** - structure to follow

**What changed:**
- OLD: Parse 6.6MB conversation JSONL (all tool results, file reads, API calls)
- NEW: Read 40KB of curated documentation (session packets + HUD + recent messages)

**File/context reduction:** 6,600KB → 40KB = **99.4% reduction**

**Rationale:** Session packets exist PRECISELY to avoid re-reading full conversations. Good documentation propels the system forward.

**Impact:** Scribe becomes:
- **Pattern Learner** (reads recent session packets for structure)
- **Structure Enforcer** (follows template, ensures /briefing compatibility)
- **Location Resolver** (uses Artifact Index for file paths)
- **Context Synthesizer** (combines session packets + HUD + recent messages)

**Validation:** When you hit 99.4% reduction, you've found the right abstraction.

---

## WHAT WAS LOADED

### 1. Infrastructure Day Session Packet
- **Location:** `/projects/session-packets/2026-02-01-infrastructure-day.md`
- **Content:** 3 critical decisions (validation gates, artifact index, /briefing workflow)
- **Key insight:** "Fix the system, not symptoms"

### 2. HUD State
- **Location:** `/projects/hud/data.js`
- **Content:** doNext, battlePlan, wins, active tracks, waiting items
- **Last updated:** 2026-02-01T22:40:00

### 3. Briefing Command
- **Location:** `~/.claude/commands/briefing.md`
- **Content:** Momentum-aware context injection workflow
- **Integration point:** Step 4 reads last 3 session packets

### 4. Sprint Review Jan 21-31
- **Location:** `/projects/video-kb/debug/2026-01-sprint-review.md`
- **Content:** 11 days, 47+ artifacts, Context 5/10, Artifacts 6/10
- **Theme:** "Product & Foundation Sprint: Ship & Learn"
- **Referenced actively:** Infrastructure day design decisions based on sprint findings

### 5. Artifact Index (Notion)
- **Location:** `notion://database/855535eb12644fbe8d09b7ee1a392293`
- **Schema:** Artifact (title) | Path (text) | Project (select) | Purpose (text) | Status Once Liner (text)
- **Entries updated:** CLAUDE.md, Sprint Review, HUD (paths corrected, status populated)

### 6. Recent Session Packets (File System)
- **Location:** `/projects/session-packets/` (sorted by modification time)
- **Most recent:**
  - 2026-02-01-infrastructure-day.md
  - 2026-01-31-hb-duration-picker/ (folder)
  - 2026-01-31-momentum-system.md
- **Purpose:** Pattern learning for Scribe

---

## KEY FILE LOCATIONS

**From Artifact Index (notion://database/855535eb12644fbe8d09b7ee1a392293):**

| Artifact | Project | Path | Purpose | Status |
|----------|---------|------|---------|--------|
| CLAUDE.md | INFRA | `/Users/.../trello-mcp/CLAUDE.md` | Preferences, rules, validation gates | ✅ Active - Updated Feb 1 |
| HUD | INFRA | `/projects/hud/data.js` | Current state snapshot | ✅ Updated Feb 1 22:40 |
| /briefing | INFRA | `~/.claude/commands/briefing.md` | Context injection command | ✅ Reads session packets |
| Sprint Review | INFRA | `/projects/video-kb/debug/2026-01-sprint-review.md` | Jan 21-31 analysis | ✅ Referenced actively |
| Artifact Index | INFRA | Notion database (see above) | File lookup table | ✅ Updated with status field |

**Session packets folder:** `/projects/session-packets/` (contains 15+ packets + templates)

---

## ANTI-PATTERNS AVOIDED

### 1. Reading Full Conversation JSONL

**Almost built:** Scribe agent that parses 6.6MB conversation file

**Caught by:** File size constraint (exceeds 256KB limit)

**User insight:** "The conversation is so much extra fluff and that's why we even make the session packets"

**Lesson:** Don't parse what you've already summarized. Session packets exist to avoid this.

---

### 2. Asking User for Manual Summary

**Alternative considered:** Scribe asks user "What were the key decisions?" (interactive assistant)

**Rejected:** Defeats automation purpose. If user recalls decisions to tell Scribe, might as well write packet manually.

**Better:** Read existing documentation (session packets + HUD) which user already maintains.

---

## CONCEPTS DISCOVERED

### Vector Intersection (Leverage via Dual Constraint Satisfaction)

**Pattern observed:**

```
Problem A: Context preservation 5/10
         ↓ (Approach: Session packets)

Problem B: Artifact organization 6/10
         ↓ (Approach: Artifact Index)

Intersection: Scribe agent
         ↓
Result: Reads Artifact Index → Writes Session Packets
        (Solves BOTH with ONE tool)
```

**Formula:** 1×1 ≠ 2, instead 1×1 = **Reusable tool that captures momentum from both vectors**

**Commercial name:** **Keystone Abstraction** (one tool that supports multiple systems)

**Math name:** Synergy via constraint intersection (finding minimum viable solution that satisfies multiple constraints creates emergent properties)

**Not Pareto frontier:** Pareto involves sacrifice (improve A, worsen B). This is: improve A AND B with same solution.

**Examples of keystone species (ecology):**
- **Sea otter:** Controls sea urchin population → kelp forests survive → entire ecosystem supported
- **Beaver:** Builds dams → creates wetlands → habitat for 100+ species
- **Wolves (Yellowstone):** Control elk → vegetation recovers → birds/beavers return

**This happened Jan 21-31:**
- Shipping bottleneck (Problem A)
- Infrastructure debt (Problem B)
- Feb 1 Infrastructure Day (Intersection)
- Result: Validation gates + Artifact Index + /briefing = **system that prevents both**

**User observation:** "The sum is greater than two in the solving as well in the solving ability"

---

### Poly-Index Architecture

**Definition:** Multiple indexes reference SAME artifacts, provide different lenses.

**Proposed structure:**

1. **Artifact Index** (Already exists) - File lookup
   - Columns: Artifact | Path | Project | Purpose | Status
   - Query: "Where is HUD?" → `/projects/hud/data.js`

2. **Projects Index** (New) - Portfolio view
   - Columns: Project | Status | Last Updated | Active Track | Next Action | Stakeholder
   - Query: "What's blocking HB?" → "Rochelle testing duration picker"

3. **Personal CRM Index** (New) - Stakeholder map
   - Columns: Person | Project | Last Contact | Relationship | Next Action | Context
   - Query: "When did I last talk to Timi?" → "Jan 31 - PUMA approval"

4. **Thoughts/Notes Index** (New) - Brain dump
   - Columns: Thought | Date | Project | Status (Open/Processed/Parked) | Connected To
   - Query: "What was I thinking about gas distribution?" → [thought entries]
   - User adds via Notion, MCP shows timestamps

5. **Parked/Backlog Index** (New) - What we consciously decided NOT to do
   - Columns: Feature | Project | Parked Date | Reason | Revisit When | Decision
   - Query: "Why did we park brain-bot /briefing?" → "Wait for v1 ship"

**Benefit:** Apply mental models by querying across indexes:
- "Show all parked features connected to unshipped projects" (validates Ship-or-Park Rule)
- "Show all artifacts where purpose mentions 'context'" (context preservation theme)
- "Show all projects with stakeholders not contacted in 7+ days" (relationship health)

**Example cross-reference:**
- Artifact Index: "HUD lives at `/projects/hud/data.js`"
- Projects Index: "INFRA project last updated HUD on Feb 1"
- Thoughts Index: "Thought: HUD should show staleness indicators (Feb 1)"

**Mental models to apply:**
- 80/20 (Pareto Principle)
- Diminishing returns
- Cost-benefit analysis
- Lenses (multiple perspectives on same data)

**Compare to Tiago Forte's "Building a Second Brain":**
- BASB: PARA method (Projects, Areas, Resources, Archives)
- Our approach: Poly-index with cross-references + computational queries
- Similar: Both organize knowledge for retrieval
- Different: We optimize for AI parsing + cross-index queries

---

## BUILD PROCESS PATTERN (Meta)

**What we did (4 passes):**

1. **Pass 1 (Context):** Loaded infrastructure day packet, HUD, briefing, sprint review
2. **Pass 2 (Content):** Designed Scribe with location metadata, Notion exports, /briefing integration
3. **Pass 3 (Execute):** Tested Scribe → **Hit constraint** (6.6MB file, 99.5KB output limit)
4. **Pass 4 (Pivot):** Redesigned input strategy → 99.4% reduction

**Pattern:** Context → Content → Execute → **Constraint reveals better design**

**How to replicate:**
- Each pass has clear goal (what question?)
- Expose assumptions (what did we think was true?)
- Test constraints (where does it break?)
- Pivot or validate (continue or redesign?)

**Applies to next work:** Artifact Index Skill will follow same 4-pass pattern.

---

## OPEN ITEMS

1. **Build /artifact-index skill** (foundation for Scribe + other indexes)
   - Read Notion Artifact Index
   - Cache locally: `/projects/.cache/artifact-index.json`
   - Fallback to cache if Notion MCP fails
   - Update both cache + Notion on write

2. **Rebuild Scribe with session packets input** (Pass 4 design)
   - Read last 3-5 session packets (by mtime)
   - Read HUD state
   - Read last 20-30 messages (not full JSONL)
   - Generate session packet following recent pattern

3. **Create Thoughts/Notes Index in Notion**
   - Brain dump area for user
   - Timestamps via MCP
   - Open questions, ideas, observations

4. **Document vector intersection concept** (Keystone Abstraction)
   - Define: 1×1 = reusable tool capturing dual momentum
   - Examples: Sea otter, beaver, wolves
   - Compare to Pareto frontier (different)

5. **Sprint Review location** - User wants file that references it based on "us having started work building off of it"
   - Current: `/projects/video-kb/debug/2026-01-sprint-review.md`
   - Need: Reference file showing it's actively used (not just archived)

---

## NEXT ACTIONS

**For Monday (Feb 3):**
- Build /artifact-index skill (4-pass pattern)
- Test cache layer (measure read time with/without Notion)
- Create Thoughts/Notes Index in Notion
- Test Scribe with session packets input (not conversation JSONL)

**For Notion integration:**
- Explore Notion calendar (Kron/Cron Calendar) for time tracking
- Embed Notion views in HUD (vs rendering calendar in HTML)

**For documentation:**
- Create 101 guide: "How to use poly-index architecture with mental models"
- Document vector intersection concept (Keystone Abstraction)
- Compare to Tiago Forte's BASB approach

---

## META

**Session type:** Infrastructure + design (multi-pass iteration, constraint-driven pivot)

**Pattern discovered:** Vector intersection (1×1 = keystone abstraction)

**Validation metric:** 99.4% file size reduction proves right abstraction found

**Build process:** 4 passes (Context → Content → Execute → Pivot on constraint)

**User observation:** "This is the kind of stuff I want to be able to do" (referring to updating Artifact Index, seeing status, understanding connections)

**Comparison to sprint:** This session IS the pattern from Jan 21-31 sprint (shipping fast, realizing system needs fixing, building the fix)

**Notion calendar integration:** User wants time view in Notion (Kron Calendar) vs HUD rendering

**Poly-index architecture:** Proposed 5 indexes (Artifact, Projects, Personal CRM, Thoughts, Parked) as different lenses on same work

---

**Created:** 2026-02-01
**Source:** Infrastructure Day → Scribe Agent Design → Vector Intersection Discovery
**Sprint Review:** `/projects/video-kb/debug/2026-01-sprint-review.md` (referenced actively)
**Artifact Index:** `notion://database/855535eb12644fbe8d09b7ee1a392293` (updated with status field)
**Session packets folder:** `/projects/session-packets/` (contains pattern for Scribe to learn)
