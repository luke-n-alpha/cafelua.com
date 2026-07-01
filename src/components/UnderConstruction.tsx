'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './UnderConstruction.css';

interface ButtonConfig {
    label: string;
    onClick: () => void;
}

interface UnderConstructionProps {
    onClose: () => void;
    message?: string;
    backgroundSrc?: string;
    illustrationSrc?: string;
    characterSrc?: string;
    spriteSrc?: string;
    spriteAlt?: string;
    speakerName?: string;
    closeLabel?: string;
    buttons?: ButtonConfig[];
    overlayClassName?: string;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({
    onClose,
    message,
    backgroundSrc = '/undestruct.webp',
    illustrationSrc,
    characterSrc = '/characters/alpha/alpha-trouble.webp',
    spriteSrc,
    spriteAlt = 'Character Sprite',
    speakerName = 'Alpha',
    closeLabel,
    buttons,
    overlayClassName
}) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const resolvedMessage = message ?? t('lounge.underConstruction');
    const resolvedCloseLabel = closeLabel ?? t('lounge.backToLounge');

    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        const ua = navigator.userAgent ?? '';
        const isFacebookWebView = /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i.test(ua);
        if (isFacebookWebView) {
            overlay.dataset.ucWebview = 'facebook';
        } else {
            delete overlay.dataset.ucWebview;
        }

        const updateViewportHeight = () => {
            const visualHeight = window.visualViewport?.height ?? window.innerHeight;
            overlay.style.setProperty('--uc-vh', `${visualHeight * 0.01}px`);
        };

        updateViewportHeight();

        window.addEventListener('resize', updateViewportHeight);
        window.addEventListener('orientationchange', updateViewportHeight);

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateViewportHeight);
            window.visualViewport.addEventListener('scroll', updateViewportHeight);
        }

        return () => {
            window.removeEventListener('resize', updateViewportHeight);
            window.removeEventListener('orientationchange', updateViewportHeight);

            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', updateViewportHeight);
                window.visualViewport.removeEventListener('scroll', updateViewportHeight);
            }
        };
    }, []);

    return (
        <div ref={overlayRef} className={`construction-overlay${overlayClassName ? ` ${overlayClassName}` : ''}`}>
            {/* Background Image covering full overlay */}
            <img 
                src={backgroundSrc}
                alt=""
                aria-hidden="true"
                className="construction-bg"
                onError={(event) => {
                    const img = event.currentTarget;
                    if (img.src.endsWith('/undestruct.webp')) return;
                    img.src = '/undestruct.webp';
                }}
            />

            {illustrationSrc && (
                <div className="construction-illustration-frame" aria-hidden="true">
                    <img
                        src={illustrationSrc}
                        alt=""
                        className="construction-illustration"
                        onError={(event) => {
                            const img = event.currentTarget;
                            if (img.src.endsWith('/undestruct.webp')) return;
                            img.src = '/undestruct.webp';
                        }}
                    />
                </div>
            )}

            {spriteSrc && (
                <div className="vn-sprite-wrap" aria-hidden="true">
                    <img
                        src={spriteSrc}
                        alt={spriteAlt}
                        className="vn-sprite"
                    />
                </div>
            )}

            {/* Character & Dialogue Container */}
            <div className="vn-container">
                <div className="vn-dialogue-box">
                    <div className="vn-content-row">
                        <img 
                            src={characterSrc} 
                            alt="Alpha" 
                            className="vn-character"
                        />
                        <div className="vn-text-group">
                            <div className="vn-name">{speakerName}</div>
                            <p className="vn-text">{resolvedMessage}</p>
                        </div>
                    </div>
                    
                    <div className="vn-button-row">
                        {buttons && buttons.length > 0 ? (
                            buttons.map((btn, idx) => (
                                <button
                                    key={idx}
                                    className="vn-back-btn ui-button ui-button-ghost"
                                    onClick={btn.onClick}
                                >
                                    {btn.label} ▶
                                </button>
                            ))
                        ) : (
                            <button className="vn-back-btn ui-button ui-button-ghost" onClick={onClose}>
                                {resolvedCloseLabel} ▶
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnderConstruction;
