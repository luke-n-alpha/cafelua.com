/**
 * Apply Naver metadata (date, category, hashtags) to _naver-posts.ts
 * and rename local image directories when slug prefix changes.
 *
 * Usage: npx tsx scripts/apply-naver-meta.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const META_FILE = '/tmp/naver-meta.json';
const POSTS_FILE = path.join(__dirname, '..', 'src', 'data', 'desk', '_naver-posts.ts');
const IMAGE_ROOT = path.join(__dirname, '..', 'public', 'desk');

type MetaItem = { date: string; category: string; tags: string[] };

function uniq<T>(items: T[]) {
    return Array.from(new Set(items));
}

function compactDate(date: string) {
    return date.replace(/-/g, '').slice(0, 8);
}

function normalizeTags(category: string, tags: string[]) {
    const list = [category, ...tags].map(t => (t || '').trim()).filter(Boolean);
    return uniq(list);
}

const meta: Record<string, MetaItem> = JSON.parse(fs.readFileSync(META_FILE, 'utf-8'));
const source = fs.readFileSync(POSTS_FILE, 'utf-8');
const lines = source.split('\n');

let updatedDates = 0;
let updatedTags = 0;
let updatedSlugs = 0;
let renamedDirs = 0;

const outLines: string[] = [];
let block: string[] = [];
let inBlock = false;

function flushBlock() {
    if (block.length === 0) return;

    const blockText = block.join('\n');
    const urlMatch = blockText.match(/externalUrl:\s*"https:\/\/blog\.naver\.com\/fstory97\/(\d+)"/);
    if (!urlMatch) {
        outLines.push(...block);
        block = [];
        inBlock = false;
        return;
    }

    const logNo = urlMatch[1];
    const metaItem = meta[logNo];
    if (!metaItem || !metaItem.date) {
        outLines.push(...block);
        block = [];
        inBlock = false;
        return;
    }

    const newDate = metaItem.date;
    const newDateCompact = compactDate(newDate);
    let oldSlug = '';
    let slugSuffix = '';

    const newBlock = block.map((line) => {
        if (line.includes('slug:')) {
            const slugMatch = line.match(/slug:\s*"([^"]+)"/);
            if (slugMatch) {
                oldSlug = slugMatch[1];
                slugSuffix = oldSlug.replace(/^\d{8}-/, '');
                const newSlug = `${newDateCompact}-${slugSuffix}`;
                if (newSlug !== oldSlug) {
                    updatedSlugs++;
                }
                return line.replace(oldSlug, newSlug);
            }
        }

        if (line.trim().startsWith('date:')) {
            updatedDates++;
            return line.replace(/date:\s*"[^"]+"/, `date: "${newDate}"`);
        }

        if (line.trim().startsWith('thumbnail:') || line.trim().startsWith('images:')) {
            if (oldSlug && slugSuffix) {
                const newSlug = `${newDateCompact}-${slugSuffix}`;
                return line.replaceAll(`/desk/${oldSlug}`, `/desk/${newSlug}`);
            }
        }

        return line;
    });

    const tags = normalizeTags(metaItem.category, metaItem.tags || []);
    const hasTagsLine = newBlock.some((line) => line.trim().startsWith('tags:'));
    if (tags.length > 0) {
        const tagsLine = `        tags: ${JSON.stringify(tags)},`;
        if (hasTagsLine) {
            for (let i = 0; i < newBlock.length; i++) {
                if (newBlock[i].trim().startsWith('tags:')) {
                    newBlock[i] = tagsLine;
                    updatedTags++;
                    break;
                }
            }
        } else {
            const catIndex = newBlock.findIndex((line) => line.trim().startsWith('category:'));
            if (catIndex !== -1) {
                newBlock.splice(catIndex + 1, 0, tagsLine);
                updatedTags++;
            }
        }
    }

    if (oldSlug && slugSuffix) {
        const newSlug = `${newDateCompact}-${slugSuffix}`;
        if (newSlug !== oldSlug) {
            const oldDir = path.join(IMAGE_ROOT, oldSlug);
            const newDir = path.join(IMAGE_ROOT, newSlug);
            if (fs.existsSync(oldDir) && !fs.existsSync(newDir)) {
                fs.renameSync(oldDir, newDir);
                renamedDirs++;
            }
        }
    }

    outLines.push(...newBlock);
    block = [];
    inBlock = false;
}

for (const line of lines) {
    if (!inBlock && line.trim() === '{') {
        inBlock = true;
        block = [line];
        continue;
    }

    if (inBlock) {
        block.push(line);
        if (line.trim() === '},') {
            flushBlock();
        }
        continue;
    }

    outLines.push(line);
}

if (block.length > 0) {
    flushBlock();
}

fs.writeFileSync(POSTS_FILE, outLines.join('\n'), 'utf-8');

console.log(`Updated dates: ${updatedDates}`);
console.log(`Updated tags: ${updatedTags}`);
console.log(`Updated slugs: ${updatedSlugs}`);
console.log(`Renamed image dirs: ${renamedDirs}`);
console.log('Done.');
