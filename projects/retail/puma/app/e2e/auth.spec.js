import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('shows login page when not authenticated', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.login-brand-name')).toHaveText('PUMA')
    await expect(page.locator('text=Manager View')).toBeVisible()
    await expect(page.locator('text=Staff View')).toBeVisible()
  })

  test('manager login → Home loads', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Manager View')
    // Manager sees staff cards
    await expect(page.locator('.mgr-card').first()).toBeVisible({ timeout: 15000 })
    await expect(page.locator('.bottom-nav')).toBeVisible()
  })

  test('staff login → Home with hero card', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Staff View')
    await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
  })
})
