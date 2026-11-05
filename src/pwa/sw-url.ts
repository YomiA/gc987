/** Dev keeps the push-only worker. The caching worker is emitted only by the production build. */
export const serviceWorkerUrl = import.meta.env.DEV ? '/sw-dev.js' : '/sw.js'
