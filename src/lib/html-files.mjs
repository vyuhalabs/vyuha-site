import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

/**
 * Every `.html` file under `dir`, as paths relative to it with `/` separators.
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
export async function listHtmlFiles(dir) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".html"))
    .map((e) => relative(dir, join(e.parentPath, e.name)).split(sep).join("/"))
    .sort();
}
