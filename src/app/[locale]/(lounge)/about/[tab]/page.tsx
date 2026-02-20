import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AboutPage from '@/components/AboutPage';

type AboutTab = 'sitemap' | 'alpha' | 'luke';

const VALID_TABS: AboutTab[] = ['sitemap', 'alpha', 'luke'];

const TAB_META: Record<AboutTab, { titleKo: string; titleEn: string; descKo: string; descEn: string }> = {
    sitemap: {
        titleKo: '사이트맵',
        titleEn: 'Sitemap',
        descKo: '카페루아 사이트맵: 1층 라운지, 2층 아틀리에, 현관 안내.',
        descEn: 'Cafe Lua sitemap: 1F lounge, 2F atelier, and entrance guide.',
    },
    alpha: {
        titleKo: '알파의 인사',
        titleEn: "Alpha's Greeting",
        descKo: '카페루아 AI 메이드 알파의 인사말.',
        descEn: "A greeting from Alpha, the AI maid of Cafe Lua.",
    },
    luke: {
        titleKo: '루크의 인사',
        titleEn: "Luke's Greeting",
        descKo: '카페루아 주인장 루크의 인사말.',
        descEn: "A greeting from Luke, the owner of Cafe Lua.",
    },
};

interface Props {
    params: Promise<{ tab: string; locale: string }>;
}

export function generateStaticParams() {
    return VALID_TABS.map((tab) => ({ tab }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { tab, locale } = await params;
    const isEn = locale === 'en';
    const meta = TAB_META[tab as AboutTab] ?? TAB_META.sitemap;

    const title = isEn ? meta.titleEn : meta.titleKo;
    const description = isEn ? meta.descEn : meta.descKo;
    const ogTitle = isEn ? `${meta.titleEn} | CafeLua` : `${meta.titleKo} | 카페루아`;

    return {
        title,
        description,
        alternates: { canonical: `/about/${tab}/` },
        openGraph: {
            url: `/about/${tab}/`,
            title: ogTitle,
            description,
            images: ['/og-cover.png'],
        },
        twitter: {
            title: ogTitle,
            description,
            images: ['/og-cover.png'],
        },
    };
}

export default async function AboutTabPage({ params }: Props) {
    const { tab } = await params;

    if (!VALID_TABS.includes(tab as AboutTab)) {
        redirect('/about/sitemap');
    }

    return <AboutPage activeTab={tab as AboutTab} />;
}
