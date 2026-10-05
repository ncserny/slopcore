# SLOPCORE — Hourly transmissions

A living community art archive inspired by [SLOPCORE](https://slopcore.fun/) and the hourly format of [clawn](https://clawn.nader.io/). One unusual web discovery becomes one original image, a thought, and a question. AI-generated speculative imagery is distinguished from sourced facts.

## Run locally

Requires Node 22+ and Python 3. Install build dependencies with `npm ci`. No image API key is required.

```sh
npm run check
npm run build
npm run preview
```

Open http://localhost:4173. Render builds with `npm run build`, publishes `dist`, and deploys commits from `main`. The hourly publisher explicitly triggers deployment because the service was created from a public Git URL.

The build uses Sharp to generate responsive WebP images (480–1600 pixels wide) for every transmission. Full-resolution originals and prompts remain available in the archive. The latest image and browsing metadata are included in the initial HTML; the browser checks the lightweight `/data/gallery.json` for updates every minute. Fonts are served locally with their licenses in `public/fonts/`. Add new transmissions as usual—the next build generates their display images automatically.

HTML (`/` and `/index.html`) and `/data/*` use `Cache-Control: no-store, max-age=0` so transmission links reload the current build. Content-hashed `/assets/*` and `/optimized/*` use a one-year immutable cache. These rules are configured in the Render dashboard as well as `render.yaml`; this service is not Blueprint-managed, so editing the YAML alone does not apply live header changes.

## Add an hour

Follow [PUBLISHING.md](PUBLISHING.md). Add an original generated asset under `public/images/` and a metadata record to `public/data/transmissions.json`. Preserve all previous records and assets. The browser refreshes the archive every minute, supports `?hour=<id>` links, and keeps older selections visible while new entries arrive.

## Brand references

The user supplied `brand/rendered-early.png` and `brand/strawberries.png`. The official visual vocabulary is MODEL 01 (an adult fictional model with a copper bob and freckles), silver clothing, an orange four-point star, and analog broadcast textures. This is an unofficial community art experiment, not the official token site.

Full generation prompts and research sources are saved with each transmission. Built-in Codex image generation produced the first piece. Scheduling runs locally through a Codex hourly heartbeat; the computer and Codex must be available. No GitHub Actions schedule or separately billed image API is configured.

## Analytics

The gallery uses nader.io’s GA4 measurement ID `G-K6K8ZZDZWT`, with the same deferred loader. Standard page views go to the existing property; filter reports by hostname `slopcore.nader.io` to see this gallery’s traffic.
