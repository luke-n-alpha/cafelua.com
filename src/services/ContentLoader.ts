import contentIndex from '../data/content-index.json';

export interface ContentItem {
    id: string;
    title: string;
    date: string;
    type: 'post' | 'blog' | 'novel' | 'profile';
    category: string;
    path: string;
    series?: string;
    part?: number;
    chapter?: number;
    episode?: number;
    chapterTitle?: string;
    images?: string[];
}

export const ContentLoader = {
    getAll: (): ContentItem[] => {
        return contentIndex as ContentItem[];
    },

    getByType: (type: string): ContentItem[] => {
        return (contentIndex as ContentItem[]).filter(item => item.type === type);
    },

    getByCategory: (category: string): ContentItem[] => {
        return (contentIndex as ContentItem[]).filter(item => item.category === category);
    },

    getRecent: (limit: number = 5): ContentItem[] => {
        return (contentIndex as ContentItem[])
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit);
    },

    getNovels: (): ContentItem[] => {
        return (contentIndex as ContentItem[])
            .filter(item => item.type === 'novel')
            .sort((a, b) => a.title.localeCompare(b.title)); // Sort by title for novels
    }
};
