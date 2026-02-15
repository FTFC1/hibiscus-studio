# Neurodivergent Builder Regulation Guide

**Date:** 2026-02-14
**Purpose:** Practical self-management techniques for solo builders/founders with ADHD patterns
**Scope:** Adapted for terminal + voice notes + Claude Code workflow

---

## 1. Practical ADHD Management for Builders

### The Interest-Based Nervous System (Dr. William Dodson)

ADHD brains don't run on importance/consequences like neurotypical brains. They run on **INCUP**:

- **I**nterest — genuinely curious about the task
- **N**ovelty — something new or different
- **C**hallenge — difficult enough to engage
- **U**rgency — deadline pressure (real or manufactured)
- **P**assion — deep personal connection

**Why this matters for builders:** Building software hits Interest + Challenge + Novelty. Selling hits none of them by default. The fix isn't willpower — it's restructuring low-dopamine tasks to activate at least one INCUP lever.

### External Brain Systems

The ADHD brain has weaker working memory. Every thought, task, and context fragment needs to live OUTSIDE your head in a reliable capture system.

**What you already have that works:**
- Session packets (context preservation)
- /checkpoint and /pickup skills (fear-of-losing-context mitigation)
- HUD as canonical state (visual, scannable)
- Session maps with structured resume blocks (read/do/context)

**What to add:**
- **Scratch buffer in terminal** — before ANY context switch, spend 30 seconds writing a "mental bookmark" (what you were doing, where you were, what the next micro-step is). This is different from /checkpoint — it's faster, rougher, for interruptions not session ends.
- **Implementation:** A simple `note` alias that appends timestamped lines to `~/.scratch`:
  ```bash
  alias note='echo "$(date +%H:%M) — $@" >> ~/.scratch'
  ```
  Then `note "was halfway through DB schema, next step: add foreign keys to orders table"`

### Task Initiation: The 2-Minute Runway

Task paralysis (staring at the task, unable to start) comes from the prefrontal cortex failing to generate enough activation signal.

**Technique: Laughably Small First Step**
- Don't start "build the API." Start "open the file where the route will go."
- Don't start "write outreach emails." Start "open the contact list."
- The brain needs activation energy for the FIRST action. After that, momentum carries.

**For Claude Code specifically:**
- When facing a big task, tell Claude: "Just show me the file structure" or "Just read the current state." The act of seeing context often triggers engagement.

### Environment Design

- **Visible analog clock** — not phone, not digital. Position where you naturally look. Spatial time perception works better for ADHD than number-based.
- **Natural light exposure** — position desk near window. Light changes = unconscious time passage signal.
- **Noise control** — brown noise or lo-fi during deep work (constant, non-lyrical). Silence is actually harder for ADHD brains (no stimulation = mind wanders).

---

## 2. Dopamine Management for Selling/Outreach

### Why Selling Is Aversive (Neurochemistry)

Building = high dopamine (novelty, challenge, visible progress, flow state).
Selling = low dopamine (repetitive, rejection risk, delayed reward, no flow).

The gap isn't laziness. It's a neurotransmitter deficit for that specific activity.

### Five Dopamine Hacks for Low-Stimulation Tasks

**1. Temptation Bundling**
- Reserve a podcast/audiobook you love EXCLUSIVELY for outreach time.
- "I only listen to [X] while doing sales work."
- Creates anticipatory dopamine — you look forward to the bundle, not just the task.
- **Terminal adaptation:** Favorite music playlist that ONLY plays during selling blocks.

**2. Manufactured Urgency (Timer Racing)**
- Set 10-minute timer. Race to send 3 outreach messages before it rings.
- Urgency is an INCUP lever — it activates the ADHD brain even when interest is low.
- **Tool:** `timer 10m` command or phone timer visible on desk.

**3. Gamification / Novelty Injection**
- Track outreach as a "streak" — visual counter of consecutive days with at least 1 outreach action.
- Use a dice roll or random selector to pick which prospect to contact (removes decision paralysis).
- Change location for outreach (cafe, different room, standing desk position).
- **Reframe:** "I'm running a sales experiment this week. Hypothesis: MEP consultants respond 3x more than procurement. Let me test it."

