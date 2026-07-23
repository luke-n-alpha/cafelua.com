import snapshot from './library-content.generated.json';

export type LibraryChapter = { title: string; path: string; markdown: string };
export type LibraryEdition = {
  lang: 'ko' | 'en';
  sourceSlug: string;
  title: string;
  subtitle: string | null;
  status: 'published' | 'draft';
  biblio: { author?: string; publisher?: string; date?: string; edition?: string; license?: string };
  links: { wikidocs: string | null; leanpub: string | null };
  chapters: LibraryChapter[];
};
export type LibraryBook = { id: 'harness-engineering' | 'mars-invasion'; coverTone: 'navy' | 'rust'; editions: LibraryEdition[] };

export const libraryBooks = snapshot.books as LibraryBook[];
