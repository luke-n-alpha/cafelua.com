'use client';

import React from 'react';
import TarotCard from './TarotCard';
import type { DrawnCard } from '@/data/tarot/types';
import './TarotReading.css';

interface TarotSpreadProps {
  cards: DrawnCard[];
  currentIndex: number;
  interpretedIndices: number[];
  onCardClick: (index: number) => void;
  disabled: boolean;
}

export default function TarotSpread({
  cards,
  currentIndex,
  interpretedIndices,
  onCardClick,
  disabled,
}: TarotSpreadProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="tarot-spread">
      <div className="tarot-spread-grid">
        {cards.map((drawnCard, index) => (
          <TarotCard
            key={`${drawnCard.card.id}-${index}`}
            card={drawnCard.card}
            position={drawnCard.position}
            isReversed={drawnCard.isReversed}
            isFlipped={drawnCard.isFlipped}
            isActive={index === currentIndex}
            isInterpreted={interpretedIndices.includes(index)}
            onClick={() => onCardClick(index)}
            disabled={disabled || drawnCard.isFlipped}
          />
        ))}
      </div>
    </div>
  );
}
