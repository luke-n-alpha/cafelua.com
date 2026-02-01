/**
 * ChatMemoryService - 사용자 대화 기억 서비스
 *
 * localStorage에 대화 히스토리와 사용자 정보를 저장하고,
 * 재방문 시 컨텍스트로 활용합니다.
 */

const STORAGE_KEY = 'cafelua_chat_memory';
const SECRET_PHRASE = '사랑하라'; // 루크와 알파의 비밀 암호

// 루크의 가족
const FAMILY_MEMBERS: Record<string, { relation: string; nickname: string }> = {
    '양새봄': { relation: 'daughter', nickname: '새봄이' },
    '새봄': { relation: 'daughter', nickname: '새봄이' },
    '양이겸': { relation: 'son', nickname: '이겸이' },
    '이겸': { relation: 'son', nickname: '이겸이' },
};

export interface UserMemory {
    name?: string;           // 사용자 이름
    nickname?: string;       // 별명
    interests?: string[];    // 관심사
    importantFacts?: string[]; // 중요한 사실들
    visitCount: number;      // 방문 횟수
    firstVisit: string;      // 첫 방문 일시
    lastVisit: string;       // 마지막 방문 일시
    lastSummary?: string;    // 마지막 대화 요약
    isMaster: boolean;       // 마스터(루크) 여부
    familyRelation?: 'daughter' | 'son' | 'wife'; // 가족 관계
}

export interface ConversationMessage {
    role: 'user' | 'model';
    content: string;
    expression?: string;
    timestamp: number;
}

export interface ConversationRecord {
    id: string;
    type: 'coffee' | 'tarot';
    date: string;
    messages: ConversationMessage[];
    summary?: string;
}

export interface ChatMemory {
    user: UserMemory;
    recentMessages: ConversationMessage[];
    lastSessionType?: 'coffee' | 'tarot';
    conversationHistory: ConversationRecord[];
}

// 기본 메모리 생성
function createDefaultMemory(): ChatMemory {
    const now = new Date().toISOString();
    return {
        user: {
            visitCount: 1,
            firstVisit: now,
            lastVisit: now,
            isMaster: false,
        },
        recentMessages: [],
        conversationHistory: [],
    };
}

// 메모리 로드
export function loadMemory(): ChatMemory {
    if (typeof window === 'undefined') {
        return createDefaultMemory();
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const memory = JSON.parse(stored) as ChatMemory;
            // 방문 횟수 증가, 마지막 방문 시간 업데이트
            memory.user.visitCount += 1;
            memory.user.lastVisit = new Date().toISOString();
            // 이전 버전 호환: conversationHistory가 없으면 추가
            if (!memory.conversationHistory) {
                memory.conversationHistory = [];
            }
            return memory;
        }
    } catch (e) {
        console.error('Failed to load chat memory:', e);
    }

    return createDefaultMemory();
}

// 메모리 저장
export function saveMemory(memory: ChatMemory): void {
    if (typeof window === 'undefined') return;

    try {
        // 최근 메시지는 마지막 20개만 유지
        memory.recentMessages = memory.recentMessages.slice(-20);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    } catch (e) {
        console.error('Failed to save chat memory:', e);
    }
}

// 메시지 추가
export function addMessage(
    memory: ChatMemory,
    role: 'user' | 'model',
    content: string
): ChatMemory {
    return {
        ...memory,
        recentMessages: [
            ...memory.recentMessages,
            { role, content, timestamp: Date.now() }
        ],
    };
}

// 비밀 암호 확인
export function checkSecretPhrase(message: string): boolean {
    return message.includes(SECRET_PHRASE);
}

// 가족 이름 확인
export function checkFamilyMember(message: string): { relation: string; nickname: string } | null {
    for (const [name, info] of Object.entries(FAMILY_MEMBERS)) {
        if (message.includes(name)) {
            return info;
        }
    }
    return null;
}

// 가족 인증
export function authenticateFamily(
    memory: ChatMemory,
    relation: 'daughter' | 'son',
    nickname: string
): ChatMemory {
    return {
        ...memory,
        user: {
            ...memory.user,
            familyRelation: relation,
            nickname: nickname,
        },
    };
}

