import { test, expect } from '@playwright/test';
import { detailsButton } from './support/portfolio';

test.beforeEach(async ({ page }) => {
  await page.goto('/pt');
});

test('Project details open with both Enter and Space', async ({ page }) => {
  const opener = detailsButton(page);
  for (const key of ['Enter', 'Space']) {
    await opener.focus();
    await page.keyboard.press(key);
    const dialog = page.getByRole('dialog', { name: 'A11y Audit Agent', exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'A11y Audit Agent', exact: true })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Fechar detalhes do projeto' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  }
});

test('The modal keeps focus inside for Tab and Shift+Tab', async ({ page }) => {
  await detailsButton(page).click();
  const dialog = page.getByRole('dialog', { name: 'A11y Audit Agent', exact: true });
  const close = dialog.getByRole('button', { name: 'Fechar detalhes do projeto' });
  const last = dialog.getByRole('button', { name: 'Próximo projeto', exact: true });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(last).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  // The current modal has a repository link and three buttons.
  // Verify containment at every step, not only the eventual wrap-around.
  for (let step = 0; step < 4; step += 1) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  }
  await expect(close).toBeFocused();
});

test('Escape closes project details and restores focus to the opener', async ({ page }) => {
  const opener = detailsButton(page);
  await opener.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'A11y Audit Agent', exact: true });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  expect(await opener.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
});
