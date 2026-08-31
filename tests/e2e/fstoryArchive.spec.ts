import { expect, test } from '@playwright/test';

test('opens every recovered fstory.net year and switches restore points', async ({ page }) => {
    await page.goto('/ko/atelier?oldpc=true');
    await expect(page.getByRole('button', { name: '1998~2001.07 홈페이지' })).toBeVisible();
    await expect(page.getByRole('button', { name: '2001.09 홈페이지' })).toBeVisible();
    await expect(page.getByRole('button', { name: /1999년 홈페이지/ })).toHaveCount(0);
    await expect(page.getByRole('button', { name: '2002년 홈페이지' })).toBeVisible();
    await expect(page.getByRole('button', { name: '2003년 홈페이지' })).toBeVisible();

    await page.getByRole('button', { name: '2002년 홈페이지' }).click();
    const restorePoint = page.getByRole('combobox', { name: '복원 시점' });
    await expect(restorePoint).toHaveValue('20021128181318');
    await expect(page.locator('iframe[title="Legacy Homepage"]')).toHaveAttribute(
        'src',
        '/fstory-homepage/20021128181318/index.html'
    );

    await restorePoint.selectOption('20030726202839');
    const frame = page.frameLocator('iframe[title="Legacy Homepage"]');
    await expect(frame.locator('body')).toContainText('공지사항이 빠진 녹차');
    await expect(page.locator('.ie-titlebar')).toContainText('2003-07-26');

    await page.screenshot({ path: 'test-results/fstory-archive.png', fullPage: true });
});
