'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import './AboutModal.css';

interface AboutModalProps {
    onClose: () => void;
}

type AboutTab = 'alpha' | 'luke';

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<AboutTab>('alpha');

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    useEffect(() => {
        setActiveTab(Math.random() < 0.5 ? 'alpha' : 'luke');
    }, []);

    const title = t('about.title', { defaultValue: t('nav.about') });
    const closeLabel = t('about.close', { defaultValue: '닫기' });
    const alphaTabLabel = t('about.alphaTab', { defaultValue: '알파의 인사' });
    const lukeTabLabel = t('about.lukeTab', { defaultValue: '루크의 인사' });
    const loadErrorLabel = t('about.loadError', { defaultValue: '소개글을 불러오지 못했어요.' });
    const alphaBody = t('about.alphaBody', { defaultValue: '' });
    const lukeBody = t('about.lukeBody', { defaultValue: '' });

    const activeBody = useMemo(() => {
        if (activeTab === 'alpha') return alphaBody;
        return lukeBody;
    }, [activeTab, alphaBody, lukeBody]);

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
                                className={`tab-button ${activeTab === 'alpha' ? 'active' : ''}`}
                                onClick={() => setActiveTab('alpha')}
                                type="button"
                            >
                                {alphaTabLabel}
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'luke' ? 'active' : ''}`}
                                onClick={() => setActiveTab('luke')}
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
