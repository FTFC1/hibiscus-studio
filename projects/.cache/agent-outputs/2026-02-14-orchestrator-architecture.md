# Orchestrator Architecture — Periodic Table + Football Formation + Token Router

**Date:** 2026-02-14
**Context:** Design framework for meta-skill that coordinates compound requests across skills, agents, and models.

---

## 1. PERIODIC TABLE — Command Taxonomy

Organize all design/engineering skills into **6 phases**, like elements in a periodic table:

```
═══════════════════════════════════════════════════════════════════
  PERIODIC TABLE OF CLAUDE CODE SKILLS
═══════════════════════════════════════════════════════════════════

DIAGNOSTIC (D) — Understand what exists
─────────────────────────────────────────
D1: audit       — Assess current state (systems, files, rules)
D2: critique    — Evaluate output quality
D3: profile     — Analyze user behavior, patterns
D4: trace       — Follow execution path, wiring check

QUALITY (Q) — Make it correct/consistent
─────────────────────────────────────────
Q1: normalize   — Apply standards (formatting, naming)
Q2: polish      — Improve clarity, readability
Q3: optimize    — Improve performance, token efficiency
Q4: harden      — Add error handling, edge cases

ADAPTATION (A) — Make it fit context
─────────────────────────────────────────
A1: clarify     — Remove ambiguity
A2: simplify    — Reduce complexity
A3: adapt       — Adjust for audience/platform
A4: localize    — Cultural/linguistic adaptation

ENHANCEMENT (E) — Add layers
─────────────────────────────────────────
E1: animate     — Add motion, transitions
E2: colorize    — Add visual distinction
E3: delight     — Add personality, surprise
E4: extend      — Add new capabilities

INTENSITY (I) — Adjust volume
─────────────────────────────────────────
I1: quieter     — Reduce emphasis, formality
I2: bolder      — Increase emphasis, contrast
I3: faster      — Increase pace, urgency
I4: slower      — Add breathing room, reflection

META (M) — Coordinate other phases
─────────────────────────────────────────
M1: orchestrate — Route compound requests
M2: recursive   — Iterative improvement loop
M3: process     — Multi-pass extraction
M4: scaffold    — Generate new skills
```

---

## 2. FOOTBALL FORMATION — Pipeline Timing Model

**Metaphor:** "If you're on time, there's people you want at the very front and they're the most sensitive. They're feeding. The ones at the back come in delayed — they want the delayed information, but also because they can now take the outflows from the more recent ones."

```
                        ┌─────────────┐
                        │   REQUEST   │
                        │ (compound)  │
                        └──────┬──────┘
                               │
                    ┌──────────┴─────────┐
                    │    DECOMPOSER      │
                    │ (break into tasks) │
                    └──────┬──────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐   ┌──────────┐
    │ FORWARDS │    │ MIDFIELD │   │ DEFENSE  │
    │ (fast)   │    │ (medium) │   │ (slow)   │
    └────┬─────┘    └────┬─────┘   └────┬─────┘
         │               │              │
         │               │              │

FORWARDS (run first, feed midfield)
─────────────────────────────────────
• DIAGNOSTIC skills (audit, profile, trace)
• Lightweight extraction
• Context gathering
• Complexity classification
→ Output: Structured data for next layer

MIDFIELD (receive from forwards, process)
─────────────────────────────────────
• QUALITY skills (normalize, polish, optimize)
• ADAPTATION skills (clarify, simplify, adapt)
• Processing and transformation
→ Output: Refined artifacts for defense

DEFENSE (receive from midfield, finalize)
─────────────────────────────────────
• ENHANCEMENT skills (animate, colorize, delight)
• INTENSITY adjustments (bolder, quieter)
• Final passes before shipping
→ Output: Shippable artifacts

META (off the field — coordinates formation)
─────────────────────────────────────
• Orchestrator (this skill)
• Recursive loops
• Skill generation
→ Output: Execution plan + routed tasks
```

**Key insight:** Early-phase skills are "sensitive" — they need fresh input. Later-phase skills benefit from accumulated context (the "outflows" from earlier phases).

---

