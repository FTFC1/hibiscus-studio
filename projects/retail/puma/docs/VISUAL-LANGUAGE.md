# FORJE Learning Visual Language

**Purpose:** Design system for mobile-first microlearning content (salespeople on phones, limited attention)

---

## Core Principles

1. **No plain vanilla text** — Every section needs visual treatment
2. **Scannable at a glance** — They'll skim before they read
3. **Mobile-first** — Assume phone screen, thumb scrolling
4. **One action per mission** — Don't overwhelm with multiple asks

---

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Background | Warm beige | `#e5dcd3` |
| Cards/sections | Lighter beige | `#ddd4ca` |
| Dark cards (scenes) | Charcoal | `#2a2a2a` |
| Brand accent | FORJE gold | `#8b6914` |
| Don't items | Soft red | `#ffe5e5` |
| Insight cards | Soft blue | `#e8f4f8` |
| Learning cards | Light green | `#e8f5e9` |
| Text | Near black | `#1a1a1a` |
| Muted text | Gray | `#666` |

---

## Component Library

### Scene Card (The Problem)
**Use for:** Opening "problem" scenarios that set up the lesson
**Style:** Dark background (#2a2a2a), white text, timeline format
**Structure:**
- Timeline labels (YESTERDAY, TODAY, etc.)
- Scene descriptions with customer/staff actions
- Dialogue in quotes

```html
<div class="scene-card">
    <div class="scene-timeline">
        <div class="scene-item">
            <div class="scene-label">MOMENT</div>
            <div class="scene-text">What happens...</div>
        </div>
    </div>
</div>
```

---

### Consequence Card (Numbered Sequences)
**Use for:** Steps that happen in ORDER (1 leads to 2 leads to 3)
**NOT for:** Alternatives or options (use Dont-Items instead)
**Style:** White cards with large numbers, horizontal grid

```html
<div class="consequence-grid">
    <div class="consequence-card">
        <div class="consequence-number">1</div>
        <div class="consequence-title">Title</div>
        <div class="consequence-text">Description</div>
    </div>
    <!-- 2, 3... -->
</div>
```

---

### Dont-Items (Alternatives/Problems)
**Use for:** Things that are BAD but aren't sequential steps
**Use for:** "Any of these can be true" situations
**Style:** Red background, emoji icon, inline text

```html
<div class="do-dont-grid">
    <div class="dont-item">
        <span class="dont-icon">😬</span>
        <span class="dont-text"><strong>Label</strong> — explanation</span>
    </div>
</div>
```

**Common emojis:**
- 😬 Awkward/uncomfortable
- 😰 Anxious/pressure
- ⏱️ Time-related
- ❌ Wrong/bad
- 🚫 Forbidden

---

### Opening Card (Techniques/Scripts)
**Use for:** Specific phrases or scripts to use
**Style:** Numbered label, large phrase, "why it works", example dialogue

```html
<div class="opening-card">
    <div class="opening-label"><span class="opening-number">1</span> The Name</div>
    <div class="opening-phrase">"The exact words to say"</div>
    <div class="opening-why">Why this works...</div>
    <div class="opening-example">
        <div class="opening-example-label">Example Dialogue</div>
        <div class="dialogue-line"><span class="dialogue-you">You:</span> "..."</div>
        <div class="dialogue-line"><span class="dialogue-customer">Customer:</span> "..."</div>
    </div>
</div>
```

---

### Insight Card (Key Points)
**Use for:** Quick facts or insights to remember
**Style:** Blue background, emoji icon, short text

```html
<div class="insight-grid">
    <div class="insight-card">
        <span class="insight-icon">❓</span>
        <span class="insight-text">The insight text</span>
    </div>
</div>
```

---

### Learning Card (Important Context)
**Use for:** Text you NEED them to read before they see the cards below
**Use for:** Preventing "skip to the visual" behavior
**Style:** Green background, prominent text

```html
<div class="learning-card">
    <div class="learning-card-text"><strong>The key point they must read.</strong> Additional context.</div>
</div>
```

---

### Tip Box
**Use for:** Quick tips, edge cases, "what if" situations
**Style:** Bordered box with 💡 label

```html
<div class="tip-box">
    <div class="tip-label">💡 Quick Tip</div>
    <div class="tip-text">The tip content...</div>
</div>
```

---

### Action Card (Today's Action)
**Use for:** The ONE thing they should do today
**Style:** Prominent card with label, action text, and metric to track
**Metrics:** Use SIMPLE COUNTS, not rates or percentages

```html
<div class="action-card">
    <div class="action-card-label">🎯 Today's Action</div>
    <div class="action-card-text">What to do...</div>
    <div class="action-card-metric">
        <div class="action-card-metric-label">Track This Number</div>
        <div class="action-card-metric-value">How many [X] did you [Y] today?</div>
    </div>
</div>
```

---

### Telegram CTA
**Use for:** End-of-lesson community engagement prompt
**Style:** Dark box with share prompt
**Always include:** What action they took + result they got

```html
<div class="telegram-cta">
    <div class="telegram-cta-text"><strong>📱 End of Day: Share Your Win</strong></div>
    <div class="telegram-cta-action">What [action] did you use? How many [result] using [the action]? Post in the group chat.</div>
</div>
```

---

### Quick Reference Box
**Use for:** Summary lists they'll screenshot and save
**Style:** Bordered box with numbered list

```html
<div class="quick-ref">
    <div class="quick-ref-title">📋 Title</div>
    <ol>
        <li><strong>"Item 1"</strong></li>
        <li><strong>"Item 2"</strong></li>
    </ol>
</div>
```

---

## Layout Rules

### Section Flow
1. **Title** (h2 with emoji)
2. **Context** (learning-card if important, paragraph if not)
3. **Visual component** (cards, grids)
4. **Divider** between major sections

### Avoid
- Two numbered grids back-to-back (visual overload)
- Plain paragraph → plain paragraph (boring)
- Complex metrics (rates, percentages, formulas)
- Multiple actions in one lesson

---

## Typography

- **Headers:** System fonts, bold
- **Body:** 16px, 1.7 line height
- **Card titles:** 18-20px, semibold
- **Muted text:** #666, 14px

---

## Print/PDF

- Page breaks before major sections
- `page-break-inside: avoid` on cards
- Reduce padding for print

---

## Future Additions

- [ ] Quiz component design
- [ ] Progress indicator
- [ ] Certificate template
- [ ] Video embed style
