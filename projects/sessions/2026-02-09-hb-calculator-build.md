---
session_id: 2026-02-09-hb-calculator-build
session_date: 2026-02-09
duration_hours: 5.0
projects_touched: [HB, INFRA]
work_types: [implementation, design, infrastructure]
value_tier: high
impact_score: 9
decisions_count: 17
artifacts_count: 10
tasks_completed: 16
items_open: 4
---

# Session Packet: HB Calculator Landing Page Build + Deploy + Polish

**Session Date:** 2026-02-09 (Monday, ~7pm-12am)
**Status:** ✅ Complete
**Duration:** ~5h (across 3 context compactions)
**Work Type:** Implementation + Design + Infrastructure

---

## CONTEXT

This session built the HB Studio calculator landing page from spec (`hb/ep-landing-page-framework.md`). The page is the second step in the revenue chain: PDF → **Calculator** → Booking → Hosting. Target audience: bakers, aesthetics practitioners, workshop hosts in London. 80% mobile traffic expected (Instagram/TikTok referrals). Goal: lead generation → booking at hibiscusstudio.co.uk/book/.

Reference site (baked.design) was screenshotted for visual inspiration. Video frames extracted from HB content for background clips. Three rounds of user feedback applied.

---

## DECISIONS MADE

### 1. Glassmorphic mobile-first design (IMPORTANT)

**Decision:** Full glassmorphism — backdrop-filter blur, semi-transparent panels, gradient overlays on scene images. DM Serif Display + Inter typography.

**Why:** Target audience (Instagram/TikTok creators) expects premium visual quality. baked.design reference validated the aesthetic direction.

**Impact:** Page looks high-end, matches HB Studio brand positioning.

### 2. Chip selectors for attendees + duration (IMPORTANT)

**Decision:** Replaced free-form inputs with chip buttons. Attendees: 8-10, 10-15, 15-20, 20+. Duration: 6hr, 8hr, 12hr.

**Why:** Reduces friction on mobile (no keyboard), guides users to realistic ranges, auto-updates venue cost suggestion.

### 3. Actual backend pricing, not fabricated (CRITICAL)

**Decision:** Pulled exact prices from deployed backend: WORKSHOP_PRICES {2:120, 6:345, 12:645}, EVENT_HIRE_PRICES {4:345, 6:465, 8:645, 12:885}. For calculator: 6hr=£345, 8hr=£465, 12hr=£645.

**Why:** User corrected: "Use the actual prices we have on the deployed site." Backend has fallback logic — 8hr workshop uses EVENT_HIRE_PRICES[6]=£465 because WORKSHOP_PRICES[8] is undefined.

**Impact:** Prices on calculator now match what a customer would actually be quoted.

### 4. Duration auto-updates venue cost (IMPORTANT)

**Decision:** Selecting duration changes the suggested venue cost (6hr=£550, 8hr=£750, 12hr=£1100). Manual edit overrides auto-suggestion via `venueManuallyEdited` flag.

**Why:** Different durations have very different venue costs in London. Static £750 for all durations would mislead.

### 5. Anchored venue cost with bold Edit button (IMPORTANT)

**Decision:** Venue cost pre-filled with suggestion ("Suggested for comparison"), Edit button visible as white bordered pill (12px, font-weight 600).

**Why:** Price anchoring — users see their venue cost vs HBS cost. "Average London workshop venue" was unverified → changed to "Suggested for comparison."

### 6. Savings fallback messaging (IMPORTANT)

**Decision:** Three states: savings > 0 (green, "You'd save £X"), savings = 0 ("Same price — but purpose-built"), HBS costs more ("purpose-built for workshops — kitchen, lighting, setup included").

**Why:** HBS isn't always cheaper. Messaging shouldn't break when the comparison is unfavorable.

### 7. Removed placeholder testimonials (MINOR)

**Decision:** Removed all 3 placeholder testimonial scenes entirely.

**Why:** Rubric scored Content Completeness at 5/10. Placeholder text ("Placeholder for baker workshop testimonial") visible to users. Better to ship without than with fakes.

### 8. Before/after rewritten as venue comparison (IMPORTANT)

**Decision:** Changed from "Without calculator / With calculator" to "Typical Venue / Hibiscus Studio" with concrete differences (kitchen, AV, setup help, flexible scheduling).

**Why:** The conversion goal is booking HBS, not using the calculator. Before/after should sell the venue.

### 9. Video quality at 480px CRF 26 (MINOR)

**Decision:** Re-encoded video clips from 360px CRF 32 (86-155KB) to 480px CRF 26 (414-657KB). Total ~2.2MB for 4 clips.

**Why:** Previous encoding was too compressed for production quality. 480px is sufficient for mobile background video.

### 10. Address corrected to E16 1DP (CRITICAL)

**Decision:** Fixed studio address from "Camberwell, SE5" to "19a Peto Street North, London E16 1DP" with Google Maps link.

