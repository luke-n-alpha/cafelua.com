'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import BackgroundMusic from './BackgroundMusic';
import {
    getGreetingMessage,
    getTimeoutMessage,
    getErrorMessage,
    getExpressionImagePath,
    USER_ACTIONS,
    type ChatMessage,
    type AlphaExpression
} from '../services/GeminiChatService';
import {
    loadMemory,
    saveMemory,
    addMessage,
    getMemoryContext,
    checkSecretPhrase,
    authenticateMaster,
    updateUserInfo,
    saveSummary,
    saveConversationToHistory,
    getConversationHistory,
    type ChatMemory,
    type ConversationRecord,
    type ConversationMessage
} from '../services/ChatMemoryService';
import './UnderConstruction.css';
import './CoffeeChatDialog.css';

interface CoffeeChatDialogProps {
    backgroundSrc: string;
    onClose: () => void;
}

const CHAT_TIMEOUT_MS = 5 * 60 * 1000; // 5분

const CoffeeChatDialog: React.FC<CoffeeChatDialogProps> = ({
    backgroundSrc,
    onClose
}) => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const overlayRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [memory, setMemory] = useState<ChatMemory | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [currentExpression, setCurrentExpression] = useState<AlphaExpression>('nice-talk');
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

    // 라운지로 이동
    const goToLounge = useCallback(() => {
        const query = searchParams.toString();
        router.push(query ? `/${i18n.language}/lounge?${query}` : `/${i18n.language}/lounge`);
    }, [router, searchParams, i18n.language]);

    // 대화 요약 및 저장
    const summarizeAndSave = useCallback(async (mem: ChatMemory, chatMessages: ChatMessage[]) => {
        if (chatMessages.length < 2) {
            saveMemory(mem);
            return;
        }

        // 대화를 히스토리에 저장
        const historyMessages: ConversationMessage[] = chatMessages.map(m => ({
            role: m.role,
            content: m.content,
            expression: m.expression,
            timestamp: m.timestamp || Date.now(),
        }));

        try {
            const response = await fetch('/api/chat/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: chatMessages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            if (response.ok) {
                const data = await response.json();
                let updatedMemory = mem;

                // 히스토리에 저장
                updatedMemory = saveConversationToHistory(
                    updatedMemory,
                    'coffee',
                    historyMessages,
                    data.summary
                );

                if (data.name || data.nickname || data.interests?.length || data.importantFacts?.length) {
                    updatedMemory = updateUserInfo(updatedMemory, {
                        name: data.name || undefined,
                        nickname: data.nickname || undefined,
                        interests: data.interests || [],
                        importantFacts: data.importantFacts || [],
                    });
                }

                if (data.summary) {
                    updatedMemory = saveSummary(updatedMemory, data.summary);
                }

                saveMemory(updatedMemory);
            } else {
                // 요약 실패해도 히스토리에는 저장
                let updatedMemory = saveConversationToHistory(mem, 'coffee', historyMessages);
                saveMemory(updatedMemory);
            }
        } catch (e) {
            console.error('Failed to summarize:', e);
            // 요약 실패해도 히스토리에는 저장
            let updatedMemory = saveConversationToHistory(mem, 'coffee', historyMessages);
            saveMemory(updatedMemory);
        }
    }, []);

    // 뷰포트 높이 설정
    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        const ua = navigator.userAgent ?? '';
        const isFacebookWebView = /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i.test(ua);
        if (isFacebookWebView) {
            overlay.dataset.ucWebview = 'facebook';
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
            const prevType = mem.lastSessionType || 'coffee';
            mem = saveConversationToHistory(mem, prevType, prevMessages);
            mem.recentMessages = [];
        }

        // 현재 세션 타입 설정
        mem.lastSessionType = 'coffee';
        saveMemory(mem);
        setMemory(mem);

        // 재방문 손님 인사
        let greeting = getGreetingMessage(i18n.language);
        if (mem.user.visitCount > 1) {
            const name = mem.user.name || mem.user.nickname;
            if (name) {
                greeting = {
                    message: `어서오세요, ${name}님! 다시 오셨군요. ☕ 오늘도 좋은 이야기 나눠요! ｡•ᴗ•｡✨`,
                    expression: 'nice-talk',
                    shouldEnd: false,
                };
            } else {
                greeting = {
                    message: `어서오세요! 다시 찾아주셨군요. ☕ 반가워요! ｡•ᴗ•｡✨`,
                    expression: 'nice-talk',
                    shouldEnd: false,
                };
            }
        }

        setCurrentMessage(greeting.message);
        setCurrentExpression(greeting.expression);

        // 타임아웃 설정
        timeoutRef.current = setTimeout(async () => {
            const timeout = getTimeoutMessage(i18n.language);
            setCurrentMessage(timeout.message);
            setCurrentExpression(timeout.expression);
            setIsChatEnded(true);

            // 대화 요약 후 저장
            if (memoryRef.current && messagesRef.current.length > 0) {
                await summarizeAndSave(memoryRef.current, messagesRef.current);
            }

            setTimeout(goToLounge, 3000);
        }, CHAT_TIMEOUT_MS);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [i18n.language, goToLounge, summarizeAndSave]);

    // 메시지 전송 처리
    const handleSendMessage = async (content: string) => {
        if (!content.trim() || isLoading || isChatEnded || !memory) return;

        setIsLoading(true);
        setUserInput('');

        // 비밀 암호 체크
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

        // 메모리에 메시지 추가
        updatedMemory = addMessage(updatedMemory, 'user', content.trim());

        try {
            const memoryContext = getMemoryContext(updatedMemory);

            const response = await fetch('/api/chat', {
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

            // 메모리에 응답 추가
            updatedMemory = addMessage(updatedMemory, 'model', data.message);
            setMemory(updatedMemory);

            // 실시간 저장 (메시지마다)
            saveMemory(updatedMemory);

            if (data.shouldEnd) {
                setIsChatEnded(true);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                // 대화 요약 후 저장
                const allMessages = [...updatedMessages, assistantMessage];
                await summarizeAndSave(updatedMemory, allMessages);

                setTimeout(goToLounge, 3000);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorResponse = getErrorMessage(i18n.language);
            setCurrentMessage(errorResponse.message);
            setCurrentExpression(errorResponse.expression);
        } finally {
            setIsLoading(false);
        }
    };

    // 액션 버튼 클릭
    const handleActionClick = (actionId: string) => {
        const action = USER_ACTIONS.find(a => a.id === actionId);
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

    // 대화 로그 포맷팅
    const formatChatLog = useCallback(() => {
        const date = new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const header = `☕ 카페루아 커피챗 - ${date}\n${'─'.repeat(30)}\n\n`;

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
        } catch (e) {
            console.error('Failed to copy:', e);
            // 폴백: textarea 사용
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

    // 대화 종료
    const handleEndChat = async () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // 대화 요약 후 저장
        if (memory && messages.length > 0) {
            await summarizeAndSave(memory, messages);
        }

        onClose();
    };

    return (
        <div ref={overlayRef} className="construction-overlay coffee-chat-mode">
            {/* BGM */}
            <BackgroundMusic src="/sounds/coffee-chat.mp3" />

            {/* 배경 이미지 */}
            <img
                src={backgroundSrc}
                alt=""
                aria-hidden="true"
                className="construction-bg"
            />

            {/* 커피챗 일러스트 (중앙, 라운딩) */}
            <div className="construction-illustration-frame">
                <img
                    src="/characters/alpha/alpha-coffee-chat.webp"
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
                            <div className="vn-name">Alpha</div>
                            <p className="vn-text">
                                {isLoading ? t('coffeeChat.thinking', '생각 중...') : currentMessage}
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
                                    placeholder={t('coffeeChat.inputPlaceholder', '무슨 말을 할까요?')}
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    className="cc-send-btn"
                                    disabled={isLoading || !userInput.trim()}
                                >
                                    ▶
                                </button>
                            </form>

                            {/* 로그 보기 버튼 */}
                            {messages.length > 0 && (
                                <button
                                    className="cc-log-btn"
                                    onClick={() => setShowLog(true)}
                                    title={t('coffeeChat.viewLog', '대화 기록')}
                                >
                                    📜
                                </button>
                            )}

                            {/* 종료 버튼 */}
                            <button
                                className="cc-end-btn"
                                onClick={handleEndChat}
                                title={t('coffeeChat.endChat', '대화 종료')}
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* 액션 버튼 (비언어) */}
                    {!isChatEnded && (
                        <div className="cc-actions-row">
                            {USER_ACTIONS.map(action => (
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
                            <p className="cc-ended-text">{t('coffeeChat.returning', '라운지로 돌아가는 중...')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 대화 로그 모달 */}
            {showLog && (
                <div className="cc-log-overlay" onClick={() => { setShowLog(false); setShowHistory(false); setSelectedHistory(null); }}>
                    <div className="cc-log-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cc-log-header">
                            <h3>{showHistory ? '📚 이전 대화' : selectedHistory ? `📖 ${new Date(selectedHistory.date).toLocaleDateString('ko-KR')}` : '☕ 대화 기록'}</h3>
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
                                // 히스토리 목록
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
                                    <p className="cc-history-empty">이전 대화 기록이 없어요</p>
                                )
                            ) : selectedHistory ? (
                                // 선택된 히스토리 상세
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
                                // 현재 대화
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
                                        📚 이전 대화
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
};

export default CoffeeChatDialog;
