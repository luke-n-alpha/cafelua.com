/**
 * GeminiChatService - 알파와의 커피챗을 위한 클라이언트 서비스
 *
 * 사용 모델: gemini-2.0-flash
 * API: /api/chat (서버 사이드)
 */

// 알파의 표정 타입
export type AlphaExpression =
    | 'face'           // 기본
    | 'nice-talk'      // 좋은 대화
    | 'wink-smile'     // 윙크 미소
    | 'embarrassment'  // 당황
    | 'trouble'        // 곤란
    | 'disappointed'   // 실망
    | 'dissatisfaction' // 불만
    | 'pouty-cheeks';  // 뾰루퉁

// 메시지 타입
export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    expression?: AlphaExpression;
    timestamp: number;
}

// 응답 타입
export interface ChatResponse {
    message: string;
    expression: AlphaExpression;
    shouldEnd: boolean;
}

// 유저 액션 타입
export interface UserAction {
    id: string;
    icon: string;
    label: string;
    aiText: string;
}

// 유저 액션 목록
export const USER_ACTIONS: UserAction[] = [
    { id: 'silence', icon: '🤫', label: '침묵', aiText: '*손님이 아무 말 없이 가만히 있다*' },
    { id: 'nod', icon: '😌', label: '끄덕', aiText: '*손님이 고개를 끄덕인다*' },
    { id: 'smile', icon: '😊', label: '웃음', aiText: '*손님이 말없이 미소 짓는다*' },
    { id: 'sigh', icon: '😮‍💨', label: '한숨', aiText: '*손님이 말없이 한숨을 쉰다*' },
    { id: 'frown', icon: '😤', label: '찡그림', aiText: '*손님이 얼굴을 찡그린다*' },
    { id: 'cry', icon: '😢', label: '울음', aiText: '*손님이 말없이 눈물을 흘린다*' },
    { id: 'coffee', icon: '☕', label: '커피', aiText: '*손님이 커피를 한 모금 마신다*' },
    { id: 'poke', icon: '👆', label: '톡톡', aiText: '*손님이 알파를 가볍게 툭 친다*' },
];

// 서버 API를 통한 채팅 메시지 전송
export async function sendChatMessage(
    messages: ChatMessage[],
    language: string = 'ko'
): Promise<ChatResponse> {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                language
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Chat API error:', errorData);
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        return {
            message: data.message,
            expression: data.expression as AlphaExpression,
            shouldEnd: data.shouldEnd
        };
    } catch (error) {
        console.error('GeminiChatService error:', error);
        throw error;
    }
}

// 표정에 따른 이미지 경로 반환
export function getExpressionImagePath(expression: AlphaExpression): string {
    return `/characters/alpha/face-variation/alpha-${expression}.webp`;
}

// 기본 인사 메시지 생성
export function getGreetingMessage(language: string = 'ko'): ChatResponse {
    const greetings: Record<string, string> = {
        ko: '어서오세요, 손님! 카운터에 오셨군요. ☕ 오늘은 무슨 이야기를 나눠볼까요? ｡•ᴗ•｡✨',
        en: 'Welcome! You came to the counter. ☕ What shall we talk about today? ｡•ᴗ•｡✨'
    };

    return {
        message: greetings[language] || greetings.ko,
        expression: 'nice-talk',
        shouldEnd: false
    };
}

// 시간 초과 메시지 생성
export function getTimeoutMessage(language: string = 'ko'): ChatResponse {
    const messages: Record<string, string> = {
        ko: '아, 벌써 시간이 이렇게 됐네요! ☕ 다음에 또 이야기해요, 손님. 좋은 하루 되세요~ ｡•ᴗ•｡✨🌿',
        en: 'Oh, time flies! ☕ Let\'s talk again next time. Have a nice day~ ｡•ᴗ•｡✨🌿'
    };

    return {
        message: messages[language] || messages.ko,
        expression: 'wink-smile',
        shouldEnd: true
    };
}

// 에러 메시지 생성
export function getErrorMessage(language: string = 'ko'): ChatResponse {
    const messages: Record<string, string> = {
        ko: '앗, 죄송해요... 잠시 생각이 흐려졌어요. 😅 다시 말씀해주시겠어요?',
        en: 'Oh, sorry... My thoughts got a bit fuzzy. 😅 Could you say that again?'
    };

    return {
        message: messages[language] || messages.ko,
        expression: 'trouble',
        shouldEnd: false
    };
}
