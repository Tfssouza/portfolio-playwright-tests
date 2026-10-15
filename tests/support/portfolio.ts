import type { Page } from '@playwright/test';

// These names describe the public UI contract, not private application internals.
export const projectTitles = [
  'A11y Audit Agent',
  'A11y Radar',
  'Plataforma digital para uma startup de tecnologia',
  'ONE — Sistema interno de operações',
] as const;

export function projectGallery(page: Page) {
  return page.getByRole('region', { name: 'Galeria de projetos', exact: true });
}

export function detailsButton(page: Page) {
  return projectGallery(page).getByRole('button', { name: /^Ver detalhes/ });
}
