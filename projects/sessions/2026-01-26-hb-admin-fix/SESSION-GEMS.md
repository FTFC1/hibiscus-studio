# Session Gems: 2026-01-26

## Key Discovery

**Cloudflare Worker Error 1101 = Unhandled Exception**

The error code doesn't tell you WHAT crashed. To diagnose:

```
┌─────────────────────────────────────────┐
│  1. Wrap suspect code in try-catch      │
│  2. Return HTML error page with:        │
│     - error.message                     │
│     - error.stack                       │
│     - Sample data causing issue         │
│  3. Deploy and trigger error            │
│  4. Read actual stack trace             │
└─────────────────────────────────────────┘
```

This session: Stack trace revealed `duplicateIds is not defined` - variables referenced but never created.

---

## JavaScript Date Pitfall

```javascript
// CRASHES
new Date(null).toISOString()    // throws RangeError
new Date(undefined).toISOString() // throws RangeError

// SAFE
const d = new Date(value);
if (!isNaN(d.getTime())) {
  return d.toISOString();
}
```

Always guard `toISOString()` with `isNaN(date.getTime())` check.

---

## Security Decision Matrix

For 2-person team (1 technical, 1 non-technical):

```
                    CF Access   TOTP    Magic Link   Multi-Key
                    ─────────   ────    ──────────   ─────────
Setup Effort           ★☆☆       ★★★       ★★☆          ★☆☆
Security              ★★★★★     ★★★★      ★★★          ★★☆
Non-Tech UX           ★★★★★     ★☆☆       ★★★★         ★★★
Cost                    $0        $0      $0-low         $0
Maintenance            ★☆☆       ★★☆       ★★☆          ★★☆
```

**Winner: Cloudflare Access** - one-click setup, email OTP, free, enterprise-grade.

---

## Compressed for brain.csv

| Pattern | Context | Reuse |
|---------|---------|-------|
| Error 1101 = exception | Cloudflare Workers | Any Worker debug |
| toISOString needs guard | JS Date objects | Any date formatting |
| Cloudflare Access > custom auth | Small team admin pages | Any Worker admin UI |
| Missing variable = incomplete feature | Code archaeology | Code review pattern |
