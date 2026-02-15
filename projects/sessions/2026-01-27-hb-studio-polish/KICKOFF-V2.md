# HB Studio Polish - Execution Kickoff v2

---

## 🚀 Kickoff Prompt

Copy and paste this to start the execution session:

```
Read the kickoff document at:
/Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/1_Projects/ParaPro-001/session-packets/2026-01-27-hb-studio-polish/KICKOFF-V2.md

Execute all items in the "CONFIRMED" section. For items in "PENDING ROCHELLE" section, check if answers have been provided - if not, skip those and note them in the handoff.

Work through systematically:
1. Fix the £undefined bug in the worker first (blocking issue)
2. Then frontend changes in booking-demo.html
3. Then index.html and event-type-funnel.html
4. Test locally if possible
5. Deploy both worker and frontend
6. Create HANDOFF.md with what was done and any remaining items
```

---

**Session:** 2026-01-27
**Source:** TG Export from Cousin Rochelle BIZ (jan27/AM TG CUZ 001)
**Status:** Ready for execution (some items pending Rochelle's answers)

---

## CONFIRMED - Execute These

### 1. Fix £undefined Bug
**Location:** Worker backend (hb-booking-backend)
**Issue:** API response returns undefined for `result.deposit` and `result.total`
**Fix:** Ensure booking submission endpoint calculates and returns:
```javascript
{
  deposit: calculatedDeposit,  // 50% of total
  total: totalPrice,           // Based on duration selected
  bookingId: "HS-XXXXXX",
  bankDetails: { ... }
}
```

---

### 2. Terminology: "deposit" → "reservation fee"

**booking-demo.html:**
| Line | Current | Change to |
|------|---------|-----------|
| 1491 | `50% deposit to confirm` | `50% reservation fee to confirm` |
| 2213 | `£${deposit}` | Keep (variable name OK) |
| 2215 | `Pay £${deposit} Deposit` | `Pay £${deposit} Reservation Fee` |
| 2246 | `£150` | Keep |
| 2247 | `Remaining £150 due...` | Keep |
| 2248 | `Pay £150 Deposit` | `Pay £150 Reservation Fee` |

**index.html:** Replace "deposit" with "reservation fee" EXCEPT for:
- "damages deposit" (different concept - keep as-is)
- Line 1274: Keep as "damages deposit"

---

### 3. Tables: 2 → 10
**Location:** booking-demo.html:1506
```html
<!-- Current -->
<div class="label">2 tables</div>

<!-- Change to -->
<div class="label">10 tables</div>
```

---

### 4. Bonus Hour Removal

**index.html:**
| Line | Current | Change to |
|------|---------|-----------|
| 522 | `6 hours + bonus hour` | `6 hours` |
| 523-524 | `Includes complimentary bonus hour...` | Remove sentence |
| 562 | `12 hours + bonus hour` | `12 hours` |
| 563-564 | `Includes complimentary bonus hour...` | Remove sentence |

**event-type-funnel.html:**
| Line | Current | Change to |
|------|---------|-----------|
| 169 | `6 hours + bonus hour` | `6 hours` |
| 217 | `duration: '6 hours + bonus hour'` | `duration: '6 hours'` |
| 245 | `duration: '6 hours + bonus hour'` | `duration: '6 hours'` |
| 273 | `duration: '6 hours + bonus hour'` | `duration: '6 hours'` |
| 303 | `duration: '12 hours + bonus hour'` | `duration: '12 hours'` |
| 318 | `duration: '6 hours + bonus hour'` | `duration: '6 hours'` |

---

### 5. Run-Over Fee Warning
**Location:** booking-demo.html, add to FAQ section (around line 1555)
```html
<div class="faq-item">
    <div class="faq-q">What if I run over my booking time?</div>
    <div class="faq-a">You will be charged £100 for every hour (or part thereof) that you exceed your booked time.</div>
</div>
```

---

### 6. Cancellation Policy Update
**Location:** booking-demo.html:1557-1560, replace FAQ item:
```html
<div class="faq-item">
    <div class="faq-q">What if I need to cancel?</div>
    <div class="faq-a">
        • 30+ days: Full refund of reservation fee, or free reschedule<br>
        • 15–30 days: 50% refunded, or 1 free reschedule (confirm within 14 days)<br>
        • 7–14 days: Non-refundable. £25 admin fee for reschedule<br>
        • Less than 7 days: Forfeited, no reschedule<br>
        • No-show/same-day: Full booking charged
    </div>
</div>
```

---

### 7. Food & Drink Policy Update
**Location:** booking-demo.html:1561-1565, replace FAQ item:
```html
<div class="faq-item">
    <div class="faq-q">Can I bring my own food & drinks?</div>
    <div class="faq-a">
        Yes! Kitchenette includes fridge, 5-hob stove, microwave, double oven.
        Outside catering welcome. No deep fat fryers.
        We do not provide cooking utensils. Space must be left as found.
    </div>
</div>
```

---

### 8. Address Footer
**Location:** booking-demo.html, add before closing `</body>`:
```html
<footer style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.8rem;">
    19a Peto Street North
</footer>
```
Also add to confirmation screen (step9) if not visible there.

---

### 9. Default to Light Theme
**Location:** booking-demo.html ~line 1722-1727
```javascript
// Current
(function initTheme() {
    const savedTheme = localStorage.getItem('hb-booking-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
})();

// Change to
(function initTheme() {
    const savedTheme = localStorage.getItem('hb-booking-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();
```

---

### 10. Hide Extras Section
**Location:** booking-demo.html:1527-1553

Option A - Comment out:
```html
<!-- EXTRAS HIDDEN FOR NOW
<div class="extras-section" id="extrasSection">
    ...
</div>
-->
```

Option B - Add CSS:
```css
.extras-section { display: none; }
```

Also remove/comment out the `toggleExtra()` function and `updateDepositAmount()` extras logic.

---

### 11. Dynamic Pricing
**Location:** booking-demo.html

Update `basePrice` to be dynamic based on duration. Pricing table:
| Duration | Price | 50% Deposit |
|----------|-------|-------------|
| 4hr | £345 | £172.50 |
| 6hr | £465 | £232.50 |
| 8hr | £645 | £322.50 |
| 12hr | £885 | £442.50 |

Implementation will depend on how duration selection works (see PENDING section).

---

## PENDING ROCHELLE - Waiting for Answers

See [ROCHELLE-BRIEF.md](./ROCHELLE-BRIEF.md) for the message sent to her.

### P1. Buffer Between Bookings
**Question:** How much time between one event ending and next starting?
**Options:** A) None, B) 30min, C) 1hr, D) Other
**Impacts:** Calendar blocking logic in worker