## 3. TOKEN ROUTER — Complexity → Model Mapping

```
                    ┌─────────────────┐
                    │   TASK INPUT    │
                    └────────┬────────┘
                             │
                    ┌────────▼─────────┐
                    │  CLASSIFY        │
                    │  COMPLEXITY      │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       ┌──────────┐   ┌──────────┐   ┌──────────┐
       │  HAIKU   │   │  SONNET  │   │  OPUS    │
       │ (cheap)  │   │ (medium) │   │ (premium)│
       └──────────┘   └──────────┘   └──────────┘
           │              │              │
     EXTRACTION      CODE/ADAPT     ARCHITECTURE
     FORMATTING      PROCESSING     COORDINATION
     VALIDATION      REFINEMENT     NOVEL PROBLEMS
```

### Complexity Classification

| Complexity | Model | Cost/1M Tokens | When to Use |
|------------|-------|----------------|-------------|
| **Level 1 — Extract** | Haiku | $0.25 | Structured extraction, formatting, simple validation |
| **Level 2 — Process** | Sonnet | $3.00 | Code generation, adaptation, transformation |
| **Level 3 — Design** | Opus | $15.00 | Architecture, novel problems, coordination |

### Classification Rules

**Level 1 (Haiku) — EXTRACT signals:**
- "Get all X from Y"
- "List files matching..."
- "Format this as..."
- "Check if X exists in Y"
- "Count items in..."
- No context dependency (stateless)
- Output schema is fixed

**Level 2 (Sonnet) — PROCESS signals:**
- "Fix the bug in..."
- "Adapt X for Y audience"
- "Normalize this code..."
- "Polish this message"
- Context-dependent (needs file/conversation context)
- Output requires judgment (not just pattern matching)

**Level 3 (Opus) — DESIGN signals:**
- "Design the architecture for..."
- "Coordinate these 5 tasks..."
- "Resolve conflict between X and Y"
- "Build a rubric for..."
- Novel problem (no template exists)
- Cross-domain reasoning
- Strategic decision-making

**Fallback rule:** If classification is ambiguous → start at Sonnet (safer middle ground).

---

## 4. META-SKILL DECOMPOSITION — Compound Request → Subtasks

```
USER REQUEST: "Audit PUMA app, fix UI issues, and polish for Nigerian users"
                              │
                    ┌─────────▼──────────┐
                    │   ORCHESTRATOR     │
                    │   (decompose)      │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  SUBTASK GRAPH     │
                    └─────────┬──────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
    ┌────────┐          ┌────────┐          ┌─────────┐
    │ TASK 1 │          │ TASK 2 │          │ TASK 3  │
    │ audit  │──────────│ fix    │──────────│ polish  │
    │ (D1)   │          │ (Q2)   │          │ (A3)    │
    └────┬───┘          └────┬───┘          └────┬────┘
         │                   │                   │
    Haiku 50K           Sonnet 150K          Sonnet 200K
    ────────────────────────────────────────────────────
                      TOTAL: 400K tokens
                      vs 800K if all Opus
                      = 50% token savings
```

### Decomposition Process

**Step 1: Parse compound request**
- Identify verbs (audit, fix, polish)
- Identify targets (PUMA app, UI issues, Nigerian users)
- Identify constraints (timeline, quality bar)

**Step 2: Map to phases**
- audit → DIAGNOSTIC (D1)
- fix → QUALITY (Q1/Q2)
- polish → ADAPTATION (A3)

**Step 3: Build dependency graph**
- Task 1 (audit) → blocks Task 2 (fix) — can't fix without knowing issues
- Task 2 (fix) → blocks Task 3 (polish) — don't polish broken UI
- Dependencies = sequential execution
- No dependencies = parallel execution

**Step 4: Classify complexity per task**
- Task 1: Extract issues from files → Haiku (Level 1)
- Task 2: Apply fixes to code → Sonnet (Level 2)
- Task 3: Adapt for audience → Sonnet (Level 2)

