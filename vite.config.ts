import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // The default css target makes esbuild rewrite `backdrop-filter` to the
  // `-webkit-` alias only, which Chrome ignores. The clone is only ever
  // rendered in Chrome, so keep the unprefixed properties.
  build: { cssTarget: 'chrome107' },
})
