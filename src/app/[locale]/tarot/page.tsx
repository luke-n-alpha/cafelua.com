'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import BackgroundMusic from '@/components/BackgroundMusic';
import CelticCrossSpread from '@/components/tarot/CelticCrossSpread';
import { SPREAD_POSITIONS } from '@/data/tarot/types';
import type { DrawnCard, TarotCardMeta } from '@/data/tarot/types';
import {
    getExpressionImagePath,
    type ChatMessage,
    type AlphaExpression
} from '@/services/GeminiChatService';
import {
    loadMemory,
    saveMemory,
    addMessage,
    getMemoryContext,
    checkSecretPhrase,
    authenticateMaster,
    saveConversationToHistory,
    getConversationHistory,
    type ChatMemory,
    type ConversationRecord,
    type ConversationMessage
} from '@/services/ChatMemoryService';
import { renderMessage } from '@/lib/format-message';
import { parseRuntimeEnvironmentFromSearchParams } from '@/lib/environmentContext';
import '@/components/UnderConstruction.css';
import '@/components/CoffeeChatDialog.css';
import '@/components/tarot/TarotReading.css';

const CHAT_TIMEOUT_MS = 15 * 60 * 1000; // 15분 (카드 리딩 시간 고려)

// 타로 전용 액션들
const TAROT_ACTIONS = [
    { id: 'nod', icon: '🙂', label: 'tarot.action.nod', aiTextKo: '(고개를 끄덕인다)', aiTextEn: '(The guest nods)' },
    { id: 'think', icon: '🤔', label: 'tarot.action.think', aiTextKo: '(깊이 생각한다)', aiTextEn: '(The guest thinks deeply)' },
    { id: 'curious', icon: '✨', label: 'tarot.action.curious', aiTextKo: '(호기심 가득한 눈으로 본다)', aiTextEn: '(The guest looks curious)' },
    { id: 'hope', icon: '🌟', label: 'tarot.action.hope', aiTextKo: '(희망찬 표정을 짓는다)', aiTextEn: '(The guest looks hopeful)' },
];

interface CardBasicInfo {
    id: number;
    nameEn: string;
    nameKr: string;
    imagePath: string;
    keywords: string[];
}

