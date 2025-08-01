import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    tailwindcss(),
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
      src: '/src',
    },
  },
  esbuild: {
    legalComments: 'none',
  },
});
