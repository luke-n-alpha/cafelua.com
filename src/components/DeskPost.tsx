'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import type { DeskPost as DeskPostType, DeskPostCard } from '@/data/desk/deskData';
import { DESK_CATEGORIES } from '@/data/desk/deskData';
import Comments from './Comments';
import './DeskPost.css';

interface Props {
    post: DeskPostType;
    prevPost?: DeskPostCard | null;
    nextPost?: DeskPostCard | null;
    fallbackPosts?: DeskPostCard[];
}

interface LinkPreviewData {
    title: string;
    description: string;
    image: string;
    siteName: string;
    host: string;
    url: string;
}

const linkPreviewCache = new Map<string, LinkPreviewData | null>();
const DEFAULT_DESK_THUMBNAIL = '/master-desk-background-img/master-desk-background.png';
const MISSING_IMAGE_FALLBACK = '/desk/missing-image.webp';

const LinkPreviewCard: React.FC<{ href: string; fallbackText: string }> = ({ href, fallbackText }) => {
    const [preview, setPreview] = useState<LinkPreviewData | null | undefined>(undefined);

    useEffect(() => {
        if (!href) {
            setPreview(null);
            return;
        }
        const cached = linkPreviewCache.get(href);
        if (cached !== undefined) {
            setPreview(cached);
            return;
        }
        let alive = true;
        fetch(`/api/link-preview?url=${encodeURIComponent(href)}`)
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (!alive) return;
                const payload = data as LinkPreviewData | null;
                linkPreviewCache.set(href, payload);
                setPreview(payload);
            })
            .catch(() => {
                if (!alive) return;
                linkPreviewCache.set(href, null);
                setPreview(null);
            });
        return () => { alive = false; };
    }, [href]);

    const title = preview?.title || fallbackText || href;
    const description = preview?.description || '';
    const host = preview?.host || (() => {
        try { return new URL(href).hostname.replace(/^www\./, ''); } catch { return href; }
    })();

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`desk-link-card${preview?.image ? '' : ' no-image'}`}
        >
            {preview?.image && (
                <span className="desk-link-card-thumb">
                    <img src={preview.image} alt={title} loading="lazy" />
                </span>
            )}
            <span className="desk-link-card-body">
                <span className="desk-link-card-title">{title}</span>
                {description && <span className="desk-link-card-desc">{description}</span>}
                <span className="desk-link-card-host">{host}</span>
            </span>
        </a>
    );
};

const DEFAULT_DESK_THUMBNAIL_NAV = '/master-desk-background-img/master-desk-background.png';

const NavCard: React.FC<{
    card: DeskPostCard;
    label: string;
    locale: string;
    isKo: boolean;
}> = ({ card, label, locale, isKo }) => {
    const catLabel = DESK_CATEGORIES.find((c) => c.key === card.category);
    return (
        <a
            href={`/${locale}/desk/${card.slug}`}
            className="desk-nav-card"
            aria-label={`${label}: ${isKo ? card.titleKo : card.titleEn}`}
        >
            <img
                className="desk-nav-card-thumb"
                src={card.thumbnail || DEFAULT_DESK_THUMBNAIL_NAV}
                alt=""
                loading="lazy"
                onError={(e) => {
                    const img = e.currentTarget;
                    if (img.dataset.fallbackApplied === '1') return;
                    img.dataset.fallbackApplied = '1';
                    img.src = MISSING_IMAGE_FALLBACK;
                }}
            />
            <div className="desk-nav-card-body">
                <span className="desk-nav-card-label">{label}</span>
                <span className="desk-nav-card-title">{isKo ? card.titleKo : card.titleEn}</span>
                <span className="desk-nav-card-meta">
                    <span>{card.date}</span>
                    {catLabel && <span className="desk-nav-card-badge">{isKo ? catLabel.labelKo : catLabel.labelEn}</span>}
                </span>
            </div>
        </a>
    );
};

