import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BackgroundMusic from '@/components/BackgroundMusic';
import LibraryPage from '@/components/LibraryPage';
import { libraryBooks, type LibraryBook } from '@/data/library/libraryContent';

type Params = { locale: string; bookId: string };

const findBook = (bookId: string) =>
    libraryBooks.find((book) => book.id === bookId);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { locale, bookId } = await params;
    const book = findBook(bookId);
    if (!book) return {};
    const edition = book.editions.find((item) => item.lang === (locale === 'en' ? 'en' : 'ko')) ?? book.editions[0];
    return {
        title: edition.title,
        description: edition.subtitle ?? `${edition.title} | Cafe Lua Library`,
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
