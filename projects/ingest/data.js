// Ingest Command Center — Data Layer
// Pattern: update data.js, never regen HTML
// Last updated: 2026-02-16T00:15Z
// Session: Sunday mega → night session (agent research, bot-designer, ingest fix, /tmp rescue)

const ingestData = {
  meta: {
    totalItems: 38,
    lastUpdated: '2026-02-16T00:15Z',
    streams: [
      { id: 'S1-capture', label: 'Capture Pipeline', color: '#4ecdc4', count: 5 },
      { id: 'S2-dashboard', label: 'Context Dashboard', color: '#45b7d1', count: 4 },
      { id: 'S3-financial', label: 'Financial Clarity', color: '#f7dc6f', count: 2 },
      { id: 'S4-mikano', label: 'Mikano Enable', color: '#e74c3c', count: 1 },
      { id: 'S5-superwall', label: 'Superwall Patterns', color: '#9b59b6', count: 2 },
      { id: 'S6-packaging', label: 'Content Packaging', color: '#e67e22', count: 3 },
      { id: 'S7-puma-ux', label: 'PUMA/UX Refs', color: '#1abc9c', count: 1 },
      { id: 'S8-twin', label: 'Digital Twin', color: '#3498db', count: 3 },
      { id: 'S9-tools', label: 'Tools Ecosystem', color: '#95a5a6', count: 5 },
      { id: 'S10-content', label: 'Content Engine', color: '#f39c12', count: 2 },
      { id: 'S11-birthday', label: 'Birthday Project', color: '#e91e63', count: 0 },
      { id: 'S12-mining', label: 'Laptop Mining', color: '#00bcd4', count: 4 },
      { id: 'S13-puma', label: 'PUMA Training App', color: '#D4FF00', count: 5 },
      { id: 'S14-aloe', label: 'Aloe Labs', color: '#2ecc71', count: 3 },
      { id: 'S15-distribution', label: 'Distribution', color: '#ff6b6b', count: 1 },
      { id: 'S16-agents', label: 'Agent Architecture', color: '#ff9ff3', count: 4 },
      { id: 'S17-drop-bot', label: 'Drop Bot System', color: '#48dbfb', count: 3 },
    ]
  },

  // ═══════════════════════════════════════════
  //  TRIAGE — what needs attention NOW
  // ═══════════════════════════════════════════
  triage: [
    { id: 't-001', title: 'Send Timmy app link + test creds for Tuesday trial', urgency: 'now', type: 'action' },
    { id: 't-002', title: 'BASS registration conversation Monday (one-pager ready)', urgency: 'now', type: 'action' },
    { id: 't-006', title: 'Family AI follow-up — position Aloe Labs as research agents (has budget)', urgency: 'now', type: 'action' },
    { id: 't-007', title: 'Update PUMA demo link + clipboard copy (email + password + demo page)', urgency: 'soon', type: 'action' },
    { id: 't-003', title: 'Triage 22 extracted actions → GitHub issues', urgency: 'soon', type: 'process' },
    { id: 't-004', title: 'GRM follow-up — scaffold research component for Rochelle', urgency: 'soon', type: 'action' },
    { id: 't-008', title: 'Evaluate n8n vs Node.js extension for Drop Bot multi-agent', urgency: 'soon', type: 'decision' },
    { id: 't-009', title: 'Upwork bot → autodownload messages → feed management pipeline', urgency: 'soon', type: 'spike' },
    { id: 't-005', title: 'Subscribe to Post Bridge or wait for content batch?', urgency: 'soon', type: 'decision' },
    { id: 't-010', title: 'Buy domain (Namecheap) for Aloe Labs', urgency: 'soon', type: 'action' },
    { id: 'spike-001', title: 'SPIKE: Check HBS Helper bot on Railway — can we update?', urgency: 'soon', type: 'spike' },
    { id: 'spike-002', title: 'WhatsApp Business vs API — research + GH issue', urgency: 'week', type: 'spike' },
    { id: 't-011', title: 'Perplexity subscription ($20/mo) — worth it or use API direct?', urgency: 'week', type: 'decision' },
    { id: '2026-02-15-008', title: 'Uxcel subscription decision — 26k NGN/mo', urgency: 'week', type: 'decision' },
    { id: '2026-02-15-003', title: 'Financial picture — needs visualization', urgency: 'week', type: 'blocked' },
  ],

  // ═══════════════════════════════════════════
  //  SHIPPED — proof of work (most recent first)
  // ═══════════════════════════════════════════
  shipped: [
    { date: 'Feb 15-16 (Sun night)', items: [
      { title: 'Agent Landscape Research', detail: '5 parallel agents, 200+ sources. Market $7.4B, 90% fail in 30 days. MCP = standard. LangGraph = winner.', tag: 'INFRA' },
      { title: '/bot-designer Skill', detail: 'Knowledge-carrying agent advisor. Reads research + project state. Writes learnings to knowledge.md after each use.', tag: 'INFRA' },
      { title: 'Ingest Token Auth Fix', detail: 'WebAuthn broken in TG browser. Added token fallback. Works everywhere now.', tag: 'INFRA' },
      { title: '/tmp Rescue', detail: '5 artifacts saved: payment research, FGCH index, 6 transcripts, COG skills, continuous-claude docs', tag: 'OPS' },
      { title: 'TG Bot Slash Commands', detail: 'Auto-registers 7 commands on every deploy via set-commands.js', tag: 'INFRA' },
      { title: 'TG HTML Formatting', detail: '--html flag on send-to-drop.py. All Drop deliverables use Telegram HTML now.', tag: 'INFRA' },
      { title: 'Drop History Reader', detail: 'read-group-history.py pulls last N messages from any TG group → JSON', tag: 'INFRA' },
    ]},
    { date: 'Feb 15 (Sunday)', items: [
      { title: 'PUMA App → Vercel', detail: 'Supabase auth, 6 lessons, 2 playable games, manager triage, profile + badges', url: 'https://app-zeta-dusky.vercel.app', tag: 'PUMA' },
      { title: 'Spot the Difference Game', detail: '5 rounds of A/B sales scenarios with correct/wrong feedback + score', tag: 'PUMA' },
      { title: 'Role Play Game', detail: '4 customer scenarios, 3 options each, star scoring, save to Supabase', tag: 'PUMA' },
      { title: '530 Rule Hook Fixed', detail: 'Title: ₦15.6 Million Lost Every Year — leads with impact, not generic "The Problem"', tag: 'PUMA' },
      { title: 'Aloe Labs One-Pager', detail: 'BASS message + copy-to-clipboard. Ready for Monday registration convo', tag: 'ALOE' },
      { title: '/design-round Skill', detail: 'ASCII → Variant/Local mockup → UXD rubric evaluation → code ONCE. Enforces visual design gate.', tag: 'INFRA' },
      { title: 'Brain Dump → 22 Actions', detail: '20 threads, 10 decisions, 22 actions, 9 questions extracted from Sunday voice note', tag: 'INFRA' },
      { title: 'Post Bridge Identified', detail: '$29/mo, 15 accounts, 9 platforms — solves distribution bottleneck', tag: 'CONTENT' },
      { title: 'Ingest Command Center', detail: '17 streams, 38 items, triage + streams + edges + shipped + access + rules', tag: 'INFRA' },
      { title: '8 GitHub Issues', detail: '#39 closed (Supabase done), #43-#45 created (UI polish, commercial model, distribution)', tag: 'OPS' },
    ]},
    { date: 'Feb 14 (Saturday)', items: [
      { title: '12 Traits Baseline', detail: '47/60 — Engine 5/5+5/5+5/5, Governor 2/5. Identity: technical operator.', tag: 'INFRA' },
      { title: 'PUMA Lessons Expanded', detail: '6 missions with slide system, toolkit (ACKNOWLEDGE/PROBE/BRIDGE), quiz', tag: 'PUMA' },
      { title: 'Supabase Fully Wired', detail: 'Auth flow, profiles table, completions, RLS, manager_dashboard view', tag: 'PUMA' },
      { title: '3-Agent Convergence', detail: 'Regulate (neurodivergent curriculum) + Sell (pipeline audit) + Build (backlog audit)', tag: 'INFRA' },
      { title: '/pickup Skill Built', detail: 'Unified save/resume. Replaces checkpoint + session-update.', tag: 'INFRA' },
    ]},
    { date: 'Feb 12-13', items: [
      { title: 'Demo Delivered → Trial Approved', detail: 'PRL team approved 6-week free trial at Puma Lekki', tag: 'PUMA' },
      { title: 'Conv Ops Platform Identity', detail: '4-round /recursive, 6 verticals scored, EP validated', tag: 'ALOE' },
      { title: '/dsg Skill Built', detail: 'Delta Sierra Gamma selling intelligence. RIQ, HPP, profiling adapted for Nigeria.', tag: 'INFRA' },
      { title: 'Stream System Shipped', detail: '/stream script, session maps, RAISED lifecycle, status line', tag: 'INFRA' },
      { title: 'HB Lead Pipeline Live', detail: 'DM capture → KV → Telegram → breakdown page', tag: 'HB' },
    ]},
  ],

  // ═══════════════════════════════════════════
  //  ACCESS — deployed links, one tap
  // ═══════════════════════════════════════════
  access: [
    { label: 'Ingest Command Center', url: 'https://ingest-pi.vercel.app', status: 'live', note: 'Token: aloe', updated: '2026-02-16',
      share: 'Command Center is live — all streams, triage, drops in one place' },
    { label: 'PUMA Training App', url: 'https://app-zeta-dusky.vercel.app', status: 'live', note: 'manager@pumatrial.com / PumaTrial2026!', updated: '2026-02-15',
      share: 'PUMA Retail Training — 6 lessons, games, staff progress tracking. Try it out' },
    { label: 'Timi Demo Brief', url: 'https://ftfc1.github.io/puma-demo-brief/', status: 'live', note: '', updated: '2026-02-15',
      share: 'Quick overview of the PUMA training platform for the Lekki store trial' },
    { label: 'Aloe Labs One-Pager', url: 'https://ftfc1.github.io/aloe-projects/pages/aloe-labs-one-pager.html', status: 'live', note: 'For Monday BASS conversation', updated: '2026-02-14',
      share: 'Aloe Labs — conversational ops for retail brands. One-pager attached' },
    { label: 'HB Calculator', url: 'https://hibiscusstudio.co.uk/calculator/explore.html', status: 'live', note: '', updated: '2026-02-01',
      related: ['HB Booking', 'HB Admin'] },
    { label: 'HB Booking', url: 'https://hibiscusstudio.co.uk/book', status: 'live', note: '', updated: '2026-01-29',
      related: ['HB Calculator', 'HB Admin'] },
    { label: 'HB Admin', url: 'https://hibiscusstudio.co.uk/admin', status: 'live', note: '', updated: '2026-01-29',
      related: ['HB Calculator', 'HB Booking'] },
    { label: 'On Our Own', url: 'https://ftfc1.github.io/on-our-own-brand/', status: 'live', note: '', updated: '2026-02-06' },
    { label: 'GitHub Board', url: 'https://github.com/orgs/FTFC1/projects/2/views/1', status: 'live', note: '15 open issues', updated: '2026-02-15' },
  ],

  // ═══════════════════════════════════════════
  //  RULES — operating principles (hard-earned)
  // ═══════════════════════════════════════════
  rules: [
    { rule: 'ASCII before code', detail: 'Review at the level you think. Build at the level the machine needs.', origin: 'Feb 14' },
    { rule: 'Design round before CSS', detail: 'Variant/Local mockup → evaluate → pick → code ONCE. No CSS surgery.', origin: 'Feb 15' },
    { rule: 'Admin Dashboard Principle', detail: 'What\'s wrong? What\'s good? What needs attention? In that order.', origin: 'Feb 15' },
    { rule: 'Rule of Three', detail: 'Don\'t abstract until 3 clients confirm the pattern. Rochelle (#1), Puma (#2), next = #3.', origin: 'Feb 13' },
    { rule: 'Copy is OUTPUT not INPUT', detail: 'DSG upstream: intel → profile → hypothesis → questions → scenarios → THEN copy.', origin: 'Feb 14' },
    { rule: 'NODE > DIRECT (5-10x)', detail: 'Referral multiplier. Fisayo = proof (7 referrals in 2 min).', origin: 'Feb 11' },
    { rule: 'Ship or Park', detail: '2 design sessions max, then ship v1 or consciously park.', origin: 'Feb 12' },
    { rule: 'Framework ≠ Gospel', detail: 'Adapt to YOUR reality. Direct application = constant failure.', origin: 'Feb 13' },
    { rule: 'Action > Acknowledgement', detail: '"Noted as future task" is a FAILURE MODE. Do it or kill it.', origin: 'Feb 11' },
    { rule: 'Pattern play ≠ vision trap', detail: 'Each bespoke client = small bet. Pattern emerges across clients. Automate after 3.', origin: 'Feb 13' },
    { rule: 'Current thread protocol', detail: 'After compaction: show ONE thread, one next action. Parking requires explicit reason.', origin: 'Feb 15' },
    { rule: 'Capture is dumb and fast', detail: 'Dump + 3 bullets + tag. Enrichment is separate + smart + async.', origin: 'Feb 11' },
  ],

  // ═══════════════════════════════════════════
  //  INSIGHTS — patterns discovered
  // ═══════════════════════════════════════════
  insights: [
    { insight: 'Certification = Trojan horse', detail: 'PUMA cert makes staff portable → retail companies WANT this → it\'s the product, not the training.', stream: 'S13-puma' },
    { insight: 'Bespoke → Pattern → Automate', detail: 'Service → Document → Teach → Automate. Each client adds to the pattern. Don\'t automate before 3.', stream: 'S14-aloe' },
    { insight: '6 streams cross at INGEST', detail: 'Capture + Dashboard + Twin + Tools + Content + Mining = one shared foundation. Build ingest = both shapes emerge.', stream: 'S1-capture' },
    { insight: 'Design + Data + Psychology + Revenue', detail: 'Superwall/RevenueCat pattern: these 4 combined = tight offer per niche. Find combo per vertical.', stream: 'S5-superwall' },
    { insight: 'Niche → unbundle → tacit knowledge → skills → employ', detail: 'The pipeline for turning domain expertise into products. Works for Aloe + clients.', stream: 'S6-packaging' },
    { insight: 'Nigeria = authority AND referral market', detail: 'Not either/or. Build so good they can\'t ignore you (Cal Newport) + leverage NODE network.', stream: 'S4-mikano' },
    { insight: 'Mikano = paid sell training', detail: 'Reframe: getting paid to learn DSG. Don\'t optimize for less Mikano — optimize for BETTER Mikano.', stream: 'S4-mikano' },
    { insight: 'Content compression flywheel', detail: 'Build → modular tweet → expand to thread → expand to site. Barrier to distribution = solved by Post Bridge.', stream: 'S15-distribution' },
    { insight: '90% of agents fail in 30 days', detail: '$7.4B market, 90% churn. Survivors: narrow scope, human-in-loop, self-healing. One agent per workflow, not monoliths.', stream: 'S16-agents' },
    { insight: 'MCP = industry standard (2026)', detail: 'Every major framework adopted MCP. Tool integration is table stakes now. LangGraph = production winner (400 companies).', stream: 'S16-agents' },
    { insight: 'Knowledge-carrying skills > static docs', detail: '/bot-designer reads + writes knowledge.md each session. Accumulated learnings compound. Pattern for all advisor skills.', stream: 'S16-agents' },
  ],

  // ═══════════════════════════════════════════
  //  INVENTORY — what we have, by type
  // ═══════════════════════════════════════════
  inventory: {
    'screen-recording': { count: 1, label: 'Screen Recordings' },
    'voice-note': { count: 3, label: 'Voice Notes' },
    'brain-dump': { count: 2, label: 'Brain Dumps' },
    'frame-capture': { count: 8, label: 'Frame Captures' },
    'extraction': { count: 3, label: 'Extractions' },
    'reference': { count: 1, label: 'References' },
    'shipped-app': { count: 1, label: 'Shipped Apps' },
    'deployed-page': { count: 2, label: 'Deployed Pages' },
    'skill-built': { count: 6, label: 'Skills Built' },
    'github-issues': { count: 8, label: 'GitHub Issues' },
    'rescued-artifact': { count: 5, label: 'Rescued Artifacts' },
    'agent-research': { count: 1, label: 'Agent Research' },
  },

  // ═══════════════════════════════════════════
  //  TIMELINE — by date
  // ═══════════════════════════════════════════
  timeline: [
    { date: 'Feb 15-16 — Sunday Night', count: 16, highlights: [
      'Agent landscape research: 5 parallel agents, 200+ sources scanned',
      '/bot-designer skill scaffolded (knowledge-carrying advisor pattern)',
      'Ingest token auth fix (WebAuthn broken in TG browser)',
      '/tmp rescue: payment research, FGCH index, 6 transcripts, COG skills, CC v3 docs',
      'TG bot slash commands + HTML formatting shipped',
      'Drop history reader (read-group-history.py → JSON)',
      'Data.js updated with 16 new items across all sections',
    ]},
    { date: 'Feb 15 — Sunday', count: 22, highlights: [
      'PUMA app shipped to Vercel (auth + lessons + games + manager)',
      'Full games: Spot the Difference + Role Play with Supabase save',
      'Aloe Labs one-pager deployed to GitHub Pages',
      '/design-round skill built (visual design gate)',
      'Post Bridge found for distribution ($29/mo, 9 platforms)',
      'Brain dump processed → 20 threads, 22 actions',
      'Ingest Command Center built (12→15 streams, 22 items)',
      '62-min screen recording mined → 17 frames, 5 principles',
      '#39 closed, #43-#45 created on GitHub board',
    ]},
    { date: 'Feb 14 — Saturday', count: 12, highlights: [
      '12 Traits baseline: 47/60, Governor 2/5',
      '3-agent convergence (regulate + sell + build)',
      'PUMA lessons expanded to 6 missions with slide system',
      'Supabase fully wired (auth, DB, RLS, manager view)',
      '/pickup skill built',
    ]},
    { date: 'Feb 12-13 — Wed-Thu', count: 15, highlights: [
      'DEMO DELIVERED → 6-week trial approved at Puma Lekki',
      'Conv ops platform identity (4-round /recursive)',
      '/dsg + /small-bets + /scaffold skills built',
      'Stream system shipped',
      'HB lead pipeline live (DM → TG → breakdown)',
    ]},
  ],

  // ═══════════════════════════════════════════
  //  STREAM HEALTH — status check
  // ═══════════════════════════════════════════
  streamHealth: [
    { id: 'S13-puma', lastTouched: '2026-02-15', itemCount: 5, status: 'building', note: 'App live on Vercel. Trial Tuesday. Need staff logins + feedback loop.' },
    { id: 'S14-aloe', lastTouched: '2026-02-15', itemCount: 2, status: 'ready', note: 'One-pager deployed. Monday BASS conversation.' },
    { id: 'S1-capture', lastTouched: '2026-02-15', itemCount: 4, status: 'building', note: 'Ingest layer v1 live. JSON store + dashboard working.' },
    { id: 'S2-dashboard', lastTouched: '2026-02-15', itemCount: 3, status: 'building', note: 'This dashboard IS the build. Deploying to Vercel now.' },
    { id: 'S15-distribution', lastTouched: '2026-02-15', itemCount: 1, status: 'ready', note: 'Post Bridge found ($29/mo). Need first content batch to start.' },
    { id: 'S3-financial', lastTouched: '2026-02-15', itemCount: 2, status: 'blocked', note: 'Needs visualization, friction to address.' },
    { id: 'S4-mikano', lastTouched: '2026-02-15', itemCount: 1, status: 'parked', note: 'Tomorrow: non-sales builds, rev ops angle.' },
    { id: 'S5-superwall', lastTouched: '2026-02-15', itemCount: 2, status: 'reference', note: 'Funnel patterns captured, apply to PUMA commercial.' },
    { id: 'S6-packaging', lastTouched: '2026-02-15', itemCount: 3, status: 'reference', note: 'Gumroad + unbundle model documented.' },
    { id: 'S7-puma-ux', lastTouched: '2026-02-15', itemCount: 1, status: 'reference', note: 'Uxcel = design ref for PUMA + dashboard.' },
    { id: 'S8-twin', lastTouched: '2026-02-15', itemCount: 3, status: 'accumulating', note: '22 items in store = twin training data.' },
    { id: 'S9-tools', lastTouched: '2026-02-15', itemCount: 5, status: 'documented', note: 'Full toolkit: extensions, apps, platforms.' },
    { id: 'S10-content', lastTouched: '2026-02-15', itemCount: 2, status: 'parked', note: 'Substack + Tumblr exist, underused. Post Bridge = activator.' },
    { id: 'S11-birthday', lastTouched: '2026-02-15', itemCount: 0, status: 'idea', note: 'Feb 19 grandma project, WhatsApp-based.' },
    { id: 'S12-mining', lastTouched: '2026-02-15', itemCount: 4, status: 'ready', note: '2835 bookmarks + 1328 Eagle items + 66 tabs = minable.' },
    { id: 'S16-agents', lastTouched: '2026-02-16', itemCount: 4, status: 'building', note: 'Landscape researched. /bot-designer built. MCP + LangGraph = stack. Drop Bot Capture done, Enrich/Connect/Notify next.' },
    { id: 'S17-drop-bot', lastTouched: '2026-02-16', itemCount: 3, status: 'building', note: 'Capture Agent live. Auto-tagging working. Slash commands registered. Need: Enrich agent, /commands in TG, history reader wired.' },
  ],

  // ═══════════════════════════════════════════
  //  EDGE EFFECTS — where streams cross
  // ═══════════════════════════════════════════
  edges: [
    { streams: ['S1-capture','S2-dashboard','S8-twin','S9-tools','S10-content','S12-mining'], label: 'INGEST LAYER', note: '6 streams, one slice. Build this = both shapes emerge.' },
    { streams: ['S13-puma','S5-superwall','S6-packaging'], label: 'PUMA COMMERCIAL', note: 'Training app + paywall patterns + packaging = per-location subscription model.' },
    { streams: ['S15-distribution','S10-content','S6-packaging'], label: 'CONTENT ENGINE', note: 'Post Bridge + modular tweets + unbundle = distribution flywheel.' },
    { streams: ['S4-mikano','S3-financial'], label: 'FUNDING TRANSITION', note: 'Mikano funds the exit. Financial clarity enables planning.' },
    { streams: ['S14-aloe','S13-puma','S8-twin'], label: 'ALOE FLYWHEEL', note: 'Each client build feeds the lab. PUMA = pattern data for conv ops platform.' },
    { streams: ['S16-agents','S17-drop-bot','S9-tools','S1-capture'], label: 'AGENT STACK', note: 'Bot-designer + Drop Bot + tool ecosystem + capture pipeline = agent-first operations layer.' },
  ],

  // ═══════════════════════════════════════════
  //  QUICK WINS — checklist
  // ═══════════════════════════════════════════
  quickWins: [
    { label: 'PUMA app deployed to Vercel', done: true },
    { label: 'Full games built (Spot + Role Play)', done: true },
    { label: 'Aloe one-pager on GitHub Pages', done: true },
    { label: 'Post Bridge researched', done: true },
    { label: 'Brain dump → 22 actions', done: true },
    { label: '/design-round skill built', done: true },
    { label: '#39 closed (Supabase done)', done: true },
    { label: 'Ingest dashboard built', done: true },
    { label: 'Ingest store seeded (22 items)', done: true },
    { label: 'Deploy Ingest to Vercel', done: true },
    { label: 'Agent landscape research (5 agents)', done: true },
    { label: '/bot-designer skill scaffolded', done: true },
    { label: 'Ingest token auth (TG browser fix)', done: true },
    { label: '/tmp rescue (5 artifacts saved)', done: true },
    { label: 'Send Timmy app link + creds', done: false },
    { label: 'BASS conversation Monday', done: false },
    { label: 'Triage 22 actions → GH issues', done: false },
    { label: 'Ingest accessibility pass (boosted view)', done: false },
    { label: 'HBS Helper Railway spike', done: false },
  ],
};
