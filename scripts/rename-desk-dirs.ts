/**
 * Rename desk image directories from 20260218-* to correct date prefix
 * based on the date map from fetch-naver-dates.
 *
 * Usage: npx tsx scripts/rename-desk-dirs.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { NAVER_POSTS } from '../src/data/desk/_naver-posts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DESK_DIR = path.join(__dirname, '..', 'public', 'desk');
const DIARY_DIR = path.join(__dirname, '..', 'public', 'diary');

// Build a map from old slug to new slug using the updated _naver-posts.ts
// The posts now have correct dates in their slugs (after apply-naver-dates.ts)
// We need to figure out which old directories (20260218-*) map to which new slugs

// Read the dates JSON
const raw = fs.readFileSync('/tmp/naver-dates.json', 'utf-8');
const jsonStart = raw.indexOf('{');
const jsonEnd = raw.lastIndexOf('}');
const dateMap: Record<string, string> = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));

let renamed = 0;
let skipped = 0;

for (const post of NAVER_POSTS) {
    const logNoMatch = post.externalUrl?.match(/\/(\d+)$/);
    if (!logNoMatch) continue;

    const logNo = logNoMatch[1];
    const date = dateMap[logNo];
    if (!date) continue;

    const datePrefix = date.replace(/-/g, '').slice(0, 8);
    if (datePrefix === '20260218') continue; // No rename needed

    // Current slug should now have the new date prefix
    const newSlug = post.slug; // Already updated in _naver-posts.ts
    const oldSlug = newSlug.replace(new RegExp(`^${datePrefix}`), '20260218');

    // Check desk directory
    const oldDir = path.join(DESK_DIR, oldSlug);
    const newDir = path.join(DESK_DIR, newSlug);

    if (fs.existsSync(oldDir) && !fs.existsSync(newDir)) {
        fs.renameSync(oldDir, newDir);
        renamed++;
        console.log(`✓ ${oldSlug} → ${newSlug}`);
    } else if (fs.existsSync(newDir)) {
        skipped++;
    } else {
        // Directory might not exist (empty post)
    }

    // Also check diary directory (for 카페루아 라이프 posts)
    const oldDiaryDir = path.join(DIARY_DIR, oldSlug);
    const newDiaryDir = path.join(DIARY_DIR, newSlug);
    if (fs.existsSync(oldDiaryDir) && !fs.existsSync(newDiaryDir)) {
        fs.renameSync(oldDiaryDir, newDiaryDir);
        renamed++;
        console.log(`✓ diary: ${oldSlug} → ${newSlug}`);
    }
}

console.log(`\nDone: ${renamed} renamed, ${skipped} skipped (already correct)`);
