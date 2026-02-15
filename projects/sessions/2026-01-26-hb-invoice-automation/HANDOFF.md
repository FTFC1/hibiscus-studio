# Session Handoff: HB Invoice Automation + Admin Fixes

**Date:** 2026-01-26
**Duration:** ~3 hours
**Status:** COMPLETE

---

## What Was Built

### 1. Admin Dashboard Crash Fix
- **Problem:** Error 1101 when loading `/admin`
- **Root cause:** Undefined variables `duplicateIds`, `syncedIds`
- **Fix:** Added missing Set definitions + null date guards

### 2. Cloudflare Access Security
- **Before:** Anyone with URL key could access admin
- **After:** Email-based login (OTP) via Cloudflare Zero Trust
- **Authorized:** nicholasfcoker@googlemail.com, hibiscusstudiouk@gmail.com

### 3. Invoice Automation System
- **Trigger:** Auto-generates on booking submission
- **Output:** 2 PDF invoices attached to confirmation email
- **Logic:**
  - Invoice #1: Event Hire (50% deposit of hire fee only)
  - Invoice #2: Damage Deposit (£200 fixed, marked refundable)

### 4. Email Infrastructure
- **Provider:** Resend (replaced Apps Script)
- **Format:** Branded HTML email with both PDFs attached
- **Sender:** Currently using test sender (domain verification pending)

---

## System Architecture

```
Customer submits booking
        ↓
┌───────────────────────────────────────┐
│  Cloudflare Worker                    │
│  ├─ Validate booking                  │
│  ├─ Calculate: hireDeposit (50%)      │
│  ├─ Calculate: damageDeposit (£200)   │
│  ├─ Generate invoice numbers          │
│  ├─ Create 2 PDFs (pdf-lib)           │
│  ├─ Store invoices in KV              │
│  ├─ Send email via Resend             │
│  └─ Create calendar event             │
└───────────────────────────────────────┘
        ↓
Customer receives email with 2 PDF invoices
```

---

## Key URLs

| Resource | URL |
|----------|-----|
| Booking API | `https://hb-booking.nicholasfcoker.workers.dev` |
| Admin Dashboard | `https://hb-booking.nicholasfcoker.workers.dev/admin` |
| Admin Login (legacy) | `/admin/login?key=hb-admin-2026` |
| Logout | `/cdn-cgi/access/logout` |

---

## Invoice Format

**Numbering:** `HB-2026-001`, `HB-2026-002`, etc. (sequential per year)

**Hire Invoice includes:**
- Business header (Hibiscus Studio Limited, 19a Peto Street North, E16)
- Customer details
- Event details with actual time (e.g., "4:00 PM - 10:00 PM")
- 50% deposit calculation
- Balance due date
- Bank transfer details

**Damage Deposit Invoice includes:**
- Same header/customer/event details
- Fixed £200 amount
- "Refundable" label
- Note about 7-day refund timeline

---

## Admin Actions (All Working)

| Action | What Happens |
|--------|--------------|
| **Confirm** | Updates status, syncs to calendar, sends confirmation email |
| **Cancel** | Removes from calendar, sends cancellation email |
| **Reschedule** | Deletes old event, creates new, sends change email |
| **Logout** | Clears Cloudflare Access session |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Email sending (set via wrangler secret) |
| `ADMIN_KEY` | Legacy admin access: `hb-admin-2026` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Calendar API access |
| `APPS_SCRIPT_WEBHOOK` | Legacy email fallback |

---

## Files Modified

| File | Lines Added | Purpose |
|------|-------------|---------|
| `src/index.js` | ~500 | Invoice system, PDF generation, Resend integration |
| `package.json` | +1 | Added pdf-lib dependency |

---

## Future Enhancements

| Item | Priority | Notes |
|------|----------|-------|
| Resend domain verification | Medium | Switch from test sender to `@hibiscusstudio.co.uk` |
| Reschedule invoice voiding | Low | Void old + generate new invoices on date change |
| Payment reminder automation | Low | Auto-email 10 days before event |
| Cloudflare Access redirect fix | Low | Minor UX issue after fresh login |

---

## Deployed Version

**Version ID:** `ebf96680-e180-47cd-829f-94eedf17b642`
**Deployed:** 2026-01-26 15:43 UTC
