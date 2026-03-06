import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.click('text=Manager View')
  await expect(page.locator('.mgr-card').first()).toBeVisible({ timeout: 15000 })
})

test.describe('Navigation', () => {
  test('BottomNav visible on Home', async ({ page }) => {
    await expect(page.locator('.bottom-nav')).toBeVisible()
  })

  test('BottomNav hidden on lesson page', async ({ page }) => {
    await page.goto('/lesson/mission-1')
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.bottom-nav')).not.toBeVisible()
  })

  test('BottomNav hidden on result page', async ({ page }) => {
    // Go through quiz flow to reach a real result page
    await page.goto('/lesson/mission-1')
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 10000 })

    for (let i = 0; i < 5; i++) {
      const navBtn = page.locator('.lesson-footer .nav-pill-next, .lesson-footer .nav-btn').last()
      if (await navBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await navBtn.click()
        await page.waitForTimeout(400)
      }
    }

    const quizBtn = page.locator('text=Take the Quiz')
    if (await quizBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await quizBtn.click()
      await page.waitForTimeout(500)

      for (let q = 0; q < 5; q++) {
        const opts = page.locator('.quiz-option:not([disabled])')
        await expect(opts.first()).toBeVisible({ timeout: 5000 })
        await opts.first().click()
        await page.waitForTimeout(500)
        // If wrong, click "Next" button
        const nextBtn = page.locator('.quiz-next-btn')
        if (await nextBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
          await nextBtn.click()
          await page.waitForTimeout(500)
        } else {
          await page.waitForTimeout(600)
        }
      }

      await expect(page).toHaveURL(/\/result\//)
      await expect(page.locator('.bottom-nav')).not.toBeVisible()
    }
  })

  test('BottomNav tabs navigate correctly', async ({ page }) => {
    await page.locator('.bottom-nav').locator('text=Games').click()
    await expect(page).toHaveURL('/games')

    await page.locator('.bottom-nav').locator('text=Practice').click()
    await expect(page).toHaveURL('/practice')

    await page.locator('.bottom-nav').locator('text=Home').click()
    await expect(page).toHaveURL('/')
  })
})
