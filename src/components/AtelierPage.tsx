'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import BackgroundMusic from './BackgroundMusic';
import UnderConstruction from './UnderConstruction';
import { LegacyMidiSynthPlayer } from '../services/LegacyMidiSynth';
import './AtelierPage.css';
import {
    getPreloadBackgrounds,
    resolveEnvironmentMood,
    resolveEnvironmentBackgroundSrc,
    type Season,
    type TimeOfDay,
    type Weather,
} from '../lib/environmentBackgrounds';
import { buildLocalizedUrlWithQuery } from '@/lib/navigationQuery';
import {
    FSTORY_ANNEXES,
    FSTORY_CURATED_EDITIONS,
    FSTORY_EDITIONS,
    FSTORY_MERGED_EDITION,
    type FstoryCaptureId,
} from '@/data/fstoryArchive';

type LibraryMode = 'menu' | 'booting' | 'desktop' | 'shutdown';
// An edition is addressed by the folder it is published in, which is its
// representative capture. The picker offers editions, never individual captures.
type FstoryEditionDirectory = FstoryCaptureId | typeof FSTORY_MERGED_EDITION.directory;
type IeTarget = '1997' | '1998' | FstoryEditionDirectory | `annex:${string}`;

type IeHistoryContext = 'iframe' | 'frame2';

type IeHistoryEntry = {
    context: IeHistoryContext;
    path: string;
};

const DEFAULT_IE_VIEWPORT = { width: 1024, height: 768 };
const IE_VIEWPORTS: Partial<Record<IeTarget, { width: number; height: number }>> = {
    '1997': DEFAULT_IE_VIEWPORT,
    '1998': { width: 800, height: 600 }
};

// The desktop opens by year and lands on the edition that was current then.
// Every capture of that design is already merged into it, so the picker offers
// six editions of the site rather than nine visits by the crawler.
// The ver 2.0 era is one edition now, so it wears one icon: 2002년 홈페이지.
// Three icons for 2001, 2002 and 2003 all opened this same merged edition,
// which read as three different sites. The map is kept because the restore
// point list still speaks in years.
const FSTORY_YEAR_ENTRY: Record<'2001' | '2002' | '2003', FstoryEditionDirectory> = {
    '2001': FSTORY_MERGED_EDITION.directory,
    '2002': FSTORY_MERGED_EDITION.directory,
    '2003': FSTORY_MERGED_EDITION.directory,
};

const FSTORY_EDITION_BY_DIRECTORY = new Map<string, { label: string; period: string }>([
    ...FSTORY_EDITIONS.map((edition) => [edition.directory as string, edition] as const),
    [FSTORY_MERGED_EDITION.directory, FSTORY_MERGED_EDITION] as const,
]);

// Annexes are the addresses the site lived at before fstory.net. Nothing on the
// later pages links back to them, so they get their own entry in the picker.
const ANNEX_BY_ID = new Map<string, (typeof FSTORY_ANNEXES)[number]>(
    FSTORY_ANNEXES.map((annex) => [`annex:${annex.id}`, annex])
);

// The restore-point list covers the whole timeline, so the two curated editions
// belong to it as much as the archived ones.
const CURATED_BY_ID = new Map(FSTORY_CURATED_EDITIONS.map((edition) => [edition.id, edition]));
const CURATED_TARGET: Record<string, IeTarget> = { C1997: '1997', C1998: '1998' };
const TARGET_TO_CURATED: Record<string, string> = { '1997': 'C1997', '1998': 'C1998' };

const isFstorySnapshot = (target: IeTarget): target is FstoryEditionDirectory =>
    FSTORY_EDITION_BY_DIRECTORY.has(target as FstoryEditionDirectory)
    || ANNEX_BY_ID.has(target)
    || target === '1997'
    || target === '1998';

const formatClock = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const getIeUrl = (target: IeTarget) => {
    if (target === '1997') return '/1997-homepage/index.html';
    if (target === '1998') return '/1998-homepage/index.html';
    const annex = ANNEX_BY_ID.get(target);
    if (annex) return `/fstory-homepage/${annex.snapshot}/${annex.entry}`;
    return `/fstory-homepage/${target}/index.html`;
};

const getIeTitle = (target: IeTarget) => {
    const curated = CURATED_BY_ID.get(TARGET_TO_CURATED[target] ?? '');
    if (curated) return `Internet Explorer - ${curated.label} (${curated.period})`;
    const annex = ANNEX_BY_ID.get(target);
    if (annex) return `Internet Explorer - ${annex.label} (${annex.period})`;
    const edition = FSTORY_EDITION_BY_DIRECTORY.get(target);
    return `Internet Explorer - fstory.net ${edition ? `${edition.label} (${edition.period})` : target}`;
};

