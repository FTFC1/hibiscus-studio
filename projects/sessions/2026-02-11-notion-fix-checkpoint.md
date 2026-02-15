---
session_id: 2026-02-11-notion-fix
session_date: 2026-02-11
status: checkpoint
projects_touched: [INFRA, Aloe Labs]
work_types: [infrastructure, research, debugging]
context_remaining: ~10%
pickup_priority: Test post-page with hosted MCP using correct parameter format (children as string array)
---

# Checkpoint: Notion MCP Fix + Aloe Labs DB Cleanup

**Date:** 2026-02-11
**Status:** 🔄 Checkpoint (context window low)
**Context Remaining:** ~10%

---

## WHERE WE ARE

Fixing Notion page creation (post-page). Hosted MCP is set up and reads/queries WORK. Just discovered the **critical schema insight** from loading the post-page tool: `children` parameter takes `items: {"type": "string"}` — each block must be passed as a **JSON string**, not an object. The `parent` param is properly typed as an object. Haven't tested yet — user called /checkpoint before I could try.

---

## DECISIONS MADE (confirmed)

1. **Hosted Notion MCP is the path** — `claude mcp add --transport http --scope user notion https://mcp.notion.com/mcp` (already run, in ~/.claude.json)
2. **Notion MCP exists at TWO levels** — user scope (mcpServers at bottom of ~/.claude.json) AND project scope (projects > trellomcp path > mcpServers > notion). Both point to same hosted URL.
3. **TG bot research parked** — saved to `ventures/tg-capture-bot-research.md`, needs Notion deposit when post-page works
4. **DSG not DSH** — fixed in MEMORY.md
5. **Pipeline outreach = user's real priority today** (Wednesday)
6. **Puma demo Thursday** — demo site works, Timi has link, just "what Nicholas shows" needs prep

---

## DECISIONS PENDING (need user yes/no)

- [ ] Which "Not started" cards in Aloe Labs Work DB are already done? (35 cards queried, cleanup planned)
- [ ] Should TRACK cards in Aloe Labs DB be a separate status/type, or just a naming convention?

---

## ITEMS EXTRACTED BUT NOT ACTIONED

1. **TG bot research → Notion deposit** — local file ready at `ventures/tg-capture-bot-research.md`, JSON payload at `/tmp/notion-tg-bot-research.json`. Blocked on post-page fix.
2. **2 Process voice note items → Notion** — "Clean Aloe Labs dashboard" (MEDIUM, INFRA) + "Logic/tautology mapping" (LIGHT, INFRA). From previous session.
3. **Aloe Labs Work DB cleanup** — 35 cards: 13 "In progress" (6 are TRACK cards), 22 "Not started" (9 untagged). Need to mark done items, assign project tags, bundle into tracks.
4. **Puma demo prep** — "what do I show" part still needs doing for Thursday
5. **On Our Own brand plan** — approved, waiting on client response (PRL)

---

## FILES CREATED THIS SESSION

- `/Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/ventures/tg-capture-bot-research.md` — TG bot research (full synthesis of 6 repos)
- `/tmp/notion-tg-bot-research.json` — Notion API payload for TG bot research page

## FILES MODIFIED THIS SESSION

- `/Users/nicholasfeyintolafolarin-coker/.claude/projects/-Users-nicholasfeyintolafolarin-coker-trellomcp-trello-mcp-projects/memory/MEMORY.md` — Fixed DSG naming, added /capture + /process-convo skills, added capture/enrich/cockpit architecture notes
- `/Users/nicholasfeyintolafolarin-coker/.claude.json` — Notion hosted MCP added at user scope (via `claude mcp add`)

---

## PICKUP INSTRUCTIONS

### Read These First
- This checkpoint file
- `/Users/nicholasfeyintolafolarin-coker/.claude/projects/-Users-nicholasfeyintolafolarin-coker-trellomcp-trello-mcp-projects/memory/MEMORY.md`
- `/Users/nicholasfeyintolafolarin-coker/.claude/projects/-Users-nicholasfeyintolafolarin-coker-trellomcp-trello-mcp-projects/memory/notion.md`

### Then Do This

1. **TEST post-page with correct format.** The hosted MCP schema shows:
   - `parent`: object `{"database_id": "2fc70b64-55cb-8071-88e2-d7d751027eb9"}` (should work as object)
   - `properties`: object (should work)
   - `children`: array of **strings** (each block is a JSON string, NOT an object)

   Try creating a test page:
   ```
   parent: {"database_id": "2fc70b64-55cb-8071-88e2-d7d751027eb9"}
   properties: {"Name": {"title": [{"text": {"content": "TEST PAGE — delete me"}}]}, "Status": {"status": {"name": "Not started"}}}
   children: ["{\"type\":\"paragraph\",\"paragraph\":{\"rich_text\":[{\"text\":{\"content\":\"Test content\"}}]}}"]
   ```

   If that works → deposit TG bot research from `/tmp/notion-tg-bot-research.json`

2. **If post-page still broken:** Find Notion API token. It's NOT in `.mcp.json` (only Craft there). The hosted MCP uses OAuth — token might be stored in Claude Code's internal OAuth cache. Try:
   - `ls ~/.claude/oauth/` or similar
   - Check if there's a way to extract the token
   - Fallback: create a Notion integration manually at notion.so/my-integrations, get API key, use curl

3. **After Notion works:** Deposit TG bot research + 2 voice note items + start Aloe Labs DB cleanup

4. **Puma demo prep** — Thursday meeting. Demo site: ftfc1.github.io/puma-training-demo/course-outline.html. Need "what Nicholas shows" plan.

### User Needs To Answer
- Which Aloe Labs Work DB "Not started" cards are already done?
- Any specific cards to prioritize in the DB cleanup?

---

## RAW CONTEXT (for next session)

### Aloe Labs Work DB
- **DB ID:** `2fc70b6455cb807188e2d7d751027eb9`
- **DataSource ID:** `2fc70b6455cb80de9427000be8501e25`
- **Properties:** Name (title), Project (multi_select: Aloe Labs, HB Studio, INFRA, FORJE, Misc, MK), Status (status: Not started / In progress / Done)
- **35 cards total:** 13 "In progress" (6 TRACK cards), 22 "Not started" (9 untagged)
- **TRACK cards (In progress):** TRACK: Capture Pipeline, TRACK: Aloe Labs Identity, TRACK: HB Studio Backend, TRACK: Daily Operations, TRACK: Pipeline Systems, TRACK: FORJE/Puma

### Post-Page Schema (KEY DISCOVERY)
The hosted MCP post-page tool has these parameter types:
- `parent`: oneOf [pageIdParentRequest, dataSourceIdParentRequest, generic] — these are OBJECTS
- `properties`: object with additionalProperties
- `children`: array of **STRING** items (not objects!) — each block must be JSON.stringify'd
- `icon`: string with format "json"
- `cover`: string with format "json"

This means the previous error (parent stringified) may have been the OLD MCP config, not this hosted one. The children-as-strings format is the key difference to test.

### Notion MCP Config Locations
1. **User scope:** `~/.claude.json` → `mcpServers.notion` (hosted HTTP)
2. **Project scope:** `~/.claude.json` → `projects["/Users/.../trellomcp/trello-mcp"].mcpServers.notion` (also hosted HTTP)
3. **Old project .mcp.json:** may still exist at project root — check and remove if conflicting

### Files Ready to Deposit
- `/tmp/notion-tg-bot-research.json` — Full JSON payload with children blocks for TG bot research page
- `ventures/tg-capture-bot-research.md` — Markdown version (backup)
