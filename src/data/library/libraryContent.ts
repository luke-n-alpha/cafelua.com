import snapshot from './library-content.generated.json';

export type LibraryChapter = { title: string; path: string; markdown: string };
export type LibraryEdition = {
  lang: 'ko' | 'en';
  sourceSlug: string;
  title: string;
  subtitle: string | null;
  status: 'published' | 'draft';
  // 책 자신이 들고 있는 소개문. 서재 UI 의 문구가 아니라 책의 내용이라
  // 스냅샷에 함께 담는다. 없는 판본은 libraryCopy 의 기존 문구로 돌아간다.
  summary?: string;
  biblio: { author?: string; publisher?: string; date?: string; edition?: string; license?: string };
  links: { wikidocs: string | null; leanpub: string | null };
  chapters: LibraryChapter[];
};
export type LibraryCoverTone = 'navy' | 'rust' | 'moss' | 'plum' | 'dusk';
export type LibraryBook = { id: string; coverTone: LibraryCoverTone; editions: LibraryEdition[] };

export const libraryBooks = snapshot.books as LibraryBook[];
