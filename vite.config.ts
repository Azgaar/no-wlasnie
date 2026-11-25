import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

// GitHub Pages serves the app from /<repo-name>/; the deploy workflow passes it in.
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // src/update.ts decides when a new version is used.
      registerType: "prompt",
      includeAssets: ["icon.svg", "icon-512.png"],
      workbox: { clientsClaim: true, globPatterns: ["**/*.{js,css,html,svg,png,woff2}"] },
      manifest: {
        name: "No właśnie!",
        short_name: "No właśnie!",
        lang: "pl",
        display: "standalone",
        orientation: "any",
        start_url: base,
        scope: base,
        background_color: "#43193F",
        theme_color: "#43193F",
        icons: [
          { src: "icon.svg", sizes: "any", type: "image/svg+xml" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ],
  test: { include: ["src/**/*.test.ts"] }
});
