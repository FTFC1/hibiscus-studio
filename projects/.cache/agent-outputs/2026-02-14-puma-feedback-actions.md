# PUMA App — UI Feedback Actions (Feb 14, 2026)

Source: 3 screen recordings (~17 min total), Nicholas reviewing puma-training.vercel.app

---

## HOME PAGE

### P1 (Must fix)

- **[H1]** "humor-jaming" text displays at top (should be "PUMA Training"): Fix the header title display
- **[H2]** User initials "JM" in header not clickable: Make initials clickable to navigate to Profile page (same as Profile nav item)
- **[H3]** Mission cards too low on page: Move mission cards higher in visual hierarchy, reduce top spacing
- **[H4]** Quick Actions cards lack specificity: "Play Game" doesn't say which game — either specify game name or remove if not functional
- **[H5]** Quick Actions have unclear verbs: "Daily Review" and "Practice Log" don't indicate action (is it "Submit review"? "View review"? "View practice log"?)
- **[H6]** No visual on Module section: "Module 1: Customer Engagement" needs image or visual element to sell it better (branding opportunity)
- **[H7]** Mission card alignment: Cards should be top-aligned vertically instead of center-aligned within card container

### P2 (Should fix)

- **[H8]** Progress banner placement: "3 out of 6 missions" + "4 day streak" competes visually with other elements below — reconsider hierarchy
- **[H9]** Bottom nav confusion: "Games" as bottom nav item doesn't make sense when Manager view exists with team stats (activity could be separate tab)
- **[H10]** Quick Actions section positioning: Cards appearing so low on home page is pointless — consider moving up or removing
- **[H11]** Team Activity section: Consider whether this should be a separate "Activity" tab in bottom nav instead of buried on home page

### P3 (Nice to have)

- **[H12]** Design reference: Apply spacing/contrast patterns from skill.adapt reference (mentioned in video 1)
- **[H13]** Card visual style: Consider darker cards with darker borders (reference: skill.adapt design pattern)

---

## LESSON PAGE

### P1 (Must fix)

- **[L1]** Swipe gesture hitbox too small: Full screen should be swipe area for next/prev, not just the card area. Currently swiping outside card goes back to home (confusing)
- **[L2]** Practice slide acknowledgement unclear: "Try this today" requires user to stay on screen with checkboxes — needs explicit button like "Add to Today" / "Ready for Today" / "Start My Day" / "Start Quiz"
- **[L3]** "Start Quiz" button too low: Button positioned too far down, should be higher and more prominent
- **[L4]** Comparison slide text contrast: "What they actually mean" translation text less clear than information above it (design hierarchy inverted)
- **[L5]** Comparison slide space usage: Too much empty space, not making best use of available area
- **[L6]** 3-step framework design: Arrow should point DOWN (when downward space available), text should be BIGGER
- **[L7]** "Reference" link unclear: User doesn't know it's a reference — should be an outline button with word "Reference" + icon (not just icon)

### P2 (Should fix)

- **[L8]** Comparison slide icons: Gray icon + colon is reducing clarity ("acknowledge with icon with colon is just reducing it")
- **[L9]** Comparison slide acknowledgement: Should user confirm they've seen each framework? Consider acknowledgement pattern
- **[L10]** Practice slide encouragement: "Try this today" could be more prominent/actionable

### P3 (Nice to have)

- **[L11]** Quick Reference saved indicator: "Saved in your Quick Reference for this lesson" is good, could be more prominent

---

## PROFILE PAGE

### P1 (Must fix)

- **[P1]** Support action unclear: "Request help" or "Support" should create a support ticket using voice input to explain issue (like HPS helper bot pattern, but on-screen)

### P2 (Should fix)

- **[P2]** Profile page overall: "Looks good" — no major issues noted

### P3 (Nice to have)

None noted.

---

## GAMES PAGE

### P1 (Must fix)

None noted (mostly placeholder content).

### P2 (Should fix)

- **[G1]** Leaderboard design: Consider if this ties into Manager view hierarchy (is this redundant with manager stats?)

### P3 (Nice to have)

None noted.

---

## GLOBAL / NAVIGATION

### P1 (Must fix)

- **[N1]** Bottom nav rethink: Consider 4-item nav: Home / Practice / Activity / Profile (Games moves into Activity or merges elsewhere)
- **[N2]** Swipe navigation conflict: Swiping left outside card area on lesson page goes back to home (should advance slide instead)

### P2 (Should fix)

- **[N3]** View switcher clarity: "My Training" vs "Manager" view switcher works well, but raises question about Games tab relevance

### P3 (Nice to have)

None noted.

---

## DESIGN REFERENCES

### skill.adapt Pattern Library

