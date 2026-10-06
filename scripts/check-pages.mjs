import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const entries = JSON.parse(await readFile('public/data/transmissions.json', 'utf8'));
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const home = await readFile('dist/index.html', 'utf8');
const escape = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for (const entry of entries) {
  const path = `/hour/${entry.id.toLowerCase()}/`;
  const html = await readFile(`dist${path}index.html`, 'utf8');
  assert(html.includes(`href="https://slopcore.nader.io${path}"`), `Missing canonical: ${entry.id}`);
  assert(html.includes(`<title>${escape(entry.title)} · SLOPCORE</title>`), `Missing title: ${entry.id}`);
  assert(html.includes(escape(entry.question)), `Missing question: ${entry.id}`);
  assert(html.includes(escape(entry.discovery)), `Missing discovery: ${entry.id}`);
  assert(html.includes(`content="https://slopcore.nader.io${entry.image}"`), `Missing preview image: ${entry.id}`);
  assert(home.includes(`href="${path}"`), `Missing archive link: ${entry.id}`);
  assert(home.includes(`"${entry.id.toLowerCase()}":"${path}"`), `Missing legacy redirect: ${entry.id}`);
  assert(sitemap.includes(`https://slopcore.nader.io${path}`), `Missing sitemap URL: ${entry.id}`);
}
assert(home.includes('location.replace'), 'Missing legacy redirect behavior');
assert((await readFile('dist/robots.txt','utf8')).includes('/sitemap.xml'));
assert((await readFile('dist/404.html','utf8')).includes('noindex'));
console.log(`Verified ${entries.length} static pages, metadata, archive links, legacy redirects and sitemap`);
