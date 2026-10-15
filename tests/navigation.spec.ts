import { test, expect } from '@playwright/test';
import { projectGallery } from './support/portfolio';

test('Home smoke: the public Portuguese page exposes its main landmarks and entry points', async ({ page }) => {
  const response = await page.goto('/pt');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle('Thayrine Souza | QA Automation Engineer · SDET');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT');
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Automatizo testes\.\s*Construo ferramentas\.\s*Qualidade desde o início\./);
  await expect(page.getByRole('banner').getByRole('navigation', { name: 'Principal' })).toBeVisible();
  await page.getByRole('link', { name: /^Ver os meus projetos/ }).click();
  await expect(page).toHaveURL(/\/pt#work$/);
  await expect(projectGallery(page)).toBeVisible();
  await expect(page.getByRole('contentinfo')).toContainText('Built & tested by me.');
});

test('Language selection changes the route, content and active language and survives reload', async ({ page }) => {
  await page.goto('/pt');
  const languages = page.getByRole('group', { name: /^(Idioma do site|Website language|Idioma del sitio)$/ });
  for (const choice of [
    { name: 'English', route: '/en', lang: 'en', heading: /I build tools/ },
    { name: 'Português', route: '/pt', lang: 'pt-PT', heading: /Automatizo testes/ },
    { name: 'Español', route: '/es', lang: 'es', heading: /Creo herramientas/ },
  ]) {
    await languages.getByRole('link', { name: choice.name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(choice.route + '$'));
    await expect(page.locator('html')).toHaveAttribute('lang', choice.lang);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(choice.heading);
    await expect(languages.getByRole('link', { name: choice.name, exact: true })).toHaveAttribute('aria-current', 'true');
  }
  await page.reload();
  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(languages.getByRole('link', { name: 'Español' })).toHaveAttribute('aria-current', 'true');
});

test('CV links expose two real PDFs with clear filenames without saving either document', async ({ page, request }) => {
  await page.goto('/pt');
  const control = page.getByRole('banner').getByRole('button', { name: /^Descarregar CV/ });
  await control.focus();
  await page.keyboard.press('Space');
  await expect(control).toHaveAttribute('aria-expanded', 'true');
  const choices = page.getByRole('group', { name: 'Idiomas do CV', exact: true });
  await expect(choices.getByRole('link')).toHaveCount(2);
  await page.keyboard.press('Tab');
  await expect(choices.getByRole('link', { name: 'Português' })).toBeFocused();
  for (const cv of [{ name: 'Português', code: 'PT' }, { name: 'English', code: 'EN' }]) {
    const filename = 'Thayrine-Souza-CV-' + cv.code + '.pdf';
    const link = choices.getByRole('link', { name: cv.name, exact: false });
    await expect(link).toHaveAttribute('href', '/' + filename);
    await expect(link).toHaveAttribute('download', filename);
    // Inspect only response headers and the PDF signature. No file is written.
    const response = await request.get('/' + filename);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    const body = await response.body();
    expect(body.subarray(0, 5).toString('ascii')).toBe('%PDF-');
    await response.dispose();
  }
  await page.keyboard.press('Escape');
  await expect(control).toHaveAttribute('aria-expanded', 'false');
  await expect(control).toBeFocused();
});
