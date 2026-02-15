# Hibiscus Studio Booking System - Quick Guide

**For:** VA / Non-technical team members
**Last updated:** January 26, 2026

---

## What We Built

```
┌─────────────────────────────────────────────────────────────────────┐
│                         THE BOOKING SYSTEM                          │
│                                                                     │
│   CUSTOMER BOOKS              SYSTEM GENERATES           YOU MANAGE │
│   ─────────────────          ─────────────────          ─────────── │
│                                                                     │
│   📋 Booking Form    ──►     📄 2 PDF Invoices    ──►    ✅ Confirm │
│   (website)                  (auto-attached)             ✏️ Change  │
│                              (sent via email)            ❌ Cancel  │
│                                                                     │
│   ▼ What happens automatically:                                     │
│   • Deposit calculated (50% of hire fee)                           │
│   • Damage deposit added (£200 separate)                           │
│   • 2 invoices generated as PDFs                                   │
│   • Email sent to customer with both PDFs                          │
│   • Booking appears in admin dashboard + Google Calendar           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## How to Log Into the Admin Dashboard

### Step 1: Go to the admin page
```
https://hb-booking.nicholasfcoker.workers.dev/admin
```

### Step 2: Enter your email
- Use either: `nicholasfcoker@googlemail.com` or `hibiscusstudiouk@gmail.com`
- Click "Send code"

### Step 3: Check your email
- You'll receive a 6-digit code
- Enter it on the login page
- Click "Sign in"

### If it doesn't work:
1. Try this backup link instead:
   ```
   https://hb-booking.nicholasfcoker.workers.dev/admin/login?key=hb-admin-2026
   ```
2. Or refresh the page and try again

### To log out:
- Click the **Logout** button in the top-right corner of the dashboard

---

## Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────┐
│                    CUSTOMER JOURNEY                      │
│                                                          │
│   1. Customer fills booking form on website              │
│                      ↓                                   │
│   2. System calculates deposit automatically             │
│      • Event hire: 50% of hire fee                       │
│      • Damage deposit: £200 (separate)                   │
│                      ↓                                   │
│   3. Customer receives email with 2 PDF invoices         │
│      (see "About the Invoices" section below)            │
│                      ↓                                   │
│   4. Customer pays via bank transfer                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  YOUR WORKFLOW (ADMIN)                   │
│                                                          │
│   1. Booking appears in:                                 │
│      • Admin dashboard (as "Pending")                    │
│      • Google Calendar                                   │
│                      ↓                                   │
│   2. Log into admin dashboard                            │
│                      ↓                                   │
│   3. See all bookings: Pending, Confirmed, Cancelled     │
│                      ↓                                   │
│   4. When customer pays:                                 │
│      → Click "Confirm" to mark as paid                   │
│                      ↓                                   │
│   5. If customer needs to change date:                   │
│      → Click "Change" and pick new date/time             │
│                      ↓                                   │
│   6. If customer cancels (pending only):                 │
│      → Click "Cancel" to remove booking                  │
│                                                          │
│   ⚠️ Note: Cancelling confirmed bookings coming soon     │
└─────────────────────────────────────────────────────────┘
```

---

## What Each Button Does

| Button | What it does | When to use |
|--------|--------------|-------------|
| **Confirm** | Marks booking as paid, updates calendar, sends confirmation email | After customer pays deposit |
| **Change** | Reschedules to new date/time, sends update email | Customer requests date change |
| **Cancel** | Removes booking from calendar, sends cancellation email | Customer wants to cancel |
| **Logout** | Signs you out of the dashboard | When you're done |

---

## About the Invoices (The 2 PDFs)

When a customer books, they receive **one email with 2 PDF invoices attached**:

```
📧 Email to customer
│
├── 📄 PDF 1: Event Hire Invoice (HB-2026-001)
│   └── 50% of hire fee as deposit
│
└── 📄 PDF 2: Damage Deposit Invoice (HB-2026-002)
    └── £200 fixed, marked "Refundable"
```

### PDF 1: Event Hire Invoice
- **Amount:** 50% of the hire fee (deposit)
- **Example:** If hire is £300, deposit is £150
- **Balance:** Remaining 50% due 10 days before event
- **Invoice number:** HB-2026-001, HB-2026-002, etc.

### PDF 2: Damage Deposit Invoice
- **Amount:** Always £200 (fixed)
- **Refundable:** Yes, within 7 days after event if no damage
- **Why separate:** Makes accounting cleaner, shows clearly it's refundable
- **Invoice number:** Separate from hire invoice

---

## Services We Use (and Costs)

| Service | What it does | Cost |
|---------|--------------|------|
| **Cloudflare Workers** | Runs the booking system | Free tier |
| **Cloudflare Access** | Secure admin login | Free (up to 50 users) |
| **Resend** | Sends emails with invoice PDFs | Free tier (3,000 emails/month) |
| **Google Calendar** | Shows bookings on calendar | Free |

**Total monthly cost: £0** (all within free tiers)

---

## Common Questions

### "Customer says they didn't get the invoice email"
- Check spam/junk folder
- Confirm the email address is correct in the booking
- You can forward them the invoice manually from the dashboard (coming soon)

### "Customer wants to change their date"
- Use the "Change" button on their booking
- They'll get an automatic email with the new details

### "Customer paid but booking still shows as Pending"
- Click "Confirm" on their booking
- This updates everything automatically

### "I can't log into the admin dashboard"
- Make sure you're using an authorized email
- Try the backup link (see "How to Log In" section)
- Clear your browser cookies and try again

---

## Video Walkthrough

Watch the full demo here:
- **Video:** [CleanShot Recording](https://share.cleanshot.com/FfZ4rD0V)
- **Full documentation:** [Craft Doc](https://docs.craft.do/editor/d/927931f3-c8d6-b374-e4da-92def4e17933/98F0CCC8-D285-4043-A72C-3F99E2433C0A)

The video has timestamps so you can jump to specific sections.

---

## Need Help?

Send a voice note and it will be transcribed and addressed.
