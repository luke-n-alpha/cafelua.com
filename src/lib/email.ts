/**
 * Email utility using Resend API.
 * If RESEND_API_KEY is not set, emails are silently skipped.
 */

const RESEND_API = 'https://api.resend.com/emails';

interface EmailPayload {
    to: string;
    subject: string;
    html: string;
}

function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.COMMENT_NOTIFY_FROM || 'Cafe Lua <noreply@cafelua.com>';

    if (!apiKey) {
        console.warn('[email] RESEND_API_KEY not set — skipping email');
        return false;
    }

    try {
        const res = await fetch(RESEND_API, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ from, to: [payload.to], subject: payload.subject, html: payload.html }),
        });
        if (!res.ok) {
            const body = await res.text();
            console.error('[email] Resend API error:', res.status, body);
            return false;
        }
        return true;
    } catch (err) {
        console.error('[email] send failed:', err);
        return false;
    }
}

/**
 * Where the master hears about anything new — a guestbook entry, a comment, a
 * reply. Set OWNER_NOTIFY_EMAIL to change it; the address below is the one
 * cafelua.com has always answered from.
 */
export function ownerAddress(): string {
    return process.env.OWNER_NOTIFY_EMAIL || 'luke.yang@cafelua.com';
}

/**
 * The master's copy. The visitor's own notification only goes out when someone
 * answers them; this one goes out whenever anything is written, so that a
 * message left at three in the morning is not found a week later.
 */
export function buildOwnerNotificationEmail(opts: {
    kind: 'guestbook' | 'comment';
    isReply: boolean;
    nickname: string;
    content: string;
    where: string;
    url: string;
}): { subject: string; html: string } {
    const nick = escapeHtml(opts.nickname);
    const where = escapeHtml(opts.where);
    const body = escapeHtml(opts.content).replace(/\n/g, '<br>');
    const noun = opts.kind === 'guestbook' ? '방명록' : '댓글';
    const act = opts.isReply ? '답글' : (opts.kind === 'guestbook' ? '글' : '댓글');
    const subject = `[Cafe Lua] ${opts.nickname}님이 ${noun}에 ${act}을 남겼습니다`;
    const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #8b6914; margin-bottom: 16px;">Cafe Lua - 새 ${noun} 알림</h2>
    <p><strong>${nick}</strong>님이 ${where}에 ${act}을 남겼습니다.</p>
    <blockquote style="border-left: 3px solid #d4a843; padding: 8px 12px; margin: 16px 0; background: #fdf8ec; color: #333;">
        ${body}
    </blockquote>
    <a href="${escapeHtml(opts.url)}" style="display: inline-block; padding: 8px 16px; background: #8b6914; color: #fff; text-decoration: none; border-radius: 4px;">보러 가기</a>
    <p style="margin-top: 24px; font-size: 12px; color: #999;">주인장에게만 가는 알림입니다.</p>
</div>`.trim();
    return { subject, html };
}

export function buildReplyNotificationEmail(opts: {
    parentNickname: string;
    replyNickname: string;
    replyContent: string;
    postTitle: string;
    postUrl: string;
}): { subject: string; html: string } {
    const parentNick = escapeHtml(opts.parentNickname);
    const replyNick = escapeHtml(opts.replyNickname);
    const postTitle = escapeHtml(opts.postTitle);
    const escapedContent = escapeHtml(opts.replyContent).replace(/\n/g, '<br>');
    const subject = `[Cafe Lua] ${opts.replyNickname}님이 회원님의 댓글에 답글을 남겼습니다`;
    const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #8b6914; margin-bottom: 16px;">Cafe Lua - 새 답글 알림</h2>
    <p>${parentNick}님, 안녕하세요.</p>
    <p><strong>${replyNick}</strong>님이 &ldquo;<a href="${escapeHtml(opts.postUrl)}">${postTitle}</a>&rdquo; 글의 회원님 댓글에 답글을 남겼습니다:</p>
    <blockquote style="border-left: 3px solid #d4a843; padding: 8px 12px; margin: 16px 0; background: #fdf8ec; color: #333;">
        ${escapedContent}
    </blockquote>
    <a href="${escapeHtml(opts.postUrl)}" style="display: inline-block; padding: 8px 16px; background: #8b6914; color: #fff; text-decoration: none; border-radius: 4px;">글 보러 가기</a>
    <p style="margin-top: 24px; font-size: 12px; color: #999;">이 메일은 댓글 작성 시 이메일을 입력하셨기 때문에 발송되었습니다.</p>
</div>`.trim();
    return { subject, html };
}

export function buildGuestbookReplyNotificationEmail(opts: {
    parentNickname: string;
    replyNickname: string;
    replyContent: string;
    guestbookUrl: string;
}): { subject: string; html: string } {
    const parentNick = escapeHtml(opts.parentNickname);
    const replyNick = escapeHtml(opts.replyNickname);
    const escapedContent = escapeHtml(opts.replyContent).replace(/\n/g, '<br>');
    const subject = `[Cafe Lua] ${opts.replyNickname}님이 방명록 글에 답글을 남겼습니다`;
    const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #8b6914; margin-bottom: 16px;">Cafe Lua - 방명록 답글 알림</h2>
    <p>${parentNick}님, 안녕하세요.</p>
    <p><strong>${replyNick}</strong>님이 방명록에 남기신 글에 답글을 남겼습니다:</p>
    <blockquote style="border-left: 3px solid #d4a843; padding: 8px 12px; margin: 16px 0; background: #fdf8ec; color: #333;">
        ${escapedContent}
    </blockquote>
    <a href="${escapeHtml(opts.guestbookUrl)}" style="display: inline-block; padding: 8px 16px; background: #8b6914; color: #fff; text-decoration: none; border-radius: 4px;">방명록 보러 가기</a>
    <p style="margin-top: 24px; font-size: 12px; color: #999;">이 메일은 방명록 작성 시 이메일을 입력하셨기 때문에 발송되었습니다.</p>
</div>`.trim();
    return { subject, html };
}
