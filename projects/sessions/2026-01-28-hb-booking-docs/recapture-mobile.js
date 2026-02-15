// recapture-mobile.js
// Recapture all screenshots at mobile viewport (390x844) using Playwright
// Uses hybrid approach: clicks where reliable, goToStep() where clicks fail

import { chromium } from 'playwright';
import fs from 'fs';

const VIEWPORT = { width: 390, height: 844 };
const BOOKING_HTML = 'file:///Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/2_Areas/01-Hibiscus-Studio/hibiscus-studio-deploy/booking-demo.html';

fs.mkdirSync('screenshots/mobile/dark', { recursive: true });
fs.mkdirSync('screenshots/mobile/light', { recursive: true });

async function captureBookingFlow(theme = 'dark') {
  console.log(`\n📸 Capturing ${theme} theme...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  await page.goto(BOOKING_HTML);
  await page.waitForLoadState('networkidle');

  // Dark is default, toggle for light
  if (theme === 'light') {
    await page.locator('.theme-toggle').click();
    await page.waitForTimeout(300);
  }

  const shot = async (num, name) => {
    const filename = `funnel-${theme}-step-${num}-${name}.png`;
    await page.screenshot({ path: `screenshots/mobile/${theme}/${filename}` });
    console.log(`✓ ${filename}`);
  };

  // 1. Event Type (step1)
  await shot(1, 'event-type');

  // Click Bridal Shower
  await page.locator('#step1 .choice-card').first().click();
  await page.waitForTimeout(400);

  // 2. When (step2)
  await shot(2, 'when');

  // Click "Pick a specific month"
  await page.locator('#step2 .choice-card').nth(2).click();
  await page.waitForTimeout(400);

  // 3. Month Picker (stepMonthPicker)
  await shot(3, 'month-picker');

  // Click first month
  await page.locator('#stepMonthPicker .month-btn').first().click();
  await page.waitForTimeout(400);

  // 4. Day Type (step3)
  await shot(4, 'day-type');

  // Click Weekend
  await page.locator('#step3 .choice-card').first().click();
  await page.waitForTimeout(400);

  // 5. Pick Date (step4)
  await shot(5, 'pick-date');

  // Click first date card
  await page.locator('#step4 .date-card:not(.disabled)').first().click();
  await page.waitForTimeout(400);

  // 6. Time Slots (step5)
  await shot(6, 'time-slots');

  // Expand first time slot
  await page.locator('#step5 .time-slot').first().click();
  await page.waitForTimeout(300);

  // 7. Time Expanded
  await shot(7, 'time-expanded');

  // Manually set time selection and advance using JS
  await page.evaluate(() => {
    selectedTimeStart = '12:00';
    selectedTimeEnd = '18:00';
    selectedTimeLabel = 'Afternoon';
    window.selectedTimeStart = '12:00';
    window.selectedTimeEnd = '18:00';
    document.querySelector('#step5 .time-slot').classList.add('selected');
    goToStep(6);
  });
  await page.waitForTimeout(400);

  // 8. Guests (step6)
  await shot(8, 'guests');

  // Click guest count (11-20)
  await page.locator('#step6 .guest-btn').nth(1).click();
  await page.waitForTimeout(400);

  // 9. Details empty (step7)
  await shot(9, 'details');

  // Auto-fill demo data
  await page.evaluate(() => autoFillDemo());
  await page.waitForTimeout(300);

  // 10. Details Filled
  await shot(10, 'details-filled');

  // Click Review button
  await page.locator('#btn7').click();
  await page.waitForTimeout(400);

  // 11. Review (step8)
  await shot(11, 'review');

  // Click Confirm
  await page.locator('#step8 .btn-primary').click();
  await page.waitForTimeout(400);

  // 12. Confirmation (step9)
  await shot(12, 'confirmation');

  await browser.close();
  console.log(`✅ ${theme} complete (12 screenshots)`);
}

async function main() {
  console.log('🚀 Mobile screenshot recapture');
  console.log(`📱 Viewport: ${VIEWPORT.width}x${VIEWPORT.height}`);

  try {
    await captureBookingFlow('dark');
    await captureBookingFlow('light');
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
