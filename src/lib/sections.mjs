// Sections for a docs page. The Markdown renderer gives each `##` an id; this
// turns each `h2` and the content after it, up to the next `h2`, into one
// `<section id="…" aria-labelledby="…">`, so every part of a page is its own
// section with an anchor. The heading's id moves to `<id>-title`.

/**
 * @param {string} text
 */
function decode(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

/**
 * @param {string} html rendered Markdown
 * @returns {{ html: string, sections: { id: string, text: string }[] }}
 */
export function sectionize(html) {
  const h2 = /<h2 id="([^"]+)"([^>]*)>([\s\S]*?)<\/h2>/g;
  /** @type {{ id: string, text: string }[]} */
  const sections = [];
  /** @type {string[]} */
  const out = [];
  let last = 0;
  for (const m of html.matchAll(h2)) {
    const [whole, id = "", rest = "", inner = ""] = m;
    const start = m.index ?? 0;
    out.push(html.slice(last, start));
    if (sections.length > 0) out.push("</section>\n");
    out.push(
      `<section class="doc-section" id="${id}" aria-labelledby="${id}-title">`,
      `<h2 id="${id}-title"${rest}>${inner}</h2>`,
    );
    sections.push({ id, text: decode(inner) });
    last = start + whole.length;
  }
  out.push(html.slice(last));
  if (sections.length > 0) out.push("</section>");
  return { html: out.join(""), sections };
}
