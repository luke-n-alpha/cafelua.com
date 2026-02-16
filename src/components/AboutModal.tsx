'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import './AboutModal.css';

type AboutTab = 'sitemap' | 'alpha' | 'luke';

interface AboutModalProps {
    activeTab: AboutTab;
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ activeTab: initialTab, onClose }) => {
    const { t, i18n } = useTranslation();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<AboutTab>(initialTab);

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

    const title = t('about.title', { defaultValue: t('nav.about') });
    const closeLabel = t('about.close', { defaultValue: '닫기' });
    const sitemapTabLabel = t('about.sitemapTab', { defaultValue: '사이트맵' });
    const alphaTabLabel = t('about.alphaTab', { defaultValue: '알파의 인사' });
    const lukeTabLabel = t('about.lukeTab', { defaultValue: '루크의 인사' });
    const loadErrorLabel = t('about.loadError', { defaultValue: '소개글을 불러오지 못했어요.' });
    const sitemapBody = t('about.sitemapBody', { defaultValue: '' });
    const alphaBody = t('about.alphaBody', { defaultValue: '' });
    const lukeBody = t('about.lukeBody', { defaultValue: '' });

    const activeBody = useMemo(() => {
        if (activeTab === 'sitemap') return sitemapBody;
        if (activeTab === 'alpha') return alphaBody;
        return lukeBody;
    }, [activeTab, sitemapBody, alphaBody, lukeBody]);

    return (
        <div className="about-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
            <div className="about-modal-stage" onClick={(e) => e.stopPropagation()}>
                <img
                    src="/ui/about-modal-bg.webp"
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
                        {activeBody ? (
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
