/**
 * Apply fetched dates to _naver-posts.ts
 * Reads the date map from /tmp/naver-dates.json (stderr+JSON mixed output)
 * and updates the source file's date fields + slug prefixes.
 *
 * Usage: npx tsx scripts/apply-naver-dates.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATES_FILE = '/tmp/naver-dates.json';
const POSTS_FILE = path.join(__dirname, '..', 'src', 'data', 'desk', '_naver-posts.ts');

// Parse the mixed stderr+JSON output
const raw = fs.readFileSync(DATES_FILE, 'utf-8');
// Extract JSON block (starts with { and ends with })
const jsonStart = raw.indexOf('{');
const jsonEnd = raw.lastIndexOf('}');
if (jsonStart === -1 || jsonEnd === -1) {
    console.error('No JSON found in dates file');
    process.exit(1);
}

const dateMap: Record<string, string> = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
console.log(`Loaded ${Object.keys(dateMap).length} dates`);

// Read the posts file
let source = fs.readFileSync(POSTS_FILE, 'utf-8');

let updated = 0;
let slugsUpdated = 0;

for (const [logNo, date] of Object.entries(dateMap)) {
    // Update externalUrl line's matching date field
    // Pattern: find the block containing this logNo in externalUrl, then update its date
    const urlPattern = new RegExp(`(externalUrl:\\s*"[^"]*${logNo}")`, 'g');
    if (!urlPattern.test(source)) continue;

    // Find the post block: look for the slug line before this externalUrl
    // Strategy: replace date: "2026-02-18" that's near the externalUrl with this logNo
    const blockRegex = new RegExp(
        `(slug:\\s*")(20260218)(-[^"]*"[\\s\\S]*?externalUrl:\\s*"[^"]*${logNo}")`,
        'g'
    );

    const dateForSlug = date.replace(/-/g, '').slice(0, 8); // "20250213"

    source = source.replace(blockRegex, (match, prefix, oldDate, rest) => {
        slugsUpdated++;
        return `${prefix}${dateForSlug}${rest}`;
    });

    // Also update the date field value
    // Find: date: "2026-02-18" near this logNo
    const dateRegex = new RegExp(
        `(date:\\s*")2026-02-18("[\\s\\S]*?externalUrl:\\s*"[^"]*${logNo}")`,
        'g'
    );

    source = source.replace(dateRegex, (match, prefix, rest) => {
        updated++;
        return `${prefix}${date}${rest}`;
    });
}

// Also update thumbnail and image paths that reference 20260218-
// We need to be careful here - just update the slug prefix in paths
for (const [logNo, date] of Object.entries(dateMap)) {
    const dateForSlug = date.replace(/-/g, '').slice(0, 8);
    if (dateForSlug === '20260218') continue; // No change needed

    // Find slug value for this logNo
    const slugMatch = source.match(new RegExp(`slug:\\s*"${dateForSlug}-([^"]*)"[\\s\\S]*?externalUrl:\\s*"[^"]*${logNo}"`));
    if (!slugMatch) continue;

    const slugSuffix = slugMatch[1];
    const oldPath = `20260218-${slugSuffix}`;
    const newPath = `${dateForSlug}-${slugSuffix}`;

    // Replace in thumbnail and images paths
    source = source.replaceAll(`/desk/${oldPath}`, `/desk/${newPath}`);
}

fs.writeFileSync(POSTS_FILE, source, 'utf-8');

console.log(`Updated ${updated} dates, ${slugsUpdated} slug prefixes`);
console.log('Done! Remember to rename image directories too.');
