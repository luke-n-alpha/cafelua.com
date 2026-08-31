import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { isTrustedFrontDoorRequest } from './lib/front-door-guard';

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

    // In production, reject traffic that bypasses our Azure Front Door profile.
    // Azure injects this header after accepting the client request; direct origin
    // requests do not receive it. Keep the check opt-in so local development and
    // tests continue to work without Azure-specific configuration.
    const expectedFrontDoorId = process.env.AZURE_FRONT_DOOR_ID;
    if (!isTrustedFrontDoorRequest(
        request.headers.get('x-azure-fdid'),
        expectedFrontDoorId,
    )) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    // Skip for static files, API routes, and already localized paths
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        // The restored 1997-2002 homepages are a static archive with no locale
        // of its own. A folder address inside it carries no dot, so without
        // this it is read as a site route and sent to /ko/..., where nothing
        // answers. Every page under it is served exactly as it was published.
        pathname.includes('.') ||
        locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
    ) {
        return NextResponse.next();
    }

    // The restored 1997-2002 homepages are a static archive with no locale of
    // its own. A folder address inside it carries no dot, so the locale router
    // would send it to /ko/..., where nothing answers; and the static server
    // does not look for an index page on its own. Serve the folder's own index
    // and leave every other address under it exactly as published.
    if (pathname.startsWith('/fstory-homepage')) {
        const asFolder = !pathname.split('/').pop()?.includes('.');
        if (!asFolder) {
            return NextResponse.next();
        }
        const index = new URL(`${pathname.replace(/\/$/, '')}/index.html`, request.url);
        index.search = request.nextUrl.search;
        return NextResponse.rewrite(index);
    }

    // Detect locale and redirect
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;

    return NextResponse.redirect(newUrl);
}

export const config = {
    // The origin guard must also cover API and static asset requests.
    matcher: ['/:path*'],
};
