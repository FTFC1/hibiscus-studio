# Deep Multi-Angle Analysis: "Stop Shipping AI Slop"
**Video:** Greg Isenberg with Sarah (designer, sold company to Snap)
**Date Analyzed:** 2026-02-14
**Source:** YouTube — Greg Isenberg podcast

---

## LENS 1: Design Principles

**What specific design principles, patterns, and rules does Sarah teach?**

- **"How should it make you feel?" before "What should it do?"**
  - Why: Functionality is a solved problem. Feeling is what makes someone download. Every vibe-coded app already *does* the thing. The ones that win *feel* different.
  - Example: The AI-generated journaling app had record, history, timer — but felt like "every other app on the planet." It failed the feeling test immediately.

- **Outsource WHAT, keep HOW**
  - Why: If you outsource all thinking to AI, everything looks the same. AI is good at solved problems (build a recorder). Humans must own HOW it does it (the style, texture, metaphor).
  - Example: The one-shot from Google AI Studio was functional but generic. The design differentiation came entirely from Sarah's choices about analog warmth and cassette metaphor.

- **Work backward from feeling to constraints**
  - Why: "Calm" as a feeling word eliminates 75 timers, coaches, notifications. The feeling becomes a filter that kills bad features.
  - Example: "This girl wants to feel calm. Therefore, it probably can't have like 75 timers." One feeling word = dozens of design decisions made.

- **Define what it is NOT**
  - Why: Equally useful as what it is. "Not a productivity tool" is the opposite of "private space to rant." This prevents feature creep into wrong territory.
  - Example: Claude output included "what it's not" — not social, not needy, not a productivity tool. Sarah highlighted these as highly valuable constraints.

- **Visual anchor over abstract guidelines**
  - Why: One image you love can generate an entire brand. Abstract brand documents are overhead. A single reference image is faster and more honest.
  - Example: Sarah said she built her last startup's entire brand from ONE image. Johnny Ive did the same with Dieter Rams' work for Apple.

- **Brand elements must have PURPOSE**
  - Why: Analog visuals without purpose feel gimmicky. The cassette aging mechanic wasn't decoration — it mapped to "the more you use it, the more it wears in," which reinforced the journaling habit.
  - Example: The aged/used cassette tape visual wasn't just aesthetic — it was a metaphor for personal investment in the product.

- **Building blocks approach (bottom-up)**
  - Why: Start with colors, then backgrounds, then buttons, then images. Like painting — background first, details last.
  - Example: Workflow was: mood board colors → color palette extraction → background textures → button generation → cassette tape history elements → logo → screen assembly.

