# Claude Code Preferences

## PROPOSED IMPROVEMENTS (2026-01-31)

*Review these suggestions before they're integrated into the doc*

### 1. Add `impact_score` Field (1-10)
- **Why:** Filter high-impact work across different types (research vs implementation)
- **How:** Add to YAML frontmatter, use for sorting/reviewing
- **Benefit:** "Show me all 8+ impact sessions this month"

### 2. Session Digest Auto-Generation
- **Why:** Manual timeline/decision creation is time-consuming
- **How:** Script reads session packets → generates digest
- **Benefit:** 5-10 minutes saved per session

### 3. Bi-Directional Linking
- **Why:** Session doesn't list its packets (only reverse link exists)
- **How:** Session index includes `packets: [puma-localization, sprint-review]`
- **Benefit:** One place to see all work from a session

### 4. Visual Session Timeline (HTML)
- **Why:** Text timeline hard to scan
- **How:** Generate HTML timeline (like GitHub commits)
- **Benefit:** Visual understanding of session flow

### 5. Craft Integration for Sessions
- **Why:** Sessions should be shareable, not just archives
- **How:** Session digest → Craft doc → Share link
- **Benefit:** Stakeholder transparency, view tracking

---

## Browser Automation (Commet)

**Rule:** Default to automating multi-step platform tasks via Commet before doing them manually.

**When to use:**
- Creating listings (Peerspace, marketplace platforms)
- Filling forms across multiple pages
- Any sequential UI workflow where the user is already logged in
- Tasks with 5+ steps that would take 15+ minutes manually

**How to write Commet instructions:**
- Step-by-step, numbered, sequential
- Copy-paste ready content for every text field
- Commet adapts when UI differs from instructions (e.g., missing field → woves content elsewhere)
- Always include a verification step at the end

**Why this matters:** First confirmed use (Feb 23, 2026) — 14-step Peerspace listing created autonomously. Pattern: if you do it once manually, write the instructions, Commet does it next time.

**Codified from:** Knowledge graph conviction `atom-20260221-074` (weight 5, 5 sources).

---

## Context Management

### File Reading Strategy
**Preference:** Use Task agents for reading files. Most of the time, use a **pre-agent** to gather context before the main agent does work.

**Two-Agent Pattern (default):**
1. **Pre-agent** — Gathers context, reads relevant files, understands conversation state
2. **Main agent** — Does the actual work with proper context

**Rationale:** "Who knows if the agent has enough?" Without a pre-agent, the main agent may lack proper context. The pre-agent ensures the main agent knows enough to do the work correctly.

**When to read directly (rare):**
- Short config files (<50 lines)
- Single file you're about to edit
- Files where exact content matters more than summary

### Size Check Before Opening (MANDATORY)
**Rule:** ALWAYS check file size (`ls -lh`) before reading/opening ANY file — images, PDFs, HTML, data files, anything.

**Why:** Large files (especially images >2000px, large HTML, big datasets) can crash the API, overflow context, or waste tokens. Check FIRST, decide THEN.

**Pattern:**
1. `ls -lh /path/to/file` — check size
2. If image: check dimensions too (`file` or `identify` command)
3. If >100K: consider whether full read is needed
4. If image/PDF: use appropriate tool (pdftotext for PDFs, never Read on large images)

**Connects to:** PDF rule (always pdftotext), token efficiency, API stability.

### Artifact Index (Cache-First Lookup)
**CRITICAL RULE:** ALWAYS check Artifact Index BEFORE asking "where is X saved?"

**Location:** `/projects/.cache/artifact-index.json`

**Pattern:**
1. Read artifact index first
2. Check if artifact exists in index
3. If exists: use path/notionUrl directly
4. If missing: add to index, update cache
5. NEVER ask user for location if it's in the index

**Why this matters:** User feedback (Feb 2): "I'm disappointed... you're not using the system we built."

**What to cache:**
- Project-specific data (LinkedIn leads, PUMA training, HB bookings)
- Research outputs (sprint reviews, analysis docs)
- Infrastructure (templates, commands, HUD)
- Key documents (CLAUDE.md, battle plans)

**What to ask about:**
- Session packets (case by case — ask user if worth indexing)
- New artifacts (ask: "Add to index?")

**Session Packet Index (separate):**
Consider maintaining a session packet index with:
- File location
- What it links to (related artifacts)
- When it was created

**Update frequency:**
- Add new artifacts as they're created
- Update paths when files move
- Refresh cache when Notion database changes

