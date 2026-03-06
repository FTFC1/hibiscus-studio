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
  test('Home → click START SESSION → Lesson page loads', async ({ page }) => {
    await page.click('.hero-cta')
    await expect(page).toHaveURL(/\/lesson\/mission-\d+/)
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 5000 })
  })

  test('BottomNav hidden on lesson page', async ({ page }) => {
    await page.click('.hero-cta')
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('.bottom-nav')).not.toBeVisible()
  })

  test('navigate slides and take quiz → Result page', async ({ page }) => {
    await page.goto('/lesson/mission-1')
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 10000 })

    // Navigate through slides
    for (let i = 0; i < 4; i++) {
      const navBtns = page.locator('.lesson-footer .nav-btn')
      const count = await navBtns.count()
      if (count > 1) await navBtns.last().click()
      else if (count === 1) await navBtns.first().click()
      await page.waitForTimeout(400)
    }

    // Click "Take the Quiz"
    await expect(page.locator('text=Take the Quiz')).toBeVisible({ timeout: 5000 })
    await page.locator('text=Take the Quiz').click()
    await page.waitForTimeout(500)

    // Answer 3 questions (mission-1: correct answers at index 2, 2, 1)
    await answerQuizQuestion(page, 2) // Q1 correct
    await answerQuizQuestion(page, 2) // Q2 correct
    await answerQuizQuestion(page, 1) // Q3 correct

    // Should land on Result page
    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })
    await expect(page.locator('.result-ring-wrap')).toBeVisible()
    await expect(page.locator('.result-cta-btn')).toBeVisible()
  })

  test('Result page has CTA with text', async ({ page }) => {
    await page.goto('/lesson/mission-1')
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 10000 })

    for (let i = 0; i < 4; i++) {
      const navBtns = page.locator('.lesson-footer .nav-btn')
      const count = await navBtns.count()
      if (count > 1) await navBtns.last().click()
      else if (count === 1) await navBtns.first().click()
      await page.waitForTimeout(400)
    }

    await page.locator('text=Take the Quiz').click()
    await page.waitForTimeout(500)

    // Answer all 3 (pick first option each time — some will be wrong)
    for (let q = 0; q < 3; q++) {
      await answerQuizQuestion(page, 0)
    }

    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })
    const ctaBtn = page.locator('.result-cta-btn').first()
    await expect(ctaBtn).toBeVisible({ timeout: 5000 })
    const ctaText = await ctaBtn.textContent()
    expect(ctaText.length).toBeGreaterThan(0)
  })
})
