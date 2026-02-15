# Variant UI Prompt — PUMA Lesson Screen V2 (Dark Mode, Slide-Based)

---

Design a mobile-first lesson screen (dark mode) for a retail staff training app called "PUMA Training."

This is the Mission / Lesson view — what a sales staff member sees after tapping "Start" on the home screen. They are retail floor staff at a Puma store in Lagos, Nigeria, reading this on their phone during a break. The lesson is ONE IDEA PER SLIDE — swipeable cards, not a scrolling page. Think Instagram carousel or Duolingo lesson flow.

The lesson is "Mission 3: The 70/30 Rule" — teaching staff to let the customer talk 70% of the time.

### Core interaction model:

This is a SLIDE-BASED lesson. The user swipes left/right (or taps forward/back) through a series of full-screen content cards. Each card = one idea. A progress indicator shows how many slides exist and which one you're on. At the final slide, the "Take Quiz" button appears. At ANY point during the lesson, a floating "Quick Ref" button lets you pull up the reference card as an overlay.

### Screen structure (top to bottom):

**1. Sticky Top Bar**
- Left: back arrow inside a 36px circle button (glass background rgba(255,255,255,0.05), 1px stroke rgba(255,255,255,0.1))
- Center: "Mission 3 of 6" — 13px, weight 500, white
- Right: clock icon (ri-time-line) + "2 min" label — 13px, weight 500, color #8E9BA0
- Bar background: solid #17262B, 1px bottom stroke rgba(255,255,255,0.1)
- Height: 56px