Nicholas referenced `skill.adapt` as a design pattern to follow:

1. **Spacing at top**: More generous whitespace before content
2. **Text amount**: Balance of text to visual (not too dense)
3. **Callout design**: Clear visual hierarchy for important info
4. **Trust signals**: Subtle credibility indicators
5. **Contrast**: High contrast between elements
6. **Visual hierarchy**: Clear reading order
7. **Interaction on page**: Interactive elements add engagement
8. **Animation**: Subtle motion draws attention and improves feel
9. **Card styling**: Dark cards with dark borders (not light/flat)
10. **Text size ratio**: Good ratio of text size to visual elements

### Specific skill.adapt Features to Adopt

- **Suggest a pattern button**: Opens GitHub to make suggestion (incredible simple feedback loop)
- **Framework visualization**: Element + group taxonomy for technical audiences (smart way to show structure)
- **Expandable sections**: Click to expand/collapse details
- **Simple wireframe adaptations**: Show mobile card adaptations
- **Cheat sheet pattern**: Expandable cheat sheet with visual examples
- **Interactive examples**: Expand to show visual examples, not just text

---

## ARCHITECTURE / ORCHESTRATOR VISION

From Video 2 (4m58s), Nicholas described a multi-agent orchestrator concept:

### Butler/Orchestrator Concept

- **Multi-domain agents**: Design, Engineering, Marketing, Operations, Economics, Research agents
- **Priority ordering**: Agents arranged like football team formation (front = most sensitive/recent info, back = delayed/processed info)
- **Collection assembly**: Butler reads fundamentals + current task → assembles relevant agent collection
- **Sequential processing**: Front agents interact with reality first, back agents process their outputs
- **Skill download pattern**: Reference skill.adapt's "Download your AI harness" pattern (affiliate link for Cursor, marketplace, manual download options)

### Application to PUMA Context

This suggests a future architecture where:
1. Content creation bot could be one specialized agent
2. Training delivery bot another agent
3. Manager/analytics agent processes outputs from training agent
4. Research agent feeds into content creation
5. Orchestrator assembles the right team based on task

---

## IDEAS (not bugs — future features)

### Voice Recording Tool Concept

Nicholas described needing a native iOS camera tool that:
- Records screen + voice simultaneously
- Shows live transcription while recording
- Displays volume indicator (so you know audio is working)
- Shows what you're looking at (screen content) while speaking
- Easy to see everything in one view

**Potential build**: iOS native app or PWA for voice + screen recording with live transcription.

### AirDrop Integration for Screenshots

- Screenshot highlights/annotations on phone
- Auto-AirDrop to MacBook
- Watcher service on MacBook receives AirDrop items
- Auto-ingest to project context or Notion

### Pattern Library / Reference System

- **Need**: Quick reference to design patterns without searching/clicking
- **Example**: `/skill.adapt` reference for mobile card patterns
- **Use case**: During design reviews, instantly pull up pattern reference
- **Format**: Skill-based (like /ep, /dsg) — pattern library as callable skill

### "Show Me What's New" Feature

- When switching between Staff/Manager views, indicate what's changed
- Visual indicator of new activity/updates since last view
- Applies to session updates, mission progress, team activity

---

## TRANSCRIPT INTERPRETATION NOTES

Voice transcription errors corrected:

- "humor-jaming" → "PUMA Training"
- "edge rope" → "AirDrop"
- "jeweling" → "Duolingo" (app reference)
- "JM" → Junior Member (user initials, correctly transcribed)
- "HPS helper bot" → reference to existing support bot pattern

---

## PRIORITY SUMMARY

### Critical Path (P1 items to fix first):

1. **[H1]** Fix header title ("PUMA Training" display)
2. **[H2]** Make header initials clickable → Profile
3. **[L1]** Fix swipe hitbox (full screen swipe area)
4. **[L2]** Add explicit "Start Quiz" / "Ready to Practice" button on practice slide
5. **[H4, H5]** Fix Quick Actions clarity (specify actions clearly)
6. **[N2]** Fix swipe navigation conflict on lesson page

### High Value (P2 items for better UX):

7. **[H6]** Add visual to Module 1 section
8. **[L7]** Make "Reference" more obvious (button with text)
9. **[H9, N1]** Rethink bottom nav structure (4 tabs?)
10. **[L4]** Fix comparison slide visual hierarchy

### Polish (P3 design improvements):

11. Apply skill.adapt spacing/contrast patterns throughout
12. Implement suggest-a-pattern feedback loop
13. Add "what's new" indicators
14. Consider interactive cheat sheet patterns

---

**Total actionable items**: 28 (11 P1, 10 P2, 7 P3)
**Design references**: 1 primary (skill.adapt)
**Future features**: 4 ideas captured
