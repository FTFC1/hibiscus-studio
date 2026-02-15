---
session_id: 2026-02-09-openclaw-refs-monday-start
session_date: 2026-02-09
duration_hours: 10
projects_touched: [INFRA, ALOE, RETAIL, GRM, GAS]
work_types: [research, infrastructure, implementation]
value_tier: critical
impact_score: 9
decisions_count: 31
artifacts_count: 12
tasks_completed: 14
items_open: 10
---

# Session Packet: OpenClaw References + Pipeline Rubric

**Session Date:** 2026-02-09
**Status:** ✅ Complete (2 phases)
**Duration:** ~3h (Phase 1: references + Monday start, Phase 2: pipeline rubric + Mario strategy)
**Work Type:** research, infrastructure, implementation

---

## CONTEXT

Continuation from Feb 8 marathon session (7h, 3 phases). User shared 4 web references (OpenClaw architecture articles, Diataxis framework, Decart AI virtual try-on, Meng To designer workflow) and asked them to be processed and saved. Also completed the Feb 8 session update (Phase 3) that was interrupted by context compaction.

---

## DECISIONS MADE

### 1. Split References Into Separate Files (IMPORTANT)

**Decision:** Don't bundle unrelated concepts. OpenClaw architecture, Decart virtual try-on, Diataxis taxonomy, and Whisk are separate things that live in separate places.

**Why:** User: "You've put too many things under OpenClaw... Decart AI is obviously specifically to do with retail... Diataxis is about structuring data."

**Impact:** 3 separate files instead of 1 monolith. Each in the right project directory.

**Location:** `ventures/openclaw/reference.md`, `retail/tools/decart-virtual-tryon.md`, `learn/references/diataxis.md`

### 2. Diataxis Applies to ALL Documentation (IMPORTANT)

**Decision:** The Diataxis 2x2 (Tutorial/How-to/Reference/Explanation) should inform how we structure session packets, CLAUDE.md, skills, and all docs — not just be filed under OpenClaw.

**Why:** User identified it as a general information taxonomy that helps with session packet structure.

**Impact:** Future session packets can tag sections with [REF], [HOW], [WHY], [TUT] markers.

**Location:** `learn/references/diataxis.md`

### 3. Decart AI = Retail Tool (IMPORTANT)

**Decision:** Virtual try-on API scored 4/5 on decision rubric. Cross-cuts GRM, Puma, PRL. Filed under retail/tools, not OpenClaw.

**Why:** It's a retail technology, not an agent architecture pattern.

**Location:** `retail/tools/decart-virtual-tryon.md`

### 4. Session Update → Fork Pattern (MINOR)

**Decision:** Do session update, then /fork to start fresh instance with more context space for the actual Monday work.

**Why:** User realized the pattern: session update closes cleanly, new fork has maximum context for the day's work.

---

## WHAT WAS CREATED

1. **`ventures/openclaw/reference.md`** — OpenClaw architecture patterns ONLY (trimmed from monolith). Our system vs OpenClaw parallel map, 4-table loop, proposal service, heartbeat, triggers, memory, Meng To workflow paradigms, 4-stage automation path.

2. **`retail/tools/decart-virtual-tryon.md`** — Decart AI virtual try-on API. Pricing ($0.01/credit, ~$3/hr), cross-cutting opportunity (GRM + Puma + PRL), decision rubric score (4/5), next steps.

3. **`learn/references/diataxis.md`** — Diataxis 2x2 framework. How it applies to session packets, CLAUDE.md, skills. Tag system proposed: [REF], [HOW], [WHY], [TUT].

4. **`sessions/2026-02-08-recursive-skill-repo-reorg.md` Phase 3** — Added: recursive self-audit, GRM onboarding, calculator gating correction, extended Q&A corrections (8 new decisions, 3 artifacts, 11 open items).

---

## WHAT WAS UPDATED

1. **`hud/data.js`** — Date, doNext (Monday plan), shipped (+5 Phase 3 items + GRM), active (+Retail FORJE + Ventures/GRM tracks), footer (Phase 3 summary), DSG Lindy Pack removed from 9-5 track.
2. **`.cache/artifact-index.json`** — +2 (OpenClaw reference + GRM manifest), total 54.

---

## VALUE DELIVERED

### Immediate
- 4 web references processed, properly filed, and indexed
- Feb 8 session fully closed (Phase 3 complete, HUD current)
- Clean separation: agent architecture ≠ retail tools ≠ information taxonomy

