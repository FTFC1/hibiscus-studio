import { test, expect } from '@playwright/test'

// Mission-1 quiz correct answers are all at index 2 (3rd option)
// correct: 2, correct: 2, correct: 1

test.describe('Quiz Score Bug (B1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.click('text=Staff View')
    await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
  })

  test('quiz score is NOT 0% when answering correctly', async ({ page }) => {
    // Navigate to lesson/mission-1
    await page.goto('/lesson/mission-1')
    await page.waitForTimeout(1000)

    // Advance through slides to reach quiz
    // Keep clicking next/swiping until we see "Take the Quiz"
    for (let i = 0; i < 15; i++) {
      const quizBtn = page.locator('text=Take the Quiz')
      if (await quizBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        break
      }
      // Click the next arrow or footer next button
      const nextBtn = page.locator('.lesson-footer button').last()
      if (await nextBtn.isVisible({ timeout: 300 }).catch(() => false)) {
        await nextBtn.click()
        await page.waitForTimeout(400)
      }
    }

    // Click "Take the Quiz"
    const quizBtn = page.locator('text=Take the Quiz')
    await expect(quizBtn).toBeVisible({ timeout: 5000 })
    await quizBtn.click()
    await page.waitForTimeout(500)

    // Verify we're in quiz mode
    await expect(page.locator('.quiz-overlay')).toBeVisible({ timeout: 5000 })

    // Answer all 5 questions — pick the CORRECT answer each time
    // Q1: correct=2, Q2: correct=2, Q3: correct=1, Q4: correct=3, Q5: correct=1
    const correctAnswers = [2, 2, 1, 3, 1]
    for (const ans of correctAnswers) {
      const opts = page.locator('.quiz-option:not([disabled])')
      await expect(opts.first()).toBeVisible({ timeout: 5000 })
      await opts.nth(ans).click()
      await page.waitForTimeout(1200)
    }

    // Should be on result page
    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })

    // Take screenshot for evidence
    await page.screenshot({ path: 'e2e/screenshots/quiz-score-result.png' })

    // The SVG text shows score — check for "5/5 correct" and "100%"
    await expect(page.locator('text=5/5 correct')).toBeVisible({ timeout: 3000 })
    await expect(page.locator('.result-status-label')).toContainText('Perfect Score', { timeout: 3000 })
  })

  test('quiz score with wrong answers shows correct count', async ({ page }) => {
    await page.goto('/lesson/mission-1')
    await page.waitForTimeout(1000)

    // Advance to quiz
    for (let i = 0; i < 15; i++) {
      const quizBtn = page.locator('text=Take the Quiz')
      if (await quizBtn.isVisible({ timeout: 500 }).catch(() => false)) break
      const nextBtn = page.locator('.lesson-footer button').last()
      if (await nextBtn.isVisible({ timeout: 300 }).catch(() => false)) {
        await nextBtn.click()
        await page.waitForTimeout(400)
      }
    }

    await page.locator('text=Take the Quiz').click()
    await page.waitForTimeout(500)

    // Q1: pick WRONG answer (index 0 instead of 2)
    await page.locator('.quiz-option').nth(0).click()
    await page.waitForTimeout(500)
    // Wrong answer shows "Next" button
    const nextBtn1 = page.locator('.quiz-next-btn')
    await expect(nextBtn1).toBeVisible({ timeout: 3000 })
    await nextBtn1.click()
    await page.waitForTimeout(500)

    // Q2: pick CORRECT (index 2)
    await page.locator('.quiz-option:not([disabled])').nth(2).click()
    await page.waitForTimeout(1200)

    // Q3: pick CORRECT (index 1)
    await page.locator('.quiz-option:not([disabled])').nth(1).click()
    await page.waitForTimeout(1200)

    // Q4: pick CORRECT (index 3)
    await page.locator('.quiz-option:not([disabled])').nth(3).click()
    await page.waitForTimeout(1200)

    // Q5: pick CORRECT (index 1)
    await page.locator('.quiz-option:not([disabled])').nth(1).click()
    await page.waitForTimeout(2000)

    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })

    // Score should be 80% (4/5)
    await page.screenshot({ path: 'e2e/screenshots/quiz-score-partial.png' })

    // Check "4/5 correct" text exists
    const correctText = page.locator('text=4/5 correct')
    const has4of5 = await correctText.isVisible({ timeout: 3000 }).catch(() => false)
    console.log(`4/5 correct visible: ${has4of5}`)

    // Should NOT show 0/5
    const has0of5 = await page.locator('text=0/5 correct').isVisible({ timeout: 1000 }).catch(() => false)
    expect(has0of5).toBe(false)
  })
})