**Why:** Backend BUSINESS_DETAILS has the correct address. project.json had wrong postcode.

### 11. Booking links → hibiscusstudio.co.uk/book/ (IMPORTANT)

**Decision:** All CTAs link to `https://hibiscusstudio.co.uk/book/` instead of Instagram DM.

**Why:** Direct booking conversion is the goal. Instagram DM adds unnecessary friction.

### 12. Mobile number keypad (MINOR)

**Decision:** Added `inputmode="decimal" pattern="[0-9]*"` to price inputs.

**Why:** iOS needs both attributes to trigger the numeric keypad instead of full text keyboard.

### 13. Blur reduced to 30% on scene ::after (MINOR)

**Decision:** Reduced backdrop-filter blur overlay from 45% to 30% height on hybrid first scene.

**Why:** User screenshot showed blur creeping too high on "bouquet to business" floral scene — obscuring the flowers above the text area.

### 14. Desktop max-width centering (IMPORTANT)

**Decision:** Added max-width constraints at 768px+ breakpoint: hero-content 600px, scenes 900px, before/after 800px, CTA 700px, features 900px. Video strip center-justified. 1200px+ breakpoint added.

**Why:** Desktop audit found all content stretching edge-to-edge on ultrawide screens. Hero hugged bottom-left with empty right side.

### 15. Full accessibility pass (IMPORTANT)

**Decision:** Added: form labels, radiogroup roles + aria-checked on chips, aria-live on results, aria-expanded on Edit toggle, focus-visible outlines, aria-hidden on decorative SVGs, meaningful alt text on all 8 images, h2 for section headers.

**Why:** A11y audit found 8 critical issues (no labels, no ARIA, orphaned headings, empty alt text). Fixed all for WCAG AA baseline.

### 16. Before/after stacked on mobile (IMPORTANT)

**Decision:** Changed ba-grid from 2-column to single column on mobile. Desktop restores 2-column.

**Why:** Puppeteer screenshots showed 2 columns at 390px = 165px each. "Professional kitchen included" wrapping awkwardly. Stacking fixed readability.

### 17. OG meta tags for sharing (IMPORTANT)

**Decision:** Added og:title, og:description, og:type, og:url, meta description, canonical URL.

**Why:** Rochelle will share via WhatsApp/Telegram. Without OG tags = blank preview. Now shows title + description.

---

## WHAT WAS CREATED

- `hb/site/calculator/explore.html` — Complete calculator landing page (~1474 lines)
  - Hero with video background + poster frames
  - 4-step calculator (ticket price, attendees chips, duration chips, anchored venue cost)
  - Expanded results with cost breakdown, savings comparison, yearly projection
  - Video strip (4 clips, auto-play/pause via IntersectionObserver)
  - Scene sections (hybrid mode: full-bleed image + photo cards)
  - Before/after venue comparison
  - Features grid
  - Final CTA ("Check Availability" → hibiscusstudio.co.uk/book/)
  - Sticky mobile bottom bar
- `hb/site/calculator/ref/clips/v1-web.mp4` through `v4-web.mp4` — Web-optimized video clips (480px CRF 26)
- `hb/site/calculator/ref/clips/poster1.jpg` through `poster4.jpg` — Video poster frames
- `hb/outreach-list.md` — 17 profile leads from Telegram export (Tier 1-4, sorted by ICP fit)

## WHAT WAS UPDATED

- `hb/project.json` — Fixed entity address (E16 1DP, not SE5 Camberwell)
- `hb/site/calculator/ref/clips/` — Re-encoded all videos at higher quality
- `hb/site/calculator/explore.html` — 3 post-build commits: blur fix + deploy, desktop+a11y, mobile UX
- `memory/projects.md` — Address correction, pricing lesson, calculator page location
- `hud/data.js` — Calculator shipped, doNext updated, 3 new shipped items
- `sessions/LAUNCH.md` — Regenerated with calculator in tools inventory

---

## VALUE DELIVERED

### Immediate
- Calculator page LIVE at hibiscusstudio.co.uk/calculator/explore.html
- Deployed to GitHub Pages (3 commits: initial, desktop+a11y, mobile UX)
- Rochelle can see it at 9am on any device (mobile-optimized, desktop-polished)
- WhatsApp/Telegram sharing works (OG meta tags)
- Outreach list has 17 leads sorted by ICP fit (3 bakers, 8 beauty, 4 workshop ops, 3 adjacent)
- Prices match actual deployed backend — no false promises

### Foundational
- Calculator establishes price anchoring pattern (compare your venue → book ours)
- Chip-based inputs reduce mobile friction (no keyboard, guided ranges)
- Savings fallback messaging works even when HBS costs more
- Desktop layout pattern established (max-width centering for all sections)
- Accessibility foundation set (ARIA, labels, semantics) — buildable for future pages
- Video assets ready for reuse across HBS marketing
- Puppeteer visual QA workflow established (screenshot → evaluate → fix → verify)

