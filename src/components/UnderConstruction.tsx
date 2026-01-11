'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import './UnderConstruction.css';

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
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({
    onClose,
    message,
    backgroundSrc = '/undestruct.jpg',
    illustrationSrc,
    characterSrc = '/characters/alpha/alpha-trouble.webp',
    spriteSrc,
    spriteAlt = 'Character Sprite',
    speakerName = 'Alpha',
    closeLabel
}) => {
    const { t } = useTranslation();
    const resolvedMessage = message ?? t('lounge.underConstruction');
    const resolvedCloseLabel = closeLabel ?? t('lounge.backToLounge');

    return (
        <div className="construction-overlay">
            {/* Background Image covering full overlay */}
            <img 
                src={backgroundSrc}
                alt=""
                aria-hidden="true"
                className="construction-bg"
                onError={(event) => {
                    const img = event.currentTarget;
                    if (img.src.endsWith('/undestruct.jpg')) return;
                    img.src = '/undestruct.jpg';
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
                            if (img.src.endsWith('/undestruct.jpg')) return;
                            img.src = '/undestruct.jpg';
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
                        <button className="vn-back-btn ui-button ui-button-ghost" onClick={onClose}>
                            {resolvedCloseLabel} ▶
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnderConstruction;
