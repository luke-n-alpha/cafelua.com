export interface SitemapItem {
    labelKo: string;
    labelEn: string;
    path: string;
    descKo?: string;
    descEn?: string;
    /**
     * The day this corner's contents last changed, as YYYY-MM-DD. The map puts
     * a NEW badge beside anything changed within the last few weeks, so the
     * badge follows the content rather than being switched on by hand and
     * forgotten. Move the date when something is actually added.
     */
    updatedAt?: string;
}

/** How long a corner keeps its NEW badge after its contents change. */
export const NEW_BADGE_DAYS = 21;

/**
 * The date is a plain day with no timezone, and it is read against UTC. Someone
 * writing today's date in Seoul is up to nine hours ahead of that, so a day of
 * slack on the near side keeps a badge from being invisible on the very day it
 * is added. Anything further out than that is a typo, not a release.
 */
const TIMEZONE_SLACK_DAYS = 1;

export function isRecentlyUpdated(item: SitemapItem, now: Date = new Date()): boolean {
    if (!item.updatedAt) return false;
    const changed = Date.parse(`${item.updatedAt}T00:00:00Z`);
    if (Number.isNaN(changed)) return false;
    const days = (now.getTime() - changed) / 86_400_000;
    return days >= -TIMEZONE_SLACK_DAYS && days <= NEW_BADGE_DAYS;
}

export interface SitemapSection {
    titleKo: string;
    titleEn: string;
    items: SitemapItem[];
}

export const SITEMAP_SECTIONS: SitemapSection[] = [
    {
        titleKo: '1층 라운지',
        titleEn: '1F Lounge',
        items: [
            {
                labelKo: '카페 소개',
                labelEn: 'About Cafe',
                path: '/about/sitemap',
                descKo: '카페루아 소개',
                descEn: 'Introduction to Cafe Lua',
            },
            {
                labelKo: '카운터',
                labelEn: 'Counter',
                path: '/counter',
                descKo: '커피챗(알파와 대화), 타로점',
                descEn: 'Coffee Chat with Alpha, Tarot reading',
            },
            {
                labelKo: '갤러리',
                labelEn: 'Gallery',
                path: '/gallery',
                descKo: '카페루아의 다이어리, 공간, 타로 카드, BGM 감상',
                descEn: 'Browse diary, spaces, tarot cards, and BGM',
            },
            {
                labelKo: '방명록',
                labelEn: 'Guestbook',
                path: '/guestbook',
                descKo: '알파와 루크에게 메시지 남기기',
                descEn: 'Leave a message for Alpha and Luke',
            },
        ],
    },
    {
        titleKo: '2층 아틀리에',
        titleEn: '2F Atelier',
        items: [
            {
                labelKo: '마스터의 데스크',
                labelEn: "Master's Desk",
                path: '/desk',
                descKo: '루크의 글·기타 작업물',
                descEn: "Luke's writings and other works",
            },
            {
                labelKo: '서재',
                labelEn: 'Library',
                path: '/library',
                descKo: '루크가 집필한 소설과 전자책',
                descEn: "Luke's novels and ebooks",
                updatedAt: '2026-09-01',
            },
            {
                labelKo: '낡은 PC',
                labelEn: 'Old PC',
                path: '/atelier',
                descKo: '1997 · 1998 · 2001~2003 홈페이지',
                descEn: '1997, 1998 and 2001-2003 homepages',
                updatedAt: '2026-09-01',
            },
        ],
    },
    {
        titleKo: '현관',
        titleEn: 'Entrance',
        items: [
            {
                labelKo: '정문',
                labelEn: 'Front Door',
                path: '/',
                descKo: '카페루아의 정문 — 계절, 시간, 날씨를 선택하여 입장',
                descEn: 'The front door — choose season, time, and weather',
            },
        ],
    },
];
