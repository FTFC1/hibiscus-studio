import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.click('text=Staff View')
  await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
})

test.describe('Game Onboard Screens (B14)', () => {
  test('Approach game shows onboard before play', async ({ page }) => {
    await page.locator('.bottom-nav').locator('text=Games').click()
    await expect(page).toHaveURL('/games')
    await page.waitForTimeout(1000)

    // Click first game card (Approach)
    const gameCard = page.locator('.game-card').first()
    await gameCard.click()
    await page.waitForTimeout(500)

    // Should see onboard screen with steps
    await expect(page.locator('.game-onboard-card')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('.game-onboard-title')).toBeVisible()
    await expect(page.locator('.game-onboard-step')).toHaveCount(4)

    // Should see "Got it, let's play!" button
    await expect(page.locator('text=Got it, let\'s play!')).toBeVisible()

    // Click CTA
    await page.locator('text=Got it, let\'s play!').click()
    await page.waitForTimeout(500)

    // Should now be in play mode — onboard gone, scenario visible
    await expect(page.locator('.game-onboard-card')).not.toBeVisible()
    await expect(page.locator('.approach-scenario-card')).toBeVisible({ timeout: 5000 })
  })
})
