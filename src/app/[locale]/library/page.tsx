import { redirect } from 'next/navigation';

type Params = { locale: string };
type SearchParams = Record<string, string | string[] | undefined>;

export default async function LibraryRedirect({ params, searchParams }: { params: Promise<Params>; searchParams?: Promise<SearchParams> }) {
    const { locale: rawLocale } = await params;
    const locale = rawLocale === 'en' ? 'en' : 'ko';
    const resolvedSearchParams = searchParams ? await searchParams : undefined;
    const query = new URLSearchParams();

    if (resolvedSearchParams) {
        for (const [key, value] of Object.entries(resolvedSearchParams)) {
            if (!value) continue;
            if (Array.isArray(value)) {
                if (value[0]) query.set(key, value[0]);
                continue;
            }
            query.set(key, value);
        }
    }

    redirect(query.size > 0 ? `/${locale}/atelier?${query.toString()}` : `/${locale}/atelier`);
}
