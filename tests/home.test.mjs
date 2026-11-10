// Checks over the built home page (run after `astro build`): calls to action,
// illustrations, no client-side script, and the copy rules of "Brand and voice".
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";

const dist = new URL("../dist/", import.meta.url).pathname;
const file = join(dist, "index.html");
const built = existsSync(file);
const html = built ? readFileSync(file, "utf8") : "";
const base = new URL(process.env.SITE_URL ?? "https://vyuhalabs.github.io/vyuha-site").pathname.replace(/\/$/, "");

/** Visible text and accessible labels, without markup, styles or head. */
function words(/** @type {string} */ page) {
  const body = page.includes("<body") ? page.slice(page.indexOf("<body")) : page;
  const labels = [...body.matchAll(/aria-label="([^"]*)"/g)].map((m) => m[1]);
  const text = body
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
  return `${text} ${labels.join(" ")}`.replace(/\s+/g, " ");
}

describe("home page", { skip: built ? false : "no dist/; run `pnpm build` first" }, () => {
  test("primary call to action is the getting-started guide", () => {
    const primary = html.match(/<a class="button button--primary" href="([^"]+)"/g) ?? [];
    assert.ok(primary.length >= 1);
    for (const a of primary) assert.ok(a.includes(`href="${base}/guide/"`), a);
  });

  test("secondary call to action opens the access-request issue template", () => {
    assert.match(
      html,
      /<a class="button" href="https:\/\/github\.com\/vyuhalabs\/vyuha-site\/issues\/new\?template=access-request\.md"/,
    );
  });

  test("four labelled HTML/CSS illustrations, no raster images", () => {
    const frames = html.match(/<div class="frame[^"]*"[^>]*role="img"[^>]*aria-label="[^"]{40,}"/g) ?? [];
    assert.equal(frames.length, 4);
    for (const topic of ["a project", "a run", "decision matrix", "Inbox"]) {
      assert.ok(frames.some((f) => f.includes(topic)), topic);
    }
    assert.doesNotMatch(html, /<img\s/);
  });

  test("no client-side JavaScript", () => {
    assert.doesNotMatch(html, /<script/);
  });

  test("copy follows Brand and voice", () => {
    const text = words(html);
    assert.doesNotMatch(text, /!/, "no exclamation marks");
    assert.doesNotMatch(text, /\b(revolutionary|10x|magic|magical|supercharge|seamless|cutting-edge|game-changing)\b/i);
    assert.doesNotMatch(text, /\bthe (AI|bot)\b/i, 'say "agents", not "the AI" or "the bot"');
    assert.doesNotMatch(text, /Vyuha|VYUHA/, '"vyuha" is lowercase');
    assert.doesNotMatch(text, /\bwe\b/i, 'never "we" for the product');
  });

  test("states what vyuha is and who it is for, in the hero", () => {
    const hero = words(html.slice(html.indexOf('<section class="hero'), html.indexOf('<section class="takeaway')));
    assert.match(hero, /vyuha is the platform on which a small team runs a company of agents/);
    assert.match(hero, /For small product teams, engineering leads and services firms/);
  });
});
