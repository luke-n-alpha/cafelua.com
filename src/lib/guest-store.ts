/**
 * Where the guestbook and the post comments live.
 *
 * Server-side only — never import this from a client component.
 *
 * These used to sit in Firestore. The site itself runs on Azure, and keeping
 * one collection in another cloud meant the credentials lived in two places;
 * when the move to Azure happened only the app came across and the guestbook
 * went quiet behind an HTTP 200. So they were brought over to Azure Table
 * Storage, which the rest of the site's infrastructure already sits beside.
 *
 * Both tables use a single partition and hold the document id as the row key.
 * That is a deliberate trade. Table Storage sorts by row key inside a
 * partition, so a timestamp row key would give free ordering — but then a
 * lookup by id, which is all the delete and reply paths ever have, would turn
 * into a scan. A guestbook is small: this way every lookup by id is a point
 * read, and the ordering is done here in memory. If either table ever grows
 * past a few thousand rows, that is the line to revisit.
 */

import { TableClient, odata, type TableEntity } from '@azure/data-tables';
import { flag, moment, newId, optional, text, withoutEmpty } from './table-rows';

export { newId, withoutEmpty } from './table-rows';

const GUESTBOOK_TABLE = 'guestbook';
const COMMENTS_TABLE = 'comments';

export const GUESTBOOK_PARTITION = 'guestbook';
export const COMMENT_PARTITION = 'comment';

function connectionString(): string {
    const value = process.env.CAFELUA_TABLES_CONNECTION;
    if (!value) {
        throw new Error(
            'Azure Table Storage credentials missing. Set CAFELUA_TABLES_CONNECTION in .env'
        );
    }
    return value;
}

const clients = new Map<string, TableClient>();

function tableClient(name: string): TableClient {
    const existing = clients.get(name);
    if (existing) return existing;
    const client = TableClient.fromConnectionString(connectionString(), name);
    clients.set(name, client);
    return client;
}

export const guestbookTable = () => tableClient(GUESTBOOK_TABLE);
export const commentsTable = () => tableClient(COMMENTS_TABLE);

/* ─── Records ─── */

export type GuestbookRecord = {
    id: string;
    nickname: string;
    message: string;
    passwordHash: string;
    isSecret: boolean;
    parentId: string | null;
    email: string | null;
    createdAt: Date | null;
    deleted: boolean;
    isOwner: boolean;
};

export type CommentRecord = {
    id: string;
    postSlug: string;
    postType: string;
    nickname: string;
    content: string;
    passwordHash: string;
    parentId: string | null;
    email: string | null;
    createdAt: Date | null;
    deleted: boolean;
    isOwner: boolean;
};

type Row = TableEntity<Record<string, unknown>>;

function toGuestbook(row: Row): GuestbookRecord {
    return {
        id: String(row.rowKey),
        nickname: text(row.nickname),
        message: text(row.message),
        passwordHash: text(row.passwordHash),
        isSecret: flag(row.isSecret),
        parentId: optional(row.parentId),
        email: optional(row.email),
        createdAt: moment(row.createdAt),
        deleted: flag(row.deleted),
        isOwner: flag(row.isOwner),
    };
}

function toComment(row: Row): CommentRecord {
    return {
        id: String(row.rowKey),
        postSlug: text(row.postSlug),
        postType: text(row.postType),
        nickname: text(row.nickname),
        content: text(row.content),
        passwordHash: text(row.passwordHash),
        parentId: optional(row.parentId),
        email: optional(row.email),
        createdAt: moment(row.createdAt),
        deleted: flag(row.deleted),
        isOwner: flag(row.isOwner),
    };
}

async function collect<T>(
    client: TableClient,
    filter: string | undefined,
    map: (row: Row) => T,
): Promise<T[]> {
    const out: T[] = [];
    const pages = client.listEntities<Record<string, unknown>>(
        filter ? { queryOptions: { filter } } : undefined,
    );
    for await (const row of pages) out.push(map(row as Row));
    return out;
}

const newestFirst = (a: { createdAt: Date | null }, b: { createdAt: Date | null }) =>
    (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0);

const oldestFirst = (a: { createdAt: Date | null }, b: { createdAt: Date | null }) =>
    (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0);

/* ─── Guestbook ─── */

