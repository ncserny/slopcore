import {cp, mkdir, rm, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import './validate.mjs';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
await mkdir('dist/optimized', {recursive:true});
await mkdir('dist/assets', {recursive:true});
const assetUrls = {};
for (const name of ['style.css', 'app.js']) {
  const content = await readFile(`public/${name}`);
  const hash = createHash('sha256').update(content).digest('hex').slice(0,12);
  const {name:stem, ext} = path.parse(name);
  assetUrls[name] = `/assets/${stem}-${hash}${ext}`;
  await writeFile(`dist${assetUrls[name]}`, content);
}
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
    await sharp(input).resize({width:size, withoutEnlargement:true}).webp({quality:85}).toFile(`dist${url}`);
    variants.push({url, width:size});
  }
  // Full prompts stay in the original archive; browsing needs only display metadata.
  const {prompt, ...display} = entry;
  gallery.push({...display, width, height, displayImage:variants.at(-1).url,
    srcset:variants.map(v => `${v.url} ${v.width}w`).join(', ')});
}
await writeFile('dist/data/gallery.json', JSON.stringify(gallery));
const latest = gallery[0];
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let html = await readFile('public/index.html', 'utf8');
html = html.replace('href="/style.css"', `href="${assetUrls['style.css']}"`)
  .replace('src="/app.js"', `src="${assetUrls['app.js']}"`);
html = html.replace('<img id="hero-image" alt="" fetchpriority="high">',
  `<img id="hero-image" alt="${escape(latest.alt)}" fetchpriority="high" src="${escape(latest.displayImage)}" srcset="${escape(latest.srcset)}" sizes="(min-width: 1700px) 1600px, 92vw" width="${latest.width}" height="${latest.height}">`);
html = html.replace('id="full-image" class=', `id="full-image" href="${escape(latest.image)}" class=`);
for (const field of ['title','thought','caption','question','discovery','category']) {
  html = html.replace(new RegExp(`(<[^>]+id="${field}"[^>]*>)[^<]*(</[^>]+>)`),
    (_, start, end) => start + escape(latest[field]) + end);
}
html = html.replace('<!-- GALLERY_BOOTSTRAP -->',
  `<script id="gallery-data" type="application/json">${JSON.stringify(gallery).replace(/</g,'\\u003c')}</script>`);
await writeFile('dist/index.html', html);
console.log('Static site built in dist/');