export default function TarotPage() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const localeFromPath = pathname.split('/')[1];
    const preferredLanguage = localeFromPath === 'en' ? 'en' : 'ko';
    const isEnglish = preferredLanguage === 'en';
    const environmentContext = useMemo(() => {
        return parseRuntimeEnvironmentFromSearchParams(searchParams, {
            space: '1층 라운지 타로룸',
            backgroundSrc: '/tarot/tarot-room-bg.webp',
        });
    }, [searchParams]);
    const overlayRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 메모리 & 대화 상태
    const [memory, setMemory] = useState<ChatMemory | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [currentExpression, setCurrentExpression] = useState<AlphaExpression>('face');
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isChatEnded, setIsChatEnded] = useState<boolean>(false);

    // 로딩 끝나면 입력창 포커스 (PC만)
    useEffect(() => {
        if (!isLoading && inputRef.current && window.innerWidth > 768) {
            inputRef.current.focus();
        }
    }, [isLoading]);

    const [showLog, setShowLog] = useState<boolean>(false);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [selectedHistory, setSelectedHistory] = useState<ConversationRecord | null>(null);

    // 카드 상태
    const [allCards, setAllCards] = useState<CardBasicInfo[]>([]);
    const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(-1);
    const [interpretedIndices, setInterpretedIndices] = useState<number[]>([]);
    const [readingTopic, setReadingTopic] = useState<string>('');
    const [isReadingMode, setIsReadingMode] = useState<boolean>(false);
    const [showCardDetail, setShowCardDetail] = useState<boolean>(false);
    const [cardInterpretations, setCardInterpretations] = useState<Record<number, string>>({});
    // 메시지 큐: 여러 메시지가 연속으로 올 때 하나씩 보여주고 클릭으로 진행
    const [messageQueue, setMessageQueue] = useState<Array<{
        message: string;
        expression: AlphaExpression;
        action?: () => void; // 이 메시지 후 실행할 액션
    }>>([]);

    const hasQueue = messageQueue.length > 0;
    const reversedTag = t('tarot.reversedTag', isEnglish ? '(Reversed)' : '(역방향)');
    const getCardName = useCallback((card: CardBasicInfo | TarotCardMeta) => (
        isEnglish ? card.nameEn : card.nameKr
    ), [isEnglish]);
    const getPositionName = useCallback((position: (typeof SPREAD_POSITIONS)[number]) => (
        isEnglish ? position.nameEn : position.nameKr
    ), [isEnglish]);
    const getPositionContext = useCallback((position: (typeof SPREAD_POSITIONS)[number]) => (
        isEnglish ? position.nameEn : `${position.nameKr} (${position.description})`
    ), [isEnglish]);

    // 큐 진행: 대화 박스 클릭 시 다음 메시지 또는 액션 실행
    const advanceQueue = useCallback(() => {
        if (messageQueue.length === 0) return;
        const next = messageQueue[0];
        setMessageQueue(prev => prev.slice(1));
        if (next.action) {
            next.action();
        } else {
            setCurrentMessage(next.message);
            setCurrentExpression(next.expression);
        }
    }, [messageQueue]);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messagesRef = useRef<ChatMessage[]>([]);
    const memoryRef = useRef<ChatMemory | null>(null);

    // Refs 업데이트
    useEffect(() => { messagesRef.current = messages; }, [messages]);
    useEffect(() => { memoryRef.current = memory; }, [memory]);

    // 카운터로 돌아가기
    const goToCounter = useCallback(() => {
        const query = searchParams.toString();
        router.push(query ? `/${preferredLanguage}/counter?${query}` : `/${preferredLanguage}/counter`);
    }, [router, searchParams, preferredLanguage]);

    useEffect(() => {
        if (i18n.language !== preferredLanguage) {
            i18n.changeLanguage(preferredLanguage);
        }
    }, [i18n, preferredLanguage]);

    // 뷰포트 높이 설정
    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        const ua = navigator.userAgent ?? '';
        if (/FBAN|FBAV|FB_IAB|FB4A|FBIOS/i.test(ua)) {
            overlay.dataset.ucWebview = 'facebook';
        }

        const initialHeight = window.innerHeight;
        overlay.style.setProperty('--uc-vh', `${initialHeight * 0.01}px`);

        const handleOrientationChange = () => {
            setTimeout(() => {
                overlay.style.setProperty('--uc-vh', `${window.innerHeight * 0.01}px`);
            }, 100);
        };

        window.addEventListener('orientationchange', handleOrientationChange);
        return () => window.removeEventListener('orientationchange', handleOrientationChange);
    }, []);

    // 카드 데이터 로드
    useEffect(() => {
        fetch('/api/tarot/cards/')
            .then(res => res.json())
            .then(data => setAllCards(data.cards || []))
            .catch(() => {});
    }, []);

    // 대화 저장
    const saveWithHistory = useCallback((mem: ChatMemory, chatMessages: ChatMessage[]) => {
        if (chatMessages.length === 0) {
            saveMemory(mem);
            return;
        }
        const historyMessages: ConversationMessage[] = chatMessages.map(m => ({
            role: m.role,
            content: m.content,
            expression: m.expression,
            timestamp: m.timestamp || Date.now(),
        }));
        const updatedMemory = saveConversationToHistory(mem, 'tarot', historyMessages);
        saveMemory(updatedMemory);
    }, []);

    // 메모리 로드 및 AI 초기 인사
    useEffect(() => {
        const abortController = new AbortController();

        let mem = loadMemory();

        if (mem.recentMessages.length > 0) {
            const prevMessages: ConversationMessage[] = mem.recentMessages.map(m => ({
                role: m.role,
                content: m.content,
                timestamp: m.timestamp,
            }));
            mem = saveConversationToHistory(mem, mem.lastSessionType || 'tarot', prevMessages);
            mem.recentMessages = [];
        }

        mem.lastSessionType = 'tarot';
        saveMemory(mem);
        setMemory(mem);

        // AI가 첫 인사를 생성하도록 API 호출
        setIsLoading(true);
        const memoryContext = getMemoryContext(mem);
        fetch('/api/chat/tarot/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [],
                language: preferredLanguage,
                memoryContext,
                environmentContext,
            }),
            signal: abortController.signal,
        })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => {
                const greetingMessage: ChatMessage = {
                    role: 'model',
                    content: data.message,
                    expression: data.expression,
                    timestamp: Date.now(),
                };
                setMessages([greetingMessage]);
                setCurrentMessage(data.message);
                setCurrentExpression(data.expression as AlphaExpression);
            })
            .catch((err) => {
                if (err?.name === 'AbortError') return;
                setCurrentMessage(t('tarot.greeting', '어서오세요... 🔮✨ 타로 상담을 시작해볼까요?'));
                setCurrentExpression('nice-talk');
            })
            .finally(() => setIsLoading(false));

        timeoutRef.current = setTimeout(() => {
            setCurrentMessage(t('tarot.timeout', '시간이 많이 흘렀네요... 🌙 다음에 또 와주세요!'));
            setCurrentExpression('nice-talk');
            setIsChatEnded(true);
            if (memoryRef.current && messagesRef.current.length > 0) {
                saveWithHistory(memoryRef.current, messagesRef.current);
            }
            setTimeout(goToCounter, 3000);
        }, CHAT_TIMEOUT_MS);

        return () => {
            abortController.abort();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [goToCounter, preferredLanguage, saveWithHistory, t]);

    // 카드 뽑기 (10장 - 켈틱 크로스) — 셔플 → 배치
    const drawCards = useCallback(() => {
        if (allCards.length < 10) return;

        // 셔플 단계
        setIsLoading(true);
        setCurrentMessage(t('tarot.shuffling', '카드를 섞고 있어요... 🃏✨'));
        setCurrentExpression('nice-talk');

        setTimeout(() => {
            const shuffled = [...allCards].sort(() => Math.random() - 0.5);
            const drawn: DrawnCard[] = shuffled.slice(0, 10).map((card, index) => ({
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

            setDrawnCards(drawn);
            setCurrentCardIndex(-1);
            setInterpretedIndices([]);
            setIsReadingMode(true);
            setCurrentMessage(t('tarot.cardsReady', '카드가 준비되었어요! 카드를 터치해서 한 장씩 뒤집어 보세요.'));
            setCurrentExpression('nice-talk');
            setIsLoading(false);
        }, 2000);
    }, [allCards, t]);

    // 카드 뒤집기 & 해석
    const handleCardClick = useCallback(async (index: number) => {
        if (isLoading || drawnCards[index]?.isFlipped) return;

        // 카드 뒤집기
        setDrawnCards(prev => prev.map((c, i) => i === index ? { ...c, isFlipped: true } : c));
        setCurrentCardIndex(index);
        setShowCardDetail(true);
        setIsLoading(true);

        const card = drawnCards[index];
        const position = SPREAD_POSITIONS[index];

        setCurrentMessage(t('tarot.interpreting', '{{cardName}} 카드를 해석하고 있어요... 🔮', { cardName: getCardName(card.card) }));

        try {
            const res = await fetch('/api/tarot/interpret/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardId: card.card.id,
                    positionIndex: index,
                    positionName: getPositionContext(position),
                    isReversed: card.isReversed,
                    topic: readingTopic || t('tarot.defaultTopic', '오늘의 운세'),
                    previousInterpretations: Object.entries(cardInterpretations).map(([i, interp]) => {
                        const c = drawnCards[Number(i)];
                        const p = SPREAD_POSITIONS[Number(i)];
                        return `[${getPositionName(p)} - ${getCardName(c.card)}${c.isReversed ? ` ${reversedTag}` : ''}]: ${interp}`;
                    }),
                    language: preferredLanguage,
                    environmentContext,
                }),
            });

            if (!res.ok) throw new Error('API failed');

            const data = await res.json();
            setCurrentMessage(data.message);
            setCurrentExpression(data.expression as AlphaExpression);
            const newInterpretations = { ...cardInterpretations, [index]: data.message };
            setInterpretedIndices(prev => [...prev, index]);
            setCardInterpretations(newInterpretations);

            // 해석 결과를 대화 기록에 추가
            const cardLabel = `[${getPositionName(position)} - ${getCardName(card.card)}${card.isReversed ? ` ${reversedTag}` : ''}]`;
            const interpretMsg: ChatMessage = {
                role: 'model',
                content: `${cardLabel}\n${data.message}`,
                expression: data.expression,
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, interpretMsg]);

        } catch (error) {
            console.error('Interpret error:', error);
            setCurrentMessage(t('tarot.error', '앗, 수정 구슬이 흐려졌어요... 🔮 다시 시도해 주세요.'));
            setCurrentExpression('trouble');
        } finally {
            setIsLoading(false);
        }
    }, [cardInterpretations, drawnCards, getCardName, getPositionContext, getPositionName, isLoading, preferredLanguage, readingTopic, reversedTag, t]);

    // 종합 해석 요청
    const requestSummary = useCallback(async () => {
        setIsLoading(true);
        setCurrentMessage(t('tarot.summarizing', '모든 카드를 종합해서 해석하고 있어요... ✨'));
        const allInterpretations = drawnCards.map((c, i) => ({
            position: getPositionName(SPREAD_POSITIONS[i]),
            cardName: getCardName(c.card),
            isReversed: c.isReversed,
            interpretation: cardInterpretations[i] || '',
        }));

        try {
            const summaryRes = await fetch('/api/tarot/summary/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: readingTopic || t('tarot.defaultTopic', '오늘의 운세'),
                    interpretations: allInterpretations,
                    language: preferredLanguage,
                    environmentContext,
                }),
            });
            if (summaryRes.ok) {
                const summaryData = await summaryRes.json();
                setCurrentMessage(summaryData.message);
                setCurrentExpression(summaryData.expression as AlphaExpression);
                const summaryMsg: ChatMessage = {
                    role: 'model',
                    content: `${isEnglish ? '[Summary Reading]' : '[종합 해석]'}\n${summaryData.message}`,
                    expression: summaryData.expression,
                    timestamp: Date.now(),
                };
                setMessages(prev => [...prev, summaryMsg]);
            }
        } catch (e) {
            console.error('Summary error:', e);
        } finally {
            setIsLoading(false);
        }
    }, [cardInterpretations, drawnCards, getCardName, getPositionName, isEnglish, preferredLanguage, readingTopic, t]);

    // 카드 영역 클릭 - 다음 카드 뒤집기 (순서대로)
    const handleCardAreaClick = useCallback(() => {
        if (isLoading) return;
        const flippedCount = drawnCards.filter(c => c.isFlipped).length;
        if (flippedCount >= 10) return; // 모든 카드 뒤집음
        handleCardClick(flippedCount);
    }, [isLoading, drawnCards, handleCardClick]);

    // 개별 카드 선택 (뒤집힌 카드 선택 가능)
    const handleIndividualCardClick = useCallback((index: number) => {
        if (isLoading) return;
        // 안 뒤집힌 카드 → 순서대로만 뒤집기
        if (!drawnCards[index]?.isFlipped) {
            const nextIndex = drawnCards.filter(c => c.isFlipped).length;
            if (index !== nextIndex) return; // 순서 아니면 무시
            handleCardClick(index);
            return;
        }
        // 이미 뒤집힌 카드 → 상세 보기
        setCurrentCardIndex(index);
        setShowCardDetail(true);
        if (cardInterpretations[index]) {
            const card = drawnCards[index];
            const position = SPREAD_POSITIONS[index];
            const cardName = `${getPositionName(position)} - ${getCardName(card.card)}${card.isReversed ? ` ${reversedTag}` : ''}`;
            const contextMessage = isEnglish
                ? `(The guest is looking again at the ${cardName} card)`
                : `(손님이 ${cardName} 카드를 다시 보고 있다)`;
            handleSendMessage(contextMessage);
        }
    }, [cardInterpretations, drawnCards, getCardName, getPositionName, handleCardClick, isEnglish, isLoading, reversedTag]);

    // 카드 상세 좌우 네비게이션
    const navigateCard = useCallback((direction: 'prev' | 'next') => {
        if (isLoading) return;
        const flippedIndices = drawnCards
            .map((c, i) => c.isFlipped ? i : -1)
            .filter(i => i >= 0);
        const currentPos = flippedIndices.indexOf(currentCardIndex);
        if (currentPos < 0) return;

        const newPos = direction === 'prev' ? currentPos - 1 : currentPos + 1;
        if (newPos < 0 || newPos >= flippedIndices.length) return;

        const newIndex = flippedIndices[newPos];
        setCurrentCardIndex(newIndex);
        if (cardInterpretations[newIndex]) {
            const card = drawnCards[newIndex];
            const position = SPREAD_POSITIONS[newIndex];
            const cardName = `${getPositionName(position)} - ${getCardName(card.card)}${card.isReversed ? ` ${reversedTag}` : ''}`;
            // AI에게 카드를 다시 보고 있다고 알려주고 자연스럽게 응답하게 함
            const contextMsg = isEnglish
                ? `(The guest is looking again at the ${cardName} card)`
                : `(손님이 ${cardName} 카드를 다시 보고 있다)`;
            handleSendMessage(contextMsg);
        }
    }, [cardInterpretations, currentCardIndex, drawnCards, getCardName, getPositionName, isEnglish, isLoading, reversedTag]);

    // 메시지 전송
    const handleSendMessage = async (content: string) => {
        if (!content.trim() || isLoading || isChatEnded || !memory) return;

        setIsLoading(true);
        setUserInput('');

        const isSecret = checkSecretPhrase(content);
        let updatedMemory = memory;

        if (isSecret && !memory.user.isMaster) {
            updatedMemory = authenticateMaster(memory);
            setMemory(updatedMemory);
        }

        const isSystemContext = content.startsWith('(') && content.endsWith(')');

        const newUserMessage: ChatMessage = {
            role: 'user',
            content: content.trim(),
            timestamp: Date.now()
        };

        const updatedMessages = [...messages, newUserMessage];
        // 시스템 컨텍스트 메시지는 API에는 보내지만 대화 UI에는 표시 안 함
        if (!isSystemContext) {
            setMessages(updatedMessages);
        }
        updatedMemory = addMessage(updatedMemory, 'user', content.trim());

        try {
            const memoryContext = getMemoryContext(updatedMemory);

            const response = await fetch('/api/chat/tarot/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
                    language: preferredLanguage,
                    memoryContext,
                    isReadingMode,
                    flippedCount: drawnCards.filter(c => c.isFlipped).length,
                    totalCards: drawnCards.length,
                    environmentContext,
                })
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();

            setCurrentMessage(data.message);
            setCurrentExpression(data.expression as AlphaExpression);

            const assistantMessage: ChatMessage = {
                role: 'model',
                content: data.message,
                expression: data.expression,
                timestamp: Date.now()
            };

            // prev 기반으로 AI 응답 추가 (카드 해석 메시지와 충돌 방지)
            setMessages(prev => [...prev, assistantMessage]);
            updatedMemory = addMessage(updatedMemory, 'model', data.message);
            setMemory(updatedMemory);
            saveMemory(updatedMemory);

            if (data.shouldSummary && isReadingMode) {
                // 큐에 종합 해석 액션 추가 → 클릭하면 실행
                setMessageQueue([{ message: '', expression: 'face', action: () => requestSummary() }]);
            } else if (data.shouldStartReading && !isReadingMode) {
                setReadingTopic(data.readingTopic || content);
                drawCards();
            } else if (data.shouldFlipCard && isReadingMode) {
                // 큐에 카드 뒤집기 액션 추가 → 클릭하면 실행
                const nextUnflipped = drawnCards.findIndex(c => !c.isFlipped);
                if (nextUnflipped >= 0) {
                    setMessageQueue([{ message: '', expression: 'face', action: () => handleCardClick(nextUnflipped) }]);
                }
            } else if (data.shouldEnd) {
                setIsChatEnded(true);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                saveWithHistory(updatedMemory, [...updatedMessages, assistantMessage]);
                setTimeout(goToCounter, 3000);
            }
        } catch (error) {
            console.error('Tarot chat error:', error);
            setCurrentMessage(t('tarot.error', '앗, 수정 구슬이 흐려졌어요... 🔮 다시 한번 말씀해주실래요?'));
            setCurrentExpression('trouble');
        } finally {
            setIsLoading(false);
        }
    };

    const handleActionClick = (actionId: string) => {
        const action = TAROT_ACTIONS.find(a => a.id === actionId);
        if (action) handleSendMessage(preferredLanguage === 'en' ? action.aiTextEn : action.aiTextKo);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userInput.trim()) handleSendMessage(userInput);
    };

    const handleEndChat = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (memory && messages.length > 0) saveWithHistory(memory, messages);
        goToCounter();
    };

    const formatChatLog = useCallback(() => {
        const date = new Date().toLocaleDateString(preferredLanguage === 'ko' ? 'ko-KR' : 'en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const header = `🔮 ${t('tarot.logTitle', '카페루아 타로 상담')} - ${date}\n${'─'.repeat(30)}\n\n`;
        const chatContent = messages.map(msg => {
            const speaker = msg.role === 'user' ? t('tarot.you', '나') : 'Alpha';
            return `${speaker}: ${msg.content}`;
        }).join('\n\n');
        return header + chatContent + `\n\n${'─'.repeat(30)}\n🏠 cafelua.com`;
    }, [messages, preferredLanguage, t]);

    const handleCopyLog = useCallback(async () => {
        const log = formatChatLog();
        try {
            await navigator.clipboard.writeText(log);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = log;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    }, [formatChatLog]);

    return (
        <div ref={overlayRef} className={`construction-overlay coffee-chat-mode tarot-mode ${isReadingMode ? 'reading-active' : ''}`}>
            <BackgroundMusic src="/sounds/taro-bgm.mp3" />

            <div
                className="construction-bg"
                style={{
                    backgroundImage: 'url(/tarot/tarot-room-bg.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: isReadingMode ? 'center top' : 'center'
                }}
            />

            {/* 타로 일러스트 - 리딩 모드가 아닐 때만 */}
            {!isReadingMode && (
                <div className="tarot-alpha-container">
                    <img
                        src="/characters/alpha/alpha-tarot-ready.webp"
                        alt="Alpha"
                        className="tarot-alpha-image"
                    />
                </div>
            )}

            {/* 켈틱 크로스 카드 배열 (리딩 모드일 때) */}
            {isReadingMode && drawnCards.length >= 10 && (
                <div
                    className="tarot-cards-container"
                >
                    <CelticCrossSpread
                        cards={drawnCards}
                        language={preferredLanguage}
                        currentIndex={currentCardIndex}
                        interpretedIndices={interpretedIndices}
                        nextFlipIndex={drawnCards.filter(c => c.isFlipped).length}
                        onCardClick={handleIndividualCardClick}
                        disabled={isLoading}
                    />
                </div>
            )}

            <div className="vn-container">
                <div className="vn-dialogue-box" onClick={() => {
                    if (hasQueue) advanceQueue();
                }}>
                    <div className="vn-content-row">
                        <img
                            src={getExpressionImagePath(currentExpression)}
                            alt="Alpha"
                            className={`vn-character ${isLoading ? 'thinking' : ''}`}
                        />
                        <div className="vn-text-group">
                            <div className="vn-name">Alpha 🔮</div>
                            <p className="vn-text">
                                {isLoading ? t('tarot.thinking', '생각 중...') : renderMessage(currentMessage)}
                            </p>
                        </div>
                    </div>


                    {/* 입력 영역 */}
                    {!isChatEnded && (
                        <div className="coffee-chat-input-row">
                            <form className="cc-form" onSubmit={handleSubmit}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="cc-input"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder={hasQueue ? t('tarot.clickToContinue', '대화창을 클릭하면 계속합니다') : t('tarot.inputPlaceholder', '고민이나 운명에 대해 물어보세요...')}
                                    disabled={isLoading || hasQueue}
                                />
                                <button
                                    type="submit"
                                    className="cc-send-btn"
                                    disabled={isLoading || hasQueue || !userInput.trim()}
                                >
                                    ✨
                                </button>
                            </form>

                            {messages.length > 0 && (
                                <button
                                    className="cc-log-btn"
                                    onClick={() => setShowLog(true)}
                                    title={t('tarot.viewLog', '상담 기록')}
                                >
                                    📜
                                </button>
                            )}

                            <button
                                className="cc-end-btn"
                                onClick={handleEndChat}
                                title={t('tarot.endChat', '상담 종료')}
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* 액션 버튼 */}
                    {!isChatEnded && (
                        <div className="cc-actions-row">
                            {TAROT_ACTIONS.map(action => (
                                <button
                                    key={action.id}
                                    className="cc-action-btn"
                                    onClick={() => handleActionClick(action.id)}
                                    disabled={isLoading}
                                >
                                    <span className="action-icon">{action.icon}</span>
                                    <span className="action-label">{t(action.label, action.id)}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {isChatEnded && (
                        <div className="vn-button-row">
                            <p className="cc-ended-text">{t('tarot.returning', '카운터로 돌아가는 중...')} 🌙</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 카드 확대 보기 (배경 투명) */}
            {showCardDetail && currentCardIndex >= 0 && drawnCards[currentCardIndex] && (
                <div className="card-detail-overlay card-detail-transparent">
                    {(() => {
                        const flippedIndices = drawnCards.map((c, i) => c.isFlipped ? i : -1).filter(i => i >= 0);
                        const currentPos = flippedIndices.indexOf(currentCardIndex);
                        const hasPrev = currentPos > 0;
                        const hasNext = currentPos < flippedIndices.length - 1;
                        return (
                            <div className="card-detail-content">
                                <button
                                    className="card-nav-btn card-nav-prev"
                                    onClick={() => navigateCard('prev')}
                                    disabled={!hasPrev}
                                    style={{ visibility: hasPrev ? 'visible' : 'hidden' }}
                                >
                                    ‹
                                </button>
                                <img
                                    src={drawnCards[currentCardIndex].card.imagePath}
                                    alt={getCardName(drawnCards[currentCardIndex].card)}
                                    className={`card-detail-image ${drawnCards[currentCardIndex].isReversed ? 'reversed' : ''}`}
                                    onClick={() => setShowCardDetail(false)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <button
                                    className="card-nav-btn card-nav-next"
                                    onClick={() => navigateCard('next')}
                                    disabled={!hasNext}
                                    style={{ visibility: hasNext ? 'visible' : 'hidden' }}
                                >
                                    ›
                                </button>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* 대화 로그 모달 */}
            {showLog && (
                <div className="cc-log-overlay" onClick={() => { setShowLog(false); setShowHistory(false); setSelectedHistory(null); }}>
                    <div className="cc-log-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cc-log-header">
                            <h3>{showHistory ? `📚 ${t('tarot.history', '이전 상담')}` : selectedHistory ? `📖 ${new Date(selectedHistory.date).toLocaleDateString(preferredLanguage === 'ko' ? 'ko-KR' : 'en-US')}` : `🔮 ${t('tarot.viewLog', '상담 기록')}`}</h3>
                            <div className="cc-log-header-btns">
                                {(showHistory || selectedHistory) && (
                                    <button className="cc-log-back" onClick={() => { setShowHistory(false); setSelectedHistory(null); }}>←</button>
                                )}
                                <button className="cc-log-close" onClick={() => { setShowLog(false); setShowHistory(false); setSelectedHistory(null); }}>✕</button>
                            </div>
                        </div>
                        <div className="cc-log-content">
                            {showHistory ? (
                                memory && getConversationHistory(memory).length > 0 ? (
                                    [...getConversationHistory(memory)].reverse().map((record) => (
                                        <div key={record.id} className="cc-history-item" onClick={() => { setSelectedHistory(record); setShowHistory(false); }}>
                                            <span className="cc-history-type">{record.type === 'coffee' ? '☕' : '🔮'}</span>
                                            <div className="cc-history-info">
                                                <span className="cc-history-date">{new Date(record.date).toLocaleDateString(preferredLanguage === 'ko' ? 'ko-KR' : 'en-US')}</span>
                                                <span className="cc-history-summary">{record.summary || `${record.messages.length} messages`}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="cc-history-empty">{t('tarot.noHistory', '이전 상담 기록이 없어요')}</p>
                                )
                            ) : selectedHistory ? (
                                selectedHistory.messages.map((msg, idx) => (
                                    <div key={idx} className={`cc-log-message ${msg.role === 'user' ? 'user' : 'alpha'}`}>
                                        <span className="cc-log-speaker">{msg.role === 'user' ? t('tarot.you', '나') : 'Alpha'}</span>
                                        <p className="cc-log-text">{msg.content}</p>
                                    </div>
                                ))
                            ) : (
                                messages.map((msg, idx) => (
                                    <div key={idx} className={`cc-log-message ${msg.role === 'user' ? 'user' : 'alpha'}`}>
                                        <span className="cc-log-speaker">{msg.role === 'user' ? t('tarot.you', '나') : 'Alpha'}</span>
                                        <p className="cc-log-text">{msg.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="cc-log-footer">
                            {!showHistory && !selectedHistory && (
                                <>
                                    <button className="cc-history-btn" onClick={() => setShowHistory(true)}>📚 {t('tarot.history', '이전 상담')}</button>
                                    <button className="cc-copy-btn" onClick={handleCopyLog}>{copySuccess ? '✓' : '📋'} {t('tarot.copy', '복사')}</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
