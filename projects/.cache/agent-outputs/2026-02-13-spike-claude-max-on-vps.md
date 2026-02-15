# Spike: Claude Code Max on Remote VPS

**Date:** Feb 13, 2026 | **Confidence:** HIGH on all questions

## Answer: YES, it works.

Claude Max subscription is **account-bound, not device-bound**. Claude Code runs on VPS using your Max plan. $200/mo covers what would cost $3,650+/mo on API billing.

## Authentication (the only tricky part)

**Problem:** `claude /login` opens a browser. VPS has no browser. Cloudflare blocks OAuth on datacenter IPs (Hetzner confirmed affected).

**Solution: Credential Transfer (Option B)**
1. You're already authenticated on your Mac (`claude /login` done)
2. SCP the auth file to the VPS:
   ```
   scp ~/.config/claude-code/auth.json root@46.225.137.63:~/.config/claude-code/auth.json
   ```
3. Claude Code on VPS uses your Max subscription. Done.

**CRITICAL:** Do NOT set `ANTHROPIC_API_KEY` env var on VPS. This overrides subscription auth and bills per-token instead.

## Installation

```bash
curl -fsSL https://claude.ai/install.sh | bash
source ~/.bashrc
```

One command. No dependencies. Auto-updates.

## Known Blockers

| Blocker | Severity | Fix |
|---------|----------|-----|
| Cloudflare blocks OAuth on VPS IPs | HIGH | Use credential transfer (Option B) |
| Token expires periodically | LOW | Re-SCP auth.json when it happens |
| `ANTHROPIC_API_KEY` overrides subscription | MEDIUM | Don't set it |

## Sources
- Claude Help Center: Using Claude Code with Pro/Max plan
- Claude Code Docs: Authentication, Setup
- GitHub Issue #7100: Headless auth support requested
- GitHub Issue #21678: OAuth fails on Hetzner specifically
- Medium (Lexy EYN, Feb 2026): How to run Claude Code on VPS
