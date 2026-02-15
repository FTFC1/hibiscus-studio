# Voice-First Test Guide for brain-bot v0.4.0

**Date:** 2026-01-28
**Feature:** Smart Priority Surfacing
**Test Method:** Voice notes only

---

## ✅ FIXES APPLIED

1. **Session packets NOW being ingested** ✅
   - Path fixed: now looks in `ParaPro-001/session-packets/`
   - Your work context is being loaded

2. **NO MORE MESSAGE IDs** ✅
   - Old: `/mark_waiting 42 API keys`
   - New: "mark last as waiting on API keys"
   - No more "#42" or "message 48" in bot responses

3. **Priorities button added** ✅
   - Main keyboard now has: 🔥 Priorities button
   - Tap it to see your top priorities

---

## VOICE TESTING SCENARIOS

### Test 1: Send Planning Voice Notes
**Record voice notes about different projects:**

1. Hold voice button, say:
   > "For Hibiscus, I need to fix the booking flow validation bug"

2. Hold voice button, say:
   > "For the gas project, I should call the vendor about those API keys"

3. Hold voice button, say:
   > "For retail, I need to decide between Stripe and PayPal for payments"

4. Wait for bot to process each one

**What to check:**
- Does bot acknowledge each message?
- Are your projects being recognized? ([HB], [GAS], [RETAIL])

---

### Test 2: Check Your Priorities
**Tap the 🔥 Priorities button**

**What you should see:**
```
🔥 TOP 3 TO WORK ON TODAY

1. [HB] Fix the booking flow validation bug
2. [GAS] Call the vendor about those API keys
3. [RETAIL] Decide between Stripe and PayPal

❓ OPEN QUESTIONS
...

📌 WAITING ON
...
```

**What to check:**
- Are your TOP 3 actually what you'd work on?
- Are they ranked sensibly?
- Do the project tags show correctly?

---

### Test 3: Natural Waiting Detection
**Record a voice note saying:**
> "I'm waiting on API keys from the vendor for the gas project"

**Then tap 🔥 Priorities again**

**What to check:**
- Does that message now show ⏸️ icon?
- Does it say "(waiting: api keys from the vendor)"?

---

### Test 4: Mark Something as Waiting
**If you have a recent message you want to mark, record:**
> "Mark last as waiting on CEO approval"

**Or if referring to specific content:**
> "The pricing thing is waiting on the CEO"

**Then tap 🔥 Priorities**

**What to check:**
- Did bot find the right message?
- Does it show your waiting reason?
- No message IDs mentioned?

---

### Test 5: Ask Questions via Voice
**Record voice notes with questions:**

1. > "Should we use PostgreSQL or MySQL for the gas database?"

2. > "What's the best way to handle user authentication for Hibiscus?"

3. > "Do we need dark mode in version one for retail?"

**Then tap 🔥 Priorities**

**What to check:**
- Do questions show in "❓ OPEN QUESTIONS"?
- Are they ranked (repeated questions higher)?

---

### Test 6: Compare Status vs Priorities
**Tap 📊 Status button**
- See the old view

**Then tap 🔥 Priorities button**
- See the new view

**Tell me via voice note:**
- Which view is more useful for daily work?
- What's missing from Priorities?
- What's cluttered?

---

### Test 7: Session Packets Ingestion
**Test if your work context is being loaded:**

**Record this voice note:**
> "What did I work on in my last session?"

**Or:**
> "Recall my session packets"

**What to check:**
- Does bot mention work from your session packets?
- Can it reference ParaPro context?

---

## FEEDBACK FORMAT (Voice Notes)

**Send voice notes about:**

### What Works Well
- "The priorities ranking is perfect because..."
- "I love that it shows..."
- "The waiting indicators are useful because..."

### What Doesn't Work
- "This is confusing because..."
- "I can't see..."
- "The ranking is wrong - X should be higher than Y because..."

### What's Missing
- "I need to see..."
- "It should also show..."
- "I wish I could..."

---

## SPECIFIC QUESTIONS TO ANSWER (Via Voice)

1. **Ranking Quality:**
   - Record: "Are the top 3 actually what I'd work on right now?"
   - If no: "Here's what should be higher: ..."

2. **Display Density:**
   - Record: "Is this too much info, too little, or just right?"

3. **Button Layout:**
   - Record: "Should Priorities replace Status as the main button, or keep both?"

4. **Natural Waiting:**
   - Record: "Did it auto-detect when I said 'waiting on'?"
   - Record: "Did 'mark last as waiting on' work smoothly?"

5. **Voice Recognition:**
   - Record: "Did it understand my project names?" (Hibiscus, Gas, Retail)
   - Record: "Did it capture my questions correctly?"

---

## DEPLOYMENT READY WHEN:

- ✅ All 7 test scenarios completed via voice
- ✅ Feedback voice notes sent
- ✅ Critical bugs identified (if any)
- ✅ Ranking makes sense for YOUR work

---

## Next Steps After Testing

**If it works well:**
1. Deploy as v0.4.0
2. Use Priorities as main daily driver
3. Monitor for edge cases

**If issues found:**
1. Send voice notes with specific problems
2. I'll adjust scoring weights or display
3. Re-test

---

**Start testing:** Open Telegram, send voice notes!
