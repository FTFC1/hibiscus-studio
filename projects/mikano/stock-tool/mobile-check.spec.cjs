// @ts-check
// Mobile viewport audit — what breaks on iPhone SE (375px) and iPhone 14 (390px)
const { test, expect } = require('@playwright/test');

async function injectAndRender(page) {
  const S = {
    sbb: {
      CHANGAN: [
        {model:'CS75 PLUS',trim:'LUXURY',colour:'WHITE',qty:8},
        {model:'CS75 PLUS',trim:'LUXURY',colour:'BLACK',qty:5},
        {model:'CS75 PLUS',trim:'LUXURY',colour:'SILVER',qty:5},
        {model:'CS75 PLUS',trim:'EXECUTIVE',colour:'WHITE',qty:4},
        {model:'CS55 PLUS',trim:'EXECUTIVE',colour:'BLACK',qty:3},
        {model:'CS55 PLUS',trim:'EXECUTIVE',colour:'WHITE',qty:3},
        {model:'UNI-K',trim:'SPORT',colour:'RED',qty:2},
        {model:'UNI-K',trim:'SPORT',colour:'WHITE',qty:4},
      ],
      MAXUS: [
        {model:'D90 PRO',trim:'4WD ELITE',colour:'GREY',qty:6},
        {model:'T60',trim:'LUXURY',colour:'WHITE',qty:4},
        {model:'T60',trim:'LUXURY',colour:'BLACK',qty:3},
      ]
    }
  };
  await page.evaluate((s) => {
    Object.assign(S, s);
    S.agg = {};
    Object.entries(S.sbb).forEach(([b, items]) => {
      const a = {};
      items.forEach(i => {
        const k = i.model + '||' + i.trim + '||' + i.colour;
        if (!a[k]) a[k] = { model: i.model, trim: i.trim, colour: i.colour, qty: 0 };
        a[k].qty += i.qty;
      });
      S.agg[b] = Object.values(a);
    });
    rStock();
    nav('stock');
  }, S);
  await page.waitForTimeout(600);
}

