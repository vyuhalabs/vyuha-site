// Content collections: `docs` (the model page and the getting-started guide)
// and `faq` (one file per question). Files live in src/content/<collection>/.

import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** A long page in Markdown. Each `##` heading becomes a section with an anchor. */
const docs = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/docs" }),
  schema: z.object({
    /** The page's h1 and, with the site name, its <title>. */
    title: z.string().min(1).max(60),
    /** For search results and link previews: one or two sentences. */
    description: z.string().min(50).max(200),
    /** The short mono label above the h1. */
    eyebrow: z.string().min(1),
    /** The paragraph under the h1. */
    lede: z.string().min(1),
    /** Number the `##` sections 01, 02, … */
    numbered: z.boolean().default(false),
    /** Key of the page's Open Graph image in src/lib/og-images.ts. */
    ogImage: z.enum(["default", "model", "guide", "faq"]).default("default"),
    /** Optional overview cards shown above the body, each pointing at a section. */
    glance: z
      .array(z.object({ section: z.string().regex(/^[a-z0-9-]+$/), term: z.string(), summary: z.string() }))
      .optional(),
  }),
});

/** One question of the FAQ; the Markdown body is the answer. */
const faq = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/faq" }),
  schema: z.object({
    question: z.string().min(1).endsWith("?"),
    /** Position on the page, from 1. */
    order: z.number().int().positive(),
  }),
});

export const collections = { docs, faq };
