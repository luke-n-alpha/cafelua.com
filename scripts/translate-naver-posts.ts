/**
 * Translate Naver desk posts (Korean -> English) using Gemini.
 *
 * Usage examples:
 *   npx tsx scripts/translate-naver-posts.ts --slug 20260214-카페루아-015-업데이트-타로점-갤러리-방명록
 *   npx tsx scripts/translate-naver-posts.ts --limit 20
 *   npx tsx scripts/translate-naver-posts.ts --all
 *   npx tsx scripts/translate-naver-posts.ts --all --resume
 *   npx tsx scripts/translate-naver-posts.ts --all --reset-checkpoint
 *   npx tsx scripts/translate-naver-posts.ts --all --resume --shard-count 5 --shard-index 0 --result-only --result-file .tmp/translate-shards/shard-0.jsonl
 *   npx tsx scripts/translate-naver-posts.ts --apply-results-dir .tmp/translate-shards
 *   npx tsx scripts/translate-naver-posts.ts --all --resume --export-targets-dir .tmp/translate-targets --shard-count 5 --export-only
 *   npx tsx scripts/translate-naver-posts.ts --target-list-file .tmp/translate-targets/shard-0.txt --result-only --result-file .tmp/translate-shards/shard-0.jsonl
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { NAVER_POSTS } from '../src/data/desk/_naver-posts';

type DeskPost = typeof NAVER_POSTS[number];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_FILE = path.join(__dirname, '..', 'src', 'data', 'desk', '_naver-posts.ts');
const DEFAULT_CHECKPOINT_FILE = path.join(__dirname, '..', '.tmp', 'translate-naver-en-checkpoint.json');

const args = process.argv.slice(2);
const has = (flag: string) => args.includes(flag);
const getArg = (flag: string, fallback = '') => {
    const i = args.indexOf(flag);
    if (i === -1 || i + 1 >= args.length) return fallback;
    return args[i + 1];
};

const targetSlug = getArg('--slug', '').trim();
const limit = Math.max(0, Number(getArg('--limit', '0')) || 0);
const runAll = has('--all');
const dryRun = has('--dry-run');
const resume = has('--resume') || !has('--no-resume');
const resetCheckpoint = has('--reset-checkpoint');
const skipOnError = has('--skip-on-error');
const model = getArg('--model', 'gemini-2.5-flash');
const maxCharsPerChunk = Math.max(1200, Number(getArg('--max-chars', '5000')) || 5000);
const shardCount = Math.max(1, Number(getArg('--shard-count', '1')) || 1);
const shardIndex = Math.max(0, Number(getArg('--shard-index', '0')) || 0);
const checkpointFileArg = getArg('--checkpoint-file', '').trim();
const checkpointFile = checkpointFileArg
    ? path.resolve(process.cwd(), checkpointFileArg)
    : DEFAULT_CHECKPOINT_FILE;
const failedFileArg = getArg('--failed-file', '').trim();
const failedFile = failedFileArg
    ? path.resolve(process.cwd(), failedFileArg)
    : path.join(__dirname, '..', '.tmp', 'translate-failed', `shard-${shardIndex}.txt`);
const resultFileArg = getArg('--result-file', '').trim();
const resultFile = resultFileArg ? path.resolve(process.cwd(), resultFileArg) : '';
const resultOnly = has('--result-only');
const applyResultsDirArg = getArg('--apply-results-dir', '').trim();
const applyResultsDir = applyResultsDirArg ? path.resolve(process.cwd(), applyResultsDirArg) : '';
const targetListFileArg = getArg('--target-list-file', '').trim();
const targetListFile = targetListFileArg ? path.resolve(process.cwd(), targetListFileArg) : '';
const exportTargetsDirArg = getArg('--export-targets-dir', '').trim();
const exportTargetsDir = exportTargetsDirArg ? path.resolve(process.cwd(), exportTargetsDirArg) : '';
const exportOnly = has('--export-only');

function parseDotEnv(text: string): Record<string, string> {
    const out: Record<string, string> = {};
    for (const line of text.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq <= 0) continue;
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\'') && val.endsWith('\''))) {
            val = val.slice(1, -1);
        }
        out[key] = val;
    }
    return out;
}

function loadEnv() {
    const candidates = [
        path.join(__dirname, '..', '.env.local'),
        path.join(__dirname, '..', '.env'),
    ];
    for (const p of candidates) {
        if (!fs.existsSync(p)) continue;
        const parsed = parseDotEnv(fs.readFileSync(p, 'utf-8'));
        for (const [k, v] of Object.entries(parsed)) {
            if (!process.env[k]) process.env[k] = v;
        }
    }
}

function ensureDir(filePath: string) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function loadCheckpoint(): Set<string> {
    if (resetCheckpoint) return new Set();
    if (!resume || !fs.existsSync(checkpointFile)) return new Set();
    try {
        const raw = JSON.parse(fs.readFileSync(checkpointFile, 'utf-8')) as { done?: string[] };
        return new Set(raw.done || []);
    } catch {
        return new Set();
    }
}

function saveCheckpoint(done: Set<string>) {
    ensureDir(checkpointFile);
    const payload = {
        updatedAt: new Date().toISOString(),
        done: Array.from(done),
    };
    fs.writeFileSync(checkpointFile, JSON.stringify(payload, null, 2), 'utf-8');
}

function loadFailedSet(): Set<string> {
    if (!fs.existsSync(failedFile)) return new Set();
    const lines = fs.readFileSync(failedFile, 'utf-8')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    return new Set(lines);
}

function saveFailedSet(failed: Set<string>) {
    ensureDir(failedFile);
    fs.writeFileSync(failedFile, `${Array.from(failed).join('\n')}\n`, 'utf-8');
}

function appendResult(slug: string, titleEn: string, contentEn: string) {
    if (!resultFile) return;
    ensureDir(resultFile);
    fs.appendFileSync(resultFile, `${JSON.stringify({ slug, titleEn, contentEn })}\n`, 'utf-8');
}

function applyResultsFromDir(posts: DeskPost[]): number {
    if (!applyResultsDir) return 0;
    if (!fs.existsSync(applyResultsDir)) {
        throw new Error(`apply-results-dir not found: ${applyResultsDir}`);
    }

    const files = fs.readdirSync(applyResultsDir)
        .filter((f) => f.endsWith('.jsonl'))
        .sort()
        .map((f) => path.join(applyResultsDir, f));

    let applied = 0;
    for (const file of files) {
        const raw = fs.readFileSync(file, 'utf-8');
        for (const line of raw.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            const parsed = JSON.parse(trimmed) as { slug?: string; titleEn?: string; contentEn?: string };
            if (!parsed.slug) continue;
            const idx = posts.findIndex((p) => p.slug === parsed.slug);
            if (idx < 0) continue;
            posts[idx] = {
                ...posts[idx],
                titleEn: parsed.titleEn || posts[idx].titleEn || posts[idx].titleKo,
                contentEn: parsed.contentEn || posts[idx].contentEn || '',
            };
            applied += 1;
        }
    }
    return applied;
}

function loadTargetList(filePath: string): Set<string> {
    if (!filePath) return new Set();
    if (!fs.existsSync(filePath)) {
        throw new Error(`target-list-file not found: ${filePath}`);
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const items = raw
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'));
    return new Set(items);
}

function exportTargetLists(targets: DeskPost[]) {
    if (!exportTargetsDir) return;
    fs.mkdirSync(exportTargetsDir, { recursive: true });
    for (let i = 0; i < shardCount; i++) {
        const shardTargets = targets.filter((_, idx) => idx % shardCount === i).map((t) => t.slug);
        fs.writeFileSync(path.join(exportTargetsDir, `shard-${i}.txt`), `${shardTargets.join('\n')}\n`, 'utf-8');
    }
}

function isMissingTitleEn(p: DeskPost): boolean {
    const ko = (p.titleKo || '').trim();
    const en = (p.titleEn || '').trim();
    return !en || en === ko;
}

function isMissingContentEn(p: DeskPost): boolean {
    const ko = (p.contentKo || '').trim();
    const en = (p.contentEn || '').trim();
    return !en || en === ko;
}

function splitIntoChunks(text: string, maxChars: number): string[] {
    if (text.length <= maxChars) return [text];

    const parts = text.split(/\n\n/);
    const chunks: string[] = [];
    let buf = '';
    for (const part of parts) {
        const next = buf ? `${buf}\n\n${part}` : part;
        if (next.length <= maxChars) {
            buf = next;
            continue;
        }
        if (buf) chunks.push(buf);

        if (part.length <= maxChars) {
            buf = part;
            continue;
        }

        let i = 0;
        while (i < part.length) {
            const cut = part.slice(i, i + maxChars);
            chunks.push(cut);
            i += maxChars;
        }
        buf = '';
    }
    if (buf) chunks.push(buf);
    return chunks;
}

function stripCodeFence(input: string): string {
    const t = input.trim();
    const m = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    return m ? m[1].trim() : t;
}

async function callGemini(systemInstruction: string, userText: string, outputTokens = 8192): Promise<string> {
    const apiKey = process.env.GEMINI_TOKEN || process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error('GEMINI_TOKEN (or GOOGLE_API_KEY) is not configured');

    const body = {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: userText }] }],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: outputTokens,
        },
    };

    let lastErr = '';
    for (let attempt = 1; attempt <= 5; attempt++) {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey,
                },
                body: JSON.stringify(body),
            }
        );

        if (res.ok) {
            try {
                const data = await res.json() as {
                    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
                };
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                if (text.trim()) return text;
                lastErr = 'Gemini returned empty text';
            } catch (e) {
                lastErr = `Failed to parse Gemini response JSON: ${(e as Error).message}`;
            }
            const delay = 800 * attempt;
            await new Promise((r) => setTimeout(r, delay));
            continue;
        }

        const errText = await res.text().catch(() => '');
        lastErr = `HTTP ${res.status} ${res.statusText} ${errText}`;
        const delay = 800 * attempt;
        await new Promise((r) => setTimeout(r, delay));
    }

    throw new Error(`Gemini request failed after retries: ${lastErr}`);
}

async function translateTitle(titleKo: string): Promise<string> {
    // Clean excessive whitespace/tabs from malformed titles
    const cleaned = titleKo.replace(/[\t\r]+/g, ' ').replace(/ {2,}/g, ' ').replace(/\n{2,}/g, ' ').trim();
    // Skip translation for symbol-only or empty titles
    if (!cleaned || !/[가-힣A-Za-z0-9]/.test(cleaned)) {
        return cleaned || titleKo;
    }
    const system = [
        'You are a professional Korean-to-English translator for technical/personal blog titles.',
        'Translate naturally for English readers while preserving key names, versions, and product names.',
        'Return ONLY the translated title text. No quotes, no explanations.',
    ].join('\n');
    const out = await callGemini(system, cleaned, 256);
    return out.trim().replace(/^"+|"+$/g, '');
}

async function translateChunk(chunkKo: string): Promise<string> {
    const system = [
        'You are a professional Korean-to-English translator for markdown blog posts.',
        'Rules:',
        '1) Keep markdown structure exactly where possible.',
        '2) Keep tokens like {{IMG:1}} unchanged.',
        '3) Keep URLs unchanged.',
        '4) Preserve headings, bullet lists, and links.',
        '5) Return ONLY translated markdown text for the input chunk.',
    ].join('\n');
    const out = await callGemini(system, chunkKo, 8192);
    return out.trim();
}

function splitChunkForRetry(text: string): [string, string] {
    const mid = Math.floor(text.length / 2);
    const paraBreak = text.lastIndexOf('\n\n', mid);
    const cut = paraBreak > 200 ? paraBreak : mid;
    return [text.slice(0, cut).trim(), text.slice(cut).trim()];
}

async function translateChunkWithFallback(chunkKo: string, depth = 0): Promise<string> {
    // Symbol-only chunks (e.g., **********) should be preserved as-is.
    if (!/[가-힣A-Za-z0-9]/.test(chunkKo)) {
        return chunkKo;
    }

    try {
        const translated = await translateChunk(chunkKo);
        if (translated.trim()) return translated;
        throw new Error('Empty translated chunk');
    } catch (err) {
        // Retry with smaller chunks for pathological inputs that return empty responses.
        const canSplit = chunkKo.length > 1200 && depth < 4;
        if (!canSplit) {
            throw err;
        }
        const [left, right] = splitChunkForRetry(chunkKo);
        if (!left || !right) {
            throw err;
        }
        const leftTranslated = await translateChunkWithFallback(left, depth + 1);
        const rightTranslated = await translateChunkWithFallback(right, depth + 1);
        return `${leftTranslated}\n\n${rightTranslated}`.trim();
    }
}

async function translateContent(contentKo: string): Promise<string> {
    const chunks = splitIntoChunks(contentKo, maxCharsPerChunk);
    const out: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
        const translated = await translateChunkWithFallback(chunks[i]);
        out.push(translated);
        await new Promise((r) => setTimeout(r, 200));
    }
    return out.join('\n\n').trim();
}

function renderPosts(posts: DeskPost[]): string {
    const lines: string[] = [];
    lines.push(`import type { DeskPost } from './deskData';\n`);
    lines.push('/**');
    lines.push(` * 네이버 블로그에서 자동 스크래핑한 포스트 (${new Date().toISOString().slice(0, 10)})`);
    lines.push(' * 블로그: https://blog.naver.com/fstory97');
    lines.push(` * 총 ${posts.length}개`);
    lines.push(' */\n');
    lines.push('export const NAVER_POSTS: DeskPost[] = [');

    for (const p of posts) {
        lines.push('    {');
        lines.push(`        slug: ${JSON.stringify(p.slug)},`);
        lines.push(`        date: ${JSON.stringify(p.date)},`);
        lines.push(`        titleKo: ${JSON.stringify(p.titleKo)},`);
        lines.push(`        titleEn: ${JSON.stringify(p.titleEn || p.titleKo)},`);
        lines.push(`        contentKo: ${JSON.stringify(p.contentKo)},`);
        lines.push(`        contentEn: ${JSON.stringify(p.contentEn || '')},`);
        lines.push(`        category: ${JSON.stringify(p.category || 'misc')},`);
        if (p.sourceCategoryNo) lines.push(`        sourceCategoryNo: ${JSON.stringify(p.sourceCategoryNo)},`);
        if (p.sourceCategory) lines.push(`        sourceCategory: ${JSON.stringify(p.sourceCategory)},`);
        if (Array.isArray(p.tags) && p.tags.length > 0) lines.push(`        tags: ${JSON.stringify(p.tags)},`);
        lines.push(`        thumbnail: ${JSON.stringify(p.thumbnail || '')},`);
        lines.push(`        images: ${JSON.stringify(Array.isArray(p.images) ? p.images : [])},`);
        lines.push(`        externalUrl: ${JSON.stringify(p.externalUrl || '')},`);
        lines.push('    },');
    }
    lines.push('];\n');
    return lines.join('\n');
}

