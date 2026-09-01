export interface GuestbookEntry {
    id: string;
    nickname: string;
    message: string;
    isSecret: boolean;
    createdAt: string | null;
    parentId: string | null;
    deleted: boolean;
    /** Written by the master, verified server-side against the admin credentials. */
    isOwner?: boolean;
}