---

## RECURSIVE RUBRIC RESULTS

### Round 1 → Round 2 (shipped)

| # | Criterion | R1 | R2 | Notes |
|---|-----------|----|----|-------|
| 1 | Pricing accuracy | 5 | 9 | Fixed: pulled from backend, traced fallback logic |
| 2 | Content completeness | 5 | 8 | Removed placeholders (real testimonials need Eddie's Cake Bar) |
| 3 | Anchoring strategy | 6 | 9 | 3 tiers distinct, fallback messaging, "Suggested for comparison" |
| 4 | Copy quality | 7 | 9 | Subtitle specific ("East London"), unverified claims removed |
| 5 | Trust signals | 7 | 8 | No testimonials yet (quality ceiling), strong venue proof |
| 6 | Calculator logic | 7 | 9 | Cost breakdown shown, yearly label fixed |
| 7 | Mobile UX | 8 | 9 | Duration chips, number keypad, bold Edit button |
| 8 | Conversion path | 8 | 8 | All CTAs → booking page, no IG friction |
| 9 | Performance | 8 | 8 | Lazy loading, poster frames, 2.2MB total video |
| 10 | Visual hierarchy | 9 | 9 | Glassmorphism, selective blur, DM Serif headings |

**Adversarial test:** PASSED (skeptical baker persona — "Is this just a fancy ad?")

**5 at 9+, 5 at 8** — remaining 8s are genuine quality ceilings needing real-world data (testimonials, A/B testing, real user behavior).

---

## RECURSIVE RUBRIC RESULTS (continued — Desktop + A11y + Mobile)

### Desktop + A11y Pass (Round 1 → Round 2)

| # | Criterion | R1 | R2 | Notes |
|---|-----------|----|----|-------|
| 1 | Desktop layout | 5 | 9 | Max-width centering on all sections |
| 2 | Desktop hero | 5 | 8 | Hero constrained to 600px. Right side = video bg (intentional) |
| 3 | A11y: contrast | 6 | 8 | Worst offenders bumped. Glass = inherent AA tension |
| 4 | A11y: semantics | 5 | 9 | Labels, h2s, heading hierarchy clean |
| 5 | A11y: keyboard/SR | 5 | 9 | Radiogroups, aria-checked, aria-live, focus-visible |
| 6 | Meta & SEO | 5 | 9 | OG tags, description, canonical |
| 7 | Copy: first impression | 8 | 9 | WhatsApp preview works now |
| 8 | Conversion flow | 8 | 9 | Desktop no longer broken |
| 9 | Trust & credibility | 8 | 9 | Real alt text, proper semantics |
| 10 | Performance | 8 | 8 | Already solid |

### Mobile Pass (Round 1 → Round 2, with Puppeteer verification)

| # | Criterion | R1 | R2 | Notes |
|---|-----------|----|----|-------|
| 1 | Hero fold | 8 | 9 | Text-shadow on subtitle for video contrast |
| 2 | Calculator UX | 9 | 9 | Already strong |
| 3 | Results panel | 9 | 9 | Already strong |
| 4 | Video strip | 9 | 9 | Already strong |
| 5 | Scene sections | 7 | 8 | Larger cards (120×150), more padding |
| 6 | Before/after | 5 | 9 | STACKED on mobile (biggest visual win) |
| 7 | Feature pills | 8 | 9 | Center-aligned |
| 8 | Final CTA | 9 | 9 | Already strong |
| 9 | Sticky bar | 8 | 9 | Bolder text (14px/700) |
| 10 | Spacing/rhythm | 7 | 9 | Dividers visible, vertical margins |

**Both adversarial tests PASSED** (Rochelle persona + one-thumb baker persona).

---

## OPEN ITEMS

- Add real testimonials after Eddie's Cake Bar workshop (April 19)
- Make ingredients cost editable (currently hardcoded at £50/head)
- Add "X workshops hosted" counter (when data exists)
- Fix backend: add explicit 8hr workshop price (currently falls back to EVENT_HIRE)

---

## META

**Pattern observed:** Always trace pricing to the actual deployed source. Fabricated numbers get caught immediately.

**Pattern observed:** Puppeteer screenshots → visual evaluation → fix → re-screenshot is the most effective QA loop for landing pages. Catches things code review misses (cramped layouts, contrast issues, visual hierarchy problems).

**Lesson:** "Average London workshop venue" is an unverifiable claim. Use "Suggested for comparison" instead — honest anchoring without false authority.

**Lesson:** Mobile-first means chips > inputs. Every text input is a friction point on mobile.

**Lesson:** Before/after comparisons must stack on narrow mobile viewports. Two 165px columns are unreadable — always test at 390px with real content.

**Error codified:** project.json had "Camberwell, SE5" — backend has "E16 1DP". Always cross-reference backend BUSINESS_DETAILS for ground truth.