## Output Preferences

### HUD over MD
When creating situation briefs or strategic documents, prefer **visual HUD (Heads-Up Display) format** over text-heavy markdown documents.

**HUD characteristics:**
- Scannable at a glance
- Color-coded status indicators
- Visual hierarchy (cards, badges, icons)
- Action-oriented (who does what, when)
- Dark mode HTML for screen viewing

### HUD Updates: data.js Pattern
**CRITICAL:** When updating HUDs, separate data from presentation for token efficiency.

**Pattern:**
1. **Never regenerate full HTML** - HTML structure is stable
2. **Update v4-data.js only** - All content lives in data object
3. **Open in browser** - Use `open hud/v4.html` to show updated HUD

**Why this matters:**
- Regenerating HTML wastes 5-10k tokens per update
- v4-data.js updates use ~500 tokens
- v4.html loads v4-data.js dynamically (no rebuild needed)

**Example workflow:**
```bash
# Update data only
edit /projects/hud/v4-data.js

# Open in browser (macOS)
open /projects/hud/v4.html
```

**When to use:**
- Session updates (wins, active tracks, do next)
- Status changes (waiting items, shipped today)
- Quick reference updates (notes, links)

**When NOT to use:**
- First-time HUD creation (need full HTML)
- Major structure changes (add/remove sections)
- Fixing HTML bugs or styling issues

### Master Review HTML (For Voice Note Feedback)
**Pattern:** When delivering multiple outputs (analysis + frameworks + next steps), consolidate into one expandable HTML for efficient review.

**When to use:**
- Multi-document deliverables (3+ separate files)
- User says "show me in one view" or "clicking around wastes time"
- Complex analyses with multiple frameworks/recommendations
- When user wants to give feedback via voice note (easier to review all-in-one)

**Format requirements:**
- Dark mode, monospace font (HUD style)
- All sections collapsible/expandable (click to toggle)
- "Expand All" button (top right, fixed position)
- Section numbering (1. Executive Summary, 2. Detailed Findings, etc.)
- First section auto-expanded on load
- Include all code snippets, templates, tables inline (no external links)
- Footer with navigation instructions

**Example structure:**
```html
Section 1: Executive Summary (critical findings, start here)
Section 2: Detailed Analysis (data, metrics, breakdowns)
Section 3: Frameworks/Templates (ready-to-use content)
Section 4: Implementation Steps (how to execute)
Section 5: Open Questions (decisions needed)
Section 6: Success Criteria (how to measure)
Section 7: File Reference (quick access to all outputs)
```

**Benefits:**
- User reviews everything in 10-15 minutes (vs 30+ minutes clicking through files)
- Voice note feedback captures thoughts on all sections
- Single URL to share/bookmark
- Printable (if needed)

**Implementation:** See `/projects/inbox/Feb 2/analysis/MASTER-REVIEW.html` as reference example.

### Terminal + Browser Layout Pattern
**Setup:** Split screen — Browser (left) + Terminal with Claude Code (right).

**Why Terminal, Not IDE:**
- Claude Code in terminal has full file access (read, write, execute)
- IDE integrations (Cursor, VS Code) have restricted file access → causes errors
- Terminal is faster for tool operations, fewer permission issues

**Why Browser on Left:**
- Universal viewer: PDFs, HUDs, HTML reports, internet
- Perplexity for research without leaving workspace
- Open multiple tabs (HUD, docs, web) while working
- No app-switching friction

**Workflow:**
1. Generate HTML/visual output → Save file
2. Use `open` command to display in browser (left pane)
3. Continue working in terminal (right pane)
4. User reviews visuals while giving voice feedback

**Commands:**
```bash
# macOS
open /path/to/file.html

# Linux
xdg-open /path/to/file.html
```

**What opens in browser:**
- HUDs (main HUD, tasks HUD)
- Master Review HTML (consolidated deliverables)
- PDFs (proposals, research docs)
- Perplexity (web research)
- Any visual output

**Don't assume user will manually open files** - Use `open` command proactively.

### Context Retention
All strategic documents should support context retention between sessions. Include:
- Date stamps
- Current status indicators
- Clear action sequencing
- Stakeholder maps with their positions

### Sources Requirement (80/20 Rule)
**Rule:** Just say it — easier to know what context was used.

**When to include:**
- Research and analysis responses — YES
- Strategy recommendations — YES
- File edits — NO (obvious from the edit itself)
- Quick answers — optional

