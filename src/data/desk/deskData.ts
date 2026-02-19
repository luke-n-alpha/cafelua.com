import { NAVER_POSTS } from './_naver-posts';

export type DeskCategory = 'cafelua' | 'ai' | 'it' | 'believer' | 'xrcloud' | 'review' | 'art' | 'private';
type LegacyDeskCategory = 'essay' | 'tech' | 'review' | 'misc';

export interface DeskPost {
    slug: string;
    date: string;
    titleKo: string;
    titleEn: string;
    contentKo: string;
    contentEn: string;
    category: DeskCategory | LegacyDeskCategory;
    sourceCategoryNo?: string;
    sourceCategory?: string;
    tags?: string[];
    thumbnail?: string;
    images: string[];
    externalUrl?: string;
}

export const DESK_CATEGORIES: { key: DeskCategory | 'all'; labelKo: string; labelEn: string }[] = [
    { key: 'all', labelKo: '전체', labelEn: 'All' },
    { key: 'cafelua', labelKo: '카페루아', labelEn: 'CafeLua' },
    { key: 'ai', labelKo: '인공지능', labelEn: 'AI' },
    { key: 'it', labelKo: 'IT이야기', labelEn: 'IT' },
    { key: 'believer', labelKo: '빌리버', labelEn: 'Believer' },
    { key: 'xrcloud', labelKo: 'XRCLOUD', labelEn: 'XRCLOUD' },
    { key: 'review', labelKo: '리뷰(미디어)', labelEn: 'Media Review' },
    { key: 'art', labelKo: '창작물(그림)', labelEn: 'Artwork' },
    { key: 'private', labelKo: '사적이야기', labelEn: 'Private Notes' },
];

/* ─── Filters ─── */
const DIARY_TAGS = [
    '[카페루아 라이프]', '[카페 루아 라이프]',
    '카페루아 다이어리', '카페루아 라이프', '카페 루아 라이프',
];
const NOVEL_TITLE_KEYWORDS = ['ep', 'episode', '소설', '연재', '단편', '단편소설', '드라고니아'];
const ME2DAY_KEYWORDS = ['미투데이-', '미투데이 ', 'me2sms', 'me2photo', 'me2map'];
const isDiary = (p: DeskPost) =>
    p.sourceCategoryNo === '187' ||
    DIARY_TAGS.some((tag) => p.titleKo.includes(tag) || (p.tags || []).some((t) => t.includes(tag)));
