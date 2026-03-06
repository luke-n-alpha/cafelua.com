'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import UnderConstruction from './UnderConstruction';
import {
    SPACE_IMAGES,
    TAROT_CARDS,
    BGM_LIST,
    SPACE_SUBCATEGORIES,
    type GalleryImage,
} from '@/data/gallery/galleryData';
import { DIARY_ENTRIES } from '@/data/gallery/diaryData';
import './GalleryPage.css';

type Category = 'diary' | 'spaces' | 'tarot' | 'bgm';

const GalleryPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isKo = i18n.language === 'ko';

    const tabParam = searchParams.get('tab') as Category | null;
    const subParam = searchParams.get('sub');
    const imgParam = searchParams.get('img');
    const validTabs: Category[] = ['diary', 'spaces', 'tarot', 'bgm'];
    const initialTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'diary';
    const validSubcats = SPACE_SUBCATEGORIES.map(s => s.key);
    const initialSub = subParam && validSubcats.includes(subParam) ? subParam : 'intro';

    const [showGreeting, setShowGreeting] = useState(!tabParam);
    const [category, setCategory] = useState<Category>(initialTab);
    const [spaceSubcat, setSpaceSubcat] = useState(initialSub);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
    const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        fetch('/api/views')
            .then((res) => res.ok ? res.json() : null)
            .then((data) => { if (data?.views) setViewCounts(data.views); })
            .catch(() => {});
    }, []);

    // URL 업데이트 헬퍼 (히스토리 교체, 새로고침 없음)
    const updateUrl = useCallback((params: Record<string, string | null>) => {
        const newParams = new URLSearchParams();
        const current: Record<string, string | null> = {
            tab: category,
            sub: category === 'spaces' ? spaceSubcat : null,
            img: null,
        };
        const merged = { ...current, ...params };
        for (const [k, v] of Object.entries(merged)) {
            if (v != null) newParams.set(k, v);
        }
        const qs = newParams.toString();
        const url = `/${i18n.language}/gallery${qs ? `?${qs}` : ''}`;
        window.history.replaceState(null, '', url);
    }, [category, spaceSubcat, i18n.language]);
    const [playingBgm, setPlayingBgm] = useState<string | null>(null);
    const previewAudioRef = useRef<HTMLAudioElement | null>(null);

    // Touch/wheel handling for carousel
    const touchStartX = useRef(0);
    const touchDeltaX = useRef(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const currentImages = SPACE_IMAGES[spaceSubcat] || [];

    // Reset carousel index when subcategory changes
    useEffect(() => {
        setCarouselIndex(0);
    }, [spaceSubcat]);

    // URL의 img 파라미터로 라이트박스 초기 열기
    useEffect(() => {
        if (imgParam == null || showGreeting) return;
        const idx = parseInt(imgParam, 10);
        if (isNaN(idx) || idx < 0) return;
        if (category === 'spaces') {
            const images = SPACE_IMAGES[spaceSubcat] || [];
            if (idx < images.length) { setLightboxImage(images[idx]); setCarouselIndex(idx); }
        } else if (category === 'tarot') {
            if (idx < TAROT_CARDS.length) setLightboxImage(TAROT_CARDS[idx]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // BGM 미리듣기 정리 (언마운트 시)
    useEffect(() => {
        return () => {
            if (previewAudioRef.current) {
                previewAudioRef.current.pause();
                previewAudioRef.current.src = '';
            }
            window.dispatchEvent(new Event('gallerybgm:resume'));
        };
    }, []);

    const handleBackToLounge = () => {
        if (previewAudioRef.current) {
            previewAudioRef.current.pause();
            previewAudioRef.current.src = '';
        }
        window.dispatchEvent(new Event('gallerybgm:resume'));
        const query = searchParams.toString();
        router.push(query ? `/${i18n.language}/lounge?${query}` : `/${i18n.language}/lounge`);
    };

    // Carousel navigation
    const goTo = useCallback((idx: number) => {
        const len = currentImages.length;
        if (len === 0) return;
        setCarouselIndex(((idx % len) + len) % len);
    }, [currentImages.length]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    };

    const handleTouchEnd = () => {
        if (touchDeltaX.current > 50) goTo(carouselIndex - 1);
        else if (touchDeltaX.current < -50) goTo(carouselIndex + 1);
    };

    // Keyboard left/right arrow navigation
    useEffect(() => {
        if (showGreeting || category !== 'spaces' || lightboxImage) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(carouselIndex - 1); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(carouselIndex + 1); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showGreeting, category, lightboxImage, carouselIndex, goTo]);

    // Mouse wheel navigation on carousel (non-passive to allow preventDefault)
    useEffect(() => {
        const el = carouselRef.current;
        if (!el || showGreeting || category !== 'spaces') return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (e.deltaY > 0 || e.deltaX > 0) goTo(carouselIndex + 1);
            else if (e.deltaY < 0 || e.deltaX < 0) goTo(carouselIndex - 1);
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [showGreeting, category, carouselIndex, goTo]);

    // BGM player (미리듣기 — 레이아웃 BGM 일시정지 후 개별 재생)
    const handlePlayBgm = (src: string) => {
        if (previewAudioRef.current) {
            previewAudioRef.current.pause();
            previewAudioRef.current.src = '';
        }
        if (playingBgm === src) {
            setPlayingBgm(null);
            window.dispatchEvent(new Event('gallerybgm:resume'));
            return;
        }
        window.dispatchEvent(new Event('gallerybgm:suspend'));
        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = 0.4;
        audio.play().catch(() => {});
        previewAudioRef.current = audio;
        setPlayingBgm(src);
    };

    // Greeting screen
    if (showGreeting) {
        return (
            <div className="gallery-container" style={{ backgroundImage: "url('/gallery-background-img/gallery-cozy-corner.webp')" }}>
                <UnderConstruction
                    onClose={() => { setShowGreeting(false); window.history.replaceState(null, '', `/${i18n.language}/gallery?tab=${category}`); }}
                    message={t('gallery.greeting')}
                    backgroundSrc="/gallery-background-img/gallery-cozy-corner.webp"
                    illustrationSrc="/gallery-background-img/gallery-cozy-corner.webp"
                    characterSrc="/characters/alpha/alpha-nice-talk.webp"
                    closeLabel={t('gallery.enter')}
                />
            </div>
        );
    }

    const usedInLabel = (key: string) => {
        const map: Record<string, string> = {
            intro: isKo ? '인트로' : 'Intro',
            lounge: isKo ? '라운지' : 'Lounge',
            atelier: isKo ? '아틀리에' : 'Atelier',
            coffeeChat: isKo ? '커피챗' : 'Coffee Chat',
            tarot: isKo ? '타로' : 'Tarot',
            gallery: isKo ? '갤러리' : 'Gallery',
        };
        return map[key] || key;
    };

    return (
        <div className="gallery-container" style={{ backgroundImage: "url('/gallery-background-img/gallery-cozy-corner.webp')" }}>
            <div className="gallery-panel">
                {/* Category tabs */}
                <div className="gallery-tabs">
                    {(['diary', 'spaces', 'tarot', 'bgm'] as Category[]).map((cat) => (
                        <button
                            key={cat}
                            className={`gallery-tab${category === cat ? ' active' : ''}`}
                            onClick={() => { setCategory(cat); updateUrl({ tab: cat, sub: cat === 'spaces' ? spaceSubcat : null, img: null }); }}
                        >
                            {t(`gallery.${cat === 'tarot' ? 'tarotCards' : cat === 'diary' ? 'diary' : cat}`)}
                        </button>
                    ))}
                </div>

                {/* Content area */}
                <div className="gallery-content">
                    {/* Diary tab */}
                    {category === 'diary' && (
                        <div className="diary-grid">
                            {DIARY_ENTRIES.map((entry) => (
                                <a
                                    key={entry.slug}
                                    className="diary-card"
                                    href={`/${i18n.language}/gallery/diary/${entry.slug}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.push(`/${i18n.language}/gallery/diary/${entry.slug}`);
                                    }}
                                >
                                    {entry.images.length > 0 ? (
                                        <img
                                            className="diary-card-thumb"
                                            src={entry.images[0]}
                                            alt={isKo ? entry.titleKo : entry.titleEn}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="diary-card-thumb diary-card-thumb-placeholder" />
                                    )}
                                    <div className="diary-card-info">
                                        <div className="diary-card-title">
                                            {isKo ? entry.titleKo : entry.titleEn}
                                        </div>
                                        <div className="diary-card-meta">
                                            <span className="diary-card-date">{entry.date}</span>
                                            {(viewCounts[entry.slug] ?? 0) > 0 && (
                                                <span className="diary-card-views"><Eye size={12} /> {viewCounts[entry.slug].toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Spaces tab */}
                    {category === 'spaces' && (
                        <>
                            <div className="gallery-chips">
                                {SPACE_SUBCATEGORIES.map((sub) => (
                                    <button
                                        key={sub.key}
                                        className={`gallery-chip${spaceSubcat === sub.key ? ' active' : ''}`}
                                        onClick={() => { setSpaceSubcat(sub.key); updateUrl({ sub: sub.key, img: null }); }}
                                    >
                                        {isKo ? sub.labelKo : sub.labelEn}
                                    </button>
                                ))}
                            </div>

                            {currentImages.length > 0 && spaceSubcat === 'expression' ? (
                                <div className="character-grid">
                                    {currentImages.map((img, i) => (
                                        <div key={i} className="character-card" onClick={() => { setLightboxImage(img); updateUrl({ img: String(i) }); }}>
                                            <img src={img.src} alt={isKo ? img.titleKo : img.titleEn} loading="lazy" />
                                            <div className="character-card-name">{isKo ? img.titleKo : img.titleEn}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : currentImages.length > 0 && (
                                <div className="carousel-wrapper">
                                    <div
                                        ref={carouselRef}
                                        className={`carousel-viewport${spaceSubcat === 'character' ? ' contain-mode' : ''}`}
                                        onClick={() => { setLightboxImage(currentImages[carouselIndex]); updateUrl({ img: String(carouselIndex) }); }}
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        <img
                                            src={currentImages[carouselIndex].src}
                                            alt={isKo ? currentImages[carouselIndex].titleKo : currentImages[carouselIndex].titleEn}
                                            draggable={false}
                                        />
                                        <button className="carousel-arrow prev" onClick={(e) => { e.stopPropagation(); goTo(carouselIndex - 1); }}>&#8249;</button>
                                        <button className="carousel-arrow next" onClick={(e) => { e.stopPropagation(); goTo(carouselIndex + 1); }}>&#8250;</button>
                                    </div>
                                    <div className="carousel-caption">
                                        {isKo ? currentImages[carouselIndex].titleKo : currentImages[carouselIndex].titleEn}
                                    </div>
                                    <div className="carousel-counter">
                                        {carouselIndex + 1} / {currentImages.length}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Tarot tab */}
                    {category === 'tarot' && (
                        <div className="tarot-grid">
                            {TAROT_CARDS.map((card, i) => (
                                <div
                                    key={i}
                                    className="tarot-card-item"
                                    onClick={() => { setLightboxImage(card); updateUrl({ img: String(i) }); }}
                                >
                                    <img
                                        src={card.src}
                                        alt={isKo ? card.titleKo : card.titleEn}
                                        loading="lazy"
                                    />
                                    <div className="tarot-card-name">
                                        {isKo ? card.titleKo : card.titleEn}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* BGM tab */}
                    {category === 'bgm' && (
                        <div className="bgm-list">
                            {BGM_LIST.map((bgm) => (
                                <div
                                    key={bgm.src}
                                    className={`bgm-card${playingBgm === bgm.src ? ' playing' : ''}`}
                                >
                                    <button
                                        className="bgm-play-btn"
                                        onClick={() => handlePlayBgm(bgm.src)}
                                    >
                                        {playingBgm === bgm.src ? '⏸' : '▶'}
                                    </button>
                                    <div className="bgm-info">
                                        <div className="bgm-title">
                                            {isKo ? bgm.titleKo : bgm.titleEn}
                                            {playingBgm === bgm.src && (
                                                <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', opacity: 0.6 }}>
                                                    {t('gallery.nowPlaying')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="bgm-desc">
                                            {isKo ? bgm.descKo : bgm.descEn}
                                        </div>
                                    </div>
                                    <span className="bgm-badge">
                                        {t('gallery.usedIn')}: {usedInLabel(bgm.usedIn)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Back to lounge */}
                <button className="gallery-back" onClick={handleBackToLounge}>
                    {t('gallery.backToLounge')}
                </button>
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <div className="lightbox-overlay" onClick={() => { setLightboxImage(null); updateUrl({ img: null }); }}>
                    <img
                        src={lightboxImage.src}
                        alt={isKo ? lightboxImage.titleKo : lightboxImage.titleEn}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="lightbox-info">
                        <div className="lightbox-title">
                            {isKo ? lightboxImage.titleKo : lightboxImage.titleEn}
                        </div>
                        <div className="lightbox-desc">
                            {isKo ? lightboxImage.descKo : lightboxImage.descEn}
                        </div>
                    </div>
                    <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); setLightboxImage(null); updateUrl({ img: null }); }}>
                        {t('about.close')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
