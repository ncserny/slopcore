# SLOPCORE — Hourly transmissions

A living community art archive inspired by [SLOPCORE](https://slopcore.fun/) and the hourly format of [clawn](https://clawn.nader.io/). One unusual web discovery becomes one original image, a thought, and a question. AI-generated speculative imagery is distinguished from sourced facts.

## Run locally

Requires Node 22+ and Python 3. No npm packages or image API key are required.

```sh
npm run check
npm run build
npm run preview
```

Open http://localhost:4173. Render builds with `npm run build`, publishes `dist`, and deploys commits from `main`. The hourly publisher explicitly triggers deployment because the service was created from a public Git URL.

## Add an hour

Follow [PUBLISHING.md](PUBLISHING.md). Add an original generated asset under `public/images/` and a metadata record to `public/data/transmissions.json`. Preserve all previous records and assets. The browser refreshes the archive every minute, supports `?hour=<id>` links, and keeps older selections visible while new entries arrive.

## Brand references

The user supplied `brand/rendered-early.png` and `brand/strawberries.png`. The official visual vocabulary is MODEL 01 (an adult fictional model with a copper bob and freckles), silver clothing, an orange four-point star, and analog broadcast textures. This is an unofficial community art experiment, not the official token site.

Full generation prompts and research sources are saved with each transmission. Built-in Codex image generation produced the first piece. Scheduling runs locally through a Codex hourly heartbeat; the computer and Codex must be available. No GitHub Actions schedule or separately billed image API is configured.

## Analytics

The gallery uses nader.io’s GA4 measurement ID `G-K6K8ZZDZWT`, with the same deferred loader. Standard page views go to the existing property; filter reports by hostname `slopcore.nader.io` to see this gallery’s traffic.
