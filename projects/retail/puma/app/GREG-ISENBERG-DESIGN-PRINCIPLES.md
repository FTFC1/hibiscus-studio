---
source: "Stop Shipping AI Slop. Design with Weavy AI, Claude etc."
channel: Greg Isenberg (Late Checkout)
url: https://www.youtube.com/watch?v=9OnN4O4uapI
speakers: Greg Isenberg (host), Sariah (designer, sold last company to Snap)
extracted: 2026-02-14
relevance: PUMA training app design, avoiding generic AI-generated UI
tags: [design, ai-slop, vibe-coding, brand-guidelines, visual-generation, UX]
---

# Greg Isenberg — Design Principles Extraction

**Video:** "Stop Shipping AI Slop. Design with Weavy AI, Claude etc."
**Speakers:** Greg Isenberg + Sariah (designer who sold her last company to Snap)
**Demo app built live:** "Cassette" — a voice journaling app

---

## 1. What Is "AI Slop" (The Core Problem)

- **AI slop** = when every vibe-coded app looks the same because builders outsource ALL design thinking to AI
- The default output of "build me X" prompts produces generic, interchangeable UI
- Everyone uses the same tools with the same defaults = same output
- "AI slop" is the design equivalent of SEO spam — technically functional, emotionally empty
- The problem isn't the AI tools — it's that people only specify WHAT the app does, not HOW it should feel
- Default Tailwind + shadcn + generic layout = the hallmark of AI slop
- Users can immediately tell when an app was vibe-coded with zero design intention

---

## 2. The "What vs How" Framework (Core Fix)

- **Outsource "what it does" to AI** — functionality, CRUD, logic, API calls are solved problems
- **Keep "how it should do it" in your brain** — the emotional intent, the feel, the vibe is YOUR job
- The "how" is what makes products distinctive and lovable
- AI is extremely good at implementing functionality; it's bad at having taste
- Your taste, opinions, and emotional intent are the moat against AI slop
- **Rule:** If you can't describe how the app should FEEL in one sentence, you're not ready to build

---

## 3. Emotion-First Design (Start Here)

- **Start by defining how the app should make someone FEEL** — before wireframes, before code, before anything
- Work backward from the desired emotional state to design decisions
- For "Cassette" they chose: warm, analog, personal, intimate, nostalgic, NOT techy
- The emotional intent drives every subsequent decision: colors, textures, interactions, copy
- Ask: "What does this feel like in real life?" — not "What features does it need?"
- **Analog metaphors** ground digital products in real-world emotional associations
  - Cassette tape = nostalgia, personal expression, lo-fi warmth
  - Record button = intentional capture (not passive recording)
  - Tape aging = personal history, unique-to-you patina
- The emotion should be specific enough to exclude things — "warm" means NO cold blues, NO sharp edges, NO clinical whites

---

## 4. Brand Guidelines as Prompts

- Brand guidelines are essentially the **prompt you bring into visual generation tools**
- Use Claude (or any LLM) as a brainstorming partner to develop brand guidelines
- Brand guidelines should specify:
  - Color palette (with emotional rationale)
  - Typography direction (serif = warm, sans-serif = modern, etc.)
  - Texture/material language (paper, tape, fabric, glass, etc.)
  - What the brand is NOT (exclusions are as important as inclusions)
  - Emotional keywords (3-5 words that capture the feel)
- These guidelines become the system prompt for all visual asset generation
- Without brand guidelines, every AI tool defaults to the same generic output
- **The more specific your brand guidelines, the more distinctive your output**

---

## 5. The Visual Anchor Pattern

- **Find ONE image you love** and derive the entire brand/product visual system from it
- This is what Jony Ive / Dieter Rams / Apple have always done — find a reference, extrapolate
- The anchor image doesn't have to be from your industry — it could be a photograph, a painting, a texture
- From one anchor image you can extract: color palette, texture language, mood, contrast ratios, spacing feel
- This is dramatically more effective than describing aesthetics in words
- Product design consistency is EASIER than character consistency in AI — products don't have faces
- **Practical:** Save the anchor image, reference it in every generation prompt

---

## 6. The Building Blocks Approach (Asset Generation)

- Don't try to generate full screens at once — build incrementally
- **Progression:** colors → backgrounds/textures → buttons/UI elements → icons → images/illustrations → full compositions
- Each block inherits from the brand guidelines and anchor image
- Generate multiple variations of each block, curate the best
- Small assets (buttons, icons) are easier to get right than full layouts
- Composite the blocks in Figma (or similar) to create full screens
- This approach gives you consistent parts that work together
- **Why:** AI is better at generating small, focused assets than complex multi-element compositions

