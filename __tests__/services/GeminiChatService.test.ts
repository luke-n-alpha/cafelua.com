/**
 * GeminiChatService 테스트
 */

import {
    getGreetingMessage,
    getTimeoutMessage,
    getErrorMessage,
    getExpressionImagePath,
    USER_ACTIONS,
    type AlphaExpression
} from '../../src/services/GeminiChatService';

describe('GeminiChatService', () => {
    describe('getGreetingMessage', () => {
        it('한국어 인사 메시지를 반환해야 한다', () => {
            const result = getGreetingMessage('ko');
            expect(result.message).toContain('어서오세요');
            expect(result.expression).toBe('nice-talk');
            expect(result.shouldEnd).toBe(false);
        });

        it('영어 인사 메시지를 반환해야 한다', () => {
            const result = getGreetingMessage('en');
            expect(result.message).toContain('Welcome');
            expect(result.expression).toBe('nice-talk');
            expect(result.shouldEnd).toBe(false);
        });

        it('알 수 없는 언어는 한국어로 폴백해야 한다', () => {
            const result = getGreetingMessage('fr');
            expect(result.message).toContain('어서오세요');
        });
    });

    describe('getTimeoutMessage', () => {
        it('타임아웃 메시지를 반환하고 shouldEnd가 true여야 한다', () => {
            const result = getTimeoutMessage('ko');
            expect(result.message).toContain('시간');
            expect(result.expression).toBe('wink-smile');
            expect(result.shouldEnd).toBe(true);
        });
    });

    describe('getErrorMessage', () => {
        it('에러 메시지를 반환하고 shouldEnd가 false여야 한다', () => {
            const result = getErrorMessage('ko');
            expect(result.message).toContain('죄송');
            expect(result.expression).toBe('trouble');
            expect(result.shouldEnd).toBe(false);
        });
    });

    describe('getExpressionImagePath', () => {
        const expressions: AlphaExpression[] = [
            'face',
            'nice-talk',
            'wink-smile',
            'embarrassment',
            'trouble',
            'disappointed',
            'dissatisfaction',
            'pouty-cheeks'
        ];

        expressions.forEach(expression => {
            it(`${expression} 표정에 대한 올바른 경로를 반환해야 한다`, () => {
                const path = getExpressionImagePath(expression);
                expect(path).toBe(`/characters/alpha/face-variation/alpha-${expression}.webp`);
            });
        });
    });

    describe('USER_ACTIONS', () => {
        it('8개의 액션이 정의되어 있어야 한다', () => {
            expect(USER_ACTIONS).toHaveLength(8);
        });

        it('모든 액션에 필수 필드가 있어야 한다', () => {
            USER_ACTIONS.forEach(action => {
                expect(action).toHaveProperty('id');
                expect(action).toHaveProperty('icon');
                expect(action).toHaveProperty('labelKey');
                expect(action).toHaveProperty('aiTextKo');
                expect(action).toHaveProperty('aiTextEn');
            });
        });

        it('액션 aiText ko/en은 이탤릭 형식이어야 한다', () => {
            USER_ACTIONS.forEach(action => {
                expect(action.aiTextKo).toMatch(/^\*.*\*$/);
                expect(action.aiTextEn).toMatch(/^\*.*\*$/);
            });
        });

        it('특정 액션들이 포함되어 있어야 한다', () => {
            const actionIds = USER_ACTIONS.map(a => a.id);
            expect(actionIds).toContain('silence');
            expect(actionIds).toContain('smile');
            expect(actionIds).toContain('coffee');
            expect(actionIds).toContain('poke');
        });
    });
});
