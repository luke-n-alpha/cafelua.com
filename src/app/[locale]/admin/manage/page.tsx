'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Metadata } from 'next';

interface CommentItem {
    id: string;
    postSlug: string;
    postType: string;
    parentId: string | null;
    nickname: string;
    email: string | null;
    content: string;
    createdAt: string | null;
    deleted: boolean;
}

interface GuestbookItem {
    id: string;
    nickname: string;
    message: string;
    isSecret: boolean;
    createdAt: string | null;
}

const PAGE_SIZE = 50;

export default function AdminManagePage() {
    const [isLocal, setIsLocal] = useState(false);
    const [tab, setTab] = useState<'comments' | 'guestbook'>('comments');
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [guestbook, setGuestbook] = useState<GuestbookItem[]>([]);
    const [commentsCursor, setCommentsCursor] = useState<string | null>(null);
    const [guestbookCursor, setGuestbookCursor] = useState<string | null>(null);
    const [commentsHasMore, setCommentsHasMore] = useState(true);
    const [guestbookHasMore, setGuestbookHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const host = window.location.hostname;
        setIsLocal(host === 'localhost' || host === '127.0.0.1');
    }, []);

    const showToast = useCallback((msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    }, []);

    const fetchData = useCallback(async (t: 'comments' | 'guestbook', cursor?: string | null) => {
        setLoading(true);
        try {
            const body: Record<string, unknown> = { action: 'list', tab: t, limit: PAGE_SIZE };
            if (cursor) body.after = cursor;
            const res = await fetch('/api/admin/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            if (t === 'comments') {
                setComments((prev) => cursor ? [...prev, ...data.items] : data.items);
                setCommentsCursor(data.lastCursor);
                setCommentsHasMore(data.items.length === PAGE_SIZE);
            } else {
                setGuestbook((prev) => cursor ? [...prev, ...data.items] : data.items);
                setGuestbookCursor(data.lastCursor);
                setGuestbookHasMore(data.items.length === PAGE_SIZE);
            }
        } catch {
            showToast('Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        if (isLocal) fetchData(tab);
    }, [isLocal, tab, fetchData]);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item?')) return;
        try {
            const res = await fetch('/api/admin/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', tab, id }),
            });
            if (!res.ok) throw new Error('Failed');
            if (tab === 'comments') {
                setComments((prev) => prev.map((c) => c.id === id ? { ...c, deleted: true, content: '' } : c));
            } else {
                setGuestbook((prev) => prev.filter((g) => g.id !== id));
            }
            showToast('Deleted');
        } catch {
            showToast('Delete failed');
        }
    };

    const formatDate = (iso: string | null) => {
        if (!iso) return '-';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleString('ko-KR');
    };

    if (!isLocal) {
        return (
            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                <h2>Localhost only</h2>
                <p>This page is only accessible from localhost.</p>
            </div>
        );
    }

    const filteredComments = filter
        ? comments.filter((c) => c.postSlug.includes(filter))
        : comments;

    const uniqueSlugs = [...new Set(comments.map((c) => c.postSlug))];

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', fontFamily: 'system-ui, sans-serif' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Cafe Lua Admin</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <button
                    onClick={() => setTab('comments')}
                    style={{
                        padding: '8px 20px',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        background: tab === 'comments' ? '#8b6914' : '#eee',
                        color: tab === 'comments' ? '#fff' : '#333',
                        fontWeight: 600,
                    }}
                >
                    Comments ({comments.filter((c) => !c.deleted).length})
                </button>
                <button
                    onClick={() => setTab('guestbook')}
                    style={{
                        padding: '8px 20px',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        background: tab === 'guestbook' ? '#8b6914' : '#eee',
                        color: tab === 'guestbook' ? '#fff' : '#333',
                        fontWeight: 600,
                    }}
                >
                    Guestbook ({guestbook.length})
                </button>
                <button
                    onClick={() => fetchData(tab)}
                    disabled={loading}
                    style={{ marginLeft: 'auto', padding: '8px 12px', cursor: 'pointer' }}
                >
                    {loading ? '...' : 'Refresh'}
                </button>
            </div>

            {/* Comments Tab */}
            {tab === 'comments' && (
                <div>
                    {uniqueSlugs.length > 1 && (
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ marginBottom: 12, padding: '6px 10px', borderRadius: 4 }}
                        >
                            <option value="">All posts</option>
                            {uniqueSlugs.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    )}
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                                <th style={{ padding: 8 }}>Post</th>
                                <th style={{ padding: 8 }}>Nickname</th>
                                <th style={{ padding: 8 }}>Content</th>
                                <th style={{ padding: 8 }}>Email</th>
                                <th style={{ padding: 8 }}>Date</th>
                                <th style={{ padding: 8 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComments.map((c) => (
                                <tr
                                    key={c.id}
                                    style={{
                                        borderBottom: '1px solid #eee',
                                        opacity: c.deleted ? 0.4 : 1,
                                        background: c.parentId ? '#f9f9f9' : 'transparent',
                                    }}
                                >
                                    <td style={{ padding: 8, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {c.parentId ? '↳ reply' : c.postSlug}
                                    </td>
                                    <td style={{ padding: 8 }}>{c.nickname}</td>
                                    <td style={{ padding: 8, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {c.deleted ? '(deleted)' : c.content}
                                    </td>
                                    <td style={{ padding: 8, fontSize: '0.8rem', color: '#888' }}>{c.email || '-'}</td>
                                    <td style={{ padding: 8, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{formatDate(c.createdAt)}</td>
                                    <td style={{ padding: 8 }}>
                                        {!c.deleted && (
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {commentsHasMore && (
                        <button
                            onClick={() => fetchData('comments', commentsCursor)}
                            disabled={loading}
                            style={{ marginTop: 12, padding: '8px 16px', cursor: 'pointer' }}
                        >
                            {loading ? '...' : 'Load More'}
                        </button>
                    )}
                </div>
            )}

            {/* Guestbook Tab */}
            {tab === 'guestbook' && (
                <div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                                <th style={{ padding: 8 }}>Nickname</th>
                                <th style={{ padding: 8 }}>Message</th>
                                <th style={{ padding: 8 }}>Secret</th>
                                <th style={{ padding: 8 }}>Date</th>
                                <th style={{ padding: 8 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guestbook.map((g) => (
                                <tr key={g.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: 8 }}>{g.nickname}</td>
                                    <td style={{ padding: 8, maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {g.message}
                                    </td>
                                    <td style={{ padding: 8 }}>{g.isSecret ? 'Yes' : '-'}</td>
                                    <td style={{ padding: 8, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{formatDate(g.createdAt)}</td>
                                    <td style={{ padding: 8 }}>
                                        <button
                                            onClick={() => handleDelete(g.id)}
                                            style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {guestbookHasMore && (
                        <button
                            onClick={() => fetchData('guestbook', guestbookCursor)}
                            disabled={loading}
                            style={{ marginTop: 12, padding: '8px 16px', cursor: 'pointer' }}
                        >
                            {loading ? '...' : 'Load More'}
                        </button>
                    )}
                </div>
            )}

            {toast && (
                <div style={{
                    position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                    background: '#333', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: '0.85rem',
                }}>
                    {toast}
                </div>
            )}
        </div>
    );
}
