export interface GuestbookEntry {
    id: string;
    nickname: string;
    message: string;
    isSecret: boolean;
    createdAt: string | null;
}
