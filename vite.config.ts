import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv, type Plugin } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

/** Production-only caching worker. Dev keeps public/sw-dev.js, which does not cache. */
function productionServiceWorker(): Plugin {
  return {
    name: "gc987-sw",
    apply: "build",
    generateBundle() {
      const source = readFileSync(resolve(rootDir, "src/pwa/sw-prod.js"), "utf8").replaceAll(
        "__BUILD_ID__",
        String(Date.now()),
      );
      this.emitFile({ type: "asset", fileName: "sw.js", source });
    },
  };
}

/** Mark built stylesheets as critical so the browser fetches them with the document. */
function criticalStylePreload(): Plugin {
  return {
    name: "gc987-critical-preload",
    apply: "build",
    transformIndexHtml(html) {
      const withStyle = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, (tag) => {
        const href = tag.match(/href="([^"]+)"/);
        if (!href) return tag;
        return `<link rel="preload" href="${href[1]}" as="style" />\n    ${tag}`;
      });
      return withStyle.replace(
        /<script\b[^>]*type="module"[^>]*src="([^"]+)"[^>]*>\s*<\/script>/g,
        (tag, src) => `<link rel="modulepreload" crossorigin href="${src}" />\n    ${tag}`,
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const upstream = env.VITE_DEV_PROXY_TARGET || "https://v2.br-baby.com";
  // Her local backend has no /api prefix. Deployed hosts still do, so the
  // browser keeps requesting /api and only this dev proxy strips it.
  const stripApi = env.VITE_DEV_PROXY_STRIP_API === "true";
  return {
    plugins: [vue(), productionServiceWorker(), criticalStylePreload()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      // Windows often skips the file-change event, so the page stayed stale
      // until a manual refresh. Polling makes Vite notice the edit and push it.
      watch: {
        usePolling: true,
        interval: 200,
      },
      hmr: {
        overlay: true,
      },
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
        // Upload paths are `/uploads/...` on the site origin. Dev has no files
        // of its own, so the same host that serves the API serves the picture.
        "/uploads": {
          target: upstream,
          changeOrigin: false,
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
    build: {
      cssTarget: "chrome107",
      modulePreload: true,
    },
  };
});
