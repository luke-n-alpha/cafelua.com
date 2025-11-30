import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/content-index.json');

// Helper to recursively get files
function getFiles(dir) {
    const subdirs = fs.readdirSync(dir);
    const files = subdirs.map(subdir => {
        const res = path.resolve(dir, subdir);
        return fs.statSync(res).isDirectory() ? getFiles(res) : res;
    });
    return files.reduce((a, f) => a.concat(f), []);
}

function getMetadata(filePath, allFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const filename = path.basename(filePath, '.md');

    let title = filename;
    let date = fs.statSync(filePath).mtime.toISOString();
    let series = undefined;
    let part = undefined;
    let chapter = undefined;
    let episode = undefined;
    let chapterTitle = undefined;

    // Determine type and category based on path
    const relativePath = path.relative(DATA_DIR, filePath);
    const parts = relativePath.split(path.sep);

    let type = 'post';
    let category = 'general';

    if (parts[0] === 'luke-novel') {
        type = 'novel';
        category = 'novel';

        // Parse Dragonia Legend Series
        if (parts[1] === 'dragonia-legend-1') {
            series = 'dragonia-legend-1';
            part = 1;
            // Extract chapter from filename (e.g., 01-...)
            const match = filename.match(/^(\d+)[-.]/);
            if (match) chapter = parseInt(match[1], 10);
        } else if (parts[1].startsWith('dragonia-legend-2')) {
            series = 'dragonia-legend-2';
            part = 2;
            // Extract chapter from directory name (e.g., dragonia-legend-2-3)
            const dirMatch = parts[1].match(/dragonia-legend-2-(\d+)/);
            if (dirMatch) chapter = parseInt(dirMatch[1], 10);

            // Extract episode from filename (e.g., 01-...)
            const fileMatch = filename.match(/^(\d+)[-.]/);
            if (fileMatch) episode = parseInt(fileMatch[1], 10);
        }
    } else if (parts[0] === 'cafelua' && parts[1] === 'posting') {
        type = 'blog';
        category = 'cafe-life';
    } else if (parts[0] === 'alpha') {
        type = 'post';
        category = 'general';
    }

    // Special case for profile
    if (filePath.includes('profile_luke.md')) {
        type = 'profile';
    }

    // Try to find a title in the first few lines
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Part 2 specific parsing
        if (series === 'dragonia-legend-2') {
            // Look for Chapter Title: "2부 3장 망국의날 두번째 이야기"
            const partChapterMatch = line.match(/^2부\s+(\d+)장\s+(.+)/);
            if (partChapterMatch) {
                chapterTitle = partChapterMatch[2].trim();
            }

            // Look for Episode Title: "1화 전령" or "1화. 전령"
            const episodeMatch = line.match(/^(\d+)화[.\s]\s*(.+)/);
            if (episodeMatch) {
                title = episodeMatch[2].trim();
                // If we found the specific episode title, we can stop looking for the main title
                // But we might still want to find the chapter title if it was on a previous line
            }
        } else {
            // Standard parsing
            if (line.startsWith('# ')) {
                title = line.replace('# ', '').trim();
                break;
            } else if (line.match(/^\d+[장화]\./) || line.match(/^\d+[장화]\s/)) {
                title = line.trim();
                break;
            }
        }
    }

    // Extract images from markdown content
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    const images = [];
    let match;
    while ((match = imageRegex.exec(content)) !== null) {
        images.push(match[1]);
    }

    // Auto-associate map images based on filename prefix (e.g. 01-...)
    const dir = path.dirname(filePath);
    const prefixMatch = filename.match(/^(\d+)[-.]/);
    if (prefixMatch) {
        const prefix = prefixMatch[1];
        const siblingFiles = allFiles.filter(f => path.dirname(f) === dir && f !== filePath);

        siblingFiles.forEach(sibling => {
            const siblingName = path.basename(sibling);
            if (siblingName.startsWith(prefix) && (siblingName.includes('map') || siblingName.endsWith('.jpg') || siblingName.endsWith('.png'))) {
                // Check if it's an image
                if (siblingName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                    // Create relative path from data dir
                    const relPath = path.relative(DATA_DIR, sibling);
                    if (!images.includes(relPath)) {
                        images.push(relPath);
                    }
                }
            }
        });
    }

    return {
        id: relativePath,
        title,
        date,
        type,
        category,
        series,
        part,
        chapter,
        episode,
        chapterTitle,
        path: filePath,
        images: images.length > 0 ? images : undefined
    };
}

function generateIndex() {
    console.log(`Scanning directory: ${DATA_DIR}`);
    if (!fs.existsSync(DATA_DIR)) {
        console.error(`Data directory not found: ${DATA_DIR}`);
        return;
    }

    const allFiles = getFiles(DATA_DIR);
    const markdownFiles = allFiles.filter(file => file.endsWith('.md'));

    console.log(`Found ${markdownFiles.length} markdown files.`);

    const index = markdownFiles.map(file => getMetadata(file, allFiles));

    // Sort by date descending by default, but novels might need specific sorting
    index.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
    console.log(`Generated index with ${index.length} items at ${OUTPUT_FILE}`);
}

generateIndex();
