'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import BackgroundMusic from '@/components/BackgroundMusic';
import {
    getExpressionImagePath,
    USER_ACTIONS,
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
import '@/components/UnderConstruction.css';
import '@/components/CoffeeChatDialog.css';

const CHAT_TIMEOUT_MS = 5 * 60 * 1000; // 5분

// 타로 전용 액션들
const TAROT_ACTIONS = [
    { id: 'nod', icon: '🙂', label: '끄덕', aiText: '(고개를 끄덕인다)' },
    { id: 'think', icon: '🤔', label: '생각', aiText: '(깊이 생각한다)' },
    { id: 'curious', icon: '✨', label: '궁금', aiText: '(호기심 가득한 눈으로 본다)' },
    { id: 'sigh', icon: '😔', label: '한숨', aiText: '(한숨을 쉰다)' },
    { id: 'hope', icon: '🌟', label: '희망', aiText: '(희망찬 표정을 짓는다)' },
    { id: 'worry', icon: '😟', label: '걱정', aiText: '(걱정스러운 표정)' },
];

export default function TarotPage() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const overlayRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [memory, setMemory] = useState<ChatMemory | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [currentExpression, setCurrentExpression] = useState<AlphaExpression>('face');
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isChatEnded, setIsChatEnded] = useState<boolean>(false);
    const [showLog, setShowLog] = useState<boolean>(false);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [selectedHistory, setSelectedHistory] = useState<ConversationRecord | null>(null);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messagesRef = useRef<ChatMessage[]>([]);
    const memoryRef = useRef<ChatMemory | null>(null);

    // Refs 업데이트
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        memoryRef.current = memory;
    }, [memory]);

    // 카운터로 돌아가기
    const goToCounter = useCallback(() => {
        const query = searchParams.toString();
        router.push(query ? `/${i18n.language}/counter?${query}` : `/${i18n.language}/counter`);
    }, [router, searchParams, i18n.language]);

    // 뷰포트 높이 설정 (초기값만, 키보드 열림 시 리사이즈 안함)
    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        const ua = navigator.userAgent ?? '';
        const isFacebookWebView = /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i.test(ua);
        if (isFacebookWebView) {
            overlay.dataset.ucWebview = 'facebook';
        }

        // 초기 높이만 설정 (키보드 열림 시 변경 안함)
        const initialHeight = window.innerHeight;
        overlay.style.setProperty('--uc-vh', `${initialHeight * 0.01}px`);

        // orientation change만 처리
        const handleOrientationChange = () => {
            setTimeout(() => {
                overlay.style.setProperty('--uc-vh', `${window.innerHeight * 0.01}px`);
            }, 100);
        };

        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);

    // 대화 저장 (히스토리에 추가)
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

    // 메모리 로드 및 초기 인사
    useEffect(() => {
        let mem = loadMemory();

        // 이전 세션 메시지가 있으면 히스토리에 저장 후 초기화
        if (mem.recentMessages.length > 0) {
            const prevMessages: ConversationMessage[] = mem.recentMessages.map(m => ({
                role: m.role,
                content: m.content,
                timestamp: m.timestamp,
            }));
            const prevType = mem.lastSessionType || 'tarot';
            mem = saveConversationToHistory(mem, prevType, prevMessages);
            mem.recentMessages = [];
        }

        // 현재 세션 타입 설정
        mem.lastSessionType = 'tarot';
        saveMemory(mem);
        setMemory(mem);

        // 타로 전용 초기 인사
        const greeting = {
            message: '어서오세요... 🔮✨ 오늘 카페루아에서 타로 상담을 준비했어요. 아, 그런데... 사실 아직 마스터에게 카드 해석을 배우는 중이라서, 직접 점을 봐드리기는 어려워요. 😅 대신 운명이나 고민에 대해 함께 이야기 나눠볼까요?',
            expression: 'embarrassment' as AlphaExpression,
        };

        setCurrentMessage(greeting.message);
        setCurrentExpression(greeting.expression);

        // 타임아웃 설정
        timeoutRef.current = setTimeout(() => {
            setCurrentMessage('시간이 많이 흘렀네요... 🌙 오늘 대화 즐거웠어요. 다음에 또 와주세요!');
            setCurrentExpression('nice-talk');
            setIsChatEnded(true);
            if (memoryRef.current && messagesRef.current.length > 0) {
                saveWithHistory(memoryRef.current, messagesRef.current);
            }
            setTimeout(goToCounter, 3000);
        }, CHAT_TIMEOUT_MS);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [goToCounter, saveWithHistory]);

    // 대화 로그 포맷팅
    const formatChatLog = useCallback(() => {
        const date = new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const header = `🔮 카페루아 타로 상담 - ${date}\n${'─'.repeat(30)}\n\n`;

        const expressionEmoji: Record<string, string> = {
            'face': '😐',
            'nice-talk': '😊',
            'wink-smile': '😉',
            'embarrassment': '😅',
            'trouble': '😟',
            'disappointed': '😔',
            'dissatisfaction': '😤',
            'pouty-cheeks': '🥺',
        };

        const chatContent = messages.map(msg => {
            const speaker = msg.role === 'user' ? '나' : 'Alpha';
            if (msg.role === 'model' && msg.expression) {
                const emoji = expressionEmoji[msg.expression] || '';
                return `${speaker} ${emoji}: ${msg.content}`;
            }
            return `${speaker}: ${msg.content}`;
        }).join('\n\n');

        const footer = `\n\n${'─'.repeat(30)}\n🏠 cafelua.com`;

        return header + chatContent + footer;
    }, [messages]);

    // 대화 로그 복사
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

    // 메시지 전송 처리
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

        const newUserMessage: ChatMessage = {
            role: 'user',
            content: content.trim(),
            timestamp: Date.now()
        };

        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);

        updatedMemory = addMessage(updatedMemory, 'user', content.trim());

        try {
            const memoryContext = getMemoryContext(updatedMemory);

            const response = await fetch('/api/chat/tarot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    language: i18n.language,
                    memoryContext,
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            setCurrentMessage(data.message);
            setCurrentExpression(data.expression as AlphaExpression);

            const assistantMessage: ChatMessage = {
                role: 'model',
                content: data.message,
                expression: data.expression,
                timestamp: Date.now()
            };

            setMessages([...updatedMessages, assistantMessage]);

            updatedMemory = addMessage(updatedMemory, 'model', data.message);
            setMemory(updatedMemory);

            // 실시간 저장 (메시지마다)
            saveMemory(updatedMemory);

            if (data.shouldEnd) {
                setIsChatEnded(true);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                const allMessages = [...updatedMessages, assistantMessage];
                saveWithHistory(updatedMemory, allMessages);
                setTimeout(goToCounter, 3000);
            }
        } catch (error) {
            console.error('Tarot chat error:', error);
            setCurrentMessage('앗, 수정 구슬이 흐려졌어요... 🔮 다시 한번 말씀해주실래요?');
            setCurrentExpression('trouble');
        } finally {
            setIsLoading(false);
        }
    };

    // 액션 버튼 클릭
    const handleActionClick = (actionId: string) => {
        const action = TAROT_ACTIONS.find(a => a.id === actionId);
        if (action) {
            handleSendMessage(action.aiText);
        }
    };

    // 텍스트 입력 제출
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userInput.trim()) {
            handleSendMessage(userInput);
        }
    };

    // 대화 종료
    const handleEndChat = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (memory && messages.length > 0) {
            saveWithHistory(memory, messages);
        }

        goToCounter();
    };

    return (
        <div ref={overlayRef} className="construction-overlay coffee-chat-mode tarot-mode">
            {/* BGM */}
            <BackgroundMusic src="/sounds/taro-bgm.mp3" />

            {/* 타로 배경 (라운지 밤) */}
            <div
                className="construction-bg"
                style={{
                    backgroundImage: 'url(/lounge-background-img/lounge-night.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            {/* 타로 일러스트 (중앙, 라운딩) */}
            <div className="construction-illustration-frame">
                <img
                    src="/characters/alpha/alpha-tarot-ready.webp"
                    alt="Alpha"
                    className="construction-illustration"
                />
            </div>

            {/* VN 컨테이너 */}
            <div className="vn-container">
                <div className="vn-dialogue-box">
                    {/* 표정 + 대사 */}
                    <div className="vn-content-row">
                        <img
                            src={getExpressionImagePath(currentExpression)}
                            alt="Alpha"
                            className={`vn-character ${isLoading ? 'thinking' : ''}`}
                        />
                        <div className="vn-text-group">
                            <div className="vn-name">Alpha 🔮</div>
                            <p className="vn-text">
                                {isLoading ? t('tarot.thinking', '수정 구슬을 들여다보는 중...') + ' ✨' : currentMessage}
                            </p>
                        </div>
                    </div>

                    {/* 입력 영역 */}
                    {!isChatEnded && (
                        <div className="coffee-chat-input-row">
                            {/* 텍스트 입력 */}
                            <form className="cc-form" onSubmit={handleSubmit}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="cc-input"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder={t('tarot.inputPlaceholder', '고민이나 운명에 대해 물어보세요...')}
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    className="cc-send-btn"
                                    disabled={isLoading || !userInput.trim()}
                                >
                                    ✨
                                </button>
                            </form>

                            {/* 로그 보기 버튼 */}
                            {messages.length > 0 && (
                                <button
                                    className="cc-log-btn"
                                    onClick={() => setShowLog(true)}
                                    title={t('tarot.viewLog', '상담 기록')}
                                >
                                    📜
                                </button>
                            )}

                            {/* 종료 버튼 */}
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
                                    <span className="action-label">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 대화 종료 시 */}
                    {isChatEnded && (
                        <div className="vn-button-row">
                            <p className="cc-ended-text">{t('tarot.returning', '카운터로 돌아가는 중...')} 🌙</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 대화 로그 모달 */}
            {showLog && (
                <div className="cc-log-overlay" onClick={() => { setShowLog(false); setShowHistory(false); setSelectedHistory(null); }}>
                    <div className="cc-log-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cc-log-header">
                            <h3>{showHistory ? '📚 이전 상담' : selectedHistory ? `📖 ${new Date(selectedHistory.date).toLocaleDateString('ko-KR')}` : '🔮 상담 기록'}</h3>
                            <div className="cc-log-header-btns">
                                {(showHistory || selectedHistory) && (
                                    <button
                                        className="cc-log-back"
                                        onClick={() => { setShowHistory(false); setSelectedHistory(null); }}
                                    >
                                        ←
                                    </button>
                                )}
                                <button
                                    className="cc-log-close"
                                    onClick={() => { setShowLog(false); setShowHistory(false); setSelectedHistory(null); }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="cc-log-content">
                            {showHistory ? (
                                memory && getConversationHistory(memory).length > 0 ? (
                                    [...getConversationHistory(memory)].reverse().map((record) => (
                                        <div
                                            key={record.id}
                                            className="cc-history-item"
                                            onClick={() => { setSelectedHistory(record); setShowHistory(false); }}
                                        >
                                            <span className="cc-history-type">
                                                {record.type === 'coffee' ? '☕' : '🔮'}
                                            </span>
                                            <div className="cc-history-info">
                                                <span className="cc-history-date">
                                                    {new Date(record.date).toLocaleDateString('ko-KR', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                <span className="cc-history-summary">
                                                    {record.summary || `${record.messages.length}개의 메시지`}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="cc-history-empty">이전 상담 기록이 없어요</p>
                                )
                            ) : selectedHistory ? (
                                selectedHistory.messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`cc-log-message ${msg.role === 'user' ? 'user' : 'alpha'}`}
                                    >
                                        <span className="cc-log-speaker">
                                            {msg.role === 'user' ? '나' : 'Alpha'}
                                        </span>
                                        <p className="cc-log-text">{msg.content}</p>
                                    </div>
                                ))
                            ) : (
                                messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`cc-log-message ${msg.role === 'user' ? 'user' : 'alpha'}`}
                                    >
                                        <span className="cc-log-speaker">
                                            {msg.role === 'user' ? '나' : 'Alpha'}
                                        </span>
                                        <p className="cc-log-text">{msg.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="cc-log-footer">
                            {!showHistory && !selectedHistory && (
                                <>
                                    <button
                                        className="cc-history-btn"
                                        onClick={() => setShowHistory(true)}
                                    >
                                        📚 이전 상담
                                    </button>
                                    <button
                                        className="cc-copy-btn"
                                        onClick={handleCopyLog}
                                    >
                                        {copySuccess ? '✓ 복사됨!' : '📋 복사하기'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
