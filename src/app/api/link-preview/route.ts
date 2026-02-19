import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface PreviewPayload {
    title: string;
    description: string;
    image: string;
    siteName: string;
    host: string;
    url: string;
}

const pickMeta = (html: string, keys: string[]): string => {
    for (const key of keys) {
        const re = new RegExp(
            `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`,
            'i'
        );
        const m = html.match(re);
        if (m?.[1]) return decodeHtml(m[1].trim());
    }
    return '';
};

const pickTitle = (html: string): string => {
    const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return m?.[1] ? decodeHtml(m[1].trim()) : '';
};

const decodeHtml = (s: string): string =>
    s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

const toAbs = (base: string, maybe: string): string => {
    if (!maybe) return '';
    try {
        return new URL(maybe, base).toString();
    } catch {
        return maybe;
    }
};

export async function GET(req: NextRequest) {
    const raw = req.nextUrl.searchParams.get('url') || '';
    if (!raw) return NextResponse.json(null, { status: 400 });

    let target: URL;
    try {
        target = new URL(raw);
    } catch {
        return NextResponse.json(null, { status: 400 });
    }

    if (!['http:', 'https:'].includes(target.protocol)) {
        return NextResponse.json(null, { status: 400 });
    }

    try {
        const r = await fetch(target.toString(), {
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; cafelua-link-preview/1.0)',
                Accept: 'text/html,application/xhtml+xml',
            },
            cache: 'no-store',
        });
        if (!r.ok) return NextResponse.json(null, { status: 200 });

        const html = await r.text();
        const finalUrl = r.url || target.toString();
        const title =
            pickMeta(html, ['og:title', 'twitter:title']) ||
            pickTitle(html) ||
            target.hostname;
        const description = pickMeta(html, ['og:description', 'description', 'twitter:description']);
        const image = toAbs(finalUrl, pickMeta(html, ['og:image', 'twitter:image']));
        const siteName = pickMeta(html, ['og:site_name']) || target.hostname.replace(/^www\./, '');

        const payload: PreviewPayload = {
            title,
            description,
            image,
            siteName,
            host: target.hostname.replace(/^www\./, ''),
            url: target.toString(),
        };
        return NextResponse.json(payload, { status: 200 });
    } catch {
        return NextResponse.json(null, { status: 200 });
    }
}

