---
session_id: 2026-02-10-hb-calculator-conversion-fixes
session_date: 2026-02-10
duration_hours: 4.0
projects_touched: [HB]
work_types: [implementation, infrastructure]
value_tier: critical
impact_score: 9
decisions_count: 8
artifacts_count: 4
tasks_completed: 7
items_open: 3
---

# Session Packet: HB Calculator — 3 Conversion Fixes + Lead Pipeline

**Session Date:** 2026-02-10
**Status:** ✅ Complete
**Duration:** ~4h (across 2 context windows)
**Work Type:** implementation

---

## CONTEXT

Calculator page was built yesterday (Feb 9) and scored 9/10 on wizard UX but 5/10 on three areas: Trust/Social Proof, Below-Fold Coherence, Conversion Architecture. A real ICP baker (Eddie's Cake Bar / Shola Jay) tested the live page and sent feedback via WhatsApp (4 screenshots + 3 voice notes). This session implemented the 3 critical fixes and incorporated Eddie's feedback.

---

## DECISIONS MADE

### 1. IG DM Capture over Email (CRITICAL)

**Decision:** Use Instagram handle capture instead of email for lead collection

**Why:** Email = too much friction for Instagram-native audience. IG DM is a conversation starter. Manual response initially, automatable later via IG API.

**Impact:** Zero-friction lead capture. Every calculator user is now a potential conversation.

**Location:** `hb/site/calculator/explore.html` (DM capture section after edit panel)

### 2. Branded Breakdown Page over PDF/Email (CRITICAL)

**Decision:** Generate shareable link (`/calculator/b/?id=xxx`) backed by KV, not PDF or email attachment

**Why:** Link = lightweight to build (KV read + template), high polish to receive (branded web page), easy to deliver (paste in DM), saveable/shareable/reopenable. PDF requires gen library. Email requires inbox access.

**Impact:** Rochelle can DM a branded link. Recipient gets personalised page that drives to booking.

**Location:** `hb/site/calculator/b/index.html` + `hb/booking-backend/src/index.js`

### 3. Telegram Notifications to Workshop Leads Topic (IMPORTANT)

**Decision:** Bot sends 2 messages per lead: alert (with IG profile link) + copy-paste DM message

**Why:** Rochelle's flow is now 2 taps: tap IG link → open DM → paste message 2. Closest to automation for v1.

**Impact:** Lead response time drops from "whenever she checks" to "instant notification"

**Location:** `hb/booking-backend/src/index.js` (POST /api/calculator-lead)

### 4. "Most venues start from" Copy (IMPORTANT)

**Decision:** Changed "Your current venue" to "Most venues start from" in comparison section

**Why:** Eddie's voice note feedback — emphasises price difference without assuming we know their venue. More credible framing.

**Location:** `hb/site/calculator/explore.html` + `hb/site/calculator/b/index.html`

### 5. All-Inclusive Savings Explainer (IMPORTANT)

**Decision:** Savings line now says "Save £X/workshop — kitchen, setup & lighting all included" instead of "You'd save £X per workshop with us"

**Why:** Eddie's voice note 1: "Where it says you save, it would be good for a vendor to know WHY they're saving." The WHY = all-inclusive.

**Location:** Both `calculate()` and `updateFromEdit()` in explore.html + breakdown page

### 6. Smart Nudges with Edit Guidance (IMPORTANT)

**Decision:** Margin-based coaching below profit number. Low margin: "Tip: Raising your ticket by £20 would add £X. Tap Edit inputs to adjust." Negative: warning. High: encouragement.

**Why:** Numbers alone don't guide action. Nudge + explicit CTA to "Edit inputs" closes the loop.

**Location:** `hb/site/calculator/explore.html` (calculate() + updateFromEdit())

### 7. Scenes Section Removed, Social Proof Added (IMPORTANT)

**Decision:** Cut 4 full-bleed scene sections (~1040px). Added social proof strip (50+ workshops, 250+ hours, 500+ customers). Kept video strip.

**Why:** Scenes were orphaned venue marketing disconnected from calculator context. Social proof numbers are REAL and verifiable.

**Location:** `hb/site/calculator/explore.html`

### 8. Dynamic Features Heading (MINOR)

**Decision:** "What your £750 at HBS includes" — references user's actual venue cost

**Why:** Personalisation increases relevance. User sees their number reflected back.

**Location:** `hb/site/calculator/explore.html` (featuresHeading element)

---

## WHAT WAS CREATED

- **`hb/site/calculator/b/index.html`** — Branded breakdown page. Mobile-first, dark glass style, reads from KV via API. Shows: profit, 4-stat grid, cost breakdown, venue comparison, included features, booking CTA.
- **POST `/api/calculator-lead`** — Stores lead in KV (`calc-lead:{id}`), sends Telegram notification (2 messages to Workshop Leads topic), returns breakdown URL
- **GET `/api/calculator-lead/:id`** — Returns lead data for breakdown page
- **GET `/api/calculator-lead`** — Lists all leads (admin)
- **Telegram bot `@hbsworkshop_bot`** — "HBS - Workshop Leads" bot in Motion x Flour group, Workshop Leads topic (thread_id: 473)
- **`fix-verify.mjs`** — Puppeteer verification script (10 screenshots, mobile viewport)

## WHAT WAS UPDATED

- **`hb/site/calculator/explore.html`** — DM capture section, smart nudges, social proof strip, comparison copy, savings explainer, dynamic features heading, final CTA rewrite, scenes section removed
- **`hb/booking-backend/src/index.js`** — 3 new API routes + Telegram notification logic
- **Backend secrets:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_THREAD_ID`
- **GitHub Pages:** Pushed to main (commit `7e077af`)
- **5 backend deployments** (progressive: routes → Telegram → topic → IG link)

---

## VALUE DELIVERED

### Immediate
- Calculator page now captures leads (was losing every non-booker)
- Rochelle gets instant Telegram notification with IG profile link + copy-paste DM message
- Eddie's Cake Bar feedback fully addressed (comparison copy, savings explainer, visibility)
- Below-fold tightened from 6 screens to 3-4 (removed orphaned venue tour)
- Social proof with real numbers (50+ workshops, 250+ hours, 500+ customers)
- Smart margin coaching guides users to better pricing decisions

### Foundational
- Lead pipeline: Calculator → KV → Telegram → IG DM → Branded breakdown page → Book CTA
- Breakdown page pattern reusable for other lead magnets
- Telegram bot infrastructure ready for future automation (IG API integration)
- Whisper transcription workflow proven for processing voice feedback

---

## OPEN ITEMS

1. **Venue cost doesn't change with duration in edit mode** — 8hrs → 6hrs keeps same venue cost. The stepper edits venue independently of duration. May need duration-aware venue pricing.
2. **Page loading speed** — Eddie noted slow loading in video feedback. May need lazy loading for video strip or image optimization.
3. **Clean up test leads from KV** — Several test entries (`@test_baker`, `@test_topic_check`, `@feyintest`, `@eddiescakerybar`) created during development. Clean via admin API or KV dashboard.

---

## META

**Pattern observed:** Voice note transcription (whisper) + video frame extraction (ffmpeg) = powerful feedback processing pipeline. 3 voice notes + 1 screen recording → full feature understanding in minutes. Should become a standard skill.

**Lesson:** ig.me/m/ deep links are unreliable. Use instagram.com/USERNAME/ which always opens the profile in the IG app. The user then taps Message — one extra tap but 100% reliable.
