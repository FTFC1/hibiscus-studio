# Shaping 0-1 with Claude Code — Ryan Singer (@rjs)
**Date:** Feb 7, 2026 | **Source:** x.com/rjs/article/2020184079350563263
**Likes:** 853 | **Retweets:** 47

---

## Summary

Full walkthrough of shaping + building a TUI timezone app from scratch using Claude Code's shaping skills.

## The 9-Step Process

### 1. First Prompt
- Open Claude Code in blank directory
- Describe vision (TUI timezone table)
- Key: invoke shaping skill to "capture requirements and tease apart key parts of solution A"
- Creates `shaping.md` with problem/outcome, requirements (R), and initial shape (A)

### 2. Checking the Fit
- `show me R x A` — fit check between requirements and shape
- Shows what's solved/unsolved, known/unknown, constraints vs solutions
- Can rotate: `A x R` to see all of A against all R
- Commentary surfaces next steps

### 3. Spiking First Unknown (tz API)
- `Please spike A2` — dig into timezone API question
- Writes `spike-a2.md` as separate file (findings saved for reference)
- Discovered: don't need internet for tz data (Python zoneinfo is local)
- **Suggests revising R!** "Should we reword R1?" — like live shaping session

### 4. Spiking Local LLM
- Spike doc structure: Context → Questions table → Detailed findings
- Q format: never yes/no, always gaining objective info for decision
- "For V1, LLM-only is simpler" — appreciates simplicity

### 5. Adding Missing Detail with Sketch
- After approach seems good, spell out A in more detail
- Noticed UI affordance for date window was missing (packed into "TUI shell" = smell)
- **Dropped TLDraw sketch into terminal** as image
- Added requirement for changing time window + add/remove locales

### 6. Breadboarding
- Combines UI + code affordances into one circuit diagram
- "5 UI affordances, 11 code affordances, 3 data stores across 3 places"
- Uses `beam` CLI tool to project Mermaid → TLDraw (hot reloading)
- Good primitive for slicing into vertical parts

### 7. Slicing Vertically
- Each affordance has ID, wiring defined as relationship table
- Slice = subset of affordances with wiring intact
- Each slice includes **demo statement** (what to demo = vertical)
- Two natural slices for this app

### 8. Building First Slice
- "Make implementation plan for first slice, include how you will test"
- Claude Code enters plan mode → builds → works on first run

### 9. Building Second Slice
- Same prompt for second slice
- First run crashed → gave instruction to self-test
- "Run the app yourself and interact to verify it works. Cover all cases."
- Worked!

## Key Patterns

| Pattern | Description |
|---------|-------------|
| **R vs A separation** | Requirements (problem) vs Shape (solution). Can have A, B, C solutions against same R. |
| **Fit check** | R x A or A x R — see what's solved/unsolved |
| **Spike** | Never yes/no. Gain concrete info, then decide. Separate document. |
| **⚠️ Unknowns** | Flagged in shape = sketchy/fuzzy parts. Must spike before building. |
| **Breadboard** | UI + Code affordances as circuit diagram. Wiring = relationships. |
| **Vertical slice** | Subset with demo statement. Frontend + backend together. |
| **Demo statement** | What you can show working. Makes slice "vertical" not just technical. |
| **Shaping skill** | github.com/rjs/shaping-skills — /shaping + /breadboarding |
| **beam tool** | CLI that projects Mermaid from .md → TLDraw with hot reload |

## Key Quotes

- "Whether it's on the whiteboard, on paper, or here in the terminal. I want to see what's solved and unsolved, what's known and unknown, what's a constraint vs what's a potential solution."
- "The #1 rule of spiking is to never make it a yes-or-no question."
- "Going through this process means I have a view of how it works. I understand the system."
- "The back-and-forth we did have felt meaningful."

## Resources
- Project repo: github.com/rjs/tick
- Shaping skills: github.com/rjs/shaping-skills
- Human version: YouTube "End-to-End with Shape Up: A Real-World Case Study"
