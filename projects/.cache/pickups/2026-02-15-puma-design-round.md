# Pickup: 2026-02-15-puma-design-round
saved: 2026-02-15T03:45:00
mode: standard
device: laptop

## Context (self-contained — works on any device)
Ran full /design-round for PUMA training app. Created 5 Variant prompts from ASCII layouts, user ran them in Variant and got back 10 JS exports + 2 inline HTML designs across all 5 pages. Spun up 4-agent team to catalog and score everything in parallel. Extracted 20 frames from 25-min Variant screen recording. Scored all 9 unique designs on Clarity/Hierarchy/Consistency/Delight/Feasibility rubric. Top scores: Lesson (8.6), Activity V2 (8.4), Practice VC (7.8). Decisions locked: 4-tab nav, #080808 pure black background, #D4FF00 neon lime accent, glass morphism but grounded (not Dribbble-fantasy). Built recommended franken-build combining best parts across variants. Also scaffolded /design-round skill and diagnosed the CSS surgery anti-pattern via /recursive. User wants to show "complex resolve" from Variant before final pick.

## Read First (for laptop/VPS — skip on mobile)
1. /Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/.cache/agent-outputs/2026-02-15-puma-variant-prompts.md (4K)
2. /Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/.cache/agent-outputs/2026-02-15-puma-variant-prompts.html (12K)
3. /Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/retail/puma/debrief/variant-exports/home-timeline.html (7K)
4. /Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/retail/puma/debrief/variant-exports/activity-dense.html (8K)

## Board (top 5 GitHub issues by urgency)
#7 [SELL/this-week] GRM follow-up after Thursday meeting
#6 [PROOF/this-week] Write HBS case study from bot building
#4 [SELL/due-friday] Draft BTL connection notes for top targets
#26 [BUILD] Improve capture: screenshot → context → library pipeline
#24 [OPS] Guided Agent Architecture — company operating pattern

## Streams
- PUMA-design-round [ACTIVE] — scored 9 variants, waiting for user's final pick + "complex resolve"
- Design-round-skill [DONE] — /design-round scaffolded with Variant rules + rubric
- CSS-surgery-diagnostic [DONE] — /recursive identified root cause, Visual Design Gate added to memory

## Next
1. User shows "complex resolve" from Variant — review and incorporate
2. Lock final design picks per page (franken-build or user override)
3. Implement chosen designs in React — ONE deploy cycle
4. Process the 25-min Variant screen recording (/video) for knowledge base

## Decided (don't re-litigate)
- Nav: 4 tabs (Home/Practice/Activity/Profile) — NOT 5
- Background: #080808 pure black — NOT #0F1A1E teal-dark
- Accent: #D4FF00 neon lime
- Aesthetic: glass morphism, grounded — not Dribbble
- Variant for visual, code for logic (Visual Design Gate)
- ONE screen per Variant conversation
- Lesson page visual = approved
- Rule meanings = rounded pills
- Toolkit description INSIDE quote card

## Open (needs human input)
- User's "complex resolve" from Variant — haven't seen it yet
- Final pick: accept franken-build recommendations or override?
- Grid texture on Practice page: keep (unique) or drop (consistency)?
