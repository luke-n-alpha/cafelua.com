export interface SitemapItem {
    labelKo: string;
    labelEn: string;
    path: string;
    descKo?: string;
    descEn?: string;
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
                labelKo: '낡은 PC',
                labelEn: 'Old PC',
                path: '/library',
                descKo: '1997/1998 홈페이지',
                descEn: '1997/1998 homepages',
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
