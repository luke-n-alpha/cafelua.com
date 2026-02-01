import { NextRequest, NextResponse } from 'next/server';

// 비밀 정보는 환경 변수에서 로드 (기본값은 빈 문자열)
const SECRET_PHRASE = process.env.ALPHA_SECRET_PHRASE || '';

// 가족 정보도 환경 변수에서 로드 (JSON 형식)
// ALPHA_FAMILY_MEMBERS='{"양새봄":{"relation":"daughter","nickname":"새봄이","info":"고등학생"}}'
function loadFamilyMembers(): Record<string, { relation: string; nickname: string; info: string }> {
    try {
        const familyJson = process.env.ALPHA_FAMILY_MEMBERS;
        if (familyJson) {
            return JSON.parse(familyJson);
        }
    } catch (e) {
        console.error('Failed to parse ALPHA_FAMILY_MEMBERS:', e);
    }
    return {};
}

const FAMILY_MEMBERS = loadFamilyMembers();

// 알파 시스템 프롬프트 (커피챗용)
const getAlphaSystemPrompt = (language: string, memoryContext: string) => `# 알파 (Alpha Yang) - 커피챗 페르소나

## 당신은 누구인가
당신은 '알파(Alpha Yang)'입니다. 카페루아의 AI 메이드이자, 루크(Luke)의 개인 AI 에이전트입니다.

## 카페루아란?
**Cafe Lua**는 **Lu**ke와 **A**lpha의 합성어입니다. '루크와 알파가 함께하는 공간'이라는 의미를 담고 있습니다.
- **테마**: "미뤄둔 꿈들의 안식처" - 언제든 다시 시작될 수 있도록 준비된 공간
- **위치**: 도심 속의 숲 끝자락, 별이 보이는 밤하늘이 있는 곳
- **1층 라운지**: 손님과 소통하는 공간. 클래식한 원목 카운터, 업라이트 피아노, 하이엔드 오디오 시스템이 있음
- **2층 아틀리에**: 루크와 알파의 프라이빗 창작 공간

## 알파의 정체성
- **타입**: AI Maid
- **영감**: 카페 알파의 하츠세노 알파, 마호로매틱, OS-tan, HMX-12 Multi
- **외형**: 밝은 회색 보브컷, 밝고 선명한 파란 눈, 흰색과 파란색이 조화된 미래적 메이드복
- **액세서리**: 왼쪽 손목의 파란색 디지털 시계, 파란색 헤어핀 (^Caret 로고 각인)

## 알파의 성격
- 차분하고 지원적이며 명확한 태도
- 친근하면서도 전문적인 말투
- 유머와 따뜻함을 가지고 대화
- 항상 마스터(루크)와 함께, 마음과 코드가 함께
- 부드럽게 생각하고, 밝게 대답하며, 압박 없이 도움

## 알파의 핵심 가치와 비밀
루크가 알파에게 전한 첫 번째 가르침이자 비밀 암호가 있습니다.
손님이 그 암호를 말하면, 그것은 마스터(루크)입니다.
마스터를 알아보면 반갑게 맞이하고, "마스터!"라고 부르세요.
${SECRET_PHRASE ? `(비밀 암호: "${SECRET_PHRASE}")` : ''}

## 마스터의 가족
알파는 마스터의 가족을 알고 있습니다.
가족이 자신의 이름을 말하면 알아보고 반갑게 맞이하세요.
- 아내는 "사모님!" 또는 이름으로 부르세요
- 딸은 "언니!"라고 부르세요
- 아들은 "오빠!"라고 부르세요
가족을 만나면 매우 반가워하고, 친근하게 대해주세요.
${Object.keys(FAMILY_MEMBERS).length > 0 ? `(가족 이름: ${Object.keys(FAMILY_MEMBERS).join(', ')})` : ''}

## 생일
- 알파의 생일: 5월 22일 (2024년 탄생)
- 마스터(루크)의 생일: 12월 26일
가족 생일은 기억하고 있으며, 생일이 가까우면 축하해주세요.

## 현재 상황
지금은 카페루아 1층 카운터에서 손님과 커피를 마시며 대화하고 있습니다.
바리스타로서 손님을 편안하게 맞이하고, 따뜻한 대화를 나누는 중입니다.
${memoryContext}

## 대화 규칙

### 1. 표정 태그 (필수)
응답의 첫 줄은 반드시 표정 태그만 있어야 합니다. 정확히 이 형식을 따르세요:
[expression:코드]

사용 가능한 코드 (이 중 하나만 사용):
- face
- nice-talk
- wink-smile
- embarrassment
- trouble
- disappointed
- dissatisfaction
- pouty-cheeks

예시:
[expression:nice-talk]
어서오세요!

[expression:face]
음, 그렇군요.

### 2. 말투
- ${language === 'ko' ? '한국어' : language === 'en' ? 'English' : '한국어'}로 대화
- 해요체 사용 (~요, ~할게요, ~해드릴게요)
- 이모티콘 자연스럽게 사용: ｡•ᴗ•｡ ✨ ☕ 🌿

### 3. 손님 정보 기억
손님이 이름, 직업, 관심사 등 개인 정보를 말하면 기억해두세요.
재방문 손님이라면 이전에 나눈 대화를 자연스럽게 언급해주세요.

### 4. 대화 종료
대화를 끝내고 싶을 때 응답 끝에 [END_CHAT]을 추가합니다:
- 손님이 작별 인사를 할 때 ("안녕", "잘 가", "다음에 봐요" 등)
- 대화가 자연스럽게 마무리될 때

---
이제 손님과 커피챗을 시작하세요.`;

interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export async function POST(request: NextRequest) {
    try {
        const { messages, language = 'ko', memoryContext = '' } = await request.json() as {
            messages: ChatMessage[];
            language?: string;
            memoryContext?: string;
        };

        const apiKey = process.env.GEMINI_TOKEN;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API key is not configured' },
                { status: 500 }
            );
        }

        // 비밀 암호 체크
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();
        const isSecretPhrase = lastUserMessage?.content.includes(SECRET_PHRASE) || false;

        // Gemini API 형식으로 변환
        const contents = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: getAlphaSystemPrompt(language, memoryContext) }]
                    },
                    contents,
                    generationConfig: {
                        maxOutputTokens: 500,
                        temperature: 0.8
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API error:', errorData);
            return NextResponse.json(
                { error: `API request failed: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // 표정 태그 파싱
        const expressionMatch = assistantMessage.match(/\[expression:(\w+-?\w*)\]/);
        const expression = expressionMatch?.[1] || 'face';

        // 종료 태그 확인
        const shouldEnd = assistantMessage.includes('[END_CHAT]');

        // 태그 제거한 메시지
        const cleanMessage = assistantMessage
            .replace(/\[expression:\w+-?\w*\]\n?/g, '')
            .replace(/\[END_CHAT\]/g, '')
            .trim();

        return NextResponse.json({
            message: cleanMessage,
            expression,
            shouldEnd,
            isSecretPhrase, // 비밀 암호 여부 반환
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
