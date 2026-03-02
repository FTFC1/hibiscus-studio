// @ts-check
// UX Audit — Stock Tool
// These tests probe real user pain points, not happy-path flows.
// Each test names the UX problem it exposes.

const { test, expect } = require('@playwright/test');

const PAGE = '/index.html';

async function injectAndRender(page) {
  await page.goto(PAGE, { waitUntil: 'networkidle' });
  await page.waitForSelector('.drop-zone');
  await page.evaluate(() => {
    const ser = [];
    const brands = [
      { brand: 'CHANGAN', models: [
        { model: 'CS75 PLUS', trims: ['LUXURY', 'COMFORT'], colours: ['WHITE', 'BLACK', 'GREY'] },
        { model: 'CS55 PLUS', trims: ['LUXURY'], colours: ['WHITE', 'RED'] },
        { model: 'UNI-K', trims: ['FLAGSHIP'], colours: ['BLUE', 'BLACK'] },
      ]},
      { brand: 'MAXUS', models: [
        { model: 'T60', trims: ['4WD', '2WD'], colours: ['WHITE', 'SILVER'] },
        { model: 'G50', trims: ['COMFORT'], colours: ['BLACK'] },
      ]},
      { brand: 'GEELY', models: [
        { model: 'COOLRAY', trims: ['SPORT'], colours: ['RED', 'WHITE'] },
      ]},
    ];
    brands.forEach(b => {
      b.models.forEach(m => {
        m.trims.forEach(t => {
          m.colours.forEach(c => {
            for (let i = 0; i < 3; i++) {
              ser.push({ wh: 'MAIN', brand: b.brand, model: m.model, colour: c, trim: t, type: '', desc: '', vin: `VIN${Math.random().toString(36).slice(2,8)}`, ic: `IC${i}` });
            }
          });
        });
      });
    });
    S.ser = ser;
    S.git = [];
    S.resv = { reserved: [], preOrder: [] };
    S.desp = [];
    S.sales = [];
  });
  await page.evaluate(() => {
    compile();
    rDash();
    rStock();
    rExec();
    rResv();
    rCharts();
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('disabled'));
  });
}

