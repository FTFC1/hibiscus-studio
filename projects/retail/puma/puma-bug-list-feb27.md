---
shaping: true
---

# PUMA App — Bug List (Feb 27, 2026)

Source: Voice walkthrough QA review, 5-pass extraction

## Critical (trust/data integrity)

| ID | Bug | Location | Evidence |
|----|-----|----------|----------|
| B1 | Score shows 0%/0 of 3 on failed quiz | Result.jsx | "data back is wrong" — cascading trust damage to all scores |

## High

| ID | Bug | Location | Evidence |
|----|-----|----------|----------|
| B2 | Manager lands on Profile not Home | App.jsx / Login.jsx routing | "should land on home and see who needs attention" |
| B3 | Mission 5 slides don't read | missions.js content | "seamless value doesn't make sense", "not authentic continuation" |
| B4 | Can't go back to previous mission | Lesson.jsx navigation | Back button changes to wrong screen |
| B5 | Telegram nudge opens website not app | StaffDetail.jsx deep link URL | Opens telegram.org instead of Telegram app |
| B6 | Approach Game not sticky + layout wrong | Games.jsx (approach) | "keeping the scenarios" ×4 — highest frustration |
| B7 | Quiz auto-advances on wrong answer | Lesson.jsx quiz component | "should see why and press next" — no reading time |

## Medium

| ID | Bug | Location | Evidence |
|----|-----|----------|----------|
| B8 | "Play Approach Game" → games list not game | Practice.jsx certified CTA | Should deep-link to Approach Game directly |
| B9 | Code artifact visible in game UI | Games.jsx | "you/something safe" rendering as code |
| B10 | Result screen confusing — no clear label | Result.jsx | "It confuses" before understanding layout |
| B11 | Fail state needs 2nd CTA button | Result.jsx footer | "should also click another button" |
| B12 | "Back to game" button below content | Games.jsx (approach) | Should be above scenario, iPhone convention |
| B21 | Manager profile shows certification | Profile.jsx | "managers aren't getting certified themselves" |

## Low

| ID | Bug | Location | Evidence |
|----|-----|----------|----------|
| B13 | Build Basket missing wrong answer review | Games.jsx (basket) | "this one is missing the review why I got wrong" |
| B14 | Games need onboard/start screen | Games.jsx | "tells you how this game is structured" — instructional |
| B16 | Manager practice empty state | Practice.jsx manager view | "should have a view that shows me someone" |
| B18 | "Few more trainings" copy — needed? | Unknown location | User questions if needed |
| B12b | "Swipe ← →" hint on Result page | Result.jsx | Misleading — can't swipe on result screen |
| B16b | Completed lessons say "Start" not "Revisit" | Home.jsx | Confusing for re-entry |

## Parity Issues

| Issue | Approach Game | Build Basket | Target |
|-------|:---:|:---:|:---:|
| Sticky action buttons | ❌ | ✅ | Both ✅ |
| Wrong answer review | ✅ | ❌ | Both ✅ |
| Key insight at end | ✅ | ? | Both ✅ |
| Progress indicator | ✅ | ✅ | Both ✅ |

## Content Audit Needed

70% of content is "temperature" (custom per client). Mission 5 has broken copy + Nigerian pricing context (2.8M). Full content audit across all 6 missions — Timmy's responsibility.

## Open Questions

- [ ] "Coming soon" sections — keep or kill?
- [ ] 94% stat in manager view — what does it measure?
- [ ] Manager profile — remove or show team stats?
- [ ] Completed lessons — "Start" or "Revisit" label?
- [ ] "Few more trainings" copy — needed?

## Validated (don't touch)

- Staff profile page + badges
- Practice certified CTAs
- Stuck callout + nudge button appearance
- Game progress tracking
- Build the Basket sticky
- Key insight at game end
- Add-ons mechanic
- Team buzz in Activity
- Team games scores

## Test Viewport

iPhone 12: 390×844
