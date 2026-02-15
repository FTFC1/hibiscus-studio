# Above-the-Fold Architect -- Findings

## Task
Research hero patterns for premium experience/workshop brands on mobile. Deliver 5 actionable findings for the Flour Girls Cakehouse ganache masterclass landing page.

**Context:** Two buyer types (gift buyers + aspiring bakers). Mobile-first traffic from WhatsApp/Instagram. Current weakness: hero is functional but doesn't SELL the experience. Text-only emotional trigger. No sensory pull.

---

## Top 5 Findings (ranked by impact)

### 1. Bottom-Anchored Text Over Full-Bleed Hero Image ("The Immersive Card" Pattern)

**Pattern:** Instead of separating image and text into two stacked sections (image above, text below), overlay the headline and CTA directly on the bottom third of the hero image using a warm-toned gradient fade. The image fills the entire first viewport on mobile. Text sits at the bottom, readable against a gradient that rises from the brand's chocolate colour. The user's first impression is the IMAGE, not a navigation bar or text block.

**Evidence:**
- **Pump Street Chocolate** (pumpstreetchocolate.com/pages/workshop): Full-viewport hero image with absolute-positioned text overlay. Header floats over the image. Headline "Pump Street Workshops" anchored at bottom. Sophisticated neutral tones (#373736 text, #FCE4E5 accents). Award badge ("Observer Food Monthly Best Producer") provides trust directly on the hero. Result feels premium and artisanal.
- **Piece, Love & Chocolate** (pieceloveandchocolate.com/classes-events): Full-width hero image (3000x1500 cinematic ratio) showing bakers at work. Centred text overlay with warmth-coded colours (burgundy #98242b, cream backgrounds, gold #dbb083). The image dominates; text is secondary.
- **Airbnb Experiences** (design.google case study): "Letting photography lead gives the UI a bold and uncluttered appearance." On mobile, marquee photos were "so large that they took up the entire screen." Photography-first, information-second. The image IS the product.
- **CSS gradient technique** (ishadeed.com): The "easing gradient" uses multiple colour-stops for a natural, non-harsh transition. Netflix uses this exact pattern for content cards. Key insight: gradient height must exceed text content height for reliable contrast across varied images.

**Impact:** Rubric #1 (gift buyer SEES hands on ganache in 3 seconds, not reads about it), #2 (premium on mobile -- cinematic, not catalogue), #4 (warm, craft, artisan -- the gradient uses the brand's own chocolate colour).

**Implementation:**
```css
/* Replace current stacked layout with overlay on mobile */
.hero {
  position: relative;
  height: 100vh;
  max-height: 700px;
  min-height: 500px;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center 30%; /* Keep hands/ganache visible */
}

/* Warm chocolate gradient -- rises from bottom */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  /* Easing gradient: multiple stops for natural transition */
  background: linear-gradient(
    to top,
    rgba(45, 31, 26, 0.92) 0%,
    rgba(45, 31, 26, 0.75) 25%,
    rgba(45, 31, 26, 0.45) 45%,
    rgba(45, 31, 26, 0.15) 60%,
    rgba(45, 31, 26, 0.0) 75%
  );
  z-index: 1;
}

.hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 0 1.5rem 2rem;
  color: #fef9f4; /* Warm cream text on dark gradient */
}

.hero-content h1 {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.hero-content .subtext {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 1.25rem;
}

/* Desktop: side-by-side as before */
@media (min-width: 768px) {
  .hero { height: 85vh; }
  .hero-content {
    width: 45%;
    right: 0;
    left: auto;
    padding: 3rem;
  }
  .hero::after {
    background: linear-gradient(
      to left,
      rgba(45, 31, 26, 0.92) 0%,
      rgba(45, 31, 26, 0.75) 30%,
      rgba(45, 31, 26, 0.0) 65%
    );
  }
}
```

**Effort:** S-M (CSS change only. Replace stacked layout with overlay. No new HTML elements. Gradient values may need tuning for the specific hero image darkness. ~15-20 min with testing.)

---

### 2. Compact Social Proof Strip Immediately Below Hero ("Trust Bar")

**Pattern:** A single-line strip between the hero and the rest of the page showing a star rating, a micro-testimonial quote, or key trust facts. Not a full testimonial block -- a compressed, scannable trust signal that bridges the emotional hero and the informational content below.

**Evidence:**
- **Obby** (obby.co.uk): "5-star rating with 10,500+ reviews prominently displayed" immediately after the primary CTA area. Single line. Compact. Instant credibility. Uses emerald accent colour (#03c2b9) for visual distinction.
- **ClassBento**: Individual workshop pages show teacher rating (e.g., "4.9 out of 5 from 50 reviews") plus format badges ("Private", "Beginner friendly!"). Platform-wide 4.9 stars from 17k+ reviews. This information appears in the hero zone, never buried below the fold.
- **Airbnb Experiences**: Each experience card shows star rating + review count + host name ABOVE the fold. Individual listing pages show rating, number of reviews, duration, and language in a compact header strip.
- **KlientBoost research**: "You can have a small reviews summary in the page hero, then multiple testimonial blocks further down the page." The hero summary catches the gift buyer. Landing pages with social proof convert 34% better than those without.
- **MailerLite**: "Place some trust signals high on the page (even in the hero as a small line like 'Join 5,000 subscribers...') and again near your CTAs, so it nudges people at the decision moment."
- **WiserNotify**: A trust bar of logos or review snippets placed "just below your hero section" establishes "immediate credibility." Client logos and review summaries "balance high recall with low cognitive load."

**Impact:** Rubric #1 (gift buyer trusts instantly -- "other people loved this"), #2 (premium brands SHOW proof, budget brands hide it), #4 (a warm quote from a real person fits the artisan brand).

**Implementation:**
```html
<!-- Sits immediately after .hero, before main content -->
<div class="trust-strip">
  <span class="trust-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
  <span class="trust-text">"Best gift I've ever given" &mdash; Sarah, Google Reviews</span>
</div>
```

```css
.trust-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fef9f4;
  border-bottom: 1px solid rgba(199, 125, 106, 0.2);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  color: #2d1f1a;
}

.trust-stars {
  color: #c77d6a;      /* Rose accent */
  font-size: 0.9rem;
  letter-spacing: 2px;
}

.trust-text {
  font-style: italic;
  opacity: 0.85;
}

@media (max-width: 480px) {
  .trust-strip {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }
}
```

**Effort:** S (~5-10 min. One HTML element + CSS. No JS.)

---

### 3. Sticky Bottom CTA Bar on Mobile ("Always-Available Book")

**Pattern:** A fixed bar at the bottom of the mobile viewport containing the price ("From GBP119") and a primary CTA button ("Book This Experience"). Appears after the user scrolls past the hero CTAs. Always visible while scrolling content. Hides when the user reaches the booking form (to avoid redundancy). Includes safe-area padding for modern phones with home indicators.

**Evidence:**
- **Airbnb**: "Book is a primary function in the Airbnb app, with a raised button for this action visually underscoring its importance." On individual experience pages, the Book/Reserve button is always accessible via sticky footer on mobile.
- **LandingPageFlow (2026)**: "Sticky or floating CTAs are perfect for mobile-first designs and action-focused experiences, staying visible as users scroll." "Fixed footers for CTAs are recommended in mobile view as it is easier for the user to access the button at the bottom of their screen rather than having to reach for the top."
- **Influencers-Time.com**: "83% of all landing page visits happen on mobile devices." Mobile CTAs should be "shorter (2-3 words) and larger." Critical finding: "Multiple equally prominent CTAs on mobile often reduce conversions by splitting attention, so secondary actions should be visually demoted with a text link style."
- **SmartSMSSolutions**: Experience-focused CTAs like "Create Unforgettable Moments" achieve 6.8% CTR. "Find Perfect Gifts" increased clicks by 23% compared to "Shop Gifts."
- **RebelMouse**: Sticky elements should "stay subtle, lightweight, and non-intrusive to avoid annoying users." The bar can contain up to two buttons but should encourage action without overwhelming.

**Impact:** Rubric #1 (gift buyer can act the MOMENT they decide -- no scrolling 4000px back to the hero CTA), #3 (implementable in under 20 min).

**Implementation:**
```html
<!-- Add before </body> -->
<div class="sticky-cta" id="stickyCta">
  <div class="sticky-cta__price">
    <span class="sticky-cta__from">From</span>
    <span class="sticky-cta__amount">&pound;119</span>
    <span class="sticky-cta__per">per person</span>
  </div>
  <a href="#booking" class="sticky-cta__btn">Book This Experience</a>
</div>
```

```css
.sticky-cta {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #2d1f1a;
  padding: 0.75rem 1rem;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 12px rgba(45, 31, 26, 0.25);
}

.sticky-cta.visible {
  display: flex;
}

.sticky-cta__price {
  color: #fef9f4;
  font-family: 'DM Sans', sans-serif;
  line-height: 1.2;
}

.sticky-cta__from {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
  display: block;
}

.sticky-cta__amount {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 700;
}

.sticky-cta__per {
  font-size: 0.7rem;
  opacity: 0.7;
}

.sticky-cta__btn {
  background: #c77d6a;
  color: #fef9f4;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s;
}

.sticky-cta__btn:hover {
  background: #b56d5a;
}

/* Only show on mobile */
@media (min-width: 768px) {
  .sticky-cta { display: none !important; }
}

/* Safe area for phones with home indicator */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .sticky-cta {
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
  }
}
```

```javascript
// Show sticky CTA after scrolling past hero, hide at booking form
(function() {
  var hero = document.querySelector('.hero');
  var stickyCta = document.getElementById('stickyCta');
  if (!hero || !stickyCta) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      stickyCta.classList.toggle('visible', !entry.isIntersecting);
    });
  }, { threshold: 0.1 });

  observer.observe(hero);
})();
```

**Effort:** S-M (HTML + CSS + small JS snippet. ~15-20 min including testing.)

---

### 4. Dual-CTA with Gift Buyer Priority ("Gift This" Primary, "Book for Myself" Secondary)

**Pattern:** Two CTAs in the hero, but visually weighted differently. The primary button is "Gift This Experience" (filled, high-contrast). The secondary is "Book for Myself" (outlined/ghost style). This acknowledges the two buyer types without splitting attention -- the gift buyer (likely majority of traffic for a premium workshop) gets the dominant path.

**Evidence:**
- **ClassBento**: Platform explicitly supports both gift cards and direct bookings on every workshop page. "Makes it easy for anyone to request, book or gift." Separate buttons with clear visual hierarchy.
- **SmartSMSSolutions**: "Solution-focused CTAs like 'Save the Day: Instant Delivery Gifts' achieve a 10.3% CTR." Gift-specific language outperforms generic "Book Now" by a wide margin.
- **LandingPageFlow (2026)**: On mobile, "multiple equally prominent CTAs often reduce conversions by splitting attention, so secondary actions should be visually demoted with a text link style." This means one filled button + one text/outline link, not two identical buttons.
- **Influencers-Time.com**: "'Find Perfect Gifts' increased clicks by 23% compared to 'Shop Gifts.'" The word "Gift" in the CTA performs better than transactional language for experience products.

**Impact:** Rubric #1 (gift buyer sees their path IMMEDIATELY -- "Gift This Experience" not "Book Now" which feels transactional), #4 (gift language is warm and personal, matching FGCH brand voice).

**Implementation:**
```html
<div class="hero-ctas">
  <a href="#gift" class="cta cta--primary">Gift This Experience</a>
  <a href="#booking" class="cta cta--secondary">Book for Myself</a>
</div>
```

```css
.hero-ctas {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 320px;
}

.cta {
  display: block;
  text-align: center;
  padding: 0.875rem 1.5rem;
  border-radius: 6px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s;
}

.cta--primary {
  background: #c77d6a;
  color: #fef9f4;
}

.cta--primary:hover {
  background: #b56d5a;
}

.cta--secondary {
  background: transparent;
  color: #fef9f4;
  border: 1.5px solid rgba(254, 249, 244, 0.5);
  font-size: 0.9rem;
}

.cta--secondary:hover {
  border-color: #fef9f4;
  background: rgba(254, 249, 244, 0.08);
}

@media (min-width: 768px) {
  .hero-ctas {
    flex-direction: row;
    max-width: none;
  }
}
```

**Effort:** S (~10 min. Swap existing CTA HTML + add CSS.)

---

### 5. Sensory/Experiential Copy Hierarchy Over Informational Copy

**Pattern:** Replace the current informational headline ("One Day. One Teacher. Real Ganache.") with a sensory/emotional headline that puts the buyer IN the kitchen. The first word should trigger a feeling, not convey a fact. When the IMAGE is doing the selling (especially with the full-bleed overlay from Finding #1), the headline's job changes from "pitch" to "caption" -- short, emotional, complementing what the eyes already see.

**Evidence:**
- **Pump Street Chocolate**: "Explore, understand and master" -- active verbs positioning the buyer as protagonist. Not "We teach you chocolate" but "YOU explore chocolate."
- **Piece, Love & Chocolate**: "Join us in demystifying macarons, handcrafting truffles..." -- invitation language. "Join us" is warm. "Demystifying" and "handcrafting" are sensory verbs.
- **Leiths**: "Gain a new culinary skill and build your knowledge of food" -- aspiration-focused. The buyer imagines themselves AFTER the class.
- **Dallas Chocolate Classes**: "Take a FUN & EDUCATIONAL tour through the world of chocolate" -- experiential framing. A "tour" not a "class."
- **Airbnb (Google Design)**: "Letting photography lead gives the UI a bold and uncluttered appearance." Lesson: when the IMAGE is doing the selling, the headline becomes a caption, not a pitch. Short. Emotional. Complementary.
- **ConvertCart**: "Using vivid, appetizing colors like bright greens of fresh veggies, deep reds of ripe fruit, and golden browns of freshly baked goods" -- sensory language in copy should mirror what the image shows.

**Impact:** Rubric #1 (gift buyer FEELS it -- "I want to give someone THAT experience"), #4 (warm, artisan brand voice), #2 (premium experiences sell feeling; budget experiences list features).

**Implementation -- Copy Options:**

Replace current:
```
One Day. One Teacher. Real Ganache.
Learn to temper, pour and finish like a professional.
```

**Option A -- Invitation frame (warm, inclusive):**
```
Your Hands. Real Chocolate. One Afternoon.
Step into a private kitchen in East London and learn the art
of ganache -- just you and your teacher.
```

**Option B -- Gift frame (for gift-buyer primary traffic):**
```
Give Them a Kitchen They'll Never Forget
A private ganache masterclass in East London.
One teacher. One unforgettable afternoon.
```

**Option C -- Sensory/aspiration frame:**
```
Smooth, Pour, Create.
A private masterclass in the art of chocolate ganache
-- from tempering to tasting.
```

Copy hierarchy on mobile (top to bottom within gradient overlay):
1. **Headline** -- Playfair Display, 1.75rem, cream (#fef9f4), max 8 words
2. **Subtext** -- DM Sans, 0.95rem, cream at 90% opacity, 1-2 sentences max
3. **CTAs** -- as per Finding #4 above

**Effort:** S (copy change only. Zero code. 5 minutes.)

---

## Rejected Findings

### Full-Screen Background Video in Hero
- **Found on:** Various premium experience sites, suggested in multiple best-practice articles
- **Why rejected:** FGCH uses an AI-generated image (1024x1024). Video requires real footage, adds significant page weight on mobile (data cost for WhatsApp-referred traffic), and autoplay is inconsistent across mobile browsers. If real workshop footage becomes available after the first sessions, revisit. For now, the gradient-overlay-on-still-image achieves 80% of the effect at 10% of the effort. **Fails rubric #3.**

### Search Bar in Hero (Obby, Airbnb Homepage Pattern)
- **Found on:** Obby.co.uk (central search input "What do you want to learn?"), Airbnb homepage
- **Why rejected:** These are marketplace homepages with thousands of listings. FGCH has ONE product. A search bar on a single-product page is absurd. The hero's job is to SELL this experience, not help users find other ones. **Fails rubric #4 (feels like a platform, not artisan).**

### Image Carousel / Gallery in Hero
- **Found on:** Airbnb individual listings (swipeable gallery), ClassBento individual workshops
- **Why rejected:** Carousels require multiple high-quality images. FGCH currently has one hero image. A carousel with one image looks broken. A carousel mixing one real image with AI-generated filler looks inconsistent and undermines trust. Build toward this AFTER real workshop photos exist (post first 3-5 sessions). **Fails rubric #3 (needs content that doesn't exist yet).**

### Countdown Timer / Urgency Badge ("Only 3 Spots Left")
- **Found on:** Bread Ahead (flash sale banner "2-FOR-1 SALE NOW LIVE!"), various booking platforms
- **Why rejected:** FGCH is a private 1-2-1 workshop, not a group class with limited seats. Scarcity tactics feel manipulative for a premium artisan brand. The "limited" nature is already communicated by "One Teacher" in the copy. Forced urgency undermines trust with the premium audience. **Fails rubric #4 (not warm/artisan, feels like a sales funnel).**

### Animated Hero Text / Parallax Scroll Effects
- **Found on:** DevNahian CSS hero animations, various design portfolios
- **Why rejected:** Animations add cognitive load on mobile, increase implementation complexity, and risk feeling "techy" rather than "artisan." The FGCH brand is warm and handmade -- the design should feel still and considered, like a beautifully set kitchen, not a motion graphics reel. **Fails rubric #3 (adds complexity) and #4 (wrong brand register).**

### Animated Number Counters ("13+ Years" Counting Up)
- **Found on:** SaaS landing pages, corporate experience
- **Why rejected:** Works for scale-bragging ("10,000+ customers served"). Feels wrong for an artisan workshop brand that celebrates intimacy over volume. The trust bar (Finding #2) presents the same information more elegantly and on-brand.

---

## Implementation Priority Order

If implementing all 5, this is the sequence (each builds on the previous):

| Order | Finding | Effort | Time | Why This Order |
|-------|---------|--------|------|----------------|
| 1st | #5 Sensory Copy | S | 5 min | Copy change. Zero code. Immediate emotional upgrade. Foundation for everything else. |
| 2nd | #1 Full-Bleed Overlay | S-M | 15-20 min | CSS-only layout change. Biggest visual transformation. Makes copy from #5 shine. |
| 3rd | #4 Dual CTAs | S | 10 min | Swap CTA text + add ghost style. Works perfectly with the overlay from #1. |
| 4th | #2 Trust Strip | S | 5-10 min | Add HTML + CSS. Independent of other changes. Bridges hero to content. |
| 5th | #3 Sticky Bottom Bar | S-M | 15-20 min | Needs price and booking link finalised. Last because it augments, not transforms. |

**Total for all 5:** ~50-65 minutes.
**For findings #5 + #1 alone (biggest bang):** ~20-25 minutes.

---

## Sources
- pumpstreetchocolate.com/pages/workshop -- Premium artisan workshop hero (full-viewport image, text overlay, award badge, #373736/#FCE4E5 palette)
- obby.co.uk -- Social proof strip (5-star + 10,500+ reviews in hero zone, emerald #03c2b9 accent)
- classbento.com -- Workshop card ratings (4.9 stars from 17k+, dual gift/book CTAs, price in hero)
- pieceloveandchocolate.com/classes-events -- Premium baking workshop hero (3000x1500 full-width, burgundy/cream/gold palette, sensory copy)
- leiths.com/culinary-masterclasses/ -- Premium cooking school copy (aspiration-focused, heritage signalling, Libre Baskerville serif)
- dallaschocolateclasses.com -- Experience-forward copy framing ("tour through the world of chocolate")
- breadahead.com -- Bakery school promotional patterns
- ishadeed.com/article/handling-text-over-image-css/ -- CSS easing gradient technique (multiple colour-stops, Netflix pattern, accessibility testing)
- design.google/library/airbnb-invites-you-in -- Airbnb photography-first design philosophy ("letting photography lead")
- goodui.org/blog/comparing-bookings-vs-airbnbs-mobile-homepage-ui/ -- Airbnb vs Booking mobile first-viewport comparison
- landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages -- Sticky CTA best practices (2026)
- influencers-time.com -- Mobile CTA conversion data (83% mobile visits, single CTA > multiple)
- smartsmssolutions.com -- Gift-specific CTA performance data (10.3% CTR, "Find Perfect Gifts" +23%)
- wisernotify.com/blog/landing-page-social-proof/ -- Social proof placement and 34% conversion lift
- mailerlite.com/blog/social-proof-examples-for-landing-pages -- Trust bar placement patterns
- klientboost.com/landing-pages/landing-page-hero-shots/ -- Hero shot best practices (reviews summary in hero)
- rebelmouse.com/css-position-sticky -- Sticky element implementation patterns
- cloudinary.com/guides/image-effects/css-gradient-over-image -- CSS gradient overlay techniques
- w3schools.com/howto/howto_css_hero_image.asp -- Hero image implementation reference
