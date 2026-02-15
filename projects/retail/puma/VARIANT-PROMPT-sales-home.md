# Variant UI Prompt — PUMA Sales Home Screen

**Copy everything below the line into Variant AI.**
**This is the Sales Staff home screen — the first thing they see when they open the app.**

---

## PROMPT

Design a mobile-first home screen for a retail staff training app called "PUMA Training."

This is the Sales Staff view — the primary user. They are retail floor staff at a Puma store in Lagos, Nigeria. They open this app on their phone during breaks or before/after shifts.

### What this screen shows:

**1. Next Mission Card (primary action — biggest element)**
- Title: "Mission 3: The 70/30 Rule"
- Subtitle: "Let the customer talk 70%, you talk 30%"
- Read time: "3 min read"
- Big "START" button
- If no mission available: "Next mission unlocks Wednesday"
- This is the ONE thing they should do. Make it obvious.

**2. Progress Bar**
- Shows "3 of 6 missions complete" as a horizontal progress bar
- Module name: "Module 1: Sales Foundations"
- Percentage: 50%
- Streak counter: "🔥 4 day streak" (small, motivational)

**3. Quick Actions (3 cards in a horizontal scroll row)**
- "🎮 Play Game" — tap to choose Build Your Basket or Customer Says
- "📝 Daily Review" — "How was your shift?" (stars + quick note)
- "📋 Practice Log" — "Log what you practiced today"

**4. Team Activity (bottom section, subtle)**
- "Peter completed Mission 4!"
- "Adedolapo scored 92% on Customer Says"
- Shows 2-3 most recent team activities
- Motivational, not competitive

**5. Rewards / Unlocks (subtle badge row)**
- Small icons showing earned rewards (greyed out if locked)
- "Complete all 6 missions to unlock your Cheat Sheet"

### Design requirements:

**Style: Attio / Linear / Notion aesthetic**
- Ultra-minimalist, clean, lots of whitespace
- Font: Inter (weights 400, 500, 600 only)
- Colors: Greyscale base (#FAFAFA background, #1A1A1A text, #6B6B76 secondary)
- Accent: Puma brand — use a single warm accent color for CTAs and progress
- NO gradients, NO heavy fill buttons, NO harsh colors
- Buttons: transparent with 1px border, or ghost text
- Exception: The "START" button on the mission card CAN have a subtle accent fill since it's the primary action
- Cards: white background, 1px border #E8E8EC, 8-12px radius, subtle shadow
- Status pills: soft tinted background at 10-15% opacity

**Layout:**
- Mobile viewport (375px width, design for iPhone)
- Top: App name "PUMA Training" + avatar circle (top right)
- Generous padding: 16-24px sides
- Cards stack vertically with 16px gaps
- Quick actions scroll horizontally
- Bottom: simple tab bar (Home / Games / Profile) — 3 tabs max

**Interaction:**
- Mission card is tappable (entire card)
- Quick action cards are tappable
- Team activity is read-only
- Progress bar is visual only (not interactive)

**Typography:**
- Page title: 20px, weight 600
- Card title: 16px, weight 600
- Body text: 14px, weight 400
- Caption/meta: 12px, weight 400, #6B6B76
- Button label: 13px, weight 500

**Spacing:**
- 4px grid base
- Card padding: 16-20px
- Section gaps: 24px
- Between items in a section: 12px

### What NOT to do:
- No complex navigation — this is a training app, not a social media app
- No notifications bell or badge counts — keep it calm
- No settings gear on the home screen
- No "welcome back, Peter!" banner — waste of space, they know their name
- No tutorial overlay or onboarding popup
- No dark mode toggle (light only for now)
- No images or illustrations (text + icons + whitespace only for V1)

### Mood:
Think of it like a calm, professional to-do app. The staff member opens it, sees ONE thing to do, does it, closes it. That's success. Everything else is secondary.

### Screen states to consider:
1. **Active mission available** — show the mission card with START
2. **Mission completed, next unlocks later** — show "Next mission unlocks Wednesday" with a subtle countdown or date
3. **All missions done** — show completion celebration + cheat sheet unlock
4. **First time** — show Mission 1 with a subtle "Welcome" (not a popup, just text)