async function main() {
    loadEnv();
    const done = loadCheckpoint();
    const failed = skipOnError ? loadFailedSet() : new Set<string>();
    const posts = [...NAVER_POSTS] as DeskPost[];

    if (shardIndex >= shardCount) {
        throw new Error(`invalid shard index: ${shardIndex} (shard-count=${shardCount})`);
    }

    if (applyResultsDir) {
        const applied = applyResultsFromDir(posts);
        fs.writeFileSync(POSTS_FILE, renderPosts(posts), 'utf-8');
        console.log(`Applied ${applied} translated records from ${applyResultsDir}`);
        return;
    }

    let targets = posts.filter((p) => isMissingTitleEn(p) || isMissingContentEn(p));
    if (targetSlug) targets = targets.filter((p) => p.slug === targetSlug);
    if (!runAll && !targetSlug && limit === 0) targets = targets.slice(0, 1);
    if (limit > 0) targets = targets.slice(0, limit);
    if (targetListFile) {
        const targetSet = loadTargetList(targetListFile);
        targets = targets.filter((p) => targetSet.has(p.slug));
    }
    if (exportTargetsDir) {
        exportTargetLists(targets);
        console.log(`exported target lists: ${exportTargetsDir}`);
        if (exportOnly) return;
    }
    if (shardCount > 1) targets = targets.filter((_, idx) => idx % shardCount === shardIndex);
    if (resume && done.size > 0) targets = targets.filter((p) => !done.has(p.slug));
    if (skipOnError && failed.size > 0) targets = targets.filter((p) => !failed.has(p.slug));

    console.log(`total posts: ${posts.length}`);
    console.log(`missing translation: ${posts.filter((p) => isMissingTitleEn(p) || isMissingContentEn(p)).length}`);
    if (shardCount > 1) console.log(`shard: ${shardIndex + 1}/${shardCount}`);
    console.log(`targets this run: ${targets.length}`);
    if (skipOnError && failed.size > 0) console.log(`skipping failed slugs: ${failed.size}`);
    if (resultOnly) console.log(`result-only mode: writes to ${resultFile || '(disabled)'}`);

    if (targets.length === 0) {
        console.log('Nothing to translate.');
        return;
    }

    if (dryRun) {
        console.log('Dry run mode. No files will be changed.');
        return;
    }

    for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        console.log(`[${i + 1}/${targets.length}] translating: ${t.slug}`);

        const idx = posts.findIndex((p) => p.slug === t.slug);
        if (idx < 0) continue;

        try {
            const next = { ...posts[idx] };

            if (isMissingTitleEn(next)) {
                next.titleEn = await translateTitle(next.titleKo);
            }
            if (isMissingContentEn(next)) {
                next.contentEn = await translateContent(next.contentKo);
            }

            posts[idx] = next;
            done.add(next.slug);
            appendResult(next.slug, next.titleEn || next.titleKo, next.contentEn || '');
            if (!resultOnly) {
                fs.writeFileSync(POSTS_FILE, renderPosts(posts), 'utf-8');
            }
            saveCheckpoint(done);
            console.log(`  ✅ done: ${next.slug}`);
        } catch (err) {
            console.error(`  ❌ failed: ${t.slug}`, (err as Error).message);
            saveCheckpoint(done);
            if (skipOnError) {
                failed.add(t.slug);
                saveFailedSet(failed);
                console.log(`  ⚠️ skipped and recorded as failed: ${t.slug}`);
                continue;
            }
            throw err;
        }
    }

    console.log('Translation completed.');
}

main().catch((err) => {
    console.error('\nFatal:', err);
    process.exit(1);
});
