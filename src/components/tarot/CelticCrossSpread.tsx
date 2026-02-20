'use client';

import React from 'react';
import type { DrawnCard } from '@/data/tarot/types';
import './TarotReading.css';

interface CelticCrossSpreadProps {
    cards: DrawnCard[];
    language: 'ko' | 'en';
    currentIndex: number;
    interpretedIndices: number[];
    nextFlipIndex: number;
    onCardClick: (index: number) => void;
    disabled: boolean;
}

/**
 * 켈틱 크로스 배열 (10장)
 *
 * 레이아웃:
 *           [3]
 *     [5] [1+2] [4]
 *           [6]
 *                   [10]
 *                   [9]
 *                   [8]
 *                   [7]
 */
export default function CelticCrossSpread({
    cards,
    language,
    currentIndex,
    interpretedIndices,
    nextFlipIndex,
    onCardClick,
    disabled,
}: CelticCrossSpreadProps) {
    if (cards.length < 10) return null;

    const renderCard = (index: number, className: string) => {
        const card = cards[index];
        if (!card) return null;

        const isFlipped = card.isFlipped;
        const isActive = index === currentIndex;
        const isInterpreted = interpretedIndices.includes(index);
        const isNext = index === nextFlipIndex;

        return (
            <div
                className={`celtic-card ${className} ${isFlipped ? 'flipped' : ''} ${isActive ? 'active viewing' : ''} ${isInterpreted ? 'interpreted' : ''} ${isNext ? 'next-flip' : ''}`}
                onClick={() => !disabled && onCardClick(index)}
            >
                <div className="celtic-card-inner">
                    {/* 뒷면 */}
                    <div className="celtic-card-back" />
                    {/* 앞면 */}
                    <div className={`celtic-card-front ${card.isReversed ? 'reversed' : ''}`}>
                        <img src={card.card.imagePath} alt={language === 'en' ? card.card.nameEn : card.card.nameKr} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="celtic-cross-spread">
            {/* 중앙 십자 영역 */}
            <div className="celtic-cross-center">
                {/* 3: 왕관 (위) */}
                {renderCard(2, 'celtic-pos-3')}

                {/* 중간 행: 5-1/2-4 */}
                <div className="celtic-cross-middle">
                    {renderCard(4, 'celtic-pos-5')}
                    <div className="celtic-center-stack">
                        {renderCard(0, 'celtic-pos-1')}
                        {renderCard(1, 'celtic-pos-2 celtic-crossed')}
                    </div>
                    {renderCard(3, 'celtic-pos-4')}
                </div>

                {/* 6: 기반 (아래) */}
                {renderCard(5, 'celtic-pos-6')}
            </div>

            {/* 오른쪽 기둥 (7-10, 아래에서 위로) */}
            <div className="celtic-staff">
                {renderCard(6, 'celtic-pos-7')}
                {renderCard(7, 'celtic-pos-8')}
                {renderCard(8, 'celtic-pos-9')}
                {renderCard(9, 'celtic-pos-10')}
            </div>
        </div>
    );
}