**Format:**
```
---
Sources (80/20):
◇ 60% — /path/to/main-file.md
◇ 30% — /path/to/secondary.csv
◇ 10% — /path/to/other files
```

**Rules:**
- Not every single file — show what 20% of files formed 80% of opinion
- Include percentages to show weight
- User can verify correct context was used
- If wrong files referenced → user corrects → add correction to index

**Why this matters:** Sessions are inconsistent when wrong context assumed. Sources make assumptions visible.

---

## Information Architecture

### Three-Tier Hierarchy

Work is organized in three levels for different purposes:

```
Sprint Review (strategic, 7-14 days)
└── Session (tactical, 1-3 hours, one sitting)
    ├── Session Metadata (timeline, decisions, artifacts, challenges)
    └── Session Packets (project-specific work)
        ├── [HB] Packet (project-focused deliverable)
        ├── [PUMA] Packet (project-focused deliverable)
        └── [INFRA] Packet (infrastructure work)
```

**Sprint Review** - Analyzes patterns across multiple sessions
- Scope: 7-14 days of work
- Purpose: Strategic insights, contradictions, deep-dive candidates
- Audience: Planning next sprint, identifying architectural debt
- Example: Sprint Review Jan 21-31 (6 sessions analyzed)

**Session** - Documents one sitting of work
- Scope: 1-3 hours, multiple projects touched
- Purpose: Productivity tracking, decision capture, context preservation
- Audience: Self (reviewing patterns, estimating capacity)
- Example: Session Jan 31 (9 tasks, 8 decisions, 11 files created)

**Session Packet** - Deliverable for specific project/topic
- Scope: Work on one project within a session
- Purpose: Project continuity, stakeholder communication
- Audience: Future self, team members, stakeholders
- Example: PUMA Nigerian localization (48 language changes)

---

### Session vs. Packet: Key Distinctions

| Dimension | Session | Session Packet |
|-----------|---------|----------------|
| **Scope** | All work in one sitting (2-3 hours) | Work on one project/topic within session |
| **Focus** | Meta: How session went, what types of work | Deliverable: What was built/decided for project |
| **Audience** | Self (reviewing productivity, patterns) | Stakeholders + future self (project continuity) |
| **Artifacts** | Timeline, decisions, CSV index, challenges | Code, designs, decisions for specific project |
| **File Count** | 1 session = 5-6 files (timeline, decisions, etc.) | 1 packet = 1 file (or folder if complex) |
| **Example** | "Session Jan 31: 9 tasks, 8 decisions, 11 files" | "PUMA localization: 48 changes applied" |

**Rule:** One session can produce multiple packets (worked on HB + PUMA + infrastructure in one sitting).

---

### Multiple View Modes

**Status:** Actively used (not aspirational). Different views = faster leverage + data-driven pivots.

**Active view types:**
- Day logs (24h phases, energy tracking)
- T-shirt sizing tables (item, size, priority)
- Expandable parallel audit views (click to expand/collapse)
- Timeline views (fill in as you talk)
- HUD dashboards (status, next actions)

Support curation through three organizational views:

**View 1: Chronological (by session/date)**
```
/sessions/
├── 2026-01-23/
│   ├── SESSION-METADATA.md
│   └── packets/
│       └── hb-booking-demo.md
├── 2026-01-26/
└── 2026-01-31/
```

**View 2: By Project**
```
/projects/
├── HB-Studio/
│   └── sessions/
│       ├── 2026-01-23.md
│       ├── 2026-01-26.md
│       └── 2026-01-29.md
└── PUMA/
    └── sessions/
        ├── 2026-01-29.md
        └── 2026-01-31.md
```

**View 3: By Work Type**
```
/by-type/
├── research/       # Exploration, learning, investigation
├── implementation/ # Building features, writing code
├── review/         # Sprint reviews, retrospectives
├── infrastructure/ # Tooling, processes, standards
├── stakeholder/    # Meetings, approvals, communication
└── correction/     # Bug fixes, error resolution
```

**Implementation:** Use tags in YAML frontmatter:
- `projects: [HB, PUMA]` → Enables project view
- `work_type: research` → Enables type view
- `session_date: 2026-01-31` → Enables chronological view

---

## Session Documentation

### Session Metadata Files

**Status:** Not stale — needs populating. This enables Gantt-equivalent views based on actual work.

