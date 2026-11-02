import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const upstream = env.VITE_DEV_PROXY_TARGET || 'https://v2.br-baby.com'
  return {
  plugins: [vue()],
  server: {
    port: 5987,
    strictPort: true,
    proxy: {
      '/api': {
        target: upstream,
        changeOrigin: true,
        headers: { Origin: upstream, Referer: `${upstream}/` },
      },
    },
  },
  preview: {
    port: 5988,
    strictPort: true,
  },
  // The default css target makes esbuild rewrite `backdrop-filter` to the
  // `-webkit-` alias only, which Chrome ignores. The clone is only ever
  // rendered in Chrome, so keep the unprefixed properties.
  build: { cssTarget: 'chrome107' },
  }
})
