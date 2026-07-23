import { getDeskPostBySlug } from '@/data/desk/deskLoader';
import { buildDeskPostMetadata } from '@/lib/desk-metadata';

describe('Master Desk post metadata', () => {
    it('publishes the post as an article with its own URL and hero image', async () => {
        const slug = '20260712-bigtech-harness-loop-critique';
        const post = getDeskPostBySlug(slug);

        expect(post).toBeDefined();
        const metadata = buildDeskPostMetadata(post!, 'ko');

        expect(metadata.alternates?.canonical).toBe(`/ko/desk/${slug}/`);
        expect(metadata.openGraph).toMatchObject({
            type: 'article',
            url: `/ko/desk/${slug}/`,
            locale: 'ko_KR',
            siteName: '카페루아',
            publishedTime: '2026-07-12T00:00:00.000Z',
            authors: ['Luke Yang'],
            images: [
                {
                    url: '/desk/20260712-bigtech-harness-loop-critique/hero-harness-control.webp',
                },
            ],
        });
        expect(metadata.twitter).toMatchObject({
            card: 'summary_large_image',
            images: ['/desk/20260712-bigtech-harness-loop-critique/hero-harness-control.webp'],
        });
    });
});
