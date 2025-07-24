import { fileURLToPath, URL } from 'node:url'
import { templateCompilerOptions } from '@tresjs/core'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      ...templateCompilerOptions,
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      three: path.resolve(__dirname, 'node_modules/three'),
    },
  },
  server: {
    port: 3000,
  },
})