---

## 7. The Full Design Workflow (Step by Step)

### Phase 1: One-Shot Prototype
- Use Google AI Studio (or similar) to generate a basic functional prototype
- Prompt: just describe what the app does, basic features
- This gives you a working skeleton — but it will look like AI slop
- Purpose: validate the idea works functionally before investing in design

### Phase 2: Define Emotional Intent
- Step away from code entirely
- Define: How should this app FEEL? What real-world object/experience does it evoke?
- Write 3-5 emotional keywords
- Identify what the app is NOT (exclusions)

### Phase 3: Brainstorm Brand Guidelines (Claude)
- Use Claude as brainstorming partner
- Feed it: emotional keywords + target audience + app concept
- Ask for: color palettes, typography suggestions, texture language, brand personality
- Iterate in conversation until guidelines feel right
- Save as structured document

### Phase 4: Mood Board (Cosmos / Pinterest)
- Build a visual mood board using Cosmos (or Pinterest, Are.na, etc.)
- Cosmos recommended over Pinterest — better for AI workflow, saves images locally
- Collect 10-20 images that capture the feel
- Include: textures, colors, typography examples, real-world objects, UI references
- This visual collection becomes reference material for generation

### Phase 5: Visual Asset Generation (Weavy AI)
- Feed brand guidelines + mood board images into Weavy AI
- Weavy AI is a node-based tool — visual workflow, not chat-based
- Use Flux 2 Pro model for general image generation
- Use Ideogram model for logos and text-in-images
- Generate assets in building-block order (colors → textures → elements → compositions)
- Multiple variations per asset — curate the best

### Phase 6: Composite in Figma
- Bring all generated assets into Figma
- Compose full screen designs — this is your "north star"
- The Figma file is what you reference when building the real app
- It doesn't need to be pixel-perfect — it's a guiding reference
- Key screens: home, main interaction, settings, empty state

### Phase 7: Build with Design Reference
- Return to your coding tool (Claude Code, Cursor, Google AI Studio)
- Feed the Figma designs as reference images alongside your prompts
- The coded output now matches your design intent, not generic defaults
- Result: dramatically different from Phase 1 generic output

---

## 8. Tools Mentioned (What Each Does)

### AI Coding Tools
- **Claude Code** — Sariah's #1 tool. Best for existing codebases, complex logic, iterating on code
- **Cursor with Gemini** — Sariah's #2 tool. Best for UI work, shaders, animations, visual code
- **Google AI Studio** — Best for one-shot prototypes. Paste a prompt, get a working app instantly. Good starting point but produces generic output without design input

### AI Design/Visual Tools
- **Weavy AI (Weevi)** — Node-based visual generation tool. Connects multiple AI models in workflows. Can generate images, textures, UI elements. Uses Flux, Ideogram, and other models. Visual node editor (not chat-based). Key for generating brand-consistent assets at scale
- **Flux 2 Pro** — Image generation model (accessed through Weavy AI or directly). Good for realistic textures, backgrounds, product imagery. Better than DALL-E for photorealistic output
- **Ideogram** — Specialized in text-in-images and logos. Use when you need readable text in generated images (most models fail at this)
- **Cosmos** — Mood board tool (alternative to Pinterest). Better for collecting and organizing visual references. Images save locally for easy use in other tools

### Design Tools
- **Figma** — Compositing tool for final designs. Bring AI-generated assets together into complete screen designs. The "north star" reference for development

### Other
- **Perplexity** — Research tool mentioned for quick lookups during design process
- **ChatGPT** — Mentioned as alternative for brainstorming (but Claude preferred)

---

## 9. Design Patterns and UX Principles

### Analog-Digital Bridge
- Use real-world analog metaphors to make digital products feel tangible
- Cassette tape metaphor → warmth, nostalgia, personal expression
- Physical affordances (press to record, rewind, fast-forward) create intuitive interactions
- Aged/worn textures suggest history and personal connection

### Progressive Visual Aging
- App UI that changes/ages with use (like a real object developing patina)
- Gives users emotional attachment — "this is MY app, it's unique to me"
- Creates a reason to return — to see how it's evolved
- Example: cassette tape that gets more worn-looking over time

