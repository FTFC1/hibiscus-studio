import { test, expect } from '@playwright/test'
import { navigateToQuiz, answerQuizQuestion } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.click('text=Staff View')
  await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
})

test.describe('Lesson Flow', () => {
  test('Home → click hero CTA → Lesson page loads', async ({ page }) => {
    const heroCta = page.locator('.hero-cta')
    if (!await heroCta.isVisible({ timeout: 5000 }).catch(() => false)) {
      test.skip(true, 'No hero CTA — all missions may be complete')
      return
    }
    await heroCta.click()
    await expect(page).toHaveURL(/\/lesson\/mission-\d+/)
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 5000 })
  })

  test('BottomNav hidden on lesson page', async ({ page }) => {
    await page.goto('/lesson/mission-1')
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.bottom-nav')).not.toBeVisible()
  })

  test('navigate slides and take quiz → Result page', async ({ page }) => {
    await page.goto('/lesson/mission-1')
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 10000 })

    await navigateToQuiz(page)

    await expect(page.locator('text=Take the Quiz')).toBeVisible({ timeout: 5000 })
    await page.locator('text=Take the Quiz').click()
    await page.waitForTimeout(500)

    // Answer 5 questions (mission-1: correct answers at index 2, 2, 1, 3, 1)
    await answerQuizQuestion(page, 2)
    await answerQuizQuestion(page, 2)
    await answerQuizQuestion(page, 1)
    await answerQuizQuestion(page, 3)
    await answerQuizQuestion(page, 1)

    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })
    await expect(page.locator('.result-ring-wrap')).toBeVisible()
    await expect(page.locator('.result-cta-btn')).toBeVisible()
  })

  test('Result page has CTA with text', async ({ page }) => {
    await page.goto('/lesson/mission-1')
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 10000 })

    await navigateToQuiz(page)

    await page.locator('text=Take the Quiz').click()
    await page.waitForTimeout(500)

    for (let q = 0; q < 5; q++) {
      await answerQuizQuestion(page, 0)
    }

    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })
    const ctaBtn = page.locator('.result-cta-btn').first()
    await expect(ctaBtn).toBeVisible({ timeout: 5000 })
    const ctaText = await ctaBtn.textContent()
    expect(ctaText.length).toBeGreaterThan(0)
  })
})
