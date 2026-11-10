import assert from "node:assert/strict";
import { test } from "node:test";
import { sectionize } from "../src/lib/sections.mjs";

test("wraps each h2 and what follows it in a labelled section", () => {
  const { html, sections } = sectionize(
    '<p>intro</p><h2 id="work">Work</h2><p>a</p><h3 id="x">X</h3><h2 id="agents">Agents &amp; you</h2><p>b</p>',
  );
  assert.equal(
    html,
    '<p>intro</p><section class="doc-section" id="work" aria-labelledby="work-title"><h2 id="work-title">Work</h2>' +
      '<p>a</p><h3 id="x">X</h3></section>\n<section class="doc-section" id="agents" aria-labelledby="agents-title">' +
      '<h2 id="agents-title">Agents &amp; you</h2><p>b</p></section>',
  );
  assert.deepEqual(sections, [
    { id: "work", text: "Work" },
    { id: "agents", text: "Agents & you" },
  ]);
});

test("leaves a page without h2 as it is", () => {
  assert.deepEqual(sectionize("<p>only</p>"), { html: "<p>only</p>", sections: [] });
});
