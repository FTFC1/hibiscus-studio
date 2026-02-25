# Pickup: Games v2 Rebuild from Prototypes
**Saved:** 2026-02-19 01:20 WAT
**Thread:** PUMA Training App — Games page rebuild
**Progress:** ~85% (deployed, needs final QA pass)

## What Happened
- Games.jsx was completely rewritten from scratch in a prior session, MISSING all the design work from approved prototypes
- User caught it: "games don't have any of the feedback I gave yday"
- Root cause: no artifact scan before build (built from compaction summary, not actual project state)
- Created `/pre-scan` skill to prevent this class of failure
- Rebuilt Games properly from approved prototypes: `public/approach-game.html` + `public/basket-game-v2.html`

## What's Done
- **Games.jsx** — Complete rewrite with ApproachGame (8 scenarios, 5 customer types) + BasketGame (5 scenarios, real PUMA Lekki inventory)
- **Games.css** — Full dark theme styling
- **game-scenarios.js** — All scenario data extracted to dedicated file
- **Full-screen overlay** — Games hide BottomNav during gameplay (`game-fullscreen-overlay`)
- **Role override fix** — Games/Practice now use `role` from context (respects Profile role switcher) instead of `profile?.role` (DB only)
- **Tournament images** — Copied r5b-single.jpeg + r5-negative-prompt.jpeg to `public/images/` as game card banners (resized to 400px, ~30KB each)
- **Addon icons** — Replaced "IMG" placeholders with Remix Icon category icons (socks, caps, bags, etc.)
- **Unicode fix** — `\u00B7` in JSX text rendered as literal; fixed to `{'\u00B7'}`
- **Vercel deploy** — Fixed deploy target (was going to `app` project, needed `puma` project). Alias `puma-training.vercel.app` manually set.

## What's NOT Done
- **Full QA pass** — user requested "full check and qa before showing me". Deployed but user hasn't confirmed visuals yet.
- **Demo guide** — Next in sequence after Games passes
- **6 mission-specific production images** — Tournament selected Flux Kontext Pro ($0.025/img) but production images not yet generated. Game cards have 2 images; individual scenario illustrations don't exist yet.
- **Price Defense game** — Third game, locked state only (no gameplay implemented)

## Key Files
```
src/pages/Games.jsx          — Main component (735 lines)
src/pages/Games.css          — Styles (585 lines)
src/data/game-scenarios.js   — Scenario data (183 lines)
public/images/game-approach.jpeg  — Card image (33KB, 400x400)
public/images/game-basket.jpeg    — Card image (29KB, 400x400)
```

## Key Decisions
- **Game IDs:** `game-approach` and `game-basket` (text in completions table, no schema change)
- **BottomNav hiding:** Full-screen overlay with `position: fixed; z-index: 100` (no sub-routes needed)
- **Role routing:** Uses `role` from UserContext (respects roleOverride) not `profile?.role`
- **Image source:** Tournament winners at `projects/.cache/image-gen-test/` — r5b-single (approach) and r5-negative-prompt (basket)
- **Vercel project:** Deploy to `puma` project (linked via `vercel link --project puma`), NOT `app` project

## Bugs Found This Session
1. **Vercel deploy target wrong** — `npx vercel --prod` deployed to `app` project, not `puma`. Fixed by relinking.
2. **puma-training.vercel.app not aliased** — Needed manual `vercel alias set`. Must do this after each deploy.
3. **Role override inconsistency** — Games/Practice used `profile?.role` (DB), StaffDetail used `role` (override). Manager in "staff view" saw team page but got blank on staff card click.
4. **Unicode escape in JSX text** — `\u00B7` in plain JSX text = literal backslashes. Must use `{'\u00B7'}`.
5. **Images in wrong directory** — Tournament images at `projects/.cache/image-gen-test/`, not in app directory.

## User Feedback
- "I think next time we build an app we do screen by screen play before UI" — Map screens and flows BEFORE building components. Connects to ASCII-First principle.
- "do a full check and qa before showing me" — Don't deploy incrementally. QA everything first, show once.

## Resume Instructions
- **read:** This pickup file + `src/pages/Games.jsx`
- **do:** Get user feedback on deployed Games. If approved, move to Demo Guide.
- **context:** Games rebuilt from prototypes. Two bugs fixed (role + overlay). Deploy is LIVE at puma-training.vercel.app.
