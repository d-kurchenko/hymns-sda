import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


import tailwind from "tailwindcss"
import tailwindNesting from "tailwindcss/nesting"
import autoprefixer from "autoprefixer"

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      'src': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [tailwindNesting(), tailwind(), autoprefixer()],
    }
  }
})
