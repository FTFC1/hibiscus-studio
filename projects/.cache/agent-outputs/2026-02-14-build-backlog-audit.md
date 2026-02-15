# Build Backlog Audit — 2026-02-14

Scanned: PUMA pickup, GitHub Issues (10 open), HB directory, Aloe Bot status, all 4 pickup files, projects.md memory. No session map today.

---

## SHIP THIS WEEK (high impact, <2hr each)

- [ ] **Remove 70/30 bar numbers** — PUMA — 15min — Numbers redundant (title says "70/30 Rule"). Edit `SlideRule` in Lesson.jsx:49-55, remove `<span className="rule-bar-pct">` elements. Pure visual bar.
  - Dependencies: none
  - Revenue: Trial starts Tuesday. Polish = professional first impression.

- [ ] **Fix Quick Ref hint text** — PUMA — 10min — Change "tap anytime" to "Saved in your Quick Reference for this lesson" in Lesson.jsx:87. Currently misleading.
  - Dependencies: none
  - Revenue: Same — trial readiness.

- [ ] **Quick Ref sheet sizing** — PUMA — 30min — Make sheet taller (~80vh), move close button to bottom (thumb-reachable), bigger example tags. Edit `QuickRefOverlay` + Lesson.css.
  - Dependencies: none
  - Revenue: Usability for store staff on phones.

- [ ] **Spot the Difference visual pass** — PUMA — 1hr — User said "could improve again". Review `SlideComparison` component, improve Don't/Do card contrast, outcome icons, spacing.
  - Dependencies: needs design eye, could benefit from human input on what "improve" means
  - Revenue: Trial polish.

- [ ] **Git commit all PUMA lesson work** — PUMA — 10min — Uncommitted work from today's build session.
  - Dependencies: do after the above fixes
  - Revenue: Source control hygiene before trial.

- [ ] **Draft BTL connection notes** — MIKANO/SELL — 1hr — GH #4 [due-friday]. Write LinkedIn connection notes for top BTL targets. Chidera Mebuge (Megawatts) first.
  - Dependencies: clodura-btl-search-plan.md for language
  - Revenue: DIRECT pipeline. Mikano commission.

- [ ] **Resume Clodura TAM search (5 firms)** — MIKANO/SELL — 1hr — GH #3 [due-friday]. Search IECL, Core-Power, HHH-Tec, FOMEX, GreenPower. Currently 5/10 firms. Needs ASCII system design first if using agent teams.
  - Dependencies: user types firm names manually (Clodura limitation)
  - Revenue: TAM = pipeline fuel.

---

## FINISH SOON (important, 2-4hr each)

- [ ] **Try This Today persistence** — PUMA — 2hr — Practice slide content should remain accessible after leaving slide 5. Options: sticky footer, separate screen, or accessible via Quick Ref. NEEDS HUMAN INPUT on approach.
  - Dependencies: user decision on UX pattern
  - Revenue: Staff actually do the practice = training works = trial succeeds.

- [ ] **The Nest deal — get manager approval for 33%** — MIKANO/SELL — 30min prep + meeting — Monday action. Warranty flaw found (1yr not 4yr), 33% discount makes Mikano competitive vs JMG. Margin still N3M (5.3%).
  - Dependencies: manager meeting Monday
  - Revenue: N3M+ commission if deal closes.

- [ ] **GRM follow-up after Thursday meeting** — GRM/SELL — 2hr — GH #7 [this-week]. Need interviews: dad (ops), SGI (numbers), Victoria/Farah (market research). Don't build before interviewing.
  - Dependencies: human scheduling
  - Revenue: potential client #3 (Rule of Three).

- [ ] **HBS case study from bot building** — HBS/PROOF — 2hr — GH #6 [this-week]. 6 nuggets identified in bot checkpoint. Bot building = live case study material. BUT: decided "build product FIRST, case study follows." Landing page / calculator = proof, case study = derived.
  - Dependencies: more HBS product built first (landing page, calculator live)
  - Revenue: trust edge / /vv proof. Closes the "why should I hire you" gap.

- [ ] **Auto-refresh Claude Code OAuth on VPS** — INFRA/OPS — 4hr — GH #17. Token expires every ~6h, bot goes down silently. Need cron/wrapper to detect 401 and refresh using `.credentials.json`.
  - Dependencies: VPS access, understanding refresh token flow
  - Revenue: Bot uptime = Aloe Labs credibility. Currently manual SSH every 6 hours.