### Emotional Micro-Interactions
- Small animations and feedback that reinforce the emotional theme
- Record button that pulses like a heartbeat
- Tape reels that spin during playback
- Satisfying tactile feedback sounds

### Constraint-Driven Design
- Limiting features forces better design decisions
- "Cassette" intentionally limited to voice-only (no text, no photos)
- Constraints create clarity for users — they know exactly what to do
- AI tools can implement anything — your job is to decide what NOT to include

### Texture Over Flatness
- AI slop tends toward flat, clean, sterile UI
- Adding texture (paper grain, tape noise, fabric weave) creates distinctiveness
- Texture doesn't mean busy — it means the surfaces have character
- One well-chosen texture can transform a generic layout into something memorable

---

## 10. Business and Product Thinking

- **Distinctiveness = competitive advantage** — in a world of AI slop, designed products stand out
- **Taste is the moat** — AI commoditizes functionality; taste differentiates
- **Speed + taste = winning combination** — use AI for speed, inject taste for differentiation
- **The design process adds maybe 2-4 hours** — tiny investment for massive quality difference
- **Users FEEL the difference** even if they can't articulate it — designed vs generic
- **First impressions are visual** — users decide in seconds whether an app feels premium or generic
- Products that feel crafted get: more word-of-mouth, higher retention, premium pricing tolerance
- **The bar is rising** — as more people vibe-code, generic apps proliferate, making designed apps MORE valuable (not less)

---

## 11. Common Mistakes to Avoid

- **Mistake:** Specifying only features in your AI prompt → get generic output
- **Mistake:** Using AI-generated UI without a design reference → AI slop
- **Mistake:** Trying to generate full screens in one shot → inconsistent elements
- **Mistake:** Skipping mood boards → no visual anchor → generic defaults
- **Mistake:** Not having brand guidelines → every screen looks different
- **Mistake:** Using the same tool for everything → miss specialized strengths
- **Mistake:** Assuming "good enough" UI is enough → users have increasing expectations
- **Mistake:** Adding more features instead of refining the feel → feature bloat, emotional vacancy
- **Mistake:** Copying another app's aesthetic instead of finding your own anchor → derivative, not distinctive

---

## 12. Sariah's Personal Workflow Preferences

- Starts with Google AI Studio for quick one-shot validation
- Moves to Claude for ALL brainstorming and brand guideline work
- Uses Cosmos (not Pinterest) for mood boards
- Weavy AI for all visual asset generation (node-based workflow)
- Figma for compositing final designs
- Claude Code for building/iterating on code (#1 coding tool)
- Cursor with Gemini for UI-specific work, shaders, animations (#2 coding tool)
- Prefers to work in this order: prototype → feel → brand → mood → generate → composite → build
- Spends more time on brand guidelines than most people expect — it's the leverage point
- "The brand guidelines ARE the prompt" — the more specific, the better the output

---

## 13. Key Quotes

- "AI slop is when you outsource ALL thinking to AI — including the thinking that should be yours"
- "Everyone's building the same app because they're all giving the same prompt"
- "The how is what makes it yours"
- "Start with how it should make someone feel, not what it should do"
- "Brand guidelines are just prompts for visual tools"
- "Find one image you love and build the whole brand from it"
- "Product design consistency is way easier than character consistency"
- "The extra 2-4 hours of design work is what separates AI slop from something people actually love"
- "Taste is the last moat"
- "The bar for design is going up, not down — more generic apps means designed ones stand out more"

---

## PUMA Training App — Application Notes

### Direct Relevance
- The PUMA training app risks looking like every other corporate training app if we rely on default AI output
- Defining the emotional intent (how should a PUMA retail employee FEEL using this?) is step one
- PUMA has strong brand guidelines already — these should be the "prompt" for all visual generation
- The analog metaphor could be applied: training feels like mentorship from a senior colleague, not a corporate LMS
- Progressive visual aging could track training progress — the app evolves as the employee grows
- Constraint-driven design applies: focus on what makes PUMA training unique, not feature parity with generic LMS

### Suggested Emotional Keywords for PUMA App
- Energetic (PUMA brand DNA)
- Personal (1:1 mentorship feel, not broadcast)
- Progressive (visible growth, not static)
- Street-smart (practical retail knowledge, not academic)
- Confident (building competence builds confidence)

### Tool Application
- Use Claude for brand guideline adaptation (PUMA brand → training app variant)
- Use the building blocks approach for UI: PUMA colors → textures → components → screens
- Create a Figma north star before coding
- Reference PUMA campaign imagery as visual anchors
