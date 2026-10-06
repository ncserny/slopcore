import {defineConfig} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://slopcore.nader.io',
  output: 'static',
  trailingSlash: 'always',
  publicDir: './tmp/site-public',
  vite: {plugins: [tailwindcss()]},
});