### Foundational
- Diataxis framework available for improving all documentation structure
- Decart AI ready to prototype when GRM/retail priorities allow
- OpenClaw reference available as architecture pattern library for Stage 4
- Session update → fork pattern established for context management

---

## PHASE 2: Pipeline Response Rubric + Mario Strategy

### CONTEXT (Phase 2)

Continued from Phase 1 into Monday GAS work. Mario Abugo (BTL architect, Design Group Nigeria) had replied to profiling messages with detailed intel about backup power decision processes. User wanted: (1) strategic reply that GIVES value instead of extracting, (2) a REPEATABLE criteria system for all pipeline messaging, not just one reply. Also loaded DSG "First 90 Days" document.

### DECISIONS MADE (Phase 2)

### 5. Profiling vs Prospecting Must Be Separated (CRITICAL)

**Decision:** Pipeline rubric has two distinct tracks: Profiling (P0-P5, BTL contacts, gathering intel) and Prospecting (R0-R4, ATL contacts, booking discovery). Mario = profiling, not prospecting.

**Why:** User: "Is this prospect though or is this about profiling? Because these types of differences between, because I'm still learning." Mixing profiling and prospecting rules = how you blow a lead.

**Impact:** Rubric has separate stage systems, separate rules, separate goals. Every reply starts by identifying which track you're on.

**Location:** `mikano/02-Diesel-First/Lead-Generation/pipeline-response-rubric.md`

### 6. Value Before Questions at Stage P3 (CRITICAL)

**Decision:** After 3+ exchanges of pure extraction, next reply MUST give value first. The question comes FROM the insight, not before it.

**Why:** User: "Maybe it's more about giving her value... even if she says yes, she's already said we're not on the list... that's asking us to come." 4 exchanges with Mario were 100% take, 0% give. User identified this is extractive, not consultative.

**Impact:** P3 stage rule is now mandatory: share an insight before asking anything else. Shifts balance from interviewing to partnering.

**Location:** `mikano/02-Diesel-First/Lead-Generation/pipeline-response-rubric.md` — P3 rules

### 7. Send Timing Matters (IMPORTANT)

**Decision:** Don't send on Monday AM (meetings), best window is Tue-Thu 2pm-4pm Lagos time. Architect-specific: site visits mornings, client presentations Mon/Tue.

**Why:** User: "It's already Monday morning at 11. She's probably in meetings. I don't think we should even be sending her anything until later in the afternoon."

**Sourcing note:** Timing recommendations are based on general professional messaging patterns, NOT internal documents. No DSG-specific timing guidance found in our files. Should validate with actual response data over time.

**Location:** `mikano/02-Diesel-First/Lead-Generation/pipeline-response-rubric.md` — Step 6 Timing

### 8. Notion Gen Prospecting Database Needs Upgrade (IMPORTANT)

**Decision:** Current database columns don't map to the rubric system. Needs: Stage property (P0-P5/R0-R4), Company-level context, Account Tier (A/B/C), pipeline math fields.

**Why:** User: "I just think that we can improve this new gen prospecting database and also that it's known that we're using this." Current properties are basic (Contact Name, Seniority, Firm, Next Action, Traffic Light, LinkedIn, Connection Sent, Profiling Method, Profiling Date, Reply Status, Intel Gathered, Phone). Missing: stage tracking, company-level view, volume/conversion metrics.

**Impact:** Database upgrade is next task. Must connect rubric stages to database properties.

**Location:** Notion database `2fd70b6455cb802595c4c9bcce0800ff` (dataSourceId: `2fd70b64-55cb-80cb-8b90-000bfda0742a`)

### 9. Pipeline Math Needed (IMPORTANT)

**Decision:** If goal is 20 site visits/month, need to reverse-engineer: how many contacts at each stage, what conversion rates, maybe volume isn't the answer — maybe it's better key account identification (A/B/C tiers).

**Why:** User: "We're trying to reverse engineer... to be booking 20 meetings per month site visits per month... maybe volume isn't the plan, we just need to be identifying more key accounts."

**Impact:** Pipeline math fields should be in the database or a dashboard. Track: contacts needed → stages → conversion → meetings.

### 10. Copy-Paste Formatting for LinkedIn (MINOR)

**Decision:** Strip em dashes, curly quotes, bullet points from all messages. LinkedIn adds unwanted line breaks when pasting formatted text.

