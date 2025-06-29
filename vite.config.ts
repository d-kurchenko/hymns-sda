import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';
import tailwindNesting from 'tailwindcss/nesting';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    {
      name: 'purge-beer-css',
      enforce: 'pre',
      transform(code, id) {
        if (id.includes('beer.min.css')) {
          const regexpsToPurge = [
            /@font-face\s*\{[^}]*font-family:\s*Material Symbols \w+;[^}]*\}/g,
            /loading-indicator\.svg/g,
            /boom\.svg/g,
          ];

          for (const regexp of regexpsToPurge) {
            if (regexp.test(code)) {
              code = code.replace(regexp, '');
            }
          }

          return code;
        }

        return code;
      },
    },
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
  esbuild: {
    legalComments: 'none',
  },
});
