import { type LibraryBook, type LibraryEdition } from './libraryContent';

// 특정 판본의 표지 경로를 명시적으로 지정해야 하는 예외 목록.
// (첫 챕터 마크다운에서 자동 추출되지 않거나 다른 이미지를 쓰고 싶을 때)
export const editionCoverSources: Partial<Record<LibraryEdition['sourceSlug'], string>> = {
    'naia-harness-book-en':
        '/library-books/naia-harness-book-en/assets/cover-rezero-sw-en-final.webp',
};

// 판본의 표지 이미지 경로를 반환한다.
// 우선순위: (1) editionCoverSources 예외 → (2) 첫 챕터 마크다운의 첫 이미지.
// 서버(메타데이터 생성)와 클라이언트(서재 렌더링) 양쪽에서 공유한다.
export const coverSourceFor = (
    edition: LibraryEdition,
    fallbackEditions: LibraryEdition[] = [],
): string | null => {
    const knownCover = editionCoverSources[edition.sourceSlug];
    if (knownCover) return knownCover;
    for (const candidate of [edition, ...fallbackEditions]) {
        const coverMarkdown = candidate.chapters[0]?.markdown ?? '';
        const match = coverMarkdown.match(/!\[[^\]]*\]\(([^)]+)\)/);
        if (match) {
            return `/library-books/${candidate.sourceSlug}/${match[1].replace(/^\.\//, '')}`;
        }
    }
    return null;
};

// 로케일에 맞는 판본을 고르고 그 표지를 반환한다. 없으면 첫 판본으로 폴백.
export const bookCoverFor = (book: LibraryBook, locale: 'ko' | 'en'): string | null => {
    const edition = book.editions.find((item) => item.lang === locale) ?? book.editions[0];
    if (!edition) return null;
    return coverSourceFor(edition, book.editions);
};
