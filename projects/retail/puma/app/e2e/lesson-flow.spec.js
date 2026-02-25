import { test, expect } from '@playwright/test'

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
    // Go to mission-1 directly (predictable quiz answers)
    await page.goto('/lesson/mission-1')
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 10000 })

    // Navigate through slides using the right-side nav button
    for (let i = 0; i < 4; i++) {
      // The right arrow is the last .nav-btn in the footer
      const navBtns = page.locator('.lesson-footer .nav-btn')
      const count = await navBtns.count()
      if (count > 1) {
        await navBtns.last().click()
      } else if (count === 1) {
        await navBtns.first().click()
      }
      await page.waitForTimeout(400)
    }

    // Click "Take the Quiz"
    const quizBtn = page.locator('text=Take the Quiz')
    await expect(quizBtn).toBeVisible({ timeout: 5000 })
    await quizBtn.click()
    await page.waitForTimeout(500)

    // Answer all 3 questions
    for (let q = 0; q < 3; q++) {
      await expect(page.locator('.quiz-option').first()).toBeVisible({ timeout: 5000 })
      await page.locator('.quiz-option').first().click()
      await page.waitForTimeout(1200)
    }

    // Should land on Result page
    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 5000 })
    await expect(page.locator('.result-ring-wrap')).toBeVisible()
    await expect(page.locator('.result-cta-btn')).toBeVisible()
  })

  test('Result page has CTA with text', async ({ page }) => {
    await page.goto('/lesson/mission-1')
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 10000 })

    // Navigate to last slide
    for (let i = 0; i < 4; i++) {
      const navBtns = page.locator('.lesson-footer .nav-btn')
      const count = await navBtns.count()
      if (count > 1) await navBtns.last().click()
      else if (count === 1) await navBtns.first().click()
      await page.waitForTimeout(400)
    }

    await page.locator('text=Take the Quiz').click()
    await page.waitForTimeout(500)

    for (let q = 0; q < 3; q++) {
      await expect(page.locator('.quiz-option').first()).toBeVisible({ timeout: 5000 })
      await page.locator('.quiz-option').first().click()
      await page.waitForTimeout(1500)
    }

    // Wait for navigation to result page after last answer
    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })
    const ctaBtn = page.locator('.result-cta-btn')
    await expect(ctaBtn).toBeVisible({ timeout: 5000 })
    const ctaText = await ctaBtn.textContent()
    expect(ctaText.length).toBeGreaterThan(0)
  })
})
