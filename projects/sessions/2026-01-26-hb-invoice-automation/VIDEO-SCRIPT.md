# Video Walkthrough Script: HB Booking System

**Purpose:** Demo video for VA/stakeholders to understand what was built
**Suggested length:** 5-8 minutes
**Record:** Screen + voice

---

## INTRO (0:00 - 0:30)

**Say:**
> "This is a quick walkthrough of the Hibiscus Studio booking system updates. I'll show you three main things: how customers book and receive invoices, how the admin dashboard works, and how to manage bookings."

---

## SECTION 1: Customer Booking Flow (0:30 - 2:00)

### Show:
1. Open the booking website (hibiscusstudio.co.uk or test page)
2. Fill in a test booking form:
   - Name, email, phone
   - Pick a date
   - Select a time slot (show dropdown)
   - Choose event type
   - Guest count

**Say:**
> "When a customer fills out the booking form, they select their date, time slot, event type, and guest count. Notice the time slots show the actual times - like '4:00 PM to 10:00 PM' - so there's no confusion."

### Show:
3. Submit the booking
4. Show the confirmation message

**Say:**
> "After submitting, they see a confirmation with their booking reference. Behind the scenes, the system has already calculated the deposit and generated their invoices."

### Show:
5. Open your email inbox
6. Show the confirmation email
7. Open both PDF attachments

**Say:**
> "The customer receives one email with two PDF invoices attached. The first invoice is for the event hire - that's 50% of the hire fee as a deposit. The second invoice is the damage deposit - that's always £200 and it's clearly marked as refundable. These are now separate, which makes accounting cleaner."

---

## SECTION 2: Admin Login (2:00 - 3:00)

### Show:
1. Go to: `hb-booking.nicholasfcoker.workers.dev/admin`
2. Cloudflare Access login screen appears
3. Enter your email
4. Check email for OTP code
5. Enter OTP and sign in
6. Dashboard loads

**Say:**
> "To access the admin dashboard, we now have proper security. You enter your email, receive a one-time code, and sign in. Only authorized emails can access this - right now that's my email and the studio email. No more shareable URL links."

---

## SECTION 3: Admin Dashboard Overview (3:00 - 4:30)

### Show:
1. Point out the header stats (confirmed this week, pending, revenue)
2. Scroll through the "Needs Action" section
3. Show how bookings are color-coded

**Say:**
> "The dashboard gives you a quick overview at the top - how many confirmed bookings this week, pending ones, and revenue. Below that, 'Needs Action' shows bookings that need attention - usually pending deposits."

### Show:
4. Click on a pending booking to expand details
5. Point out: name, date, time, event type, deposit amount

**Say:**
> "Click any booking to see the full details. You can see the customer info, event date and time, what type of event, and how much deposit they owe."

---

## SECTION 4: Admin Actions (4:30 - 6:30)

### CONFIRM ACTION
**Show:**
1. Find a pending booking
2. Click "Confirm"
3. Show the status change
4. (Optional) Show calendar update

**Say:**
> "When a customer pays their deposit, you click Confirm. This updates the booking status, sends them a confirmation email, and updates the Google Calendar to show it's confirmed."

### RESCHEDULE ACTION
**Show:**
1. Find a booking
2. Click "Change"
3. Select new date and time
4. Confirm the change

**Say:**
> "If a customer needs to change their date, click Change, pick the new date and time slot, and confirm. The system handles everything - deletes the old calendar event, creates a new one, and emails the customer with the updated details."

### CANCEL ACTION
**Show:**
1. Find a test booking
2. Click "Cancel"
3. Show it moves to cancelled section

**Say:**
> "To cancel a booking, click Cancel. It removes the calendar event and sends a cancellation email to the customer. The booking moves to the cancelled section for your records."

---

## SECTION 5: Logout (6:30 - 7:00)

### Show:
1. Point to logout button in header
2. Click logout
3. Show you're logged out

**Say:**
> "When you're done, click Logout in the top right. This signs you out securely. Next time you'll need to enter your email and code again."

---

## OUTRO (7:00 - 7:30)

**Say:**
> "That's the booking system. To recap: customers get automatic invoices with correct deposit calculations, the admin dashboard is secure with email login, and you can confirm, cancel, or reschedule bookings easily. Any questions, send me a voice note."

---

## TIMESTAMPS (for chapter markers)

```
0:00 - Introduction
0:30 - Customer Booking Flow
2:00 - Admin Login
3:00 - Dashboard Overview
4:30 - Admin Actions (Confirm, Reschedule, Cancel)
6:30 - Logout
7:00 - Summary
```

---

## TIPS FOR RECORDING

1. Use incognito window so you start fresh
2. Have a test booking ready to demo actions
3. Keep email open in another tab for showing invoices
4. Speak slowly and pause when clicking things
5. Use Quicktime (Mac) or OBS for free screen recording
