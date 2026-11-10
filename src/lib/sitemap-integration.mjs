import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { listHtmlFiles } from "./html-files.mjs";

/**
 * The public URL of a built HTML file, or null when it must stay out of the
 * sitemap (error pages).
 * @param {string} file path relative to dist, e.g. `guide/index.html`
 * @param {string} siteUrl origin plus base, e.g. `https://example.org/vyuha-site`
 * @returns {string | null}
 */
export function pageUrl(file, siteUrl) {
  if (/^(404|500)(\/index)?\.html$/.test(file)) return null;
  const path = file.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "");
  return `${siteUrl.replace(/\/$/, "")}/${path}`;
}

/**
 * @param {string[]} urls
 * @returns {string}
 */
export function sitemapXml(urls) {
  const items = urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

/**
 * Writes `sitemap.xml` at the root of the build from the HTML pages it
 * contains, so every page is listed without keeping a list by hand.
 * @returns {import("astro").AstroIntegration}
 */
export default function sitemap() {
  /** @type {string} */
  let siteUrl = "";
  return {
    name: "vyuha-sitemap",
    hooks: {
      "astro:config:done": ({ config }) => {
        if (!config.site) throw new Error("sitemap: `site` must be set");
        siteUrl = new URL(config.base, config.site).href;
      },
      "astro:build:done": async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const urls = (await listHtmlFiles(root)).map((f) => pageUrl(f, siteUrl)).filter((u) => u !== null);
        await writeFile(new URL("sitemap.xml", dir), sitemapXml(urls));
        logger.info(`sitemap.xml: ${urls.length} page(s)`);
      },
    },
  };
}
