'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import UnderConstruction from './UnderConstruction';
import { getEntries, addEntry, deleteEntry, adminDeleteEntry, getSecretMessages } from '@/services/GuestbookService';
import type { GuestbookEntry } from '@/data/gallery/guestbookData';
import { resolveEnvironmentBackgroundSrc, type Season, type TimeOfDay, type Weather } from '@/lib/environmentBackgrounds';
import './GuestbookPage.css';

const PAGE_SIZE = 20;
const COOLDOWN_MS = 30_000;

const GuestbookPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const season = (searchParams.get('season') || 'spring') as Season;
    const time = (searchParams.get('time') || 'day') as TimeOfDay;
    const weather = (searchParams.get('weather') || 'sunny') as Weather;
    const isChristmas = searchParams.get('christmas') === 'true';
    const backgroundImage = useMemo(() => {
        return resolveEnvironmentBackgroundSrc('guestbook', season, time, weather, isChristmas);
    }, [season, time, weather, isChristmas]);

    const [showGreeting, setShowGreeting] = useState(true);
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [lastCursor, setLastCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // Form state
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSecret, setIsSecret] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [cooldownUntil, setCooldownUntil] = useState(0);

    const messageRef = useRef<HTMLTextAreaElement>(null);

    // Reply state
    const [replyTo, setReplyTo] = useState<{ id: string; nickname: string } | null>(null);
    const [replyNickname, setReplyNickname] = useState('');
    const [replyPassword, setReplyPassword] = useState('');
    const [replyEmail, setReplyEmail] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const replyRef = useRef<HTMLTextAreaElement>(null);

    // Secret view state
    const [showSecretModal, setShowSecretModal] = useState(false);
    const [secretNickname, setSecretNickname] = useState('');
    const [secretPassword, setSecretPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminCredentials, setAdminCredentials] = useState<{ nickname: string; password: string } | null>(null);
    const [revealedSecrets, setRevealedSecrets] = useState<Record<string, string>>({});
    const [verifying, setVerifying] = useState(false);

    // Delete modal
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleteStep, setDeleteStep] = useState<'confirm' | 'password'>('confirm');

    // Toast
    const [toast, setToast] = useState<string | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const showToast = useCallback((msg: string) => {
        setToast(msg);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3000);
    }, []);

    // Load entries
    const loadEntries = useCallback(async (append = false, cursor?: string | null) => {
        setLoading(true);
        try {
            const result = await getEntries(PAGE_SIZE, cursor);
            if (append) {
                setEntries((prev) => [...prev, ...result.entries]);
            } else {
                setEntries(result.entries);
            }
            setLastCursor(result.lastCursor);
            setHasMore(result.entries.length === PAGE_SIZE);
        } catch (err) {
            console.error('[Guestbook] loadEntries error:', err);
            showToast('Failed to load entries.');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // Initial load when greeting is dismissed
    useEffect(() => {
        if (!showGreeting) {
            loadEntries();
        }
    }, [showGreeting, loadEntries]);

    const handleLoadMore = () => {
        if (lastCursor && !loading) {
            loadEntries(true, lastCursor);
        }
    };

    // Group entries: top-level + replies
    const topLevel = entries.filter((e) => !e.parentId);
    const repliesMap = new Map<string, GuestbookEntry[]>();
    for (const e of entries) {
        if (e.parentId) {
            const arr = repliesMap.get(e.parentId) || [];
            arr.push(e);
            repliesMap.set(e.parentId, arr);
        }
    }

    // Filter: hide deleted entries with no replies
    const visibleTopLevel = topLevel.filter((e) => {
        if (!e.deleted) return true;
        const replies = repliesMap.get(e.id) || [];
        return replies.some((r) => !r.deleted);
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimNickname = nickname.trim();
        const trimMessage = message.trim();
        const trimPassword = password.trim();
        const trimEmail = email.trim();

        if (!trimNickname || !trimMessage || !trimPassword) return;
        if (trimNickname.length > 20 || trimMessage.length > 500) return;
        if (trimPassword.length < 6 || trimPassword.length > 20) return;

        if (Date.now() < cooldownUntil) {
            showToast(t('guestbook.cooldown'));
            return;
        }

        setSubmitting(true);
        try {
            const result = await Promise.race([
                addEntry(trimNickname, trimMessage, trimPassword, isSecret, null, trimEmail || undefined),
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000)),
            ]);
            const newEntry: GuestbookEntry = {
                id: result.id,
                nickname: trimNickname,
                message: isSecret ? '' : trimMessage,
                isSecret,
                createdAt: new Date().toISOString(),
                parentId: null,
                deleted: false,
            };
            setEntries((prev) => [newEntry, ...prev]);
            // If it's a secret message, reveal it immediately for the author
            if (isSecret) {
                setRevealedSecrets((prev) => ({ ...prev, [result.id]: trimMessage }));
            }
            setMessage('');
            setCooldownUntil(Date.now() + COOLDOWN_MS);
            showToast(t('guestbook.writeSuccess'));
            messageRef.current?.focus();
        } catch (err) {
            console.error('[Guestbook] addEntry error:', err);
            if (err instanceof Error && err.message === 'rate_limited') {
                showToast(t('guestbook.cooldown'));
            } else {
                showToast('Failed to submit.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleReplySubmit = async (parentId: string) => {
        const trimNick = replyNickname.trim();
        const trimMsg = replyMessage.trim();
        const trimPass = replyPassword.trim();
        const trimEmail = replyEmail.trim();

        if (!trimNick || !trimMsg || !trimPass) {
            showToast(t('comments.fillRequired'));
            return;
        }
        if (trimPass.length < 6 || trimPass.length > 20) return;

        if (Date.now() < cooldownUntil) {
            showToast(t('guestbook.cooldown'));
            return;
        }

        setSubmitting(true);
        try {
            const result = await addEntry(trimNick, trimMsg, trimPass, false, parentId, trimEmail || undefined);
            const newReply: GuestbookEntry = {
                id: result.id,
                nickname: trimNick,
                message: trimMsg,
                isSecret: false,
                createdAt: new Date().toISOString(),
                parentId,
                deleted: false,
            };
            setEntries((prev) => [...prev, newReply]);
            setReplyMessage('');
            setReplyTo(null);
            setCooldownUntil(Date.now() + COOLDOWN_MS);
            showToast(t('guestbook.writeSuccess'));
        } catch (err) {
            console.error('[Guestbook] reply error:', err);
            if (err instanceof Error && err.message === 'rate_limited') {
                showToast(t('guestbook.cooldown'));
            } else {
                showToast('Failed to submit.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const openReply = (id: string, nick: string) => {
        setReplyTo({ id, nickname: nick });
        setReplyMessage('');
        setReplyNickname('');
        setReplyPassword('');
        setReplyEmail('');
        setTimeout(() => replyRef.current?.focus(), 100);
    };

    // --- Secret view ---

    const handleSecretLookup = async () => {
        const trimNick = secretNickname.trim();
        const trimPass = secretPassword.trim();
        if (!trimNick || !trimPass) return;

        setVerifying(true);
        try {
            const result = await getSecretMessages(trimNick, trimPass);

            if (result.isAdmin) {
                setIsAdmin(true);
                setAdminCredentials({ nickname: trimNick, password: trimPass });
            } else {
                setIsAdmin(false);
                setAdminCredentials(null);
            }

            setRevealedSecrets(result.secrets);
            setShowSecretModal(false);

            if (result.isAdmin) {
                showToast(t('guestbook.adminMode'));
            } else if (Object.keys(result.secrets).length > 0) {
                showToast(t('guestbook.viewSecretSuccess'));
            } else {
                showToast(t('guestbook.viewSecretFail'));
            }
        } catch {
            showToast(t('guestbook.viewSecretFail'));
        } finally {
            setVerifying(false);
        }
    };

    const handleExitSecretView = () => {
        setRevealedSecrets({});
        setIsAdmin(false);
        setAdminCredentials(null);
    };

    const canViewSecret = (entry: GuestbookEntry) => {
        if (!entry.isSecret) return true;
        return entry.id in revealedSecrets;
    };

    // --- Delete ---

    const handleDeleteRequest = (id: string) => {
        setDeleteTarget(id);
        setDeletePassword('');
        setDeleteStep(isAdmin ? 'confirm' : 'password');
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;

        if (isAdmin && adminCredentials && deleteStep === 'confirm') {
            setDeleting(true);
            try {
                const result = await adminDeleteEntry(
                    deleteTarget,
                    adminCredentials.nickname,
                    adminCredentials.password
                );
                if (result.success) {
                    showToast(t('guestbook.deleteSuccess'));
                    if (result.softDeleted) {
                        setEntries((prev) =>
                            prev.map((e) => e.id === deleteTarget ? { ...e, deleted: true, message: '' } : e)
                        );
                    } else {
                        setEntries((prev) => prev.filter((e) => e.id !== deleteTarget));
                    }
                    setRevealedSecrets((prev) => {
                        const next = { ...prev };
                        delete next[deleteTarget];
                        return next;
                    });
                } else {
                    showToast(t('guestbook.deleteFail'));
                }
            } catch {
                showToast(t('guestbook.deleteFail'));
            } finally {
                setDeleting(false);
                setDeleteTarget(null);
            }
            return;
        }

        if (!deletePassword.trim()) return;
        setDeleting(true);
        try {
            const result = await deleteEntry(deleteTarget, deletePassword.trim());
            if (result.success) {
                showToast(t('guestbook.deleteSuccess'));
                if (result.softDeleted) {
                    setEntries((prev) =>
                        prev.map((e) => e.id === deleteTarget ? { ...e, deleted: true, message: '' } : e)
                    );
                } else {
                    setEntries((prev) => prev.filter((e) => e.id !== deleteTarget));
                }
            } else {
                showToast(t('guestbook.deleteFail'));
            }
        } catch {
            showToast(t('guestbook.deleteFail'));
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
            setDeletePassword('');
        }
    };

    const handleBack = () => {
        const query = searchParams.toString();
        router.push(query ? `/${i18n.language}/lounge?${query}` : `/${i18n.language}/lounge`);
    };

    const formatDate = (entry: GuestbookEntry) => {
        if (!entry.createdAt) return '';
        const d = new Date(entry.createdAt);
        if (isNaN(d.getTime())) return '';
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
    };

    const renderEntry = (entry: GuestbookEntry, isReply = false) => {
        if (entry.deleted) {
            return (
                <div key={entry.id} className={`guestbook-entry${isReply ? ' guestbook-reply' : ''} guestbook-entry-deleted`}>
                    <span className="guestbook-deleted-text">{t('comments.deleted')}</span>
                </div>
            );
        }

        // Hide secret entries that aren't revealed
        if (entry.isSecret && !canViewSecret(entry)) return null;

        return (
            <div key={entry.id} className={`guestbook-entry${entry.isSecret ? ' secret' : ''}${isReply ? ' guestbook-reply' : ''}`}>
                <div className="guestbook-entry-header">
                    <span className="guestbook-entry-nickname">
                        {isReply && <span className="guestbook-reply-arrow">&#8627;</span>}
                        {entry.isSecret && <span className="guestbook-secret-badge">{t('guestbook.secret')}</span>}
                        {entry.nickname}
                    </span>
                    <span className="guestbook-entry-date">{formatDate(entry)}</span>
                </div>
                <div className="guestbook-entry-message">
                    {entry.isSecret ? (revealedSecrets[entry.id] ?? '') : entry.message}
                </div>
                <div className="guestbook-entry-footer">
                    {!isReply && (
                        <button
                            className="guestbook-reply-btn"
                            onClick={() => openReply(entry.id, entry.nickname)}
                        >
                            {t('comments.reply')}
                        </button>
                    )}
                    <button
                        className="guestbook-delete-btn"
                        onClick={() => handleDeleteRequest(entry.id)}
                    >
                        {t('guestbook.delete')}
                    </button>
                </div>

                {/* Inline reply form */}
                {replyTo?.id === entry.id && (
                    <div className="guestbook-reply-form">
                        <div className="guestbook-reply-context">
                            @{replyTo.nickname}
                        </div>
                        <div className="guestbook-form-row">
                            <input
                                className="guestbook-input nickname"
                                type="text"
                                placeholder={t('guestbook.nickname')}
                                value={replyNickname}
                                onChange={(e) => setReplyNickname(e.target.value)}
                                maxLength={20}
                            />
                            <input
                                className="guestbook-input password"
                                type="password"
                                placeholder={t('guestbook.password')}
                                value={replyPassword}
                                onChange={(e) => setReplyPassword(e.target.value.slice(0, 20))}
                                maxLength={20}
                                autoComplete="off"
                            />
                        </div>
                        <input
                            className="guestbook-input"
                            type="email"
                            placeholder={t('comments.emailPlaceholder')}
                            value={replyEmail}
                            onChange={(e) => setReplyEmail(e.target.value)}
                            style={{ width: '100%' }}
                        />
                        <textarea
                            ref={replyRef}
                            className="guestbook-textarea"
                            placeholder={t('comments.replyPlaceholder')}
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            maxLength={500}
                        />
                        <div className="guestbook-reply-actions">
                            <button
                                className="guestbook-modal-cancel"
                                onClick={() => setReplyTo(null)}
                            >
                                {t('comments.cancel')}
                            </button>
                            <button
                                className="guestbook-submit-btn"
                                onClick={() => handleReplySubmit(entry.id)}
                                disabled={submitting || !replyMessage.trim() || !replyNickname.trim() || replyPassword.trim().length < 6}
                            >
                                {submitting ? '...' : t('guestbook.submit')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Greeting screen
    if (showGreeting) {
        return (
            <div className="guestbook-container" style={{ backgroundImage: `url('${backgroundImage}')` }}>
                <UnderConstruction
                    onClose={() => setShowGreeting(false)}
                    message={t('guestbook.greeting')}
                    backgroundSrc={backgroundImage}
                    illustrationSrc={backgroundImage}
                    characterSrc="/characters/alpha/alpha-nice-talk.webp"
                    closeLabel={t('guestbook.enter')}
                />
            </div>
        );
    }

    return (
        <div className="guestbook-container" style={{ backgroundImage: `url('${backgroundImage}')` }}>
            <div className="guestbook-panel">
                <div className="guestbook-header-row">
                    <div className="guestbook-title">{t('guestbook.title')}</div>
                    {(Object.keys(revealedSecrets).length > 0 || isAdmin) ? (
                        <button className="guestbook-secret-exit-btn" onClick={handleExitSecretView}>
                            {isAdmin && <span className="guestbook-admin-badge">ADMIN</span>}
                            {t('guestbook.exitSecret')}
                        </button>
                    ) : (
                        <button className="guestbook-secret-view-btn" onClick={() => setShowSecretModal(true)}>
                            {t('guestbook.viewSecret')}
                        </button>
                    )}
                </div>

                {/* Entry list */}
                <div className="guestbook-entries">
                    {visibleTopLevel.length === 0 && !loading && (
                        <div className="guestbook-empty">{t('guestbook.empty')}</div>
                    )}
                    {visibleTopLevel.map((entry) => (
                        <div key={entry.id} className="guestbook-thread">
                            {renderEntry(entry)}
                            {(repliesMap.get(entry.id) || []).map((r) => renderEntry(r, true))}
                        </div>
                    ))}
                    {hasMore && entries.length > 0 && (
                        <button
                            className="guestbook-load-more"
                            onClick={handleLoadMore}
                            disabled={loading}
                        >
                            {loading ? '...' : t('guestbook.loadMore')}
                        </button>
                    )}
                </div>

                {/* Write form */}
                <form className="guestbook-form" onSubmit={handleSubmit}>
                    <div className="guestbook-form-row">
                        <input
                            className="guestbook-input nickname"
                            type="text"
                            placeholder={t('guestbook.nickname')}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            maxLength={20}
                        />
                        <input
                            className="guestbook-input password"
                            type="password"
                            placeholder={t('guestbook.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value.slice(0, 20))}
                            maxLength={20}
                            autoComplete="off"
                        />
                    </div>
                    <input
                        className="guestbook-input"
                        type="email"
                        placeholder={t('comments.emailPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    <textarea
                        ref={messageRef}
                        className="guestbook-textarea"
                        placeholder={t('guestbook.message')}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={500}
                    />
                    <div className="guestbook-form-bottom">
                        <label className="guestbook-secret-toggle">
                            <input
                                type="checkbox"
                                checked={isSecret}
                                onChange={(e) => setIsSecret(e.target.checked)}
                            />
                            {t('guestbook.secret')}
                        </label>
                        <button
                            className={`guestbook-submit-btn${submitting ? ' loading' : ''}`}
                            type="submit"
                            disabled={submitting || !nickname.trim() || !message.trim() || password.trim().length < 6}
                        >
                            {submitting ? t('guestbook.submitting') : t('guestbook.submit')}
                        </button>
                    </div>
                </form>

                {/* Back to lounge */}
                <button className="guestbook-back" onClick={handleBack}>
                    {t('guestbook.backToLounge')}
                </button>
            </div>

            {/* Secret view modal */}
            {showSecretModal && (
                <div className="guestbook-modal-overlay" onClick={() => setShowSecretModal(false)}>
                    <div className="guestbook-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="guestbook-modal-title">{t('guestbook.viewSecretTitle')}</div>
                        <input
                            className="guestbook-input"
                            type="text"
                            placeholder={t('guestbook.viewSecretNickname')}
                            value={secretNickname}
                            onChange={(e) => setSecretNickname(e.target.value)}
                            autoFocus
                        />
                        <input
                            className="guestbook-input secret-password-input"
                            type="text"
                            placeholder={t('guestbook.viewSecretPassword')}
                            value={secretPassword}
                            onChange={(e) => setSecretPassword(e.target.value)}
                        />
                        <div className="guestbook-modal-actions">
                            <button
                                className="guestbook-modal-cancel"
                                onClick={() => setShowSecretModal(false)}
                            >
                                {t('about.close')}
                            </button>
                            <button
                                className="guestbook-modal-confirm guestbook-modal-lookup"
                                onClick={handleSecretLookup}
                                disabled={verifying || !secretNickname.trim() || !secretPassword.trim()}
                            >
                                {verifying ? '...' : t('guestbook.lookup')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm modal */}
            {deleteTarget && (
                <div className="guestbook-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="guestbook-modal" onClick={(e) => e.stopPropagation()}>
                        {deleteStep === 'confirm' ? (
                            <>
                                <div className="guestbook-modal-title">{t('guestbook.deleteReallyConfirm')}</div>
                                <div className="guestbook-modal-actions">
                                    <button
                                        className="guestbook-modal-cancel"
                                        onClick={() => setDeleteTarget(null)}
                                    >
                                        {t('about.close')}
                                    </button>
                                    <button
                                        className="guestbook-modal-confirm"
                                        onClick={handleDeleteConfirm}
                                        disabled={deleting}
                                    >
                                        {deleting ? '...' : t('guestbook.delete')}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="guestbook-modal-title">{t('guestbook.deleteConfirm')}</div>
                                <input
                                    className="guestbook-input"
                                    type="password"
                                    placeholder="****"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    autoFocus
                                />
                                <div className="guestbook-modal-actions">
                                    <button
                                        className="guestbook-modal-cancel"
                                        onClick={() => setDeleteTarget(null)}
                                    >
                                        {t('about.close')}
                                    </button>
                                    <button
                                        className="guestbook-modal-confirm"
                                        onClick={handleDeleteConfirm}
                                        disabled={deleting || !deletePassword.trim()}
                                    >
                                        {deleting ? '...' : t('guestbook.delete')}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && <div className="guestbook-toast">{toast}</div>}
        </div>
    );
};

export default GuestbookPage;
