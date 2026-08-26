import { NextRequest, NextResponse } from 'next/server';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

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

const MAX_REDIRECTS = 4;
const MAX_HTML_BYTES = 1_048_576;
const FETCH_TIMEOUT_MS = 5_000;

const isBlockedIp = (address: string): boolean => {
    const normalized = address.toLowerCase().split('%')[0];
    if (normalized === '::1' || normalized === '::' || normalized.startsWith('fe80:')) return true;
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
    if (normalized.startsWith('::ffff:')) return isBlockedIp(normalized.slice(7));
    if (isIP(normalized) !== 4) return false;

    const octets = normalized.split('.').map(Number);
    const [a, b] = octets;
    return (
        a === 0 || a === 10 || a === 127 ||
        (a === 100 && b >= 64 && b <= 127) ||
        (a === 169 && b === 254) ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 0) ||
        (a === 192 && b === 168) ||
        (a === 198 && (b === 18 || b === 19)) ||
        a >= 224
    );
};

export const assertPublicUrl = async (url: URL): Promise<void> => {
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
        throw new Error('unsupported URL');
    }
    if ((url.protocol === 'http:' && url.port && url.port !== '80') ||
        (url.protocol === 'https:' && url.port && url.port !== '443')) {
        throw new Error('unsupported port');
    }

    const addresses = await lookup(url.hostname, { all: true, verbatim: true });
    if (!addresses.length || addresses.some(({ address }) => isBlockedIp(address))) {
        throw new Error('non-public destination');
    }
};

const readLimitedText = async (response: Response): Promise<string> => {
    const announced = Number(response.headers.get('content-length') || 0);
    if (announced > MAX_HTML_BYTES) throw new Error('response too large');
    if (!response.body) return '';

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let bytes = 0;
    let text = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_HTML_BYTES) {
            await reader.cancel();
            throw new Error('response too large');
        }
        text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
};

const fetchPublicHtml = async (initial: URL): Promise<{ response: Response; finalUrl: URL }> => {
    let current = initial;
    for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
        await assertPublicUrl(current);
        const response = await fetch(current, {
            redirect: 'manual',
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; cafelua-link-preview/1.0)',
                Accept: 'text/html,application/xhtml+xml',
            },
            cache: 'no-store',
        });
        if (![301, 302, 303, 307, 308].includes(response.status)) {
            return { response, finalUrl: current };
        }
        const location = response.headers.get('location');
        if (!location || redirect === MAX_REDIRECTS) throw new Error('invalid redirect');
        current = new URL(location, current);
    }
    throw new Error('too many redirects');
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
        const { response: r, finalUrl } = await fetchPublicHtml(target);
        if (!r.ok) return NextResponse.json(null, { status: 200 });

        const contentType = r.headers.get('content-type') || '';
        if (!contentType.toLowerCase().includes('text/html')) {
            return NextResponse.json(null, { status: 200 });
        }

        const html = await readLimitedText(r);
        const title =
            pickMeta(html, ['og:title', 'twitter:title']) ||
            pickTitle(html) ||
            target.hostname;
        const description = pickMeta(html, ['og:description', 'description', 'twitter:description']);
        const image = toAbs(finalUrl.toString(), pickMeta(html, ['og:image', 'twitter:image']));
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
