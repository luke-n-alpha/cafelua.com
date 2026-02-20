'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import UnderConstruction from './UnderConstruction';
import { DESK_POSTS, DESK_CATEGORIES, type DeskCategory } from '@/data/desk/deskData';
import './MasterDeskPage.css';

const DEFAULT_DESK_THUMBNAIL = '/master-desk-background-img/master-desk-background.png';
const MISSING_IMAGE_FALLBACK = '/desk/missing-image.webp';

const MasterDeskPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const localeFromPath = pathname.split('/')[1];
    const locale = localeFromPath === 'ko' || localeFromPath === 'en' ? localeFromPath : (i18n.language === 'en' ? 'en' : 'ko');
    const isKo = i18n.language === 'ko';

    const catParam = searchParams.get('cat') as DeskCategory | 'all' | null;
    const validCats = DESK_CATEGORIES.map(c => c.key);
    const initialCat = catParam && validCats.includes(catParam) ? catParam : 'all';
    const initialSearchText = searchParams.get('q') || '';
    const initialSelectedTags = (searchParams.get('tags') || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 1);
    const initialVisibleCount = (() => {
        const raw = Number(searchParams.get('vc') || '24');
        return Number.isFinite(raw) && raw > 0 ? raw : 24;
    })();
    const initialShowAllTags = searchParams.get('tagsOpen') === '1';
    const [category, setCategory] = useState<DeskCategory | 'all'>(initialCat);
    const [showIntro, setShowIntro] = useState(false);
    const [searchText, setSearchText] = useState(initialSearchText);
    const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);
    const [showAllTags, setShowAllTags] = useState(initialShowAllTags);
    const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
    const [isCategoryCollapsed, setIsCategoryCollapsed] = useState(false);
    const [isTagCollapsed, setIsTagCollapsed] = useState(false);
    const scrollRestoreTriedRef = useRef(false);

    useEffect(() => {
        const key = 'cafelua_desk_intro_seen';
        const hasSeen = sessionStorage.getItem(key);
        if (!hasSeen) {
            setShowIntro(true);
        }
    }, []);

    useEffect(() => {
        if (window.matchMedia('(max-width: 768px)').matches) {
            setIsCategoryCollapsed(true);
            setIsTagCollapsed(true);
        }
    }, []);

    const basePosts = category === 'all'
        ? DESK_POSTS
        : DESK_POSTS.filter(p => p.category === category);

    const tagStats = useMemo(() => {
        const map = new Map<string, { count: number; latest: string }>();
        for (const post of basePosts) {
            const date = post.date || '0000-00-00';
            for (const raw of post.tags || []) {
                const tag = raw.trim();
                if (!tag) continue;
                const prev = map.get(tag);
                if (!prev) {
                    map.set(tag, { count: 1, latest: date });
                } else {
                    prev.count += 1;
                    if (date > prev.latest) prev.latest = date;
                    map.set(tag, prev);
                }
            }
        }
        return Array.from(map.entries()).map(([tag, info]) => ({ tag, ...info }));
    }, [basePosts]);
    const availableTags = useMemo(() => tagStats.map((v) => v.tag), [tagStats]);
    const displayTags = useMemo(() => {
        const byCount = [...tagStats].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ko'));
        const byRecent = [...tagStats].sort((a, b) => b.latest.localeCompare(a.latest) || a.tag.localeCompare(b.tag, 'ko'));

        const topCount = byCount.slice(0, showAllTags ? 10 : 5).map((v) => v.tag);
        const recent = byRecent
            .map((v) => v.tag)
            .filter((tag) => !topCount.includes(tag))
            .slice(0, showAllTags ? 10 : 5);
        return [...topCount, ...recent];
    }, [tagStats, showAllTags]);

    useEffect(() => {
        setSelectedTags((prev) => {
            const next = prev.filter((tag) => availableTags.includes(tag));
            if (next.length === prev.length && next.every((v, i) => v === prev[i])) {
                return prev;
            }
            return next;
        });
    }, [availableTags]);

    const filteredPosts = useMemo(() => {
        const q = searchText.trim().toLowerCase();
        return basePosts.filter((post) => {
            if (selectedTags.length > 0) {
                const postTags = (post.tags || []).map((t) => t.trim().toLowerCase()).filter(Boolean);
                const hasAll = selectedTags.every(tag => postTags.includes(tag.toLowerCase()));
                if (!hasAll) return false;
            }
            if (!q) return true;
            const title = (isKo ? post.titleKo : post.titleEn).toLowerCase();
            const tags = (post.tags || []).join(' ').toLowerCase();
            return title.includes(q) || tags.includes(q);
        });
    }, [basePosts, selectedTags, searchText, isKo]);

    const visiblePosts = filteredPosts.slice(0, visibleCount);

    useEffect(() => {
        if (scrollRestoreTriedRef.current) return;
        scrollRestoreTriedRef.current = true;
        const raw = sessionStorage.getItem('cafelua_desk_scroll_y');
        if (!raw) return;
        const y = Number(raw);
        sessionStorage.removeItem('cafelua_desk_scroll_y');
        if (!Number.isFinite(y) || y < 0) return;
        window.requestAnimationFrame(() => {
            window.scrollTo(0, y);
            window.setTimeout(() => window.scrollTo(0, y), 60);
        });
    }, [visiblePosts.length]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (category !== 'all') params.set('cat', category);
        if (searchText.trim()) params.set('q', searchText);
        if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
        if (visibleCount > 24) params.set('vc', String(visibleCount));
        if (showAllTags) params.set('tagsOpen', '1');
        const query = params.toString();
        const url = `/${locale}/desk${query ? `?${query}` : ''}`;
        window.history.replaceState(null, '', url);
    }, [category, locale, searchText, selectedTags, visibleCount, showAllTags]);

    const handleSelectCategory = (cat: DeskCategory | 'all') => {
        setCategory(cat);
        setSelectedTags([]);
        setSearchText('');
        setShowAllTags(false);
        setVisibleCount(24);
    };

    const handlePostClick = (slug: string) => {
        sessionStorage.setItem('cafelua_desk_scroll_y', String(window.scrollY || 0));
        const params = new URLSearchParams();
        if (category !== 'all') params.set('cat', category);
        if (searchText.trim()) params.set('q', searchText);
        if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
        if (visibleCount > 24) params.set('vc', String(visibleCount));
        if (showAllTags) params.set('tagsOpen', '1');
        const query = params.toString();
        router.push(`/${locale}/desk/${slug}${query ? `?${query}` : ''}`);
    };

    const handleBack = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('from', 'desk');
        router.push(`/${locale}/library?${params.toString()}`);
    };

    const categoryBadge = (cat: string) => {
        const found = DESK_CATEGORIES.find(c => c.key === cat);
        return found ? (isKo ? found.labelKo : found.labelEn) : cat;
    };

    const toggleTag = (tag: string) => {
        setVisibleCount(24);
        setSelectedTags((prev) => (prev[0] === tag ? [] : [tag]));
    };

    if (showIntro) {
        return (
            <div className="desk-container">
                <UnderConstruction
                    onClose={() => {
                        sessionStorage.setItem('cafelua_desk_intro_seen', 'true');
                        setShowIntro(false);
                    }}
                    message={t('atelier.masterDeskMessage')}
                    backgroundSrc="/master-desk-background-img/master-desk-background.png"
                    illustrationSrc="/master-desk-background-img/master-desk-background.png"
                    characterSrc="/characters/alpha/alpha-nice-talk.webp"
                    closeLabel={t('atelier.explore')}
                />
            </div>
        );
    }

    return (
        <div className="desk-container">
            <div className="desk-panel">
                <div className="desk-header">
                    <h1 className="desk-title">{t('desk.title')}</h1>
                    <input
                        className="desk-search"
                        placeholder={isKo ? '검색 (제목/태그)' : 'Search (title/tags)'}
                        value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setVisibleCount(24); }}
                    />
                </div>

                {/* Category tabs */}
                <div className="desk-filter-section">
                    <button
                        className="desk-mobile-filter-toggle"
                        aria-expanded={!isCategoryCollapsed}
                        onClick={() => setIsCategoryCollapsed((prev) => !prev)}
                    >
                        {isKo ? '카테고리' : 'Category'} {isCategoryCollapsed ? '▾' : '▴'}
                    </button>
                    <div className={`desk-tabs${isCategoryCollapsed ? ' collapsed' : ''}`}>
                        {DESK_CATEGORIES.map((cat) => (
                            <button
                                key={cat.key}
                                className={`desk-tab${category === cat.key ? ' active' : ''}`}
                                onClick={() => handleSelectCategory(cat.key)}
                            >
                                {isKo ? cat.labelKo : cat.labelEn}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search + Tag filters */}
                {availableTags.length > 0 && (
                    <div className="desk-filter-section">
                        <button
                            className="desk-mobile-filter-toggle"
                            aria-expanded={!isTagCollapsed}
                            onClick={() => setIsTagCollapsed((prev) => !prev)}
                        >
                            {isKo ? '태그' : 'Tags'} {isTagCollapsed ? '▾' : '▴'}
                        </button>
                        <div className={`desk-tags${isTagCollapsed ? ' collapsed' : ''}`}>
                            {displayTags.map((tag) => (
                                <button
                                    key={tag}
                                    className={`desk-tag${selectedTags.includes(tag) ? ' active' : ''}`}
                                    onClick={() => toggleTag(tag)}
                                >
                                    #{tag}
                                </button>
                            ))}
                            {availableTags.length > 10 && (
                                <button
                                    className="desk-tag-toggle"
                                    onClick={() => setShowAllTags((prev) => !prev)}
                                >
                                    {showAllTags ? (isKo ? '접기' : 'Collapse') : (isKo ? '더보기' : 'More')}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Post grid */}
                <div className="desk-content">
                    {filteredPosts.length === 0 ? (
                        <p className="desk-empty">{t('desk.empty')}</p>
                    ) : (
                        <div className="desk-grid">
                            {visiblePosts.map((post) => (
                                <button
                                    key={post.slug}
                                    className="desk-card"
                                    onClick={() => handlePostClick(post.slug)}
                                >
                                    {(post.thumbnail || post.images?.[0] || DEFAULT_DESK_THUMBNAIL) ? (
                                        <img
                                            className="desk-card-thumb"
                                            src={post.thumbnail || post.images?.[0] || DEFAULT_DESK_THUMBNAIL}
                                            alt={isKo ? post.titleKo : post.titleEn}
                                            loading="lazy"
                                            onError={(e) => {
                                                const img = e.currentTarget;
                                                if (img.dataset.fallbackApplied === '1') return;
                                                img.dataset.fallbackApplied = '1';
                                                img.src = MISSING_IMAGE_FALLBACK;
                                            }}
                                        />
                                    ) : (
                                        <div className="desk-card-thumb desk-card-thumb-placeholder" />
                                    )}
                                    <div className="desk-card-info">
                                        <div className="desk-card-title">
                                            {isKo ? post.titleKo : post.titleEn}
                                        </div>
                                        <div className="desk-card-meta">
                                            <span className="desk-card-date">{post.date}</span>
                                            <span className="desk-card-badge">{categoryBadge(post.category)}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                    {filteredPosts.length > visibleCount && (
                        <button
                            className="desk-load-more"
                            onClick={() => setVisibleCount((prev) => prev + 24)}
                        >
                            {isKo ? '더보기' : 'Load more'}
                        </button>
                    )}
                </div>

                <button className="desk-back" onClick={handleBack}>
                    {t('desk.backToAtelier')}
                </button>
            </div>
        </div>
    );
};

export default MasterDeskPage;
