import {entries, hourPath, site} from '../lib/gallery.js';
export function GET() {
  const urls = [{url:'/', date:entries[0].publishedAt}, ...entries.map(entry => ({url:hourPath(entry),date:entry.publishedAt}))];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(({url,date}) => `<url><loc>${site}${url}</loc><lastmod>${date}</lastmod></url>`).join('')}</urlset>`, {headers:{'Content-Type':'application/xml'}});
}
