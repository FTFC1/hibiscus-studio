# Brain Dump Extraction — Feb 13, 2026
## TM Command + Hetzner Infrastructure + Inspiration Catalog

**Sources:** 8 tweets, 3 videos (binary), 2 images, 1 voice note, 1 quoted post, prior session files
**Processed via:** /recursive verify (5-pass) + /process-convo

---

## KEY UPDATES (Feb 13)

1. **Hetzner ID verification DONE** — blocker from Feb 12 resolved
2. **Claude Code Max 20x credits active** (subscription, not API)
3. **/tm is NOT USED** — built but never adopted. Not "upgrade" but "make worth using"
4. **"Poor man" principle adopted** — from @NickSpisak_: start cheap → validate → custom agent
5. **Framework Adaptation Principle** — every framework needs assumptions tested against YOUR reality

---

## TWEET CATALOG (fetched via vxtwitter API)

### T1: @jumperz — Auto-Learning Discord Pipeline
- **Date:** Feb 11, 2026 | **Likes:** 243
- **Content:** Drop article link → 8 Discord channels auto-process: tldr, apply-this, signals, next-steps, morning-reads, night-reads, archive
- **Scoring:** Rates 1-10 relevance to goals, routes to morning/night/archive
- **Connection:** = your /capture → /enrich → /cockpit architecture. Same pattern, Discord implementation.

### T2: @ephemeralapps (forest) — Dot iOS Agent
- **Date:** Feb 10, 2026 | **Likes:** 380
- **Content:** iOS agent that runs via native APIs, app intents, shortcuts. Learns new skills by generating shortcuts on the fly. Inspired by @openclaw.
- **Video:** 53s demo (binary, not viewable in terminal)
- **Connection:** Mobile capture from phone. "We'll do our own thing kind of, but based on this idea."

### T3: @NickSpisak_ — Mission Control (6 Agents)
- **Date:** Feb 9, 2026 | **Likes:** 206
- **Content:** "Built a mission control system with a 6 agent team led by Annie. Currently have 20 scheduled end to end workflows running as skills and tools. The system is local and secured via @Tailscale so I view updates when away from keyboard."
- **QRT:** His own article "The Only AI Agent Architecture Guide You'll Ever Need" (auth-walled)
- **Video:** 59s demo (binary)
- **Connection:** Mission Control vision. Tailscale for remote access. Agent-based task execution.

### T4: @leonabboud — Marketing Supercomputer
- **Date:** Feb 9, 2026 | **Likes:** 1,192
- **Content:** X article "I built a Marketing Supercomputer with Claude Code (Full Guide)". Preview: "I put the greatest marketing minds in history inside my laptop"
- **Connection:** Multi-persona agent team for marketing. Reference only (auth-walled).

### T5: @samuelrdt — Palantir Alternative
- **Date:** Feb 9, 2026 | **Likes:** 4,107
- **Content:** "Claude Opus 4.6 works so well. I asked for a Palantir alternative to view conflicts around the world using Claude Opus 4.6 on @capacityso. Took 15 minutes and 3 prompts."
- **Video:** 44s demo (binary)
- **Connection:** Ambition calibrator. Complex UIs buildable in 15 min with Opus 4.6.

### T6: @NickSpisak_ — "Poor Man's System" (ADOPTED PRINCIPLE)
- **Date:** Feb 5, 2026 | **Likes:** 55
- **Content:** "I figured out how to automate my life. Start with the 'poor man' system: Locked down google drive that @openclaw manages on its own dedicated account. Inside each folder is a progress google sheet and a full implementation plan in markdown. Set @openclaw cron schedules to run while you sleep. The progress files maintains state so openclaw doesn't research the same thing over and over again. Important: Only upgrade a process out of the 'poor man' version after you validated its value. Once validated make it a custom written agent with Pi, Claude Agent SDK, or your agent harness of choice."
- **Connection:** CORE PRINCIPLE. Same as Rule of Three, Framework Adaptation, bespoke→pattern→automate.

### T7: @rjs (Ryan Singer) — Shaping 0→1
- **Date:** Feb 7, 2026 | **Likes:** 853
- **Content:** X article "Shaping 0-1 with Claude Code" — shaping skills, tick project
- **Repos:** github.com/rjs/shaping-skills, github.com/rjs/tick
- **Connection:** Already integrated into /recursive build mode. "Veryyyy key this made recursive so much better."

### T8: @bc1beat — ClawRouter (Model Routing)
- **Date:** Feb 6, 2026
- **Content:** $4,660/month Anthropic bill — Opus as default for everything. Built ClawRouter: 14-dimension scoring, <1ms local routing. Simple→DeepSeek ($0.28/M), Basic→GPT-4o ($2.50), Debug→Sonnet ($3), Hard→Opus ($25). 400 GitHub stars in 48h.
- **Repo:** github.com/BlockRunAI/ClawRouter
- **Connection:** Model routing for API usage. Relevant when building on Hetzner with API calls. Also validates that "inefficiency trap" is real.

### Images
- **I1:** "The Inefficiency Trap" (@bc1beat) — 80% simple, 100% → most expensive model
- **I2:** SiteGPT Mission Control — 11 agents, 35 tasks, Kanban (INBOX→ASSIGNED→IN PROGRESS→REVIEW→DONE), live feed

---

## HETZNER PRIOR STATE (from session files)

**Plan:** technical/vps-setup-map.md (COMPLETE, 5 steps, ~3 hours)
**Server:** CX22, €4.85/mo, Ubuntu 22.04, Nuremberg, name: aloe-vps-01
**Goal:** Telegram capture bot → Notion → Claude Code
**Feb 12 Decision:** Start Codespaces (free), add Hetzner if ceiling hit
**Feb 13 Update:** ID verification DONE. Hetzner available now.
**Session packet:** session-packets/2026-02-12-mobile-claude-code-vps-plan.md

---

## /tm STATE

**Skill:** ~/.claude/skills/tm/SKILL.md (+ duplicate at .claude/commands/tm.md)
**Data:** tasks/tasks.json (5 tasks, all pending, stale since Feb 3)
**HUD:** tasks/data.js + tasks/index.html (task #1 done, rest pending, also stale)
**Usage:** NOT USED. Built but never adopted.
**Why it didn't stick:** Stale data, dual sources, HUD build queue superseded it, no habit loop.

---

## OPEN QUESTIONS (for reorientation)

1. Does the Feb 12 decision hold (Codespaces first) or does Hetzner become primary now?
2. What's the FIRST thing to run on Hetzner? (Telegram bot? Task manager? CRM?)
3. Should /tm become Mission Control or should we build something new?
4. Tailscale: YES — mesh VPN for secure remote access to Hetzner from phone/laptop.
5. "Poor man" principle: what would VALIDATION look like before upgrading any system?

---

## PATTERNS TO SAVE (for memory)

- **vxtwitter API** = reliable way to fetch tweet content without auth. Pattern: `https://api.vxtwitter.com/{user}/status/{id}`
- **Puppeteer + X = bad** — requires auth, hijacks browser, wastes time
- **X articles** = auth-walled, can't extract full text. Only get title + preview via vxtwitter.
- **"Poor man" principle** = already saved in MEMORY.md under Framework Adaptation
- **ClawRouter** = reference for model routing when API usage grows
