import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(),
    preprocess({
      postcss: true,
    }),
  ],

  kit: {
    adapter: adapter(),
    csp: {
      directives: {
        "default-src": ["self"],
        "base-uri": ["self"],
        "connect-src": [
          "self",
          "https://api.rss2json.com",
          "https://*.herokuapp.com",
          "https://vitals.vercel-insights.com",
        ],
        "font-src": ["self", "data:", "https://fonts.gstatic.com"],
        "form-action": ["self"],
        "frame-ancestors": ["none"],
        "frame-src": [
          "self",
          "https://app.cal.com",
          "https://www.linkedin.com",
          "https://*.netlify.app",
        ],
        "img-src": ["self", "data:", "blob:", "https:"],
        "object-src": ["none"],
        "worker-src": ["self", "blob:"],
        "script-src": [
          "self",
          "https://cdnjs.cloudflare.com",
          "https://platform.linkedin.com",
          "https://va.vercel-scripts.com",
        ],
        "style-src": ["self", "unsafe-inline", "https://fonts.googleapis.com"],
      },
    },
  },
};

export default config;