### P2. Time Slot Style
**Question:** Fixed slots (Option A) or flexible start times (Option B)?
**Options:** See brief for details
**Impacts:** Entire step 5 UI in booking-demo.html, worker availability logic

### P3. Late Finish Option
**Question:** Include 4pm-midnight (£845) in booking flow?
**Options:** A) Include, B) Remove, C) Main site only
**Impacts:** Whether to add this as a duration option

---

## Files to Modify

| File | Confirmed Changes | Pending Changes |
|------|-------------------|-----------------|
| `hb-booking-backend/` (worker) | Fix £undefined | Buffer logic |
| `booking-demo.html` | Items 2-10 | Duration UI, pricing |
| `index.html` | Items 2, 4 | — |
| `event-type-funnel.html` | Item 4 | — |

---

## Verification Checklist

**Confirmed items:**
- [ ] £undefined bug fixed - amounts show correctly
- [ ] "deposit" → "reservation fee" (except damages deposit)
- [ ] Tables shows "10 tables"
- [ ] No "bonus hour" text anywhere
- [ ] Run-over fee warning visible in FAQ
- [ ] Cancellation policy text updated
- [ ] Food & drink policy text updated
- [ ] Address in footer
- [ ] Light mode is default
- [ ] Extras section hidden

**Pending items (if Rochelle answers):**
- [ ] Duration options working (4hr, 6hr, 8hr, 12hr)
- [ ] Pricing dynamic based on selection
- [ ] Buffer implemented in calendar logic

---

## Deploy Commands

After confirmed changes:
```bash
# Frontend (GitHub Pages)
cd /path/to/hibiscus-studio-deploy
git add booking-demo.html index.html event-type-funnel.html
git commit -m "feat: Client updates - terminology, policies, UI polish"
git push

# Backend (Cloudflare Worker) - if worker changes made
cd /path/to/hb-booking-backend
npx wrangler deploy
```
