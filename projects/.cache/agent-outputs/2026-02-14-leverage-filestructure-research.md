# File Structure Research — What's Built vs Scaffolded vs Missing

**Date:** 2026-02-14
**Agent:** file-researcher
**Scope:** Full directory audit of /projects/

---

## DIRECTORY STATUS SUMMARY

```
DIRECTORY                  STATUS        LAST TOUCHED   NOTES
─────────────────────────  ────────────  ─────────────  ──────────────────────────────
retail/puma/               BUILT (HOT)   Feb 14         Active build today — React app, variants, lessons
mikano/                    BUILT         Feb 14         Case studies + Nest analysis active
hud/                       BUILT (STALE) Feb 12         v4-data.js last touched Feb 12 (2 days stale)
hbs-helper-bot/            BUILT         Feb 13         Has code, git history, node_modules
workshop-accelerator-bot/  BUILT         Feb 13         Has code + structure, newer than hbs-helper
learn/                     BUILT (OLD)   Feb 13         video-kb active, courses scaffolded
reviews/                   SCAFFOLDED    Feb 14         1 file only (baseline self-assessment)
research/                  SCAFFOLDED    Feb 14         1 file only (orchestration research)
skills/                    SCAFFOLDED    Feb 14         1 file only (pickup SKILL.md)
pickups/                   BUILT         Feb 14         3 active pickup files
video-kb/                  BUILT         Feb 14         3 analyses + bookmarks dir today
ventures/                  MIXED         Feb 13         aloe-labs + grm + vv have content; rest is archive
hb/                        BUILT (MESSY) Feb 14         97 items, many old media files, needs cleanup
session-packets/           BUILT         Feb 14         39 packets, latest today
sessions/                  BUILT         Feb 13         86 session files
tasks/                     STALE         Feb  3         data.js + index.html from 11 days ago
.cache/                    BUILT         Feb 14         Active agent outputs, session maps, DSG text
.bin/                      BUILT         Feb 13         Stream management tooling
personal/                  STALE         Feb 10         Finances, life admin — not project-relevant
archive/                   STALE         Feb  9         26 archived items
inbox/                     BUILT         Feb 13         Inbox processing area
technical/                 STALE         Feb 11         Reference docs
```

---

## DEEP DIVES

### 1. retail/puma/ — BUILT (HOTTEST DIRECTORY)

**Status: Actively being built TODAY (Feb 14)**

This is the most active directory right now. Contains:

**Core trial content:**
- `module-1-content/` — 6 missions written (md), course overview, kickoff variants, quizzes
- `module-1-compressed.html` + `.md` — Compressed lesson format (Feb 13)
- `docs/` — 6 mission HTML files (missions 01-06)

**React App (NEW — today):**
- `app/` — Vite + React 19 + React Router
- `src/components/` — 8 components: BottomNav, Header, MissionCard, ProgressBanner, QuickActions, RewardsRow, StatsStrip, TeamActivity
- `src/pages/` — Home.jsx + Lesson.jsx (with Lesson.css — 13KB)
- `src/data/missions.js` — Data file for missions
- `node_modules` installed, ready to run
- Design reference: `GREG-ISENBERG-DESIGN-PRINCIPLES.md` (14KB)

**Variant UI mockups (today):**
- `variant-home-dark.html` + `variant-home-light.html` — Home screen variants
- `variant-lesson-1.html`, `variant-lesson-2.html`, `variant-lesson-3.html` — Lesson page variants
- `VARIANT-PROMPT-lesson.md` + `VARIANT-PROMPT-sales-home.md` — Prompts used to generate variants

**Design artifacts:**
- `DATABASE-ASCII.md` (13KB) — Database schema in ASCII (today)
- `DATABASE-SUPABASE.sql` (11KB) — SQL schema ready (today)
- `USER-FLOWS.md` (25KB) — Full user flows (today)
- `GREG-ISENBERG-DEEP-ANALYSIS.md` (23KB) — Market/product analysis

**Demo materials (older but complete):**
- `demo-screen.png`, `meeting-flow.png`, `staff-play.png` — Visual assets
- `demo-speaker-notes.html`, `demo-tg-group.html`, `demo-weekly-report.html`
- `puma-demo-prep.html` — Full demo prep
- `timi-brief.html` — Brief for Timi

**Telegram Quiz Bot:**
- `quiz-bot/bot.py` (25KB) — Working bot code
- `quiz-bot/questions.json` (16KB) — Quiz content
- `quiz-bot/requirements.txt` — Dependencies listed

