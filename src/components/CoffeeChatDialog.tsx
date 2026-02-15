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
    type ChatMemory
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

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 라운지로 이동
    const goToLounge = useCallback(() => {
        const query = searchParams.toString();
        router.push(query ? `/lounge?${query}` : '/lounge');
    }, [router, searchParams]);

    // 대화 요약 및 저장
    const summarizeAndSave = useCallback(async (mem: ChatMemory) => {
        if (mem.recentMessages.length < 2) {
            saveMemory(mem);
            return;
        }

        try {
            const response = await fetch('/api/chat/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: mem.recentMessages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            if (response.ok) {
                const data = await response.json();
                let updatedMemory = mem;

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
                saveMemory(mem);
            }
        } catch (e) {
            console.error('Failed to summarize:', e);
            saveMemory(mem);
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
        const mem = loadMemory();
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
            if (mem) {
                await summarizeAndSave(mem);
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

            if (data.shouldEnd) {
                setIsChatEnded(true);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                // 대화 요약 후 저장
                await summarizeAndSave(updatedMemory);

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

    // 대화 종료
    const handleEndChat = async () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // 대화 요약 후 저장
        if (memory && messages.length > 0) {
            const finalMemory = messages.reduce(
                (mem, msg) => addMessage(mem, msg.role, msg.content),
                memory
            );
            await summarizeAndSave(finalMemory);
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
        </div>
    );
};

export default CoffeeChatDialog;
