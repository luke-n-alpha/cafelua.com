'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import './UnderConstruction.css';

interface UnderConstructionProps {
    onClose: () => void;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({ onClose }) => {
    const { t } = useTranslation();

    return (
        <div className="construction-overlay">
            {/* Background Image covering full overlay */}
            <img 
                src="/undestruct.jpg" 
                alt="Under Construction" 
                className="construction-bg"
            />

            {/* Character & Dialogue Container */}
            <div className="vn-container">
                <div className="vn-dialogue-box">
                    <div className="vn-content-row">
                        <img 
                            src="/alpha-trouble.webp" 
                            alt="Alpha" 
                            className="vn-character"
                        />
                        <div className="vn-text-group">
                            <div className="vn-name">Alpha</div>
                            <p className="vn-text">{t('lounge.underConstruction')}</p>
                        </div>
                    </div>
                    
                    <div className="vn-button-row">
                        <button className="vn-back-btn ui-button ui-button-ghost" onClick={onClose}>
                            {t('lounge.backToLounge')} ▶
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnderConstruction;
