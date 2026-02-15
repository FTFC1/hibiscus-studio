# HB Booking Demo

**7 min** | Screen + voice | Jan 26

```
[3] Invoice   10   "Wrong amount charged"
[4] Login      7   "Anyone accesses bookings"
[6] Actions    6   "VA can't help customers"
───────────────────────────────────────────
[2] Booking    3   [5] Dashboard   2
[1] Intro      1   [7] Logout      1
```

---

### [1] INTRO
0:00

Overview of three things: booking, dashboard, actions.

---

### [2] BOOKING
0:30

Form → Date → Time slot ("4:00 PM - 10:00 PM") → Confirm

---

### [3] INVOICE
2:00 | "Wrong amount charged"

```
BEFORE:  50% of (£300 + £200) = £250  ✗
AFTER:   50% of £300 = £150 + £200 separate = £350  ✓
```

One email, two PDFs: Hire (50%) + Damage (£200 refundable)

**Refs:** src/index.js:calculatePrice()

---

### [4] LOGIN
3:00 | "Anyone accesses bookings"

URL key → Cloudflare Access (email OTP)

Configured in CF dashboard, not code.

---

### [5] DASHBOARD
4:00

Stats → Needs Action → Confirmed list

---

### [6] ACTIONS
5:00 | "VA can't help customers"

- Confirm → status + calendar + email
- Change → new date + calendar update + email
- Cancel → remove + email (pending only)

**Future:** Cancel confirmed bookings

---

### [7] LOGOUT
7:00

Recap + "send voice note for questions"

---

## Refs

- [HANDOFF.md](HANDOFF.md) - technical
- [VA-GUIDE.md](VA-GUIDE.md) - non-technical
- [Video](https://share.cleanshot.com/FfZ4rD0V)
