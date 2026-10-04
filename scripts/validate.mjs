import {readFile, stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
const entries=JSON.parse(await readFile('public/data/transmissions.json','utf8'));
assert(Array.isArray(entries)&&entries.length>0,'Archive must contain a transmission');
const ids=new Set();
for(const entry of entries){
  for(const key of ['id','publishedAt','title','mood','category','image','alt','thought','caption','question','discovery','prompt'])assert(typeof entry[key]==='string'&&entry[key].trim(),`Missing ${key}`);
  assert(!ids.has(entry.id),`Duplicate hour ${entry.id}`);ids.add(entry.id);
  assert(Number.isFinite(Date.parse(entry.publishedAt)),'Invalid publication time');
  assert(/^\/images\/[a-z0-9][a-z0-9._-]+\.(png|jpg|jpeg|webp)$/.test(entry.image),'Image must be a local asset');
  assert((await stat(`public${entry.image}`)).size>1000,'Image missing or empty');
  assert(Array.isArray(entry.sources)&&entry.sources.length>0,'Research source required');
  for(const source of entry.sources){assert(source.title?.trim(),'Source title required');assert(new URL(source.url).protocol==='https:','Source URL must use HTTPS');}
}
console.log(`Validated ${entries.length} transmission(s), assets and sources`);
