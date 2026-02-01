/**
 * CoffeeChatDialog 컴포넌트 테스트
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next/navigation
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    useSearchParams: () => mockSearchParams,
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, fallback?: string) => fallback || key,
        i18n: {
            language: 'ko',
        },
    }),
}));

// Mock GeminiChatService
jest.mock('../../src/services/GeminiChatService', () => ({
    sendChatMessage: jest.fn(),
    getGreetingMessage: jest.fn(() => ({
        message: '어서오세요, 손님!',
        expression: 'nice-talk',
        shouldEnd: false,
    })),
    getTimeoutMessage: jest.fn(() => ({
        message: '시간이 다 됐어요!',
        expression: 'wink-smile',
        shouldEnd: true,
    })),
    getErrorMessage: jest.fn(() => ({
        message: '죄송해요, 에러가 발생했어요.',
        expression: 'trouble',
        shouldEnd: false,
    })),
    getExpressionImagePath: jest.fn((exp: string) => `/characters/alpha/face-variation/alpha-${exp}.webp`),
    USER_ACTIONS: [
        { id: 'silence', icon: '🤫', label: '침묵', aiText: '*손님이 가만히 있다*' },
        { id: 'smile', icon: '😊', label: '웃음', aiText: '*손님이 미소 짓는다*' },
    ],
}));

import CoffeeChatDialog from '../../src/components/CoffeeChatDialog';
import { sendChatMessage } from '../../src/services/GeminiChatService';

describe('CoffeeChatDialog', () => {
    const defaultProps = {
        backgroundSrc: '/test-bg.webp',
        onClose: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('초기 인사 메시지가 표시되어야 한다', () => {
        render(<CoffeeChatDialog {...defaultProps} />);
        expect(screen.getByText('어서오세요, 손님!')).toBeInTheDocument();
    });

    it('Alpha 이름이 표시되어야 한다', () => {
        render(<CoffeeChatDialog {...defaultProps} />);
        expect(screen.getByText('Alpha')).toBeInTheDocument();
    });

    it('알파 표정 이미지가 렌더링되어야 한다', () => {
        render(<CoffeeChatDialog {...defaultProps} />);
        const portrait = screen.getByAltText('Alpha');
        expect(portrait).toBeInTheDocument();
        expect(portrait).toHaveAttribute('src', '/characters/alpha/face-variation/alpha-nice-talk.webp');
    });

    it('액션 버튼들이 표시되어야 한다', () => {
        render(<CoffeeChatDialog {...defaultProps} />);
        expect(screen.getByText('침묵')).toBeInTheDocument();
        expect(screen.getByText('웃음')).toBeInTheDocument();
    });

    it('입력 모드 토글 버튼이 작동해야 한다', () => {
        render(<CoffeeChatDialog {...defaultProps} />);
        const toggleButton = screen.getByTitle('직접 입력');
        fireEvent.click(toggleButton);
        expect(screen.getByPlaceholderText('무슨 말을 할까요?')).toBeInTheDocument();
    });

    it('종료 버튼 클릭 시 라운지로 이동해야 한다', () => {
        render(<CoffeeChatDialog {...defaultProps} />);
        const endButton = screen.getByTitle('대화 종료');
        fireEvent.click(endButton);
        expect(mockPush).toHaveBeenCalledWith('/lounge');
    });

    it('액션 버튼 클릭 시 API를 호출해야 한다', async () => {
        (sendChatMessage as jest.Mock).mockResolvedValue({
            message: '알파의 응답',
            expression: 'face',
            shouldEnd: false,
        });

        render(<CoffeeChatDialog {...defaultProps} />);
        const silenceButton = screen.getByText('침묵').closest('button');
        fireEvent.click(silenceButton!);

        await waitFor(() => {
            expect(sendChatMessage).toHaveBeenCalled();
        });
    });

    it('대화 종료 시 라운지로 이동 메시지가 표시되어야 한다', async () => {
        (sendChatMessage as jest.Mock).mockResolvedValue({
            message: '안녕히 가세요!',
            expression: 'wink-smile',
            shouldEnd: true,
        });

        render(<CoffeeChatDialog {...defaultProps} />);
        const silenceButton = screen.getByText('침묵').closest('button');
        fireEvent.click(silenceButton!);

        await waitFor(() => {
            expect(screen.getByText('라운지로 돌아가는 중...')).toBeInTheDocument();
        });
    });
});
