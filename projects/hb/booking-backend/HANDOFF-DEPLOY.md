# Deploy handoff — Deposit/Balance Received button fix

Branch: claude/fix-hb-studio-dashboard-AHIar
Commit: 1b13cf0
File touched: projects/hb/booking-backend/src/index.js
Change size: +51 / -10

## What this commit does

Rochelle reported "Deposit received button not working" on V2 admin dashboard.

Four surgical edits in one file:

1. Server POST /api/bookings/:id/mark-deposit-paid
   - Adds the auth check every other admin write endpoint already uses
     (Cf-Access-Jwt-Assertion header OR hb_admin_key cookie OR Bearer
     ADMIN_KEY). Previously unauthenticated.
   - Returns { calendarOnly: true } on KV-miss so client can route forward.

2. Server POST /api/bookings/:id/mark-balance-paid
   - Same two changes.

3. Client V2 async function markDepositPaid
   - console.log of id, HTTP status, and response body on every click.
   - Shows HTTP status in the toast when server returns no error field.
   - Handles calendarOnly 404 with routed toast instead of generic error.

4. Client V2 async function markBalancePaid
   - Same three changes.

## Why logging first, not a direct "fix"

Three plausible root causes from code-read alone:
  a. Calendar-only booking shown in action-well, 404 on KV lookup
  b. Cloudflare Access intercepts /api/* and returns 401
  c. Deployed code drifted from this March-5 snapshot

The log patch makes all three visible in ONE screenshot of Chrome DevTools
Console after one button click. Then commit #2 applies the precise fix.

## Deploy steps (laptop)

Step 1. Fetch the branch.

    git fetch origin claude/fix-hb-studio-dashboard-AHIar

Step 2. Port the changes into your wrangler project.

The in-repo file at projects/hb/booking-backend/src/index.js is a March-5
snapshot. Your laptop's wrangler project has likely drifted. Do NOT blind-
copy the whole file. Instead view the diff and apply the four edits by hand
(or via patch if the surrounding context still matches):

    git show 1b13cf0 -- projects/hb/booking-backend/src/index.js

The four edit blocks are small and independent. Search your laptop source
for these anchors and apply the corresponding block from the diff:

  - router.post('/api/bookings/:id/mark-deposit-paid'
  - router.post('/api/bookings/:id/mark-balance-paid'
  - async function markDepositPaid(id)   (inside V2 return template)
  - async function markBalancePaid(id)   (inside V2 return template)

Step 3. Deploy.

    wrangler deploy

Step 4. Capture rollback info.

    wrangler deployments list

Note the new deployment ID (top) and the previous one (second from top).
Keep both — if anything breaks, run: wrangler rollback PREV-ID

Step 5. Smoke-test the endpoint.

    curl -i https://hb-booking.nicholasfcoker.workers.dev/api/health

Expect 200 with a JSON body containing status ok.

Step 6. Ask Rochelle to reproduce with console open.

Message for her:
  1. Open the admin dashboard in Chrome.
  2. Right-click anywhere, pick Inspect, switch to the Console tab.
  3. Clear the console (trash-can icon, top-left of console).
  4. Click "Deposit Received" on Jade's card.
  5. Screenshot the whole browser window (console included) and send it.

Step 7. Paste back into the cloud session:
  - The screenshot from Rochelle.
  - Old deployment ID + new deployment ID.
  - Output of the curl smoke test.

## Rollback

If step 5 fails or Rochelle reports worse behaviour:

    wrangler rollback PREV-ID

(substitute PREV-ID with the value captured in step 4).

## Remaining handoff (not in this commit)

"Remote TG-ops reader" design pattern — separate follow-up session, not
started. Goal: Claude-on-the-web pulls your VPS TG-messages DB snapshot
via GH Action → committed JSON file, so future "check her recent TG msg"
doesn't require you to paste.
