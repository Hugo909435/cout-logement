// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { remarkFaq } from './src/lib/remark-faq.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://coutlogement.fr',
  output: 'static',
  integrations: [sitemap(), mdx()],
  markdown: {
    remarkPlugins: [remarkFaq],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
