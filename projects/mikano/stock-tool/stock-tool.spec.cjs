// @ts-check
const { test, expect } = require('@playwright/test');

const PAGE = '/index.html';

// Helper: inject synthetic data directly into the page's S object,
// bypassing file upload (faster, deterministic). Mirrors pSer/pGIT/pResv column layouts.
async function injectTestData(page) {
  await page.evaluate(() => {
    // Synthetic Serial No Details (S.ser) — 3 brands, multiple models
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
        { model: 'D90', trims: ['LUXURY'], colours: ['WHITE', 'GREY'] },
      ]},
      { brand: 'GEELY', models: [
        { model: 'COOLRAY', trims: ['SPORT'], colours: ['RED', 'WHITE'] },
        { model: 'AZKARRA', trims: ['FLAGSHIP'], colours: ['BLACK'] },
      ]},
    ];
    brands.forEach(b => {
      b.models.forEach(m => {
        m.trims.forEach(t => {
          m.colours.forEach(c => {
            // Push 2-5 units per combo for some volume
            const n = 2 + Math.floor(Math.random() * 4);
            for (let i = 0; i < n; i++) {
              ser.push({ wh: 'MAIN', brand: b.brand, model: m.model, colour: c, trim: t, type: '', desc: '', vin: `VIN${Math.random().toString(36).slice(2,8)}`, ic: `IC${Math.random().toString(36).slice(2,6)}` });
            }
          });
        });
      });
    });
    S.ser = ser;

    // Synthetic Goods in Transit (S.git) — some items in transit for CHANGAN and MAXUS
    S.git = [
      { ic: 'GIT001', name: 'CHANGAN CS75 PLUS LUXURY WHITE', tq: 10, rq: 3 },
      { ic: 'GIT002', name: 'CHANGAN UNI-K FLAGSHIP BLUE', tq: 5, rq: 5 },
      { ic: 'GIT003', name: 'MAXUS T60 4WD WHITE', tq: 8, rq: 2 },
      { ic: 'GIT004', name: 'GEELY COOLRAY SPORT RED', tq: 4, rq: 4 },
    ];

    // Synthetic Reservations
    S.resv = {
      reserved: [
        { client: 'ACME LTD', branch: 'LAGOS', date: new Date('2025-12-01'), days: 87, brand: 'CHANGAN', model: 'CS75 PLUS', colour: 'WHITE', units: 2, status: 'RESERVED', sp: 'JOHN', rem: '' },
        { client: 'XYZ MOTORS', branch: 'ABUJA', date: new Date('2025-10-15'), days: 134, brand: 'MAXUS', model: 'T60', colour: 'WHITE', units: 1, status: 'RESERVED', sp: 'SIAM', rem: '' },
      ],
      preOrder: [
        { client: 'BETA CORP', branch: 'PH', date: new Date('2025-11-20'), days: 98, brand: 'GEELY', model: 'COOLRAY', colour: 'RED', units: 3, status: 'PRE-ORDER', sp: 'ADE', rem: '' },
      ]
    };

    S.desp = [];
    S.sales = [];
  });
}

async function compileAndRender(page) {
  await page.evaluate(() => {
    compile();
    rDash();
    rStock();
    rExec();
    rResv();
    rCharts();
    // Enable nav
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('disabled'));
    document.getElementById('st').textContent = 'Test data loaded';
  });
}