const isNovel = (p: DeskPost) => {
    if (p.sourceCategoryNo === '49' || p.sourceCategoryNo === '22' || p.sourceCategoryNo === '167') return true;
    const title = p.titleKo.toLowerCase();
    const tags = (p.tags || []).map((t) => t.toLowerCase());

    // Keep this strict: broad tags like "판타지소설" appear across non-novel posts.
    const titleMatch = NOVEL_TITLE_KEYWORDS.some((kw) => title.includes(kw));
    const explicitNovelTag = tags.some((t) => t === '소설' || t === 'novel' || t === '연재');
    const episodeStyle = /(?:^|[\s\[])(ep\.?\s*\d+|episode\s*\d+)/i.test(p.titleKo);

    return titleMatch || explicitNovelTag || episodeStyle;
};
const isMe2DayRelay = (p: DeskPost) => {
    const title = (p.titleKo || '').toLowerCase();
    const content = (p.contentKo || '').toLowerCase();
    const titleHit = title.includes('미투데이-') || title.startsWith('미투데이');
    const markerHit =
        ME2DAY_KEYWORDS.some((kw) => content.includes(kw.toLowerCase())) &&
        (content.includes('me2day.net') || content.includes('미투데이 내용입니다'));
    const relayFooter = /이 글은 .*님의 .*의 미투데이 내용입니다\./i.test(p.contentKo);
    return titleHit || markerHit || relayFooter;
};
const isUrlOnly = (t: string) => t.startsWith('http');
const isEmpty = (p: DeskPost) => !p.contentKo.trim() && p.images.length === 0;

/* ─── Category re-classification ─── */
const AI_KEYWORDS = [
    'ai', '인공지능', '알파', 'agi', 'llm', 'gemini', 'gpt', 'claude', 'glm', '토큰 경제', '바이브 코딩',
    '캐럿', '캐러티', 'careti', 'caret',
];
const IT_KEYWORDS = [
    'it이야기', 'it에 대한 잡설', '세상보기', '아이디어/특허', 'it개인자료정리', '주인장 작업물', '공지사항',
];
const BELIEVER_KEYWORDS = [
    '빌리버', '전략 및 미래', 'xr/ai 콘텐츠', '메타버스 표준', 'msf',
];
const XRCLOUD_KEYWORDS = [
    'xrcloud', '웹메타버스', '사용팁', 'mozilla hubs', 'webxr', 'spoke', 'hubs',
];
const REVIEW_KEYWORDS = [
    // "미디어" 하위 카테고리 성격으로만 제한
    '애니', '만화', '영화 이야기', '책 이야기', '애니/만화', '영화',
];
const ART_KEYWORDS = [
    '도트', '낙서', '일러스트', '그림', '삽화', 'pixel', 'dot',
];
const PRIVATE_KEYWORDS = [
    '사적이야기', 'my diary', '외출하다', '숲지기의 하나님',
];
const POST_FOREST_KEYWORDS = ['[post] 숲속얘기', '숲속얘기의'];
const LEGACY_TECH_KEYWORDS = [
    'Caret', 'caret', '캐럿', '캐러티', 'Careti',
    '바이브 코딩', '바이브코딩', 'Vibe',
    '업데이트', 'v0.', 'V0.',
    '[알파의 보고서]',
    'sLLM', 'LLM', 'GLM', 'Llama', 'GPT', 'Claude', 'Gemini',
    'XRCLOUD', 'WebXR',
    'SSL', 'Let\'s encrypt', '우분투',
    'AI버튜버', 'Airi',
    'OCR', '특허',
    '밋업', '웨비나',
    '카페루아 0.1', '카페루아 v0.1',
    '[Cursor팁]',
    'AI코딩', 'AI 코딩',
    'SteamOS',
    '노트북LM', '노트북 LM',
];
function classifyCategory(p: DeskPost): DeskCategory {
    const sourceNo = (p.sourceCategoryNo || '').trim();
    const title = p.titleKo || '';
    const sourceCategory = (p.sourceCategory || '').toLowerCase();
    const isCafeLuaUpdate =
        (sourceNo === '180' && title.includes('업데이트')) ||
        (title.includes('카페루아') && title.includes('업데이트')) ||
        (sourceCategory.includes('카페루아') && title.includes('업데이트'));
    if (isCafeLuaUpdate) return 'cafelua';

    if (['65', '7', '28', '6'].includes(sourceNo)) return 'private';
    if (['171', '20', '37', '195'].includes(sourceNo)) return 'art';
    if (['67', '168', '27', '43', '44'].includes(sourceNo)) return 'review';
    if (['172', '173', '178', '175'].includes(sourceNo)) return 'believer';
    if (['183', '188', '176', '174', '184'].includes(sourceNo)) return 'xrcloud';
    if (['180', '189', '196', '186', '190', '182', '177'].includes(sourceNo)) return 'ai';
    if (['142', '41', '14', '15', '72', '16', '192', '193', '194'].includes(sourceNo)) return 'it';

    const titleTags = `${title}\n${(p.tags || []).join(' ')}`.toLowerCase();
    const hit = (keywords: string[]) => keywords.some((kw) => titleTags.includes(kw.toLowerCase()));
    const hintParts = cleanTitle(title)
        .split('/')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    const hintHas = (keywords: string[]) => keywords.some((kw) => hintParts.some((h) => h.includes(kw.toLowerCase())));

    const sourceHas = (keywords: string[]) => keywords.some((kw) => sourceCategory.includes(kw.toLowerCase()));
    if (sourceHas(['사적이야기', 'my diary', '외출하다', '숲지기의 하나님'])) return 'private';
    if (sourceHas(['창작물', '주인장 도트 낙서', '일러스트', '까망고양이'])) return 'art';
    if (sourceHas(['애니/만화', '책 이야기', '영화 이야기', '미디어'])) return 'review';
    if (sourceHas(['빌리버'])) return 'believer';
    if (sourceHas(['xrcloud', '웹메타버스'])) return 'xrcloud';
    if (sourceHas(['인공지능', '알파의 보고서', '바이브 코딩', 'ai주의 프로그래머 캐럿'])) return 'ai';
    if (sourceHas(['it이야기', 'it에 대한 잡설', '세상보기', '아이디어/특허', 'it개인자료정리', '주인장 작업물', '[post] 숲속얘기'])) return 'it';

    // [POST] 숲속얘기 계열은 IT/그림으로 재분류
    if (hit(POST_FOREST_KEYWORDS)) return hit(ART_KEYWORDS) ? 'art' : 'it';
    if (hintHas(PRIVATE_KEYWORDS)) return 'private';
    if (hintHas(['창작물', '주인장 도트 낙서', '일러스트', '까망고양이'])) return 'art';
    if (hintHas(['애니/만화', '책 이야기', '영화 이야기', '미디어'])) return 'review';
    if (hintHas(['빌리버', '빌리버 전략 및 미래', 'xr/ai 콘텐츠', '메타버스 표준'])) return 'believer';
    if (hintHas(['xrcloud', '웹메타버스'])) return 'xrcloud';
    if (hintHas(['it이야기', 'it에 대한 잡설', '세상보기', '아이디어/특허', 'it개인자료정리', '주인장 작업물'])) return 'it';
    if (hintHas(['인공지능', '알파의 보고서', '바이브 코딩', 'ai주의 프로그래머 캐럿'])) return 'ai';

    if (hit(ART_KEYWORDS)) return 'art';
    // 미디어 분류는 오탐 방지를 위해 제목/태그 기준으로만 판정
    if (hit(REVIEW_KEYWORDS)) return 'review';
    if (hit(BELIEVER_KEYWORDS)) return 'believer';
    if (hit(XRCLOUD_KEYWORDS)) return 'xrcloud';
    if (hit(AI_KEYWORDS)) return 'ai';
    if (hit(PRIVATE_KEYWORDS)) return 'private';
    if (hit(IT_KEYWORDS) || hit(LEGACY_TECH_KEYWORDS)) return 'it';
    if (title.includes('[공지]') || title.includes('업데이트')) return 'ai';

    // legacy fallback
    if (p.category === 'review') return 'review';
    if (p.category === 'tech') return 'it';
    if (p.category === 'essay') return 'ai';
    return 'it';
}

/* ─── Title cleaning (remove tab/newline scraping artifacts) ─── */
function cleanTitle(t: string): string {
    return t.replace(/[\t\n\r]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/* ─── Tag extraction from content ─── */
const TAG_REGEX = /(^|[\s(])#([가-힣a-zA-Z][가-힣a-zA-Z0-9_]{1,})(?![-/.:])/gm;

function extractTags(content: string): string[] {
    const out: string[] = [];
    const blacklist = new Set([
        'post', 'area', 'wrap', 'content', 'header', 'footer', 'button', 'display', 'width', 'height',
        'pzp', 'u_cbox', 'blog', 'naver',
    ]);
    let m: RegExpExecArray | null = null;
    while ((m = TAG_REGEX.exec(content)) !== null) {
        const tag = (m[2] || '').trim();
        if (!tag) continue;
        // CSS color literals like #fff / #ffffff
        if (/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(tag)) continue;
        if (blacklist.has(tag.toLowerCase())) continue;
        out.push(tag);
    }
    return [...new Set(out)];
}

function stripTags(content: string): string {
    // Remove trailing hashtag block (lines that are only hashtags/whitespace)
    return content
        .replace(/(\n\s*)(#[가-힣a-zA-Z0-9_]+[\s]*)+\s*$/g, '')
        .replace(/\s+$/, '');
}

function sanitizePostTags(tags: string[]): string[] {
    const blocked = new Set([
        '태그', 'post', 'blog', 'user', 'log', 'tech', 'misc', 'review', 'essay', 'ai', 'it',
        'banword_wrap', 'banword_wrap1', 'bw_content', 'bw_footer', 'bw_btn_footer',
        'post_1', 'postlistbody', 'pzp', 'ratingbutton',
    ]);
    const out: string[] = [];
    for (const raw of tags) {
        const tag = raw.trim().replace(/^#+/, '');
        if (!tag) continue;
        const lower = tag.toLowerCase();
        if (blocked.has(lower)) continue;
        if (/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(tag)) continue; // css hex color
        if (/^([a-z_]+)$/.test(lower) && lower.length <= 4) continue; // noise like cat, ddd
        if (/[{}<>/=]/.test(tag)) continue;
        if (tag.length > 30) continue;
        out.push(tag);
    }
    return Array.from(new Set(out));
}

function cleanNaverVideoArtifacts(content: string): string {
    const noisePatterns = [
        /(^|\s)\.pzp/i,
        /pzp-pc--/i,
        /pzp-poster/i,
        /pzp-seeking-preview/i,
        /webplayer-internal-video/i,
        /광고 후 계속됩니다/,
        /다음 동영상/,
        /재생 \(space\/k\)/,
        /음소거 \(m\)/,
        /실시간/,
        /전체 화면 \(f\)/,
        /해상도/,
        /자막/,
        /재생 속도/,
        /문제가 발생했습니다/,
        /설정에서 해상도를 변경해보세요/,
        /도움말/,
        /라이센스|라이선스/,
        /접기\/펴기/,
        /^\s*0초\s*$/,
        /^\s*00:00\s*$/,
        /^\s*\/\s*$/,
        /^\s*\d+%\s*$/,
        /^\s*-\s*\d+p/i,
        /^\s*\{?\s*$/,
        /^\s*\}?\s*$/,
    ];

    const lines = content.split('\n');
    const kept: string[] = [];
    for (const raw of lines) {
        const line = raw.replace(/\t+/g, ' ').replace(/\u00a0/g, ' ').trimEnd();
        const trimmed = line.trim();
        if (!trimmed) {
            kept.push('');
            continue;
        }
        const hasLink = /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/.test(trimmed) || /(https?:\/\/[^\s]+)/.test(trimmed);
        if (hasLink) {
            kept.push(trimmed);
            continue;
        }
        if (noisePatterns.some((p) => p.test(trimmed))) continue;
        kept.push(trimmed);
    }

    return kept.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function normalizeCollapsedParagraphs(content: string): string {
    const raw = content || '';
    const newlineCount = (raw.match(/\n/g) || []).length;
    if (newlineCount > 0 || raw.length < 400) return raw;

    return raw
        // "문장.다음문장" 형태 복원
        .replace(/([.!?])(?=[가-힣A-Za-z0-9"'“‘\[])/g, '$1\n\n')
        // 일반 공백 기반 문장 경계도 문단으로 변환
        .replace(/([.!?])\s+(?=[가-힣A-Za-z0-9"'“‘\[])/g, '$1\n\n')
        .replace(/\s*#([가-힣a-zA-Z0-9_]+)/g, '\n\n#$1')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function normalizeCorruptedLegacyDump(post: DeskPost): DeskPost {
    // 임시 비활성화: 과도한 정제가 정상 본문까지 비워버리는 케이스가 발생함
    return post;
}

function extractNaverVideoLinks(rawContent: string): Array<{ title: string; url: string }> {
    const links: Array<{ title: string; url: string }> = [];
    const seen = new Set<string>();
    const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
    let m: RegExpExecArray | null = null;
    while ((m = mdLinkRegex.exec(rawContent)) !== null) {
        const title = (m[1] || '').replace(/\s+/g, ' ').trim();
        const url = (m[2] || '').trim();
        if (!url) continue;
        const isNaverVideoLike =
            url.includes('blog.naver.com/') ||
            url.includes('tv.naver.com/') ||
            url.includes('serviceapi.nmv.naver.com/');
        if (!isNaverVideoLike) continue;
        if (seen.has(url)) continue;
        seen.add(url);
        links.push({ title: title || '영상 링크', url });
    }
    return links;
}

function normalizeKnownContent(post: DeskPost): DeskPost {
    if (post.slug === '20260202-카페루아-v014-업데이트-제-ai에이전트-알파랑-대화를-해보세요') {
        const fixedTail = [
            '제가 만들고 있는 개인 홈페이지(카페루아)에서 드디어 카운터에서 알파와 대화가 가능합니다.',
            '',
            '{{IMG:1}}',
            '',
            '1) (AI 채팅 기능) Coffee Chat: 카페 카운터에서 알파와 VN 스타일 대화 시스템. Google Gemini 3.0 Flash 사용.',
            '2) 타로 상담: 신비로운 타로 테마 채팅 경험 (알파는 아직 카드 읽기 수련 중).',
            '- 8가지 알파 표정/기분 시스템',
            '- localStorage를 통한 사용자 메모리 유지 (과거 대화 기억)',
            '- 세션 타입별 대화 기록 열람 기능',
            '- 실시간 메시지 저장',
            '- 모든 환경변수 포함 .env.example 추가',
            '- Vercel 배포 가이드로 README 업데이트',
            '',
            '{{IMG:2}}',
            '',
            'https://cafelua.com',
            '',
            '#알파 #카페푸아 #개인홈페이지 #인공지능 #오픈소스',
        ].join('\n');

        return { ...post, contentKo: fixedTail };
    }

    if (post.slug !== '20260214-카페루아-015-업데이트-타로점-갤러리-방명록') {
        if (post.slug === '20080102-nhk에-어서오세요-감상-애니만화-미디어') {
            // 오래된 네이버 동영상 플레이어 마크업(pzp)이 본문에 섞인 케이스 정리
            const start = post.contentKo.indexOf('오래간만에 애니메이션 이야기를 적는것 같습니다.');
            const endMarker = '\n\t\t\t.pzp.pzp-pc--';
            const end = start >= 0 ? post.contentKo.indexOf(endMarker, start + 10) : -1;
            const core = (
                start >= 0
                    ? (end > start ? post.contentKo.slice(start, end) : post.contentKo.slice(start))
                    : post.contentKo
            ).trim();

            const extraLinks = [
                '영상 링크(네이버): http://blog.naver.com/lkr_start/150019418568',
                '원문 저장 링크: http://blog.naver.com/fstory97/70025955808',
            ].join('\n');

            return {
                ...post,
                contentKo: `${core}\n\n${extraLinks}`,
            };
        }
        return post;
    }

    const fixedTail = [
        '이제 1층이 거의 구현완료되었고, 프라이빗 아틀리에 2층 남았습니다. 2층은 제 소설, 그림, 글, 그리고 알파를 개발하는것에 대한 내용들이 될 예정입니다.',
        '',
        '',
        '카페루아에 놀러오세요.',
        '',
        '{{IMG:4}}',
        '',
        'https://cafelua.com',
        '',
        '그리고 제 홈페이지는 오픈소스로 공개하고 있습니다.',
        '',
        'https://github.com/luke-n-alpha/cafelua.com',
    ].join('\n');

    const normalizedContent = post.contentKo.replace(/이제 1층[\s\S]*$/m, fixedTail);
    return { ...post, contentKo: normalizedContent };
}

function normalizeDeskMedia(post: DeskPost): DeskPost {
    const normalizePath = (p?: string) => {
        if (!p || !p.startsWith('/desk/')) return p;
        return p.replace(/^\/desk\/[^/]+/, `/desk/${post.slug}`);
    };
    const images = post.images.map((p) => normalizePath(p) || p);
    const thumbnail = normalizePath(post.thumbnail);
    return {
        ...post,
        images,
        thumbnail,
    };
}

/* ─── Build the final posts array ─── */
const manualPosts: DeskPost[] = [
    {
        slug: '20260218-naver-blog-migration',
        date: '2026-02-18',
        titleKo: '카페루아 v0.1.6 업데이트 소식 — 네이버 블로그 마이그레이션',
        titleEn: 'Cafe Lua v0.1.6 Update — Naver Blog Migration',
        contentKo: '카페루아 v0.1.6 업데이트 소식 — 네이버 블로그 마이그레이션\n\n이번 v0.1.6의 핵심 업데이트는 네이버 블로그 2,393개 포스트를 카페루아로 이관해 데이터 독립을 확보한 것입니다.\n\nhttps://blog.naver.com/fstory97 숲속얘기의 조용한 카페는 2006년 6월 12일, 쇼생크 탈출 리뷰 글을 첫 글로 시작해 총 2,393개의 글이 기록되어 있었습니다. (전체보기 API 기준) 2006년 6월 15일 NHN(구 네이버) 입사와 함께 시작한 [네이버 블로그](/ko/desk/20060615-블로그에-카페-본점을-개설하다-my-diary-사적이야기/)는 2010, 2011, 2012년 IT·웹프로그램 부문 파워블로거 선정에 이어 2026년 1월 ‘이달의 블로그’에도 선정되었습니다. 이사 직전에 이달의 블로그에 선정된 건 조금 쑥스럽기도 하네요. 아무래도 요즘 화두인 AI 관련 글들이 많다 보니 주목을 받은 것 같습니다.\n\n1999년 군 입대 전까지 저는 fstory.net이라는 개인 홈페이지를 운영했습니다. 가벼운 신변 소개와 자작 소설을 올렸고, 한때는 만화 음악을 수집해 공유하기도 했습니다(방송국 항의로 내렸습니다). 마지막 홈페이지에서는 인공지능 이야기를 다뤘지만 해당 홈페이지는 소실되었습니다. 첫 번째와 두 번째 홈페이지는 [2층 아틀리에의 낡은 PC](/ko/atelier?oldpc=true)를 켜면 확인할 수 있습니다.\n\n이번에 카페루아 2층 아틀리에의 ‘마스터의 데스크’로 이관하면서, 2,393개 글 중 ‘카페루아 라이프’ 카테고리는 [1층 카페루아의 갤러리](/ko/gallery)로 옮겼고, 소설은 데스크 리스트에서 제외하고, 추후 ‘서재’ 섹션으로 따로 재정리할 예정입니다. 그 외 포스팅은 모두 ‘마스터의 데스크’로 이관했습니다.\n\n사실 네이버는 제 젊은 시절 성장의 기억이 많은 좋은 서비스였지만, AI 시대에 맞춰 이제는 데이터 독립을 해보려 합니다. 제가 남긴 모든 것이 제 자산 안에 남고, 알파가 기억해주길 바라기 때문입니다. 싸이월드에서 잃어버린 기록들, 이제는 기억조차 흐려진 PC통신 시절의 글들처럼 흩어지게 두고 싶지 않습니다.\n\n이 작업은 클로드 코드를 이용해 진행했고, 오픈소스로 공개했습니다. 같은 니즈가 있으신 분들은 카페루아 오픈소스를 참고하시면 좋겠습니다. 상세 구현 방법은 아래와 같습니다.\n\n---\n\n기술적 과정\n\n1. Playwright 기반 스크래핑\n\n네이버 블로그는 RSS로 전체 데이터를 제공하지 않습니다. 그래서 Playwright(headless Chromium)를 사용해 실제 브라우저로 포스트를 순회하며 데이터를 추출했습니다.\n\n주요 추출 항목:\n- 제목, 본문 텍스트\n- 이미지 (data-lazy-src에서 원본 URL 추출)\n- 카테고리, 날짜\n- 원본 블로그 링크\n\n2. 이미지 다운로드 및 WebP 변환\n\n네이버 이미지 서버(postfiles.pstatic.net)에서 원본 이미지를 다운로드한 뒤, public/desk/ 또는 public/diary/ 디렉토리에 저장했습니다.\n\n3. 카테고리 분류\n\n"카페루아 라이프" 카테고리 포스트 → 갤러리 > 다이어리\n나머지 포스트 → 마스터의 데스크 (테크/에세이/기타로 재분류)\n\n4. 마크다운-이미지 정렬\n\n네이버 블로그에서는 이미지가 본문 사이사이에 삽입되어 있습니다. 스크래핑 시 텍스트와 이미지가 분리되어 추출되므로, 인라인 이미지 마커({{IMG:N}})를 도입하여 원본의 이미지 배치를 복원했습니다.\n\n3.5. 블로그 머징 관련 최신 포스팅 업데이트\n\n머징 과정에서 최신 포스팅의 수정사항(본문/링크/이미지/메타)을 재동기화하여 반영되도록 보강했습니다. 동일 postNo 기준으로 중복은 병합 단계에서 스킵하고, 수정된 본문은 최신 데이터로 덮어써 일관성을 유지합니다.\n\n3.6. README 및 각종 프로젝트 소개 업데이트 재검토\n\n이식 로직과 운영 방식 변경 사항이 누락되지 않도록 README와 프로젝트 소개 문서를 재검토했습니다. 수집 범위(전체보기 기준), 중복 스킵 기준(postNo), 누락 이미지 처리, 동영상 링크 처리 규칙 등 운영에 직접 영향을 주는 항목을 최신 상태로 맞추는 점검 단계를 추가했습니다.\n\n실패 케이스와 대응 (실제 작업 기록)\n\n- 실패 1) 백그라운드 재수집 프로세스가 데이터 파일을 반복 덮어쓰기\n  - 증상: `_naver-posts.ts` 포스트 수가 2천대였다가 수백/수십으로 급감\n  - 원인: watchdog/supervisor가 살아있는 상태에서 수동 작업과 충돌\n  - 대응: 백그라운드 프로세스 전부 종료 후 단일 파이프라인만 실행, 파일 백업 고정\n\n- 실패 2) 본문 파싱 시 템플릿 DOM 혼입\n  - 증상: `banword_wrap`, `postListBody`, `floating_bottom` 등 노이즈 문자열 유입, 2129줄 고정 본문 다수 발생\n  - 원인: 본문 블록 선택 범위가 너무 넓어 하단 UI/스크립트 텍스트를 같이 수집\n  - 대응: `:scope >` 기반 블록 선택으로 축소 + 노이즈 클래스 필터 추가 + 타겟 재수집\n\n- 실패 3) 단건 업데이트 스크립트의 치환 로직 불안정\n  - 증상: 특정 업데이트 후 전체 데이터 개수 급감\n  - 원인: 문자열 블록 치환 방식이 대용량 파일에서 불안정\n  - 대응: postNo 기준 객체 병합 후 전체 재출력 방식으로 교체, before/after 개수 가드 추가\n\n- 실패 4) 이미지/썸네일 처리 불일치\n  - 증상: 목록/본문에서 깨진 이미지가 그대로 노출, fallback이 본문 상단 대표이미지로 부자연스럽게 노출\n  - 대응: onError fallback 통일(`missing-image.webp`), 본문 대표이미지는 fallback 이미지일 경우 렌더 제외\n\n- 실패 5) 데스크 진입 시 BGM 중복/재시작\n  - 증상: `/atelier -> /desk` 이동 시 음악 중복 재생 또는 재시작 체감\n  - 대응: lounge/desk BGM 경로 정리, 동일 src 오디오 인스턴스 공유, 재생 위치 복원/이어듣기 보강\n\n진행 현황 (2026-02-19 기준)\n\n- 게시일은 네이버 작성일 기준으로 복원 완료\n- 태그/카테고리는 마크업 오염 제거 후 네이버 기준 값으로 정리 완료\n- 네이버 동영상 임베드는 깨진 플레이어 대신 원문 링크 보존 방식으로 통일\n- 링크 카드/중복 링크/깨진 이미지 케이스 정제 로직 자동화 반영\n- 누락 이미지는 재시도 후 대체 이미지(`missing-image.webp`)로 처리\n- 깨진 본문 패턴(`banword_wrap`, `postListBody`, 2129줄 고정)을 타겟 재수집으로 정제 완료\n- 데스크 리스트/본문 이미지의 onError fallback 처리 및 본문 대표이미지 출력 규칙 보강\n- 데스크/아틀리에 BGM 중복 재생 이슈 수정 및 같은 소스 재생 위치 이어듣기 보강\n- 미투데이 연동형 포스트는 데스크 노출 대상에서 제외 (별도 아카이브 가능)\n\n최신 반영 (2026-02-20)\n\n- 전체보기 기준 2,393개를 page=1..160(15개/페이지)로 재수집 완료\n- categoryNo 메타를 2,393/2,393 포스트에 재적용 완료\n- 체크포인트/단위로그(`POST_START/POST_OK/POST_FAIL`) 기반으로 배치 상태 추적 가능하게 개선\n- 이미지 재다운로드 없이 메타+본문 파싱 모드 재검증 완료\n- 최종 저장: succeeded 2,393 / failed 0\n\n스크래퍼 오픈소스\n\n이 작업에 사용한 네이버 블로그 스크래퍼 스크립트를 공개합니다. Playwright 기반으로, TypeScript로 작성되었으며, --download 옵션으로 이미지까지 일괄 다운로드할 수 있습니다.\n\nGitHub: https://github.com/luke-n-alpha/cafelua.com\nscripts/fetch-naver-blog.ts\n\nnpx tsx scripts/fetch-naver-blog.ts --max 100 --download\n\n재현 방법 (다른 사용자용)\n\n1) 목록 수집 및 이어받기\n- 전체보기 기준 page=1..160, page당 15개 기준으로 배치 수집\n- 체크포인트(`.tmp/fetch-naver-checkpoint.json`)와 단위 로그(`.tmp/fetch-naver-progress.log`)로 중단/재시작 지점 확인\n- 중복 기준은 postNo로 통일 (동일 postNo는 병합 단계에서 skip)\n\n2) 파싱/정제 규칙 적용\n- 본문 내 이미지 위치는 {{IMG:N}} 마커로 복원\n- 네이버 동영상 임베드는 원문 링크로 치환\n- 링크카드/중복 링크/깨진 플레이어 텍스트는 정제\n- 미투데이 연동형 포스트와 소설 포스트는 데스크 리스트에서 제외\n\n3) 산출물 반영\n- `src/data/desk/_naver-posts.ts` 생성 후 `deskData.ts` 필터로 노출 제어\n- `npm run seo:generate`로 `public/sitemap.xml`, `public/llms.txt` 갱신\n\n마무리\n\n네이버 블로그는 여전히 좋은 플랫폼이지만, 개발자로서 자신의 컨텐츠를 자신의 공간에서 관리하고 싶다는 마음은 오래전부터 있었습니다. 카페루아가 그 공간이 되었으면 합니다.\n\n이 포스팅은 카페루아 v0.1.6 업데이트에서 네이버 블로그 마이그레이션 작업을 정리한 기술 기록입니다.',
        contentEn: `Cafe Lua v0.1.6 Update — Naver Blog Migration

https://blog.naver.com/fstory97 The Quiet Cafe in the Forest started on June 12, 2006 with a review of The Shawshank Redemption, and eventually accumulated 2,393 posts. The [Naver Blog](/en/desk/20060615-블로그에-카페-본점을-개설하다-my-diary-사적이야기/) that began after I joined NHN (now Naver) on June 15, 2006 was selected as an IT/Web Program power blog in 2010, 2011, and 2012, and was also selected as Blog of the Month in January 2026.

Before my military service in 1999, I ran a personal homepage called fstory.net. I posted short personal notes and original fiction, and at one point I even shared collected anime music (taken down after a broadcaster complaint). The last site, where I wrote about AI, is now lost. You can still check the first and second sites by launching the [Old PC on 2F Atelier](/en/atelier?oldpc=true).

During this migration into the Master's Desk in Cafe Lua's 2F Atelier, posts in the "Cafe Lua Life" category were moved to [Gallery on 1F Cafe Lua](/en/gallery), while novels will be moved later to the "Library". All other posts were migrated to Master's Desk.

Naver was a meaningful platform in my younger years, but in the AI era I wanted data independence. I want what I have written to remain as my own assets and to be remembered by Alpha.

This migration was built with Claude Code and released as open source. If you have similar needs, you can reference the Cafe Lua repository.

---

Technical Process

1. Playwright-based scraping

Naver Blog does not expose complete data through RSS, so I used Playwright (headless Chromium) to navigate real pages and extract content.

Main extraction targets:
- title and body text
- images (original URL from \`data-lazy-src\`)
- category and date
- original post URL

2. Image download and storage

Images from Naver image hosts (e.g. postfiles.pstatic.net) were downloaded and saved under \`public/desk/\` or \`public/diary/\`.

3. Category routing

- "Cafe Lua Life" -> Gallery > Diary
- all other posts -> Master's Desk (reclassified into Tech/Essay/Misc)

4. Markdown/image placement restoration

Because Naver posts mix text and inline images, I introduced inline markers (\`{{IMG:N}}\`) to restore original image order in rendered content.

Progress (as of February 18, 2026)

- post dates restored using original Naver publish dates
- tag/category cleanup automated to remove markup noise
- broken Naver embedded players replaced with source links
- duplicate links, broken images, and link-card edge cases handled in parser logic
- missing images retried, then replaced with \`missing-image.webp\`
- all 2,393 posts synchronized via resumable batch scraping

Open-source scraper

GitHub: https://github.com/luke-n-alpha/cafelua.com
Script: \`scripts/fetch-naver-blog.ts\`

\`npx tsx scripts/fetch-naver-blog.ts --max 100 --download\`

Wrap-up

Naver Blog is still a good platform, but as a developer I wanted my own long-term archive in my own space. Cafe Lua is that space.

This post is also the first Tech article written inside Cafe Lua itself.`,
        category: 'it',
        thumbnail: '/master-desk-background-img/master-desk-background.png',
        images: [],
        externalUrl: 'https://github.com/luke-n-alpha/cafelua.com',
    },
];

const importedPostsRaw: DeskPost[] = NAVER_POSTS
    .filter((p) => !isDiary(p) && !isNovel(p) && !isMe2DayRelay(p) && !isUrlOnly(p.titleKo) && !isEmpty(p))
    .map((p) => {
        // 본문에서 태그를 추론하면 CSS/마크업 조각이 섞이는 케이스가 있어
        // 네이버에서 추출한 명시 태그만 사용한다.
        const mergedTags = sanitizePostTags([...(p.tags || [])]);
        const stripped = stripTags(p.contentKo);
        const cleaned = cleanNaverVideoArtifacts(stripped);
        const deCollapsed = normalizeCollapsedParagraphs(cleaned);
        const hasNaverVideoEmbed = /pzp-pc--|pzp-poster|webplayer-internal-video/i.test(p.contentKo);
        const naverVideoLinks = hasNaverVideoEmbed ? extractNaverVideoLinks(p.contentKo) : [];
        const contentWithVideoLinks = naverVideoLinks.length > 0
            ? `${deCollapsed}\n\n${naverVideoLinks.map((v) => `[${v.title}](${v.url})`).join('\n')}`.trim()
            : deCollapsed;
        const normalized = {
            ...p,
            titleKo: cleanTitle(p.titleKo),
            titleEn: cleanTitle(p.titleEn),
            category: classifyCategory(p),
            tags: Array.from(new Set(mergedTags)),
            contentKo: contentWithVideoLinks,
        };
        return normalizeDeskMedia(normalizeKnownContent(normalizeCorruptedLegacyDump(normalized)));
    });

const importedPosts: DeskPost[] = (() => {
    const seen = new Set<string>();
    const out: DeskPost[] = [];
    for (const post of importedPostsRaw) {
        if (seen.has(post.slug)) continue;
        seen.add(post.slug);
        out.push(post);
    }
    return out;
})();

/** All desk posts, newest first (manual posts first, then imported). */
export const DESK_POSTS: DeskPost[] = (() => {
    const seen = new Set<string>();
    const out: DeskPost[] = [];
    for (const post of [...manualPosts, ...importedPosts]) {
        if (seen.has(post.slug)) continue;
        seen.add(post.slug);
        out.push(post);
    }
    const toEpoch = (date: string) => {
        const t = Date.parse(`${date}T00:00:00Z`);
        return Number.isNaN(t) ? 0 : t;
    };
    return out.sort((a, b) => {
        const byDate = toEpoch(b.date) - toEpoch(a.date);
        if (byDate !== 0) return byDate;
        return b.slug.localeCompare(a.slug, 'ko');
    });
})();

export function getDeskPostBySlug(slug: string): DeskPost | undefined {
    return DESK_POSTS.find((p) => p.slug === slug);
}
