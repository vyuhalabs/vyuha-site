import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Satori reads WOFF (not WOFF2); the same Fontsource files the site serves.
const fontFile = (pkg: string, file: string) =>
  readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

let fonts: Promise<Parameters<typeof satori>[1]["fonts"]> | undefined;
function loadFonts() {
  fonts ??= Promise.all([
    fontFile("source-sans-3", "source-sans-3-latin-400-normal.woff"),
    fontFile("source-sans-3", "source-sans-3-latin-700-normal.woff"),
    fontFile("jetbrains-mono", "jetbrains-mono-latin-400-normal.woff"),
  ]).then(([sans400, sans700, mono400]) => [
    { name: "Source Sans 3", data: sans400, weight: 400, style: "normal" },
    { name: "Source Sans 3", data: sans700, weight: 700, style: "normal" },
    { name: "JetBrains Mono", data: mono400, weight: 400, style: "normal" },
  ]);
  return fonts;
}

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

/** A 1200×630 PNG in the dark theme: wordmark, title, description, address. */
export async function renderOgImage(opts: {
  title: string;
  description: string;
  address: string;
}): Promise<Uint8Array> {
  const tree = el(
    "div",
    {
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px 80px",
      background: "#1c1917",
      color: "#f5f5f4",
      fontFamily: "Source Sans 3",
      borderTop: "12px solid #f59e0b",
    },
    [
      el("div", { fontSize: 40, fontWeight: 700, color: "#f59e0b", letterSpacing: "-0.01em" }, "vyuha"),
      el("div", { display: "flex", flexDirection: "column", gap: 24, width: 1000 }, [
        el("div", { fontSize: 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em" }, opts.title),
        el("div", { fontSize: 30, lineHeight: 1.35, color: "#b5aea9" }, opts.description),
      ]),
      el("div", { fontFamily: "JetBrains Mono", fontSize: 24, color: "#b5aea9" }, opts.address),
    ],
  );
  // biome-ignore lint/suspicious/noExplicitAny: satori takes a React-like element; this is its plain-object form.
  const svg = await satori(tree as any, { width: OG_WIDTH, height: OG_HEIGHT, fonts: await loadFonts() });
  return new Resvg(svg, { fitTo: { mode: "width", value: OG_WIDTH } }).render().asPng();
}
