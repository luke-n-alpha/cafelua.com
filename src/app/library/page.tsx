import { redirect } from 'next/navigation';

type SearchParams = Record<string, string | string[] | undefined>;

export default function LibraryRedirect({ searchParams }: { searchParams?: SearchParams }) {
    const params = new URLSearchParams();

    if (searchParams) {
        for (const [key, value] of Object.entries(searchParams)) {
            if (!value) continue;
            if (Array.isArray(value)) {
                if (value[0]) params.set(key, value[0]);
                continue;
            }
            params.set(key, value);
        }
    }

    redirect(params.size > 0 ? `/atelier?${params.toString()}` : '/atelier');
}
