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
      name: 'remove-material-icons',
      enforce: 'pre',
      transform(code, id) {
        if (id.includes('beer.min.css')) {
          const materialFontsImportsRegexp = /@font-face\s*\{[^}]*font-family:\s*Material Symbols \w+;[^}]*\}/g;
          const hasMaterialFontsImports = materialFontsImportsRegexp.test(code);
          if (hasMaterialFontsImports) {
            return code.replace(materialFontsImportsRegexp, '');
          }
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
});
