# PUMA Training App — 5 Variant Prompts
Generated: 2026-02-15

Paste each prompt into a SEPARATE Variant conversation. Each produces one mobile screen.

---

## SHARED CONTEXT (paste at the top of EACH prompt)

```
Context: Mobile training app for PUMA retail staff in Nigeria. Dark theme (#0F1A1E background). Accent color: lime/chartreuse (#DCEE56). Glass morphism cards (rgba white borders, subtle backgrounds). Mobile-first (375px width, iPhone proportions). Typography: Inter or system sans-serif. Icons: Remix Icon style (line weight). The app teaches customer service skills through 6 "missions" in a module called "Customer Engagement." Staff are retail floor workers aged 20-35. The tone is direct, energetic, not corporate. Nigerian English where appropriate.
```

---

## PROMPT 1: HOME (Staff View)

```
Design a mobile home screen for a retail staff training app.

[Paste shared context above]

PAGE PURPOSE: "What do I do today?" This is the first screen after login.

LAYOUT (top to bottom):
1. HEADER: App name "PUMA Training" on left, user avatar circle "JM" on right with lime accent
2. VIEW SWITCHER: Two tabs — "My Training" (active) and "Manager" (inactive). Subtle, not dominant.
3. MODULE HEADER: Small section showing "Module 1 · Customer Engagement" with icon and streak "🔥 4d streak" (NO mission count — the mission list below already shows progress visually)
4. MISSION LIST (THE HERO — takes most of the screen):
   - 6 mission cards in a vertical list
   - Each card: number circle on left, title + one-line description in middle, right side varies:
     - Completed missions (1-3): checkmark in number circle, subtle "5 min" time
     - Current mission (4): highlighted border/glow, "Start →" pill button on right
     - Locked missions (5-6): lock icon, dimmed/muted
   - Mission titles: "The 5-30-60 Rule", "Kill 'Can I Help You?'", "The 70/30 Rule", "'I'll Think About It'" (current), "'It's Too Expensive'" (locked), "Exit Protocol" (locked)
5. QUICK ACTIONS: 3 pill buttons in a row — "▶ Play Mission 4" (primary/lime), "Review Today" (secondary), "View Progress" (secondary)
6. STATS STRIP: 3 small stat boxes — "12 XP Earned", "85% Accuracy", "#4 Ranking"

DESIGN NOTES:
- The mission list is the hero. It should feel like a game level select screen, not a boring course list.
- Current mission should POP — it's the main call to action.
- Locked missions should feel aspirational, not frustrating.
- Dark theme with lime accents. Glass morphism cards.
- Bottom nav bar: 4 icons (Home active, Practice, Activity, Profile)
```

---

## PROMPT 2: LESSON (Slide View)

```
Design a mobile lesson screen that shows educational content as swipeable slides.

[Paste shared context above]

PAGE PURPOSE: "Learn this one skill." User swipes through 5 slides per mission. No bottom nav bar — full immersion.

LAYOUT:
1. TOP BAR: "Mission 4" title on left, "1/5" slide counter in center, "✕" exit/close button on right (not reference — user needs a way OUT)
2. SLIDE CONTENT (full screen, one of these 5 types):

   TYPE A — "Text/Scenario" slide:
   - Title with icon: "The Problem"
   - 4 scenario steps in a horizontal or vertical flow: "Customer enters" → "Staff on phone" → "3 minutes pass" → "They leave" (each with icon + status color: neutral/warning/bad)
   - Body text paragraph
   - Highlighted stat: "That's ₦15.6 million/year walking out the door" in a lime pill/badge

   TYPE B — "Rule" slide:
   - Title: "The 5-30-60 Rule"
   - 3 big stat blocks side by side: "5s Acknowledge" / "30s Approach" / "60s Engage"
   - Below: meaning pills/tags showing what each number means (rounded chips, not a list)

   TYPE C — "Toolkit" slide:
   - Title: "Objection Toolkit"
   - 3-4 steps, each with: ACTION keyword in lime uppercase (e.g., "ACKNOWLEDGE"), then a quote card with speech text inside, description text also inside the card

   TYPE D — "Comparison" slide:
   - "Don't" card (left/top, red-tinted) vs "Do" card (right/bottom, green-tinted)

   TYPE E — "Practice" slide:
   - Encouragement text + CTA button at TOP
   - Checkable items below (circles that fill when tapped)

3. FOOTER (subtle, fades in): Previous/Next arrows with dot indicators (● ● ● ○ ○)

DESIGN NOTES:
- Show me TYPE A and TYPE C as the two most interesting slides to design
- This is the approved visual direction — make it feel premium, like a micro-learning app (think Duolingo meets dark mode luxury)
- Content should breathe — generous whitespace
- Swipe gesture implied (no explicit arrows until footer fades in)
```

