import { expect, test } from '@playwright/test';

test('인트로에서 라운지로 진입한다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /입장하기|click to enter/i })).toBeVisible();
    await page.getByRole('button', { name: /입장하기|click to enter/i }).click();
    await expect(page.getByText(/Cαfé Luα Lounge/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /카페 소개|About Cafe/i })).toBeVisible();
});
