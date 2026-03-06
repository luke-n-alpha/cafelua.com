/**
 * Generate src/data/desk/content-index.json from DESK_POSTS.
 * Used by cafelua.com-manager to list legacy posts.
 *
 * Usage: npx tsx scripts/generate-desk-index.ts
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
    // Dynamic import to handle the TypeScript module
    const { DESK_POSTS } = await import('../src/data/desk/deskData.js');

    const index = DESK_POSTS.map((p: {
        slug: string;
        date: string;
        titleKo: string;
        titleEn: string;
        category: string;
        tags?: string[];
        thumbnail?: string;
    }) => ({
        slug: p.slug,
        date: p.date,
        titleKo: p.titleKo,
        titleEn: p.titleEn,
        category: p.category,
        tags: p.tags || [],
        thumbnail: p.thumbnail || '',
    }));

    const outPath = resolve(__dirname, '../src/data/desk/content-index.json');
    writeFileSync(outPath, JSON.stringify(index, null, 2));
    console.log(`Generated desk content index: ${index.length} posts → ${outPath}`);
}

main().catch((err) => {
    console.error('Failed to generate desk index:', err);
    process.exit(1);
});
