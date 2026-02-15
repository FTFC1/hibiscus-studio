# Mobile Micro-Interaction Designer -- Findings

## Task
Research CSS-only animations and micro-interactions for a premium bakery landing page (Flour Girls Cakehouse ganache masterclass). The page is content-complete but feels static. Static = cheap. Premium brands have motion.

**Constraints:** CSS-only or minimal vanilla JS. Single HTML file. Mobile-first (WhatsApp/IG traffic). No frameworks, no build tools.

---

## Top 5 Findings (ranked by impact)

### 1. Scroll-Triggered Reveal with Intersection Observer (Fade-Up + Stagger)

**What it does:** Elements fade in and slide up from below as the user scrolls them into view. Child elements within a group (cards, included items) stagger their entrance with cascading delays, creating a choreographed reveal.

**Why it works:** Creates the feeling of content responding to the user -- the page "wakes up" as they explore. The stagger effect prevents information overload by presenting items sequentially. This is the single highest-impact technique because it transforms EVERY section from static to alive, and the warm easing curve matches the artisan/handcrafted brand.

**Impact:** Rubric #1 (premium feel), #2 (minimal JS -- 12 lines), #3 (<15 min to add), #4 (GPU-accelerated, performant on mobile)

**Code:**

```css
/* ─── SCROLL REVEAL SYSTEM ─── */

/* Hidden state: elements start invisible and shifted down */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: opacity, transform;
}

/* Visible state: triggered by IntersectionObserver adding class */
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered children: use CSS custom property --i set in HTML */
.reveal-stagger {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: calc(var(--i, 0) * 120ms);
  will-change: opacity, transform;
}

.reveal-stagger.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Accessibility: respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .reveal,
  .reveal-stagger {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

```js
/* ─── Scroll Reveal Observer (12 lines, no dependencies) ─── */
(function() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate once only
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(function(el) {
    observer.observe(el);
  });
})();
```

**Where to apply on FGCH page:**
- Add `class="reveal"` to: `.different` section heading, `.teacher` bio block, `.studio` section, `.audience` section, `.faq` container, every `<h2>`, every `<p>` after headings
- Add `class="reveal-stagger" style="--i: 0"` (incrementing --i) to: each `.tier-card`, each `.included-item`, each `.usp-card`, each FAQ item
- Example HTML change for tier cards:
  ```html
  <div class="tier-card reveal-stagger" style="--i: 0">...</div>
  <div class="tier-card popular reveal-stagger" style="--i: 1">...</div>
  <div class="tier-card reveal-stagger" style="--i: 2">...</div>
  ```

**Effort:** S (Small) -- Add classes to HTML elements, paste CSS + JS once each
**Performance:** Excellent on mobile. Uses only `opacity` and `transform` (GPU-composited). IntersectionObserver is passive -- no scroll jank. `will-change` hints the browser. `unobserve` after first trigger means zero ongoing cost.

---

### 2. Hero Entrance Animation (Brand + Headline Choreography)

**What it does:** On first page load, the hero elements animate in with a choreographed sequence: brand name fades in first, then the headline slides up, then the subtext, then the CTA button. Uses staggered `animation-delay` values. The flourish element (`~ ~ ~`) fades in last. Pure CSS, no JS needed.

**Why it works:** First impressions define perceived quality. A static hero says "template." An orchestrated entrance says "someone cared about this." The sequential reveal also guides the eye: brand > headline > description > action. This is how premium hotel and restaurant websites present themselves.

**Impact:** Rubric #1 (premium first impression), #2 (pure CSS, zero JS), #3 (10 min implementation), #4 (runs once on load, no ongoing performance cost)

**Code:**

```css
/* ─── HERO ENTRANCE ANIMATION ─── */

@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heroFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Brand bar entrance */
.hero-brand-bar {
  animation: heroFadeIn 1s ease-out forwards;
  opacity: 0;
}