const DeskPost: React.FC<Props> = ({ post, prevPost, nextPost, fallbackPosts }) => {
    const { i18n, t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isKo = i18n.language === 'ko';

    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const images = post.images;
    const len = images.length;

    const title = isKo ? post.titleKo : post.titleEn;
    const content = isKo ? post.contentKo : post.contentEn;
    const hasImageMarker = /\{\{IMG:\d+\}\}/.test(content);
    const featureImage = post.thumbnail || post.images?.[0] || '';
    const contentHasImage = /!\[.*?\]\(.*?\)/.test(content) || /\{\{IMG:\d+\}\}/.test(content);
    const shouldRenderFeatureImage =
        !!featureImage &&
        featureImage !== DEFAULT_DESK_THUMBNAIL &&
        featureImage !== MISSING_IMAGE_FALLBACK &&
        !contentHasImage;

    const normalizeMediaSrc = (raw?: string) => {
        if (!raw) return '';
        const noHash = raw.split('#')[0];
        const noQuery = noHash.split('?')[0];
        try {
            return decodeURIComponent(noQuery).trim();
        } catch {
            return noQuery.trim();
        }
    };

    const findImageIndex = (src?: string) => {
        const target = normalizeMediaSrc(src);
        if (!target) return -1;
        const direct = images.findIndex((item) => normalizeMediaSrc(item) === target);
        if (direct >= 0) return direct;
        const targetFile = target.split('/').pop() || '';
        if (!targetFile) return -1;
        return images.findIndex((item) => (normalizeMediaSrc(item).split('/').pop() || '') === targetFile);
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (img.dataset.fallbackApplied === '1') return;
        img.dataset.fallbackApplied = '1';
        img.src = MISSING_IMAGE_FALLBACK;
    };

    const hasImageChild = (node: React.ReactNode): boolean => {
        if (!node) return false;
        if (Array.isArray(node)) return node.some(hasImageChild);
        if (!React.isValidElement(node)) return false;
        if (typeof node.type === 'string' && node.type.toLowerCase() === 'img') return true;
        const element = node as React.ReactElement<{ children?: React.ReactNode }>;
        return hasImageChild(element.props.children);
    };

    const flattenText = (node: React.ReactNode): string => {
        if (typeof node === 'string' || typeof node === 'number') return String(node);
        if (Array.isArray(node)) return node.map(flattenText).join('');
        if (React.isValidElement(node)) {
            const element = node as React.ReactElement<{ children?: React.ReactNode }>;
            return flattenText(element.props.children);
        }
        return '';
    };

    const toMarkdownLinks = (text: string) => {
        const urlRegex = /(?:https?:\/\/|www\.)[^\s<)]+/g;
        // Do not re-wrap lines that already contain markdown links.
        return text
            .split('\n')
            .map((line) => {
                if (/\[[^\]]+\]\([^)]+\)/.test(line)) return line;
                return line.replace(urlRegex, (raw) => {
                    const url = raw.startsWith('www.') ? `https://${raw}` : raw;
                    return `[${raw}](${url})`;
                });
            })
            .join('\n');
    };

    const getYouTubeId = (url: string) => {
        try {
            const u = new URL(url);
            if (u.hostname.includes('youtu.be')) {
                return u.pathname.replace('/', '');
            }
            if (u.hostname.includes('youtube.com')) {
                if (u.pathname.startsWith('/embed/')) return u.pathname.split('/embed/')[1];
                return u.searchParams.get('v') || '';
            }
        } catch {
            return '';
        }
        return '';
    };

    const buildMarkdownWithImages = (text: string, imgs: string[]) => {
        const dedupeNearbyLinks = (input: string) => {
            const lines = input.split('\n');
            const result: string[] = [];

            const rawUrl = (line: string) => {
                const m = line.trim().match(/^(https?:\/\/[^\s)]+)$/);
                return m?.[1] || '';
            };
            const mdUrl = (line: string) => {
                const m = line.trim().match(/\]\((https?:\/\/[^)\s]+)\)\s*$/);
                return m?.[1] || '';
            };
            const mdUrlOnly = (line: string) => {
                const m = line.trim().match(/^\[(https?:\/\/[^\]\s]+)\]\((https?:\/\/[^)\s]+)\)$/);
                if (!m) return '';
                return m[2] || '';
            };
            const normalizeUrl = (url: string) => {
                try {
                    const u = new URL(url.trim());
                    u.hash = '';
                    // treat `https://a.com` and `https://a.com/` as same
                    if (u.pathname === '/') u.pathname = '';
                    return u.toString();
                } catch {
                    return url.trim();
                }
            };
            const hostOf = (url: string) => {
                try {
                    return new URL(url).hostname.replace(/^www\./, '');
                } catch {
                    return '';
                }
            };
            const isBareHostLine = (line: string) =>
                /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(line.trim());
            const nextNonEmpty = (from: number) => {
                let j = from + 1;
                while (j < lines.length && lines[j].trim() === '') j++;
                return j < lines.length ? { idx: j, line: lines[j] } : null;
            };
            const prevNonEmpty = (from: number) => {
                let j = from - 1;
                while (j >= 0 && lines[j].trim() === '') j--;
                return j >= 0 ? { idx: j, line: lines[j] } : null;
            };

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const u1 = rawUrl(line);
                if (!u1) {
                    // Convert:
                    // "설명 문장"
                    // "[https://...](https://...)"
                    // into:
                    // "[설명 문장](https://...)"
                    const nextForText = nextNonEmpty(i);
                    const nextUrlOnly = nextForText ? mdUrlOnly(nextForText.line) : '';
                    const trimmedLine = line.trim();
                    if (
                        nextUrlOnly &&
                        trimmedLine &&
                        !trimmedLine.startsWith('#') &&
                        !trimmedLine.startsWith('-') &&
                        !trimmedLine.startsWith('[') &&
                        !/\[[^\]]+\]\([^)]+\)/.test(trimmedLine)
                    ) {
                        result.push(`[${trimmedLine}](${nextUrlOnly})`);
                        i = nextForText!.idx;
                        continue;
                    }

                    const md = mdUrl(line);
                    if (md) {
                        const prev = prevNonEmpty(i);
                        const prevUrl = prev ? rawUrl(prev.line) || mdUrl(prev.line) : '';
                        if (prevUrl && normalizeUrl(prevUrl) === normalizeUrl(md)) continue;
                    }
                    // Remove noisy link-preview text line when 바로 옆에 같은 호스트 URL이 있는 경우.
                    const trimmed = line.trim();
                    const next = nextNonEmpty(i);
                    const prev = prevNonEmpty(i);
                    const nextUrl = next ? rawUrl(next.line) || mdUrl(next.line) : '';
                    const prevUrl = prev ? rawUrl(prev.line) || mdUrl(prev.line) : '';
                    const nearUrl = nextUrl || prevUrl;
                    if (nearUrl) {
                        const nearHost = hostOf(nearUrl);
                        if (nearHost) {
                            const compact = trimmed.replace(/\s+/g, ' ');
                            const hostMentioned = compact.toLowerCase().includes(nearHost.toLowerCase());
                            const looksPreviewText =
                                hostMentioned &&
                                compact.length >= 20 &&
                                !compact.startsWith('#') &&
                                !compact.startsWith('- ') &&
                                !compact.startsWith('**');
                            const bareHostNoise = isBareHostLine(compact) && compact.toLowerCase() === nearHost.toLowerCase();
                            if (looksPreviewText || bareHostNoise) {
                                continue;
                            }
                        }
                    }
                    result.push(line);
                    continue;
                }

                let j = i + 1;
                while (j < lines.length && lines[j].trim() === '') j++;
                const next = j < lines.length ? lines[j] : '';
                const u2 = mdUrl(next);
                if (u2 && u2 === u1) {
                    // Skip raw URL line; keep only one card source.
                    continue;
                }

                const prev = prevNonEmpty(i);
                const prevUrl = prev ? rawUrl(prev.line) || mdUrl(prev.line) : '';
                if (prevUrl && normalizeUrl(prevUrl) === normalizeUrl(u1)) continue;
                result.push(line);
            }
            return result.join('\n');
        };

        const normalizeMarkdown = (input: string) => input
            .replace(/\u200b/g, '')
            // Repair malformed bold like "*** text**" from scraped markdown/html mixes.
            .replace(/\*\*\*\s*([^*\n][^*\n]*?)\s*\*\*(?!\*)/g, '**$1**')
            // Normalize malformed numbered bold lines from scraping artifacts.
            .replace(/^\s*\*\*(\d+\.\s*[^*\n]+?)\s+\*\*\s*$/gm, '**$1**')
            .replace(/^\s*\*\*(\d+\.\s*[^*\n]+?)\s*$/gm, '**$1**')
            // Fix split numbered bold headings: "**2.\n제목**" -> "**2. 제목**"
            .replace(/\*\*(\d+)\.\s*\n+\s*([^*\n][^*]*?)\*\*/g, '**$1. $2**')
            // Fix dangling split numbers in headings/list lines.
            .replace(/\*\*(\d+)\.\s*\n+\s*/g, '**$1. ')
            .replace(/(^|\n)(\d+)\.\s*\n+\s*/g, '$1$2. ')
            // Fix malformed markdown links where href got corrupted during scraping.
            .replace(/\[(https?:\/\/[^\]\s]+)\]\(([^)]+)\)/g, (_m, labelUrl, href) => {
                const cleanLabel = String(labelUrl).trim();
                let cleanHref = String(href).trim();
                if (cleanHref.includes('%5D(')) cleanHref = cleanHref.replace(/%5D\(.*/i, '');
                const secondHttp = cleanHref.indexOf('http', cleanHref.indexOf('http') + 4);
                if (secondHttp > 0) cleanHref = cleanHref.slice(0, secondHttp);
                // If href still looks broken, trust label URL.
                try {
                    new URL(cleanHref);
                } catch {
                    cleanHref = cleanLabel;
                }
                return `[${cleanLabel}](${cleanHref})`;
            })
            // "**1. [제목] **본문" -> "**1. 제목** 본문"
            .replace(/\*\*(\d+\.\s*)\[([^\]]+)\]\s*\*\*/g, '**$1$2**')
            // "**[제목]**" -> "**제목**"
            .replace(/\*\*\[([^\]]+)\]\s*\*\*/g, '**$1**')
            // add separators when bold closing marker is directly 붙은 경우
            .replace(/\*\*([^\n*]+)\*\*(?=\S)/g, (_m, inner) => {
                const text = String(inner).trim();
                const headingLike = /^\d+[\.\)]/.test(text) || text.length >= 14;
                return headingLike ? `**${text}**\n\n` : `**${text}** `;
            })
            // Recover split numbering artifacts like "2\n\n7. " => "27. " / "1\n0. " => "10. "
            .replace(/(^|\n)\s*(\d)\s*\n+\s*(\d\.\s)/g, '$1$2$3')
            // Remove orphan single-digit line right before numbered lines.
            .replace(/(^|\n)\s*\d\s*\n(?=\s*\d+\.\s)/g, '$1')
            // restore missing line breaks between numbered sentences in scraped blocks
            .replace(/([가-힣a-zA-Z\)\]\.])(?=(\d+\.\s))/g, '$1\n')
            // Keep single-line breaks from scraped markdown (react-markdown ignores them by default)
            .replace(/([^\n])\n([^\n])/g, '$1  \n$2');

        const markerRegex = /\{\{IMG:(\d+)\}\}/g;
        const hasMarkers = markerRegex.test(text);
        markerRegex.lastIndex = 0;

        if (hasMarkers) {
            const parts = text.split(markerRegex);
            let out = '';
            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 0) {
                    out += parts[i];
                } else {
                    const idx = parseInt(parts[i], 10) - 1;
                    if (!Number.isNaN(idx) && imgs[idx]) {
                        out += `\n\n![](${imgs[idx]})\n\n`;
                    }
                }
            }
            return { markdown: dedupeNearbyLinks(normalizeMarkdown(toMarkdownLinks(out))), hasInlineImages: true };
        }

        if (!text.trim() || imgs.length === 0) {
            return { markdown: dedupeNearbyLinks(normalizeMarkdown(text)), hasInlineImages: false };
        }

        const paras = text.split(/\n{2,}/);
        let out = '';
        let imgIndex = 0;
        for (let i = 0; i < paras.length; i++) {
            out += paras[i];
            if (imgIndex < imgs.length) {
                out += `\n\n![](${imgs[imgIndex]})\n\n`;
                imgIndex++;
            } else {
                out += '\n\n';
            }
        }
        return { markdown: dedupeNearbyLinks(normalizeMarkdown(toMarkdownLinks(out.trim()))), hasInlineImages: true };
    };

    const { markdown, hasInlineImages } = buildMarkdownWithImages(content, post.images);

    const isHtmlContent = /<(?:p|div|span|br|img|a|h[1-6]|ul|ol|li|table|thead|tbody|tr|td|th|blockquote|iframe)\b[^>]*>/i.test(content);
    const htmlContent = useMemo(() => {
        if (!isHtmlContent) return '';
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const links = doc.querySelectorAll('a[href]');
            links.forEach((link) => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                const href = link.getAttribute('href') || '';
                const ytId = getYouTubeId(href);
                if (ytId) {
                    const wrap = doc.createElement('div');
                    wrap.className = 'desk-youtube';
                    const iframe = doc.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${ytId}`;
                    iframe.title = 'YouTube video';
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                    iframe.setAttribute('allowfullscreen', 'true');
                    wrap.appendChild(iframe);
                    link.replaceWith(wrap);
                }
            });
            doc.querySelectorAll('img').forEach((img) => {
                const w = parseInt(img.getAttribute('width') || '0', 10);
                const h = parseInt(img.getAttribute('height') || '0', 10);
                if ((w && w <= 64) || (h && h <= 64)) {
                    img.classList.add('desk-post-inline-img');
                } else {
                    img.classList.add('desk-post-img');
                }
            });
            return doc.body.innerHTML;
        } catch {
            return content;
        }
    }, [content, isHtmlContent]);

    const goNext = useCallback(() => {
        if (len <= 1) return;
        setLightboxIdx((prev) => (prev !== null ? (prev + 1) % len : null));
    }, [len]);

    const goPrev = useCallback(() => {
        if (len <= 1) return;
        setLightboxIdx((prev) => (prev !== null ? (prev - 1 + len) % len : null));
    }, [len]);

    useEffect(() => {
        if (lightboxIdx === null) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
            else if (e.key === 'Escape') setLightboxIdx(null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxIdx, goNext, goPrev]);

    useEffect(() => {
        if (lightboxIdx === null) return;
        const el = lightboxRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (e.deltaY > 0 || e.deltaX > 0) goNext();
            else if (e.deltaY < 0 || e.deltaX < 0) goPrev();
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [lightboxIdx, goNext, goPrev]);

    const [popularPosts, setPopularPosts] = useState<DeskPostCard[]>([]);
    const [popularLoading, setPopularLoading] = useState(true);

    useEffect(() => {
        const excludeSlugs = new Set([post.slug]);
        if (prevPost) excludeSlugs.add(prevPost.slug);
        if (nextPost) excludeSlugs.add(nextPost.slug);

        fetch('/api/desk/popular')
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (data?.popular?.length) {
                    const filtered = (data.popular as DeskPostCard[])
                        .filter((p) => !excludeSlugs.has(p.slug))
                        .slice(0, 4);
                    setPopularPosts(filtered);
                } else if (fallbackPosts?.length) {
                    setPopularPosts(fallbackPosts.filter((p) => !excludeSlugs.has(p.slug)).slice(0, 4));
                }
                setPopularLoading(false);
            })
            .catch(() => {
                if (fallbackPosts?.length) {
                    setPopularPosts(fallbackPosts.filter((p) => !excludeSlugs.has(p.slug)).slice(0, 4));
                }
                setPopularLoading(false);
            });
    }, [post.slug, prevPost, nextPost, fallbackPosts]);

    const handleBack = () => {
        const query = searchParams.toString();
        router.push(`/${i18n.language}/desk${query ? `?${query}` : ''}`);
    };

    const hasPrevNext = prevPost || nextPost;
    const hasPopular = popularPosts.length > 0;

    return (
        <div className="desk-post-container">
            <div className="desk-post-panel">
                <div className="desk-post-header">
                    <h1 className="desk-post-title">{title}</h1>
                    <div className="desk-post-meta">
                        <span className="desk-post-date">{post.date}</span>
                        {post.externalUrl && (
                            <a
                                href={post.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="desk-post-external"
                            >
                                <ExternalLink size={14} />
                                {isKo ? '원본' : 'Original'}
                            </a>
                        )}
                    </div>
                </div>

                <div ref={contentRef} className="desk-post-content">
                    {shouldRenderFeatureImage && !hasImageMarker && !isHtmlContent && (
                        <img
                            src={featureImage}
                            alt={title}
                            className="desk-post-feature"
                            loading="lazy"
                            onError={handleImageError}
                        />
                    )}
                    {content && isHtmlContent && (
                        <div className="desk-post-text" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    )}

                    {content && !isHtmlContent && (
                        <div className="desk-post-text">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                components={{
                                    a: ({ href, children, ...props }) => (
                                        (() => {
                                            const safeHref = href || '';
                                            const ytId = getYouTubeId(safeHref);
                                            if (ytId) {
                                                return (
                                                    <div className="desk-youtube">
                                                        <iframe
                                                            src={`https://www.youtube.com/embed/${ytId}`}
                                                            title="YouTube video"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                            allowFullScreen
                                                        />
                                                    </div>
                                                );
                                            }
                                            if (hasImageChild(children)) {
                                                return (
                                                    <a href={safeHref} target="_blank" rel="noopener noreferrer" {...props}>
                                                        {children}
                                                    </a>
                                                );
                                            }

                                            if (safeHref.startsWith('http://') || safeHref.startsWith('https://')) {
                                                const text = flattenText(children).trim();
                                                const isHashTag = text.startsWith('#');
                                                const isNaverBlogLink =
                                                    safeHref.includes('blog.naver.com/') ||
                                                    safeHref.includes('tv.naver.com/');
                                                const isNaverInternalCardLink =
                                                    safeHref.includes('blog.naver.com/PostView.naver') ||
                                                    safeHref.includes('blog.naver.com/') && safeHref.includes('redirect=Dlog');
                                                if (isNaverInternalCardLink) {
                                                    return null;
                                                }
                                                if (isNaverBlogLink) {
                                                    return (
                                                        <a href={safeHref} target="_blank" rel="noopener noreferrer" {...props}>
                                                            {children}
                                                        </a>
                                                    );
                                                }
                                                const shouldCard = !isHashTag && (text.length >= 20 || text === safeHref);
                                                if (shouldCard) {
                                                    return <LinkPreviewCard href={safeHref} fallbackText={text} />;
                                                }
                                            }
                                            return (
                                                <a href={safeHref} target="_blank" rel="noopener noreferrer" {...props}>
                                                    {children}
                                                </a>
                                            );
                                        })()
                                    ),
                                    p: ({ children, ...props }) => (
                                        <div className="desk-post-p" {...props}>{children}</div>
                                    ),
                                    img: ({ src, alt, ...props }) => {
                                        const safeSrc = typeof src === 'string' ? src : '';
                                        if (!safeSrc) return null;
                                        const idx = findImageIndex(safeSrc);
                                        const isContentImage = idx >= 0 || /^\/(?:desk|diary)\//.test(safeSrc);
                                        return (
                                            <img
                                                src={safeSrc}
                                                alt={alt || ''}
                                                className={isContentImage ? 'desk-post-img' : 'desk-post-inline-img'}
                                                onClick={() => idx >= 0 && setLightboxIdx(idx)}
                                                onError={handleImageError}
                                                {...props}
                                            />
                                        );
                                    },
                                }}
                            >
                                {markdown}
                            </ReactMarkdown>
                        </div>
                    )}

                    {!content && post.images.length > 0 && !hasInlineImages && (
                        <div className="desk-post-images">
                            {images.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`${title} ${i + 1}`}
                                    className="desk-post-img"
                                    loading="lazy"
                                    onClick={() => setLightboxIdx(i)}
                                    onError={handleImageError}
                                />
                            ))}
                        </div>
                    )}
                    {/* Post navigation section */}
                    {(hasPrevNext || hasPopular || popularLoading) && (
                        <div className="desk-post-nav">
                            {hasPrevNext && (
                                <>
                                    <h3 className="desk-post-nav-heading">
                                        {isKo ? '더 둘러보기' : 'Read More'}
                                    </h3>
                                    <div className="desk-post-nav-adjacent">
                                        {prevPost ? (
                                            <NavCard card={prevPost} label={isKo ? '← 이전' : '← Prev'} locale={i18n.language} isKo={isKo} />
                                        ) : <div className="desk-nav-card-empty" />}
                                        {nextPost ? (
                                            <NavCard card={nextPost} label={isKo ? '다음 →' : 'Next →'} locale={i18n.language} isKo={isKo} />
                                        ) : <div className="desk-nav-card-empty" />}
                                    </div>
                                </>
                            )}

                            {(hasPopular || popularLoading) && (
                                <>
                                    <h3 className="desk-post-nav-heading">
                                        {isKo ? '인기 포스팅' : 'Popular Posts'}
                                    </h3>
                                    <div className="desk-post-nav-popular">
                                        {popularLoading ? (
                                            Array.from({ length: 3 }).map((_, i) => (
                                                <div key={i} className="desk-nav-card desk-nav-card-skeleton">
                                                    <div className="desk-nav-card-thumb desk-skeleton-shimmer" />
                                                    <div className="desk-nav-card-body">
                                                        <span className="desk-skeleton-line desk-skeleton-shimmer" />
                                                        <span className="desk-skeleton-line short desk-skeleton-shimmer" />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            popularPosts.map((p) => (
                                                <NavCard key={p.slug} card={p} label="" locale={i18n.language} isKo={isKo} />
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <Comments postSlug={post.slug} postType="desk" />

                    <div className="cc-license">
                        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">
                            <img src="https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png" alt="CC BY-NC-SA 4.0" />
                        </a>
                        <span>{isKo
                            ? '이 글은 CC BY-NC-SA 4.0 라이선스로 제공됩니다.'
                            : 'This post is licensed under CC BY-NC-SA 4.0.'
                        }</span>
                    </div>
                </div>

                <button className="desk-post-back" onClick={handleBack}>
                    {t('desk.backToDesk')}
                </button>
            </div>

            {lightboxIdx !== null && (
                <div ref={lightboxRef} className="desk-lightbox" onClick={() => setLightboxIdx(null)}>
                    <img
                        src={images[lightboxIdx]}
                        alt={`${title} ${lightboxIdx + 1}`}
                        onClick={(e) => e.stopPropagation()}
                        onError={handleImageError}
                    />
                    {len > 1 && (
                        <>
                            <button
                                className="desk-lb-arrow prev"
                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            >
                                &#8249;
                            </button>
                            <button
                                className="desk-lb-arrow next"
                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                            >
                                &#8250;
                            </button>
                            <div className="desk-lb-counter">
                                {lightboxIdx + 1} / {images.length}
                            </div>
                        </>
                    )}
                    <button className="desk-lb-close" onClick={() => setLightboxIdx(null)}>
                        {t('about.close')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DeskPost;
