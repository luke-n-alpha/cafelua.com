import { NextRequest, NextResponse } from 'next/server';
import {
    addComment,
    listCommentsForPost,
    readComment,
    softDeleteComment,
} from '@/lib/guest-store';
import { hashPassword, checkRateLimit, getClientIp } from '@/lib/server-utils';
import { sendEmail, buildReplyNotificationEmail, buildOwnerNotificationEmail, ownerAddress } from '@/lib/email';

const VALID_POST_TYPES = ['desk', 'diary'];
const SLUG_RE = /^[\w가-힣\-.]{1,200}$/;
const COMMENT_ID_RE = /^[a-zA-Z0-9]{10,30}$/;

/** GET /api/comments?slug=xxx&type=desk — load all comments for a post (max 200) */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const postType = searchParams.get('type');

        if (!slug || !postType || !VALID_POST_TYPES.includes(postType)) {
            return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
        }

        const records = await listCommentsForPost(slug, postType, 200);

        const comments = records.map((comment) => ({
            id: comment.id,
            postSlug: comment.postSlug,
            postType: comment.postType,
            parentId: comment.parentId,
            nickname: comment.nickname,
            content: comment.deleted ? '' : comment.content,
            createdAt: comment.createdAt?.toISOString() ?? null,
            deleted: comment.deleted,
        }));

        return NextResponse.json({ comments });
    } catch (err) {
        console.error('[comments GET]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

/** POST /api/comments — create a new comment or reply */
export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    if (!checkRateLimit(`comment:${ip}`, 3, 30_000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    try {
        const body = await request.json();
        const { postSlug, postType, parentId, nickname, email, password, content } = body as {
            postSlug?: string;
            postType?: string;
            parentId?: string | null;
            nickname?: string;
            email?: string;
            password?: string;
            content?: string;
        };

        const trimSlug = postSlug?.trim();
        const trimNick = nickname?.trim();
        const trimContent = content?.trim();
        const trimPass = password?.trim();
        const trimEmail = email?.trim() || null;

        if (!trimSlug || !SLUG_RE.test(trimSlug)) {
            return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
        }
        if (!postType || !VALID_POST_TYPES.includes(postType)) {
            return NextResponse.json({ error: 'Invalid post type' }, { status: 400 });
        }
        if (!trimNick || trimNick.length > 20) {
            return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 });
        }
        if (!trimContent || trimContent.length > 1000) {
            return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
        }
        if (!trimPass || trimPass.length < 4 || trimPass.length > 20) {
            return NextResponse.json({ error: 'Invalid password (4-20 chars)' }, { status: 400 });
        }
        if (trimEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }

        // If reply, verify parent exists and enforce 1-level nesting
        let parent = null;
        if (parentId) {
            if (!COMMENT_ID_RE.test(parentId)) {
                return NextResponse.json({ error: 'Invalid parentId' }, { status: 400 });
            }
            parent = await readComment(parentId);
            if (!parent || parent.deleted) {
                return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
            }
            if (parent.parentId) {
                return NextResponse.json({ error: 'Cannot reply to a reply' }, { status: 400 });
            }
        }

        const id = await addComment({
            postSlug: trimSlug,
            postType,
            nickname: trimNick,
            content: trimContent,
            passwordHash: hashPassword(trimPass),
            parentId: parentId || null,
            email: trimEmail,
        });

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cafelua.com';
        const postPath = postType === 'desk' ? `/desk/${trimSlug}` : `/gallery/diary/${trimSlug}`;
        const postUrl = `${baseUrl}/ko${postPath}`;
        const displayTitle = formatSlugAsTitle(trimSlug);

        // Send reply notification email (fire and forget)
        if (parent?.email) {
            const emailData = buildReplyNotificationEmail({
                parentNickname: parent.nickname,
                replyNickname: trimNick,
                replyContent: trimContent,
                postTitle: displayTitle,
                postUrl,
            });
            sendEmail({ to: parent.email, ...emailData }).catch(() => {});
        }

        // And the master's own copy, for every comment — not only replies.
        sendEmail({
            to: ownerAddress(),
            ...buildOwnerNotificationEmail({
                kind: 'comment',
                isReply: Boolean(parentId),
                nickname: trimNick,
                content: trimContent,
                where: `「${displayTitle}」`,
                url: postUrl,
            }),
        }).catch(() => {});

        return NextResponse.json({ id });
    } catch (err) {
        console.error('[comments POST]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

/** DELETE /api/comments — soft-delete a comment (owner password only) */
export async function DELETE(request: NextRequest) {
    const ip = getClientIp(request);
    if (!checkRateLimit(`comment-del:${ip}`, 10, 60_000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    try {
        const { id, password } = await request.json() as {
            id?: string;
            password?: string;
        };

        if (!id || !password || !COMMENT_ID_RE.test(id)) {
            return NextResponse.json({ error: 'Missing or invalid id/password' }, { status: 400 });
        }

        const comment = await readComment(id);
        if (!comment) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const pwHash = hashPassword(password);
        if (comment.passwordHash !== pwHash) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await softDeleteComment(id);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[comments DELETE]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

/** Remove date prefix and replace hyphens with spaces */
function formatSlugAsTitle(slug: string): string {
    return slug.replace(/^\d{8}-/, '').replace(/-/g, ' ');
}
