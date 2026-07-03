'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { SITEMAP_SECTIONS } from '@/data/sitemapData';
import { resolveEnvironmentBackgroundSrc, type Season, type TimeOfDay, type Weather } from '@/lib/environmentBackgrounds';
import { buildLocalizedUrlWithQuery } from '@/lib/navigationQuery';
import './AboutModal.css';

type AboutTab = 'sitemap' | 'alpha' | 'luke';

interface AboutModalProps {
    activeTab: AboutTab;
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ activeTab: initialTab, onClose }) => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<AboutTab>(initialTab);
    const isKo = i18n.language === 'ko';
    const season = (searchParams.get('season') || 'spring') as Season;
    const time = (searchParams.get('time') || 'day') as TimeOfDay;
    const weather = (searchParams.get('weather') || 'sunny') as Weather;
    const isChristmas = searchParams.get('christmas') === 'true';
    const backgroundImage = useMemo(() => {
        return resolveEnvironmentBackgroundSrc('about', season, time, weather, isChristmas);
    }, [season, time, weather, isChristmas]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const switchTab = (tab: AboutTab) => {
        setActiveTab(tab);
        const query = searchParams.toString();
        const base = `/${i18n.language}/about/${tab}`;
        const url = query ? `${base}?${query}` : base;
        window.history.pushState(null, '', url);
    };

    const handleNavigate = (path: string) => {
        onClose();
        router.push(buildLocalizedUrlWithQuery(i18n.language, path, searchParams));
    };

    const title = t('about.title', { defaultValue: t('nav.about') });
    const closeLabel = t('about.close', { defaultValue: '닫기' });
    const sitemapTabLabel = t('about.sitemapTab', { defaultValue: '사이트맵' });
    const alphaTabLabel = t('about.alphaTab', { defaultValue: '알파의 인사' });
    const lukeTabLabel = t('about.lukeTab', { defaultValue: '루크의 인사' });
    const loadErrorLabel = t('about.loadError', { defaultValue: '소개글을 불러오지 못했어요.' });
    const alphaBody = t('about.alphaBody', { defaultValue: '' });
    const lukeBody = t('about.lukeBody', { defaultValue: '' });

    const activeBody = useMemo(() => {
        if (activeTab === 'alpha') return alphaBody;
        if (activeTab === 'luke') return lukeBody;
        return '';
    }, [activeTab, alphaBody, lukeBody]);

    return (
        <div className="about-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
            <div className="about-modal-stage" onClick={(e) => e.stopPropagation()}>
                <img
                    src={backgroundImage}
                    alt=""
                    className="about-modal-illustration"
                    aria-hidden="true"
                />
                <div className="about-modal-panel">
                    <div className="about-modal-header">
                        <div className="about-modal-title-row">
                            <h1 className="about-modal-title">{title}</h1>
                            <button className="close-button" onClick={onClose} type="button" aria-label={closeLabel}>×</button>
                        </div>
                        <div className="about-modal-tabs">
                            <button
                                className={`tab-button ${activeTab === 'sitemap' ? 'active' : ''}`}
                                onClick={() => switchTab('sitemap')}
                                type="button"
                            >
                                {sitemapTabLabel}
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'alpha' ? 'active' : ''}`}
                                onClick={() => switchTab('alpha')}
                                type="button"
                            >
                                {alphaTabLabel}
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'luke' ? 'active' : ''}`}
                                onClick={() => switchTab('luke')}
                                type="button"
                            >
                                {lukeTabLabel}
                            </button>
                        </div>
                    </div>

                    <div className="about-modal-scroll">
                        {activeTab === 'sitemap' ? (
                            <div className="about-sitemap">
                                {SITEMAP_SECTIONS.map((section) => (
                                    <div key={section.titleEn} className="about-sitemap-section">
                                        <h2>{isKo ? section.titleKo : section.titleEn}</h2>
                                        <ul className="about-sitemap-list">
                                            {section.items.map((item) => (
                                                <li key={item.path}>
                                                    <button
                                                        className="about-sitemap-link"
                                                        onClick={() => handleNavigate(item.path)}
                                                        type="button"
                                                    >
                                                        <span className="about-sitemap-link-label">
                                                            {isKo ? item.labelKo : item.labelEn}
                                                        </span>
                                                        {(isKo ? item.descKo : item.descEn) && (
                                                            <span className="about-sitemap-link-desc">
                                                                {isKo ? item.descKo : item.descEn}
                                                            </span>
                                                        )}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : activeBody ? (
                            <ReactMarkdown>{activeBody}</ReactMarkdown>
                        ) : (
                            <p className="about-modal-status">{loadErrorLabel}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
