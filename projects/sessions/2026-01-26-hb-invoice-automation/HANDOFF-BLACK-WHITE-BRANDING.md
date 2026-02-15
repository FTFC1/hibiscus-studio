# Session Handoff: HB Booking - Black & White Branding Continuation

## Context
We've been updating Hibiscus Studio's booking system to an elegant black/white Notion-like design. The admin dashboard (`/admin`) now has light/dark mode toggle working.

## Completed
- [x] Admin dashboard CSS theme (black/white)
- [x] Light/dark mode toggle with localStorage persistence
- [x] PDF invoices updated (charcoal instead of purple)
- [x] Email templates updated (black headers instead of purple gradient)
- [x] Integration script success screens updated
- [x] Hibiscus Studio logo added to admin header

## Remaining Work

### 1. Logo Size Issue
The Hibiscus Studio logo is complex/detailed and currently too small at `height: 36px` in the header. Needs to be larger for legibility.

**Location:** `src/index.js:3711` - the base64 logo `<img>` tag

```html
<img src="data:image/webp;base64,..." alt="Hibiscus Studio" class="logo-img" style="height: 36px; width: auto;" />
```

**Action:** Increase height to ~48-56px and adjust header layout if needed.

### 2. Booking Funnel (Customer-Facing)
The booking funnel that customers see needs the same black/white treatment + light/dark mode. This is served separately from the Worker.

**Check:**
- Where is the booking funnel HTML hosted? (likely static site or separate deployment)
- Apply same CSS variable system for light/dark themes
- Match the Notion-like aesthetic
- Add theme toggle button

**The Worker serves:**
- `integration.js` - JavaScript that enhances the booking form
- Success screens after booking submission
- Slot-taken modals

**The booking form HTML itself** is hosted elsewhere and needs to be located.

### 3. Other Assets to Update
- Any remaining purple/colored elements in the system
- Consistency check across all customer touchpoints
- Consider: confirmation emails, reminder emails, any other templates

## Key Files

| File | Purpose |
|------|---------|
| `projects/2_Areas/01-Hibiscus-Studio/hb-booking-backend/src/index.js` | Main Worker (admin + API) |
| `hb-booking-backend/scripts/compress_logo.py` | Reusable logo compression |
| `hb-booking-backend/wrangler.toml` | Cloudflare config |

## Design System Reference

```css
/* Spacing (shared) */
--sp-1: 4px;
--sp-2: 8px;
--sp-3: 12px;
--sp-4: 16px;

/* Dark Mode (default) */
--bg-base: #0a0a0a;
--bg-surface: #141414;
--bg-elevated: #1f1f1f;
--text-primary: #fafafa;
--text-secondary: #a3a3a3;
--text-muted: #737373;
--accent-primary: #404040;
--accent-success: #fafafa;
--btn-confirm-text: #0a0a0a;

/* Light Mode - Notion-like */
--bg-base: #ffffff;
--bg-surface: #f7f7f5;
--bg-elevated: #ffffff;
--text-primary: #1a1a1a;
--text-secondary: #6b6b6b;
--text-muted: #9b9b9b;
--accent-primary: #e0e0e0;
--accent-success: #1a1a1a;
--btn-confirm-text: #ffffff;
```

## Theme Toggle Implementation

```javascript
// Applied immediately on page load
(function() {
  const savedTheme = localStorage.getItem('hb-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('hb-theme', next);
}
```

## Deployment

```bash
cd projects/2_Areas/01-Hibiscus-Studio/hb-booking-backend
npx wrangler deploy
```

Live URL: https://hb-booking.nicholasfcoker.workers.dev/admin

---

*Last updated: 2026-01-26*
