import type { APIRoute, GetStaticPaths } from "astro";
import { ogImages } from "../../lib/og-images";
import { renderOgImage } from "../../lib/og-render";

export const getStaticPaths = (() =>
  Object.entries(ogImages).map(([key, image]) => ({ params: { key }, props: image }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props, site }) => {
  const { title, description } = props as (typeof ogImages)[keyof typeof ogImages];
  const address = new URL(import.meta.env.BASE_URL, site).href.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const png = await renderOgImage({ title, description, address });
  return new Response(png as BodyInit, { headers: { "Content-Type": "image/png" } });
};
