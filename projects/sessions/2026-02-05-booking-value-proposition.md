---
session_id: 2026-02-05-booking-value-proposition
session_date: 2026-02-05
duration_hours: 2.5
projects_touched: [HB, SALES]
work_types: [design, implementation, iteration]
value_tier: high
impact_score: 8
decisions_count: 7
artifacts_count: 2
tasks_completed: 4
items_open: 1
---

# Session Packet: Booking System Value Proposition Design

**Session Date:** 2026-02-05
**Status:** ✅ Complete
**Duration:** ~2.5h
**Work Type:** Design & Implementation

---

## CONTEXT

Client needed a professional value proposition document for their custom booking system service. Initial request was to create pricing breakdown showing market value vs their discounted introductory pricing (£500 for Basic Package worth £1,480). Target audience: women business owners in hospitality/events space who are visual learners.

Started with Excel approach, then pivoted to PDF (ReportLab), then realized HTML→PDF would give better design control.

---

## DECISIONS MADE

### 1. HTML over PDF Library (CRITICAL)

**Decision:** Switched from ReportLab to HTML/CSS for design implementation

**Why:** ReportLab's font and layout limitations were blocking proper typography and design execution. HTML/CSS provides:
- Custom Google Fonts (Cormorant Garamond + Inter)
- Precise typography control (letter-spacing, line-height, font features)
- CSS Grid for perfect layouts
- Better page break control

**Impact:** Enabled application of impeccable design principles properly

**Location:** `/mnt/trello-mcp/booking-value.html`

### 2. Editorial/Luxury Aesthetic Direction (IMPORTANT)

**Decision:** Chose editorial/magazine style with luxury refinement as aesthetic direction

**Why:** Aligns with hospitality industry, appeals to target audience (women business owners), differentiates from generic "AI slop" templates

**Impact:** Warm-tinted color system, Cormorant Garamond serif, asymmetric layouts, refined spacing

**Location:** Design system in HTML `<style>` block

### 3. Restructured Information Flow (IMPORTANT)

**Decision:** Reordered sections: Problem → What's Available (comparison) → What's at Stake → Transformation → What You Get → The Point

**Why:** Follows value proposition masterclass framework better. Showing market alternatives early helps frame the problem

**Impact:** More persuasive narrative flow

**Location:** HTML content structure

### 4. Visual Pricing with Strikethrough (IMPORTANT)

**Decision:** Show £1,480 (strikethrough) → £500 with "Save £980 (70% off)" badge

**Why:** Target audience is highly visual. Immediate visual recognition of value/discount

**Impact:** Makes discount obvious without reading body text

**Location:** `.pricing-container` in Basic Package card

### 5. Warm-Tinted Color System (IMPORTANT)

**Decision:** No pure blacks or grays. All colors have warm undertones (brown/sage)

**Why:** Impeccable design principle - pure black/white don't exist in nature. Warm tints create cohesion for hospitality brand

**Impact:** Ink warm (#2B2826), sage statement (#4A5C42), warm background (#F8F5F1)

**Location:** CSS `:root` color variables

### 6. Removed Visual Clutter (MINOR)

**Decision:** Removed warning icons (⚠) from stakes, crosses (✗) from tool cards

**Why:** User feedback - too much visual noise. Keep only purposeful elements (border on transformation final stage, pricing visuals)

**Impact:** Cleaner, more refined design

**Location:** Removed `::before` pseudo-elements

### 7. Mobile-First Typography (IMPORTANT)

**Decision:** Large font sizes throughout (12pt body minimum, 1.75rem section titles, 2.5rem pricing)

**Why:** Primary viewing will be on mobile. User confirmed readability issues at smaller sizes

**Impact:** All text readable on mobile without zooming

**Location:** Font-size declarations throughout CSS

---

## WHAT WAS CREATED

1. **`booking-value.html`** - Complete value proposition document
   - Responsive HTML with embedded CSS
   - Google Fonts (Cormorant Garamond, Inter)
   - 6 sections with numbered labels
   - Print-optimized (@page, page-break controls)

2. **Market comparison grid** - 3-column layout showing Calendly, Acuity, Freshcal with pricing and limitations

3. **Transformation visual** - 4-stage progression with visual gradient (Generic → Defined → Seamless → Effortless)

4. **Package cards** - Sage and terracotta tinted backgrounds with visual pricing hierarchy

5. **Value highlight callout** - White card with sage border for key message at end

---

## WHAT WAS UPDATED

- Multiple iterations on PDF versions (abandoned in favor of HTML)
- Typography refinements (5+ iterations on font sizes, hierarchy, spacing)
- Color adjustments (removed red from "Custom pricing", fixed warm tints)
- Hero title line breaks (from 3 lines to 2 lines: "Custom Booking / Experiences")
- Spacing adjustments throughout (increased breathing room between sections)

---

## VALUE DELIVERED

### Immediate
- Professional value proposition document ready to use
- Can be printed to PDF from browser
- Mobile-optimized for primary viewing method
- Visual pricing makes discount immediately obvious
- Follows impeccable design principles (not "AI slop")

### Foundational
- HTML template can be adapted for other service offerings
- Established design system (colors, typography, spacing) for brand
- Demonstrated value of HTML→PDF workflow vs PDF libraries for design-heavy work
- Pattern for creating sales collateral that appeals to visual learners

---

## OPEN ITEMS

1. **Final PDF conversion** - User needs to open HTML in browser and Print→Save as PDF to create final artifact

---

## META

**Pattern observed:** When typography/design quality matters, HTML→PDF workflow is superior to PDF libraries (ReportLab, FPDF, etc.). The control over fonts, spacing, and layout is worth the extra step.

**Lesson:** "Impeccable design" principles are powerful differentiators:
- Warm-tinted colors (no pure black/white)
- Intentional asymmetry (left-aligned hero, right-aligned labels)
- Extreme typography contrasts (not muddy 10pt/11pt/12pt)
- Visual storytelling (strikethrough pricing, transformation progression)
- Less is more (removed cluttering icons after feedback)

The user's point about "women business owners are visual people" was key insight that elevated the work from functional to persuasive.
