import { expect, test } from '@playwright/test';

test('1998 홈페이지 메뉴가 frame2로 이동한다', async ({ page }) => {
    await page.goto('/atelier');

    await page.getByRole('button', { name: /둘러보기|Explore/i }).click();
    await page.getByRole('button', { name: /낡은 PC|Old PC/i }).click();

    await page.getByRole('button', { name: /1998~2001\.07 홈페이지|1998–2001\.07 Homepage/i }).click();
    await expect(page.locator('.ie-window')).toBeVisible();

    const iframeHandle = await page.locator('iframe[title="Legacy Homepage"]').elementHandle();
    const legacyFrame = await iframeHandle?.contentFrame();
    expect(legacyFrame, 'Legacy iframe frame').toBeTruthy();

    await legacyFrame!.goto('/1998-homepage/main.html');
    await expect.poll(() => legacyFrame!.url()).toContain('/1998-homepage/main.html');

    const getChildFrame = async (name: string) => {
        return await expect.poll(() => legacyFrame!.childFrames().find((frame) => frame.name() === name) ?? null).toBeTruthy()
            .then(() => legacyFrame!.childFrames().find((frame) => frame.name() === name)!);
    };

    const menuFrame = await getChildFrame('frame1');
    const contentFrame = await getChildFrame('frame2');

    const menuToPath = [
        { alt: '공지사항', path: '/1998-homepage/notice/notice.html' },
        { alt: '나와 우리 가족 소개', path: '/1998-homepage/profile/profile.html' },
        { alt: '내가 컴퓨터에 끄적인거', path: '/1998-homepage/gallery/gallery.html' },
        { alt: '심심해서 끄적였던 소설', path: '/1998-homepage/mydoc/novel/novel.html' },
        { alt: '가끔씩 썼던 짧은글', path: '/1998-homepage/mydoc/poem/poem.html' },
        { alt: '게시판', path: '/1998-homepage/bbs/bbs.html' }
    ];

    for (const { alt, path } of menuToPath) {
        await menuFrame.getByAltText(alt).click();
        await expect.poll(() => contentFrame.url()).toContain(path);
    }
});
