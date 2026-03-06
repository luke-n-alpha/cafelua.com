'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import type { DiaryEntry } from '@/data/gallery/diaryData';
import Comments from './Comments';
import './DiaryPost.css';

interface Props {
    entry: DiaryEntry;
}

const DiaryPost: React.FC<Props> = ({ entry }) => {
    const { i18n, t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isKo = i18n.language === 'ko';

    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const len = entry.images.length;

    const title = isKo ? entry.titleKo : entry.titleEn;
    const content = isKo ? entry.contentKo : entry.contentEn;

    const goNext = useCallback(() => {
        if (len <= 1) return;
        setLightboxIdx((prev) => (prev !== null ? (prev + 1) % len : null));
    }, [len]);

    const goPrev = useCallback(() => {
        if (len <= 1) return;
        setLightboxIdx((prev) => (prev !== null ? (prev - 1 + len) % len : null));
    }, [len]);

    // Keyboard navigation
    useEffect(() => {
        if (lightboxIdx === null) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
            else if (e.key === 'Escape') setLightboxIdx(null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxIdx, goNext, goPrev]);

    // Mouse wheel navigation
    useEffect(() => {
        if (lightboxIdx === null) return;
        const el = lightboxRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (e.deltaY > 0 || e.deltaX > 0) goNext();
            else if (e.deltaY < 0 || e.deltaX < 0) goPrev();
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [lightboxIdx, goNext, goPrev]);

    // Arrow up/down to scroll post content
    useEffect(() => {
        if (lightboxIdx !== null) return;
        const el = contentRef.current;
        if (!el) return;
        const handleKey = (e: KeyboardEvent) => {
            const step = 120;
            if (e.key === 'ArrowDown') { e.preventDefault(); el.scrollBy({ top: step, behavior: 'smooth' }); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); el.scrollBy({ top: -step, behavior: 'smooth' }); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxIdx]);

    const handleBack = () => {
        router.push(`/${i18n.language}/gallery?tab=diary`);
    };

    return (
        <div
            className="diary-container"
            style={{ backgroundImage: "url('/gallery-background-img/gallery-cozy-corner.webp')" }}
        >
            <div className="diary-panel">
                <div className="diary-post-header">
                    <h1 className="diary-post-title">{title}</h1>
                    <div className="diary-post-date">{entry.date}</div>
                </div>

                <div ref={contentRef} className="diary-post-content">
                    {content && content.includes('{{IMG:') ? (
                        /* Inline image mode: interleave text and images */
                        (() => {
                            const referencedIndices = new Set<number>();
                            const segments = content.split(/(\{\{IMG:\d+\}\})/);
                            return (
                                <>
                                    {segments.map((seg, si) => {
                                        const match = seg.match(/^\{\{IMG:(\d+)\}\}$/);
                                        if (match) {
                                            const idx = parseInt(match[1], 10);
                                            referencedIndices.add(idx);
                                            const src = entry.images[idx];
                                            if (!src) return null;
                                            return (
                                                <img
                                                    key={`img-${si}`}
                                                    src={src}
                                                    alt={`${title} ${idx + 1}`}
                                                    className="diary-post-img diary-post-img-inline"
                                                    loading="lazy"
                                                    onClick={() => setLightboxIdx(idx)}
                                                />
                                            );
                                        }
                                        if (!seg.trim()) return null;
                                        return (
                                            <div key={`text-${si}`} className="diary-post-text">
                                                {seg.split('\n').map((line, li) => (
                                                    <React.Fragment key={li}>
                                                        {line}
                                                        {li < seg.split('\n').length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        );
                                    })}
                                    {/* Remaining images not referenced by markers */}
                                    {entry.images.length > referencedIndices.size && (
                                        <div className="diary-post-images">
                                            {entry.images.map((src, i) =>
                                                referencedIndices.has(i) ? null : (
                                                    <img
                                                        key={i}
                                                        src={src}
                                                        alt={`${title} ${i + 1}`}
                                                        className="diary-post-img"
                                                        loading="lazy"
                                                        onClick={() => setLightboxIdx(i)}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                                </>
                            );
                        })()
                    ) : (
                        <>
                            {/* Legacy mode: text then images */}
                            {content && (
                                <div className="diary-post-text">
                                    {content.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i < content.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                            {entry.images.length > 0 && (
                                <div className="diary-post-images">
                                    {entry.images.map((src, i) => (
                                        <img
                                            key={i}
                                            src={src}
                                            alt={`${title} ${i + 1}`}
                                            className="diary-post-img"
                                            loading="lazy"
                                            onClick={() => setLightboxIdx(i)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    <Comments postSlug={entry.slug} postType="diary" />

                    <div className="cc-license">
                        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">
                            <img src="https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png" alt="CC BY-NC-SA 4.0" />
                        </a>
                        <span>{isKo
                            ? '이 글은 CC BY-NC-SA 4.0 라이선스로 제공됩니다.'
                            : 'This post is licensed under CC BY-NC-SA 4.0.'
                        }</span>
                    </div>
                </div>

                <button className="diary-back" onClick={handleBack}>
                    {t('gallery.backToGallery')}
                </button>
            </div>

            {/* Lightbox */}
            {lightboxIdx !== null && (
                <div ref={lightboxRef} className="diary-lightbox" onClick={() => setLightboxIdx(null)}>
                    <img
                        src={entry.images[lightboxIdx]}
                        alt={`${title} ${lightboxIdx + 1}`}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {len > 1 && (
                        <>
                            <button
                                className="diary-lb-arrow prev"
                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            >
                                &#8249;
                            </button>
                            <button
                                className="diary-lb-arrow next"
                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                            >
                                &#8250;
                            </button>
                            <div className="diary-lb-counter">
                                {lightboxIdx + 1} / {entry.images.length}
                            </div>
                        </>
                    )}
                    <button className="diary-lb-close" onClick={() => setLightboxIdx(null)}>
                        {t('about.close')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DiaryPost;
