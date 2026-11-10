import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { checkLinks, extractUrls, resolveInternal } from "../scripts/check-links.mjs";

const site = { origin: "https://vyuhalabs.github.io", base: "/vyuha-site" };

test("extracts href, src, srcset and absolute meta content", () => {
  const html = `<a href="/a/">x</a><img src='b.png' srcset="c.png 1x, d.png 2x">
    <meta property="og:image" content="https://vyuhalabs.github.io/vyuha-site/og.png">
    <meta name="description" content="plain text">`;
  assert.deepEqual(extractUrls(html), [
    "/a/",
    "b.png",
    "c.png",
    "d.png",
    "https://vyuhalabs.github.io/vyuha-site/og.png",
  ]);
});

test("ignores external links, fragments and non-http schemes", () => {
  for (const url of [
    "https://github.com/x",
    "mailto:a@example.org",
    "data:image/png;base64,AA",
    "#main",
    "//cdn.example/x",
  ]) {
    assert.equal(resolveInternal(url, "index.html", site), null, url);
  }
});

test("resolves root-relative, relative and absolute same-site links against the base", () => {
  assert.deepEqual(resolveInternal("/vyuha-site/guide/", "index.html", site), { path: "/guide/" });
  assert.deepEqual(resolveInternal("../favicon.svg", "guide/index.html", site), { path: "/favicon.svg" });
  assert.deepEqual(resolveInternal("https://vyuhalabs.github.io/vyuha-site/", "index.html", site), { path: "/" });
});

test("flags a root-relative link that misses the base", () => {
  assert.deepEqual(resolveInternal("/guide/", "index.html", site), { outsideBase: "/guide/" });
});

test("reports links that are missing from the build and passes the ones that exist", async () => {
  const dist = mkdtempSync(join(tmpdir(), "links-"));
  mkdirSync(join(dist, "guide"));
  writeFileSync(join(dist, "favicon.svg"), "<svg/>");
  writeFileSync(join(dist, "guide", "index.html"), `<a href="/vyuha-site/">home</a>`);
  writeFileSync(
    join(dist, "index.html"),
    `<link rel="icon" href="/vyuha-site/favicon.svg"><a href="guide/">ok</a><a href="/vyuha-site/faq/">missing</a><a href="/guide/">no base</a>`,
  );
  const { checked, broken } = await checkLinks(dist, site);
  assert.equal(checked, 5);
  assert.deepEqual(
    broken.map((b) => `${b.page} ${b.url} ${b.reason}`),
    ["index.html /vyuha-site/faq/ not found in build", "index.html /guide/ outside base /vyuha-site"],
  );
});

test("a #fragment link must point at an id on its target page", async () => {
  const dir = mkdtempSync(join(tmpdir(), "links-frag-"));
  mkdirSync(join(dir, "model"));
  writeFileSync(join(dir, "model", "index.html"), '<section id="work"></section>');
  writeFileSync(
    join(dir, "index.html"),
    '<main id="main"></main><a href="#main">ok</a><a href="#nope">bad</a>' +
      '<a href="/vyuha-site/model/#work">ok</a><a href="model/#agents">bad</a><a href="https://x.org/#y">external</a>',
  );
  const { broken } = await checkLinks(dir, site);
  assert.deepEqual(
    broken.map((b) => b.url),
    ["#nope", "model/#agents"],
  );
});
