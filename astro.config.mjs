// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "./src/lib/sitemap-integration.mjs";

// SITE_URL is the full public address of the site. Its origin becomes `site`
// and its path becomes `base`, so canonical links, the sitemap and every
// asset URL follow it. The deploy workflow sets it; the default is the same
// address, so local and CI builds use the real base.
const siteUrl = new URL(process.env.SITE_URL ?? "https://vyuhalabs.github.io/vyuha-site");

export default defineConfig({
  output: "static",
  site: siteUrl.origin,
  base: siteUrl.pathname.replace(/\/$/, "") || "/",
  trailingSlash: "ignore",
  build: { format: "directory" },
  integrations: [sitemap()],
});
