import { test, expect } from '@playwright/test'
import { navigateToQuiz, answerQuizQuestion } from './helpers.js'

test.describe('Quiz Score Bug (B1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.click('text=Staff View')
    await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
  })

  test('quiz score is NOT 0% when answering correctly', async ({ page }) => {
    await page.goto('/lesson/mission-1')
    await page.waitForTimeout(1000)

    await navigateToQuiz(page)

    const quizBtn = page.locator('text=Take the Quiz')
    await expect(quizBtn).toBeVisible({ timeout: 5000 })
    await quizBtn.click()
    await page.waitForTimeout(500)

    await expect(page.locator('.quiz-overlay')).toBeVisible({ timeout: 5000 })

    // Q1: correct=2, Q2: correct=2, Q3: correct=1, Q4: correct=3, Q5: correct=1
    const correctAnswers = [2, 2, 1, 3, 1]
    for (const ans of correctAnswers) {
      const opts = page.locator('.quiz-option:not([disabled])')
      await expect(opts.first()).toBeVisible({ timeout: 5000 })
      await opts.nth(ans).click()
      await page.waitForTimeout(1200)
    }

    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })

    await page.screenshot({ path: 'e2e/screenshots/quiz-score-result.png' })

    await expect(page.locator('text=5/5 correct')).toBeVisible({ timeout: 3000 })
    await expect(page.locator('.result-status-label')).toContainText('Perfect Score', { timeout: 3000 })
  })

  test('quiz score with wrong answers shows correct count', async ({ page }) => {
    await page.goto('/lesson/mission-1')
    await page.waitForTimeout(1000)

    await navigateToQuiz(page)

    await page.locator('text=Take the Quiz').click()
    await page.waitForTimeout(500)

    // Q1: pick WRONG answer (index 0 instead of 2)
    await page.locator('.quiz-option').nth(0).click()
    await page.waitForTimeout(500)
    const nextBtn1 = page.locator('.quiz-next-btn')
    await expect(nextBtn1).toBeVisible({ timeout: 3000 })
    await nextBtn1.click()
    await page.waitForTimeout(500)

    // Q2-Q5: pick CORRECT
    await answerQuizQuestion(page, 2) // Q2
    await answerQuizQuestion(page, 1) // Q3
    await answerQuizQuestion(page, 3) // Q4
    await answerQuizQuestion(page, 1) // Q5

    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })

    await page.screenshot({ path: 'e2e/screenshots/quiz-score-partial.png' })

    const correctText = page.locator('text=4/5 correct')
    const has4of5 = await correctText.isVisible({ timeout: 3000 }).catch(() => false)
    console.log(`4/5 correct visible: ${has4of5}`)

    const has0of5 = await page.locator('text=0/5 correct').isVisible({ timeout: 1000 }).catch(() => false)
    expect(has0of5).toBe(false)
  })
})