**Business docs:**
- `PUMA_PILOT_PROPOSAL.md` (21KB)
- `ONE_PAGER_BUSINESS_PARTNER.md`, `ONE_PAGER_MANAGER.md`
- `SLIDE_DECK_OUTLINE.md`, `COHORT_PROGRESSION_FLOW.md`
- `MESSAGE_TO_TIMI.md`, `TELEGRAM_VS_SELAR_CLARITY.md`
- `slides/` — 2 HTML presentations deployed

**Generated images:**
- `gen/` — 16 files including diagrams, hero images, AI-generated visuals

**Assessment:** This is DEEP. Trial content exists. React app is brand new (hours old). The question is: is the REACT APP connected to real data yet, or is it still shell components?

**Answer:** Components exist with routing (Home + Lesson pages + BottomNav). Data file `missions.js` exists. But it is EARLY — components are small (187-815 bytes each). Home page is 1.8KB, Lesson page is 11.7KB (most substantial). This is a working scaffold with one real page (Lesson).

---

### 2. mikano/ — BUILT

**Status: Active deal work**

**Structure:**
- `01-Gas-Solutions/` — Empty
- `02-Diesel-First/` — Has Lead-Generation/ subdir (contact cache lives here)
- `02-Diesel-Solutions/` — Separate diesel solutions
- `03-gas-solutions/` — Has content (13 items)
- `03-Intelligence/` — Empty
- `06-crm-role/` — Has CRM role content (17 items)
- `CRM-Role/` — Empty (duplicate?)
- `Docs/` — 11 items

**Key artifacts:**
- `The-Nest-Generator-Analysis.pdf` (442KB) — Full PDF analysis
- `the-nest-generator-analysis.html` (28KB) — HTML version (visual slides, tailwind)
- `case-studies/001-the-nest.md` (3.8KB) — **Complete internal case study** (today)
- `case-studies/TEMPLATE.md` (1.2KB) — Template for future case studies (today)
- `agent2-lagos-commercial-estate-research.md` (29KB)
- `Shared_Sales_Intelligence.md`
- `project.json` — Active, focus: "Pipeline execution — DSG profiling + prospecting"

**Assessment:** The Nest deal is well-documented. Case study template is ready for reuse. Some duplicate/empty directories need cleanup (01-Gas-Solutions, 03-Intelligence, CRM-Role vs 06-crm-role).

---

### 3. hud/ — BUILT but STALE

**Last modified:** Feb 12 16:48 (2 days ago)

