/** Facts about the site that pages and components share. */
export const site = {
  name: "vyuha",
  description:
    "vyuha runs a company of agents on work you already track as teams, projects and issues. Every run leaves evidence that a person or a reviewer agent checks.",
  repository: "https://github.com/vyuhalabs/vyuha-site",
  accessRequestUrl: "https://github.com/vyuhalabs/vyuha-site/issues/new?template=access-request.md",
  /** The getting-started guide, a path inside the site (pass it to `href`). */
  guidePath: "/guide/",
  locale: "en",
} as const;

/** A path inside the site, prefixed with the configured base. */
export function href(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}
