import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://deantzzz.lovelysage6.chatgpt.site',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
  devToolbar: { enabled: false },
});