**Step 5: Generate execution plan**
```
EXECUTION PLAN
══════════════════════════════════════════════════
Phase 1 (FORWARDS)
  [1] audit PUMA app                   Haiku   50K
      → output: issues.json

Phase 2 (MIDFIELD) — waits for Phase 1
  [2] fix UI issues from issues.json   Sonnet  150K
      → output: fixed files + git diff

Phase 3 (DEFENSE) — waits for Phase 2
  [3] polish for Nigerian users        Sonnet  200K
      → output: localized files

TOTAL TOKENS: 400K (vs 800K all-Opus = 50% savings)
══════════════════════════════════════════════════
```

---

## 5. BUTLER CONCEPT — Context-Aware Skill Collection

**Metaphor:** "A butler who looks at the fundamentals and comes up with a collection based on your task."

When user invokes `/orchestrate`, the skill doesn't just execute — it first **curates the toolkit** based on task domain:

```
USER: "I need to launch a new product"
                │
                ▼
        ┌───────────────┐
        │   BUTLER      │
        │  (curate)     │
        └───────┬───────┘
                │
                ▼
    ┌───────────────────────┐
    │ DOMAIN: MARKETING     │
    │ RECOMMENDED SKILLS:   │
    │ • /ep (positioning)   │
    │ • /vv (visual proof)  │
    │ • /recursive (copy)   │
    │ • /dsg (outreach)     │
    └───────────────────────┘
```

### Domain → Skill Mapping

| Domain | Butler Recommendation |
|--------|---------------------|
| **Design** | audit, normalize, colorize, delight, animate |
| **Engineering** | audit, trace, harden, optimize, recursive (build mode) |
| **Marketing** | ep, vv, recursive (content), dsg |
| **Operations** | process-convo, pickup, orchestrate |
| **Research** | process-convo, recursive (verify), grok |
| **Economics** | small-bets, dsg (profiling), ep (pricing) |

**Adaptive curation:**
- Start of session: Butler sees HUD state, suggests skills for `doNext` items
- Mid-request: Butler detects domain shift, updates toolkit
- End of session: Butler suggests skills for tomorrow based on active tracks

---

## 6. ORCHESTRATE SKILL — Execution Flow

```
┌─────────────────────────────────────────────────┐
│            /orchestrate [request]               │
└─────────────────┬───────────────────────────────┘
                  │
       ┌──────────▼───────────┐
       │  1. UNDERSTAND       │ (read conversation + HUD + files)
       └──────────┬───────────┘
                  │
       ┌──────────▼───────────┐
       │  2. DECOMPOSE        │ (compound → subtasks)
       └──────────┬───────────┘
                  │
       ┌──────────▼───────────┐
       │  3. CLASSIFY         │ (map to phases + complexity)
       └──────────┬───────────┘
                  │
       ┌──────────▼───────────┐
       │  4. CURATE           │ (butler: recommend skills)
       └──────────┬───────────┘
                  │
       ┌──────────▼───────────┐
       │  5. PLAN             │ (dependencies + sequence)
       └──────────┬───────────┘
                  │
       ┌──────────▼───────────┐
       │  6. ROUTE            │ (assign model per task)
       └──────────┬───────────┘
                  │
       ┌──────────▼───────────┐
       │  7. EXECUTE          │ (run tasks, respect deps)
       └──────────┬───────────┘
                  │
       ┌──────────▼───────────┐
       │  8. REPORT           │ (results + token cost)
       └──────────────────────┘
```

### Step-by-Step

**1. UNDERSTAND**
- Read conversation context (what has user been working on?)
- Read HUD (`v4-data.js`) for active tracks, doNext
- Read session map for current streams
- Identify domain (design, engineering, marketing, etc.)

**2. DECOMPOSE**
- Parse request into verbs + targets
- Break compound request into atomic subtasks
- Example:
  - "Audit and fix PUMA app" → [audit PUMA app, fix issues found]
  - "Polish copy for Nigerian users" → [extract copy, localize, replace]

