import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['ko', 'en'];
const defaultLocale = 'ko';

function getLocale(request: NextRequest): string {
    // Check Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
        const preferred = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
        if (locales.includes(preferred)) {
            return preferred;
        }
    }
    return defaultLocale;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip for static files, API routes, and already localized paths
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
    ) {
        return NextResponse.next();
    }

    // Detect locale and redirect
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;

    return NextResponse.redirect(newUrl);
}

export const config = {
    matcher: [
        // Skip static files
        '/((?!_next|api|.*\\..*).*)',
    ],
};
