# Spike: Claude Code Programmatic Invocation

**Date:** Feb 13, 2026 | **For:** Telegram bot → Claude Code bridge

## Answer: THREE options, one existing project

### Option 1: Claude Agent SDK (RECOMMENDED)
```bash
pip install claude-agent-sdk
```
- Official Python SDK wrapping Claude Code CLI
- Session continuity across messages
- Loads CLAUDE.md, all tools (Read/Write/Bash/Grep/Glob)
- Async Python support (fits Telegram bot)
- Uses Max subscription (not API billing)

### Option 2: CLI Subprocess (SIMPLER)
```bash
claude -p "message" --output-format json --allowedTools "Read,Write,Bash,Grep,Glob"
```
- Each invocation = fresh session (or `--resume session_id` for continuity)
- JSON output parseable
- CLAUDE.md loaded from working directory
- Skills/commands NOT available (describe task in natural language instead)

### Option 3: Existing Project — claude-code-telegram
**github.com/RichardAtCT/claude-code-telegram**
- ALREADY BUILT. Telegram bot → Claude Code bridge.
- Supports both SDK and CLI modes
- SQLite for session persistence per project
- Rate limiting, cost caps, file system sandbox
- `/cd my-project`, `/new`, `/continue`, `/end` commands
- Study or fork this.

## 4GB RAM Risk (CRITICAL)

| Risk | Detail |
|------|--------|
| Memory leak on Linux | Known issue #20777 — RAM can grow to 20GB+ |
| CPU thrashing | Issue #18280 — 50-80% sustained CPU |
| Node.js spawns ~200 processes | For complex operations |

**Mitigations:**
```bash
export NODE_OPTIONS="--max-old-space-size=2048"
export MALLOC_ARENA_MAX=2
```
- Use per-request `query()` not long-lived sessions
- Set `--max-turns 5` and `--max-budget-usd 2.00`
- If leaks persist: upgrade to CX33 (8GB, $7.49/mo)

## Key Constraints

- Skills (/briefing, /commit etc) NOT available in -p mode
  → Describe tasks in natural language instead
- Telegram message limit = 4096 chars → truncate long responses
- Session persistence fills disk → use --no-session-persistence or cleanup cron

## Architecture

```
Telegram → Bot (python) → Claude Agent SDK → Claude Code
                              ↓                  ↓
                         session mgmt       repo + CLAUDE.md
                         (SQLite)           + tools + skills context
```
