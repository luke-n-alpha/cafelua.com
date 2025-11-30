import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, Music } from 'lucide-react';
import './BackgroundMusic.css';

interface BackgroundMusicProps {
    src: string;
    autoPlay?: boolean;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ src, autoPlay = true }) => {
    const { t } = useTranslation();
    const [isMuted, setIsMuted] = useState<boolean>(true); // Default to muted for safety
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Load mute state from localStorage on mount
    useEffect(() => {
        const savedMute = localStorage.getItem('cafelua_bgm_muted');
        if (savedMute !== null) {
            setIsMuted(savedMute === 'true');
        } else {
            // Initial state: Not muted by default, but let's see if we can play
            setIsMuted(false);
        }
    }, []);

    // Handle audio source changes and play state
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5; // Default volume
            
            if (!isMuted && autoPlay) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => setIsPlaying(true))
                        .catch(error => {
                            console.log("Autoplay prevented:", error);
                            setIsPlaying(false);
                        });
                }
            } else {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, [src, isMuted, autoPlay]);

    // Retry play on any user interaction if autoplay failed
    useEffect(() => {
        const handleUserInteraction = () => {
            if (audioRef.current && !isMuted && !isPlaying && autoPlay) {
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
    }, [isMuted, isPlaying, autoPlay]);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent bubbling to parent click handlers
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        localStorage.setItem('cafelua_bgm_muted', String(newMuted));
        
        if (audioRef.current) {
            if (newMuted) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch(e => console.log("Play failed:", e));
                setIsPlaying(true);
            }
        }
    };

    return (
        <div className="bgm-player glass" onClick={(e) => e.stopPropagation()}>
            <div className="bgm-icon">
                <Music size={16} className={isPlaying ? "spin-slow" : ""} />
            </div>
            <div className="bgm-controls">
                <button 
                    className={`bgm-btn ${isMuted ? 'muted' : ''}`} 
                    onClick={toggleMute}
                    title={isMuted ? t('common.unmute') : t('common.mute')}
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    <span className="bgm-label">{isMuted ? t('common.off') : t('common.on')}</span>
                </button>
            </div>
            <audio 
                ref={audioRef} 
                src={src} 
                loop 
                preload="auto"
            />
        </div>
    );
};

export default BackgroundMusic;
