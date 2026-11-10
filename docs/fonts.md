# Fonts

| Family         | Use                  | Faces served              | Licence                   |
| -------------- | -------------------- | ------------------------- | ------------------------- |
| Source Sans 3  | Text                 | 400, 400 italic, 600, 700 | SIL Open Font License 1.1 |
| JetBrains Mono | Code and identifiers | 400                       | SIL Open Font License 1.1 |

- Self-hosted: the WOFF2 files come from the `@fontsource/source-sans-3` and `@fontsource/jetbrains-mono` packages and are emitted into `dist/_astro/` with hashed names. No font is loaded from another origin.
- Subset: only the Latin subset of each face is served (Basic Latin, Latin-1 and common punctuation, about 15 to 21 kB per face), declared with `unicode-range`.
- `font-display: swap` on every face, so text shows at once in the fallback font.
- Only the body text face (Source Sans 3 400, normal) is preloaded. The others load when a page first uses them.
- The faces are declared in `src/components/Fonts.astro`. The Open Graph image renderer reads the WOFF versions of the same files at build time.

To add a weight, import its `latin-<weight>-normal.woff2?url` file in `Fonts.astro` and add it to `faces`. Do not preload it.
