# Analytics Setup — HB Studio

**Created:** 2026-01-21
**Status:** Not yet implemented

---

## Current State

- Landing page: hibiscusstudio.co.uk
- Hosting: GitHub Pages
- Analytics: **NONE**
- Tracking: **NONE**

We have no idea how many people visit the site or what they do.

---

## Recommended Stack

### Quantitative: Umami

**Why Umami:**
- Free (self-hosted)
- Already have Render (chatbot hosted there)
- Supports custom events
- Privacy-focused (no cookies, GDPR compliant)
- Simple dashboard

**Setup Steps:**

1. **Deploy Umami on Render**
   ```
   - Go to Render dashboard
   - New > Web Service
   - Use Umami Docker image: ghcr.io/umami-software/umami:postgresql-latest
   - Add PostgreSQL database
   - Set environment variables (DATABASE_URL, etc.)
   - Deploy
   ```

2. **Add tracking script to landing page**
   ```html
   <script async src="https://your-umami.onrender.com/script.js"
           data-website-id="your-website-id"></script>
   ```

3. **Add custom events for booking flow**
   ```javascript
   // When user clicks "View Booking Options"
   umami.track('clicked-view-booking-options');

   // When user selects event type
   umami.track('selected-event-hire');

   // When user clicks Book Now
   umami.track('clicked-book-now');
   ```

---

### Qualitative: Lucky Orange (Optional)

**Why Lucky Orange:**
- Session recordings (watch what users do)
- Heatmaps (see where they click)
- Form analytics (see where they abandon)

**Cost:** Has free tier, paid starts at $10/mo

**When to add:** After we have quantitative data and want to understand WHY people drop off.

---

## Metrics We'll Track

### Page-Level (Automatic)
- Unique visitors
- Page views
- Bounce rate
- Time on page
- Referrer sources

### Funnel Events (Custom)

| Event | Trigger | Purpose |
|-------|---------|---------|
| `page-loaded` | Page load | Baseline |
| `scrolled-to-booking` | Scroll to booking section | Engagement |
| `clicked-view-options` | Click "View Booking Options" | Interest |
| `selected-category` | Click Event/Workshop/etc | Category interest |
| `selected-duration` | Click 4hr/6hr/8hr | Duration preference |
| `clicked-book-now` | Click "Book Now" | Intent to book |
| `left-for-acuity` | Redirect to Acuity | Handoff |

### Calculated Metrics

```
Conversion Rate = Bookings / Unique Visitors
Click-through Rate = clicked-book-now / page-loaded
Drop-off Point = Where most people stop in funnel
```

---

## Implementation Timeline

| Day | Action |
|-----|--------|
| Day 1 | Deploy Umami on Render |
| Day 1 | Add script tag to landing page |
| Day 2 | Add custom event tracking |
| Day 3-9 | Collect baseline data |
| Day 10 | Analyze: visitors, conversion, drop-off |

---

## Alternative Options Considered

| Tool | Cost | Pros | Cons |
|------|------|------|------|
| Google Analytics | Free | Industry standard | Complex, privacy concerns |
| Plausible | €9/mo | Simple, privacy-focused | Not free |
| Umami | Free | Self-hosted, custom events | Need to maintain |
| Cloudflare Analytics | Free | No script needed if on CF | No custom events |
| Fathom | $14/mo | Simple, fast | Not free |

**Decision: Umami** — Free, supports custom events, already have Render.

---

## Code Snippets

### Basic Tracking (add to index.html)
```html
<!-- Umami Analytics -->
<script async src="https://hb-analytics.onrender.com/script.js"
        data-website-id="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"></script>
```

### Custom Event Examples
```javascript
// Track booking button clicks
document.querySelectorAll('.book-now-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    umami.track('clicked-book-now', {
      category: btn.dataset.category,
      duration: btn.dataset.duration
    });
  });
});

// Track scroll depth
let tracked25 = false, tracked50 = false, tracked75 = false;
window.addEventListener('scroll', () => {
  const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  if (scrollPercent > 25 && !tracked25) { umami.track('scrolled-25'); tracked25 = true; }
  if (scrollPercent > 50 && !tracked50) { umami.track('scrolled-50'); tracked50 = true; }
  if (scrollPercent > 75 && !tracked75) { umami.track('scrolled-75'); tracked75 = true; }
});
```

---

## Notes

- GitHub Pages doesn't support server-side analytics, so client-side (Umami) is required
- Umami is GDPR compliant by default (no cookies, no personal data)
- Custom events require the booking flow to be instrumented
- Consider adding UTM parameters to Linktree links to track source
