'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getComments, addComment, deleteComment } from '@/services/CommentService';
import type { Comment } from '@/services/CommentService';
import './Comments.css';

interface Props {
    postSlug: string;
    postType: 'desk' | 'diary';
}

const COOLDOWN_MS = 30_000;

const Comments: React.FC<Props> = ({ postSlug, postType }) => {
    const { t } = useTranslation();

    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Form state
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [cooldownUntil, setCooldownUntil] = useState(0);

    // Reply state
    const [replyTo, setReplyTo] = useState<{ id: string; nickname: string } | null>(null);
    const [replyNickname, setReplyNickname] = useState('');
    const [replyPassword, setReplyPassword] = useState('');
    const [replyEmail, setReplyEmail] = useState('');
    const [replyContent, setReplyContent] = useState('');
    const replyRef = useRef<HTMLTextAreaElement>(null);

    // Delete modal
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleting, setDeleting] = useState(false);

    // Toast
    const [toast, setToast] = useState<string | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const showToast = useCallback((msg: string) => {
        setToast(msg);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3000);
    }, []);

    const loadComments = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getComments(postSlug, postType);
            setComments(result.comments);
            setLoaded(true);
        } catch {
            showToast(t('comments.loadError'));
        } finally {
            setLoading(false);
        }
    }, [postSlug, postType, showToast, t]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    // Group comments: top-level + replies
    const topLevel = comments.filter((c) => !c.parentId);
    const repliesMap = new Map<string, Comment[]>();
    for (const c of comments) {
        if (c.parentId) {
            const arr = repliesMap.get(c.parentId) || [];
            arr.push(c);
            repliesMap.set(c.parentId, arr);
        }
    }

    // Filter: hide deleted comments with no replies
    const visibleTopLevel = topLevel.filter((c) => {
        if (!c.deleted) return true;
        const replies = repliesMap.get(c.id) || [];
        return replies.some((r) => !r.deleted);
    });

    const activeCount = comments.filter((c) => !c.deleted).length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimNick = nickname.trim();
        const trimContent = content.trim();
        const trimPass = password.trim();
        const trimEmail = email.trim();

        if (!trimNick || !trimContent || !trimPass) return;
        if (trimNick.length > 20 || trimContent.length > 1000) return;
        if (trimPass.length < 4 || trimPass.length > 20) return;

        if (Date.now() < cooldownUntil) {
            showToast(t('comments.cooldown'));
            return;
        }

        setSubmitting(true);
        try {
            const result = await addComment({
                postSlug,
                postType,
                nickname: trimNick,
                email: trimEmail || undefined,
                password: trimPass,
                content: trimContent,
            });
            const newComment: Comment = {
                id: result.id,
                postSlug,
                postType,
                parentId: null,
                nickname: trimNick,
                content: trimContent,
                createdAt: new Date().toISOString(),
                deleted: false,
            };
            setComments((prev) => [...prev, newComment]);
            setContent('');
            setCooldownUntil(Date.now() + COOLDOWN_MS);
            showToast(t('comments.writeSuccess'));
        } catch (err) {
            if (err instanceof Error && err.message === 'rate_limited') {
                showToast(t('comments.cooldown'));
            } else {
                showToast(t('comments.writeFail'));
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleReplySubmit = async (parentId: string) => {
        const trimContent = replyContent.trim();
        const trimNick = replyNickname.trim();
        const trimPass = replyPassword.trim();
        const trimEmail = replyEmail.trim();

        if (!trimNick || !trimContent || !trimPass) {
            showToast(t('comments.fillRequired'));
            return;
        }
        if (trimPass.length < 4 || trimPass.length > 20) return;

        if (Date.now() < cooldownUntil) {
            showToast(t('comments.cooldown'));
            return;
        }

        setSubmitting(true);
        try {
            const result = await addComment({
                postSlug,
                postType,
                parentId,
                nickname: trimNick,
                email: trimEmail || undefined,
                password: trimPass,
                content: trimContent,
            });
            const newReply: Comment = {
                id: result.id,
                postSlug,
                postType,
                parentId,
                nickname: trimNick,
                content: trimContent,
                createdAt: new Date().toISOString(),
                deleted: false,
            };
            setComments((prev) => [...prev, newReply]);
            setReplyContent('');
            setReplyTo(null);
            setCooldownUntil(Date.now() + COOLDOWN_MS);
            showToast(t('comments.writeSuccess'));
        } catch (err) {
            if (err instanceof Error && err.message === 'rate_limited') {
                showToast(t('comments.cooldown'));
            } else {
                showToast(t('comments.writeFail'));
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget || !deletePassword.trim()) return;
        setDeleting(true);
        try {
            const success = await deleteComment(deleteTarget, deletePassword.trim());
            if (success) {
                setComments((prev) =>
                    prev.map((c) => c.id === deleteTarget ? { ...c, deleted: true, content: '' } : c)
                );
                showToast(t('comments.deleteSuccess'));
            } else {
                showToast(t('comments.deleteFail'));
            }
        } catch {
            showToast(t('comments.deleteFail'));
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
            setDeletePassword('');
        }
    };

    const openReply = (id: string, nick: string) => {
        setReplyTo({ id, nickname: nick });
        setReplyContent('');
        setReplyNickname('');
        setReplyPassword('');
        setReplyEmail('');
        setTimeout(() => replyRef.current?.focus(), 100);
    };

    const formatDate = (iso: string | null) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '';
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
    };

    const renderComment = (c: Comment, isReply = false) => {
        if (c.deleted) {
            return (
                <div key={c.id} className={`comment-item${isReply ? ' comment-reply' : ''} comment-deleted`}>
                    <span className="comment-deleted-text">{t('comments.deleted')}</span>
                </div>
            );
        }
        return (
            <div key={c.id} className={`comment-item${isReply ? ' comment-reply' : ''}`}>
                <div className="comment-header">
                    <span className="comment-nickname">
                        {isReply && <span className="comment-reply-arrow">&#8627;</span>}
                        {c.nickname}
                    </span>
                    <span className="comment-date">{formatDate(c.createdAt)}</span>
                </div>
                <div className="comment-content">{c.content}</div>
                <div className="comment-actions">
                    {!isReply && (
                        <button
                            className="comment-action-btn"
                            onClick={() => openReply(c.id, c.nickname)}
                        >
                            {t('comments.reply')}
                        </button>
                    )}
                    <button
                        className="comment-action-btn comment-delete-btn"
                        onClick={() => { setDeleteTarget(c.id); setDeletePassword(''); }}
                    >
                        {t('comments.delete')}
                    </button>
                </div>

                {/* Inline reply form */}
                {replyTo?.id === c.id && (
                    <div className="comment-reply-form">
                        <div className="comment-reply-context">
                            @{replyTo.nickname}
                        </div>
                        <div className="comment-form-row">
                            <input
                                className="comment-input"
                                type="text"
                                placeholder={t('comments.nickname')}
                                value={replyNickname}
                                onChange={(e) => setReplyNickname(e.target.value)}
                                maxLength={20}
                            />
                            <input
                                className="comment-input"
                                type="text"
                                placeholder={t('comments.password')}
                                value={replyPassword}
                                onChange={(e) => setReplyPassword(e.target.value.slice(0, 20))}
                                maxLength={20}
                                autoComplete="off"
                            />
                        </div>
                        <input
                            className="comment-input comment-email-input"
                            type="email"
                            placeholder={t('comments.emailPlaceholder')}
                            value={replyEmail}
                            onChange={(e) => setReplyEmail(e.target.value)}
                        />
                        <textarea
                            ref={replyRef}
                            className="comment-textarea"
                            placeholder={t('comments.replyPlaceholder')}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            maxLength={1000}
                        />
                        <div className="comment-reply-actions">
                            <button
                                className="comment-cancel-btn"
                                onClick={() => setReplyTo(null)}
                            >
                                {t('comments.cancel')}
                            </button>
                            <button
                                className="comment-submit-btn"
                                onClick={() => handleReplySubmit(c.id)}
                                disabled={submitting || !replyContent.trim() || !replyNickname.trim() || replyPassword.trim().length < 4}
                            >
                                {submitting ? '...' : t('comments.submit')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (!loaded && loading) {
        return <div className="comments-section"><div className="comments-loading">{t('comments.loading')}</div></div>;
    }

    return (
        <div className="comments-section">
            <div className="comments-header">
                <span className="comments-title">
                    {t('comments.title')} {activeCount > 0 && <span className="comments-count">{activeCount}</span>}
                </span>
                <button className="comments-refresh-btn" onClick={loadComments} disabled={loading}>
                    {loading ? '...' : t('comments.refresh')}
                </button>
            </div>

            {/* Comment list */}
            <div className="comments-list">
                {visibleTopLevel.length === 0 && (
                    <div className="comments-empty">{t('comments.empty')}</div>
                )}
                {visibleTopLevel.map((c) => (
                    <div key={c.id} className="comment-thread">
                        {renderComment(c)}
                        {(repliesMap.get(c.id) || []).map((r) => renderComment(r, true))}
                    </div>
                ))}
            </div>

            {/* Write form */}
            <form className="comment-form" onSubmit={handleSubmit}>
                <div className="comment-form-row">
                    <input
                        className="comment-input"
                        type="text"
                        placeholder={t('comments.nickname')}
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        maxLength={20}
                    />
                    <input
                        className="comment-input"
                        type="password"
                        placeholder={t('comments.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value.slice(0, 20))}
                        maxLength={20}
                        autoComplete="off"
                    />
                </div>
                <input
                    className="comment-input comment-email-input"
                    type="email"
                    placeholder={t('comments.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <textarea
                    className="comment-textarea"
                    placeholder={t('comments.messagePlaceholder')}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={1000}
                />
                <div className="comment-form-bottom">
                    <span className="comment-form-hint">{t('comments.passwordHint')}</span>
                    <button
                        className={`comment-submit-btn${submitting ? ' loading' : ''}`}
                        type="submit"
                        disabled={submitting || !nickname.trim() || !content.trim() || password.trim().length < 4}
                    >
                        {submitting ? t('comments.submitting') : t('comments.submit')}
                    </button>
                </div>
            </form>

            {/* Delete modal */}
            {deleteTarget && (
                <div className="comment-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="comment-modal-title">{t('comments.deleteConfirm')}</div>
                        <input
                            className="comment-input"
                            type="password"
                            placeholder="****"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            autoFocus
                        />
                        <div className="comment-modal-actions">
                            <button className="comment-cancel-btn" onClick={() => setDeleteTarget(null)}>
                                {t('comments.cancel')}
                            </button>
                            <button
                                className="comment-submit-btn"
                                onClick={handleDelete}
                                disabled={deleting || !deletePassword.trim()}
                            >
                                {deleting ? '...' : t('comments.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && <div className="comment-toast">{toast}</div>}
        </div>
    );
};

export default Comments;
