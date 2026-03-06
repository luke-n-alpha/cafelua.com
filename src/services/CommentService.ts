/**
 * Comment service — all operations go through server API routes.
 */

export interface Comment {
    id: string;
    postSlug: string;
    postType: 'desk' | 'diary';
    parentId: string | null;
    nickname: string;
    content: string;
    createdAt: string | null;
    deleted: boolean;
}

export async function getComments(
    slug: string,
    postType: 'desk' | 'diary',
): Promise<{ comments: Comment[] }> {
    const params = new URLSearchParams({ slug, type: postType });
    const res = await fetch(`/api/comments?${params}`);
    if (!res.ok) throw new Error('Failed to load comments');
    return res.json();
}

export async function addComment(data: {
    postSlug: string;
    postType: 'desk' | 'diary';
    parentId?: string | null;
    nickname: string;
    email?: string;
    password: string;
    content: string;
}): Promise<{ id: string }> {
    const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        if (res.status === 429) throw new Error('rate_limited');
        throw new Error('Failed to add comment');
    }
    return res.json();
}

export async function deleteComment(id: string, password: string): Promise<boolean> {
    const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
    });
    return res.ok;
}
