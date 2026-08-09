import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      src: '/src',
    },
  },
  build: {
    assetsInlineLimit: 0,
    rolldownOptions: {
      output: {
        comments: false,
      },
    },
  },
});
