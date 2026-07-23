import { getDeskPostBySlug } from '@/data/desk/deskLoader';
import { buildDeskPostMetadata } from '@/lib/desk-metadata';

describe('Master Desk post metadata', () => {
    it('keeps the complete Cafe Lua 0.2.0 book titles in Korean and English metadata', () => {
        const slug = '20260723-cafelua-0.2.0-library';
        const post = getDeskPostBySlug(slug);
        const titleKo = '카페루아 0.2.0 업데이트, 2층 서재와 <화성침공 & AI소설 창작법> 공개';
        const titleEn = 'Cafe Lua 0.2.0 Update: The Second-Floor Library and <The Invasion of Mars & AI Fiction Writing>';

        expect(post).toMatchObject({ titleKo, titleEn });

        const metadataKo = buildDeskPostMetadata(post!, 'ko');
        expect(metadataKo.title).toBe(titleKo);
        expect(metadataKo.openGraph).toMatchObject({
            title: `${titleKo} | 마스터의 데스크 · 카페루아`,
            images: [{ alt: titleKo }],
        });
        expect(metadataKo.twitter).toMatchObject({
            title: `${titleKo} | 마스터의 데스크 · 카페루아`,
        });

        const metadataEn = buildDeskPostMetadata(post!, 'en');
        expect(metadataEn.title).toBe(titleEn);
        expect(metadataEn.openGraph).toMatchObject({
            title: `${titleEn} | Master Desk · CafeLua`,
            images: [{ alt: titleEn }],
        });
        expect(metadataEn.twitter).toMatchObject({
            title: `${titleEn} | Master Desk · CafeLua`,
        });
    });

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
