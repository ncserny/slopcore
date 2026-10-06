# SLOPCORE — Hourly transmissions

A living community art archive inspired by [SLOPCORE](https://slopcore.fun/) and the hourly format of [clawn](https://clawn.nader.io/). One unusual web discovery becomes one original image, a thought, and a question. AI-generated speculative imagery is distinguished from sourced facts.

## Run locally

Requires Node 22.23.3 (see `.node-version`). Install build dependencies with `npm ci`. No image API key is required.

```sh
npm run check
npm run build
npm run preview
```

Open the URL shown by Astro (normally http://localhost:4321). Use `npm run dev` for development. Render builds with `npm run build`, publishes `dist`, and deploys commits from `main`. The hourly publisher explicitly triggers deployment because the service was created from a public Git URL.

The Astro 7 static build uses Tailwind CSS 4 through its Vite plugin. Existing custom typography and visual styling are preserved; Tailwind utilities provide responsive archive layout without resetting browser styles. Sharp generates responsive WebP images (480–1600 pixels wide), retaining full-resolution originals and prompts.

Every transmission gets a fully rendered page at `/hour/<lowercase-id>/`, with its own title, description, canonical URL, social preview and normal archive/navigation links. The homepage shows the latest artwork. The build generates `sitemap.xml`, `robots.txt` and a noindex 404 page, and checks every output page. Browsers check for newly published entries every minute while preserving an older selected page.

Legacy `/?hour=<id>` links redirect immediately with `location.replace`, using a map generated from the archive. Render static redirect rules match URL paths, not query values; this is a browser redirect, not an HTTP 301. A genuine query-aware 301 would require a server or edge layer. Canonical tags and sitemap entries use the new URLs.

HTML (`/` and `/index.html`) and `/data/*` use `Cache-Control: no-store, max-age=0`. Content-hashed `/optimized/*` retain a one-year immutable cache. Astro emits fingerprinted CSS under `/_astro/`. Header rules are configured in the Render dashboard as well as `render.yaml`; this service is not Blueprint-managed, so editing the YAML alone does not apply live headers.

## Add a transmission

Follow [PUBLISHING.md](PUBLISHING.md). Add an original generated asset under `public/images/` and a metadata record to `public/data/transmissions.json`. Preserve all previous records and assets. The next build automatically creates its static page, legacy redirect mapping, responsive images and sitemap entry.

## Brand references

The user supplied `brand/rendered-early.png` and `brand/strawberries.png`. The official visual vocabulary is MODEL 01 (an adult fictional model with a copper bob and freckles), silver clothing, an orange four-point star, and analog broadcast textures. This is an unofficial community art experiment, not the official token site.

Full generation prompts and research sources are saved with each transmission. Built-in Codex image generation produced the first piece. Scheduling runs locally through a Codex hourly heartbeat; the computer and Codex must be available. No GitHub Actions schedule or separately billed image API is configured.

## Analytics

The gallery uses nader.io’s GA4 measurement ID `G-K6K8ZZDZWT`, with the same deferred loader. Standard page views go to the existing property; filter reports by hostname `slopcore.nader.io` to see this gallery’s traffic.
