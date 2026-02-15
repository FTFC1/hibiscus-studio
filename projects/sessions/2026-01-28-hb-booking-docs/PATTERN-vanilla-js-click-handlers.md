# Pattern: Vanilla JS Click Handlers That Actually Work

**Date:** 2026-01-29
**Context:** Building review portal for HB booking flows
**Browser:** Comet (Perplexity's Chromium-based browser)

## Problem

onclick handlers on div elements weren't firing. Button showed visual feedback (blue flash) but JavaScript didn't execute. Spent significant time debugging.

## Root Cause

Likely: `JSON.parse(localStorage.getItem(...))` at top level threw an error in Comet browser, breaking all subsequent JS silently.

Possibly also: OKLCH colors, complex nested data structures, or let/const in strict mode.

## Working Pattern

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Use simple colors - hex or rgb, not oklch */
    body { background: #1a1a1a; color: #eee; }

    /* Buttons for clickable elements, not divs */
    .card {
      background: #252525;
      border: 1px solid #333;
      cursor: pointer;
      text-align: left;      /* Reset button default */
      width: 100%;           /* Reset button default */
      font: inherit;         /* Reset button default */
      color: inherit;        /* Reset button default */
    }
  </style>
</head>
<body>

<!-- Use <button> not <div> for clickables -->
<button class="card" onclick="doThing('id')">
  <div class="title">Title</div>
</button>

<script>
// Use var, not let/const (maximum compatibility)
var state = null;

// Wrap localStorage in try/catch, don't call at top level
function loadState() {
  try {
    return JSON.parse(localStorage.getItem('key')) || {};
  } catch (e) {
    return {};
  }
}

// Simple direct functions, not complex state machines
function doThing(id) {
  document.getElementById('view1').classList.remove('active');
  document.getElementById('view2').classList.add('active');
}

// No init call needed if first view already has class="active"
</script>
</body>
</html>
```

## Checklist

- [ ] Use `<button>` for clickable elements, not `<div>`
- [ ] Use `var` not `let/const`
- [ ] Wrap localStorage in try/catch
- [ ] Don't call localStorage at top level
- [ ] Use simple colors (hex/rgb), not oklch
- [ ] Keep data structures flat
- [ ] Direct DOM manipulation, not complex render functions
- [ ] Test with minimal file first (one button, one click)

## Debugging Approach

1. Create minimal test: one button, one onclick that changes background color
2. If minimal works → bug is in complex code
3. If minimal fails → browser/environment issue
4. Binary search: add complexity until it breaks, find the line

## Files

- `test-click.html` - Minimal test (worked)
- `review-portal-verified.html` - Complex version (broken)
- `review-portal-v7.html` - Clean rebuild (working)
