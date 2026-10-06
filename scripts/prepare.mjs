import {cp, mkdir, rm, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import './validate.mjs';
await rm('tmp/site-public',{recursive:true,force:true});
await mkdir('tmp/site-public',{recursive:true});
await cp('public','tmp/site-public',{recursive:true});
await mkdir('tmp/site-public/optimized', {recursive:true});
await mkdir('tmp/site-public/assets', {recursive:true});
for (const name of ['index.html','app.js','style.css']) await rm(`tmp/site-public/${name}`,{force:true});
const entries = JSON.parse(await readFile('public/data/transmissions.json', 'utf8'))
  .sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
const gallery = [];
for (const entry of entries) {
  const input = await readFile(`public${entry.image}`);
  const {width, height} = await sharp(input).metadata();
  const hash = createHash('sha256').update(input).update('webp-q85-v1').digest('hex').slice(0,12);
  const stem = path.parse(entry.image).name;
  const variants = [];
  for (const size of [...new Set([480, 800, 1200, 1600].map(size => Math.min(size, width)))]) {
    const url = `/optimized/${stem}-${hash}-${size}.webp`;
    await sharp(input).resize({width:size, withoutEnlargement:true}).webp({quality:85}).toFile(`tmp/site-public${url}`);
    variants.push({url, width:size});
  }
  // Full prompts stay in the original archive; browsing needs only display metadata.
  const {prompt, ...display} = entry;
  gallery.push({...display, width, height, displayImage:variants.at(-1).url,
    srcset:variants.map(v => `${v.url} ${v.width}w`).join(', ')});
}
await writeFile('tmp/site-public/data/gallery.json', JSON.stringify(gallery));
await writeFile('tmp/gallery.json', JSON.stringify(gallery));
console.log('Prepared responsive image assets');
