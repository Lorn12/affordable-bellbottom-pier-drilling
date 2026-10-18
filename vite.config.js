import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));
const PRODUCTION_ORIGIN = "https://bellbottompierdrilling.com";
const PAGES_BASE = "/affordable-bellbottom-pier-drilling/";

function siteTarget() {
  const isPages = process.env.GITHUB_PAGES === "true";
  const owner = (process.env.GITHUB_REPOSITORY?.split("/")[0] || "Lorn12").toLowerCase();
  const base = isPages ? PAGES_BASE : "/";
  const siteUrl = isPages
    ? `https://${owner}.github.io${PAGES_BASE.slice(0, -1)}`
    : PRODUCTION_ORIGIN;
  return {
    isPages,
    base,
    siteUrl,
    robots: isPages ? "noindex, nofollow" : "index, follow",
  };
}

function siteIndexingPlugin(site) {
  let outDir = resolve(root, "dist");
  return {
    name: "site-indexing",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle: {
      sequential: true,
      order: "post",
      handler() {
        const robotsPath = resolve(outDir, "robots.txt");
        const sitemapPath = resolve(outDir, "sitemap.xml");
        const notFoundPath = resolve(outDir, "404.html");
        const robots = site.isPages
          ? "User-agent: *\nAllow: /\n"
          : readFileSync(resolve(root, "public/robots.txt"), "utf8");
        const sitemap = readFileSync(resolve(root, "public/sitemap.xml"), "utf8").replaceAll(
          PRODUCTION_ORIGIN,
          site.siteUrl,
        );
        writeFileSync(robotsPath, robots);
        writeFileSync(sitemapPath, sitemap);
        const notFound = readFileSync(notFoundPath, "utf8").replaceAll('href="/"', `href="${site.base}"`);
        writeFileSync(notFoundPath, notFound);
        if (site.isPages) writeGitHubPagesPierRedirect(outDir, site.siteUrl);
      },
    },
  };
}

// GitHub Pages serves this file as HTML. Production hosting is not configured in this repo.
function writeGitHubPagesPierRedirect(outDir, siteUrl) {
  const target = "pier-drilling.html";
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pier Drilling</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${siteUrl}/services/pier-drilling.html" />
    <meta http-equiv="refresh" content="0; url=${target}" />
  </head>
  <body>
    <p>This page has moved. Continue to <a href="${target}">Pier Drilling</a>.</p>
  </body>
</html>
`;
  writeFileSync(resolve(outDir, "services/straight-shaft-pier-drilling.html"), html);
}

const site = siteTarget();

export default defineConfig({
  plugins: [tailwindcss(), siteIndexingPlugin(site)],
  base: site.base,
  define: {
    "import.meta.env.VITE_SITE_URL": JSON.stringify(site.siteUrl),
    "import.meta.env.VITE_ROBOTS": JSON.stringify(site.robots),
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        about: resolve(root, "about.html"),
        services: resolve(root, "services.html"),
        pierDrilling: resolve(root, "services/pier-drilling.html"),
        contact: resolve(root, "contact.html"),
        careers: resolve(root, "careers.html"),
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});