**Files:**
- `v4-data.js` (26KB) — CANONICAL data source. Last updated comment says "2026-02-13T00:30" but file timestamp is Feb 12.
- `v4.html` (30KB) — Renderer (stable, don't touch)
- `data.js` (64KB) — OLD data file (legacy?)
- `index.html` (28KB) — OLD HTML (should use v4.html per CLAUDE.md)
- `.html` (19KB) — Unnamed HTML file

**HUD `now` field reads:** "CONV OPS PLATFORM converged. 4-round /recursive: Business Ops Bot (Flower Girl) = 9.7. EP validated. PRL trial Tue. Next: download Flower Girl TG videos → start biz ops bot. Compress Puma lessons."

**Assessment:** STALE. Does NOT reflect today's activity:
- No mention of PUMA React app being built
- No mention of The Nest case study
- "Trial Tue" is past — trial should have started by now
- Missing: variant UI work, database schema, Greg Isenberg analysis
- The `now` field is at least 2 days behind reality

---

### 4. hbs-helper-bot/ — BUILT

**Status: Has code, was actively worked on Feb 13**

- Own `.git` repo
- `src/bot.js` (11.6KB) — Main bot logic
- `src/context.js`, `src/structure.js`, `src/telegram.js`, `src/transcribe.js`
- `src/index.js` — Entry point
- `context.md` — Bot context documentation
- `research-telegram-laptop-bridge.md` (20KB) — Research doc
- `node_modules/` installed, `.env.example` present

**Assessment:** This is a REAL working bot (Telegram bot for HBS/Flower Girl). Has git commits. Not deployed but code is functional.

---

### 5. workshop-accelerator-bot/ — BUILT

**Status: Built Feb 13, newer pattern**

- `src/bot.js` (6KB), `src/index.js`, `src/questions.js`, `src/session.js`, `src/summary.js`, `src/telegram.js`
- `node_modules/` installed
- `.env.example` present

**Assessment:** Workshop question-driven bot. Smaller than hbs-helper but complete structure. No git repo (unlike hbs-helper).

---

### 6. tasks/ — STALE

**Last modified:** Feb 3 (11 days ago)

- `data.js` (1.8KB), `index.html` (5.8KB), `tasks.json` (1.7KB)

**Assessment:** Tasks HUD is abandoned/stale. Hasn't been updated since Feb 3. System instructions reference it but it's not being used.

---

### 7. ventures/ — MIXED

**Active:**
- `aloe-labs/` — `MASTER.html` (32KB) + `visuals/` with 9 images and icons — BUILT
- `grm/` — `interview-questions.html` (24KB) + `project.json` — BUILT, ready for interviews
- `vv/` — 3 HTML files from Feb 13 (case study, demand radar, portfolio) — BUILT

**Archive:**
- `08-trip3/` — Remote job search from Oct-Nov 2025, historical
- `BHM-Nigeria/` — BHM contract from Jan 2026, completed
- `openclaw/` — Single reference file

---

### 8. video-kb/ (top-level) — BUILT (TODAY)

- `2026-02-14-api-profitable-software.md` (17KB) — Video analysis done today
- `2026-02-14-openclaw-cold-outreach-automation.md` (3.7KB)
- `2026-02-14-twelve-traits-fountainhead.md` (4KB)
- `bookmarks/` — Empty bookmark folder started

**Assessment:** Active learning pipeline. 3 videos processed today.

---

### 9. hb/ — BUILT but MESSY

97 items. Mix of:
- Old Telegram media exports (photos, videos, audio from 2025)
- Business docs (FGCH-BUSINESS-PROFILE.md, HB_STUDIO_CONTEXT_PROFILE.md)
- Working files (funnel-vision-voicemail)
- Deployed site files (CNAME, content system)
- Legacy specstory files

**Assessment:** Has real content but needs serious cleanup. The old media files (videos 5-18MB each) are bloating the directory.

---

### 10. reviews/ — SCAFFOLDED

- Single file: `2026-02-14-baseline-self-assessment.md` (5.9KB) — Created today
- New directory, just getting started

---

### 11. research/ — SCAFFOLDED

- Single file: `2026-02-14-orchestration-research.md` (4.2KB) — Created today
- New directory, just getting started

---

### 12. skills/ — SCAFFOLDED

- Single file: `pickup-SKILL.md` (9KB) — Pickup skill definition
- Other skills live in `~/.claude/skills/` globally, not here

---

## ALMOST-DONE ARTIFACTS (Close to Shipping)

1. **PUMA React App** (`retail/puma/app/`)
   - Shell is up. Vite + React 19. Components exist. Lesson page is most complete.
   - Missing: real mission data wired in, Games page, Profile page, no database connected yet
   - Gap: Components → Wired pages → Supabase → Deploy

2. **PUMA Variant UI mockups** (`retail/puma/variant-*.html`)
   - 5 HTML mockups created today. These are STATIC reference designs, not app code.
   - Could be deployed as-is for stakeholder review.

3. **The Nest Analysis PDF** (`mikano/the-nest-generator-analysis.html`)
   - Complete visual slides. Ready to share.

4. **Aloe Labs MASTER.html** (`ventures/aloe-labs/MASTER.html`)
   - Internal page with visuals. HUD says "Round 2" needed.

5. **GRM Interview Questions** (`ventures/grm/interview-questions.html`)
   - Complete HTML doc, ready for interview session.

6. **HBS Helper Bot** (`hbs-helper-bot/src/bot.js`)
   - Code written, not deployed. Needs env vars + hosting.

7. **Workshop Accelerator Bot** (`workshop-accelerator-bot/`)
   - Code written, not deployed. Needs env vars + hosting.

---

## KEY FINDINGS

### What's HOT (touched today, Feb 14):
- `retail/puma/` — React app + variant UIs + database schemas
- `mikano/case-studies/` — First case study + template
- `video-kb/` — 3 video analyses
- `reviews/` — Baseline self-assessment
- `research/` — Orchestration research
- `pickups/` — 3 pickup files (context for resuming)

### What's STALE (needs update):
- `hud/v4-data.js` — 2+ days behind (doesn't reflect PUMA app build, Nest case study, today's work)
- `tasks/` — 11 days stale, abandoned
- `hb/` — Needs media cleanup

### What's MISSING:
- No session map for today (`.cache/session-map-2026-02-14.md` does not exist — last is Feb 13)
- No `/outreach` skill built (HUD says "HIGHEST LEVERAGE" but status = not-started)
- No `/enrich` skill built
- No Supabase connection for PUMA app
- PUMA React app has no deploy pipeline yet
- Both bots (hbs-helper, workshop-accelerator) have no deployment/hosting

### Structural Issues:
- `retail/puma/` sits inside `retail/` but retail/project.json says key="retail" and paths.puma="puma/" — this is actually FORJE's directory, not a generic retail folder
- Mikano has duplicate empty directories (01-Gas-Solutions, 03-Intelligence, CRM-Role)
- `hb/` has ~80MB of old media files that should be archived or gitignored
