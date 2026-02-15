# Session & Packet Templates

## Quick Start

**For a new session:**
1. Copy `SESSION-TEMPLATE.md` to your sprint review folder
2. Rename to `SESSION-{date}-{type}.md`
3. Create the 6 session metadata files (INDEX.csv, ARTIFACTS.md, etc.)
4. As you work, create packets for each project using `SESSION-PACKET-TEMPLATE.md`

**For project work within a session:**
1. Copy `SESSION-PACKET-TEMPLATE.md`
2. Rename to `session-packet-{date}-{project}-{topic}.md`
3. Fill in YAML frontmatter with session details
4. Fill in sections (delete unused ones)
5. Link to parent session in `parent_session` field

---

## Templates Available

| Template | Purpose | When to Use |
|----------|---------|-------------|
| `SESSION-TEMPLATE.md` | Session-level documentation | Every session (meta wrapper) |
| `SESSION-PACKET-TEMPLATE.md` | Project-specific deliverable | Each project worked on in session |

---

## Hierarchy Reminder

```
Session (one sitting, 1-3 hours)
├── Session Metadata (6 files: INDEX.csv, ARTIFACTS.md, etc.)
└── Session Packets (1 per project/topic)
    ├── [HB] Packet
    ├── [PUMA] Packet
    └── [INFRA] Packet
```

**Session = Container** (metadata about the sitting)
**Packets = Contents** (deliverables for specific projects)

---

## YAML Fields Reference

### Session Fields

```yaml
session_id: YYYY-MM-DD-short-name
session_date: YYYY-MM-DD
duration_hours: 2.5
projects_touched: [HB, PUMA]
work_types: [implementation, research]
value_tier: high
impact_score: 8
decisions_count: 5
artifacts_count: 8
tasks_completed: 6
```

### Packet Fields

```yaml
session_id: YYYY-MM-DD-short-name
parent_session: YYYY-MM-DD-parent
projects: [HB]
stakeholders: []
work_type: implementation
value_tier: high
decisions_made: 3
items_open: 1
impact_score: 7
```

---

## Work Types

- `implementation` - Building features, writing code
- `research` - Investigation, exploration, learning
- `review` - Sprint reviews, retrospectives, analysis
- `infrastructure` - Tooling, processes, standards
- `stakeholder` - Meetings, communication, approvals
- `correction` - Bug fixes, error resolution

---

## Value Tiers

- `critical` - Blocking work, stakeholder commitments
- `high` - Strategic decisions, major deliverables
- `medium` - Tactical execution, documentation
- `low` - Cleanup, organizational, nice-to-have

---

## Impact Scores (1-10)

- **9-10:** Strategic decisions, major breakthroughs
- **7-8:** Solid deliverables, stakeholder value
- **4-6:** Routine work, necessary but not transformative
- **1-3:** Cleanup, minor fixes

**Use for:** Filtering when reviewing month/quarter - "Show me all 8+ impact work"

---

## Examples

See `/projects/00_Inbox/sprint-review-jan-21-31/` for real examples:
- `SESSION-2026-01-31-*.md` (session metadata files)
- `session-packet-2026-01-31-formalize-hierarchy.md` (packet example)
- `session-packet-2026-01-31-puma-localization.md` (would exist if created)

---

**Last Updated:** 2026-01-31
**Version:** 1.0
