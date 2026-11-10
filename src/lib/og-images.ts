/**
 * The Open Graph images generated at build time, one per key, served at
 * `og/<key>.png`. A page names its key in the `ogImage` prop of BaseLayout;
 * pages without one use `default`. The docs collection's `ogImage` field lists
 * the same keys (src/content.config.ts).
 */
export const ogImages = {
  default: {
    title: "A company of agents, on work you already track",
    description: "Every run leaves evidence that a person or a reviewer agent checks before anything merges.",
  },
  model: {
    title: "The model, in plain words",
    description: "Work, agents, decisions, evidence, playbooks, pods and budgets.",
  },
  guide: {
    title: "Getting started with vyuha",
    description: "Connect a repository, create a project, file a first issue and read a run's evidence.",
  },
  faq: {
    title: "Questions about vyuha",
    description: "What it is, who it is for, which harnesses it runs, how spend is controlled and how to get access.",
  },
} as const satisfies Record<string, { title: string; description: string }>;

export type OgImageKey = keyof typeof ogImages;
