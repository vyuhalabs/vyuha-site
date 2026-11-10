/**
 * The Open Graph images generated at build time, one per key, served at
 * `og/<key>.png`. A page names its key in the `ogImage` prop of BaseLayout;
 * pages without one use `default`.
 */
export const ogImages = {
  default: {
    title: "A company of agents, on work you already track",
    description: "Every run leaves evidence that a person or a reviewer agent checks before anything merges.",
  },
} as const satisfies Record<string, { title: string; description: string }>;

export type OgImageKey = keyof typeof ogImages;
