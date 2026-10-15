import { test, expect } from '@playwright/test';
import { projectGallery, projectTitles } from './support/portfolio';

test('The project carousel visits all four projects and wraps in both directions', async ({ page }) => {
  await page.goto('/pt');
  const gallery = projectGallery(page);
  const heading = gallery.getByRole('heading', { level: 3 });
  const counter = gallery.getByRole('status');
  await expect(heading).toHaveText(projectTitles[0]);
  await expect(counter).toContainText('01 / 04');
  // Desktop has side arrows and lower controls with the same accessible name.
  // Either advances the same carousel; the first visible control is selected.
  const next = gallery.getByRole('button', { name: 'Próximo projeto', exact: true }).first();
  for (const title of [...projectTitles.slice(1), projectTitles[0]]) {
    await next.click();
    await expect(heading).toHaveText(title);
  }
  await expect(counter).toContainText('01 / 04');
  await gallery.getByRole('button', { name: 'Projeto anterior', exact: true }).first().click();
  await expect(heading).toHaveText(projectTitles[3]);
  await expect(counter).toContainText('04 / 04');
});
