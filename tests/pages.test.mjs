// Checks over the built content pages (run after `astro build`): the model's
// sections, the guide's steps and access note, the FAQ, navigation with the
// current page marked, headings, the sitemap, and the copy rules of "Brand
// and voice" on every page.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";

const dist = new URL("../dist/", import.meta.url).pathname;
const built = existsSync(join(dist, "index.html"));
const siteUrl = (process.env.SITE_URL ?? "https://vyuhalabs.github.io/vyuha-site").replace(/\/$/, "");
const base = new URL(siteUrl).pathname.replace(/\/$/, "");
const read = (/** @type {string} */ f) => readFileSync(join(dist, f), "utf8");
const accessUrl = "https://github.com/vyuhalabs/vyuha-site/issues/new?template=access-request.md";

/** Visible text and accessible labels, without markup, styles or head. */
function words(/** @type {string} */ page) {
  const body = page.includes("<body") ? page.slice(page.indexOf("<body")) : page;
  const labels = [...body.matchAll(/aria-label="([^"]*)"/g)].map((m) => m[1]);
  const text = body
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&amp;/g, "&");
  return `${text} ${labels.join(" ")}`.replace(/\s+/g, " ");
}

const pages = [
  { file: "index.html", path: "/", nav: null },
  { file: "model/index.html", path: "/model/", nav: "Model" },
  { file: "guide/index.html", path: "/guide/", nav: "Guide" },
  { file: "faq/index.html", path: "/faq/", nav: "FAQ" },
];

describe("content pages", { skip: built ? false : "no dist/; run `pnpm build` first" }, () => {
  for (const p of pages) {
    describe(p.file, () => {
      const html = read(p.file);
      const header = html.slice(html.indexOf('<header class="site-header'), html.indexOf("</header>"));

      test("header reaches home, model, guide and FAQ", () => {
        for (const path of ["/", "/model/", "/guide/", "/faq/"]) {
          assert.match(header, new RegExp(`href="${base}${path}"`), path);
        }
      });

      test("the current page, and only it, is marked in the header", () => {
        const current = header.match(/<a [^>]*aria-current="page"[^>]*>/g) ?? [];
        assert.equal(current.length, 1);
        assert.match(current[0] ?? "", new RegExp(`href="${base}${p.path}"`));
      });

      test("headings start at h1 and never skip a level", () => {
        const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
        assert.equal(levels[0], 1);
        for (let i = 1; i < levels.length; i++) {
          assert.ok((levels[i] ?? 0) <= (levels[i - 1] ?? 0) + 1, `h${levels[i - 1]} then h${levels[i]}`);
        }
      });

      test("its own title, description, canonical and Open Graph image", () => {
        assert.match(html, new RegExp(`<link rel="canonical" href="${siteUrl}${p.path}"`));
        assert.match(html, new RegExp(`<meta property="og:url" content="${siteUrl}${p.path}"`));
      });

      test("listed in sitemap.xml", () => {
        assert.match(read("sitemap.xml"), new RegExp(`<loc>${siteUrl}${p.path}</loc>`));
      });

      test("copy follows Brand and voice", () => {
        const text = words(html);
        assert.doesNotMatch(text, /!/, "no exclamation marks");
        assert.doesNotMatch(
          text,
          /\b(revolutionary|10x|magic|magical|supercharge|seamless|cutting-edge|game-changing)\b/i,
        );
        assert.doesNotMatch(text, /\bthe (AI|bot)\b/i, 'say "agents", not "the AI" or "the bot"');
        assert.doesNotMatch(text, /Vyuha|VYUHA/, '"vyuha" is lowercase');
        assert.doesNotMatch(text, /\bwe\b/i, 'never "we" for the product');
      });

      test("no client-side JavaScript", () => {
        assert.doesNotMatch(html, /<script/);
      });
    });
  }

  test("titles and descriptions differ between pages", () => {
    const titles = pages.map((p) => read(p.file).match(/<title>([^<]+)<\/title>/)?.[1]);
    const descriptions = pages.map((p) => read(p.file).match(/<meta name="description" content="([^"]+)"/)?.[1]);
    assert.equal(new Set(titles).size, pages.length);
    assert.equal(new Set(descriptions).size, pages.length);
  });

  test("model: seven sections, each with an anchor and a heading", () => {
    const html = read("model/index.html");
    for (const id of ["work", "agents", "decisions", "evidence", "playbooks", "pods", "budgets"]) {
      assert.match(html, new RegExp(`<section class="doc-section" id="${id}" aria-labelledby="${id}-title">`), id);
      assert.match(html, new RegExp(`<h2 id="${id}-title">`), id);
    }
  });

  test("guide: four steps, access by request, link to the template", () => {
    const html = read("guide/index.html");
    const text = words(html);
    for (const step of ["Connect a repository", "Create a project", "File a first issue", "Read a run's evidence"]) {
      assert.match(text, new RegExp(step.replace("'", "['’]")), step);
    }
    assert.match(text, /Access to vyuha is by request/);
    assert.ok(html.includes(`href="${accessUrl}"`));
  });

  test("FAQ: 6 to 10 questions, covering what the brief asks", () => {
    const html = read("faq/index.html");
    const questions = [...html.matchAll(/<section class="doc-section qa"[^>]*>\s*<h2[^>]*>([^<]+)<\/h2>/g)].map(
      (m) => m[1] ?? "",
    );
    assert.ok(questions.length >= 6 && questions.length <= 10, `${questions.length} questions`);
    for (const topic of [/What is vyuha/, /Who is it for/, /harnesses/, /spend/, /access/]) {
      assert.ok(
        questions.some((q) => topic.test(q)),
        String(topic),
      );
    }
  });
});
