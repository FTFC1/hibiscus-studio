// Shared test helpers for PUMA Playwright specs

/**
 * Navigate through all lesson slides until "Take the Quiz" button appears.
 * Handles variable slide counts across missions.
 */
export async function navigateToQuiz(page, { maxClicks = 20 } = {}) {
  for (let i = 0; i < maxClicks; i++) {
    const quizBtn = page.locator('text=Take the Quiz')
    if (await quizBtn.isVisible({ timeout: 300 }).catch(() => false)) return

    const nextBtn = page.locator('.nav-pill-next')
    if (await nextBtn.isVisible({ timeout: 500 }).catch(() => false)) {
      await nextBtn.click()
      await page.waitForTimeout(500)
    } else {
      // May be on completion screen already — check for quiz button again
      await page.waitForTimeout(300)
    }
  }
}

/**
 * Answer a quiz question by clicking the Nth option (0-indexed).
 * Handles both correct (auto-advance) and wrong (click Next) flows.
 */
export async function answerQuizQuestion(page, optionIndex) {
  const options = page.locator('.quiz-option:not([disabled])')
  await options.first().waitFor({ state: 'visible', timeout: 5000 })
  await options.nth(optionIndex).click()
  await page.waitForTimeout(500)

  const nextBtn = page.locator('.quiz-next-btn')
  if (await nextBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await nextBtn.click()
    await page.waitForTimeout(500)
  } else {
    await page.waitForTimeout(600)
  }
}