| File | Purpose | When to Create |
|------|---------|----------------|
| `SESSION-INDEX.csv` | Task metadata (energy, difficulty, hourly rate) | Every session |
| `SESSION-ARTIFACTS.md` | What was created/updated (proof of work) | Every session |
| `SESSION-TIMELINE.md` | Chronological events | Every session |
| `SESSION-DECISIONS.md` | Key decisions with rationale | If decisions made |
| `SESSION-OPEN-QUESTIONS.md` | Unresolved questions | If questions raised |
| `SESSION-CHALLENGES.md` | Blockers, friction, debt | If challenges encountered |

**Location:** `/projects/inbox/sprint-review-{dates}/SESSION-{date}-*.md`

**Why this matters:**
- SESSION-INDEX = Gantt chart equivalent of actual work done
- SESSION-ARTIFACTS = proof of what was made
- AI works with reality of data, not made-up things
- Biggest productivity acceleration comes from this

---

### Session YAML Frontmatter

```yaml
---
session_id: YYYY-MM-DD-short-name
session_date: YYYY-MM-DD
duration_hours: 2.5
projects_touched: [HB, PUMA, INFRA]
work_types: [implementation, research, review]
value_tier: high        # critical | high | medium | low
impact_score: 8         # 1-10 (optional, for filtering)
decisions_count: 8
artifacts_count: 11
tasks_completed: 9
---
```

**Key Fields:**
- `value_tier` - Helps filter when reviewing (focus on high/critical first)
- `work_types` - Array (session can include multiple types)
- `projects_touched` - All projects worked on in this sitting
- `impact_score` - Numeric (9-10: strategic, 7-8: solid, 4-6: routine, 1-3: cleanup)

---

## Session Packets

### Format Convention
Session packets can be **flat files OR folders** depending on complexity:

### Format Convention
Session packets can be **flat files OR folders** depending on complexity:

| Packet Type | Format | Example |
|-------------|--------|---------|
| Quick session (<30 min) | Flat `.md` file | `2026-01-28-quick-fix.md` |
| Deep session (>1 hour, multiple decisions) | Folder with `index.md` | `2026-01-28-architecture-redesign/` |
| Has screenshots/artifacts | Folder | `2026-01-28-ui-review/` |

### Folder Structure (when used)
```
2026-01-28-session-name/
├── index.md          # Primary query target (always lean)
├── decisions.md      # Structured decisions with rationale
├── artifacts/        # Screenshots, exports, logs
└── threads/          # Deep-dive tangents (optional)
```

### Ingestion Rule
Ingestion must handle both:
- If path is file → ingest as single document
- If path is directory → ingest `index.md` as primary, other files as linked context

### Header Convention (Required)
All session packets must have YAML frontmatter + markdown header for parsing:
```markdown
---
session_id: YYYY-MM-DD-short-name
parent_session: YYYY-MM-DD-parent  # session this packet belongs to
projects: [HB, BOT]                # tags from Active Projects
stakeholders: []                    # people involved
work_type: implementation           # research | implementation | review | infrastructure | stakeholder | correction
value_tier: high                    # critical | high | medium | low
decisions_made: 0
items_open: 0
impact_score: 7                     # 1-10 (optional, for high-level filtering)
---

# Session Packet: {title}

**Session Date:** YYYY-MM-DD
**Project:** {project name}
**Status:** {emoji} {status text}
**Duration:** ~Xh Ym
**Work Type:** {work_type}
```

Status emojis: ✅ Complete | 🟡 In Progress | 🔴 Blocked | ⏸️ Waiting

**Templates:**
- Session: `/projects/sessions/templates/SESSION-TEMPLATE.md`
- Packet: `/projects/sessions/templates/SESSION-PACKET-TEMPLATE.md`
- Metadata: `/projects/sessions/templates/SESSION-METADATA-TEMPLATE.md`

---



## Project Validation Gates

### Client Work: Rule of Three
**Gate:** Don't abstract or scale until you have 3 customers/use-cases.
- Build custom for customer #1
- Validate pattern with customer #2
- Abstract only when customer #3 needs it
- **Status:** Working well. Enforced consistently.

### Internal Projects: Ship-or-Park Rule
**Gate:** Internal projects get 2 design sessions max, then must ship v1 or park.

**Rules:**
1. **No features before v1** — Cannot add features to internal projects that haven't shipped v1
2. **2-session time-box** — After 2 sessions of design/iteration, must ship minimal v1 or consciously park
3. **Use-case required** — Must have at least 1 real use-case before building (even for internal tools)
4. **Park explicitly** — Parking is valid. Document why and move on. Don't let it drift.

