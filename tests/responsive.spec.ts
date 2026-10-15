import { test, expect } from '@playwright/test';

test('Representative viewports have no horizontal page overflow and mobile navigation remains usable', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await test.step('Viewport ' + width + 'px', async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/pt');
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const dimensions = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: window.innerWidth }));
      expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
      if (width < 768) {
        const toggle = page.getByRole('button', { name: /^(Menu \+|Fechar −)$/ });
        await toggle.focus();
        await page.keyboard.press('Enter');
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        const navigation = page.getByRole('navigation', { name: 'Principal', exact: true });
        await expect(navigation.getByRole('link', { name: 'Projetos', exact: true })).toBeVisible();
        await expect(navigation.getByRole('group', { name: 'Idioma do site' })).toBeVisible();
        await page.keyboard.press('Tab');
        await page.keyboard.press('Escape');
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(toggle).toBeFocused();
      }
    });
  }
});
