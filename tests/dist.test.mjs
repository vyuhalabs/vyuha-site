// Checks over the built site (run after `astro build`): the layout, font and
// SEO rules every page must keep. Skipped when there is no build.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";
import { listHtmlFiles } from "../src/lib/html-files.mjs";

const dist = new URL("../dist/", import.meta.url).pathname;
const built = existsSync(join(dist, "index.html"));
const siteUrl = (process.env.SITE_URL ?? "https://vyuhalabs.github.io/vyuha-site").replace(/\/$/, "");
const pages = built ? await listHtmlFiles(dist) : [];
const read = (/** @type {string} */ f) => readFileSync(join(dist, f), "utf8");
/** @param {string} html @param {RegExp} re */
const count = (html, re) => (html.match(re) ?? []).length;

describe("built site", { skip: built ? false : "no dist/; run `pnpm build` first" }, () => {
  for (const page of pages) {
    describe(page, () => {
      const html = read(page);
      test("one h1", () => assert.equal(count(html, /<h1[\s>]/g), 1));
      test("landmarks: one header, nav, main and footer", () => {
        assert.equal(count(html, /<main[\s>]/g), 1);
        assert.equal(count(html, /<header[\s>]/g), 1);
        assert.equal(count(html, /<footer[\s>]/g), 1);
        assert.ok(count(html, /<nav[\s>]/g) >= 1);
      });
      test("skip link is the first focusable element and targets main", () => {
        const body = html.slice(html.indexOf("<body"));
        assert.match(body, /^<body[^>]*><a class="skip-link" href="#main">/);
        assert.match(html, /<main id="main"/);
      });
      test("html has a language", () => assert.match(html, /<html lang="en"/));
      test("title, description and canonical", () => {
        assert.equal(count(html, /<title>[^<]+<\/title>/g), 1);
        assert.match(html, /<meta name="description" content="[^"]+"/);
        assert.match(html, new RegExp(`<link rel="canonical" href="${siteUrl}/`));
      });
      test("Open Graph and Twitter card", () => {
        for (const p of ["og:title", "og:description", "og:url", "og:image", "og:type"]) {
          assert.match(html, new RegExp(`<meta property="${p}" content="[^"]+"`), p);
        }
        for (const n of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
          assert.match(html, new RegExp(`<meta name="${n}" content="[^"]+"`), n);
        }
      });
      test("fonts: only the body text weight preloaded, every face swaps", () => {
        const preloads = html.match(/<link rel="preload"[^>]*as="font"[^>]*>/g) ?? [];
        assert.equal(preloads.length, 1);
        assert.match(preloads[0] ?? "", /source-sans-3-latin-400-normal\.[^"]+\.woff2/);
        const faces = html.match(/@font-face\{[^}]+\}/g) ?? [];
        assert.ok(faces.length >= 2);
        for (const f of faces) assert.match(f, /font-display:swap/);
        assert.ok(faces.some((f) => f.includes('"JetBrains Mono"')));
      });
      test("no third-party scripts", () => {
        assert.doesNotMatch(html, /<script[^>]+src="(https?:)?\/\//);
      });
    });
  }

  test("og image, sitemap and robots exist", () => {
    const png = readFileSync(join(dist, "og/default.png"));
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
    assert.match(read("sitemap.xml"), new RegExp(`<loc>${siteUrl}/</loc>`));
    assert.match(read("robots.txt"), new RegExp(`Sitemap: ${siteUrl}/sitemap.xml`));
  });

  test("fonts are self-hosted and subset (Latin, under 40 kB each)", async () => {
    const { readdirSync, statSync } = await import("node:fs");
    const fonts = readdirSync(join(dist, "_astro")).filter((f) => f.endsWith(".woff2"));
    assert.ok(fonts.length >= 2);
    for (const f of fonts) {
      assert.match(f, /-latin-/);
      assert.ok(statSync(join(dist, "_astro", f)).size < 40_000, f);
    }
  });
});
