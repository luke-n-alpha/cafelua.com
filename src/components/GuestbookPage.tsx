'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import UnderConstruction from './UnderConstruction';
import { getEntries, addEntry, deleteEntry, adminDeleteEntry, getSecretMessages } from '@/services/GuestbookService';
import type { GuestbookEntry } from '@/data/gallery/guestbookData';
import './GuestbookPage.css';

const PAGE_SIZE = 20;
const COOLDOWN_MS = 30_000;

const GuestbookPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [showGreeting, setShowGreeting] = useState(true);
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [lastCursor, setLastCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // Form state
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSecret, setIsSecret] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [cooldownUntil, setCooldownUntil] = useState(0);

    const messageRef = useRef<HTMLTextAreaElement>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimNickname = nickname.trim();
        const trimMessage = message.trim();
        const trimPassword = password.trim();

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
                addEntry(trimNickname, trimMessage, trimPassword, isSecret),
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000)),
            ]);
            const newEntry: GuestbookEntry = {
                id: result.id,
                nickname: trimNickname,
                message: isSecret ? '' : trimMessage,
                isSecret,
                createdAt: new Date().toISOString(),
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
                const success = await adminDeleteEntry(
                    deleteTarget,
                    adminCredentials.nickname,
                    adminCredentials.password
                );
                if (success) {
                    showToast(t('guestbook.deleteSuccess'));
                    setEntries((prev) => prev.filter((e) => e.id !== deleteTarget));
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
            const success = await deleteEntry(deleteTarget, deletePassword.trim());
            if (success) {
                showToast(t('guestbook.deleteSuccess'));
                setEntries((prev) => prev.filter((e) => e.id !== deleteTarget));
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

    // Greeting screen
    if (showGreeting) {
        return (
            <div className="guestbook-container" style={{ backgroundImage: "url('/guestbook-background-img/guestbook-scene.webp')" }}>
                <UnderConstruction
                    onClose={() => setShowGreeting(false)}
                    message={t('guestbook.greeting')}
                    backgroundSrc="/guestbook-background-img/guestbook-scene.webp"
                    illustrationSrc="/guestbook-background-img/guestbook-scene.webp"
                    characterSrc="/characters/alpha/alpha-nice-talk.webp"
                    closeLabel={t('guestbook.enter')}
                />
            </div>
        );
    }

    const visibleEntries = entries.filter((entry) => !entry.isSecret || canViewSecret(entry));

    return (
        <div className="guestbook-container" style={{ backgroundImage: "url('/guestbook-background-img/guestbook-scene.webp')" }}>
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
                    {visibleEntries.length === 0 && !loading && (
                        <div className="guestbook-empty">{t('guestbook.empty')}</div>
                    )}
                    {visibleEntries.map((entry) => (
                        <div key={entry.id} className={`guestbook-entry${entry.isSecret ? ' secret' : ''}`}>
                            <div className="guestbook-entry-header">
                                <span className="guestbook-entry-nickname">
                                    {entry.isSecret && <span className="guestbook-secret-badge">{t('guestbook.secret')}</span>}
                                    {entry.nickname}
                                </span>
                                <span className="guestbook-entry-date">{formatDate(entry)}</span>
                            </div>
                            <div className="guestbook-entry-message">
                                {entry.isSecret ? (revealedSecrets[entry.id] ?? '') : entry.message}
                            </div>
                            <div className="guestbook-entry-footer">
                                <button
                                    className="guestbook-delete-btn"
                                    onClick={() => handleDeleteRequest(entry.id)}
                                >
                                    {t('guestbook.delete')}
                                </button>
                            </div>
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
                            type="text"
                            placeholder={t('guestbook.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value.slice(0, 20))}
                            maxLength={20}
                            autoComplete="off"
                        />
                    </div>
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
