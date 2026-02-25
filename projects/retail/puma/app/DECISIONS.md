# PUMA Training App — Permanent Decisions

**Purpose:** Project-level source of truth. Append-only. Survives sessions, compaction, device switches.
**Read this first** when resuming PUMA work after any break.

---

## Build Process (agreed Feb 19)

### Screen-First Rule
> "Next time we build an app we do screen by screen play before UI"

Before building ANY component:
1. List all screens in the app (names + roles that can see them)
2. ASCII each screen (what's on it, what happens on tap)
3. Play through every user flow (staff journey, manager journey)
4. Get agreement on ALL screens → THEN write a single line of JSX

Bug this prevents: Games was rebuilt from scratch in a prior session, missing all approved prototypes (image tournament, 3 Variant mockups, 2 HTML prototypes). Root cause: no screen inventory. Cost: full session rework.

### Pre-Scan Rule
Before ANY build/rewrite: run `/pre-scan` — checks pickups/, public/, .cache/ for existing artifacts.

---

## Deploy Process (fixed Feb 19)

### Two Vercel Projects
- `app` project → wrong (app-zeta-dusky.vercel.app)
- `puma` project → correct (puma-training.vercel.app)

### Deploy Steps (EVERY time)
```bash
# Link to correct project (if not already linked)
vercel link --project puma

# Deploy
npx vercel --prod

# Set alias (MANDATORY after every deploy — alias doesn't auto-update)
vercel alias set [new-deployment-url] puma-training.vercel.app
```

---

## Role Routing (fixed Feb 19)

### Rule
ALL role-gated pages must use `role` from `useUser()` context, NOT `profile?.role`.

```jsx
// CORRECT — respects roleOverride from Profile switcher
const { profile, role } = useUser()
const isManager = role === 'manager'

// WRONG — ignores roleOverride, uses DB value only
const { profile } = useUser()
const isManager = profile?.role === 'manager'
```

### Why
UserContext has:
- `dbRole` — from Supabase (never changes mid-session)
- `roleOverride` — set by Profile page role switcher (for demo/testing)
- `role` = `roleOverride || dbRole`

Pages using `profile?.role` ignore the override → manager in "staff view" sees wrong content.

---

## Games Page (rebuilt Feb 19)

### Key Files
```
src/pages/Games.jsx          — Main component (750 lines)
src/pages/Games.css          — Styles (600 lines)
src/data/game-scenarios.js   — All scenario data (183 lines)
public/images/game-approach.jpeg  — Card banner (33KB, 400px)
public/images/game-basket.jpeg    — Card banner (29KB, 400px)
```

### Game IDs (Supabase completions table)
- `game-approach` (Approach Game)
- `game-basket` (Build the Basket)
- `game-price-defense` (Price Defense — locked, no gameplay yet)

### BottomNav Hiding During Gameplay
```css
.game-fullscreen-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: var(--bg-body); overflow-y: auto;
}
```
Wrap active game in `<div className="game-fullscreen-overlay">`. No sub-routes needed.

### Image Tournament Results (Feb 18)
- Winner: Flux Kontext Pro ($0.025/image)
- Template: locked (negative_prompt style, Nigerian characters, Archive Green #3A7D44)
- Production images: `r5b-single.jpeg` (Approach card), `r5-negative-prompt.jpeg` (Basket card)
- Source: `projects/.cache/image-gen-test/`
- 6 mission-specific production images NOT yet generated

### Addon Icons (not "IMG" text)
```js
const addonCategoryIcons = {
  addon_socks: 'ri-footprint-line',
  addon_socks_performance: 'ri-run-line',
  addon_headwear: 'ri-baseball-cap-line',
  addon_bag: 'ri-shopping-bag-3-line',
  addon_accessory: 'ri-hand-heart-line',
  addon_bodywear: 'ri-t-shirt-2-line',
}
```

---

## Demo/Trial Packaging (Feb 16)

### Two-Link Pattern (ALWAYS)
1. Overview page: `puma-training.vercel.app/demo-guide.html` — context, non-technical
2. App + creds: `puma-training.vercel.app` + email + password

Demo guide lives in `public/demo-guide.html`. Static HTML deployed with the app.

---

## Unicode in JSX (bug fixed Feb 19)

`\u00B7` in JSX text nodes renders as literal string. Fix:
```jsx
// WRONG
<div>3 staff · Practice</div>

// CORRECT
<div>3 staff {'\u00B7'} Practice</div>
```

---

_Last updated: 2026-02-19 | Append new decisions at relevant sections, never delete_