/* Flourish entrance */
.hero .flourish {
  animation: heroFadeIn 0.8s 0.3s ease-out forwards;
  opacity: 0;
}

/* Hero heading */
.hero-text h1 {
  animation: heroFadeUp 0.8s 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  opacity: 0;
}

/* Hero subtitle / description */
.hero-text p {
  animation: heroFadeUp 0.8s 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  opacity: 0;
}

/* CTA buttons */
.hero-text .btn {
  animation: heroFadeUp 0.7s 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  opacity: 0;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .hero-brand-bar,
  .hero .flourish,
  .hero-text h1,
  .hero-text p,
  .hero-text .btn {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

**Where to apply on FGCH page:** Hero section only. No HTML changes needed -- the CSS selectors target existing elements. The animation fires once on page load (the `forwards` fill-mode keeps the final state).

**Effort:** S (Small) -- Paste CSS block into existing `<style>` tag. No HTML changes.
**Performance:** Zero concern. Animations fire once on load using GPU-accelerated properties. `forwards` fill-mode means they stay complete -- no ongoing computation.

---

### 3. Ken Burns Slow Zoom on Hero Image

**What it does:** The hero image slowly and subtly zooms in (scale 1.0 to 1.06) over 25 seconds, creating a "breathing" effect. The image feels alive without being distracting. Combined with `overflow: hidden` on the container, the zoom stays contained.

**Why it works:** Static hero images feel like stock photos. A slow zoom creates cinematic quality -- it is the same technique documentary filmmakers use (hence "Ken Burns"). For a food/artisan brand, it makes the ganache/chocolate imagery feel luxurious and appetizing. The key is SUBTLETY: 6% zoom over 25 seconds is barely conscious but subconsciously registers as "premium."

**Impact:** Rubric #1 (cinematic, artisan feel), #2 (pure CSS), #3 (5 min implementation), #4 (single GPU-composited transform)

**Code:**

```css
/* ─── KEN BURNS HERO IMAGE ─── */

@keyframes kenBurns {
  0% {
    transform: scale(1.0);
    transform-origin: center center;
  }
  100% {
    transform: scale(1.06);
    transform-origin: 30% 60%;
  }
}

.hero-image {
  /* Add to existing .hero-image rules: */
  overflow: hidden; /* if not already set on a parent */
  position: relative;
}

/*
  Since .hero-image uses background-image, we need a pseudo-element
  OR we can convert to an <img> tag. Pseudo-element approach:
*/
.hero-image {
  overflow: hidden;
}

/* If using background-image (current approach), animate the div itself
   but clip with a wrapper. Simpler: just animate the background-size. */
.hero-image {
  animation: kenBurnsBackground 25s ease-in-out infinite alternate;
  will-change: transform;
}

@keyframes kenBurnsBackground {
  0% {
    background-size: 100% auto;
    background-position: center center;
  }
  100% {
    background-size: 112% auto;
    background-position: 30% 60%;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .hero-image {
    animation: none;
    background-size: cover;
    background-position: center center;
  }
}
```

**Alternative (cleaner, recommended): Use transform on a pseudo-element:**

```css
/* Wrap the hero image in overflow:hidden, use pseudo-element for the image */
.hero-image {
  overflow: hidden;
  position: relative;
}

.hero-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  background-size: cover;
  background-position: inherit;
  animation: kenBurnsZoom 25s ease-in-out infinite alternate;
  will-change: transform;
}

@keyframes kenBurnsZoom {
  0% {
    transform: scale(1.0);
  }
  100% {
    transform: scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-image::after {
    animation: none;
    transform: none;
  }
}
```

**Where to apply on FGCH page:** `.hero-image` element only. The pseudo-element approach is cleanest -- it inherits the existing `background` properties and animates the transform (GPU-composited).

**Effort:** S (Small) -- Add one CSS block. If using pseudo-element approach, the existing `background` on `.hero-image` is inherited.
**Performance:** Excellent. `transform: scale()` is GPU-composited. The `infinite alternate` loops seamlessly. No layout recalculation. Mobile-safe.

---

### 4. Premium Button Depth & Press Effect (3D Tactile CTA)

**What it does:** Buttons gain physical depth through layered box-shadows. On hover, buttons lift slightly (translateY -3px) with expanding shadow. On press (:active), buttons compress down (translateY +1px) with tightened shadow, creating a satisfying "click" feel. The shadow layers create the illusion of the button existing in 3D space above the page.

**Why it works:** Mobile users from WhatsApp/Instagram are habituated to tactile feedback. A button that "presses" feels responsive and trustworthy -- critical for a booking CTA. The depth effect also draws attention to CTAs without using garish colors or pulsing animations. Inspired by Josh W. Comeau's 3D button technique, simplified for a single-class implementation.

**Impact:** Rubric #1 (physical, crafted feel), #2 (pure CSS), #3 (10 min), #4 (excellent on mobile -- :active works on touch)

**Code:**

```css
/* ─── PREMIUM BUTTON DEPTH ─── */

.btn-primary {
  background: var(--rose);
  color: var(--white);
  position: relative;
  box-shadow:
    0 1px 2px rgba(45, 31, 26, 0.08),
    0 4px 8px rgba(45, 31, 26, 0.12),
    0 1px 0 rgba(169, 90, 72, 0.3) inset,
    0 -1px 0 rgba(45, 31, 26, 0.15) inset;
  transition:
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    background 0.25s ease;
}

.btn-primary:hover {
  background: var(--rose-hover);
  transform: translateY(-3px);
  box-shadow:
    0 2px 4px rgba(45, 31, 26, 0.1),
    0 8px 20px rgba(45, 31, 26, 0.15),
    0 1px 0 rgba(169, 90, 72, 0.3) inset,
    0 -1px 0 rgba(45, 31, 26, 0.15) inset;
}

.btn-primary:active {
  transform: translateY(1px);
  box-shadow:
    0 1px 2px rgba(45, 31, 26, 0.15),
    0 2px 4px rgba(45, 31, 26, 0.1),
    0 -1px 0 rgba(169, 90, 72, 0.2) inset,
    0 1px 0 rgba(45, 31, 26, 0.2) inset;
  transition-duration: 0.05s;
}

/* Secondary button gets similar but subtler treatment */
.btn-secondary {
  box-shadow: 0 1px 3px rgba(45, 31, 26, 0.06);
  transition:
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    background 0.25s ease,
    color 0.25s ease;
}

.btn-secondary:hover {
  background: var(--rose);
  color: var(--white);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 31, 26, 0.12);
}

.btn-secondary:active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(45, 31, 26, 0.1);
  transition-duration: 0.05s;
}

/* Mobile: ensure :active fires on touch */
@media (hover: none) {
  .btn-primary:hover {
    transform: none;
    box-shadow:
      0 1px 2px rgba(45, 31, 26, 0.08),
      0 4px 8px rgba(45, 31, 26, 0.12),
      0 1px 0 rgba(169, 90, 72, 0.3) inset,
      0 -1px 0 rgba(45, 31, 26, 0.15) inset;
    background: var(--rose);
  }
  .btn-secondary:hover {
    transform: none;
    background: transparent;
    color: var(--rose);
    box-shadow: 0 1px 3px rgba(45, 31, 26, 0.06);
  }
}

@media (prefers-reduced-motion: reduce) {
  .btn-primary,
  .btn-secondary {
    transition: background 0.15s ease, color 0.15s ease;
  }
  .btn-primary:hover,
  .btn-primary:active,
  .btn-secondary:hover,
  .btn-secondary:active {
    transform: none;
  }
}
```

**Where to apply on FGCH page:** Replaces existing `.btn-primary` and `.btn-secondary` hover rules. Affects ALL buttons on the page: hero CTA, tier card "Book This" buttons, booking form submit button. The `@media (hover: none)` block prevents ghost hover states on mobile touch devices (a common mobile UX issue).

**Effort:** S (Small) -- Replace existing button CSS. No HTML changes.
**Performance:** Pure CSS, GPU-accelerated transforms. The `:active` transition-duration of 0.05s gives instant press feedback on mobile.

---

### 5. Section Breathing & Divider Fade

**What it does:** Two effects combined: (A) The `~` tilde section dividers fade in with a gentle scale animation as they scroll into view, creating a visual "breath" between sections. (B) Alternating sections get a subtle top/bottom gradient overlay (2-3px) that softens the hard edge between different background colors (cream to white transitions), making sections flow into each other.

**Why it works:** Hard section boundaries create a "stacked blocks" feeling -- like PowerPoint slides placed vertically. The gradient edge-softening makes the page feel like one continuous surface rather than stacked boxes. The divider animation adds rhythm -- the page "breathes" between content sections. This is a hallmark of premium editorial design (Kinfolk magazine, Cereal magazine aesthetic).

**Impact:** Rubric #1 (editorial, flowing feel), #2 (pure CSS), #3 (15 min), #4 (no performance concern)

**Code:**

```css
/* ─── SECTION FLOW: SOFT EDGES ─── */

/* Gradient blend between sections with different backgrounds */
.different,    /* white bg section */
.included,     /* white bg section */
.audience {    /* textured bg section */
  position: relative;
}

/* Soft top edge: blend INTO this section from the previous one */
.different::before,
.included::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(to bottom, var(--cream), transparent);
  pointer-events: none;
  z-index: 1;
}

/* Soft bottom edge: blend OUT of this section */
.different::after,
.included::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(to top, var(--cream), transparent);
  pointer-events: none;
  z-index: 1;
}

/* ─── SECTION DIVIDER ANIMATION ─── */

.section-divider {
  opacity: 0;
  transform: scaleX(0.3);
  transition: opacity 1s ease, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.section-divider.is-visible {
  opacity: 1;
  transform: scaleX(1);
}

/* Divider tilde gets a gentle pulse after appearing */
.section-divider.is-visible span {
  animation: dividerBreath 4s ease-in-out 1s infinite;
}

@keyframes dividerBreath {
  0%, 100% { opacity: 0.5; letter-spacing: 0.3em; }
  50% { opacity: 0.8; letter-spacing: 0.5em; }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .section-divider {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .section-divider.is-visible span {
    animation: none;
  }
}
```

**Where to apply on FGCH page:**
- Add `reveal` class (from Technique #1) to each `.section-divider` element, OR add the `section-divider` selector to the IntersectionObserver query from Technique #1
- The `::before`/`::after` gradient blends apply automatically via CSS to `.different` and `.included` sections (white background sections that sit between cream sections)
- Note: check that `::before`/`::after` pseudo-elements aren't already in use on those sections. If `.tier-card.popular::before` is in use, the section-level pseudo-elements won't conflict (different selectors).

**Effort:** M (Medium) -- CSS is straightforward but need to verify no pseudo-element conflicts on section elements. Also need to add `.section-divider` to the observer selector string from Technique #1.
**Performance:** Minimal. Gradient pseudo-elements are static (painted once). The breathing animation uses only `opacity` and `letter-spacing` on a tiny element.

---

## Bonus: Accessibility Foundation (Required for ALL techniques above)

Every technique above includes `@media (prefers-reduced-motion: reduce)` blocks. This is not optional. Here is the unified accessibility block that should go at the TOP of all animation CSS:

```css
/* ─── ACCESSIBILITY: REDUCED MOTION ─── */
/* All animation respects user's OS-level motion preference.
   macOS: System Preferences > Accessibility > Display > Reduce motion
   iOS: Settings > Accessibility > Motion > Reduce Motion
   Android: Settings > Accessibility > Remove animations */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This nuclear option can replace per-technique reduced-motion blocks if you prefer simplicity. It disables ALL animation and transition in one rule.

---

## Rejected Techniques

### CSS Scroll-Driven Animations (`animation-timeline: view()`)
- **What it is:** Pure CSS scroll-linked animations (no JS). Elements animate in proportion to scroll position.
- **Why rejected:** Browser support is incomplete as of Feb 2026. Firefox does not support `animation-timeline`. Since FGCH traffic is mobile-first from WhatsApp/Instagram links, a significant portion of users may be on browsers without support. IntersectionObserver (Technique #1) achieves 95% of the same effect with universal browser support. Progressive enhancement could work, but adds complexity for a single HTML file.

### Parallax Scrolling (transform: translateZ / perspective)
- **What it is:** Background elements scroll at different speeds than foreground content.
- **Why rejected:** True parallax requires either JS scroll listeners (performance cost on mobile) or CSS perspective tricks that can cause jank on iOS Safari. The "premium" parallax sites of 2015-2018 now read as dated. The Ken Burns effect (Technique #3) achieves the "image is alive" feeling without the parallax baggage. Also: parallax on mobile is generally awful (touch scrolling is non-linear, creates disorientation).

### GSAP / Lottie Animations
- **What they are:** Professional animation libraries for complex choreography.
- **Why rejected:** Constraint is "no frameworks, single HTML file." GSAP CDN is ~27KB gzipped and requires `<script>` tag. Lottie requires player library. Both are overkill for the 5 effects identified. The IntersectionObserver + CSS approach is lighter and more appropriate for a landing page that needs to load fast from WhatsApp links on mobile data.

### CSS Particle / Confetti Background
- **What it is:** Floating decorative particles behind content (sprinkles, chocolate shavings).
- **Why rejected:** Fails Rubric #1 (premium, not flashy). Particle effects read as playful/whimsical, not artisan. They also fight for attention with the actual content. A ganache masterclass should feel sophisticated, not like a birthday party invitation.

### Typewriter / Text Scramble Effects
- **What it is:** Hero text types out letter by letter.
- **Why rejected:** Delays content delivery. Mobile users from WhatsApp links need to see the value proposition IMMEDIATELY. A typewriter effect on "Private Ganache Masterclasses" means 2-3 seconds before the user can read the heading. The fadeUp (Technique #2) shows everything within 1 second while still feeling animated.

### Magnetic Cursor Follow Effects
- **What it is:** Elements subtly track cursor movement.
- **Why rejected:** Requires JS mousemove listeners. Does nothing on mobile (no cursor). Since primary traffic is mobile from WhatsApp/Instagram, this would be invisible to most users.

---

## GitHub Repos Worth Bookmarking

### 1. [animate.css](https://github.com/animate-css/animate.css) (80k+ stars)
- **What it provides:** Library of 80+ ready-made CSS animations (fadeInUp, fadeInLeft, bounceIn, etc.)
- **Quality:** Industry standard. Well-maintained. MIT license.
- **FGCH relevance:** Could cherry-pick individual `@keyframes` from the source instead of loading the full 80KB library. The `fadeInUp`, `fadeIn`, `slideInUp` animations are directly applicable.
- **Usage:** Copy specific keyframes from `source/` directory into inline CSS.

### 2. [sal](https://github.com/mciastek/sal) (3.7k stars)
- **What it provides:** Scroll Animation Library -- 2.8KB minified. Uses IntersectionObserver internally. Data-attribute API: `<div data-sal="fade" data-sal-delay="300">`.
- **Quality:** Focused, well-documented, actively maintained.
- **FGCH relevance:** If you want a library rather than custom code, this is the right one. But for a single HTML file, the 12-line custom observer from Technique #1 is simpler and avoids a dependency.

### 3. [AOS - Animate on Scroll](https://github.com/michalsnik/aos) (26k+ stars)
- **What it provides:** Scroll-triggered animation library. Data-attribute API: `<div data-aos="fade-up">`.
- **Quality:** Very popular. 14KB. Uses IntersectionObserver.
- **FGCH relevance:** Good reference for animation names and timing curves. The source code for `aos.css` contains well-tuned `@keyframes` that can be borrowed. However, importing the full library is unnecessary for 5 effects.

### 4. [awesome-css-animations](https://github.com/streamich/awesome-css-animations) (800+ stars)
- **What it provides:** Curated list of CSS animation resources, libraries, and tools.
- **Quality:** Good directory. Links to Animate.css, Animista, anime.js, SpinKit.
- **FGCH relevance:** Bookmark for future reference. The Animista link (http://animista.net/) is particularly useful -- it generates custom CSS animations with a visual editor that you can copy/paste.

### 5. [Josh W. Comeau - 3D Button](https://www.joshwcomeau.com/animation/3d-button/)
- **What it provides:** Not a repo but a seminal tutorial on creating physically-realistic CSS buttons with depth, hover lift, and press compression.
- **Quality:** Exceptional. Production-ready code. Deep explanation of WHY each technique works.
- **FGCH relevance:** Technique #4 is a simplified version of this approach, adapted to FGCH brand colors.

---

## Implementation Priority Order

For maximum impact in minimum time:

| Order | Technique | Time | Impact |
|-------|-----------|------|--------|
| 1st | #2 Hero Entrance | 10 min | Immediate "this is premium" signal |
| 2nd | #1 Scroll Reveal + Stagger | 15 min | Transforms entire page feel |
| 3rd | #3 Ken Burns Hero | 5 min | Hero image feels alive |
| 4th | #4 Button Depth | 10 min | CTAs feel physical and trustworthy |
| 5th | #5 Section Breathing | 15 min | Editorial polish layer |

**Total estimated time:** ~55 minutes for all 5 techniques. Each is independent and can be implemented in isolation.

---

## Sources
- [CSS-Tricks: Scroll-Driven Animations](https://css-tricks.com/unleash-the-power-of-scroll-driven-animations/)
- [CSS Animation Rocks: Scroll Animations](https://cssanimation.rocks/scroll-animations/)
- [MROY Club: Scroll Animation Techniques 2025](https://mroy.club/articles/scroll-animations-techniques-and-considerations-for-2025)
- [ryfarlane: Fade-in-on-scroll](https://ryfarlane.com/article/fade-in-on-scroll-vanilla-javascript-css)
- [CSS-Tricks: Staggered Animations](https://css-tricks.com/different-approaches-for-creating-a-staggered-animation/)
- [Cloud Four: Staggered Animations with CSS Custom Properties](https://cloudfour.com/thinks/staggered-animations-with-css-custom-properties/)
- [CSS Animation Rocks: Animating Hero Header](https://cssanimation.rocks/animating-hero-header/)
- [Josh W. Comeau: 3D Button](https://www.joshwcomeau.com/animation/3d-button/)
- [Ken Burns CSS Gist](https://gist.github.com/CodeMyUI/e51f7bdc278f2a64bebeb024b0537420)
- [kirupa: Ken Burns Effect CSS](https://www.kirupa.com/html5/ken_burns_effect_css.htm)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [MDN: CSS Scroll-Driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [Prismic: CSS Hover Effects](https://prismic.io/blog/css-hover-effects)
- [Shape Divider App](https://www.shapedivider.app/)
- [GitHub SAL](https://github.com/mciastek/sal)
- [GitHub AOS](https://github.com/michalsnik/aos)
- [GitHub Animate.css](https://github.com/animate-css/animate.css)
- [GitHub awesome-css-animations](https://github.com/streamich/awesome-css-animations)
- [FreeFrontend: CSS Reveal Animations](https://freefrontend.com/css-reveal-animations/)
- [WebPeak: CSS/JS Animation Trends 2025](https://webpeak.org/blog/css-js-animation-trends/)
