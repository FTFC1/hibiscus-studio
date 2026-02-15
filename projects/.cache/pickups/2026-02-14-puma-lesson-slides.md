# Pickup: 2026-02-14-puma-lesson-slides
saved: 2026-02-14T20:15:00
mode: compaction
device: laptop

## Context (self-contained)
Built PUMA Training App lesson screen as slide-based React component. Evaluated 3 Variant AI HTML exports (V1=94%, V2=75%, V3=94%). Picked V3 as base with V1 checkbox quality. Implemented full slide engine: 5 slide types (text/rule/toolkit/comparison/practice), swipe+arrows+keyboard nav, progress dots, floating Quick Ref overlay with 2x2 grid + example answer tags, working toggle checkboxes. User gave 2 rounds of feedback — added visual scenario timeline to Problem slide, proportion bar to 70/30 slide, Don't/Do comparison cards with outcome icons, Quick Ref hint on toolkit slide. Also completed Greg Isenberg deep analysis (8 lenses) saved to GREG-ISENBERG-DEEP-ANALYSIS.md.

## Read First
1. /Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/retail/puma/app/src/pages/Lesson.jsx (10KB)
2. /Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/retail/puma/app/src/pages/Lesson.css (16KB)
3. /Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/retail/puma/app/src/data/missions.js (3KB)
4. /Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/retail/puma/VARIANT-PROMPT-lesson.md (7KB)
5. /Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/retail/puma/GREG-ISENBERG-DEEP-ANALYSIS.md (16KB)

## Streams
- PUMA Lesson Slides [ACTIVE] — React slide component built, user reviewing in browser
- Greg Isenberg Analysis [DONE] — 8-lens deep analysis saved
- Variant Eval [DONE] — 3 HTML exports scored, V3 won

## Next (UNFIXED FEEDBACK from latest voice note)
1. Remove 70%/30% numbers from bar — title already says "70/30 Rule", bar should just show proportion visually without repeating numbers
2. Fix Quick Ref hint text — not "tap anytime", say "Saved in your Quick Reference for this lesson"
3. Quick Ref sheet — make taller (80%?), close button thumb-reachable at bottom, bigger example tags
4. Spot the Difference — another visual improvement pass (user said "could improve again")
5. Try This Today — should persist/stay accessible even after leaving slide 5 (user wants it visible while they actually try it on the floor)
6. Commit all PUMA lesson work to git

## Decided (don't re-litigate)
- V3 is the base design (V1 checkbox quality merged in)
- Dark mode (#17262B), lime accent (#DCEE56), Inter font, Remix Icons
- Slide-based not scrolling — one idea per slide
- Quick Ref = floating button + overlay sheet with 2x2 grid
- Props-driven components — ready for Supabase wiring
- 375px max-width enforced
- Greg Isenberg key insight: feeling-first design is missing layer for PUMA

## Open (needs human input)
- "Try This Today" persistence — should it be a sticky footer? A separate screen? Or just accessible via Quick Ref?
- Visual anchor for PUMA brand (from Greg analysis) — not started yet
- When to show this to Timi/Adedolapo for "does this feel right?" feedback
