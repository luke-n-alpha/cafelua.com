'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, Music, Map as MapIcon } from 'lucide-react';
import { SITEMAP_SECTIONS } from '@/data/sitemapData';
import { buildLocalizedUrlWithQuery } from '@/lib/navigationQuery';
import './BackgroundMusic.css';

interface BackgroundMusicProps {
    src: string;
    autoPlay?: boolean;
    hideUi?: boolean;
    suspended?: boolean;
}

const bgmPlayers = new Map<string, HTMLAudioElement>();
let activeBgmSrc: string | null = null;

function getOrCreateBgm(src: string): HTMLAudioElement {
    const cached = bgmPlayers.get(src);
    if (cached) return cached;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    bgmPlayers.set(src, audio);
    return audio;
}

// Pause every registered BGM except the one for `keepSrc`. Guarantees only a
// single track is ever audible, independent of the async activeBgmSrc tracking.
function stopOtherBgm(keepSrc: string): void {
    bgmPlayers.forEach((audio, key) => {
        if (key !== keepSrc && !audio.paused) audio.pause();
    });
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
    src,
    autoPlay = true,
    hideUi = false,
    suspended = false
}) => {
    const { i18n } = useTranslation();
    const params = useParams();
    const locale = typeof params?.locale === 'string' ? params.locale : i18n.language;
    const router = useRouter();
    const searchParams = useSearchParams();
    const isKo = locale === 'ko';
    const muteTitle = isKo ? '음악 끄기' : 'Mute BGM';
    const unmuteTitle = isKo ? '음악 켜기' : 'Unmute BGM';
    const onLabel = isKo ? '켜짐' : 'ON';
    const offLabel = isKo ? '꺼짐' : 'OFF';
    const [isMuted, setIsMuted] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const positionKey = `cafelua_bgm_position_${encodeURIComponent(src)}`;

    // Load mute state from localStorage on mount
    useEffect(() => {
        const savedMute = localStorage.getItem('cafelua_bgm_muted');
        if (savedMute !== null) {
            setIsMuted(savedMute === 'true');
        } else {
            setIsMuted(false);
        }
    }, []);

    // Keep one shared audio instance per src (prevents hard restart between route transitions)
    useEffect(() => {
        const audio = getOrCreateBgm(src);
        audioRef.current = audio;
        setIsPlaying(!audio.paused);
    }, [src]);

    // Handle audio source changes and play state
    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = 0.5;

        if (suspended || isMuted || !autoPlay) {
            if (activeBgmSrc === src) activeBgmSrc = null;
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        // Stop every other registered BGM before starting this one so only a
        // single track can ever be audible. Relying on `activeBgmSrc` alone is
        // racy: during a route transition (e.g. entrance intro.mp3 -> lounge.mp3)
        // the previous player's async play() promise may not have resolved yet,
        // so activeBgmSrc is still null/stale and its pause() gets skipped —
        // that's the overlap bug. Iterating the player map is race-proof.
        stopOtherBgm(src);
        activeBgmSrc = src;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Re-assert exclusivity in case another src started during the async gap.
                    if (activeBgmSrc === src) stopOtherBgm(src);
                    setIsPlaying(true);
                })
                .catch(error => {
                    console.log("Autoplay prevented:", error);
                    setIsPlaying(false);
                });
        }
    }, [src, isMuted, autoPlay, suspended]);

    // Restore playback position for same BGM src across page transitions
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const restorePosition = () => {
            const raw = sessionStorage.getItem(positionKey);
            if (!raw) return;
            const saved = Number(raw);
            if (!Number.isFinite(saved) || saved <= 0) return;
            const max = Number.isFinite(audio.duration) ? Math.max(0, audio.duration - 0.25) : saved;
            audio.currentTime = Math.min(saved, max);
        };

        if (audio.readyState >= 1) restorePosition();
        audio.addEventListener('loadedmetadata', restorePosition);
        return () => audio.removeEventListener('loadedmetadata', restorePosition);
    }, [positionKey]);

    // Persist current playback position
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const savePosition = () => {
            if (!Number.isFinite(audio.currentTime) || audio.currentTime < 0.1) return;
            sessionStorage.setItem(positionKey, String(audio.currentTime));
        };

        const timer = window.setInterval(savePosition, 1500);
        window.addEventListener('pagehide', savePosition);
        return () => {
            window.clearInterval(timer);
            window.removeEventListener('pagehide', savePosition);
            savePosition();
        };
    }, [positionKey]);

    // Retry play on any user interaction if autoplay failed
    useEffect(() => {
        const handleUserInteraction = () => {
            // Only retry when this instance is (or is about to become) the active
            // track. Without the activeBgmSrc guard, the entrance click that
            // navigates intro -> lounge could revive the not-yet-unmounted
            // intro player and overlap it with the lounge track.
            if (audioRef.current && !suspended && !isMuted && !isPlaying && autoPlay
                && (!activeBgmSrc || activeBgmSrc === src)) {
                stopOtherBgm(src);
                activeBgmSrc = src;
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.log("Still blocked:", e));
            }
        };

        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('keydown', handleUserInteraction);

        return () => {
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('keydown', handleUserInteraction);
        };
    }, [suspended, isMuted, isPlaying, autoPlay, src]);

    // Close menu on outside click
    useEffect(() => {
        if (!isMenuOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        localStorage.setItem('cafelua_bgm_muted', String(newMuted));

        if (audioRef.current) {
            if (newMuted) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                if (suspended) return;
                audioRef.current.play().catch(e => console.log("Play failed:", e));
                setIsPlaying(true);
            }
        }
    };

    const handleNavigate = (path: string) => {
        setIsMenuOpen(false);
        router.push(buildLocalizedUrlWithQuery(locale, path, searchParams));
    };

    return (
        <>
            {!hideUi && (
                <div className="bgm-player ui-glass" onClick={(e) => e.stopPropagation()}>
                    <div className="bgm-icon">
                        <Music size={16} className={isPlaying ? "spin-slow" : ""} />
                    </div>
                    <div className="bgm-controls">
                        <button
                            className={`bgm-btn ui-button ui-button-ghost ${isMuted ? 'muted' : ''}`}
                            onClick={toggleMute}
                            title={isMuted ? unmuteTitle : muteTitle}
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            <span className="bgm-label">{isMuted ? offLabel : onLabel}</span>
                        </button>
                    </div>
                    <div className="bgm-sitemap-wrapper" ref={menuRef}>
                        <button
                            className="bgm-btn ui-button ui-button-ghost"
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(prev => !prev); }}
                            title={isKo ? '사이트맵' : 'Sitemap'}
                        >
                            <MapIcon size={18} />
                        </button>
                        {isMenuOpen && (
                            <div className="bgm-sitemap-dropdown">
                                {SITEMAP_SECTIONS.map((section) => (
                                    <div key={section.titleEn} className="bgm-sitemap-section">
                                        <div className="bgm-sitemap-section-title">
                                            {isKo ? section.titleKo : section.titleEn}
                                        </div>
                                        {section.items.map((item) => (
                                            <button
                                                key={item.path}
                                                className="bgm-sitemap-item"
                                                onClick={() => handleNavigate(item.path)}
                                            >
                                                {isKo ? item.labelKo : item.labelEn}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default BackgroundMusic;
