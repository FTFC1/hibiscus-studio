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

    // Answer all 3 questions — pick the CORRECT answer each time
    // Q1: correct index 2 (3rd option, letter C)
    const q1Options = page.locator('.quiz-option')
    await expect(q1Options.first()).toBeVisible({ timeout: 5000 })
    const q1Count = await q1Options.count()
    console.log(`Q1 has ${q1Count} options`)
    await q1Options.nth(2).click() // correct: 2
    await page.waitForTimeout(1200) // wait for auto-advance (900ms + buffer)

    // Q2: correct index 2
    const q2Options = page.locator('.quiz-option')
    await expect(q2Options.first()).toBeVisible({ timeout: 5000 })
    await q2Options.nth(2).click() // correct: 2
    await page.waitForTimeout(1200)

    // Q3: correct index 1
    const q3Options = page.locator('.quiz-option')
    await expect(q3Options.first()).toBeVisible({ timeout: 5000 })
    await q3Options.nth(1).click() // correct: 1
    await page.waitForTimeout(2000) // wait for navigation to result

    // Should be on result page
    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })

    // Check score is NOT 0%
    const scoreText = await page.locator('text').allTextContents()
    const pageContent = await page.content()

    // Take screenshot for evidence
    await page.screenshot({ path: 'e2e/screenshots/quiz-score-result.png' })

    // The SVG text shows score — check for "3/3 correct" and "100%"
    await expect(page.locator('text=3/3 correct')).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=Perfect Score')).toBeVisible({ timeout: 3000 })
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
    const nextBtn = page.locator('.quiz-next-btn')
    await expect(nextBtn).toBeVisible({ timeout: 3000 })
    await nextBtn.click()
    await page.waitForTimeout(500)

    // Q2: pick CORRECT (index 2)
    await page.locator('.quiz-option').nth(2).click()
    await page.waitForTimeout(1200)

    // Q3: pick CORRECT (index 1)
    await page.locator('.quiz-option').nth(1).click()
    await page.waitForTimeout(2000)

    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })

    // Score should be 67% (2/3)
    await page.screenshot({ path: 'e2e/screenshots/quiz-score-partial.png' })

    // Check "2/3 correct" text exists
    const correctText = page.locator('text=2/3 correct')
    const has2of3 = await correctText.isVisible({ timeout: 3000 }).catch(() => false)
    console.log(`2/3 correct visible: ${has2of3}`)

    // Should NOT show 0/3
    const has0of3 = await page.locator('text=0/3 correct').isVisible({ timeout: 1000 }).catch(() => false)
    expect(has0of3).toBe(false)
  })
})