**Why:** User: "When I'm copying stuff to send on LinkedIn, it adds spaces and line breaks where it shouldn't, which obviously look bad and make it look more AI-generated."

**Impact:** Cleanup checklist in rubric now includes LinkedIn-specific copy-paste rules.

### WHAT WAS CREATED (Phase 2)

5. **`mikano/02-Diesel-First/Lead-Generation/pipeline-response-rubric.md`** — Full 6-step pipeline messaging system. Profiling stages (P0-P5), Prospecting stages (R0-R4), 7-criteria quality rubric (28/35 threshold), 5-question stress test, copy-paste checklist, send timing table, company-level context card, daily workflow. Mario worked example included (scored 5 options, winner = STORY angle at 29/35).

### WHAT WAS UPDATED (Phase 2)

3. **`learn/Reference/Sales_Strategy/DSG_Filling_Pipeline_First_90_Days.txt`** — Copied from external path to repo. DSG pipeline methodology: ICP development, trigger events, RIQ method, profiling calls, HPP list, 30/60/90 day structure.

### VALUE DELIVERED (Phase 2)

#### Immediate
- Repeatable 6-step messaging system for all pipeline contacts (not just Mario)
- Mario reply ready: 2 messages (greeting + value-first scope creep scenario), send after 2pm
- Profiling vs prospecting distinction clearly documented with rules for each
- DSG "First 90 Days" methodology now in repo for reference

#### Foundational
- Every future reply can be generated, scored, and refined using the rubric
- Stage tracking connects to Notion database (upgrade needed)
- Send timing prevents sending messages during low-response windows
- Company-level context card ensures individual replies serve company strategy

---

## OPEN ITEMS (Updated)

1. **Notion Gen Prospecting database upgrade** — Add Stage property (P0-P5/R0-R4), Account Tier (A/B/C), pipeline math fields. Restructure column order. Ensure page bodies have Intel details (not just properties). Database ID: `2fd70b6455cb802595c4c9bcce0800ff`
2. **Send Mario messages** — After 2pm today or Tuesday AM. Two messages ready in rubric worked example.
3. **Call Fisayo** — 4 questions (timeline, commission, exclusivity, pipeline size)
4. **Monday Retail:** Timmy (Puma numbers), Adedolapo link
5. **Monday HB:** Bridal calls, VA meeting, Rochelle daughter birthday Tue
6. **HUD HTML redesign:** User wants improved HTML (collapsible wins, better active streams, responsive). Use /recursive.
7. **Pipeline math:** Reverse-engineer 20 site visits/month target — how many contacts/stages needed? A/B/C tier approach vs pure volume.
8. **Validate timing table:** No internal source for send timing — track actual response times to build data-driven version.


---

## PHASE 3: Notion Gen Prospecting Database Buildout + LinkedIn Analysis

### CONTEXT (Phase 3)

Continued into Monday PM pipeline execution. User had exported LinkedIn messages.csv (1.7MB, all conversations) and Connections.csv (154KB, all connections). Goal: populate the Gen Prospecting Notion database with real contacts from LinkedIn data, cross-referenced with existing pipeline knowledge. Then user provided 3 rounds of corrections based on context not available in the CSV files.

### DECISIONS MADE (Phase 3)

### 11. Batch Add Via Curl, Not MCP (TECHNICAL)

**Decision:** Created bash script with 20 JSON payloads + curl calls to batch-add contacts to Notion. MCP post-page has JSON serialization bug.

**Why:** MCP treats JSON properties as individual character indices. Curl + JSON file pattern is the proven workaround.

**Impact:** 20 contacts added in one execution. Pattern reusable for future batch operations.

**Location:** `/tmp/notion-batch-add.sh`

### 12. Lead Corrections Require Human Context (CRITICAL)

**Decision:** AI analysis of messages.csv was necessary but INSUFFICIENT. 5 major corrections needed from user's knowledge not available in LinkedIn messages: Gasavant (competitor extracting pipeline), Unigaz (fuel incompatibility), Axxela (soft no), American Tower (existing customer), Fidson (more progressed than shown).

**Why:** LinkedIn messages only show one channel. Meeting transcripts, email chains, post-meeting debriefs, and fuel type knowledge live in the user's head.

**Impact:** Any AI-generated lead analysis MUST be validated with a human pass. The AI can find and structure, but the human knows the outcomes.

