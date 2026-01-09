'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import './UnderConstruction.css';

interface UnderConstructionProps {
    onClose: () => void;
    message?: string;
    backgroundSrc?: string;
    characterSrc?: string;
    speakerName?: string;
    closeLabel?: string;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({
    onClose,
    message,
    backgroundSrc = '/undestruct.jpg',
    characterSrc = '/alpha-trouble.webp',
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
                alt="Under Construction" 
                className="construction-bg"
            />

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
