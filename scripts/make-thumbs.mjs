// Creates a small WebP thumbnail for every certificate image that does not have one yet.
//   images/certificates/<name>.jpg  ->  images/certificates/thumbs/<name>.webp
// Runs in GitHub Actions (see .github/workflows/thumbnails.yml). Needs: npm install sharp
import sharp from 'sharp';
import { readdir, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const DIR = 'images/certificates';
const THUMBS = path.join(DIR, 'thumbs');
const IMAGE = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const exists = p => access(p).then(() => true, () => false);

await mkdir(THUMBS, { recursive: true });
let created = 0;
for (const entry of await readdir(DIR, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE.has(ext)) continue;
    const out = path.join(THUMBS, path.basename(entry.name, path.extname(entry.name)) + '.webp');
    if (await exists(out)) continue;
    await sharp(path.join(DIR, entry.name)).rotate().resize({ width: 600, withoutEnlargement: true }).webp({ quality: 75 }).toFile(out);
    console.log('created', out);
    created++;
}
console.log(created ? `${created} thumbnail(s) created.` : 'All thumbnails already exist.');