// ── iPhone SE (375 x 667) ─────────────────────────────────────
test.describe('Mobile — iPhone SE 375px', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('MEASURE: chip row widths vs viewport', async ({ page }) => {
    await page.goto('/index.html');
    await injectAndRender(page);

    const brandChipsWidth = await page.evaluate(() => {
      const el = document.getElementById('brandChips');
      return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, overflows: el.scrollWidth > el.clientWidth };
    });
    console.log('Brand chips — scrollWidth:', brandChipsWidth.scrollWidth, 'clientWidth:', brandChipsWidth.clientWidth, 'overflows:', brandChipsWidth.overflows);

    // Chip row overflows — does it scroll or clip?
    const hasScroll = await page.evaluate(() => {
      const el = document.getElementById('brandChips');
      const style = window.getComputedStyle(el);
      return style.overflowX;
    });
    console.log('brand-chips overflow-x:', hasScroll);

    // Check if chips are accessible at 375px — are they clipped?
    expect(hasScroll).toBe('auto'); // Should scroll, not clip
  });

  test('MEASURE: table column widths at 375px', async ({ page }) => {
    await page.goto('/index.html');
    await injectAndRender(page);

    // Expand CHANGAN group
    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(300);

    const tableMetrics = await page.evaluate(() => {
      const cols = document.querySelectorAll('.tabulator-col');
      const cells = document.querySelectorAll('.tabulator-row:first-child .tabulator-cell');
      return {
        tableWidth: document.querySelector('#stockTab')?.scrollWidth,
        viewportWidth: window.innerWidth,
        overflows: (document.querySelector('#stockTab')?.scrollWidth || 0) > window.innerWidth,
        colTitles: Array.from(cols).map(c => ({ title: c.querySelector('.tabulator-col-title')?.textContent, width: c.offsetWidth })),
        cellWidths: Array.from(cells).map(c => ({ field: c.getAttribute('tabulator-field'), width: c.offsetWidth, text: c.textContent?.trim().substring(0, 20) }))
      };
    });
    console.log('Table overflows viewport:', tableMetrics.overflows);
    console.log('Table width:', tableMetrics.tableWidth, '/ Viewport:', tableMetrics.viewportWidth);
    console.log('Columns:', JSON.stringify(tableMetrics.colTitles));
    console.log('Cell widths:', JSON.stringify(tableMetrics.cellWidths));

    // Document whether table overflows
    // (this is a measurement test, not a pass/fail)
  });

  test('MEASURE: touch target sizes for chips', async ({ page }) => {
    await page.goto('/index.html');
    await injectAndRender(page);

    const chipHeights = await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('.bchip'));
      return chips.map(c => ({ text: c.textContent?.trim().substring(0, 15), height: c.offsetHeight, width: c.offsetWidth }));
    });
    console.log('Chip touch targets:', JSON.stringify(chipHeights));

    // Apple HIG minimum: 44px. Check how many chips are below that.
    const belowMin = chipHeights.filter(c => c.height < 44);
    console.log('Chips below 44px minimum:', belowMin.length, 'of', chipHeights.length);
  });

  test('MEASURE: filter bar wrapping at 375px with 3 active chips', async ({ page }) => {
    await page.goto('/index.html');
    await injectAndRender(page);

    // Set brand + model + colour filters
    await page.evaluate(() => {
      stockChipClick('brand', 'CHANGAN');
    });
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      stockChipClick('model', 'CS75 PLUS');
    });
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      stockChipClick('colour', 'WHITE');
    });
    await page.waitForTimeout(200);

    const filterBarMetrics = await page.evaluate(() => {
      const bar = document.getElementById('activeFilters');
      const chips = bar?.querySelectorAll('.af-chip');
      return {
        barHeight: bar?.offsetHeight,
        barWidth: bar?.offsetWidth,
        chipCount: chips?.length,
        isVisible: bar?.classList.contains('on'),
        // check if it wraps (height > single line)
        wraps: (bar?.offsetHeight || 0) > 50
      };
    });
    console.log('Filter bar metrics:', JSON.stringify(filterBarMetrics));
    expect(filterBarMetrics.isVisible).toBe(true);
  });

  test('SNAPSHOT: nav tabs — do they overflow at 375px?', async ({ page }) => {
    await page.goto('/index.html');
    await injectAndRender(page);

    const navMetrics = await page.evaluate(() => {
      const nav = document.getElementById('nav');
      return {
        scrollWidth: nav?.scrollWidth,
        clientWidth: nav?.clientWidth,
        overflows: (nav?.scrollWidth || 0) > (nav?.clientWidth || 0),
        overflow: window.getComputedStyle(nav).overflow
      };
    });
    console.log('Nav overflow:', JSON.stringify(navMetrics));
  });
});

// ── iPhone 14 Pro (393 x 852) ─────────────────────────────────
test.describe('Mobile — iPhone 14 Pro 393px', () => {
  test.use({ viewport: { width: 393, height: 852 } });

  test('MEASURE: usable table height after chips + nav + sbar', async ({ page }) => {
    await page.goto('/index.html');
    await injectAndRender(page);

    await page.evaluate(() => stockChipClick('brand', 'CHANGAN'));
    await page.waitForTimeout(200);

    const layout = await page.evaluate(() => {
      const header = document.querySelector('.header')?.offsetHeight || 0;
      const nav = document.querySelector('.nav')?.offsetHeight || 0;
      const brandChips = document.getElementById('brandChips')?.offsetHeight || 0;
      const modelRow = document.getElementById('modelChipRow')?.offsetHeight || 0;
      const activeFilters = document.getElementById('activeFilters')?.offsetHeight || 0;
      const sbar = document.querySelector('.sbar')?.offsetHeight || 0;
      const viewport = window.innerHeight;
      const consumed = header + nav + brandChips + modelRow + activeFilters + sbar;
      return { header, nav, brandChips, modelRow, activeFilters, sbar, viewport, consumed, tableHeight: viewport - consumed };
    });
    console.log('Layout consumption at 393px:', JSON.stringify(layout));
    console.log('Remaining height for table:', layout.tableHeight);
  });
});
