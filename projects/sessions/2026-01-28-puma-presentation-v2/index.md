# Session Packet: PUMA Presentation v2

**Session Date:** 2026-01-28
**Project:** FORJE RETAIL (ParaPro-001)
**Status:** ✅ Complete

---

## Query Target

**what:** Slide deck for PUMA pilot → business partner (Timi) → leadership presentation
**why:** Get Timi's reaction first, iterate quickly before PUMA leadership sees it
**outcome:** 15-slide responsive HTML presentation with all feedback incorporated

---

## Status HUD

```
◇ DRY RUN FEEDBACK
  ✓ 10+ slides reviewed by user (voice notes)
  ✓ Color confusion identified (red used for both problems + solutions)
  ✓ Missing visual examples (speech bubbles requested)
  ✓ Wording clarifications needed (7 slides)

◇ V2 IMPLEMENTATION
  ✓ Complete color system redesign (Red/Blue/Gold semantic coding)
  ✓ Visual examples added (speech bubbles for each mistake)
  ✓ Investment breakdown expanded (what's IN each component)
  ✓ Video testimonial: optional → REQUIRED
  ✓ Scale-up wording clarified ("assuming 20 staff at PUMA")
  ✓ Slide 14 title fix ("Why the Training Works")

◇ DEPLOYMENT STRATEGY
  ✓ GitHub Pages instructions documented
  ✓ WhatsApp message drafted (3 versions for Timi)
  → Recommended: Send file directly first (faster iteration)
  → Deploy to GitHub Pages after Timi's feedback
```

---

## Color System (Critical Decision)

**Problem in v1:**
Red (#E31E24) used for BOTH problems AND highlights → cognitive dissonance

**Solution in v2:**
| Color | Usage | Rationale |
|-------|-------|-----------|
| **Red #E31E24** | Problems, losses, urgent issues | Danger signal |
| **Blue #00A9E0** | Solutions, features, neutral highlights | PUMA brand color, calm |
| **Gold #FFC107** | Positive outcomes, ROI, revenue gains | Achievement signal |

**User feedback:** "The fact that this is red and we had read on the other page now looks confusing. It doesn't look like this is a solution."

---

## Key Changes (v1 → v2)

**Slide 2 (The Problem)**
- Added speech bubble examples for each mistake
- Example: `"Customer enters, looks around... staff doesn't acknowledge... customer leaves"`

**Slide 3 (The Solution)**
- Changed from red to blue
- Added subtitle: "Staff read on phones during breaks—no classroom time needed"
- Explained "missions = bite-sized lessons"

**Slide 6 (Investment)**
- Expanded breakdown of ₦2.955M waived
- Added bullets: what's IN content creation, platform setup, pilot management

**Slide 7 (Expected Results)**
- Revenue impact changed from red to gold
- User: "revenue impact as a plus that is now in the color. It is fucking confusing."

**Slide 10 (Case Study)**
- Video testimonial: optional → **REQUIRED**
- Added specs: "2-3 staff, 30 sec, metric-based"

**Slide 12 (Scale-Up)**
- Changed "20 staff (full PRL Lekki)" → "Assuming 20 staff at PUMA"
- User: "It's not 20 staff for all of your. It's just assuming 20."

**Slide 14 (Why This Works)**
- Title changed to "Why the Training Works"
- User: "It's not another PowerPoint deck first. But this is a PowerPoint deck."

---

## Deliverables

**Files Created:**
1. `puma-pilot-presentation-v2.html` (15 slides, responsive)
2. `slides/README.md` (version history, v2 changes documented)
3. `slides/DEPLOYMENT.md` (GitHub Pages setup instructions)
4. `MESSAGE_TO_TIMI.md` (3 WhatsApp message versions)

**Technical Specs:**
- Responsive design (mobile + desktop)
- Scroll-snap navigation
- Keyboard controls (arrow keys, spacebar)
- Font scaling: CSS `clamp()` for mobile-first
- Dark background (#0a0a0a) for screen viewing

---

## Next Actions

**User workflow:**
1. → Send `puma-pilot-presentation-v2.html` to Timi via WhatsApp
2. → Use message: "Scan it, tell me what doesn't work, ask questions"
3. → Have supporting docs ready (ONE_PAGER_BUSINESS_PARTNER.md, etc.)
4. → Iterate based on Timi's feedback
5. → Deploy to GitHub Pages for PUMA leadership (permanent URL)

**Message to Timi (recommended version):**
```
Hey Timi,

Put together the PUMA presentation deck - 15 slides covering the pilot.

Please scan it and let me know:
- What doesn't work
- What needs more explanation
- Questions PUMA leadership will have

I have full supporting docs ready for deeper dives, but want your
initial reaction first so we can move quickly.

[Attach: puma-pilot-presentation-v2.html]

Open in any browser. Works on phone too.
```

---

## Context Links

**Related files:**
- [PUMA_PILOT_PROPOSAL.md](../../PUMA_PILOT_PROPOSAL.md) - Full written proposal
- Supporting docs: ONE_PAGER_BUSINESS_PARTNER.md, ONE_PAGER_MANAGER.md
- Training content: 24 missions (in separate directory)

**Design decisions:** See [decisions.md](decisions.md) for detailed rationale

---

## User Reaction

> "Yeah, this is actually really good. I've made some comments on what I want to change.
> But to be honest with you for the most part, it's good. So well, well, well done."

**Feedback incorporation:** 100% (all 10+ comments addressed in v2)
