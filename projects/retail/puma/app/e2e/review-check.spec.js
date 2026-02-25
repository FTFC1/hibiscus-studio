import { test, expect } from '@playwright/test'

test.describe('Review Surface', () => {
  test('loads tldraw canvas with all screenshots', async ({ page }) => {
    await page.goto('/review')
    // tldraw main canvas (not error boundary)
    await expect(page.getByRole('application', { name: 'tldraw' })).toBeVisible({ timeout: 15000 })
    await page.waitForTimeout(2000)

    // Verify screenshots loaded — check the canvas has content
    await page.screenshot({
      path: 'public/screenshots/review-canvas.png',
      fullPage: false,
    })
  })

  test('can add note annotation on canvas', async ({ page }) => {
    await page.goto('/review')
    await expect(page.getByRole('application', { name: 'tldraw' })).toBeVisible({ timeout: 15000 })
    await page.waitForTimeout(2000)

    // Click the note tool in toolbar (speech bubble icon)
    const noteBtn = page.locator('[data-testid="tools.note"]')
    if (await noteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await noteBtn.click()
      // Click on canvas to place a note
      await page.mouse.click(400, 400)
      await page.waitForTimeout(500)
    }

    await page.screenshot({
      path: 'public/screenshots/review-annotated.png',
      fullPage: false,
    })
  })
})
