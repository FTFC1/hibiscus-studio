// HUD Data — Edit this file to update the dashboard
// Last updated: 2026-02-11 21:00 (Wed 9pm — Stream mgmt SHIPPED. /recursive build mode upgraded. System audit: /outreach = highest leverage gap. Pipeline research: 53 projects, 48 firms.)
// Structure: WINS → ACTIVE → WAITING → SUGGESTIONS

const hudData = {

    date: {
        day: 11,
        month: 'FEB',
        year: 2026,
        dayOfWeek: 'WED'
    },

    doNext: {
        sections: [
            {
                label: 'NOW',
                items: ['Build /outreach skill — HIGHEST LEVERAGE. Research→Rubric→DB done, daily execution missing. Directly serves pipeline volume (R6).']
            },
            {
                label: 'THU (tomorrow)',
                items: [
                    'Puma demo (₦45K case study pilot — Timi=commercial, Nicholas=demo platform)',
                    'GRM meeting (interview before building)',
                    'Mairo close message — drafted, SEND IT',
                    'LinkedIn research: Batch 1 (KOA, AEC/Engr. Oladunni, NAIRDA, Sentinel, Ekulo)'
                ]
            },
            {
                label: 'THIS WEEK',
                items: [
                    'Build /outreach skill (generates daily batch of 15 personalized messages)',
                    'Build /enrich skill (reads captures, finds connections)',
                    'HUD rotation — archive shipped items >7 days',
                    'Register Mikano for West Africa Infrastructure Expo (Apr 7-9, Landmark Centre Lagos)'
                ]
            }
        ],
        why: 'Wed 9pm: System audit revealed /outreach as biggest gap. Pipeline research complete (53 projects, 48 firms). Stream management shipped. /recursive build mode with spike protocol + Singer methodology. Tomorrow = 2 client meetings + Mairo.',
        lastUpdated: '2026-02-11T21:00:00'
    },

    battlePlan: {
        craftDocId: null,
        craftFolder: 'Session Packets',
        summary: 'Context loading complete. HBS export processing in progress. Tool landscape mapped. Funnel design workflow defined.',
        whyNot: 'Weekend session — strategic context loading, not 9-5 execution'
    },

    toolkit: [
        { label: '/briefing', desc: 'Context injection — reads HUD + sessions + Notion', type: 'cmd' },
        { label: '/session-update', desc: 'Close session → packet + HUD update', type: 'cmd' },
        { label: '/recursive', desc: 'Quality loop (9/10 threshold) on ANY output', type: 'cmd' },
        { label: '/ep', desc: 'Apply EP course frameworks to current work', type: 'cmd' },
        { label: '/tm', desc: 'Task management (voice-first)', type: 'cmd' },
        { label: '/process-convo', desc: 'Brain dump → decisions/actions/questions', type: 'cmd' },
        { label: '/checkpoint', desc: 'Mid-session state save for handoff', type: 'cmd' },
        { label: '/capture', desc: 'Fast dump + auto-summary + Notion seed', type: 'cmd' },
        { label: 'HUD', desc: 'This dashboard — hud/index.html', type: 'view', path: 'hud/index.html' },
        { label: 'Review Viewer', desc: 'Mobile-first flow review (Rochelle pattern)', type: 'view', url: 'https://hibiscusstudio.co.uk/docs/review/' },
        { label: 'Contact Cache', desc: '8 contacts + page IDs (skip 105K query)', type: 'sys', path: 'mikano/02-Diesel-First/Lead-Generation/contact-cache.json' },
        { label: 'LOG: Card', desc: 'Notion accomplishments by project (30470b64-55cb-8186)', type: 'sys' },
        { label: 'Research Rubric', desc: 'Scored pipeline — DIRECT/NODE/PORT', type: 'sys', path: 'mikano/02-Diesel-First/Lead-Generation/pipeline-research-rubric.md' },
        { label: 'EP Artifacts (3)', desc: 'hb/ep-*.md — solution context, format, landing page', type: 'sys', path: 'hb/' },
        { label: 'Anti-Checklist', desc: 'See bottom of HUD — 8 rules always visible', type: 'sys' }
    ],

    links: [
        { label: 'HB Booking', url: 'https://hibiscusstudio.co.uk/book' },
        { label: 'HB Admin', url: 'https://hibiscusstudio.co.uk/admin' },
        { label: 'PUMA Training', url: 'https://ftfc1.github.io/puma-training-demo/course-outline.html' },
        { label: 'HB Review Viewer', url: 'https://hibiscusstudio.co.uk/docs/review/' }
    ],

    // ═══════════════════════════════════════════════
    // WINS — Celebrate these, don't bury them
    // ═══════════════════════════════════════════════
    wins: [
        {
            label: 'SYSTEM AUDIT VIA /RECURSIVE BUILD — 5 GAPS FOUND ✅ (CRITICAL)',
            detail: 'Applied /recursive build mode to the entire personal operating system. Extracted 9 requirements (R0-R9), mapped 5 affordance layers (30+ affordances), ran fit check. Found: R6 pipeline volume (3/10, no /outreach skill), R8 enrichment (2/10, /enrich not built), R9 HUD entropy (6/10, 494 lines never rotates), R0 no revenue tracking (⚠️ spike needed). Highest leverage next build = /outreach.',
            next: 'Build /outreach skill → then /enrich → then HUD rotation'
        },
        {
            label: 'STREAM MANAGEMENT SYSTEM SHIPPED ✅ (HIGH)',
            detail: 'Session map (.cache/session-map-*.md) + custom status line (statusline.sh) + agent output rescue (.cache/agent-outputs/) + CLAUDE.md rules (4 mandatory) + skill integration (/checkpoint, /session-update, /briefing all updated). Designed via C++++ /recursive (4 rounds, 9.4 avg). Status line v2: collapsed DONE count + first-word names. Cross-terminal bridge via session map file.',
            next: 'Monitor status line in use. Consider adding to /cockpit view.'
        },
        {
            label: '/RECURSIVE BUILD MODE + SINGER METHODOLOGY ✅ (HIGH)',
            detail: 'Build mode upgraded with spike protocol (investigate unknowns before scoring), flagged unknowns (⚠️ = can\'t evaluate, always fails fit check), ripple rule (R changes → rubric re-derives). Source: Ryan Singer shaping skills (github.com/rjs/shaping-skills). 5 affordance layers (UI/Code/Logic/Context/Data) expanded from Singer\'s 2.',
            next: 'Apply to next system build (/outreach). Singer repo = reusable reference.'
        },
        {
            label: 'PIPELINE RESEARCH — 53 PROJECTS, 48 FIRMS ✅ (HIGH)',
            detail: '4 parallel agents: 15 hotel projects, 38 commercial/estate projects, 48 architecture/MEP firms (with NAMED PEOPLE), 13 developers + 6 data centres. Consolidated into DSG-ranked batches. Batch 1: KOA, AEC (Engr. Oladunni), NAIRDA, Sentinel, Ekulo. Data centre pipeline: 146.5MW+. West Africa Infrastructure Expo: Apr 7-9, Landmark Centre Lagos.',
            next: 'LinkedIn research on Batch 1. Register for Expo.'
        },
        {
            label: 'NOTION DB RESTRUCTURED — 35 → 21 CARDS ✅ (CRITICAL)',
            detail: '4-round /recursive evaluation → clean execution. Videos → REF: Done cards (clickable, cross-referenced). Tracks archived (Project tag IS the track). PUMA 3→1 fold. Backlog archived. LOG: Accomplishments card created (30 entries, 5 project sections). Board view: 13 active items, honest counts. memory/notion.md updated with new lifecycle. 3 skills built this session: /process-convo, /checkpoint, /capture. 7 video deposits to Notion.',
            next: 'Switch to Board view in Notion. When items Done → append to LOG: card → archive.'
        },
        {
            label: 'HB CALCULATOR LEAD PIPELINE LIVE (CRITICAL)',
            detail: 'Full conversion architecture shipped in one session. DM capture (IG handle, zero friction) → KV lead storage → Telegram instant notification (@hbsworkshop_bot, Workshop Leads topic, IG profile link + copy-paste DM) → branded breakdown page (/calculator/b/?id=xxx). Plus: smart margin nudges, social proof (real numbers), Eddie\'s Cake Bar feedback applied (comparison copy, savings WHY, cost visibility). 3 new API routes, 5 backend deploys, Puppeteer-verified. First real ICP user feedback → implemented same day.',
            next: 'Outreach list template. Freebie PDF. Community setup. Clean test leads from KV.'
        },
        {
            label: 'GEN PROSPECTING DB + PIPELINE SYSTEM COMPLETE ✅ (HIGH)',
            detail: 'Notion database built: 32 contacts (20 from LinkedIn export batch-add). 3 rounds of human corrections applied. 5 dead leads properly marked with competitive intelligence. 7 BTL→ATL reclassified. Fidson upgraded to R2 (engineering engaged). Pipeline rubric connected. DSG Execution Plan updated. Action Week property enables weekly sprint planning. All 25 active contacts set to W/C Feb 10. System: Rubric (how to message) + Database (who to message) + Execution Plan (when/what order) = ready to execute.',
            next: 'SEND Mairo NOW. CALL Fisayo. Tomorrow: 15-25 activities/day begins.'
        },
        {
            label: 'EP ARTIFACTS + INFRA DAY ✅ (HIGH)',
            detail: '3 EP artifacts created from real data: Solution Context Profile (4-layer problem map, £22.8K/yr value gap, 5 moats), Format Selection (Education/Automation/Implementation mapped, value ladder corrected — custom funnel is SEPARATE), Landing Page Framework (calculator page: 7 sections, PAS copy, A/B headlines). project.json enriched with customer profile, economics, pipeline, sources, EP artifacts needed. /recursive skill shipped. Repo reorganized (PARA killed, plain names). SYSTEM_DESIGN v2. 17 EP lessons scanned → status map created.',
            next: 'BUILD calculator page → Outreach list → Freebie PDF'
        },
        {
            label: 'CONTEXT LOADING — 45 ITEMS + TOOL LANDSCAPE + HBS EXPORT PROCESSING ✅ (HIGH)',
            detail: '30-min voice note → 45 structured items across 6 projects (9 correction rounds). 11 Notion in-progress items with embedded links/PDFs extracted. Tool landscape mapped: Variant $20 (all funnels), Freepik $9 + Higgsfield/Kling + Flow/Veo + Whisk (NollyAI), recursive skill (everything). Funnel design workflow defined. HBS export (80 VMs + 200 texts) being processed by 5 parallel agents. EP Telegram group exported. Google Whisk available (user confirmed). Kling inside Higgsfield (not separate). Image/video gen workflows found in EP Module 5 + video-kb.',
            next: 'Consolidate HBS extraction → action items → redo writeup → prioritize'
        },
        {
            label: 'MARIO REPLIED + NOTION MCP WORKAROUND ✅ (HIGH)',
            detail: 'Mario (BTL architect) replied 24h after profiling message — process intel captured: MEP consultants drive backup power decisions, early engagement window exists, construction + operational backup needs. Traffic Light: Green (active projects, willing to engage). Follow-up reply ready (asks about spec process + rental demand). Notion MCP bug fixed: direct API via curl + JSON files (MCP patch-page has parsing bug). Pattern documented in CLAUDE.md. Mario = she (corrected). Commercial awareness maintained (Mikano already offers rentals).',
            next: 'Send Mario follow-up reply, wait for spec + rental intel'
        },
        {
            label: 'HB PRICING BUG FIXED + RESCHEDULE FIX + DASHBOARD CRASH RECOVERED ✅ (CRITICAL)',
            detail: 'Backend pricing: 3 event-type-specific tables (was single table, £465 for all). Bose HB-MLAX4SS7 corrected £465→£90. Dashboard crash: safeJsonParse strips markdown fences. London timezone: getLondonNow/getLondonToday for all biz logic. Duration-aware reschedule: admin modal generates correct slots per booking type (was always 6h). Calendar sync endpoint. Email+date dedup. 7 deployments. Notion "Double Booking Test" marked Done.',
            next: 'Reschedule Bose to new date via admin dashboard + Create 4 Notion pages via curl'
        },
        {
            label: 'HB BOOKING DOUBLE-BOOKING PREVENTION VERIFIED ✅ (CRITICAL)',
            detail: 'Comprehensive production testing across 9 overlap scenarios: exact overlap, partial (start/end), encompassing, contained, 1-minute edge case, back-to-back bookings. Pass rate: 9/9 (100%). Algorithm validated: requestedStart < busyEnd && requestedEnd > busyStart. Critical finding: back-to-back bookings (12-2, then 2-4) correctly allowed. Feb 21 double-booking from screenshot was pre-fix (created before Feb 4 3:12pm) or manual calendar entry. System NOW prevents ALL new double-bookings. Tested against live production API with real calendar queries. Confidence: 100%.',
            next: 'Clean up test bookings (HB-MLAVN2I1, HB-MLAWCLTW, HB-MLAWEFVX, HB-MLAWEJHE) from admin dashboard'
        },
        {
            label: 'PIPELINE POWER VISUAL v12 - NON-AI AESTHETIC ✅ (HIGH)',
            detail: 'Production-ready visual for architect/MEP referral partners with distinctive personality. Bebas Neue + Work Sans typography (strategic use - Bebas for large headlines only, Work Sans for small headings to avoid awkward tall/condensed look). Dark top banner (not red) reduces visual fatigue. Flat gradients (restraint > polish). Generator naming: "Perkins York" / "MTU Gas" (250kVA - 2MW). NNPC badge, Feyintola name corrected. Screenshot-ready 1024px. /ui-explore pattern validated (6 layouts → immediate pick). v12 final: /projects/inbox/Feb 5/pipeline-power-v12-final.html',
            next: 'Screenshot v12 and distribute to Pipeline Power referral partner'
        },
        {
            label: 'HB DOUBLE-BOOKING BUG FIXED ✅ (CRITICAL)',
            detail: 'Feb 21 double-booking root cause found and fixed. Backend had TODO comment skipping availability checks for new bookings (trusted frontend). Now queries BOTH calendars (contacthibiscusstudio + hibiscusstudiouk) with proper time overlap detection. Frontend now hides unavailable dates entirely (checked all Feb weekends = 0/4 slots). Deployed to production. "STAR UX" achieved - customers never see dates they can\'t book.',
            next: 'Monitor for any booking conflicts, reply to bridal customer with weekday options'
        },
        {
            label: 'DSG ARCHITECT PROFILING DATABASE READY ✅',
            detail: 'Applied DSG High Probability Prospecting to Nigerian generator sales. Notion database populated with 10 contacts: customized messages (copy-paste ready), LinkedIn URLs, BTL/ATL classification, execution plan. Sequential multi-channel: LinkedIn → WhatsApp (after acceptance). 5 connections already sent. Chukwudi phone verified (0802 340 0050). Ready for Day 1 execution tomorrow.',
            next: 'Day 1 (Feb 5): When connections accepted, send profiling messages from Next Action field → Track replies in database'
        },
        {
            label: 'BRIEFING NOTION INTEGRATION ✅',
            detail: '/briefing now pulls full agency work from "Aloe Labs Work" Notion database. Shows In Progress items with full page context (not just titles), Not Started items high-level. Cached in artifact index. Clear separation: 9-5 agency (Notion) vs side projects (HUD).',
            next: 'Use /briefing at session start to see 9-5 agency work + side projects in one view'
        },
        {
            label: 'HB BOOKING FIXES DEPLOYED TO PRODUCTION ✅',
            detail: 'TWO DEPLOYMENTS LIVE: (1) 9 critical fixes deployed (Content Creation visible, pricing correct, viewing flow working, bot protection). (2) 2-hour slot fix deployed (20 min setup/pack → 1h 20m actual time, was -30 min impossible!). Both live at hibiscusstudio.co.uk/book. Revenue streams operational: Content Creation £90-£500, Workshop 2h viable.',
            next: 'Monitor bookings, test 2h Content Creation flow end-to-end'
        },
        {
            label: 'NOTION API INTEGRATION ✅',
            detail: 'Direct API access working (not MCP). Created 9 project cards, bulk-tagged with "HB Studio", built reusable scripts (setup test, card creation, bulk tagging). Can now automate project management, create cards from git commits, sync status with HUD.',
            next: 'Use for future project tracking automation'
        },
        {
            label: 'FISAYO WHATSAPP VISUAL COMPLETE ✅',
            detail: 'WhatsApp-optimized (540px), red/brown Mikano brand, developer/architect messaging (NOT end-users). EP fact-check applied: removed unverified claims (44% downtime, 60-70% reduction), kept verified only (56 days/year outages, 220 vehicles, NNPC). SVG icons, MTU/Perkins separated, no Fisayo intro (he writes own). Ready to screenshot/PDF and share.',
            next: 'Fill Fisayo WhatsApp number → Send to him → Wait for 7 referrals to respond'
        },
        {
            label: 'AGENCY POSITIONING CLARITY (EP ANALYSIS) ✅',
            detail: 'Applied EP frameworks to crossroads decision. Strategy: Agency first (not infoproduct - no authority yet), run GAS + agency parallel (exit when agency revenue > GAS for 3 months), HB = anchor client (retainer), Princess = scalable offer test (project-based). 4-step async intake designed, 50/50 payment terms, pricing tiers defined.',
            next: 'Send Princess intake, get specs, quote with deposit terms. Find Client #3 (Rule of Three).'
        },
        {
            label: 'GLOBAL SKILLS MIGRATION COMPLETE ✅',
            detail: '23 commands → global skills. Same capabilities everywhere (briefing, session-update, video, tm, all design polish). Preserved comprehensive versions (not replaced with stubs). No more efficiency asymmetry.',
            next: 'Use skills from any directory - consistent experience'
        },
        {
            label: 'DAY LOG SYSTEM COMPLETE ✅',
            detail: 'Daily Manifest research → 24h neurodivergent pattern template. Combats time blindness through articulation. Shows 4 phases (morning sluggish, office peak, evening dead zone, night owl). Reflection questions with timeline (no scrolling). "Do Tomorrow" box (ONE thing, not 10).',
            next: 'Test with actual work day (Feb 4) → Use daily for time awareness'
        },
        {
            label: '7-AGENT PARALLEL AUDIT ✅',
            detail: 'Ran 7 research agents simultaneously. Found: 6 stale CLAUDE.md rules, 5 missing indexes, 3 file structure plans, session packet evolution story. Pattern documented for reuse.',
            next: 'Clean CLAUDE.md (Task #1), create missing indexes (Task #2)'
        },
        {
            label: 'TASKS HUD SHIPPED ✅',
            detail: 'Native task management at /projects/tasks/. Same HUD pattern (data.js + index.html). Voice-first: say "tasks" to see dashboard. No external API needed.',
            next: 'Say "tasks" or "next task" to use'
        },
        {
            label: 'REFERRAL MODEL VALIDATED (Fisayo) ✅',
            detail: '2-minute call with architect → 7 referrals with projects in pipeline. Commission: ₦500K-₦1M per deal. Proof of concept: This is how Nigerian generator sales actually work (relationships, not cold LinkedIn).',
            next: 'Convert 2+ of Fisayo\'s 7 referrals this week → Replicate with 10 more partners'
        },
        {
            label: 'STRATEGY PIVOT COMPLETE',
            detail: 'Abandoned: Trigger monitoring (RSS/LinkedIn), cold outreach, MEP node without network. Adopted: Referral engine, Instagram authority, ₦500K-₦1M commissions. Aligned with Nigerian reality (private triggers, relationship-driven).',
            next: 'Execute Week 1: Fisayo referrals, referral PDF, Instagram content (3 posts)'
        },
        {
            label: 'FRANCESCA BOOKING COMPLETE',
            detail: '£645 workshop (Feb 26) — manual booking via new overridePrice API, calendar event created, invoice sent',
            next: 'May need to clarify correct price (received multiple emails)'
        },
        {
            label: 'INFRASTRUCTURE DAY COMPLETE',
            detail: 'Artifact Index ✅ + Validation gates ✅ — system fixes preventing future drift',
            next: 'Apply validation gates to new projects'
        }
    ],

    // ═══════════════════════════════════════════════
    // ACTIVE — Things with momentum right now
    // ═══════════════════════════════════════════════
    active: [
        {
            track: '📌 HB STUDIO (Anchor Client)',
            status: '🟢 Calculator LIVE with lead pipeline. DM capture → Telegram → breakdown page. Eddie feedback applied.',
            startedAt: '2026-01-28T10:00:00',
            pinned: true,
            openItems: [
                'Outreach list template (CSV + Notion, seed from 17 handles in outreach-list.md)',
                'Clean up test leads from KV (test_baker, test_topic_check, feyintest, eddiescakerybar)',
                'Page load speed optimization (Eddie feedback — video strip lazy load?)',
                'Venue cost should change with duration in edit mode',
                'Freebie PDF — "How to sell out your workshop" (Flour Girls brand)',
                'Community setup (Instagram group / WhatsApp / Telegram — nurture layer)',
                'Three-entity visual for Rochelle (HBS + Flour Girls + Neuroglue)',
                'Remaining 6 EP artifacts (#3 market validation, #6 leverage map, #8 infoproduct, #10 pricing, #12 authority, #13 agency infra)',
                'Present EP artifacts to user in digestible format (created but not reviewed)',
                'Update Rochelle context file (outdated — Feb 1, pre-export)',
                '✅ DONE: Calculator DEPLOYED with 3 conversion fixes (DM capture, smart nudges, social proof)',
                '✅ DONE: Lead pipeline: DM capture → KV → Telegram (Workshop Leads topic) → branded breakdown page',
                '✅ DONE: Eddie feedback applied (comparison copy, savings WHY, cost visibility)',
                '✅ DONE: Telegram bot @hbsworkshop_bot — instant lead notification with IG profile link',
                '✅ DONE: Calculator page built (glassmorphic, 4-step calc, real pricing, /recursive passed)',
                '✅ DONE: Outreach list created (17 leads, 4 tiers, from Telegram export)',
                '✅ DONE: Voicemail to Rochelle (full funnel: Freebie→Calc→Email→Community→Products)',
                '✅ DONE: 3 EP artifacts created (solution context, format selection, landing page framework)',
                '✅ DONE: HBS export processed (80 VMs + 200 texts → 27 decisions, ICP, value ladder)'
            ]
        },
        {
            track: '9-5 PIPELINE (Generator Sales)',
            status: '📊 Research DONE (53 projects, 48 firms). Execution gap: need /outreach skill.',
            startedAt: '2026-02-02T09:00:00',
            openItems: [
                '🔥 LinkedIn research: Batch 1 (KOA, AEC/Engr. Oladunni, NAIRDA, Sentinel, Ekulo)',
                '🔥 SEND Mairo close message (drafted, 5+ days waiting)',
                'Register for West Africa Infrastructure Expo (Apr 7-9, Landmark Centre Lagos)',
                'Fisayo: Waiting for callback. 6 improved questions ready.',
                'Sarah/Fidson: Monitor → escalate.',
                '✅ DONE: 53 projects researched (15 hotel + 38 commercial/estate)',
                '✅ DONE: 48 architecture/MEP firms with named people',
                '✅ DONE: DSG-ranked Batch 1 ready (5 companies)',
                '✅ DONE: Data centre pipeline mapped (146.5MW+)',
                '✅ DONE: Research rubric v2 shipped (product fit, weighted scoring, DIRECT/NODE)',
                '✅ DONE: 8 contacts updated (intel + traffic + product fit)'
            ]
        },
        {
            track: 'RETAIL / FORJE',
            status: '🟢 On Our Own steering doc LIVE. Awaiting Timmy feedback. Wed Puma prep.',
            startedAt: '2026-01-31T00:00:00',
            openItems: [
                'On Our Own: Await Timmy feedback → then full generation rounds (R1-R4)',
                '✅ DONE: Mobile/visual v2 deployed (full-width nav, hero Start Here, text reduction, mobile CSS)',
                'On Our Own: SOP documentation (Aloe Labs service template)',
                'WED: Script/playbook prep with Timi for Thursday demo',
                'THU: Puma demo (₦45K pilot, Timi=commercial, Nicholas=demo)',
                'Puma proposal v2 — resolve dual pricing confusion before Wed',
                '✅ DONE: Steering doc deployed to GitHub Pages (https://ftfc1.github.io/on-our-own-brand/)',
                '✅ DONE: 14 AI images generated via kie.ai ($0.41 total, ~$0.03/image)',
                '✅ DONE: kie.ai API pipeline validated (GPT-Image-1 + Flux Kontext Pro)',
                '✅ DONE: SEALCAM analysis of wolf explorations → informed all prompts',
                '✅ DONE: Pricing (₦400K/₦350K/₦250K), trial (2mo, TG, no dashboard)',
                '✅ DONE: 6 Notion pages created + brand identity filed'
            ]
        },
        {
            track: 'VENTURES / GRM CLOTHING',
            status: '📅 Thursday meeting. Interview before building.',
            startedAt: '2026-02-08T23:00:00',
            openItems: [
                'THU: Meeting (same day as Puma demo)',
                'Interview dad (ops), SGI (numbers), Victoria/Farah (market research)',
                'Create GRM Telegram group',
                'Write bullet points + next steps from Feb 7 meeting'
            ]
        },
        {
            track: 'CREATIVE TOOLS + NOLLYAI',
            status: 'Tool landscape mapped. Stacks priced. Ready to prototype.',
            startedAt: '2026-02-07T12:00:00',
            openItems: [
                'NollyAI V1: Freepik ($9) + Higgsfield/Kling + Flow/Veo + Whisk',
                'Variant evaluation: test with real funnel page',
                'Subscription audit: Claude Code Max, Google AI Pro, Variant $20, Freepik $9'
            ]
        },
        {
            track: 'INFRASTRUCTURE',
            status: '🔥 System audit done. /outreach = #1 priority build. Stream mgmt shipped. /recursive build mode live.',
            startedAt: '2026-02-01T09:00:00',
            openItems: [
                '🔥 BUILD /outreach skill (daily execution — generates 15 personalized messages)',
                'Build /enrich skill (daily enrichment — reads captures, finds connections)',
                'Build /cockpit skill (vision + captures + connections view)',
                'HUD rotation — archive shipped items >7 days in /session-update',
                'Build /scaffold skill (guided skeleton — 2hr→30min)',
                '✅ DONE: Stream management system shipped (session map + status line + rescue + rules)',
                '✅ DONE: /recursive build mode (5 layers, spike protocol, Singer methodology)',
                '✅ DONE: System audit — 9 requirements, 30+ affordances, 5 gaps identified',
                '✅ DONE: Pipeline research consolidated (53 projects, 48 firms)',
                '✅ DONE: DB restructured 35→21 cards (REF: + LOG: + archive pattern)',
                '✅ DONE: 6 skills built (/process-convo, /checkpoint, /capture + 3 updated)'
            ]
        }
    ],

    // ═══════════════════════════════════════════════
    // WAITING — Blocked on external (compact)
    // ═══════════════════════════════════════════════
    waiting: [
        { who: 'Syam', what: 'Motor Stock business context', since: '2026-01-29' },
        { who: 'Mecano', what: 'GAD-DA 1300 series 250kVA — off market, scrap value only', since: '2026-02-02' },
        { who: '5 families', what: 'Gen decision — competing JMG quote in play. Then financing.', since: '2026-01-30' }
    ],

    // ═══════════════════════════════════════════════
    // ORGANIZATION SUGGESTIONS — HUD meta-awareness
    // ═══════════════════════════════════════════════
    suggestions: [
        {
            observation: 'BTL BEFORE ATL',
            suggestion: 'Never message above-the-line without below-the-line intel. Find companies → find BTL people → get intel → THEN ATL.'
        },
        {
            observation: 'NODE > DIRECT',
            suggestion: 'Architects/consultants (NODEs) = 5-10x pipeline multiplier. One node > ten direct contacts. Go upstream.'
        },
        {
            observation: 'INTERNAL SOURCES FIRST',
            suggestion: 'Read project.json → internal files BEFORE web search. Internal data is superior to Google.'
        },
        {
            observation: 'OPEN IN BROWSER',
            suggestion: 'Always `open` HTML outputs proactively. A notification noise is not enough — put it in their face.'
        },
        {
            observation: 'HP = HB',
            suggestion: 'Voice transcription: HP → HB (Hibiscus Studio). Verify all entity names against project.json.'
        },
        {
            observation: 'ROLLUP BEFORE ARCHIVE',
            suggestion: 'Done items → daily rollup card → THEN archive. Never archive without visual proof (INTJ/ADHD).'
        },
        {
            observation: 'ACTION > ACKNOWLEDGEMENT',
            suggestion: '"Noted as future task" = FAILURE MODE. Build it or explain why not. Don\'t just note it.'
        },
        {
            observation: 'ECOSYSTEM > LINEAR',
            suggestion: 'Different products solve different friction. Don\'t default to step-by-step chains. Think in parallel tracks.'
        }
    ],

    // ═══════════════════════════════════════════════
    // SHIPPED TODAY — Collapsed by default
    // ═══════════════════════════════════════════════
    shipped: [
        { tag: 'INFRA', item: 'SYSTEM AUDIT VIA /RECURSIVE BUILD: 9 requirements extracted, 5 affordance layers mapped (30+ affordances), fit check run. 3 passing (R1 stream survival, R3 visual proof, R5 9-5 separation). Biggest gaps: R6 pipeline volume (3/10, no /outreach), R8 enrichment (2/10, /enrich not built), R9 HUD entropy (6/10, 494 lines). /outreach = highest leverage next build.', at: '2026-02-11T21:00:00' },
        { tag: 'INFRA', item: 'STREAM MANAGEMENT SHIPPED: Session map + custom status line (statusline.sh, python3) + agent output rescue (8 outputs saved to .cache/agent-outputs/) + CLAUDE.md rules (4 mandatory) + 3 skills updated (/checkpoint, /session-update, /briefing). Status line v2: collapsed DONE count + first-word names. Cross-terminal via session map file.', at: '2026-02-11T17:00:00' },
        { tag: 'INFRA', item: '/RECURSIVE BUILD MODE UPGRADED: Spike protocol (investigate unknowns before scoring), flagged unknowns (⚠️ = can\'t evaluate, always fails), ripple rule (R changes → rubric re-derives). Singer shaping skills (github.com/rjs/shaping-skills) integrated as reference. 5 affordance layers = Singer\'s 2 + Logic + Context + Data.', at: '2026-02-11T20:00:00' },
        { tag: 'GAS', item: 'PIPELINE RESEARCH CONSOLIDATED: 4 agents → 53 projects, 48 firms, 5 Batch 1 companies (KOA, AEC w/ Engr. Oladunni, NAIRDA, Sentinel, Ekulo). Data centres: 146.5MW+. West Africa Infrastructure Expo: Apr 7-9, Landmark Centre Lagos.', at: '2026-02-11T16:00:00' },
        { tag: 'INFRA', item: 'NOTION DB RESTRUCTURED: 35→21 cards. 4-round /recursive eval. REF: prefix + Done for 7 videos. LOG: Accomplishments card (30 entries, 5 project sections). 8 TRACK: + 4 BACKLOG: archived. Board view = 13 active. memory/notion.md updated.', at: '2026-02-11T12:30:00' },
        { tag: 'INFRA', item: '3 SKILLS BUILT: /process-convo (brain dump→structured output), /checkpoint (mid-session state save), /capture (fast dump + Notion seed). All global skills in ~/.claude/skills/.', at: '2026-02-11T10:00:00' },
        { tag: 'INFRA', item: '7 VIDEO DEPOSITS TO NOTION: OpenClaw, Muji, Browser Auto, Clone Sites, First Hires, Ultralearning, Transferable Intel. Each has Highlight + Application + Connects To body. Cross-referenced to 3-4 projects each.', at: '2026-02-11T09:00:00' },
        { tag: 'FORJE', item: 'PUMA FOLD: Pricing model + trial structure + TG report template folded into Thursday Demo card body. 3 sub-items archived.', at: '2026-02-11T11:00:00' },
        { tag: 'INFRA', item: 'CAPTURE/ENRICH/COCKPIT ARCHITECTURE: Garden metaphor (seed→sprouting→active→done). /capture built. /enrich + /cockpit designed but not built yet.', at: '2026-02-11T08:00:00' },
        { tag: 'FORJE', item: 'ON OUR OWN v2 DEPLOYED: Mobile/visual pass — full-width bottom nav (two-line: number + label, horizontal scroll), hero image Start Here, ~75% text reduction across all 8 sections, mobile CSS (padding, image sizing). Rebuilt standalone (2.5MB), pushed to GitHub Pages.', at: '2026-02-10T23:30:00' },
        { tag: 'HB', item: 'LEAD PIPELINE LIVE: DM capture (IG handle) → KV storage → Telegram notification (Workshop Leads topic, 2 messages: alert with IG profile link + copy-paste DM with breakdown URL) → branded breakdown page (/calculator/b/?id=xxx). Rochelle flow: tap IG link → open DM → paste message. 2 taps to respond to a lead.', at: '2026-02-10T22:00:00' },
        { tag: 'HB', item: 'CALCULATOR 3 FIXES DEPLOYED: (1) Smart nudges — margin-based coaching with "Tap Edit inputs" guidance. (2) Social proof strip — 50+ workshops, 250+ hours, 500+ customers (real numbers). (3) Below-fold tightened — scenes removed, features heading dynamic ("What your £750 at HBS includes"), final CTA rewritten.', at: '2026-02-10T21:30:00' },
        { tag: 'HB', item: 'EDDIE FEEDBACK APPLIED: "Most venues start from" comparison copy. "Save £X/workshop — kitchen, setup & lighting all included" savings explainer. Cost breakdown line visibility increased (13px, 0.55 opacity). Voice notes transcribed via local whisper. 4 screenshots + 3 audio files processed.', at: '2026-02-10T21:00:00' },
        { tag: 'HB', item: 'BREAKDOWN PAGE CREATED: /calculator/b/?id=xxx — branded mobile-first page. Reads from KV. Shows profit, 4-stat grid, cost breakdown, venue comparison (all-inclusive), included features pills, booking CTA. Glass dark theme matching calculator.', at: '2026-02-10T20:30:00' },
        { tag: 'HB', item: 'TELEGRAM BOT SETUP: @hbsworkshop_bot in Motion x Flour group. Workshop Leads topic (thread 473). Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_THREAD_ID. 5 backend deploys.', at: '2026-02-10T21:45:00' },
        { tag: 'INFRA', item: 'SESSION PACKET: sessions/2026-02-10-hb-calculator-conversion-fixes.md — 8 decisions, 4 artifacts created, 7 tasks completed, 3 open items. Impact: 9/10.', at: '2026-02-10T22:00:00' },
        { tag: 'FORJE', item: 'ON OUR OWN STEERING DOC DEPLOYED: Brand identity steering doc live at https://ftfc1.github.io/on-our-own-brand/. Self-contained HTML (2.4MB, all images base64 JPEG). 8 interactive sections: positioning, typography, colour, mood, SEALCAM, is/not, pipeline, deliverables. Start Here orientation for client. Dark mode, collapsible sections, sticky nav.', at: '2026-02-10T19:00:00' },
        { tag: 'FORJE', item: '14 AI IMAGES GENERATED: 7 wolf mark explorations (GPT-Image-1) + 7 editorial/product (Flux Kontext Pro). Total cost: $0.41. Standout: W3 embossed (tone-on-tone on stone), W4 refined (best mark), E4 editorial (Black man, golden hour), E6 quiet confidence. kie.ai async pipeline: ~15s/image.', at: '2026-02-10T18:30:00' },
        { tag: 'FORJE', item: 'KIE.AI API PIPELINE VALIDATED: generate-teaser.sh (reusable). GPT-Image-1 for marks ($0.03/img), Flux Kontext Pro for editorial ($0.025/img). Async: POST→taskId→poll→download. Budget: $50 safe for full project (~825 images). Margin: ~80% at ₦500K Phase 1.', at: '2026-02-10T17:00:00' },
        { tag: 'FORJE', item: 'GITHUB REPO + PAGES: FTFC1/on-our-own-brand created. Standalone HTML deployed. Shareable URL for Timmy review via Telegram.', at: '2026-02-10T19:15:00' },
        { tag: 'INFRA', item: 'SESSION PACKET: sessions/2026-02-10-on-our-own-brand-identity.md — 8 decisions, 16 artifacts, 5 tasks completed, 3 open items. Cost tracking: $0.41/14 images.', at: '2026-02-10T19:30:00' },
        { tag: 'HB', item: 'CALCULATOR PAGE BUILT: Glassmorphic mobile-first landing page. 4-step calculator (ticket price, attendee chips, duration chips, anchored venue cost). Real backend pricing (6hr=£345, 8hr=£465, 12hr=£645). Savings comparison with fallback. Video strip (4 clips, 480px CRF 26). Hybrid scene mode. Before/after venue comparison. Sticky mobile bar. All CTAs → hibiscusstudio.co.uk/book/. /recursive rubric: 5×9, 5×8. Adversarial PASSED.', at: '2026-02-09T23:30:00' },
        { tag: 'HB', item: 'OUTREACH LIST: 17 profile leads from Telegram export. Tier 1 bakers (3): Eddie\'s Cake Bar (warmest, booked Apr 19), Rukhiyas, Fermentarium. Tier 2 beauty (8). Tier 3 workshop ops (4). Tier 4 adjacent (3). 17 content references. Francesca London Lash email captured.', at: '2026-02-09T23:00:00' },
        { tag: 'HB', item: 'ADDRESS CORRECTED: project.json entity updated from "Camberwell, SE5" to "19a Peto Street North, London E16 1DP". Google Maps link added to calculator page.', at: '2026-02-09T23:15:00' },
        { tag: 'INFRA', item: 'HUD v3: Section nav (sticky bar + keyboard arrows), TOOLKIT section (12 tools), anti-checklist repositioned, collapsible DO NEXT, scroll spy highlights.', at: '2026-02-09T23:45:00' },
        { tag: 'INFRA', item: 'LAUNCH CODE SYSTEM: sessions/LAUNCH.md — paste-ready prompt for new sessions. /session-update skill auto-regenerates it.', at: '2026-02-09T23:30:00' },
        { tag: 'INFRA', item: 'HUD REDESIGNED: Collapsible tracks, wins (show 3), shipped filter by tag, staleness colors, doNext as steps. index.html (proper name). One-shot rebuild.', at: '2026-02-09T22:15:00' },
        { tag: 'FORJE', item: 'BRAND IDENTITY FILED: On Our Own brief + PDF → retail/on-our-own/ with BRIEF-SUMMARY.md. project.json + memory updated. PRL elevated streetwear (wolf symbol, Fear of God positioning).', at: '2026-02-09T22:00:00' },
        { tag: 'INFRA', item: '6 TRACK CONTEXT CARDS IN NOTION: Pipeline, HB Studio, FORJE, Ventures/GRM, Infrastructure, Creative. Each has Key Files, Current State, Next Actions, Open Blockers. Bullets + bold headings.', at: '2026-02-09T21:45:00' },
        { tag: 'INFRA', item: 'MEMORY SPLIT: MEMORY.md (49-line index) + 4 topic files (notion.md, pipeline.md, projects.md, ways-of-working.md). Prevents 200-line truncation. Contact cache built (8 contacts).', at: '2026-02-09T21:35:00' },
        { tag: 'HB', item: 'FUNNEL VISION VOICEMAIL: hb/2026-02-09-funnel-vision-voicemail.md — Full funnel (Freebie→Calc→Email→Community→Products). Three-entity structure. Revenue chain updated (community layer added).', at: '2026-02-09T21:32:00' },
        { tag: 'INFRA', item: 'SESSION PACKET: sessions/2026-02-09-crash-recovery-pipeline-puma.md — 7 decisions, 4 artifacts, 12 tasks, 8 open items. Crash recovery pattern documented (2nd time).', at: '2026-02-09T21:30:00' },
        { tag: 'INFRA', item: 'RECURSIVE AUDIT: 3 repeated errors codified (HP/HB confusion, PDF image crash, voice speaker attribution), 2 repeated lookups cached (Notion schema, contact page IDs), 3 process gaps standardized (archive-on-complete, body content for next AI, conversation processing workflow). All written to MEMORY.md.', at: '2026-02-09T21:15:00' },
        { tag: 'INFRA', item: 'NOTION CLEANUP: 23 pages archived (19 Done + 4 vague). 5 statuses corrected to Done. 7 page bodies enriched with file paths + bullets + headings. 1 wrong page deleted (HP Studio). Lifecycle standardized: Done → archive immediately, bodies always have file paths.', at: '2026-02-09T20:30:00' },
        { tag: 'FORJE', item: 'PUMA DECISIONS CAPTURED: Pricing (1-5 stores ₦400K, 6-10 ₦350K, 10+ ₦250K). Trial (2 months, TG group, reports, no dashboard, monthly/fortnightly reviews). Demo agenda (platform walkthrough, certification plan, problems+solutions, success metrics). 6 Notion pages created via curl. Local backup: retail/puma/PUMA_PILOT_PROPOSAL.md.', at: '2026-02-09T19:30:00' },
        { tag: 'GAS', item: 'PRODUCT FIT DIMENSION ADDED: Gas/Diesel/Both classification in pipeline-research-rubric.md. Key numbers from PDFs (1MW diesel $220K vs gas $700K, 42% annual savings). All 8 contacts classified. Adesola=GAS, Elizabeth=DIESEL, Ekokifo=GAS, Daniel=BOTH, Ifeanyi=GAS, Olujide=BOTH, Bilikisu=DIESEL, Stephanie=DIESEL.', at: '2026-02-09T18:00:00' },
        { tag: 'GAS', item: '8 NOTION CONTACTS FULLY UPDATED: Intel Gathered + Traffic Light + Next Action + Product Fit for all. 3 GREEN (Olujide 49/55, Bilikisu 47/55, Stephanie 38/55 — all nodes, Tier A). 5 YELLOW (Adesola 34/50, Elizabeth 28/50 downgraded, Ekokifo 29/45, Daniel 23/45, Ifeanyi 25/45). Elizabeth softened: she said "I\'ll reach out" = on HER timeline.', at: '2026-02-09T17:30:00' },
        { tag: 'GAS', item: 'RESEARCH RUBRIC v2 SHIPPED: /recursive pass with 4 DSG docs (Profiling Guide, ICP Outline, Lead List Building, Multi-Account Mastery). Universal Framework added (hypothesis-first, traffic light 🟢🟡🔴🟠, trigger events, COI, buying window). All 5 types rewritten with weighted scoring. DIRECT scoring /45, DIRECT-PORTFOLIO /50, NODE /55. 8 Feb-10 contacts re-scored: 3 GREEN (Olujide, Bilikisu, Stephanie = nodes), 5 YELLOW (Baker Hughes, UPDC, Aiderr, 7Up, UAC = directs). Calibration rules: target 30% GREEN. VOICE NOTE CORRECTIONS: product fit (gas/diesel/both), Olujide+Bilikisu NOT connected on LinkedIn, Elizabeth needs softer approach, pipeline volume too low, Mikano = generators only (no IPP).', at: '2026-02-09T21:00:00' },
        { tag: 'GAS', item: 'NEXT ACTION DATES SET (22 contacts): Feb 10 = active convos + BTL (Elizabeth R2, Adesola R1, Stephanie R1, Daniel P2, Ifeanyi P2, Ekokifo P2, Olujide P1, Bilikisu P1). Feb 11 = Tier A ATL (Umele, Emmanuel, Ben, John, Saheed, Olanrewaju, Olugbenga, Rafiu). Feb 12 = Tier B ATL + escalations (Gbenga, Ndubuisi, Chukwudi, Segun, Olatunde, Stephen Adekogbe, Sarah/Fidson). Mairo SENT (follow up Feb 12). Fisayo call questions improved (6 Qs + referral check-in).', at: '2026-02-09T15:00:00' },
        { tag: 'GAS', item: 'DSG EXEC PLAN CLEANED: 40/41 old blocks deleted. GojiberryAI ASSESSED (don\'t buy — referral model works, Sales Nav if spending). Next Action Date property added to database. Next Actions filtered table view = most useful Notion view.', at: '2026-02-09T14:30:00' },
        { tag: 'GAS', item: 'NOTION DB FULLY BUILT: 32 contacts (20 batch-added from LinkedIn export via curl). Schema: Account Tier, Stage (P0-P5/R0-R4/Dead), Traffic Light, Action Week, Seniority (ATL/BTL), Intel Gathered, Channel, Last Contact. 3 rounds of corrections: 5 dead leads marked (Gasavant=competitor extracting pipeline, Unigaz=fuel incompatibility, Axxela=soft no, AmTower=existing customer, TOFA=not my lead). 7 BTL→ATL reclassified (engineering managers, power plant managers, ops heads). Fidson UPGRADED to R2 (engineering team actively engaged). All 25 active contacts set to W/C Feb 10. DSG Execution Plan page updated with current pipeline state.', at: '2026-02-09T14:00:00' },
        { tag: 'GAS', item: 'PIPELINE RESPONSE RUBRIC: 6-step daily messaging system — profiling stages (P0-P5), prospecting stages (R0-R4), 7-criteria quality rubric (28/35 threshold), 5-question stress test, copy-paste checklist, send timing table, company-level context. Mario worked example scored (29/35 winner). Sources: DSG First 90 Days (40%), profiling scripts (25%), Mario session (20%), lead strategy (10%), general knowledge (5% — timing table unsourced, flagged).', at: '2026-02-09T12:00:00' },
        { tag: 'GAS', item: 'MARIO REPLY STRATEGY: Value-first approach (not extractive questions). 5 options generated (TEACH/TOOL/MIRROR/BRIDGE/STORY), scored through 3-pass rubric. Winner: STORY angle — scope creep on power scenario. 2 messages ready, send after 2pm. Stage: P3 (profiling, intel gathered, must give value).', at: '2026-02-09T11:30:00' },
        { tag: 'GAS', item: 'DSG FIRST 90 DAYS DOC: Copied from external path to learn/Reference/Sales_Strategy/. Key: ICP development, trigger events, RIQ method, profiling calls with non-decision-makers, HPP list, 30/60/90 structure, status quo as #1 competitor.', at: '2026-02-09T10:30:00' },
        { tag: 'INFRA', item: 'REFERENCES SPLIT + FILED: OpenClaw (ventures/openclaw/, architecture only), Decart virtual try-on (retail/tools/, scored 4/5), Diataxis taxonomy (learn/references/, applies to all docs). Meng To paradigms kept with OpenClaw (workflow patterns). Each in correct project directory.', at: '2026-02-09T09:00:00' },
        { tag: 'GRM', item: 'GRM CLOTHING PROJECT ONBOARDED: ventures/grm/project.json created — luxury tailoring ($800-$1K custom), Farah (brand) + Nico (RevOps), decision rubric (5 criteria, 4/5+ = build), editorial brand vision (Vogue refs, Nigerian photographer). Meeting notes + ways of working PDF processed.', at: '2026-02-09T02:15:00' },
        { tag: 'INFRA', item: 'RECURSIVE SELF-AUDIT: Scored 0/10 criteria at 9+. Root cause: optimizing for task completion not value delivery. Fixed: 7 new MEMORY.md rules, self-audit checklist in /session-update skill, shareable HTML for Rochelle, Monday crossover surfaced.', at: '2026-02-09T02:00:00' },
        { tag: 'HB', item: 'CALCULATOR GATING CORRECTED: Section 5 rewritten — gated quiz funnel (email before results), two paths: local → booking, non-local → Workshop OS/template/PDF. Non-local bakers = separate revenue stream.', at: '2026-02-09T01:45:00' },
        { tag: 'HB', item: 'SESSION SUMMARY HTML: Shareable Rochelle-ready output. Mobile-friendly (600px max), dark mode, visual cards, bullet lists, three-entity visual. Opened in browser.', at: '2026-02-09T01:30:00' },
        { tag: 'INFRA', item: 'FULL WORK MAP: 42+ items across 7 tracks (9-5 GAS, Retail FORJE, HB, Aloe Labs, Creative, Infrastructure, Ventures/GRM). Corrected: Puma=retail, DSG Lindy≠action item, pipeline thin, Workshop OS=2 months.', at: '2026-02-09T01:15:00' },
        { tag: 'HB', item: 'EP SOLUTION CONTEXT PROFILE: 4-layer problem map (surface→root), value chain (£0→£22.8K/yr per baker), 5 moats (kitchen, community, Acuity, 3-entity, Aloe Labs), evolution path. Created from real conversation data (80 VMs), not hypothetical exercises.', at: '2026-02-09T00:45:00' },
        { tag: 'HB', item: 'EP FORMAT SELECTION: All HB offerings mapped to Education/Automation/Implementation. Value ladder CORRECTED — custom funnel is SEPARATE offering (not chain step). Combination strategy. Aloe Labs dual-purpose lens.', at: '2026-02-09T00:45:00' },
        { tag: 'HB', item: 'EP LANDING PAGE FRAMEWORK: Calculator page spec — 7 sections (hero, calculator UI, PAS, social proof, capture, trust, CTA). 3 A/B headline options. 6 psychological triggers. Mobile-first. "Don\'t gate calculator — capture AFTER they see profit number."', at: '2026-02-09T00:45:00' },
        { tag: 'HB', item: 'PROJECT.JSON v2: Enriched with customer profile, economics (real £ numbers), pipeline (Eddie booked, TikTok baker warm), sources (5 key files), corrected offerings structure, EP artifacts needed list (6 remaining).', at: '2026-02-09T00:30:00' },
        { tag: 'HB', item: 'EP STATUS MAP: 17 EP lessons scanned → 6 already have (better, from real data), 9 should create, 2 later phase. Top 3 created. Process is reusable across all projects.', at: '2026-02-09T00:15:00' },
        { tag: 'INFRA', item: 'REPO REORG COMPLETE: PARA numbering killed, plain names (hb/, retail/, inbox/, sessions/, learn/, archive/). 20+ moves in single bash command. project.json manifests for 3 projects. SYSTEM_DESIGN v2 written. All path refs updated (artifact-index 35+, HUD 40+, CLAUDE.md 7, MEMORY.md 5).', at: '2026-02-08T23:30:00' },
        { tag: 'INFRA', item: '/recursive skill shipped: Works on ANY content type (not fixed list). 9/10 threshold, 6 pre-built rubrics, multi-pass verification mode, self-correcting approach, voice-friendly. Source: @maxwellfinn/@VibeMarketer_.', at: '2026-02-08T21:00:00' },
        { tag: 'INFRA', item: 'SYSTEM_DESIGN v2: Removed aspirational SQLite layer, added HUD pattern + session architecture + ways of working. ASCII diagrams, 158 lines. Integration map: SYSTEM_DESIGN → sessions → HUD → CLAUDE.md → MEMORY.md.', at: '2026-02-08T23:15:00' },
        { tag: 'INFRA', item: 'project.json manifests: hb/ (venue, entities, value ladder), retail/ (FORJE, contracted PRL), mikano/ (dormant, generators). Machine-readable metadata per project.', at: '2026-02-08T23:00:00' },
        { tag: 'HB', item: 'MASTER WRITEUP: 56 items total, dependency graph, optimal task sequence, crossover map (final). Landscape fully mapped for first time. Saved to sessions/2026-02-07-MASTER-WRITEUP.md', at: '2026-02-07T17:30:00' },
        { tag: 'HB', item: 'HBS EXPORT FULLY PROCESSED: 80 VMs + 200 texts + 4 PDFs → 27 decisions, value ladder (freebie→calc→booking→custom→OS), ICP=bakers, outreach machine plan, 15 people identified, 17 open questions. Saved to inbox/Friday CR/05-CONSOLIDATED-ANALYSIS.md', at: '2026-02-07T17:00:00' },
        { tag: 'HB', item: 'Voice note processed: 45 items extracted across 6 projects, 9 correction rounds, crossover map built. Context fully loaded for HB + GAS + NollyAI + Infra.', at: '2026-02-07T14:00:00' },
        { tag: 'INFRA', item: 'Notion in-progress items pulled: 11 items with all embedded links, PDFs, context. Workshop Discovery (4 links), DSG Lindy Pack (7 PDFs), Exploration (4 tool URLs).', at: '2026-02-07T13:30:00' },
        { tag: 'ALOE', item: 'NollyAI tool research: Freepik $9/mo + Higgsfield (Kling inside) + Flow (AI Pro) + Whisk. Google Whisk vs Flow documented. Recommended stack: $9-16/month.', at: '2026-02-07T13:00:00' },
        { tag: 'INFRA', item: 'Image/video gen workflows located: EP Module 5 (complete pipeline), video-kb (2 analyzed videos), INSIGHTS-PARKING.md (actionable items). NanoBanana Pro pipeline documented.', at: '2026-02-07T12:45:00' },
        { tag: 'INFRA', item: 'Session packet: Friday exports context loading (12 decisions, 3 artifacts, 45 items extracted, tool landscape mapped).', at: '2026-02-07T14:00:00' },
        { tag: 'HB', item: 'HBS export processing launched: 5 parallel agents reading 80 VMs + 200 texts + PDFs from Cousin Rochelle BIZ (Feb 2-5).', at: '2026-02-07T14:15:00' },
        { tag: 'INFRA', item: 'EP Telegram group exported to learn/courses/ep-ai-frontrunners/Start - Feb 7 Export/ (messages ×3, photos, videos, files).', at: '2026-02-07T12:00:00' },
        { tag: 'GAS', item: 'Mario reply ready: Follow-up questions about spec process + rental demand. Traffic Light: Green. Intel: MEP consultants drive decisions, early engagement window, construction backup opportunity.', at: '2026-02-06T22:00:00' },
        { tag: 'INFRA', item: 'Notion MCP workaround documented in CLAUDE.md: Direct API via curl + JSON files. MCP patch-page has JSON parsing bug. Pattern tested, working.', at: '2026-02-06T21:45:00' },
        { tag: 'GAS', item: 'Mario Notion profile updated via curl: Traffic Light Green, Intel Gathered (process intel), Next Action (reply ready). 3 successful API calls.', at: '2026-02-06T21:30:00' },
        { tag: 'HB', item: 'Duration-aware reschedule: Admin modal generates correct time slots per booking duration (was always 6h). generateDurationSlots() + /api/availability?duration=X. Bose can now be rescheduled with 2h slots.', at: '2026-02-06T18:45:00' },
        { tag: 'HB', item: 'Notion sync: "Double Booking Test" marked Done. MCP post-page has JSON serialization bug — use curl + JSON file pattern for new pages.', at: '2026-02-06T19:00:00' },
        { tag: 'HB', item: 'CRITICAL: Pricing bug fixed — 3 event-type-specific tables (Content £90/2h, Workshop £120/2h, Event Hire £345/4h). Was charging £465 for all types.', at: '2026-02-06T17:30:00' },
        { tag: 'HB', item: 'Dashboard crash recovered — safeJsonParse strips markdown code fences, corrupted KV entries skipped gracefully', at: '2026-02-06T16:30:00' },
        { tag: 'HB', item: 'London timezone enforced — getLondonNow()/getLondonToday() helpers replace all new Date() in business logic', at: '2026-02-06T17:00:00' },
        { tag: 'HB', item: 'Bose booking corrected: KV override (£90), calendar event synced, email+date dedup prevents duplicates', at: '2026-02-06T17:15:00' },
        { tag: 'HB', item: 'Admin sync-calendar endpoint: POST /api/admin/bookings/:id/sync-calendar — recreate calendar events for KV bookings', at: '2026-02-06T17:20:00' },
        { tag: 'HB', item: 'Session packet: HB pricing bug fix (6 decisions, 4 artifacts, 5 tasks completed)', at: '2026-02-06T17:30:00' },
        { tag: 'GAS', item: 'Pipeline Power visual v12: Bebas Neue + Work Sans typography (strategic - large headlines only), dark top banner, flat gradients. 6 layout options via /ui-explore → Treatment G picked. Generator naming: Perkins York / MTU Gas (250kVA - 2MW). Screenshot-ready, non-AI aesthetic.', at: '2026-02-05T17:15:00' },
        { tag: 'INFRA', item: 'Session packet: Pipeline layout + font exploration (4 decisions, 7 HTML artifacts, typography principles captured, /ui-explore pattern validated)', at: '2026-02-05T17:15:00' },
        { tag: 'GAS', item: 'Pipeline Power referral visual v4: Bento box layout with SVG icons (no emojis), Inter font, Nigerian B2B copy. NNPC badge corrected, Fehintola name fixed. Parallel agents (UX + Copy) merged. Screenshot-ready.', at: '2026-02-05T15:45:00' },
        { tag: 'INFRA', item: 'Session packet: Pipeline Power visual (5 decisions, 4 HTML versions, parallel agent pattern, impeccable design thinking applied)', at: '2026-02-05T15:45:00' },
        { tag: 'HB', item: 'CRITICAL FIX DEPLOYED: Double-booking bug fixed (backend queries both calendars, frontend hides unavailable dates). Feb 21 conflict root cause = TODO comment skipping availability checks. Tested live: Feb weekends blocked, weekdays available. Version c57b9ecd deployed.', at: '2026-02-04T23:30:00' },
        { tag: 'HB', item: 'Frontend UX: "STAR UX" achieved - async date rendering checks availability before display, loading spinner, empty state with calendar icon, proper centering. Commits eeea138, 21445dd, 2eb9047 deployed via GitHub Pages.', at: '2026-02-04T23:15:00' },
        { tag: 'HB', item: 'Capacity analysis: All Feb weekends 0/4 slots, weekdays mostly open. Provided 7 tactical/strategic options (weekday discount, March push, waitlist, dynamic pricing, block booking, capacity expansion). Email template sent to owner.', at: '2026-02-04T23:00:00' },
        { tag: 'HB', item: 'Diagnostic script: test-calendar-permissions.js (tests both calendars, lists events, checks freeBusy). Used to verify Feb 21 conflict and test fix.', at: '2026-02-04T21:30:00' },
        { tag: 'HB', item: 'Session packet: Double-booking fix (5 decisions, 7 artifacts, testing documented, capacity options included)', at: '2026-02-04T23:30:00' },
        { tag: 'INFRA', item: '/briefing Notion integration: Pulls "Aloe Labs Work" database (In Progress with full context, Not Started high-level), cached in artifact index', at: '2026-02-05T01:50:00' },
        { tag: 'INFRA', item: 'Session packet: Briefing Notion integration (2 decisions, 2 artifacts, cache-first pattern)', at: '2026-02-05T01:50:00' },
        { tag: 'HB', item: 'DEPLOYED: 2-hour slot setup/pack fix (20 min each → 1h 20m actual time, was -30 min). Commit b11dc0c live at hibiscusstudio.co.uk/book', at: '2026-02-05T01:30:00' },
        { tag: 'HB', item: 'DEPLOYED: 9 booking funnel fixes (Content Creation visible, pricing correct, viewing flow). Commit 641e4ca live at hibiscusstudio.co.uk/book', at: '2026-02-05T01:15:00' },
        { tag: 'HB', item: 'Notion ticket workflow: Created "Fix 2-Hour Slot Setup/Pack Down" → In Progress → Done. Tagged HB Studio.', at: '2026-02-05T01:25:00' },
        { tag: 'INFRA', item: 'Setup/pack analysis table: All event types, all durations, current vs recommended times. User scoped to 2h slots only.', at: '2026-02-05T01:10:00' },
        { tag: 'HB', item: 'Session packet: HB booking deployment + 2h fix (2 decisions, 3 artifacts, deployment workflow documented)', at: '2026-02-05T01:33:00' },
        { tag: 'HB', item: 'Workshop lead gen strategy: Sourdough/baking ICP (kitchen = moat, £750-£1020/workshop vs £500 yoga). Exa search simplified (2-3 criteria), manual filter = 10 min. Query ready.', at: '2026-02-04T22:30:00' },
        { tag: 'HB', item: 'Session packet: HB workshop lead gen via Exa (3 decisions, 2 artifacts, ICP pivot yoga→baking, Exa optimization, manual filter process)', at: '2026-02-04T22:30:00' },
        { tag: 'GAS', item: 'Fidson qualification materials: Email (3 discovery questions), LinkedIn reply, discovery script (red flags, green flags, when to offer site visit)', at: '2026-02-04T20:30:00' },
        { tag: 'HB', item: 'Booking funnel: 9 critical fixes (Content Creation visible + pricing, workshop pricing correct, isViewing reset bug, 2h time slots, Popular badge, Tuesday filter, progress bar, fonts, bot protection)', at: '2026-02-04T22:15:00' },
        { tag: 'HB', item: 'Puppeteer automated testing: 15 tests, 100% pass rate (bridal flow, content 2h, viewing flow)', at: '2026-02-04T22:00:00' },
        { tag: 'HB', item: 'Notion integration: 9 project cards created, bulk-tagged "HB Studio", API scripts (setup, create, tag)', at: '2026-02-04T22:10:00' },
        { tag: 'HB', item: 'Session packet: HB booking funnel fixes (8 decisions, 11 artifacts, testing approach documented)', at: '2026-02-04T22:15:00' },
        { tag: 'GAS', item: 'Fisayo WhatsApp visual v2: Red/brown brand, developer-focused, verified claims only (removed 44% downtime, 60-70% reduction), SVG icons, MTU/Perkins separated, 540px optimized', at: '2026-02-04T19:30:00' },
        { tag: 'GAS', item: 'EP research extracted: 4 files (research-summary, competitive-edges, value-gap-calculation, dimension-2-keywords) - market validation STRONG GO, but fact-checked unverified claims', at: '2026-02-04T17:15:00' },
        { tag: 'GAS', item: 'Fisayo internal sales brief: Qualification questions, red flags, value props by size, talk tracks, prioritization matrix', at: '2026-02-04T16:45:00' },
        { tag: 'GAS', item: 'Fisayo intro message templates: Long/short WhatsApp versions, follow-up, usage notes', at: '2026-02-04T16:30:00' },
        { tag: 'GAS', item: 'Session packet: Fisayo WhatsApp visual (8 decisions, 6 artifacts, EP fact-check applied, audience correction)', at: '2026-02-04T19:30:00' },
        { tag: 'HB', item: 'Agency positioning EP analysis: Applied M2/M3 frameworks, separated HB (anchor) vs Princess (scalable), 4-step intake designed, payment terms (50/50), pricing tiers (Simple/Standard/Premium)', at: '2026-02-04T14:30:00' },
        { tag: 'HB', item: 'Session packet: Agency positioning via EP analysis (5 decisions, 3 artifacts, Princess intake + pricing + workshop scope)', at: '2026-02-04T14:30:00' },
        { tag: 'INFRA', item: 'Global skills migration: 23 commands → global (briefing, session-update, video, tm, all design polish tools)', at: '2026-02-03T15:50:00' },
        { tag: 'INFRA', item: 'Fixed briefing + session-update: Replaced with comprehensive versions (not simple ones)', at: '2026-02-03T15:48:00' },
        { tag: 'INFRA', item: 'Updated artifact index: briefing.md + video.md paths now point to global skills', at: '2026-02-03T15:46:00' },
        { tag: 'GAS', item: 'Partner brief v2: British English, 48h site visits, ease emphasis, 15-min call CTA (MD + HTML)', at: '2026-02-03T13:25:00' },
        { tag: 'GAS', item: 'Qualification call script: 6 questions to assess pipeline + influence', at: '2026-02-03T13:20:00' },
        { tag: 'GAS', item: 'Initial follow-up message template', at: '2026-02-03T13:15:00' },
        { tag: 'INFRA', item: '/video skill: 4 sub-commands (dashboard, process, search, insights) + download fallbacks', at: '2026-02-03T11:40:00' },
        { tag: 'INFRA', item: 'INSIGHTS-PARKING.md: Video insights parking lot (2 insights from today)', at: '2026-02-03T11:37:00' },
        { tag: 'INFRA', item: 'Day log system: 24h neurodivergent template, reflection questions, Do Tomorrow box', at: '2026-02-03T03:00:00' },
        { tag: 'INFRA', item: 'Daily Manifest research (time awareness via articulation, 4-hour rule, neurodivergent patterns)', at: '2026-02-03T01:30:00' },
        { tag: 'INFRA', item: 'CLAUDE.md: Sources 80/20 rule (verify correct context used)', at: '2026-02-03T02:30:00' },
        { tag: 'INFRA', item: 'Tasks HUD: /projects/tasks/ (voice-first task management)', at: '2026-02-03T02:00:00' },
        { tag: 'INFRA', item: '7-agent parallel audit (C1-C7): CLAUDE.md, indexes, file structure, skills', at: '2026-02-03T01:30:00' },
        { tag: 'INFRA', item: 'PARALLEL-AUDIT-RESULTS.html: Consolidated findings', at: '2026-02-03T01:30:00' },
        { tag: 'INFRA', item: 'CLAUDE.md: Tasks HUD section + Sources 80/20 rule', at: '2026-02-03T01:45:00' },
        { tag: 'INFRA', item: 'ways-of-working.csv: 5 new patterns (parallel_agents, no_whatsapp, etc.)', at: '2026-02-03T01:00:00' },
        { tag: 'GAS', item: 'Strategy pivot: Referral engine model validated (Fisayo = 7 referrals)', at: '2026-02-02T19:30:00' },
        { tag: 'GAS', item: 'Session packet: Generator sales strategy pivot (Nigerian reality check)', at: '2026-02-02T19:15:00' },
        { tag: 'GAS', item: 'Master Review v2 (explanations: 20→10 min, alerts dashboard, triggers A→B)', at: '2026-02-02T18:30:00' },
        { tag: 'INFRA', item: 'CLAUDE.md: data.js pattern + terminal/browser layout', at: '2026-02-02T18:00:00' },
        { tag: 'GAS', item: 'LinkedIn analysis: 91 leads, MEP 3.7x better, 17 files', at: '2026-02-02T17:00:00' },
        { tag: 'INFRA', item: '/briefing auto-updates HUD on staleness', at: '2026-02-02T15:30:00' },
        { tag: 'HB', item: 'Francesca booking (£645, HB-FEB26WORKSHOP)', at: '2026-02-02T14:30:00' }
    ],

    // ═══════════════════════════════════════════════
    // NOTES — Quick reference
    // ═══════════════════════════════════════════════
    notes: {
        title: 'QUICK REF',
        sections: [
            {
                label: 'Monday Focus (9-5):',
                items: [
                    '1. LinkedIn lead list',
                    '2. Sales pipeline setup',
                    '3. Plan revenue generation'
                ]
            },
            {
                label: 'Separate Tracks:',
                items: [
                    '○ HB Studio (Princess quote pending)',
                    '○ Infrastructure (video skill, Notion HUD)',
                    '○ Other projects (handled separately)'
                ]
            },
            {
                label: 'Completed (Feb 1-2):',
                items: [
                    '✓ Artifact Index + Validation gates',
                    '✓ Francesca booking + Timeline visual',
                    '✓ /ui-explore skill'
                ]
            }
        ],
        footer: 'Wed Feb 11 9pm — System audit: /outreach = #1 gap. Stream mgmt SHIPPED. Pipeline: 53 projects, 48 firms. /recursive build mode live. TOMORROW (Thu): Puma demo + GRM meeting + Mairo close message + Batch 1 LinkedIn research.'
    }
};
