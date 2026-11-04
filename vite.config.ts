import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const upstream = env.VITE_DEV_PROXY_TARGET || "https://v2.br-baby.com";
  // Her local backend has no /api prefix. Deployed hosts still do, so the
  // browser keeps requesting /api and only this dev proxy strips it.
  const stripApi = env.VITE_DEV_PROXY_STRIP_API === "true";
  return {
    plugins: [vue()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: upstream,
          // Keep the browser host. changeOrigin would tell her server the
          // site is 192.168.2.12 instead of localhost:5173.
          changeOrigin: false,
          ...(stripApi
            ? { rewrite: (path: string) => path.replace(/^\/api/, "") || "/" }
            : {}),
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
    build: { cssTarget: "chrome107" },
  };
});