**Examples:**
- ✅ brain-bot /briefing: Wait until brain-bot v1 ships, THEN add as v2 feature
- ✅ brain-bot v1: 3 sessions already. Decision: ship minimal or park. No more design.
- ❌ Adding features to unshipped project = scope creep
- ❌ 4th design session without shipping = anti-pattern

**Rationale:** Internal projects have no customer pressure. Without gates, they iterate forever. The gate forces a decision: is this valuable enough to ship, or should we park it?

**Parked Features (brain-bot):**
- `/briefing` command — Add after v1 ships
- Craft integration — Add after v1 ships
- Voice note auto-extraction — Add after v1 ships

---

## Strategy & Research Patterns

### Validate Assumptions First
Before building any strategy, validate assumptions against real context. This is a general rule — not Nigeria-specific (though Nigeria has more contradictions, making it harder).

**Questions to ask FIRST:**
- "What constraints do you have?" (access, network, resources)
- "How do deals actually close here?" (not theoretical, actual examples)
- "What has worked before?" (proven patterns > untested frameworks)

**Why this matters:** Generic playbooks often fail in specific contexts. Always stress-test assumptions.

**Pattern:** Real example (Fisayo call → 7 referrals in 2 min) > theoretical framework (10-page strategy doc)

---

### Data-Driven Pivots
Gather baseline metrics before building. Pivot based on data, not intuition.

**Pattern:**
1. Measure current state (reply rates, conversion, time spent)
2. Test hypothesis with small sample
3. Pivot if data shows different direction
4. Document the pivot decision with numbers

**Example:** MEP consultants reply at 3.7x rate vs procurement (25% vs 6.8%) → Pivot away from procurement targeting.

---

### Parallel Agents for Research
Run 5-7 agents simultaneously for comprehensive audits/analysis.

**When to use:**
- Auditing multiple systems (CLAUDE.md, indexes, file structure)
- Research across different sources
- Analysis requiring multiple perspectives

**Pattern (C1-C7):**
```
C1: Audit X
C2: Audit Y
C3: Audit Z
... run in parallel ...
→ Consolidate into single expandable HTML view
```

**Example:** Feb 3 infrastructure audit ran 7 agents simultaneously, discovered 6 stale rules, 5 missing indexes in one session.

---

### Expand Before Build
Show assumptions before executing. User corrects with WHY, then build.

**Pattern:**
1. State assumptions explicitly
2. User corrects → may reveal task is bigger than thought
3. Claude can help calculate risk (size, files touched, what could go wrong)
4. Build after confirmation

**Threshold for expanding:**
- Size of change
- Risk of getting it wrong
- Number of files touched

**Why:** Avoids building wrong thing then iterating. Corrections captured become future rules.

---

### Momentum Over Perfection
Sustainable bursts > intensive sprints. Systems catch errors. Keep moving.

**Pattern:**
- Fix systems mid-session when problems reveal themselves
- Don't pause for perfection; iterate
- Document anti-patterns as they emerge
- Session packets preserve context even if rushed

**Why:** "Running so fast, going to drop stuff" is OK if systems catch dropped items. Feb 1 infrastructure day caught what Jan 21-31 sprint missed.

---

### Voice-First & ASCII-First
User is voice-first. Don't design workflows requiring typed commands.

