import { promises as fs } from 'fs';
import path from 'path';
import {
    FALLBACK_DECK_SUMMARY,
    FALLBACK_SPREAD_GUIDE,
    getFallbackCardInterpretation,
    getFallbackCardMeta,
} from '@/data/tarot/fallbackCards';

const CARD_FOLDERS = [
    '00-the-fool', '01-the-magician', '02-the-high-priestess', '03-the-empress',
    '04-the-emperor', '05-the-hierophant', '06-the-lovers', '07-the-chariot',
    '08-strength', '09-the-hermit', '10-wheel-of-fortune', '11-justice',
    '12-the-hanged-man', '13-death', '14-temperance', '15-the-devil',
    '16-the-tower', '17-the-star', '18-the-moon', '19-the-sun',
    '20-judgement', '21-the-world',
];

export function getBasePath(): string {
    const cwd = process.cwd();
    if (cwd.endsWith('public-home')) {
        return path.join(cwd, '..', 'taro');
    }
    return path.join(cwd, 'taro');
}

export async function loadDeckSummary(): Promise<string> {
    try {
        const summaryPath = path.join(getBasePath(), 'deck-summary.md');
        return await fs.readFile(summaryPath, 'utf-8');
    } catch {
        return FALLBACK_DECK_SUMMARY;
    }
}

export async function loadSpreadGuide(): Promise<string> {
    try {
        const guidePath = path.join(getBasePath(), 'spread-guide.md');
        return await fs.readFile(guidePath, 'utf-8');
    } catch {
        return FALLBACK_SPREAD_GUIDE;
    }
}

export async function loadCardMeta(cardId: number): Promise<any | null> {
    try {
        const folder = CARD_FOLDERS[cardId];
        if (!folder) return null;
        const metaPath = path.join(getBasePath(), 'cards', folder, 'meta.json');
        const content = await fs.readFile(metaPath, 'utf-8');
        return JSON.parse(content);
    } catch {
        return getFallbackCardMeta(cardId);
    }
}

export async function loadCardInterpretation(cardId: number): Promise<string> {
    try {
        const folder = CARD_FOLDERS[cardId];
        if (!folder) return '';
        const mdPath = path.join(getBasePath(), 'cards', folder, 'interpretation.md');
        return await fs.readFile(mdPath, 'utf-8');
    } catch {
        return getFallbackCardInterpretation(cardId);
    }
}
