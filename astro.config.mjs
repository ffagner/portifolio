// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Domínio definitivo ainda em aberto (F0). Defina SITE_URL no Netlify quando houver.
const site = process.env.SITE_URL ?? 'https://ffagner.netlify.app';

export default defineConfig({
  site,
  integrations: [mdx(), sitemap()],
  vite: {
    // O @tailwindcss/vite tipa contra uma versão de Vite mais nova que a do Astro 5;
    // em execução é compatível. A conversão só silencia a divergência de tipos.
    plugins: [/** @type {any} */ (tailwindcss())],
    // Three.js (~190 KB gzip) vira um arquivo à parte, baixado só quando o hero aparece.
    build: { chunkSizeWarningLimit: 800 },
  },
});