**2. Slide Progress Indicator**
- Horizontal row of dots/pills below the top bar
- One dot per slide (5 slides total in this lesson)
- Current slide: lime (#DCEE56) filled pill, slightly wider (20px × 4px)
- Other slides: grey (#8E9BA0) dots (6px × 4px, rounded)
- Centered horizontally, 12px below top bar, 16px above content

**3. Content Slide (one at a time, full width)**

Each slide is a single glass card filling the available space between the progress dots and the bottom bar:
- Background: rgba(255,255,255,0.05)
- Border: 1px solid rgba(255,255,255,0.1)
- Border-radius: 28px (--radius-lg) — larger radius for the main card
- Padding: 28px
- Horizontal margin: 20px
- Fills vertical space between progress dots and bottom area
- Content is vertically centered within the card

Slide layout:
- Top: icon (24px, Remix Icon, color #8E9BA0) + section title (18px, weight 600, white) — row with 10px gap
- Below (20px gap): body text — 15px, weight 400, line-height 1.7, color #C8CDD0 (slightly brighter than usual sub text for readability)
- Key phrases or numbers in body: white, weight 600
- Maximum 4-5 lines of body text. This is the constraint — if it doesn't fit in 5 lines, it's too long.

**Slide contents (5 slides):**

Slide 1 — "The Problem"
- Icon: ri-alarm-warning-line
- Title: "The Problem"
- Body: "Customer says 'I need running shoes.' You rattle off every feature. Their eyes glaze over. They leave. You feature-dumped instead of solving their problem."

Slide 2 — "The Rule" (HIGHLIGHTED)
- Icon: ri-scales-3-line (lime color)
- Title: "The 70/30 Rule"
- This slide gets special treatment:
  - Card background: rgba(220,238,86,0.08)
  - Card border: 1px solid rgba(220,238,86,0.25)
- Body includes a large visual stat: "70%" and "30%" displayed as big numbers (36px, weight 700, lime) with labels "Customer talks" and "You talk" (12px, #8E9BA0) — arranged side by side
- Below the numbers: "If you're doing most of the talking, you're doing it wrong." — 15px, weight 400

Slide 3 — "The Toolkit"
- Icon: ri-questionnaire-line
- Title: "Ask These 4 Questions"
- Body: numbered list, each number in lime (weight 600), question text in white
  1. "What are you buying for?"
  2. "What's not working now?"
  3. "What matters most?"
  4. "Buying today or browsing?"
- Below list: "Only show products after all 4." — 13px, italic, #8E9BA0

Slide 4 — "Good vs Bad"
- Icon: ri-chat-smile-3-line
- Title: "Spot the Difference"
- Two blocks stacked vertically:
  - Block 1: pill label "DON'T" (rgba(255,100,100,0.15) bg, #FF6464 text, 10px font, uppercase) + short bad example in 14px italic #8E9BA0 — "You show 5 shoes and list features. They leave."
  - Block 2: pill label "DO" (rgba(220,238,86,0.15) bg, #DCEE56 text, 10px font, uppercase) + short good example in 14px italic white — "You ask 4 questions, show 2 options that match. They buy."
  - 16px gap between blocks

Slide 5 — "Practice"
- Icon: ri-focus-3-line (lime)
- Title: "Try This Today"
- 3 checkbox items:
  - Circle outline (20px, 1px stroke rgba(255,255,255,0.2)), label 14px white
  - "Pick 3 customers — use all 4 questions"
  - "Count: are they talking more than you?"
  - "Write down what you learned at end of shift"
- Show the first checkbox as CHECKED: lime filled circle with white checkmark, label has subtle strikethrough
- Below: "You've got this." — 14px, weight 500, lime color

**4. Floating Quick Reference Button**
- Fixed position, bottom-right corner, above the bottom bar
- Small pill button: "📋 Quick Ref" or icon-only (ri-bookmark-3-line)
- Glass background rgba(255,255,255,0.08), 1px stroke rgba(255,255,255,0.15), pill shape
- 12px font, weight 500, white text
- Tapping opens an overlay sheet (slide up from bottom, 60% screen height) containing:
  - Title: "Quick Reference" (16px, weight 600, white)
  - 2x2 grid of mini-cards, each with:
    - Big number (24px, weight 600, lime): 1, 2, 3, 4
    - Label (12px, weight 600, white): OCCASION, PROBLEM, PRIORITY, DECISION
    - Question (11px, italic, #8E9BA0): the matching question text
  - Close button: "✕" circle in top-right of sheet

**5. Bottom Area**
- Shows slide navigation: left arrow + right arrow buttons (glass circles, 44px)
- Between arrows: current slide number "3 / 5" — 13px, weight 500, #8E9BA0
- On the LAST SLIDE (slide 5): the right arrow is replaced by the "Take Quiz →" button
  - Lime background (#DCEE56), dark text (#17262B), pill border-radius
  - 15px, weight 600, 48px height
  - Expands to fill the right portion of the bottom bar
- Bottom bar: fixed, glass background, 1px top stroke, 16px padding, 32px bottom padding (safe area)

### Design tokens (must match home screen):

```
--bg-body: #17262B
--bg-glass: rgba(255, 255, 255, 0.05)
--bg-glass-stroke: rgba(255, 255, 255, 0.1)
--accent-lime: #DCEE56
--text-on-dark: #FFFFFF
--text-on-dark-sub: #8E9BA0
--radius-lg: 28px
--radius-md: 16px
--radius-sm: 8px
--radius-pill: 100px
--space-page: 20px
Font: Inter (400, 500, 600, 700)
Icon set: Remix Icon (line style only)
```

### Design requirements:

**Style: Attio / Linear aesthetic (dark mode)**
- Minimal, precise, no decoration
- Glass-morphism cards
- Color discipline: only lime (#DCEE56) as accent. Everything else is white, grey, or transparent
- The highlighted "Rule" slide is the ONLY element with lime-tinted background
- No gradients, no illustrations, no emoji in the UI (emoji only in the Quick Ref button if used), no heavy shadows
- Icons: Remix Icon line style only

**Layout:**
- Mobile viewport: 375px width
- Content max-width: 375px, centered
- No vertical scrolling within a slide — content must fit in one screen
- Horizontal swiping between slides (show subtle edge peek of next card if possible)

**Typography:**
- Slide title: 18px, weight 600
- Slide body: 15px, weight 400, line-height 1.7
- Big stat numbers (slide 2): 36px, weight 700
- Labels/meta: 11-13px, weight 500
- Button: 15px, weight 600

### Screen states (generate all three):

**State 1 — Slide 1 (The Problem)**
- Progress dots: first dot is lime pill, rest are grey
- "The Problem" card centered and visible
- Bottom arrows: left arrow greyed out (can't go back), right arrow active
- Quick Ref pill floating bottom-right
- Clean entry point — user just arrived from home screen

**State 2 — Slide 2 (The Rule, highlighted)**
- Progress dots: second dot is lime pill
- The lime-tinted "70/30 Rule" card visible with big 70% / 30% numbers
- Both navigation arrows active
- This is the key moment — the main teaching point

**State 3 — Slide 5 (Practice, last slide)**
- Progress dots: fifth/last dot is lime pill
- Practice card with checkboxes (one checked)
- Bottom: left arrow + "Take Quiz →" lime button (replacing right arrow)
- Quick Ref pill still visible
- Completion moment — ready to test

### What NOT to do:
- No vertical scrolling within slides
- No bottom tab navigation bar
- No progress bar (dots are enough)
- No "estimated time remaining" countdown
- No social sharing icons
- No sidebar or hamburger menu
- No image placeholders
- No decorative dividers
- No "next lesson" preview

### Mood:
Think Duolingo meets Linear. Each slide is one idea, beautifully presented, zero clutter. The staff member taps through at their own pace — problem, rule, toolkit, example, practice. Five taps and they're done. The quick reference floats there like a cheat sheet in your pocket. The lime-highlighted rule card is the single most important moment. When they reach the last slide, the quiz button appears — that's the reward.
