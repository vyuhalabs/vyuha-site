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
 * @returns {{ html: string, intro: string, sections: { id: string, text: string, body: string }[] }}
 *   `html` is the whole page, sectioned; `intro` is what comes before the
 *   first `h2`; each section's `body` is its inner HTML (the h2 and what
 *   follows), for pages that place something of their own inside a section.
 */
export function sectionize(html) {
  const h2 = /<h2 id="([^"]+)"([^>]*)>([\s\S]*?)<\/h2>/g;
  const matches = [...html.matchAll(h2)];
  const intro = html.slice(0, matches[0]?.index ?? html.length);
  const sections = matches.map((m, i) => {
    const [whole, id = "", rest = "", inner = ""] = m;
    const start = (m.index ?? 0) + whole.length;
    const end = matches[i + 1]?.index ?? html.length;
    return { id, text: decode(inner), body: `<h2 id="${id}-title"${rest}>${inner}</h2>${html.slice(start, end)}` };
  });
  const wrapped = sections.map(
    (s) => `<section class="doc-section" id="${s.id}" aria-labelledby="${s.id}-title">${s.body}</section>`,
  );
  return { html: intro + wrapped.join("\n"), intro, sections };
}