**3. CLASSIFY**
- Map each subtask to phase (DIAGNOSTIC, QUALITY, ADAPTATION, ENHANCEMENT, INTENSITY, META)
- Assign complexity level (1=Haiku, 2=Sonnet, 3=Opus)
- Flag unknowns (tasks that can't be classified without investigation)

**4. CURATE (Butler)**
- Based on domain, recommend relevant skills from user's `.claude/skills/`
- Show user: "For this task, I recommend: /ep, /recursive, /vv"
- User can override: "Skip /vv for now"

**5. PLAN**
- Build dependency graph (which tasks block others?)
- Determine execution order (sequential vs parallel)
- Estimate token cost per task
- Show plan to user for approval before executing

**6. ROUTE**
- Assign model to each task based on complexity
- Parallel tasks → batch to same agent if possible (reduce overhead)
- Sequential tasks → pass output from T1 as input to T2

**7. EXECUTE**
- Run tasks in planned order
- Pass outputs between dependent tasks
- Track actual token usage per task
- Handle errors gracefully (don't cascade failures)

**8. REPORT**
- Show results per task
- Compare estimated vs actual token cost
- Flag any tasks that failed or need user input
- Suggest next action

---

## 7. EXAMPLE WALKTHROUGH

**User request:** "Improve PUMA quiz flow and make it work for Nigerian users"

### Step 1: UNDERSTAND
```
Context gathered:
- Working on: PUMA training app (retail/puma/app/)
- Active tracks: UI polish, localization
- Domain: Engineering + Design
```

### Step 2: DECOMPOSE
```
Subtasks identified:
T1: Audit quiz flow for UX issues
T2: Extract all user-facing text
T3: Fix UX issues found in T1
T4: Localize text from T2 for Nigerian users
T5: Apply localized text to app
```

### Step 3: CLASSIFY
```
T1: audit quiz flow      → DIAGNOSTIC (D1)  → Haiku (extract issues)
T2: extract text         → DIAGNOSTIC (D1)  → Haiku (extract strings)
T3: fix UX issues        → QUALITY (Q2)     → Sonnet (code changes)
T4: localize text        → ADAPTATION (A3)  → Sonnet (cultural adaptation)
T5: apply localized text → QUALITY (Q1)     → Haiku (string replacement)
```

### Step 4: CURATE
```
Butler recommendation for "Engineering + Design":
✓ /recursive (build mode) — evaluate system quality
✓ /audit — assess current state
✓ /normalize — apply standards
```

### Step 5: PLAN
```
EXECUTION PLAN
══════════════════════════════════════════════════
Phase 1 (FORWARDS — parallel)
  [T1] audit quiz flow             Haiku    30K
  [T2] extract text                Haiku    20K
      → Combined output: issues.json + strings.json

Phase 2 (MIDFIELD — sequential)
  [T3] fix UX issues from T1       Sonnet  120K
      → waits for T1
  [T4] localize strings from T2    Sonnet   80K
      → waits for T2

Phase 3 (DEFENSE — sequential)
  [T5] apply localized text        Haiku    25K
      → waits for T3 + T4

TOTAL ESTIMATED: 275K tokens
TIME ESTIMATE: ~8 minutes
══════════════════════════════════════════════════
Proceed? (y/n)
```

### Step 6: ROUTE
```
Agent assignments:
- Agent A (Haiku): T1, T2 (parallel)
- Agent B (Sonnet): T3 (waits for A)
- Agent C (Sonnet): T4 (waits for A)
- Agent D (Haiku): T5 (waits for B + C)
```

### Step 7: EXECUTE
```
[T1] Running... ✓ (32K tokens, 1.2 min)
[T2] Running... ✓ (18K tokens, 0.8 min)
[T3] Running... ✓ (115K tokens, 3.1 min)
[T4] Running... ✓ (85K tokens, 2.4 min)
[T5] Running... ✓ (22K tokens, 0.6 min)
```

### Step 8: REPORT
```
═══════════════════════════════════════════════════
  ORCHESTRATION COMPLETE
═══════════════════════════════════════════════════

RESULTS:
✓ T1: Found 8 UX issues (saved to issues.json)
✓ T2: Extracted 42 strings (saved to strings.json)
✓ T3: Fixed 8 issues (12 files changed)
✓ T4: Localized 42 strings for Nigerian context
✓ T5: Applied localized strings (42 replacements)

TOKEN USAGE:
Estimated: 275K
Actual:    272K (1% under budget)

COST:
Haiku:  70K tokens @ $0.25/M = $0.02
Sonnet: 200K tokens @ $3.00/M = $0.60
Total: $0.62 (vs $4.08 all-Opus = 85% savings)

TIME: 8.1 minutes

FILES CHANGED: 12
- app/components/Quiz.tsx
- app/locales/en-NG.json
... (10 more)

NEXT ACTION:
Test the quiz flow in browser to verify fixes.

═══════════════════════════════════════════════════
```

---

## 8. INTEGRATION WITH EXISTING SKILLS

The orchestrator **coordinates** existing skills, doesn't replace them:

| Existing Skill | How Orchestrator Uses It |
|----------------|-------------------------|
| `/recursive` | Route to it for iterative improvement subtasks |
| `/process-convo` | Route to it for multi-pass extraction subtasks |
| `/pickup` | Call at end if user says "wrap up" during orchestration |
| `/ep` | Route to it for product/market validation subtasks |
| `/dsg` | Route to it for sales/outreach subtasks |
| `/vv` | Route to it for visual proof generation subtasks |

**Key principle:** Orchestrator is the **meta-layer**. It doesn't DO the work — it coordinates WHO does WHAT and WHEN.

---

## 9. TOKEN OPTIMIZATION TECHNIQUES

### Technique 1: Parallel Batching
Run independent tasks in same agent context to avoid re-loading shared context.

**Example:**
```
BAD (sequential, separate contexts):
  Agent 1: Read file X, extract issues (load 50K context)
  Agent 2: Read file X, extract strings (load 50K context again)
  → 100K context loading

GOOD (parallel, shared context):
  Agent 1: Read file X once, extract issues + strings
  → 50K context loading (50% saving)
```

### Technique 2: Model Stepping
Start cheap, escalate only if needed.

**Example:**
```
T1: Try Haiku first for code fix
    ↓
    If Haiku fails → fallback to Sonnet
    ↓
    If Sonnet fails → fallback to Opus

→ Pay for Opus only when necessary
```

### Technique 3: Output Compression
Pass minimal data between tasks, not full files.

**Example:**
```
BAD:
  T1 outputs: Full 500-line file
  T2 reads: Full 500-line file

GOOD:
  T1 outputs: 15-line issue summary
  T2 reads: 15-line summary + file path
  → 97% reduction in inter-task tokens
```

---

## 10. FAILURE MODES & RECOVERY

| Failure | Detection | Recovery |
|---------|-----------|----------|
| **Task classification wrong** | Low-complexity model fails task | Retry with higher-complexity model |
| **Dependency cycle** | Graph has loop | Flag to user, ask for priority |
| **Task times out** | Agent exceeds 10min | Save partial output, resume with fresh context |
| **Cascading failure** | T2 fails because T1 failed | Skip dependent tasks, report partial results |
| **User interrupts** | User says "stop" mid-execution | Save progress to pickup file, show what's done |

---

## 11. FUTURE EXTENSIONS

**Not in MVP, but designed to support:**

1. **Learning from execution** — Track which complexity classifications were correct, tune over time
2. **Cost-awareness tuning** — User sets budget (e.g., "max $1 on this task"), orchestrator optimizes within constraint
3. **Quality-speed tradeoff** — User says "fast mode" → bias toward Haiku. "Quality mode" → bias toward Opus.
4. **Cross-session optimization** — Remember which task types always need Sonnet, skip Haiku attempts
5. **Multi-user orchestration** — Coordinate tasks across team members (not just agents)

---

## 12. DESIGN PRINCIPLES (Summary)

1. **Taxonomic clarity** — Every skill maps to a phase in the periodic table
2. **Formation timing** — Early-phase skills feed later-phase skills (football metaphor)
3. **Token efficiency** — Route to cheapest adequate model
4. **Context-aware curation** — Butler recommends skills based on domain
5. **Dependency respect** — Never run dependent tasks in parallel
6. **Graceful degradation** — Partial results > no results
7. **User approval gates** — Show plan before executing expensive operations
8. **Cost transparency** — Always report actual vs estimated token usage

---

**End of Architecture Document**
