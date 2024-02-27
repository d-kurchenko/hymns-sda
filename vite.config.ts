import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';

import tailwind from 'tailwindcss';
import tailwindNesting from 'tailwindcss/nesting';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindNesting(), tailwind(), autoprefixer()],
    },
  },
});
