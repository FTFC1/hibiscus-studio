# Design Decisions: PUMA Presentation v2

## Decision 1: Three-Color Semantic System

**Context:**
v1 used red (#E31E24) for both problem indicators AND solution highlights, creating cognitive confusion.

**User Feedback:**
> "The fact that this is red and we had read on the other page now looks confusing.
> It doesn't look like this is a solution."

**Decision:**
Implement semantic color coding:
- Red (#E31E24): Problems, losses, urgent items
- Blue (#00A9E0): Solutions, features, neutral highlights
- Gold (#FFC107): Positive outcomes, ROI, revenue gains

**Rationale:**
- Red = universally understood danger signal (problems, losses)
- Blue = PUMA brand color, calm, trustworthy (solutions)
- Gold = achievement, success (positive outcomes)
- Prevents cognitive dissonance from color-context mismatch

**Implementation:**
```css
/* Problem slide styling */
.problem-item {
    border-left: 4px solid #E31E24;
}

/* Solution slide styling */
.solution-box {
    background: rgba(0, 169, 224, 0.1);
    border: 2px solid #00A9E0;
}

/* Positive impact styling */
.impact-box {
    background: rgba(255, 193, 7, 0.1);
    border: 2px solid #FFC107;
}
```

**Impact:**
- Slide 3 (Solution): Changed to blue
- Slide 4 (What Staff Learn): Module groupings changed to blue
- Slide 5 (How It Works): Changed from red to blue
- Slide 7 (Expected Results): Revenue impact changed to gold

---

## Decision 2: Visual Examples (Speech Bubbles)

**Context:**
Slide 2 showed revenue leak calculations but lacked tangible examples of what the mistakes look like.

**User Feedback:**
> "You should also have a view where you basically show an example of it,
> like a speech bubble of what that looks like."

**Decision:**
Add italic gray text showing customer/staff interaction examples for each mistake:

**Examples added:**
1. Late acknowledgment: `"Customer enters, looks around... staff doesn't acknowledge... customer leaves"`
2. Closed greetings: `"Can I help you?" → "No thanks, just looking" (90% of the time)`
3. Talking at customers: `"Well, just the features... person just says OK..."`

**Rationale:**
- Makes abstract revenue calculations concrete
- Helps PUMA leadership visualize the problems
- Creates emotional connection (not just numbers)
- Speech bubble format = easily scannable

**Implementation:**
```html
<div class="problem-item">
    <h3>Late/no customer acknowledgment</h3>
    <div class="example-speech">Customer enters, looks around...
    staff doesn't acknowledge... customer leaves</div>
    <div class="calculation">2 lost sales/day × ₦25K × 6 days × 52 weeks</div>
    <div class="result">= ₦15.6M/year</div>
</div>
```

**Impact:**
- Slide 2 now includes 3 visual examples (one per mistake)
- Gray italic text differentiates examples from calculations

---

## Decision 3: Missions Context ("Bite-Sized Lessons")

**Context:**
Slide 3 used term "missions" without explaining what it means.

**User Feedback:**
> "Maybe they need to know that missions are like bite sized lessons
> because it's not that obvious before. Not on a system doesn't mean anything."

**Decision:**
Add subtitle and explanation:
- Main text: "24 bite-sized lessons × 10 mins each"
- Subtitle: "Staff read on phones during breaks—no classroom time needed"

**Rationale:**
- "Missions" = gamified term that needs translation for business audience
- "Bite-sized lessons" = clearer value prop (no long training sessions)
- Subtitle reinforces mobile-first, no-disruption delivery

**Implementation:**
```html
<div class="solution-box">
    <h3>24 bite-sized lessons × 10 mins each</h3>
    <div class="subtitle">Staff read on phones during breaks—
    no classroom time needed</div>
</div>
```

**Impact:**
- Slide 3 now self-explanatory (doesn't require prior knowledge of "missions")

---

## Decision 4: Investment Breakdown Detail

**Context:**
Slide 6 showed ₦2.955M waived without explaining what's included.

**User Feedback:**
> "What is actually in the course content creation. What is in the content creation?
> What is in the platform? So what is in the pilot management?"

**Decision:**
Expand each component with bullet points:

**Content Creation (₦1.5M):**
- 24 missions (800-1,200 words each)
- 120 quiz questions (5 per mission)
- Quick Reference guides

**Platform Setup (₦1M):**
- Selar LMS configuration (course build, uploads)
- Quiz integration with auto-grading
- Drip schedule programming (Mon/Wed/Fri unlock logic)
- Telegram channel setup + automated daily posting
- Manager training materials & dashboard walkthrough

**Pilot Management (₦500K):**
- Weekly progress reports (completion + sales data)
- Real-time troubleshooting (platform access, quiz issues)
- Content refinements based on quiz failure patterns
- Manager coaching calls (30 mins/week)

**Rationale:**
- Justifies the ₦2.955M value (not arbitrary number)
- Shows depth of work (builds credibility)
- Helps PUMA understand what they're getting for free

**Impact:**
- Slide 6 now has detailed breakdown (not just high-level numbers)

---

## Decision 5: Video Testimonial Requirement

**Context:**
v1 showed video testimonial as optional.

**User Feedback:**
> "I don't think it should be optional. I think it should be required and
> come from two to three staff. It has to be like 30 seconds. And it has
> to be metric space."

**Decision:**
Change from optional to REQUIRED with specs:
- **Required** (not optional)
- 2-3 staff (not just manager)
- 30 seconds (specific duration)
- Metric-based (not just "I liked it")

**Rationale:**
- Video testimonial = critical case study component
- 30 sec = short enough for social media
- Metric-based = credible (not fluffy praise)
- Multiple staff = shows consistent impact

**Implementation:**
```html
<li>Video testimonial (required, 2-3 staff, 30 sec, metric-based)</li>
```

**Impact:**
- Slide 10 now sets clear expectation (PUMA knows it's non-negotiable)

---

## Decision 6: Scale-Up Wording Clarity

**Context:**
v1 showed "20 staff (full PRL Lekki)" which was incorrect.

**User Feedback:**
> "It's not 20 staff for all of your. It's just assuming 20. This is like
> numbers assuming 20 staff at Puma, assuming 50 staff at Puma."

**Decision:**
Change wording to "Assuming X staff at PUMA" format:
- Not "full PRL Lekki" (incorrect - PUMA doesn't have all PRL Lekki staff)
- Not "your 20 staff" (assumes commitment)
- "Assuming 20 staff at PUMA" (hypothetical scenario)

**Rationale:**
- Scale-up pricing should be illustrative, not prescriptive
- PUMA may have other stores beyond PRL Lekki
- "Assuming" = shows it's just an example calculation

**Impact:**
- Slide 12 now uses "Assuming 20 staff at PUMA" (clear, non-presumptive)

---

## Decision 7: Slide 14 Title Correction

**Context:**
v1 used "Why This Works" as title.

**User Feedback:**
> "Why this works. It's not another PowerPoint deck first. But this is a
> PowerPoint deck that I'm talking to them on. So it's why the training works."

**Decision:**
Change h2 from "Why This Works" to "Why the Training Works"

**Rationale:**
- "Why This Works" = ambiguous (this presentation? this meeting?)
- "Why the Training Works" = specific (refers to the pilot program)
- Avoids meta-confusion (slide is part of presentation, not the thing being evaluated)

**Impact:**
- Slide 14 now clearly references the training program (not the presentation itself)

---

## Decision 8: Deployment Strategy

**Context:**
User wanted live URL that auto-updates after Timi's feedback.

**Options Considered:**
1. Netlify (drag/drop, quick)
2. GitHub Pages (permanent URL, auto-updates on git push)
3. Static PDF (backup, no updates)

**Decision:**
Recommend hybrid approach:
- **Phase 1:** Send HTML file directly to Timi (faster iteration)
- **Phase 2:** Deploy to GitHub Pages after Timi's feedback (for PUMA leadership)
- **Backup:** Keep PDF version for offline viewing

**Rationale:**
- Direct file = fastest feedback loop (no deployment wait)
- GitHub Pages = professional permanent URL for leadership
- PDF = insurance if technical issues

**User Strategy:**
> "Look I put this PDF together, just go for it. Ask me a bunch of questions,
> a bunch of things like no I don't think this will work."

**Implementation:**
Created 3 documents:
1. `slides/DEPLOYMENT.md` (GitHub Pages instructions)
2. `MESSAGE_TO_TIMI.md` (3 WhatsApp message versions)
3. Recommended: Start with direct file share

**Impact:**
- Faster iteration (Timi sees file immediately)
- Professional URL available when needed (post-iteration)

---

## Decision 9: Message Tone (WhatsApp to Timi)

**Context:**
User wanted concise WhatsApp message prompting specific feedback.

**Requirements:**
- Concise (not formal business email)
- Sets expectation for iterative process
- Mentions supporting docs availability
- Prompts specific feedback (not just "looks good")

**Decision:**
Draft message with three prompts:
1. What doesn't work
2. What needs more explanation
3. Questions PUMA leadership will have

**Rationale:**
- Specific prompts = actionable feedback (not vague "thoughts?")
- "What doesn't work" = gives permission to be critical
- "Questions PUMA will have" = shifts perspective (helps anticipate objections)
- Mention of supporting docs = signals depth without overwhelming

**Final Message:**
```
Hey Timi,

Put together the PUMA presentation deck - 15 slides covering the pilot.

Please scan it and let me know:
- What doesn't work
- What needs more explanation
- Questions PUMA leadership will have

I have full supporting docs ready for deeper dives, but want your
initial reaction first so we can move quickly.

[Attach: puma-pilot-presentation-v2.html]

Open in any browser. Works on phone too.
```

**Impact:**
- Sets expectation: this is iteration 1, feedback needed
- Makes Timi feel consulted (not just rubber-stamping)
- "Move quickly" = aligns with user's urgency

---

## Technical Decisions

### Responsive Design
**Decision:** Mobile-first with CSS `clamp()` for font scaling
**Rationale:** PUMA leadership may view on phones, presentation must work on all screens

### Dark Background
**Decision:** #0a0a0a background (not white)
**Rationale:** Screen viewing (not print), reduces eye strain, modern aesthetic

### Scroll-Snap Navigation
**Decision:** Scroll-snap CSS + keyboard controls
**Rationale:** Works on mobile (swipe) and desktop (arrow keys), no JS framework needed

### File Format
**Decision:** Single HTML file (not PDF, not PowerPoint)
**Rationale:** Works everywhere, no software needed, can update easily, responsive

---

## User Satisfaction

**Overall Reaction:**
> "Yeah, this is actually really good. I've made some comments on what I want to change.
> But to be honest with you for the most part, it's good. So well, well, well done."

**Feedback Incorporation Rate:** 100% (all 10+ comments addressed in v2)

**Session Outcome:** ✅ Ready for Timi review