---

## PROMPT 3: PRACTICE

```
Design a mobile practice/daily checklist screen for a retail training app.

[Paste shared context above]

PAGE PURPOSE: "What do I literally do on the shop floor today?" This bridges learning (lesson) and doing (real work). Staff open this at the start of their shift.

LAYOUT:
1. HEADER: "Practice" title, avatar "JM" on right
2. SECTION: "Today's Focus"
3. CHECKLIST CARDS grouped by mission:

   Card 1 — "The 5-30-60 Rule" (lime label)
   ○ Count to 5 every time a customer walks in — eye contact before you hit 5
   ○ Set a 60-second mental timer — approach if you haven't yet
   ○ Kill "Can I help you?" — try "What brings you in today?"

   Card 2 — "Kill 'Can I Help You?'" (lime label)
   ○ Pick ONE warm opening to use all day
   ○ Count how many engage vs say "just looking"

4. ENCOURAGEMENT: Motivational text — "You've practiced 4 days straight. Keep it up."
5. END-OF-DAY PROMPT: "How did today go?" — simple emoji reaction or quick reflection

DESIGN NOTES:
- This should feel like a coach's game-day card, not a corporate training checklist
- Checkable circles that animate when tapped (satisfying micro-interaction)
- Cards grouped by mission with the mission name as a small label
- The vibe is "daily ritual" — something you check every shift
- Bottom nav bar visible (Practice tab active)
```

---

## PROMPT 4: ACTIVITY

```
Design a mobile activity/progress screen for a retail training app.

[Paste shared context above]

PAGE PURPOSE: "Am I getting better? Where do I stand?" Motivation through progress visibility and social comparison.

LAYOUT:
1. HEADER: "Activity" title, avatar "JM"
2. YOUR PROGRESS (THE HERO):
   - Large visual progress indicator: 3/6 missions complete
   - Could be: progress bar, radial/donut chart, or level-up visual
   - Current mission: "Mission 4: 'I'll Think About It' — in progress"
   - Streak: "🔥 4 day streak"

3. WEEKLY LEADERBOARD:
   - 5 team members ranked by XP
   - Top 3 get medal styling (gold/silver/bronze)
   - "You" row highlighted with lime accent
   - Each row: rank number, name, XP points, trend arrow (up/down/same)

   Data:
   1. Adedolapo — 340 XP ↑
   2. Peter — 285 XP ↑
   3. Chidi — 260 XP ↓
   4. You — 245 XP ↑ (highlighted)
   5. Molade — 190 XP →

4. TEAM ACTIVITY FEED:
   - "Peter completed Mission 4"
   - "Adedolapo scored 92% on Quiz"
   - "Chidi started Mission 4"

DESIGN NOTES:
- The progress section should feel rewarding — like leveling up in a game
- Leaderboard creates healthy competition without being toxic
- "You" row should be immediately findable
- Team activity = social proof that others are learning too
- Bottom nav bar (Activity tab active)
```

---

## PROMPT 5: PROFILE

```
Design a mobile profile screen for a retail training app.

[Paste shared context above]

PAGE PURPOSE: "Who am I in this system?" Identity, achievements, account settings.

LAYOUT:
1. HEADER: "Profile" title, avatar "JM"
2. USER CARD (centered):
   - Large avatar circle "JM" with lime accent border
   - Name: "Junior Member" (or actual name if set)
   - Store: "PUMA Ikeja Store"
   - Role badge: "Sales Associate" or similar

3. STATS ROW: 3 stat boxes
   - 3/6 Missions
   - 85% Accuracy
   - 4 Day Streak

4. BADGES SECTION:
   - Grid of 6 badge slots (3x2)
   - Earned badges: full color with label — "First Mission" (medal), "Quick Learner" (lightning)
   - Unearned badges: dimmed/locked — "Quiz Master", "Top Seller", "Perfect Week", "7-Day Streak"

5. SETTINGS (simple list, 80/20):
   - Notifications
   - Support / Send Feedback
   - Log Out

DESIGN NOTES:
- The user card should feel personal — this is YOUR training journey
- Badges grid should make unearned badges feel achievable, not depressing
- Keep it clean — profile is secondary, people spend 5 seconds here
- This is the simplest page. Don't over-design.
- Bottom nav bar (Profile tab active)
```
