// HUD v4 Data — Redesigned 2026-02-11
// Focus: North Star → Mid-Goals → Projects → Build Queue (all connected)
// Last updated: 2026-02-13T00:30 (conv ops platform converged, EP validated, Flower Girl = next build)
// CANONICAL SOURCE — all skills update THIS file, not data.js
// BUILD QUEUE: grouped by crossover. Each item links to a mid-goal.

const hud = {

  northStar: 'Own office. Own schedule. Gym when I want. Because of SYSTEMS.',
  northStarDeadline: 'March 2026',

  now: 'DEEP SESSION Feb 14: 12 Traits baseline (47/60, governor=2/5), 3-agent convergence (regulate+sell+build), neurodivergent curriculum, pipeline audit, build backlog. PUMA fixes tomorrow → trial Tue. Governor training starts NOW.',

  // ═══════════════════════════════════════════════
  //  QUICK LINKS — deployed things, one click away
  // ═══════════════════════════════════════════════
  links: [
    // Deployed products
    { label: 'HB Calculator', url: 'https://hibiscusstudio.co.uk/calculator/explore.html' },
    { label: 'HB Booking', url: 'https://hibiscusstudio.co.uk/book' },
    { label: 'HB Admin', url: 'https://hibiscusstudio.co.uk/admin' },
    { label: 'Puma Training', url: 'https://ftfc1.github.io/puma-training-demo/course-outline.html' },
    { label: 'On Our Own', url: 'https://ftfc1.github.io/on-our-own-brand/' },
    { label: 'Timi Brief', url: 'https://ftfc1.github.io/puma-demo-brief/' },
    // Infrastructure (local — absolute file:// paths)
    { label: 'Stream Manual', url: 'file:///Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/.bin/STREAM-MANUAL.html' },
    { label: 'RAISED Lifecycle', url: 'file:///Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/.bin/RAISED-LIFECYCLE.html' },
    { label: 'GRM Interview Qs', url: 'file:///Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/ventures/grm/interview-questions.html' },
  ],

  // ═══════════════════════════════════════════════
  //  NOUN PROJECT ICONS (filled, 200px PNG)
  //  URL pattern: https://static.thenounproject.com/png/{id}-200.png
  // ═══════════════════════════════════════════════
  icons: {
    target: 8214275,      // North Star
    gear: 8207311,        // Infrastructure (confirmed solid)
    handshake: 8258230,   // Active Deals
    flask: 7519186,       // Aloe Labs
    capture: 8271074,     // Capture & Crossover
    trophy: 8275855,      // Wins
    rocket: 8261801,      // Projects
  },

  // ═══════════════════════════════════════════════
  //  3 MOVES — strategic mid-goals that bridge
  //  projects → build items → north star
  // ═══════════════════════════════════════════════
  midGoals: [
    {
      name: 'Workshop Funnel Live',
      detail: 'Calculator BUILT → outreach list + freebie PDF. Position to sell AND receive.',
      status: 'in-progress',
      serves: 'HB can generate leads AND convert them.',
      projects: ['HB'],
    },
    {
      name: '3 Deals Closing',
      detail: 'Puma pilot APPROVED (trial starts Tue) + generator close (Mairo, send msg) + GRM discovery (2 interviews left).',
      status: 'in-progress',
      serves: 'Each deal = Aloe Labs case study. Revenue from 3 different channels.',
      projects: ['FORJE', 'GRM', 'GAS'],
    },
    {
      name: 'Pipeline Executing',
      detail: '/outreach skill + Batch 1 LinkedIn + daily 15 messages. Research done → last mile.',
      status: 'not-started',
      serves: '9-5 revenue engine. 53 projects, 48 firms researched.',
      projects: ['GAS', 'INFRA'],
    },
  ],

  // ═══════════════════════════════════════════════
  //  PROJECTS — each shows what it produces for others
  // ═══════════════════════════════════════════════
  projects: [
    {
      key: 'HB',
      name: 'HB Studio',
      status: 'live',
      statusText: 'Calculator live → DM capture → Telegram notif → breakdown page',
      liveItems: ['Calculator + explore page', 'Booking system', 'Admin panel', 'Lead pipeline (DM → Telegram → breakdown)'],
      feedsInto: ['GRM gets adapted booking engine', 'Aloe Labs gets first case study', 'Puma gets lead pipeline pattern'],
      nextBuild: 'Outreach list + freebie PDF',
    },
    {
      key: 'FORJE',
      name: 'Puma / FORJE',
      status: 'trial-approved',
      statusText: 'DEMO DELIVERED. Trial approved — 6 weeks free pilot, Puma Lekki. Start Tuesday.',
      liveItems: ['Quiz bot v2.5 (@prlpuma_bot — DM-first, 4 quizzes + 3 games)', 'Demo site (3 games + speaker notes on GitHub Pages)', 'Light mode speaker notes + branded weekly report', '7 AI images via kie.ai ($0.205)', '6 missions written'],
      feedsInto: ['Training as a service platform (first client)', 'Aloe Labs gets corporate case study', 'Onboarding bot pattern (quiz = intake form)', 'Any retail store = potential client'],
      nextBuild: 'Compress lessons (2-3 pages). Get staff TG accounts. Start trial Tuesday.',
    },
    {
      key: 'GAS',
      name: '9-5 Pipeline',
      status: 'research-done',
      statusText: 'Research DONE (53 projects, 48 firms). Need /outreach skill for daily execution.',
      liveItems: ['Pipeline rubric (DIRECT/NODE/PORT)', 'Contact cache (8 contacts)', 'Notion DB (32 contacts)', 'Research: 48 MEP/arch firms + 53 projects'],
      feedsInto: ['Revenue funds everything', 'Node relationships feed ALL projects'],
      nextBuild: 'Build /outreach skill → LinkedIn Batch 1 (KOA, AEC, NAIRDA, Sentinel, Ekulo)',
    },
    {
      key: 'GRM',
      name: 'GRM Clothing',
      status: 'discovery',
      statusText: 'Meeting Thursday, interview questions READY',
      feedsInto: ['HB gets luxury positioning reference', 'Aloe Labs gets third case study (Rule of Three)'],
      nextBuild: 'Execute interviews Thu (33 Qs, progressive disclosure HTML)',
    },
    {
      key: 'ALOE',
      name: 'Aloe Labs',
      status: 'building',
      statusText: 'Internal page + visual concepts in progress',
      feedsInto: ['ALL projects get better tooling', 'ALL projects get consistent process'],
      nextBuild: 'MASTER.html Round 2 + GitHub Pages deploy',
    },
  ],

  // ═══════════════════════════════════════════════
  //  BUILD QUEUE — grouped by crossover
  //  when: 'today' | 'this-week' | 'this-month' | 'eventually'
  //  Each group shows HOW items compound. Large items broken into steps.
  // ═══════════════════════════════════════════════
  buildGroups: [
    {
      group: 'INFRASTRUCTURE',
      icon: 8207311,
      why: 'Build capacity → everything else gets faster',
      crossover: ['Every project benefits from /outreach', '/enrich connects ALL captures across projects'],
      items: [
        {
          item: '/outreach skill (HIGHEST LEVERAGE)',
          unlocks: 'Daily batch of 15 personalized messages from contact cache + Notion + rubric. Pipeline volume 3/10 → 9/10.',
          effort: 'M',
          status: 'not-started',
          when: 'this-week',
          projects: ['GAS', 'INFRA'],
          note: 'System audit R6 = 3/10. Research→Rubric→DB done. Last mile missing.',
        },
        {
          item: '/enrich skill',
          unlocks: 'Daily enrichment — reads recent captures, finds connections, assigns weight. Garden watering system.',
          effort: 'M',
          status: 'not-started',
          when: 'this-week',
          projects: ['INFRA'],
          note: 'System audit R8 = 2/10. /capture seeds but nothing grows.',
        },
        {
          item: 'HUD rotation in /session-update',
          unlocks: 'Archive shipped >7 days. HUD stays current-state, not historical log.',
          effort: 'S',
          status: 'not-started',
          when: 'this-week',
          projects: ['INFRA'],
          note: 'System audit R9 = 6/10. 494 lines, 84 shipped items.',
        },
        {
          item: 'VPS setup (Claude Code on mobile)',
          unlocks: 'Full operational capability from phone via Telegram.',
          effort: 'L',
          status: 'not-started',
          when: 'this-month',
          midGoal: 'Systems Hosted',
          projects: ['INFRA'],
        },
      ],
    },
    {
      group: 'ACTIVE DEALS',
      icon: 8258230,
      why: 'Revenue pipeline — time-sensitive, compounds case studies',
      crossover: ['Each deal = Aloe Labs case study', 'HB patterns → GRM', 'Puma patterns → HB staff training'],
      items: [
        {
          item: 'Puma trial prep (compress lessons + reporting)',
          unlocks: 'Trial starts Tuesday. 6 weeks → case study → paid rollout to other stores.',
          effort: 'M',
          status: 'this-week',
          when: 'this-week',
          projects: ['FORJE'],
          note: 'Demo DONE. Lessons too long (Peter + Adedolapo). Compress to 2-3 pages. Set up end-of-day reporting. Get staff TG accounts via Timi.',
        },
        {
          item: 'Mairo close message',
          unlocks: 'Close loop. Maintain relationship warmth.',
          effort: 'XS',
          status: 'done',
          when: 'this-week',
          projects: ['GAS'],
          note: 'SENT Feb 12. Close + hotel article gift. P4 complete. Monitor for NODE value.',
        },
        {
          item: 'GRM interviews (round 2 of 4)',
          unlocks: 'Discovery → positioning → case study #3.',
          effort: 'S',
          status: 'not-started',
          when: 'this-week',
          midGoal: '3 Deals Closing',
          projects: ['GRM'],
          note: '33 questions ready. Farah→Dad, Nico→SGI. By mid next week.',
        },
        {
          item: 'HB outreach list + freebie PDF',
          unlocks: 'First outbound pipeline for HB. 17 leads ready. Freebie = lead magnet.',
          effort: 'S',
          status: 'not-started',
          when: 'this-week',
          projects: ['HB'],
        },
      ],
    },
    {
      group: 'ALOE LABS',
      icon: 7519186,
      why: 'Internal reference → external sales page → credibility for all deals',
      crossover: ['MASTER.html showcases HB + Puma + GRM as proof', 'Visual toolkit produces assets for all projects'],
      items: [
        {
          item: 'MASTER.html deployed to GitHub Pages',
          unlocks: 'Internal reference page live. External sales page derived from it. Shareable with prospects.',
          effort: 'S',
          status: 'in-progress',
          when: 'today',
          midGoal: 'Systems Hosted',
          projects: ['ALOE'],
        },
        {
          item: 'HBS case study (VV-visualized)',
          unlocks: 'First case study. Calculator shipping → visual proof. Proves Aloe Labs can do this for others.',
          effort: 'M',
          status: 'not-started',
          when: 'this-week',
          midGoal: 'Case Study Shipped',
          projects: ['HB', 'ALOE'],
        },
        {
          item: 'Ecosystem Spec (3 tiers + 7 roles)',
          unlocks: 'Productised service model. Clear pricing. Can sell to prospects.',
          effort: 'M',
          status: 'not-started',
          when: 'this-week',
          midGoal: 'Offer Spec',
          projects: ['ALOE'],
        },
        {
          item: 'Visual toolkit as reusable product',
          unlocks: 'Spin up concept explorers for any visual problem. JSON config → code render.',
          effort: 'M',
          status: 'in-progress',
          when: 'this-month',
          projects: ['ALOE'],
        },
      ],
    },
    {
      group: 'CAPTURE & CROSSOVER',
      icon: 8271074,
      why: 'System that surfaces "you built this for HB, it applies to GRM" automatically',
      crossover: ['Bookmark mining feeds crossover index', 'Crossover index feeds every project'],
      items: [
        {
          item: 'Crossover index',
          unlocks: 'Working on GRM → system surfaces "you built this for HB, it applies here".',
          effort: 'M',
          status: 'not-started',
          when: 'this-month',
        },
        {
          item: 'Bookmark mining (X, YouTube, Pinterest, Substack)',
          unlocks: 'One inspiration → tagged to multiple projects → crossover surfaces automatically.',
          effort: 'L',
          status: 'not-started',
          when: 'eventually',
          breakdown: [
            { step: 'X bookmarks export + tagging', effort: 'M' },
            { step: 'YouTube watch later export', effort: 'S' },
            { step: 'Build cross-project tagging system', effort: 'M' },
            { step: 'Pinterest + Substack integration', effort: 'M' },
          ],
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════
  //  CAPTURE SYSTEM — what's handled vs gaps
  //  Expanded: shows flow, volume, and what's being lost
  // ═══════════════════════════════════════════════
  capture: {
    handled: [
      { type: 'YouTube video', tool: '/video', output: 'video-kb/bookmarks/', freq: '2-3/week', example: '6 JB videos → 230 min → patterns + frames' },
      { type: 'Voice / brain dump', tool: '/process-convo', output: 'session-packets/', freq: 'daily', example: 'HUD v4 feedback → structured actions' },
      { type: 'PDF', tool: 'pdftotext', output: 'project-specific/', freq: 'as needed', example: 'Proposals, contracts, briefs' },
      { type: 'Screen recording', tool: '/process-convo', output: 'session-packets/', freq: '1-2/week', example: 'Design review → decisions + actions' },
      { type: 'Transcript', tool: '/process-convo', output: 'session-packets/', freq: 'as needed', example: 'Meeting notes → structured threads' },
    ],
    gaps: [
      { type: 'X bookmarks', priority: 'high', volume: '50-100 saved', losing: 'Design refs, competitor positioning, trend signals' },
      { type: 'YouTube watch later', priority: 'high', volume: '30+ videos', losing: 'Tutorials, frameworks, industry knowledge' },
      { type: 'Pinterest boards', priority: 'medium', volume: '5 boards', losing: 'Visual references for HB, GRM, brand identity' },
      { type: 'Substack saves', priority: 'medium', volume: '10-20 articles', losing: 'Strategy essays, market analysis, case studies' },
      { type: 'TikTok saves', priority: 'low', volume: 'unknown', losing: 'Trend signals, format ideas' },
      { type: 'Tumblr', priority: 'low', volume: 'unknown', losing: 'Aesthetic references' },
    ],
    // HOW capture flows into projects
    flow: [
      'Capture (any type) → /process-convo or /video',
      'Extracted patterns → tagged to project(s)',
      'Tagged items → crossover index (NOT BUILT YET)',
      'Crossover index → "you built X for HB, apply to GRM"',
      'Result: same inspiration feeds 4 projects, not 1',
    ],
  },

  // ═══════════════════════════════════════════════
  //  WAITING — blocked on external
  // ═══════════════════════════════════════════════
  waiting: [
    { who: 'Mairo', what: 'CLOSED — sent message + hotel article gift. Monitor for reply/NODE.', since: '2026-02-12' },
    { who: 'Timmy', what: 'Get staff Telegram accounts for trial (starts Tuesday)', since: '2026-02-12' },
    { who: 'Fisayo', what: 'Called back today — reconnected. Follow up on referral network.', since: '2026-02-12' },
  ],

  // ═══════════════════════════════════════════════
  //  RECENT SHIPPED — last 48h, shows momentum
  //  /session-update rotates items >48h to wins
  // ═══════════════════════════════════════════════
  recentShipped: [
    // Feb 14 — deep session
    { tag: 'INFRA', item: '12 Traits baseline assessment — 47/60, Engine 5/5+5/5+5/5, Governor 2/5. Identity: technical operator.', at: '2026-02-14' },
    { tag: 'INFRA', item: '3-agent convergence — regulate (neurodivergent curriculum) + sell (pipeline audit) + build (backlog audit)', at: '2026-02-14' },
    { tag: 'INFRA', item: '/pickup skill built — unified save/resume, replaces checkpoint + session-update', at: '2026-02-14' },
    { tag: 'INFRA', item: 'Agent teams enabled + value-mapped for fan-out research', at: '2026-02-14' },
    { tag: 'ALOE', item: 'Olly Rosewell API video — 9-section analysis, API-first build order', at: '2026-02-14' },
    { tag: 'ALOE', item: 'OpenClaw analysis — auto-learning pipeline = diamond, cold DM = fails', at: '2026-02-14' },
    { tag: 'INFRA', item: '6 GitHub issues closed, #16 updated, #23 created (weekly 12 Traits review)', at: '2026-02-14' },
    // Feb 12 — conv ops exploration
    { tag: 'ALOE', item: 'Conversational ops platform identity — 4-round /recursive, 6 verticals scored, EP validated', at: '2026-02-12' },
    { tag: 'ALOE', item: 'Business Ops Bot vertical = 9.7/10 (Flower Girl) — intelligence product, not booking bot', at: '2026-02-12' },
    { tag: 'ALOE', item: 'EP framework applied — hybrid pricing, case study flywheel, Phase 1→2→3, voice+media=edge', at: '2026-02-12' },
    { tag: 'INFRA', item: 'N-ATLaS Nigerian LLM evaluated — Yoruba 2.7/5 (too weak), Hausa 4.0/5, bookmarked', at: '2026-02-12' },
    // Feb 12 — late session
    { tag: 'INFRA', item: 'RAISED lifecycle shipped — Weight-Friction-Pull model, 3 rules, /recursive 10/10, visual reference', at: '2026-02-12' },
    { tag: 'GAS', item: 'Mairo close message SENT — P4 complete, hotel article gift, NODE path open', at: '2026-02-12' },
    // Feb 12 — evening (post-demo)
    { tag: 'FORJE', item: 'DEMO DELIVERED — PRL team approved 6-week free trial at Puma Lekki', at: '2026-02-12' },
    { tag: 'FORJE', item: 'Speaker notes v4 — light mode (#FAFAF8), warm cream theme, mobile-optimized', at: '2026-02-12' },
    { tag: 'FORJE', item: '7 AI images via kie.ai ($0.205) — Nigerian representation, GPT-4o + Flux Kontext', at: '2026-02-12' },
    { tag: 'FORJE', item: 'Training-as-a-service platform framing — quiz+games+lessons+TG+reporting = 5 engines', at: '2026-02-12' },
    { tag: 'FORJE', item: 'Conversational workforce intelligence concept — bot as management↔frontline interface', at: '2026-02-12' },
    { tag: 'FORJE', item: 'Demo /recursive evaluation — 14 criteria, 6.9/10, product stronger than presentation', at: '2026-02-12' },
    // Feb 12 — morning
    { tag: 'FORJE', item: 'Quiz bot FINAL — lesson+quiz per mission, 3 games, Product Match removed, welcome message styled', at: '2026-02-12' },
    { tag: 'FORJE', item: 'Speaker notes v3 — fluid (IF branches + CAN CUT), bot-centered demo, READ THE ROOM phase', at: '2026-02-12' },
    { tag: 'INFRA', item: '/recursive build mode — Singer methodology, 5 affordance layers, spike protocol, ripple rule', at: '2026-02-12' },
    { tag: 'INFRA', item: 'HUD wiring fix — 13 files updated (all skills/commands/docs now point to v4-data.js)', at: '2026-02-12' },
    { tag: 'INFRA', item: 'Stream system shipped — /stream script (5 modes), manual, slash command, RAISED section, readiness markers', at: '2026-02-12' },
    { tag: 'INFRA', item: '31 wins migrated from data.js → v4-data.js (full Jan 31–Feb 12 history)', at: '2026-02-12' },
    { tag: 'INFRA', item: 'HUD content /recursive — midGoals rewritten, recentShipped section added to v4.html', at: '2026-02-12' },
    // Feb 11
    { tag: 'INFRA', item: 'System audit via /recursive build — 9 requirements, 5 gaps, /outreach = #1', at: '2026-02-11' },
    { tag: 'INFRA', item: 'Stream management shipped — session map + status line + agent rescue', at: '2026-02-11' },
    { tag: 'INFRA', item: '/recursive build mode upgraded — spike protocol + Singer methodology', at: '2026-02-11' },
    { tag: 'GAS', item: 'Pipeline research — 53 projects, 48 firms, 5 Batch 1 companies', at: '2026-02-11' },
    { tag: 'INFRA', item: 'Notion DB restructured 35→21 cards + LOG: card + 3 skills built', at: '2026-02-11' },
    { tag: 'GRM', item: 'Interview questions shipped — 33 Qs, progressive disclosure HTML', at: '2026-02-11' },
    // Feb 10
    { tag: 'HB', item: 'Lead pipeline LIVE — DM capture → KV → Telegram → breakdown page', at: '2026-02-10' },
    { tag: 'HB', item: 'Calculator 3 fixes deployed — smart nudges, social proof, below-fold', at: '2026-02-10' },
    { tag: 'HB', item: 'Eddie feedback applied — comparison copy, savings WHY, cost visibility', at: '2026-02-10' },
    { tag: 'HB', item: 'Telegram bot @hbsworkshop_bot — instant lead notification', at: '2026-02-10' },
    { tag: 'FORJE', item: 'On Our Own v2 — mobile/visual pass, full-width nav, deployed to GitHub Pages', at: '2026-02-10' },
    { tag: 'FORJE', item: '14 AI images generated via kie.ai ($0.41 total)', at: '2026-02-10' },
  ],

  // ═══════════════════════════════════════════════
  //  WINS — full history by project area
  //  Migrated from data.js Feb 12
  // ═══════════════════════════════════════════════
  wins: [
    // INFRA
    { text: 'Stream system — /stream script, 5 modes, session map format, RAISED section with seed/shaped/ready lifecycle', tags: ['INFRA'] },
    { text: 'HUD wiring fix — 13 files fixed, all skills/commands/docs point to v4-data.js', tags: ['INFRA'] },
    { text: 'System audit via /recursive build — 9 requirements, 5 gaps ranked. /outreach = #1 build.', tags: ['INFRA'] },
    { text: 'Stream management shipped — session map + status line + agent rescue + 3 skills updated', tags: ['INFRA'] },
    { text: '/recursive build mode — 5 affordance layers, spike protocol, Singer methodology', tags: ['INFRA'] },
    { text: 'Notion DB restructured 35→21 cards + 3 skills built + LOG: card', tags: ['INFRA'] },
    { text: 'Global skills migration — 23 commands → global skills', tags: ['INFRA'] },
    { text: '7-agent parallel audit — 6 stale rules, 5 missing indexes found', tags: ['INFRA'] },
    { text: 'Tasks HUD shipped — voice-first task management', tags: ['INFRA'] },
    { text: 'Day log system — 24h neurodivergent pattern template', tags: ['INFRA'] },
    { text: '/briefing Notion integration — 9-5 agency work + side projects in one view', tags: ['INFRA'] },
    // HB
    { text: 'HB calculator lead pipeline LIVE (DM capture → Telegram → breakdown page)', tags: ['HB'] },
    { text: 'Calculator page built — glassmorphic, 4-step, real pricing, /recursive passed', tags: ['HB'] },
    { text: 'HB pricing bug fixed — 3 event-type-specific tables (was single £465 for all)', tags: ['HB'] },
    { text: 'Double-booking prevention — 9/9 scenarios passed, 100% confidence', tags: ['HB'] },
    { text: 'Double-booking bug fixed — both calendars queried, STAR UX (no unavailable dates shown)', tags: ['HB'] },
    { text: '9 booking funnel fixes + 2h slot fix deployed to production', tags: ['HB'] },
    { text: 'EP artifacts — solution context, format selection, landing page framework', tags: ['HB'] },
    { text: 'HBS export processed — 80 VMs + 200 texts → 27 decisions, ICP, value ladder', tags: ['HB'] },
    { text: 'Francesca booking — £645 workshop (Feb 26)', tags: ['HB'] },
    // GAS
    { text: 'Pipeline research — 53 projects, 48 firms, 5 Batch 1 companies, Apr expo found', tags: ['GAS'] },
    { text: 'Gen Prospecting DB — 32 contacts, rubric, execution plan, action week sprints', tags: ['GAS'] },
    { text: 'Referral model validated — Fisayo: 2-min call → 7 referrals', tags: ['GAS'] },
    { text: 'Strategy pivot — abandoned triggers/cold, adopted referral engine', tags: ['GAS'] },
    { text: 'Research rubric v2 — product fit, weighted scoring, DIRECT/NODE', tags: ['GAS'] },
    { text: 'Pipeline Power visual v12 — non-AI aesthetic, screenshot-ready', tags: ['GAS'] },
    { text: 'Mairo replied — process intel captured, traffic light Green', tags: ['GAS'] },
    // ALOE (conv ops platform)
    { text: 'Conversational ops platform identity — 4-round /recursive, 6 verticals scored, EP validated, voice+media=edge', tags: ['ALOE'] },
    { text: 'Business Ops Bot (Flower Girl) = 9.7/10 — intelligence product, booking is side effect', tags: ['ALOE', 'HB'] },
    // FORJE
    { text: 'DEMO DELIVERED — PRL approved 6-week free trial, Puma Lekki store', tags: ['FORJE'] },
    { text: 'Training-as-a-service platform framing — first client, not only client', tags: ['FORJE'] },
    { text: 'Conversational workforce intelligence — bot as management↔frontline interface, no desk/laptop/login needed', tags: ['FORJE'] },
    { text: 'Demo /recursive eval — 14 criteria, 6.9/10. Key: product stronger than presentation.', tags: ['FORJE'] },
    { text: 'Speaker notes v4 light mode — warm cream, Nigerian images, GitHub Pages deployed', tags: ['FORJE'] },
    { text: 'On Our Own brand steering doc deployed to GitHub Pages', tags: ['FORJE'] },
    { text: '14 AI images via kie.ai — $0.41 total, pipeline validated', tags: ['FORJE'] },
    { text: 'Quiz bot v2.5 shipped — DM-first architecture, 4 quizzes + 3 games, /recursive build evaluated 8/10 at 9+', tags: ['FORJE'] },
    { text: 'Puma demo prep — brief deployed, demo site live, slide deck ready', tags: ['FORJE'] },
    // GRM
    { text: 'GRM interview questions shipped — 33 Qs, progressive disclosure HTML', tags: ['GRM'] },
    { text: 'GRM project onboarded — project.json, decision rubric, editorial vision', tags: ['GRM'] },
    // ALOE
    { text: 'Agency positioning clarity — EP analysis, HB=anchor, Princess=scalable test', tags: ['ALOE'] },
  ],

  principles: [
    'Action over acknowledgement',
    'Internal sources first',
    'Node > Direct (5-10x multiplier)',
    'Ecosystem > Linear',
    'Ship or Park (2 session max)',
    'Same effort, compounding output',
  ],
};