const ScaledLegacyFrame = ({
    src,
    iframeRef,
    onLoad,
    viewportWidth,
    viewportHeight,
    maxScale = 1,
    fitMode = 'contain'
}: {
    src: string;
    iframeRef: React.MutableRefObject<HTMLIFrameElement | null>;
    onLoad: () => void;
    viewportWidth: number;
    viewportHeight: number;
    maxScale?: number;
    fitMode?: 'contain' | 'heightOnNarrow';
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const updateScale = () => {
            const rect = el.getBoundingClientRect();
            const fitScale = Math.min(
                maxScale,
                rect.width / viewportWidth,
                rect.height / viewportHeight
            );
            const nextScale = fitMode === 'heightOnNarrow' && rect.width < 520
                ? Math.min(maxScale, rect.height / viewportHeight)
                : fitScale;
            setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
        };

        updateScale();

        const ro = new ResizeObserver(updateScale);
        ro.observe(el);
        return () => ro.disconnect();
    }, [viewportWidth, viewportHeight, maxScale, fitMode]);

    const scaledWidth = Math.round(viewportWidth * scale);
    const scaledHeight = Math.round(viewportHeight * scale);

    return (
        <div className="legacy-viewport" ref={containerRef}>
            <div className="legacy-viewport-frame" style={{ width: scaledWidth, height: scaledHeight }}>
                <div
                    className="legacy-viewport-inner"
                    style={{
                        width: viewportWidth,
                        height: viewportHeight,
                        transform: `scale(${scale})`
                    }}
                >
                    <iframe
                        className="legacy-iframe"
                        src={src}
                        title="Legacy Homepage"
                        style={{ width: viewportWidth, height: viewportHeight }}
                        ref={(node) => {
                            iframeRef.current = node;
                        }}
                        onLoad={onLoad}
                    />
                </div>
            </div>
        </div>
    );
};

const AtelierPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const localeFromPath = pathname.split('/')[1];
    const locale = localeFromPath === 'ko' || localeFromPath === 'en' ? localeFromPath : (i18n.language.startsWith('en') ? 'en' : 'ko');
    const [showIntro, setShowIntro] = useState(true);
    const [mode, setMode] = useState<LibraryMode>('menu');
    const [ieTarget, setIeTarget] = useState<IeTarget | null>(null);
    const [ieAddress, setIeAddress] = useState<string>('');
    const [canIeGoBack, setCanIeGoBack] = useState(false);
    const [isIeInaccessible, setIsIeInaccessible] = useState(false);
    const [isLegacyMidiActive, setIsLegacyMidiActive] = useState(false);
    const [dialogue, setDialogue] = useState<string | null>(null);
    const [clock, setClock] = useState(() => formatClock(new Date()));
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const legacyIframeRef = useRef<HTMLIFrameElement | null>(null);
    const ieHistoryRef = useRef<IeHistoryEntry[]>([]);
    const frame2ListenerRef = useRef<{ frame: HTMLFrameElement; handler: () => void } | null>(null);
    const startupAudioRef = useRef<HTMLAudioElement | null>(null);
    const shutdownAudioRef = useRef<HTMLAudioElement | null>(null);
    const legacyMidiPlayerRef = useRef<LegacyMidiSynthPlayer | null>(null);
    const shouldAutoBootOldPc = searchParams.get('oldpc') === 'true';

    useEffect(() => {
        if (i18n.language !== locale) {
            void i18n.changeLanguage(locale);
        }
    }, [i18n, locale]);

    useEffect(() => {
        if (!shouldAutoBootOldPc) return;
        setShowIntro(false);
        setDialogue(null);
        setIsStartMenuOpen(false);
        setMode('booting');
        const timerId = window.setTimeout(() => setMode('desktop'), 900);
        return () => window.clearTimeout(timerId);
    }, [shouldAutoBootOldPc]);
    const season = (searchParams.get('season') as Season) || 'spring';
    const time = (searchParams.get('time') as TimeOfDay) || 'day';
    const weather = (searchParams.get('weather') as Weather) || 'sunny';
    const isChristmas = searchParams.get('christmas') === 'true';

    useEffect(() => {
        const interval = setInterval(() => setClock(formatClock(new Date())), 1000 * 10);
        return () => clearInterval(interval);
    }, []);

    const backgroundImage = useMemo(() => {
        return resolveEnvironmentBackgroundSrc('atelier', season, time, weather, isChristmas);
    }, [season, time, weather, isChristmas]);

    const greetingVariant = resolveEnvironmentMood('atelier', season, time, weather, isChristmas);
    const entrySource = searchParams.get('from');
    const greetingMessage = entrySource === 'lounge'
        ? t('atelier.stairsIntro', {
            defaultValue: t('atelier.alphaIntro')
        })
        : t(`atelier.greeting.${greetingVariant}`, { defaultValue: t('atelier.alphaIntro') });

    const legacyMidiSrc = useMemo(() => {
        if (!ieTarget) return null;
        if (ieTarget === '1997') return '/1997-homepage/music/back1.mid';
        if (ieTarget === '1998') return '/1998-homepage/music/Totoro%27.mid';
        return null;
    }, [ieTarget]);

    // ver 2.0 통합본은 자기 BGM 플레이어를 들고 있다. 1997·1998년판은 미디를
    // 이 쪽에서 틀어 주므로 이미 사이트 음악이 멈추지만, 통합본은 옛 페이지가
    // 직접 소리를 내는 터라 그대로 두면 두 음악이 겹친다.
    const legacyPageHasOwnAudio = ieTarget === FSTORY_MERGED_EDITION.directory;

    const ieViewport = useMemo(() => {
        if (!ieTarget) return DEFAULT_IE_VIEWPORT;
        return IE_VIEWPORTS[ieTarget] ?? DEFAULT_IE_VIEWPORT;
    }, [ieTarget]);

    const ieMaxScale = useMemo(() => {
        if (ieTarget === '1998') return 1.35;
        return 1;
    }, [ieTarget]);

    const ieFitMode: 'contain' | 'heightOnNarrow' = 'contain';

    // Preload all atelier images
    useEffect(() => {
        getPreloadBackgrounds('atelier').forEach(src => {
            const i = new Image();
            i.src = src;
        });
    }, []);

    useEffect(() => {
        legacyMidiPlayerRef.current = new LegacyMidiSynthPlayer();
        return () => {
            legacyMidiPlayerRef.current?.stop();
        };
    }, []);

    useEffect(() => {
        const player = legacyMidiPlayerRef.current;
        if (!player) return;

        player.stop();
        setIsLegacyMidiActive(false);

        if (!legacyMidiSrc) return;

        let canceled = false;
        let retryHandler: ((e?: Event) => void) | null = null;

        const attemptStart = async () => {
            try {
                const isMuted = localStorage.getItem('cafelua_bgm_muted') === 'true';
                if (isMuted) return false;
            } catch {
                // If localStorage is blocked/unavailable, allow playback attempts.
            }

            const started = await player.start(legacyMidiSrc, {
                onEnded: () => {
                    if (canceled) return;
                    setIsLegacyMidiActive(false);
                }
            });
            if (canceled) {
                player.stop();
                return false;
            }

            setIsLegacyMidiActive(started);
            return started;
        };

        void attemptStart().then((started) => {
            if (canceled || started) return;

            const handler = async () => {
                const startedNow = await attemptStart();
                if (!startedNow) return;
                if (!retryHandler) return;
                window.removeEventListener('click', retryHandler);
                window.removeEventListener('keydown', retryHandler);
                retryHandler = null;
            };

            retryHandler = handler;
            window.addEventListener('click', retryHandler);
            window.addEventListener('keydown', retryHandler);
        });

        return () => {
            canceled = true;
            player.stop();
            if (retryHandler) {
                window.removeEventListener('click', retryHandler);
                window.removeEventListener('keydown', retryHandler);
            }
        };
    }, [legacyMidiSrc]);

    const cleanupFrame2Listener = () => {
        const current = frame2ListenerRef.current;
        if (!current) return;

        current.frame.removeEventListener('load', current.handler);
        frame2ListenerRef.current = null;
    };

    useEffect(() => {
        cleanupFrame2Listener();
        if (!ieTarget) {
            ieHistoryRef.current = [];
            setIeAddress('');
            setCanIeGoBack(false);
            setIsIeInaccessible(false);
            return;
        }

        const startPath = getIeUrl(ieTarget);
        ieHistoryRef.current = [{ context: 'iframe', path: startPath }];
        setIeAddress(startPath);
        setCanIeGoBack(false);
        setIsIeInaccessible(false);
    }, [ieTarget]);

    useEffect(() => {
        return () => {
            const current = frame2ListenerRef.current;
            if (!current) return;
            current.frame.removeEventListener('load', current.handler);
            frame2ListenerRef.current = null;
        };
    }, []);

    const registerIeNavigation = (context: IeHistoryContext, path: string) => {
        const stack = ieHistoryRef.current;
        const last = stack[stack.length - 1];

        setIsIeInaccessible(false);
        if (last && last.context === context && last.path === path) {
            setIeAddress(path);
            setCanIeGoBack(stack.length > 1);
            return;
        }

        stack.push({ context, path });

        const MAX_STACK = 50;
        if (stack.length > MAX_STACK) {
            stack.splice(0, stack.length - MAX_STACK);
        }

        setIeAddress(path);
        setCanIeGoBack(stack.length > 1);
    };

    const getFrame2Window = () => {
        const iframe = legacyIframeRef.current;
        if (!iframe) return null;

        const win = iframe.contentWindow;
        if (!win) return null;

        try {
            const frameEl = win.document.querySelector('frame[name="frame2"]') as HTMLFrameElement | null;
            return frameEl?.contentWindow ?? null;
        } catch {
            return null;
        }
    };

    const handleIeLoad = () => {
        const iframe = legacyIframeRef.current;
        if (!iframe) return;

        try {
            const location = iframe.contentWindow?.location;
            if (location) {
                registerIeNavigation('iframe', `${location.pathname}${location.search}${location.hash}`);
            }
        } catch {
            cleanupFrame2Listener();
            setIsIeInaccessible(true);
            const stack = ieHistoryRef.current;
            setCanIeGoBack(stack.length > 0);
        }

        const win = iframe.contentWindow;
        if (!win) return;

        try {
            const frameEl = win.document.querySelector('frame[name="frame2"]') as HTMLFrameElement | null;
            if (!frameEl) {
                cleanupFrame2Listener();
                return;
            }

            const existing = frame2ListenerRef.current;
            if (existing && existing.frame === frameEl) return;

            if (existing) {
                existing.frame.removeEventListener('load', existing.handler);
                frame2ListenerRef.current = null;
            }

            const handler = () => {
                const frameWin = getFrame2Window();
                if (!frameWin) return;

                try {
                    const loc = frameWin.location;
                    registerIeNavigation('frame2', `${loc.pathname}${loc.search}${loc.hash}`);
                } catch {
                    setIsIeInaccessible(true);
                    const stack = ieHistoryRef.current;
                    setCanIeGoBack(stack.length > 0);
                }
            };

            frameEl.addEventListener('load', handler);
            frame2ListenerRef.current = { frame: frameEl, handler };
        } catch {
            // ignore
        }
    };

    const navigateIeTo = (entry: IeHistoryEntry) => {
        const iframe = legacyIframeRef.current;
        if (!iframe) return;

        if (entry.context === 'frame2') {
            const frameWin = getFrame2Window();
            if (frameWin) {
                try {
                    frameWin.location.replace(entry.path);
                    return;
                } catch {
                    // ignore
                }
            }
        }

        try {
            iframe.contentWindow?.location.replace(entry.path);
            return;
        } catch {
            // ignore
        }

        iframe.src = entry.path;
    };

    const handleIeBack = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const stack = ieHistoryRef.current;
        if (stack.length === 0) return;

        if (isIeInaccessible) {
            const lastKnown = stack[stack.length - 1];
            if (!lastKnown) return;
            setIeAddress(lastKnown.path);
            setIsIeInaccessible(false);
            setCanIeGoBack(stack.length > 1);
            navigateIeTo(lastKnown);
            return;
        }

        if (stack.length <= 1) return;

        stack.pop();
        const prev = stack[stack.length - 1];
        if (!prev) return;

        setIeAddress(prev.path);
        setCanIeGoBack(stack.length > 1);
        navigateIeTo(prev);
    };

    const playSfx = (audio: HTMLAudioElement | null) => {
        if (!audio) return;

        try {
            const isMuted = localStorage.getItem('cafelua_bgm_muted') === 'true';
            if (isMuted) return;
        } catch {
            // If localStorage is blocked/unavailable, allow SFX attempts.
        }

        try {
            audio.currentTime = 0;
            audio.volume = 0.7;
            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    // Ignore playback errors (unsupported formats, autoplay policies, etc).
                });
            }
        } catch {
            // Ignore playback errors (browser autoplay policies, etc).
        }
    };

    const handlePowerOn = () => {
        if (mode !== 'menu') return;
        setIeTarget(null);
        setDialogue(null);
        setIsStartMenuOpen(false);
        playSfx(startupAudioRef.current);
        setMode('booting');
        setTimeout(() => setMode('desktop'), 900);
    };

    const handlePowerOff = () => {
        if (mode !== 'desktop') return;
        setIeTarget(null);
        setDialogue(null);
        setIsStartMenuOpen(false);
        playSfx(shutdownAudioRef.current);
        setMode('shutdown');
        setTimeout(() => setMode('menu'), 900);
    };

    const handleMenuNotReady = (message: string) => {
        setDialogue(message);
    };

    const handleBackToLounge = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('from', 'atelier');
        router.push(`/${locale}/lounge?${params.toString()}`);
    };

    return (
        <div
            className="library-container"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
        >
            <BackgroundMusic
                src="/sounds/atelier.mp3"
                hideUi={mode !== 'menu'}
                suspended={isLegacyMidiActive || legacyPageHasOwnAudio}
            />
            <audio ref={startupAudioRef} src="/sounds/windows-startup.mp3" preload="auto" />
            <audio ref={shutdownAudioRef} src="/sounds/windows-shutdown.mp3" preload="auto" />

            {mode === 'menu' && (
                <div className="game-menu">
                    <div className="menu-title">{t('atelier.title')}</div>

                    <button
                        className="menu-button ui-button ui-button-ghost"
                        onClick={() => router.push(buildLocalizedUrlWithQuery(locale, '/desk', searchParams))}
                    >
                        {t('atelier.masterDesk')}
                    </button>
                    <button
                        className="menu-button ui-button ui-button-ghost"
                        onClick={() => handleMenuNotReady(t('atelier.alphaStationMessage'))}
                    >
                        {t('atelier.alphaStation')}
                    </button>
                    <button
                        className="menu-button ui-button ui-button-ghost"
                        onClick={() => router.push(buildLocalizedUrlWithQuery(locale, '/library', searchParams))}
                    >
                        {t('atelier.library')}
                    </button>
                    <button
                        className="menu-button ui-button ui-button-ghost"
                        onClick={() => handleMenuNotReady(t('atelier.terraceMessage'))}
                    >
                        {t('atelier.terrace')}
                    </button>

                    <button className="menu-button ui-button ui-button-ghost" onClick={handlePowerOn}>
                        {t('atelier.oldPc')}
                    </button>

                    <button
                        className="menu-button ui-button ui-button-danger exit"
                        onClick={handleBackToLounge}
                    >
                        {t('atelier.backToLounge')}
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
                            className="win98-icon"
                            onClick={() => {
                                setIsStartMenuOpen(false);
                                setIeTarget(FSTORY_YEAR_ENTRY['2002']);
                            }}
                        >
                            <div className="win98-icon-image" aria-hidden="true" />
                            <div className="win98-icon-label">{t('library.folderVer2')}</div>
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
                                    <button
                                        type="button"
                                        className="ie-nav-btn"
                                        onClick={handleIeBack}
                                        disabled={!canIeGoBack}
                                    >
                                        ◀ {t('library.ieBack')}
                                    </button>
                                    <div className="ie-address-label">Address</div>
                                    <input
                                        className="ie-address"
                                        readOnly
                                        value={ieAddress || getIeUrl(ieTarget)}
                                    />
                                </div>
                                <div className="ie-content">
                                    <ScaledLegacyFrame
                                        src={getIeUrl(ieTarget)}
                                        iframeRef={legacyIframeRef}
                                        onLoad={handleIeLoad}
                                        viewportWidth={ieViewport.width}
                                        viewportHeight={ieViewport.height}
                                        maxScale={ieMaxScale}
                                        fitMode={ieFitMode}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showIntro && (
                <UnderConstruction
                    onClose={() => setShowIntro(false)}
                    message={greetingMessage}
                    backgroundSrc={backgroundImage}
                    illustrationSrc={backgroundImage}
                    characterSrc="/characters/alpha/alpha-nice-talk.webp"
                    closeLabel={t('atelier.explore')}
                />
            )}

            {dialogue && (
                <UnderConstruction
                    onClose={() => setDialogue(null)}
                    message={dialogue}
                    backgroundSrc={backgroundImage}
                    closeLabel={t('library.close')}
                />
            )}
        </div>
    );
};

export default AtelierPage;
