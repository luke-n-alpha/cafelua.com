'use client';

import { useState, useCallback } from 'react';
import type { DrawnCard, TarotReadingState } from '@/data/tarot/types';
import { SPREAD_POSITIONS } from '@/data/tarot/types';

export type ReadingPhase = TarotReadingState['phase'];

interface UseTarotReadingReturn {
  phase: ReadingPhase;
  topic: string;
  drawnCards: DrawnCard[];
  currentCardIndex: number;
  interpretedIndices: number[];
  setTopic: (topic: string) => void;
  startReading: (cards: DrawnCard[]) => void;
  flipCard: (index: number) => void;
  markInterpreted: (index: number) => void;
  nextCard: () => void;
  goToSummary: () => void;
  endReading: () => void;
  reset: () => void;
}

export function useTarotReading(): UseTarotReadingReturn {
  const [phase, setPhase] = useState<ReadingPhase>('welcome');
  const [topic, setTopicState] = useState('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(-1);
  const [interpretedIndices, setInterpretedIndices] = useState<number[]>([]);

  const setTopic = useCallback((newTopic: string) => {
    setTopicState(newTopic);
    if (newTopic.trim()) {
      setPhase('topic');
    }
  }, []);

  const startReading = useCallback((cards: DrawnCard[]) => {
    setDrawnCards(cards);
    setPhase('spread');
    setCurrentCardIndex(-1);
    setInterpretedIndices([]);
  }, []);

  const flipCard = useCallback((index: number) => {
    setDrawnCards(prev => prev.map((card, i) =>
      i === index ? { ...card, isFlipped: true } : card
    ));
    setCurrentCardIndex(index);
    setPhase('interpret');
  }, []);

  const markInterpreted = useCallback((index: number) => {
    setInterpretedIndices(prev =>
      prev.includes(index) ? prev : [...prev, index]
    );
  }, []);

  const nextCard = useCallback(() => {
    // 해석되지 않은 다음 카드 찾기
    const nextUnflipped = drawnCards.findIndex(
      (card, i) => !card.isFlipped && i > currentCardIndex
    );

    if (nextUnflipped !== -1) {
      setCurrentCardIndex(nextUnflipped);
      setPhase('spread');
    } else {
      // 모든 카드 해석 완료
      const allInterpreted = interpretedIndices.length >= drawnCards.length;
      if (allInterpreted) {
        setPhase('summary');
      } else {
        setPhase('spread');
      }
    }
  }, [drawnCards, currentCardIndex, interpretedIndices]);

  const goToSummary = useCallback(() => {
    setPhase('summary');
  }, []);

  const endReading = useCallback(() => {
    setPhase('end');
  }, []);

  const reset = useCallback(() => {
    setPhase('welcome');
    setTopicState('');
    setDrawnCards([]);
    setCurrentCardIndex(-1);
    setInterpretedIndices([]);
  }, []);

  return {
    phase,
    topic,
    drawnCards,
    currentCardIndex,
    interpretedIndices,
    setTopic,
    startReading,
    flipCard,
    markInterpreted,
    nextCard,
    goToSummary,
    endReading,
    reset,
  };
}

// 카드 뽑기 헬퍼 (클라이언트에서 사용) - 켈틱 크로스 10장
export function drawCardsClient(allCards: Array<{ id: number; nameEn: string; nameKr: string; imagePath: string; keywords: string[] }>, count: number = 10): DrawnCard[] {
  // 셔플
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  const drawn = shuffled.slice(0, count);

  // DrawnCard 형태로 변환
  return drawn.map((card, index) => ({
    card: {
      ...card,
      character: 'alpha' as const,
      objects: [],
      upright: [],
      reversed: [],
    },
    position: SPREAD_POSITIONS[index],
    isReversed: Math.random() < 0.3,
    isFlipped: false,
  }));
}
