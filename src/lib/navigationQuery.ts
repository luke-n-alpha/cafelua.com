export const buildLocalizedUrlWithQuery = (
    locale: string,
    path: string,
    searchParams: { toString(): string },
    overrides: Record<string, string | null | undefined> = {}
) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(overrides)) {
        if (value == null) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
    }

    const query = params.toString();
    return `/${locale}${path}${query ? `?${query}` : ''}`;
};