### 13. BTL/ATL Classification Uses Rubric Diagnostic (IMPORTANT)

**Decision:** Applied the rubric's diagnostic questions systematically: Can they sign a PO? Do they spec equipment? Do they recommend vendors? Result: 7 contacts reclassified from BTL to ATL (engineering managers, power plant managers, operations heads).

**Why:** User: "Is RAFIU really a BTL for example?" Head of Engineering = specs equipment = ATL.

**Impact:** 7 high-value contacts now correctly classified. Changes pipeline strategy (approach as ATL, not BTL).

### 14. Action Week = W/C Date (IMPORTANT)

**Decision:** Added "Action Week" date property to database. Represents "Week Commencing" — when to action this contact. All 25 active contacts set to W/C Feb 10.

**Why:** User: "it would be good to have something in the DB thats is W/C MM XX that talks about what we need to do that week. This also allows seeing the forest from the trees."

**Impact:** Can sort/filter database by Action Week to see weekly workload.

### 15. Compress Timeline, Don't Space Out (CRITICAL)

**Decision:** All contacts set to W/C Feb 10 (this week). No spreading over 4 weeks. 15-25 sales activities per day. Push until LinkedIn free account limits hit.

**Why:** User: "I don't think we should be trying to space it out. Let's move quickly." Original 4-week spread was wrong — overcautious.

**Impact:** Full pipeline activation this week. BTL before ATL (sequencing within the week, not across weeks).

### 16. Database Column Order Matters (MINOR)

**Decision:** User wants columns reordered: Account Tier > Stage > Contact Name > Traffic Light > Next Action > Seniority > Intel Gathered > Last Contact > Firm > Channel > LinkedIn > rest.

**Why:** "I probably don't even want to see their name first. I probably care first about what type of account."

**Impact:** Cannot reorder via API (Notion column order is a UI setting). User should reorder in Notion UI.

### 17. DSG Execution Plan Page Needs Updating (IMPORTANT)

**Decision:** The strategy page in the database was still showing the original 7-day plan from Feb 4. Updated with current pipeline snapshot, updated approach, this week's priorities, and key corrections.

**Why:** User: "I more meant the DSP execution plan one, like updating that."

### WHAT WAS CREATED (Phase 3)

6. **20 Notion database pages** — Batch-added via curl. Contacts from LinkedIn messages.csv + connections.csv analysis. Pre-filled Stage, Tier, Channel, LinkedIn URL, Intel Gathered, Next Action.

7. **`/tmp/notion-batch-add.sh`** — Reusable bash script pattern for batch Notion page creation (curl + JSON payloads).

8. **LinkedIn analysis HTML** — Interactive dark-mode report from connections.csv analysis agent: company clustering, priority ranking, contact categorization.

### WHAT WAS UPDATED (Phase 3)

4. **Notion Gen Prospecting database** — 12 → 32 entries. Schema upgraded: Account Tier (A/B/C), Stage (P0-P5/R0-R4), Channel, Action Week (date), Last Contact. 5 lead corrections. 7 BTL→ATL reclassifications. 1 TOFA removal. All 25 active contacts set to W/C Feb 10.

5. **DSG Execution Plan page** — Appended current pipeline snapshot (25 active, 7 dead), updated approach (15-25 activities/day, BTL before ATL, compress timeline), this week's priorities, key corrections.

6. **`hud/data.js`** — To be updated with session close.

### VALUE DELIVERED (Phase 3)

