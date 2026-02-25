import { test, expect } from '@playwright/test'
import { writeFileSync } from 'fs'
import { join } from 'path'

const screenshotDir = join(import.meta.dirname, '..', 'public', 'screenshots')
const manifest = []

function capture(name, label) {
  return async function ({ page }) {
    await page.screenshot({ path: join(screenshotDir, `${name}.png`), fullPage: true })
    manifest.push({ name, label, file: `${name}.png` })
  }
}

test.describe.serial('Screen Capture', () => {

  test('01 — Login page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.login-brand-name')).toHaveText('PUMA')
    await page.screenshot({ path: join(screenshotDir, '01-login.png'), fullPage: true })
    manifest.push({ name: '01-login', label: 'Login', file: '01-login.png' })
  })

  test('02 — Home (Staff view)', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Staff View')
    await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
    await page.screenshot({ path: join(screenshotDir, '02-home-staff.png'), fullPage: true })
    manifest.push({ name: '02-home-staff', label: 'Home (Staff)', file: '02-home-staff.png' })
  })

  test('03 — Home (Manager view)', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Manager View')
    await expect(page.locator('.mgr-card').first()).toBeVisible({ timeout: 15000 })
    await page.screenshot({ path: join(screenshotDir, '03-home-manager.png'), fullPage: true })
    manifest.push({ name: '03-home-manager', label: 'Home (Manager)', file: '03-home-manager.png' })
  })

  test('04 — Lesson (first slide)', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Staff View')
    await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
    await page.goto('/lesson/mission-1')
    await expect(page.locator('.slide-card').first()).toBeVisible({ timeout: 10000 })
    await page.screenshot({ path: join(screenshotDir, '04-lesson-slide1.png'), fullPage: true })
    manifest.push({ name: '04-lesson-slide1', label: 'Lesson — Slide 1', file: '04-lesson-slide1.png' })
  })

  test('05 — Lesson (practice slide with Take the Quiz)', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Staff View')
    await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
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

    await expect(page.locator('text=Take the Quiz')).toBeVisible({ timeout: 5000 })
    await page.screenshot({ path: join(screenshotDir, '05-lesson-practice.png'), fullPage: true })
    manifest.push({ name: '05-lesson-practice', label: 'Lesson — Practice Slide', file: '05-lesson-practice.png' })
  })

  test('06 — Quiz (question)', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Staff View')
    await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
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
    await expect(page.locator('.quiz-option').first()).toBeVisible({ timeout: 5000 })
    await page.screenshot({ path: join(screenshotDir, '06-quiz-question.png'), fullPage: true })
    manifest.push({ name: '06-quiz-question', label: 'Quiz — Question', file: '06-quiz-question.png' })
  })

  test('07 — Result page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Staff View')
    await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
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

    for (let q = 0; q < 3; q++) {
      await expect(page.locator('.quiz-option').first()).toBeVisible({ timeout: 5000 })
      await page.locator('.quiz-option').first().click()
      await page.waitForTimeout(1500)
    }

    await expect(page).toHaveURL(/\/result\/mission-1/, { timeout: 10000 })
    await expect(page.locator('.result-ring-wrap')).toBeVisible()
    await page.screenshot({ path: join(screenshotDir, '07-result.png'), fullPage: true })
    manifest.push({ name: '07-result', label: 'Result', file: '07-result.png' })
  })

  test('08 — Games page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Staff View')
    await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
    await page.locator('.bottom-nav').locator('text=Games').click()
    await expect(page).toHaveURL('/games')
    await page.waitForTimeout(1000)
    await expect(page.locator('.game-card').first()).toBeVisible({ timeout: 5000 })
    await page.screenshot({ path: join(screenshotDir, '08-games.png'), fullPage: true })
    manifest.push({ name: '08-games', label: 'Games', file: '08-games.png' })
  })

  test('09 — Game open', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Staff View')
    await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
    await page.locator('.bottom-nav').locator('text=Games').click()
    await expect(page).toHaveURL('/games')
    await page.waitForTimeout(1000)

    const gameCard = page.locator('.game-card').first()
    if (await gameCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await gameCard.click()
      await page.waitForTimeout(500)
      await expect(page.locator('text=Back to Games')).toBeVisible({ timeout: 5000 })
      await page.screenshot({ path: join(screenshotDir, '09-game-open.png'), fullPage: true })
      manifest.push({ name: '09-game-open', label: 'Game — Open', file: '09-game-open.png' })
    }
  })

  test('10 — Practice page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Staff View')
    await expect(page.locator('.hero-card').first()).toBeVisible({ timeout: 15000 })
    await page.locator('.bottom-nav').locator('text=Practice').click()
    await expect(page).toHaveURL('/practice')
    await page.waitForTimeout(500)
    await page.screenshot({ path: join(screenshotDir, '10-practice.png'), fullPage: true })
    manifest.push({ name: '10-practice', label: 'Practice', file: '10-practice.png' })
  })

  test('manifest — write manifest.json', async () => {
    writeFileSync(
      join(screenshotDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    )
  })
})
