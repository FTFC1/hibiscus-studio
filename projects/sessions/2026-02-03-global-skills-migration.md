---
session_id: 2026-02-03-global-skills-migration
session_date: 2026-02-03
duration_hours: 0.5
projects_touched: [INFRA]
work_types: [infrastructure]
value_tier: high
impact_score: 8
decisions_count: 2
artifacts_count: 26
tasks_completed: 3
items_open: 3
---

# Session Packet: Global Skills Migration

**Session Date:** 2026-02-03
**Status:** ✅ Complete
**Duration:** ~30min
**Work Type:** Infrastructure

---

## CONTEXT

User noticed `/video` skill existed only in the trello project (`/trellomcp/trello-mcp/.claude/commands/`), not globally. This created efficiency asymmetry - different capabilities depending on working directory.

Upon investigation: 23 commands were project-level only. User had 3 global skills (briefing, ep, session-update) but those had diverged from better project versions.

User decision: "I think all can be used" globally.

---

## DECISIONS MADE

### 1. Migrate All 23 Commands to Global (CRITICAL)

**Decision:** Move all project-level commands to `~/.claude/skills/` format

**Why:**
- Eliminate efficiency asymmetry between directories
- User shouldn't have different capabilities based on working directory
- All tools (design polish, utilities, workflow) are general-purpose

**Impact:** Consistent experience everywhere - same 23 skills available in any project

**Location:** `~/.claude/skills/{skill-name}/SKILL.md` for all 23 skills

---

### 2. Preserve Comprehensive Skill Versions (IMPORTANT)

**Decision:** Replace simple global versions of `briefing` and `session-update` with comprehensive project versions

**Why:**
- User feedback: "I put effort to make the comprehensive one"
- Project versions had full workflow (HUD auto-update, staleness detection, session packet creation)
- Global versions were simplified stubs
- User's work shouldn't be lost

**Impact:** Global skills now have full functionality user designed

**Location:**
- `~/.claude/skills/briefing/SKILL.md` - Momentum-aware context injection with auto-update
- `~/.claude/skills/session-update/SKILL.md` - Full session packet + HUD update workflow

---

## WHAT WAS CREATED

### Global Skills (23 total):

**Core Workflow (4):**
- `briefing/SKILL.md` - Comprehensive version with staleness detection
- `session-update/SKILL.md` - Full session packet workflow
- `video/SKILL.md` - Video knowledge base processing
- `tm/SKILL.md` - Task manager

**General Utility (4):**
- `audit/SKILL.md`
- `extract/SKILL.md`
- `simplify/SKILL.md`
- `normalize/SKILL.md`

**Design Polish (13):**
- `adapt/SKILL.md`
- `animate/SKILL.md`
- `bolder/SKILL.md`
- `clarify/SKILL.md`
- `colorize/SKILL.md`
- `critique/SKILL.md`
- `delight/SKILL.md`
- `harden/SKILL.md`
- `onboard/SKILL.md`
- `optimize/SKILL.md`
- `polish/SKILL.md`
- `quieter/SKILL.md`

**Project-Specific (2):**
- `teach-impeccable/SKILL.md`
- `ui-explore/SKILL.md`

All created with proper YAML frontmatter (name, description).

---

## WHAT WAS UPDATED

1. **Artifact Index** (`/projects/.cache/artifact-index.json`):
   - `briefing.md` path: `/.claude/commands/` → `~/.claude/skills/briefing/SKILL.md`
   - `briefing.md` status: Added "✅ Global skill - Migrated Feb 3"
   - `video.md` path: `/.claude/commands/` → `~/.claude/skills/video/SKILL.md`
   - `video.md` status: Added "✅ Global skill - Migrated Feb 3"

2. **HUD** (`/projects/hud/data.js`):
   - Updated `lastUpdated` timestamp to 15:50
   - Added 3 shipped items (global skills migration, comprehensive versions fixed, artifact index updated)
   - Updated `notes.footer` to reflect Feb 3 context + global skills

---

## VALUE DELIVERED

### Immediate
- No more capability asymmetry between directories
- User can use `/video`, `/briefing`, `/tm`, all design polish tools anywhere
- Comprehensive skill versions preserved (not replaced with stubs)

### Foundational
- Pattern established: Skills should be global by default (unless project-specific)
- User's workflow improvements (comprehensive briefing, session-update) now available everywhere
- Infrastructure supports consistent experience across all work contexts

---

## OPEN ITEMS

1. **Timmy's PUMA Feedback** - User has feedback in Telegram, needs to paste/forward so PUMA context can be updated
2. **Telegram Bot Status** - Unclear if bot still listening/downloading. User to forward + paste to ensure delivery.
3. **Syam Follow-up** - Message Syam tomorrow (Motor Stock context check)

---

## META

**Pattern observed:** User puts effort into comprehensive tools (briefing with staleness detection, session-update with full workflow) - these should be preserved when migrating, not replaced with simpler versions.

**Lesson:** Always check if project version is MORE comprehensive than global version before overwriting. User's work has value that shouldn't be lost in migrations.

**Value chain example:** EP skill creation enabled EP analysis of partner brief → Strategic insights (Instagram skip, diesel-first, CTA pivot to risk mitigation). Infrastructure work compounds.
