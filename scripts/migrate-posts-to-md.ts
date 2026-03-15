/**
 * Migrate DESK_POSTS from _naver-posts.ts to individual markdown files.
 *
 * Output: public/desk-posts/[slug].md
 * Format: YAML frontmatter + <!-- ko --> / <!-- en --> body sections
 *
 * Usage: npx tsx scripts/migrate-posts-to-md.ts
 *        npx tsx scripts/migrate-posts-to-md.ts --dry-run
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'desk-posts');
const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
    const { DESK_POSTS } = await import('../src/data/desk/deskData.js') as {
        DESK_POSTS: Array<{
            slug: string;
            date: string;
            titleKo: string;
            titleEn: string;
            contentKo: string;
            contentEn: string;
            category: string;
            tags?: string[];
            thumbnail?: string;
            images: string[];
            sourceCategoryNo?: string;
            sourceCategory?: string;
            externalUrl?: string;
        }>;
    };

    if (!DRY_RUN) {
        fs.mkdirSync(OUT_DIR, { recursive: true });
    }

    let written = 0;
    let skipped = 0;

    for (const post of DESK_POSTS) {
        const outPath = path.join(OUT_DIR, `${post.slug}.md`);

        if (!DRY_RUN && fs.existsSync(outPath)) {
            skipped++;
            continue;
        }

        const frontmatter: Record<string, unknown> = {
            date: post.date,
            titleKo: post.titleKo,
            titleEn: post.titleEn,
            category: post.category,
            tags: post.tags ?? [],
            images: post.images ?? [],
        };
        if (post.thumbnail) frontmatter.thumbnail = post.thumbnail;
        if (post.sourceCategoryNo) frontmatter.sourceCategoryNo = post.sourceCategoryNo;
        if (post.sourceCategory) frontmatter.sourceCategory = post.sourceCategory;
        if (post.externalUrl) frontmatter.externalUrl = post.externalUrl;

        const yamlStr = yaml.dump(frontmatter, {
            allowUnicode: true,
            lineWidth: -1,
            quotingType: '"',
            forceQuotes: false,
        });

        const content = [
            '---',
            yamlStr.trimEnd(),
            '---',
            '',
            '<!-- ko -->',
            post.contentKo ?? '',
            '',
            '<!-- en -->',
            post.contentEn ?? '',
        ].join('\n');

        if (DRY_RUN) {
            console.log(`[dry] ${post.slug}.md`);
        } else {
            fs.writeFileSync(outPath, content, 'utf8');
        }
        written++;
    }

    console.log(`\nDone. ${DRY_RUN ? '[dry-run] ' : ''}written=${written} skipped=${skipped} total=${DESK_POSTS.length}`);
    console.log(`Output: ${OUT_DIR}`);
}

main().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
