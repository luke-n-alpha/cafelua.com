'use client';

import React from 'react';
import type { TarotCardMeta, SpreadPosition } from '@/data/tarot/types';
import './TarotReading.css';

interface TarotCardProps {
  card: TarotCardMeta;
  position: SpreadPosition;
  isReversed: boolean;
  isFlipped: boolean;
  isActive: boolean;
  isInterpreted: boolean;
  onClick: () => void;
  disabled: boolean;
}

export default function TarotCard({
  card,
  position,
  isReversed,
  isFlipped,
  isActive,
  isInterpreted,
  onClick,
  disabled,
}: TarotCardProps) {
  return (
    <div
      className={`tarot-card-container ${isActive ? 'active' : ''} ${isInterpreted ? 'interpreted' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="tarot-position-label">{position.nameKr}</div>
      <div className={`tarot-card ${isFlipped ? 'flipped' : ''} ${isReversed ? 'reversed' : ''}`}>
        <div className="tarot-card-inner">
          {/* 카드 뒷면 */}
          <div className="tarot-card-back">
            <div className="tarot-card-back-design">
              <div className="tarot-logo">☽</div>
              <div className="tarot-pattern"></div>
            </div>
          </div>
          {/* 카드 앞면 */}
          <div className="tarot-card-front">
            <img
              src={card.imagePath}
              alt={card.nameKr}
              className="tarot-card-image"
            />
            <div className="tarot-card-name">{card.nameKr}</div>
          </div>
        </div>
      </div>
      {isReversed && isFlipped && (
        <div className="tarot-reversed-badge">역방향</div>
      )}
    </div>
  );
}