#### Immediate
- Notion database is now the SINGLE SOURCE OF TRUTH for pipeline (32 contacts, all classified, all with Action Week)
- Weekly planning view: filter by Action Week to see what needs doing
- 7 high-value contacts correctly classified as ATL (were hidden as BTL)
- 5 dead leads properly marked (saves time chasing non-leads)
- Fidson upgraded to R2 (engineering team actively engaged — don't sleep on this)
- DSG Execution Plan reflects reality, not the Feb 4 plan

#### Foundational
- Batch Notion page creation pattern proven (20/20 success rate)
- BTL/ATL diagnostic from rubric works for classification at scale
- "AI finds + structures, human validates outcomes" pattern established for future LinkedIn analysis
- Action Week enables weekly sprint planning for pipeline work

---

## PHASE 4: Pipeline Execution Prep + Research Process (Checkpoint)

### CONTEXT (Phase 4)

Continuation after context compaction. DSG execution plan old blocks deleted (40/41). Fisayo call attempted — he'll call back. Mairo message SENT (changed "Good Morning" to "Afternoon" — age/respect politics). All 22 active contacts got Next Action Dates. User created "Next Actions" filtered table view in Notion — confirmed it's the most useful view. GojiberryAI article assessed (don't buy — referral model works, Sales Navigator if spending money).

User then identified critical gap: **dates without research behind them are empty.** StarSight Energy = solar company, not diesel. Can't blindly message Stephanie tomorrow. Before ANY reengagement or outreach, research must happen first. Research needs its own process/rubric like the messaging rubric.

### DECISIONS MADE (Phase 4)

### 18. StarSight Energy = Solar, Not Diesel (CRITICAL)

**Decision:** Stephanie Nnabueze (StarSight Energy, R1) needs relevance reassessment. StarSight is "energy as a service" in SOLAR, not diesel/gas generators.

**Why:** User: "They are major energy as a service player, but they are in the solar space. They are not in the gasol diesels space."

**Impact:** Some contacts may not be relevant to current product. Relevance check must happen before outreach.

### 19. Monday = Research Day, Tuesday = Outreach Day (IMPORTANT)

**Decision:** Weekly rhythm: Mondays are for researching contacts (company, relevance, angle). Tuesdays are for actually sending messages/making calls.

**Why:** User: "Mondays are the research day and Tuesdays the day that you reach out."

**Impact:** Tomorrow (Tue Feb 10) becomes the first outreach day. But research must be done TODAY for it to work.

### 20. Research Process/Rubric Needed (CRITICAL)

**Decision:** Build a research process with criteria, like the messaging rubric. Different types: (a) post-connection research (P0→P1), (b) reengagement research (stalled P1/P2), (c) relevance check (is this contact in our space?). Research plans must be recursively quality-checked.

**Why:** User: "We need to have a research process, and we need to have criteria so that we know that we have the right things or not."

**Impact:** Research rubric becomes pre-condition for all outreach. No messaging without research backing.

### 21. Dates Without Research = Empty (IMPORTANT)

**Decision:** Setting Next Action Dates alone doesn't help. Each date needs research output behind it: who is this person, why message them, what angle, is it worth it?

**Why:** User: "Before doing these things tomorrow, we still need to actually have something written down in terms of research."

**Impact:** Need to research all Feb 10 contacts TODAY before tomorrow's outreach.

### 22. Session Checkpoint vs Session End (MINOR)

**Decision:** /session-update should support two modes: checkpoint (save progress, keep working) and end (close session, wrap up). Current skill always assumes ending.

**Why:** User: "Maybe you're starting to realize that we should have session checkpoint and also session end."

### 23. GojiberryAI = Don't Buy (IMPORTANT)

**Decision:** Intent-based sales tools ($199-499/mo) not worth it for Nigerian diesel generator market. Referral model (Fisayo) + manual rubric works and is free. If spending money, LinkedIn Sales Navigator ($80/mo) first.

**Why:** Nigerian triggers are private (power failures, construction starts), not public LinkedIn signals. GojiberryAI optimized for US SaaS, not industrial B2B in Nigeria.

### WHAT WAS CREATED (Phase 4)

9. **Next Action Dates for all 25 active contacts** — Feb 10 (8 contacts: active conversations + BTL), Feb 11 (8 contacts: Tier A ATL), Feb 12 (6 contacts: Tier B ATL + Sarah escalation)

10. **Pre-outreach Research Rubric** — To be built (pipeline-research-rubric.md). Types: post-connection, reengagement, relevance check, pre-ATL. Criteria-based with recursive quality check.

### WHAT WAS UPDATED (Phase 4)

7. **Fisayo Notion page** — Next Action: 6 improved questions (added referral status check + "what do you need from us?"). Next Action Date: Feb 10.
8. **Mairo Notion page** — Last Contact: Feb 9 (sent). Next Action: Await reply, follow up Feb 12. Next Action Date: Feb 12.
9. **Sarah Notion page** — Next Action: Escalate Feb 12 if no reply. Next Action Date: Feb 12.
10. **DSG Execution Plan page** — 40/41 old blocks deleted. Only current (Feb 9) content remains.
11. **"Next Action Date" property** — Added to database schema. All contacts populated.

---

## OPEN ITEMS (Updated — Phase 4 Checkpoint)

1. **BUILD research rubric** — Like messaging rubric but for pre-outreach research. Types: post-connection, reengagement, relevance. Recursive quality check. MUST happen before tomorrow's outreach.
2. **Research Feb 10 contacts TODAY** — Spin up research agents for: Elizabeth/UPDC, Adesola/Baker Hughes, Stephanie/StarSight(SOLAR!), Daniel/7Up, Ifeanyi/UAC, Ekokifo, Olujide, Bilikisu. Each needs: company relevance, person role, angle, decision (message or park).
3. **Fisayo callback** — He'll call back. Questions ready (6 improved). Follow up if no callback today.
4. **Sarah/Fidson** — Monitor until Wed Feb 12. Escalate if silent.
5. **Notion formatting** — Next Action field clumps text (no bullet support). Consider: short summary in property, details in page body.
6. **Database column reorder** — Must do in Notion UI manually.
7. **Pipeline math** — 20 site visits/month vs 15-25 activities/day. Track LinkedIn limits.
8. **Validate timing table** — No internal source. Track actual response data.

---

## META (Updated — Phase 4)

**Pattern observed (Phase 4):** Setting dates without research = false sense of progress. "Next Actions" view shows WHEN to act, but without research, you don't know WHAT to say or WHETHER to say anything. Dates are containers. Research fills them.

**Pattern observed (Phase 4b):** Different contact situations need different research types. New connections need company research. Stalled conversations need angle research. Some need relevance validation (StarSight = solar, not diesel). One-size research doesn't fit.

**Lesson (Phase 4):** Monday = Research, Tuesday = Outreach. Research is production activity, not admin. A researched message at P1 beats an unresearched message at R1.

**Lesson (Phase 4b):** User saw the gap BECAUSE the view was better. Next Actions table → spotted StarSight = solar immediately. Better views → better decisions.

**Pattern observed (Phase 3):** AI can find and structure leads from raw data (messages.csv → 41 relevant conversations → 28 candidates), but CANNOT determine outcomes. Meeting transcripts, email chains, fuel compatibility, competitive dynamics — these are human context. The 80/20: AI does 80% of the work (finding, structuring, classifying), human does 20% (validating outcomes), but that 20% changes everything (5 of 28 candidates were wrong).

**Lesson (Phase 3):** Don't space things out for the sake of being "strategic." If you have 25 contacts and can do 15-25 activities per day, the constraint is LinkedIn limits, not your calendar. Move fast, hit the limit, then work with what you have. The plan shapes itself to the constraint, not the other way around.

**Lesson (Phase 3b):** Database column order = what you think about first. Account Tier first means "am I even talking to the right account?" Stage second means "where am I with them?" Name third. This is a filtering mindset, not a CRM mindset.

**Sources (80/20):**
- 35% — LinkedIn messages.csv + connections.csv (raw data for contact identification)
- 25% — User corrections (Gasavant meeting transcript, Unigaz fuel intel, Fidson email chain, TOFA ownership, BTL/ATL audit)
- 20% — Pipeline response rubric (stage classification, BTL/ATL diagnostic)
- 15% — Notion API (database operations, page creation/updates)
- 5% — DSG First 90 Days + profiling scripts (stage definitions)

---

## META

**Pattern observed (Phase 1):** Bundling unrelated concepts into one file = same mistake as linear thinking. Ecosystem thinking applies to filing too.

**Pattern observed (Phase 2):** After 3+ exchanges of pure extraction, the relationship is in debt. Value must be given before more can be taken. The best question is one the insight makes easy to answer — it answers itself.

---

## PHASE 5: DSG /Recursive on Scoring + Critical Voice Note Corrections

### CONTEXT (Phase 5)

Ran /recursive on the pipeline-research-rubric scoring criteria, incorporating 4 DSG documents: Profiling Guide ("Sort Don't Sell"), ICP Outline (Beam AI example — trigger events + buyer personas), Lead List Building Outline (external+internal event pairing), Multi-Account Mastery. Rewrote all scoring sections. Then user reviewed everything in a long voice note with 8 critical corrections.

### DECISIONS MADE (Phase 5)

### 24. Product Fit Dimension: Gas vs Diesel vs Both (CRITICAL)

**Decision:** Pipeline scoring must account for WHAT can be sold, not just WHETHER to sell. Three product categories: (a) 100% gas pitch targets, (b) gas or diesel targets, (c) definitely diesel. This is within Mikano Power Division — same company, different products.

**Why:** User: "You have nodes, you have direct, you have direct portfolio. You ALSO have people who 100% we're trying to go for pitching gas. You have people that may be gas or diesel and people that definitely diesel."

**Impact:** Research rubric needs a product fit dimension. Gas solutions and gas tech PDFs added to inbox for context. Mikano is NOT doing IPP anymore — purely selling generators + third-party installation.

### 25. Solar + Gas Not Common in Nigeria (IMPORTANT)

**Decision:** Solar is big upfront investment with payback. Diesel is backup. Solar + gas is an UNCOMMON combination. Need research: "how many people are doing solar + gas in Nigeria?"

**Why:** User: "Solar is something where you pay a lot of money upfront. Gas is ALSO something where you pay a lot of money upfront. If you've just done a big thing in solar, they're probably doing solar (renewable) + diesel (backup)."

**Impact:** StarSight angle needs rethinking. "Gas complements solar" is NOT a strong pitch unless proven.

### 26. Mikano Business Model: Generators Only, No IPP (IMPORTANT)

**Decision:** Mikano Power Division sells generators. They do NOT do IPP (Independent Power Production) anymore. Installation uses third-party. The Tempo proposal (deal lost) shows recent business type.

**Why:** User: "We ourselves are not doing IPP anymore. We are purely just giving you the generators."

**Impact:** Tempo proposal = reference for understanding actual deal shape. Gas solutions PDF has some outdated info (IPP references).

### 27. Bilikisu + Olujide Haven't Accepted LinkedIn Invites (CRITICAL)

**Decision:** These two NODE contacts (scored GREEN 🟢) are NOT connected on LinkedIn. Invites still pending. Both inactive (last activity 4-5 months ago). Need alternative channel — potentially email via lead enrichment tools.

**Why:** User checked LinkedIn: "Bilikisu hasn't accepted. Olujide hasn't accepted. They were last active four months ago."

**Impact:** 2 of top 3 GREEN nodes can't be reached via LinkedIn. Need: email addresses (use enrichment services) or another channel. Already sent invites last week, so repeat invite = pushy.

### 28. Elizabeth: Softer Approach, Not Product Availability (IMPORTANT)

**Decision:** Don't lead with product availability or industry insights. Lead with something personal/warm ("happy new year, something slightly funny") then ask a question.

**Why:** User: "Going straight into product availability is smart. I think it comes off too salesy."

**Impact:** Elizabeth outreach approach needs redesign. She said "I'll reach out when requests come up" = she's YELLOW, not GREEN. Nurture softly.

### 29. Industry Events Not Useful Unless Attending (MINOR)

**Decision:** Don't suggest "reference an industry event" unless Nicholas is actually attending that event. Otherwise it's hollow.

**Why:** User: "I think an industry event is pretty pointless unless I'm saying that I'm going to meet him there, which I'm not."

### 30. StarSight: Research Competition as Angle (IMPORTANT)

**Decision:** For StarSight reengagement, research: Who are their competitors? What are competitors doing? How can Mikano help StarSight beat competition?

**Why:** User: "Who is their competition? What are their competition doing? How can we help them beat their competition? These are the types of things."

### 31. Pipeline Volume Too Low (CRITICAL)

**Decision:** Current pipeline has only ~9 contacts for tomorrow, and not many more for the rest of the week. This is NOT the 15-25 activities/day target. Need more invitations, more research, more accounts.

**Why:** User: "Do you think we have enough contacts? Tomorrow looks like 9 people. Over the next seven days, it's not even that many. We need to invite more people."

**Impact:** Need top-level pipeline numbers: how many accounts, how many people, how many at each stage. Then calculate gap to 15-25/day target.

### WHAT WAS CREATED (Phase 5)

11. **Pipeline Research Rubric v2** — Full rewrite of scoring sections. Universal Framework (hypothesis-first, traffic light, trigger events, COI, buying window, "What Keeps Them Awake"). All 5 types rewritten with weighted scoring. DIRECT scoring (/45), DIRECT-PORTFOLIO scoring (/50), NODE scoring (/55 — added project type relevance). Re-scored Feb 10 contacts. Daily workflow updated. Research agent instructions updated. Calibration rules added.

12. **Mikano product context files** — Gas Power Solutions.pdf, GAS TECH.pdf, Tempo proposal added to inbox/Feb 9/ by user.

### WHAT WAS UPDATED (Phase 5)

12. **`mikano/02-Diesel-First/Lead-Generation/pipeline-research-rubric.md`** — Major rewrite: Universal Framework section inserted, all 5 type scoring sections replaced with weighted/DSG-informed versions, DIRECT + DIRECT-PORTFOLIO scoring added, re-scored contacts table updated with traffic lights, daily workflow + agent instructions updated.
13. **MEMORY.md** — Added: product fit dimension (gas/diesel/both), Mikano no IPP, Bilikisu+Olujide not connected, pipeline volume gap.

### VALUE DELIVERED (Phase 5)

#### Immediate
- Scoring criteria now incorporate DSG Profiling Guide frameworks (trigger events, COI, functional friction, traffic light sorting)
- 3 product types identified (gas/diesel/both) — prevents wrong product pitch
- 2 top nodes confirmed unreachable via LinkedIn — need email channel
- Pipeline volume gap identified: ~9 contacts for Tue vs 15-25/day target

#### Foundational
- Research rubric v2 is a proper diagnostic tool, not just a checklist
- Traffic light system (🟢🟡🔴🟠) replaces binary GO/PARK — 90% YELLOW is normal
- Hypothesis-first approach prevents aimless research
- Calibration rules built in (30% GREEN target, adjust if skewed)

### OPEN ITEMS (Updated — Phase 5)

1. **Read Mikano product files** — Gas Power Solutions.pdf, GAS TECH.pdf, Tempo proposal. Understand product range (gas vs diesel), deal shape, pricing.
2. **Add product fit to research rubric** — Gas/Diesel/Both classification per contact.
3. **Bilikisu + Olujide: email channel** — Need lead enrichment tool to get email addresses. LinkedIn invites pending, both inactive.
4. **Pipeline volume gap** — Need: current total accounts, people, stages. Calculate: how many more invitations needed to hit 15-25/day.
5. **StarSight competition research** — Who competes with StarSight? What angle helps them win?
6. **Solar + gas in Nigeria research** — How common is this combination? Is it a real market?
7. **Fisayo callback** — Still waiting.
8. **Sarah/Fidson** — Monitor until Wed Feb 12.
9. **Notion updates** — 8 Feb-10 contacts need Intel Gathered updated with research results + traffic light.
10. **RIQ: Mastering the Cold Call** — Convert to Nigeria context (user requested, for later).

---

## META (Phase 5)

**Pattern observed:** Pipeline volume is the NEXT bottleneck. We built scoring criteria that work, but if there are only 9 contacts for tomorrow, the scoring is academic. Quality of approach (rubric) × quantity of contacts (volume) = pipeline output. Right now: quality HIGH, volume LOW.

**Pattern observed:** LinkedIn is not the only channel. Top 2 nodes are inactive on LinkedIn (4-5 months, invites pending). Email, phone, WhatsApp, or mutual connection intros may be needed. Multi-channel strategy, not LinkedIn-only.

**Pattern observed:** Product fit is as important as contact fit. A perfect NODE contact who only does solar projects is useless for diesel. A mediocre DIRECT contact who's actively buying gas generators is higher priority THIS WEEK.

**Lesson:** "How many people are doing solar + gas in Nigeria?" = the kind of question that should be RESEARCHED before it becomes a pitch angle. Don't assume market adoption without data.

**Lesson:** Mikano's business model (generators only, no IPP, third-party install) constrains the pitch. Can't promise turnkey solutions. Can promise reliable equipment + partner network for installation.

**Lesson (Phase 1):** File by WHERE each item belongs (project/domain), not by WHEN they arrived.

**Lesson (Phase 2):** A rubric catches what intuition misses. Without the P3 stage rule ("must give value"), the natural tendency is to keep asking questions. The rubric makes the balance visible and enforceable.

**Sources (80/20):**
- 40% — DSG First 90 Days transcript (`learn/Reference/Sales_Strategy/DSG_Filling_Pipeline_First_90_Days.txt`)
- 25% — Profiling scripts + Traffic Light system (`inbox/profiling-scripts.md`)
- 20% — Mario session packet + Notion profile (`sessions/2026-02-06-mario-reply-notion-workaround.md`)
- 10% — Nigerian-adapted lead strategy (`mikano/02-Diesel-First/Lead-Generation/DSG_Lead_Strategy.md`)
- 5% — General knowledge (send timing table — no internal source, flagged for validation)
