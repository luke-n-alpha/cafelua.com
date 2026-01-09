'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import BackgroundMusic from './BackgroundMusic';
import UnderConstruction from './UnderConstruction';
import './LibraryPage.css';

type LibraryMode = 'menu' | 'booting' | 'desktop' | 'shutdown';
type IeTarget = '1997' | '1998';

const IE_VIEWPORT_WIDTH = 800;
const IE_VIEWPORT_HEIGHT = 600;

const formatClock = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const getIeUrl = (target: IeTarget) => {
    if (target === '1997') return '/1997-homepage/index.html';
    return '/1998-homepage/main.html';
};

const getIeTitle = (target: IeTarget) => {
    if (target === '1997') return 'Internet Explorer - 1997';
    return 'Internet Explorer - 1998';
};

const ScaledLegacyFrame = ({ src }: { src: string }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const updateScale = () => {
            const rect = el.getBoundingClientRect();
            const nextScale = Math.min(
                1,
                rect.width / IE_VIEWPORT_WIDTH,
                rect.height / IE_VIEWPORT_HEIGHT
            );
            setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
        };

        updateScale();

        const ro = new ResizeObserver(updateScale);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const scaledWidth = Math.round(IE_VIEWPORT_WIDTH * scale);
    const scaledHeight = Math.round(IE_VIEWPORT_HEIGHT * scale);

    return (
        <div className="legacy-viewport" ref={containerRef}>
            <div className="legacy-viewport-frame" style={{ width: scaledWidth, height: scaledHeight }}>
                <div className="legacy-viewport-inner" style={{ transform: `scale(${scale})` }}>
                    <iframe
                        className="legacy-iframe"
                        src={src}
                        title="Legacy Homepage"
                        sandbox="allow-scripts"
                    />
                </div>
            </div>
        </div>
    );
};

const LibraryPage: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [showIntro, setShowIntro] = useState(true);
    const [mode, setMode] = useState<LibraryMode>('menu');
    const [ieTarget, setIeTarget] = useState<IeTarget | null>(null);
    const [dialogue, setDialogue] = useState<string | null>(null);
    const [clock, setClock] = useState(() => formatClock(new Date()));
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setClock(formatClock(new Date())), 1000 * 10);
        return () => clearInterval(interval);
    }, []);

    const backgroundImage = useMemo(() => `/library-background-img/library-sunny.webp`, []);

    const handlePowerOn = () => {
        if (mode !== 'menu') return;
        setIeTarget(null);
        setDialogue(null);
        setIsStartMenuOpen(false);
        setMode('booting');
        setTimeout(() => setMode('desktop'), 900);
    };

    const handlePowerOff = () => {
        if (mode !== 'desktop') return;
        setIeTarget(null);
        setDialogue(null);
        setIsStartMenuOpen(false);
        setMode('shutdown');
        setTimeout(() => setMode('menu'), 900);
    };

    const handleMissing1999 = () => {
        setDialogue(t('library.missing1999'));
    };

    return (
        <div
            className="library-container"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
        >
            <BackgroundMusic src="/sounds/library.mp3" />

            {mode === 'menu' && (
                <div className="game-menu">
                    <div className="menu-title">{t('library.title')}</div>

                    <button className="menu-button ui-button ui-button-ghost" onClick={handlePowerOn}>
                        {t('library.powerOnPc')}
                    </button>

                    <button
                        className="menu-button ui-button ui-button-danger exit"
                        onClick={() => router.push('/lounge')}
                    >
                        {t('library.backToLounge')}
                    </button>
                </div>
            )}

            {mode === 'booting' && (
                <div className="library-boot-screen">
                    <div className="library-boot-title">{t('library.bootingTitle')}</div>
                    <div className="library-boot-subtitle">{t('library.bootingSubtitle')}</div>
                </div>
            )}

            {mode === 'shutdown' && (
                <div className="win98-shutdown-screen">
                    <div className="library-boot-screen">
                        <div className="library-boot-title">{t('library.shuttingDownTitle')}</div>
                        <div className="library-boot-subtitle">{t('library.shuttingDownSubtitle')}</div>
                    </div>
                </div>
            )}

            {mode === 'desktop' && (
                <div className="win98-screen">
                    <div className="win98-desktop" onClick={() => setIsStartMenuOpen(false)}>
                        <button
                            type="button"
                            className="win98-icon"
                            onClick={() => {
                                setIsStartMenuOpen(false);
                                setIeTarget('1997');
                            }}
                        >
                            <div className="win98-icon-image" aria-hidden="true" />
                            <div className="win98-icon-label">{t('library.folder1997')}</div>
                        </button>

                        <button
                            type="button"
                            className="win98-icon"
                            onClick={() => {
                                setIsStartMenuOpen(false);
                                setIeTarget('1998');
                            }}
                        >
                            <div className="win98-icon-image" aria-hidden="true" />
                            <div className="win98-icon-label">{t('library.folder1998')}</div>
                        </button>

                        <button
                            type="button"
                            className="win98-icon is-disabled"
                            onClick={handleMissing1999}
                        >
                            <div className="win98-icon-image" aria-hidden="true" />
                            <div className="win98-icon-label">{t('library.folder1999Missing')}</div>
                        </button>
                    </div>

                    <div className="win98-taskbar">
                        <div className="win98-start-container">
                            <button
                                type="button"
                                className="win98-start"
                                onClick={() => setIsStartMenuOpen((prev) => !prev)}
                            >
                                {t('library.start')}
                            </button>

                            {isStartMenuOpen && (
                                <div className="win98-start-menu" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        type="button"
                                        className="win98-start-menu-item"
                                        onClick={handlePowerOff}
                                    >
                                        {t('library.powerOffPc')}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="win98-taskbar-spacer" />
                        <div className="win98-clock">{clock}</div>
                    </div>

                    {ieTarget && (
                        <div className="ie-overlay" onClick={() => setIeTarget(null)}>
                            <div className="ie-window" onClick={(e) => e.stopPropagation()}>
                                <div className="ie-titlebar">
                                    <div>{getIeTitle(ieTarget)}</div>
                                    <div className="ie-controls">
                                        <button
                                            type="button"
                                            className="ie-close"
                                            aria-label={t('library.close')}
                                            onClick={() => setIeTarget(null)}
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                                <div className="ie-toolbar">
                                    <div className="ie-address-label">Address</div>
                                    <input
                                        className="ie-address"
                                        readOnly
                                        value={getIeUrl(ieTarget)}
                                    />
                                </div>
                                <div className="ie-content">
                                    <ScaledLegacyFrame src={getIeUrl(ieTarget)} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showIntro && (
                <UnderConstruction
                    onClose={() => setShowIntro(false)}
                    message={t('library.alphaIntro')}
                    backgroundSrc="/library-background-img/library-sunny.webp"
                    closeLabel={t('library.close')}
                />
            )}

            {dialogue && (
                <UnderConstruction
                    onClose={() => setDialogue(null)}
                    message={dialogue}
                    backgroundSrc="/library-background-img/library-sunny.webp"
                    closeLabel={t('library.close')}
                />
            )}
        </div>
    );
};

export default LibraryPage;
