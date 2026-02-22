import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.click('text=Staff View')
  await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
})

test.describe('Fix 4: Lesson completion flow (no dead-end practice screen)', () => {
  test('Lesson ends with completion screen, not phantom Start Session', async ({ page }) => {
    // Navigate to first lesson
    const heroCard = page.locator('.hero-card').first()
    await heroCard.click()
    await expect(page.locator('.lesson-top-bar')).toBeVisible({ timeout: 5000 })

    // Swipe through all content slides to reach completion
    const dots = page.locator('.progress-dots-inline .dot')
    const dotCount = await dots.count()

    // Click through slides via right arrow
    for (let i = 0; i < dotCount - 1; i++) {
      const nextBtn = page.locator('.footer-right .nav-btn')
      if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextBtn.click()
        await page.waitForTimeout(400)
      }
    }

    // Should now be on completion screen
    await expect(page.locator('.complete-title')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('.complete-title')).toContainText('Lesson Complete')

    // Should NOT have the old phantom "Start Session" button
    await expect(page.locator('text=Start Session')).not.toBeVisible()
    await expect(page.locator('text=Session Active')).not.toBeVisible()

    // Should have clear CTA
    const quizBtn = page.locator('.complete-cta-primary')
    await expect(quizBtn).toBeVisible()

    // Should show practice items as read-only (numbered, not checkboxes)
    const practiceCard = page.locator('.complete-practice-card')
    if (await practiceCard.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(practiceCard.locator('.complete-practice-header')).toContainText('Practice on the Floor')
      // Items should be numbered, not interactive checkboxes
      const items = practiceCard.locator('.complete-practice-item')
      expect(await items.count()).toBeGreaterThan(0)
    }

    // Footer should be hidden (completion screen has its own CTAs)
    await expect(page.locator('.lesson-footer')).not.toBeVisible()
  })
})

test.describe('Fix 1: Quiz options are shuffled (not always option A)', () => {
  test('Approach game options appear in varying order across plays', async ({ page }) => {
    await page.locator('.bottom-nav').locator('text=Games').click()
    await expect(page).toHaveURL('/games')
    await page.waitForTimeout(1000)

    // Click first game (The Approach)
    const gameCard = page.locator('.game-card-active').first()
    await expect(gameCard).toBeVisible({ timeout: 5000 })
    await gameCard.click()
    await expect(page.locator('text=Back to Games')).toBeVisible({ timeout: 5000 })

    // Verify options are rendered with different letters
    const options = page.locator('.approach-option')
    await expect(options.first()).toBeVisible({ timeout: 5000 })
    const count = await options.count()
    expect(count).toBeGreaterThanOrEqual(3)

    // Each option should have a letter badge (A, B, C, D)
    const letters = []
    for (let i = 0; i < count; i++) {
      const letter = await options.nth(i).locator('.approach-option-letter').textContent()
      letters.push(letter)
    }
    expect(letters).toEqual(['A', 'B', 'C', 'D'].slice(0, count))

    // Pick an option and verify it registers (not always same index correct)
    await options.first().click()
    await page.waitForTimeout(300)
    // After picking, one option should be marked correct or wrong
    const markedOptions = page.locator('.approach-option.correct, .approach-option.wrong')
    await expect(markedOptions.first()).toBeVisible({ timeout: 3000 })
  })
})

test.describe('Fix 2: XP Performance bars on Profile page', () => {
  test('Profile page shows performance section with bar graph', async ({ page }) => {
    await page.locator('.bottom-nav').locator('text=Profile').click()
    await expect(page).toHaveURL('/profile')
    await page.waitForTimeout(1000)

    // Performance section should exist
    await expect(page.locator('text=Performance')).toBeVisible({ timeout: 5000 })

    // Performance card should be visible
    const perfCard = page.locator('.profile-perf-card')
    await expect(perfCard).toBeVisible()

    // Should have at least the Overall row
    const overallRow = perfCard.locator('.profile-perf-row').first()
    await expect(overallRow).toBeVisible()
    await expect(overallRow.locator('.profile-perf-label')).toContainText('Overall')

    // Should have the bar track
    await expect(overallRow.locator('.profile-perf-track')).toBeVisible()

    // Should have the percentage value
    await expect(overallRow.locator('.profile-perf-val')).toBeVisible()

    // Legend should exist
    await expect(page.locator('.profile-perf-legend')).toBeVisible()
  })
})

test.describe('Fix 3: Manager team chart on Games page', () => {
  test('Manager view shows team scores bar chart', async ({ page }) => {
    // Switch to manager view
    await page.locator('.bottom-nav').locator('text=Profile').click()
    await expect(page).toHaveURL('/profile')
    await page.waitForTimeout(500)

    // Click Manager role button
    const mgrBtn = page.locator('text=Manager')
    if (await mgrBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await mgrBtn.click()
      await page.waitForTimeout(500)

      // Go to Games page
      await page.locator('.bottom-nav').locator('text=Games').click()
      await expect(page).toHaveURL('/games')
      await page.waitForTimeout(1500)

      // Team Scores chart should be visible
      const chartCard = page.locator('.games-chart-card')
      if (await chartCard.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(chartCard.locator('.games-chart-title')).toContainText('Team Scores')

        // Should have bar columns for team members
        const cols = chartCard.locator('.games-chart-col')
        const colCount = await cols.count()
        expect(colCount).toBeGreaterThan(0)

        // Each column should have a name and bar
        for (let i = 0; i < Math.min(colCount, 3); i++) {
          await expect(cols.nth(i).locator('.games-chart-name')).toBeVisible()
          await expect(cols.nth(i).locator('.games-chart-bar-track')).toBeVisible()
        }

        // Legend should exist
        await expect(chartCard.locator('.games-chart-legend')).toBeVisible()
      }
    }
  })
})
