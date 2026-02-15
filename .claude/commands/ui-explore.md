# /ui-explore — Rapid UI Brainstorming

Generate standalone HTML with multiple UI treatment options. Opens in Comet for quick visual review and iteration.

## Usage

```
/ui-explore [component or concept]
```

## Examples

```
/ui-explore button hover states
/ui-explore pricing card layouts
/ui-explore notification toast
/ui-explore onboarding flow cards
```

## Flow

1. **I create 4-6 treatments** in a single HTML file
2. **Opens in Comet** automatically
3. **You pick favorites** ("like A and D")
4. **I iterate** with combined/refined options
5. **Final pick → implement** in codebase

## What Gets Generated

- Side-by-side treatment cards
- Treatment names + badges (RECOMMENDED, COMPACT, etc.)
- Notes/pros for each option
- Dark mode base styling (adjustable)
- Responsive grid layout

## Iteration

```
Round 1: 6 options → "like B, F"
Round 2: 4 variations of B+F → "V3 but with X"
Round 3: Final refinements → "perfect, implement it"
```

## File Output

Saves to current project or scratchpad:
- `{project}/ui-explore-{name}.html`
- `{project}/ui-explore-{name}-round2.html`

## Style Customization

Default dark mode. Override with:
- `/ui-explore cards - light mode`
- `/ui-explore buttons - blue accent #3b82f6`
- `/ui-explore forms - match [project] styles`
