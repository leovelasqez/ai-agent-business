import { test, expect } from '@playwright/test';
import path from 'node:path';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('mockforge-lang');
  });
});

test.describe('MockForge smoke flow', () => {
  test('homepage language toggle works', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /start free|empieza gratis/i })).toBeVisible();

    const langToggle = page.getByRole('button', { name: /switch to spanish|cambiar a español/i });
    await langToggle.click();

    await expect(page.getByRole('link', { name: /empieza gratis/i })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: /^cómo funciona$/i })).toBeVisible();
  });

  test('upload form controls work and preset selection updates', async ({ page }) => {
    await page.goto('/upload');

    const langToggle = page.getByRole('button', { name: /switch to spanish|cambiar a español/i });
    await langToggle.click();

    await expect(page.getByText(/sube tu producto/i)).toBeVisible();
    await expect(page.getByText(/detalles del producto/i)).toBeVisible();

    const imagePath = path.resolve('/tmp/mockforge-real.png');
    await page.locator('input[type="file"]').setInputFiles(imagePath);

    await expect(page.getByText(/mockforge-real\.png/i)).toBeVisible();

    const formatSelect = page.locator('select').first();
    await formatSelect.selectOption('4:5 portrait');
    await expect(formatSelect).toHaveValue('4:5 portrait');

    const customVariantCard = page.getByRole('button', { name: /d\s*·\s*personalizado/i });
    await customVariantCard.click();

    const modelSelect = page.locator('select').nth(1);
    await expect(modelSelect).toBeVisible();
    await modelSelect.selectOption({ index: 1 });
    await expect(modelSelect).not.toHaveValue('');

    const lifestyleLabel = page.locator('label').filter({ hasText: /lifestyle/i }).first();
    await lifestyleLabel.click();
    await expect(lifestyleLabel.locator('input[type="radio"]')).toBeChecked();
  });
});