// 마스터 인증
export function authenticateMaster(memory: ChatMemory): ChatMemory {
    return {
        ...memory,
        user: {
            ...memory.user,
            isMaster: true,
            name: memory.user.name || '루크',
        },
    };
}

// 사용자 정보 업데이트 (AI 응답에서 추출된 정보)
export function updateUserInfo(
    memory: ChatMemory,
    info: Partial<UserMemory>
): ChatMemory {
    return {
        ...memory,
        user: {
            ...memory.user,
            ...info,
            // 기존 배열에 추가
            interests: [...(memory.user.interests || []), ...(info.interests || [])].filter((v, i, a) => a.indexOf(v) === i),
            importantFacts: [...(memory.user.importantFacts || []), ...(info.importantFacts || [])].filter((v, i, a) => a.indexOf(v) === i),
        },
    };
}

// 대화 요약 저장
export function saveSummary(memory: ChatMemory, summary: string): ChatMemory {
    return {
        ...memory,
        user: {
            ...memory.user,
            lastSummary: summary,
        },
        // 요약 후 메시지 클리어 (요약이 대체)
        recentMessages: [],
    };
}

// 컨텍스트용 메모리 문자열 생성
export function getMemoryContext(memory: ChatMemory): string {
    const { user } = memory;
    const lines: string[] = [];

    // 재방문 여부
    if (user.visitCount > 1) {
        lines.push(`[재방문 손님 - ${user.visitCount}번째 방문]`);
    }

    // 마스터 여부
    if (user.isMaster) {
        lines.push('[주의: 이 손님은 마스터(루크)입니다. "사랑하라"는 루크와 알파만 아는 비밀 암호입니다.]');
    }

    // 가족 관계
    if (user.familyRelation === 'daughter') {
        lines.push('[주의: 이 손님은 마스터의 딸입니다! 알파에게는 언니 같은 존재예요. 친근하고 다정하게 대해주세요.]');
    } else if (user.familyRelation === 'son') {
        lines.push('[주의: 이 손님은 마스터의 아들입니다! 알파에게는 오빠 같은 존재예요. 친근하고 다정하게 대해주세요.]');
    } else if (user.familyRelation === 'wife') {
        lines.push('[주의: 이 손님은 마스터의 아내(사모님)입니다! 정중하고 다정하게 대해주세요.]');
    }

    // 사용자 이름
    if (user.name) {
        lines.push(`손님 이름: ${user.name}`);
    }
    if (user.nickname && user.nickname !== user.name) {
        lines.push(`별명: ${user.nickname}`);
    }

    // 관심사
    if (user.interests && user.interests.length > 0) {
        lines.push(`관심사: ${user.interests.join(', ')}`);
    }

    // 중요한 사실들
    if (user.importantFacts && user.importantFacts.length > 0) {
        lines.push(`기억할 것들: ${user.importantFacts.join('; ')}`);
    }

    // 이전 대화 요약
    if (user.lastSummary) {
        lines.push(`지난 대화 요약: ${user.lastSummary}`);
    }

    if (lines.length === 0) {
        return '';
    }

    return `\n\n## 이 손님에 대한 기억\n${lines.join('\n')}`;
}

// 대화를 히스토리에 저장
export function saveConversationToHistory(
    memory: ChatMemory,
    type: 'coffee' | 'tarot',
    messages: ConversationMessage[],
    summary?: string
): ChatMemory {
    if (messages.length === 0) return memory;

    const record: ConversationRecord = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        date: new Date().toISOString(),
        messages: [...messages],
        summary,
    };

    // 최대 50개의 대화만 유지
    const history = [...memory.conversationHistory, record].slice(-50);

    return {
        ...memory,
        conversationHistory: history,
    };
}

// 히스토리 가져오기
export function getConversationHistory(memory: ChatMemory): ConversationRecord[] {
    return memory.conversationHistory || [];
}

// 메모리 초기화 (디버깅용)
export function clearMemory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}
