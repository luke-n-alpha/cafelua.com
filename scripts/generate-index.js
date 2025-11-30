import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/content-index.json');

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function parseDate(dateStr) {
    if (!dateStr) return new Date();
    return new Date(dateStr);
}

function scanDirectory(dir) {
    const results = [];
    const files = fs.readdirSync(dir);

    // Identify image files in the current directory for association
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            results.push(...scanDirectory(fullPath));
        } else if (file.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');

            // Basic Parsing Logic
            let title = lines[0]?.replace(/^#\s*/, '').trim() || file.replace('.md', '');
            let date = stat.mtime;
            let category = 'general';
            let type = 'post';

            // Determine Category based on path
            if (fullPath.includes('cafelua/posting')) {
                type = 'blog';
                category = 'cafe-life';
                if (lines[2] && lines[2].match(/^\d{4}-\d{2}-\d{2}/)) {
                    date = new Date(lines[2].trim());
                }
            } else if (fullPath.includes('luke-novel')) {
                type = 'novel';
                category = 'novel';
                title = file.replace('.md', '');
            } else if (file === 'profile_luke.md') {
                type = 'profile';
            }

            // Find associated images based on prefix (e.g., "01-")
            const associatedImages = [];
            const prefixMatch = file.match(/^(\d+)[-.]/);
            if (prefixMatch) {
                const prefix = prefixMatch[1];
                const related = imageFiles.filter(img =>
                    img.startsWith(prefix + '-') || img.startsWith(prefix + '.')
                );
                related.forEach(img => {
                    // Store relative path from DATA_DIR, e.g., "luke-novel/dragonia-legend-1/01-map.jpg"
                    associatedImages.push(path.relative(DATA_DIR, path.join(dir, img)));
                });
            }

            results.push({
                id: path.relative(DATA_DIR, fullPath),
                title,
                date: date.toISOString(),
                type,
                category,
                path: fullPath,
                images: associatedImages // Add images array
            });
        }
    }
    return results;
}

console.log(`Scanning data from: ${DATA_DIR}`);
const contentIndex = scanDirectory(DATA_DIR);
console.log(`Found ${contentIndex.length} items.`);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(contentIndex, null, 2));
console.log(`Index written to: ${OUTPUT_FILE}`);

// Copy data to public/data for fetching
const PUBLIC_DATA_DIR = path.resolve(__dirname, '../public/data');
if (fs.existsSync(PUBLIC_DATA_DIR)) {
    fs.rmSync(PUBLIC_DATA_DIR, { recursive: true, force: true });
}
fs.cpSync(DATA_DIR, PUBLIC_DATA_DIR, { recursive: true });
console.log(`Data copied to: ${PUBLIC_DATA_DIR}`);
