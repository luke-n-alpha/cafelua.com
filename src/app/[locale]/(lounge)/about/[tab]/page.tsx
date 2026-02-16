import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AboutPage from '@/components/AboutPage';

type AboutTab = 'sitemap' | 'alpha' | 'luke';

const VALID_TABS: AboutTab[] = ['sitemap', 'alpha', 'luke'];

const TAB_META: Record<AboutTab, { titleKo: string; descKo: string }> = {
    sitemap: { titleKo: '사이트맵 | 카페루아', descKo: '카페루아 사이트맵: 1층 라운지, 2층 아틀리에, 현관 안내.' },
    alpha: { titleKo: '알파의 인사 | 카페루아', descKo: '카페루아 AI 메이드 알파의 인사말.' },
    luke: { titleKo: '루크의 인사 | 카페루아', descKo: '카페루아 주인장 루크의 인사말.' },
};

export function generateStaticParams() {
    return VALID_TABS.map((tab) => ({ tab }));
}

export function generateMetadata({ params }: { params: { tab: string } }): Metadata {
    const tab = params.tab as AboutTab;
    const meta = TAB_META[tab] ?? TAB_META.sitemap;

    return {
        title: meta.titleKo,
        description: meta.descKo,
        alternates: { canonical: `/about/${tab}/` },
        openGraph: {
            url: `/about/${tab}/`,
            title: meta.titleKo,
            description: meta.descKo,
            images: ['/og-cover.png'],
        },
        twitter: {
            title: meta.titleKo,
            description: meta.descKo,
            images: ['/og-cover.png'],
        },
    };
}

export default function AboutTabPage({ params }: { params: { tab: string } }) {
    const tab = params.tab as AboutTab;

    if (!VALID_TABS.includes(tab)) {
        redirect('/about/sitemap');
    }

    return <AboutPage activeTab={tab} />;
}
