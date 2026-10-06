export function GET() {
  return new Response('User-agent: *\nAllow: /\nSitemap: https://slopcore.nader.io/sitemap.xml\n', {headers:{'Content-Type':'text/plain'}});
}