test.describe('Stock Report Tool — QA', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE, { waitUntil: 'networkidle' });
    await page.waitForSelector('.drop-zone');
    await injectTestData(page);
    await compileAndRender(page);
  });

  test('Dashboard renders brand cards with stock counts', async ({ page }) => {
    await page.click('.nav-btn[data-v="dashboard"]');
    const cards = page.locator('.bg .bc');
    await expect(cards).not.toHaveCount(0);
    // CHANGAN should exist
    const changan = page.locator('.bc .bn', { hasText: 'CHANGAN' });
    await expect(changan).toBeVisible();
  });

  test('Metric filter toggles and carries to drill-down', async ({ page }) => {
    await page.click('.nav-btn[data-v="dashboard"]');

    // Click "In Transit" metric
    const transitMetric = page.locator('.tc.click', { hasText: 'In Transit' });
    await transitMetric.click();
    await expect(transitMetric).toHaveClass(/sel/);

    // Click a brand card that has transit items (CHANGAN has 7 in transit)
    const changanCard = page.locator('.bc', { hasText: 'CHANGAN' });
    await changanCard.click();

    // Verify we're in drill view
    await expect(page.locator('#vDrill')).toHaveClass(/active/);
    // The "In Transit" stat card should have .sel class
    const drillTransit = page.locator('.ds.click', { hasText: 'In Transit' });
    await expect(drillTransit).toHaveClass(/sel/);
  });

  test('Drill-down shows Goods in Transit section with transit data', async ({ page }) => {
    await page.click('.nav-btn[data-v="dashboard"]');

    // Click CHANGAN (has transit items)
    await page.locator('.bc', { hasText: 'CHANGAN' }).click();
    await expect(page.locator('#vDrill')).toHaveClass(/active/);

    // Should have "Goods in Transit" section
    const transitHeader = page.locator('.sl2', { hasText: 'Goods in Transit' });
    await expect(transitHeader).toBeVisible();

    // Should show transit items in the table
    const transitTable = transitHeader.locator('~ table.t');
    // GIT001 should be visible (has 7 in transit)
    await expect(page.locator('#drC', { hasText: 'GIT001' })).toBeVisible();
    // GIT002 has 0 in transit (tq=5, rq=5) — should NOT appear
    await expect(page.locator('#drC').locator('text=GIT002')).toHaveCount(0);
  });

  test('Drill-down does NOT show transit section when brand has no transit items', async ({ page }) => {
    await page.click('.nav-btn[data-v="dashboard"]');

    // GEELY has 0 net transit (tq=4, rq=4 for all items)
    const geelyCard = page.locator('.bc', { hasText: 'GEELY' });
    // Only continue if GEELY card exists (depends on data having stock)
    if (await geelyCard.count() > 0) {
      await geelyCard.click();
      await expect(page.locator('#vDrill')).toHaveClass(/active/);
      // Should NOT have Goods in Transit section
      const transitHeader = page.locator('.sl2', { hasText: 'Goods in Transit' });
      await expect(transitHeader).toHaveCount(0);
    }
  });

  test('Drill-down search filters stock rows and hides empty subtotals', async ({ page }) => {
    await page.click('.nav-btn[data-v="dashboard"]');
    await page.locator('.bc', { hasText: 'CHANGAN' }).click();
    await expect(page.locator('#vDrill')).toHaveClass(/active/);

    // Search for a specific model
    await page.fill('#drillSearch', 'UNI-K');
    await page.waitForTimeout(200);

    // UNI-K rows should be visible
    const visibleDataRows = page.locator('#drC table.t tbody tr:not(.tr):not(.model-hdr)').filter({ hasNotText: '' });
    const unikRows = page.locator('#drC table.t tbody tr', { hasText: 'UNI-K' });
    expect(await unikRows.count()).toBeGreaterThan(0);

    // CS75 model-hdr should be hidden (no matching data rows)
    const cs75Hdr = page.locator('#drC tr.model-hdr', { hasText: 'CS75' });
    if (await cs75Hdr.count() > 0) {
      await expect(cs75Hdr).toBeHidden();
    }
  });

  test('Fuzzy search matches across punctuation (UniK → UNI-K)', async ({ page }) => {
    await page.click('.nav-btn[data-v="dashboard"]');
    await page.locator('.bc', { hasText: 'CHANGAN' }).click();

    // First verify fuzzyMatch function itself works
    const matchResult = await page.evaluate(() => fuzzyMatch('UniK', 'UNI-K FLAGSHIP BLUE'));
    expect(matchResult).toBe(true);

    // Search without hyphen
    await page.fill('#drillSearch', 'UniK');
    await page.waitForTimeout(500);

    // Count visible data rows under the UNI-K model header
    const visibleRows = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('#drC table.t tbody tr')];
      let inUnikGroup = false, count = 0;
      for (const r of rows) {
        if (r.classList.contains('model-hdr')) {
          inUnikGroup = r.textContent.includes('UNI-K');
          continue;
        }
        if (r.classList.contains('tr')) { inUnikGroup = false; continue; }
        if (inUnikGroup && r.style.display !== 'none') count++;
      }
      return count;
    });
    expect(visibleRows).toBeGreaterThan(0);
  });

  test('Stock Summary Tabulator table renders with collapsed groups', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');
    // Groups should exist (brand headers)
    const groups = page.locator('.tabulator-group');
    expect(await groups.count()).toBeGreaterThan(0);
    // CHANGAN group header should be visible
    await expect(page.locator('.tabulator-group', { hasText: 'CHANGAN' })).toBeVisible();
  });

  test('Chip cascade filters correctly (brand → model)', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');

    // Click CHANGAN brand chip
    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(300);

    // Filtered data should only be CHANGAN
    const result = await page.evaluate(() => {
      const activeData = stockTable.getData('active');
      const models = [...new Set(activeData.map(r => r.model))];
      const brands = [...new Set(activeData.map(r => r.brand))];
      return { models, brands, count: activeData.length };
    });
    expect(result.brands).toEqual(['CHANGAN']);
    expect(result.count).toBeGreaterThan(0);
    expect(result.models).not.toContain('COOLRAY');
    expect(result.models).not.toContain('T60');

    // Model chips should be visible
    const modelRow = page.locator('#modelChipRow');
    await expect(modelRow).toHaveClass(/on/);
    const modelChips = page.locator('#modelChips .bchip');
    expect(await modelChips.count()).toBeGreaterThan(0);
  });

  test('Charts render with SVG content', async ({ page }) => {
    await page.click('.nav-btn[data-v="dashboard"]');
    const brandChart = page.locator('#chartBrand svg');
    await expect(brandChart).toBeVisible();
    const statusChart = page.locator('#chartCond svg');
    await expect(statusChart).toBeVisible();
  });

  test('Transit metric hides brands with zero transit on dashboard', async ({ page }) => {
    await page.click('.nav-btn[data-v="dashboard"]');

    // Toggle to transit filter
    const transitMetric = page.locator('.tc.click', { hasText: 'In Transit' });
    await transitMetric.click();

    // GEELY should be hidden (0 net transit)
    const geelyCard = page.locator('.bc', { hasText: 'GEELY' });
    // It should either not exist or be hidden
    if (await geelyCard.count() > 0) {
      await expect(geelyCard).toBeHidden();
    }

    // CHANGAN should be visible (has transit items)
    const changanCard = page.locator('.bc:visible', { hasText: 'CHANGAN' });
    await expect(changanCard).toBeVisible();
  });

  test('Exec Summary tables render with brand data', async ({ page }) => {
    await page.click('.nav-btn[data-v="exec"]');
    const tables = page.locator('#eC table.t');
    expect(await tables.count()).toBe(2); // Summary 1 + Summary 2
    // Check CHANGAN appears in exec summary
    await expect(page.locator('#eC', { hasText: 'CHANGAN' })).toBeVisible();
  });

  test('Reservations tab shows reserved entries with aging', async ({ page }) => {
    await page.click('.nav-btn[data-v="reservations"]');
    // Should show Reserved section
    await expect(page.locator('#rC', { hasText: 'ACME LTD' })).toBeVisible();
    // Should have aging badge
    const agingBadge = page.locator('#rC .aging');
    expect(await agingBadge.count()).toBeGreaterThan(0);
  });

  test('Dashboard search filters brand cards', async ({ page }) => {
    await page.click('.nav-btn[data-v="dashboard"]');
    await page.fill('#dashSearch', 'maxus');
    await page.waitForTimeout(300);
    // MAXUS card should be visible
    const maxusCard = page.locator('.bc:visible', { hasText: 'MAXUS' });
    await expect(maxusCard).toBeVisible();
    // CHANGAN card should be hidden
    const changanCard = page.locator('.bc:visible', { hasText: 'CHANGAN' });
    expect(await changanCard.count()).toBe(0);
  });

  test('Brand chips render with counts on Stock Summary tab', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');
    // Brand chips should exist
    const chips = page.locator('#brandChips .bchip');
    expect(await chips.count()).toBeGreaterThan(1); // "All" + at least 1 brand
    // "All" chip should be first and active
    const allChip = chips.first();
    await expect(allChip).toContainText('All');
    await expect(allChip).toHaveClass(/active/);
    // CHANGAN chip should exist with a count
    const changanChip = page.locator('#brandChips .bchip', { hasText: 'CHANGAN' });
    await expect(changanChip).toBeVisible();
    const cnt = changanChip.locator('.cnt');
    const countText = await cnt.textContent();
    expect(Number(countText)).toBeGreaterThan(0);
  });

  test('Brand chip click filters and shows model chips + filter bar', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');
    // Click CHANGAN chip
    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(300);
    // Verify filtered data
    const result = await page.evaluate(() => {
      const data = stockTable.getData('active');
      const brands = [...new Set(data.map(r => r.brand))];
      return { brands, count: data.length };
    });
    expect(result.brands).toEqual(['CHANGAN']);
    expect(result.count).toBeGreaterThan(0);
    // CHANGAN chip should be active
    const changanChip = page.locator('#brandChips .bchip', { hasText: 'CHANGAN' });
    await expect(changanChip).toHaveClass(/active/);
    // "All" chip should NOT be active
    const allChip = page.locator('#brandChips .bchip', { hasText: 'All' });
    await expect(allChip).not.toHaveClass(/active/);
    // Active filter bar visible
    const filterBar = page.locator('#activeFilters');
    await expect(filterBar).toHaveClass(/on/);
    await expect(filterBar).toContainText('CHANGAN');
    // Model chips should appear
    const modelRow = page.locator('#modelChipRow');
    await expect(modelRow).toHaveClass(/on/);
  });

  test('Full cascade: brand → model → trim/colour chips (colour appears after model)', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');
    // Step 1: Select brand
    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(200);
    await expect(page.locator('#modelChipRow')).toHaveClass(/on/);
    await expect(page.locator('#trimChipRow')).not.toHaveClass(/on/);
    await expect(page.locator('#colourChipRow')).not.toHaveClass(/on/);
    // Step 2: Select model — trim AND colour both appear
    const firstModel = await page.evaluate(() => {
      const active = stockTable.getData('active');
      return [...new Set(active.map(r => r.model))].sort()[0];
    });
    await page.evaluate((m) => stockChipClick('model', m), firstModel);
    await page.waitForTimeout(200);
    await expect(page.locator('#trimChipRow')).toHaveClass(/on/);
    await expect(page.locator('#colourChipRow')).toHaveClass(/on/); // colour now appears after model
    // Step 3: Select trim — colour remains visible
    const firstTrim = await page.evaluate(() => {
      const active = stockTable.getData('active');
      return [...new Set(active.map(r => r.trim))].sort()[0];
    });
    await page.evaluate((t) => stockChipClick('trim', t), firstTrim);
    await page.waitForTimeout(200);
    await expect(page.locator('#colourChipRow')).toHaveClass(/on/);
    // Filter bar should show all 3 filters
    const filterBar = page.locator('#activeFilters');
    await expect(filterBar).toContainText('Brand: CHANGAN');
  });

  test('Clear all resets to collapsed groups with no cascade chips', async ({ page }) => {
    await page.click('.nav-btn[data-v="stock"]');
    await page.waitForSelector('.tabulator-group');
    // Set brand + model filters
    await page.evaluate(() => {
      stockChipClick('brand', 'CHANGAN');
      stockChipClick('model', 'CS75 PLUS');
    });
    await page.waitForTimeout(300);
    const filterBar = page.locator('#activeFilters');
    await expect(filterBar).toHaveClass(/on/);
    // Clear all
    await page.evaluate(() => stockClearAll());
    await page.waitForTimeout(300);
    // Filter bar should be hidden
    await expect(filterBar).not.toHaveClass(/on/);
    // Cascade chip rows should be hidden
    await expect(page.locator('#modelChipRow')).not.toHaveClass(/on/);
    await expect(page.locator('#trimChipRow')).not.toHaveClass(/on/);
    await expect(page.locator('#colourChipRow')).not.toHaveClass(/on/);
    // All data should be visible
    const count = await page.evaluate(() => stockTable.getData('active').length);
    const total = await page.evaluate(() => stockTable.getData().length);
    expect(count).toBe(total);
  });
});
