import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const root = process.cwd();
const assetRoot = path.join(root, 'public', 'library-books');
const snapshotPath = path.join(root, 'src', 'data', 'library', 'library-content.generated.json');
const converted = new Map();

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'sources') {
        await fs.rm(target, { recursive: true, force: true });
      } else {
        await walk(target);
      }
      continue;
    }
    if (!/\.(png|jpe?g)$/i.test(entry.name)) continue;
    const output = target.replace(/\.(png|jpe?g)$/i, '.webp');
    await sharp(target).webp({ quality: 84, effort: 6, smartSubsample: true }).toFile(output);
    converted.set(path.relative(assetRoot, target).replaceAll('\\', '/'), path.relative(assetRoot, output).replaceAll('\\', '/'));
    await fs.rm(target);
  }
}

await walk(assetRoot);
let snapshot = await fs.readFile(snapshotPath, 'utf8');
for (const [source, output] of converted) {
  const sourceWithinEdition = source.split('/').slice(1).join('/');
  const outputWithinEdition = output.split('/').slice(1).join('/');
  snapshot = snapshot.replaceAll(sourceWithinEdition, outputWithinEdition);
}
await fs.writeFile(snapshotPath, snapshot, 'utf8');

console.log(`Optimized ${converted.size} library images to WebP.`);