**4. Body Doubling**
- Work alongside someone (even virtually) during outreach blocks.
- Options: Focusmate (free 3 sessions), Flow Club, Discord "ADHD Nerds" server, or just a friend on a video call.
- The presence of another person provides external regulation that compensates for internal regulation deficits.
- **Solo builder adaptation:** Even having a "Study With Me" YouTube video playing counts. The visual presence of someone else working triggers the accountability circuit.

**5. Micro-Commitments (The 1-Email Rule)**
- Don't plan "2 hours of outreach." Plan "send 1 email."
- After 1 email, the activation barrier drops. You'll often do 5-10 more.
- If you stop after 1, that's still 1 more than 0. Momentum > perfection.

### The Scientist Reframe (From Diann Wingert)

"Think like a scientist. I'm going to try this. It didn't work. That's interesting. Let me change the conditions. Try again."

- Sales = experiment with a 2-5% conversion rate (industry baseline)
- 100 outreach attempts = 2-5 clients (statistically normal)
- Each "no" = one data point closer to the next "yes"
- **Removes personal judgment from outcomes** — a failed experiment isn't a character flaw

### Selling-as-Building Reframe

Your existing strength is building systems. Apply it:
- Build a sales SYSTEM (templates, tracking, pipeline)
- The system-building part activates your builder dopamine
- Running the system is then just execution of something you built
- **This is exactly what DSG frameworks do** — they turn selling into a structured system, which is more interesting to an ADHD builder brain than "just go sell things"

---

## 3. Time Blindness Solutions for Deep Work

### Why Standard Timers Fail

Single-alarm timers get ignored during hyperfocus. They create anxiety. They assume linear time perception. ADHD brains experience time as either NOW or NOT NOW — no gradation.

### Checkpoint Alarms (Not End-Timers)

Instead of one alarm at the end:
- Set **gentle checkpoint alarms every 45-60 minutes** during deep work
- Alarm sound = soft/distinct (not jarring). Different from other notifications.
- When it rings: look at clock, drink water, note where you are, decide if you continue
- You're not stopping — you're briefly surfacing for air

**Implementation:**
```bash
# Repeating gentle reminder every 45 min
while true; do sleep 2700 && afplay /System/Library/Sounds/Tink.aiff; done &
```
Or use a phone timer app with repeating intervals (e.g., Repeat Timer, Interval Timer).

### Visual Time Representation

- **Time Timer** (physical device, ~$35) — red disc shrinks as time passes. No numbers. Spatial.
- **Hourglass timers** — sand flowing is non-intrusive, visible in peripheral vision
- **Smart lights** — Hue bulbs that shift from warm (morning) to cool (afternoon) to dim (evening) automatically. Unconscious time signal.

### Body-Based Time Anchors

Your body can be a clock when your brain isn't:
- **Hydration anchor:** Fill a 1L water bottle at session start. When it's empty = ~2 hours passed.
- **Hunger signal:** Don't eat at desk. Hunger = body saying it's been a while. Get up, eat, check time.
- **Bladder signal:** Natural timer. When you get up to use the bathroom = time awareness checkpoint.

### The "When, Not If" Rule

Don't ask "should I stop?" (answer is always "no" during hyperfocus).
Ask "what time will I stop?" Set the end time BEFORE entering deep work.
Write it on a sticky note. Put it on your monitor. The decision is already made.

### Prospective Time Calibration

ADHD brains are bad at estimating how long things take. Fix it with data:
- Start timing tasks (even roughly).
- After 2 weeks, you have a personal calibration database.
- "I think this will take 30 min" → timer says it took 90 min → now you know your multiplier is 3x.
- Apply multiplier to all future estimates.

---

## 4. Rejection Sensitivity in Sales Contexts

### Understanding RSD (Rejection Sensitivity Dysphoria)

- 70-99% of adults with ADHD experience RSD (estimates vary by study)
- It's neurological, not emotional weakness — the pain signal is genuinely amplified
- RSD causes: avoidance of situations where rejection is possible, people-pleasing to prevent rejection, perfectionism as a shield against criticism
- **For solo builders:** RSD is why you'd rather build another feature than send one sales email

### The Avoidance Pattern in ADHD Entrepreneurs

Diann Wingert identifies the pattern: "A lot of people spend a lot of money and time playing at online business without ever asking for the money." Signs:
- Perpetually refining lead magnets instead of selling
- Switching platforms/tools instead of reaching out
- Starting new projects at 50-90% completion of current one
- Building "one more thing" before launching