- **Negative prompts (what you DON'T want)**
  - Why: AI defaults to glossy, gradient, 3D render. Explicitly telling it "no gradients, no sparkles, no 3D" steers output dramatically.
  - Example: Logo generation used negative prompt: "no 3D render, no glossy, no gradient, no mesh, no sparkles, no corporate."

- **Consistency in product design is easier than character consistency**
  - Why: You don't need faces to match — just colors, shadows, and lighting. This makes AI-generated brand assets much more reliable.
  - Example: All cassette tape images, buttons, and palettes maintained visual consistency because they shared the same color inputs and textural prompts.

- **Products are like movies — beginning, middle, end**
  - Why: Start with how the user feels at the BEGINNING (first open). The beginning determines download/retention. Middle and end can come later.
  - Example: For a health app, don't obsess over the tracking dashboard yet — obsess over how opening the app feels.

---

## LENS 2: Thinking Process (Meta)

**HOW does Sarah think? What is her methodology? What order does she work in?**

### Step-by-step process observed:

1. **Generate a functional prototype first (one-shot)**
   - Use Google AI Studio for fast, throwaway prototype
   - Purpose: See what it needs to DO, not how it should LOOK
   - Time: ~2 minutes

2. **Evaluate the prototype against real-world standards**
   - "Would I download this if I saw it on Instagram?" → NO
   - This is the key moment. Most people stop at "it works."

3. **Write down functional requirements**
   - Minimal list: record audio, history, timer
   - This is the WHAT. Keep it short.

4. **Define the feeling (the HOW)**
   - "Who is this for? How should they feel?"
   - Use Claude to brainstorm — who they are, what they crave, what they reject
   - Key question: "What would make them NOT download?"

5. **Extract emotional keywords from Claude's output**
   - Cherry-pick: "analog warmth," "permission to be unpolished," "not needy"
   - Ignore: Claude's follow-up questions and corporate-sounding framework

6. **Build a mood board (visual references)**
   - Tool: Cosmos (Pinterest alternative)
   - Search by theme keywords ("vintage cassette")
   - Save images that MATCH the feeling words from step 4

7. **Extract color palette from mood board**
   - Input: mood board images → Weavy AI (Flux 2 Pro model)
   - Prompt: "Extract color palette from this image"
   - Run multiple versions to compare

8. **Find the visual anchor**
   - One image that IS the product. Not overthink — react viscerally
   - "This could literally be the app."

9. **Generate brand assets (building blocks)**
   - Colors → backgrounds → buttons → cassette tapes → logo
   - Each step uses the previous output as input
   - Claude writes prompts for Weavy; Weavy generates visuals

10. **Assemble in Figma**
    - iPhone frames, paste assets, add text
    - Keep it messy — it's a design draft, not production

### Key meta-observations about her process:
- **She pauses to evaluate at every step** — "Do I like this? Does this match the feeling?"
- **She's comfortable discarding** — generated things she thought she'd love, then preferred something else
- **She bounces between Claude and Weavy** — Claude for thinking/prompts, Weavy for visual generation
- **She doesn't aim for perfection** — "These don't need to be perfect"
- **She starts with the cheapest/fastest thing** — mood board before generation, text before images

---

## LENS 3: Origination

**Where do her ideas come from? What references and influences?**

- **Dieter Rams → Johnny Ive → Apple**
  - Explicitly referenced. "One designer's work inspired an entire product line." This is the precedent for the "one image = one brand" approach.

- **Analog physical objects (cassette tapes, record buttons, vintage audio equipment)**
  - The entire visual system came from physical-world objects, not digital design patterns
  - This is the opposite of how most apps are designed (copying other apps)

- **Movies and TV shows as product metaphor**
  - "Movies have beginning, middle, end. Products should too."
  - Products have a narrative arc — most vibe-coders only think about features

- **Cosmos (Pinterest alternative) for visual discovery**
  - Not just reference searching — she describes getting lost in visual clusters
  - The discovery IS the design process. Serendipity is a feature.

- **The "girl who would download this" persona**
  - Specific, empathetic, human — not a user segment or demographic
  - "This girl who wants to feel calm" — one sentence, entire design direction

- **TDK, Maxell, BASF (cassette tape brands)**
  - Even if not consciously remembered, the visual language of 80s tape branding informed the logo style
  - "It's probably deep in my brain somewhere"

- **Brooklyn cafe aesthetic**
  - The warmth, texture, analog feel of physical spaces influenced the digital direction
  - "This looks like it'd be a cafe in Brooklyn"

---

## LENS 4: Human vs Automatable

| Step | Who Does It | Why |
|------|-------------|-----|
| Generate functional prototype | **AI can do** | One-shot from prompt. Solved problem. |
| Evaluate "would I download this?" | **HUMAN required** | Taste, empathy, market awareness. AI can't feel. |
| Define functional requirements | **Hybrid** | AI can list features; human decides what matters. |
| Define HOW it should feel | **HUMAN required** | This is the core creative act. AI can brainstorm, but human must resonate. |
| Cherry-pick from Claude's output | **HUMAN required** | "Do I like this or not?" — pure taste filter. |
| Build mood board | **Hybrid** | AI finds images; human selects ones that match feeling. |
| Extract color palette | **AI can do** | Mechanical — extract dominant colors from image. |
| Find visual anchor (the ONE image) | **HUMAN required** | "I'm obsessed with this" — visceral, non-rational. |
| Generate asset variations | **AI can do** | Prompt + model = output. Mechanical. |
| Evaluate which variation to use | **HUMAN required** | Taste again. "I thought I'd love this more, but actually love this." |
| Write negative prompts | **Hybrid** | Claude suggests; human confirms what to exclude. |
| Assemble screens in Figma | **Hybrid** | Layout is human judgment; placement is mechanical. |
| Final "does this feel right?" check | **HUMAN required** | The squint test. Does the whole thing cohere? |

### Key insight:
**The human value is in TASTE and FEELING — knowing what to react to, what to select, what to reject.** Every generation step can be automated. Every evaluation step requires a human. The designer's job has shifted from MAKING to SELECTING.

---

## LENS 5: Dependencies

**What depends on what? What's the critical path?**

```
FEELING DEFINITION (must happen first)
  ↓
  ├── Mood Board (needs feeling keywords to search)
  │     ↓
  │     ├── Color Palette (needs mood board images)
  │     │     ↓
  │     │     ├── Background Textures (needs colors)
  │     │     ├── Button Generation (needs colors + anchor)
  │     │     └── Asset Generation (needs colors + anchor)
  │     │
  │     └── Visual Anchor (needs mood board to discover)
  │           ↓
  │           └── Brand Metaphor (needs anchor image)
  │                 ↓
  │                 └── Logo (needs metaphor + colors)
  │
  └── Brand Guidelines (needs feeling + mood board + anchor)
        ↓
        └── Screen Assembly (needs all assets + guidelines)
              ↓
              └── Code Implementation (needs screens)
```

### What breaks if you skip steps:

- **Skip feeling definition → everything is generic.** This is the #1 failure mode of vibe coding. You get functional but soulless.
- **Skip mood board → no visual coherence.** Assets generated without reference images drift in style.
- **Skip visual anchor → no consistency.** The anchor is what holds the brand together across all assets.
- **Skip negative prompts → AI slop.** Without explicitly rejecting glossy/gradient/3D, AI defaults to them.
- **Skip evaluation at each step → compound drift.** Bad color palette → bad buttons → bad screens → unsalvageable result.

### Critical path:
Feeling → Mood Board → Visual Anchor → Color Palette → Assets → Assembly

The prototype (one-shot) is actually OFF the critical path. It's useful for knowing WHAT, but the entire design quality comes from the feeling→anchor chain.

---

## LENS 6: Gaps & Unsaid

**What did she NOT mention? What assumptions is she making?**

- **She assumes Figma proficiency.** Copy-pasting iOS bars, creating frames, organizing layers — these are not beginner skills. She glosses over them.

- **She assumes access to all tools.** Weavy AI, Cosmos, Figma, Claude, Google AI Studio, Flux 2 Pro, Ideogram v3. That's 7+ tools. A non-designer might struggle with the tool-switching overhead.

- **She doesn't mention responsive design.** Everything is shown as iPhone frames. How does this translate to web, tablet, or different phone sizes?

- **She doesn't cover implementation.** The video ends at design mockup. The gap between "beautiful Figma mockup" and "shipped app that looks like the mockup" is enormous. AI coding tools notoriously break visual fidelity.

- **She assumes Western/US aesthetic sensibilities.** "Brooklyn cafe," vintage cassettes, analog warmth — these references may not resonate in Lagos. Cassette tapes may have different cultural associations (or none at all for younger audiences).

- **She doesn't mention accessibility.** Color contrast, text sizing, screen reader compatibility — invisible in this workflow.

- **She doesn't discuss cost of AI image generation at scale.** 30-40 credits for this demo, but a real product with hundreds of dynamic assets would cost significantly more.

- **She doesn't cover design systems.** How do you maintain this aesthetic across 50+ screens? Where do you document the rules so a team (or future you) can extend it?

- **She doesn't mention user testing.** The entire process is designer-intuition-driven. "Would I download this?" is a sample size of one.

- **She assumes strong visual taste.** Her advice is essentially "know what you like." For someone without design training or visual confidence, this is the hardest part — and she doesn't teach it.

- **Hidden prerequisite: You must already know what you're building.** The feeling definition requires understanding your user deeply. She hand-waves this with "build for yourself."

---

## LENS 7: Opportunities

**What business/product/skill opportunities does this video reveal?**

- **"Brand-in-a-box" service**
  - Run this exact workflow for clients. Input: what their product does + who it's for. Output: feeling definition, mood board, color palette, visual anchor, logo, 3-5 screen mockups.
  - Price: $500-$2,000 per project. Time: 2-3 hours.
  - This is directly on the bespoke → pattern → automate path.

- **Curated mood board collections by vertical**
  - Pre-built mood boards for: health apps, fintech, education, retail, food delivery.
  - Sell as Figma templates or Cosmos boards.

- **"Feeling-first" prompt library for AI design**
  - Organized by feeling (calm, energetic, luxurious, playful) not by feature.
  - Each feeling comes with: reference images, color palettes, font suggestions, negative prompts.

- **Design quality auditing as a service**
  - "Send me your vibe-coded app, I'll tell you where it fails the feeling test and fix it."
  - Lower barrier than full brand design — just the evaluation and correction.

- **Weavy AI workflow templates**
  - Pre-built node chains: "mood board → palette → buttons → icons → screens"
  - Sell on Gumroad or as Weavy community templates.

- **AI-assisted brand system generator**
  - Build a product that automates steps 6-9: take a feeling + one reference image, output a complete brand kit (colors, buttons, icons, backgrounds).
  - This is the "automate after 3 clients confirm the pattern" endpoint.

- **Teach this workflow as a course module**
  - Specifically for non-designers building products with AI.
  - "3-hour workshop: Stop your AI app from looking like every other AI app."

---

## LENS 8: PUMA Application

**How does each principle specifically apply to the PUMA training app?**

### 1. "How should it make you feel?" → PUMA needs a feeling definition

**Current state:** We have a visual language (VISUAL-LANGUAGE.md) with colors, components, layout rules — but no FEELING definition. We jumped to "warm beige" and "charcoal cards" without asking: "How should a retail salesperson in Lekki feel when they open this app?"

**What to do:**
- Define the feeling: probably "I can do this" / "it's not school" / "it's quick and I look smart"
- NOT: corporate training, test anxiety, obligation
- This feeling should filter every design decision

### 2. Visual anchor for PUMA

**Current state:** The visual language is component-by-component (cards, grids, tips). There's no single visual anchor holding it together.

**What to do:**
- Find ONE image that IS the PUMA training experience. Maybe: a salesperson confidently helping a customer. Maybe: a phone screen that feels like a coach in your pocket. Maybe: something from PUMA's own brand language.
- Build everything from that anchor.

### 3. Negative prompts / "What it is NOT"

**Current state:** Not explicitly defined.

**What it should NOT be:**
- Not a boring LMS (Learning Management System)
- Not school — no red X marks, no "FAIL" screens
- Not corporate compliance training
- Not text-heavy (our visual-first approach already addresses this)
- Not slow/heavy (staff have limited data and patience)

### 4. Brand elements with PURPOSE

**Current state:** We use warm beige, charcoal scene cards, emojis — but the question is: does the PUMA brand identity (athletic, competitive, energetic) conflict with our warm/calm palette?

**What to consider:**
- PUMA's brand is black, red, athletic. Our palette is beige/green/soft.
- This could be intentional (the training feels different from the brand) or a gap (should feel more PUMA)
- The sales staff might respond better to something that feels like a game/sport rather than a journal

### 5. The building blocks approach maps to our modular pipeline

**Current state:** USER-FLOWS.md already has a layered approach (ASCII → JSON → Wireframe → Visual). This matches Sarah's colors → backgrounds → buttons → assembly exactly.

**What to do:**
- Stay on this path. Don't jump to expensive visual generation.
- Layer 1 (ASCII) = our user flows (DONE)
- Layer 2 (JSON) = database schema (NEXT)
- Layer 3 (wireframe) = Variant UI components (NEXT)
- Layer 4 (visual) = branded graphics, game illustrations (LAST)

### 6. Screen-specific applications

**Sales Home screen:**
- Needs a visual anchor element — not just cards with text
- "Your Next Mission" card should FEEL exciting, not like a to-do list
- Consider: mission card as a cassette-tape-style element? Or PUMA shoe card? Something tactile.

**Quiz screen:**
- Should feel like a game, not a test
- Consider: timer as a visual element (like the record button), not just numbers

**Game screens (Build Your Basket, Customer Says):**
- These are the biggest opportunity for visual differentiation
- Generate branded game assets using the Weavy approach: reference image → color palette → game elements

**Leaderboard:**
- This is where PUMA brand energy (competition, athletic) should come through
- Could use the "aging with use" concept — the more you complete, the more your profile evolves visually

### 7. Tool stack for PUMA design

Based on Sarah's workflow, for PUMA we should:
- Use Claude to define the feeling and generate prompts
- Use Flux/Weavy for generating branded visual assets (game illustrations, mission graphics)
- Use Figma or direct HTML (we're already doing Variant UI) for assembly
- Generate assets AFTER the wireframe layer, not before

### 8. The gap that matters most for Lagos

Sarah's process assumes the user cares about aesthetics. PUMA retail staff in Lagos care about:
- Speed (mobile data is expensive)
- Simplicity (many are not tech-native)
- Status/competition (leaderboard, team recognition)
- Practical value (cheat sheets, scripts)

The FEELING for PUMA is not "calm analog warmth." It's probably closer to:
- **"I'm getting better at my job"** — competence, not calm
- **"I'm winning"** — competitive, not meditative
- **"This is actually useful"** — practical, not aesthetic

This means our design energy should go to: clear progress indicators, satisfying completion states, competitive leaderboard visuals, and practical cheat sheet formatting — NOT texture and warmth.

---

## Crossover Insights

**Where do multiple lenses point to the same insight?**

### CROSSOVER 1: Feeling-first design is the missing layer in our PUMA process
- **Lens 1** (Principle): Define feeling before features
- **Lens 2** (Process): It's step 4, before any visual work
- **Lens 5** (Dependencies): Everything downstream depends on it
- **Lens 8** (PUMA): We jumped to components without defining the feeling
- **ACTION:** Define PUMA's target feeling in one sentence before any more design work. Proposed: "I'm getting sharper every day." This filters: no school vibes, no compliance feel, yes to game mechanics, yes to progress celebration.

### CROSSOVER 2: The human value is in SELECTION, not GENERATION
- **Lens 2** (Process): Every generation step is followed by a human evaluation step
- **Lens 4** (Human vs AI): 7 of 13 steps require human taste judgment
- **Lens 6** (Gaps): She assumes strong visual taste — doesn't teach how to develop it
- **Lens 7** (Opportunities): "Design quality auditing" as a service exploits this gap
- **ACTION:** For PUMA, our design decisions should be taste-checked by someone who understands Lagos retail culture. We're building for a context we partially understand. Show mockups to Timi/Adedolapo/Peter for "does this feel right?" feedback before building.

### CROSSOVER 3: One visual anchor > a hundred component rules
- **Lens 1** (Principle): Visual anchor over abstract guidelines
- **Lens 3** (Origination): "One image = one brand" (Dieter Rams → Apple precedent)
- **Lens 5** (Dependencies): Anchor is the node everything flows from
- **Lens 8** (PUMA): We have VISUAL-LANGUAGE.md (component rules) but no anchor image
- **ACTION:** Find or create ONE image that IS the PUMA training experience. Every color, card, button should trace back to it. This is more powerful than our current component library approach.

### CROSSOVER 4: The prototype-to-beauty pipeline is our existing modular pipeline
- **Lens 2** (Process): One-shot prototype → evaluate → redesign with feeling
- **Lens 5** (Dependencies): Prototype is off the critical path of design quality
- **Lens 8** (PUMA): Our ASCII → JSON → wireframe → visual pipeline matches exactly
- **ACTION:** Stay on our current pipeline. Don't shortcut to visuals. The ASCII/wireframe layers ARE the prototype phase. The visual layer is where Sarah's workflow plugs in.

### CROSSOVER 5: Context adaptation is critical — "Brooklyn cafe" does not equal "Lekki phone"
- **Lens 3** (Origination): All references are Western/US (Brooklyn, Dieter Rams, cassette tapes)
- **Lens 6** (Gaps): Assumes Western aesthetic sensibilities. No mention of accessibility or data constraints.
- **Lens 8** (PUMA): Lagos retail staff have different feeling targets (competence > calm, speed > beauty, practical > aesthetic)
- **CLAUDE.md Framework Adaptation Principle**: "Every framework needs assumptions tested against YOUR reality."
- **ACTION:** Run this through the adaptation filter. The PROCESS (feeling → anchor → assets) transfers. The REFERENCES (analog warmth, vintage, Brooklyn) do not. PUMA's references should come from: Nigerian pop culture, PUMA's own brand language, successful mobile experiences in Lagos (think M-Pesa, Paystack, Bet9ja — things staff actually use and enjoy).

---

## Sources (80/20)
- 60% — /tmp/greg-isenberg-9OnN4O4uapI.en.srt (full transcript)
- 25% — /Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/retail/puma/USER-FLOWS.md + VISUAL-LANGUAGE.md (PUMA context)
- 15% — CLAUDE.md (Framework Adaptation Principle, modular pipeline approach)
