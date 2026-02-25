import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.click('text=Staff View')
  await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
})

test.describe('Games Flow', () => {
  test('Games page loads with game cards', async ({ page }) => {
    await page.locator('.bottom-nav').locator('text=Games').click()
    await expect(page).toHaveURL('/games')
    await page.waitForTimeout(1000)
    await expect(page.locator('.game-card').first()).toBeVisible({ timeout: 5000 })
  })

  test('clicking a game opens the game screen', async ({ page }) => {
    await page.locator('.bottom-nav').locator('text=Games').click()
    await expect(page).toHaveURL('/games')
    await page.waitForTimeout(1000)

    const gameCard = page.locator('.game-card').first()
    if (await gameCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await gameCard.click()
      await page.waitForTimeout(500)
      // Game screen shows "Back to Games" link
      await expect(page.locator('text=Back to Games')).toBeVisible({ timeout: 5000 })
    }
  })
})
