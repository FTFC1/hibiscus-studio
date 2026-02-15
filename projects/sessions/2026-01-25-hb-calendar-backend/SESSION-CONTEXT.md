# Session: HB Studio Calendar Backend
**Date:** 2026-01-25
**Duration:** ~45 minutes
**Mode:** Interview-first (voice Q&A)

---

## What Was Accomplished

### 1. Google Cloud Service Account Created
- **Project:** hibiscus-booking (under contacthibiscusstudio@gmail.com)
- **Service Account:** hibiscus-booking@hibiscus-booking.iam.gserviceaccount.com
- **Credential File:** `00_Inbox/jan 25/hibiscus-booking-5a667af173fb.json`
- **Calendar API:** Enabled

### 2. Calendar Sharing Configured
| Calendar | Owner | Permission Granted |
|----------|-------|-------------------|
| NEW (contacthibiscusstudio@) | Hibiscus Studio | Make changes to events |
| OLD (hibiscusstudiouk@) | Old account | See all event details |

This enables dual-calendar architecture: check both for conflicts, write to new only.

### 3. Perplexity Research Bundle Preserved
**Location:** `00_Inbox/jan 25/perplexity-bundle/`

Files:
- `hibiscus_backend_strategy.md` - Architecture decisions
- `hibiscus_backend_code.js` - 550 lines, production-ready Cloudflare Worker
- `hibiscus_deployment_guide.md` - Step-by-step deployment
- `hibiscus_frontend_integration.md` - How to connect booking UI
- `hibiscus_SUMMARY.md` - Quick reference
- `hibiscus_CHECKLIST.md` - Printable implementation checklist

Also: `Context_ Building booking UI for Hibiscus Studio (.md` (95KB research context)

---

## Blockers Identified

### Resolved This Session
- **Org policy blocking service account keys** → Bypassed by creating project under business Gmail (not Workspace)

### Open Blockers
1. **Payment service decision** - User doesn't want Stripe (heard issues). Alternatives to evaluate:
   - Square (UK physical business focus)
   - GoCardless (UK direct debit)
   - Revolut Business
   - NOT Whop (digital products, not venue)

2. **Email service decision** - User doesn't want Resend or SendGrid. Alternatives:
   - Postmark (best deliverability)
   - Gmail SMTP (free, 500/day limit - sufficient for 17-30 bookings/month)
   - Mailgun

3. **Cloudflare Worker deployment** - Not started. Depends on above decisions.

---

## Session Method: Interview-First

This session used a new pattern:
1. User opened laptop, did voice brain dump into `braindump.txt`
2. AI read all context (brain.csv, braindump, PARA structure)
3. AI asked ONE focused question at a time via AskUserQuestion
4. Each answer informed the next question
5. Questions filtered "what's visually attractive" from "what has external pressure"

**Result:** Identified HB Calendar as the force target (partner waiting, £5k/month depends on it), then systematically worked through the blocker (credentials).

---

## Files Created/Modified This Session

| File | Location | Purpose |
|------|----------|---------|
| braindump.txt | 00_Inbox/jan 25/ | Initial voice context |
| hibiscus-booking-*.json | 00_Inbox/jan 25/ | Service account credential |
| perplexity-bundle/ | 00_Inbox/jan 25/ | Complete backend research |
| SESSION-CONTEXT.md | This file | Session packet |

---

## Next Session Pickup

To continue HB booking backend:
1. **Decide payment service** - Square vs alternatives
2. **Decide email service** - Postmark vs Gmail SMTP
3. **Deploy Cloudflare Worker** - Using perplexity-bundle code
4. **Test availability endpoint** - Query both calendars
5. **Connect frontend** - Update booking-demo.html

---

## Compressed Gems (for brain.csv)

These warrant addition to brain.csv once properly compressed:

1. **Interview-first session model** - Sequential questions that adapt based on answers, starting with "what has external pressure"
2. **Business owns infrastructure** - Create credentials under business account, not personal workspace
3. **Screen-describe mode** - For technical setups when UI instructions fail

---

## Links to Update (links.json)

Add:
- "service account" → this session packet + credential location
- "jan 25" → 00_Inbox/jan 25/
- "perplexity bundle" → 00_Inbox/jan 25/perplexity-bundle/
