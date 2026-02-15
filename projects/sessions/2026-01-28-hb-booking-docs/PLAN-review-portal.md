# Plan: HB Booking Flow Review Portal

**Date:** 2026-01-29
**Project:** Hibiscus Studio
**Status:** 🟡 In Progress

---

## Objective

Build a mobile-first review portal for Rochelle (business owner) to review booking flows remotely, provide voice feedback, and approve/flag screens.

---

## What We've Done

### 1. Documented Booking Flows
- Extracted real flows from source HTML files
- Three flows identified:
  - **Event-Type Funnel** (event-type-funnel.html) - 4 steps
  - **Category-Based Flow** (index.html) - 3 steps + Acuity
  - **Booking Demo Wizard** (booking-demo.html) - 8 steps

### 2. Built Working Review Portal (v7)
- Vanilla JS, minimal code
- Three-level navigation: Flows → Screens → Detail
- Good/bad path toggle
- Shows screen copy and review questions

### 3. Established Patterns
- `PATTERN-vanilla-js-click-handlers.md` - what works in Comet browser
- Key: use `<button>`, use `var`, wrap localStorage in try/catch

### 4. Researched UI Patterns
- Voice: Hold-to-record (WhatsApp/Telegram pattern)
- Navigation: Swipe gestures + progress dots
- Feedback: Quick tap (✓ Good / ⚠ Flag / ? Question)

---

## What We're Building (v8)

### Core Features

| Feature | Implementation |
|---------|----------------|
| Swipe navigation | Touch events, left/right between screens |
| Progress indicator | Dots at bottom (● ● ○ ○ ○) |
| Hold-to-record | touchstart/touchend on mic button |
| Visual feedback | Pulsing red dot + timer (00:15) |
| Quick feedback | Tap ✓ ⚠ ? buttons |
| Auto-screenshot | Capture on voice release |
| Offline storage | IndexedDB for recordings |

### Screen Display (TBD - needs research)

**Current:** Text descriptions of each screen
**Goal:** Actual visual renders of booking screens

Options to research:
1. Static screenshots (pre-captured)
2. Live iframe embed
3. Cloudflare Worker screenshot service
4. Puppeteer/Playwright captures

---

## Research Findings

### 1. Screen Capture: Cloudflare Workers + Puppeteer

**Recommended:** Cloudflare Browser Rendering API

```
https://screenshots.yourdomain.com/?url=hibiscus.studio/book&step=2
```

**Pricing:**
- Free: 10 min/day (enough for ~60 screenshots)
- Paid ($5/mo): 10 hours/month

**Code pattern:**
```javascript
import puppeteer from "@cloudflare/puppeteer";

// Navigate to step, fill fields, capture
await page.goto(url);
await page.click('[data-step="next"]');
await page.screenshot({ type: "png" });
```

**Alternative:** Playwright locally for initial capture, store as static images.

---

### 2. Showing Screens in Review UI

**Pattern: Mobile lightbox with pinch-zoom**

| Component | Library |
|-----------|---------|
| Zoom/pan | Panzoom or PhotoSwipe |
| Lightbox | GLightbox (zero deps) |
| Lazy load | Native `loading="lazy"` + vanilla-lazyload |
| Annotations | Pin-based (tap to place) |

**CSS:**
```css
.screenshot-viewer {
  touch-action: manipulation;
  aspect-ratio: 9 / 19.5; /* iPhone ratio */
}
```

---

### 3. Capturing Multi-Step Funnel States

**State matrix:**
| Step | States to capture |
|------|-------------------|
| 1 | Empty, filled, error |
| 2 | Empty, calendar open, date selected |
| 3 | Empty, filled |
| 4 | Recommendation shown |

**Script pattern (Playwright):**
```javascript
const states = [
  { name: 'step-1-empty', action: null },
  { name: 'step-1-filled', action: () => page.fill('#event-type', 'Birthday') },
  { name: 'step-1-error', action: () => page.click('.next-button') },
];

for (const state of states) {
  if (state.action) await state.action();
  await page.screenshot({ path: `screenshots/${state.name}.png` });
}
```

---

## Resolved Questions

| Question | Answer |
|----------|--------|
| How to capture? | Cloudflare Worker OR Playwright locally → static images |
| How to show? | GLightbox + Panzoom for pinch-zoom |
| Handle states? | Script matrix: empty/filled/error per step |

---

## Architecture (Proposed)

```
┌─────────────────────────────────────────────────┐
│                  Review Portal                   │
│              (Static HTML + JS)                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────┐    ┌─────────────────────────┐ │
│  │ Screen      │    │ Cloudflare Worker       │ │
│  │ Images      │◄───│ Screenshot Service      │ │
│  │ (CDN)       │    │ (captures booking flow) │ │
│  └─────────────┘    └─────────────────────────┘ │
│                                                  │
│  ┌─────────────┐    ┌─────────────────────────┐ │
│  │ Voice Notes │    │ IndexedDB               │ │
│  │ (Blob)      │───►│ (Local Storage)         │ │
│  └─────────────┘    └─────────────────────────┘ │
│                                                  │
│  ┌─────────────┐    ┌─────────────────────────┐ │
│  │ Feedback    │    │ Export JSON             │ │
│  │ Data        │───►│ (Download or API)       │ │
│  └─────────────┘    └─────────────────────────┘ │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Next Steps

1. [ ] Research screen capture with Cloudflare Workers
2. [ ] Research how to display captured screens in mobile UI
3. [ ] Build v8 with swipe + hold-to-record
4. [ ] Integrate actual screen images
5. [ ] Test with Rochelle on her device

---

## Files

| File | Purpose |
|------|---------|
| `review-portal-v7.html` | Working portal (text-based) |
| `test-click.html` | Minimal click test |
| `PATTERN-vanilla-js-click-handlers.md` | Reusable pattern |
| `PLAN-review-portal.md` | This document |
