import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAP_FILE = '/tmp/naver-category-map.json';
const POSTS_FILE = path.join(__dirname, '..', 'src', 'data', 'desk', '_naver-posts.ts');

type CatMap = Record<string, { categoryNo: string; categoryName: string }>;

const map: CatMap = JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));
const lines = fs.readFileSync(POSTS_FILE, 'utf-8').split('\n');

const out: string[] = [];
let block: string[] = [];
let inBlock = false;
let updated = 0;
let missing = 0;

function flush() {
  if (block.length === 0) return;
  const text = block.join('\n');
  const m = text.match(/externalUrl:\s*"https:\/\/blog\.naver\.com\/fstory97\/(\d+)"/);
  if (!m) {
    out.push(...block);
    block = [];
    inBlock = false;
    return;
  }

  const logNo = m[1];
  const cat = map[logNo];
  if (!cat || !cat.categoryName) {
    missing += 1;
    out.push(...block);
    block = [];
    inBlock = false;
    return;
  }

  const sourceNoLine = `        sourceCategoryNo: ${JSON.stringify(cat.categoryNo)},`;
  const sourceLine = `        sourceCategory: ${JSON.stringify(cat.categoryName)},`;
  const tagsLine = `        tags: ${JSON.stringify([cat.categoryName])},`;

  let hadSourceNo = false;
  let hadSource = false;
  let hadTags = false;
  const newBlock = block.map((line) => {
    const t = line.trim();
    if (t.startsWith('sourceCategoryNo:')) {
      hadSourceNo = true;
      return sourceNoLine;
    }
    if (t.startsWith('sourceCategory:')) {
      hadSource = true;
      return sourceLine;
    }
    if (t.startsWith('tags:')) {
      hadTags = true;
      return tagsLine;
    }
    return line;
  });

  const catIdx = newBlock.findIndex((line) => line.trim().startsWith('category:'));
  if (catIdx !== -1) {
    let offset = 1;
    if (!hadSourceNo) {
      newBlock.splice(catIdx + offset, 0, sourceNoLine);
      offset += 1;
    }
    if (!hadSource) {
      newBlock.splice(catIdx + offset, 0, sourceLine);
      offset += 1;
    }
    if (!hadTags) newBlock.splice(catIdx + offset, 0, tagsLine);
  }

  updated += 1;
  out.push(...newBlock);
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
    if (line.trim() === '},') flush();
    continue;
  }
  out.push(line);
}
if (block.length) flush();

fs.writeFileSync(POSTS_FILE, out.join('\n'), 'utf-8');
console.log(`updated: ${updated}, missing: ${missing}`);