**Rules:**
- Don't tell user to CD anywhere
- Don't require remembering CLI commands
- Use natural language triggers ("show tasks" not "/tm list")
- Output in ASCII for terminal, HTML for browser
- Open files proactively (don't assume user will navigate)

**Pattern:** TaskMaster CLI → Tasks HUD (same data.js pattern, voice triggers)

---

## Context Injection

### /briefing Command
Use `/briefing` at session start to get a momentum-aware context injection:
- Reads HUD state (doNext, active tracks, waiting items, wins)
- Reads recent session packets (more than just last 3 — enough for full context)
- Pulls from Telegram group (forwarded messages in last 24h)
- Outputs temporal briefing with ages and staleness indicators
- Flags aging items (>48h waiting, >5d active)

**Goal:** Quick snapshot of everything going on. User shouldn't have to repeat context.

### HUD as Current State
The HUD at `/projects/hud/` is the canonical "current state" snapshot:
- `v4-data.js` — All state data (CANONICAL — all skills update THIS file)
- `v4.html` — Renders the HUD (open this, not index.html)
- Update HUD when priorities change, not just session packets

### Tasks HUD
Task management using same HUD pattern. Voice-first triggers.

**Location:** `/projects/tasks/`
- `data.js` — Task data (id, title, description, status, priority, project, dependencies)
- `index.html` — Visual dashboard with stats, next task, task list

**Voice Triggers (natural language):**
- "tasks" or "show tasks" → Open tasks HUD in browser
- "next task" → Read data.js, report highest-priority pending task
- "expand task 3" → Generate subtasks, show assumptions for correction
- "done with task 1" → Update status in data.js, refresh HUD
- "add task: [idea]" → Add new task to data.js

**Priority Order:**
1. High priority, no unmet dependencies → work first
2. High priority, dependencies met → work next
3. Medium/Low priority follows same pattern

**Update Pattern:** Same as main HUD — edit data.js only, never regenerate HTML.

---

## Video Processing (video-kb)

**Location:** `/projects/learn/video-kb/`

Process YouTube videos to extract knowledge, patterns, and key frames.

**Workflow:**
```bash
# 1. Download video (android client workaround for YouTube)
yt-dlp --extractor-args "youtube:player_client=android" <URL> -o video.mp4

# 2. Extract frames (intervals + scene changes)
./extract-frames.sh video.mp4 output-dir 20

# 3. Analyze with Claude (transcript + frames)
# 4. Delete source video, keep .md + frames
```

**Structure:**
```
learn/video-kb/
├── bookmarks/    - curated video analyses (.md + frames)
├── patterns/     - extracted reusable patterns
├── debug/        - debug session recordings (future)
├── meetings/     - meeting/onboarding recordings (future)
└── demos/        - tutorial/demo breakdowns (future)
```

**Cost:** ~15-20k tokens per video (cheap)
**Storage:** Source videos deleted; keep .md analysis + key frames (~2-5MB each)

**Tools:**
- `extract-frames.sh` — ffmpeg-based frame extraction at intervals + scene changes
- yt-dlp — YouTube download with workarounds
- Local whisper — transcription (if needed)

**Naming:** `YYYY-MM-DD-video-title.md` for analyses, `YYYY-MM-DD-video-title/` for frame collections

---

## Custom Skills & Commands

### Two Systems

**Project Commands** (working directory specific):
```
~/trellomcp/trello-mcp/.claude/commands/
├── briefing.md
├── session-update.md
└── tm.md
```
- Flat `.md` files (no directory wrapper)
- Only available when in this project
- `/briefing`, `/session-update`, `/tm` work here

**Global Skills** (available everywhere):
```
~/.claude/skills/
├── ep/
│   └── SKILL.md
└── session-update/
    └── SKILL.md
```
- Must be `skill-name/SKILL.md` structure
- Available in all projects
- `/ep`, `/session-update` work globally

**Common mistake:** Creating `skill-name.md` directly in `~/.claude/skills/` won't work. Must be `skill-name/SKILL.md`.

**Frontmatter (both systems):**
```yaml
---
name: skill-name
description: "What it does"
---
```

**After creating:** Restart Claude Code for autocomplete.

---

## Notion Integration

### MCP Workaround (API Direct Access)

**Issue:** Notion MCP has JSON parsing bug when updating page properties via `mcp__notion__API-patch-page`. Treats JSON properties as individual character indices.

**Workaround:** Use direct Notion API calls via curl + JSON files.

**Pattern:**
1. Create JSON file with update payload in scratchpad
2. Use curl with Notion token from `.mcp.json`
3. Read token: `NOTION_TOKEN` from `/projects/.mcp.json`

**Example:**
```bash
# 1. Create JSON payload file
cat > /tmp/notion-update.json <<EOF
{
  "properties": {
    "Field Name": {
      "rich_text": [{"text": {"content": "Update text here"}}]
    }
  }
}
EOF

# 2. Extract token from .mcp.json
TOKEN=$(grep -A 3 '"notion"' .mcp.json | grep NOTION_TOKEN | cut -d'"' -f4)

# 3. Update via curl
curl -X PATCH "https://api.notion.com/v1/pages/PAGE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Notion-Version: 2022-06-28" \
  -d @/tmp/notion-update.json
```

**When to use:**
- Updating Notion database properties (Intel Gathered, Next Action, Traffic Light)
- MCP patch-page calls fail with validation errors
- Need to update rich_text or select fields

**Reference:** Feb 6, 2026 - Mario Abugo profile update (DSG profiling database)

---

## Course Knowledge Bases

### EP AI Frontrunners Course

**Location:** `/projects/learn/courses/ep-ai-frontrunners/`

**Skill:** `/ep` - Learning partner for applying EP frameworks to current work

**Coverage:** 98 lessons across 7 modules
- Module 1: Foundational Knowledge (LLMs, context engineering)
- Module 2: Product Research (problem-solution-fit, market validation, ecosystem thinking)
- Module 3: Product Creation (infoproducts, agency positioning, scaling)
- Module 4: Building Sales Assets (copywriting, landing pages, VSL)
- Module 5: AI Creative (scriptwriting, image/video generation)
- Module 6: AI Distribution (YouTube, Instagram, Twitter/X, TikTok)
- Module 7: Affiliate Marketing (platform tactics, scaling)

**Structure:**
```
ep-ai-frontrunners/
├── modules/
│   ├── modules/ (7 module markdown files)
│   └── gpt-assets/
│       ├── COURSE-INDEX.json (searchable by topic tags)
│       ├── lesson-prompts/ (35 interactive lessons - 36% of content)
│       ├── skills/ (TSL, VSL, skill-creator)
│       └── swipe-files/ (X, YouTube, Lander+VSL)
├── skill-design/ (system prompt, design notes, data sources)
└── STUDENT-PROFILE.md (learning style, work context, preferences)
```

**Index:** `gpt-assets/COURSE-INDEX.json` — Searchable by tags like "market-validation", "pricing-strategy", "youtube-seo"

**Progressive Summarization:**
- Start with COURSE-INDEX summaries (cheap)
- Read full lessons only when genuinely needed (high-stakes decisions)
- 36% of lessons have interactive prompts for hands-on application

**Usage Pattern:**
- Invoke `/ep` when validating ideas, researching markets, positioning offers, planning distribution, evaluating pricing
- Skill reads HUD first to understand current work context
- Applies EP frameworks to actual work (not generic advice)
- Surfaces non-obvious insights and contradictions
- Shows tradeoffs with options (not prescriptive)

---

## Stream Management (Session Map)

### Session Map
**Location:** `.cache/session-map-YYYY-MM-DD.md`
**Script:** `.bin/stream` — orientation & management tool
**Status line:** `~/.claude/statusline.sh` reads the map and displays stream pills at bottom of terminal.

**Stream statuses:** DONE, ACTIVE, PARKED, ORPHANED, NOT STARTED, TODO

### Stream Format (per stream)
```
### Stream Name [STATUS]
tags: comma, separated, keywords, for, fuzzy, recall
tier: active-work | quick
last-touched: YYYY-MM-DD
- outputs:
  - path/to/file (Mon DD)
- resume:
  - read: path/to/read/first
  - do: Next action in plain English
  - context: One sentence of state
```

### Map Sections
```
## ACTIVE WORK     — long-lived streams (deals, builds, projects)
## PARKED          — intentionally paused, will return
## ORPHANED        — fell off, needs triage
## QUICK           — done in <15 min (voice notes, quick fixes)
## RAISED          — mentioned but not resolved (micro-opens)
```

### Script Usage
```bash
.bin/stream                  # Dashboard — orient at any time of day
.bin/stream find <query>     # Fuzzy search tags + names (case-insensitive)
.bin/stream stale            # Check file freshness vs map dates
.bin/stream resume <query>   # Paste-ready pickup block
.bin/stream unfinished       # Orphaned + parked >3 days
```

### Rules (MANDATORY)

1. **Agent output rescue:** When ANY agent completes → copy its output to `.cache/agent-outputs/YYYY-MM-DD-description.md`. Volatile /tmp outputs expire. This saves them permanently.

2. **Topic switch → update map:** When the conversation changes topic or user says section break markers (`/////`, `cc`, "park this", "switch to X") → update the session map file. Change the active stream's status and set the new stream as ACTIVE.

3. **Session start → read or create map:** At the start of any session, check if today's session map exists. If yes, read it and note orphaned/parked streams. If no, create one from context.

4. **Append, don't overwrite:** Multiple sessions on the same day APPEND streams to the existing map. Never overwrite an earlier session's streams.

5. **Run `stream stale` before resuming parked streams:** Check file freshness before picking up any stream that's been parked >1 day. Files may have been modified by another session or terminal.

6. **Two-terminal model for interrupts:** When an interrupt arrives (voice note, Telegram message), open a SECOND terminal to handle it — don't park the current stream. The session map bridges both terminals. Quick tasks in terminal B auto-add to the map as QUICK tier.

7. **Tags are mandatory:** Every stream gets tags at creation. Include: project key, people, topic keywords. Tags enable fuzzy recall ("that generator thing" → finds via tag "generators").

8. **Structured resume is mandatory:** Every stream's resume block must have `read:`, `do:`, `context:`. No free-text resume blocks.

9. **RAISED = micro-opens.** When something is mentioned but not resolved, add to `## RAISED` in session map. **RAISED does NOT appear in statusline** — only visible via `stream` dashboard.

10. **RAISED lifecycle: Weight - Friction = Pull.**
    - **Weight** = why it matters (pain/loss, keeps coming up, external trigger/deadline)
    - **Friction** = what blocks starting (scope fog, quality doubt, dependency)
    - **Pull** = weight minus friction. When pull > threshold, you start.
    - Items gain weight through exposure. Friction reduces through natural inflow (research, connecting, sharing during work).

11. **Three lifecycle rules:**
    - **Notice → note it.** One line. That's a seed.
    - **Interact naturally → it shapes itself.** Research, connect, remember, share during normal work. Don't schedule "shaping time."
    - **Feel pull → do it.** Highest pull = what you work on. If nothing pulls, nothing's ready.

12. **Readiness markers:**
    - `seed` — idea exists, weight and friction unknown
    - `shaped` — weight understood, friction being reduced through inflow
    - `ready` — pull > threshold (weight high enough, friction low enough)
    - **Skip:** high weight + low friction = seed → doing directly

13. **RAISED cap = 5.** More than 5 → forced triage. Kill weakest or merge related seeds. Overflow → parked in session packets, not deleted.

14. **Seeds merge.** Related seeds combine into one shaped item. If you can't write one line covering both, they're separate.

15. **Rot prevention (system, not rule).** During /session-update, any RAISED seed >7 days untouched → surfaced. Kill or keep (one word). If you can't say why to keep → kill.

16. **Compaction-survival sweep (MANDATORY after context continuation).** When a session continues from a compacted context:
    - Read the session map IMMEDIATELY (before doing anything else).
    - Cross-reference each ACTIVE/PARKED stream's `do:` line against the compaction summary's "Pending Tasks" and "Current Work" sections.
    - Any stream whose next action was COMPLETED in the compacted session → update status + resume block.
    - Any stream whose next action CHANGED (decision made, tool swapped, approach pivoted) → update resume block with new reality.
    - Update `Last updated:` timestamp with note `(post-compaction audit)`.
    - This takes <2 minutes and prevents the #1 compaction failure: stale resume blocks that tell you to do things already done.

### Integration with Existing Skills
- `/checkpoint` → regenerate session map before saving checkpoint
- `/session-update` → regenerate map + scan `.cache/agent-outputs/` for unreferenced orphans + push streams to HUD v4-data.js + **surface RAISED seeds >7 days for triage**
- `/briefing` → read session map, surface orphaned and parked streams at top of briefing
- `/recursive` → reduces friction on shaped items (stress test = friction reduction)
- **Context continuation** → rule 16 fires: compaction-survival sweep on session map
- **Visual reference:** `open .bin/RAISED-LIFECYCLE.html` for quick recall

### Net Negative Test (ongoing)
If user constantly corrects stream names or tags → the system is overhead, not leverage. Flag it and simplify.

---

## Session Close Down Workflow

### Tab Triage Pattern
Use when ending a session with open browser tabs. Trigger: user says "close down", "triage tabs", or end of long session.

**Steps:**
1. **Inventory** — User provides tab URLs (paste list or screenshot)
2. **Categorize** — Group by project tag: `[HB]`, `[GAS]`, `[RETAIL]`, `[BOT]`, `[RESEARCH]`, `[DISTRACTION]`
3. **Relate** — Connect to current work tracks (from HUD or session context)
4. **Decide** — For each tab:
   - `KEEP OPEN` — Active work, needs attention today
   - `CAPTURE + CLOSE` — Useful reference, save insight then close
   - `CLOSE` — Already captured, duplicate, or distraction

**Output Format:**
```
## Tab Triage — YYYY-MM-DD

### KEEP OPEN (X)
- [Tab title](url) — [PROJECT] reason

### CAPTURE + CLOSE (X)
- [Tab title](url) — [PROJECT]
  > Key insight to preserve

### CLOSE (X)
- [Tab title](url) — reason
```

**After Triage:**
- Write captures to Craft daily note (mobile-accessible)
- Optionally create session packet if significant decisions made

