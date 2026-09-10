import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  base: process.env.GITHUB_PAGES === "true" ? "/affordable-bellbottom-pier-drilling/" : "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        about: resolve(root, "about.html"),
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});