- [ ] **Add voice to Aloe Bot (Deepgram)** — BOT/BUILD — 2hr — GH #9. Download .ogg from TG, send to Deepgram, feed to claude -p, reply. $200 free credit available.
  - Dependencies: OAuth auto-refresh (#17) should be fixed first for stable bot
  - Revenue: Voice = differentiator. Nigerian English handled by Deepgram (Whisper 54% WER unusable).

- [ ] **FGCH (Flower Girl) landing page — hero video loop** — HBS/BUILD — 2hr — Page is 64KB, otherwise complete. Only hero video loop remaining. 7 fg-images already exist.
  - Dependencies: source video from Rochelle (or generate/find suitable loop)
  - Revenue: Landing page = Rochelle's funnel entry point. Freebie > Calculator > Booking.

---

## BACKLOG (park until selling catches up)

- [ ] **Video Knowledge Pipeline — productize** — ALOE/BUILD — 4hr — GH #19. Pipeline works (Olly Rosewell = proof). Need 2 more videos to confirm repeatable, then price ($200-500/analysis). Test offer to 1 person.
  - Revenue: new service line, but needs more proof first.

- [ ] **Cartoon avatar world-building** — ALOE/BUILD — 4hr — GH #21. Twitter profile cartoon → JSON character spec → 5-10 variations. Connects to /vv and brand identity.
  - Revenue: brand asset, not urgent. Park until content strategy active.

- [ ] **Weekly 12 Traits review practice** — OPS — 30min/week — GH #23. First Sunday review Feb 16. Daily pulse + Sunday full re-score. Baseline saved.
  - Revenue: indirect. "Governor training" — emotional regulation and identity stability.

- [ ] **Ingest + apply 12 Traits article** — RESEARCH — 2hr — GH #16. Article found and saved. Deep analysis done. Apply to self-assessment rubric, /recursive adapt mode.
  - Revenue: none direct. Personal development framework.

- [ ] **Compress PUMA lessons further** — PUMA — 2hr — Feedback: lessons too long (5 min max). 6-mission compression may already be done (GH #14 — needs checking).
  - Revenue: trial success, but current slides already working. Check first.

- [ ] **PUMA visual brand anchor** — PUMA — 2hr — From Greg Isenberg analysis: "feeling-first design is missing layer." Not started.
  - Revenue: design polish, not blocking trial.

- [ ] **EP artifacts remaining** — HBS — day — 9 total, 3 done, 6 remaining. Landing page framework, format selection, solution context done.
  - Revenue: strategic framework, not blocking current sales.

- [ ] **Aloe Bot always-on research** — BOT/RESEARCH — 2hr — 153KB research file exists but unprocessed. Status: V0 DONE, V1 partial (TG delivery inconsistent), V2-V4 not started.
  - Revenue: operational capability, but blocked by OAuth issue (#17).

- [ ] **/enrich skill** — INFRA — 4hr — Daily enrichment. Reads captures, finds connections, assigns weight. NOT BUILT. Parked per Ship-or-Park rule.

- [ ] **/cockpit skill** — INFRA — 4hr — Vision + captures + connections view. data.js + HTML. NOT BUILT. Parked.

- [ ] **/next-build skill** — INFRA — 2hr — Reads RAISED seeds + Notion board + competence → suggests builds. NOT BUILT. Parked.

- [ ] **Internal case study framework** — MIKANO — 2hr — The Nest identified as first candidate. Framework = tools used, friction points, formats that worked. Not started.
  - Revenue: indirect. Builds selling credibility over time.

---

## STALE/KILL (not worth doing)

- [ ] **HB STATUS.md** — STALE. Last meaningful update references invoicing system from Jan. Calculator/booking system has shipped since. STATUS.md no longer reflects reality. Either update or delete.

- [ ] **HB site index.html** — STALE? 88KB file from Jan 27. Calculator at `/calculator/explore.html` is the live funnel entry. Main index may be outdated.

- [ ] **HB instant-quote-v2.html** — KILL. 719 bytes, likely placeholder. Calculator replaced this.

- [ ] **Notion MCP connection** — STALE. Memory says "broken/stale, everything is local now." Either fix or formally kill and remove from CLAUDE.md references.

- [ ] **/briefing reading RAISED seeds** — STALE. Memory says "should surface things waiting to be built." Never implemented. Low priority vs actual builds.

---

## Summary

| Category | Count | Est. Hours |
|----------|-------|------------|
| SHIP THIS WEEK | 7 items | ~4.5hr |
| FINISH SOON | 7 items | ~16hr |
| BACKLOG | 12 items | ~30hr+ |
| STALE/KILL | 5 items | cleanup |

**Critical path for revenue:**
1. PUMA fixes (30min-1hr) → Tuesday trial launch
2. The Nest 33% approval (Monday) → N3M deal
3. BTL notes + Clodura (2hr) → Mikano pipeline
4. GRM follow-up (scheduling) → potential client #3
5. HBS case study (after more product built) → trust edge

**Biggest blockers:**
- OAuth auto-refresh (#17) blocks all Aloe Bot progress (#9, always-on)
- "Try This Today" persistence needs human input on UX approach
- FGCH landing needs hero video source
- GRM needs interview scheduling (human task)
