# Booking Flow Redesign — HB Studio

**Created:** 2026-01-21
**Status:** Wireframe concept, not yet built

---

## The Problem

Current booking flow forces customers to **"t-shirt size" their event by TIME**.

```
Current Flow:
1. Click "Event Hire"
2. See options: 4 Hours, Half-Day (6hrs), 8 Hours, Full-Day
3. Customer thinks: "Which one do I need?"
4. They don't know → pick cheapest (4 hours)
5. Often not enough time → bad experience
```

**Evidence from data:**
- 2 of 4 bridal shower customers who booked 4 hours asked for more time in their booking notes
- This suggests 4 hours was presented/chosen but wasn't actually enough

---

## The Solution

Let the customer describe their event. System recommends the right package.

```
New Flow:
1. "What are you celebrating?"
2. "How many guests?"
3. "When?"
4. → System recommends based on event type + guest count
5. Customer sees social proof: "8 of 12 bridal showers booked this"
6. Anchor to recommended option, show alternatives below
```

---

## Wireframe

### Step 1: Event Type

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  What are you celebrating?                          │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ○ Bridal Shower                             │   │
│  │ ○ Baby Shower                               │   │
│  │ ○ Birthday (milestone: 30th, 40th, 50th)    │   │
│  │ ○ Birthday (casual celebration)             │   │
│  │ ○ Workshop or Class                         │   │
│  │ ○ Content / Photoshoot                      │   │
│  │ ○ Corporate Event                           │   │
│  │ ○ Other                                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│                              [Next →]               │
└─────────────────────────────────────────────────────┘
```

### Step 2: Guest Count

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  How many guests are you expecting?                 │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │           [     25     ]                    │   │
│  │                                             │   │
│  │  Studio capacity: up to 50 guests           │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [← Back]                        [Next →]          │
└─────────────────────────────────────────────────────┘
```

### Step 3: Date Selection

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  When is your event?                                │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │  [  February 15, 2026  ]  📅               │   │
│  │                                             │   │
│  │  □ I'm flexible on the exact date          │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [← Back]                        [See Options →]   │
└─────────────────────────────────────────────────────┘
```

### Step 4: Recommendation

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Perfect! Based on your bridal shower for 25:       │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │  ★ RECOMMENDED                              │   │
│  │                                             │   │
│  │  Half-Day Package (6 hours)                 │   │
│  │  4:00 PM – 10:00 PM                         │   │
│  │                                             │   │
│  │  £465                                       │   │
│  │                                             │   │
│  │  ─────────────────────────────────────────  │   │
│  │                                             │   │
│  │  Why we recommend this:                     │   │
│  │  • 8 of 12 bridal showers chose this       │   │
│  │  • Allows time for setup, food, games,     │   │
│  │    photos, and cleanup                      │   │
│  │  • 2 customers who booked 4 hours asked    │   │
│  │    for more time — don't make that mistake │   │
│  │                                             │   │
│  │  [Book This Package]                        │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Also available:                                    │
│                                                     │
│  ○ 4 Hours — £345                                  │
│    ⚠️ Often not enough for events this size        │
│                                                     │
│  ○ Full Day (10am-10pm) — £645                    │
│    Great if you need morning setup time            │
│                                                     │
│  [← Back to questions]                             │
└─────────────────────────────────────────────────────┘
```

---

## Recommendation Logic (Lookup Table)

Based on actual booking data from CSVs:

| Event Type | Guest Count | Recommended | Reason |
|------------|-------------|-------------|--------|
| Bridal Shower | 1-20 | Half-Day (6hr) | 8/12 chose this |
| Bridal Shower | 21-35 | Half-Day (6hr) | Same |
| Bridal Shower | 36-50 | 8 Hours | Larger events need more setup |
| Baby Shower | 1-30 | Half-Day (6hr) | Pattern from data |
| Baby Shower | 31-50 | 8 Hours | More guests = more time |
| Birthday (milestone) | Any | Half-Day (6hr) | Standard |
| Workshop | 1-20 | Half-Day (6hr) | Workshop standard |
| Workshop | 21+ | Full-Day | Needs breaks, setup |
| Content | 1-5 | Half-Day (6hr) | Content standard |
| Corporate | Any | Full-Day | Corporate expects all-day |

---

## UX Principles

1. **Give appearance of choice** — show "Also available" options
2. **Anchor to recommended** — make it the obvious default
3. **Social proof** — "X people booked this"
4. **Explain downsides** — "Often not enough" for cheaper option
5. **Don't show price first** — show value/fit first, price second

---

## Technical Implementation

### Option A: Pure Frontend (JavaScript)
- Build multi-step form on landing page
- Recommendation logic in JS
- At end, redirect to Acuity with pre-filled parameters

### Option B: Chatbot-Driven
- Enhance existing chatbot (on Render)
- Conversational flow: "What are you celebrating?"
- At end, generates booking link

### Option C: Replace Acuity Entirely
- Whop for payment
- Google Calendar API for scheduling
- Custom confirmation emails
- Full control, highest effort

**Recommended: Option A first**, measure results, then consider Option C if needed.

---

## Metrics to Track (with Umami)

```javascript
// Track each step
umami.track('booking-flow-started');
umami.track('event-type-selected', { type: 'bridal-shower' });
umami.track('guest-count-entered', { count: 25 });
umami.track('date-selected');
umami.track('recommendation-shown', { recommended: 'half-day' });
umami.track('package-selected', { package: 'half-day', was_recommended: true });
umami.track('clicked-book-now');
```

This lets us see:
- How many start the flow
- Where they drop off
- Whether they pick the recommended option
- Conversion rate per event type
