import { defineConfig } from "vitest/config";

// Standalone Vitest config for the unit-test suite. Kept separate from
// vite.config.ts so the SvelteKit build/type-check pipeline is untouched.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,ts}"],
    coverage: {
      provider: "v8",
      include: [
        "src/lib/api.js",
        "src/routes/**/+server.js",
        "src/hooks.server.js",
      ],
      reporter: ["text", "html"],
    },
  },
});
