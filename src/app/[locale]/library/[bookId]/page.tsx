import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BackgroundMusic from '@/components/BackgroundMusic';
import LibraryPage from '@/components/LibraryPage';
import { libraryBooks, type LibraryBook } from '@/data/library/libraryContent';
import { bookCoverFor } from '@/data/library/libraryCover';

type Params = { locale: string; bookId: string };

const findBook = (bookId: string) =>
    libraryBooks.find((book) => book.id === bookId);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { locale, bookId } = await params;
    const book = findBook(bookId);
    if (!book) return {};
    const lang = locale === 'en' ? 'en' : 'ko';
    const edition = book.editions.find((item) => item.lang === lang) ?? book.editions[0];
    const description = edition.subtitle ?? `${edition.title} | Cafe Lua Library`;
    // 책 표지를 OG/트위터 카드 이미지로 사용. 표지가 없으면 카페루아 기본 OG로 폴백.
    const ogImage = bookCoverFor(book, lang) ?? '/og-cafelua-entrance-v019.png';
    return {
        title: edition.title,
        description,
        alternates: { canonical: `/library/${bookId}` },
        openGraph: {
            type: 'article',
            url: `/library/${bookId}`,
            title: edition.title,
            description,
            images: [ogImage],
        },
        twitter: {
            card: 'summary_large_image',
            title: edition.title,
            description,
            images: [ogImage],
        },
    };
}

export default async function LibraryBookPage({
    params,
    searchParams,
}: {
    params: Promise<Params>;
    searchParams: Promise<{ read?: string }>;
}) {
    const [{ locale: rawLocale, bookId }, query] = await Promise.all([params, searchParams]);
    const book = findBook(bookId);
    if (!book) notFound();

    return (
        <>
            <BackgroundMusic src="/sounds/library.mp3" />
            <LibraryPage
                locale={rawLocale === 'en' ? 'en' : 'ko'}
                initialBookId={book.id as LibraryBook['id']}
                initialRead={query.read === '1'}
            />
        </>
    );
}