test.describe('UX Audit — Real User Pain Points', () => {

  test.beforeEach(async ({ page }) => {
    await injectAndRender(page);
  });

  // ─── BUG 1 ────────────────────────────────────────────────────────────────
  // Qty min-filter survives "Clear All" — invisible ghost filter
  // User sets qty>=10, clicks Clear All, still sees fewer results but no
  // indication of why. Active filter bar shows nothing. Data looks wrong.
  test('BUG: Qty header filter survives Clear All', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');

    // Set a qty min filter via the header input
    const qtyInput = page.locator('.tabulator-header-filter input[type="number"]');
    await qtyInput.fill('999'); // absurdly high — should return 0 rows
    await page.waitForTimeout(300);

    // Verify filter is active (0 rows visible)
    const filteredCount = await page.evaluate(() => stockTable.getData('active').length);
    expect(filteredCount).toBe(0); // confirms filter is working

    // Now click Clear All via a chip (select CHANGAN then clear)
    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(200);
    await page.evaluate(() => stockClearAll());
    await page.waitForTimeout(300);

    // After Clear All, the active filter bar should be gone
    await expect(page.locator('#activeFilters')).not.toHaveClass(/on/);

    // EXPECTED: All data visible (total count restored)
    // ACTUAL (BUG): Qty filter still active, still 0 rows — but filter bar hidden
    const countAfterClear = await page.evaluate(() => stockTable.getData('active').length);
    const totalCount = await page.evaluate(() => stockTable.getData().length);

    // This exposes the bug: count after clear does NOT equal total
    // because clearFilter() doesn't touch headerFilter
    if (countAfterClear !== totalCount) {
      // BUG CONFIRMED: ghost qty filter persists after Clear All
      console.log(`BUG CONFIRMED: ${countAfterClear} of ${totalCount} rows visible after Clear All`);
      expect(countAfterClear).toBe(totalCount); // will fail — this IS the bug
    }
  });

  // ─── BUG 2 ────────────────────────────────────────────────────────────────
  // Qty filter never appears in active filter bar
  // User has qty>=5 active. Clicks a brand chip. Sees fewer results than expected.
  // Active filter bar only shows "Brand: CHANGAN". No hint qty filter is also on.
  test('BUG: Active filter bar is blind to qty header filter', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');

    // Set qty filter
    const qtyInput = page.locator('.tabulator-header-filter input[type="number"]');
    await qtyInput.fill('5');
    await page.waitForTimeout(300);

    // Select a brand chip
    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(300);

    // Active filter bar is visible
    const filterBar = page.locator('#activeFilters');
    await expect(filterBar).toHaveClass(/on/);

    // It shows brand chip — but does it mention qty filter at all?
    const filterText = await filterBar.textContent();
    const mentionsQty = filterText.toLowerCase().includes('qty') ||
                        filterText.includes('5') ||
                        filterText.toLowerCase().includes('min');

    // BUG: qty filter is invisible — user doesn't know it's on
    expect(mentionsQty).toBe(true); // will fail — qty is never shown
  });

  // ─── BUG 3 ────────────────────────────────────────────────────────────────
  // Colour — a PRIMARY differentiator — requires 3 chip clicks to access
  // Stock controller's #1 question: "Do we have WHITE?" But colour chips
  // are locked behind brand → model → trim selection first.
  // This tests how many interactions are needed to filter by colour.
  test('UX: Colour requires 3 prerequisite selections', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');

    // Colour chip row should NOT be visible on landing
    await expect(page.locator('#colourChipRow')).not.toHaveClass(/on/);

    // Brand selected — still no colour
    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(200);
    await expect(page.locator('#colourChipRow')).not.toHaveClass(/on/);

    // Model selected — still no colour
    const firstModel = await page.evaluate(() =>
      [...new Set(stockTable.getData('active').map(r => r.model))].sort()[0]
    );
    await page.evaluate((m) => stockChipClick('model', m), firstModel);
    await page.waitForTimeout(200);
    await expect(page.locator('#colourChipRow')).not.toHaveClass(/on/);

    // Only after TRIM is selected does colour appear
    const firstTrim = await page.evaluate(() =>
      [...new Set(stockTable.getData('active').map(r => r.trim))].sort()[0]
    );
    await page.evaluate((t) => stockChipClick('trim', t), firstTrim);
    await page.waitForTimeout(200);
    await expect(page.locator('#colourChipRow')).toHaveClass(/on/);

    // Result: 3 prerequisite clicks to access a primary filter.
    // This documents the depth — whether it's acceptable is a design decision.
    console.log('NOTE: Colour chips require 3 prerequisite clicks (brand → model → trim)');
  });

  // ─── BUG 4 ────────────────────────────────────────────────────────────────
  // Chip spans have no keyboard accessibility
  // Stock controllers use Tab to navigate. Chips are <span> elements.
  // No tabindex, no role="button", can't Tab to them or press Enter.
  test('UX: Brand chips are not keyboard navigable', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');

    // Check chip accessibility attributes
    const chipAttrs = await page.evaluate(() => {
      const chips = [...document.querySelectorAll('#brandChips .bchip')];
      return chips.map(c => ({
        tag: c.tagName,
        tabindex: c.getAttribute('tabindex'),
        role: c.getAttribute('role'),
        ariaPressed: c.getAttribute('aria-pressed'),
      }));
    });

    const firstChip = chipAttrs[0];
    console.log('Chip element:', firstChip);

    // EXPECTED: tabindex="0", role="button"
    // ACTUAL: no tabindex, no role — not keyboard accessible
    const isKeyboardAccessible = firstChip.tabindex !== null || firstChip.role === 'button';
    expect(isKeyboardAccessible).toBe(true); // will fail — chips are <span> with no tabindex
  });

  // ─── BUG 5 ────────────────────────────────────────────────────────────────
  // No result count feedback when filtering
  // After filtering to CHANGAN CS75 PLUS, user sees the rows but has no idea
  // "18 of 156 vehicles". Qty bottomCalc shows sum of qty, not count of rows.
  test('UX: No row count shown when filter is active', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');

    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(300);

    // Check if ANY element on the page tells the user how many results are showing
    const filterBarText = await page.locator('#activeFilters').textContent();
    const stockTabText = await page.locator('#vStock').textContent();

    const totalRows = await page.evaluate(() => stockTable.getData().length);
    const filteredRows = await page.evaluate(() => stockTable.getData('active').length);

    // Look for patterns like "18 of 156" or "18 results" or "showing X"
    const hasCountFeedback =
      stockTabText.includes(`${filteredRows} of ${totalRows}`) ||
      stockTabText.includes(`${filteredRows} result`) ||
      stockTabText.match(/showing \d+/i) ||
      filterBarText.includes(`${filteredRows}`);

    console.log(`Filter active: ${filteredRows} of ${totalRows} rows. Count shown to user: ${hasCountFeedback}`);

    // BUG: user has no idea how many rows they're looking at
    expect(hasCountFeedback).toBe(true); // will fail — no count is shown
  });

  // ─── BUG 6 ────────────────────────────────────────────────────────────────
  // Model chips sort alphabetically, not by stock quantity
  // User clicks CHANGAN. Model chips show: ALSVIN, CS35 PLUS, CS55 PLUS, CS75 PLUS
  // alphabetically. But CS75 PLUS has 18 units — it's the most important.
  // User has to visually scan to find the highest-volume model.
  test('UX: Model chips sorted alphabetically, not by volume', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');

    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(300);

    // Get model chips in DOM order (left to right)
    const modelChipsInOrder = await page.evaluate(() => {
      const chips = [...document.querySelectorAll('#modelChips .bchip')];
      return chips.map(c => ({
        name: c.childNodes[0].textContent.trim(),
        count: parseInt(c.querySelector('.cnt').textContent),
      }));
    });

    console.log('Model chips in DOM order:', modelChipsInOrder);

    // Check if sorted by count descending
    const isSortedByCount = modelChipsInOrder.every((chip, i) => {
      if (i === 0) return true;
      return modelChipsInOrder[i - 1].count >= chip.count;
    });

    // BUG: chips are sorted alphabetically — highest volume model may not be first
    expect(isSortedByCount).toBe(true); // will fail — sorted alphabetically
  });

  // ─── GOOD PATTERN: verify these work correctly ─────────────────────────────

  // Clicking active brand chip deselects it (toggle)
  test('GOOD: Clicking active brand chip deselects and collapses', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');

    // Select CHANGAN
    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(200);
    const modelRowVisible = await page.locator('#modelChipRow').getAttribute('class');
    expect(modelRowVisible).toContain('on');

    // Click CHANGAN again — should deselect
    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(200);

    // Should return to "All" state
    await expect(page.locator('#brandChips .bchip', { hasText: 'All' })).toHaveClass(/active/);
    await expect(page.locator('#modelChipRow')).not.toHaveClass(/on/);

    // All data visible
    const count = await page.evaluate(() => stockTable.getData('active').length);
    const total = await page.evaluate(() => stockTable.getData().length);
    expect(count).toBe(total);
  });

  // Switching brand clears model/trim/colour cascade
  test('GOOD: Brand switch cascades correctly (no stale child chips)', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');

    // Select CHANGAN → CS75 PLUS
    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(200);
    await page.evaluate(() => stockChipClick('model', 'CS75 PLUS'));
    await page.waitForTimeout(200);
    await expect(page.locator('#trimChipRow')).toHaveClass(/on/);

    // Now switch to MAXUS
    await page.evaluate(() => stockChipClick('brand', 'MAXUS'));
    await page.waitForTimeout(300);

    // CHANGAN's model should be gone — MAXUS models should appear
    const modelChips = await page.locator('#modelChips .bchip').allTextContents();
    const hasChanganModel = modelChips.some(t => t.includes('CS75 PLUS'));
    const hasMaxusModel = modelChips.some(t => t.includes('T60') || t.includes('G50'));

    expect(hasChanganModel).toBe(false); // CHANGAN models should be cleared
    expect(hasMaxusModel).toBe(true);    // MAXUS models should appear
    // Trim row should be hidden (model reset)
    await expect(page.locator('#trimChipRow')).not.toHaveClass(/on/);
  });

});
