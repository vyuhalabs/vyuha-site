import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { contrastRatio, MIN_RATIO, markdownTable, pairs, parseTokens, TOKENS_FILE } from "../scripts/contrast.mjs";

const css = readFileSync(TOKENS_FILE, "utf8");

test("contrast ratio matches the WCAG reference values", () => {
  assert.equal(contrastRatio("#000000", "#ffffff"), 21);
  assert.equal(contrastRatio("#777777", "#777777"), 1);
  assert.equal(contrastRatio("#767676", "#ffffff").toFixed(2), "4.54");
});

test("the accent is deep saffron in both themes", () => {
  const { light, dark } = parseTokens(css);
  assert.equal(light.accent, "#b45309");
  assert.equal(dark.accent, "#f59e0b");
});

test("every text/background token pair is at least 4.5:1 in both themes", () => {
  const rows = pairs(parseTokens(css));
  assert.ok(rows.length >= 20, "expected light and dark pairs");
  const failing = rows.filter((r) => r.ratio < MIN_RATIO);
  assert.deepEqual(
    failing.map((r) => `${r.theme} ${r.text} on ${r.background}: ${r.ratio.toFixed(2)}`),
    [],
  );
});

test("docs/contrast.md is the table for the current tokens", () => {
  const recorded = readFileSync(new URL("../docs/contrast.md", import.meta.url), "utf8");
  assert.equal(recorded, markdownTable(pairs(parseTokens(css))), "run `pnpm contrast` and commit docs/contrast.md");
});
