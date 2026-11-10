import assert from "node:assert/strict";
import { test } from "node:test";
import { pageUrl, sitemapXml } from "../src/lib/sitemap-integration.mjs";

const site = "https://vyuhalabs.github.io/vyuha-site/";

test("maps built files to their public address under the base", () => {
  assert.equal(pageUrl("index.html", site), "https://vyuhalabs.github.io/vyuha-site/");
  assert.equal(pageUrl("guide/index.html", site), "https://vyuhalabs.github.io/vyuha-site/guide/");
  assert.equal(pageUrl("about.html", site), "https://vyuhalabs.github.io/vyuha-site/about");
});

test("leaves error pages out", () => {
  assert.equal(pageUrl("404.html", site), null);
  assert.equal(pageUrl("500.html", site), null);
});

test("writes a sitemaps.org urlset", () => {
  const xml = sitemapXml(["https://vyuhalabs.github.io/vyuha-site/"]);
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
  assert.match(xml, /<loc>https:\/\/vyuhalabs.github.io\/vyuha-site\/<\/loc>/);
});
