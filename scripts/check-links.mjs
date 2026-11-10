// Internal link check over a built site. Every href, src and srcset in every
// HTML page that points inside the site must resolve to a file in the build,
// given the site's base path. Exits 1 and lists the broken links otherwise.
//
//   node scripts/check-links.mjs dist [--base /vyuha-site]
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { listHtmlFiles } from "../src/lib/html-files.mjs";

/**
 * The URLs a page refers to (href, src, srcset, and content of og/twitter
 * image meta tags).
 * @param {string} html
 * @returns {string[]}
 */
export function extractUrls(html) {
  /** @type {string[]} */
  const urls = [];
  const attr = /\s(href|src|srcset|content)\s*=\s*("([^"]*)"|'([^']*)')/gi;
  for (const m of html.matchAll(attr)) {
    const name = (m[1] ?? "").toLowerCase();
    const value = m[3] ?? m[4] ?? "";
    if (name === "srcset") {
      for (const part of value.split(",")) {
        const url = part.trim().split(/\s+/)[0];
        if (url) urls.push(url);
      }
    } else if (name === "content") {
      if (/^https?:\/\//.test(value) || value.startsWith("/")) urls.push(value);
    } else {
      urls.push(value);
    }
  }
  return urls;
}

/**
 * The path inside the build that an internal URL points to, or null when the
 * URL is external or not a link (mailto:, data:, a bare fragment).
 * @param {string} url
 * @param {string} pageFile the page's path relative to the build, e.g. `guide/index.html`
 * @param {{ origin: string, base: string }} site
 * @returns {{ path: string } | { outsideBase: string } | null}
 */
export function resolveInternal(url, pageFile, site) {
  if (url === "" || url.startsWith("#")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith(site.origin)) return null;
  if (url.startsWith("//")) return null;
  const pageUrl = new URL(`${site.base}/${pageFile}`, site.origin);
  const target = new URL(url, pageUrl);
  if (target.origin !== site.origin) return null;
  const pathname = decodeURIComponent(target.pathname);
  if (pathname !== site.base && !pathname.startsWith(`${site.base}/`)) {
    return { outsideBase: pathname };
  }
  return { path: pathname.slice(site.base.length) || "/" };
}

/**
 * @param {string} distDir
 * @param {string} path a site path relative to base, e.g. `/guide/`
 */
export function existsInBuild(distDir, path) {
  const file = join(distDir, path);
  if (existsSync(file) && statSync(file).isFile()) return true;
  if (existsSync(join(file, "index.html"))) return true;
  return existsSync(`${file.replace(/\/$/, "")}.html`);
}

/**
 * @param {string} distDir
 * @param {{ origin: string, base: string }} site
 * @returns {Promise<{ checked: number, broken: { page: string, url: string, reason: string }[] }>}
 */
export async function checkLinks(distDir, site) {
  const pages = await listHtmlFiles(distDir);
  if (pages.length === 0) throw new Error(`no HTML pages in ${distDir}`);
  /** @type {{ page: string, url: string, reason: string }[]} */
  const broken = [];
  let checked = 0;
  for (const page of pages) {
    const html = await readFile(join(distDir, page), "utf8");
    for (const url of extractUrls(html)) {
      const target = resolveInternal(url, page, site);
      if (target === null) continue;
      checked++;
      if ("outsideBase" in target) {
        broken.push({ page, url, reason: `outside base ${site.base}` });
      } else if (!existsInBuild(distDir, target.path)) {
        broken.push({ page, url, reason: "not found in build" });
      }
    }
  }
  return { checked, broken };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const distDir = args.find((a) => !a.startsWith("--")) ?? "dist";
  const siteUrl = new URL(process.env.SITE_URL ?? "https://vyuhalabs.github.io/vyuha-site");
  const site = { origin: siteUrl.origin, base: siteUrl.pathname.replace(/\/$/, "") };
  const { checked, broken } = await checkLinks(distDir, site);
  for (const b of broken) console.error(`${b.page}: ${b.url} (${b.reason})`);
  console.log(`${checked} internal link(s) checked, ${broken.length} broken, base "${site.base}"`);
  process.exit(broken.length > 0 ? 1 : 0);
}
