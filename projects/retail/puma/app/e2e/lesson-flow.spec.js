import { test, expect } from '@playwright/test'

// Helper: answer a quiz question by clicking the Nth option (0-indexed)
// Handles both correct (auto-advance) and wrong (click Next) flows
async function answerQuizQuestion(page, optionIndex) {
  const options = page.locator('.quiz-option:not([disabled])')
  await expect(options.first()).toBeVisible({ timeout: 5000 })
  await options.nth(optionIndex).click()
  await page.waitForTimeout(500)

  // If wrong answer, a "Next" button appears — click it
  const nextBtn = page.locator('.quiz-next-btn')
  if (await nextBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await nextBtn.click()
    await page.waitForTimeout(500)
  } else {
    // Correct answer auto-advances after 900ms
    await page.waitForTimeout(600)
  }
}

// Login as staff before each test
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

    // Navigate through slides (objectives + 4 content slides = 5 clicks to reach completion)
    for (let i = 0; i < 5; i++) {
      const navBtn = page.locator('.lesson-footer .nav-pill-next, .lesson-footer .nav-btn').last()
      if (await navBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await navBtn.click()
        await page.waitForTimeout(400)
      }
    }

    // Click "Take the Quiz"
    await expect(page.locator('text=Take the Quiz')).toBeVisible({ timeout: 5000 })
    await page.locator('text=Take the Quiz').click()
    await page.waitForTimeout(500)

    // Answer 5 questions (mission-1: correct answers at index 2, 2, 1, 3, 1)
    await answerQuizQuestion(page, 2) // Q1 correct
    await answerQuizQuestion(page, 2) // Q2 correct
    await answerQuizQuestion(page, 1) // Q3 correct
    await answerQuizQuestion(page, 3) // Q4 correct
    await answerQuizQuestion(page, 1) // Q5 correct

    // Should land on Result page
    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })
    await expect(page.locator('.result-ring-wrap')).toBeVisible()
    await expect(page.locator('.result-cta-btn')).toBeVisible()
  })

  test('Result page has CTA with text', async ({ page }) => {
    await page.goto('/lesson/mission-1')
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 10000 })

    for (let i = 0; i < 5; i++) {
      const navBtn = page.locator('.lesson-footer .nav-pill-next, .lesson-footer .nav-btn').last()
      if (await navBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await navBtn.click()
        await page.waitForTimeout(400)
      }
    }

    await page.locator('text=Take the Quiz').click()
    await page.waitForTimeout(500)

    // Answer all 5 (pick first option each time — some will be wrong)
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
