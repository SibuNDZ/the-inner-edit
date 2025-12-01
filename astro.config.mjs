import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://theinneredit.com', // Update with your actual domain
  output: 'hybrid', // Enables SSR for specific pages while keeping others static
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    react(),
    sitemap(),
    mdx()
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  vite: {
    ssr: {
      external: ['node:buffer']
    }
  }
});