**Recognition is the first step.** If you catch yourself adding features instead of contacting prospects, that's RSD + novelty-seeking working together.

### Practical RSD Management for Sales

**1. Depersonalize the Outcome**
- "This offer isn't me. It's a package of value I built."
- Rejection of an offer ≠ rejection of you
- **Builder adaptation:** Think of your offer like a PR (pull request). Some get merged, some get closed. It's code review, not character review.

**2. Statistical Inoculation**
- Know your expected conversion rate BEFORE starting (2-5% cold, 15-25% warm)
- Track numbers, not feelings
- "I need 50 outreach actions to get 2-3 responses. I'm on attempt 12." = Progress, not failure.

**3. Batch and Buffer**
- Do ALL outreach in one block (don't spread rejection across the day)
- Schedule a rewarding activity immediately after outreach block (building, exercise, something you love)
- The buffer activity prevents RSD spiral from contaminating the rest of your day

**4. Warm Over Cold**
- RSD is strongest with strangers (cold outreach)
- NODE strategy (referral-based) is not just strategically better — it's neurologically better
- Each warm introduction = lower RSD activation
- **This validates your existing insight:** NODE > DIRECT isn't just pipeline math. It's brain chemistry.

**5. Exposure Ladder**
- Don't start with cold calls (maximum RSD trigger)
- Start with: replying to existing conversations → warm follow-ups → referral requests → new warm intros → eventually cold outreach
- Each level builds tolerance for the next

**6. Post-Rejection Protocol**
- After a rejection: 5 minutes of physical movement (walk, stretch, jumping jacks)
- Movement metabolizes the stress hormones that RSD generates
- Then write one line: "What did I learn?" (activates analytical brain, deactivates emotional brain)

---

## 5. Sleep Hygiene for Hyperfocused Builders

### The "Can't Stop" Pattern: Revenge Bedtime Procrastination

Two distinct patterns, often combined:
1. **Productive can't-stop:** Deep in a build, making progress, fear of losing the thread
2. **Revenge procrastination:** Day was full of obligation (Mikano, admin). Night = "my time." Refuse to give it up to sleep.

Both are driven by ADHD: time blindness (don't notice it's 2am) + dopamine (the activity is more stimulating than sleep) + transition difficulty (can't shift from "doing" to "resting").

### The ADHD-Sleep-Burnout Triangle

Sleep deprivation → worse ADHD symptoms → harder to regulate → stay up later → worse sleep → cycle intensifies.

Research: people with ADHD benefit from the upper end of sleep range (8-9 hours, not 7). Sleep deprivation hits harder because executive function is already running on deficit.

### Shutdown Ritual (Cal Newport, ADHD-Adapted)

**The Concept:** A defined sequence of actions that signals "work is done." The ritual replaces the willpower decision of "should I stop?" with a process that, once started, carries you through to stopping.

**ADHD-Adapted Version (15 minutes, starting at a FIXED time):**

1. **Alarm rings** (set for 1 hour before target bedtime — e.g., 10:30pm if bed at 11:30pm)
2. **Write the mental bookmark** — what you were doing, where you stopped, what's next. This is the critical step that addresses "everything is lost if I stop." You're externalizing the context.
   - For Claude Code: `/pickup` or quick note in session map
   - The system you built (checkpoints, session maps, pickup) exists PRECISELY for this moment
3. **Review tomorrow** — glance at calendar, note first task. "Tomorrow starts with X."
4. **Close all work tabs/terminal** — physical act of closing = transition signal
5. **Say the phrase** — "Shutdown complete" or whatever feels natural. Sounds silly. Works because it's a ritualistic cue that triggers the brain to switch modes.
6. **Non-screen wind-down** — 30-60 min of: reading (physical book), stretching, conversation, podcast (non-work). NO screens if possible. Blue light suppresses melatonin for 2+ hours.

**Why this works for your specific fear:**
- The bookmark step (2) directly addresses "everything is lost if I stop"
- You've PROVEN the systems work (checkpoints, pickups, session maps)
- The ritual leverages that proof: "I have a pickup note. The context is saved. The system catches what I drop."

### Hard Boundaries

- **Set a "latest possible" time** — not when you WANT to stop, but the absolute wall. Example: "No matter what, terminal closes at 11:30pm."
- **Move your phone charger to the bedroom** — if phone charges on desk, you'll keep using it
- **Laptop stays outside the bedroom** — if the machine is in the room, the pull is too strong

### Sleep Quality Tactics

- **Consistent wake time** (more important than consistent bedtime for ADHD)
- **Morning sunlight** — 10 min within first hour of waking. Resets circadian rhythm.
- **No caffeine after 2pm** — ADHD stimulant use makes this especially important
- **Cool room** (65-68F / 18-20C) — sleep onset requires core temperature drop
- **Magnesium glycinate** before bed — evidence supports it for sleep quality, commonly recommended by ADHD clinicians

---

## 6. Movement/Exercise as Cognitive Regulation

### The Evidence

- Exercise increases dopamine, norepinephrine, AND serotonin — the exact neurotransmitters that are dysregulated in ADHD
- Even 3-5 minutes of movement improves executive function for the subsequent hour
- 20 minutes of moderate aerobic exercise improves reading comprehension and arithmetic in both ADHD and neurotypical brains
- Effects peak 2-10 minutes post-exercise and last 1-3 hours
- **Cognitively engaging exercise** (sport, martial arts, dance, climbing) > simple aerobic (treadmill) for working memory improvement

### Optimal Timing

**Morning (highest priority):**
- Sets dopamine baseline for the entire day
- Michigan State study: ADHD individuals who exercised in the morning showed improved attention AND mood for the whole day
- Even 15-20 minutes is enough
- **Builder adaptation:** Exercise BEFORE opening terminal. Once the terminal is open, hyperfocus takes over and exercise won't happen.

**Mid-day (second priority):**
- Reset after morning deep work block
- 15-20 minute walk = working memory refresh
- Good timing for post-outreach buffer (sell in morning → exercise → build in afternoon)

**Evening (be careful):**
- Can help with transition from work to rest
- But vigorous exercise <2 hours before bed disrupts sleep
- Gentle movement (walk, yoga, stretching) is fine in evening

### Type Recommendations for Solo Builders

**Tier 1 (best cognitive ROI):**
- **Morning walk/jog** — 20-30 min, moderate intensity. Outdoors > treadmill (sunlight + novel environment). This alone covers 80% of the benefit.

**Tier 2 (excellent, if you enjoy them):**
- **Strength training** — moderate intensity, 30-45 min. Improves executive function without excessive fatigue.
- **Vinyasa yoga** — combines movement + breathing + cognitive engagement. Good evening option.
- **Climbing/martial arts** — highest cognitive engagement. Forces presence (can't think about code while climbing).

**Tier 3 (minimum viable movement):**
- **5-minute movement snacks** between deep work blocks — jumping jacks, push-ups, walk around the block
- **Standing desk alternation** — sit 45 min, stand 15 min
- **Walk while on voice calls** — temptation bundling (movement + call)

### The "Gym When I Want" Connection

Your North Star includes "gym when I want." Exercise isn't a nice-to-have — it's a force multiplier for everything else:
- Better sleep → better executive function → better building AND selling
- Post-exercise dopamine → easier to start low-dopamine tasks
- Regular movement → reduced RSD intensity (exercise metabolizes stress hormones)
- Morning routine anchors the day → reduces time blindness

---

## 7. ADHD Builders/Founders Who've Shared Their Systems

### Hacker News: "My ADHD Founder Toolbox" Thread
- HN thread with developers sharing specific tools and workflows
- Common patterns: reducing tool count (just Calendar + email), heavy use of voice memos, physical notebooks over apps
- Source: https://news.ycombinator.com/item?id=33633512

### HN: "ADHD Productivity Report 2024"
- Developer documenting their year-long productivity experiment with ADHD
- Honest about what didn't work (most things) and what did
- Source: https://news.ycombinator.com/item?id=42089146

### HN: "How I Run a Company with ADHD"
- Founder discussing systems for managing a company with ADHD
- Source: https://news.ycombinator.com/item?id=19895310

### HN: "Ask HN: Developers with ADHD/ADD, how do you cope?"
- Large thread with developer-specific coping strategies
- Source: https://news.ycombinator.com/item?id=19989627

### Diann Wingert — ADHD Entrepreneur Coach
- 1,300+ coaching sessions with ADHD entrepreneurs
- Podcast: "The Driven Woman Entrepreneur" (now "ADHD-ish")
- Specializes in the selling-avoidance pattern in ADHD founders
- Source: https://www.diannwingertcoaching.com/adhd-ish-podcast

### DOSE App — RSD Meter
- Built by an ADHD founder after discovering 99% of ADHD clients experience RSD
- First cognitive operating system for ADHD with an "RSD Meter" — real-time intervention when emotions spike
- Uses: Daily Organization, Strategy, and Execution
- Source: https://gritdaily.com/dose-beyond-bottleshop-bold-brands-go-fund-yourself/

### ADDitude Magazine — "Secrets of the ADHD Brain"
- Dr. William Dodson's work on the interest-based nervous system
- The INCUP/PINCH frameworks for understanding ADHD motivation
- Source: https://www.additudemag.com/secrets-of-the-adhd-brain/

### Reddit Communities
- **r/ADHD** — general, huge community
- **r/ADHDprogrammers** — developer-specific strategies
- **r/getdisciplined** — systems-oriented, many neurodivergent users
- **r/ADHD_Programmers** — coding-specific coping strategies

---

## Proposed Daily Regulation Routine

### Adapted for: Terminal + Voice Notes + Claude Code Workflow

```
TIME        ACTION                          WHY (INCUP LEVER)
────────────────────────────────────────────────────────────────────────
MORNING
────────────────────────────────────────────────────────────────────────
Wake        Consistent time (alarm, same     Circadian rhythm anchor.
            daily, even weekends)            ADHD sleep requires
                                             consistency > duration.

+0-10m      Sunlight (go outside or open     Cortisol + melatonin
            curtains, 10 min)                timing reset. Wakes up
                                             the prefrontal cortex.

+10-30m     Movement (20 min walk/jog        Sets dopamine baseline
            outdoors OR 15 min bodyweight     for the day. Do BEFORE
            at home)                          opening terminal. Once
                                             terminal opens, it won't
                                             happen.

+30-40m     Eat. No screens at table.        Fuel + natural break
                                             before deep work.

+40-50m     Open terminal. Read session      Orient before building.
            map or /briefing. Set today's    External brain = less
            end time on sticky note.         anxiety.
            Start checkpoint timer
            (45-min repeating alarm).

────────────────────────────────────────────────────────────────────────
DEEP WORK BLOCK 1 (Building) — ~2.5-3 hours
────────────────────────────────────────────────────────────────────────
            Brown noise or lo-fi playing.    Interest + Challenge +
            Checkpoint alarm every 45 min:   Novelty (building).
            drink water, note where you      Timer prevents time
            are, glance at clock, continue   blindness tunnel.
            or transition.

────────────────────────────────────────────────────────────────────────
MID-DAY TRANSITION
────────────────────────────────────────────────────────────────────────
            Stop building. Physical          Movement = dopamine
            movement: 15-20 min walk.        reset. Transitions ADHD
            Eat lunch away from desk.        from hyperfocus back to
            No "just one more thing."        baseline. Prepares brain
                                             for different task type.

────────────────────────────────────────────────────────────────────────
SELL/OUTREACH BLOCK — 45-60 min max
────────────────────────────────────────────────────────────────────────
            Temptation bundle: favorite      Urgency (timer) +
            podcast/music playing.           Novelty (bundled
            10-min timer sprints.            content). Batch all
            1-email minimum rule.            rejection into one
            After block: rewarding           block. Buffer activity
            activity (build something,       prevents RSD spiral.
            exercise, fun task).

────────────────────────────────────────────────────────────────────────
DEEP WORK BLOCK 2 (Building) — ~2-2.5 hours
────────────────────────────────────────────────────────────────────────
            Same checkpoint timer pattern.   Post-outreach, return to
            This is the reward for           high-dopamine work.
            completing the sell block.        Brain gets what it wants
                                             AFTER doing what it needs.

────────────────────────────────────────────────────────────────────────
EVENING
────────────────────────────────────────────────────────────────────────
Hard stop   Alarm at fixed time (e.g.,       External trigger >
alarm       10:00pm). Non-negotiable.        internal decision.
            Begin shutdown ritual.

+0-5m       Write mental bookmark:           Addresses "everything is
            what you were doing, where        lost" fear. Context is
            you stopped, next micro-step.     SAVED. System catches it.
            /pickup or quick session map
            update.

+5-10m      Review tomorrow. Glance at       Reduces morning
            calendar. Note first task.        activation barrier.

+10-15m     Close terminal. Close browser.   Physical act = transition
            Say "Shutdown complete."          signal. Phrase = ritual
                                             cue.

+15-75m     Wind-down: physical book,        No screens. Blue light
            stretching, gentle yoga,          suppresses melatonin 2+
            conversation, podcast             hrs. Give brain time to
            (non-work). NO SCREENS.           downshift.

Bed         Consistent time. Cool room.      Upper sleep range
            Phone charges in bedroom          (8-9 hrs) for ADHD.
            (not desk). Laptop stays          Remove temptation.
            outside bedroom.
```

### Key Principles Behind This Routine

1. **Movement BEFORE terminal** — once hyperfocus starts, movement won't happen
2. **Building sandwiches selling** — high-dopamine work before and after low-dopamine work
3. **Outreach is SHORT and bundled** — 45-60 min max, with dopamine hacks active
4. **External timers everywhere** — ADHD brains can't self-regulate time
5. **Shutdown ritual addresses the core fear** — "everything is lost" is countered by writing the mental bookmark
6. **Consistent wake time > consistent bedtime** — anchor the start, the end follows
7. **Physical environment does the work** — laptop out of bedroom, phone charger moved, visible clock, no screens after shutdown

### Weekend/Off-Day Variation

- Keep wake time within 1 hour of weekday
- Keep morning exercise
- Let building time be unstructured (this is the "revenge time" that's healthy)
- Still do shutdown ritual at night (habit > willpower)

---

## Adaptation Notes for Terminal + Voice + Claude Code Workflow

### What Already Works (Keep Doing)

| System | How It Helps Regulation |
|--------|------------------------|
| /checkpoint + /pickup | Directly addresses "everything is lost" fear |
| Session maps (read/do/context) | External working memory for context switches |
| HUD as canonical state | Visual, scannable, reduces cognitive load |
| Two-terminal model | Interruptions don't kill current stream |
| /capture (fast dump) | Externalizes thoughts before they evaporate |
| Voice-first workflow | Lower activation barrier than typing |

### What to Add

| Addition | Implementation | Cost |
|----------|---------------|------|
| Scratch buffer alias | `alias note='...'` in .zshrc | 2 min setup |
| 45-min checkpoint timer | Background process or phone app | 1 min/day |
| Visible analog clock | Purchase, place near monitor | $15 |
| Time Timer (visual) | Purchase, use for sell blocks | $35 |
| Shutdown ritual checklist | Sticky note on monitor | 0 |
| Morning exercise BEFORE terminal | Discipline / alarm placement | Free |
| "Shutdown complete" phrase | Just start saying it | Free |
| Brown noise during deep work | mynoise.net or YouTube | Free |

### Integration with Existing Skills

- **Morning:** `/briefing` → orient → checkpoint timer starts → build
- **Sell block:** Timer + temptation bundle → batch outreach → reward
- **Shutdown:** `/pickup` → review tomorrow → close terminal → phrase → wind down
- **Interrupts:** Two-terminal model → second terminal for quick tasks → back to main stream

---

## Sources (Grouped)

### ADHD & Entrepreneurship
- [ADDitude: Secrets of the ADHD Brain](https://www.additudemag.com/secrets-of-the-adhd-brain/)
- [Neurodivergent Insights: Interest-Based Nervous System](https://neurodivergentinsights.com/interest-based-nervous-system/)
- [InFlow: ADHD Motivation — The INCUP Method](https://www.getinflow.io/post/adhd-motivation-incup)
- [ScienceDirect: Dopamine and Entrepreneurship](https://www.sciencedirect.com/science/article/pii/S2352673424000131)

### Time Blindness
- [Super Productivity: ADHD Time Blindness Strategies](https://super-productivity.com/blog/adhd-time-blindness-strategies/)
- [ADDA: ADHD Time Blindness](https://add.org/adhd-time-blindness/)
- [CHADD: Beating Time Blindness](https://chadd.org/wp-content/uploads/2018/06/ATTN_10_15_BeatingTimeBlindness.pdf)
- [Scott Shapiro MD: Seven Solutions for Time Blindness](https://www.scottshapiromd.com/even-top-performers-struggle-with-time-blindness-7-strategies-for-top-productivity/)

### Rejection Sensitivity & Sales
- [Erika Tebbens: ADHD & Rejection Sensitivity in Sales w/ Diann Wingert](https://erikatebbens.com/podcast/103-adhd-rejection-sensitivity-in-sales)
- [ADDitude: Rejection Sensitive Dysphoria and ADHD](https://www.additudemag.com/rejection-sensitive-dysphoria-and-adhd/)
- [ADDA: Rejection Sensitivity](https://add.org/rejection-sensitivity/)
- [LA Concierge Psychologist: Managing RSD](https://laconciergepsychologist.com/blog/rejection-sensitive-dysphoria-adhd/)

### Dopamine & Task Management
- [ADD Resource Center: 5 Dopamine Hacks](https://www.addrc.org/why-you-cant-start-boring-tasks-and-5-dopamine-hacks-that-work/)
- [ADDitude: Dopamenu](https://www.additudemag.com/dopamenu-dopamine-menu-adhd-brain/)
- [InFlow: The RAN Method](https://www.getinflow.io/post/how-to-self-motivate-adhd-the-ran-method)

### Sleep & Shutdown
- [ADDitude: Revenge Bedtime Procrastination](https://www.additudemag.com/revenge-bedtime-procrastination-sleep-problems-adhd/)
- [ADHDSPECIALIST: The ADHD-Sleep-Burnout Triangle](https://adhdspecialist.com/post/the-adhd-sleep-burnout-triangle-understanding-the-cycle)
- [Sleep Foundation: ADHD and Sleep](https://www.sleepfoundation.org/mental-health/adhd-and-sleep)
- [Cal Newport: Shutdown Ritual](https://calnewport.com/drastically-reduce-stress-with-a-work-shutdown-ritual/)
- [I'm Busy Being Awesome: ADHD Shutdown Routine](https://imbusybeingawesome.com/shutdown-routine/)

### Exercise & Cognitive Function
- [Frontiers in Psychology: Aerobic Exercise and Executive Function in ADHD](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1376354/full)
- [PMC: Exercise Approaches for ADHD in Adults](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9952527/)
- [eClinicalMedicine/Lancet: Physical Exercise and ADHD — Umbrella Review](https://www.thelancet.com/journals/eclinm/article/PIIS2589-5370(23)00314-0/fulltext)
- [Michelle Porter Fit: Morning Exercise for ADHD](https://www.michelleporterfit.com/blog/rise-and-shine-how-morning-exercise-can-improve-focus-for-the-adhd-brain)
- [Envision ADHD: Best Time to Work Out](https://www.envisionadhd.com/single-post/the-best-time-of-day-to-work-out-for-maximum-adhd-benefits)

### Body Doubling & Focus
- [Flow Club: Body Doubling](https://www.flow.club/what-is-body-doubling)
- [Deepwrk: Pomodoro + Body Doubling](https://www.deepwrk.io/blog/pomodoro-technique-adhd)

### Context Switching & Interruption Anxiety
- [Focus Bear: ADHD Context Switching Strategies](https://www.focusbear.io/blog-post/adhd-context-switching-strategies-for-smoother-transitions)
- [Healthline: Task Switching and ADHD](https://www.healthline.com/health/adhd/task-switching-adhd)
- [InFlow: Task Switching at Work with ADHD](https://www.getinflow.io/post/task-switching-at-work-adhd)

### ADHD Developer/Founder Communities
- [HN: My ADHD Founder Toolbox](https://news.ycombinator.com/item?id=33633512)
- [HN: ADHD Productivity Report 2024](https://news.ycombinator.com/item?id=42089146)
- [HN: How I Run a Company with ADHD](https://news.ycombinator.com/item?id=19895310)
- [HN: Developers with ADHD, How Do You Cope?](https://news.ycombinator.com/item?id=19989627)
- [Diann Wingert: ADHD Entrepreneur Coaching](https://www.diannwingertcoaching.com/adhd-ish-podcast)