export async function readGuestbookEntry(id: string): Promise<GuestbookRecord | null> {
    try {
        const row = await guestbookTable().getEntity<Record<string, unknown>>(GUESTBOOK_PARTITION, id);
        return toGuestbook(row as Row);
    } catch (err) {
        if ((err as { statusCode?: number }).statusCode === 404) return null;
        throw err;
    }
}

/**
 * Newest first. `after` is the createdAt of the last entry already shown, so
 * the caller walks backwards through time the way the old cursor did.
 */
export async function listGuestbookEntries(
    limit: number,
    after: Date | null,
): Promise<GuestbookRecord[]> {
    const all = await collect(guestbookTable(), undefined, toGuestbook);
    const ordered = all.sort(newestFirst);
    const from = after
        ? ordered.filter((entry) => (entry.createdAt?.getTime() ?? 0) < after.getTime())
        : ordered;
    return from.slice(0, limit);
}

export async function guestbookEntryHasReplies(id: string): Promise<boolean> {
    const client = guestbookTable();
    const pages = client.listEntities<Record<string, unknown>>({
        queryOptions: { filter: odata`PartitionKey eq ${GUESTBOOK_PARTITION} and parentId eq ${id}` },
    });
    for await (const _row of pages) return true;
    return false;
}

export async function listSecretGuestbookEntries(): Promise<GuestbookRecord[]> {
    return collect(
        guestbookTable(),
        odata`PartitionKey eq ${GUESTBOOK_PARTITION} and isSecret eq ${true}`,
        toGuestbook,
    );
}

export async function addGuestbookEntry(entry: {
    nickname: string;
    message: string;
    passwordHash: string;
    isSecret: boolean;
    parentId: string | null;
    email: string | null;
    isOwner: boolean;
}): Promise<string> {
    const id = newId();
    await guestbookTable().createEntity(
        withoutEmpty({
            partitionKey: GUESTBOOK_PARTITION,
            rowKey: id,
            ...entry,
            createdAt: new Date(),
            deleted: false,
        }) as TableEntity,
    );
    return id;
}

export async function softDeleteGuestbookEntry(id: string): Promise<void> {
    await guestbookTable().updateEntity(
        { partitionKey: GUESTBOOK_PARTITION, rowKey: id, deleted: true, message: '' },
        'Merge',
    );
}

export async function deleteGuestbookEntry(id: string): Promise<void> {
    await guestbookTable().deleteEntity(GUESTBOOK_PARTITION, id);
}

/* ─── Comments ─── */

export async function readComment(id: string): Promise<CommentRecord | null> {
    try {
        const row = await commentsTable().getEntity<Record<string, unknown>>(COMMENT_PARTITION, id);
        return toComment(row as Row);
    } catch (err) {
        if ((err as { statusCode?: number }).statusCode === 404) return null;
        throw err;
    }
}

/** Oldest first, the order a comment thread is read in. */
export async function listCommentsForPost(
    slug: string,
    postType: string,
    limit: number,
): Promise<CommentRecord[]> {
    const rows = await collect(
        commentsTable(),
        odata`PartitionKey eq ${COMMENT_PARTITION} and postSlug eq ${slug} and postType eq ${postType}`,
        toComment,
    );
    return rows.sort(oldestFirst).slice(0, limit);
}

/** Every post's comments together, newest first — what the timeline reads. */
export async function listRecentComments(limit: number): Promise<CommentRecord[]> {
    const rows = await collect(
        commentsTable(),
        odata`PartitionKey eq ${COMMENT_PARTITION}`,
        toComment,
    );
    return rows.sort(newestFirst).slice(0, limit);
}

export async function addComment(comment: {
    postSlug: string;
    postType: string;
    nickname: string;
    content: string;
    passwordHash: string;
    parentId: string | null;
    email: string | null;
    isOwner: boolean;
}): Promise<string> {
    const id = newId();
    await commentsTable().createEntity(
        withoutEmpty({
            partitionKey: COMMENT_PARTITION,
            rowKey: id,
            ...comment,
            createdAt: new Date(),
            deleted: false,
        }) as TableEntity,
    );
    return id;
}

export async function softDeleteComment(id: string): Promise<void> {
    await commentsTable().updateEntity(
        { partitionKey: COMMENT_PARTITION, rowKey: id, deleted: true, content: '' },
        'Merge',
    );
}
