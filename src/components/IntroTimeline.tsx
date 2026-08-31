'use client';

/**
 * The front door's timeline.
 *
 * A tab at the top left; press it and a panel slides in from the edge holding
 * whatever was written most recently — guestbook entries and comments on posts,
 * in one stream. Each line is a shortcut: it carries the visitor straight to
 * the corner the writing lives in, with the season and weather they chose
 * still on.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Clock, X } from 'lucide-react';
import './IntroTimeline.css';

type TimelineItem = {
    kind: 'guestbook' | 'comment';
    id: string;
    nickname: string;
    text: string;
    createdAt: string | null;
    href: string;
    where: string;
};

interface IntroTimelineProps {
    isKo: boolean;
    /** Sends the visitor into the cafe at the given path, environment intact. */
    onNavigate: (path: string) => void;
}

/** "3일 전" / "3 days ago" — close enough for a timeline, and no dependency. */
function howLongAgo(iso: string | null, isKo: boolean): string {
    if (!iso) return '';
    const then = Date.parse(iso);
    if (Number.isNaN(then)) return '';
    const minutes = Math.max(0, Math.floor((Date.now() - then) / 60_000));
    if (minutes < 1) return isKo ? '방금' : 'just now';
    if (minutes < 60) return isKo ? `${minutes}분 전` : `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return isKo ? `${hours}시간 전` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return isKo ? `${days}일 전` : `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return isKo ? `${months}달 전` : `${months}mo ago`;
    return isKo ? `${Math.floor(months / 12)}년 전` : `${Math.floor(months / 12)}y ago`;
}

const IntroTimeline: React.FC<IntroTimelineProps> = ({ isKo, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<TimelineItem[] | null>(null);
    const [failed, setFailed] = useState(false);

    // Fetched on first open, not on page load: the front door should not wait
    // on a panel nobody has asked for.
    useEffect(() => {
        if (!isOpen || items || failed) return;
        let cancelled = false;
        fetch('/api/timeline?limit=20')
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
            .then((data) => {
                if (!cancelled) setItems(Array.isArray(data.items) ? data.items : []);
            })
            .catch(() => {
                if (!cancelled) setFailed(true);
            });
        return () => {
            cancelled = true;
        };
    }, [isOpen, items, failed]);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    const go = useCallback((path: string) => {
        setIsOpen(false);
        onNavigate(path);
    }, [onNavigate]);

    const title = isKo ? '타임라인' : 'Timeline';

    return (
        <>
            <button
                className={`intro-timeline-tab ui-icon-button ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen((open) => !open)}
                type="button"
                title={title}
                aria-expanded={isOpen}
                aria-controls="intro-timeline-panel"
            >
                <Clock size={18} />
                <span className="intro-timeline-tab-label">{title}</span>
            </button>

            {isOpen && (
                <div
                    className="intro-timeline-backdrop"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                id="intro-timeline-panel"
                className={`intro-timeline-panel glass ${isOpen ? 'open' : ''}`}
                aria-hidden={!isOpen}
            >
                <div className="intro-timeline-header">
                    <h2>{title}</h2>
                    <button
                        className="intro-timeline-close"
                        onClick={() => setIsOpen(false)}
                        type="button"
                        aria-label={isKo ? '닫기' : 'Close'}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="intro-timeline-body">
                    {failed && (
                        <p className="intro-timeline-empty">
                            {isKo ? '지금은 불러오지 못했어요.' : 'Could not load this just now.'}
                        </p>
                    )}
                    {!failed && items === null && (
                        <p className="intro-timeline-empty">{isKo ? '불러오는 중…' : 'Loading…'}</p>
                    )}
                    {!failed && items?.length === 0 && (
                        <p className="intro-timeline-empty">
                            {isKo ? '아직 남겨진 글이 없어요.' : 'Nothing has been written yet.'}
                        </p>
                    )}
                    {items?.map((item) => (
                        <button
                            key={`${item.kind}-${item.id}`}
                            className="intro-timeline-item"
                            onClick={() => go(item.href)}
                            type="button"
                        >
                            <span className="intro-timeline-item-top">
                                <span className={`intro-timeline-kind ${item.kind}`}>
                                    {item.kind === 'guestbook'
                                        ? (isKo ? '방명록' : 'Guestbook')
                                        : (isKo ? '댓글' : 'Comment')}
                                </span>
                                <span className="intro-timeline-nick">{item.nickname}</span>
                                <span className="intro-timeline-when">{howLongAgo(item.createdAt, isKo)}</span>
                            </span>
                            <span className="intro-timeline-text">
                                {item.text || (isKo ? '비밀글입니다' : 'A secret message')}
                            </span>
                            {item.kind === 'comment' && (
                                <span className="intro-timeline-where">{item.where}</span>
                            )}
                        </button>
                    ))}
                </div>
            </aside>
        </>
    );
};

export default IntroTimeline;
